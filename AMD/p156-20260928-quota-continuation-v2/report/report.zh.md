# API 配额恢复后的独立续测报告

检查时间：2026-09-27T20:02:36.420Z。源码仍为 `25828d28f1064c6d265aefcca4031641115bd62c`；评测器、模型参数和原始候选不变。

## 结果

| 题目 | 原批终态 | 独立续测 | 新增调用 | 累计修复调用 | 新增修改 |
|---|---|---|---:|---:|---:|
| [Prob133_2014_q3fsm](../analysis/Prob133_2014_q3fsm.md) | QUOTA | MODEL_REQUEST_BUDGET_EXHAUSTED | 114 | 120 | 1 |
| [Prob137_fsm_serial](../analysis/Prob137_fsm_serial.md) | QUOTA | TOOL_STEP_BUDGET_EXHAUSTED | 109 | 110 | 14 |

原始 156 题结果保持为 Baseline **143/156**、Agent **150/156**。加入独立续测后的验收覆盖为 **150/156**，不替换原始评分。尚未验收的任务：Prob053_m2014_q4d (POLICY_BLOCKED)、Prob058_alwaysblock2 (POLICY_BLOCKED)、Prob093_ece241_2014_q3 (TOOL_STEP_BUDGET_EXHAUSTED)、Prob133_2014_q3fsm (MODEL_REQUEST_BUDGET_EXHAUSTED)、Prob137_fsm_serial (TOOL_STEP_BUDGET_EXHAUSTED)、Prob149_ece241_2013_q4 (TOOL_STEP_BUDGET_EXHAUSTED)。

## 口径与限制

用户确认配额恢复后追加独立记录。通过原批正常调度请求观察到 HTTP 200 和模型输出后执行，无额外健康探针。续测从同一初始 RTL 重建上下文，不是连续上下文的断点恢复；原题两次初始验证的状态、检查数和失配数均与原批相同。原有修复调用、工具动作、修改额度全部扣除，初始生成调用不重复计费。

两题新增调用 223 次；含网络中断批次、原 156 题批次及本次续测，共 698/20124 次。新增已知输入/输出 token 为 937018/1907552，缺失 usage 0 次。保存接口实际返回的 reasoning，未公开内部思考不可记录；原批 HTTP 402 缺失 usage 的事实不改写。

Prob062/093/149 题面与参考冲突、Prob053 初态限制和 Prob058 工具故障仍存在；这些不是本次续测修复的内容。Agent 额外工具和预算仍不支持等资源的框架净贡献结论。有限仿真不是形式等价。

## 新增工具活动

| 工具 | 接受 | 拒绝 |
|---|---:|---:|
| edit_dut | 15 | 85 |
| read_current_rtl | 2 | 0 |
| verify_rtl | 15 | 0 |
| retrieve_skill | 1 | 0 |

## 证据

- [原始 156 题报告](../../p156-20260927-v3/report/summary.zh.md)
- [156 行并列结果 CSV](combined-results.csv)；[并列结果 JSON](combined-results.json)
- [新增完整模型调用 JSONL](../analysis/calls.jsonl)；[新增 Host 工具轨迹](../analysis/tool-traces.jsonl)
- [新增逐调用索引](call-index.json)；[续测完整性审计](evidence-audit.json)；[文件哈希清单](../evidence-files.json)
- [扣减额度、候选来源及上下文重建声明](../continuation.json)

逐题 Markdown 含完整请求、返回 reasoning/输出和工具记录；revision diff、RTL 版本、原始 EDA 日志、VCD 和综合网表保留在本目录。原批完整文件逐一重算哈希，未覆盖或修改原结果。
