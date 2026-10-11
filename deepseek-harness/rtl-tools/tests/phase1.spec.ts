import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { load, JSON_SCHEMA } from 'js-yaml'
import { afterEach, expect, it } from 'vitest'
import { assertSupportedJsonSchema } from '@deepseek-ai/dsh-tools'
import { artifactPath, parseContract, schemas, type PhaseId, type RunIdentity } from '../src/phase1/contracts.ts'
import { EventRecorder, inspectRun } from '../src/phase1/recorder.ts'
import { readDoctorConfig, versionFact, type Probe } from '../src/phase1/doctor.ts'

let root: string | undefined
afterEach(async () => { if (root) await rm(root, { recursive: true, force: true }); root = undefined })

const identity: RunIdentity = { experiment_id: 'exp-1' as PhaseId, task_id: 'counter' as PhaseId, sample_id: 0, mode: 'agent' }
const link = { revision_id: 'rev-0' as PhaseId, call_id: 'call-0' as PhaseId }
const key = 'sha256:' + 'a'.repeat(64)
const task = { schema_version: '1.0', task_id: 'counter', track: 'rtl', public_spec: 'A counter.', interface: { dut_top: 'counter', language: 'systemverilog', clock_ports: ['clk'] }, evaluation_profile_id: 'counter-v1', dataset_revision: 'dev-1' }
const model = { schema_version: '1.0', call_id: 'call-0', model_id: 'mock/fixed-v1', content: 'module counter; endmodule', finish_reason: 'stop', truncated: false, tool_calls: [], usage: { prompt_tokens: null, completion_tokens: null, source: 'unavailable' }, timing: { request_wall_ms: 1, ttft_ms: null, ttft_source: 'not_observed_non_streaming' }, error: null }
const stage = { schema_version: '1.0', snapshot_id: 'snapshot-0', verification_key: key, stage: 'compile', status: 'FAIL', failure_domain: 'design', exit_code: 1, duration_ms: 2, errors: [{ category: 'syntax_error', message_id: 'VRFC 10-4982', file: 'D:\\rtl\\counter.sv', line: 1, message: 'syntax error' }], evidence: { test_completed: null, checks_executed: null, mismatch_count: null, evaluator_id: null }, raw_log_path: 'logs/compile.log', diagnostic_excerpt_truncated: false }
const result = { schema_version: '1.0', ...identity, final_status: 'FAIL', final_revision_id: 'rev-0', final_source_sha256: 'b'.repeat(64), verification_key: key, final_verified: false, stages: { compile: stage, elaborate: null, simulation: null, synthesis: null }, semantic_repairs: 0, model_requests_total: 1, transport_retries: 0, stop_reason: 'Mock interface check only.', artifact_manifest: ['events.jsonl'] }

it('validates all four versioned examples without inventing unavailable measurements', () => {
  for (const schema of Object.values(schemas)) assertSupportedJsonSchema(schema)
  expect(parseContract('TaskSpec', task)).toEqual(task)
  expect(parseContract('ModelResult', model)).toEqual(model)
  expect(parseContract('StageResult', stage)).toEqual(stage)
  expect(parseContract('RunResult', result)).toEqual(result)
})

it('validates the four distributable JSON examples', async () => {
  const examples = JSON.parse(await readFile(new URL('../phase1/examples.json', import.meta.url), 'utf8')) as Record<keyof typeof schemas, unknown>
  for (const kind of Object.keys(schemas) as (keyof typeof schemas)[]) expect(parseContract(kind, examples[kind])).toEqual(examples[kind])
})

it('rejects missing ids, unknown enums, extra fields, invalid digests, and unsafe counters', () => {
  expect(() => parseContract('TaskSpec', { ...task, task_id: undefined })).toThrow()
  expect(() => parseContract('TaskSpec', { ...task, track: 'unknown' })).toThrow()
  expect(() => parseContract('TaskSpec', { ...task, reference_rtl: 'secret' })).toThrow()
  expect(() => parseContract('RunResult', { ...result, final_status: 'OK' })).toThrow()
  expect(() => parseContract('RunResult', { ...result, sample_id: Number.MAX_SAFE_INTEGER + 1 })).toThrow()
  expect(() => parseContract('StageResult', { ...stage, verification_key: 'old' })).toThrow()
  expect(() => parseContract('StageResult', { ...stage, duration_ms: -1 })).toThrow()
  expect(() => parseContract('ModelResult', { ...model, usage: { ...model.usage, prompt_tokens: 0 } })).toThrow()
  expect(() => parseContract('ModelResult', { ...model, tool_calls: [null] })).toThrow()
})

