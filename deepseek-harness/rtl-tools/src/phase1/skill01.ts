/** Optional temporal procedure; facts, model summaries and Host success remain separate. @module rtl-tools/phase1/skill01 */
import { sha256 } from './snapshots.ts'
import { decideRepair } from './repair-policy.ts'
import type { ContextInput, SkillEntry } from './p09-context.ts'

/** Independent old-format asset with a cap inside the existing Skill and total context limits. */
export interface Skill01Options { entry: SkillEntry; bundleHash: string; maxTokens: number }
/** Request-side evidence only; injection does not establish execution. */
export interface Skill01Audit {
  id: string; version: string; bundle_hash: string; content_hash: string; asset_status: SkillEntry['status']
  eligible: boolean; selected: boolean; injected: boolean; reason: string; temporal_evidence: string | null
  specification_sha256: string; revision_id: string | null; source_sha256: string | null
  diagnostics_sha256: string | null; verification_key: string | null; token_count: number
}

/** Require explicit public timing plus current physical DUT evidence and unchanged Host repair permission. @param input - authorized current context. @param options - pinned independent asset. @returns applicability and provenance without inferred causes. */
export function assessSkill01(input: ContextInput, options: Skill01Options): Skill01Audit {
  const { entry, bundleHash, maxTokens } = options, { content_hash: _hash, ...body } = entry
  if (entry.id !== 'sequential_spec_edge_state_check' || entry.content_hash !== sha256(JSON.stringify(body)) ||
    entry.version !== '0.5.0' || entry.status !== 'draft' || entry.validation_records.length !== 0 ||
    !/^[a-f0-9]{64}$/.test(bundleHash) || !Number.isSafeInteger(maxTokens) || maxTokens < 1 || maxTokens > 512) throw new Error('SKILL_EVIDENCE_INVALID')
  const audit: Skill01Audit = { id: entry.id, version: entry.version, bundle_hash: bundleHash, content_hash: entry.content_hash,
    asset_status: entry.status, eligible: false, selected: false, injected: false, reason: 'NOT_APPLICABLE', temporal_evidence: null,
    specification_sha256: sha256(input.task.spec), revision_id: input.current?.revision_id ?? null, source_sha256: input.current?.source_sha256 ?? null,
    diagnostics_sha256: input.feedback ? sha256(JSON.stringify(input.feedback)) : null, verification_key: input.binding?.verification_key ?? null, token_count: 0 }
  const reject = (reason: string) => ({ ...audit, reason })
  if (!input.tool_mode || input.purpose !== 'repair' || input.pending_verification || !input.current || !input.binding || !input.feedback) return reject('NO_CURRENT_VERIFIED_FAILURE')
  if (input.current.revision_id !== input.binding.revision_id || input.current.source_sha256 !== input.binding.source_sha256 ||
    sha256(input.current.source) !== input.current.source_sha256 || !/^(?:sha256:)?[a-f0-9]{64}$/.test(input.binding.verification_key)) return reject('STALE_BINDING')
  const physical = input.feedback.inputs.filter(item => /(?:^|\/)rtl\/solution\.sv$/.test(item.path.replaceAll('\\', '/')))
  if (physical.length !== 1 || physical[0]!.issue !== null || physical[0]!.sha256 !== input.current.source_sha256) return reject('STALE_OR_UNCONFIRMED_DUT')
  const decision = decideRepair(input.feedback, { calibrated: true, bound: true, attempts: 0, top: input.task.interface.top })
  if (decision.action !== 'propose_repair' || decision.rule !== 'FUNCTIONAL_MISMATCH') return reject('NOT_REPAIRABLE_FUNCTIONAL_MISMATCH')
  const stage = input.feedback.stages.find(s => s.status !== 'PASS')!
  if (!stage.process_clean || !stage.verdict.completed || !(stage.verdict.mismatches! > 0) ||
    !stage.diagnostics.some(d => d.kind === 'functional_mismatch')) return reject('INSUFFICIENT_FUNCTIONAL_EVIDENCE')
  // A public event/update rule qualifies; task names and current RTL keywords never qualify.
  const temporal = input.task.spec.match(/\b(?:posedge|negedge)\s+[A-Za-z_]\w*|\b(?:positive|negative|rising|falling)\s+(?:edge\s+of\s+(?:the\s+)?clock|clock\s+edge)|\bboth\s+(?:rising\s+and\s+falling|edges?\s+of\s+(?:the\s+)?clock)/i)
  if (!temporal) return reject('NO_EXPLICIT_PUBLIC_TEMPORAL_RULE')
  return { ...audit, eligible: true, selected: true, reason: 'ELIGIBLE', temporal_evidence: temporal[0] }
}

