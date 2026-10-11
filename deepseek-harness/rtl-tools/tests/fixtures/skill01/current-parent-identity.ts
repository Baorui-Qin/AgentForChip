/** Source identity checks for the rebased, immutable Skill-off comparison fixture. @module rtl-tools/tests/fixtures/skill01/current-parent-identity */
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/** Verify original parent bytes, import-only rebasing and every transitive local runtime dependency. @param moduleUrl - comparison fixture URL. @returns completion after exact identities match. */
export async function assertFrozenParentContext(moduleUrl: string): Promise<void> {
  const repository = resolve(import.meta.dirname, '../../../../..')
  const identity = JSON.parse(await readFile(new URL('./current-parent-identity.json', import.meta.url), 'utf8')) as {
    initial_manifest: string; initial_manifest_sha256: string
    copies: { fixture: string; parent_source: string; original_runtime_path: string; sha256: string; prefix: string; imports: { from: string; to: string }[] }[]
    dependencies: { path: string; sha256: string }[]
  }
  const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')
  const manifest = await readFile(resolve(repository, identity.initial_manifest))
  if (digest(manifest) !== identity.initial_manifest_sha256) throw new Error('FROZEN_PARENT_IDENTITY_DRIFT')
  const frozen = new Map((JSON.parse(manifest.toString('utf8')) as { path: string; sha256: string }[]).map(file => [file.path, file.sha256]))
  for (const dependency of identity.dependencies) {
    if (frozen.get(dependency.path) !== dependency.sha256) throw new Error('FROZEN_PARENT_DEPENDENCY_DRIFT')
    const current = await readFile(resolve(repository, dependency.path))
    if (digest(current) === dependency.sha256) continue
    if (dependency.path !== 'deepseek-harness/packages/llm/llm/src/types.ts') throw new Error('FROZEN_PARENT_DEPENDENCY_DRIFT')
    const revisionBytes = await readFile(new URL('./current-parent-c-type-revision.json', import.meta.url))
    if (digest(revisionBytes) !== '7a13dfbddb9a8402d4d6f6a79534293958bbe79eb254dba09edb904b986c27c0') {
      throw new Error('FROZEN_PARENT_C_TYPE_REVISION_DRIFT')
    }
    const revision = JSON.parse(revisionBytes.toString('utf8')) as {
      dependency: { path: string; original_sha256: string; revised_sha256: string }
      original_source: { path: string; sha256: string }; approved_C: { path: string; sha256: string }
      static_correction: { path: string; sha256: string }
    }
    const original = await readFile(resolve(repository, revision.original_source.path))
    const planBytes = await readFile(resolve(repository, revision.approved_C.path))
    const correctionBytes = await readFile(resolve(repository, revision.static_correction.path))
    if (revision.dependency.path !== dependency.path || revision.dependency.original_sha256 !== dependency.sha256 ||
      revision.original_source.sha256 !== dependency.sha256 || digest(original) !== dependency.sha256 ||
      digest(current) !== revision.dependency.revised_sha256 || digest(planBytes) !== revision.approved_C.sha256 ||
      digest(correctionBytes) !== revision.static_correction.sha256) throw new Error('FROZEN_PARENT_C_TYPE_REVISION_DRIFT')
    const change = (JSON.parse(planBytes.toString('utf8')) as { changes: { path: string; before_sha256: string; after_sha256: string }[] })
      .changes.find(change => change.path === dependency.path)
    const correction = JSON.parse(correctionBytes.toString('utf8')) as {
      status: string; path: string; before_sha256: string; after_sha256: string; semantic_change: boolean; budgets_changed: boolean
    }
    const anchor = "    reason: FinishReason\n    /** Replay metadata for a successful response; see {@link ReplayEnvelope}. */"
    const insertion = "    reason: FinishReason\n" +
      "    /** The adapter observed the provider's protocol terminator and emitted all preceding accounting; " +
      "absent on locally synthesized failures. */\n    providerProtocolComplete?: boolean\n" +
      "    /** Replay metadata for a successful response; see {@link ReplayEnvelope}. */"
    const approved = original.toString('utf8').replace(anchor, insertion)
    const expected = approved.replace('and emitted all preceding accounting;', 'and emitted preceding accounting;')
    if (change?.before_sha256 !== dependency.sha256 || digest(Buffer.from(approved)) !== change.after_sha256 ||
      correction.status !== 'APPLIED' || correction.path !== dependency.path || correction.before_sha256 !== change.after_sha256 ||
      correction.after_sha256 !== revision.dependency.revised_sha256 || correction.semantic_change || correction.budgets_changed ||
      !current.equals(Buffer.from(expected))) throw new Error('FROZEN_PARENT_C_TYPE_REVISION_DRIFT')
  }
  for (const copy of identity.copies) {
    const parent = await readFile(resolve(repository, copy.parent_source))
    if (digest(parent) !== copy.sha256 || frozen.get(copy.original_runtime_path) !== copy.sha256) throw new Error('FROZEN_PARENT_IDENTITY_DRIFT')
    let body = parent.toString('utf8')
    for (const replacement of copy.imports) body = body.replaceAll(replacement.from, replacement.to)
    if (await readFile(new URL('./' + copy.fixture, moduleUrl), 'utf8') !== copy.prefix + body) throw new Error('FROZEN_PARENT_IMPORT_REBASE_DRIFT')
  }
}
