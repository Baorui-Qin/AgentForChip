---
description: "无需密钥的环境预检，以及版本化的 RTL 题目、结果和事件记录。"
kind: "package-reference"
---

# 第一阶段基础组件

[English](README.md) | 中文

## 概述

在接入模型前执行无需密钥的开发环境预检，并校验项目自己的题目和结果 JSON。doctor 保留命令事实与环境快照；事件记录器持久化独立样本，不将其与内部修复版本混淆。这些是 P00/P01 组件，不代表 RTL Agent 或比赛评分器通过验收。

## 目录

- [环境预检](#preflight)
- [数据与事件](#data-and-events)
- [验证](#verification)
- [Model Experience](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)

<a id="preflight"></a>
## 环境预检

编辑 [configs/dev.yaml](configs/dev.yaml) 和 [cordis.patch.yml](cordis.patch.yml) 中的绝对路径。在启动 workspace-write profile 前创建配置的输出目录。示例使用明确可写工作区 `D:/AMD` 下的 `D:/AMD/phase1-validation`，固定 Vivado 2025.2、`xczu3eg-sbva484-1-e` 和 5 ns；每条命令 120 秒、四线程等限制属于开发配置，不是官方预算。YAML 读取器拒绝可执行标签与未知字段。在接入模型适配器前必须使用 `model: null`；不要在此文件中放置凭据。

从仓库根目录执行：

```powershell
pnpm dsh --profile headless --patch ./rtl-tools/phase1/cordis.patch.yml doctor
```

补丁仅为本次调用禁用 headless 模型运行器、启动参数解析器、遥测导出器与不使用的 RPC 元数据加载器，不修改已发布 profile 或 agent loop。应用仅在 Loader 成功启动后运行，并在受管子进程清理完成后通过启动器请求退出。它遵守 workspace-write 策略，拒绝不完整的文件沙箱保护，绝不无隔离重试。策略拒绝是有效的预检失败，不是 EDA 通过。另行授权完整访问的手写冒烟测试不能证明模型生成 HDL 的最小权限要求已满足。

每次调用创建新的 `doctor-*` 目录。`doctor.json` 记录观察到的版本探测、精确目标器件查询和手写 counter 的综合结果。`environment.lock.json` 记录仓库 commit 或 null、工作树状态观察、依赖锁文件哈希、扩展源码哈希、解析后的开发配置、OS/Node 信息与硬件观察。版本横幅允许信息性退出码 1，但只有正常完成目标查询和综合及报告执行才可确认 `eda_ready`。截断日志不能确认就绪；不会静默替换工具版本或器件。

终端行包含状态和产物位置。退出码 1 表示 `EDA_NOT_READY` 或启动、配置失败；退出码 2 表示 EDA 预检通过，但仍为 `MODEL_NOT_READY`。没有模型就绪证据时不会提供退出码 0。只有 `started.json` 而没有终态 `doctor.json` 的目录仍属未完成。详细报告与限长原始日志保留在磁盘上，不进入模型上下文。GPU 观察、ROCm 版本或推理后端版本缺失时保持 null 或未验证，不推断为零或成功。

<a id="data-and-events"></a>
## 数据与事件

[contracts.ts](../src/phase1/contracts.ts) 定义 `TaskSpec`、`ModelResult`、`StageResult` 和 `RunResult` 的 schema 版本 `1.0`。[examples.json](examples.json) 包含四个已校验示例，明确不是实测运行。公开题目不包含可信测试台或参考源码。纯文本模型结果要求 `tool_calls` 为空；不可用的 Token 用量和非流式 TTFT 保持 null。未知字段或枚举、不安全整数、缺失标识和非法摘要字符串都会被拒绝，不自动填充默认值。

产物引用使用可移植的相对路径。绝对路径、目录穿越、反斜杠、Windows 备用数据流和保留设备名均被拒绝。原始诊断位置仍可包含 Windows 绝对路径，因为它们是观察事实，不是文件操作权限。JSON 校验不能证明文件已隔离，也不能证明结果真实。仿真 PASS 要求非空评分器证据；最终 PASS 要求四个阶段使用相同快照与验证键。真实证据认证和源码哈希复核由后续评分器与不可变快照存储负责。

[recorder.ts](../src/phase1/recorder.ts) 为每个独立样本创建一个由宿主持有的私有运行目录。事件信封关联 `experiment_id`、`task_id`、`sample_id`、`revision_id` 与 `call_id`；模型开始事件保留实际 Prompt，不含传输请求头。写入按顺序执行并刷盘，时间戳使用 UTC，耗时使用单调时钟。单事件字节数超限时关闭失败，不静默截断证据。宿主必须阻止候选代码访问该目录；本库不为对抗性 HDL 安装操作系统权限策略。

记录器在返回前持久化 `run.json` 和 `run_started`。终态发布先写入 `run_finished`，再将 JSON 写入同目录临时文件，刷盘后原子重命名为 `result.json`。终态发布开始后不再接受追加。终态文件缺失时，`inspectRun` 返回 `INCOMPLETE`；损坏或串题结果会被拒绝。它不会把可能仍存活的所有者标记为 ABORTED，持有运行的工作流必须先确认其终止。项目事件不替换或迁移已发布的 Harness Session 记录。

<a id="verification"></a>
## 验证

从仓库根目录运行定向检查：

```powershell
node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts
node node_modules/typescript/bin/tsc -p rtl-tools/tsconfig.json --pretty false
node node_modules/oxlint/bin/oxlint rtl-tools/src rtl-tools/tests
```

无需密钥的事件快照把固定 Mock 请求关联到夹具阶段与终态结果。doctor 测试通过受管夹具进程注入版本不符、器件缺失、网表缺失和沙箱拒绝。这些检查仅证明接口与失败行为；真实 EDA 冒烟测试以及真实模型、ROCm 证据属于独立验收工作。原有仿真和综合测试仍在同一测试集中。

<a id="model-experience"></a>
## Model Experience

doctor 不发送模型请求，也不注册模型可调用工具。它是宿主预检应用，不是新的自主控制循环。不得把它的 JSON 记录与示例作为真实模型性能测量。

<a id="known-limitations-and-deferred-work"></a>
## 已知限制与后续工作

环境快照中的 G0、G1、G2 与官方镜像就绪状态均保持未验收。本范围不实现 Vivado 仿真链、可信外部判据、只读评分器隔离、不可变候选、本地模型适配器、修复、Baseline、批量指标或 ROCm 及断网验证。Windows GPU 清单仅记录观察；Linux GPU 采集与真实模型可达性需要部署集成。题目 schema 可以表示 HLS，但没有 HLS 执行路径。这些基础组件不需要 API key。

## Dev Note

[有界 RTL 验证事实](../../.agents/notes/implemented/feature/2026-09-13-rtl-simulation-tool.zh.md)。
