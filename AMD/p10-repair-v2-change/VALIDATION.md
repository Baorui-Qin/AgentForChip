# P10 Repair V2 Patch Validation

Date: 2026-09-21

Applied repository: `D:/deepseek-harness`. This directory contains copies of the changed files, not a standalone runnable checkout. Historical campaign directories and source snapshots were not modified. No commit or push was made.

## Implemented

- Separate 16384-token repair output budget and 4096-token reasoning-off recovery, with complete single-action validation and a bounded recovery count.
- Exact-wire context measurement, automatic compaction at 80% or local overflow, and one compact retry for explicit provider context-overflow errors. Current source, verification binding and factual repair/rejection ledger remain present.
- Raw XSim hints and bounded existing VCD windows in simulation feedback. No inferred cycle count, sampled expected/actual values or root-cause claim.
- Best-observed revision selection, regression/tie rollback, rejected-source cache, preserved attempt evidence and source-matched final verification references.
- Updated new-campaign configuration, bilingual documentation and model-visible feedback/action snapshots.

## Checks Run

- Seven focused test files: 169 tests passed (`p10-model`, `p10-repair-v2`, `p09-context`, `p09-auto`, `repair`, `phase1-verification`, `p10-compat`).
- After final boundary/audit changes: both P10 files passed, 26 tests total. This overlaps the preceding run and is not an additional 26 independent cases.
- `node node_modules/typescript/bin/tsc -p rtl-tools/tsconfig.json --noEmit --incremental false`: passed.
- Repository oxlint wrapper on the eight changed TypeScript files: passed.
- Named bilingual pairing check for four documentation pairs: passed.
- Agent Note format check: passed (351 notes).
- `git diff --check`: passed.

## Read-Only Historical Replay

The updated parser read existing logs and VCD files with `evidence_kind=diagnostic_replay`; it did not run EDA or change the artifacts.

| Task | Observed Verdict | First Reported Failure | Waveform |
| --- | --- | --- | --- |
| Prob078_dualedge, initial | 93/224 mismatches | 10 ps | Available |
| Prob078_dualedge, regressed | 223/224 mismatches | 10 ps | Available; nearby DUT q remains x |
| Prob104_mt2015_muxdff | 1/199 mismatches | 5 ps | Available; preceding Q_ref=0, Q_dut=x |

## Limits

The provider's current interface exposes total output tokens, not an independent reasoning-token quota, a 12000-token interruption point, or mandatory tool-choice control. Recovery disables reasoning and rejects non-action output; it does not guarantee that the provider returns a valid action. VCD timestamp-end values are not necessarily the values sampled by the testbench at the same timestamp. The waveform reader supports the bounded 1ps XSim subset already present in these campaigns, not arbitrary WDB or a general semantic waveform analyzer. Real-model repair gains and fresh Vivado outcomes have not been tested; they require a new frozen campaign. Existing activity, dispatch and tool-step limits can stop a task before the maximum repair round count.
