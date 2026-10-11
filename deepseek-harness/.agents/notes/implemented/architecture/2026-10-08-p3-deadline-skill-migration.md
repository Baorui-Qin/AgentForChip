# Agent Note: Deadline facts and opt-in Skill01 on the updated RTL Agent

Status: implemented

English | [中文](2026-10-08-p3-deadline-skill-migration.zh.md)

## Problem

RTL verification needs consistent timeout facts when an enclosing stage or total budget ends a managed command. The updated Agent also needs evidence-bound Skill01 without changing its Knowledge-disabled or Skill01-disabled behavior, recovery or netlist acceptance.

## Decision

[Process execution](../../../../rtl-tools/src/process.ts) recognizes explicitly typed command, stage and total deadline reasons. A known deadline sets the timeout fact; an unrelated caller abort does not. Exit status and upstream cancellation remain independent, and successful return requires managed-range proof. Verification keeps its original timer boundaries and budgets. [Evidence access](../../../../rtl-tools/src/phase1/evidence-access.ts) serializes same-run metadata scanning and JSON publication, retains original filesystem failures and joins active access before closing.

[Skill01](../../../../rtl-tools/src/phase1/skill01.ts) is an independent draft asset behind a default-off P10 setting. It requires current source-bound functional evidence and explicit public edge rules. The context builder preserves its existing Knowledge order and disabled request bytes. The whole procedure consumes at most 512 tokens within the existing combined 768-token Skill limit; Knowledge retains its independent limit. Missing capacity removes the complete procedure and records why. Model-submitted summaries remain model-authored; observing a summary is separate from strict experimental acceptance.

Windows terminate-channel EPIPE is a retained diagnostic, not a substitute for Job range proof. Existing grace escalation remains active, and abnormal closure rejects proof. The private runner exits only after its protocol and native ownership settle. The [Knowledge decision](2026-10-08-updated-agent-knowledge-baseline.md) remains active and governs retrieval independently.

## Alternatives considered

Increasing timeouts would change the budget without resolving the two deadline facts. Replacing the updated Agent with whole old files would discard recovery, netlist and audit changes. Host-written summaries would mask model noncompliance. Reusing historical test success would not validate the current source.

## Consequences

Known enclosing deadline cancellation becomes observable as timeout while caller cancellation and exit codes stay distinct. Skill01 remains opt-in and cannot authorize repairs or establish RTL correctness. Every migration requires a new source and test identity. Local tests do not establish real Provider readiness, causal benefit or adoption, and they do not renew the shared request allowance.

## Verification

Focused cases cover deadline sources, cancellation, absent range proof, same-run access, Skill applicability and whole-procedure removal. Windows protocol and native cases distinguish direct outcomes from managed-range proof. Strict per-edit summary auditing and a fresh complete G1 are separate acceptance requirements. Historical failed receipts remain immutable.
