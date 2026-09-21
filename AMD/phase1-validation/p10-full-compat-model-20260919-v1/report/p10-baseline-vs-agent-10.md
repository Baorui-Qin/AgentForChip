# P10 新兼容套件十题重测

协议：VerilogEval V2 tasks evaluated with Vivado 2025.2 compatibility evaluator v1。不是未经修改的官方 VerilogEval 分数。

- 全部十题重新调用模型生成，不复用历史候选。模型为 deepseek-flash，reasoning high，temperature 0，maxTokens 8192；Agent、Prompt、Skill 和修复预算未修改。
- Baseline：9/10；Agent 最终：10/10；修复成功题数：1。
- 共享初始候选协议：每题先评分一次初始候选，仅在未通过时进入 Agent 修复；不是两个独立随机采样实验。
- 真实模型请求：12，其中初始 10，Agent 增量 2；语义修复 1 次。
- Token：输入 13467，输出 13871；真实 EDA 11 次，要求 compile、elaborate、simulation、synthesis 四阶段通过。
- 套件 SHA256：880f2dabca449f800238edf3458739ca8e37e811bfc5750d8474298af2b80353。
- 审计：PASS，未发现不一致。原始数据集、冻结套件及历史结果保持不变。

| 任务 | Baseline | Agent 最终 | 检查次数 | Mismatch | 修复次数 |
|---|---|---|---:|---:|---:|
| Prob005_notgate | PASS | VERIFIED | 239 | 0 | 0 |
| Prob035_count1to10 | PASS | VERIFIED | 439 | 0 | 0 |
| Prob045_edgedetect2 | FAIL | VERIFIED | 228 | 0 | 1 |
| Prob074_ece241_2014_q4 | PASS | VERIFIED | 118 | 0 | 0 |
| Prob015_vector1 | PASS | VERIFIED | 218 | 0 | 0 |
| Prob033_ece241_2014_q1c | PASS | VERIFIED | 116 | 0 | 0 |
| Prob004_vector2 | PASS | VERIFIED | 110 | 0 | 0 |
| Prob020_mt2015_eq2 | PASS | VERIFIED | 2000 | 0 | 0 |
| Prob018_mux256to1 | PASS | VERIFIED | 2000 | 0 | 0 |
| Prob061_2014_q4a | PASS | VERIFIED | 200 | 0 | 0 |

本次只执行原固定十题。四十题扩展和其余 145 题完整工具校准未执行，Prob156 仍为人工审查项。若所有初始候选都通过，则本次数据不能证明 Agent 的增量修复能力。未声称完整 OS 隔离或 Icarus 等价。
