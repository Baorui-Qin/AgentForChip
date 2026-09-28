# RTL Agent Harness 156 题测试报告

生成时间：2026-09-27T17:29:01.260Z。批次：`p156-20260927-v3`；源码提交：`25828d28f1064c6d265aefcca4031641115bd62c`。156 题均已生成并取得比较终态，不代表全部通过，也不代表所有题都完成了完整修复预算。

## 结论

本版 Harness 下，Baseline 的最终验收覆盖为 **143/156 (91.67%)**，Agent 为 **150/156 (96.15%)**。这衡量冻结参考评测器及网表规则下的验收，不是已经独立证明的公开规格正确率，也不是等资源的 Agent 框架净贡献。

已确认的限制包括 Prob062 的选择极性冲突、预声明的 Prob093/149 题面与参考冲突、Prob053 的未知初态阻塞，以及 Prob058 的 Vivado 临时目录扫描故障。尤其不能把模型迁就错误参考后通过的案例包装成有效修复。

**API 配额阻塞：2 题的修复阶段因服务端 HTTP 402 / QUOTA 中止，完整修复实验未完成。** 受影响题目为 Prob133_2014_q3fsm、Prob137_fsm_serial。本地调用次数上限未耗尽，未查询账户余额，不将未收到模型答案的请求计作模型推理失败。没有自动充值、换用模型或追加预算。

本批后续正常请求已观察到 HTTP 200 和模型内容。用户已批准对这些 QUOTA 题追加独立续测；该续测从同一候选重建上下文并扣除已用额度，见 [独立续测报告](../../p156-20260928-quota-continuation-v1/report/report.zh.md)，不回写本批评分。

## 结果与预算

| 指标 | 结果 |
|---|---:|
| 候选生成 / 比较终态 | 156/156 / 156/156 |
| 首次调用合法 / 纠正后新增合法 | 136 / 20 |
| Baseline 最终验收 | 143/156 (91.67%) |
| Agent 最终验收 | 150/156 (96.15%) |
| 已观察修复成功 / 触发修复题 | 7/11 (63.64%) |
| API 配额阻塞题 / HTTP 402 调用 | 2 / 2 |
| 已接受 RTL 修改 | 23 |
| 本批模型调用 / 硬上限 | 462 / 20111 |
| 含中断批次的总调用 / 总授权 | 475 / 20124 |
| 本批生成 / 修复调用 | 176 / 286 |
| 本批已知输入 / 输出 token | 1380177 / 2587090 |
| 本批缺失 usage 的调用 | 2 |
| 返回 reasoning 的调用 / 字节 | 324 / 8405514 |
| Provider token 上限 / 仅 reasoning 截断 | 137 / 137 |
| 版本回滚 / 上下文压缩次数 | 13 / 117 |

生成阶段允许最多两次合法候选纠正，因此不是严格单调用 pass@1。Agent 额外获得反馈、技能、工具和修复预算。缺失 usage 不猜测费用；中断批次另有 4 次未知 usage，13 次尝试均已计入总预算。

## 实际工具活动

| 工具 | 选择次数 | 接受 | 拒绝 |
|---|---:|---:|---:|
| edit_dut | 116 | 23 | 93 |
| verify_rtl | 24 | 23 | 1 |
| read_current_rtl | 25 | 24 | 1 |
| retrieve_skill | 2 | 2 | 0 |

上表是 Agent 工具动作。Host 初始验证与 Agent 的 `verify_rtl` 触发记录分开，底层 xvlog/xelab/xsim/Vivado 命令在各 verification 的 commands/events 和原始日志中保留，不将 Host 自动执行冒称为模型主动调用。

工具拒绝原因：`REPEATED_CANDIDATE` 77 次；`VERIFICATION_REQUEST_REJECTED` 1 次；`UNKNOWN_TOOL` 2 次；`REJECTED_REVISION` 15 次。拒绝重复候选并不等于已经及时终止无效循环，应结合逐题调用数和终止规则检查。

