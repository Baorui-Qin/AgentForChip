# Agent Note: Prompt-only RTL API development

Status: implemented

English | [中文](2026-09-28-rtl-reference-api.zh.md)

## Problem

Research P10 depends on frozen task identities and trusted evaluators. Reusing that feedback as competition input would expose information absent from a public specification. Local-model deployment is unavailable during API development, and an unchanged reference baseline cannot attach cloud credentials itself.

## Decision

The [reference adapter](../../../../rtl-tools/reference/README.md) composes a separate minimal profile around the existing agent loop. The only model tool accepts complete RTL text and performs public-interface, syntax and DUT-only synthesis checks. A shared pure interface parser preserves research behavior without importing research data into the solver. The selected provider and model come from configuration; the competition path imports no DeepSeek tokenizer and supplies no reasoning effort.

A stream-admission wrapper requires complete raw JSON and terminal success before the loop receives callable tools. The wrapper records raw chunks even when admission fails. Requests remain derived from Session history; exact requests, Session events and candidate hashes provide audit evidence. A separate loopback relay adds credentials without rewriting baseline prompts or sampling, and bounds physical dispatches across both callers.

## Alternatives considered

**Relax P10 final acceptance.** Rejected because an external-judge candidate and a research VERIFIED artifact are different claims. P10 acceptance remains intact.

**Build another agent loop.** Rejected because the existing loop already owns tool dispatch, cancellation and Session reconstruction. The reference driver contributes only its restricted tool, limits and publication rules.

**Call a working directory an OS sandbox.** Rejected because the Windows ACL provider restricts writes, not reads. Development explicitly reports capability-only isolation and requires opt-in. It is not production judge confinement.

## Consequences

API runs emit ungraded candidates, not hidden functional verdicts. Text-only responses without a checked candidate and failed runs emit empty solutions. The strict source subset excludes file-capable directives, strings, foreign code and system tasks; general SystemVerilog compatibility is deliberately sacrificed. The byte limit is not tokenizer calibration. API traces cannot establish local weight identity, GPU memory, offline readiness or contest scores. The original baseline remains an external immutable artifact.

## Testing

Focused real-loop tests cover unknown task names, the single-tool request snapshot, raw-JSON rejection, truncation, cancellation, errors and request/call limits. HTTP relay fixtures verify unmodified request bodies, actual selected-model metadata, secret-free ledgers and budget refusal. Research negative regressions cover the shared parser. Real API and local EDA smoke evidence is maintained outside the repository; OS read isolation and local Qwen resource acceptance remain separate prerequisites.
