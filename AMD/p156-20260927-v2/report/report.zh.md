# 全量 156 题测试报告

状态：INFRA_PAUSED。题单及源码以 campaign-freeze.json 为准。旧批次不覆盖，本次全部重新生成。

## 核心结果

| 指标 | 结果 |
|---|---:|
| 全部题目 | 156 |
| 校准通过 / 阻塞 | 156 / 0 |
| 接口阻塞 | 0 |
| 首次调用合法 / 纠正后新增合法 | 8 / 0 |
| 最终合法候选 | 9 |
| 已比较 | 0 |
| Baseline 已比较分母 | N/A |
| Agent 已比较分母 | N/A |
| Baseline 校准题分母 | 0/156 (0.00%) |
| Agent 校准题分母 | 0/156 (0.00%) |
| Baseline / Agent 全题库已验证覆盖 | 0/156 (0.00%) / 0/156 (0.00%) |
| 自然修复成功 | N/A |
| 实际 RTL 修改 | 0 |
| 物理调用 / 授权上限 | 13 / 20124 |
| 生成 / 修复调用 | 13 / 0 |
| 工具动作 / 接受 | 0 / 0 |
| 已知输入 / 输出 token | 3221 / 4119 |
| 缺少 usage 调用 | 4 |

## 口径

全题库覆盖不是将评测阻塞算作模型答错。生成候选与可计分候选分开；非法候选不冒充 RTL 功能失败。生成最多初次加两次纠正，首次合法后不择优采样，因此不是严格单调用 pass@1。Baseline 和 Agent 共享同一候选及冻结评测器。每题最多 15 次接受的修改、60 个工具动作和 120 次修复请求；重试不重置预算。综合单次 600 秒，总验证 900 秒；模型请求 120 秒；总活动 8 小时仅容纳最坏情况，不延长各阶段上限。

模型为 deepseek-flash；初次 high reasoning/8192 token，候选恢复 off/16384，普通修复 high/16384，修复强制动作 off/4096。思考模式下 temperature=0 不是确定性保证。多项协议与候选同时改变，不能把跨批次通过率差异仅归因于 15 轮。full_os_isolation_verified=false，开发环境运行不是完整操作系统隔离。

## 日志与完整性

- [完整调用 JSONL](../analysis/calls.jsonl)：请求、接口返回 reasoning/输出、全部已收到的规范化 chunk、工具参数和调用终态。
- [Host 工具轨迹](../analysis/tool-traces.jsonl)：调用、拒绝、修改、验证、回滚与证据绑定。
- [逐调用索引](call-index.json)；[证据审计](evidence-audit.json)；[完整文件清单](../evidence-files.json)。
- 原始模型目录和 EDA 目录保留哈希、源码版本、命令、stdout/stderr、诊断及波形。

保存的是接口实际返回的 reasoning，不是未公开内部思考；stream.jsonl 是 Harness 规范化流，不是原始 SSE 抓包。未发送的服务端内容无法保存；缺少 usage 不猜测计费。凭据不保存。共 0 次 provider max-tokens，0 次仅 reasoning 截断，0 次本地截断，0 次 HTTP 400。

## 逐题结果

