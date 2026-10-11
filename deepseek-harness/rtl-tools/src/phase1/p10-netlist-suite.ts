/** Host-owned reference-derived netlist oracles for the pinned VerilogEval suite. @module rtl-tools/phase1/p10-netlist-suite */
import { declaredInterface, type DUTInterface } from './candidates.ts'
import { mask } from './p10-compat-rule.ts'
import type { P10Task } from './p10-dataset.ts'
import { applyPublicInterfaceErratum } from './p10-interface-errata.ts'
import type { NetlistProfile } from './p10-netlist-profiles.ts'
import { sha256 } from './snapshots.ts'

/** Version covers startup, data hold, settled sampling and reference-defined bit masks. */
export const netlistSuiteVersion = 'verilogeval-netlist-settled-v2'

function delayInitials(source: string): string {
  const clean = mask(source), edits: { at: number; text: string }[] = []
  const seedProcesses = /\$urandom(?:_range)?\b/.test(clean)
  let processIndex = 0
  for (const start of clean.matchAll(/\binitial\s+begin\b/g)) {
    const at = start.index! + start[0].length
    const nested = seedProcesses || /^\s*(?:reg|integer|int|logic|bit|time|real)\b/.test(clean.slice(at))
    const seed = seedProcesses ? ` integer netlist_seed, netlist_discard; netlist_seed=${++processIndex}; netlist_discard=$urandom(netlist_seed);` : ''
    edits.push({ at, text: seed + (nested ? ' #101; begin' : ' #101;') })
    if (!nested) continue
    let depth = 1, end: number | undefined
    for (const token of clean.slice(at).matchAll(/\b(?:begin|end)\b/g)) {
      depth += token[0] === 'begin' ? 1 : -1
      if (depth === 0) { end = at + token.index!; break }
    }
    if (end === undefined) throw new Error('NETLIST_STIMULUS_UNSUPPORTED')
    edits.push({ at: end, text: 'end ' })
  }
  for (const edit of edits.sort((a, b) => b.at - a.at)) source = source.slice(0, edit.at) + edit.text + source.slice(edit.at)
  return source
}

function recurrenceProfile(task: P10Task, positive: string): { profile: NetlistProfile; positive: string; negative: NetlistProfile } {
  // The public XOR-feedback specification leaves the initial state unconstrained.
  const body = `\`timescale 1ns/1ps
module netlist_tb;
reg clk=0, in=0, expected; wire raw_dut_out, dut_out;
integer checks=0, mismatches=0, i;
TopModule dut(.clk(clk), .in(in), .out(raw_dut_out));
assign dut_out=raw_dut_out;
task sample; begin checks=checks+1; if(dut_out !== expected) mismatches=mismatches+1; end endtask
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID");
if(dut_out !== 1'b0 && dut_out !== 1'b1) $fatal(1,"NETLIST_INITIAL_STATE_UNKNOWN");
expected=dut_out;
for(i=0;i<64;i=i+1) begin
in=(i ^ (i>>1)) & 1; #1; sample();
clk=1; expected=expected ^ in; #1; sample();
clk=0; #1; sample();
end
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches); $finish;
end
endmodule
`
  const profile: NetlistProfile = { id: `xor-feedback-transition-v1:${task.task_id}`, spec_sha256: sha256(task.spec), checks: 192, testbench: body,
    provenance: { kind: 'public_spec_xor_feedback_transition', assets: { ...task.assets }, unknown_reference_bits: 'no reference mask; initial DUT state may be 0 or 1, never X/Z', startup_ns: 101, data_delay_ns: 1, sample_offsets_ns: [1], stimulus_feedback: 'initial_state_only_then_independent_recurrence', seed: 1, negative_control: 'stuck_zero' } }
  return { profile, positive, negative: { ...profile, id: profile.id + ':stuck-zero-control', testbench: body.replace('assign dut_out=raw_dut_out;', "assign dut_out=1'b0;") } }
}

function replaceCode(source: string, expression: RegExp, replacement: (match: RegExpMatchArray) => string): string {
  const matches = [...mask(source).matchAll(expression)]
  for (const match of matches.reverse()) source = source.slice(0, match.index) + replacement(match) + source.slice(match.index! + match[0].length)
  return source
}

const width = (port: DUTInterface['ports'][number]) => port.width === 1 ? '' : `[${port.width - 1}:0] `

