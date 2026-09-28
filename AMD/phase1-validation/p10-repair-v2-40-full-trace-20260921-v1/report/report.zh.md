# 固定 40 题完整记录报告

状态：本批次执行结束。固定清单 78f895dfebde67ce39905ca19a7454db5f904fb469966648a9d5fa273f865106。

## 结果

| 指标 | 结果 |
|---|---:|
| 固定题数 | 40 |
| 历史校准阻塞 | 2 |
| 可运行题数 | 38 |
| 合法新候选 | 33 |
| 已进行初始对照 | 33 |
| Baseline 四阶段通过（已对照分母） | 29/33 (87.88%) |
| Agent 四阶段通过（已对照分母） | 29/33 (87.88%) |
| Agent 固定清单覆盖 | 29/40 (72.50%) |
| 自然修复恢复 | 1/3 (33.33%) |
| 实际模型 dispatch | 52 |
| 生成 / Agent / 探针 | 45 / 7 / 0 |
| 工具调用 | 5 |
| 传输重试 / 输出恢复 | 0 / 8 |
| XSim / 综合执行 | 33 / 30 |
| 返回 reasoning 的调用 | 50 |
| reasoning UTF-8 字节数 | 557692 |
| 已知输入 / 输出 token | 47185 / 170711 |
| 缺少 usage 的请求 | 2 |

## 分析入口

- [逐调用索引](call-index.json)：关联任务、阶段、请求哈希、完整性、文件路径。
- [完整调用 JSONL](../analysis/calls.jsonl)：每行含完整请求、接口返回 reasoning、正文、规范化流、模型终态及工具参数。
- [完整工具轨迹 JSONL](../analysis/tool-traces.jsonl)：Host 初始验证与 Agent 选中工具分开记录。
- [逐题 CSV](tasks.csv) 与 [证据审计](evidence-audit.json)。
- 原始模型目录保留 prompt-final、context、stream.jsonl、reasoning.txt、output.txt、transcript.json、model.json、transport.json。
- 原始 EDA 目录保留快照、每次工具命令、stdout/stderr、仿真及综合结果。

## 口径与限制

使用 deepseek-flash、temperature 0。生成仍为 high reasoning、8192 输出 token、65536 响应字节上限；修复为 high reasoning、16384 输出 token、262144 响应字节上限。修复截断后额外一次 4096 token 强制单工具调用，reasoning off；宿主检查实际响应是否遵守约束，不保证模型必然服从。每次请求超时 120 秒，单题活动上限 1200 秒，最多 3 轮语义修复，保留请求和工具步数上限。上下文达到 80% 阈值后压缩可选内容，不截断当前源码和核心证据。功能诊断和现有波形摘要来自真实 EDA；时间戳末的 VCD 值不等同于测试台采样瞬间。相同检查数下回退退化或持平修订，证据不可比时回退并停止。配置以 campaign-freeze.json 和 model.patch.yml 为准。

生成串行，EDA 最多两个独立作业。只保留第一个完整合法候选，不择优重采样。有限重试由冻结配置决定。日志包含接口实际返回并交给 Harness 的全部规范化 chunk，包括触发限制的最后一个 chunk；不是原始 HTTP/SSE 抓包。未公开的内部思考无法取得；凭据、请求头、原始异常文本不记录。截断或超时请求的归档包含已收到的部分内容，不能声称包含服务端未发送的剩余输出。

Prob080_timer 因 PUBLIC_INTERFACE_UNSUPPORTED 阻塞；Prob031_dff 因 EVALUATOR_CALIBRATION_NOT_READY 阻塞。两题均保留在固定 40 题中，不调用模型、不换题、不算模型错误。正负例校准复用历史已封存结果，未在本轮重跑。full_os_isolation_verified=false；真实 EDA 不是完整操作系统隔离。

