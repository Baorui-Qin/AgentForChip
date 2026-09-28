# 实测结论与异常分析

批次：`p10-repair-v2-40-full-trace-20260921-v1`。2026-09-21 20:12 获得用户授权后启动，20:50 确认调度器以退出码 0 结束，状态为 `COMPARISON_FINISHED`。以下结论来自本批次真实模型调用和 Vivado 结果；没有修改冻结代码、换题或对失败题另行择优重跑。

## 结论

固定 40 题中，2 题历史评测器阻塞、5 题生成输出截断、33 题完成对照。Baseline 和 Agent 都是 29/33（87.88%）；按 38 道已校准题的固定分母，两者都是 29/38（76.32%）。固定清单覆盖为 29/40（72.50%）。

总数持平不等于 Agent 没有产生作用：

| 成对结果 | 题数 |
|---|---:|
| 初始 PASS，最终 VERIFIED | 28 |
| 初始 FAIL，经 Agent 修复为 VERIFIED | 1 |
| 初始 PASS，被 Host 证据门槛阻止导出 | 1 |
| 初始 FAIL，最终仍未 VERIFIED | 3 |

自然修复机会为 3 次，成功 1 次。成功项为 [Prob066_edgecapture](../analysis/Prob066_edgecapture.md)：实际调用 `edit_dut` 和 `verify_rtl`，失配从 91/266 降到 0/266，四阶段通过，最终源码已导出。其余两个自然修复机会分别以回退和请求错误结束。另有一题初始 RTL 错误在调用 Agent 前就被策略阻塞。

## 1. 本地流体积上限提前截断正常修复

这是已确认的 Host 限制，不是已确认的服务端 16k token 耗尽。[Prob078 的正常修复记录](../compare-Prob078_dualedge/models/run-L3qGJT/model.json)显示输出预算为 16384、响应字节上限为 262144，但接收 10322 个规范化 chunk、38756 字节 reasoning 后本地返回 `OUTPUT_TRUNCATED`；尚未收到 provider finish 和 usage。

该请求的 [stream.json](../compare-Prob078_dualedge/models/run-L3qGJT/stream.json) 恰为 524292 字节，高于冻结 `maxEventBytes / 2 = 524288` 的限制。冻结源码 `rtl-tools/src/phase1/p09-action-call.ts:171` 在每个 chunk 后检查整个缓冲数组的 JSON 大小，触发条件与归档一致。因此，增大修复 token 预算并没有消除更早的本地流缓冲限制。

下一步优先验证流存储上限与 16k 修复预算的兼容性，保留增量日志，不应只继续增加 token 数。本批次未改动这一上限。

## 2. 强制动作返回完整调用，但未带来有效修改

[强制动作请求](../compare-Prob078_dualedge/models/run-GyNS2M/prompt-final.txt) 已实际使用 4096 token、`thinking: disabled`，返回一个完整的 `edit_dut`，且未返回 reasoning 或解释性正文。但源码与当前版本完全相同，被 Host 以 `REPEATED_CANDIDATE` 拒绝。因此这是“强制动作协议产生了工具调用”，不是“修复成功”。

随后恢复正常 high 模式的 [请求](../compare-Prob078_dualedge/models/run-C61BtK/prompt-final.txt) 携带了上一条 off 模式的 assistant 工具调用历史，但没有 `reasoning_content` 字段。该请求实际得到 HTTP 400 / `INVALID_REQUEST`，没有返回模型输出。

