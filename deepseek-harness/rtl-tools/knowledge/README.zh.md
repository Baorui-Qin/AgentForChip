---
description: "根据已解析的 Vivado 2026.1 诊断检索有证据支持的修复检查建议。"
kind: package-library
---

# Diagnostic Knowledge V1.1

[English](README.md) | 中文

## Summary

本参考页说明可选的 Vivado 2026.1 诊断知识库。Static 与 experience 仅保留分类边界，没有运行时 loader 或填充资产。

## Table of Contents

- [Use the module](#use-the-module)
- [Understand the implementation](#understand-the-implementation)
- [Known limitations](#known-limitations)
- [Further exploration](#further-exploration)
- [Dev Note](#dev-note)

## Use the module

P10 通过 `knowledgeFile`、`knowledgeBundleHash`、`knowledgeEvidenceRoot`、`knowledgeTopK` 和 `knowledgeMaxTokens` 显式启用。[Context builder](../src/phase1/p09-context.ts) 添加 `diagnostic_knowledge`，保留原 System Prompt 和 Skill selector。独立 token 预算或 context window 不足时整条移除知识，不单独删除 limitations。关闭 Knowledge 时，B0 模型文本不变；启用但无命中时也不增加模型文本。

## Understand the implementation

[Schema 与校验器](../src/knowledge/knowledge-schema.ts) 要求机器可读的症状、候选原因、检查步骤、修复建议、局限、证据引用和验证状态。候选原因不代表已证实的根因。未知诊断与不支持的工具版本没有兜底匹配。证据不足的条目保持 draft。

[Loader](../src/knowledge/knowledge-loader.ts) 在返回 bundle 前，校验所有条目、重复 ID 和 ID/version、bundle manifest、内容身份、引用路径及证据哈希。无效条目以 `INVALID_KNOWLEDGE_ENTRY` 阻止加载。条目哈希是排除自身 content hash 后的规范 JSON 的 SHA-256；对象键按代码单元排序，数组保留顺序。Bundle 哈希排除自身摘要，并按路径排序 manifest 引用。仅 validated 条目进入检索。

[特征层](../src/knowledge/diagnostic-features.ts) 仅投影已有 parser receipt。[检索](../src/knowledge/knowledge-retrieval.ts) 要求工具、版本、stage、diagnostic kind 和必需特征匹配。声明的 message ID 和必需的 `dut_attributed` 特征必须属于同一条诊断。排序依次考虑匹配的 kind、message ID、必需特征和可选特征，最后用 knowledge ID 稳定排序。Top-K 明确限制为 1–3，不使用 embedding、模型排序或特定题目的答案。

`diagnostic-v1.1` bundle 包含 `diagnostic.multiple_procedural_driver`，用于展开阶段归属于 DUT 的 `VRFC 10-3818`。特征层仅对该 message ID 且来源为 DUT 的诊断，将 parser 的 `multiple_drivers` kind 投影为 bundle 的 `multiple_procedural_driver` kind，检索仍要求 DUT 归属。[修复策略](../src/phase1/repair-policy.ts) 独立允许或阻止编辑；Knowledge 不授予执行权限。知识建议保留初始化与复位语义，绝不要求无条件删除 `initial` 块。Loader 同时接受冻结的 `diagnostic-v1` manifest，历史 bundle 保留原哈希。

## Known limitations

既有 `agent_request` 事件保留准确请求及 Knowledge 审计。任务结果区分检索、请求构建与实际派发，记录 bundle hash、ID、版本、原因和本地实测 token 增量。本地 tokenizer 计数仍保留既有的云端等价性限制。诊断不声称精确失败周期、采样时刻的 expected/actual 配对或已证实根因。

## Further exploration

独立的 R0 回归与 R1 历史候选修复实验见 [P2 制品](../../../AMD/phase2-tool-skill/p2-knowledge-v1/README.md)。R1 修复结果与新生成的 VerilogEval 通过率分开统计。

## Dev Note

详见 [baseline 与 Knowledge 部署决策](../../.agents/notes/implemented/architecture/2026-10-08-updated-agent-knowledge-baseline.zh.md)。
