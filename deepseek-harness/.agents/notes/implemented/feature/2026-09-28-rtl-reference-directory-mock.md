# Agent Note: RTL reference directory mock

Status: implemented

English | [中文](2026-09-28-rtl-reference-directory-mock.zh.md)

## Problem

P10's registered tasks, campaigns and evaluator-assisted research cannot establish compatibility with a prompt-only directory interface. Reusing a shared initial candidate also cannot establish an independent reference baseline. Interface validation needs evidence that does not imply model capability or altered research acceptance.

## Decision

The [directory adapter](../../../../rtl-tools/reference/README.md) is a separate dsh profile with explicit mock-only configuration. It parses the public reference bullet format, generates a marked zero-output interface fixture, and records empty answers, errors, timeouts and cancellation separately. It does not mount LLM, EDA, credential or research plugins. Each admitted output directory has an exclusive claim and independent work directory; repeat calls need new destinations.

## Alternatives considered

**Reuse P10 commands.** Their input identity and trusted evaluator dependencies would preserve the mismatch being tested and risk confusing research acceptance with external scoring.

**Copy reference answers or implement example algorithms.** Either approach would make successful smoke artifacts look like solving capability. An interface-only mock deliberately gives up meaningful functional behavior.

**Launch a standalone Node CLI.** That would bypass the repository's profile launch requirement. Shell and PowerShell wrappers select dsh instead.

## Consequences

The existing P10 commands and strict final acceptance remain unchanged. No production solver or portable submission is implied. The parser rejects unsupported syntax rather than guessing missing ports. Original baseline files remain an external frozen dependency, not a rewritten P10 comparison path.

## Testing

Owner-local tests pin the keyless output snapshot, fresh-directory admission, explicit outcomes, and cancellation joining. No Session exists to record in the session snapshot tree. Real dsh invocation verifies the source-launch route. Linux signals, process-startup-inclusive deadlines, real model service compatibility and OS-enforced judge isolation require independent verification; this mock provides none of that evidence.
