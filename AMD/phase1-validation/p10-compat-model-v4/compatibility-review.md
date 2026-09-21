# P10 Compatibility Review

Protocol: pinned VerilogEval + Vivado 2025.2 development compatibility evaluator, not upstream Icarus or official hidden scoring.

The only TB edit moves the original two complete net declaration lines above the waveform initial block in module tb. The original lines and CRLF bytes are retained. The derived directory is external to the dataset. Eleven exact raw hashes are accepted; all others fail closed. Each task retains a diff, inverse line map and adapter-source hash under D:/AMD/phase1-validation/p10-compat-v3/derived. Prompts, reference, stimulus, comparison, timeout and sample rules are unchanged.

The declaration-only probes for notgate/count15 really passed xvlog, then failed xelab with XSIM 43-4099. The separate recorded policy supplies only the default -timescale 1ps/1ps. No override switches or TB delay edits are used. Subsequent positive/negative runs share those exact evaluator bytes.

| Task | Positive checks | Positive mismatches | Negative mismatches | Status |
|---|---:|---:|---:|---|
| Prob005_notgate | 239 | 0 | 239 | READY |
| Prob035_count1to10 | 439 | 0 | 438 | READY |
| Prob045_edgedetect2 | 228 | 0 | 205 | READY |
| Prob074_ece241_2014_q4 | 118 | 0 | 23 | READY |
| Prob015_vector1 | 218 | 0 | 218 | READY |
| Prob033_ece241_2014_q1c | 116 | 0 | 107 | READY |
| Prob004_vector2 | 110 | 0 | 109 | READY |
| Prob020_mt2015_eq2 | 2000 | 0 | 498 | READY |
| Prob018_mux256to1 | 2000 | 0 | 984 | READY |
| Prob061_2014_q4a | 200 | 0 | 118 | READY |
| Prob038_count15 | 421 | 0 | 382 | READY |

Reference self-comparison establishes runtime health only. Independent faulty DUTs demonstrate observable rejection, not exhaustive correctness. Full OS isolation and cross-simulator equivalence remain unverified.
