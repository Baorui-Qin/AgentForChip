# Agent Note: Knowledge on the updated RTL Agent

Status: implemented

English | [中文](2026-10-08-updated-agent-knowledge-baseline.zh.md)

## Problem

The RTL Agent needs evidence-bound diagnostic guidance and a reproducible Knowledge-disabled comparison while retaining its current generation recovery, repair control and netlist acceptance behavior.

## Decision

The [Knowledge loader](../../../../rtl-tools/src/knowledge/knowledge-loader.ts) verifies bundle, entry and source-evidence hashes before [P10](../../../../rtl-tools/src/phase1/p10-model.ts) accepts an explicit Knowledge configuration. Three empty location fields disable Knowledge; a partial configuration fails before model preparation. The diagnostic bundle retains its validated and draft identities. Current DUT `multiple_drivers` diagnostics with `VRFC 10-3818` project to the bundle's existing `multiple_procedural_driver` vocabulary; the parser, source attribution and repair authority stay independent.

The [context builder](../../../../rtl-tools/src/phase1/p09-context.ts) preserves the disabled model text and System Prompt. Enabled retrieval requires matching tool version, stage, diagnostic kind, message and required features. Whole guidance entries are removed under the independent token limit, total window pressure or context compaction. Audit records separate eligible, retrieved, injected and dispatched observations. Token accounting retains the matched whole-envelope counter and its unconfirmed cloud equivalence.

The deployment uses the existing `dsh` profile and a separate artifact identity. B0 and K1 use the same updated source, fixed public task subset, model, evaluator, original validated Skill and budgets; only the explicit Knowledge selection differs. Historical measurements remain historical. Local preparation never grants model-dispatch authority or recreates a shared request allowance.

## Alternatives considered

Replacing the updated Agent with the previous source would discard its generation and acceptance changes. Copying assets without restoring context and entry-point integration would leave guidance unavailable. Changing parser vocabulary or relaxing evidence validation would couple repair decisions to the Knowledge bundle. A separate application launcher would bypass the maintained profile entry point.

## Consequences

Knowledge stays opt-in and cannot establish a candidate's correctness. A prepared baseline has unavailable model rates until its own authorized run supplies bound receipts. New Agent behavior requires a new source identity even when the diagnostic assets retain their hashes. Reusing evidence requires explicit provenance and does not become a new EDA execution.

## Verification

Tests cover bundle and evidence rejection, exact diagnostic projection, deterministic retrieval, disabled prompt identity, whole-entry removal, configuration rejection and the Loader request/audit path. Relevant generation recovery and repair-control regressions preserve the updated Agent behavior. Local deployment checks compare effective B0/K1 parameters after normalizing output locations; real Provider evaluation is a separate execution.
