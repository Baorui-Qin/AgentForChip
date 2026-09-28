# 全量 156 题测试报告

请先阅读 [结论与有效性限制](summary.zh.md)。本文件是原批取证数据与逐题索引；两题修复被 HTTP 402 阻塞，另有初态、临时目录和参考规格问题，不能把原始验收率直接解释为模型正确率。独立续测不回写本文件的评分。

状态：COMPARISON_FINISHED。题单及源码以 campaign-freeze.json 为准。旧批次不覆盖，本次全部重新生成。

## 核心结果

| 指标 | 结果 |
|---|---:|
| 全部题目 | 156 |
| 校准通过 / 阻塞 | 156 / 0 |
| 接口阻塞 | 0 |
| 首次调用合法 / 纠正后新增合法 | 136 / 20 |
| 最终合法候选 | 156 |
| 已比较 | 156 |
| Baseline 已比较分母 | 143/156 (91.67%) |
| Agent 已比较分母 | 150/156 (96.15%) |
| Baseline 校准题分母 | 143/156 (91.67%) |
| Agent 校准题分母 | 150/156 (96.15%) |
| Baseline / Agent 全题库已验证覆盖 | 143/156 (91.67%) / 150/156 (96.15%) |
| 自然修复成功 | 7/11 (63.64%) |
| 实际 RTL 修改 | 23 |
| 本批调用 / 本批上限 | 462 / 20111 |
| 含中断批次总调用 / 总授权 | 475 / 20124 |
| 生成 / 修复调用 | 176 / 286 |
| 工具动作 / 接受 | 167 / 72 |
| 已知输入 / 输出 token | 1380177 / 2587090 |
| 缺少 usage 调用 | 2 |

## 口径

全题库覆盖不是将评测阻塞算作模型答错。生成候选与可计分候选分开；非法候选不冒充 RTL 功能失败。生成最多初次加两次纠正，首次合法后不择优采样，因此不是严格单调用 pass@1。Baseline 和 Agent 共享同一候选及冻结评测器。每题最多 15 次接受的修改、60 个工具动作和 120 次修复请求；重试不重置预算。综合单次 600 秒，总验证 900 秒；模型请求 120 秒；总活动 8 小时仅容纳最坏情况，不延长各阶段上限。

模型为 deepseek-flash；初次 high reasoning/8192 token，候选恢复 off/16384，普通修复 high/16384，修复强制动作 off/4096。思考模式下 temperature=0 不是确定性保证。多项协议与候选同时改变，不能把跨批次通过率差异仅归因于 15 轮。full_os_isolation_verified=false，开发环境运行不是完整操作系统隔离。

## 日志与完整性

- [完整调用 JSONL](../analysis/calls.jsonl)：请求、接口返回 reasoning/输出、全部已收到的规范化 chunk、工具参数和调用终态。
- [Host 工具轨迹](../analysis/tool-traces.jsonl)：调用、拒绝、修改、验证、回滚与证据绑定。
- [逐调用索引](call-index.json)；[证据审计](evidence-audit.json)；[完整文件清单](../evidence-files.json)。
- 原始模型目录和 EDA 目录保留哈希、源码版本、命令、stdout/stderr、诊断及波形。

保存的是接口实际返回的 reasoning，不是未公开内部思考；stream.jsonl 是 Harness 规范化流，不是原始 SSE 抓包。未发送的服务端内容无法保存；缺少 usage 不猜测计费。凭据不保存。共 137 次 provider max-tokens，137 次仅 reasoning 截断，0 次本地截断，0 次 HTTP 400。

## 逐题结果

