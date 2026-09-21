---
description: "Bounded repair context, offline skills and independent five-task comparisons."
kind: "package-reference"
---

# P09 Context Development

English | [中文](README.zh.md)

## Summary

P09 adds a deterministic request view to the existing reviewed repair workflow. A keeps the complete public task, current source and current failure; B adds at most two factual history entries; C adds at most two evidence-backed offline rules. These are repair-context comparisons, not the P06 no-agent Baseline. Each generated candidate requires its own human safety decision.

## Table of Contents

- [Profile and Configuration](#profile-and-configuration)
- [Request and Recovery Semantics](#request-and-recovery-semantics)
- [Offline Skills](#offline-skills)
- [Evidence and Limitations](#evidence-and-limitations)
- [References](#references)
- [Dev Note](#dev-note)

<a id="profile-and-configuration"></a>
## Profile and Configuration

The [rtl-p09 profile](../profiles/rtl-p09/cordis.patch.yml) uses the same repair application, provider and process service. The [PowerShell](run.ps1) and [shell](run.sh) wrappers only invoke dsh. Shipped configuration does not permit full-access execution. Overlays replace the entire plugin configuration, not individual nested fields.

[config.example.json](config.example.json) specifies the group, token limits, official tokenizer runtime and optional skill bundle. Its zero manifest digest is an intentionally unusable placeholder. Real counting requires an installed official Python binding, tokenizer, template identity and a hash-pinned runtime manifest. Missing dependencies stop the request; there is no character-count fallback.

The tokenizer runtime manifest contains revision, package_version, tokenizer, tokenizer_sha256, template_sha256 and package_files. Paths are relative to the runtime root; package_files maps installed package files to SHA-256 digests. The helper imports from its packages directory and performs no runtime downloads. exact_local measures that frozen local implementation, not a proven identity with cloud token accounting.

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

<a id="request-and-recovery-semantics"></a>
## Request and Recovery Semantics

The host checks the complete verification receipt before selecting model-visible diagnostics. Required blocks are never truncated. Independent errors remain in the core; recognized consequential summaries and warnings are optional. Source-log incompleteness and prompt-view reduction are separate facts. The output protocol requests one full unchanged extraction between BEGIN/DONE markers; the extractor does not repair code.

The example uses a 16384-token project window, 2048 output tokens and a 1024-token margin. The resolved provider context can reduce this window. The budget applies to the complete officially rendered request, including roles and assistant prefix. Soft limits are 2048 feedback tokens, 512 ledger tokens and 768 skill tokens. Source warnings never authorize truncating the current RTL.

Three semantic repair requests and at most 15 provider attempts are distinct limits. Initial generation consumes the latter. A logical request shares two transport retries across its request revisions. Confirmed context overflow and complete malformed output framing each permit one separate recovery per experiment. Partial responses, truncation, authentication failures and cancellation do not become hidden resampling. Repeated source bytes stop; repeated diagnostic IDs with changed source do not.

Context construction occurs after provider configuration resolution and before dispatch. Sidecars retain input, audited text, serialized base request, count provenance and provider-usage differences. Existing model records remain 1.1; verification records remain 1.3; reviewed workflow state is 1.6. The native Harness Session format is unchanged.

<a id="offline-skills"></a>
## Offline Skills

[skills.draft.json](skills.draft.json) contains three unvalidated starting entries. Drafts are not loaded into prompts. Validated entries require rule-content hashes, source cases and hashed validation artifacts; selection uses observed tags, never task IDs or reference answers. The model receives only rule, scope and limitations, not the evidence files. Disabling skills avoids reading the skill bundle.

Skills remain frozen during an experiment. A validated label describes supporting evidence and limitations, not proof that the rule improves generation accuracy. No vector database, online retrieval, summarization model or cross-sample memory is used.

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
