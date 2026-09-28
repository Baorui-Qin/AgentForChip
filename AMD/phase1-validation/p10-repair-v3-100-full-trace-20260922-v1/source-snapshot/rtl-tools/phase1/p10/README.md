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

The [model profile](../profiles/rtl-p10-model/cordis.patch.yml) exposes `generate <task-id>`, `compare <task-id>` and `repair-control <task-id>`. Generation makes one text-only request with no feedback or skills; its Host tokenizer may use a managed subprocess. Comparison scores that immutable source once, then reuses P09 tools, tokenizer, validated skills and diagnostics for bounded repair. Host scoring and generation are separate commands. Repair-control starts from a copy of the negative DUT and is excluded from model scores. All scoring reads the same frozen derived evaluator; DUT-only synthesis and reference-dependency rejection prevent calibration wrappers from becoming candidates. Exports require a current four-stage verification and matching source hashes.

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

Generation retains one logical request, its original experiment identity, immutable per-window results and every physical attempt. Resume checks the same request hash and source freeze. The latest result is an atomic pointer replacement, not an edit of prior evidence. Already acquired candidates are never regenerated; invalid complete candidates are model-output failures rather than retry opportunities. The new stability entrypoint is separate from the historical one-pass runner and does not mutate old campaigns.

Each model run includes `transport.json`: request preparation, stream invocation, observed HTTP response/provider activity, first output, usage, finish and successful complete response. Legacy `dispatched` means stream invocation only. A locally normalized error finish is not server activity. Node fetch diagnostics retain only allowlisted network codes and HTTP status, scoped to the call's async context. Unavailable network details remain null; absence of an HTTP observation does not prove the server never received the request.

P10 writes `tool-trace.jsonl` with available/selected tools, acceptance or rejection, revision changes, timestamps and `HOST_INITIAL` versus `AGENT_TOOL` verification. Stage execution comes from non-version process invocations, with result and simulation-log hashes and check/mismatch counts. Canonical `feedback_sha256` identifies the full diagnostic receipt; `feedback_projection_sha256` identifies the bounded feedback actually serialized into the request. `consumed_feedback_sha256` is recorded only when that request produces observable model output. It proves request binding and response activity, not the model's internal use of the feedback. A final PASS followed by no model call has no consumed-feedback claim.

Reports separate candidate acquisition, end-to-end evaluated completion and model-evaluable performance. Unstarted/infra-paused tasks remain visible without being counted as DUT failures; zero natural repair opportunities produce a null repair rate. The [decision note](../../../.agents/notes/implemented/bug-fix/2026-09-21-p10-transport-evidence.md) records the sampling and observability tradeoffs.

Explicit `prepare-stability.ps1 -Forty -CampaignRoot <new-directory>` authorization uses the SHA-pinned historical forty-task manifest in its original order. It checks and merges the four historical groups' sealed calibrations without reusing model candidates. `selectedTaskCount` defaults to ten and requires an explicit forty-task configuration to expose later tasks. The frozen forty-task configuration allows two independent EDA jobs, at most 375 campaign dispatches, and continues after terminal model-output failures while retaining the same infrastructure circuit. The `all` stage generates before comparing valid candidates; failures and unstarted tasks stay in the forty-row denominator. Historical scripts and results are not overwritten.

Every text and tool request writes `stream.jsonl` incrementally before response validation, including the chunk that triggers a limit or rejection. It contains ordered, timed Harness-normalized provider chunks, not raw HTTP/SSE bytes. `reasoning.txt` and `output.txt` project the returned text, including partial responses; `transcript.json` records byte counts, SHA-256 hashes, completion and whether reasoning was returned. Tool arguments remain in the stream and assembled model response; Host execution results remain in the tool trace and verification artifacts. No unpublished/internal reasoning is available, and credentials, headers and unsafe transport exception text are excluded. Existing token, byte and timeout limits still terminate requests and are reported as incomplete, not silently treated as complete archives of an unlimited response.

