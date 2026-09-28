# Agent Note: P10 bounded candidate recovery and independent repair budgets

Status: implemented

English | [中文](2026-09-23-p10-candidate-budget.zh.md)

## Problem

Reasoning-only truncation, partial transmission and rejected complete RTL previously ended candidate acquisition. Three edits and legacy request/tool ceilings also prevented the requested fifteen verified edits. Full-dataset selection exposes malformed public interfaces and evaluator failures that must not become model errors.

## Decision

[Repair-v4](../../../../rtl-tools/phase1/p10/README.md#repair-v4-and-all-task-campaigns) allows two logged, thinking-disabled candidate corrections with prior returned text and Host rejection, never reference contents or evaluator feedback. It separates fifteen accepted edits, sixty tool actions, 120 repair attempts and an explicitly authorized global dispatch cap. All retries consume the same finite request ledger. Zero generation resumes/probes preserve the 20124 upper bound for 156 tasks. Default global authority remains 375.

## Alternatives considered

**Unlimited retries or silently taking a later successful sample.** This hides failures and makes cost unbounded. Every rejected attempt remains visible; first legal acquisition is reported separately from strict pass@1.

**Raise only the edit counter.** The legacy request and tool limits would still stop fifteen complete edit/verify cycles. Separate counters and pre-dispatch validation prevent this misleading configuration.

**Repair ambiguous tasks using reference ports.** That changes the public task and leaks evaluator knowledge. Unchanged task conflicts remain explicit exclusions, while nonambiguous punctuation and inline declarations are parsed locally.

## Consequences

The larger authorized budget can cost more and take longer; it does not guarantee legal or correct RTL. Candidate recovery changes the sampling protocol. Cross-campaign differences cannot be attributed to edit count alone. Calibrated scoring, complete evidence, rollback and passing-export gates remain unchanged. Old records are never overwritten.

## Testing

Focused tests cover two-correction termination, partial-output recovery, reasoning-disabled settings, rejected whitespace variants, fifteen complete edit/verify cycles with forced-action retries, independent tool/request limits, explicit 156-task authority, global-cap validation and blocked-task denominators. Real model behavior and ten-minute synthesis are measured only in the separately frozen authorized batch.
