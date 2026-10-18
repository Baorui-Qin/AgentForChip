# RTL Agent Harness 156 题测试报告

生成时间：2026-09-27T20:03:12.340Z。代码版本：`25828d28f1064c6d265aefcca4031641115bd62c`，分支 `codex/rt01-netlist-acceptance`。

## 结论

156 题已全部重新生成并取得原批终态；API 配额恢复后的两题独立续测也已取得终态并完成证据审计。完成测试不等于所有题通过。

| 口径 | 验收结果 |
|---|---:|
| 冻结原批 Baseline | 143/156 (91.67%) |
| 冻结原批 Agent | 150/156 (96.15%) |
| 加入独立续测后的 Agent 验收覆盖 | 150/156 (96.15%) |

原批评分不修改。续测从同一初始 RTL 重建上下文，扣除之前已用的请求、工具与修改额度，不能伪装成连续上下文的一次实验。以上是冻结参考评测器和网表规则下的验收覆盖，不是已经独立证明的公开规格正确率，也不是等资源的框架净贡献。

## 配额恢复续测

| 题目 | 原批终态 | 独立续测终态 | 新增模型调用 |
|---|---|---|---:|
| Prob133_2014_q3fsm | QUOTA | MODEL_REQUEST_BUDGET_EXHAUSTED | 114 |
| Prob137_fsm_serial | QUOTA | TOOL_STEP_BUDGET_EXHAUSTED | 109 |

原候选不重新生成、不挑选新答案、不增加已授权总额。续测准备曾因遗漏 profile 在启动前失败，该目录及日志保留，新增 API 调用为 0。

## 未通过与有效性风险

| 题目 | 最新记录终态 | 说明 |
|---|---|---|
| Prob053_m2014_q4d | POLICY_BLOCKED | 公开题面未规定的已知初态要求导致 INCONCLUSIVE，非已确认模型功能错误 |
| Prob058_alwaysblock2 | POLICY_BLOCKED | Vivado 临时目录扫描 EPERM，TOOL_ERROR，未伪造为功能失败 |
| Prob093_ece241_2014_q3 | TOOL_STEP_BUDGET_EXHAUSTED | 已知题面/参考冲突；工具动作预算耗尽 |
| Prob133_2014_q3fsm | MODEL_REQUEST_BUDGET_EXHAUSTED | 保留实际修复终态和完整调用轨迹；不以人工修改代替模型解题 |
| Prob137_fsm_serial | TOOL_STEP_BUDGET_EXHAUSTED | 保留实际修复终态和完整调用轨迹；不以人工修改代替模型解题 |
| Prob149_ece241_2013_q4 | TOOL_STEP_BUDGET_EXHAUSTED | 已知题面/参考冲突；工具动作预算耗尽 |

此外，Prob062 的隐藏参考选择极性与公开错误示例的修复方向相反。用户批准的是 8 位输出勘误，不是极性反转，因此其参考匹配成功不能直接当作有效规格修复。Prob093/149 为事先标记的冲突；新增发现与事后敏感性分析另行标注，不静默改变主评分。

原批 137 次调用仅输出 reasoning 后达到 token 上限；工具层拒绝了 77 次重复候选和 15 次已拒版本。系统有最终预算边界，但长循环仍显著浪费资源。正负校准和有限仿真也不构成形式等价证明，`full_os_isolation_verified=false`。

## 模型调用与工具

| 批次 | 实际调用 | 缺失 usage |
|---|---:|---:|
| p156-20260927-v2 | 13 | 4 |
| p156-20260927-v3 | 462 | 2 |
| p156-20260928-quota-continuation-v2 | 223 | 0 |
| 合计 | 698 / 20124 | 6 |

已知输入 token 2320416，输出 token 4498761；451 次调用返回 reasoning。缺少 usage 的请求不猜测费用。逐调用延迟保存在统一索引中；请求耗时总和不等于并发实验的实际墙钟时长。

| Agent 工具 | 接受 | 拒绝 |
|---|---:|---:|
| edit_dut | 38 | 178 |
| verify_rtl | 38 | 1 |
| read_current_rtl | 26 | 1 |
| retrieve_skill | 3 | 0 |

这里统计模型选择的工具，不把 Host 自动初始验证说成模型主动调用。底层 xvlog/xelab/xsim/Vivado 命令另保存在工具轨迹和原始 EDA 目录。

## 检查入口

- [156 题原批与续测并列表](task-results-156.csv)
- [跨批次逐调用统一索引](model-call-index.jsonl)：模型、请求哈希、调用目录、token、延迟、返回 reasoning 状态与工具名。
- 原始 156 题详细报告（历史路径：`D:/AMD/p156-20260927-v3/report/summary.zh.md`，本包未收录）；逐题完整解题记录（历史路径：`D:/AMD/p156-20260927-v3/report/report.zh.md`，本包未收录）
- 独立续测报告（历史路径：`D:/AMD/p156-20260928-quota-continuation-v2/report/report.zh.md`，本包未收录）；Prob133 只读反例分析（历史路径：`D:/AMD/p156-20260928-quota-continuation-v2/report/host-observations.zh.md`，本包未收录）
- 原批完整请求、reasoning、输出及工具参数（历史路径：`D:/AMD/p156-20260927-v3/analysis/calls.jsonl`，本包未收录）；续测完整模型调用（历史路径：`D:/AMD/p156-20260928-quota-continuation-v2/analysis/calls.jsonl`，本包未收录）；网络中断批次调用（历史路径：`D:/AMD/p156-20260927-v2/analysis/calls.jsonl`，本包未收录）
- 原批 Host 工具轨迹（历史路径：`D:/AMD/p156-20260927-v3/analysis/tool-traces.jsonl`，本包未收录）；续测 Host 工具轨迹（历史路径：`D:/AMD/p156-20260928-quota-continuation-v2/analysis/tool-traces.jsonl`，本包未收录）
- 原批最终完整性检查（历史路径：`D:/AMD/p156-20260927-v3/report/final-integrity.json`，本包未收录）；续测证据审计（历史路径：`D:/AMD/p156-20260928-quota-continuation-v2/report/evidence-audit.json`，本包未收录）
- 原批文件哈希清单（历史路径：`D:/AMD/p156-20260927-v3/evidence-files.json`，本包未收录）；续测文件哈希清单（历史路径：`D:/AMD/p156-20260928-quota-continuation-v2/evidence-files.json`，本包未收录）

每题分析文件保存完整 prompt、接口实际返回的 reasoning/response 和工具记录。RTL 各版本、相对实际父版本的 diff、已执行阶段的原始编译/仿真日志、VCD、综合报告、网表和验收收据均保留；未执行阶段明确为 skipped，不伪造记录。规范化流不是原始 HTTP/SSE 抓包。没有保存凭据，也不声称获取接口未公开的内部思考。

## 后续问题

P0：独立裁定并修复题面/参考冲突和初态要求，修复临时目录扫描的基础设施故障；保留本版全部历史成绩。

P1：为重复候选和重复被拒版本建立更早的终止规则，核对 reasoning 截断与强制动作路径，并补全全局 API 配额熔断。新的协议必须另开冻结实验，不能回填修改本轮得分。

P2：在等模型、等 token/调用/工具预算下另做框架消融；需要更强正确性结论时增加独立规格验证或形式验证。
