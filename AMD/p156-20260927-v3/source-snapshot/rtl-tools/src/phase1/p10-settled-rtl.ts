/** Stable-sampling RTL evaluator derived from the calibrated hardware oracle. @module rtl-tools/phase1/p10-settled-rtl */
import { readFile, realpath } from 'node:fs/promises'
import type { P10Task } from './p10-dataset.ts'
import { p10PreflightAssets } from './p10-dataset.ts'
import { netlistProfile } from './p10-netlist-profiles.ts'
import { buildNetlistProfile } from './p10-netlist-suite.ts'
import { checkedFile, sha256, type Evaluation } from './snapshots.ts'

/** A separate protocol, never an in-place upgrade of the racing legacy monitor. */
export const settledRTLProtocol = 'p10-settled-rtl-1'
/** Presence selects the new evaluator; malformed or changed metadata cannot fall back. */
export const settledRTLManifest = 'settled-rtl-manifest.json'

/** Retain oracle timing and comparisons while removing FPGA-only startup assertions. @param task - frozen task with approved public errata. @returns deterministic RTL testbench and oracle identity. */
export function settledRTLTestbench(task: P10Task) {
  const profile = netlistProfile(task)
  if (!profile) throw new Error('RTL_ORACLE_NOT_CALIBRATED')
  let tb = profile.testbench
  const startup = /if\s*\(glbl\.GSR[^\n]+?\$fatal\(1,\s*"GSR_STARTUP_INVALID"\);/g
  const complete = /\$display\("PHASE1_COMPLETE checks=%0d mismatches=%0d",\s*checks,\s*mismatches\);/g
  if ([...tb.matchAll(startup)].length !== 1 || [...tb.matchAll(complete)].length !== 1) throw new Error('RTL_ORACLE_FORMAT_CHANGED')
  tb = tb.replace(startup, '').replace(complete,
    `if(checks != ${profile.checks}) $fatal(1,"RTL_CHECK_COUNT_CHANGED");\n$display("Mismatches: %0d in %0d samples",mismatches,checks);`)
    .replace(/\$error\("NETLIST_OUTPUT_UNOBSERVED:/g, '$fatal(1,"NETLIST_OUTPUT_UNOBSERVED:')
  if (/\bglbl\./.test(tb)) throw new Error('RTL_ORACLE_FORMAT_CHANGED')
  tb = tb.replace(/endmodule\s*$/, `
initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
`)
  return { testbench: tb, profile_sha256: sha256(JSON.stringify(profile)), checks: profile.checks }
}

/** Bind both model arms to exactly the same calibrated, frozen RTL evaluator. @param dataset - unchanged upstream. @param task - frozen public task. @param parent - new frozen evaluator directory. @returns trusted assets and scored verification identity. */
export async function loadSettledRTLAssets(dataset: string, task: P10Task, parent: string): Promise<{ assets: Record<string, string>; evaluation: Evaluation }> {
  const root = await realpath(parent), bytes = await readFile(await checkedFile(root, settledRTLManifest))
  const manifest = JSON.parse(bytes.toString()) as { protocol: string; tasks: Record<string, { tb_sha256: string; profile_sha256: string; checks: number }> }
  const derived = settledRTLTestbench(task), entry = manifest.tasks[task.task_id]
  if (manifest.protocol !== settledRTLProtocol || !entry || entry.tb_sha256 !== sha256(derived.testbench) || entry.profile_sha256 !== derived.profile_sha256 || entry.checks !== derived.checks) throw new Error('RTL_EVALUATOR_IDENTITY_CHANGED')
  const tb = await readFile(await checkedFile(root, `${task.task_id}/tb.sv`), 'utf8')
  if (tb !== derived.testbench) throw new Error('RTL_EVALUATOR_BYTES_CHANGED')
  const original = await p10PreflightAssets(dataset, task)
  const { positive } = buildNetlistProfile(task, original.assets['trusted/ref.sv']!, original.assets['trusted/tb.sv']!)
  return { assets: { 'rtl/solution.sv': positive, 'trusted/tb.sv': tb, 'trusted/clock.xdc': original.assets['trusted/clock.xdc']! },
    evaluation: { top: 'TopModule', tbTop: 'netlist_tb', language: 'systemverilog', sources: ['rtl/solution.sv', 'trusted/tb.sv'],
      evaluatorId: `${settledRTLProtocol}:${task.task_id}`, datasetRevision: original.evaluation.datasetRevision, seed: 1, defaultTimescale: '1ps/1ps',
      compatibility: { protocol: settledRTLProtocol, manifest_sha256: sha256(bytes), ...entry, vivado_version: '2025.2', original_assets: task.assets } } }
}