it.each(['../answer.sv', 'a/../b', 'C:/answer.sv', 'C:answer.sv', '//host/share/file', 'a\\b', 'a//b', 'a/file:stream', 'CON.txt', 'folder/Lpt9', 'file.', 'file ', './file'])('rejects unsafe artifact reference %s', path => {
  expect(() => artifactPath(path)).toThrow()
  expect(() => parseContract('RunResult', { ...result, artifact_manifest: [path] })).toThrow()
})

it('does not accept a PASS label, incomplete simulation, or mismatched verification as proof', () => {
  expect(() => parseContract('StageResult', { ...stage, status: 'PASS' })).toThrow()
  const compile = { ...stage, status: 'PASS', failure_domain: null, exit_code: 0, errors: [] }
  const simulation = { ...compile, stage: 'simulation' }
  expect(() => parseContract('StageResult', simulation)).toThrow()
  const simPass = { ...simulation, evidence: { test_completed: true, checks_executed: 4, mismatch_count: 0, evaluator_id: 'trusted-v1' } }
  expect(parseContract('StageResult', simPass).status).toBe('PASS')
  const allPass = { ...result, final_status: 'PASS', final_verified: true, stages: { compile, elaborate: { ...compile, stage: 'elaborate' }, simulation: simPass, synthesis: { ...compile, stage: 'synthesis' } } }
  expect(parseContract('RunResult', allPass).final_verified).toBe(true)
  expect(() => parseContract('RunResult', { ...allPass, verification_key: 'sha256:' + 'c'.repeat(64) })).toThrow()
  expect(() => parseContract('RunResult', { ...allPass, stages: { ...allPass.stages, compile: { ...compile, snapshot_id: 'old' } } })).toThrow()
})

