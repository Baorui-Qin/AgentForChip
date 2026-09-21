# Agent Note: P10 transport recovery and evidence

Status: implemented

English | [中文](2026-09-21-p10-transport-evidence.zh.md)

## Problem

A provider invocation is not evidence of model activity. Lost network causes and uninterrupted campaign selection can consume multiple tasks during one outage. Scattered tool files also obscure the distinction between Host scoring, model-selected simulation and feedback included in a later request.

## Decision

The [P10 stability protocol](../../../../rtl-tools/phase1/p10/README.md#generation-stability-and-tool-evidence) keeps transport telemetry outside released model records and observes Node fetch diagnostics before provider normalization discards causes. It records no raw exceptions, headers or endpoint URLs. Normalized error finishes alone never establish server activity.

An exhausted generation window pauses selection. Recovery uses a bounded health probe and resumes only the same zero-output logical request under its original hash and freeze. Each terminal window remains immutable; only the latest-result pointer changes. Complete candidates and partial-output responses cannot be resampled through resume. Existing Prompt, Skill and repair policy are unchanged.

The tool trace binds real process records, canonical receipts, rendered feedback and model responses. It reports Host initial verification separately from Agent tool verification. Feedback consumption means observable response to the bound request, not a claim about internal reasoning. Infrastructure reliability and candidate-evaluable outcomes have separate denominators.

Incremental normalized-stream sidecars preserve provider-returned reasoning, text and tool deltas before parser and byte-limit checks. Partial or rejected responses remain inspectable without changing released ModelRecord data or model-visible requests. Text projections are conveniences; the ordered stream is the received-chunk evidence. Unpublished reasoning and secret-bearing transport metadata are outside the archive.

The explicitly authorized forty-task mode pins the historical manifest and merges hash-checked calibration records. It uses fresh candidates and bounded EDA concurrency, not new sampling or repair strategies. Terminal model-output failures remain in the fixed cohort while infrastructure exhaustion still stops selection. The default ten-task authority does not expand implicitly.

## Alternatives considered

**More unconditional retries:** repeatedly sampling through an outage wastes budget and can hide pass-at-k. Bounded same-wire recovery preserves failed physical attempts and stops task selection.

**Changing shared provider failure schemas:** the P10 consumer needs transport evidence without changing released provider/session formats. Per-call Node diagnostics capture available network facts locally; other transports can leave them unavailable.

**Richer feedback or new repair policies:** changing model inputs while debugging acquisition would confound attribution. This change adds Host evidence, not new model-visible guidance.

## Consequences

The conservative circuit stops after the first exhausted task instead of spending subsequent tasks. A crash without a terminal checkpoint cannot automatically resume. Diagnostic channel support is Node-fetch-specific; missing observations remain unknown. Calibration can be reused only with explicitly frozen identities, and a new campaign cannot merge old model candidates into its score.

## Testing

Focused tests cover normalized errors versus HTTP/model activity, concurrent telemetry isolation, secret omission, same-hash resume, resume limits, complete-invalid output rejection, circuit breaking and empty repair denominators. Real campaign evidence is kept outside the repository and distinguishes provider calls from mocked behavior tests.
