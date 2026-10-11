---
description: "Vivado 语言选择、诊断归属与版本化调用证据。"
kind: "package-reference"
---

# Vivado 语言与诊断

[English](README.md) | 中文

Phase 2 运行基线由 [dev.yaml](../configs/dev.yaml) 固定为 Vivado 2026.1；Phase 1 历史实验及 fixture 保留 2025.2 来源。新 snapshot、兼容套件与 evaluator identity 使用配置版本，后续 Static Knowledge 使用 `{"tool":"vivado","tool_version":"2026.1"}`。真实验证范围和未通过项见[迁移报告](../../../../../docs/vivado-2026.1/report.md)。

## 概述

Vivado 仿真与综合共享显式语言解析。宿主保留源文件角色和命令证据，不增加模型参数，也不修改评分资产。本层识别诊断归属，不推断根因或自动修复。

## 配置

有序源文件项支持字符串或 `{ path, language?, role? }`。语言为 `verilog` 或 `systemverilog`；角色为 `dut`、`reference` 或 `testbench`。可信任务级语言优先，其次为文件级语言，最后为扩展名（`.v` 或 `.sv`，不区分大小写）。任务与文件声明冲突、`.sv` 强制按 Verilog 处理、未知扩展名且未指定语言时，在工具启动前失败。综合默认角色为 DUT，拒绝其他角色。固定夹具和数据集注册器提供评分文件角色，不接受模型提交的清单。

[综合补丁](../../cordis.synthesis.patch.yml) 演示显式 SystemVerilog 与 DUT 归属。既有字符串数组继续受支持。Icarus 配置独立且保持不变。

混合语言仿真按原顺序保留连续分组。SystemVerilog 组使用 `xvlog -sv`，Verilog 组不带该标记。各组和版本探测共享编译阶段截止时间。某组失败即停止剩余组和后续阶段。需要公共编译单元的任务必须显式选择统一语言；本层不排序源文件，也不自动换语言重试。

综合根据同一解析结果用 `read_verilog` 或 `read_verilog -sv` 读取 DUT。`xelab` 不接收语言标记。Prob038 显式使用 SystemVerilog，保持 DUT、参考实现、测试台顺序，顶层 `tb`、种子 1 和原始时钟不变；综合 XDC 仍为 5 ns。文件角色、有效语言、来源、顺序和分组绑定到快照清单及验证哈希，评分配置变化会使既有审批失效。

## 证据与归因

新验证器事件、快照、阶段及终态记录使用项目 schema 1.3。读取器保留 1.0/1.1 支持；模型记录仍为 1.1，对照信封仍为 1.2。Harness Session 版本保持不变。每次调用记录解析后的可执行路径、工具参数、Windows 包装参数、策略包装后的启动命令、源文件元数据、语言模式、进程结果及 stdout/stderr 相对路径。

版本探测保留真实退出码。已实测的 Vivado 2025.2 和 2026.1 版本横幅允许退出码 1；该信息性例外只适用于 `-version`，不适用于编译或其他设计执行。取消、超时、信号终止或截断的探测不能确认就绪。读取器核验版本探测证据和调用与进程事实的一致性。

诊断记录保留消息编号、严重级别、位置及有界消息文本；原始日志用于还原精确原文格式。`origin` 表示清单中的文件归属；`attribution` 区分 DUT 编译或综合错误、测试台或参考实现兼容性、语言配置、Harness 配置、工具环境和未知问题。源文件按完整规范化路径匹配，不凭 `/trusted/` 子串或文件名猜测。

仿真正常退出、具有唯一且非致命的有效完成记录，并且失配数为正时，返回 `category=functional_mismatch`、失败与总检查数以及 `failure_domain=design`。这是观察到的功能失配，不是 Harness 配置错误。汇总计数不能定位缺陷，因此 origin/attribution 保持 unknown，file/line 为 null，修复资格保持 false。缺失、重复、致命或计数矛盾的判据返回 `simulation_evidence` 和 INCONCLUSIVE，不算已确认的功能错误。后续综合为 SKIPPED，而非失败。诊断措辞修正不重写原始历史记录。

只有编译、展开或综合证据完整、错误全部指向 DUT 且没有观察到环境故障时，`repairable_by_model` 才为 true。混合归属、位置缺失、诊断省略、截断或取消均禁止模型修复资格。该标记不授予执行权限。测试台兼容性标签只标注被报告位置的归属，不证明编译器或测试台违反语言标准。

有界诊断和指标进入模型可见输出；完整调用元数据及限长原始日志保留在项目记录中。输出达到限制会停止执行，不会静默丢弃证据后返回 PASS。沿用阶段、整次验证、清理和磁盘审计预算；轮询不是操作系统配额，哈希也不是写入隔离。

[counter 修复应用](../repair/README.zh.md)具有独立宿主提案策略及 schema 1.4 归一化凭据。它可以在没有源码行号时请求功能修复，但只接受已校准的实时证据，执行前还须单独人工授权。运行期测试台消息不自动标为编译兼容性失败；未分类宿主故障保持未知，不归为配置错误。

## 来源

- [AMD Vivado 2026.1 UG900](https://docs.amd.com/r/2026.1-English/ug900-vivado-logic-simulation/xelab-xvhdl-and-xvlog-xsim-Command-Options) 定义命令语义，包括 xvlog 的 SystemVerilog 标记。
- [Edalize Vivado 源码](https://github.com/olofk/edalize/blob/9a6f648c596bfe74224ae82f529075e565d4182b/edalize/tools/vivado.py)，提交 `9a6f648c596bfe74224ae82f529075e565d4182b`，声明 BSD-2-Clause，并将源文件类型显式映射到 `read_verilog` 或 `read_verilog -sv`。本实现借鉴设计，不复制源码，也不引入框架依赖。
- [Edalize 旧 XSim 源码](https://github.com/olofk/edalize/blob/main/edalize/xsim.py) 提供 `sv`、`verilog` 工程条目和编译单元的背景示例。其 API 已弃用，不作为本项目运行时或固定版本实现依赖。
- AMD 社区建议只有在正文、版本和本地复现均可获得后才算已验证。不宣称存在已确认的 Prob038 社区解决办法。建议修改只在独立手写复现中测试，不修改原始基准资产。

## 验证

[第一阶段检查](../README.zh.md#verification) 覆盖语言解析、冲突、有序分组、命令预检、归因、旧记录读取、Loader 呈现、输出限制、截止时间和取消。固定夹具清单包含使用 `logic`、`bit` 和 `typedef struct packed` 的 SystemVerilog counter，以及使用普通 Verilog 的 `.v` counter。真实工具证据与 Mock 结果分开。

Prob038 预检保留原始测试台和参考实现。如果测试台声明处的 `VRFC 10-3380` 仍存在，验证会记录兼容性失败并跳过后续阶段。手写夹具成功不代表 Prob038 兼容、P07/P08 修复就绪或完整操作系统隔离。
