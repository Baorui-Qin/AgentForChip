import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { afterEach, expect, it } from 'vitest'
import { readDiagnostics } from '../src/phase1/repair-diagnostics.ts'
import { decideRepair } from '../src/phase1/repair-policy.ts'
import { revisionScore } from '../src/phase1/p10-revision.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { stageFeatures } from '../src/knowledge/diagnostic-features.ts'
import { retrieveKnowledge } from '../src/knowledge/knowledge-retrieval.ts'
import { bundle } from './knowledge-helpers.ts'
import type { RunRecord } from '../src/phase1/records.ts'

const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) {
  if (dirname(root) !== resolve(tmpdir()) || !basename(root).startsWith('driver-replay-')) throw new Error('Unexpected temporary test root')
  await rm(root, { recursive: true, force: true })
} })
it.each(['dut', 'testbench', 'reference', 'foreign_path', 'missing_compile_sources', 'current_source_mismatch', 'duplicate_manifest_dut', 'foreign_primary_alias'])('replays real elaboration logs with %s compile-source attribution', async variant => {
  const fixture = JSON.parse(await readFile(new URL('./fixtures/vivado2026.1/multiple-procedural-driver/replay.json', import.meta.url), 'utf8')) as {
    source: string; result: RunRecord; files: { path: string; sha256: string; content: string }[]
  }
  const root = await mkdtemp(join(tmpdir(), 'driver-replay-')); roots.push(root)
  const replace = (text: string) => text.replaceAll(fixture.source.replace(/\\/g, '/'), root.replace(/\\/g, '/')).replaceAll(fixture.source, root)
  const result = JSON.parse(replace(JSON.stringify(fixture.result))) as RunRecord
  const originalDut = result.stages.compile!.invocations!.filter(run => run.version_matches !== true).flatMap(run => run.sources).find(source => source.role === 'dut')!
  const dutPath = resolve(replace(originalDut.path)), foreignPath = join(root, 'foreign', 'solution.sv')
  // Source records are absolute and use JSON escapes, so normalize them explicitly.
  for (const stage of Object.values(result.stages)) for (const invocation of stage?.invocations ?? []) for (const source of invocation.sources) {
    source.path = resolve(replace(source.path))
    if (source.role === 'dut' && (variant === 'testbench' || variant === 'reference')) source.role = variant
    if (source.role === 'dut' && ['foreign_path', 'foreign_primary_alias'].includes(variant)) source.path = foreignPath
  }
  if (variant === 'missing_compile_sources') for (const invocation of result.stages.compile!.invocations!) { invocation.sources = []; invocation.systemverilog_mode = null }
  expect(result.stages.elaborate!.invocations!.flatMap(i => i.sources)).toEqual([])
  const elaborateLogs = new Set(result.stages.elaborate!.invocations!.flatMap(run => [run.stdout_log, run.stderr_log]))
  for (const file of fixture.files) {
    expect(sha256(file.content)).toBe(file.sha256)
    const path = join(root, file.path); await mkdir(dirname(path), { recursive: true })
    let content = replace(file.content)
    if (variant === 'foreign_primary_alias' && elaborateLogs.has(file.path)) {
      content = content.replaceAll(dutPath.replace(/\\/g, '/'), foreignPath.replace(/\\/g, '/')).replaceAll(dutPath, foreignPath)
    }
    await writeFile(path, content)
  }
  if (variant === 'current_source_mismatch') result.final_source_sha256 = '0'.repeat(64)
  if (variant === 'duplicate_manifest_dut') {
    const path = join(root, result.artifact_manifest.find(path => /^snapshot-[^/]+\/manifest.json$/.test(path))!)
    const manifest = JSON.parse(await readFile(path, 'utf8')) as { sources: { path: string; role: string }[] }
    manifest.sources.push({ ...manifest.sources.find(source => source.role === 'dut')! })
    await writeFile(path, JSON.stringify(manifest))
  }
  await writeFile(join(root, 'result.json'), JSON.stringify(result))
  const { receipt } = await readDiagnostics(root, 'live_verification')
  const stage = receipt.stages.find(s => s.stage === 'elaborate')!
  expect(stage.complete).toBe(true)
  expect(stage.dut_source).toEqual(variant === 'dut' ? { path: dutPath, cwd: join(root, 'build') } : null)
  const primary = stage.diagnostics.find(d => d.message_id === 'VRFC 10-3818')!
  expect(primary.kind).toBe('multiple_drivers')
  expect(primary.origin).toBe(['foreign_path', 'missing_compile_sources'].includes(variant) ? 'unknown' : ['testbench', 'reference'].includes(variant) ? variant : 'dut')
  expect(decideRepair(receipt, { calibrated: true, bound: true, attempts: 0, top: 'TopModule' }).action).toBe(variant === 'dut' ? 'propose_repair' : 'blocked')
  expect(revisionScore(receipt, false)).toEqual(variant === 'dut' ? { rank: 4, checks: null, mismatches: null } : null)
  // Raw diagnostic guidance does not grant repair eligibility when the independent DUT binding fails.
  expect(retrieveKnowledge(await bundle(), stageFeatures(stage, '2026.1'), 3).matches.map(m => m.knowledge_id)).toEqual(['dut', 'current_source_mismatch', 'duplicate_manifest_dut', 'foreign_primary_alias'].includes(variant) ? ['diagnostic.multiple_procedural_driver'] : [])
})
