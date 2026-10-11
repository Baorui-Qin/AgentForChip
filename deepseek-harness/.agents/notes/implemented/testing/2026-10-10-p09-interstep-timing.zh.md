# Agent Note: P09 测试实例的步骤间计时

Status: implemented

[English](2026-10-10-p09-interstep-timing.md) | 中文

## Problem

原 60000 ms P09 工具预算用例在历史完整 G1 中于第 13 次工具调用和第 13 次本地模型响应后取消，而相关文件通过记录完成了全部 15 次。公开 workflow 事件可定位较长区间，但无法将其归因到源码绑定、证据读取、状态发布或其他 Host 工作。

## Decision

[采集器](../../../../rtl-tools/tests/helpers/interstep-timing.ts) 只观察一个调用者拥有的 workflow 实例上明确选择的值方法。[目标接入](../../../../rtl-tools/tests/p09-auto.spec.ts) 仅在 `G1_INTERSTEP_TRACE=1` 时为 `enforces the tool budget independently of accepted repairs` 启用采集。正式 runner 清除此开关。观察先于既有 Scope 代理安装；生产代码、原 fixture、断言、15 步上限、60000 ms 测试体及 10000 ms hook 保持不变。

包装器以原 receiver 和参数调用原方法一次，保留同步返回值和异常，并返回原 native Promise。它不接管 thenable，也不替换取消 signal。Promise 观察增加一个结算 reaction，并将 rejection 标为已处理，因此被观察的异步方法保持由调用者 await 或由 Scope 跟踪。记录的结束时刻是结算后的 observer reaction，而非底层完成的精确瞬间。

事件保存在内存中，上限为 4096 行和 128 个 pending span；精确序列化输出上限为 2 MiB。丢失事件、observer 异常和未结算工作分别记录。AsyncLocalStorage 只传递 span 与 operation 关联。Exclusive 耗时扣除直接子区间的并集；未观察的子调用及调度仍包含在其中，不对不同进程的时钟做减法。

既有 [Scope 清理](../../../../rtl-tools/tests/test-operation-scope.ts) 先结算操作、owner 和 Managed 范围。最后的 removal 回调恢复被观察实例，并在原 hook 预算内以独占创建方式写出 trace 和实际 worker context。捕获失败保留测试根目录。这扩展了[连续性 Note](2026-10-09-p3-g1-continuity.zh.md) 的捕获机制，不替代范围证明或失败保留。

## Alternatives considered

**包装生产代码或全局替换共享函数。** 这会影响无关调用者和测量环境。测试实例独占的包装器先提供粗粒度 span；自由 ESM 函数保持未观察状态。

**每个 span 写盘或扩大 deadline。** 前者增加测量区间内的工作，后者改变验收。采集器缓存有界事件，并在资源结算后于既有 hook 内统一写出。

## Consequences

维护者可将 Host 调用区间与 operation 轮次及公开计数关联，同时保留目标的执行决策。观察增加开销和 native Promise reaction，因此 trace 是诊断证据，不是零开销的性能证明。两次通过采样不能解决历史 timeout、确定其原因或证明优化有效。历史原始失败与当前观察分别保留。

## Verification

九项[设施自测](../../../../rtl-tools/tests/interstep-timing.spec.ts) 在 `timing-selftest-v3` 全部通过；`diagnostic-typecheck-v2` 通过。`latency-target-L1-v1` 的精确目标通过，其他 30 项被过滤；`latency-context-L1-v1` 的全部 31 项通过。两个目标 trace 各含 388 个事件、全部 15 次本地模型流与响应，以及工具步数 15、语义修复次数 0 的终态计数。它们均报告已关闭的 `OBSERVED` trace，pending span、丢失事件、observer 异常和输出遗漏均为零。

两个实际 context 收据均记录 Node v24.16.0、`forks` pool、单 worker、thread ID 0 及原测试体/hook 预算。文件上下文运行结算了 31 个 Scope 和 406 个 Managed 句柄，pending、unproven 和 removal-forbidden 条目均为零。两个执行收据均报告有效唤醒窗口和零获授权真实 Provider 派发。这些批次不构成新的完整 G1 或 Pilot/G2 结果。
