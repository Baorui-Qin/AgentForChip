# P10 固定四十题重测

协议：VerilogEval V2 tasks evaluated with Vivado 2025.2 compatibility evaluator v1。不是未经修改的官方 VerilogEval 分数，也不是本地 Qwen 成绩。

- 固定选择 40 题，按原顺序分为四组；未更换被阻塞题目，未合并历史模型成绩。
- 可评测 38 题，评测阻塞 2 题。每道可评测题重新调用 deepseek-flash 生成；reasoning high、temperature 0、maxTokens 8192，Agent、Prompt、Skill 和修复预算未修改。
- 可评测题 Baseline：24/38；Agent：24/38。固定选择覆盖口径：24/40 与 24/40，阻塞不是模型失败。
- 共享初始候选：仅未通过时进入 Agent 修复，不是两个独立采样实验。恢复 0 题；语义修复 2 次。
- 模型请求 46，初始 38，Agent 增量 8；输入 token 42263，输出 118443。
- 模型候选 EDA 33 次，要求编译、展开、仿真、综合四阶段通过。正负校准另见 preflight-40.json。
- 套件 SHA256：880f2dabca449f800238edf3458739ca8e37e811bfc5750d8474298af2b80353。审计：PASS，未发现不一致。

| 任务 | Baseline | Agent 最终 | 检查次数 | Mismatch | 修复次数 |
|---|---|---|---:|---:|---:|
| Prob005_notgate | PASS | VERIFIED | 239 | 0 | 0 |
| Prob035_count1to10 | MODEL_RESPONSE_ERROR | NOT_RUN | - | - | 0 |
| Prob045_edgedetect2 | FAIL | OUTPUT_TRUNCATED | 228 | 212 | 0 |
| Prob074_ece241_2014_q4 | PASS | VERIFIED | 118 | 0 | 0 |
| Prob015_vector1 | PASS | VERIFIED | 218 | 0 | 0 |
| Prob033_ece241_2014_q1c | PASS | VERIFIED | 116 | 0 | 0 |
| Prob004_vector2 | PASS | VERIFIED | 110 | 0 | 0 |
| Prob020_mt2015_eq2 | FAIL | UNCLASSIFIED_FAILURE | 2000 | 0 | 0 |
| Prob018_mux256to1 | TOOL_ERROR | EXECUTION_OR_EVIDENCE | 2000 | 0 | 0 |
| Prob061_2014_q4a | PASS | VERIFIED | 200 | 0 | 0 |
| Prob094_gatesv | PASS | VERIFIED | 213 | 0 | 0 |
| Prob149_ece241_2013_q4 | MODEL_RESPONSE_ERROR | NOT_RUN | - | - | 0 |
| Prob086_lfsr5 | PASS | VERIFIED | 4443 | 0 | 0 |
| Prob104_mt2015_muxdff | FAIL | OUTPUT_TRUNCATED | 199 | 1 | 0 |
| Prob140_fsm_hdlc | MODEL_RESPONSE_ERROR | NOT_RUN | - | - | 0 |
| Prob151_review2015_fsm | FAIL | UNCLASSIFIED_FAILURE | 5069 | 0 | 0 |
| Prob011_norgate | PASS | VERIFIED | 219 | 0 | 0 |
| Prob023_vector100r | PASS | VERIFIED | 200 | 0 | 0 |
| Prob043_vector5 | PASS | VERIFIED | 100 | 0 | 0 |
| Prob127_lemmings1 | FAIL | UNCLASSIFIED_FAILURE | 229 | 0 | 0 |
| Prob113_2012_q1g | PASS | VERIFIED | 100 | 0 | 0 |
| Prob138_2012_q2fsm | PASS | VERIFIED | 400 | 0 | 0 |
| Prob080_timer | NOT_RUN | NOT_RUN | - | - | 0 |
| Prob130_circuit5 | PASS | VERIFIED | 141 | 0 | 0 |
| Prob066_edgecapture | PASS | VERIFIED | 266 | 0 | 0 |
| Prob135_m2014_q6b | MODEL_RESPONSE_ERROR | NOT_RUN | - | - | 0 |
| Prob064_vector3 | PASS | VERIFIED | 126 | 0 | 0 |
| Prob085_shift4 | PASS | VERIFIED | 427 | 0 | 0 |
| Prob121_2014_q3bfsm | MODEL_RESPONSE_ERROR | NOT_RUN | - | - | 0 |
| Prob155_lemmings4 | MODEL_RESPONSE_ERROR | NOT_RUN | - | - | 0 |
| Prob029_m2014_q4g | PASS | VERIFIED | 100 | 0 | 0 |
| Prob040_count10 | PASS | VERIFIED | 439 | 0 | 0 |
| Prob042_vector4 | PASS | VERIFIED | 100 | 0 | 0 |
| Prob079_fsm3onehot | PASS | VERIFIED | 200 | 0 | 0 |
| Prob078_dualedge | FAIL | OUTPUT_TRUNCATED | 224 | 93 | 2 |
| Prob081_7458 | PASS | VERIFIED | 439 | 0 | 0 |
| Prob031_dff | NOT_RUN | NOT_RUN | - | - | 0 |
| Prob117_circuit9 | PASS | VERIFIED | 245 | 0 | 0 |
| Prob137_fsm_serial | MODEL_RESPONSE_ERROR | NOT_RUN | - | - | 0 |
| Prob067_countslow | PASS | VERIFIED | 499 | 0 | 0 |

## 评测阻塞

- Prob080_timer: HOST_INTERFACE_UNSUPPORTED; PUBLIC_INTERFACE_UNSUPPORTED
- Prob031_dff: INCONCLUSIVE; EVALUATOR_CALIBRATION_NOT_READY

Prob031_dff 的正对照出现 120/121 mismatch；当前协议不能对它产生有效模型分数。未在本轮中途修改测试平台或计时规则。未声称完整 OS 隔离、Icarus 等价或全 156 题工具校准。
