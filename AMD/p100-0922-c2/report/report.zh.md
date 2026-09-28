# 固定 100 题完整记录报告

本报告为独立的 EDA 环境校准后续比较批次：复用原批次全部 100 题生成结果（90 个合法候选），没有重新生成或替换题目；旧的 6 个环境阻塞终态及 2 个 Host 中断目录另行保留，不与本批次比较结果混算。综合上限由 120 秒调整为 600 秒，单次四阶段验证总上限由 300 秒调整为 900 秒，模型预算、题目和评测器内容不变。进程级 `XILINX_LOCAL_USER_DATA=no` 与两并发 EDA 健康检查证据见 [继续执行记录](../CONTINUATION.zh.md)。

状态：未完成，以下不是最终成绩。固定清单 125801a228d597a8aaa5b206657b81b4f60169b11a15bd74bba9f54a49708c44。

## 结果

| 指标 | 结果 |
|---|---:|
| 固定题数 | 100 |
| 历史校准阻塞 | 0 |
| 可运行题数 | 100 |
| 合法新候选 | 90 |
| 已进行初始对照 | 8 |
| Baseline 四阶段通过（已对照分母） | 6/8 (75.00%) |
| Agent 四阶段通过（已对照分母） | 6/8 (75.00%) |
| Agent 固定清单覆盖 | 6/100 (6.00%) |
| 自然修复恢复 | N/A |
| 实际模型 dispatch | 111 |
| 生成 / Agent / 探针 | 111 / 0 / 0 |
| 工具调用 | 0 |
| 传输重试 / 输出恢复 | 0 / 11 |
| XSim / 综合执行 | 8 / 8 |
| 返回 reasoning 的调用 | 111 |
| reasoning UTF-8 字节数 | 888472 |
| 已知输入 / 输出 token | 65240 / 299894 |
| 缺少 usage 的请求 | 1 |

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

本批次包含 100 道已校准可运行题，保留原 38 道，按预先固定的 SHA 顺序补足 62 道。新增题先进行无模型正负例校准；排除项另列于 calibration-exclusions.json，不占这 100 个名额。旧 38 道复用封存校准，不复用旧模型候选。full_os_isolation_verified=false；真实 EDA 不等于完整操作系统隔离。

未生成合法候选、未完成 EDA 和基础设施异常不应统称为 RTL 逻辑失败；已对照分母、可运行分母与固定 100 题覆盖须分别使用。本批次不混入旧批次候选或成绩。初始与 Agent 流程使用同一个新生成候选，是成对测试，不是两个独立采样总体。

## 逐题结果

