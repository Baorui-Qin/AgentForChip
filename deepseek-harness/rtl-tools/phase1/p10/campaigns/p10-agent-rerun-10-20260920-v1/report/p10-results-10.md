# P10 修复可达性 10 题重跑

状态：**P10_COMPARISON_VALID**。实现为 `p10-model.ts`，legacy comparison 未参与计分。

- Baseline verified：6/10
- Agent final verified：6/10
- Recovered：0
- Repair gain：+0 题，+0 个百分点
- 漏斗：baseline_failed=0 → repair_eligible=0 → repair_requested=0 → edit_accepted=0 → reverified=0 → recovered=0
- 有效 repair attempt：0；无效 attempt：0
- OUTPUT_TRUNCATED=0，TIMEOUT=0，TRANSPORT=4，TOOL_ERROR=0，POLICY_BLOCKED=0
- transport retry=9；output recovery=0；二者均不计 semantic repair。
- `full_os_isolation_verified=false`；`counterexample_feedback=NOT_IMPLEMENTED`。

## Baseline FAIL 终态与证据

| 任务 | Baseline | 最终原因 | Eligible | Edit | Reverify | Recovered | 对照记录 |
|---|---|---|---:|---:|---:|---:|---|
| - | - | - | - | - | - | - | - |

## 未形成 Baseline

| 任务 | 生成终态 | 最终原因 | Provider dispatch | Transport retry | 生成记录 |
|---|---|---|---:|---:|---|
| Prob074_ece241_2014_q4 | TRANSPORT | TRANSPORT | 3 | 2 | D:\AMD\phase1-validation\p10-agent-rerun-10-20260920-v1\generate-Prob074_ece241_2014_q4\result.json |
| Prob015_vector1 | TRANSPORT | TRANSPORT | 3 | 2 | D:\AMD\phase1-validation\p10-agent-rerun-10-20260920-v1\generate-Prob015_vector1\result.json |
| Prob033_ece241_2014_q1c | TRANSPORT | TRANSPORT | 3 | 2 | D:\AMD\phase1-validation\p10-agent-rerun-10-20260920-v1\generate-Prob033_ece241_2014_q1c\result.json |
| Prob004_vector2 | TRANSPORT | TRANSPORT | 3 | 2 | D:\AMD\phase1-validation\p10-agent-rerun-10-20260920-v1\generate-Prob004_vector2\result.json |

## 审计问题

- 无。