/** Derive a candidate-blind scoreboard without reusing the upstream racing monitor. @param task - pinned task. @param reference - exact trusted reference bytes. @param testbench - exact trusted stimulus bytes. @returns oracle and synthesis control. */
export function buildNetlistProfile(task: P10Task, reference: string, testbench: string): { profile: NetlistProfile; positive: string; negative: NetlistProfile } {
  task = applyPublicInterfaceErratum(task)
  for (const [suffix, text] of [['ref', reference], ['test', testbench]] as const) {
    if (sha256(text) !== task.assets[`dataset_spec-to-rtl/${task.task_id}_${suffix}.sv`]) throw new Error('NETLIST_DATASET_CHANGED')
  }
  if (!task.interface || task.interface_error) throw new Error('NETLIST_INTERFACE_UNSUPPORTED')
  const iface = task.interface, ports = iface.ports, inputs = ports.filter(p => p.direction === 'input'), outputs = ports.filter(p => p.direction === 'output')
  if (!outputs.length) throw new Error('NETLIST_INTERFACE_UNSUPPORTED')
  if (task.task_id === 'Prob053_m2014_q4d') return recurrenceProfile(task, replaceCode(reference, /\bRefModule\b/g, () => 'TopModule'))
  const modules = [...mask(testbench).matchAll(/\bmodule\s+(\w+)\b/g)]
  if (modules.length !== 2 || modules[0]![1] !== 'stimulus_gen' || modules[1]![1] !== 'tb') throw new Error('NETLIST_STIMULUS_UNSUPPORTED')
  let stimulus = testbench.slice(0, modules[1]!.index)
  let portSource = mask(stimulus)
  // Only the pinned gshare stimulus has a parameterized port header.
  if (task.task_id === 'Prob153_gshare') portSource = portSource.replace(/#\(parameter N=7\)/, '').replace(/\[N-1:0\]/g, '[6:0]')
  const portHeader = /\bmodule\s+stimulus_gen\s*\(([^;]+)\)\s*;/.exec(portSource)
  if (!portHeader) throw new Error('NETLIST_STIMULUS_UNSUPPORTED')
  const declarationsForParser = portHeader[1]!.replace(/\b(wire|reg|logic)(?=\[)/g, '$1 ')
    .replace(/\bint\s+/g, 'logic signed [31:0] ').replace(/\s*=\s*0(?=\s*[,)]|\s*$)/g, '')
  const stimPorts = declaredInterface(`module stimulus_gen(${declarationsForParser}); endmodule`, 'stimulus_gen').ports
  const starts = [...mask(stimulus).matchAll(/\binitial\b/g)]
  if (!starts.length || starts.some(m => !/^initial\s+begin\b/.test(mask(stimulus).slice(m.index)))) throw new Error('NETLIST_STIMULUS_UNSUPPORTED')
  stimulus = replaceCode(stimulus, /`timescale\s+1\s*ps\s*\/\s*1\s*ps/g, () => '`timescale 1ns/1ps')
  if (/\$random\b/.test(mask(stimulus))) {
    if (/\$random\s*\(/.test(mask(stimulus))) throw new Error('NETLIST_EXPLICIT_RANDOM_SEED_UNSUPPORTED')
    stimulus = replaceCode(stimulus, /\$random\b/g, () => '$random(netlist_random_seed)')
    const header = /\bmodule\s+stimulus_gen[\s\S]*?;/.exec(mask(stimulus))!
    const declaration = header.index + header[0].length
    stimulus = stimulus.slice(0, declaration) + '\ninteger netlist_random_seed=1;\n' + stimulus.slice(declaration)
  }
  stimulus = delayInitials(stimulus)
  // Reference feedback controls stimulus; candidate output never selects its own test sequence.
  const connections = stimPorts.map(port => {
    if (port.name === 'clk' && port.direction === 'input') return '.clk(clk)'
    if (port.name === 'tb_match' && port.direction === 'input') return ".tb_match(1'b1)"
    const observed = /^(.*)_(?:ref|dut)$/.exec(port.name)
    if (port.direction === 'input' && observed && outputs.some(p => p.name === observed[1] && p.width === port.width)) return `.${port.name}(gold_${observed[1]})`
    if (port.direction === 'output' && inputs.some(p => p.name === port.name && p.width === port.width)) return `.${port.name}(raw_${port.name})`
    if (port.direction === 'output' && ['wavedrom_title', 'wavedrom_enable', 'wavedrom_hide_after_time'].includes(port.name)) return `.${port.name}()`
    throw new Error('NETLIST_STIMULUS_PORT_UNSUPPORTED')
  })
  if (inputs.some(p => p.name !== 'clk' && !stimPorts.some(s => s.name === p.name && s.direction === 'output'))) throw new Error('NETLIST_STIMULUS_PORT_UNSUPPORTED')
  const moduleNames = [...mask(reference).matchAll(/\bmodule\s+(\w+)\b/g)].map(m => m[1]!)
  if (moduleNames[0] !== 'RefModule' || moduleNames.length !== new Set(moduleNames).size) throw new Error('NETLIST_REFERENCE_UNSUPPORTED')
  const referenceClean = replaceCode(reference, /\b[A-Za-z_][A-Za-z_0-9]*\b/g, m => moduleNames.includes(m[0]) ? `oracle_${m[0]}` : m[0])
  const positive = replaceCode(reference, /\bRefModule\b/g, () => 'TopModule')
  const undelayed = inputs.filter(p => (task.clock?.kind === 'physical' && p.name === task.clock.port) || (task.task_id === 'Prob028_m2014_q4a' && p.name === 'ena')).map(p => p.name)
  const declarations = inputs.filter(p => p.name !== 'clk').map(p => `wire ${width(p)}raw_${p.name}; wire ${width(p)}drive_${p.name}; assign ${undelayed.includes(p.name) ? '' : '#0.1 '}drive_${p.name}=raw_${p.name};`).join('\n')
  // Prob094 explicitly excludes these two boundary bits in the public problem.
  const dontCare: Record<string, number[]> = task.task_id === 'Prob094_gatesv' ? { out_both: [3], out_any: [0] } : {}
  const outputDeclarations = outputs.map(p => {
    const observed = dontCare[p.name] ? `${p.width}'b` + Array.from({ length: p.width }, (_, b) => dontCare[p.name]!.includes(p.width - b - 1) ? '1' : '0').join('') : "'0"
    return `wire ${width(p)}gold_${p.name}, dut_${p.name}, raw_dut_${p.name}; reg ${width(p)}seen_${p.name}=${observed};`
  }).join('\n')
  const connect = (kind: 'gold' | 'raw_dut') => ports.map(p => `.${p.name}(${p.direction === 'input' ? p.name === 'clk' ? 'clk' : `drive_${p.name}` : `${kind}_${p.name}`})`).join(',')
  const compare = outputs.map(p => `for(integer b=0;b<${p.width};b=b+1) begin
if(gold_${p.name}${p.width === 1 ? '' : '[b]'} === 1'b0 || gold_${p.name}${p.width === 1 ? '' : '[b]'} === 1'b1) begin
known=1; seen_${p.name}${p.width === 1 ? '' : '[b]'}=1'b1;
if(dut_${p.name}${p.width === 1 ? '' : '[b]'} !== gold_${p.name}${p.width === 1 ? '' : '[b]'}) bad=1;
end end`).join('\n')
  const body = `${stimulus}\n\`default_nettype wire
\`timescale 1ns/1ps
${referenceClean}
\`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
${declarations}
${outputDeclarations}
stimulus_gen stim1(${connections.join(',')});
oracle_RefModule gold(${connect('gold')});
TopModule dut(${connect('raw_dut')});
${outputs.map(p => `assign dut_${p.name}=raw_dut_${p.name};`).join('\n')}
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
${compare}
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
${outputs.map(p => `if((&seen_${p.name}) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:${p.name}");`).join('\n')}
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
`
  const profile: NetlistProfile = { id: `${netlistSuiteVersion}:${task.task_id}`, spec_sha256: sha256(task.spec), checks: 1, testbench: body,
    provenance: { kind: netlistSuiteVersion, assets: { ...task.assets }, unknown_reference_bits: 'masked; each output bit must be known at least once',
      startup_ns: 101, data_delay_ns: 0.1, sample_offsets_ns: [0.5, 4.8], stimulus_feedback: 'reference_only', seed: 1, undelayed_control_ports: undelayed, negative_control: 'inversion' } }
  if (Object.keys(dontCare).length) {
    profile.provenance!.public_dont_care_bits = dontCare
    profile.provenance!.unknown_reference_bits = 'masked; each required output bit must be known at least once; public dont-care bits exempt from observation'
  }
  if (task.public_interface_erratum) profile.provenance!.public_interface_erratum = { ...task.public_interface_erratum }
  return { profile, positive, negative: { ...profile, id: profile.id + ':output-inversion-control',
    testbench: outputs.reduce((tb, p) => tb.replace(`assign dut_${p.name}=raw_dut_${p.name};`, `assign dut_${p.name}=~raw_dut_${p.name};`), body) } }
}
