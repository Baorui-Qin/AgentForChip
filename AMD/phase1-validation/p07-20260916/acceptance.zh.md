# P07/P08 半自动开发联调验收

系统流程与模型修复效果分开验收。原始负例不改写；每份模型候选均需人工安全审批。

| Case | State | Outcome | API attempts | Export SHA256 |
| --- | --- | --- | --- | --- |
| functional (original) | TERMINAL | VERIFIED | 1 | 641364a1efd28f007cb4cf4678a679fb3e9030f7fda7e7ab3a77308bae6844c1 |
| syntax (original) | TERMINAL | UNCLASSIFIED_FAILURE | 0 | - |
| syntax (user_authorized_supplement) | TERMINAL | VERIFIED | 1 | 03b5e2b8c64a7280996fc25b57d5be9e6d26bc5f4761e25918a1ba795f6f55bd |
| synthesis-only (original) | TERMINAL | MODEL_CONNECTION | 1 | - |

Tests: 219 PASS / 0 FAIL / 4 SKIPPED; report test: 1 PASS; supplemental legacy test: 1 PASS. Typecheck, scoped lint: PASS; documentation: 16 PASS.

Real API requests: 3; real repaired designs: 2.

syntax 原实验在模型调用前被宿主策略阻塞，保留 UNCLASSIFIED_FAILURE。仅在用户另行授权后新增补充实验，修正同文件、同调用、当前顶层的已知后继错误规则；补充结果不替换原结果，也不是模型重抽样。

三份历史重解析为独立证据：functional 保留 18/20，Mock 测试独立使用 19/20；Prob038 为声明前引用和后继错误；synthesis-only 为缺失模块及对应汇总。原始结果和日志哈希已重新核对，未重写历史结果。重解析不属于新 EDA 或模型修复。

Prob038 原始测试台兼容性仍单列阻塞；未验收无人干预修复、完整 OS 隔离、自然生成任务或统计性能增益。正 WNS 只表示本次综合后指标，不代表实现后全面时序收敛。

[Machine-readable evidence, source/log hashes, counts, resources, timing, decisions and costs](acceptance.json).

[API configuration and connection-failure audit](api-failure-audit.zh.md).
