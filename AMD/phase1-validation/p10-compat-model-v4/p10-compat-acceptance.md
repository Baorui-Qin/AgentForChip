# P10 兼容修复验收

## 实际结论

- 原 10 题及独立 Prob038 的声明前引用错误在真实 xvlog 中消失，11 题均完成正负例校准。
- 仅搬动声明后真实出现下一层 XSIM 43-4099；记录证据后采用默认 1ps/1ps，未覆盖 TB 显式时间单位。
- 正例均有唯一有效判据且 checks > 0；负例均先通过编译/展开，再产生 mismatches > 0。
- Baseline：10/10 四阶段通过；共享初始候选 Agent：10/10。修复收益只比较同一候选，不声称独立采样优势。
- 真正模型派发 12 次：公共初始 10，评分 Agent 增量 0，独立修复校准 2。不是仅做预检。
- count15 负例副本经真实 edit_dut 和 verify_rtl 修复，终态 VERIFIED，不计入模型成绩。
- 当前、已验证、最终导出源码 SHA 一致性已逐个审计。上游全部 468 份资产与历史 v8 的 483 个普通文件哈希保持不变。
- 审计问题：Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob005_notgate\eda\run-G8OWxb; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob035_count1to10\eda\run-DLBfpJ; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob045_edgedetect2\eda\run-yiSfpr; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob074_ece241_2014_q4\eda\run-RIqVjR; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob015_vector1\eda\run-EEpO9p; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob033_ece241_2014_q1c\eda\run-0YsDQO; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob004_vector2\eda\run-mSY2j5; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob020_mt2015_eq2\eda\run-w3kFa1; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob018_mux256to1\eda\run-l2DG8y; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\compare-Prob061_2014_q4a\eda\run-8fYnHv; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\repair-control-Prob038_count15\eda\run-ELPFgY; Unclean PASS: D:\AMD\phase1-validation\p10-compat-model-v4\repair-control-Prob038_count15\eda\run-crOrlA。

## 验收矩阵

| 条目 | 结果 | 证据 |
|---|---|---|
| C01-C04 | PASS | upstream hash audit; compatibility-manifest; derived diff/map; exact-hash rejection tests |
| C05-C08 | PASS | declaration-only probes; evaluator-policy; 11 positive/negative real runs |
| C09 | PASS | phase1-verification evidence tests: timeout/missing/duplicate/unknown/contradictory verdicts fail closed |
| C10-C11 | PASS | all 10 + sentinel retained; original and compatibility status separated |
| C12-C13 | PASS | real request/response records; one-shot baseline with no tools/skills/feedback |
| C14 | PASS for separate repair control | genuine failed DUT -> model edit -> new four-stage verification; excluded from scored gain |
| C15 | REVIEW_REQUIRED | evidence-index and source binding audit |
| C16 | 10-task audit FAIL; 40 NOT_RUN | expansion-40-readiness.json preserves original order; remaining 30 TB hashes unreviewed |

## 未完成与限制

本次已完成兼容修复、真实正负例校准、单题和完整十题模型对照。四十题尚未运行：当前经审查规则只覆盖十一份精确原始输入，剩余三十份需要新规则版本的审查与真实校准，且 Prob080 的公开接口静态解析不受支持；未换题，也未把这些任务记为模型失败。未验证完整 OS 隔离、官方隐藏评分或 Icarus 等价。当前模型协议对格式/传输错误直接停止，没有执行计划设想的一次格式恢复；该差异已写入冻结协议，不能与其他恢复策略的成绩混合。

开发期入口失败和模型 v3 的 provider retry 配置阻塞均独立保留，不拼入 v4 的成绩；v3 曾产生额外 1 次真实生成。所有正式本轮模型记录位于本目录。
