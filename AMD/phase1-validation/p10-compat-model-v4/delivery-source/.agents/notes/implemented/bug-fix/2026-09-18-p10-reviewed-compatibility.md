# Agent Note: Reviewed P10 Evaluator Portability

Status: implemented

English | [中文](2026-09-18-p10-reviewed-compatibility.zh.md)

## Problem

A frozen evaluator's declaration-order failure prevents candidate measurement. Letting a participant alter its scorer would invalidate the result, but forbidding a separately reviewed developer portability build also prevents useful evaluation.

## Decision

The [compatibility adapter](../../../../rtl-tools/src/phase1/p10-compat.ts) is a Host-only, exact-hash allowlist transformation. It preserves original byte lines, records the inverse permutation and diff, and never writes upstream. Derived identity, adapter identity, source list, seed and optional default timescale enter the existing verification key through the snapshot manifest. Calibration and candidate scoring load the same derived file. The default timescale addresses observed elaboration errors without modifying explicit TB time units or synthesis clock constraints.

The [P10 model entry](../../../../rtl-tools/src/phase1/p10-model.ts) separates one-shot generation from Host scoring and bounded P09 tool repair. Shared generation incurs one physical dispatch; faulty-seed repair controls are labelled separately and cannot inflate comparison results. Current candidate, verification and exported hashes must agree. The original model-free preflight retains its LLM rejection. Reference-dependency rejection supplements DUT-only synthesis; it does not constitute an OS sandbox.

## Alternatives considered

**Modify the dataset or loosen diagnostics.** Rejected because it conceals evaluator changes and can hide genuine errors. The new campaign preserves failed predecessor evidence.

**Reuse calibration as a candidate PASS.** Rejected because the reference delegate only demonstrates scorer health, not model synthesis or public-spec correctness.

**Automatically generalize the rule to all tasks.** Rejected because template resemblance is not review of exact inputs. Expansion requires separately reviewed hashes and observable negative controls.

## Consequences

Focused tests cover byte reversibility, changed scopes, duplicate declarations, unknown hashes and reference borrowing. Real Vivado positive/negative runs remain necessary. The model protocol fails closed on malformed output and transport failures rather than silently retrying. Official hidden scoring, cross-simulator equivalence and full OS isolation are not claimed. Complete ten-task audit precedes forty-task authorization; unsupported assets are never substituted.
