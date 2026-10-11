---
description: "Retrieve evidence-backed repair inspection guidance from parsed Vivado 2026.1 diagnostics."
kind: package-library
---

# Diagnostic Knowledge V1.1

English | [中文](README.zh.md)

## Summary

This reference describes the optional Vivado 2026.1 diagnostic bundle. Static and experience knowledge are reserved categories without a runtime loader or populated assets.

## Table of Contents

- [Use the module](#use-the-module)
- [Understand the implementation](#understand-the-implementation)
- [Known limitations](#known-limitations)
- [Further exploration](#further-exploration)
- [Dev Note](#dev-note)

## Use the module

P10 opts in through `knowledgeFile`, `knowledgeBundleHash`, `knowledgeEvidenceRoot`, `knowledgeTopK` and `knowledgeMaxTokens`. The [context builder](../src/phase1/p09-context.ts) adds `diagnostic_knowledge` without changing the System Prompt or Skill selector. Its protocol treats candidate causes as hypotheses. Whole entries are removed when the independent token budget or context window is exhausted; limitations are never removed separately. With Knowledge disabled, B0 model text is unchanged. An enabled query without matches also adds no model text.

## Understand the implementation

The [schema and parser](../src/knowledge/knowledge-schema.ts) require machine-readable symptoms, possible causes, inspection steps, repair guidance, limitations, evidence references and validation status. Causes are hypotheses. Unknown kinds and unsupported tool versions have no fallback. Entries with insufficient evidence remain draft.

[Loading](../src/knowledge/knowledge-loader.ts) validates every entry, duplicate ID and ID/version pairs, the bundle manifest, content identities, reference paths and evidence hashes before returning a bundle. A malformed entry stops loading with `INVALID_KNOWLEDGE_ENTRY`. Each entry hash is SHA-256 of canonical JSON excluding its content hash; object keys use code-unit ordering and arrays retain their order. The bundle hash excludes its own digest and sorts manifest references by path. Only validated entries reach retrieval.

[Features](../src/knowledge/diagnostic-features.ts) project existing parser receipts. [Retrieval](../src/knowledge/knowledge-retrieval.ts) requires the same tool, version, stage, diagnostic kind and required features. Declared message IDs and required `dut_attributed` features must match the same diagnostic. Candidate scores favor matched kinds, message IDs, required features and optional features, with knowledge ID as the stable tie-break. Top-K is explicitly bounded to 1–3. No embeddings, model ranking or task-specific answers are involved.

The `diagnostic-v1.1` bundle includes `diagnostic.multiple_procedural_driver` for DUT-attributed `VRFC 10-3818` during elaboration. The feature projection maps the parser's `multiple_drivers` kind to the bundle's `multiple_procedural_driver` kind only for that message ID and DUT origin. Retrieval still requires DUT attribution. The [repair policy](../src/phase1/repair-policy.ts) independently permits or blocks edits; Knowledge grants no execution permission. Guidance preserves initialization and reset semantics and never prescribes unconditional removal of `initial` blocks. The loader also accepts frozen `diagnostic-v1` manifests; historical bundles retain their original hashes.

## Known limitations

The existing `agent_request` event retains the exact request and Knowledge audit. Task results distinguish retrieval, model-request construction and actual dispatch; they include bundle hash, IDs, versions, reasons and measured local token overhead. Local tokenizer counts retain their existing cloud-equivalence limitation. No diagnostic asserts an exact failure cycle, sampled expected/actual pair or proven root cause.

## Further exploration

See the [P2 artifacts](../../../AMD/phase2-tool-skill/p2-knowledge-v1/README.md) for the independent R0 regression and R1 historical-candidate repair experiments. R1 repair results are separate from fresh-generation VerilogEval pass rates.

## Dev Note

See the [baseline and Knowledge deployment decision](../../.agents/notes/implemented/architecture/2026-10-08-updated-agent-knowledge-baseline.md).
