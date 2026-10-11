# Agent Note: 新版 RTL Agent 的 deadline 事实与可选 Skill01

Status: implemented

[English](2026-10-08-p3-deadline-skill-migration.md) | 中文

## Problem

阶段或总预算到期终止受管命令时，RTL 验证需要一致的超时事实。新版 Agent 还需要接入受证据约束的 Skill01，并保留 Knowledge 或 Skill01 关闭时的行为、恢复策略与净表验收。

## Decision

[进程执行](../../../../rtl-tools/src/process.ts) 识别明确类型的命令、阶段与总预算 deadline 原因。已知 deadline 设置超时事实，无关的调用者取消不会被推断为超时。退出状态与上游取消保持独立，成功返回需要受管范围证明。验证保留原 timer 边界和预算。[证据访问](../../../../rtl-tools/src/phase1/evidence-access.ts) 串行协调同一次运行的元数据扫描和 JSON 发布，保留原始文件系统失败，并在关闭前等待活动访问结算。

[Skill01](../../../../rtl-tools/src/phase1/skill01.ts) 是独立 draft 资产，由 P10 默认关闭的设置控制。适用性要求绑定当前源码的功能证据及明确公开边沿规则。上下文构建器保留现有 Knowledge 顺序与关闭时的请求字节。完整流程自身最多消耗 512 tokens，受原 Skills 合计 768-token 上限约束；Knowledge 保留独立上限。容量不足时整条移除流程并记录原因。模型提交的摘要由模型原样提供，摘要被观察到与实验严格验收分别判定。

Windows 终止通道的 EPIPE 是保留的诊断，不能替代 Job 范围证明。原 grace 升级保持有效，异常关闭会拒绝证明。私有 runner 仅在协议和原生所有权结算后退出。[Knowledge 决策](2026-10-08-updated-agent-knowledge-baseline.zh.md) 继续独立约束检索。

## Alternatives considered

扩大 timeout 会改变预算，却不能解决两个 deadline 事实的差异。整文件恢复旧 Agent 会丢失新版恢复、净表和审计变更。Host 代写摘要会掩盖模型不遵守要求的问题。历史测试通过不能验证当前源码。

## Consequences

已知的外层 deadline 取消可以被观察为超时，调用者取消与退出码仍分别记录。Skill01 保持可选，不能授权修复或证明 RTL 正确。每次迁移都需要新的源码和测试身份。本地测试不能证明真实 Provider 就绪、因果收益或应当采用，也不会重置共享请求额度。

## Verification

定向用例覆盖 deadline 来源、取消、缺失范围证明、同运行证据访问、Skill 适用性和整条移除。Windows 协议与 Native 用例区分直接进程结果与受管范围证明。逐编辑严格摘要审计与一次新的完整 G1 是独立验收要求。历史失败收据保持不可改写。
