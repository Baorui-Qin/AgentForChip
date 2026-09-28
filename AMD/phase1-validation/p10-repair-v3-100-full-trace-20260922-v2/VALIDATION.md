# P10 100-Task Pre-Campaign Validation

Date: 2026-09-22. Repository: `D:/deepseek-harness`, base commit `868aae001d`. All changes are uncommitted working-tree changes and are captured in the campaign source snapshot and patch.

## Focused Checks

- `p10-repair-v2.spec.ts`, `p10-model.spec.ts`, `repair.spec.ts`: 99 tests covered. The initial run passed 93 and rejected six newly constructed test records for violating existing record consistency checks. After correcting only those fixtures, all six focused reruns passed. No production validation was relaxed to accommodate a fixture.
- `p09-auto.spec.ts`, `p09-context.spec.ts`, `hdl.spec.ts`, `phase1-verification.spec.ts`: 98 passed; full terminal output is in `regression-remaining.log`.
- Total distinct tests passing across the focused runs: 197.
- `node node_modules/typescript/bin/tsc -p rtl-tools/tsconfig.json --noEmit --incremental false`: passed.
- `node --import tsx/esm scripts/run-oxlint.ts` for the eight changed TypeScript source/test files: passed.
- `git diff --check`: passed.
- Named translation-pair checks for the P10 README and evidence-recovery Agent Note: passed.
- Agent Note format check: 352 notes passed.

These are local mocks and deterministic regression checks, not evidence of real-provider accuracy. Sandbox `spawn EPERM` startup failures were rerun with narrow host authorization, without bypassing application checks.

## Read-Only Historical Replay

The replay runs through a model-disabled dsh profile. `historical-replay.json` retains original and reparsed receipts for Prob043, Prob074 and Prob104. Original receipt and run-result bytes are unchanged. Replay evidence remains `diagnostic_replay`, and the live-execution policy returns `UNTRUSTED_EVIDENCE` for all replay records.

Counterfactual policy evaluation, explicitly not execution authority, shows that complete raw Prob043 logs resolve the summary-cap blockage, while Prob074 and Prob104's exact DUT procedural-driver groups become classified elaboration failures. Their comparable failure score is rank 4 rather than missing evidence. No historical model result or accuracy was rewritten.

## Frozen Budgets

Generation remains 8192 completion tokens and 65536 response bytes. Normal repair remains 16384 tokens and 262144 response bytes; one bounded action-only recovery uses 4096 tokens with reasoning disabled. There are at most three semantic repair rounds, 120 seconds per request and 1200 seconds per task activity. The 100-task campaign retains the existing global cap of 375 physical dispatches and allows two comparison workers.

The latest tool result is retained in the logged factual core. Thinking-disabled assistant/tool messages do not enter the next thinking-mode request. Diagnostic completeness is recovered only from validated retained raw evidence; missing logs, damaged assets, parser overflow, process truncation and independent unknown errors still block.

## Startup Configuration Failure

The first prepared 100-task directory used an unsupported 1000-dispatch limit. The existing ticket allocator rejected it before any API dispatch. That attempt and its zero-dispatch audit are preserved separately; no generated candidate is reused and no failure is counted as model accuracy. The successor directory uses the same 100-task manifest with the existing 375-dispatch global bound. Production model/EDA code remains unchanged between these two directories; only the preparation configuration and corresponding documentation differ.
