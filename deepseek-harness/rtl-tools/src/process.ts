/** Bounded stream capture and managed process ownership shared by local EDA tools. @module rtl-tools/process */
import { open } from 'node:fs/promises'
import { join } from 'node:path'
import { StringDecoder } from 'node:string_decoder'
import type { Readable } from 'node:stream'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { LineScanner } from './diagnostics.ts'

/** Deployment limits for one managed command. */
export interface ProcessConfig {
  timeoutMs: number
  graceMs: number
  maxLogBytes: number
  maxLineChars: number
  stopOnLogLimit?: boolean
}

/** Stream observer sees all lines, even after the retained log reaches its cap. */
export interface LineObserver {
  accept(raw: string, truncated?: boolean): void
}

/** Host-owned deadline provenance; ordinary caller cancellation remains independent. */
export class DeadlineExceeded extends Error {
  /** @param source - the host budget whose existing timer expired. */
  constructor(readonly source: 'command' | 'stage' | 'total') {
    super(`${source} wall-clock budget exceeded`)
    this.name = 'DeadlineExceeded'
  }
}

/** Independent termination facts and bounded artifact references. */
export interface CommandResult {
  exitCode: number | null
  signal: string | null
  timedOut: boolean
  aborted: boolean
  durationMs: number
  stdoutLog: string
  stderrLog: string
  logTruncated: boolean
  outputTail: string
}

async function capture(stream: Readable, path: string, observer: LineObserver, config: ProcessConfig, overflow: () => void) {
  const log = await open(path, 'wx', 0o600)
  const scanner = new LineScanner(observer, config.maxLineChars)
  const decoder = new StringDecoder('utf8')
  let bytes = 0
  let truncated = false
  let tail = ''
  try {
    for await (const chunk of stream) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string)
      const retained = buffer.subarray(0, Math.max(0, config.maxLogBytes - bytes))
      if (retained.length) await log.writeFile(retained)
      bytes += retained.length
      truncated ||= retained.length < buffer.length
      if (retained.length < buffer.length && config.stopOnLogLimit) overflow()
      const decoded = decoder.write(buffer)
      scanner.push(decoded)
      tail = (tail + decoded).slice(-config.maxLineChars)
    }
    const final = decoder.end()
    scanner.push(final)
    scanner.flush()
    tail = (tail + final).slice(-config.maxLineChars)
    return { truncated, tail }
  } finally {
    await log.close()
  }
}

/**
 * Run exact, already-confined argv and join the entire managed process range before returning.
 * @param subprocess - same-host managed process provider.
 * @param config - resolved stream and timeout limits.
 * @param argv - confined executable and arguments.
 * @param cwd - unique artifact directory.
 * @param label - trusted filename prefix for logs.
 * @param signal - caller/lifecycle cancellation or a typed enclosing deadline.
 * @param observer - bounded diagnostic collector.
 * @returns termination facts and capped log references; provider and I/O failures throw.
 */
export async function runCommand(
  subprocess: SubprocessRuntime, config: ProcessConfig, argv: readonly string[], cwd: string,
  label: string, signal: AbortSignal, observer: LineObserver,
): Promise<CommandResult> {
  signal.throwIfAborted()
  const started = performance.now()
  const deadline = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; deadline.abort(new DeadlineExceeded('command')) }, config.timeoutMs)
  const stdoutLog = join(cwd, `${label}.stdout.log`)
  const stderrLog = join(cwd, `${label}.stderr.log`)
  try {
    const handle = subprocess.spawn({
      argv, cwd, graceMs: config.graceMs,
      signal: AbortSignal.any([signal, deadline.signal]),
      stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' },
      env: { NO_COLOR: '1', TERM: 'dumb' },
    })
    // Pipe dispositions guarantee both streams.
    const stdout = capture(handle.stdout!, stdoutLog, observer, config, () => deadline.abort())
    const stderr = capture(handle.stderr!, stderrLog, observer, config, () => deadline.abort())
    const unprovenRange = new Error('Managed process range did not prove settlement')
    const outcome = handle.done.then(async value => {
      handle.terminate()
      if (await handle.waitForExit() !== true) throw unprovenRange
      return value
    })
    const pending = [outcome, stdout, stderr] as const
    let failed = false
    let failure: unknown
    try {
      const [exit, out, err] = await Promise.all(pending)
      return {
        ...exit, timedOut: timedOut || (signal.aborted && signal.reason instanceof DeadlineExceeded), aborted: signal.aborted,
        durationMs: Math.round(performance.now() - started), stdoutLog, stderrLog,
        logTruncated: out.truncated || err.truncated,
        outputTail: (out.tail + '\n' + err.tail).trim().slice(-config.maxLineChars),
      }
    } catch (error) {
      failed = true; failure = error
      throw error
    } finally {
      const cleanupErrors: unknown[] = []
      try { handle.terminate() } catch (error) { cleanupErrors.push(error) }
      try { if (await handle.waitForExit() !== true) throw unprovenRange } catch (error) { cleanupErrors.push(error) }
      await Promise.allSettled(pending)
      if (cleanupErrors.length) {
        const errors = [...new Set(failed ? [failure, ...cleanupErrors] : cleanupErrors)]
        if (errors.length === 1) throw errors[0]
        const primary = failed ? failure : cleanupErrors[0]
        throw new AggregateError(errors, primary instanceof Error ? primary.message : 'Managed command cleanup failed', { cause: primary })
      }
    }
  } finally {
    clearTimeout(timer)
  }
}
