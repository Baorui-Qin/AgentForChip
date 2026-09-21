# 固定 40 题完整记录报告

状态：本批次执行结束。固定清单 78f895dfebde67ce39905ca19a7454db5f904fb469966648a9d5fa273f865106。

## 结果

| 指标 | 结果 |
|---|---:|
| 固定题数 | 40 |
| 历史校准阻塞 | 2 |
| 可运行题数 | 38 |
| 合法新候选 | 34 |
| 已进行初始对照 | 34 |
| Baseline 四阶段通过（已对照分母） | 31/34 (91.18%) |
| Agent 四阶段通过（已对照分母） | 30/34 (88.24%) |
| Agent 固定清单覆盖 | 30/40 (75.00%) |
| 自然修复恢复 | 0/2 (0.00%) |
| 实际模型 dispatch | 50 |
| 生成 / Agent / 探针 | 43 / 7 / 0 |
| 工具调用 | 2 |
| 传输重试 / 输出恢复 | 0 / 8 |
| XSim / 综合执行 | 35 / 32 |
| 返回 reasoning 的调用 | 50 |
| reasoning UTF-8 字节数 | 592042 |
| 已知输入 / 输出 token | 40239 / 181969 |
| 缺少 usage 的请求 | 0 |

## 分析入口

- [逐调用索引](call-index.json)：关联任务、阶段、请求哈希、完整性、文件路径。
- [完整调用 JSONL](../analysis/calls.jsonl)：每行含完整请求、接口返回 reasoning、正文、规范化流、模型终态及工具参数。
- [完整工具轨迹 JSONL](../analysis/tool-traces.jsonl)：Host 初始验证与 Agent 选中工具分开记录。
- [逐题 CSV](tasks.csv) 与 [证据审计](evidence-audit.json)。
- 原始模型目录保留 prompt-final、context、stream.jsonl、reasoning.txt、output.txt、transcript.json、model.json、transport.json。
- 原始 EDA 目录保留快照、每次工具命令、stdout/stderr、仿真及综合结果。

## 口径与限制

使用 deepseek-flash、high reasoning、temperature 0、8192 输出 token、120 秒请求超时及 65536 响应字节上限；模型输入、技能和修复策略沿用前一轮。生成串行，EDA 最多两个独立作业。只保留第一个完整合法候选，不择优重采样。有限重试由冻结配置决定。

日志包含接口实际返回并交给 Harness 的全部规范化 chunk，包括触发限制的最后一个 chunk；不是原始 HTTP/SSE 抓包。未公开的内部思考无法取得；凭据、请求头、原始异常文本不记录。截断或超时请求的归档包含已收到的部分内容，不能声称包含服务端未发送的剩余输出。

Prob080_timer 因 PUBLIC_INTERFACE_UNSUPPORTED 阻塞；Prob031_dff 因公开输入 q 与参考输出 q 冲突导致正例校准不通过。两题均保留在固定 40 题中，不调用模型、不换题、不算模型错误。正负例校准复用历史已封存结果，未在本轮重跑。full_os_isolation_verified=false；真实 EDA 不是完整操作系统隔离。

未生成合法候选、未完成 EDA 和基础设施异常不应统称为 RTL 逻辑失败；已对照分母、可运行分母与固定 40 题覆盖须分别使用。本批次不混入旧十题的候选或成绩。

## 逐题结果

