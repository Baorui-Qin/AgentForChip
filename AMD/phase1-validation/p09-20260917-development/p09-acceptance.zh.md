# P09 实现与验收报告

## 结论

核心上下文与受控恢复代码已接入原有 P07/P08 工作流，组件与真实手写评分器校准有证据。P09 整体验收尚未通过：官方 Tokenizer 未安装成功、技能仍为 draft、P07 补充实验待执行授权、真实单夹具和五题 A/B/C 尚未运行。本轮真实 API 调用为 0，不能声称模型修好了五题或证明了多轮收益。

## 已实现

- 在 callText 配置解析后、流派发前构建并审计完整请求；没有新增 HTTP 客户端或修改核心 agent-loop。
- TaskSpec 固定五题公开接口及独立评分资产，支持符号属性；单文件单 DUT，沿用审批、快照和导出。
- 必需题面、当前 RTL 和独立错误不裁剪；可选技能、账本和附加诊断确定性裁剪，重复计量完整请求。
- A/B/C 独立上下文；最多两条事实账本、两条离线规则；关闭技能不读技能文件。三条技能目前未达 validated。
- 每实验最多 15 个预算占用、最多三轮语义修复；上下文/格式各恢复一次，共享传输重试额度。保留实际派发与仅占用预算的区别。
- 新 schema 1.6 工作流、上下文侧写、恢复记录及全 15 单元汇总；每份模型候选仍需逐份人工审查。

## 测试与真实校准

最终回归：272 通过、0 失败、4 跳过。跳过的是 3 个 opt-in Vivado 工具测试和 1 个 Icarus 安装测试，不作为本轮验收通过。另通过真实 dsh/Vivado 校准以下五题，模型调用均为 0。

| Task | Positive stages | Checks / mismatches | Negative mismatches / checks | WNS ns |
| --- | --- | --- | --- | --- |
| rising_edge | PASS/PASS/PASS/PASS | 128 / 0 | 53 / 128 | 4.498 |
| ready_valid_slot | PASS/PASS/PASS/PASS | 511 / 0 | 403 / 511 | 4.284 |
| sequence_101 | PASS/PASS/PASS/PASS | 256 / 0 | 125 / 256 | 4.472 |
| signed_saturating_add | PASS/PASS/PASS/PASS | 65536 / 0 | 8128 / 65536 | null (non_finite_wns) |
| enable_counter | PASS/PASS/PASS/PASS | 128 / 0 | 118 / 128 | 4.405 |


负例均在仿真阶段确认失配，综合 SKIPPED，这是评分器命中错误，不是负例设计通过。真实日志、网表、原始报告、源文件及资产哈希见 [real-calibration-index.json](real-calibration-index.json)，每个 run 下保留 result.json、events.jsonl、snapshot-*/manifest.json 与 build/。

## 保留的失败与修正

1. 初版 enable_counter 因 XSIM 43-4099 的 timescale 编译单元配置失败。新内部任务 v2 保持一次 xvlog -sv，调整可信 TB 在 DUT 前；未修改 VerilogEval 资产。初版记录保留在 p09/。
2. signed_saturating_add 首次仿真 65536 次零失配，实际综合成功，但 WNS=inf 被当作报告解析错误，四阶段未通过。窄修正将实测 inf/0.000 报告值记录为 null/non_finite_wns，并保留警告；不增加 I/O 约束、不修改设计。补充运行 66a58a91-658b-428f-8901-6855c6b9e4d0 用相同资产通过校准，历史 CALIBRATION_FAILED 不改写。
3. VRFC 10-8549 的实测关键词错误已增加窄分类与策略测试，真实历史日志重解析保存在 p09-v2/replay-68b7e806-8c28-43ef-997c-05c82dacc82b/diagnostic-replay.json。eda_rerun=false，model_repair_executed=false，不冒充补充修复实验。

## 尚未完成

官方源码已固定提交与许可证，但当前 Python 环境未找到可安装发行包，源码构建依赖未就绪。未部署本地模型，也未用字符估计冒充准确 Token。详见 [tokenizer-provenance.json](tokenizer-provenance.json)。仅模板封装存在不等于 T05/T06 通过。

P07 完整访问补充命令被执行审查拒绝，未绕过；需要明确限定授权再启动。P09 单夹具与五题真实调用均未开始，所有 15 个单元在 [A/B/C 报告](p09-v2/report-cad0629d-3a41-4040-b213-aa46f011c780/p09-ablation.json) 中保留 NOT_RUN。来源技能必须先校准并冻结，不能把 draft 当已验证技能。跨进程总协调锁和提前拒绝重复单元尚未实现，当前汇总器拒绝重复结果，而不是自动挑选有利样本。

## 路径与验收边界

机器结果：[p09-acceptance.json](p09-acceptance.json)。测试映射：[test-coverage-map.json](test-coverage-map.json)。开放问题：[open-issues.json](open-issues.json)。实现身份：[source-freeze.json](source-freeze.json)。完整日志索引：[real-calibration-index.json](real-calibration-index.json)。原始测试结果：[rtl-regression-final.json](rtl-regression-final.json)。

本报告分别回答：P09 参与控制在 Mock 中已验证；真实模型修复未测；真实多轮未观察；A/B/C 效果不可比较。五题手写校准不代表自然生成任务通过。完整 OS 隔离、无人审批修复、比赛环境及 Prob038 兼容性不签收。
