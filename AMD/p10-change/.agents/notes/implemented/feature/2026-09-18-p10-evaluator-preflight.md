# Agent Note: Model-free VerilogEval Preflight

Status: implemented

English | [中文](2026-09-18-p10-evaluator-preflight.zh.md)

## Problem

A candidate cannot earn a meaningful benchmark score when the unchanged evaluator does not compile. Reference calibration must not become a candidate PASS, consume model budget or silently repair benchmark assets. Public selection and later expansion also need identities frozen before observing results.

## Decision

The [P10 entrypoint](../../../../rtl-tools/src/phase1/p10-preflight.ts) is a host-only dsh profile without an LLM. It freezes ten public-predicate selections and a forty-task hash-ranked order from the pinned clean dataset. Permanent claims, source/configuration hashes, raw-byte asset hashes and a separate manifest receipt bind each run. Git-declared CRLF checkouts are normalized only in memory for Git blob comparison; runtime assets retain their original bytes.

[VerificationRunner](../../../../rtl-tools/src/phase1/verification.ts) exposes a separate dataset-preflight method that runs the first three stages and omits synthesis. A pure public-port wrapper delegates to the unchanged reference. Complete positive checks and zero mismatches establish evaluator readiness only. Durable records keep final_verified false; normal candidates retain the existing four-stage requirement.

Every selected task reaches an attributed evaluator outcome or INCONCLUSIVE. Unsupported interfaces are not guessed. Model routes remain NOT_RUN, usage remains null at the route level, and empty-denominator proportions remain null. The entrypoint never authorizes the forty-task run. The [P10 reference](../../../../rtl-tools/phase1/p10/README.md) owns configuration and implemented-scope limitations.

## Alternatives considered

**Patch benchmark testbenches or replace blocked tasks.** Rejected because either changes the frozen evaluator or sample after observing its outcome. Compatibility investigation requires a separate explicitly authorized experiment.

**Use reference synthesis as the readiness gate.** Rejected because readiness concerns the compile/elaborate/simulation evaluator. Candidate synthesis remains mandatory and cannot be bypassed by calibration evidence.

**Implement and dispatch the full model campaign before calibration.** Rejected because a zero-evaluable pilot must stop without model spending. The model-free profile makes this boundary auditable rather than relying on a prompt instruction.

## Consequences

The shared runner changes are narrow; the core agent loop, provider transport and reviewed-mode defaults are unchanged. Development execution requires explicit full-access authority and records full_os_isolation_verified=false. Subprocess cleanup, credential-name filtering and source hashes do not establish OS isolation.

A zero-evaluable pilot delivers NO-GO rather than a zero-percent model score. The shared-candidate generation/repair campaign and its P10 dispatch ledger are outside this implemented slice. A Harness correction requires sealing the failed version and freezing a complete new run, not replacing selected observations in an old campaign.
