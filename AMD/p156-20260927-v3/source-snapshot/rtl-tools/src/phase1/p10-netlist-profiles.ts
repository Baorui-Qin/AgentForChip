/** Exact-spec and dataset-bound post-synthesis oracles. @module rtl-tools/phase1/p10-netlist-profiles */
import { sha256 } from './snapshots.ts'
import type { P10Task } from './p10-dataset.ts'
import type { PublicInterfaceErratum } from './p10-interface-errata.ts'
import { calibratedNetlistProfiles } from './p10-netlist-calibrated.ts'

/** Startup and sampling are part of the oracle, not simulator error suppression. */
export interface NetlistProfile {
  id: string; spec_sha256: string; checks: number; testbench: string
  provenance?: { kind: string; assets: Record<string, string>; unknown_reference_bits: string; startup_ns: number; data_delay_ns: number; sample_offsets_ns: number[]; stimulus_feedback: string; seed: number; undelayed_control_ports?: string[]; negative_control?: 'stuck_zero' | 'inversion'; public_dont_care_bits?: Record<string, number[]>; public_interface_erratum?: PublicInterfaceErratum }
}

/** Release-calibrated Windows Vivado 2025.2 UNISIM library; other builds need a reviewed calibration. */
export const calibratedLibraryFiles: Record<string, string> = {
  'unisims_ver.rlx': '2233b6116458304d1220adea776e04607825afff4a4b6e45c2926610d19473d7',
  'unisims_ver.sdbl': '427be82d07c2de5e131eb2a2faff2268bf862dc6ee405c74cf66fdc3dc347feb',
  'unisims_ver.sdbx': '04b0ce3cb10ccfaa409736e20d3c49146c5073cb35094c153d6517c14fdce895',
}

const header = '`timescale 1ns/1ps\nmodule netlist_tb;\ninteger checks=0, mismatches=0;\n'
const finish = '$display("PHASE1_COMPLETE checks=%0d mismatches=%0d", checks, mismatches); $finish; end\nendmodule\n'
const startup = '#101; if (glbl.GSR !== 1\'b0 || glbl.GTS !== 1\'b0) $fatal(1, "GSR_STARTUP_INVALID");\n'

function combinational(id: string, spec: string, expression: string): NetlistProfile {
  return { id, spec_sha256: spec, checks: 2, testbench: header +
    `reg in=0; wire out; integer i; TopModule dut(.in(in), .out(out));\ninitial begin\n${startup}` +
    `for(i=0;i<2;i=i+1) begin in=i; #1; checks=checks+1; if(out !== (${expression})) mismatches=mismatches+1; end\n` + finish }
}

/** Only exact frozen public specs are enabled; other tasks remain visible but unaccepted. */
export const netlistProfiles: Record<string, NetlistProfile> = {
  ...calibratedNetlistProfiles,
  Prob007_wire: combinational('wire-01-v1', '6030b423056bbfcf0126eba90535125724c8a2f58929ae358a91467aad897367', 'in'),
  Prob005_notgate: combinational('not-01-v1', 'bae76a61e5863ce7ce1e695c6b6c41d3474bb4583e772bf08f49ee2c6ea8cf1a', '~in'),
  Prob041_dff8r: { id: 'dff8r-sync-v1', spec_sha256: '113c34f0845fba12d4262d261b3c52e3f5b90a0fbedee415c9137fdc9ca2afa2', checks: 1024,
    testbench: header + 'reg clk=0, reset=0; reg [7:0] d=0, expected=0; wire [7:0] q; integer i;\nTopModule dut(.clk(clk), .reset(reset), .d(d), .q(q));\n' +
    `initial begin\n${startup}` +
    // Reset assertion between edges must not asynchronously change an established value.
    'for(i=0;i<256;i=i+1) begin\nreset=1; d=i; #1; clk=1; #1; checks=checks+1; if(q !== 8\'b0) mismatches=mismatches+1;\nclk=0; reset=0; #1; clk=1; #1; expected=d; checks=checks+1; if(q !== expected) mismatches=mismatches+1;\nclk=0; d=~d; #1; checks=checks+1; if(q !== expected) mismatches=mismatches+1;\nreset=1; #1; checks=checks+1; if(q !== expected) mismatches=mismatches+1; end\n' + finish },
}

/** Select by exact spec and calibrated asset identities, never model-provided arguments. @param task - frozen catalog entry. @returns calibrated rule or null. */
export function netlistProfile(task: P10Task): NetlistProfile | null {
  const profile = netlistProfiles[task.task_id]
  if (!profile || sha256(task.spec) !== profile.spec_sha256) return null
  const assets = profile.provenance?.assets
  if (assets && (Object.keys(task.assets).length !== Object.keys(assets).length || Object.entries(assets).some(([path, hash]) => task.assets[path] !== hash))) return null
  const erratum = profile.provenance?.public_interface_erratum
  if (erratum && (!task.public_interface_erratum || Object.entries(erratum).some(([key, value]) => task.public_interface_erratum![key as keyof PublicInterfaceErratum] !== value))) return null
  return profile
}
