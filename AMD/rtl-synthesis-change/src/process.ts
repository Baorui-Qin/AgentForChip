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
}

/** Stream observer sees all lines, even after the retained log reaches its cap. */
export interface LineObserver {
  accept(raw: string, truncated?: boolean): void
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

async function capture(stream: Readable, path: string, observer: LineObserver, config: ProcessConfig) {
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
 * @param signal - caller and plugin-lifecycle cancellation.
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
  const timer = setTimeout(() => { timedOut = true; deadline.abort() }, config.timeoutMs)
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
    const stdout = capture(handle.stdout!, stdoutLog, observer, config)
    const stderr = capture(handle.stderr!, stderrLog, observer, config)
    const outcome = handle.done.then(async value => {
      handle.terminate()
      await handle.waitForExit()
      return value
    })
    const pending = [outcome, stdout, stderr] as const
    try {
      const [exit, out, err] = await Promise.all(pending)
      return {
        ...exit, timedOut, aborted: signal.aborted,
        durationMs: Math.round(performance.now() - started), stdoutLog, stderrLog,
        logTruncated: out.truncated || err.truncated,
        outputTail: (out.tail + '\n' + err.tail).trim().slice(-config.maxLineChars),
      }
    } finally {
      handle.terminate()
      try { await handle.waitForExit() } finally { await Promise.allSettled(pending) }
    }
  } finally {
    clearTimeout(timer)
  }
}
