/** Deterministic repair checks; unknown HDL forms still require real EDA. @module rtl-tools/phase1/p10-repair-guards */
import type { DUTInterface } from '../interface.ts'
import { declaredInterface } from '../interface.ts'
import { checkAutoSource } from './p09-auto-policy.ts'
import { exactEdit } from './p10-exact-edit.ts'
import { sha256 } from './snapshots.ts'

/** A concrete refusal, never a replacement answer. */
export interface RepairIssue { code: string; detail: string; [key: string]: unknown }
/** Preserve machine-readable refusal details through the normal tool result. */
export class RepairGuardError extends Error {
  constructor(readonly code: string, readonly details: RepairIssue[]) { super(code) }
}

/** Ignore ordinary comments and whitespace, retaining strings and synthesis controls. @param source - model or current text. @returns token identity, not semantic equivalence. */
export function repairCodeHash(source: string): string {
  const clean = source.replace(/"(?:\\.|[^"\\])*"|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g, token => {
    if (token.startsWith('"') || /\b(?:synthesis|synopsys|pragma|xilinx|translate_off|translate_on|full_case|parallel_case)\b/i.test(token)) return token
    return ' '
  })
  return sha256(JSON.stringify(clean.match(/"(?:\\.|[^"\\])*"|\\[^\s]+|[A-Za-z_$][\w$]*|\d+(?:'[sS]?[bBoOdDhH][0-9a-fA-F_xXzZ?]+)?|===|!==|<<<|>>>|==|!=|<=|>=|&&|\|\||<<|>>|\+\+|--|\S/g) ?? []))
}

/** Inspect literal packed enum declarations only; unsupported expressions are explicitly unknown. @param source - unchanged candidate. @returns bounded coverage facts and definite violations. */
export function enumConstraints(source: string) {
  const clean = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g, token => token.replace(/[^\r\n]/g, ' '))
  const issues: RepairIssue[] = [], declarations = []
  for (const match of clean.matchAll(/\btypedef\s+enum\s+(?:logic|reg|bit)\s*\[\s*(\d+)\s*:\s*(\d+)\s*\]\s*\{([^{}]*)\}\s*([A-Za-z_]\w*)\s*;/g)) {
    const width = Math.abs(Number(match[1]) - Number(match[2])) + 1
    const items = match[3]!.split(',').map(s => s.trim()).filter(Boolean), line = clean.slice(0, match.index).split('\n').length
    const record = { type: match[4]!, width, members: items.length, line, coverage: 'literal_values' }
    declarations.push(record)
    if (width > 1024) { record.coverage = 'unknown_width'; continue }
    const capacity = 2n ** BigInt(width), seen = new Map<string, string>()
    let previous = -1n
    if (BigInt(items.length) > capacity) issues.push({ code: 'ENUM_CAPACITY', detail: 'Enum member count exceeds packed base-type capacity.', ...record })
    for (const item of items) {
      const member = /^([A-Za-z_]\w*)(?:\s*=\s*(.*))?$/.exec(item)
      const literal = member?.[2]?.trim().replaceAll('_', '')
      let value: bigint | null = null
      if (member && literal === undefined) value = previous + 1n
      else if (literal && /^\d+$/.test(literal)) value = BigInt(literal)
      else if (literal) {
        const number = /^(\d+)'([bBoOdDhH])([0-9a-fA-F]+)$/.exec(literal)
        if (number) {
          const radix = number[2]!.toLowerCase(), digits = number[3]!
          if ((radix === 'b' && /^[01]+$/.test(digits)) || (radix === 'o' && /^[0-7]+$/.test(digits)) || (radix === 'd' && /^\d+$/.test(digits)) || radix === 'h') value = BigInt((radix === 'b' ? '0b' : radix === 'o' ? '0o' : radix === 'h' ? '0x' : '') + digits)
          const bits = Number(number[1])
          if (bits > 1024 || value !== null && value >= 2n ** BigInt(bits)) { record.coverage = 'unknown_literal_truncation'; value = null }
        }
      }
      if (!member || value === null) { record.coverage = 'unknown_expression'; break }
      previous = value
      if (value < 0n || value >= capacity) issues.push({ code: 'ENUM_VALUE_WIDTH', detail: 'Enum value does not fit its packed base type.', type: record.type, member: member[1], line })
      const key = value.toString(), prior = seen.get(key)
      if (prior) issues.push({ code: 'ENUM_DUPLICATE', detail: 'Two enum members have the same value.', type: record.type, members: [prior, member[1]], line })
      seen.set(key, member[1]!)
    }
  }
  return { issues, declarations, coverage: declarations.length === [...clean.matchAll(/\btypedef\s+enum\b/g)].length ? 'bounded_literal_forms' : 'partial_unknown_forms' }
}

/** Enforce current-code change, fixed ports and known enum constraints. @param source - model candidate. @param current - bound live source. @param expected - trusted interface. @param rejected - session-local rejected token hashes. @returns checked facts; never writes a DUT. */
export function guardRepair(source: string, current: string, expected: DUTInterface, rejected: ReadonlyMap<string, string> = new Map()) {
  const codeHash = repairCodeHash(source)
  if (codeHash === repairCodeHash(current)) throw new RepairGuardError('REPEATED_CANDIDATE', [{ code: 'NO_CODE_CHANGE', detail: 'Only whitespace/comments changed; no code repair was proposed.' }])
  if (rejected.has(codeHash)) throw new RepairGuardError('REJECTED_CODE_REPLAY', [{ code: 'REJECTED_CODE_REPLAY', detail: 'This token-equivalent candidate was already rejected in this session.', previous_reason: rejected.get(codeHash), code_sha256: codeHash }])
  try { checkAutoSource(source, expected) }
  catch (error) {
    const issues: RepairIssue[] = []
    try {
      const actual = declaredInterface(source, expected.top)
      for (const port of expected.ports) {
        const found = actual.ports.find(p => p.name === port.name)
        if (!found || found.direction !== port.direction || found.width !== port.width || found.signed !== (port.signed ?? false)) issues.push({ code: 'FIXED_PORT', detail: 'Candidate disagrees with the trusted public port.', port: port.name, expected: port, actual: found ?? null })
      }
      for (const found of actual.ports.filter(p => !expected.ports.some(e => e.name === p.name))) issues.push({ code: 'FIXED_PORT', detail: 'Unexpected public port.', port: found.name, expected: null, actual: found })
    } catch { /* The existing parser's refusal remains authoritative for unsupported syntax. */ }
    if (!issues.length) issues.push({ code: 'SOURCE_POLICY', detail: error instanceof Error ? error.message : 'Source rejected.' })
    const category = (error as { category?: string }).category
    throw new RepairGuardError(category ?? (error instanceof Error ? error.message : 'SOURCE_POLICY_REJECTED'), issues)
  }
  const enums = enumConstraints(source)
  if (enums.issues.length) throw new RepairGuardError('ENUM_CONSTRAINT_REJECTED', enums.issues)
  return { code_sha256: codeHash, interface_checked: true, enums }
}

/** Validate a structured plan without applying it to the live DUT. @param text - compact plan JSON. @param source - current bound source. @param expected - trusted interface. @returns ephemeral candidate facts only. */
export function guardPlan(text: string, source: string, expected: DUTInterface) {
  const plan = JSON.parse(text) as { changes: { before: string; after: string }[] }
  const patch = exactEdit(JSON.stringify({ expected_revision_id: 'plan-preview', replacements: plan.changes }), source, 'plan-preview')
  return { ...guardRepair(patch.source, source, expected), replacement_count: patch.spans.length, candidate_sha256: sha256(patch.source) }
}