| 题目 | 生成 | 校准 | Baseline | Agent | 修改轮数 | 调用 |
|---|---|---|---|---|---:|---:|
| [Prob001_zero](../analysis/Prob001_zero.md) | GENERATED_UNVERIFIED | 通过 | NOT_RUN | NOT_RUN | 0 | 1 |
| [Prob002_m2014_q4i](../analysis/Prob002_m2014_q4i.md) | GENERATED_UNVERIFIED | 通过 | NOT_RUN | NOT_RUN | 0 | 2 |
| [Prob003_step_one](../analysis/Prob003_step_one.md) | GENERATED_UNVERIFIED | 通过 | NOT_RUN | NOT_RUN | 0 | 1 |
| [Prob004_vector2](../analysis/Prob004_vector2.md) | GENERATED_UNVERIFIED | 通过 | NOT_RUN | NOT_RUN | 0 | 1 |
| [Prob005_notgate](../analysis/Prob005_notgate.md) | GENERATED_UNVERIFIED | 通过 | NOT_RUN | NOT_RUN | 0 | 1 |
| [Prob006_vectorr](../analysis/Prob006_vectorr.md) | GENERATED_UNVERIFIED | 通过 | NOT_RUN | NOT_RUN | 0 | 1 |
| [Prob007_wire](../analysis/Prob007_wire.md) | GENERATED_UNVERIFIED | 通过 | NOT_RUN | NOT_RUN | 0 | 1 |
| [Prob008_m2014_q4h](../analysis/Prob008_m2014_q4h.md) | GENERATED_UNVERIFIED | 通过 | NOT_RUN | NOT_RUN | 0 | 1 |
| [Prob009_popcount3](../analysis/Prob009_popcount3.md) | GENERATED_UNVERIFIED | 通过 | NOT_RUN | NOT_RUN | 0 | 1 |
| [Prob010_mt2015_q4a](../analysis/Prob010_mt2015_q4a.md) | INFRA_PAUSED | 通过 | NOT_RUN | NOT_RUN | 0 | 3 |
| [Prob011_norgate](../analysis/Prob011_norgate.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob012_xnorgate](../analysis/Prob012_xnorgate.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob013_m2014_q4e](../analysis/Prob013_m2014_q4e.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob014_andgate](../analysis/Prob014_andgate.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob015_vector1](../analysis/Prob015_vector1.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob016_m2014_q4j](../analysis/Prob016_m2014_q4j.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob017_mux2to1v](../analysis/Prob017_mux2to1v.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob018_mux256to1](../analysis/Prob018_mux256to1.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob019_m2014_q4f](../analysis/Prob019_m2014_q4f.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob020_mt2015_eq2](../analysis/Prob020_mt2015_eq2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob021_mux256to1v](../analysis/Prob021_mux256to1v.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob022_mux2to1](../analysis/Prob022_mux2to1.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob023_vector100r](../analysis/Prob023_vector100r.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob024_hadd](../analysis/Prob024_hadd.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob025_reduction](../analysis/Prob025_reduction.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob026_alwaysblock1](../analysis/Prob026_alwaysblock1.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob027_fadd](../analysis/Prob027_fadd.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob028_m2014_q4a](../analysis/Prob028_m2014_q4a.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob029_m2014_q4g](../analysis/Prob029_m2014_q4g.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob030_popcount255](../analysis/Prob030_popcount255.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob031_dff](../analysis/Prob031_dff.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob032_vector0](../analysis/Prob032_vector0.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob033_ece241_2014_q1c](../analysis/Prob033_ece241_2014_q1c.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob034_dff8](../analysis/Prob034_dff8.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob035_count1to10](../analysis/Prob035_count1to10.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob036_ringer](../analysis/Prob036_ringer.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob037_review2015_count1k](../analysis/Prob037_review2015_count1k.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob038_count15](../analysis/Prob038_count15.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob039_always_if](../analysis/Prob039_always_if.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob040_count10](../analysis/Prob040_count10.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob041_dff8r](../analysis/Prob041_dff8r.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob042_vector4](../analysis/Prob042_vector4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob043_vector5](../analysis/Prob043_vector5.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob044_vectorgates](../analysis/Prob044_vectorgates.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob045_edgedetect2](../analysis/Prob045_edgedetect2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob046_dff8p](../analysis/Prob046_dff8p.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob047_dff8ar](../analysis/Prob047_dff8ar.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob048_m2014_q4c](../analysis/Prob048_m2014_q4c.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob049_m2014_q4b](../analysis/Prob049_m2014_q4b.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob050_kmap1](../analysis/Prob050_kmap1.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob051_gates4](../analysis/Prob051_gates4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob052_gates100](../analysis/Prob052_gates100.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob053_m2014_q4d](../analysis/Prob053_m2014_q4d.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob054_edgedetect](../analysis/Prob054_edgedetect.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob055_conditional](../analysis/Prob055_conditional.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob056_ece241_2013_q7](../analysis/Prob056_ece241_2013_q7.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob057_kmap2](../analysis/Prob057_kmap2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob058_alwaysblock2](../analysis/Prob058_alwaysblock2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob059_wire4](../analysis/Prob059_wire4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob060_m2014_q4k](../analysis/Prob060_m2014_q4k.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob061_2014_q4a](../analysis/Prob061_2014_q4a.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob062_bugs_mux2](../analysis/Prob062_bugs_mux2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob063_review2015_shiftcount](../analysis/Prob063_review2015_shiftcount.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob064_vector3](../analysis/Prob064_vector3.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob065_7420](../analysis/Prob065_7420.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob066_edgecapture](../analysis/Prob066_edgecapture.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob067_countslow](../analysis/Prob067_countslow.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob068_countbcd](../analysis/Prob068_countbcd.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob069_truthtable1](../analysis/Prob069_truthtable1.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob070_ece241_2013_q2](../analysis/Prob070_ece241_2013_q2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob071_always_casez](../analysis/Prob071_always_casez.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob072_thermostat](../analysis/Prob072_thermostat.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob073_dff16e](../analysis/Prob073_dff16e.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob074_ece241_2014_q4](../analysis/Prob074_ece241_2014_q4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob075_counter_2bc](../analysis/Prob075_counter_2bc.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob076_always_case](../analysis/Prob076_always_case.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob077_wire_decl](../analysis/Prob077_wire_decl.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob078_dualedge](../analysis/Prob078_dualedge.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob079_fsm3onehot](../analysis/Prob079_fsm3onehot.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob080_timer](../analysis/Prob080_timer.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob081_7458](../analysis/Prob081_7458.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob082_lfsr32](../analysis/Prob082_lfsr32.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob083_mt2015_q4b](../analysis/Prob083_mt2015_q4b.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob084_ece241_2013_q12](../analysis/Prob084_ece241_2013_q12.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob085_shift4](../analysis/Prob085_shift4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob086_lfsr5](../analysis/Prob086_lfsr5.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob087_gates](../analysis/Prob087_gates.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob088_ece241_2014_q5b](../analysis/Prob088_ece241_2014_q5b.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob089_ece241_2014_q5a](../analysis/Prob089_ece241_2014_q5a.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob090_circuit1](../analysis/Prob090_circuit1.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob091_2012_q2b](../analysis/Prob091_2012_q2b.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob092_gatesv100](../analysis/Prob092_gatesv100.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob093_ece241_2014_q3](../analysis/Prob093_ece241_2014_q3.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob094_gatesv](../analysis/Prob094_gatesv.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob095_review2015_fsmshift](../analysis/Prob095_review2015_fsmshift.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob096_review2015_fsmseq](../analysis/Prob096_review2015_fsmseq.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob097_mux9to1v](../analysis/Prob097_mux9to1v.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob098_circuit7](../analysis/Prob098_circuit7.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob099_m2014_q6c](../analysis/Prob099_m2014_q6c.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob100_fsm3comb](../analysis/Prob100_fsm3comb.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob101_circuit4](../analysis/Prob101_circuit4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob102_circuit3](../analysis/Prob102_circuit3.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob103_circuit2](../analysis/Prob103_circuit2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob104_mt2015_muxdff](../analysis/Prob104_mt2015_muxdff.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob105_rotate100](../analysis/Prob105_rotate100.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob106_always_nolatches](../analysis/Prob106_always_nolatches.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob107_fsm1s](../analysis/Prob107_fsm1s.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob108_rule90](../analysis/Prob108_rule90.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob109_fsm1](../analysis/Prob109_fsm1.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob110_fsm2](../analysis/Prob110_fsm2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob111_fsm2s](../analysis/Prob111_fsm2s.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob112_always_case2](../analysis/Prob112_always_case2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob113_2012_q1g](../analysis/Prob113_2012_q1g.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob114_bugs_case](../analysis/Prob114_bugs_case.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob115_shift18](../analysis/Prob115_shift18.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob116_m2014_q3](../analysis/Prob116_m2014_q3.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob117_circuit9](../analysis/Prob117_circuit9.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob118_history_shift](../analysis/Prob118_history_shift.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob119_fsm3](../analysis/Prob119_fsm3.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob120_fsm3s](../analysis/Prob120_fsm3s.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob121_2014_q3bfsm](../analysis/Prob121_2014_q3bfsm.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob122_kmap4](../analysis/Prob122_kmap4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob123_bugs_addsubz](../analysis/Prob123_bugs_addsubz.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob124_rule110](../analysis/Prob124_rule110.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob125_kmap3](../analysis/Prob125_kmap3.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob126_circuit6](../analysis/Prob126_circuit6.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob127_lemmings1](../analysis/Prob127_lemmings1.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob128_fsm_ps2](../analysis/Prob128_fsm_ps2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob129_ece241_2013_q8](../analysis/Prob129_ece241_2013_q8.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob130_circuit5](../analysis/Prob130_circuit5.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob131_mt2015_q4](../analysis/Prob131_mt2015_q4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob132_always_if2](../analysis/Prob132_always_if2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob133_2014_q3fsm](../analysis/Prob133_2014_q3fsm.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob134_2014_q3c](../analysis/Prob134_2014_q3c.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob135_m2014_q6b](../analysis/Prob135_m2014_q6b.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob136_m2014_q6](../analysis/Prob136_m2014_q6.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob137_fsm_serial](../analysis/Prob137_fsm_serial.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob138_2012_q2fsm](../analysis/Prob138_2012_q2fsm.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob139_2013_q2bfsm](../analysis/Prob139_2013_q2bfsm.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob140_fsm_hdlc](../analysis/Prob140_fsm_hdlc.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob141_count_clock](../analysis/Prob141_count_clock.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob142_lemmings2](../analysis/Prob142_lemmings2.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob143_fsm_onehot](../analysis/Prob143_fsm_onehot.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob144_conwaylife](../analysis/Prob144_conwaylife.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob145_circuit8](../analysis/Prob145_circuit8.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob146_fsm_serialdata](../analysis/Prob146_fsm_serialdata.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob147_circuit10](../analysis/Prob147_circuit10.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob148_2013_q2afsm](../analysis/Prob148_2013_q2afsm.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob149_ece241_2013_q4](../analysis/Prob149_ece241_2013_q4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob150_review2015_fsmonehot](../analysis/Prob150_review2015_fsmonehot.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob151_review2015_fsm](../analysis/Prob151_review2015_fsm.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob152_lemmings3](../analysis/Prob152_lemmings3.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob153_gshare](../analysis/Prob153_gshare.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob154_fsm_ps2data](../analysis/Prob154_fsm_ps2data.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob155_lemmings4](../analysis/Prob155_lemmings4.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |
| [Prob156_review2015_fancytimer](../analysis/Prob156_review2015_fancytimer.md) | NOT_RUN | 通过 | NOT_RUN | NOT_RUN | 0 | 0 |

## 新评测版本与已知限制

RTL 使用 p10-settled-rtl-1 稳定采样，最终成功还必须通过 p10-netlist-1 网表验收。Prob078 的历史正确实现通过 447 次检查；历史错误 PASS 实现在新预检中被 216 次失配拒绝。旧批次分数不修改，不能直接将跨评测器通过率变化解释为模型提升。仿真每次上限为本批 model.patch.yml 中冻结的值。

Prob031/Prob062 使用用户批准且公开给两组模型的接口勘误；原题面保留。Prob093/Prob149 已知题面与参考冲突：保留其实际执行结果，同时在下列预声明排除口径中移除，不能称其参考匹配率为规格正确率。其余参考也未经形式证明。Agent 使用额外反馈、技能和修复预算，结果衡量整套流程效果，不是等资源下框架净贡献。

```json
{
  "label": "Predeclared known-conflict exclusion, not proof that all remaining references are correct.",
  "selected": 154,
  "compared": 0,
  "baseline_pass": 0,
  "agent_pass": 0
}
```

每题 analysis 文档包含完整请求、接口实际返回 reasoning、输出、工具参数及 Host 轨迹；对应 revision-*.diff 记录接受修改相对实际父版本的变化。
