# Agent Note: Exact version isolation for independent repair policy tests

Status: implemented

English | [中文](2026-10-11-auto-positive-version-isolation.zh.md)

## Problem

The automatic two-repair positive stops with POLICY_BLOCKED when its compile stage reaches the original 5000ms deadline. Four native fake-version invocations consume4494ms of the observed5021ms stage. The test body has60000ms; changing that body cannot fix the stage's shared deadline. The receipts do not establish an operating-system latency cause.

The foreign-approval rejection test also stops before review when initial compilation times out: its four version calls consume4059ms of a5067ms stage. No model request or approval tampering occurs in that failed run. Its native handles settle with range proof. This is another unrelated version dependency in a policy test, not observed approval acceptance.

The AUTH no-recovery case ended before its expected first isolated model request: actual0, expected1, with14 settled and range-proven handles, the last exit1. Its original stage/argv receipt is unavailable, so the exact stage and timing remain unknown. Only this AUTH parameter now isolates the same independent version dependency and gains bounded public Target capture; the other two parameters retain their original facility selection.

## Decision

Only the named automatic repair positive, foreign-approval rejection test and AUTH no-recovery parameter enable the existing ManagedVersionProbeFixture. Its exact fake-verification -version argv returns independent constant version data; every other request delegates to LocalSubprocess. The setup default, business assertions, stage and body budgets remain. Fixture handles close inside the existing Scope cleanup. Synthetic version observations never prove Windows ownership. Trace-enabled validation distinguishes logical version calls from native business calls.

The [production RTL decision](../feature/2026-09-13-rtl-simulation-tool.md) remains active and unchanged. The [independent rejection-case decision](2026-10-11-native-rejection-case-dependencies.md) retains its separate scheduling rationale. Neither is superseded or archived.

## Alternatives considered

**Increase a deadline.** Rejected because the preserved stage budget governs the observed failure and is an acceptance constraint.

**Mock all subprocesses or all versions.** Rejected because business commands must retain native execution and unrelated version tests must keep their own coverage.

**Retry the unchanged full batch.** Rejected because another pass would not change the evidenced dependency cost.

## Consequences

These three tests isolate an unrelated version dependency and gives up native version startup timing within these particular workflow tests. Doctor and version-contract tests remain separate obligations. Compilation, simulation, counter execution, cancellation and range-proof cleanup remain native where previously native. Only actual related and complete regression receipts establish acceptance. No production policy or budget changes.
