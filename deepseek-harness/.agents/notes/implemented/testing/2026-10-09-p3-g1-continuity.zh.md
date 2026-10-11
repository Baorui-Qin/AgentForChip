# Agent Note: P3 测试身份与 Native fixture 连续性

Status: implemented

[English](2026-10-09-p3-g1-continuity.md) | 中文

## Problem

收集时生成的时间戳使一个 relay 身份在收集与执行之间变化。七 fixture Loader 测试在清理时丢失失败证据。Native 子树测试可能在目标尚未建立时耗尽仿真预算，又在终态之后等待缺失的 PID 文件。Agent 迁移还移除了包含 39 项旧覆盖的三个测试文件。

## Decision

Relay 边界使用静态 case ID，并在测试体内计算相对时间。首个七 fixture Loader 实例仅用既有受管 fixture 隔离精确映射的版本命令。七次业务验证保持串行和 Native，处于原测试体与阶段预算内。其他 Loader 实例保留默认 Native 路径。

Loader 捕获只发生在既有 Scope 已结算的清理回调中。捕获失败保留根目录和主异常。命令、fixture、调用、Managed 范围及重建观察将收据绑定到同一 Loader 实例。

仅 timeout/cancel 子树实例选择快速 simulation-hang fixture。真实子进程通过 IPC 报告就绪后才发布 PID 和收据。测试通过仿真 cwd 和实际句柄绑定运行，在验证启动前订阅终态，在终态竞争时重查就绪，并等待失败分支结算。fixture 启动时原仿真 deadline 已在计时。其他 hang 模式保留原初始化。

可等价恢复的旧用例使用当前公开 API，并保留原核心断言。缺失的生产能力和冲突的政策断言仍是明确缺口。候选集合通过不能替代全部 39 项旧契约的验收。控制器隔离的离线 fixture 通过声明依赖的 settings 包实际读取 YAML；它们不能授权真实启动或重置共享 authority。

## Alternatives considered

**扩大时间预算。** 这会改变验收并掩盖 fixture 成本。测试体、阶段和等待预算保持不变。

**归一化时间戳或忽略缺失身份。** 这会隐藏收集契约失败。静态 ID 支持无归一化的精确匹配。

**将旧生产实现复制到恢复测试。** 这只能验证旧能力，不能验证当前 Agent。能力缺失需要独立的生产决策。

## Consequences

取消和范围结算后的证据可用于定位最早非预期事件。版本隔离限于局部，Native 覆盖与逻辑 fixture 分别报告。真实子进程无法在原预算内就绪时，仍保留验收失败。候选计数包含新增设施用例，并重新计算。实质前置或旧政策冲突未关闭时，不启动完整 G1。Skill、Runtime、模型设置、G2 判据和原条件 SKIP 保持不变。

## Verification

设施契约覆盖捕获准入、取消结算、失败范围证明、捕获异常保留、终态竞争和读取分支结算。精确定向与相关文件运行保留原始日志及 JSON。独立收集比较 file、fullName 和 occurrence，并记录静态 relay 参数。Native Job 与协议门禁区别于 RTL 验收。控制器测试和真实 authority 只读检查记录零真实 Provider 调用及零新增真实预约。
