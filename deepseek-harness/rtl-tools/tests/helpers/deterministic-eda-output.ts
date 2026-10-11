/** Raw test EDA output at the existing instance-local subprocess boundary; classification remains production code. */
import { PassThrough } from 'node:stream'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import type { SubprocessHandle, SubprocessOutcome, SubprocessSpawnSpec } from '@deepseek-ai/dsh-subprocess'

/** One explicit B-group output producer; logical handles have no OS PID or containment claim. */
export class DeterministicEdaOutput {
  private readonly handles: SubprocessHandle[] = []
  private closed = false
  private closing: Promise<void> | undefined
  constructor(private readonly prefix: readonly string[], private readonly verdict?: string) {}

  /** Produce original fixture text and report files asynchronously; cancellation joins started file I/O. */
  spawn(spec: SubprocessSpawnSpec): SubprocessHandle {
    if (this.closed || !this.prefix.every((arg, index) => spec.argv[index] === arg)) throw new Error('Unexpected output fixture request')
    spec.signal?.throwIfAborted()
    if (spec.stdio.stdin !== 'ignore' || spec.stdio.stdout !== 'pipe' || spec.stdio.stderr !== 'pipe') throw new Error('Output fixture requires ignored stdin and piped output')
    const stdout = new PassThrough(), stderr = new PassThrough(), result = Promise.withResolvers<SubprocessOutcome>()
    let cancelled = false
    const terminate = () => { cancelled = true }
    spec.signal?.addEventListener('abort', terminate, { once: true })
    const handle: SubprocessHandle = { stdin: undefined, stdout, stderr, collected: {}, done: result.promise, terminate,
      async waitForExit(signal) {
        if (signal?.aborted) return false
        const wait = Promise.withResolvers<boolean>(), aborted = () => wait.resolve(false)
        signal?.addEventListener('abort', aborted, { once: true })
        void result.promise.then(() => wait.resolve(true), () => wait.resolve(true))
        try { return await wait.promise } finally { signal?.removeEventListener('abort', aborted) }
      } }
    this.handles.push(handle)
    queueMicrotask(() => {
      void (async () => {
        try {
          const output = cancelled ? { stdout: '', stderr: '', exitCode: 0 } : await this.output(spec)
          stdout.end(cancelled ? undefined : output.stdout); stderr.end(cancelled ? undefined : output.stderr)
          result.resolve(cancelled ? { exitCode: null, signal: 'SIGTERM' } : { exitCode: output.exitCode, signal: null })
        } catch (error) { stdout.end(); stderr.end(); result.reject(error) }
        finally { spec.signal?.removeEventListener('abort', terminate) }
      })()
    })
    return handle
  }

  private async output(spec: SubprocessSpawnSpec): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const args = spec.argv.slice(this.prefix.length)
    if (args.length === 1 && args[0] === '-version') return { stdout: 'Vivado Simulator v2026.1\n', stderr: '', exitCode: 0 }
    const stage = args.includes('-mode') ? basename(args.at(-1)!).startsWith('synthesis') ? 'synthesis' : 'report'
      : args.some(arg => /\.(sv|v)$/.test(arg)) ? 'compile' : args.includes('-s') ? 'elaborate' : args.includes('-tclbatch') ? 'simulation' : undefined
    if (!stage) throw new Error('Unsupported output fixture argv')
    let build = spec.cwd
    while (basename(build) !== 'build') { const parent = dirname(build); if (parent === build) throw new Error('Missing owned build root'); build = parent }
    const root = dirname(build), snapshot = join(root, (await readdir(root)).find(name => name.startsWith('snapshot-'))!)
    const manifest = JSON.parse(await readFile(join(snapshot, 'manifest.json'), 'utf8')) as { fixture: string }
    if (stage === 'compile' && manifest.fixture === 'syntax' || stage === 'elaborate' && manifest.fixture === 'missing-module' || stage === 'synthesis' && manifest.fixture === 'synthesis-only') {
      return { stdout: '', stderr: `ERROR: [VRFC 10-123] injected development error [${join(snapshot, 'rtl/solution.sv')}:2]\n`, exitCode: 1 }
    }
    if (stage === 'simulation') return { stdout: (this.verdict ?? `PHASE1_COMPLETE checks=20 mismatches=${manifest.fixture === 'functional' ? 19 : 0}`) + '\n', stderr: '', exitCode: 0 }
    if (stage === 'synthesis') {
      await writeFile(join(spec.cwd, 'netlist.v'), 'module counter; endmodule\n')
      await writeFile(join(spec.cwd, 'design.dcp'), 'mock checkpoint')
    }
    if (stage === 'report') {
      await writeFile(join(spec.cwd, 'utilization.rpt'), '| Site Type | Used | Available |\n| CLB LUTs* | 2 | 100 |\n| CLB Registers | 6 | 100 |\n| Register as Flip Flop | 4 | 100 |\n| Register as Latch | 2 | 100 |\n| Block RAM Tile | 0.5 | 100 |\n| DSPs | 0 | 100 |\n')
      await writeFile(join(spec.cwd, 'timing.rpt'), 'Design Timing Summary\n WNS(ns) TNS(ns)\n ------- -------\n 4.405 0.000\n')
      await writeFile(join(spec.cwd, 'clocks.count'), '1'); await writeFile(join(spec.cwd, 'paths.count'), '1')
    }
    return { stdout: '', stderr: '', exitCode: 0 }
  }

  /** Close only this instance's logical handles; TestOperationScope retains the enclosing hook deadline. */
  close(): Promise<void> {
    if (this.closing) return this.closing
    this.closed = true
    this.closing = (async () => {
      for (const handle of this.handles) handle.terminate()
      await Promise.allSettled(this.handles.map(handle => handle.done))
      for (const handle of this.handles) { handle.stdout?.destroy(); handle.stderr?.destroy() }
    })()
    return this.closing
  }
}