| 题目 | 生成 | Baseline | Agent | 模型调用 | 工具调用 | reasoning 字节 |
|---|---|---|---|---:|---:|---:|
| [Prob005_notgate](../analysis/Prob005_notgate.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 637 |
| [Prob035_count1to10](../analysis/Prob035_count1to10.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 1163 |
| [Prob045_edgedetect2](../analysis/Prob045_edgedetect2.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3665 |
| [Prob074_ece241_2014_q4](../analysis/Prob074_ece241_2014_q4.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 6316 |
| [Prob015_vector1](../analysis/Prob015_vector1.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 4178 |
| [Prob033_ece241_2014_q1c](../analysis/Prob033_ece241_2014_q1c.md) | GENERATED_UNVERIFIED | FAIL | POLICY_BLOCKED | 1 | 0 | 2014 |
| [Prob004_vector2](../analysis/Prob004_vector2.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 2412 |
| [Prob020_mt2015_eq2](../analysis/Prob020_mt2015_eq2.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 377 |
| [Prob018_mux256to1](../analysis/Prob018_mux256to1.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3926 |
| [Prob061_2014_q4a](../analysis/Prob061_2014_q4a.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3089 |
| [Prob094_gatesv](../analysis/Prob094_gatesv.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 12448 |
| [Prob149_ece241_2013_q4](../analysis/Prob149_ece241_2013_q4.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 60387 |
| [Prob086_lfsr5](../analysis/Prob086_lfsr5.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 19061 |
| [Prob104_mt2015_muxdff](../analysis/Prob104_mt2015_muxdff.md) | GENERATED_UNVERIFIED | FAIL | OUTPUT_TRUNCATED | 3 | 0 | 66619 |
| [Prob140_fsm_hdlc](../analysis/Prob140_fsm_hdlc.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 24614 |
| [Prob151_review2015_fsm](../analysis/Prob151_review2015_fsm.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 22720 |
| [Prob011_norgate](../analysis/Prob011_norgate.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 406 |
| [Prob023_vector100r](../analysis/Prob023_vector100r.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 2225 |
| [Prob043_vector5](../analysis/Prob043_vector5.md) | GENERATED_UNVERIFIED | PASS | POLICY_BLOCKED | 1 | 0 | 3238 |
| [Prob127_lemmings1](../analysis/Prob127_lemmings1.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 8346 |
| [Prob113_2012_q1g](../analysis/Prob113_2012_q1g.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 16673 |
| [Prob138_2012_q2fsm](../analysis/Prob138_2012_q2fsm.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3930 |
| [Prob080_timer](../analysis/Prob080_timer.md) | EVALUATOR_BLOCKED | NOT_RUN | NOT_RUN | 0 | 0 | 0 |
| [Prob130_circuit5](../analysis/Prob130_circuit5.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 2 | 0 | 25915 |
| [Prob066_edgecapture](../analysis/Prob066_edgecapture.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 5322 |
| [Prob135_m2014_q6b](../analysis/Prob135_m2014_q6b.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 42994 |
| [Prob064_vector3](../analysis/Prob064_vector3.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 4408 |
| [Prob085_shift4](../analysis/Prob085_shift4.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3580 |
| [Prob121_2014_q3bfsm](../analysis/Prob121_2014_q3bfsm.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 2505 |
| [Prob155_lemmings4](../analysis/Prob155_lemmings4.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 59574 |
| [Prob029_m2014_q4g](../analysis/Prob029_m2014_q4g.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 300 |
| [Prob040_count10](../analysis/Prob040_count10.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 894 |
| [Prob042_vector4](../analysis/Prob042_vector4.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 1020 |
| [Prob079_fsm3onehot](../analysis/Prob079_fsm3onehot.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 1937 |
| [Prob078_dualedge](../analysis/Prob078_dualedge.md) | GENERATED_UNVERIFIED | FAIL | OUTPUT_TRUNCATED | 6 | 2 | 108950 |
| [Prob081_7458](../analysis/Prob081_7458.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 516 |
| [Prob031_dff](../analysis/Prob031_dff.md) | EVALUATOR_BLOCKED | NOT_RUN | NOT_RUN | 0 | 0 | 0 |
| [Prob117_circuit9](../analysis/Prob117_circuit9.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 8753 |
| [Prob137_fsm_serial](../analysis/Prob137_fsm_serial.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 56079 |
| [Prob067_countslow](../analysis/Prob067_countslow.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 851 |

## 固定分母补充

生成失败 4 题。以上已对照分母排除了没有合法候选的题目，不能单独用来代表端到端成功率。按全部 38 道已校准题目计算（生成失败仍计入分母），Baseline 为 31/38 (81.58%)，Agent 为 30/38 (78.95%)；按固定 40 题覆盖计算，Agent 为 30/40 (75.00%)。

## 工具调用口径

生成阶段不提供 Agent 工具。每个合法候选先由 Host 进行初始验证；只有初始失败且符合修复策略时才请求模型选择工具。因此 Agent 通过总数包含无需修复的初始通过项，不能解释为每题都发生了模型工具调用。本轮有 1 题发生 Agent 工具调用，共 2 次。

Prob078_dualedge 的真实工具顺序：edit_dut（Host 接受） → verify_rtl（Host 接受）。仿真轨迹：HOST_INITIAL: 93/224 失配 → AGENT_TOOL: 223/224 失配。最终状态 OUTPUT_TRUNCATED，不能记为成功修复。

## 响应完整性

50/50 次调用观测到 HTTP 200。36 次完整终态；14 次为服务端 max-tokens，其中 14 次仅返回 reasoning，既无正文，也无工具参数增量。这里没有把 HTTP 200 等同于任务成功，也没有将已完整保存的部分流误称为完整模型回答。

原始证据文件、字节数和 SHA-256 见 [完整文件清单](../evidence-files.json)。该清单不递归复制依赖库链接或外部封存 evaluator；对应链接目标另行列明，评测输入受 campaign-freeze.json 哈希约束。

## 未通过或受限项目

### Prob033_ece241_2014_q1c

生成：GENERATED_UNVERIFIED；Baseline：FAIL；Agent：POLICY_BLOCKED。

Host 策略阻塞：UNCLASSIFIED_FAILURE；Evaluator, unknown, or unsupported failure requires host investigation.

- synthesis: FAIL; failure_domain=unknown; Failed to create directory 'C'.

### Prob149_ece241_2013_q4

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob104_mt2015_muxdff

生成：GENERATED_UNVERIFIED；Baseline：FAIL；Agent：OUTPUT_TRUNCATED。

- agent 1: OUTPUT_TRUNCATED, provider finish=max-tokens
- agent 2: OUTPUT_TRUNCATED, provider finish=max-tokens

- simulation: FAIL; failure_domain=design; Functional mismatch: 1 of 199 checks failed; simulator exited normally. Inspect the DUT against the specification; no failing signal or cycle was reported.

### Prob043_vector5

生成：GENERATED_UNVERIFIED；Baseline：PASS；Agent：POLICY_BLOCKED。

Host 策略阻塞：EXECUTION_OR_EVIDENCE；All four stage records and complete clean preceding stages are required.

注意：原始四阶段结果为 PASS，但 Agent 流程未接受最终导出，不能将此差异归为模型 RTL 功能退化。诊断完整性：[{"stage":"compile","complete":true,"process_clean":true,"diagnostics_omitted":0,"diagnostic_excerpt_truncated":false},{"stage":"elaborate","complete":true,"process_clean":true,"diagnostics_omitted":0,"diagnostic_excerpt_truncated":false},{"stage":"simulation","complete":true,"process_clean":true,"diagnostics_omitted":0,"diagnostic_excerpt_truncated":false},{"stage":"synthesis","complete":false,"process_clean":true,"diagnostics_omitted":1,"diagnostic_excerpt_truncated":false}]。

### Prob080_timer

生成：EVALUATOR_BLOCKED；Baseline：NOT_RUN；Agent：NOT_RUN。

校准阻塞：PUBLIC_INTERFACE_UNSUPPORTED，不计为模型失败。

### Prob135_m2014_q6b

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob155_lemmings4

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob078_dualedge

生成：GENERATED_UNVERIFIED；Baseline：FAIL；Agent：OUTPUT_TRUNCATED。

- agent 1: OUTPUT_TRUNCATED, provider finish=max-tokens
- agent 4: OUTPUT_TRUNCATED, provider finish=max-tokens
- agent 5: OUTPUT_TRUNCATED, provider finish=max-tokens

- simulation: FAIL; failure_domain=design; Functional mismatch: 223 of 224 checks failed; simulator exited normally. Inspect the DUT against the specification; no failing signal or cycle was reported.

### Prob031_dff

生成：EVALUATOR_BLOCKED；Baseline：NOT_RUN；Agent：NOT_RUN。

校准阻塞：EVALUATOR_CALIBRATION_NOT_READY，不计为模型失败。

### Prob137_fsm_serial

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

