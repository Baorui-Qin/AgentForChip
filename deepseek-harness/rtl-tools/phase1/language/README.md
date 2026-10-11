---
description: "Vivado language selection, diagnostic ownership and versioned invocation evidence."
kind: "package-reference"
---

# Vivado Language and Diagnostics

English | [中文](README.zh.md)

The Phase 2 runtime baseline is Vivado 2026.1, selected by [dev.yaml](../configs/dev.yaml). Historical Phase 1 experiments and fixtures retain their 2025.2 provenance. New snapshots, compatibility suites and evaluator identities use the configured version; future Static Knowledge uses `{"tool":"vivado","tool_version":"2026.1"}`. See the [migration report](../../../../../docs/vivado-2026.1/report.md) for live validation scope and remaining failures.

## Summary

Vivado simulation and synthesis share explicit language resolution. The host retains source roles and command evidence without granting the model new parameters or changing evaluator assets. This layer identifies diagnostic ownership, not inferred root causes or automatic repairs.

## Configuration

Ordered source entries accept strings or `{ path, language?, role? }`. Languages are `verilog` and `systemverilog`; roles are `dut`, `reference` and `testbench`. Trusted task-wide language takes precedence, followed by file language and extension (`.v` or `.sv`, case insensitive). Conflicting task/file declarations, `.sv` forced to Verilog and unknown extensions without explicit language fail before tool startup. Synthesis defaults roles to DUT and rejects other roles. Fixed fixture and dataset registries supply evaluator roles; they do not accept model-provided manifests.

The [synthesis overlay](../../cordis.synthesis.patch.yml) demonstrates explicit SystemVerilog and DUT ownership. Existing string arrays remain supported. Icarus configuration is independent and unchanged.

Mixed-language simulation keeps contiguous groups in original order. Each SystemVerilog group gets `xvlog -sv`; Verilog groups omit the flag. Groups and version probes share the compile-stage deadline. A failed group prevents all remaining groups and downstream stages. A task requiring a common compilation unit must explicitly select one language; this layer never sorts sources or automatically retries with another language.

Synthesis reads DUT files with `read_verilog` or `read_verilog -sv` using the same resolution. `xelab` receives no language flag. Prob038 explicitly uses SystemVerilog with DUT/reference/testbench order, top `tb`, seed 1 and unchanged original timing; the synthesis XDC remains 5 ns. Source roles, effective languages, provenance, order and grouping are bound into snapshot manifests and verification hashes; changed evaluator settings invalidate existing approvals.

## Evidence and Attribution

New verifier events, snapshots, stage and terminal records use project schema 1.3. Readers retain 1.0/1.1; model records remain 1.1 and comparison envelopes remain 1.2. Harness Session generations are unchanged. Each invocation records resolved executable, tool arguments, Windows wrapper arguments, policy-wrapped launch, source metadata, language mode, process outcome and relative stdout/stderr paths.

Version probes preserve their actual exit codes. Observed Vivado 2025.2 and 2026.1 version banners can have exit code 1; this informational allowance applies only to `-version`, never compilation or other design execution. Aborted, timed-out, signalled or truncated probes cannot establish readiness. The reader checks probe evidence and invocation/process consistency.

Diagnostic records preserve message id, severity, location and bounded message text. Raw logs remain the source for exact original formatting. `origin` names manifest ownership; `attribution` distinguishes DUT compile/synthesis errors, testbench/reference compatibility, language configuration, Harness configuration, tool environment and unknown failures. Source matching uses exact normalized paths, never a `/trusted/` substring or basename guess.

A normally exited simulation with one nonfatal, consistent completion record and positive mismatch count reports `category=functional_mismatch`, failed/total checks and `failure_domain=design`. This is an observed mismatch, not a Harness configuration error. Aggregate counts cannot locate a defect, so origin/attribution remain unknown, file/line remain null and repair eligibility remains false. Missing, duplicate, fatal or inconsistent verdicts report `simulation_evidence` and INCONCLUSIVE, not a confirmed functional failure. Downstream synthesis is SKIPPED, not failed. Raw historical records are not rewritten when diagnostic wording is corrected.

`repairable_by_model` is true only for complete compile/elaborate/synthesis evidence whose errors all point to DUT files and contain no observed environment failure. Mixed ownership, missing locations, omitted diagnostics, truncation or cancellation disable repair eligibility. This flag grants no execution authorization. A testbench compatibility label attributes the reported location; it does not prove the compiler or testbench violates a language standard.

Bounded diagnostics and metrics enter model-visible output; full invocation metadata and capped raw logs remain in project records. Output limits stop execution rather than silently dropping evidence and returning PASS. Existing stage, total, cleanup and disk-audit budgets apply; polling is not an OS quota and hashes are not write isolation.

The [counter repair application](../repair/README.md) keeps a separate host proposal policy and schema 1.4 normalization receipt. It can request a functional repair without a reported source line, but only from calibrated live evidence and with separate human authorization before execution. Runtime testbench messages are not automatically labelled compile compatibility failures; unclassified host failures remain unknown rather than configuration errors.

## Sources

- [AMD Vivado 2026.1 UG900](https://docs.amd.com/r/2026.1-English/ug900-vivado-logic-simulation/xelab-xvhdl-and-xvlog-xsim-Command-Options) owns command semantics, including the xvlog SystemVerilog flag.
- [Edalize Vivado source](https://github.com/olofk/edalize/blob/9a6f648c596bfe74224ae82f529075e565d4182b/edalize/tools/vivado.py), commit `9a6f648c596bfe74224ae82f529075e565d4182b`, declares BSD-2-Clause and explicitly maps source types to `read_verilog`/`read_verilog -sv`. This implementation borrows the design, not source code or framework dependencies.
- [Edalize legacy XSim source](https://github.com/olofk/edalize/blob/main/edalize/xsim.py) provides contextual examples of `sv`/`verilog` project entries and compilation units. Its API is deprecated; it is not an adopted runtime or pinned implementation dependency.
- AMD community suggestions remain unverified unless their full text, version and a local reproducer are available. No community workaround for Prob038 is claimed. Suggested changes are tested only in separate handwritten reproducers, never by editing original benchmark assets.

## Verification

The [Phase 1 checks](../README.md#verification) cover language resolution, conflicts, ordered groups, command preflight, attribution, legacy readers, Loader transcripts, output limits, deadlines and cancellation. The fixed fixture catalog includes a SystemVerilog counter using `logic`, `bit` and `typedef struct packed`, and a plain `.v` counter using ordinary Verilog. Real tool evidence is separate from Mock results.

Prob038 preflight retains its original testbench and reference. If `VRFC 10-3380` persists at the testbench declaration, verification records a compatibility failure and skips later stages. Successful handwritten fixtures do not establish Prob038 compatibility, P07/P08 repair readiness or full OS isolation.
