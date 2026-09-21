# P09 Skill Selector 失败记录分析

## 已确认的历史记录

- `D:\AMD\phase1-validation\p09-20260917-development\components.json` 保留一次失败：`T18/T20/T21/T22/T23: ledger is factual and skill selection is stable, bounded and lazy` 期望 `['a','m']`，实际为 `['a']`，断言位于当时 `p09-context.spec.ts:92`。该文件 SHA256 为 `07f0ab71ccb92cfb1f258a9d76673ab75c23a919d1b2a0a6b489939aeaa1e40e`。
- 后续 `context-final.json` 记录 18 项通过、0 项失败，SHA256 为 `088f602b4ce9aa23bca5e78ac27268bfa47d523ac25c58e7f2769aaab1f8a138`。这不抹除前面的失败，也不证明当时进行了哪项源码修改。
- 本轮保存的 `source-before/src/phase1/p09-context.ts` 与旧 `source-freeze.json` 中对应摘要一致：`5410c759533131b65c7a2e3b326c20231048da2f1f588df53df0b476e6a4c29e`。

## 可以解释的机制

当前 `selectSkills` 按标签匹配数降序、ID 稳定排序，最多返回两条；`buildContext` 随后对渲染后的 guidance 应用软预算。因此，“selector 可以选择两条”与“最终提示仍保留两条”是不同断言。旧失败来自最终上下文断言，单凭 `['a']` 不能认定排序器本身有错。

软预算裁剪可能解释该现象，但这是机制假设，不是已恢复的历史根因。旧源码目录未跟踪，现有记录没有失败时与修复后源码的完整成对快照，无法核实当时到底改了算法、计数视图还是测试预算。本报告不编造修改记录。

## 本轮处理与验证

保留旧失败、后续成功及本轮基线。当前定向测试验证稳定排序、最多两条、draft 排除、无效证据拒绝、非适用标签不命中以及 A/B 延迟加载；`tokens_before_pruning`、`selected_skills` 和 `omissions` 分别记录裁剪前计量与最终选择。真实 C 组的技能来源、适用性验证、冻结内容和模型应用记录另见 `skill-validation.md/json`，不拿 Mock 断言代替真实 EDA 证据。

历史修复差异恢复状态：`UNVERIFIABLE_FROM_RETAINED_EVIDENCE`。
