/** Fail-closed loading of a frozen diagnostic bundle. @module rtl-tools/knowledge/knowledge-loader */
import { readFile, realpath } from 'node:fs/promises'
import { dirname, basename, resolve } from 'node:path'
import { checkedFile, sha256 } from '../phase1/snapshots.ts'
import { recordValidator } from '../phase1/record-validation.ts'
import { canonicalJson, knowledgeHash, parseKnowledgeEntry, type KnowledgeEntry } from './knowledge-schema.ts'

/** File manifest digest excludes only its own bundle_sha256. */
export interface KnowledgeManifest { knowledge_bundle_version: 'diagnostic-v1' | 'diagnostic-v1.1'; entry_count: number; entries: { path: string; content_hash: string }[]; bundle_sha256: string }
/** Fully checked entries, including drafts for inventory but never runtime matching. */
export interface KnowledgeBundle { manifest: KnowledgeManifest; entries: KnowledgeEntry[] }
const manifestValidator = recordValidator<KnowledgeManifest>({
  knowledge_bundle_version: { type: 'string', enum: ['diagnostic-v1', 'diagnostic-v1.1'] }, entry_count: { type: 'integer', minimum: 1 },
  entries: { type: 'array', items: { type: 'object', properties: { path: { type: 'string' }, content_hash: { type: 'string' } }, required: ['path', 'content_hash'], additionalProperties: false } },
  bundle_sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
})
/** Stable across manifest enumeration order. @param manifest - version and content identities. @returns canonical SHA-256. */
export function knowledgeBundleHash(manifest: KnowledgeManifest): string {
  const { bundle_sha256: _hash, ...body } = manifest
  return sha256(canonicalJson({ ...body, entries: [...body.entries].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0) }))
}
/** Verify schema, duplicates, file containment, self hashes and evidence bytes before exposing entries. @param file - manifest file. @param evidenceRoot - repository root of immutable references. @param expectedHash - caller-pinned bundle digest. @returns checked bundle. */
export async function loadKnowledge(file: string, evidenceRoot: string, expectedHash: string): Promise<KnowledgeBundle> {
  try {
    const root = await realpath(resolve(dirname(file))), evidence = await realpath(evidenceRoot)
    const manifest = manifestValidator.parse(JSON.parse(await readFile(await checkedFile(root, basename(file)), 'utf8')))
    if (manifest.entries.length !== manifest.entry_count || manifest.entry_count > 256 || manifest.bundle_sha256 !== expectedHash || knowledgeBundleHash(manifest) !== expectedHash) throw new Error('Bundle hash or count mismatch')
    const ids = new Set<string>(), versions = new Set<string>(), paths = new Set<string>(), entries: KnowledgeEntry[] = []
    for (const item of manifest.entries) {
      if (paths.has(item.path)) throw new Error('Duplicate entry path'); paths.add(item.path)
      const bytes = await readFile(await checkedFile(root, item.path))
      if (bytes.length > 65536) throw new Error('Entry exceeds byte limit')
      const entry = parseKnowledgeEntry(JSON.parse(bytes.toString('utf8')))
      if (versions.has(entry.id + '@' + entry.version)) throw new Error('Duplicate id/version')
      if (ids.has(entry.id)) throw new Error('Duplicate id')
      ids.add(entry.id); versions.add(entry.id + '@' + entry.version)
      if (knowledgeHash(entry) !== entry.content_hash || entry.content_hash !== item.content_hash) throw new Error('Content hash mismatch')
      for (const ref of entry.source.references) if (sha256(await readFile(await checkedFile(evidence, ref.path))) !== ref.sha256) throw new Error('Evidence hash mismatch')
      entries.push(entry)
    }
    return { manifest, entries: entries.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0) }
  } catch (error) { throw new Error('INVALID_KNOWLEDGE_ENTRY: ' + (error as Error).message) }
}
