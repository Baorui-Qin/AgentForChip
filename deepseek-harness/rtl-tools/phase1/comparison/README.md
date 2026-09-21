---
description: "Frozen VerilogEval prompts, reviewed candidate revisions and three-route development evidence."
kind: "package-reference"
---

# Three-Route RTL Development

English | [中文](README.zh.md)

## Summary

Compare one independent generation in each of Baseline, Agent-Base and Agent-Domain on pinned Prob038_count15. The Baseline process has no Agent or EDA services. Agent routes add host verification and one read-only interpretation, not repair. Real generation requires a successful original-evaluator preflight, and execution requires a source-bound human review. These components support a development comparison, not a paper reproduction or a correctness-gain claim.

## Table of Contents

- [Protocol](#protocol)
- [Entry points](#entry-points)
- [Review and publication](#review-and-publication)
- [Evidence](#evidence)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)

<a id="protocol"></a>
## Protocol

The dataset revision is `c498220d0a52248f8e3fdffe279075215bde2da6`. [protocol.ts](../../src/phase1/protocol.ts) checks pinned byte hashes before reading the public prompt or evaluator assets. `protocol.json` retains the original system prompt, Question/Answer wrapper, BEGIN/DONE protocol, optional rules, public specification and hashes. The first prepared request freezes resolved provider, model, reasoning effort, temperature and token limit in `request-config.json`; later drift fails before dispatch. Defaults are `deepseek-flash`, temperature 0 and maxTokens 2048. No top_p is sent; its effective server value is unknown.

| Route | Generation request | After generation | Normal project calls |
| --- | --- | --- | --- |
| baseline | Original zero-shot system and user wrapper; no rules/examples | Save and stop; separate host scoring, no model feedback | 1 |
| agent_base | Identical system and user content to baseline | Host review, verification, read-only interpretation | 2 |
| agent_domain | Same public protocol plus frozen five-rule system block | Same review, verification and interpretation template | 2 |

The five rules come verbatim from the pinned [sv-generate](https://raw.githubusercontent.com/NVlabs/verilog-eval/c498220d0a52248f8e3fdffe279075215bde2da6/scripts/sv-generate). They cover logic declarations, combinational sensitivity, sized nonzero constants, signal-reading always blocks and synchronous resets. This project appends them to system content; upstream appends them to user content. The protocol artifact records this difference and preserves the original text. The [upstream MIT notice](../VERILOGEVAL-LICENSE.txt) accompanies the integration. No task answer or run-derived advice enters this block.

| Source | Adopted method | Excluded method |
| --- | --- | --- |
| [VerilogEval v2](https://arxiv.org/html/2408.11053v2) | Fixed generation protocol; independent external scoring | Network retries, permissive response salvage, paper model/backend assumptions |
| [AutoChip](https://arxiv.org/html/2411.11856v3), [code](https://github.com/shailja-thakur/AutoChip) | Separate model calls, EDA feedback and cost accounting | Search, iterative repair, model mixing |
| [RTLFixer](https://arxiv.org/html/2311.16543v3), [code](https://github.com/NVlabs/RTLFixer) | Separate extraction, compilation and functional outcomes | Rule-based syntax correction, RAG and ReAct repair |

This is a VerilogEval zero-shot Baseline, not the contest's prompt-only Baseline. DeepSeek official streaming API and Windows Vivado replace the paper environment. The two Agent labels name deterministic host workflows, not autonomous tool selection or the core agent loop. Read-only interpretation cannot improve an already generated candidate. A single independent sample per route cannot establish statistical significance.

<a id="entry-points"></a>
## Entry points

[setup-profiles.ps1](../setup-profiles.ps1) installs the two example profiles into `DSH_HOME`, defaulting to `D:/AMD/p05-home`. It refuses to overwrite differing existing files. Inspect [baseline](../profiles/rtl-baseline/cordis.patch.yml) and [agent](../profiles/rtl-agent/cordis.patch.yml) configuration before use: paths are local Windows examples, and the Agent profile explicitly enables full access for fixed preflight fixtures or individually approved candidates. Credentials remain in the existing credential service, never the YAML or experiment artifacts.

The following interfaces run from the repository root. Initialization and reporting need no API calls. The preflight was exercised with real Vivado; generation, review and evaluation continuation are covered by Loader/Mock tests but remain blocked for this pinned real testbench until compatibility is resolved without silently changing the protocol.

```powershell
./rtl-tools/phase1/setup-profiles.ps1
./rtl-tools/phase1/run.ps1 preflight
./rtl-tools/phase1/run_baseline.ps1 init
./rtl-tools/phase1/run_baseline.ps1 generate <experiment-uuid>
./rtl-tools/phase1/run.ps1 generate <experiment-uuid> agent_base
./rtl-tools/phase1/run.ps1 generate <experiment-uuid> agent_domain
./rtl-tools/phase1/run.ps1 verify <experiment-uuid> baseline
./rtl-tools/phase1/run.ps1 verify <experiment-uuid> agent_base
./rtl-tools/phase1/run.ps1 verify <experiment-uuid> agent_domain
./rtl-tools/phase1/run.ps1 report <experiment-uuid>
```

[run_baseline.sh](../run_baseline.sh) and [run.sh](../run.sh) are equivalent thin wrappers, not Linux Vivado setup. [compare.ps1](../compare.ps1) coordinates `Generate`, `Evaluate` or `Report`; generation exits for review, and evaluation never regenerates. Independent route directories retain failed or interrupted attempts. Never remove claim files to resume by resampling. A missing successful `dataset-preflight.json` blocks all real generation before a model attempt.

Preflight runs independently written correct and wrong DUTs against the original testbench and reference. The testbench top is `tb`, the design top `TopModule`, the requested simulation seed is 1, and the original 10 ps testbench clock is unchanged. The DUT-only synthesis XDC supplies 5 ns. PASS requires clean process/diagnostic facts and exactly one complete `Mismatches: N in M samples` with M positive and N zero; TIMEOUT, fatal diagnostics or truncated evidence reject. Compilation errors in trusted evaluator files are environment failures, not candidate correctness evidence.

<a id="review-and-publication"></a>
## Review and publication

[candidates.ts](../../src/phase1/candidates.ts) accepts a unique complete marker section, otherwise one explicitly labelled HDL fence or bare HDL. One whole fence inside the marker section is allowed. Ambiguous sections, conflicting blocks, incomplete delimiters, empty/truncated/oversized output, NUL and invalid Unicode reject. The extractor preserves the source substring and records response/source hashes and UTF-8 byte offsets. It never inserts endmodule or alters behavior. The declaration checker accepts one TopModule with clk/reset inputs and four-bit q output in ordinary constant-width ANSI/non-ANSI syntax. Unsupported forms are not mislabeled compiler errors; Vivado owns syntax and functional decisions.

Each route has a fresh UUID revision under `revisions/<revision>/rtl/solution.sv`. After reviewing that exact complete source for execution safety, the operator places `approval.json` in the route directory: copy every field from that revision's `candidate.json`, then add `approved` (boolean), `reviewed_at` (UTC ISO timestamp) and `note` (at most 2000 characters). No other fields are accepted. This is a human decision, not an automatically generated approval. Do not repair code during review or reject it merely to resample functional errors. A rejected approval remains a route result.

The host binds approval to experiment, route, revision, response, source and evaluation hashes, and consumes verification once. A new clean snapshot binds DUT, original testbench/reference, XDC, dataset revision, tool identity, configuration and seed. Before export it rechecks the candidate and every snapshot asset. Publication flushes a private temporary file, links exclusively to the final name and removes the temporary link. An interrupted export without its receipt is unverified; existing outputs are never overwritten. Only a matching four-stage PASS has `final_verified=true`; failed runs may export unchanged bytes for inspection with false. Read-only source attributes and hashes detect/prevent accidental edits, not adversarial OS writes.

<a id="evidence"></a>
## Evidence

Experiment manifests, candidates, approvals, route events and comparison reports use project schema 1.2. Model records use 1.1; verifier records use [1.3 invocation and attribution evidence](../language/README.md), with 1.0/1.1 reading retained. Dedicated validators read experiment identities. No released Harness Session format changes. Route events correlate experiment, task, variant and call purpose; native run events retain individual call identities. Aggregate route events and native events have bounded storage. Partial publication remains incomplete, never inferred PASS.

`comparison.json`, `comparison.csv` and `comparison.md` are rebuildable views of retained route receipts. They separate extraction, review, four EDA stages, export and interpretation; JSON includes hashes, checks, mismatches, resource/timing metrics, warnings, usage and separate generation/evaluation/interpretation/review durations. Call counts are project attempts, not confirmed HTTP deliveries. Missing usage, prices, TTFT or metrics are null, not zero. An optional matching `preflight.json` attaches the original preflight receipt and exposes a blocked experiment without inventing model failures. Positive post-synthesis WNS is not post-route closure.

The [candidate tests](../../tests/candidates.spec.ts) and [Loader comparison tests](../../tests/comparison.spec.ts) belong to the existing RTL suite. They check strict extraction and publication, route isolation, hidden-asset sentinels, 1/2/2 calls, exact generation prompt equality, failed/rejected attempts, drift, stale PASS, immutable exports and unload cleanup. A keyless result snapshot verifies the three-route stage/call summary. The parent [verification commands](../README.md#verification) run these and existing simulation/synthesis regressions. Real evidence, Mock evidence and API observations must remain separate.

<a id="model-experience"></a>
## Model Experience

Generation sees only the public task and frozen protocol. The independent Baseline cannot load Agent, tool, subprocess or skill services and receives no evaluator feedback. The two Agent interpretation calls share one template with public source and bounded facts, not testbench/reference contents. No model call receives shell/Tcl capabilities or authority to modify approvals. Full prompts, responses and terminal failures remain reconstructable from disk without returning complete EDA logs to the model.

<a id="known-limitations-and-deferred-work"></a>
## Known Limitations and Deferred Work

Original Prob038_count15 preflight is blocked on this Vivado installation by VRFC 10-3380: the testbench references tb_mismatch before declaration. Both hand-written controls stop in compilation. Real seed handling, functional scoring and the three real generations therefore remain unverified; no testbench edit or backend substitution is implicit. This scope does not accept automated repair, Agent performance improvement, full OS isolation, local inference/ROCm, G1/G2 or competition reproduction. Review-separated full access is unsuitable for unreviewed hostile HDL.

## Dev Note

[Bounded RTL verification facts](../../../.agents/notes/implemented/feature/2026-09-13-rtl-simulation-tool.md).
