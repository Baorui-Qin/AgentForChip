import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { afterEach, expect, it } from 'vitest'
import { loadP10Dataset, publicInterface, referenceWrapper, selectP10, p10PreflightAssets, type P10Task } from '../src/phase1/p10-dataset.ts'
import { preflightMetrics, reportP10Preflight, type P10Preflight } from '../src/phase1/p10-report.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }) })
const texts = ['implement a NOT gate', 'decade counter', 'detect\nany edge', 'finite state machine', 'splits an input half-word', 'signed) overflow', 'reverse the byte order', 'A = B', '256-to-1 multiplexer', 'one stage in a larger n-bit shift register']
const tasks: P10Task[] = Array.from({ length: 45 }, (_, i) => ({ task_id: `Prob${String(i + 1).padStart(3, '0')}_test`, spec: texts[i] ?? 'extra public task',
  assets: {}, interface: publicInterface(' - input a (8 bits)\n - output b (8 bits)'), interface_error: null, clock: { kind: 'virtual', port: null, period_ns: 5 } }))
it('selects by public predicates then stable hash ordering, independent of enumeration order', () => {
  const selected = selectP10(tasks)
  expect(selected).toEqual(selectP10([...tasks].reverse()))
  expect(selected.slice(0, 10).map(s => s.task.task_id)).toEqual(tasks.slice(0, 10).map(t => t.task_id))
  expect(selected).toHaveLength(40)
  expect(new Set(selected.map(s => s.task.task_id)).size).toBe(40)
  expect(selectP10(tasks.map(t => ({ ...t, assets: { test: 'changed_evaluator' } }))).map(s => s.task.task_id)).toEqual(selected.map(s => s.task.task_id))
  expect(() => selectP10(tasks.filter(t => t.task_id !== tasks[2]!.task_id))).toThrow('CATEGORY_UNAVAILABLE')
})
it('generates only a transparent reference wrapper and refuses unsupported public interfaces', () => {
  expect(publicInterface(' - input a (  8 bits)\n - output b (8 bits )')).toEqual(tasks[0]!.interface)
  expect(referenceWrapper(tasks[0]!)).toBe('module TopModule(\n  input wire [7:0] a,\n  output wire [7:0] b\n);\n  RefModule preflight_reference(.a(a), .b(b));\nendmodule\n')
  for (const text of [' - input a (N bits)', ' - inout pin', ' - output a\n - input a', '']) expect(() => publicInterface(text)).toThrow()
  expect(() => referenceWrapper({ ...tasks[0]!, interface_error: 'PUBLIC_INTERFACE_UNSUPPORTED' })).toThrow()
})
it('accepts public-list punctuation and unique inline module declarations without reading a reference', () => {
  expect(publicInterface(' - input a (8 bits),\n - output b (8 bits),')).toEqual(tasks[0]!.interface)
  expect(publicInterface('Fix this module: module TopModule(input [7:0] a, output reg [7:0] b); always @* b=a; endmodule')).toEqual(tasks[0]!.interface)
  expect(() => publicInterface('module TopModule(input a, output b); endmodule\nmodule TopModule(input a,output b); endmodule')).toThrow()
  expect(() => publicInterface('An 8-bit 2-to-1 mux: module TopModule(input sel, input [7:0] a,b, output out); endmodule')).toThrow('PUBLIC_INTERFACE_CONFLICT')
  expect(() => publicInterface(' - input a;\n - output b')).toThrow()
})
it('rejects a different dataset revision before reading assets', async () => {
  await expect(loadP10Dataset('missing', 'changed', '')).rejects.toThrow('REVISION_CHANGED')
})
it('binds Git LF blobs to declared CRLF worktree bytes without rewriting files or accepting content drift', async () => {
  const root = await mkdtemp(join(tmpdir(), 'p10-crlf-')); roots.push(root)
  await mkdir(join(root, 'dataset_spec-to-rtl'))
  const text = ' - input a\n - output b\n', bytes = Buffer.from(text)
  const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
  const tree: string[] = [], eol: string[] = []
  for (let i = 1; i <= 156; i++) for (const suffix of ['prompt.txt', 'ref.sv', 'test.sv']) {
    const path = `dataset_spec-to-rtl/Prob${String(i).padStart(3, '0')}_test_${suffix}`
    await writeFile(join(root, path), text.replace(/\n/g, '\r\n'))
    tree.push(`100644 blob ${blob}\t${path}`); eol.push(`i/lf    w/crlf  attr/                 \t${path}`)
  }
  const revision = 'c498220d0a52248f8e3fdffe279075215bde2da6'
  await expect(loadP10Dataset(root, revision, tree.join('\n'))).rejects.toThrow('ASSET_CHANGED')
  const result = await loadP10Dataset(root, revision, tree.join('\n'), eol.join('\n'))
  expect(result[0]!.git_crlf_checkout_files).toHaveLength(3)
  expect(result[0]!.spec).toBe(text.replace(/\n/g, '\r\n'))
  await writeFile(join(root, 'dataset_spec-to-rtl/Prob001_test_test.sv'), 'changed\r\n')
  await expect(loadP10Dataset(root, revision, tree.join('\n'), eol.join('\n'))).rejects.toThrow('ASSET_CHANGED')
})
it('hash-checks original evaluator assets and uses virtual or physical 5 ns clocks', async () => {
  const root = await mkdtemp(join(tmpdir(), 'p10-assets-')); roots.push(root)
  await mkdir(join(root, 'dataset_spec-to-rtl'))
  const task = structuredClone(tasks[0]!)
  for (const suffix of ['prompt.txt', 'ref.sv', 'test.sv']) {
    const path = `dataset_spec-to-rtl/${task.task_id}_${suffix}`
    await writeFile(join(root, path), suffix); task.assets[path] = sha256(suffix)
  }
  const virtual = await p10PreflightAssets(root, task)
  expect(virtual.assets['trusted/clock.xdc']).toBe('create_clock -name p10_virtual -period 5.000\n')
  expect(virtual.assets['trusted/tb.sv']).toBe('test.sv')
  const physical = await p10PreflightAssets(root, { ...task, clock: { kind: 'physical', port: 'clk', period_ns: 5 } })
  expect(physical.assets['trusted/clock.xdc']).toContain('[get_ports {clk}]')
  await writeFile(join(root, `dataset_spec-to-rtl/${task.task_id}_test.sv`), 'changed')
  await expect(p10PreflightAssets(root, task)).rejects.toThrow('ASSET_CHANGED')
})
it('reports all-blocked tasks with null model rates, zero dispatches and no forged shared candidate', async () => {
  const root = await mkdtemp(join(tmpdir(), 'p10-report-')); roots.push(root)
  const rows: P10Preflight[] = tasks.slice(0, 10).map((task, i) => ({ campaign_id: 'test', task_id: task.task_id, manifest_index: i + 1,
    status: 'TESTBENCH_COMPATIBILITY_BLOCKED', reason: 'compile error', verification_run: 'retained', verification_key: 'hash', wrapper_sha256: 'hash',
    stages: { compile: 'TOOL_ERROR' }, blocked_stage: 'compile', diagnostics: [], eda_wall_ms: 10, processes_joined: true, model_requests: 0 }))
  const metrics = preflightMetrics(rows)
  expect(metrics).toMatchObject({ evaluator_ready_count: 0, evaluator_blocked_count: 10, baseline_pass_rate_on_evaluable: null, repair_gain_percentage_points: null, provider_dispatches: 0 })
  const result = await reportP10Preflight(root, 'frozen', rows, { ...rows[0]!, task_id: 'sentinel', manifest_index: null }, 150, '2026.1')
  expect(result).toMatchObject({ recommendation: 'NO_GO', reason: 'NO_EVALUABLE_TASKS', automatic_40_allowed: false })
  const report = JSON.parse(await readFile(join(root, 'p10-results-10.json'), 'utf8'))
  expect(report.rows.every((r: { baseline_status: string; final_verified: boolean; shared_initial_candidate: unknown }) => r.baseline_status === 'NOT_RUN' && !r.final_verified && r.shared_initial_candidate === null)).toBe(true)
  await expect(reportP10Preflight(root, 'frozen', rows.slice(1), rows[0]!, 0, '2026.1')).rejects.toThrow('ACCOUNTING_INVALID')
})
