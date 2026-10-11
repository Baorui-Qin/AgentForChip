# Agent Note: Independent Native rejection cases within one deadline

Status: implemented

[English](2026-10-11-native-rejection-case-dependencies.md) | 中文

## 问题

Windows Native 拒绝测试在同一个5000ms正文内，先启动相对路径可执行文件，再串行检查四种独立失败输入。当前一次运行超时。独立诊断观察在4657ms完成，其中等待相对路径目标约2984ms。后一次观察不能确定前一次超时的准确位置，也不能证明操作系统根因。

## 决策

相对路径可执行文件仍先运行，必须exit17且取得受管范围证明。随后四个独立拒绝输入在同一正文中并行，最多四个场景。每项仍比较真实Node spawn错误与真实Windows Job结果，并要求waitForExit=true。Promise.allSettled等待所有断言，失败观察通过AggregateError报告。已登记的拒绝句柄在teardown中终止并结算，范围未证明时保留私有root。

## 考虑过的替代方案

**扩大或拆分截止时间。** 五个各五秒正文或更大timeout会改变原预算，故不采用。保留单正文及默认5000ms。

**预热相对路径可执行文件。** 这会把目标启动移到计时合同外并掩盖已观察成本，故不采用。

**重复原测试。** 另一次通过不能修复串行依赖，也不能解释已保留的超时，故不采用。

## 影响

测试最多并发四个拒绝Job，相对路径正例仍先执行。worker数量、生产Job所有权、100ms grace、错误expected与测试身份不变。所有结果与范围结论仍为必要条件。测试不再累加互不依赖的负例等待。原失败运行保留，仅新执行可以证明当前验收。此改动不解释Windows启动延迟，也不修改主机安全设置。
