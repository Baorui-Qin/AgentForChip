# Agent Note: P10 Repair Reachability and Opportunity Audit

Status: implemented

English | [中文](2026-09-20-p10-repair-reachability.zh.md)

## Problem

The prior forty-task campaign could show that the Agent route was entered, but most failed tasks never completed an accepted edit and new-revision verification. Transport failures, truncated output and EDA failures were also too easy to read as design-repair failures from the aggregate score.

## Decision

P10 retains each campaign's frozen model, prompt, validated skills, evaluator and semantic repair budget. It uses bounded infrastructure recovery: two same-wire retries for zero-byte retryable transport failures, one output recovery per logical request and no retry for cancellation or the activity deadline. Partial text and partial tool calls are never executed. Physical recovery dispatches are recorded independently from semantic repairs. [Repair V2](../feature/2026-09-21-p10-repair-v2.md) owns action-only recovery settings, richer feedback and revision selection for new campaigns.

After `edit_dut` is accepted, tool construction and Host action validation use the same pending-verification state and admit only `verify_rtl`. The repair policy permits `DUT_UNKNOWN_BUT_OWNED` only when every independent ERROR is complete, process-clean, model-repairable and explicitly owned by the DUT. Unknown ownership and tool, environment, reference or testbench evidence remain blocked.

Every accepted edit starts an attempt record. A valid attempt requires baseline failure, live feedback bound to the parent revision and source SHA, a changed persisted source revision, an accepted verification request for that revision and a hashed persisted Vivado result bound to the new source. The campaign auditor independently checks the chain and invalidates the comparison when a counted attempt, shared initial candidate or result file cannot be proven.

## Alternatives considered

**Change the prompt or add counterexamples.** Rejected because the rerun is intended to isolate repair reachability and infrastructure effects from model-capability changes.

**Retry any failed request.** Rejected because replaying partial output, user cancellation or an activity timeout can create hidden resampling and duplicate side effects.

**Keep all tools visible after an edit.** Rejected because it lets the model issue a second edit, skill request or finish before the unverified revision is scored.

## Consequences

The fixed-ten campaign reports both Baseline-to-Agent pass movement and the task/attempt opportunity funnel. OUTPUT_TRUNCATED, TIMEOUT, TRANSPORT, TOOL_ERROR and POLICY_BLOCKED include event, affected-task and mutually exclusive terminal counts. A campaign-specific dispatch cap accommodates physical recovery without changing the three-repair semantic budget. Historical directories remain immutable and full OS isolation remains unverified; observed waveform feedback belongs to the separately frozen Repair V2 policy.
