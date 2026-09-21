---
description: "本地 Icarus 仿真与按需启用的 Vivado 综合，返回有界诊断和资源及时序报告。"
kind: "package-reference"
---

# RTL Tools

[English](README.md) | 中文

## 概述

`run_simulation` 使用 Icarus 编译配置指定的 RTL 和可信测试台。可选的 `run_synthesis` 产出 Vivado 网表和精简的资源及时序结果。两者均返回有界诊断事实，不修改或修复 RTL。这个通过源码加载的本地插件不是正式比赛评分器。

[第一阶段开发链路](phase1/README.zh.md) 提供独立的 dsh 应用，用于预检、固定 Windows Vivado 夹具、仅接受快照的验证与官方 API 文本调用。独立的 [counter 修复应用](phase1/repair/README.zh.md)新增需要人工审查的修复提案，不改变两个工具，也不代表无人干预修复。

## 目录

可选的 [P09 上下文应用](phase1/p09/README.zh.md) 增加可审计的上下文预算与五题修复对照，不改变无 Agent Baseline。

- [加载工具](#load-the-tool)
- [结果与产物](#results-and-artifacts)
- [配置](#configuration)
- [Vivado 综合](#vivado-synthesis)
- [验证](#verification)
- [Model Experience](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)

<a id="load-the-tool"></a>
## 加载工具

前提是已有可运行的 Harness 源码仓库、同一主机上的 `iverilog` 和 `vvp` 可执行文件，以及现有 tools、subprocess、sandboxPolicy 和 sandbox 服务。base profile 提供这些服务。断网部署前需完成依赖安装与验证；工具本身不发起网络请求。

编辑 [cordis.patch.yml](cordis.patch.yml)，设置插件的绝对路径、工作区目录、可信顶层模块和有序源文件列表。提交的路径针对 `D:/deepseek-harness`。模型仅传入 `{"top":"counter_tb"}`，不能替换源文件、可执行文件、参数或判定标记。源文件和包含目录相对于 `workspaceRoot` 解析；源文件也可以指向外部只读挂载的测试台。

在仓库根目录执行以下命令，可以在不调用模型的情况下检查组合配置：

```powershell
pnpm dsh --profile headless --patch ./rtl-tools/cordis.patch.yml --dump-config
```

配置 profile 的模型提供方并安装 Icarus 后，预期的交互调用方式为：

```powershell
pnpm dsh --profile headless --patch ./rtl-tools/cordis.patch.yml "Call run_simulation with top counter_tb. Report the observed result."
```

profile 必须允许写入配置指定的工作区。只读模式会被拒绝。workspace-write 调用使用配置的沙箱，并拒绝不完整或不可用的执行保护；不会自动回退到无沙箱执行，也不会自动提权。插件遵守既有的显式 danger-full-access 策略，但不会自行选择该策略。

<a id="results-and-artifacts"></a>
## 结果与产物

仿真结果包含 `status`、`stage`、`backend`、`summary`、`errors`、`warnings`、各命令的 `runs` 和 `artifactsDir`。编译失败后不会进入仿真。非零退出码、终止信号、超时、取消、已识别错误及配置的整行失败标记优先于 PASS。仿真退出码为零时，还必须观察到配置的整行 PASS 标记，且诊断行未被截断，才能返回 `PASS`；否则返回 `UNCONFIRMED`。任何仿真结果都不表示综合成功。

Native 文本包含有界错误、警告、退出事实和产物位置。仅当运行未成功且没有已识别错误时，才展示有界的未分类日志尾部。解析器保留原始诊断消息与位置，清除 ANSI 噪声，对保留的诊断去重，并报告省略情况，不猜测哪条语法错误导致了另一条错误。输出是不可信数据，不是指令来源。

每次调用直接在工作区内创建唯一的 `.rtl-sim-*` 目录，保留 `commands.json`、编译成功产出的 `sim.out`、各阶段 stdout/stderr 日志，以及正常产生领域结果时的 `result.json`。日志文件保存有上限的原始前缀；解析器继续检查整个输出流，因此日志上限不会掩盖后续失败。过长的诊断行和触及上限的日志会被明确标记。找不到可执行文件、文件访问错误、进程提供方失败和沙箱拒绝会作为 Harness 工具错误呈现，不会伪装成 RTL 失败；这些情况可能留下没有 `result.json` 的部分产物。

<a id="configuration"></a>
## 配置

必填字段为 `workspaceRoot`（已存在目录的绝对路径）、`top`（简单模块标识符）及非空的 `sources`（包含所提供测试台的有序文件列表）。可选字段与开发默认值如下：

| 字段 | 默认值 | 含义 |
|---|---|---|
| `iverilog`, `vvp` | 可执行文件名 | 由 subprocess 提供方解析 |
| `includeDirs` | `[]` | 显式指定编译器包含目录 |
| `timeoutMs` | `30000` | 每阶段超时，不是官方比赛预算 |
| `graceMs` | `1000` | 提供方终止进程的宽限时间 |
| `maxLogBytes` | `4194304` | 每阶段、每输出流的原始日志字节上限 |
| `maxDiagnostics` | `5` | 每阶段分别保留的错误和警告数量 |
| `maxLineChars` | `400` | 诊断行与兜底日志尾部的字符上限 |
| `passMarker`, `failMarker` | `PASS`, `FAIL` | 不同的整行测试台证据标记 |

Icarus 进程使用精确 argv，不经过 shell 插值。编译器使用 `-g2012 -Wall -s`；运行器使用 `-N`，使 `$stop` 不进入交互模式且被视为失败，详见 [Icarus 文档](https://steveicarus.github.io/iverilog/usage/vvp_flags.html)。两个阶段均在独立产物目录中运行。使用相对路径数据文件的测试台需要适配可信输入；工具不会隐式复制或搜索这些文件。

<a id="vivado-synthesis"></a>
## Vivado 综合

使用 [cordis.synthesis.patch.yml](cordis.synthesis.patch.yml) 代替仅含仿真的 patch，可注册两个工具。模型以 `{"top":"counter"}` 调用 `run_synthesis`；设计顶层不同于 `counter_tb`。只有调用仿真时才需要 Icarus 可执行文件。综合示例使用 Vivado 2025.2、`xczu3eg-sbva484-1-e` 和可信的 [5 ns 时钟约束](example/constraints/counter.xdc)。

可选的 `synthesis` 对象必须独立配置 `top`、非空有序 RTL `sources` 及显式的 `xdcFiles` 列表。空 XDC 列表支持无约束组合逻辑；工具不猜测时钟，也不编造时序证据。综合不会带入仿真源文件或参考实现。XDC 文件是可信的可执行配置，不是模型编写的输入。

综合支持可选任务级 `language` 和显式源文件描述，同时兼容字符串路径。[Vivado 语言选择](phase1/language/README.zh.md) 定义与第一阶段验证器共享的解析、冲突及诊断归属。模型仍只能提交配置中的顶层名称。

| 综合字段 | 默认值 | 含义 |
|---|---|---|
| `vivado` | `vivado` | 同主机启动器；示例指定本机 Windows 批处理路径 |
| `part` | `xczu3eg-sbva484-1-e` | 目标器件 |
| `includeDirs` | `[]` | 显式 RTL 包含路径 |
| `timeoutMs` | `120000` | 每次批处理调用的超时，不是比赛预算 |
| `threads` | `4` | Vivado 最大线程数 |
| `maxReportBytes` | `4194304` | 每份报告的最大读取字节数；超大报告视为不可用 |

综合与仿真共享工作区、终止宽限时间及诊断和日志上限。综合使用两次受管批处理调用：先导出网表和 checkpoint，再打开该 checkpoint 生成报告。Windows `.bat` 启动器通过 `cmd.exe /d /v:off /c call` 执行，argv 转义由进程提供方负责；批处理参数中的 shell 元字符会被拒绝。其他平台直接启动 Vivado。Tcl 值经过转义，命令错误产生非零退出码。两次调用均使用配置的文件沙箱，不自动回退到无隔离执行。

结果区分 `success` 和可空的 `synthesizable`。综合调用正常结束且产出非空网表和 checkpoint，才能确认可综合。已识别的综合错误判为不可综合；超时、取消、已知环境错误及证据不完整时保持未知。`success` 还要求报告完整且指标解析成功。报告失败不抹掉已确认的可综合事实。准备过程、文件系统、进程提供方及沙箱失败仍是 Harness 工具错误，不伪造为设计错误。

`resources.lut` 为 CLB LUT 总用量，`ff` 不含锁存器，`bram` 为 Block RAM Tile 用量（36 Kb 等效块，允许半块），`dsp` 为 DSP 用量。缺失或含糊的字段保持 `null`。`timing.wns` 是以 ns 为单位的综合后估计，不可用时给出明确原因。没有时钟或没有 setup 路径时返回 `null`，但不会否定正常完成的综合；负 WNS 不否定可综合性。正 WNS 不表示布线后时序收敛，未提供的 I/O 约束仍然缺失。

每个 `.rtl-synth-*` 目录保存生成的 Tcl、命令参数、有上限的 stdout/stderr 日志、网表、checkpoint、原始资源及时序报告、时钟及路径计数，以及正常产生结果时的 `result.json`。工具保留原始 Vivado 消息编号和严重级别，包括 CRITICAL WARNING，但只向模型发送有界诊断和指标。读取上限不限制 Vivado 报告或 checkpoint 的磁盘写入量；部署方负责磁盘配额。工具不强制检查此前是否仿真通过，也不修复 RTL；工作流必须安排执行顺序并保护评分资产。

<a id="verification"></a>
## 验证

定向测试使用确定性的外部 CLI（命令行界面）fixture（测试前置数据），验证真实 Loader、工具注册表、agent loop（智能体循环）和本地 subprocess 提供方。测试对 Native 输出及 Session 中记录的工具结果建立快照，并检查下一次模型请求接收到相同的精简事实。不需要模型 API key。

```powershell
node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts
node node_modules/typescript/bin/tsc -p rtl-tools/tsconfig.json --pretty false
```

可选的真实 Icarus 测试要求 `RTL_IVERILOG` 和 `RTL_VVP` 环境变量均指向同一主机上的可执行文件。未设置时会明确跳过，不会被报告为真实仿真成功。本地测试套件不等于仓库已发布 profile 的 recorded-session 回放语料库。

将 `RTL_VIVADO` 指向 Vivado 启动器，可启用通过已注册工具运行的真实综合测试；将 `RTL_VIVADO_ARTIFACTS_DIR` 设为绝对目录，可保留这些测试产物。否则真实 Vivado 用例会明确跳过。这些测试为可信 fixture 显式使用 full-access 策略，不代表完成了生产沙箱验证。不需要模型 API key。

```powershell
$env:RTL_VIVADO = 'D:\AMDDesignTools\2025.2\Vivado\bin\vivado.bat'
$env:RTL_VIVADO_ARTIFACTS_DIR = 'D:\AMD\vivado-synthesis-validation'
node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts -t 'real Vivado via registered tool'
```

## Model Experience

插件新增仿真 schema，并按配置新增综合 schema；不新增系统提示词段落。它用确定性的有界观察结果和指标代替原始 EDA stdout，保留错误文件和行号，供模型推理和修复。即使工具打印大量输出，可配置上限也能约束上下文增长。

#### KV Cache effect

挂载工具或修改 schema 会改变请求前缀中的工具部分。重复调用使用相同 schema，仅正常的工具结果历史增长。工具不改写既有消息。

<a id="known-limitations-and-deferred-work"></a>
## 已知限制与后续工作

Icarus 是开发后端。用户提供的比赛纪要将 Vivado/Vitis 2025.2 及 `xvlog/xelab/xsim` 指定为正式仿真链路；本插件实现 Vivado 综合，但不实现该仿真链路、Baseline、本地模型配置或修复工作流。这些比赛信息来自所提供的纪要，并非独立核实的官方评分细则。报告解析器针对 Vivado 2025.2 UltraScale+ 文本报告；不支持的格式会明确失败，不会替换为零指标。

PASS 标记是测试台证据，不是不可伪造的评分器判定：候选 RTL 也能打印文本。部署方必须通过只读挂载和外部可信评分器保护测试台、配置、评分器及参考文件。固定源文件列表并不阻止其他工具或仿真代码修改外围沙箱允许写入的文件。文件沙箱不隔离网络，也不限制波形文件磁盘用量；处理不可信设计时应使用断网且限制资源的容器。

插件使用主机文件系统 API，因此不支持远程 subprocess 提供方。产物会持续保留，不自动删除；部署方负责保留策略和磁盘配额。每个插件暴露一个配置指定的仿真顶层模块，并可选暴露一个综合顶层模块。插件没有独立的注册表或投影，因此不发布运行时 invariant 伴随模块；进程所有权由 subprocess 提供方管理。
