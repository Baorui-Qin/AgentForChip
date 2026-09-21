# 上一轮 40 题机会漏斗审计

此文件只读引用 `D:\AMD\phase1-validation\p10-40-20260919-v1`，未改写旧 campaign。上一轮实际使用 `p10-model.ts`，legacy `comparison.ts` 未参与计分。

- 任务漏斗：`baseline_failed=7 → repair_eligible=3 → repair_requested=3 → edit_accepted=1 → reverified=1 → recovered=0`。
- Attempt 口径：`Prob078_dualedge` 接受并验证了两个不同源码 SHA，因此有 2 次有效 repair attempt，涉及 1 题。
- 互斥终态：PASS 24、OUTPUT_TRUNCATED 7、TRANSPORT 3、TOOL_ERROR/EDA infrastructure 4、TIMEOUT 0、POLICY_BLOCKED 0、evaluator blocked 2。
- OUTPUT_TRUNCATED 分期：初始生成 4，修复阶段 3。3 个旧 `UNCLASSIFIED_FAILURE` 均由 Vivado `Common 17-1257 Failed to create directory` 引起，归入基础设施失败。

证据入口：`report-v2\p10-results-40.json`、`group-4\compare-Prob078_dualedge\result.json`，以及各题 `model_runs`、`actions`、`revisions`、`verification_runs` 所指目录。

