/** Explainable exact-rule retrieval; unrelated and unknown diagnostics have no fallback. @module rtl-tools/knowledge/knowledge-retrieval */
import type { KnowledgeBundle } from './knowledge-loader.ts'
import type { DiagnosticFeatures } from './diagnostic-features.ts'

/** Model-visible guidance retains limitations and labels causes as hypotheses. */
export interface KnowledgeMatch {
  knowledge_id: string; version: string; match_score: number; match_reason: string[]; matched_triggers: string[]
  guidance: { title: string; possible_causes: string[]; inspection_steps: string[]; repair_guidance: string[] }; limitations: string[]
}
/** Full retrieval receipt precedes context-budget pruning. */
export interface KnowledgeRetrieval { matches: KnowledgeMatch[]; eligibleCount: number; bundleHash: string; queryFeatures: DiagnosticFeatures }
/** Exact tool/version/stage/kind and all required features gate candidates. Message IDs and required DUT attribution constrain the same diagnostic. @param bundle - checked assets. @param query - parsed feature projection. @param topK - explicit bounded deployment setting. @returns stable ranked top K and reasons. */
export function retrieveKnowledge(bundle: KnowledgeBundle, query: DiagnosticFeatures, topK: number): KnowledgeRetrieval {
  if (!Number.isSafeInteger(topK) || topK < 1 || topK > 3) throw new Error('INVALID_KNOWLEDGE_TOP_K')
  const candidates = bundle.entries.flatMap(entry => {
    if (entry.status !== 'validated' || entry.tool !== query.tool || entry.tool_version !== query.toolVersion || !entry.stage.includes(query.stage as typeof entry.stage[number]) ||
      entry.trigger.required_features.some(f => !query.features.includes(f))) return []
    const matched = query.diagnostics.filter(d => d.severity === 'ERROR' && d.kind !== 'unknown' && entry.trigger.diagnostic_kinds.includes(d.kind) &&
      (!entry.trigger.required_features.includes('dut_attributed') || d.origin === 'dut') &&
      (!entry.trigger.message_ids.length || d.messageId !== null && entry.trigger.message_ids.includes(d.messageId)))
    if (!matched.length) return []
    const kinds = [...new Set(matched.map(d => d.kind))].sort(), ids = [...new Set(matched.flatMap(d => d.messageId && entry.trigger.message_ids.includes(d.messageId) ? [d.messageId] : []))].sort()
    const optional = entry.trigger.optional_features.filter(f => query.features.includes(f)).sort()
    const triggers = ['stage:' + query.stage, ...kinds.map(k => 'kind:' + k), ...ids.map(id => 'message:' + id), ...[...entry.trigger.required_features].sort().map(f => 'required:' + f), ...optional.map(f => 'optional:' + f)]
    return [{ knowledge_id: entry.id, version: entry.version, match_score: kinds.length * 10000 + ids.length * 100 + entry.trigger.required_features.length * 10 + optional.length,
      match_reason: ['exact tool/version', ...triggers], matched_triggers: triggers,
      guidance: { title: entry.title, possible_causes: [...entry.possible_causes], inspection_steps: [...entry.inspection_steps], repair_guidance: [...entry.repair_guidance] }, limitations: [...entry.limitations] }]
  }).sort((a, b) => b.match_score - a.match_score || (a.knowledge_id < b.knowledge_id ? -1 : a.knowledge_id > b.knowledge_id ? 1 : 0))
  return { matches: candidates.slice(0, topK), eligibleCount: candidates.length, bundleHash: bundle.manifest.bundle_sha256, queryFeatures: structuredClone(query) }
}
