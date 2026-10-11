/** Versioned diagnostic assets; hypotheses never establish verification facts. @module rtl-tools/knowledge/knowledge-schema */
import { recordValidator } from '../phase1/record-validation.ts'
import { sha256 } from '../phase1/snapshots.ts'

/** Existing parser taxonomy supported by V1; unknown is deliberately not a trigger. */
export const diagnosticKinds = ['syntax', 'declaration_order', 'name_resolution', 'dependency', 'type_or_port', 'functional_mismatch', 'unsupported_feature', 'multiple_procedural_driver'] as const
/** Explicit features derived solely from parser receipts. */
export const featureNames = ['complete_evidence', 'dut_attributed', 'functional_failure', 'waveform_available', 'first_failure_time', 'mismatch_signal'] as const
/** Machine-readable, reviewable evidence and bounded advice. */
export interface KnowledgeEntry {
  id: string; version: string; status: 'draft' | 'validated'; tool: 'vivado'; tool_version: '2026.1'
  stage: ('compile' | 'elaborate' | 'simulation' | 'synthesis')[]
  trigger: { diagnostic_kinds: string[]; message_ids: string[]; required_features: string[]; optional_features: string[] }
  title: string; symptoms: string[]; possible_causes: string[]; inspection_steps: string[]; repair_guidance: string[]; limitations: string[]
  source: { type: 'verified_project_evidence'; references: { path: string; sha256: string }[] }
  validation: { schema_valid: boolean; evidence_validated: boolean; trigger_validated: boolean; retrieval_validated: boolean }
  content_hash: string
}
const strings = { type: 'array', items: { type: 'string' } } as const
const entryValidator = recordValidator<KnowledgeEntry>({
  id: { type: 'string', pattern: '^[a-z][a-z0-9_]*(?:\\.[a-z][a-z0-9_]*)+$' },
  version: { type: 'string', pattern: '^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)$' },
  status: { type: 'string', enum: ['draft', 'validated'] }, tool: { type: 'string', const: 'vivado' }, tool_version: { type: 'string', const: '2026.1' },
  stage: { type: 'array', items: { type: 'string', enum: ['compile', 'elaborate', 'simulation', 'synthesis'] } },
  trigger: { type: 'object', properties: { diagnostic_kinds: strings, message_ids: strings, required_features: strings, optional_features: strings },
    required: ['diagnostic_kinds', 'message_ids', 'required_features', 'optional_features'], additionalProperties: false },
  title: { type: 'string', pattern: '\\S', maxLength: 160 }, symptoms: strings, possible_causes: strings, inspection_steps: strings, repair_guidance: strings, limitations: strings,
  source: { type: 'object', properties: { type: { type: 'string', const: 'verified_project_evidence' }, references: { type: 'array', items: { type: 'object',
    properties: { path: { type: 'string' }, sha256: { type: 'string' } }, required: ['path', 'sha256'], additionalProperties: false } } }, required: ['type', 'references'], additionalProperties: false },
  validation: { type: 'object', properties: { schema_valid: { type: 'boolean' }, evidence_validated: { type: 'boolean' }, trigger_validated: { type: 'boolean' }, retrieval_validated: { type: 'boolean' } },
    required: ['schema_valid', 'evidence_validated', 'trigger_validated', 'retrieval_validated'], additionalProperties: false },
  content_hash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
})
/** Canonical JSON uses code-unit key sorting; array order remains semantic. @param value - JSON-compatible data. @returns deterministic JSON text. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']'
  if (value !== null && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonicalJson((value as Record<string, unknown>)[key])).join(',') + '}'
  return JSON.stringify(value)
}
/** Exclude only the entry self-digest. @param entry - data asset. @returns SHA-256 of canonical content. */
export function knowledgeHash(entry: KnowledgeEntry): string { const { content_hash: _hash, ...body } = entry; return sha256(canonicalJson(body)) }
/** Reject malformed triggers, unsupported versions and unsubstantiated validated claims. @param value - untrusted file JSON. @returns detached validated data. */
export function parseKnowledgeEntry(value: unknown): KnowledgeEntry {
  try {
    const e = entryValidator.parse(value)
    const nonempty = [e.stage, e.trigger.diagnostic_kinds, e.symptoms, e.possible_causes, e.inspection_steps, e.repair_guidance, e.limitations]
    const arrays = [...nonempty, e.trigger.message_ids, e.trigger.required_features, e.trigger.optional_features]
    if (nonempty.some(a => !a.length) || arrays.some(a => a.length > 24 || a.some(s => !s.trim() || s.length > 1200) || new Set(a).size !== a.length)) throw new Error('Empty, repeated or oversized content')
    if (e.trigger.diagnostic_kinds.some(k => !diagnosticKinds.includes(k as typeof diagnosticKinds[number])) ||
      [...e.trigger.required_features, ...e.trigger.optional_features].some(k => !featureNames.includes(k as typeof featureNames[number])) ||
      e.trigger.message_ids.some(id => !/^[A-Za-z][A-Za-z0-9 ]* \d+-\d+$/.test(id))) throw new Error('Invalid trigger')
    if (e.source.references.some(r => !r.path || !/^[a-f0-9]{64}$/.test(r.sha256))) throw new Error('Invalid reference')
    if (e.status === 'validated' && (!e.source.references.length || !Object.values(e.validation).every(Boolean))) throw new Error('Validation evidence required')
    return e
  } catch (error) { throw new Error('INVALID_KNOWLEDGE_ENTRY: ' + (error as Error).message) }
}
