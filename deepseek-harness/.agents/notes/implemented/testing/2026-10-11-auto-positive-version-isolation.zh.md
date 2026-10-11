# Agent Note: Exact version isolation for independent repair policy tests

Status: implemented

[English](2026-10-11-auto-positive-version-isolation.md) | 中文

## 问题

自动两轮修复正例的编译阶段触及原5000ms截止，终态为POLICY_BLOCKED。四次真实fake版本进程占4494ms，阶段总5021ms。测试正文原为60000ms，改正文不能修复共享阶段截止。收据不能证明操作系统延迟根因。

外来批准拒绝用例也在review前因初始编译超时终止：四版本查询占4059ms，阶段总5067ms。该失败运行没有模型请求或批准篡改，Native句柄均已结算并取得范围证明。这是策略测试中的另一项无关版本依赖，未观察到外来批准被接受。

AUTH不恢复参数用例在首个隔离模型调用前终止：实际0、原expected1，14句柄全部结算并已证明范围，最后exit1。原stage/argv副本缺失，准确阶段与耗时仍未知。仅这一AUTH参数隔离相同的独立版本依赖，并增加有界公开Target记录；其他两个参数的设施选择保持。

## 决策

仅自动修复精确正例、外来批准拒绝用例和AUTH不恢复参数启用已有ManagedVersionProbeFixture。它只匹配fake-verification的精确-version argv，返回独立常量版本；其他请求委托LocalSubprocess。setup默认值、业务断言、阶段和正文预算不变。设施句柄在既有Scope清理内关闭。合成版本观察不能证明Windows所有权。启用trace的验证区分逻辑版本与真实业务命令。

[生产RTL决策](../feature/2026-09-13-rtl-simulation-tool.zh.md)仍有效且不变；[独立拒绝场景决策](2026-10-11-native-rejection-case-dependencies.zh.md)保留其独立调度依据。两者均未被替代或归档。

## 考虑过的替代方案

**扩大截止时间。** 原阶段预算约束本次失败且属于验收条件，故不采用。

**Mock全部进程或版本。** 业务命令必须真实Native执行，无关版本测试必须保留自身覆盖，故不采用。

**无变化重跑完整批次。** 另一次通过不能改变已定位的依赖成本，故不采用。

## 影响

这三项用例隔离无关版本依赖，不再覆盖自身工作流内的Native版本启动时间。Doctor及版本契约测试仍单独必需。原来真实的编译、仿真、计数、取消与范围证明清理仍保持Native。验收必须依据实际相关回归与完整回归收据。生产策略和预算不变。