/** Render whole guidance with indispensable source and diagnostic binding. @param options - checked asset. @param audit - current applicability. @returns model-visible optional data. */
export function skill01Section(options: Skill01Options, audit: Skill01Audit) {
  return { id: audit.id, version: audit.version, content_hash: audit.content_hash,
    binding: { specification_sha256: audit.specification_sha256, revision_id: audit.revision_id, source_sha256: audit.source_sha256,
      diagnostics_sha256: audit.diagnostics_sha256, verification_key: audit.verification_key },
    procedure: options.entry.rule, limitations: options.entry.limitations }
}

/** Check an observable compact summary, never its causal truth or private reasoning. @param source - accepted edit source. @param input - source/spec binding before the edit. @returns parsed evidence or a reason for missing procedure evidence. */
export function observedSkill01Summary(source: string, input: ContextInput): { observed: boolean; reason: string; summary: unknown } {
  const match = source.match(/^\s*\/\/\s*SKILL01_SUMMARY:\s*(\{[^\r\n]*\})\s*$/m)
  if (!match) return { observed: false, reason: 'NO_SUMMARY', summary: null }
  let value: unknown
  try { value = JSON.parse(match[1]!) } catch { return { observed: false, reason: 'INVALID_SUMMARY_JSON', summary: null } }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { observed: false, reason: 'INVALID_SUMMARY', summary: null }
  const record = value as Record<string, unknown>
  const fields = ['spec_quote', 'rtl_quote', 'hypothesis', 'action', 'limitations']
  if (fields.some(k => typeof record[k] !== 'string' || !(record[k] as string).trim()) ||
    !input.task.spec.includes(record.spec_quote as string) || !input.current?.source.includes(record.rtl_quote as string) ||
    !record.rules || typeof record.rules !== 'object' || Array.isArray(record.rules)) return { observed: false, reason: 'UNSUPPORTED_SUMMARY_EVIDENCE', summary: null }
  const rules = record.rules as Record<string, unknown>
  if (['initial', 'reset', 'edge', 'enable', 'state', 'output'].some(k => !['SPECIFIED', 'UNSPECIFIED', 'AMBIGUOUS', 'NOT_OBSERVED'].includes(String(rules[k])))) return { observed: false, reason: 'INCOMPLETE_RULE_SUMMARY', summary: null }
  return { observed: true, reason: 'QUOTED_SUMMARY_OBSERVED_NOT_CAUSAL_PROOF', summary: value }
}

/** Audit exact scalar rules separately from the unchanged historical observation reader. No source is rewritten. @param source - accepted model-submitted source. @param input - bound pre-edit public context. @returns strict public summary evidence without causal or verification claims. */
export function strictSkill01Summary(source: string, input: ContextInput): { strict: boolean; reason: string; summary: unknown } {
  const observed = observedSkill01Summary(source, input)
  if (!observed.observed) return { strict: false, reason: observed.reason, summary: observed.summary }
  const rules = (observed.summary as { rules: Record<string, unknown> }).rules
  if (['initial', 'reset', 'edge', 'enable', 'state', 'output'].some(key => typeof rules[key] !== 'string' ||
    !['SPECIFIED', 'UNSPECIFIED', 'AMBIGUOUS', 'NOT_OBSERVED'].includes(rules[key] as string))) {
    return { strict: false, reason: 'NON_SCALAR_RULE_SUMMARY', summary: observed.summary }
  }
  return { strict: true, reason: 'STRICT_BOUND_SUMMARY_OBSERVED_NOT_CAUSAL_PROOF', summary: observed.summary }
}
