import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { scanTB, convertTB } from '../src/phase1/p10-compat-rule.ts'
import { assertSharedEvaluator, buildSuite, loadSuiteAssets, suiteManifestName } from '../src/phase1/p10-compat-suite.ts'
import { loadCompatAssets } from '../src/phase1/p10-compat.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import type { P10Task } from '../src/phase1/p10-dataset.ts'
import { calibrationPairReady } from '../src/phase1/p10-suite-preflight.ts'

const fixture = () => readFile(new URL('./fixtures/p10/Prob005_notgate_test.sv', import.meta.url))
const convert = (bytes: Buffer) => convertTB('Prob005_notgate', bytes, sha256(bytes))

it('accepts matching informational version exit 1, never failing EDA or incomplete negative evidence', () => {
  const invocation = { args: ['-sv'], version_matches: null, process: { exit_code: 0, timed_out: false, cancelled: false, signal: null, log_truncated: false } }
  const negative = { stages: [
    { status: 'PASS', invocations: [{ ...structuredClone(invocation), args: ['-version'], version_matches: true, process: { ...invocation.process, exit_code: 1 } }, structuredClone(invocation)] },
    { status: 'PASS', invocations: [structuredClone(invocation)] },
    { stage: 'simulation', status: 'FAIL', evidence: { test_completed: true, checks_executed: 239, mismatch_count: 239 }, invocations: [structuredClone(invocation)] },
  ] }
  const ready = (value: unknown) => calibrationPairReady({ status: 'EVALUATOR_READY' } as never, value as never)
  expect(ready(negative)).toBe(true)
  const failed = structuredClone(negative); failed.stages[0]!.invocations[1]!.process.exit_code = 1
  expect(ready(failed)).toBe(false)
  const unfinished = structuredClone(negative); unfinished.stages[2]!.evidence!.test_completed = false
  expect(ready(unfinished)).toBe(false)
  const unnoticed = structuredClone(negative); unnoticed.stages[2]!.evidence!.mismatch_count = 0
  expect(ready(unnoticed)).toBe(false)
})

