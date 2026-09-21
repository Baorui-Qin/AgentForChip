# Agent Note: 无模型 VerilogEval 预检

Status: implemented

[English](2026-09-18-p10-evaluator-preflight.md) | 中文

## 问题

未修改的评测器无法编译时，候选无法获得有意义的 benchmark 成绩。Reference 校准不能成为候选 PASS、消耗模型预算或悄悄修复 benchmark 资产。公开选题及后续扩展也需要在观察结果前冻结身份。

## 决策

[P10 入口](../../../../rtl-tools/src/phase1/p10-preflight.ts) 是不挂载 LLM 的 Host 专用 dsh profile。它从固定且干净的数据集中冻结按公开条件选取的十题和按哈希排序的四十题顺序。永久 claim、源码/配置哈希、原始字节资产哈希和独立 manifest 收据绑定每次运行。Git 明确声明的 CRLF 检出仅在内存中归一化以比较 Git blob；运行时资产保持原始字节。

[VerificationRunner](../../../../rtl-tools/src/phase1/verification.ts) 提供独立数据集预检方法，仅运行前三阶段、不运行 synthesis。纯公开端口转接模块委托未修改的 reference。完整的正检查数和零 mismatch 仅证明评测器可用。持久化记录保持 final_verified 为 false；普通候选仍强制要求既有四阶段。

每个选中任务均产生有归因的评测器结果或 INCONCLUSIVE，不猜测不支持的接口。模型路线保持 NOT_RUN，逐路线 usage 保持 null，空分母比例保持 null。此入口从不授权四十题运行。[P10 参考文档](../../../../rtl-tools/phase1/p10/README.md) 管理配置及已实现范围限制。

## 考虑过的替代方案

**修补 benchmark 测试台或更换阻塞题目。** 拒绝，因为这会在观察结果后改变冻结评测器或样本。兼容性调查需要另行明确授权的实验。

**用 reference 综合作为可用性门槛。** 拒绝，因为可用性关注 compile/elaborate/simulation 评测器。候选综合仍为强制要求，校准证据不能绕过它。

**校准前实现并派发完整模型 campaign。** 拒绝，因为可评测题数为零时必须停止且不消耗模型预算。无模型 profile 使该边界可审计，而非依赖提示词指令。

## 后果

共享 runner 修改范围很小；核心 agent loop、提供方传输和默认人工审批模式均不变。开发执行需要明确完整访问授权，并记录 full_os_isolation_verified=false。子进程清理、按凭据名称过滤和源码哈希不构成 OS 隔离。

可评测题数为零时交付 NO-GO，而非百分之零的模型成绩。共享候选生成/修复 campaign 及其 P10 派发总账不属于此已实现切片。Harness 修正需要封存失败版本并冻结完整新运行，不能替换旧 campaign 中的部分观察结果。
