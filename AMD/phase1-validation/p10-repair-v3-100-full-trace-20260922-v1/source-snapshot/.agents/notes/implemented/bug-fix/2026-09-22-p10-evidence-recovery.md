# Agent Note: P10 complete evidence and mode-safe recovery

Status: implemented

English | [中文](2026-09-22-p10-evidence-recovery.zh.md)

## Problem

A serialized array of many small stream chunks can exceed an event budget while actual model text remains within its response budget. Replaying a thinking-disabled assistant tool turn into thinking mode violates the provider's reasoning-history requirements. Capped diagnostic summaries and source-less elaboration invocations can hide complete DUT failure evidence.

## Decision

[P10 repair-v3](../../../../rtl-tools/phase1/p10/README.md#repair-v2) retains incremental transcripts and bounds response text, tokens and time independently of chunk-envelope overhead. The Host projects the latest tool observation into the logged factual core and excludes thinking-disabled history from subsequent thinking requests. It neither synthesizes reasoning nor discards rejected-action observations.

The diagnostic reader reparses complete retained logs and uses the run's exact trusted source paths across stages. A narrow procedural-driver rule recognizes only DUT primary errors and the exact same-invocation XSIM summary. All independent unknown errors remain blocking. The explicit 100-task mode requires a frozen manifest and calibrated selection; rejection details and calibration exclusions remain distinct from functional RTL failures.

## Alternatives considered

**Increase all limits.** This obscures an envelope-accounting defect and changes the experiment's model budget. Existing response, token and timeout limits remain unchanged.

**Ignore incomplete summaries or unknown elaboration errors globally.** Missing raw logs, damaged assets, parser overflow and independent errors still invalidate evidence. Only validated raw evidence or the narrowly recognized consequence group can recover eligibility.

**Insert artificial reasoning into history.** This fabricates model output. A new request uses Host facts instead and preserves the original response in the archive.

## Consequences

The factual core carries the latest tool result, including rejection and retrieved skill data, so compaction cannot silently erase the last observation. This consumes prompt space and can still fail the mandatory-core budget. Historical records remain immutable; replay remains diagnostic-only. A new campaign is required to measure effects on accuracy.

## Testing

Focused regressions cover large chunk envelopes, response-byte limits, forced-action rejection and recovery, tool-result retention, summary-only truncation, missing logs, process truncation, parser overflow, damaged assets, source-less elaboration, foreign invocation summaries and unknown errors. Explicit count tests retain default-ten authority and reject counts above 100. Real API behavior and accuracy are measured separately in the authorized frozen campaign.
