# Agent Note: Calibrated VerilogEval netlist rules

Status: implemented

English | [中文](2026-09-27-p10-netlist-suite.zh.md)

## Problem

Enabling a netlist checker by task name alone can turn an untested timing adapter into scoring authority. RTL testbench scheduling, FPGA startup and reference-only initialization can also reject valid hardware or accept an empty comparison.

## Decision

The [builder](../../../../rtl-tools/src/phase1/p10-netlist-suite.ts) derives Host-only reference scoreboards from pinned dataset bytes, independently of the upstream RTL monitor. Stimulus feedback observes the reference, not the candidate. Explicit stimulus-local random seeds remove elaboration-dependent random sequences. Startup waits for GSR/GTS release; data is held across clock events and sampled after UNISIM settling. Physical clocks and the reviewed latch enable are not delayed with data. Leading procedural declarations retain legal block scope.

Reference X/Z bits are explicitly outside an assertion, not successful comparisons. Every required output bit must become known at least once; known reference bits reject DUT X/Z. Only Prob094's publicly unspecified `out_both[3]` and `out_any[0]` are exempt from observation. Live acceptance and independent receipt auditing reject coverage-error markers even with zero mismatches. Check counts come from a fresh reference RTL control and must match netlist execution. These finite comparisons do not prove the reference specification or unobserved behavior.

The XOR-feedback task uses its public recurrence instead of the hidden reference's initial-zero convention. It permits either known initial state, then independently checks transitions and hold behavior. Both initial-zero and initial-one synthesized controls pass. Its negative control is stuck-zero, because output inversion preserves this recurrence when the initial state is unconstrained.

The [calibrator](../../../../rtl-tools/phase1/p10/calibrate-netlists.mjs) makes no model calls and retains frozen inputs, positive controls, injected-output negative controls and raw tool evidence. Archived netlists are read-only control inputs, never inherited PASS results; they execute the new checker and failures also trigger fresh reference synthesis. The [publisher](../../../../rtl-tools/phase1/p10/publish-netlist-profiles.mjs) independently audits evidence before emitting enabled profiles. Replacing a calibration requires an explicit task list and retains the superseded root and profile hash. Task, public-spec and dataset hashes select profiles; unknown or ambiguous interfaces fail closed.

The [RT-01 acceptance decision](../bug-fix/2026-09-27-p10-netlist-acceptance.md) remains authoritative for candidate policy, receipts and shared Baseline/Agent scoring. This decision replaces its three-task coverage restriction, not its acceptance protocol. The [RTL portability decision](../bug-fix/2026-09-18-p10-reviewed-compatibility.md) remains active; netlist calibration does not repair that evaluator's scheduling.

The [public-interface errata](../../../../rtl-tools/src/phase1/p10-interface-errata.ts) apply the user's explicit approval to exact prompt hashes, without reading reference implementations: Prob031's `q` is an output and Prob062's `out` is eight bits. New catalogs, calibration provenance and logged generation/repair constraints carry the same interpretation; original text and historical catalogs remain intact. Rule selection refuses missing or changed erratum metadata. Calibration freezes an effective catalog separately, not an edited historical file. This avoids giving the evaluator a corrected interface while leaving either model arm with only the contradictory prompt.

## Alternatives considered

**Enable every generated testbench immediately.** Successful generation does not establish valid scheduling or a working comparator. Only completed positive and negative real-tool calibration authorizes publication.

**Reuse the upstream monitor or compare unknowns as equal.** Neither establishes hardware behavior after FPGA startup. Settled sampling and per-bit observation requirements reject empty evidence without inventing expected values for reference X/Z.

**Infer contradictory public interfaces from the reference.** Hidden answers cannot silently repair the public task. Ambiguous tasks remain visible and blocked pending a separately reviewed erratum.

**Always synthesize a new control.** Fresh reference RTL plus independently rehashed archived synthesis outputs reduces calibration cost. Fresh synthesis remains the fallback; archived model outputs do not become ground truth or new model scores.

## Consequences

Generated profiles are reproducible, dataset-bound and auditable. Tests cover comment-safe rewriting, procedural scope, clock hold, unknown-bit handling, hash binding and publication failures; real Vivado controls remain external evidence. Profiles contain trusted reference material and remain Host-only. Only approved public errata enter model prompts, with keyless snapshots verifying identical generation and repair task information; no repair budget or hidden-test feedback is added. Output fault injection proves comparator sensitivity, not comprehensive mutation coverage. Formal equivalence, reference correctness and RT-02 remain separate work.