| 题目 | 生成 | Baseline | Agent | 模型调用 | 工具调用 | reasoning 字节 |
|---|---|---|---|---:|---:|---:|
| [Prob005_notgate](../analysis/Prob005_notgate.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 4004 |
| [Prob035_count1to10](../analysis/Prob035_count1to10.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 1053 |
| [Prob045_edgedetect2](../analysis/Prob045_edgedetect2.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 9446 |
| [Prob074_ece241_2014_q4](../analysis/Prob074_ece241_2014_q4.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 5260 |
| [Prob015_vector1](../analysis/Prob015_vector1.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 1065 |
| [Prob033_ece241_2014_q1c](../analysis/Prob033_ece241_2014_q1c.md) | GENERATED_UNVERIFIED | PASS | VERIFIED | 1 | 0 | 3294 |
| [Prob004_vector2](../analysis/Prob004_vector2.md) | GENERATED_UNVERIFIED | ABORTED | POLICY_BLOCKED | 1 | 0 | 431 |
| [Prob020_mt2015_eq2](../analysis/Prob020_mt2015_eq2.md) | GENERATED_UNVERIFIED | ABORTED | POLICY_BLOCKED | 1 | 0 | 421 |
| [Prob018_mux256to1](../analysis/Prob018_mux256to1.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1517 |
| [Prob061_2014_q4a](../analysis/Prob061_2014_q4a.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 3668 |
| [Prob094_gatesv](../analysis/Prob094_gatesv.md) | TRANSPORT | NOT_RUN | NOT_RUN | 2 | 0 | 22396 |
| [Prob149_ece241_2013_q4](../analysis/Prob149_ece241_2013_q4.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 62911 |
| [Prob086_lfsr5](../analysis/Prob086_lfsr5.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 16193 |
| [Prob104_mt2015_muxdff](../analysis/Prob104_mt2015_muxdff.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 4182 |
| [Prob140_fsm_hdlc](../analysis/Prob140_fsm_hdlc.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 24627 |
| [Prob151_review2015_fsm](../analysis/Prob151_review2015_fsm.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 16028 |
| [Prob011_norgate](../analysis/Prob011_norgate.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 252 |
| [Prob023_vector100r](../analysis/Prob023_vector100r.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1834 |
| [Prob043_vector5](../analysis/Prob043_vector5.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 3414 |
| [Prob127_lemmings1](../analysis/Prob127_lemmings1.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 17485 |
| [Prob113_2012_q1g](../analysis/Prob113_2012_q1g.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 34817 |
| [Prob138_2012_q2fsm](../analysis/Prob138_2012_q2fsm.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 3142 |
| [Prob130_circuit5](../analysis/Prob130_circuit5.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1305 |
| [Prob066_edgecapture](../analysis/Prob066_edgecapture.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 8860 |
| [Prob135_m2014_q6b](../analysis/Prob135_m2014_q6b.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 9031 |
| [Prob064_vector3](../analysis/Prob064_vector3.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1359 |
| [Prob085_shift4](../analysis/Prob085_shift4.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1867 |
| [Prob121_2014_q3bfsm](../analysis/Prob121_2014_q3bfsm.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 2267 |
| [Prob155_lemmings4](../analysis/Prob155_lemmings4.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 60497 |
| [Prob029_m2014_q4g](../analysis/Prob029_m2014_q4g.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 451 |
| [Prob040_count10](../analysis/Prob040_count10.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 645 |
| [Prob042_vector4](../analysis/Prob042_vector4.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 595 |
| [Prob079_fsm3onehot](../analysis/Prob079_fsm3onehot.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 5184 |
| [Prob078_dualedge](../analysis/Prob078_dualedge.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 10252 |
| [Prob081_7458](../analysis/Prob081_7458.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 943 |
| [Prob117_circuit9](../analysis/Prob117_circuit9.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 2 | 0 | 35154 |
| [Prob137_fsm_serial](../analysis/Prob137_fsm_serial.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 57321 |
| [Prob067_countslow](../analysis/Prob067_countslow.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1350 |
| [Prob046_dff8p](../analysis/Prob046_dff8p.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 939 |
| [Prob026_alwaysblock1](../analysis/Prob026_alwaysblock1.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 820 |
| [Prob058_alwaysblock2](../analysis/Prob058_alwaysblock2.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 2800 |
| [Prob027_fadd](../analysis/Prob027_fadd.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 657 |
| [Prob142_lemmings2](../analysis/Prob142_lemmings2.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 7250 |
| [Prob073_dff16e](../analysis/Prob073_dff16e.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1078 |
| [Prob068_countbcd](../analysis/Prob068_countbcd.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 9579 |
| [Prob037_review2015_count1k](../analysis/Prob037_review2015_count1k.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 719 |
| [Prob056_ece241_2013_q7](../analysis/Prob056_ece241_2013_q7.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 2388 |
| [Prob122_kmap4](../analysis/Prob122_kmap4.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1020 |
| [Prob051_gates4](../analysis/Prob051_gates4.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 672 |
| [Prob039_always_if](../analysis/Prob039_always_if.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1108 |
| [Prob131_mt2015_q4](../analysis/Prob131_mt2015_q4.md) | INVALID_OUTPUT | NOT_RUN | NOT_RUN | 1 | 0 | 5304 |
| [Prob091_2012_q2b](../analysis/Prob091_2012_q2b.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1765 |
| [Prob071_always_casez](../analysis/Prob071_always_casez.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 2101 |
| [Prob144_conwaylife](../analysis/Prob144_conwaylife.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 13739 |
| [Prob145_circuit8](../analysis/Prob145_circuit8.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 13615 |
| [Prob077_wire_decl](../analysis/Prob077_wire_decl.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 625 |
| [Prob088_ece241_2014_q5b](../analysis/Prob088_ece241_2014_q5b.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 3189 |
| [Prob044_vectorgates](../analysis/Prob044_vectorgates.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 818 |
| [Prob008_m2014_q4h](../analysis/Prob008_m2014_q4h.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 2846 |
| [Prob084_ece241_2013_q12](../analysis/Prob084_ece241_2013_q12.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 9032 |
| [Prob007_wire](../analysis/Prob007_wire.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 181 |
| [Prob098_circuit7](../analysis/Prob098_circuit7.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 45273 |
| [Prob125_kmap3](../analysis/Prob125_kmap3.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 7597 |
| [Prob036_ringer](../analysis/Prob036_ringer.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 571 |
| [Prob076_always_case](../analysis/Prob076_always_case.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1021 |
| [Prob101_circuit4](../analysis/Prob101_circuit4.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 852 |
| [Prob047_dff8ar](../analysis/Prob047_dff8ar.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1233 |
| [Prob070_ece241_2013_q2](../analysis/Prob070_ece241_2013_q2.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 38183 |
| [Prob065_7420](../analysis/Prob065_7420.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 427 |
| [Prob124_rule110](../analysis/Prob124_rule110.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 17647 |
| [Prob100_fsm3comb](../analysis/Prob100_fsm3comb.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1914 |
| [Prob154_fsm_ps2data](../analysis/Prob154_fsm_ps2data.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 48509 |
| [Prob075_counter_2bc](../analysis/Prob075_counter_2bc.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1723 |
| [Prob059_wire4](../analysis/Prob059_wire4.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 544 |
| [Prob063_review2015_shiftcount](../analysis/Prob063_review2015_shiftcount.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 9369 |
| [Prob083_mt2015_q4b](../analysis/Prob083_mt2015_q4b.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1117 |
| [Prob034_dff8](../analysis/Prob034_dff8.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 457 |
| [Prob022_mux2to1](../analysis/Prob022_mux2to1.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 278 |
| [Prob114_bugs_case](../analysis/Prob114_bugs_case.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1610 |
| [Prob041_dff8r](../analysis/Prob041_dff8r.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 468 |
| [Prob136_m2014_q6](../analysis/Prob136_m2014_q6.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 4577 |
| [Prob139_2013_q2bfsm](../analysis/Prob139_2013_q2bfsm.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 2 | 0 | 43867 |
| [Prob109_fsm1](../analysis/Prob109_fsm1.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 2259 |
| [Prob134_2014_q3c](../analysis/Prob134_2014_q3c.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 11277 |
| [Prob143_fsm_onehot](../analysis/Prob143_fsm_onehot.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 9159 |
| [Prob054_edgedetect](../analysis/Prob054_edgedetect.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 4917 |
| [Prob105_rotate100](../analysis/Prob105_rotate100.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 2619 |
| [Prob096_review2015_fsmseq](../analysis/Prob096_review2015_fsmseq.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 3298 |
| [Prob060_m2014_q4k](../analysis/Prob060_m2014_q4k.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 2659 |
| [Prob014_andgate](../analysis/Prob014_andgate.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 525 |
| [Prob017_mux2to1v](../analysis/Prob017_mux2to1v.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 782 |
| [Prob021_mux256to1v](../analysis/Prob021_mux256to1v.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 809 |
| [Prob030_popcount255](../analysis/Prob030_popcount255.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 12575 |
| [Prob090_circuit1](../analysis/Prob090_circuit1.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 498 |
| [Prob146_fsm_serialdata](../analysis/Prob146_fsm_serialdata.md) | OUTPUT_TRUNCATED | NOT_RUN | NOT_RUN | 2 | 0 | 56714 |
| [Prob148_2013_q2afsm](../analysis/Prob148_2013_q2afsm.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 5697 |
| [Prob152_lemmings3](../analysis/Prob152_lemmings3.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 12322 |
| [Prob025_reduction](../analysis/Prob025_reduction.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 1002 |
| [Prob102_circuit3](../analysis/Prob102_circuit3.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 2106 |
| [Prob057_kmap2](../analysis/Prob057_kmap2.md) | GENERATED_UNVERIFIED | NOT_RUN | NOT_RUN | 1 | 0 | 15251 |

## 固定分母补充

生成失败 10 题。以上已对照分母排除了没有合法候选的题目，不能单独用来代表端到端成功率。按全部 100 道已校准题目计算（生成失败仍计入分母），Baseline 为 6/100 (6.00%)，Agent 为 6/100 (6.00%)；按固定 100 题覆盖计算，Agent 为 6/100 (6.00%)。

## 工具调用口径

生成阶段不提供 Agent 工具。每个合法候选先由 Host 进行初始验证；只有初始失败且符合修复策略时才请求模型选择工具。因此 Agent 通过总数包含无需修复的初始通过项，不能解释为每题都发生了模型工具调用。本轮有 0 题发生 Agent 工具调用，共 0 次。

## 响应完整性

111/111 次调用观测到 HTTP 200。91 次完整终态；19 次为服务端 max-tokens，其中 19 次仅返回 reasoning，既无正文，也无工具参数增量。这里没有把 HTTP 200 等同于任务成功，也没有将已完整保存的部分流误称为完整模型回答。

原始证据文件、字节数和 SHA-256 见 [完整文件清单](../evidence-files.json)。该清单不递归复制依赖库链接或外部封存 evaluator；对应链接目标另行列明，评测输入受 campaign-freeze.json 哈希约束。

## 未通过或受限项目

### Prob004_vector2

生成：GENERATED_UNVERIFIED；Baseline：ABORTED；Agent：POLICY_BLOCKED。

Host 策略阻塞：EXECUTION_OR_EVIDENCE；Incomplete evidence or independent execution failure.

- synthesis: TIMEOUT; failure_domain=resource; Stage wall-clock budget exceeded Total wall-clock budget exceeded

### Prob020_mt2015_eq2

生成：GENERATED_UNVERIFIED；Baseline：ABORTED；Agent：POLICY_BLOCKED。

Host 策略阻塞：EXECUTION_OR_EVIDENCE；Incomplete evidence or independent execution failure.

- synthesis: TIMEOUT; failure_domain=resource; Stage wall-clock budget exceeded Total wall-clock budget exceeded

### Prob094_gatesv

生成：TRANSPORT；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: connection, provider finish=error

### Prob149_ece241_2013_q4

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob113_2012_q1g

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob155_lemmings4

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob137_fsm_serial

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob131_mt2015_q4

生成：INVALID_OUTPUT；Baseline：NOT_RUN；Agent：NOT_RUN。

### Prob098_circuit7

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob070_ece241_2013_q2

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob154_fsm_ps2data

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens

### Prob146_fsm_serialdata

生成：OUTPUT_TRUNCATED；Baseline：NOT_RUN；Agent：NOT_RUN。

- generation 1: truncated, provider finish=max-tokens
- generation 2: truncated, provider finish=max-tokens


## Repair V3 行为

| 指标 | 结果 |
|---|---:|
| 强制动作请求 | 0 |
| 强制动作被 Host 接受 | 0 |
| 上下文压缩请求 | 0 |
| 正常模式 / 强制动作压缩 | 0 / 0 |
| 验证后修订改善 | 0 |
| 候选验证后回退 | 0 |
| 未验证终态恢复 | 0 |

压缩次数包括 forced_action 的 core_only 压缩，不等同于达到 80% 阈值的正常模式压缩。强制动作请求与接受次数不同，触发恢复不代表修复成功。逐次修订决策和最佳版本得分见逐题分析与证据审计。

实际发送功能仿真反馈 0 次，其中包含可用 VCD 波形摘要 0 次。这里只统计请求正文中真实存在的反馈，不把仅保存于本地但未发送给模型的文件算作已利用证据。

本轮为固定小样本的成对测试，结果不等同于一般化准确率。若与旧批次对比，两轮重新生成的候选可能不同，不能把跨批次通过数的变化单独归因于 Repair V3。

模型完整消息中记录 0 个工具调用块；Host 处理 0 次单工具动作，其中接受 0 次。被拒绝的动作和不完整工具参数仍保存在原始流与模型终态中，不算作成功执行。

含波形反馈的 0 次请求中，0 次观测到模型输出；未返回模型输出的请求不能算作模型已消费反馈。除 19 次 provider max-tokens 外，还有 0 次本地 OUTPUT_TRUNCATED、0 次 HTTP 400。缺失 usage 的 token 数未知，表中 token 合计不是完整计费量。

不合法候选分类、成对增益、剩余阻塞及建议见 [异常与结论](findings.zh.md)。

## 成对增益与修复漏斗

初始失败 2 题，符合修复策略 0 题，实际请求修复 0 题，接受过修改 0 题，重新验证 0 题，最终恢复 0 题。初始通过并保留 6 题，FAIL→PASS 0 题，PASS→未验证 0 题，固定 100 题净增益 0 个百分点。生成失败没有合法初始候选，未进入 Agent 修复，不能算作一次失败的工具修复。