## 未验收终态

| 题目 | Baseline | Agent | 策略规则 |
|---|---|---|---|
| Prob053_m2014_q4d | INCONCLUSIVE | POLICY_BLOCKED | UNCLASSIFIED_FAILURE |
| Prob058_alwaysblock2 | TOOL_ERROR | POLICY_BLOCKED | EXECUTION_OR_EVIDENCE |
| Prob093_ece241_2014_q3 | FAIL | TOOL_STEP_BUDGET_EXHAUSTED | - |
| Prob133_2014_q3fsm | FAIL | QUOTA | - |
| Prob137_fsm_serial | FAIL | QUOTA | - |
| Prob149_ece241_2013_q4 | FAIL | TOOL_STEP_BUDGET_EXHAUSTED | - |

`TOOL_ERROR`、`INCONCLUSIVE`、`QUOTA` 和策略阻塞不等于已确认的模型功能失败。Baseline 的功能失配与 Agent 未获 API 回复是不同事件。没有篡改这些终态以凑齐通过率；涉及配额阻塞的修复率是不完整观察，不可当作足额修复能力估计。

## 实验有效性

预声明只排除 Prob093/149 的辅助口径：Baseline 143/154 (92.86%)，Agent 150/154 (97.40%)。该口径仍包括运行中新增发现的问题。

事后敏感性分析另排除 Prob062 选择极性冲突、所有 Baseline 为 INCONCLUSIVE/TOOL_ERROR 的题，以及 Agent 被 QUOTA 阻塞的题：Baseline 143/149 (95.97%)，Agent 149/149 (100.00%)。这是明确标注的事后辅助统计，不替换主结果，不证明剩余题库完全正确，也会排除部分较难且尚未完成修复的题。排除名单和原因见 [JSON 汇总](final-summary.json)。

- [初态与 mux 极性问题](evaluator-limitations.json)：无模型参考泄漏，原始题面与隐藏参考均未修改。
- [临时目录故障及比较续跑](comparison-resumes.json)：只运行尚无比较结果的题，不覆盖既有失败、不重新生成答案、不增加预算。
- [API 配额阻塞明细](api-quota-blocks.json)：服务端 HTTP 402，无模型输出；后续 API 恢复已观察到，受影响题另行续测，原批次记录不覆盖。
- [网络故障与独立新批次](../restart-decision.json)：中断批次全部保留，新批次仅对实验进程设置 DeepSeek 域名直连，不改变系统代理或 TLS 校验。
- [运行条件观察](run-conditions.json)：Vivado 延迟存在明显波动，不能直接把总运行时间差异归因于模型或框架。

RTL 使用 `p10-settled-rtl-1`，最终验收要求 `p10-netlist-1`。正负校准与有限仿真不是形式等价，也不是独立的参考规格审计。`full_os_isolation_verified=false`。

## 审计资料

- [完整取证报告与逐题索引](report.zh.md)
- [156 行结果 CSV](task-results.csv)
- [完整模型请求、返回 reasoning/输出及工具参数 JSONL](../analysis/calls.jsonl)
- [Host 工具与验证轨迹 JSONL](../analysis/tool-traces.jsonl)
- [逐调用 token、延迟与工具索引](call-index.json)
- [证据审计](evidence-audit.json)；[最终完整性检查](final-integrity.json)；[完整文件哈希清单](../evidence-files.json)
- [中断批次的 13 次调用记录](../../p156-20260927-v2/analysis/calls.jsonl)

每题 `analysis/<task>.md` 包含完整请求、接口实际返回的 reasoning、输出和工具轨迹，`*-revision-*.diff` 对应接受修改的实际父版本。原始 model/EDA 目录保留规范化流、所有 RTL 版本、日志、VCD、综合网表与验收收据。不保存凭据，不声称记录接口未公开的内部思考；规范化流不是原始 HTTP/SSE 抓包。