it('records a mock request, response, tool stage and terminal result under one correlation chain', async () => {
  root = await mkdtemp(join(tmpdir(), 'rtl-events-'))
  const recorder = await EventRecorder.create(root, identity, 16384)
  try {
    await recorder.append({ type: 'model_started', link, value: { prompt: task.public_spec } })
    await recorder.append({ type: 'model_finished', link, value: parseContract('ModelResult', model) })
    await recorder.append({ type: 'stage_started', link, value: { stage: 'compile' } })
    await recorder.append({ type: 'stage_finished', link, value: parseContract('StageResult', stage) })
    await recorder.finish(parseContract('RunResult', result))
    await expect(recorder.append({ type: 'stage_started', link, value: { stage: 'compile' } })).rejects.toThrow('terminal')
  } finally { await recorder.close() }
  const events = (await readFile(join(recorder.directory, 'events.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line))
  expect(events.map(event => event.seq)).toEqual([0, 1, 2, 3, 4, 5])
  expect(events.slice(1, 5).every(event => event.call_id === link.call_id && event.revision_id === link.revision_id && event.task_id === identity.task_id)).toBe(true)
  expect(events.map(({ timestamp, elapsed_ms, ...event }) => {
    expect(Number.isNaN(Date.parse(timestamp))).toBe(false)
    expect(elapsed_ms).toBeGreaterThanOrEqual(0)
    return event
  })).toMatchSnapshot()
  expect((await inspectRun(recorder.directory)).state).toBe('TERMINAL')
})

it('identifies an interrupted run without manufacturing a result or marking a live owner dead', async () => {
  root = await mkdtemp(join(tmpdir(), 'rtl-events-'))
  const recorder = await EventRecorder.create(root, identity, 4096)
  await recorder.append({ type: 'model_started', link, value: { prompt: 'start' } })
  await recorder.close()
  await writeFile(join(recorder.directory, '.interrupted.tmp'), '{')
  expect(await inspectRun(recorder.directory)).toEqual({ state: 'INCOMPLETE', identity })
  await writeFile(join(recorder.directory, 'result.json'), '{')
  await expect(inspectRun(recorder.directory)).rejects.toThrow()
})

it('preserves ordered concurrent appends and refuses mismatched final identities', async () => {
  root = await mkdtemp(join(tmpdir(), 'rtl-events-'))
  const recorder = await EventRecorder.create(root, identity, 8192)
  try {
    await Promise.all([0, 1, 2].map(index => recorder.append({ type: 'model_started', link, value: { prompt: String(index) } })))
    expect(() => recorder.finish(parseContract('RunResult', { ...result, task_id: 'other' }))).toThrow('identity')
    expect(() => recorder.append({ type: 'model_finished', link: { ...link, call_id: 'wrong' as PhaseId }, value: parseContract('ModelResult', model) })).toThrow('correlation')
  } finally { await recorder.close() }
  const lines = (await readFile(join(recorder.directory, 'events.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line))
  expect(lines.slice(1).map(line => line.value.prompt)).toEqual(['0', '1', '2'])
})

it('fails closed when a model event exceeds its disk limit and keeps the unfinished sample visible', async () => {
  root = await mkdtemp(join(tmpdir(), 'rtl-events-'))
  const recorder = await EventRecorder.create(root, identity, 512)
  await expect(recorder.append({ type: 'model_started', link, value: { prompt: 'x'.repeat(1000) } })).rejects.toThrow('byte limit')
  await expect(recorder.close()).rejects.toThrow('byte limit')
  expect((await inspectRun(recorder.directory)).state).toBe('INCOMPLETE')
})

it('does not interpret version mismatch, timeout, or truncated banners as readiness', () => {
  const probe: Probe = { executable: 'vivado', argv: [], error: null, process: { exitCode: 1, signal: null, timedOut: false, aborted: false, durationMs: 1, stdoutLog: 'stdout', stderrLog: 'stderr', logTruncated: false, outputTail: '' } }
  expect(versionFact(probe, 'Vivado v2025.2 (64-bit)', '2025.2').matches).toBe(true)
  expect(versionFact(probe, 'Vivado Simulator v2025.2', '2025.2').matches).toBe(true)
  expect(versionFact(probe, 'Vivado v2024.2', '2025.2').matches).toBe(false)
  expect(versionFact(probe, 'no tool', '2025.2').actual).toBeNull()
  expect(versionFact({ ...probe, process: { ...probe.process!, timedOut: true } }, 'Vivado v2025.2', '2025.2').matches).toBe(false)
  expect(versionFact({ ...probe, process: { ...probe.process!, logTruncated: true } }, 'Vivado v2025.2', '2025.2').matches).toBe(false)
})

it('recognizes configured 2026.1 banners and rejects the old release without hiding exit codes', () => {
  const probe: Probe = { executable: 'vivado', argv: ['-version'], error: null, process: { exitCode: 0, signal: null, timedOut: false, aborted: false, durationMs: 1, stdoutLog: 'stdout', stderrLog: 'stderr', logTruncated: false, outputTail: '' } }
  for (const banner of ['vivado v2026.1 (64-bit)', 'Vivado Simulator v2026.1']) {
    expect(versionFact(probe, banner, '2026.1')).toMatchObject({ actual: '2026.1', expected: '2026.1', matches: true })
  }
  expect(versionFact(probe, 'Vivado v2025.2', '2026.1').matches).toBe(false)
  expect(versionFact({ ...probe, process: { ...probe.process!, exitCode: 2 } }, 'Vivado v2026.1', '2026.1').matches).toBe(false)
})

it('loads development YAML as data and rejects executable tags and malformed version settings', async () => {
  const example = new URL('../phase1/configs/dev.yaml', import.meta.url)
  root = await mkdtemp(join(tmpdir(), 'rtl-config-'))
  await mkdir(join(root, 'config'))
  const path = join(root, 'config', 'dev.yaml')
  const input = load(await readFile(example, 'utf8'), { schema: JSON_SCHEMA }) as Record<string, unknown>
  await writeFile(path, JSON.stringify({ ...input, repositoryRoot: root, outputRoot: root,
    tools: { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath } }))
  const parsed = await readDoctorConfig(path)
  expect(parsed.config.model).toBeNull()
  expect(parsed.config.expectedVivadoVersion).toBe('2026.1')
  expect(parsed.sha256).toMatch(/^[a-f0-9]{64}$/)
  await writeFile(path, '!!js process.exit(0)')
  await expect(readDoctorConfig(path)).rejects.toThrow()
  await writeFile(path, JSON.stringify({ ...parsed.config, expectedVivadoVersion: 'not-a-version' }))
  await expect(readDoctorConfig(path)).rejects.toThrow()
  await writeFile(path, JSON.stringify({ ...parsed.config, apiKey: 'must-not-be-logged' }))
  await expect(readDoctorConfig(path)).rejects.toThrow('Unknown')
})
