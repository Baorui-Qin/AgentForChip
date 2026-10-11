/** Test-only, exact-argv version output; all other requests retain their native provider. */
import { PassThrough } from 'node:stream'
import type { SubprocessHandle, SubprocessOutcome, SubprocessSpawnSpec } from '@deepseek-ai/dsh-subprocess'

/** Synthetic version data is independent of the production expected-version setting. */
export interface VersionProbeResponse {
  stdout: string
  stderr: string
  exitCode: number
}

/** Logical fixture observations do not identify OS processes or prove Windows containment. */
export interface VersionProbeCall {
  identity: string
  kind: 'VERSION_FIXTURE' | 'NATIVE_FAKE_VERIFICATION'
  spec: SubprocessSpawnSpec
  outcome?: SubprocessOutcome
  error?: string
  settled: boolean
}

/**
 * Own one explicitly selected test's version handles, without caching probes or modifying native specs.
 * Only the caller's exact fake-version argv and pipe/ignore dispositions are synthetic.
 */
export class ManagedVersionProbeFixture {
  readonly calls: VersionProbeCall[] = []
  private readonly handles: SubprocessHandle[] = []
  private closed = false
  private closing: Promise<void> | undefined

  constructor(private readonly native: (spec: SubprocessSpawnSpec) => SubprocessHandle,
    private readonly versionArgv: readonly string[], private readonly response: VersionProbeResponse) {}

  /**
   * Return a buffered asynchronous version handle or delegate the original request object.
   * @param spec - existing mapped request, including its unchanged cancellation and stream settings.
   * @returns a logical version handle or the original native handle.
   * @throws on pre-cancellation, closed ownership, or unsupported version stream dispositions.
   */
  spawn(spec: SubprocessSpawnSpec): SubprocessHandle {
    if (this.closed) throw new Error('Version fixture is closed')
    const matches = spec.argv.length === this.versionArgv.length && spec.argv.every((arg, i) => arg === this.versionArgv[i])
    const call: VersionProbeCall = { identity: `fixture-call-${this.calls.length + 1}`, kind: matches ? 'VERSION_FIXTURE' : 'NATIVE_FAKE_VERIFICATION', spec, settled: false }
    this.calls.push(call)
    let handle: SubprocessHandle
    try {
      if (!matches) handle = this.native(spec)
      else {
        spec.signal?.throwIfAborted()
        if (spec.stdio.stdin !== 'ignore' || spec.stdio.stdout !== 'pipe' || spec.stdio.stderr !== 'pipe') throw new Error('Version fixture requires ignored stdin and piped output')
        handle = this.versionHandle(spec)
        this.handles.push(handle)
      }
    } catch (error) { call.settled = true; call.error = String(error); throw error }
    void handle.done.then(outcome => { call.outcome = outcome; call.settled = true }, (error: unknown) => { call.error = String(error); call.settled = true })
    return handle
  }

  private versionHandle(spec: SubprocessSpawnSpec): SubprocessHandle {
    const stdout = new PassThrough(), stderr = new PassThrough(), result = Promise.withResolvers<SubprocessOutcome>()
    let settled = false
    const finish = (cancelled: boolean) => {
      if (settled) return
      settled = true
      spec.signal?.removeEventListener('abort', terminate)
      stdout.end(cancelled ? undefined : this.response.stdout)
      stderr.end(cancelled ? undefined : this.response.stderr)
      result.resolve(cancelled ? { exitCode: null, signal: 'SIGTERM' } : { exitCode: this.response.exitCode, signal: null })
    }
    const terminate = () => finish(true)
    spec.signal?.addEventListener('abort', terminate, { once: true })
    queueMicrotask(() => finish(false))
    return { stdin: undefined, stdout, stderr, collected: {}, done: result.promise, terminate,
      async waitForExit(signal) {
        if (settled) return true
        if (signal?.aborted) return false
        const wait = Promise.withResolvers<boolean>()
        const aborted = () => wait.resolve(false)
        signal?.addEventListener('abort', aborted, { once: true })
        void result.promise.then(() => wait.resolve(true))
        try { return await wait.promise } finally { signal?.removeEventListener('abort', aborted) }
      },
    }
  }

  /**
   * Stop accepting requests, settle owned synthetic handles, and release their streams; native ownership remains with its provider.
   * @returns the same awaited release promise on every call.
   */
  close(): Promise<void> {
    if (this.closing !== undefined) return this.closing
    this.closed = true
    this.closing = (async () => {
      for (const handle of this.handles) handle.terminate()
      await Promise.all(this.handles.map(async handle => {
        await handle.done
        await handle.waitForExit()
        handle.stdout?.destroy(); handle.stderr?.destroy()
      }))
      this.handles.length = 0
    })()
    return this.closing
  }
}