未生成合法候选、未完成 EDA 和基础设施异常不应统称为 RTL 逻辑失败；已对照分母、可运行分母与固定 40 题覆盖须分别使用。本批次不混入旧批次候选或成绩。初始与 Agent 流程使用同一个新生成候选，是成对测试，不是两个独立采样总体。

## 逐题结果

| 题目 | 生成 | Baseline | Agent | 模型调用 | 工具调用 | reasoning 字节 |
|---|---|---|---|---:|---:|---:|
| [Prob005_notgate](../analysis/Prob005_notgate.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 1423 |
| [Prob035_count1to10](../analysis/Prob035_count1to10.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 878 |
| [Prob045_edgedetect2](../analysis/Prob045_edgedetect2.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 9114 |
| [Prob074_ece241_2014_q4](../analysis/Prob074_ece241_2014_q4.md) | GENERATED_UNVERIFIED | FAIL | POLICY_BLOCKED | 1 | 0 | 5921 |
| [Prob015_vector1](../analysis/Prob015_vector1.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3834 |
| [Prob033_ece241_2014_q1c](../analysis/Prob033_ece241_2014_q1c.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 5774 |
| [Prob004_vector2](../analysis/Prob004_vector2.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3562 |
| [Prob020_mt2015_eq2](../analysis/Prob020_mt2015_eq2.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 530 |
| [Prob018_mux256to1](../analysis/Prob018_mux256to1.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 716 |
| [Prob061_2014_q4a](../analysis/Prob061_2014_q4a.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 7857 |
| [Prob094_gatesv](../analysis/Prob094_gatesv.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 2 | 0 | 39861 |
| [Prob149_ece241_2013_q4](../analysis/Prob149_ece241_2013_q4.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 58414 |
| [Prob086_lfsr5](../analysis/Prob086_lfsr5.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 16247 |
| [Prob104_mt2015_muxdff](../analysis/Prob104_mt2015_muxdff.md) | GENERATED_UNVERIFIED | FAIL | INCOMPARABLE_VERIFICATION | 3 | 2 | 31004 |
| [Prob140_fsm_hdlc](../analysis/Prob140_fsm_hdlc.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 56125 |
| [Prob151_review2015_fsm](../analysis/Prob151_review2015_fsm.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 9936 |
| [Prob011_norgate](../analysis/Prob011_norgate.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 464 |
| [Prob023_vector100r](../analysis/Prob023_vector100r.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3444 |
| [Prob043_vector5](../analysis/Prob043_vector5.md) | GENERATED_UNVERIFIED | PASS | POLICY_BLOCKED | 1 | 0 | 2952 |
| [Prob127_lemmings1](../analysis/Prob127_lemmings1.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 8670 |
| [Prob113_2012_q1g](../analysis/Prob113_2012_q1g.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 2 | 0 | 31056 |
| [Prob138_2012_q2fsm](../analysis/Prob138_2012_q2fsm.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 1969 |
| [Prob080_timer](../analysis/Prob080_timer.md) | EVALUATOR_BLOCKED | NOT_RUN | NOT_RUN | 0 | 0 | 0 |
| [Prob130_circuit5](../analysis/Prob130_circuit5.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 7385 |
| [Prob066_edgecapture](../analysis/Prob066_edgecapture.md) | GENERATED_UNVERIFIED | FAIL | VERIFIED | 3 | 2 | 17185 |
| [Prob135_m2014_q6b](../analysis/Prob135_m2014_q6b.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 9905 |
| [Prob064_vector3](../analysis/Prob064_vector3.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3548 |
| [Prob085_shift4](../analysis/Prob085_shift4.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 1318 |
| [Prob121_2014_q3bfsm](../analysis/Prob121_2014_q3bfsm.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 6981 |
| [Prob155_lemmings4](../analysis/Prob155_lemmings4.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 59840 |
| [Prob029_m2014_q4g](../analysis/Prob029_m2014_q4g.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 723 |
| [Prob040_count10](../analysis/Prob040_count10.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 440 |
| [Prob042_vector4](../analysis/Prob042_vector4.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 211 |
| [Prob079_fsm3onehot](../analysis/Prob079_fsm3onehot.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3326 |
| [Prob078_dualedge](../analysis/Prob078_dualedge.md) | GENERATED_UNVERIFIED | FAIL | INVALID_REQUEST | 4 | 1 | 40171 |
| [Prob081_7458](../analysis/Prob081_7458.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 405 |
| [Prob031_dff](../analysis/Prob031_dff.md) | EVALUATOR_BLOCKED | NOT_RUN | NOT_RUN | 0 | 0 | 0 |
| [Prob117_circuit9](../analysis/Prob117_circuit9.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 46559 |
| [Prob137_fsm_serial](../analysis/Prob137_fsm_serial.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 58683 |
| [Prob067_countslow](../analysis/Prob067_countslow.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 1261 |

## 固定分母补充

生成失败 5 题。以上已对照分母排除了没有合法候选的题目，不能单独用来代表端到端成功率。按全部 38 道已校准题目计算（生成失败仍计入分母），Baseline 为 29/38 (76.32%)，Agent 为 29/38 (76.32%)；按固定 40 题覆盖计算，Agent 为 29/40 (72.50%)。

## 工具调用口径

生成阶段不提供 Agent 工具。每个合法候选先由 Host 进行初始验证；只有初始失败且符合修复策略时才请求模型选择工具。因此 Agent 通过总数包含无需修复的初始通过项，不能解释为每题都发生了模型工具调用。本轮有 3 题发生 Agent 工具调用，共 5 次。

Prob104_mt2015_muxdff 的真实工具顺序：edit_dut（Host 接受） → verify_rtl（Host 接受）。仿真轨迹：HOST_INITIAL: 1/199 失配 → AGENT_TOOL: 未取得仿真检查结果。最终状态 INCOMPARABLE_VERIFICATION；未记录成功修复。

Prob066_edgecapture 的真实工具顺序：edit_dut（Host 接受） → verify_rtl（Host 接受）。仿真轨迹：HOST_INITIAL: 91/266 失配 → AGENT_TOOL: 0/266 失配。最终状态 VERIFIED；初始失败后成功恢复。

Prob078_dualedge 的真实工具顺序：edit_dut（Host 拒绝：REPEATED_CANDIDATE）。仿真轨迹：HOST_INITIAL: 93/224 失配。最终状态 INVALID_REQUEST；未记录成功修复。

## 响应完整性

51/52 次调用观测到 HTTP 200。38 次完整终态；12 次为服务端 max-tokens，其中 12 次仅返回 reasoning，既无正文，也无工具参数增量。这里没有把 HTTP 200 等同于任务成功，也没有将已完整保存的部分流误称为完整模型回答。

原始证据文件、字节数和 SHA-256 见 [完整文件清单](../evidence-files.json)。该清单不递归复制依赖库链接或外部封存 evaluator；对应链接目标另行列明，评测输入受 campaign-freeze.json 哈希约束。

## 未通过或受限项目

### Prob074_ece241_2014_q4

生成：GENERATED_UNVERIFIED；Baseline：FAIL；Agent：POLICY_BLOCKED。

Host 策略阻塞：UNCLASSIFIED_FAILURE；Evaluator, unknown, or unsupported failure requires host investigation.

- elaborate: FAIL; failure_domain=unknown; variable 'q1' is driven by invalid combination of procedural drivers Static elaboration of top level Verilog design unit(s) in library work failed.

### Prob149_ece241_2013_q4

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob104_mt2015_muxdff

生成：GENERATED_UNVERIFIED；Baseline：FAIL；Agent：INCOMPARABLE_VERIFICATION。

- elaborate: FAIL; failure_domain=unknown; variable 'Q' is driven by invalid combination of procedural drivers Static elaboration of top level Verilog design unit(s) in library work failed.

### Prob140_fsm_hdlc

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob043_vector5

生成：GENERATED_UNVERIFIED；Baseline：PASS；Agent：POLICY_BLOCKED。

Host 策略阻塞：EXECUTION_OR_EVIDENCE；All four stage records and complete clean preceding stages are required.

注意：原始四阶段结果为 PASS，但 Agent 流程未接受最终导出，不能将此差异归为模型 RTL 功能退化。诊断完整性：[{"stage":"compile","complete":true,"process_clean":true,"diagnostics_omitted":0,"diagnostic_excerpt_truncated":false},{"stage":"elaborate","complete":true,"process_clean":true,"diagnostics_omitted":0,"diagnostic_excerpt_truncated":false},{"stage":"simulation","complete":true,"process_clean":true,"diagnostics_omitted":0,"diagnostic_excerpt_truncated":false},{"stage":"synthesis","complete":false,"process_clean":true,"diagnostics_omitted":1,"diagnostic_excerpt_truncated":false}]。

### Prob080_timer

生成：EVALUATOR_BLOCKED；Baseline：NOT_RUN；Agent：NOT_RUN。

校准阻塞：PUBLIC_INTERFACE_UNSUPPORTED，不计为模型失败。

### Prob155_lemmings4

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob078_dualedge

生成：GENERATED_UNVERIFIED；Baseline：FAIL；Agent：INVALID_REQUEST。

- agent 1: OUTPUT_TRUNCATED, provider finish=未收到
- agent 3: INVALID_REQUEST, provider finish=error

- simulation: FAIL; failure_domain=design; Functional mismatch: 93 of 224 checks failed; simulator exited normally. Inspect the DUT against the specification; no failing signal or cycle was reported.

扩展结构化反馈：q: 93 次失配，首次时间 10；VCD 状态 available。上方是原始汇总错误行；若其仍称未报告信号，应以本条扩展反馈为准。

### Prob031_dff

生成：EVALUATOR_BLOCKED；Baseline：NOT_RUN；Agent：NOT_RUN。

校准阻塞：EVALUATOR_CALIBRATION_NOT_READY，不计为模型失败。

### Prob117_circuit9

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob137_fsm_serial

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens


## Repair V2 行为

| 指标 | 结果 |
|---|---:|
| 强制动作请求 | 1 |
| 强制动作被 Host 接受 | 0 |
| 上下文压缩请求 | 1 |
| 正常模式 / 强制动作压缩 | 0 / 1 |
| 验证后修订改善 | 1 |
| 候选验证后回退 | 1 |
| 未验证终态恢复 | 0 |

压缩次数包括 forced_action 的 core_only 压缩，不等同于达到 80% 阈值的正常模式压缩。强制动作请求与接受次数不同，触发恢复不代表修复成功。逐次修订决策和最佳版本得分见逐题分析与证据审计。

实际发送功能仿真反馈 5 次，其中包含可用 VCD 波形摘要 5 次。这里只统计请求正文中真实存在的反馈，不把仅保存于本地但未发送给模型的文件算作已利用证据。

本轮为固定小样本的成对测试，结果不等同于一般化准确率。若与旧批次对比，两轮重新生成的候选可能不同，不能把跨批次通过数的变化单独归因于 Repair V2。

模型完整消息中记录 5 个工具调用块；Host 处理 5 次单工具动作，其中接受 4 次。被拒绝的动作和不完整工具参数仍保存在原始流与模型终态中，不算作成功执行。

含波形反馈的 5 次请求中，4 次观测到模型输出；未返回模型输出的请求不能算作模型已消费反馈。除 12 次 provider max-tokens 外，还有 1 次本地 OUTPUT_TRUNCATED、1 次 HTTP 400。缺失 usage 的 token 数未知，表中 token 合计不是完整计费量。

详细结论、流体积上限、模式切换后的 HTTP 400 和后续修复优先级见 [异常与结论](findings.zh.md)。