<a id="repair-v2"></a>

The [evidence recovery decision](../../../.agents/notes/implemented/bug-fix/2026-09-22-p10-evidence-recovery.md) defines repair-v3 campaigns. Stream-envelope size is not an output limit; token, response-byte and timeout limits remain active. A thinking-disabled tool turn is replaced by the persisted Host tool result in the next request's factual core, rather than replayed into thinking mode. The latest tool result also survives compaction. Candidate rejection records distinguish response, extraction/interface and RTL-policy failures.

Diagnostic completeness comes from retained raw logs, source hashes, parser limits and process facts, not the capped stage summary. Elaboration uses the same run's trusted compilation source paths for ownership. Only complete DUT procedural-driver failures with the exact same-invocation XSIM elaboration summary gain the dedicated repair rule; unknown, evaluator and environment errors remain blocked. Historical replay cannot authorize execution.

Explicit `prepare-stability.ps1 -Hundred -PreflightRoot <calibrated-root> -HundredManifestSha256 <hash> -CampaignRoot <new-directory>` requires a unique, SHA-pinned `manifest-100.json`, matching selection order and 100 evaluable positive/negative calibration rows. The caller freezes the selection and exclusions before model outcomes. This mode allows two comparison workers and at most 1000 campaign dispatches. `selectedTaskCount` accepts up to 100 but still defaults to ten; manifest presence alone does not expand execution authority.

## Repair V2

New campaigns freeze `repairMaxTokens=16384`, `forcedActionMaxTokens=4096`, `repairMaxResponseBytes=262144`, `compactThreshold=0.8` and `maxRepairRounds=3`. Initial generation keeps its separate `maxTokens=8192` budget. These are total completion-token limits, not a separate reasoning-token quota. The provider interface does not expose a 12000-token mid-stream action deadline or required tool-choice flag. Truncation switches to `reasoningEffort=off`, removes `finish`, requests one complete tool call and rejects non-action responses; it cannot guarantee provider compliance. Recovery never executes partial tool arguments and has no unlimited retry path.

The action caller measures the complete wire with the pinned counter. At the threshold or local overflow it removes completed assistant/tool history and optional diagnostics/skills, then remeasures. Current source, source SHA, verification binding, blocking failure, best revision and factual repair/rejection ledger remain intact. Explicit provider context-overflow errors allow one compact retry per logical request. An oversized mandatory core, cancellation, timeout, dispatch cap or tool-step cap still stops the run; compaction does not reset any budget.

Simulation feedback retains bounded raw XSim hints, output names, mismatch counts and reported first-failure times. An existing `build/wave.vcd` supplies at most three timestamp-level samples around the earliest reported failure, with top-level signals and paired `*_ref`/`*_dut` outputs; reference-module internals are excluded. The supported XSim subset requires a 1ps timescale and bounded bytes, signals and widths. Missing or unsupported waves are explicit optional-evidence gaps, not new verdicts. VCD end-of-timestamp values can differ from values sampled by the testbench in the same timestamp. Feedback never invents cycles, sampled expected/actual values or root causes. Raw logs and waveform hashes remain in the receipt.

The host retains the best observed revision against the same frozen evaluator. Complete PASS outranks synthesis failure, simulation mismatch, elaboration failure and compilation failure. Simulation mismatch counts are comparable only with equal sample counts. A worse or tied candidate restores the best source, revision and receipt before another edit, and its SHA enters the rejection cache. Incomparable or incomplete evidence restores the incumbent but stops for investigation rather than hiding infrastructure failure. Every decision preserves the rejected candidate and verification artifact. `best-observed.sv` is a recovery artifact, not a passing export; only bound final PASS writes `final.sv`. `revision_decisions`, `rejected_revisions` and `context_compactions` support campaign audits. See the [repair decision](../../../.agents/notes/implemented/feature/2026-09-21-p10-repair-v2.md) for limits and verification.
