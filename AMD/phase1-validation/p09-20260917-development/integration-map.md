# P09 Integration Map

The owning implementation is `D:/deepseek-harness/rtl-tools`. No application bypasses dsh and no new HTTP client or core agent-loop was introduced.

| Concern | Owner | Evidence |
| --- | --- | --- |
| P07 narrow 10-8549 classification | `src/phase1/repair-diagnostics.ts` | `p09-context.spec.ts`, historical diagnostic replay |
| Trusted public/private task split | `src/phase1/p09-tasks.ts` | Five real positive/negative Vivado calibrations |
| Signed and legacy DUT interfaces | `src/phase1/candidates.ts` | P09 interface and existing P05 extraction tests |
| Required core, deterministic optional reduction | `src/phase1/p09-context.ts` | 18 pure context/interface/diagnostic tests |
| Official full-envelope local counter | `src/phase1/p09-tokenizer.ts`, `phase1/p09/count_tokens.py` | Wrapper and fail-closed behavior tested; real dependency acceptance BLOCKED |
| Post-resolution, pre-dispatch hook | `src/phase1/model.ts` | Loader request-content audit; real network parity unverified |
| Context event persistence | `src/phase1/recorder.ts` | Native event sequence reconstruction and snapshot |
| Shared recovery and request reservation | `src/phase1/p09-proposal.ts` | Transport/context/format, no-dispatch, and total-budget tests |
| Revision, approval, new EDA and export | `src/phase1/repair-workflow.ts` | Existing reviewed loop with optional P09 state; Mock multi-round verification |
| Fixed-denominator report | `src/phase1/p09-report.ts` | 15-cell NOT_RUN report, duplicate/result-binding tests |
| CLI and thin wrappers | `src/phase1/repair.ts`, `phase1/profiles/rtl-p09`, `phase1/p09/run.ps1`, `run.sh` | Real dsh calibration, replay and report commands |
| Vivado observed non-finite WNS | `src/vivado-parser.ts`, `synthesis.ts`, `synthesis-output.ts` | Unit tests plus new unchanged-asset saturating-adder calibration |

The text-wire serializer is imported from the existing DeepSeek adapter through one explicit source alias in `tsconfig.base.json`. The profile reuses credential, provider, subprocess and policy services. `tools=[]`; native Session serialization is unchanged.

## Remaining Boundaries

The official tokenizer source checkout does not constitute an installed runtime. The skill selector is implemented but all three shipped entries remain draft. CLI commands are individually resumable; the generated ABC/BCA/CAB schedule is not a cross-process cohort lock. Real P09 model experiments have not begun, and the published 225-attempt ceiling has not been exercised.
