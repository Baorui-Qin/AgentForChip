---
description: "Freeze VerilogEval task selection and preflight original evaluators without model calls."
kind: "package-reference"
---

# P10 Evaluator Preflight

English | [中文](README.zh.md)

## Summary

P10 checks whether the pinned local VerilogEval evaluators can run before spending model budget. It freezes ten publicly selected tasks and the complete forty-task expansion order. It tests the unchanged reference and testbench with a transparent host-generated port wrapper. Preflight is not a model result and cannot authorize a candidate export. A zero-evaluable pilot stops with NO-GO and leaves both model routes and the forty-task campaign unrun.

## Table of Contents

- [Profile](#profile)
- [Selection and Identity](#selection-and-identity)
- [Verification and Reports](#verification-and-reports)
- [Implementation](#implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

<a id="profile"></a>
## Profile

The [rtl-p10-preflight profile](../profiles/rtl-p10-preflight/cordis.patch.yml) mounts the subprocess, session projection and sandbox policy services, but no model service. The preflight plugin rejects a composition that supplies an LLM. Its only command is `preflight`, launched through dsh with this profile and a complete host-owned overlay. Profile overlays replace the whole plugin configuration; they do not merge its fields.

The host supplies dataset, campaign, configuration and freeze paths plus finite process and artifact limits. The shipped profile refuses unisolated execution. An explicitly approved development run requires both `allowUnisolatedPreflight: true` and a full-access policy. Those settings permit execution; they do not establish OS isolation. The campaign records `full_os_isolation_verified=false`.

<a id="selection-and-identity"></a>
## Selection and Identity

The dataset must have the pinned NVlabs origin, revision `c498220d0a52248f8e3fdffe279075215bde2da6`, a clean worktree and 156 prompt/reference/test triplets. Every asset is checked against its Git blob and given a raw-byte SHA-256. Git-declared LF-to-CRLF checkout conversion is allowed only for blob identity comparison; evaluator bytes and the public prompt are never rewritten. Other content changes stop the campaign.

The [selection rules](../../src/phase1/p10-dataset.ts) fold public-prompt whitespace and case only for matching. They choose each category's first unselected task in task-ID order. The next thirty tasks use ascending SHA-256 of `p10-verilogeval-v1:20260917:` plus task ID. Selection precedes EDA. The ten-task manifest has a separate hash receipt; selection-order.json precommits forty entries without authorizing a forty-task run. Prob038 is a separate sentinel outside the selected denominator.

The public port parser accepts named input/output ports with constant numeric widths, including whitespace inside the width annotation. Unsupported declarations stop that task without guessing. One scalar clk or clock input defines a 5 ns physical clock; no such input selects a 5 ns virtual clock. Multiple recognized clocks are unsupported. This is a bounded development policy, not an official benchmark timing configuration.

<a id="verification-and-reports"></a>
## Verification and Reports

Host-only preflight registers original reference/testbench bytes and a pure TopModule-to-RefModule wrapper. It reuses the ordinary VerificationRunner for compile, elaborate and simulation, stopping on failure and never requesting synthesis. Success requires complete simulation, positive checks and zero mismatches. Even successful preflight records remain unverified and cannot become a four-stage candidate PASS. Ordinary candidate verification still requires synthesis.

Reports distinguish EVALUATOR_READY, TESTBENCH_COMPATIBILITY_BLOCKED, REFERENCE_COMPATIBILITY_BLOCKED, TOOL_ENVIRONMENT_BLOCKED and INCONCLUSIVE. Raw diagnostics preserve source attribution. An unsupported public interface is INCONCLUSIVE without EDA evidence. JSON/CSV results, compatibility and error tables, trajectory index and GO/NO-GO record every selected task. With no model dispatches, model statuses are NOT_RUN, per-route usage is null, and empty-denominator rates are null rather than zero percent.

The entrypoint never automatically starts models or the forty-task campaign. Each task has a permanent claim. A campaign directory cannot be reused. Source/configuration hashes and dataset identities are checked before and after execution. A changed Harness requires a separately frozen campaign rather than merged results. EDA manifests are generated after terminal records and closed logs; the final campaign archive requires its own complete file-size and hash audit.

<a id="implementation"></a>
## Implementation

<details>
<summary>Host-only implementation</summary>

[p10-preflight.ts](../../src/phase1/p10-preflight.ts) owns the serial campaign. [p10-dataset.ts](../../src/phase1/p10-dataset.ts) owns deterministic selection, public interfaces and original-asset binding. [p10-report.ts](../../src/phase1/p10-report.ts) separates evaluator outcomes from unrun model routes. [verification.ts](../../src/phase1/verification.ts) shares process cleanup, diagnostics, quotas and recording with candidate verification. The core agent loop and HTTP transport are unchanged. The [decision note](../../../.agents/notes/implemented/feature/2026-09-18-p10-evaluator-preflight.md) explains the preflight boundary.

</details>

<a id="model-experience"></a>
## Model Experience

No model-visible tools or requests are available in this profile. Reference wrappers and calibration receipts are Host evidence only. [P09](../p09/README.md) documents the separate existing autonomous repair experience; its existence does not establish P10 generation or repair scores.

<a id="known-limitations-and-deferred-work"></a>
## Known Limitations and Deferred Work

The implemented boundary is evaluator preflight, not the model comparison campaign.

- The model comparison remains a separate explicitly frozen campaign. Preflight itself still has no model route, repair tools or score authority.
- A passing evaluator alone is not GO. The complete ten-task comparison and mandatory audit are required before an independent forty-task campaign.
- Testbench/reference compatibility changes, local models, ROCm, offline deployment, complete OS isolation and implementation timing closure are outside this acceptance.

<a id="dev-note"></a>
## Dev Note

Live outcomes, startup failures and version-specific audits belong in the independent validation directory. Tests and generated wrappers are not substitutes for real evaluator execution or model evidence.

## Reviewed Compatibility Campaign

The separate [compatibility builder](../../src/phase1/p10-compat.ts) accepts only eleven reviewed raw-byte hashes. It moves two complete net declaration lines within `tb`, retaining every other byte, and publishes the derived TB, unified diff, reversible line map and provenance outside the dataset. [Compatibility preflight](../../src/phase1/p10-compat-preflight.ts) remains model-free. It records declaration-only probe failures before enabling an evaluator-specific `1ps/1ps` default when real xelab diagnostics require one. Explicit timescales are never overridden. Positive reference delegates and independent faulty DUTs must both demonstrate the expected simulation verdict; neither is a model score.

The [model profile](../profiles/rtl-p10-model/cordis.patch.yml) exposes `generate <task-id>`, `compare <task-id>` and `repair-control <task-id>`. Generation makes one text-only request with no feedback or skills; its Host tokenizer may use a managed subprocess. Comparison scores that immutable source once, then reuses P09 tools, tokenizer, validated skills and diagnostics for bounded repair. Host scoring and generation are separate commands. Repair-control starts from a copy of the negative DUT and is excluded from model scores. All scoring reads the same frozen derived evaluator; DUT-only synthesis and reference-dependency rejection prevent calibration wrappers from becoming candidates. Exports require current four-stage verification, matching source hashes and mandatory [netlist acceptance](#netlist-acceptance).

These development commands require explicit full-access authorization and retain `full_os_isolation_verified=false`. P10 permits at most two same-wire transport retries with frozen 1000/2000 ms backoff and one output-recovery request per logical request. Only connection failures, 502/503/504 responses and request-level timeouts with zero response bytes are transport-retry eligible. User cancellation and the 1200-second activity limit are terminal. A truncated response or tool call is never executed; recovery retains the model, task, source and bound feedback and records both request hashes. Repair recovery uses the action-only settings below. Recovery dispatches never increment semantic repair count.

After an accepted `edit_dut`, both the advertised schema and Host validator expose only `verify_rtl` until that exact new revision is verified. A repair attempt is valid only when its persisted record proves a failed baseline, live feedback bound to the edited source, an accepted changed source SHA, verification of the new revision and a hashed Vivado `result.json`. The independent [campaign auditor](audit-p10-campaign.mjs) rejects repair gain if shared initial hashes differ, a counted attempt lacks that chain or required result evidence is missing. [run_p10_10.ps1](run_p10_10.ps1) is the explicit fixed-ten entrypoint and prints the implementation, legacy-route state, manifest identity and frozen recovery settings before execution.

The campaign never automatically expands the compatibility suite or authorizes forty tasks. New rules or protocol changes require separately frozen campaigns. The original preflight entrypoint and historical results remain unchanged.

## Full Dataset Compatibility Suite

The Host-only [suite builder](../../src/phase1/p10-compat-suite.ts) accepts the Git-verified full catalog and an explicit reproducible build epoch. [Rule 001](../../src/phase1/p10-compat-rule.ts) masks comments and strings, checks unique declarations and the complete known module prefix, then moves two existing complete lines. Nonmatches remain byte-identical; ambiguous scopes and templates stay in the manifest as manual-review tasks. Static matching does not imply a Vivado verdict. Each task retains the original and effective SHA, revision, rule version, converter-source digest, diff and reversible line map.

The model-free [suite preflight entry](../../src/phase1/p10-suite-preflight.ts) uses `calibrate` to build twice and compare every artifact, then run declaration-only probes and positive/negative controls for Prob005 and Prob038. Host read-only sealing follows successful calibration. `preflight` requires that seal and a verified write/create/delete denial receipt, then uses the original fixed ten-task manifest without reselection. Each invocation owns a private snapshot and build directory. Detailed tool results remain outside the immutable build manifest; unexecuted tasks remain `NOT_RUN`.

The existing shared evaluator loader selects full-suite mode by its marker and rejects unsealed or altered assets. It never transforms TB bytes while scoring. Baseline and Agent identities include the task, upstream revision, compatibility version, effective TB SHA, suite-manifest SHA and Vivado version in snapshot/verification inputs. This evaluator migration does not change Agent strategy, prompts, skills, model settings or repair budgets. [The suite decision](../../../../.agents/notes/implemented/bug-fix/2026-09-18-p10-full-compat-suite.md) defines the conservative review tradeoff.

<a id="generation-stability-and-tool-evidence"></a>
## Generation Stability and Tool Evidence

[prepare-stability.ps1](prepare-stability.ps1) creates a new fixed-ten campaign, freezes source/configuration/evaluator hashes and reuses the explicitly named positive/negative calibration. [generation-stability.mjs](generation-stability.mjs) runs `generation`, `compare`, `smoke` or `report` with campaign-root and repository arguments. It launches models only through the existing dsh profile. Generation precedes comparison; comparison requires all ten candidates. The first exhausted transport window opens the circuit, waits the frozen 15 seconds and makes one separately accounted provider health probe. An unhealthy probe leaves subsequent tasks unstarted. A healthy probe permits `resume-generate <task-id>` on that same task, with at most one resume by default (`maxGenerationResumes`, maximum two). No complete or partial-output response is eligible for this resume. Activity cancellation remains terminal. A process interrupted before recording a terminal result requires manual review, not automatic regeneration.

Legacy generation retains one logical request, its original experiment identity, immutable per-window results and every physical attempt. Resume checks the same request hash and source freeze. The latest result is an atomic pointer replacement, not an edit of prior evidence. Already acquired candidates are never regenerated. Repair-v4 adds separately bounded candidate corrections; the historical one-pass runner and old campaigns are not mutated.

Each model run includes `transport.json`: request preparation, stream invocation, observed HTTP response/provider activity, first output, usage, finish and successful complete response. Legacy `dispatched` means stream invocation only. A locally normalized error finish is not server activity. Node fetch diagnostics retain only allowlisted network codes and HTTP status, scoped to the call's async context. Unavailable network details remain null; absence of an HTTP observation does not prove the server never received the request.

P10 writes `tool-trace.jsonl` with available/selected tools, acceptance or rejection, revision changes, timestamps and `HOST_INITIAL` versus `AGENT_TOOL` verification. Stage execution comes from non-version process invocations, with result and simulation-log hashes and check/mismatch counts. Canonical `feedback_sha256` identifies the full diagnostic receipt; `feedback_projection_sha256` identifies the bounded feedback actually serialized into the request. `consumed_feedback_sha256` is recorded only when that request produces observable model output. It proves request binding and response activity, not the model's internal use of the feedback. A final PASS followed by no model call has no consumed-feedback claim.

Reports separate candidate acquisition, end-to-end evaluated completion and model-evaluable performance. Unstarted/infra-paused tasks remain visible without being counted as DUT failures; zero natural repair opportunities produce a null repair rate. The [decision note](../../../.agents/notes/implemented/bug-fix/2026-09-21-p10-transport-evidence.md) records the sampling and observability tradeoffs.

Explicit `prepare-stability.ps1 -Forty -CampaignRoot <new-directory>` authorization uses the SHA-pinned historical forty-task manifest in its original order. It checks and merges the four historical groups' sealed calibrations without reusing model candidates. `selectedTaskCount` defaults to ten and requires an explicit forty-task configuration to expose later tasks. The frozen forty-task configuration allows two independent EDA jobs, at most 375 campaign dispatches, and continues after terminal model-output failures while retaining the same infrastructure circuit. The `all` stage generates before comparing valid candidates; failures and unstarted tasks stay in the forty-row denominator. Historical scripts and results are not overwritten.

Every text and tool request writes `stream.jsonl` incrementally before response validation, including the chunk that triggers a limit or rejection. It contains ordered, timed Harness-normalized provider chunks, not raw HTTP/SSE bytes. `reasoning.txt` and `output.txt` project the returned text, including partial responses; `transcript.json` records byte counts, SHA-256 hashes, completion and whether reasoning was returned. Tool arguments remain in the stream and assembled model response; Host execution results remain in the tool trace and verification artifacts. No unpublished/internal reasoning is available, and credentials, headers and unsafe transport exception text are excluded. Existing token, byte and timeout limits still terminate requests and are reported as incomplete, not silently treated as complete archives of an unlimited response.

<a id="repair-v2"></a>

The [evidence recovery decision](../../../.agents/notes/implemented/bug-fix/2026-09-22-p10-evidence-recovery.md) defines repair-v3 campaigns. Stream-envelope size is not an output limit; token, response-byte and timeout limits remain active. A thinking-disabled tool turn is replaced by the persisted Host tool result in the next request's factual core, rather than replayed into thinking mode. The latest tool result also survives compaction. Candidate rejection records distinguish response, extraction/interface and RTL-policy failures.

Diagnostic completeness comes from retained raw logs, source hashes, parser limits and process facts, not the capped stage summary. Elaboration uses the same run's trusted compilation source paths for ownership. Only complete DUT procedural-driver failures with the exact same-invocation XSIM elaboration summary gain the dedicated repair rule; unknown, evaluator and environment errors remain blocked. Historical replay cannot authorize execution.

Explicit `prepare-stability.ps1 -Hundred -PreflightRoot <calibrated-root> -HundredManifestSha256 <hash> -CampaignRoot <new-directory>` requires a unique, SHA-pinned `manifest-100.json`, matching selection order and 100 evaluable positive/negative calibration rows. The caller freezes the selection and exclusions before model outcomes. This mode allows two comparison workers and retains the global cap of 375 campaign dispatches. `selectedTaskCount` accepts up to 100 but still defaults to ten; manifest presence alone does not expand execution authority.

## Repair V2

This section describes historical v2/v3 budgets. New stability preparations use the Repair V4 limits below instead of the three-edit cap and legacy activity deadline.

New campaigns freeze `repairMaxTokens=16384`, `forcedActionMaxTokens=4096`, `repairMaxResponseBytes=262144`, `compactThreshold=0.8` and `maxRepairRounds=3`. Initial generation keeps its separate `maxTokens=8192` budget. These are total completion-token limits, not a separate reasoning-token quota. The provider interface does not expose a 12000-token mid-stream action deadline or required tool-choice flag. Truncation switches to `reasoningEffort=off`, removes `finish`, requests one complete tool call and rejects non-action responses; it cannot guarantee provider compliance. Recovery never executes partial tool arguments and has no unlimited retry path.

The action caller measures the complete wire with the pinned counter. At the threshold or local overflow it removes completed assistant/tool history and optional diagnostics/skills, then remeasures. Current source, source SHA, verification binding, blocking failure, best revision and factual repair/rejection ledger remain intact. Explicit provider context-overflow errors allow one compact retry per logical request. An oversized mandatory core, cancellation, timeout, dispatch cap or tool-step cap still stops the run; compaction does not reset any budget.

Simulation feedback retains bounded raw XSim hints, output names, mismatch counts and reported first-failure times. An existing `build/wave.vcd` supplies at most three timestamp-level samples around the earliest reported failure, with top-level signals and paired `*_ref`/`*_dut` outputs; reference-module internals are excluded. The supported XSim subset requires a 1ps timescale and bounded bytes, signals and widths. Missing or unsupported waves are explicit optional-evidence gaps, not new verdicts. VCD end-of-timestamp values can differ from values sampled by the testbench in the same timestamp. Feedback never invents cycles, sampled expected/actual values or root causes. Raw logs and waveform hashes remain in the receipt.

The host retains the best observed revision against the same frozen evaluator. Complete PASS outranks synthesis failure, simulation mismatch, elaboration failure and compilation failure. Simulation mismatch counts are comparable only with equal sample counts. A worse or tied candidate restores the best source, revision and receipt before another edit, and its SHA enters the rejection cache. Incomparable or incomplete evidence restores the incumbent but stops for investigation rather than hiding infrastructure failure. Every decision preserves the rejected candidate and verification artifact. `best-observed.sv` is a recovery artifact, not a passing export; only bound final PASS writes `final.sv`. `revision_decisions`, `rejected_revisions` and `context_compactions` support campaign audits. See the [repair decision](../../../.agents/notes/implemented/feature/2026-09-21-p10-repair-v2.md) for limits and verification.

<a id="repair-v4-and-all-task-campaigns"></a>
## Repair V4 and All-Task Campaigns

New stability preparations use independent caps: 15 accepted RTL edits, 60 tool actions and 120 repair request attempts per task. Zero-output transport retries, forced-action and context recoveries consume the same request allowance, not the edit allowance. Policy, request, tool, cancellation and campaign stops remain distinct. Fifteen is a maximum, not a promise to continue after verified success or invalid evidence. Leading/trailing-whitespace variants of the current or rejected source cannot consume another edit round. P09's historical request defaults remain unchanged.

Generation selects the first legal candidate, not the first complete response. At most two candidate corrections follow empty, truncated, partially received transport-failed or rejected complete RTL responses. Each correction uses `reasoningEffort=off`, 16384 completion tokens and 262144 response bytes, with the unchanged public task, Host rejection and archived previous response/reasoning in the logged request. Previous model text is untrusted draft material. Only complete, validated, single-module RTL reaches EDA. Authentication, configuration and rate-limit errors are not candidate corrections. This bounded acquisition protocol is not strict one-call pass@1.

Explicit `prepare-stability.ps1 -AllTasks -PreflightRoot <root> -FullManifestSha256 <hash> -MaxDispatches <authorized-cap> -SettingsFile <settings> -CampaignRoot <new-root>` requires all 156 unique task IDs in frozen order and a calibration row for each. Uncalibrated tasks with valid public interfaces may generate candidates but cannot be scored. Interface conflicts and evaluator exclusions stay in the 156-row denominator. Public parsing accepts trailing list commas and a unique inline module, without silently repairing contradictory task text or inferring ports from references. Legacy ten/forty/hundred selection remains available; `selectedTaskCount` now accepts at most 156.

The campaign cap defaults to 375; an explicitly authorized value can raise it to at most 20124. With generation resumes and probes disabled, the all-task bound is `156 * (3 * 3 + 120)`: initial generation plus two corrections, each with at most two zero-output transport retries, and 120 repair attempts. All physical dispatches share one claim ledger. The eight-hour per-task activity ceiling accommodates request and verification maxima without extending individual deadlines. The supplied settings must freeze synthesis at 600000 ms for the authorized ten-minute run; total verification is 900000 ms. Two comparison workers stop scheduling after an execution/evidence failure and await active work. Changes require a new frozen campaign. See the [decision note](../../../.agents/notes/implemented/bug-fix/2026-09-23-p10-candidate-budget.md).

<a id="netlist-acceptance"></a>
## Netlist Acceptance

P10 uses `acceptance_protocol=p10-netlist-1`. Candidate generation, recovery, edits and verification reject synthesis-control metacomments before comment removal, without rewriting source. `RTL_SYNTHESIS_DIRECTIVE_REJECTED` retains the comment's line and directive. Rejected edits consume a tool action, not an accepted RTL modification. Ordinary comments, identifiers and legal initialization remain permitted.

Only four-stage successes enter the [netlist-only checker](../../src/phase1/p10-netlist.ts). It reuses the sealed synthesis output and compiles no original DUT. The original public-spec wire, NOT and synchronous-reset DFF8 oracles coexist with [calibrated dataset-bound profiles](../../src/phase1/p10-netlist-calibrated.ts), using the hash-pinned Windows Vivado 2025.2 UNISIM library. Task/spec mismatches and changed dataset assets fail closed. Hidden references cannot authorize silent interface corrections.

The [approved public errata](../../src/phase1/p10-interface-errata.ts) bind exact prompt hashes: Prob031 treats `q` as a one-bit output; Prob062 treats `out` as an eight-bit output. Raw prompts and dataset files remain unchanged. New catalogs record the corrected interface and approval; generation and repair receive the same public explanation in logged task constraints. Calibration freezes a separate effective catalog, and these two rules require matching erratum metadata. Old frozen catalogs and scores are not retroactively upgraded; new experiments need a new preflight and freeze.

The [suite builder](../../src/phase1/p10-netlist-suite.ts) uses pinned reference behavior and stimulus, not the upstream racing monitor. GSR/GTS release precedes stimulus at 101 ns. Data has a 0.1 ns hold delay except physical clocks and the reviewed latch enable; samples occur 0.5 and 4.8 ns after each half-cycle. Stimulus has explicit random seeds independent of DUT elaboration and observes reference feedback only. Reference X/Z bits are unasserted, each required output bit must become known, and DUT X/Z fails wherever the reference is known. Prob094 explicitly leaves `out_both[3]` and `out_any[0]` unspecified; only those two bits are exempt from observation. A coverage-error marker prevents acceptance even with zero mismatches. The XOR-feedback task instead checks the public recurrence from either known initial state; the hidden initial-zero convention is not a requirement.

The keyless [calibrator](calibrate-netlists.mjs) freezes inputs and runs reference RTL, positive netlist and injected-output negative controls. An archived netlist may be reused read-only but its old PASS is not evidence; a failed replay also tries freshly synthesized reference RTL. The XOR-feedback rule additionally calibrates initial-one hardware. The [publisher](publish-netlist-profiles.mjs) audits controls before emitting enabled profiles and retains evidence links. Calibration makes no model calls and does not rescore historical campaigns. Derived reference/stimulus material retains its [upstream MIT license](VERILOGEVAL-LICENSE). See the [calibration decision](../../../.agents/notes/implemented/testing/2026-09-27-p10-netlist-suite.md).

`netlistMs` defaults to 120000 ms, independently of four-stage verification time and without adding model requests or repair rounds. Existing compile/elaboration/simulation command limits, log caps, artifact quota and caller/activity cancellation remain active. Each acceptance records profile, source, netlist, original result/artifact-manifest and environment hashes, commands, raw logs, checks, mismatches and latency. Mismatch, timeout, cancellation, missing evidence and tool/resource failures have separate terminal states. Netlist failures are not fed into another repair loop under this protocol.

Baseline PASS, Agent VERIFIED, recovered counts and `final.sv` require the same acceptance. The [report auditor](acceptance-audit.mjs) rehashes success evidence; new frozen campaigns cannot silently fall back to four-stage scoring when a receipt is absent. Unsupported tasks remain in reports as `NETLIST_NOT_CALIBRATED` when their RTL reaches the acceptance step. Historical records retain the explicit `legacy-four-stage-unvalidated` meaning and are not upgraded. Limited functional simulation is not formal equivalence. See the [decision](../../../.agents/notes/implemented/bug-fix/2026-09-27-p10-netlist-acceptance.md).

## Stable-Sampling RTL Evaluator

The separate [RTL evaluator](../../src/phase1/p10-settled-rtl.ts) uses `p10-settled-rtl-1`. A frozen `derived/settled-rtl-manifest.json` selects it for both generation and repair; malformed metadata, changed profiles or changed testbench bytes fail closed. Campaigns without this manifest retain their legacy evaluator and cannot inherit new calibration results.

RTL simulation uses the calibrated netlist oracle's stimulus, timing and comparisons, without the FPGA-only GSR assertion. It requires the exact calibrated check count and terminates without a completion marker if a required output remains unobserved. Raw VCD records top-level testbench and DUT signals; the first-mismatch log reports simulation time, not an inferred root cause. Existing bounded waveform feedback can report an unsupported-format gap; the raw waveform remains available.

[calibrate-settled-rtl.mjs](calibrate-settled-rtl.mjs) freezes a new catalog, derived testbenches and runtime inputs, then runs real reference and wrong-DUT controls without model calls. Its optional historical replay checks that the correct Prob078 dual-edge design passes and the historically accepted wrong design fails. These controls validate the measured evaluator behavior, not every reference against its public specification. Known specification/reference conflicts remain separately disclosed. See the [RT-02 decision](../../../.agents/notes/implemented/bug-fix/2026-09-27-p10-settled-rtl.md).
