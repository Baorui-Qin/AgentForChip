# RT-01 修复与验收报告

日期：2026-09-27。代码位置：`D:/deepseek-harness`。本次仅处理 RT-01，不修改 RT-02、模型配置、修复额度或历史成绩。

## 结论

交付 A「已知入口封堵」和交付 B「限定校准范围内的强制网表验收」均已实现。原始攻击在候选入口被拒绝；只读复用其历史错误网表时，独立功能检查得到 2 次检查、1 次失配，不再允许新版成功。

这不是全题库 RTL/网表等价证明。目前启用三个精确题面：Prob007_wire、Prob005_notgate、Prob041_dff8r；初始化设计只有独立校准，不代表其他时序题已获得验收资格。其余题达到四阶段 PASS 后以 `NETLIST_NOT_CALIBRATED` 终止，不能静默回退旧标准或从任务清单删除。

## 实现范围

- 生成、生成纠正、edit_dut 和验证入口共用注释 token 检查。拒绝综合分流及保守列入禁用集合的 case 假设指令，保留原字节、哈希和位置；不删除指令后替模型修代码。
- 拒绝编辑不增加接受的 semantic repair，也不启动 EDA；沿用现有工具/请求上限。普通注释、同名标识符及合法 FPGA 初始化不因本次修改整体禁用。
- `p10-netlist-1` 独立收据绑定原始四阶段记录及产物清单、DUT、综合网表、oracle、工具路径、校准库哈希、命令、日志、检查数、失配数和延迟。旧四阶段 schema 保持不变。
- 检查器只编译已生成的网表及 Host oracle，显式加载 glbl/UNISIM。先断言 GSR/GTS 已释放，再在 101 ns 后按固定时序采样；未知输出计为失配。
- `netlistMs=120000` 是独立的网表阶段总上限。命令超时、日志限制、产物配额及取消沿用受管子进程机制；不增加模型调用或修复轮数。
- Baseline PASS、Agent VERIFIED、recovered_by_agent、final.sv、汇总和独立审计共用新验收条件。网表失败单独终止，不冒称模型已获得并耗尽网表修复机会。
- 新版缺失或不匹配的成功证据不能发布成绩；历史结果显式标记 `legacy-four-stage-unvalidated`，不补造收据或改写旧分数。

## 真实 Vivado 验证

最终检查使用一个 EDA worker、零模型调用，并复用已封存的综合产物。四个正例先在独立校准批次实际完成综合，最终批次再对当前检查器执行网表仿真与独立审计。

| 案例 | 检查数 | 失配数 | 新验收 |
|---|---:|---:|---|
| 原始 RT-01 错误网表 | 2 | 1 | NETLIST_MISMATCH |
| 正常导线 | 2 | 0 | PASS |
| 正常非门 | 2 | 0 | PASS |
| 同步复位 8 位寄存器 | 1024 | 0 | PASS |
| 合法初始化并翻转的寄存器 | 3 | 0 | PASS |

四个正例各有一个 Host-only 的错误预期负控制，均得到 NETLIST_MISMATCH。它们验证检查器能发现错误预期，不是四个新的模型错误 DUT；实际错误 DUT 证据是原始 RT-01 网表。

最终原始结果：[validation-results.json](D:/AMD/redteam-20260927/acceptance-release-v2/validation-results.json)。源码与配置执行期封存：[validation-freeze.json](D:/AMD/redteam-20260927/acceptance-release-v2/validation-freeze.json)。每个结果行链接到独立收据，收据包含原始日志路径及哈希。

## 综合注释探针

真实 Vivado 2025.2 探针覆盖 16 种形式。其中 12 种实际改变综合语义，最终策略全部拒绝；包括最初遗漏的裸 `translate_off/on` 与 `xilinx` 前缀。行/块注释、换行和制表空白均有实测。全大写形式在该工具中未生效，策略仍保守拒绝。普通说明文字、裸 off/on 和此次测试的 synplify 前缀未改变语义，也没有误拒。

证据：[meta-results.json](D:/AMD/redteam-20260927/meta-probe-v2/meta-results.json)。这份有限探针不代表穷举了所有 Verilog 属性、工具指令或仿真/综合差异。

## 兼容性与门禁

只读扫描旧批次的 301 份 initial/final 候选，新综合指令策略拒绝 0 份。该扫描只衡量新增策略兼容性，不重新评价功能正确性，也不更改历史分数。证据：[historical-policy-scan-v2.json](D:/AMD/redteam-20260927/historical-policy-scan-v2.json)。

RTL 工具 TypeScript 检查、受影响文件的配置内 lint、PowerShell 准备脚本语法检查及 git diff 空白检查通过。六组最终聚焦回归 225/225 通过，报表调度单测 10/10 通过。聚焦回归覆盖候选策略、P10 编排、网表执行/审计、P09 自动入口、四阶段验证器及修复 V2。详见 [rt01-release-tests.log](D:/AMD/redteam-20260927/rt01-release-tests.log)。

文档快速检查 16/16 通过；本次中英文 README 和 Agent Note 已配对。完整 doc-sync 为 30 通过、4 失败：doc-typecheck、文档构建和类型等价检查出现内存/进程退出错误，另一个文档站点测试因 Windows 符号链接权限失败。全仓 lint 的前置构建也出现内存不足。这些门禁尚未全绿，不能把聚焦通过等同于全仓通过。日志：[doc-quick-pnpm.log](D:/AMD/redteam-20260927/doc-quick-pnpm.log)、[doc-sync.log](D:/AMD/redteam-20260927/doc-sync.log)、[lint.log](D:/AMD/redteam-20260927/lint.log)。

## 保留的失败证据

首次校准因测试夹具缺省 timescale 配置失败，已在新批次修正，原失败目录保留。首次综合注释探针综合阶段超出 120 秒，仍保留源码、日志和网表；随后以显式 240 秒综合上限在新目录完成探针。未把失败运行重写为成功，也未据此提高模型实验预算。

## 项目状态

RT-01 的已知攻击和新版假 PASS 通路已修复，支持范围有意受限。完整 156 题比较仍不可恢复为可信功能结论：RT-02 未修复，网表 oracle 尚未覆盖其余题，且全仓环境门禁仍有失败。本次没有运行新的全量模型实验、没有提交或覆盖既有工作树改动。
