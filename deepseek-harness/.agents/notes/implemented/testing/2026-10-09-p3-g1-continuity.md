# Agent Note: P3 test identity and Native fixture continuity

Status: implemented

English | [中文](2026-10-09-p3-g1-continuity.zh.md)

## Problem

Collection-time timestamps made one relay identity differ between collection and execution. The seven-fixture Loader test lost failure evidence during cleanup. A Native child-tree test could reach its simulation deadline before a target existed, then wait for a missing PID file after termination. Agent migration also removed three files containing 39 legacy cases.

## Decision

Relay bounds use static case IDs and compute relative time in the body. The first seven-fixture Loader instance isolates only its exact mapped version commands through the existing managed fixture. Its seven business verifications stay serial and Native, inside the original body and stage budgets. Other Loader instances use the default Native path.

Loader capture occurs only inside the existing Scope's settled cleanup callback. Capture failure retains roots and the primary error. Command, fixture, invocation, Managed range and reconstruction observations bind the receipt to the same Loader instance.

Only the timeout/cancel child-tree instance selects the fast simulation-hang fixture. A real child reports readiness over IPC before publishing its PID and receipt. The test binds the simulation cwd and actual handle to its run, subscribes before starting verification, checks readiness again on terminal races, and joins losing branches. The original simulation deadline remains in force while the fixture starts. Other hang modes retain their existing initialization.

Equivalent legacy cases use current public APIs and their original core assertions. Missing production capabilities and conflicting policy assertions remain explicit gaps. A passing candidate collection cannot stand in for acceptance of all 39 legacy contracts. The controller's isolated offline fixtures exercise actual YAML through the settings package that declares the dependency; they cannot authorize a real launch or reset shared authority.

## Alternatives considered

**Increase time budgets.** This changes acceptance and conceals fixture cost. The body, stage and wait budgets stay unchanged.

**Normalize timestamps or ignore missing identities.** This hides a collection contract failure. Static IDs allow exact matching without normalization.

**Copy obsolete production implementations into restored tests.** This would test the old capability rather than the current Agent. Missing capabilities require a separate production decision.

## Consequences

Evidence can identify the earliest unexpected event after cancellation and range settlement. Version isolation is local; Native coverage is reported separately from logical fixtures. A real child that cannot become ready within the original budget remains an acceptance failure. Candidate counts include new facility cases and are recomputed. No full G1 starts while substantive prerequisites or legacy policy conflicts remain open. Skill, runtime, model settings, G2 criteria and original conditional skips stay unchanged.

## Verification

Facility contracts cover capture admission, cancellation settlement, failed range proof, retained capture errors, terminal races and joined readers. Exact targeted and related-file runs preserve raw logs and JSON. Independent collections compare file, fullName and occurrence with static relay parameters. Native Job and protocol gates remain distinct from RTL acceptance. Controller tests and read-only actual-authority checks record zero real Provider calls and zero new real reservations.
