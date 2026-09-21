# Agent Note: Opt-in Autonomous RTL Repair

Status: implemented

English | [中文](2026-09-17-p09-autonomous-repair.zh.md)

## Problem

Text-only candidate generation followed by human approval establishes repair components, but does not establish that a model chooses to verify its own changed DUT and consumes fresh tool feedback. Repair-context comparisons also need a common frozen faulty starting point, complete request accounting and independent evidence, rather than mixing generation quality with repair quality.

## Decision

The [existing repair workflow](../../../../rtl-tools/src/phase1/repair-workflow.ts) owns an opt-in automatic mode. It reuses the resolved model adapter and VerificationRunner, without changing the core agent loop. Reviewed mode remains the default. Automatic state uses schema 1.7 and cannot reinterpret or upgrade historical state in place.

The host exposes a fixed native tool registry. A model can submit only a complete DUT, request current-revision verification, read current RTL, request deterministic guidance, or finish without claiming PASS. The host accepts one complete action per response and rejects a multi-action response as a unit. An accepted edit creates an immutable revision, clears verification and requires verification before another edit. Only fresh bound four-stage PASS permits export.

The [action caller](../../../../rtl-tools/src/phase1/p09-action-call.ts) serializes the final provider request through the existing adapter and counts it with hash-pinned official Rust conversion, encoding and tokenizer components. The audited request is the sent request. The latest protocol-required assistant/tool pair includes provider replay fields; factual history never stores model reasoning. Missing runtime evidence blocks dispatch. Local exact counts and provider usage are separate observations.

Permanent cell claims and durable shared dispatch reservations survive crashes. Uncertain dispatches are not automatically replayed. The application owns bounded zero-content transport retry; lower-level retry is disabled. Final manifests are written after terminal events and closed logs, exclude themselves and are rechecked for file-set completeness, size and SHA-256 before reporting.

Frozen-defect experiments use independent A/B/C state and outputs. Skill promotion is a host evidence decision, not model authority. An explicit preflight validation mode may expose one hashed draft on a non-ablation fixture; ordinary C requests see only validated entries. No formal answer source enters guidance. The [P09 reference](../../../../rtl-tools/phase1/p09/README.md) owns deployment settings and limitations.

C-group skill bundles are checked before EDA calibration so missing evidence cannot consume calibration work or masquerade as a model failure. Bundle parsing, content hashes and evidence files share an explicit `SKILL_EVIDENCE_INVALID` outcome. Prompt injection and native retrieval select from the same current blocking stage; successful-stage diagnostics and stale observations do not justify guidance. A/B remain file-access-free. Larger configured context windows retain complete-request counting and provider caps rather than estimated capacity.

## Alternatives considered

**A separate agent framework or HTTP client.** Rejected because the existing workflow, adapter and verification service already own the required lifecycle and evidence. A second implementation would duplicate transport, cancellation and verification semantics.

**Keep per-candidate approval in automatic experiments.** This remains the default reviewed mode, but does not test the requested autonomous tool cycle. The opt-in mode accepts the explicitly acknowledged development-machine risk without calling tool restrictions an OS sandbox.

**Estimate tokens or handwrite provider templates.** Rejected because complete tool messages and replay fields can change the actual input size. A missing pinned official counter is a blocking failure, not permission to estimate.

**Resume uncertain requests or select a favorable repeated sample.** Rejected because either changes the effective sampling budget. Permanent claims, nonrefundable dispatch reservations and fixed-denominator reporting preserve incomplete and failed observations.

## Consequences

The model-facing interface cannot select paths, commands, Tcl or test assets. Conservative source checks deliberately reject some otherwise legal SystemVerilog. Existing process cleanup, environment-name scrubbing, asset hashes and quotas limit exposure but do not provide complete OS isolation. Every automatic record retains `full_os_isolation_verified=false`.

The live quota scan tolerates an ENOENT from a transient child directory disappearing during traversal. A missing run root or another filesystem error still aborts. Trusted-asset checks and terminal manifest audits remain strict; disappearance of retained evidence is not treated as a benign live-directory race.

Deterministic tests cover revision freshness, unverified finish, partial and multi-action responses, retry accounting, hardlinked runtime rejection, concurrent process claims and terminal manifests. Real API/EDA evidence belongs in a separate campaign and is not inferred from these tests. One-shot repairs do not establish a multi-round loop or context-strategy benefit. Fixed-defect success does not establish natural generation accuracy, implementation timing closure, Prob038 compatibility or statistically significant gains.
