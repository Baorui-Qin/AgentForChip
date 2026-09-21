# Agent Note: Frozen Full-Dataset P10 Compatibility Suite

Status: implemented

English | [中文](2026-09-18-p10-full-compat-suite.zh.md)

## Problem

A task-specific portability allowlist cannot inventory the complete benchmark. Mutating shared evaluators during scoring also makes concurrent results and cached verification ambiguous.

## Decision

The [full-suite builder](../../../../rtl-tools/src/phase1/p10-compat-suite.ts) runs only on the Host before workers. The pinned Git catalog supplies expected raw-byte hashes. A conservative structural rule recognizes the complete known module prefix and one declaration pair; it preserves all other bytes. Every task appears in the deterministic manifest, including unchanged inputs and manual-review cases. The explicit build epoch makes provenance timestamps reproducible rather than dependent on wall-clock execution.

Real representative positive and negative controls precede read-only sealing. Workers load fixed bytes into independent snapshots, never invoke the converter, and bind suite identity into existing verification inputs. Probe failures remain evidence; a missing-timescale default is an independent Host policy and never overrides explicit units. Correct and wrong DUTs must both be observable before evaluator readiness is reported. Informational version commands use the existing accepted exit convention; actual EDA commands still require exit zero.

The [eleven-task decision](2026-09-18-p10-reviewed-compatibility.md) remains the owner of its exact-hash adapter and model orchestration. Full-suite mode is separately built and calibrated, not an automatic extension of that allowlist. Agent, prompt, skills and model settings remain unchanged.

## Alternatives considered

**Broad replacement across files.** Rejected because matching text can belong to another module or preprocessing branch. Conservative false negatives require manual review instead of speculative rewrites.

**Transform during verification.** Rejected because shared mutable bytes create races and undermine reproducible evaluator identity.

**Treat conversion or positive-only results as readiness.** Rejected because static portability and wrong-DUT detection are independent claims. Unexecuted tasks have no inferred tool verdict.

## Consequences

Tests cover reversible two-line changes, expected hashes, ambiguous scope, repeated transformations, LF/CRLF, unchanged upstream and deterministic output. Real Vivado records cover representative calibration and the frozen fixed-ten preflight. Read-only permissions are tested for the worker identity, not claimed as administrator-proof isolation. Original Icarus crosschecks require that tool to be installed. A changed rule requires a new suite identity and calibration; model scores from different evaluator versions cannot be merged.
