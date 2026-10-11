/** Independently pinned static and historical guidance; no evidence or execution permission. @module rtl-tools/knowledge/engineering-knowledge */
import { readFile, realpath, stat } from 'node:fs/promises'
import { basename, dirname } from 'node:path'
import { checkedFile, sha256 } from '../phase1/snapshots.ts'
import { parseRecord } from '../phase1/records.ts'
import { recordValidator } from '../phase1/record-validation.ts'
import { canonicalJson } from './knowledge-schema.ts'
import type { ContextInput } from '../phase1/p09-context.ts'

/** Reviewed means source/rule review, never demonstrated model effectiveness. */
export interface EngineeringEntry {
  schema_version: 'engineering-knowledge-1'; id: string; version: string; family: 'static' | 'experience'
  status: 'draft' | 'reviewed'; tool_version: '2026.1'; valid_until: string
  trigger: 'clock_port' | 'complete_functional_mismatch'
  title: string; guidance: string[]; limitations: string[]
  source: { kind: 'official_source_note' | 'historical_tool_control'; references: { path: string; sha256: string }[] }
  content_hash: string
}
/** Separate bundle; no interpretation or mutation of Diagnostic V1/V1.1. */
export interface EngineeringManifest {
  schema_version: 'engineering-knowledge-bundle-1'; entries: { path: string; content_hash: string }[]; bundle_sha256: string
}
/** Checked bytes with explicitly reviewed source identities. */
export interface EngineeringBundle { manifest: EngineeringManifest; entries: EngineeringEntry[] }
/** Bounded model-visible advice including the limitation and origin of each whole entry. */
export interface EngineeringMatch {
  id: string; version: string; family: EngineeringEntry['family']; title: string; guidance: string[]; limitations: string[]
  provenance: EngineeringEntry['source']['kind']; source_hashes: string[]
}
/** Auditable host time and actual task/receipt facts; no free-form trigger tags. */
export interface EngineeringQuery { toolVersion: string; at: string; clockPort: boolean; completeFunctionalMismatch: boolean }
/** Explicit opt-in; existing Skill budget and total envelope still apply. */
export interface EngineeringContextOptions { bundle: EngineeringBundle; toolVersion: string; at: string; topK: number; maxTokens: number }
/** Receipt is engineering retrieval, not a bill, verdict, or efficacy measurement. */
export interface EngineeringUsage {
  enabled: true; bundle_hash: string; query: EngineeringQuery; retrieved_ids: string[]; injected_ids: string[]
  token_count: number; count_quality: string
}
const str = { type: 'string' } as const, strings = { type: 'array', items: str } as const
const digest = { type: 'string', pattern: '^[a-f0-9]{64}$' } as const
const reference = { type: 'object' as const, properties: { path: str, sha256: str }, required: ['path', 'sha256'], additionalProperties: false }
const entryParser = recordValidator<EngineeringEntry>({
  schema_version: { type: 'string', const: 'engineering-knowledge-1' }, id: { type: 'string', pattern: '^engineering\\.[a-z][a-z0-9_]*$' },
  version: { type: 'string', pattern: '^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)$' }, family: { type: 'string', enum: ['static', 'experience'] },
  status: { type: 'string', enum: ['draft', 'reviewed'] }, tool_version: { type: 'string', const: '2026.1' }, valid_until: str,
  trigger: { type: 'string', enum: ['clock_port', 'complete_functional_mismatch'] }, title: { ...str, maxLength: 160 }, guidance: strings, limitations: strings,
  source: { type: 'object', properties: { kind: { type: 'string', enum: ['official_source_note', 'historical_tool_control'] }, references: { type: 'array', items: reference } }, required: ['kind', 'references'], additionalProperties: false },
  content_hash: digest,
})
const manifestParser = recordValidator<EngineeringManifest>({
  schema_version: { type: 'string', const: 'engineering-knowledge-bundle-1' },
  entries: { type: 'array', items: { type: 'object', properties: { path: str, content_hash: str }, required: ['path', 'content_hash'], additionalProperties: false } }, bundle_sha256: digest,
})
const noteParser = recordValidator<{ schema_version: string; kind: string; document_id: string; document_version: string; source_url: string; retrieved_at: string; title: string; summary: string }>({
  schema_version: { type: 'string', const: 'official-source-note-1' }, kind: { type: 'string', const: 'authored_source_note_not_full_webpage' },
  document_id: str, document_version: { type: 'string', const: '2026.1' }, source_url: str, retrieved_at: str,
  title: { ...str, maxLength: 160 }, summary: { ...str, maxLength: 1200 },
})
/** Require a canonical UTC timestamp; malformed calendar dates cannot roll over. @param text - host time or review expiry. @returns epoch milliseconds. */
export function engineeringTime(text: string): number {
  const time = Date.parse(text)
  if (!Number.isFinite(time) || new Date(time).toISOString() !== text) throw new Error('INVALID_ENGINEERING_TIME')
  return time
}
/** Exclude only the entry self digest. @param entry - typed asset. @returns canonical content SHA-256. */
export function engineeringHash(entry: EngineeringEntry): string { const { content_hash: _hash, ...body } = entry; return sha256(canonicalJson(body)) }
/** Canonical manifest; enumeration order cannot change its authority. @param manifest - independent bundle. @returns digest without the self field. */
export function engineeringBundleHash(manifest: EngineeringManifest): string {
  const { bundle_sha256: _hash, ...body } = manifest
  return sha256(canonicalJson({ ...body, entries: [...body.entries].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0) }))
}
/** Strict independent entry with finite content and matching source kind. @param value - untrusted JSON. @returns detached asset. */
export function parseEngineeringEntry(value: unknown): EngineeringEntry {
  const entry = entryParser.parse(value)
  engineeringTime(entry.valid_until)
  if (!entry.title.trim() || [entry.guidance, entry.limitations].some(items => !items.length || items.length > 8 || new Set(items).size !== items.length || items.some(item => !item.trim() || item.length > 1200))) throw new Error('INVALID_ENGINEERING_ENTRY_CONTENT')
  if (entry.source.kind !== (entry.family === 'static' ? 'official_source_note' : 'historical_tool_control') || !entry.source.references.length || entry.source.references.length > 8 || new Set(entry.source.references.map(item => item.path)).size !== entry.source.references.length || entry.source.references.some(item => !item.path || !/^[a-f0-9]{64}$/.test(item.sha256))) throw new Error('INVALID_ENGINEERING_SOURCE')
  if (entry.trigger !== (entry.family === 'static' ? 'clock_port' : 'complete_functional_mismatch')) throw new Error('INVALID_ENGINEERING_TRIGGER')
  if (engineeringHash(entry) !== entry.content_hash) throw new Error('INVALID_ENGINEERING_CONTENT_HASH')
  return entry
}
async function bounded(root: string, name: string, maxBytes: number, signal?: AbortSignal): Promise<Buffer> {
  signal?.throwIfAborted()
  const file = await checkedFile(root, name)
  if ((await stat(file)).size > maxBytes) throw new Error('ENGINEERING_SOURCE_OVER_LIMIT')
  const bytes = await readFile(file, { signal })
  if (bytes.length > maxBytes) throw new Error('ENGINEERING_SOURCE_OVER_LIMIT')
  return bytes
}
/** Check pinned schemas, contained files and reviewed source bytes; no network or authority writes. @param file - independent manifest. @param evidenceRoot - canonical host evidence root. @param expectedHash - frozen caller digest. @param signal - optional caller cancellation, propagated to reads. @returns verified entries. */
export async function loadEngineeringKnowledge(file: string, evidenceRoot: string, expectedHash: string, signal?: AbortSignal): Promise<EngineeringBundle> {
  signal?.throwIfAborted()
  const root = await realpath(dirname(file)), evidence = await realpath(evidenceRoot)
  const manifest = manifestParser.parse(JSON.parse((await bounded(root, basename(file), 65536, signal)).toString('utf8')))
  if (!manifest.entries.length || manifest.entries.length > 64 || manifest.bundle_sha256 !== expectedHash || engineeringBundleHash(manifest) !== expectedHash) throw new Error('INVALID_ENGINEERING_BUNDLE')
  const ids = new Set<string>(), paths = new Set<string>(), entries: EngineeringEntry[] = []
  for (const item of manifest.entries) {
    if (paths.has(item.path)) throw new Error('DUPLICATE_ENGINEERING_PATH'); paths.add(item.path)
    const entry = parseEngineeringEntry(JSON.parse((await bounded(root, item.path, 65536, signal)).toString('utf8')))
    if (ids.has(entry.id)) throw new Error('DUPLICATE_ENGINEERING_ID'); ids.add(entry.id)
    if (entry.content_hash !== item.content_hash) throw new Error('INVALID_ENGINEERING_CONTENT_HASH')
    for (const source of entry.source.references) {
      const bytes = await bounded(evidence, source.path, 4194304, signal)
      if (sha256(bytes) !== source.sha256) throw new Error('ENGINEERING_SOURCE_HASH_CHANGED')
      if (entry.family === 'experience') parseRecord('RunResult', JSON.parse(bytes.toString('utf8')))
      else {
        const note = noteParser.parse(JSON.parse(bytes.toString('utf8'))), url = new URL(note.source_url)
        engineeringTime(note.retrieved_at)
        if (!note.summary.trim() || !note.document_id.trim() || url.protocol !== 'https:' || url.hostname !== 'docs.amd.com' || url.username || url.password || url.port) throw new Error('INVALID_OFFICIAL_ENGINEERING_SOURCE')
      }
    }
    entries.push(entry)
  }
  return { manifest, entries: entries.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0) }
}
/** Derive optional trigger facts without declaring a cause or inferring clock semantics. @param input - current host-bound task/receipt. @param toolVersion - observed tool version. @param at - auditable UTC host time. @returns current facts. */
export function engineeringQuery(input: ContextInput, toolVersion: string, at: string): EngineeringQuery {
  engineeringTime(at)
  const stage = input.feedback?.stages.find(item => item.status !== 'PASS' && item.status !== 'SKIPPED')
  return { toolVersion, at, clockPort: input.task.interface.ports.some(port => port.direction === 'input' && /^(clk|clock)$/i.test(port.name)),
    completeFunctionalMismatch: input.feedback?.evidence_kind === 'live_verification' && stage?.stage === 'simulation' && stage.complete && stage.process_clean && stage.functional_failure && stage.verdict.completed && stage.verdict.mismatches !== null && stage.verdict.mismatches > 0 }
}
/** Revalidate current entry facts; draft, expiry and unrelated queries never receive fallback. @param bundle - checked pinned bundle. @param query - current observed facts. @param topK - host bound, at most two. @returns stable whole-entry advice. */
export function retrieveEngineeringKnowledge(bundle: EngineeringBundle, query: EngineeringQuery, topK: number): EngineeringMatch[] {
  if (!Number.isSafeInteger(topK) || topK < 1 || topK > 2) throw new Error('INVALID_ENGINEERING_TOP_K')
  const now = engineeringTime(query.at)
  if (engineeringBundleHash(bundle.manifest) !== bundle.manifest.bundle_sha256 || bundle.entries.length !== bundle.manifest.entries.length || new Set(bundle.entries.map(entry => entry.id)).size !== bundle.entries.length) throw new Error('INVALID_ENGINEERING_BUNDLE')
  return bundle.entries.map(parseEngineeringEntry).filter(entry => {
    if (!bundle.manifest.entries.some(item => item.content_hash === entry.content_hash)) throw new Error('ENGINEERING_ENTRY_NOT_REGISTERED')
    return entry.status === 'reviewed' && entry.tool_version === query.toolVersion && now < engineeringTime(entry.valid_until) && (entry.trigger === 'clock_port' ? query.clockPort : query.completeFunctionalMismatch)
  }).sort((a, b) => (a.family === 'experience' ? 0 : 1) - (b.family === 'experience' ? 0 : 1) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).slice(0, topK).map(entry => ({
    id: entry.id, version: entry.version, family: entry.family, title: entry.title, guidance: [...entry.guidance], limitations: [...entry.limitations],
    provenance: entry.source.kind, source_hashes: entry.source.references.map(source => source.sha256),
  }))
}
/** Source-backed advice remains optional and never changes trusted assets, budgets or verdict rules. */
export const engineeringProtocol = 'Static and experience knowledge is optional inspection guidance, not current verification evidence or a proven root cause. Historical controls are not fresh live runs. Follow the complete specification and current bound evidence; knowledge never grants tool permissions or changes PASS criteria.'
