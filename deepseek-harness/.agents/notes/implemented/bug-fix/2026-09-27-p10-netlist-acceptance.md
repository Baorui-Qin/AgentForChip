# Agent Note: P10 netlist acceptance for RT-01

Status: implemented

English | [中文](2026-09-27-p10-netlist-acceptance.zh.md)

## Problem

RTL simulation can execute logic hidden from synthesis by metacomments. A successful synthesis process therefore cannot establish hardware behavior, even after a passing RTL simulation. RT-01 demonstrates a wire evaluator passing a DUT whose synthesized output is constant zero.

## Decision

The [candidate policy](../../../../rtl-tools/src/phase1/p09-auto-policy.ts) rejects synthesis-control metacomments before comment stripping, including bare `translate_off/on` and `synthesis`, `synopsys`, `pragma` or `xilinx` prefixes. It preserves submitted bytes and source locations. Generation corrections and rejected tool actions use existing bounds; no accepted edit or EDA invocation is charged for a rejected source.

The [P10 checker](../../../../rtl-tools/src/phase1/p10-netlist.ts) adds a versioned acceptance receipt instead of changing the four-stage durable schema. It binds the original sealed run, source, netlist, Host-owned oracle, library and process evidence. Exact-spec profiles require the calibrated Windows Vivado 2025.2 library; the [suite calibration decision](../testing/2026-09-27-p10-netlist-suite.md) owns coverage beyond the wire, NOT and synchronous-reset DFF8 public-spec controls. Explicit GSR startup, case-inequality comparisons and fixed positive check counts prevent unknown DUT values at asserted bits or empty simulations from becoming success.

The same receipt authorizes Baseline, Agent, export and reports. Mismatches stop with a design-validation terminal state; they do not imply an exhausted netlist repair opportunity. Unsupported identities fail closed without dropping tasks. The [portability decision](2026-09-18-p10-reviewed-compatibility.md) still owns evaluator derivation; this decision replaces four-stage success as sufficient P10 export authority, not that adapter or historical receipts.

## Alternatives considered

**Strip directives or forbid all initialization.** Stripping changes the candidate being scored. A blanket initialization ban rejects legitimate FPGA designs and does not address all divergence mechanisms.

**Only deny known directives.** This closes a demonstrated vector but cannot establish synthesized behavior. A separate netlist check remains necessary.

**Add a fifth shared stage or formal equivalence now.** Both expand unrelated legacy contracts and tooling. A P10 receipt keeps this fix narrow; finite oracle coverage is explicitly weaker than equivalence.

**Reuse every testbench without calibration.** GSR and startup timing can invalidate RTL-era assumptions. Exact-spec profiles and pinned libraries trade coverage for an auditable acceptance standard.

## Consequences

Focused tests cover all candidate entrances, unchanged edit budgets, netlist error classifications, stale netlists, library identity, modified receipts and missing-success evidence. Real tool calibration and its logs live in the external RT-01 validation batch, not model scores. Historical candidates are scanned read-only; historical results are not rewritten.

Initialization calibration does not authorize arbitrary stateful tasks; each enabled rule needs its own evidence. Acceptance adds a separately recorded bounded EDA cost; model and repair budgets are unchanged. RT-02, hidden-test correctness, full OS isolation and formal RTL/netlist equivalence remain unresolved. New runs and old four-stage results are different experimental standards.