it('T1/T2/T8 moves exactly two complete lines and reverses every byte for LF and CRLF', async () => {
  for (const eol of ['\n', '\r\n']) {
    const bytes = Buffer.from((await fixture()).toString().replace(/\r?\n/g, eol))
    expect(scanTB(bytes)).toMatchObject({ status: 'MATCH_VIVADO_COMPAT_001', reason: 'matching_known_pattern' })
    const result = convert(bytes), restored: string[] = [], lines = result.effective.toString().match(/[^\n]*\n|[^\n]+$/g)!
    result.sourceMap.new_to_original_line.forEach((old, i) => { restored[old - 1] = lines[i]! })
    expect(Buffer.from(restored.join(''))).toEqual(bytes)
    expect(result.patch.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'))).toHaveLength(2)
    const withoutDecls = (b: Buffer) => b.toString().replace(/^.*wire tb_match;.*\r?\n.*wire tb_mismatch = ~tb_match;.*\r?\n/m, '')
    expect(withoutDecls(result.effective)).toBe(withoutDecls(bytes))
    expect(lines.every(l => l.endsWith(eol))).toBe(true)
  }
})
it('T3 rejects an unexpected input SHA before conversion', async () => {
  const bytes = await fixture()
  expect(() => convertTB('Prob005_notgate', Buffer.concat([Buffer.from('// changed\n'), bytes]), sha256(bytes))).toThrow('COMPAT_INPUT_SHA_MISMATCH')
})
it('T4 refuses zero matches without inventing a change', () => {
  const bytes = Buffer.from('module tb(); endmodule\n')
  expect(scanTB(bytes).status).toBe('NO_KNOWN_COMPAT_ISSUE')
  expect(() => convert(bytes)).toThrow('COMPAT_RULE_NOT_APPLICABLE')
})
it('T5 rejects duplicate declarations, waveform blocks and modules', async () => {
  const bytes = await fixture()
  for (const extra of ['wire tb_match;\n', 'wire tb_mismatch = ~tb_match;\n', '$dumpvars(1);\n']) {
    const input = Buffer.concat([bytes, Buffer.from(extra)])
    expect(scanTB(input).status).toBe('MULTIPLE_MATCH')
    expect(() => convert(input)).toThrow('COMPAT_RULE_NOT_APPLICABLE')
  }
})
it('T6 never repeats a transformation', async () => {
  const bytes = convert(await fixture()).effective
  expect(scanTB(bytes).status).toBe('NO_KNOWN_COMPAT_ISSUE')
  expect(() => convert(bytes)).toThrow('COMPAT_RULE_NOT_APPLICABLE')
})
it('T7 refuses wrong scope, expressions, preprocessing and partial known templates', async () => {
  const text = (await fixture()).toString()
  for (const input of [text.replace('module tb()', 'module other()'), text.replace('~tb_match;', '!tb_match;'),
    text.replace('\tinitial begin \r\n\t\t$dumpfile', '\tgenerate if (1) begin\r\n\tinitial begin \r\n\t\t$dumpfile'),
    text.replace('wire tb_match;', 'wire other_match;'), text.replace('module tb();', 'module tb();\r\n`ifdef ALTER'),
    text.replace('wire tb_match;', 'endmodule\r\nmodule other();\r\nwire tb_match;')]) {
    expect(scanTB(Buffer.from(input)).status).toBe('UNKNOWN_TEMPLATE')
    expect(() => convert(Buffer.from(input))).toThrow('COMPAT_RULE_NOT_APPLICABLE')
  }
  expect(scanTB(Buffer.from('/* unterminated')).status).toBe('STATIC_ANALYSIS_ERROR')
  expect(scanTB(Buffer.from([0xff])).status).toBe('STATIC_ANALYSIS_ERROR')
})

it('retains unmatched, ambiguous and undecodable files byte-for-byte in the full manifest', async () => {
  const root = await mkdtemp(join(tmpdir(), 'p10-suite-unknown-')), dataset = join(root, 'original'), output = join(root, 'derived')
  await mkdir(join(dataset, 'dataset_spec-to-rtl'), { recursive: true }); await mkdir(output)
  const inputs = [Buffer.from('module tb(); endmodule\n'), Buffer.concat([await fixture(), Buffer.from('\nwire tb_match;\n')]), Buffer.from([0xff, 0x0d, 0x0a])]
  const catalog: P10Task[] = []
  for (const [index, bytes] of inputs.entries()) {
    const task_id = `Prob00${index}_test`, path = `dataset_spec-to-rtl/${task_id}_test.sv`
    await writeFile(join(dataset, path), bytes)
    catalog.push({ task_id, assets: { [path]: sha256(bytes) }, spec: '', interface: null, interface_error: null, clock: null })
  }
  const manifest = await buildSuite(dataset, catalog, output, '2026-09-18T00:00:00.000Z')
  expect(manifest).toMatchObject({ task_count: 3, converted_task_count: 0, unchanged_task_count: 3, unknown_task_count: 2 })
  expect(manifest.tasks.map(t => t.status)).toEqual(['NO_KNOWN_COMPAT_ISSUE', 'MULTIPLE_MATCH', 'STATIC_ANALYSIS_ERROR'])
  for (const [index, task] of catalog.entries()) expect(await readFile(join(output, task.task_id, 'tb.sv'))).toEqual(inputs[index])
})

it('T9/T10 builds byte-identical manifests without touching upstream and seals the shared loader', async () => {
  const root = await mkdtemp(join(tmpdir(), 'p10-suite-')), dataset = join(root, 'original')
  await mkdir(join(dataset, 'dataset_spec-to-rtl'), { recursive: true })
  const bytes = await fixture(), task: P10Task = { task_id: 'Prob005_notgate', spec: 'NOT gate', assets: {}, interface_error: null,
    interface: { top: 'TopModule', ports: [{ name: 'in', direction: 'input', width: 1 }, { name: 'out', direction: 'output', width: 1 }] }, clock: { kind: 'virtual', port: null, period_ns: 5 } }
  for (const [suffix, contents] of [['test.sv', bytes], ['ref.sv', Buffer.from('module RefModule(input in, output out); assign out = ~in; endmodule\n')], ['prompt.txt', Buffer.from('NOT gate')]] as const) {
    const path = `dataset_spec-to-rtl/${task.task_id}_${suffix}`
    await writeFile(join(dataset, path), contents); task.assets[path] = sha256(contents)
  }
  for (const folder of ['first', 'second']) {
    await mkdir(join(root, folder))
    await buildSuite(dataset, [task], join(root, folder), '2026-09-18T00:00:00.000Z')
  }
  const first = join(root, 'first'), second = join(root, 'second')
  for (const name of await readdir(first, { recursive: true })) {
    if (name === task.task_id) continue
    expect(await readFile(join(first, name))).toEqual(await readFile(join(second, name)))
  }
  for (const [path, hash] of Object.entries(task.assets)) expect(sha256(await readFile(join(dataset, path)))).toBe(hash)
  await expect(loadCompatAssets(dataset, task, first, '1ps/1ps')).rejects.toThrow()
  const seal = { manifest_sha256: sha256(await readFile(join(first, suiteManifestName))), defaultTimescale: '1ps/1ps', representative_calibration_passed: true }
  await writeFile(join(first, 'suite-freeze.json'), JSON.stringify(seal))
  const baseline = await loadCompatAssets(dataset, task, first, '1ps/1ps'), agent = await loadCompatAssets(dataset, task, first, '1ps/1ps')
  expect(() => assertSharedEvaluator(baseline, agent)).not.toThrow()
  expect(baseline.evaluation.compatibility).toMatchObject({ compatibility_version: 'vivado2025.2-compat-v1', vivado_version: '2025.2' })
  await expect(loadSuiteAssets(dataset, task, first)).rejects.toThrow('COMPAT_SUITE_NOT_FROZEN')
  const wrong = structuredClone(agent); wrong.assets['trusted/tb.sv'] += '\n'
  expect(() => assertSharedEvaluator(baseline, wrong)).toThrow('BASELINE_AGENT_EVALUATOR_MISMATCH')
  await writeFile(join(first, task.task_id, 'tb.sv'), bytes)
  await expect(loadCompatAssets(dataset, task, first, '1ps/1ps')).rejects.toThrow('COMPAT_ASSET_CHANGED')
})
