/** Bounded Vivado diagnostics and version-scoped report readers. @module rtl-tools/vivado-parser */
import { stripVTControlCharacters } from 'node:util'
import type { Diagnostic } from './diagnostics.ts'

/** Original Vivado severity and message identifier, or a Harness report diagnostic. */
export interface VivadoDiagnostic extends Diagnostic {
  severity: 'ERROR' | 'WARNING' | 'CRITICAL WARNING'
  code?: string
}

/** Resource counts use the report's Used column; BRAM is measured in 36 Kb tiles. */
export interface Resources {
  lut: number | null
  ff: number | null
  bram: number | null
  dsp: number | null
}

/** Post-synthesis estimate, never an implementation timing-closure verdict. */
export interface Timing {
  wns: number | null
  unit: 'ns'
  stage: 'post_synthesis'
  reason: 'no_clocks' | 'no_timing_paths' | 'non_finite_wns' | 'report_unavailable' | 'report_parse_error' | null
}

/** Collects bounded messages but observes error severity across the complete stream. */
export class VivadoDiagnostics {
  readonly errors: VivadoDiagnostic[] = []
  readonly warnings: VivadoDiagnostic[] = []
  omitted = 0
  lineTruncated = false
  errorSeen = false
  environmentFailure = false
  private readonly keys = new Set<string>()

  constructor(private readonly maxDiagnostics: number, private readonly maxLineChars: number) {}

  /** Inspect one bounded line of untrusted EDA output. @param raw - raw line. @param truncated - missing suffix flag. */
  accept(raw: string, truncated = false): void {
    this.lineTruncated ||= truncated
    // Tcl catch output can prefix an already-prefixed Vivado error.
    const text = stripVTControlCharacters(raw).trim().replace(/^(?:ERROR:\s*){2,}/, 'ERROR: ')
    const match = /^(ERROR|CRITICAL WARNING|WARNING):\s*(?:\[([^\]]+)\]\s*)?([\s\S]*)$/.exec(text)
    if (!match) return
    const severity = match[1] as VivadoDiagnostic['severity']
    this.errorSeen ||= severity === 'ERROR'
    // Environment errors are not evidence that the candidate RTL is unsynthesizable.
    this.environmentFailure ||= severity === 'ERROR' && /license|licensing|could not open|permission denied|no space left|failed to allocate|out of memory|part .*not found|specified part could not be found/i.test(match[3]!)
    const located = /\s*\[(.+):(\d+)\]\s*$/.exec(match[3]!)
    const line = located ? Number(located[2]) : null
    const message = (located ? match[3]!.slice(0, located.index) : match[3]!).slice(0, this.maxLineChars)
    this.add({
      severity, ...(match[2] ? { code: match[2] } : {}),
      type: /syntax error/i.test(message) ? 'syntax_error' : severity === 'ERROR' ? 'error' : 'warning',
      message,
      ...(located ? { file: located[1]! } : {}),
      ...(line !== null && Number.isSafeInteger(line) && line > 0 ? { line } : {}),
    })
  }

  /** Retain a bounded diagnostic from a trusted parser. @param diagnostic - observed failure or warning. */
  add(diagnostic: VivadoDiagnostic): void {
    this.errorSeen ||= diagnostic.severity === 'ERROR'
    const bounded = { ...diagnostic, message: diagnostic.message.slice(0, this.maxLineChars) }
    const key = JSON.stringify(bounded)
    if (this.keys.has(key)) return
    const list = bounded.severity === 'ERROR' ? this.errors : this.warnings
    if (list.length >= this.maxDiagnostics) { this.omitted++; return }
    this.keys.add(key)
    list.push(bounded)
  }
}

/**
 * Read the exact utilization rows rather than totals, percentages or INFO messages.
 * @param report - Vivado non-hierarchical report text; historical formats remain regression fixtures.
 * @returns independently nullable metrics; missing or ambiguous rows stay unknown.
 */
export function parseUtilization(report: string): Resources {
  const result: Resources = { lut: null, ff: null, bram: null, dsp: null }
  const names: Record<string, keyof Resources> = {
    'CLB LUTs': 'lut', 'Register as Flip Flop': 'ff', 'Block RAM Tile': 'bram', DSPs: 'dsp',
  }
  let used = -1
  const seen = new Set<keyof Resources>()
  for (const line of report.split(/\r?\n/)) {
    if (/^\s*\+[-+]+\s*$/.test(line)) continue
    if (!line.trimStart().startsWith('|')) { used = -1; continue }
    const columns = line.split('|').slice(1, -1).map(value => value.trim())
    if (columns[0] === 'Site Type') { used = columns.indexOf('Used'); continue }
    if (used < 0) continue
    const key = names[columns[0]?.replace(/\*+$/, '') ?? '']
    if (!key) continue
    const raw = columns[used] ?? ''
    const value = /^\d+(?:\.\d+)?$/.test(raw) ? Number(raw) : NaN
    const valid = Number.isFinite(value) && value <= Number.MAX_SAFE_INTEGER
      && (key === 'bram' ? Number.isInteger(value * 2) : Number.isInteger(value))
    result[key] = !seen.has(key) && valid ? value : null
    seen.add(key)
  }
  return result
}

/**
 * Parse only the Design Timing Summary WNS column, with explicit no-path evidence.
 * @param report - full timing summary text, or null when unavailable.
 * @param clockCount - trusted Tcl count of clocks in the synthesized design, or null.
 * @param pathCount - trusted Tcl existence count (zero or one) of setup timing paths, or null.
 * @returns a post-synthesis estimate with a reason whenever WNS is unknown.
 */
export function parseTiming(report: string | null, clockCount: number | null, pathCount: number | null): Timing {
  const result: Timing = { wns: null, unit: 'ns', stage: 'post_synthesis', reason: 'report_unavailable' }
  if (report === null) return result
  if (!/Design Timing Summary/.test(report)) return { ...result, reason: 'report_parse_error' }
  if (clockCount === 0) return { ...result, reason: 'no_clocks' }
  if (pathCount === 0) return { ...result, reason: 'no_timing_paths' }
  if (clockCount === null || pathCount === null) return { ...result, reason: 'report_parse_error' }
  const section = report.split(/Design Timing Summary/)[1]?.split(/Clock Summary/)[0]
  const rows = section?.split(/\r?\n/) ?? []
  const header = rows.findIndex(line => /WNS\(ns\)/.test(line) && /TNS\(ns\)/.test(line))
  if (header >= 0) {
    const index = rows[header]!.trim().split(/\s+/).indexOf('WNS(ns)')
    const values = rows.slice(header + 1).find(line => /^\s*(?:[+-]?(?:\d|\.\d)|inf\s)/.test(line))?.trim().split(/\s+/)
    const raw = values?.[index] ?? ''
    // Observed Vivado 2025.2 spelling; no invented finite slack or timing-closure claim.
    if (raw === 'inf' && values?.[index + 1] === '0.000') return { ...result, reason: 'non_finite_wns' }
    if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw) && Number.isFinite(Number(raw))) {
      return { ...result, wns: Number(raw), reason: null }
    }
  }
  return { ...result, reason: 'report_parse_error' }
}
