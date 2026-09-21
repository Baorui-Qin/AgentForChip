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

- The P10 bare Baseline, external shared-candidate repair binding, format-recovery branch, P10 dispatch ledger and public-task skill applicability filtering are not implemented in this preflight entrypoint.
- A passing evaluator alone is not GO. The complete ten-task comparison and mandatory audit are required before an independent forty-task campaign.
- Testbench/reference compatibility changes, local models, ROCm, offline deployment, complete OS isolation and implementation timing closure are outside this acceptance.

<a id="dev-note"></a>
## Dev Note

Live outcomes, startup failures and version-specific audits belong in the independent validation directory. Tests and generated wrappers are not substitutes for real evaluator execution or model evidence.

## Reviewed Compatibility Campaign

The separate [compatibility builder](../../src/phase1/p10-compat.ts) accepts only eleven reviewed raw-byte hashes. It moves two complete net declaration lines within `tb`, retaining every other byte, and publishes the derived TB, unified diff, reversible line map and provenance outside the dataset. [Compatibility preflight](../../src/phase1/p10-compat-preflight.ts) remains model-free. It records declaration-only probe failures before enabling an evaluator-specific `1ps/1ps` default when real xelab diagnostics require one. Explicit timescales are never overridden. Positive reference delegates and independent faulty DUTs must both demonstrate the expected simulation verdict; neither is a model score.

The [model profile](../profiles/rtl-p10-model/cordis.patch.yml) exposes `generate <task-id>`, `compare <task-id>` and `repair-control <task-id>`. Generation makes one text-only request with no feedback or skills; its Host tokenizer may use a managed subprocess. Comparison scores that immutable source once, then reuses P09 tools, tokenizer, validated skills and diagnostics for bounded repair. Host scoring and generation are separate commands. Repair-control starts from a copy of the negative DUT and is excluded from model scores. All scoring reads the same frozen derived evaluator; DUT-only synthesis and reference-dependency rejection prevent calibration wrappers from becoming candidates. Exports require a current four-stage verification and matching source hashes.

These development commands require explicit full-access authorization and retain `full_os_isolation_verified=false`. They fail closed without transport or format retries, reserve physical dispatch tickets once, and never automatically expand the eleven-hash allowlist or authorize forty tasks. New rules or protocol changes require separately frozen campaigns. The original preflight entrypoint and historical results remain unchanged.
