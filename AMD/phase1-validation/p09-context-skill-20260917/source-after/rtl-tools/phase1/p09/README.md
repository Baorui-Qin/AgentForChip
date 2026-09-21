---
description: "Bounded repair context, offline skills and independent five-task comparisons."
kind: "package-reference"
---

# P09 Context Development

English | [中文](README.zh.md)

## Summary

P09 supports reviewed repair and explicitly enabled autonomous repair of frozen faulty DUTs. A keeps the complete public task, current source and current failure; B adds at most two factual history entries; C adds at most two evidence-backed offline rules. These are repair-context comparisons, not the P06 no-agent Baseline. The default mode requires a separate human decision for every generated candidate.

## Table of Contents

- [Profile and Configuration](#profile-and-configuration)
- [Automatic Experiments](#automatic-experiments)
- [Request and Recovery Semantics](#request-and-recovery-semantics)
- [Offline Skills](#offline-skills)
- [Evidence and Limitations](#evidence-and-limitations)
- [References](#references)
- [Dev Note](#dev-note)

<a id="profile-and-configuration"></a>
## Profile and Configuration

The [rtl-p09 profile](../profiles/rtl-p09/cordis.patch.yml) uses the same repair application, provider and process service. The [PowerShell](run.ps1) and [shell](run.sh) wrappers only invoke dsh. Shipped configuration does not permit full-access execution. Overlays replace the entire plugin configuration, not individual nested fields.

[config.example.json](config.example.json) specifies the group, token limits, official tokenizer runtime and optional skill bundle. Its zero manifest digest is an intentionally unusable placeholder. Reviewed text requests use an installed official Python binding; automatic requests use the pinned official Rust converter and encoder described below. Missing dependencies stop the request; there is no character-count fallback.

The reviewed-mode tokenizer manifest contains revision, package_version, tokenizer, tokenizer_sha256, template_sha256 and package_files. Paths are relative to the runtime root; package_files maps installed package files to SHA-256 digests. The helper imports from its packages directory and performs no runtime downloads. exact_local measures that frozen local implementation, not a proven identity with cloud token accounting. The following commands describe reviewed mode.

| Command | Behavior |
| --- | --- |
| freeze | Exclusively creates the five-task manifest and 15-cell schedule |
| calibrate TASK | Runs handwritten positive and negative fixtures without requesting a model |
| start TASK | Calibrates assets, independently generates a candidate, then waits for review |
| start controlled_multi_round | Uses the existing injected-defect fixture with P09 context |
| approve ID SHA256 / reject ID SHA256 | Records one exact candidate safety decision; never executes it |
| resume ID / status ID | Continues approved work or reads state without resampling |
| report | Creates a new JSON/CSV/bilingual report snapshot with all 15 cells |

Each experiment freezes its task and configuration identity. Changing the group or configuration prevents resuming that experiment. A/B/C require separate experiments; duplicate task/group results are rejected by the aggregate reporter rather than selecting a favorable sample. Calibration receipts are not generated-design results.

<a id="automatic-experiments"></a>
## Automatic Experiments

The repair plugin accepts `autoConfigFile` only with P09 and finite-loop settings. Execution additionally requires `allowUnisolatedAutomatic: true` and explicit full-access policy in a host-owned dsh overlay. This is permission for restricted tool interfaces, not OS isolation. [The decision record](../../../.agents/notes/implemented/feature/2026-09-17-p09-autonomous-repair.md) explains that trade-off. The core agent loop and provider transport remain unchanged.

Automatic settings specify `registry` (minimal or full), `campaignRoot`, `bucket` (preflight or ablation), `sampleId`, `runtimeRoot`, `runtimeManifestSha256` and `maxToolSteps` (at most 15). The Rust runtime manifest pins `revision`, `compiler`, `executable`, `tokenizer` and relative-path SHA-256 `files`, including source and dependency locks. The executable accepts a serialized request file and tokenizer file; its only result is the official local token count. Runtime identity is checked before launch and each request.

`start TASK` calibrates host assets, starts from the frozen bad source and requests native tools. `edit_dut` accepts one complete interface-compatible DUT with the expected revision; `verify_rtl` accepts only that revision and its fixed suite. Edits invalidate current verification and cannot skip verification before another edit. The full registry also exposes `read_current_rtl`, deterministic `retrieve_skill`, and unverified `finish`. Minimal smoke runs expose only edit and verify. The host terminates and exports on bound four-stage PASS; model text cannot declare success.

One completed response may contain only one action. Truncated parameters are never executed; multiple actions are rejected together. Accepted edits consume semantic repair budget; reads, rejected actions and transport retries do not. Every returned action attempt consumes tool-step budget. Permanent atomic claims prevent duplicate cells, and cross-process dispatch tickets cap preflight at 150, ablation at 225 and their sum at 375. Uncertain interrupted requests retain their tickets and cannot resume automatically. These counts are not a cost guarantee.

Only zero-content connection failures, timeouts and HTTP 502/503/504 permit two retries with 1/2-second backoff. Lower-level retry must be disabled. Each dispatch audits and counts the same final serialized body, including system, tools, replay-required reasoning fields and the latest complete tool-call/result pair. B adds facts, never reasoning text. Optional pruning precedes the audit; the sender performs no second pruning pass. Automatic state/model records use schema 1.7 without rewriting historical state. `report` creates a fresh evidence-separated snapshot and audits terminal file sizes, hashes and completeness; manifests exclude themselves.

Candidate checks reject directives, strings, escaped identifiers, hierarchical/member references, file access, DPI and system calls except `$clog2`, `$bits`, `$signed` and `$unsigned`. This deliberately supports a narrow single-module subset, not arbitrary SystemVerilog. Fixed EDA commands use the existing credential-scrubbed process service, asset hashing, timeout, process-tree cleanup and quotas. Name-based environment scrubbing and source checks are not complete isolation; `full_os_isolation_verified` remains false.

<a id="request-and-recovery-semantics"></a>
## Request and Recovery Semantics

The host checks the complete verification receipt before selecting model-visible diagnostics. Required blocks are never truncated. Independent errors remain in the core; recognized consequential summaries and warnings are optional. Source-log incompleteness and prompt-view reduction are separate facts. The output protocol requests one full unchanged extraction between BEGIN/DONE markers; the extractor does not repair code.

The example uses a 131072-token (128K) project window, 8192 output tokens and a 1024-token margin, leaving 121856 input tokens. The resolved provider context can reduce this window. The budget applies to the complete officially rendered request, including roles and assistant prefix. Soft limits are 2048 feedback tokens, 512 ledger tokens and 768 skill tokens. Source warnings never authorize truncating the current RTL. Output-byte, event-size and timeout limits remain independent; a larger context window does not increase the output allowance or rewrite frozen experiments.

Three semantic repair requests and at most 15 provider attempts are distinct limits. Initial generation consumes the latter. A logical request shares two transport retries across its request revisions. Confirmed context overflow and complete malformed output framing each permit one separate recovery per experiment. Partial responses, truncation, authentication failures and cancellation do not become hidden resampling. Repeated source bytes stop; repeated diagnostic IDs with changed source do not.

Context construction occurs after provider configuration resolution and before dispatch. Sidecars retain input, audited text, serialized base request, count provenance and provider-usage differences. Existing model records remain 1.1; verification records remain 1.3; reviewed workflow state is 1.6. The native Harness Session format is unchanged.

<a id="offline-skills"></a>
## Offline Skills

[skills.draft.json](skills.draft.json) contains three unvalidated starting entries. Ordinary experiments never load drafts into prompts. Explicit `validationSkillId` preflight runs may test one hashed draft on a non-ablation fixture, labeled `draft_under_test`; they do not promote it. Validated entries require rule-content hashes, source cases and hashed validation artifacts; selection uses observed tags, never task IDs or reference answers. The model receives only rule, scope and limitations, not the evidence files. A/B do not read skill bundles.

Skills remain frozen during an experiment. A validated label describes supporting evidence and limitations, not proof that the rule improves generation accuracy. No vector database, online retrieval, summarization model or cross-sample memory is used.

Automatic C runs check bundle structure, unique IDs, content hashes and referenced evidence before EDA calibration. Missing, malformed or changed evidence terminates as `SKILL_EVIDENCE_INVALID`, not an EDA calibration or model failure. A/B skip this check without opening skill files.

C prompts already contain applicable guidance. The model need not call `retrieve_skill` to receive it. Native retrieval uses only the current blocking stage, matching prompt selection; an unverified edited candidate has no current diagnostic and returns no skills. A prompted tool-call probe establishes callability, not autonomous selection or causal repair benefit.

<a id="evidence-and-limitations"></a>
## Evidence and Limitations

The five internal tasks use one explicit SystemVerilog compilation unit with the trusted testbench before the DUT, a 5 ns synthesis constraint and seed 1. Synthesis reads only the DUT. Their scoring assets are independent from VerilogEval. Prob038 compatibility remains a separate result.

Unit and Loader tests use explicitly identified Mock token counters; they do not prove official tokenizer availability. New real API/EDA evidence, historical replay and Mock results must remain separate. Positive WNS is post-synthesis information, not implementation timing closure. An observed Vivado summary WNS of inf with TNS 0.000 is retained as null with reason non_finite_wns and a warning, never converted to zero or a closure claim. Human approval, hashes and path checks are not complete OS isolation.

<a id="references"></a>
## References

The implementation borrows observation masking rather than extra model summarization from [The Complexity Trap](https://arxiv.org/abs/2508.21433). Official request rendering and tokenization use [deepseek-recipe](https://github.com/deepseek-ai/deepseek-recipe/blob/main/docs/tokenizer.md); deployments must pin its commit, assets and license. Neither reference supplies an RTL accuracy guarantee.

<a id="dev-note"></a>
## Dev Note

Live acceptance, dependency availability and pending approvals are recorded in the independent validation directory, not inferred from the existence of templates or tests. The ordinary simulation, synthesis and P06 Baseline entrypoints do not enable P09.