| 题目 | 生成 | 校准 | Baseline | Agent | 修改轮数 | 调用 |
|---|---|---|---|---|---:|---:|
| [Prob001_zero](../analysis/Prob001_zero.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob002_m2014_q4i](../analysis/Prob002_m2014_q4i.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob003_step_one](../analysis/Prob003_step_one.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob004_vector2](../analysis/Prob004_vector2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob005_notgate](../analysis/Prob005_notgate.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob006_vectorr](../analysis/Prob006_vectorr.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob007_wire](../analysis/Prob007_wire.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob008_m2014_q4h](../analysis/Prob008_m2014_q4h.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob009_popcount3](../analysis/Prob009_popcount3.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob010_mt2015_q4a](../analysis/Prob010_mt2015_q4a.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob011_norgate](../analysis/Prob011_norgate.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob012_xnorgate](../analysis/Prob012_xnorgate.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob013_m2014_q4e](../analysis/Prob013_m2014_q4e.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob014_andgate](../analysis/Prob014_andgate.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob015_vector1](../analysis/Prob015_vector1.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob016_m2014_q4j](../analysis/Prob016_m2014_q4j.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob017_mux2to1v](../analysis/Prob017_mux2to1v.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob018_mux256to1](../analysis/Prob018_mux256to1.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob019_m2014_q4f](../analysis/Prob019_m2014_q4f.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob020_mt2015_eq2](../analysis/Prob020_mt2015_eq2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob021_mux256to1v](../analysis/Prob021_mux256to1v.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob022_mux2to1](../analysis/Prob022_mux2to1.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob023_vector100r](../analysis/Prob023_vector100r.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob024_hadd](../analysis/Prob024_hadd.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob025_reduction](../analysis/Prob025_reduction.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob026_alwaysblock1](../analysis/Prob026_alwaysblock1.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob027_fadd](../analysis/Prob027_fadd.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob028_m2014_q4a](../analysis/Prob028_m2014_q4a.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob029_m2014_q4g](../analysis/Prob029_m2014_q4g.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob030_popcount255](../analysis/Prob030_popcount255.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob031_dff](../analysis/Prob031_dff.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob032_vector0](../analysis/Prob032_vector0.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob033_ece241_2014_q1c](../analysis/Prob033_ece241_2014_q1c.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob034_dff8](../analysis/Prob034_dff8.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob035_count1to10](../analysis/Prob035_count1to10.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob036_ringer](../analysis/Prob036_ringer.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob037_review2015_count1k](../analysis/Prob037_review2015_count1k.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob038_count15](../analysis/Prob038_count15.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob039_always_if](../analysis/Prob039_always_if.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob040_count10](../analysis/Prob040_count10.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob041_dff8r](../analysis/Prob041_dff8r.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob042_vector4](../analysis/Prob042_vector4.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob043_vector5](../analysis/Prob043_vector5.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob044_vectorgates](../analysis/Prob044_vectorgates.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob045_edgedetect2](../analysis/Prob045_edgedetect2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob046_dff8p](../analysis/Prob046_dff8p.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob047_dff8ar](../analysis/Prob047_dff8ar.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob048_m2014_q4c](../analysis/Prob048_m2014_q4c.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob049_m2014_q4b](../analysis/Prob049_m2014_q4b.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob050_kmap1](../analysis/Prob050_kmap1.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob051_gates4](../analysis/Prob051_gates4.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob052_gates100](../analysis/Prob052_gates100.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob053_m2014_q4d](../analysis/Prob053_m2014_q4d.md) | GENERATED_UNVERIFIED | 通过 | INCONCLUSIVE | POLICY_BLOCKED | 0 | 1 |
| [Prob054_edgedetect](../analysis/Prob054_edgedetect.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob055_conditional](../analysis/Prob055_conditional.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob056_ece241_2013_q7](../analysis/Prob056_ece241_2013_q7.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob057_kmap2](../analysis/Prob057_kmap2.md) | GENERATED_UNVERIFIED | 通过 | FAIL | VERIFIED | 1 | 4 |
| [Prob058_alwaysblock2](../analysis/Prob058_alwaysblock2.md) | GENERATED_UNVERIFIED | 通过 | TOOL_ERROR | POLICY_BLOCKED | 0 | 1 |
| [Prob059_wire4](../analysis/Prob059_wire4.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob060_m2014_q4k](../analysis/Prob060_m2014_q4k.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob061_2014_q4a](../analysis/Prob061_2014_q4a.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob062_bugs_mux2](../analysis/Prob062_bugs_mux2.md) | GENERATED_UNVERIFIED | 通过 | FAIL | VERIFIED | 2 | 11 |
| [Prob063_review2015_shiftcount](../analysis/Prob063_review2015_shiftcount.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob064_vector3](../analysis/Prob064_vector3.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob065_7420](../analysis/Prob065_7420.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob066_edgecapture](../analysis/Prob066_edgecapture.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob067_countslow](../analysis/Prob067_countslow.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob068_countbcd](../analysis/Prob068_countbcd.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob069_truthtable1](../analysis/Prob069_truthtable1.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob070_ece241_2013_q2](../analysis/Prob070_ece241_2013_q2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |
| [Prob071_always_casez](../analysis/Prob071_always_casez.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob072_thermostat](../analysis/Prob072_thermostat.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob073_dff16e](../analysis/Prob073_dff16e.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob074_ece241_2014_q4](../analysis/Prob074_ece241_2014_q4.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob075_counter_2bc](../analysis/Prob075_counter_2bc.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob076_always_case](../analysis/Prob076_always_case.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob077_wire_decl](../analysis/Prob077_wire_decl.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob078_dualedge](../analysis/Prob078_dualedge.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob079_fsm3onehot](../analysis/Prob079_fsm3onehot.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob080_timer](../analysis/Prob080_timer.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob081_7458](../analysis/Prob081_7458.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob082_lfsr32](../analysis/Prob082_lfsr32.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob083_mt2015_q4b](../analysis/Prob083_mt2015_q4b.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob084_ece241_2013_q12](../analysis/Prob084_ece241_2013_q12.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob085_shift4](../analysis/Prob085_shift4.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob086_lfsr5](../analysis/Prob086_lfsr5.md) | GENERATED_UNVERIFIED | 通过 | FAIL | VERIFIED | 3 | 12 |
| [Prob087_gates](../analysis/Prob087_gates.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob088_ece241_2014_q5b](../analysis/Prob088_ece241_2014_q5b.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob089_ece241_2014_q5a](../analysis/Prob089_ece241_2014_q5a.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |
| [Prob090_circuit1](../analysis/Prob090_circuit1.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob091_2012_q2b](../analysis/Prob091_2012_q2b.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob092_gatesv100](../analysis/Prob092_gatesv100.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob093_ece241_2014_q3](../analysis/Prob093_ece241_2014_q3.md) | GENERATED_UNVERIFIED | 通过 | FAIL | TOOL_STEP_BUDGET_EXHAUSTED | 11 | 95 |
| [Prob094_gatesv](../analysis/Prob094_gatesv.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob095_review2015_fsmshift](../analysis/Prob095_review2015_fsmshift.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |
| [Prob096_review2015_fsmseq](../analysis/Prob096_review2015_fsmseq.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob097_mux9to1v](../analysis/Prob097_mux9to1v.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob098_circuit7](../analysis/Prob098_circuit7.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |
| [Prob099_m2014_q6c](../analysis/Prob099_m2014_q6c.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob100_fsm3comb](../analysis/Prob100_fsm3comb.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob101_circuit4](../analysis/Prob101_circuit4.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob102_circuit3](../analysis/Prob102_circuit3.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob103_circuit2](../analysis/Prob103_circuit2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob104_mt2015_muxdff](../analysis/Prob104_mt2015_muxdff.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob105_rotate100](../analysis/Prob105_rotate100.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob106_always_nolatches](../analysis/Prob106_always_nolatches.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob107_fsm1s](../analysis/Prob107_fsm1s.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob108_rule90](../analysis/Prob108_rule90.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob109_fsm1](../analysis/Prob109_fsm1.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob110_fsm2](../analysis/Prob110_fsm2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob111_fsm2s](../analysis/Prob111_fsm2s.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob112_always_case2](../analysis/Prob112_always_case2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob113_2012_q1g](../analysis/Prob113_2012_q1g.md) | GENERATED_UNVERIFIED | 通过 | FAIL | VERIFIED | 1 | 6 |
| [Prob114_bugs_case](../analysis/Prob114_bugs_case.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob115_shift18](../analysis/Prob115_shift18.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob116_m2014_q3](../analysis/Prob116_m2014_q3.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |
| [Prob117_circuit9](../analysis/Prob117_circuit9.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |
| [Prob118_history_shift](../analysis/Prob118_history_shift.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob119_fsm3](../analysis/Prob119_fsm3.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob120_fsm3s](../analysis/Prob120_fsm3s.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob121_2014_q3bfsm](../analysis/Prob121_2014_q3bfsm.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob122_kmap4](../analysis/Prob122_kmap4.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob123_bugs_addsubz](../analysis/Prob123_bugs_addsubz.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob124_rule110](../analysis/Prob124_rule110.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob125_kmap3](../analysis/Prob125_kmap3.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob126_circuit6](../analysis/Prob126_circuit6.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob127_lemmings1](../analysis/Prob127_lemmings1.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob128_fsm_ps2](../analysis/Prob128_fsm_ps2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob129_ece241_2013_q8](../analysis/Prob129_ece241_2013_q8.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob130_circuit5](../analysis/Prob130_circuit5.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob131_mt2015_q4](../analysis/Prob131_mt2015_q4.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob132_always_if2](../analysis/Prob132_always_if2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob133_2014_q3fsm](../analysis/Prob133_2014_q3fsm.md) | GENERATED_UNVERIFIED | 通过 | FAIL | QUOTA | 0 | 8 |
| [Prob134_2014_q3c](../analysis/Prob134_2014_q3c.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob135_m2014_q6b](../analysis/Prob135_m2014_q6b.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob136_m2014_q6](../analysis/Prob136_m2014_q6.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob137_fsm_serial](../analysis/Prob137_fsm_serial.md) | GENERATED_UNVERIFIED | 通过 | FAIL | QUOTA | 0 | 3 |
| [Prob138_2012_q2fsm](../analysis/Prob138_2012_q2fsm.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob139_2013_q2bfsm](../analysis/Prob139_2013_q2bfsm.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |
| [Prob140_fsm_hdlc](../analysis/Prob140_fsm_hdlc.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob141_count_clock](../analysis/Prob141_count_clock.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob142_lemmings2](../analysis/Prob142_lemmings2.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob143_fsm_onehot](../analysis/Prob143_fsm_onehot.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob144_conwaylife](../analysis/Prob144_conwaylife.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob145_circuit8](../analysis/Prob145_circuit8.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob146_fsm_serialdata](../analysis/Prob146_fsm_serialdata.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |
| [Prob147_circuit10](../analysis/Prob147_circuit10.md) | GENERATED_UNVERIFIED | 通过 | FAIL | VERIFIED | 1 | 6 |
| [Prob148_2013_q2afsm](../analysis/Prob148_2013_q2afsm.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob149_ece241_2013_q4](../analysis/Prob149_ece241_2013_q4.md) | GENERATED_UNVERIFIED | 通过 | FAIL | TOOL_STEP_BUDGET_EXHAUSTED | 1 | 120 |
| [Prob150_review2015_fsmonehot](../analysis/Prob150_review2015_fsmonehot.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob151_review2015_fsm](../analysis/Prob151_review2015_fsm.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob152_lemmings3](../analysis/Prob152_lemmings3.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 1 |
| [Prob153_gshare](../analysis/Prob153_gshare.md) | GENERATED_UNVERIFIED | 通过 | FAIL | VERIFIED | 1 | 4 |
| [Prob154_fsm_ps2data](../analysis/Prob154_fsm_ps2data.md) | GENERATED_UNVERIFIED | 通过 | FAIL | VERIFIED | 2 | 38 |
| [Prob155_lemmings4](../analysis/Prob155_lemmings4.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |
| [Prob156_review2015_fancytimer](../analysis/Prob156_review2015_fancytimer.md) | GENERATED_UNVERIFIED | 通过 | PASS | VERIFIED | 0 | 2 |

## 新评测版本与已知限制

RTL 使用 p10-settled-rtl-1 稳定采样，最终成功还必须通过 p10-netlist-1 网表验收。Prob078 的历史正确实现通过 447 次检查；历史错误 PASS 实现在新预检中被 216 次失配拒绝。旧批次分数不修改，不能直接将跨评测器通过率变化解释为模型提升。仿真每次上限为本批 model.patch.yml 中冻结的值。

Prob031/Prob062 使用用户批准且公开给两组模型的接口勘误；原题面保留。Prob093/Prob149 已知题面与参考冲突：保留其实际执行结果，同时在下列预声明排除口径中移除，不能称其参考匹配率为规格正确率。其余参考也未经形式证明。Agent 使用额外反馈、技能和修复预算，结果衡量整套流程效果，不是等资源下框架净贡献。

```json
{
  "label": "Predeclared known-conflict exclusion, not proof that all remaining references are correct.",
  "selected": 154,
  "compared": 154,
  "baseline_pass": 143,
  "agent_pass": 150
}
```

每题 analysis 文档包含完整请求、接口实际返回 reasoning、输出、工具参数及 Host 轨迹；对应 revision-*.diff 记录接受修改相对实际父版本的变化。

## 网络中断与重新冻结

p156-20260927-v2 在第 10 题连续三次 ECONNRESET 后按冻结规则终止，保留全部 13 次调用记录；其 9 个候选未参与 EDA 评分。本批仅为实验进程增加 api.deepseek.com 直连规则，保留系统代理和 TLS 校验，重新生成全部 156 题，不从中断批次挑选答案。已用 13 次计入 20124 总额，本批上限 20111。校准器、模型参数、单题修复预算与评测源码不变。
