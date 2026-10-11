import { it, expect } from 'vitest'
import { bundle } from './knowledge-helpers.ts'
import { parseKnowledgeEntry, knowledgeHash, canonicalJson } from '../src/knowledge/knowledge-schema.ts'

it('validates all published entries and canonical content identities', async () => {
  for (const entry of (await bundle()).entries) {
    expect(parseKnowledgeEntry(entry)).toEqual(entry)
    expect(knowledgeHash(entry)).toBe(entry.content_hash)
  }
})
it.each(['missing', 'extra', 'id', 'version', 'status', 'tool', 'tool_version', 'unknown', 'feature', 'limitations', 'validation', 'empty_trigger', 'message_id'])('rejects invalid %s', async fault => {
  const entry = structuredClone((await bundle()).entries[0]!) as unknown as Record<string, unknown>
  if (fault === 'missing') delete entry.title
  if (fault === 'extra') entry.proven_root_cause = 'reset'
  if (fault === 'id') entry.id = '../unsafe'
  if (fault === 'version') entry.version = 'latest'
  if (fault === 'status') entry.status = 'approved'
  if (fault === 'tool') entry.tool = 'xsim'
  if (fault === 'tool_version') entry.tool_version = '2025.2'
  if (fault === 'limitations') entry.limitations = []
  if (fault === 'validation') entry.validation = { schema_valid: true, evidence_validated: false, trigger_validated: true, retrieval_validated: true }
  const trigger = entry.trigger as Record<string, unknown>
  if (fault === 'unknown') trigger.diagnostic_kinds = ['unknown']
  if (fault === 'empty_trigger') trigger.diagnostic_kinds = []
  if (fault === 'feature') trigger.required_features = ['exact_root_cause']
  if (fault === 'message_id') trigger.message_ids = ['*']
  expect(() => parseKnowledgeEntry(entry)).toThrow('INVALID_KNOWLEDGE_ENTRY')
})
it('canonicalizes object keys without changing ordered array content', () => {
  expect(canonicalJson({ z: 1, a: { c: 2, b: 3 } })).toBe(canonicalJson({ a: { b: 3, c: 2 }, z: 1 }))
  expect(canonicalJson([1, 2])).not.toBe(canonicalJson([2, 1]))
})
