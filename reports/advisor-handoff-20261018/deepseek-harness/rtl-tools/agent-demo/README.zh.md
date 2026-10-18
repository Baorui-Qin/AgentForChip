---
description: "从 Harness 主工程回顾真实 RTL 修复证据，并准备有界的单题运行。"
kind: "package-reference"
---

# RTL Agent 主工程入口

English（历史路径：`README.md`，本包未收录） | 中文

## 概述

以 `D:/deepseek-harness` 为主工程。根目录的 `rtl-agent.ps1` 启动器可以不调用模型地回顾历史证据，也能准备独立且需要显式授权的单题修复。原有源码、实验目录和结果原地保留。演示顺序见[导师演示指南](../../docs/cookbook/rtl-agent-demo.zh.md)。

## 目录

- [命令](#commands)
- [源码归属](#source-ownership)
- [Model Experience](#model-experience)
- [限制](#limitations)
- [验证](#verification)

<a id="commands"></a>

## 命令

在主工程目录使用 PowerShell 7。需要已有的 Node 依赖；启动器不会安装或下载依赖。所有应用均通过主工程的 `dsh` profile 启动，不直接运行包入口，也不调用旧实验批测脚本。

```powershell
Set-Location D:\deepseek-harness
.\rtl-agent.ps1
.\rtl-agent.ps1 doctor
.\rtl-agent.ps1 case
.\rtl-agent.ps1 case -Task Probe205_packet_parity
.\rtl-agent.ps1 prepare -Skill off
```

`overview`、`doctor`、`case` 不连接模型，也不启动 EDA。`case` 是历史记录回顾，不是新的模型运行或 EDA 重测；它将展示源码与实际最终验证哈希绑定。`doctor` 检查文件是否存在及导入字节是否完整，不证明许可证或在线服务就绪。启动器创建唯一的临时 Harness profile 目录，并恢复调用者的 `DSH_HOME`。

`prepare` 创建全新的单题 profile 和冻结输入，但不执行。输出只能位于 `D:/AMD/output/rtl-agent-demo` 的新子目录，已有目录会被拒绝。`run` 会另建新目录，先执行正确对照、输出取反负例和错误种子的 EDA 检查；只有检查通过才调用 P10 修复 profile。它不会续跑准备目录或历史批次。

若只排练三项本地 EDA 对照，不发送任何模型请求，使用需要单独明确确认的命令：

```powershell
.\rtl-agent.ps1 preflight -AllowUnisolatedDevelopment
```

真实运行需要同时提供两个确认参数。它使用已有的 18080/18081 回环服务，固定为 8192 上下文的 30B 规划器及 8B 编码器身份。它不会建立 SSH 隧道或修改远端服务。公开题目规格、候选、诊断及选中的通用技能可能发送到这些服务；正确 RTL 对照及测试台只供 Host 使用，但不具备完整的操作系统隔离。

```powershell
.\rtl-agent.ps1 run -AllowModelRequests -AllowUnisolatedDevelopment
```

真实运行命令是有条件的操作说明，不代表整理后已经完成真实推理。上限为单题、16 次总物理派发、两次有效修改、八次编码请求、四个规划绑定和 240 秒修复活动时间。profile 在 30 分钟后到期；EDA 和子进程另有独立时限。Skill `on` 选择 C，`off` 选择 B；两者都不是裸模型 Baseline。

<a id="source-ownership"></a>

## 源码归属

| 位置 | 职责 |
| --- | --- |
| 主工程 `packages/` 及源码 CLI | Harness 服务、profile 加载和进程管理 |
| 导入的 RTL 运行代码（历史路径：`runtime/rtl-tools/src/phase1/p10-model.ts`，本包未收录） | P10 专用规划、精确修改、验证、防护和恢复 |
| 导入的技能注册表（历史路径：`runtime/skill-registry/skills.validated.json`，本包未收录） | 七条冻结技能；图谱是离线材料，不是运行时图数据库 |
| 导入清单（历史路径：`import-manifest.json`，本包未收录） | 2026-10-18 导入资产的原路径和 SHA-256 |
| 现有的同级 `../src/` | 原开发源码原样保留；新演示不覆盖它 |
| `D:/AMD/output/rtl-rule-transfer-probes-20261018` | 历史模型及 EDA 证据，演示只读访问 |
| `D:/AMD/output/rtl-agent-demo` | 新的准备目录及单题运行输出 |

由于原开发树包含尚未提交的修改，导入运行版本采用增量副本，而不是覆盖。它不是另一份 Harness 工程。根启动器选择该运行版本，公共框架服务全部从本主工程解析。决策记录（历史路径：`../../.agents/notes/implemented/process/2026-10-18-rtl-agent-main-entry.zh.md`，本包未收录）说明保留策略及范围。

<a id="model-experience"></a>

## Model Experience

只读回顾不增加模型输入。真实运行保留导入版本的提示词、精确修改规则、格式限制及拒绝策略；本次整理改变路径、单题选择和派发限额，不修改历史答案。这里使用的是 RTL 专用 P10 插件，不是通用聊天 Agent loop，也不是专用网页上传界面。

<a id="limitations"></a>

## 限制

保留的八例实验结果为 Skill ON 4/8、OFF 6/8 四阶段通过，不能证明 Skill 有收益。本地探针即使四阶段通过，终态仍为 `NETLIST_NOT_CALIBRATED`；四阶段不等于综合后网表功能验收、时序收敛、官方成绩或从规格生成的正确率。`prepare` 和 mock 测试不是真实模型修复。当前真实运行固定了模型身份；更换后端需要明确修改配置并重新验证。

<a id="verification"></a>

## 验证

```powershell
node --test rtl-tools/agent-demo/core.test.mjs
node node_modules/vitest/vitest.mjs run --config rtl-tools/agent-demo/vitest.config.ts
```

聚焦测试覆盖源码及证据绑定、输出范围、拒绝覆盖、预算和导入的 P10 行为。适配后的回归测试使用新的临时目录，不写入历史结果目录。验证范围见统一入口决策（历史路径：`../../.agents/notes/implemented/process/2026-10-18-rtl-agent-main-entry.zh.md`，本包未收录）。
