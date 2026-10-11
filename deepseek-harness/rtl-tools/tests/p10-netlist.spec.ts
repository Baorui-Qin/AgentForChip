import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import type { DoctorSettings } from '../src/phase1/doctor.ts'
import type { RunRecord } from '../src/phase1/records.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { finalArtifactManifest } from '../src/phase1/artifact-manifest.ts'
import { netlistProfiles, netlistProfile } from '../src/phase1/p10-netlist-profiles.ts'
import { checkNetlist } from '../src/phase1/p10-netlist.ts'
import { assertAcceptance, auditComparison } from '../phase1/p10/acceptance-audit.mjs'

const state = vi.hoisted(() => ({ kind: 'pass' }))
vi.mock('../src/phase1/p10-netlist-profiles.ts', async original => ({ ...await original<typeof import('../src/phase1/p10-netlist-profiles.ts')>(),
  calibratedLibraryFiles: { 'library.bin': sha256('fake library') } }))
vi.mock('../src/process.ts', () => ({ runCommand: async (_s: unknown, _c: unknown, _a: unknown, cwd: string, label: string, signal: AbortSignal, observer: { accept(s: string): void }) => {
  const text = label !== 'simulation' || state.kind === 'missing' ? '' : `${state.kind === 'unobserved' ? 'Error: NETLIST_OUTPUT_UNOBSERVED:q\n' : ''}PHASE1_COMPLETE checks=2 mismatches=${state.kind === 'mismatch' ? 1 : 0}\n`
  const stdoutLog = join(cwd, label + '.stdout.log'), stderrLog = join(cwd, label + '.stderr.log')
  await writeFile(stdoutLog, text); await writeFile(stderrLog, '')
  for (const line of text.trim().split('\n')) observer.accept(line)
  return { exitCode: state.kind === 'tool' ? 1 : 0, signal: null, timedOut: state.kind === 'timeout', aborted: signal.aborted, logTruncated: state.kind === 'truncated', stdoutLog, stderrLog, durationMs: 1, outputTail: [] }
} }))
const roots: string[] = []
afterEach(async () => { state.kind = 'pass'; for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }) })
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'netlist-')); roots.push(root)
  const run = join(root, 'run'), output = join(root, 'acceptance'), install = join(root, 'vivado')
  for (const path of ['snapshot-test/rtl', 'build/synth']) await mkdir(join(run, path), { recursive: true })
  await mkdir(join(install, 'bin'), { recursive: true }); await mkdir(join(install, 'data/xsim/verilog/unisims_ver'), { recursive: true })
  const tools = Object.fromEntries(['vivado', 'xvlog', 'xelab', 'xsim'].map(name => [name, join(install, 'bin', name + '.exe')]))
  for (const path of Object.values(tools)) await writeFile(path, 'fake executable')
  await writeFile(join(install, 'data/xsim/verilog/unisims_ver/library.bin'), 'fake library')
  const source = 'module TopModule(input in, output out); assign out=in; endmodule'
  await writeFile(join(run, 'snapshot-test/rtl/solution.sv'), source)
  await writeFile(join(run, 'snapshot-test/manifest.json'), JSON.stringify({ sources: [{ path: 'rtl/solution.sv', role: 'dut' }],
    files: { 'rtl/solution.sv': sha256(source) }, part: 'xczu3eg-sbva484-1-e', tool_version: '2025.2' }))
  await writeFile(join(run, 'build/synth/result.json'), '{"success":true}')
  await writeFile(join(run, 'build/synth/netlist.v'), 'NETLIST_ONLY_FIXTURE')
  const record = { task_id: 'Prob007_wire', final_verified: true, final_status: 'PASS', final_source_sha256: sha256(source), verification_key: 'sha256:' + 'a'.repeat(64),
    artifact_manifest: ['snapshot-test/manifest.json'], stages: Object.fromEntries(['compile', 'elaborate', 'simulation', 'synthesis'].map(s => [s, { status: 'PASS', report_path: 'build/synth/result.json' }])) } as unknown as RunRecord
  await writeFile(join(run, 'result.json'), JSON.stringify(record))
  await finalArtifactManifest(run)
  const config = { tools, expectedVivadoVersion: '2025.2', part: 'xczu3eg-sbva484-1-e', limits: { threads: 1, maxDiagnostics: 5, maxLineChars: 400 } } as DoctorSettings
  const runtime = { resolveExecutable: async (value: string) => value } as unknown as SubprocessRuntime
  const limits = { compileMs: 1000, elaborateMs: 1000, simulationMs: 1000, totalMs: 3000, netlistMs: 3000, maxArtifactBytes: 1000000, artifactPollMs: 100, maxEventBytes: 100000 }
  const profile = netlistProfiles.Prob007_wire!
  return { root, run, output, source, config, limits, async execute(signal = new AbortController().signal, selected = profile) {
    const receipt = await checkNetlist(runtime, config, limits, selected, run, record, output, signal)
    return { receipt, ref: { path: join(output, 'acceptance.json'), sha256: sha256(await readFile(join(output, 'acceptance.json'))), status: receipt.status }, expected: { task: record.task_id, source: sha256(source), run } }
  } }
}
it('compiles only the copied netlist and the independent oracle and rehashes successful evidence', async () => {
  const f = await fixture(), { receipt, ref, expected } = await f.execute()
  expect(receipt.status).toBe('PASS'); expect(receipt.checks).toBe(2)
  expect(JSON.stringify(receipt.commands)).not.toContain('solution.sv')
  await expect(assertAcceptance(ref, expected)).resolves.toBeTruthy()
})
it.each([['mismatch', 'NETLIST_MISMATCH'], ['tool', 'NETLIST_TOOL_ERROR'], ['timeout', 'NETLIST_TIMEOUT'], ['missing', 'NETLIST_EVIDENCE_MISSING'], ['unobserved', 'NETLIST_EVIDENCE_MISSING'], ['truncated', 'NETLIST_TRUNCATED']])('fails closed on %s', async (kind, status) => {
  state.kind = kind; const f = await fixture(), { ref } = await f.execute()
  expect(ref.status).toBe(status)
})
it('records cancellation without spawning a command', async () => {
  const f = await fixture(), controller = new AbortController(); controller.abort()
  const { receipt } = await f.execute(controller.signal)
  expect(receipt.status).toBe('NETLIST_CANCELLED'); expect(receipt.commands).toHaveLength(0)
})
it('records artifact exhaustion instead of PASS', async () => {
  const f = await fixture(); f.limits.maxArtifactBytes = 1
  expect((await f.execute()).receipt.status).toBe('NETLIST_ARTIFACT_LIMIT')
})
it('rejects a stale netlist before compile instead of pinning the replacement', async () => {
  const f = await fixture(); await writeFile(join(f.run, 'build/synth/netlist.v'), 'stale replacement')
  const { receipt } = await f.execute()
  expect(receipt.status).toBe('NETLIST_INPUT_BINDING_INVALID'); expect(receipt.commands).toHaveLength(0)
})
it('does not accept an uncalibrated library build', async () => {
  const f = await fixture(); await writeFile(join(f.root, 'vivado/data/xsim/verilog/unisims_ver/library.bin'), 'different library')
  const { receipt } = await f.execute()
  expect(receipt.status).toBe('NETLIST_ENVIRONMENT_NOT_CALIBRATED'); expect(receipt.commands).toHaveLength(0)
})
it('does not convert a missing simulator library into design failure', async () => {
  const f = await fixture(); await rm(join(f.root, 'vivado/data/xsim/verilog/unisims_ver/library.bin'))
  expect((await f.execute()).receipt.status).toBe('NETLIST_LIBRARY_MISSING')
})
it.each(['snapshot-test/rtl/solution.sv', 'build/synth/netlist.v', 'result.json'])('rejects changed original evidence: %s', async path => {
  const f = await fixture(), { ref, expected } = await f.execute()
  await writeFile(join(f.run, path), 'changed')
  await expect(assertAcceptance(ref, expected)).rejects.toThrow()
})
it.each(['acceptance.json', 'netlist.v', 'tb.sv', 'simulation.stdout.log'])('rejects changed acceptance evidence: %s', async path => {
  const f = await fixture(), { ref, expected } = await f.execute()
  await writeFile(join(f.output, path), 'changed')
  await expect(assertAcceptance(ref, expected)).rejects.toThrow()
})
it('rejects a replaced task or a missing receipt even with success strings', async () => {
  const f = await fixture(), { ref, expected } = await f.execute()
  await expect(assertAcceptance(ref, { ...expected, task: 'another-task' })).rejects.toThrow()
  await expect(auditComparison({ status: 'VERIFIED' }, 'p10-netlist-1')).rejects.toThrow()
  await expect(auditComparison({ status: 'VERIFIED', acceptance_protocol: 'p10-netlist-1', acceptance_results: [], final_verification_run: f.run })).rejects.toThrow()
  await expect(auditComparison({ status: 'VERIFIED' })).resolves.toBe('legacy-four-stage-unvalidated')
})
it('audits Baseline and Agent success through the same receipt and rejects a changed final export', async () => {
  const f = await fixture(), { ref, expected } = await f.execute()
  await writeFile(join(f.root, 'final.sv'), f.source)
  const result = { acceptance_protocol: 'p10-netlist-1', acceptance_results: [{ ...ref, run: f.run }], task_id: expected.task,
    initial_status: 'PASS', status: 'VERIFIED', baseline_run: f.run, final_verification_run: f.run, shared_initial_sha256: expected.source,
    current_source_sha256: expected.source, verified_source_sha256: expected.source, final_exported_sha256: expected.source, recovered_by_agent: false }
  await expect(auditComparison(result, 'p10-netlist-1')).resolves.toBe('p10-netlist-1')
  await expect(auditComparison({ ...result, recovered_by_agent: true }, 'p10-netlist-1')).rejects.toThrow('P10_ACCEPTANCE_INVALID')
  await writeFile(join(f.root, 'final.sv'), 'changed')
  await expect(auditComparison(result, 'p10-netlist-1')).rejects.toThrow('P10_ACCEPTANCE_INVALID')
})
it('does not select an oracle solely from a matching task name', () => {
  expect(netlistProfile({ task_id: 'Prob007_wire', spec: 'different spec' } as never)).toBeNull()
  expect(netlistProfile({ task_id: 'unknown', spec: '' } as never)).toBeNull()
})
