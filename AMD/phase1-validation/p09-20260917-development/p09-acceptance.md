# P09 Implementation and Partial Acceptance

## Result

The existing reviewed P07/P08 workflow now supports deterministic bounded context, request audits, two-entry factual history, frozen offline skill selection, bounded recoveries, and five independent task contracts. No new agent loop or HTTP client was added. Every model candidate still requires individual human review.

Final regression: 272 passed, 0 failed, 4 opt-in environment tests skipped. Official tokenizer acceptance is blocked. The source checkout is pinned but not an installed Python runtime. Mock counters are explicitly estimated. Three skills remain draft, and no evidence-backed skill bundle is accepted.

## Real Handwritten Calibration

| Task | Positive stages | Checks / mismatches | Negative mismatches / checks | WNS ns |
| --- | --- | --- | --- | --- |
| rising_edge | PASS/PASS/PASS/PASS | 128 / 0 | 53 / 128 | 4.498 |
| ready_valid_slot | PASS/PASS/PASS/PASS | 511 / 0 | 403 / 511 | 4.284 |
| sequence_101 | PASS/PASS/PASS/PASS | 256 / 0 | 125 / 256 | 4.472 |
| signed_saturating_add | PASS/PASS/PASS/PASS | 65536 / 0 | 8128 / 65536 | null (non_finite_wns) |
| enable_counter | PASS/PASS/PASS/PASS | 128 / 0 | 118 / 128 | 4.405 |


All negative cases fail simulation and skip synthesis as intended. These are evaluator checks, not generated-design or model-repair results. The initial timescale failure and the first saturating-adder report failure remain preserved. The latter produced an actual netlist and zero mismatches, but the parser rejected WNS=inf. A narrow parser change retains null/non_finite_wns with a warning. A fresh supplemental run used unchanged DUT/TB/XDC bytes; it does not rewrite the historical failure or claim timing closure.

## Unfinished Acceptance

Real API attempts: 0. The P07 supplemental execution awaits scoped authorization after execution-review rejection. P09 single-fixture and 15-cell A/B/C runs are NOT_RUN. Real multi-round behavior has not been observed. No accuracy or statistical improvement is claimed. The CLI publishes a rotated schedule but does not implement a cross-process cohort lock; duplicate aggregate cells are rejected rather than selected.

[Machine-readable acceptance](p09-acceptance.json), [real run/log/hash index](real-calibration-index.json), [test mappings](test-coverage-map.json), [open issues](open-issues.json), [tokenizer provenance](tokenizer-provenance.json), and [full test results](rtl-regression-final.json) retain separate component, replay, handwritten EDA and unstarted-model evidence. Full OS isolation, unattended execution, competition replication and Prob038 compatibility are not accepted.
