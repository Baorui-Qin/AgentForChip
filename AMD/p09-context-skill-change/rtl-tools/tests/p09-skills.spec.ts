import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it } from 'vitest'
import { loadP09Skills, retrieveP09Skills, type P09Settings } from '../src/phase1/p09-proposal.ts'
import { skillHash, type SkillEntry } from '../src/phase1/p09-context.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import type { DiagnosticReceipt } from '../src/phase1/repair-diagnostics.ts'

const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }) })
async function setup() {
  const root = await mkdtemp(join(tmpdir(), 'p09-skills-')); roots.push(root)
  await writeFile(join(root, 'evidence.json'), 'explicit mock evidence')
  const entry: SkillEntry = { id: 'test.functional', version: '1', status: 'validated', trigger_tags: ['functional_mismatch'],
    scope: 'Mock stateful task', rule: 'Check the specification.', limitations: 'No inferred root cause.', source_cases: ['mock'],
    validation_records: [{ path: 'evidence.json', sha256: sha256('explicit mock evidence') }], content_hash: '' }
  entry.content_hash = skillHash(entry)
  const config: P09Settings = { variant: 'C', limits: { window: 131072, output: 8192, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 },
    tokenizer: { python: 'unused', root, manifestSha256: 'a'.repeat(64), timeoutMs: 1000 }, skillsFile: join(root, 'skills.json'), skillsSha256: null, maxRequests: 15 }
  const publish = async (entries: unknown) => {
    const bytes = JSON.stringify(entries); await writeFile(config.skillsFile!, bytes); config.skillsSha256 = sha256(bytes)
  }
  await publish([entry])
  return { root, entry, config, publish }
}
function feedback(): DiagnosticReceipt {
  return { schema_version: '1.4', evidence_kind: 'live_verification', eda_rerun: false, model_repair_executed: false,
    original_run: 'mock', result_sha256: 'a'.repeat(64), parser_version: 'mock', parser_sha256: 'b'.repeat(64), inputs: [], old_diagnostics: {},
    stages: ['compile', 'simulation'].map(stage => ({ stage, status: stage === 'compile' ? 'PASS' : 'FAIL', complete: true,
      process_clean: true, process_normal: true, functional_failure: stage === 'simulation',
      verdict: { records: 1, checks: 20, mismatches: 1, fatal: false, completed: true },
      diagnostics: [{ kind: stage === 'compile' ? 'syntax' : 'functional_mismatch', category: 'test', message_id: null,
        severity: 'ERROR', origin: 'unknown', attribution: 'UNKNOWN', repairable_by_model: false, file: null, line: null, message: 'Mock', invocation: stage }],
    })) }
}
it('loads evidence-backed entries and retrieves only the current blocking diagnostic', async () => {
  const s = await setup(), syntax = { ...s.entry, id: 'test.syntax', trigger_tags: ['syntax'], content_hash: '' }
  syntax.content_hash = skillHash(syntax); await s.publish([syntax, s.entry])
  expect(await loadP09Skills(s.config)).toHaveLength(2)
  expect(await retrieveP09Skills(s.config, feedback())).toMatchObject({ enabled: true, skills: [{ id: s.entry.id }] })
})
it.each(['A', 'B'] as const)('never opens a skill bundle in group %s', async variant => {
  const s = await setup(); s.config.variant = variant; s.config.skillsFile = join(s.root, 'absent.json')
  expect(await loadP09Skills(s.config)).toEqual([])
  expect(await retrieveP09Skills(s.config, feedback())).toEqual({ enabled: false, skills: [] })
})
it('does not use historical feedback or read skills for an unverified candidate', async () => {
  const s = await setup(); s.config.skillsFile = join(s.root, 'absent.json')
  expect(await retrieveP09Skills(s.config, null)).toEqual({ enabled: true, skills: [] })
})
it.each(['missing-bundle', 'missing-evidence', 'changed-evidence', 'bad-json', 'bad-schema', 'duplicate-id', 'content-hash', 'empty-evidence'] as const)('classifies %s as a skill evidence failure', async kind => {
  const s = await setup()
  if (kind === 'missing-bundle') s.config.skillsFile = join(s.root, 'absent.json')
  if (kind === 'missing-evidence') await rm(join(s.root, 'evidence.json'))
  if (kind === 'changed-evidence') await writeFile(join(s.root, 'evidence.json'), 'changed')
  if (kind === 'bad-json') { await writeFile(s.config.skillsFile!, '{'); s.config.skillsSha256 = sha256('{') }
  if (kind === 'bad-schema') await s.publish([{ ...s.entry, trigger_tags: null }])
  if (kind === 'duplicate-id') await s.publish([s.entry, s.entry])
  if (kind === 'content-hash') await s.publish([{ ...s.entry, rule: 'changed' }])
  if (kind === 'empty-evidence') { s.entry.validation_records = []; s.entry.content_hash = skillHash(s.entry); await s.publish([s.entry]) }
  await expect(loadP09Skills(s.config)).rejects.toThrow('SKILL_EVIDENCE_INVALID')
})
it('keeps unvalidated rules draft and never retrieves them', async () => {
  const s = await setup(); s.entry.status = 'draft'; s.entry.validation_records = []; s.entry.content_hash = skillHash(s.entry); await s.publish([s.entry])
  expect((await loadP09Skills(s.config))[0]?.status).toBe('draft')
  expect(await retrieveP09Skills(s.config, feedback())).toEqual({ enabled: true, skills: [] })
  expect(await readFile(s.config.skillsFile!, 'utf8')).toContain('"draft"')
})
