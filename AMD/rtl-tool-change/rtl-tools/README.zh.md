---
description: "用于本地 Harness 开发的可选 Icarus RTL 编译与仿真工具，返回有界诊断。"
kind: "package-reference"
---

# RTL Tools

[English](README.md) | 中文

## 概述

`run_simulation` 编译配置指定的 RTL 和可信测试台，运行 Icarus，并返回有界诊断事实。它不修改源文件，也不修复 RTL。这是通过源码加载的本地插件，不是已发布的工作区包，也不是正式比赛评分器。

## 目录

- [加载工具](#load-the-tool)
- [结果与产物](#results-and-artifacts)
- [配置](#configuration)
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

规范结果包含 `status`、`stage`、`backend`、`summary`、`errors`、`warnings`、各命令的 `runs` 和 `artifactsDir`。编译失败后不会进入仿真。非零退出码、终止信号、超时、取消、已识别错误及配置的整行失败标记优先于 PASS。仿真退出码为零时，还必须观察到配置的整行 PASS 标记，且诊断行未被截断，才能返回 `PASS`；否则返回 `UNCONFIRMED`。任何结果都不表示综合成功。

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

进程使用精确 argv，不经过 shell 插值。编译器使用 `-g2012 -Wall -s`；运行器使用 `-N`，使 `$stop` 不进入交互模式且被视为失败，详见 [Icarus 文档](https://steveicarus.github.io/iverilog/usage/vvp_flags.html)。两个阶段均在独立产物目录中运行。使用相对路径数据文件的测试台需要适配可信输入；工具不会隐式复制或搜索这些文件。

<a id="verification"></a>
## 验证

定向测试使用确定性的外部 CLI（命令行界面）fixture（测试前置数据），验证真实 Loader、工具注册表、agent loop（智能体循环）和本地 subprocess 提供方。测试对 Native 输出及 Session 中记录的工具结果建立快照，并检查下一次模型请求接收到相同的精简事实。不需要模型 API key。

```powershell
pnpm exec vitest run --config rtl-tools/vitest.config.ts
pnpm exec tsc -b rtl-tools/tsconfig.json --pretty false
```

可选的真实 Icarus 测试要求 `RTL_IVERILOG` 和 `RTL_VVP` 环境变量均指向同一主机上的可执行文件。未设置时会明确跳过，不会被报告为真实仿真成功。本地测试套件不等于仓库已发布 profile 的 recorded-session 回放语料库。

## Model Experience

插件新增一个 schema，不新增系统提示词段落。它用确定性的有界观察结果代替原始 EDA stdout，保留错误文件和行号，供模型推理和修复。即使测试台打印大量输出，可配置上限也能约束上下文增长。

#### KV Cache effect

挂载工具或修改 schema 会改变请求前缀中的工具部分。重复调用使用相同 schema，仅正常的工具结果历史增长。工具不改写既有消息。

<a id="known-limitations-and-deferred-work"></a>
## 已知限制与后续工作

Icarus 是开发后端。用户提供的比赛纪要将 Vivado/Vitis 2025.2 及 `xvlog/xelab/xsim` 指定为正式链路；本插件不实现该链路、综合、Baseline、本地模型配置或修复工作流。这些比赛信息来自所提供的纪要，并非独立核实的官方评分细则。

PASS 标记是测试台证据，不是不可伪造的评分器判定：候选 RTL 也能打印文本。部署方必须通过只读挂载和外部可信评分器保护测试台、配置、评分器及参考文件。固定源文件列表并不阻止其他工具或仿真代码修改外围沙箱允许写入的文件。文件沙箱不隔离网络，也不限制波形文件磁盘用量；处理不可信设计时应使用断网且限制资源的容器。

插件使用主机文件系统 API，因此不支持远程 subprocess 提供方。产物会持续保留，不自动删除；部署方负责保留策略和磁盘配额。每个插件只暴露一个配置指定的测试台顶层模块。插件没有独立的注册表或投影，因此不发布运行时 invariant 伴随模块；进程所有权由 subprocess 提供方管理。
