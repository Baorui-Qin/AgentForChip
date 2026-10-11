import { it, expect } from 'vitest'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { bundle, bundleFile, repositoryRoot } from './knowledge-helpers.ts'
import { loadKnowledge, knowledgeBundleHash, type KnowledgeManifest } from '../src/knowledge/knowledge-loader.ts'
import { knowledgeHash } from '../src/knowledge/knowledge-schema.ts'

it.each(['valid', 'schema', 'duplicate_id', 'duplicate_version', 'content_hash', 'bundle_hash', 'evidence_hash', 'missing_evidence', 'traversal', 'count'])('loader handles %s explicitly', async fault => {
  const directory = await mkdtemp(join(tmpdir(), 'knowledge-test-'))
  try {
    const entries = [structuredClone((await bundle()).entries[0]!)]
    if (fault.startsWith('duplicate')) entries.push({ ...structuredClone(entries[0]!), version: fault === 'duplicate_id' ? '0.2.0' : entries[0]!.version })
    if (fault === 'schema') entries[0]!.limitations = []
    if (fault === 'evidence_hash') entries[0]!.source.references[0]!.sha256 = '0'.repeat(64)
    if (fault === 'missing_evidence') entries[0]!.source.references[0]!.path = 'does-not-exist.log'
    if (fault === 'traversal') entries[0]!.source.references[0]!.path = '../outside'
    for (const [index, entry] of entries.entries()) {
      entry.content_hash = knowledgeHash(entry)
      if (fault === 'content_hash') entry.title += ' changed'
      await writeFile(join(directory, index + '.json'), JSON.stringify(entry))
    }
    const manifest: KnowledgeManifest = { knowledge_bundle_version: 'diagnostic-v1', entry_count: entries.length,
      entries: entries.map((e, i) => ({ path: i + '.json', content_hash: e.content_hash })), bundle_sha256: '' }
    if (fault === 'count') manifest.entry_count++
    manifest.bundle_sha256 = knowledgeBundleHash(manifest)
    const expected = manifest.bundle_sha256
    if (fault === 'bundle_hash') manifest.bundle_sha256 = '0'.repeat(64)
    const file = join(directory, 'bundle.json'); await writeFile(file, JSON.stringify(manifest))
    if (fault === 'valid') expect((await loadKnowledge(file, repositoryRoot, expected)).entries).toEqual(entries)
    else await expect(loadKnowledge(file, repositoryRoot, expected)).rejects.toThrow('INVALID_KNOWLEDGE_ENTRY')
  } finally { await rm(directory, { recursive: true, force: true }) }
})
it('rejects an unpinned bundle and preserves bundle hash across listing order', async () => {
  const value = await bundle()
  await expect(loadKnowledge(bundleFile, repositoryRoot, '0'.repeat(64))).rejects.toThrow('INVALID_KNOWLEDGE_ENTRY')
  expect(knowledgeBundleHash({ ...value.manifest, entries: [...value.manifest.entries].reverse() })).toBe(value.manifest.bundle_sha256)
})
