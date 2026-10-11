import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'
import type { P10Task } from '../src/phase1/p10-dataset.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { settledRTLTestbench, loadSettledRTLAssets, settledRTLManifest, settledRTLProtocol } from '../src/phase1/p10-settled-rtl.ts'
import { loadCompatAssets } from '../src/phase1/p10-compat.ts'

vi.mock('../src/phase1/p10-netlist-profiles.ts', () => ({ netlistProfile: (task: P10Task) => task.spec === 'wire' ? {
  id: 'wire', spec_sha256: sha256('wire'), checks: 2, testbench: `module netlist_tb;
integer checks=0,mismatches=0; reg seen=0;
TopModule dut();
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); end
final begin
if(!seen) $error("NETLIST_OUTPUT_UNOBSERVED:out");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
` } : null }))
vi.mock('../src/phase1/p10-netlist-suite.ts', () => ({ buildNetlistProfile: () => ({ positive: 'module TopModule(input a,output b); assign b=a; endmodule' }) }))

const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }) })
function task(): P10Task {
  return { task_id: 'Prob001_wire', spec: 'wire', assets: {}, interface: { top: 'TopModule', ports: [
    { name: 'a', direction: 'input', width: 1 }, { name: 'b', direction: 'output', width: 1 },
  ] }, interface_error: null, clock: { kind: 'virtual', port: null, period_ns: 5 } }
}

it('retains startup delay and makes missing checks and unobserved bits fatal, with a retained waveform', () => {
  const result = settledRTLTestbench(task())
  expect(result.testbench).toMatchSnapshot()
  expect(result.testbench).not.toContain('glbl.')
  expect(result.testbench).toContain('#101;')
  expect(result.testbench).toContain('if(checks != 2) $fatal')
  expect(result.testbench).toContain('$fatal(1,"NETLIST_OUTPUT_UNOBSERVED:out")')
  expect(result.testbench).toContain('$dumpfile("wave.vcd")')
  expect(result.testbench.indexOf('always @(mismatches)')).toBeGreaterThan(result.testbench.indexOf('integer checks=0,mismatches=0;'))
  expect(() => settledRTLTestbench({ ...task(), spec: 'changed' })).toThrow('RTL_ORACLE_NOT_CALIBRATED')
})

it('uses the same frozen evaluator through the model loader and refuses modified bytes or metadata', async () => {
  const root = await mkdtemp(join(tmpdir(), 'settled-rtl-')); roots.push(root)
  const value = task(), parent = join(root, 'derived')
  await mkdir(join(root, 'dataset_spec-to-rtl')); await mkdir(parent); await mkdir(join(parent, value.task_id))
  for (const suffix of ['prompt.txt', 'ref.sv', 'test.sv']) {
    const path = `dataset_spec-to-rtl/${value.task_id}_${suffix}`
    value.assets[path] = sha256(suffix); await writeFile(join(root, path), suffix)
  }
  const tb = settledRTLTestbench(value), metadata = { protocol: settledRTLProtocol,
    tasks: { [value.task_id]: { tb_sha256: sha256(tb.testbench), profile_sha256: tb.profile_sha256, checks: tb.checks } } }
  const manifest = join(parent, settledRTLManifest), path = join(parent, value.task_id, 'tb.sv')
  await writeFile(manifest, JSON.stringify(metadata)); await writeFile(path, tb.testbench)
  const baseline = await loadCompatAssets(root, value, parent, '1ps/1ps')
  expect(await loadSettledRTLAssets(root, value, parent)).toEqual(baseline)
  expect(baseline.evaluation).toMatchObject({ tbTop: 'netlist_tb', evaluatorId: 'p10-settled-rtl-1:Prob001_wire' })
  expect(baseline.assets['trusted/ref.sv']).toBeUndefined()
  expect(await readFile(join(root, 'dataset_spec-to-rtl/Prob001_wire_test.sv'), 'utf8')).toBe('test.sv')
  await writeFile(path, tb.testbench + ' ')
  await expect(loadCompatAssets(root, value, parent)).rejects.toThrow('RTL_EVALUATOR_BYTES_CHANGED')
  await writeFile(path, tb.testbench)
  metadata.tasks[value.task_id]!.checks = 0
  await writeFile(manifest, JSON.stringify(metadata))
  await expect(loadCompatAssets(root, value, parent)).rejects.toThrow('RTL_EVALUATOR_IDENTITY_CHANGED')
  await writeFile(manifest, '{}')
  await expect(loadCompatAssets(root, value, parent)).rejects.toThrow()
})
