# P07/P08 Semi-Automatic Development Acceptance

Protocol behavior and model repair success are separate verdicts. Fixed negative fixtures remain unchanged; every model candidate requires human safety approval.

| Case | State | Outcome | API attempts | Export SHA256 |
| --- | --- | --- | --- | --- |
| functional (original) | TERMINAL | VERIFIED | 1 | 641364a1efd28f007cb4cf4678a679fb3e9030f7fda7e7ab3a77308bae6844c1 |
| syntax (original) | TERMINAL | UNCLASSIFIED_FAILURE | 0 | - |
| syntax (user_authorized_supplement) | TERMINAL | VERIFIED | 1 | 03b5e2b8c64a7280996fc25b57d5be9e6d26bc5f4761e25918a1ba795f6f55bd |
| synthesis-only (original) | TERMINAL | MODEL_CONNECTION | 1 | - |

Tests: 219 PASS / 0 FAIL / 4 SKIPPED; report test: 1 PASS; supplemental legacy test: 1 PASS. Typecheck, scoped lint: PASS; documentation: 16 PASS.

Real API requests: 3; real repaired designs: 2.

The original syntax experiment remains UNCLASSIFIED_FAILURE before any model call. A separately user-authorized supplement follows the narrow same-source, same-invocation, current-top consequential-error policy fix. It does not replace the original result or resample a model failure.

Three historical replays remain separate evidence: functional retains 18/20, while Mock tests use 19/20; Prob038 shows declaration-before-use and consequential diagnostics; synthesis-only shows a missing module and its summaries. Original result and input hashes were rechecked. Replays are not fresh EDA or model repairs.

Prob038 remains separately blocked. Unattended repair, full OS isolation, naturally generated failures and statistical improvement are not accepted. Positive WNS is a post-synthesis observation, not implementation timing closure.

[Machine-readable evidence, source/log hashes, counts, resources, timing, decisions and costs](acceptance.json).

[API configuration and connection-failure audit](api-failure-audit.zh.md).
