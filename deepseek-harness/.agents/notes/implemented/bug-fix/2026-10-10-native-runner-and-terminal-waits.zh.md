# Agent Note: Native runner 依赖与终态感知测试等待

Status: implemented

[English](2026-10-10-native-runner-and-terminal-waits.md) | 中文

## Problem

Windows source runner 的重复启动通过环境构造导入父进程的输出收集和 Host 服务，而子进程仅需目标选择与可执行路径查询。另有 Loader 测试在实际命令已发布失败后继续轮询预期成功返回值；七个 fixture 的测试还可能用后续 fixture 覆盖首目标 run 身份。有界事件前缀可能省略清理观察，但独立的最终范围事实仍然存在。

## Decision

私有 [runner-target 模块](../../../../packages/subprocess/subprocess-local/src/runner-target.ts) 承接原有选择器、argv 解析和 Windows 可执行路径查询函数体。[runner-launch](../../../../packages/subprocess/subprocess-local/src/runner-launch.ts) 为父调用者重导出同名入口，子入口和核心直接导入纯模块。source、built、packaged 启动选择、环境脱敏、IPC、Job 所有权、目标参数和 deadline 保持原合同。这改变初始化依赖图，不改变隔离模型。

[repair Loader 测试](../../../../rtl-tools/tests/repair-loader.spec.ts) 在触发精确命令前订阅，观察首次真实终态后检查原预期 exit。[development Loader 测试](../../../../rtl-tools/tests/phase1-loader.spec.ts) 绑定首个 counter fixture 及其 run，后续 fixture 结果不能替换该目标。已有就绪等待仍结算正在进行的读取、拆除监听并保持原 deadline。生产失败的持久化发布及七 fixture 生产循环保持原样。

[Scope](../../../../rtl-tools/tests/test-operation-scope.ts) 在最终审计中新增四个固定清理时间戳。它们独立于原 128 项事件前缀上限，使用同一 worker 时钟，描述真实的删除前发布位置。它们不表示已经删除，也不补写历史省略事件。直接退出、范围证明、writer 结算和业务结果继续按[连续性合同](../testing/2026-10-09-p3-g1-continuity.zh.md)分别记录。

[Target 观察器](../../../../rtl-tools/tests/helpers/g1-target-witness.ts) 可选记录每条流首次接收的非空输出，不消费输出。`G1_NATIVE_LIFECYCLE_TRACE=1` 启用这项有界诊断扩展，正式验证会与[操作间计时开关](../testing/2026-10-10-p09-interstep-timing.zh.md)一起清除。原 handle、push 参数及返回值保持，观察故障独立计数。worker 接收不能证明 OS runner 启动、目标开始或生产输出的时间，不同进程时钟不相减。

三种既有执行类别的固定派发、成功终结与拒绝计数独立于原 512 项事件上限。发布这些计数不恢复省略的时间事件。只有不存在容量省略和接收观察错误时，保留的观察序列才记为完整；直接结果计数不替代独立范围证明。

## Alternatives considered

**扩大预算、缓存成功版本或隔离 Native 核心工作。** 这会改变验收工作或时间合同。Native 校准、子树取消和原 15 步工作量继续在当前候选下验证。

**把失败发布提前到持久化写入之前，或任意失败就停止 fixture 套件。** 这会削弱持久化或改变套件中的故意负向 fixture。测试消费已有的终态事实。

**扩大事件存储或另开 writer。** 这会增加无界或相互竞争的证据工作。固定最终时间戳补充原有界前缀和受管范围快照。

## Consequences

缩小子进程依赖图保持已有公开入口，但不保证每个宿主都达到某个延迟阈值：一次导入对照的 CPU 消耗下降，墙钟耗时却增加；当前业务测量与历史失败继续分别记录。终态感知等待更早暴露上游失败，不把校准失败变成成功。快照完成不证明事件序列完整，也不证明业务 PASS。

## Verification

[runner 兼容测试](../../../../packages/subprocess/subprocess-local/tests/spawn-runner.spec.ts) 验证新旧选择器和解析入口，已有 Windows 路径查询及协议测试保留原父入口。[Scope 测试](../../../../rtl-tools/tests/test-operation-scope.spec.ts) 覆盖证据溢出后的已证明与未证明范围。[Target 测试](../../../../rtl-tools/tests/g1-reliability.spec.ts) 覆盖观察关闭、开启、原 handle/输出身份与观察故障隔离。真实 Loader 校准失败测试保留 `CALIBRATION_FAILED`、exit one 和零模型准备。这些检查与当前 Native、安全、静态及完整回归证据配套，不授权 Provider 派发，也不证明 Skill 效果。
