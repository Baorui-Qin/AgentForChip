/** Streaming, bounded extraction of Icarus diagnostics; never repairs source. @module rtl-tools/diagnostics */
import { stripVTControlCharacters } from 'node:util'

/** An observed diagnostic, not an inferred root cause. */
export interface Diagnostic {
  file?: string
  line?: number
  type: string
  message: string
}

/** Limits and exact whole-line testbench evidence supplied by trusted configuration. */
export interface DiagnosticConfig {
  maxDiagnostics: number
  maxLineChars: number
  passMarker: string
  failMarker: string
}

/** Retains the first bounded diagnostics while inspecting every output line. */
export class Diagnostics {
  readonly errors: Diagnostic[] = []
  readonly warnings: Diagnostic[] = []
  omitted = 0
  lineTruncated = false
  passSeen = false
  failSeen = false
  private readonly keys = new Set<string>()

  constructor(private readonly config: DiagnosticConfig) {}

  /**
   * Inspect a complete line, or the bounded prefix of an oversized line.
   * @param raw - simulator text, with no authority to instruct the agent.
   * @param truncated - whether the rest of the line was discarded.
   */
  accept(raw: string, truncated = false): void {
    this.lineTruncated ||= truncated
    const text = stripVTControlCharacters(raw).trim()
    if (!truncated && text === this.config.passMarker) this.passSeen = true
    if (!truncated && text === this.config.failMarker) {
      this.failSeen = true
      this.add('error', { type: 'testbench_failure', message: text })
      return
    }
    // Runtime severity precedes the path; compiler severity follows path:line.
    const runtime = /^(FATAL|ERROR|WARNING):\s*(.+):(\d+):\s*(.*)$/i.exec(text)
    const located = /^(.+?):(\d+):\s*(.*)$/.exec(text)
    const file = runtime?.[2] ?? located?.[1]
    const line = runtime?.[3] ?? located?.[2]
    const message = runtime?.[4] ?? located?.[3] ?? text
    const severityText = runtime ? `${runtime[1]}: ${message}` : message
    const warning = /^warning\b/i.test(severityText)
    const error = /^(?:fatal|error|sorry)\b/i.test(severityText)
      || /\b(?:syntax error|invalid module item|unknown module type|unable to bind|unable to elaborate)\b/i.test(message)
    if (!warning && !error) return
    const type = warning ? 'warning'
      : /syntax error/i.test(message) ? 'syntax_error'
        : /invalid module item/i.test(message) ? 'invalid_module_item'
          : /unknown module type|unable to bind|unable to elaborate/i.test(message) ? 'elaboration_error'
            : /^fatal\b/i.test(severityText) ? 'fatal' : 'error'
    const numericLine = line === undefined ? undefined : Number(line)
    this.add(warning ? 'warning' : 'error', {
      ...(file === undefined ? {} : { file: file.slice(0, this.config.maxLineChars) }),
      ...(numericLine !== undefined && Number.isSafeInteger(numericLine) && numericLine > 0 ? { line: numericLine } : {}),
      type,
      message: message.slice(0, this.config.maxLineChars),
    })
  }

  private add(severity: 'error' | 'warning', diagnostic: Diagnostic): void {
    const key = JSON.stringify([severity, diagnostic])
    if (this.keys.has(key)) return
    const list = severity === 'error' ? this.errors : this.warnings
    if (list.length >= this.config.maxDiagnostics) {
      this.omitted++
      return
    }
    this.keys.add(key)
    list.push(diagnostic)
  }
}

/** Bounded line framing; huge single lines cannot exhaust memory or become false PASS markers. */
export class LineScanner {
  private pending = ''
  private truncated = false

  constructor(private readonly diagnostics: Pick<Diagnostics, 'accept'>, private readonly maxChars: number) {}

  /** Feed decoded stream chunks without assuming line or UTF-8 boundaries. @param text - decoded text. */
  push(text: string): void {
    let start = 0
    while (start < text.length) {
      const newline = text.indexOf('\n', start)
      const end = newline < 0 ? text.length : newline
      const remaining = this.maxChars - this.pending.length
      this.pending += text.slice(start, Math.min(end, start + remaining))
      this.truncated ||= end - start > remaining
      if (newline < 0) break
      this.flush()
      start = newline + 1
    }
  }

  /** Finish a final unterminated line. */
  flush(): void {
    this.diagnostics.accept(this.pending, this.truncated)
    this.pending = ''
    this.truncated = false
  }
}