这是模式切换和历史序列化的高优先级排查点。DeepSeek 官方文档要求思考模式带工具的后续请求回传 `reasoning_content`，缺失会导致 400。本批次请求结构与该规则冲突的表现一致，但保留日志没有服务端原始错误正文，因此不能仅凭状态码把具体原因认定为唯一已证实根因。[官方思考模式文档](https://api-docs.deepseek.com/guides/thinking_mode/)

## 3. 最佳版本回退真实生效，但未完成修复

[Prob104_mt2015_muxdff](../analysis/Prob104_mt2015_muxdff.md) 初始为 1/199 失配。Agent 的新版本在展开阶段出现 `Q` 的不合法多过程驱动，未取得新的仿真检查数，评分为不可比。

流程记录 `INCOMPARABLE` 并回退，最终 `best-observed.sv`、当前源码哈希、revision 和验证运行均重新绑定初始最佳版本。初始和失败修订及两次 EDA 证据均保留。这证明回退及绑定机制在本轮被触发，不能记作成功修复，也不能声称走满了 3 轮修复。

## 4. 两项 Host 策略阻塞影响最终统计

[Prob043_vector5](../analysis/Prob043_vector5.md)：原始四阶段均 PASS；综合诊断保存了 5 条 warning，另有 `diagnostics_omitted=1`，归一化 receipt 的 `complete=false`。最终因 `EXECUTION_OR_EVIDENCE` 被拒绝导出，没有任何 Agent 模型调用或源码修改。Baseline 与 Agent 总数之间少掉的这 1 个 PASS 是 Host 接受口径差异，不是模型把正确 RTL 改坏。

[Prob074_ece241_2014_q4](../analysis/Prob074_ece241_2014_q4.md)：展开阶段报告 DUT 的 `q1` 多过程驱动（`VRFC 10-3818`），但当前归因结果为 `failure_domain=unknown`、`repairable_by_model=false`，因此 `UNCLASSIFIED_FAILURE` 阻止 Agent 介入。不能把它写成一次“模型尝试后修复失败”。

诊断完整性与归因规则值得单独修补和回归验证，不能为提高成绩而在本批次中直接放宽判定。

## 5. 生成失败与反馈覆盖

5 个生成失败项为 `Prob149_ece241_2013_q4`、`Prob140_fsm_hdlc`、`Prob155_lemmings4`、`Prob117_circuit9`、`Prob137_fsm_serial`，均为按冻结策略恢复一次后仍输出截断。生成预算仍是 8192，不等同于修复的 16384。这些题没有合法候选，未进入 EDA；端到端分母仍包含它们。

本次共 12 次 provider `max-tokens`，另有上述 1 次本地流体积截断和 1 次 HTTP 400。实际 52 次调用中，38 次完整终态；51 次观测到 HTTP 200。2 次请求没有 usage，因此 47185 输入 token、170711 输出 token 只是已知合计，不是完整计费量。

5 次实际请求正文含功能反馈与可用 VCD 摘要，其中 4 次观测到模型输出，HTTP 400 的一次不能记作模型已消费反馈。`Prob078` 的扩展反馈确实包含 q 信号、93 次失配、首次时间 10；原始聚合错误行仍有“未报告信号”的旧措辞，不应忽略已保存并发送的扩展结构化证据。

本次唯一一次上下文压缩由 forced_action 的 `core_only` 触发，没有观测到正常模式下的 80% 阈值压缩。不能据此声称阈值压缩、全部 3 轮修复路径都已由这 40 题覆盖。

## 记录与复核

- [主报告](report.zh.md)、[逐调用索引](call-index.json)、[证据审计](evidence-audit.json)。
- [完整调用 JSONL](../analysis/calls.jsonl)：请求、接口返回的 reasoning、正文、完整规范化流、工具参数和终态。
- [完整工具轨迹](../analysis/tool-traces.jsonl)：共 5 次 Host 工具动作，4 次接受、1 次拒绝；工具结果和验证绑定均保留。
- [文件清单与 SHA-256](../evidence-files.json)：本地归档文件全部列明，不递归打包外部依赖链接。

保存范围是接口已返回并交给 Harness 的内容，不包含未公开的服务端内部思考、未发送的剩余内容、凭据或原始 HTTP 抓包。所有截断前已收到内容均保留。配置里的 temperature=0 是请求参数；官方文档说明思考模式下该参数不生效，所以不能据此声称采样是确定性的。[官方参数说明](https://api-docs.deepseek.com/guides/thinking_mode/)

本报告记录本次失败与限制，不证明新方案整体优于旧方案。跨批次重新生成候选会改变初始样本，不能将通过数变化单独归因于修复协议。
