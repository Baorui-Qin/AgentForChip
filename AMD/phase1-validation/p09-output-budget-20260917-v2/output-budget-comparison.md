# P09 Output Budget Comparison

## Design

Fresh paired experiments compare 2,048 and 8,192 output tokens on all four task/group cells that were truncated in the prior campaign. Each cell starts from its frozen incorrect DUT, uses the same full tool protocol and high reasoning, and is run once per budget. The two budgets alternate in the frozen schedule. These are targeted repair experiments, not a new full A/B/C benchmark or an estimate of population success.

Only max_tokens and the matching output reserve differ within each pair, apart from immutable sample identity. Both arms use the same post-campaign Host fix for disappearing Vivado child directories. Historical results are not overwritten or used as the concurrent control.

## Results

| Task / Group | New 2,048 | New 8,192 | 2,048 Actual Output Tokens | 8,192 Actual Output Tokens |
| --- | --- | --- | ---: | ---: |
| sequence_101 / C | VERIFIED | VERIFIED | 3075 | 3105 |
| sequence_101 / B | VERIFIED | VERIFIED | 1456 | 3167 |
| signed_saturating_add / C | VERIFIED | VERIFIED | 1306 | 1197 |
| ready_valid_slot / A | VERIFIED | VERIFIED | 1275 | 2887 |

Output token columns sum every request in an experiment, including reasoning and unsuccessful requests. They are not single-request limits.

| Budget / Request | Verified | Truncated | API Dispatches | Actual Output Tokens | Model Seconds | Active Seconds |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2048 | 4/4 | 0/4 | 8 | 7112 | 50.9 | 748.3 |
| 8192 | 4/4 | 0/4 | 9 | 10356 | 68.6 | 758.2 |

## Context and Other Limits

The project window remains 16,384 tokens and the safety margin is 1,024. Input allowances are therefore 13,312 and 7,168. Exact whole-request counting, including required reasoning replay and tool messages, is retained. Requests with reduced context: 0. Unknown output usage is preserved as null, not estimated as zero. Model time includes request preparation; active time includes positive calibration, initial failure, model work and EDA verification.

The 60-second model timeout, 65,536-byte response cap, event cap and EDA limits are unchanged for both arms. A larger max_tokens is not an unlimited-output promise. Each truncation is classified from the actual finish metadata, rather than assumed to be a token cap.

## Audit

All 41 terminal model/EDA manifests match their complete file sets, byte sizes and SHA256. Verified outputs are independently bound to the current revision and four PASS stages. All 6300 files in the historical archive are unchanged. New dispatches: 17/120; prior plus new: 66/375. No failed cell was resampled.

See request-audit.json, verification-bindings.json and artifact-manifest-audit.json for machine-readable evidence. Raw tool streams, exact requests and EDA artifacts remain under experiments.

## Interpretation Limits

There is only one sample per budget per selected cell. Selection was based on historical truncation; these results cannot establish statistical significance, general success rates or the efficacy of A/B/C context strategies. The provider alias can change and generation is stochastic. The official thinking-mode documentation says temperature is ignored, so a transmitted value of zero does not imply deterministic sampling. More output also leaves less room for input and retained reasoning. Full OS isolation and full implementation timing closure remain unverified.

Provider references: [Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion/), [Thinking Mode](https://api-docs.deepseek.com/guides/thinking_mode/), [Model Limits](https://api-docs.deepseek.com/quick_start/pricing/).
