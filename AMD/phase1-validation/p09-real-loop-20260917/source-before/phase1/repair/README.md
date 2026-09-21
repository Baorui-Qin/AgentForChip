---
description: "Counter diagnostic replay and review-separated repair experiments."
kind: "package-reference"
---

# Counter Repair Development

English | [中文](README.zh.md)

## Summary

The repair application separates observed diagnostics, host proposal decisions and human execution approval. It uses fixed injected defects, not naturally generated failures. Two proposal attempts per case do not establish unattended repair, complete OS isolation, or Prob038 compatibility. Fixed negative fixtures remain unchanged.

## Profile and Commands

Install the files from the [rtl-repair profile](../profiles/rtl-repair/cordis.patch.yml) into a separate `DSH_HOME/profiles/rtl-repair` directory. Launch only through `dsh --profile rtl-repair`; the [PowerShell wrapper](run.ps1) and [shell wrapper](run.sh) forward commands to that launcher. The shipped profile is workspace-write with `allowReviewedFullAccess: false`. Real `start` and `resume` refuse execution until a host explicitly authorizes the reviewed development deployment. This documentation grants no such permission, and the application never falls back from partial isolation to full access.

| Command | Result |
| --- | --- |
| `replay` | Reads the host-configured `replayRun`; writes an independent diagnostic receipt without EDA or model requests |
| `start functional` | In an authorized deployment, calibrates a correct counter, verifies a fresh negative copy and requests a proposal |
| `start syntax` / `start synthesis-only` | Separate cases using the same evaluator and proposal limits |
| `status <experiment-id>` | Reads durable state without dispatching work |
| `approve <experiment-id> <sha256>` | Records a human safety decision for exactly the waiting candidate; does not execute it |
| `reject <experiment-id> <sha256>` | Terminates that case, preserving all evidence |
| `resume <experiment-id>` | Consumes one approval, verifies a new snapshot from compile and either terminates or proposes the next revision |

Profile overlays replace the complete plugin configuration; they are not partial merges. Replay requires only a readable historical run and writable artifact directory. The shell wrapper is a thin launcher, not a separately verified POSIX Vivado deployment.

## Facts, Policy and Approval

Schema 1.4 diagnostic receipts retain original result/log/asset hashes, parser version/source digest, process facts, source ownership and symptom kind. The shared completion parser preserves counts even when process failure prevents repair. Historical receipts use `evidence_kind=diagnostic_replay`, `eda_rerun=false`, `model_repair_executed=false`; the host proposal policy rejects replay evidence. Original 1.0/1.1/1.3 run records and 1.2 comparison experiments are not rewritten.

`decideRepair` accepts a calibrated, bound, complete functional mismatch without inventing a source line. DUT compile errors require recognized symptoms. Missing synthesis modules permit only the observed DUT primary plus recognized same-invocation top-level and command summaries. Other unknown errors block proposals. Testbench ownership alone is not proof of a tool incompatibility; declaration-order, dependency, language mode and consequential messages remain separate facts. A proposal decision never authorizes execution and does not change legacy `repairable_by_model` fields.

Each response is extracted without semantic correction into an exclusive revision with parent, response/source/feedback/configuration hashes. P05 keeps its TopModule interface; this workflow selects the counter interface from trusted code. Only public specification, current source and bounded observed feedback reach the model. Evaluator source, reference answers and human patch explanations do not. Human review is for execution safety, not answer editing or functional resampling.

For compilation, `VRFC 10-8530` is an accepted consequential message only when it names the current top and accompanies a recognized DUT primary error in the same file and invocation. It is not globally ignored. Real acceptance exposed this initially missing policy case; the original blocked experiment is retained, and any separately authorized supplementary run must be reported alongside it, not as a replacement result.

Approval binds the complete candidate identity and is one-use. Asset or configuration changes invalidate progress. Verification always starts from compilation in a clean snapshot; export reads the current verified snapshot and rechecks hashes. A different correct implementation can pass: equality to the handwritten solution is not a verdict condition.

## Budgets and Termination

The default profile allows at most two API attempts and three candidate verifications, plus calibration, without transport retries. The explicit development defaults are 60/60/30/120 seconds per EDA stage, 300 seconds per verification, 60 seconds per API request and 1200 seconds of active operation time per case. Human waiting is recorded separately. Model defaults are `deepseek-flash`, temperature 0 and 2048 output tokens; resolved provider/model/reasoning settings are frozen within the experiment. The model name is not a claim of a pinned cloud model version. No tool calls or extra interpretation requests are issued.

An authorized experiment can opt into `finiteLoop: true`: `maxSemanticRepairs: 3`, `maxTransportRetries: 2`, `transportBackoffMs: [1000, 2000]`, and `maxRepeatedDiagnostic: 3`. Each semantic round contains up to three separately recorded transport attempts. Only dispatched connection/timeouts or HTTP 502/503/504 failures with no observed text or reasoning can retry. Partial or complete answers, invalid RTL and failed verification never qualify. Every retry binds identical prompt content and resolved generation settings; provider message identity metadata is not prompt content. A cloud request may have continued after a timeout, so zero observed bytes do not prove zero server work or cost.

Finite-loop experiments use envelope schema 1.5, with native model 1.1 and EDA 1.3 records unchanged. They stop on any repeated candidate hash, three consecutive identical primary diagnostics, exhausted semantic/active budgets, invalid output, rejected review or blocked evidence. `controlled_multi_round` and `controlled_multi_round_reset` each contain a compile defect plus a separate functional defect; they are repair-only `state_machine_acceptance` fixtures and use the unchanged counter evaluator. Initial generation is zero. The minimal-change prompt exposes only current evidence, not the latent defect or a patch. One-shot success is retained, never deliberately damaged to force another round.

The host persists an in-flight state before dispatch. Concurrent commands are locked; interrupted operations are not automatically repeated. A dead owner with an incomplete or inconsistent lock/state needs host investigation. Pending approvals cannot resume execution. Cancellation and unload join the managed live subprocess tree. Abrupt host termination is not proof that an orphaned EDA process has exited; stale-process investigation remains a host responsibility before another experiment.

Distinct terminal outcomes cover verified repair, proposal budget, active/artifact budget, unchanged source, invalid response, API error, rejected review, cancelled/interrupted work, calibration failure and blocked evidence. Process/log limits remain enforced by the existing runner; post-operation experiment-size checks are detection, not OS disk quotas. A successful design verdict is separate from a correctly recorded terminal failure.

## Evidence and Verification

Experiment state snapshots are append-only numbered events; native model events retain exact requests and responses. Each terminal case publishes `repair-result.json`, `repair-report.json` and bilingual reports with stage results, version hashes, available usage, model/EDA time and human waiting. Missing price and TTFT stay null. Interrupted/incomplete evidence can produce `report-incomplete.json` rather than an invented report.

Tests cover proposal/review/resume through the real Loader with Mock services, two-round termination, source binding, replay provenance, declaration-order diagnostics, recognized synthesis summaries and unknown-error rejection. Existing RTL and comparison tests remain separate from real model evidence. Real acceptance must use fresh negative executions and actual reviewed model candidates; historical replay and Mock success cannot replace it. The current deployment still needs explicit host execution authorization and per-candidate human review.
