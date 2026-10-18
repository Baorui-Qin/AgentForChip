# 五十题实测日志索引

先看 [实测报告](REPORT.zh.md) 和 [逐题原因复核](FAILURE_ANALYSIS.zh.md)。本轮 50 题、216 次真实推理，旧 10 题不并入计数。

## 检索入口

| 文件 | 用途 |
| --- | --- |
| [summary.json](summary.json) | 最终计数、终态、token 与结果适用范围 |
| [tasks.csv](tasks.csv) | 全部 50 题的首个有效候选及后续受测结果、失配数和修复尝试 |
| [failure-reasons.json](failure-reasons.json) | 初始设计错误与最后停止原因分开记录，附 EDA 原始日志路径 |
| [calls.csv](calls.csv) / [call-index.json](call-index.json) | 216 次实际推理请求，含 UTC 流事件时间、模型、阶段、token 与 SHA256 |
| [model-output-index.json](model-output-index.json) | 全部 216 份模型运行目录、prompt、dispatch、正文、工具参数和上下文审计 |
| [model-errors.csv](model-errors.csv) / [model-errors.json](model-errors.json) | 21 次模型级输出错误，包括后来恢复而未成为题目终态的错误 |
| [generation-attempts.csv](generation-attempts.csv) | 55 次原生候选提交，含 8 个被截断或被候选门禁拒绝的尝试 |
| [manifest-50.json](campaign/manifest-50.json) | 固定种子、50 题清单、排除项及原始题库/上一轮清单哈希 |

`calls.csv` 的 `request_sha256` 与模型输出索引里的 dispatch 哈希关联；`request_file`、`sse_file`、`associated_model_runs` 可直接定位实际请求、原始流和模型输出目录。传输正常结束不等于候选有效，请结合模型级错误和候选尝试表查看。

## 原始文件

以下相对于本目录；`<题目>` 为完整题号，例如 `Prob086_lfsr5`。

| 路径 | 内容 |
| --- | --- |
| `campaign/plans/<题目>/<绑定哈希>/plan.json` | 已完整完成的 30B 计划；绑定到题目、源码和反馈 |
| `campaign/plans/<题目>/<绑定哈希>/run-*/` | 每次规划及恢复的完整请求、原始输出、model.json、事件及传输记录 |
| `campaign/generate-<题目>/models/run-*/native-submission.json` | 8B 候选工具调用、源代码投影、finish/error 与 usage |
| `campaign/generate-<题目>/initial.sv` | 第一个通过候选检查、送入 EDA 的源码；不一定是模型第一次调用的原始候选 |
| `campaign/compare-<题目>/models/run-*/` | 8B 编辑及验证工具调用、prompt、正文/工具输出、上下文与传输审计 |
| `campaign/http/<请求ID>/request.json` | 实际 HTTP 请求体，不是事后重建的简化提示 |
| `campaign/http/<请求ID>/sse.jsonl` | 带 UTC 时间的原始 SSE，含工具参数片段、结束事件和 usage |
| `campaign/http/<请求ID>/transport.json` | HTTP 状态及原始传输结束情况 |
| `campaign/compare-<题目>/action-*.json`、`tool-trace.jsonl` | 工具参数、接收/拒绝、返回结果和修订关联 |
| `campaign/compare-<题目>/revisions/<修订ID>/solution.sv` | 每个修订的独立源代码，包括后来回退的版本 |
| `campaign/compare-<题目>/eda/run-*/result.json` | 编译、展开、仿真、综合状态及源码绑定、检查数和失配数 |
| `campaign/compare-<题目>/eda/run-*/build/*.stdout.log`、`*.stderr.log` | 真实 EDA 标准输出和错误日志 |
| `campaign/compare-<题目>/acceptance-*/acceptance.json` | 未放宽的完整网表验收门禁回执 |
| `campaign/runner-logs/` | 各次 dsh profile 启动与运行日志 |
| `campaign/preflight/results.json` | 102 项正负控制结果，模型调用数为 0 |

纯工具调用的 `response.txt`、`output.txt` 可能为空，尤其在工具参数尚未闭合就触及输出上限时。此时看 `native-submission.json`、`stream.jsonl` 和 HTTP 的 `sse.jsonl`，不要把空正文当作没有留存输出。原生 token 计数器的请求/结果位于模型目录的 token 审计文件中，不混入 216 次推理计数。

## 校验和边界

- [log-audit.json](log-audit.json)：冻结输入、原始请求哈希、源码与修复回执绑定。
- [post-run-checks.json](post-run-checks.json)：驱动回收、端口关闭、候选尝试覆盖；其原因覆盖范围是候选与初始 RTL 失败。另从模型级错误索引补充了 Prob131 的规划恢复，原因复核共 30 题。
- [preservation.json](preservation.json)：原工程未提交内容、题库、旧技能/知识和封存交接包的保留核验。
- [cleanup.json](cleanup.json)：临时 SSH 转发回收及原始远端 SSH 配置恢复。
- [netlist-environment-audit.json](netlist-environment-audit.json)：实际 2026.1 库与保留的 2025.2 固定哈希差异。
- `*-driver-process.json`：各阶段退出、watchdog、回收及耗时回执。

`prepare-sandbox-denied/`、`preflight-sandbox-denied/` 保留了授权前被主机沙箱阻止的准备/启动记录，不是模型答题样本，也不计入 50 题失败。底层模型级 `run.json` 未记录完成终态，不能仅凭 RUNNING 判断任务还活跃；请以题目结果、HTTP 传输和进程回执为准。
