# Agent Note: P10 修复可达性与机会漏斗审计

Status: implemented

[English](2026-09-20-p10-repair-reachability.md) | 中文

## Problem

上一轮四十题 campaign 可以证明 Agent 路线被调用，但大多数失败题没有完成“接受编辑并验证新 revision”的闭环。传输失败、输出截断和 EDA 故障也容易在汇总成绩中被误读为 DUT 修复失败。

## Decision

P10 保持各批次冻结的模型、Prompt、已验证 Skill、评测器和语义修复预算。采用有界基础设施恢复：零字节且可重试的传输故障最多使用相同 wire 重试两次，每个逻辑请求最多一次输出恢复，用户取消和活动时限不重试。半截文本和半截 tool call 永不执行。物理恢复派发与 semantic repair 分开记账。[修复 V2](../feature/2026-09-21-p10-repair-v2.zh.md) 定义新批次的仅行动恢复设置、增强反馈及版本选择。

`edit_dut` 被接受后，工具构造和 Host 动作校验使用同一个 pending-verification 状态，并且只允许 `verify_rtl`。仅当所有独立 ERROR 的证据完整、失败进程正常、可由模型修复且明确归属 DUT 时，Repair Policy 才允许 `DUT_UNKNOWN_BUT_OWNED`。归属未知以及工具、环境、reference 或 testbench 证据继续阻断。

每个接受的编辑都会建立 attempt 记录。有效 attempt 必须证明 Baseline 失败、live feedback 与父 revision 和源码 SHA 绑定、持久化的新 revision 源码 SHA 已变化、新 revision 的验证请求被接受，并且与新源码绑定的 Vivado 结果已持久化且记录哈希。Campaign 审计器独立复核证据链；无法证明计入的 attempt、共享初始候选或结果文件时，整个比较无效。

## Alternatives considered

**修改 Prompt 或加入 counterexample。** 拒绝，因为本轮需要把修复可达性和基础设施影响与模型能力变化隔离。

**重试所有失败请求。** 拒绝，因为重放部分输出、用户取消或活动超时会形成隐藏重采样及重复副作用。

**编辑后继续暴露所有工具。** 拒绝，因为模型可能在未验证 revision 上再次编辑、检索 Skill 或 finish。

## Consequences

固定十题 campaign 同时报告 Baseline 到 Agent 的通过变化，以及任务级和 attempt 级机会漏斗。OUTPUT_TRUNCATED、TIMEOUT、TRANSPORT、TOOL_ERROR 和 POLICY_BLOCKED 分别提供事件数、受影响任务数和互斥终态数。Campaign 专用派发上限允许基础设施恢复，但不改变三次语义修复预算。历史目录保持不可变，完整 OS 隔离仍未验证；波形观测反馈属于独立冻结的修复 V2 策略。
