# Agent Note: P09 test-local interstep timing

Status: implemented

English | [中文](2026-10-10-p09-interstep-timing.zh.md)

## Problem

The original 60000 ms P09 tool-budget case has a historical full-G1 cancellation after 13 tool steps and 13 local model responses, while a passing related run completes all 15. Public workflow events identify long intervals but cannot assign them to source binding, evidence reads, state publication or other Host work.

## Decision

The [collector](../../../../rtl-tools/tests/helpers/interstep-timing.ts) observes explicitly selected value methods on one caller-owned workflow instance. The [target integration](../../../../rtl-tools/tests/p09-auto.spec.ts) enables it only for `enforces the tool budget independently of accepted repairs` when `G1_INTERSTEP_TRACE=1`. The formal runner clears this switch. Observation precedes the existing Scope proxy; production code and the original fixture, assertions, 15-step limit, 60000 ms body and 10000 ms hook stay unchanged.

Wrappers call the original method once with its receiver and arguments, preserve synchronous values and errors, and return the original native Promise. They do not assimilate thenables or replace cancellation signals. Promise observation adds a settlement reaction and marks rejection handled, so observed asynchronous methods remain caller-awaited or Scope-tracked. The recorded end is the observer reaction after settlement, not an exact underlying completion instant.

Events stay in memory with limits of 4096 rows and 128 pending spans; exact serialized output is capped at 2 MiB. Dropped events, observer errors and pending work are distinct. AsyncLocalStorage carries only span and operation correlation. Exclusive time subtracts the union of direct child intervals; unobserved subcalls and scheduling remain inside it, and clocks from different processes are never subtracted.

The existing [Scope cleanup](../../../../rtl-tools/tests/test-operation-scope.ts) first settles operations, owners and Managed ranges. Its final removal callback restores the observed instance and writes the trace and actual worker context with exclusive creation under the original hook budget. Capture failure retains the test roots. This extends the capture mechanism in the [continuity Note](2026-10-09-p3-g1-continuity.md) without replacing its range proof or failure retention.

## Alternatives considered

**Wrap production or replace shared functions globally.** This affects unrelated callers and the measured environment. Instance-owned test wrappers provide coarse spans first; free ESM functions remain unobserved.

**Write every span to disk or extend deadlines.** This adds work inside the measured intervals or changes acceptance. The collector buffers bounded events and flushes after resource settlement within the existing hook.

## Consequences

Maintainers can correlate Host call intervals with operation rounds and public counters while preserving the target's execution decisions. Observation adds overhead and native Promise reactions, so trace data is diagnostic evidence rather than a zero-overhead performance proof. Two passing samples do not resolve the historical timeout, establish its cause or prove an optimization. Raw historical failures remain separate from current observations.

## Verification

The nine [facility probes](../../../../rtl-tools/tests/interstep-timing.spec.ts) pass in `timing-selftest-v3`; `diagnostic-typecheck-v2` passes. `latency-target-L1-v1` passes the exact target with 30 other cases filtered; `latency-context-L1-v1` passes all 31 cases. Both target traces contain 388 events, all 15 local model streams and responses, and a terminal count of 15 tool steps with zero semantic attempts. They report closed `OBSERVED` traces with zero pending spans, drops, observer errors or omitted output.

Both actual context receipts report Node v24.16.0, pool `forks`, one worker, thread ID 0 and the original body/hook budgets. The file-context run settles 31 Scopes and 406 Managed handles with zero pending, unproven or removal-forbidden entries. The two execution receipts report valid wake windows and zero authorized real Provider dispatches. These batches do not constitute a new full G1 or Pilot/G2 result.
