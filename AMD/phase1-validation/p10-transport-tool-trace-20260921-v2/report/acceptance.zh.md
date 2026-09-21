# P10 Transport 与 Tool Trace 验收

日期：2026-09-21。源码仓库：`D:\deepseek-harness`。本批次：`p10-transport-tool-trace-20260921-v2`。

## 结果

| 项目 | 本轮结果 |
|---|---:|
| 固定选题 | 10 |
| 完整模型响应 | 10/10 |
| 合法初始候选 | 10/10 |
| 生成物理请求 | 10 |
| 生成 transport retry / output recovery | 0 / 0 |
| 基础设施暂停 / 未启动 | 0 / 0 |
| 端到端完成评测 | 10/10 |
| Baseline 初始通过 | 9/10 |
| Agent 最终通过 | 10/10 |
| 自然修复机会 / 成功恢复 | 1 / 1 |
| 独立错误种子 smoke | PASS，不计入十题成绩 |
| 冻结输入与证据链审计 | PASS，核对 729 项冻结文件 |

十题都使用首次完整合法候选，Baseline 与 Agent 共用同一份初始源码。没有复用旧模型候选、换题、删除失败项或挑选更好的多份答案。Prompt、Skill、模型采样参数和修复策略未调整。

## 自然修复证据

`Prob045_edgedetect2` 的 Host 初始 XSim 检查为 228 次、212 次失配。初始 DUT 把边沿输出实现为组合逻辑。模型根据绑定的失败反馈选择 `edit_dut`，将输出更新改入时钟触发块；然后在只暴露 `verify_rtl` 的待验证状态下选择该工具，Host 接受并实际执行新版本的验证。

新版本 compile、elaborate、simulation、synthesis 全部 PASS；XSim 仍为 228 次检查，失配降为 0。原始候选未被改写，修复版本和最终导出分别保存并校验 SHA-256。

初始诊断的规范化哈希为 `4e62459713eb2c7d714aa3414d2e44209fd79fa6e49a0660132f5867d7c983eb`，与下一次模型请求的 `consumed_feedback_sha256` 一致。审计还重新计算实际请求中有界反馈的 `feedback_projection_sha256`，确认不是只在 Host 日志中记录反馈却没有放入模型请求。最终 PASS 后没有下一次模型请求，因此不声称该 PASS 反馈被再次消费。

- [逐步工具轨迹](../compare-Prob045_edgedetect2/tool-trace.jsonl)
- [修复结果及版本绑定](../compare-Prob045_edgedetect2/result.json)
- [初始 RTL](../generate-Prob045_edgedetect2/initial.sv)
- [最终 RTL](../compare-Prob045_edgedetect2/final.sv)

## 独立 Smoke

`Prob005_notgate` 从经审查的错误直通种子开始，初始 XSim 为 239 次检查、239 次失配。真实模型选择 `edit_dut`、`verify_rtl`，两者均被 Host 接受。新 XSim 为 239 次检查、0 失配，综合 PASS，失败反馈与后续模型请求的哈希链也通过审计。

[Smoke 工具轨迹](../repair-control-Prob005_notgate/tool-trace.jsonl) 与十题成绩分开保存；这不是第二份 Baseline 候选。

## 修改范围

- 模型侧增加独立 `transport.json`，区分 request prepared、stream invoked、HTTP/provider 活动、模型输出、usage、finish 和完整响应；保留旧 `dispatched` 字段，但不将其解释为服务端已收到请求。
- Node fetch 诊断在 provider 异常规范化前采集白名单网络错误码和 HTTP 状态，不记录 URL、请求头、密钥或原始异常文本。
- 新稳定性入口在首个任务重试耗尽后暂停后续题目，冻结冷却时间为 15 秒，执行独立健康探针；仅允许同题、同请求哈希的有界续跑。默认最多续跑一次，每窗口最多两次 transport retry。
- 每个终态窗口结果不可变，最新结果原子更新。完整或已有部分输出的响应、已获得候选、取消、超限或冻结身份变化均不能借续跑重新采样。
- `tool-trace.jsonl` 汇总可用工具、模型选择、接受或拒绝、版本变化、真实阶段执行、结果与日志哈希；区分 `HOST_INITIAL` 与 `AGENT_TOOL`。
- 报告分开统计候选获取、端到端完成度和模型表现；空修复分母返回 null，而非 0%。

## 本地检查

64 项独立回归测试通过：60 项 Vitest 测试，外加 4 项 Node 批处理状态机测试。修改后的 P10 和 P09 测试再次通过。测试包含连接失败、HTTP 状态、并发观测隔离、敏感信息不落盘、请求哈希不变、恢复上限、禁止完整非法响应重采样、断路器、工具限制和反馈投影哈希。

`tsc -p rtl-tools/tsconfig.json --noEmit`、定向 Oxlint、Agent Note 格式检查、两组双语文档配对及 `git diff --check` 均通过。没有运行全仓库测试套件或全量 doc-sync。

独立证据审计重新读取候选、模型请求、模型响应、Vivado 结果及 XSim 原始日志，校验文件哈希、工具选择、可用工具列表、反馈收据和实际请求投影，而不是仅相信汇总中的布尔标志。详见 [evidence-audit.json](evidence-audit.json) 和 [完整逐题报告](latest.json)。

## 限制

本轮生成全部一次成功，故真实运行没有触发 transport recovery；断路器和续跑目前由离线故障注入测试覆盖。这证明本轮 10/10 获取成功，但不能追溯确认上一轮四次失败的网络根因，也不能证明偶发网络故障已永久消除。

只有一个自然修复样本，9/10 到 10/10 是本批次观测，不应外推为稳定增益。反馈消费字段证明“反馈进入请求且出现模型输出”，不证明模型内部如何推理。

复用了显式冻结的历史正负例评测器校准，本轮没有重新运行这组校准；十题 DUT 对照和独立 smoke 均重新执行了真实 Vivado/XSim。继续保留 `full_os_isolation_verified=false`，不宣称已实现完整 OS 隔离。历史实验未被覆盖。v1 仅有准备文件，未发出模型请求；真实结果全部来自 v2。
