# 本轮异常的证据与归类

## Prob031_dff: 公开题目与参考接口冲突

上游 `dataset_spec-to-rtl/Prob031_dff_prompt.txt` 明确写 `input q`，而 `Prob031_dff_ref.sv` 声明 `output reg q`。Host 按公开题目构造的正对照 wrapper 因而也是 `input wire q`。这不是已经证实的 Vivado 调度问题，也不是模型实现错误。

正对照路径：`group-4/preflight-eda/run-Z2rLWt`。编译和展开通过，仿真 121 次检查中 120 次 mismatch，故校准不通过，本轮不调用模型、不产出模型得分。没有中途修改原始题目、参考实现或 evaluator。

## Prob080_timer: 公开接口解析不支持

当前 Host 只接收每行一个 input/output 端口的公开声明，题目接口不符合该格式；本轮保留 `HOST_INTERFACE_UNSUPPORTED`，未猜测接口或换题。另需审查题目说明与任务名的语义一致性。

## API / 输出限制

`MODEL_RESPONSE_ERROR` 的连接类错误意味着未取得可评测候选，不是证明模型不会做题。`OUTPUT_TRUNCATED` 是当前冻结输出预算内未取得完整合法结果；不提高预算或静默重试。各题次数和已知 token 见最终 JSON，缺失 usage 的请求不按零消耗声称总账准确。

## Prob151_review2015_fsm: 综合环境异常

`group-2/compare-Prob151_review2015_fsm/eda/run-MtoiTO` 的编译、展开和仿真通过，仿真 5069 次检查、0 mismatch。综合阶段返回 `Common 17-1257: Failed to create directory 'C'.`，Host 保留 `failure_domain: unknown` / `UNCLASSIFIED_FAILURE`。本轮不能将其认定为 RTL 逻辑错误，也不能因为仿真通过而给四阶段 PASS。具体环境根因尚未定位。

同类综合目录/写入异常也出现在 Prob020_mt2015_eq2、Prob127_lemmings1、Prob018_mux256to1；最后一题是 `Common 17-354: Could not open 'C' for writing`，归类为 `TOOL_ERROR`。共 4 题，不记为已证实的模型逻辑失败。

## 统计口径

固定选中 40 题，2 题校准阻塞，其余 38 题尝试新模型调用。报告的 38 题成功率是本轮端到端完成率，包含连接失败、预算内截断和工具异常影响，不是排除了基础设施问题后的纯模型能力估计。四组保持原始连续顺序，未挑选通过案例替补，不合并历史成绩。

最终互斥归类：24 题四阶段通过，7 题输出截断（4 题初次生成、3 题 Agent 阶段），3 题连接失败，4 题综合环境/未归因目录错误，2 题校准阻塞。Baseline 与 Agent 均为 24/38（63.16%），固定清单成功覆盖为 24/40（60%）。共 46 次模型请求、33 次候选 EDA、78 次正负校准 EDA；2 次语义修复，0 题恢复通过。3 次连接失败请求缺少 token usage，其余已知用量合计输入 42,263、输出 118,443，不能将此视为包含未知请求的完整计费账单。

最终报告目录为 `report-v2`。首版 `report` 被保留：审计脚本误读了 group freeze 中并不存在的 task_ids 字段，导致 4 个 selection mismatch 误报。修正版读取被 freeze 哈希固定的 selection-order.json 并与总 manifest 分组比较；不修改任何试题、候选、模型请求或验证结果。
