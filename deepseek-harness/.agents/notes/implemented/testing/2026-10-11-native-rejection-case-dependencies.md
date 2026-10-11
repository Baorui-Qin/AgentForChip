# Agent Note: Independent Native rejection cases within one deadline

Status: implemented

English | [中文](2026-10-11-native-rejection-case-dependencies.zh.md)

## Problem

The Windows Native rejection test starts a relative executable and then checks four independent failure inputs in series within one 5000ms body. A current run times out. Separate diagnostic observations complete in 4657ms, including about 2984ms waiting for the relative target. That later observation does not locate the exact earlier timeout or establish an operating-system cause.

## Decision

The relative executable still runs first and must exit17 with managed-range proof. The four independent rejection inputs then execute concurrently, bounded to four cases within the same test body. Each compares the real Node spawn error against the real Windows Job result and requires waitForExit=true. Promise.allSettled waits for all assertions; rejected observations become an AggregateError. The registered rejection handles are terminated and settled in teardown. An unproven range retains the private root.

## Alternatives considered

**Increase or split the deadline.** Rejected because five separate five-second bodies or a larger timeout changes the original budget. The single body and default5000ms remain.

**Prewarm the relative executable.** Rejected because target startup would move outside the measured contract and obscure the observed cost.

**Retry the unchanged test.** Rejected because another passing run does not repair serial dependence or explain the preserved timeout.

## Consequences

The test uses at most four concurrent rejection Jobs; the relative positive remains first. Worker count, production Job ownership, grace100ms, error expectations and test identities remain unchanged. All outcomes and range conclusions remain required. The test no longer sums unrelated negative-case waits. The original failed execution remains evidence; only a new execution can establish current acceptance. This change does not explain Windows startup latency or alter host security settings.
