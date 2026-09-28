# Agent Note: Stable-sampling RTL evaluation

Status: implemented

English | [中文](2026-09-27-p10-settled-rtl.zh.md)

## Problem

A netlist acceptance check cannot repair misleading RTL feedback. The upstream delta-cycle monitor can reject a correct dual-edge design and accept a wrong repair. Feeding that verdict to the agent corrupts both the repair trajectory and the baseline comparison before netlist acceptance runs.

## Decision

The [stable RTL evaluator](../../../../rtl-tools/src/phase1/p10-settled-rtl.ts) derives a separately versioned testbench from the [calibrated hardware oracle](../testing/2026-09-27-p10-netlist-suite.md). RTL and netlist use the same stimulus and sampling schedule. Only the FPGA-specific startup assertion and completion reporting differ. Exact sample counts and observed-output requirements prevent incomplete comparisons from appearing successful.

A frozen manifest selects the protocol explicitly. Both model arms load identical testbench bytes, approved public interfaces and original asset identities. Invalid metadata cannot fall back to the legacy evaluator. Existing campaign files and scores remain immutable; fresh candidates and a fresh freeze are necessary to compare the changed evaluator. Reference code remains Host-only, not model input.

The model-free calibrator runs positive and faulty RTL through the real toolchain and records every result. Optional replay binds historical correct and incorrect candidates by source hash. Raw simulation logs, VCD, frozen testbench bytes and manifest hashes remain available for audit. The log's first-mismatch timestamp is an observation, not an inferred sampled value or diagnosis.

## Consequences

Finite simulation does not establish formal equivalence or public-specification correctness. Using the same oracle in both checks makes sampling consistent but does not create independent reference validation. Known reference conflicts remain visible in experiment reports. The legacy evaluator remains readable for historical campaigns but provides no authority for new-protocol results. Optional bounded waveform extraction can be unavailable without discarding raw VCD evidence.

## Alternatives considered

Keeping the original RTL monitor and adding only netlist acceptance still lets incorrect feedback drive repairs. Editing frozen historical testbenches destroys experimental identity. A separate RTL protocol preserves both evidence and consistent new scoring, at the cost of a new calibration and campaign rather than reusing old scores.

## Validation

Owner-local snapshot tests cover derived testbench text and manifest routing; changed manifests and testbenches are rejected. Real Vivado controls verify positive acceptance, faulty-DUT rejection, and rejection of unobserved required outputs. The RT-02 historical replay accepts the original correct Prob078 design and rejects the wrong historical PASS. Every newly scored task requires its own frozen positive/negative calibration.
