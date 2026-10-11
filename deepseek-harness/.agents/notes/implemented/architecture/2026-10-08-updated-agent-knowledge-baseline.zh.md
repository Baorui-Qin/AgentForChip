# Agent Note: 更新版 RTL Agent 的 Knowledge 接入

Status: implemented

[English](2026-10-08-updated-agent-knowledge-baseline.md) | 中文

## Problem

RTL Agent 需要绑定证据的诊断指导和可复现的 Knowledge 关闭对照，同时保留当前的生成恢复、修复控制和网表验收行为。

## Decision

[Knowledge loader](../../../../rtl-tools/src/knowledge/knowledge-loader.ts) 校验 bundle、条目和源证据 hash 后，[P10](../../../../rtl-tools/src/phase1/p10-model.ts) 才接受显式 Knowledge 配置。三个位置字段都为空时关闭 Knowledge；配置不完整时在模型准备之前拒绝。诊断 bundle 保留 validated 和 draft 身份。当前 DUT 的 `multiple_drivers` 诊断只有在消息为 `VRFC 10-3818` 时才投影为 bundle 已有的 `multiple_procedural_driver` 名称；parser、来源归属和修复权限保持独立。

[上下文构建器](../../../../rtl-tools/src/phase1/p09-context.ts) 保留关闭时的模型文本和 System Prompt。启用检索要求工具版本、阶段、诊断种类、消息和所需特征匹配。独立 token 上限、总窗口压力或上下文压缩会移除完整指导条目。审计区分 eligible、retrieved、injected 和 dispatched 观察。Token 计数沿用完整请求计数器，其与云端等价性仍未确认。

部署使用现有 `dsh` profile 和独立制品身份。B0 与 K1 采用相同的更新源码、固定公开题集、模型、评估器、原 validated Skill 和预算，只有显式 Knowledge 选择不同。历史测量保持历史身份。本地准备不授予模型派发权限，也不重新获得共享请求额度。

## Alternatives considered

用旧源码替换更新后的 Agent 会丢失生成与验收变化。仅复制资产而不恢复上下文和入口接入，指导仍不可用。修改 parser 名称或放宽证据校验会把修复决策与 Knowledge bundle 耦合。单独建立应用启动器会绕过维护中的 profile 入口。

## Consequences

Knowledge 保持显式启用，不能证明候选正确。准备好的 baseline 在其授权运行提供绑定收据之前，模型通过率不可用。即使诊断资产 hash 不变，新 Agent 行为仍需要新的源码身份。复用证据必须注明来源，不能当作新的 EDA 执行。

## Verification

测试覆盖 bundle 和证据拒绝、精确诊断投影、确定性检索、关闭时的 prompt 身份、完整条目移除、配置拒绝以及 Loader 的请求与审计链路。相关生成恢复和修复控制回归保留新版 Agent 行为。本地部署检查在归一化输出位置后比较 B0/K1 有效参数；真实 Provider 评估属于单独执行。
