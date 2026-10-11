import { readFile } from 'node:fs/promises'
import { expect, it } from 'vitest'
import { parseTiming, parseUtilization, VivadoDiagnostics } from '../src/vivado-parser.ts'
import { SimulationEvidence } from '../src/phase1/simulation-evidence.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { diagnosticKind } from '../src/phase1/repair-diagnostics.ts'
import { simulationFeedback, withWaveform } from '../src/phase1/waveform-feedback.ts'

const raw = (name: string) => readFile(new URL('./fixtures/vivado2026.1/' + name, import.meta.url), 'utf8')
async function diagnostics(name: string) {
  const parsed = new VivadoDiagnostics(20, 2000)
  for (const stream of ['stdout', 'stderr']) for (const line of (await raw(name + '.' + stream + '.log')).split(/\r?\n/)) parsed.accept(line)
  return parsed
}

it('authenticates real 2026.1 fixtures without relabelling old logs', async () => {
  const provenance = JSON.parse(await raw('provenance.json')) as { tool_version: string; capture_kind: string; files: { file: string; sha256: string }[] }
  expect(provenance).toMatchObject({ tool_version: '2026.1', capture_kind: 'real_tool_output' })
  for (const file of provenance.files) expect(sha256(await readFile(new URL('./fixtures/vivado2026.1/' + file.file, import.meta.url)))).toBe(file.sha256)
})

it.each(['counter', 'systemverilog', 'verilog'])('parses successful %s compile and elaboration', async name => {
  expect((await diagnostics(name + '-compile')).errorSeen).toBe(false)
  expect((await diagnostics(name + '-elaborate')).errorSeen).toBe(false)
})

it.each([['syntax-compile', 'syntax'], ['missing-module-elaborate', 'not found']])('retains actual %s diagnostics', async (name, text) => {
  const parsed = await diagnostics(name)
  expect(parsed.errorSeen).toBe(true)
  expect(parsed.errors.some(e => e.code?.startsWith('VRFC') && e.message.includes(text))).toBe(true)
})

it.each([['counter', 0], ['functional', 18]] as const)('parses %s XSim verdict and mismatch count', async (name, mismatch) => {
  const evidence = new SimulationEvidence(false)
  for (const line of (await raw(name + '-simulation.stdout.log')).split(/\r?\n/)) evidence.accept(line)
  expect(evidence.completed).toBe(true)
  expect(evidence.checks).toBe(20)
  expect(evidence.mismatches).toBe(mismatch)
  expect(evidence.passed).toBe(mismatch === 0)
})

it('preserves the real missing-device synthesis diagnostic as an environment failure', async () => {
  const parsed = await diagnostics('counter-synthesis')
  expect(parsed.environmentFailure).toBe(true)
  expect(parsed.errors.some(e => e.code === 'Coretcl 2-106')).toBe(true)
})

it('authenticates synthesis captures made after target-device support was installed', async () => {
  const provenance = JSON.parse(await raw('synthesis-supported/provenance.json')) as {
    tool_version: string; part: string; files: { file: string; sha256: string }[]
  }
  expect(provenance).toMatchObject({ tool_version: '2026.1', part: 'xczu3eg-sbva484-1-e' })
  for (const file of provenance.files) {
    expect(sha256(await readFile(new URL('./fixtures/vivado2026.1/synthesis-supported/' + file.file, import.meta.url)))).toBe(file.sha256)
  }
})

it.each(['counter', 'systemverilog', 'verilog'])('parses real %s synthesis resources and timing', async name => {
  const base = 'synthesis-supported/' + name
  expect((await diagnostics(base + '-synthesis')).errorSeen).toBe(false)
  expect((await diagnostics(base + '-report')).errorSeen).toBe(false)
  const observed = JSON.parse(await raw(base + '-expected.json')) as {
    resources: ReturnType<typeof parseUtilization>; timing: ReturnType<typeof parseTiming>
  }
  expect(observed.resources).toEqual({ lut: 2, ff: 4, bram: 0, dsp: 0 })
  expect(observed.timing).toEqual({ wns: 4.405, unit: 'ns', stage: 'post_synthesis', reason: null })
  expect(parseUtilization(await raw(base + '-utilization.rpt'))).toEqual(observed.resources)
  expect(parseTiming(await raw(base + '-timing.rpt'), Number(await raw(base + '-clocks.count')),
    Number(await raw(base + '-paths.count')))).toEqual(observed.timing)
})

it('distinguishes an actual synthesis design error from the earlier missing-device environment error', async () => {
  const parsed = await diagnostics('synthesis-supported/synthesis-only-synthesis')
  expect(parsed.errorSeen).toBe(true)
  expect(parsed.environmentFailure).toBe(false)
  expect(parsed.errors.some(e => e.code === 'Synth 8-439' && e.message.includes('missing_synthesis_cell'))).toBe(true)
})

it.each([['name-resolution', 'name_resolution'], ['named-port', 'type_or_port'], ['port-count', 'type_or_port']])('classifies the observed %s wording', async (name, kind) => {
  const parsed = await diagnostics(name + '-elaborate')
  expect(parsed.errors.some(e => diagnosticKind(e.code ?? null, e.message) === kind)).toBe(true)
})

it('classifies an undeclared signal during xvlog compilation', async () => {
  const parsed = await diagnostics('undeclared-signal-compile')
  expect(parsed.errors.some(e => diagnosticKind(e.code ?? null, e.message) === 'name_resolution')).toBe(true)
})

it('extracts the first mismatch signal/time and bounded samples from real XSim VCD', async () => {
  const lines = (await raw('verilogeval-mismatch.stdout.log')).split(/\r?\n/)
  const evidence = new SimulationEvidence(true)
  lines.forEach(line => evidence.accept(line))
  expect(evidence.completed).toBe(true)
  expect(evidence.mismatches).toBeGreaterThan(0)
  const feedback = withWaveform(await raw('verilogeval-mismatch.vcd'), simulationFeedback(lines))
  expect(feedback.outputs[0]!.signal).toBe('out')
  expect(feedback.outputs[0]!.mismatches).toBe(239)
  expect(feedback.first_failure_time).toBe(5)
  expect(feedback.outputs[0]!.mismatches).toBe(evidence.mismatches)
  expect(feedback.first_failure_time).toBe(feedback.outputs[0]!.first_time)
  expect(feedback.waveform.status).toBe('available')
  expect(feedback.waveform.samples.length).toBeGreaterThan(0)
  expect(feedback.waveform.samples.length).toBeLessThanOrEqual(3)
})
