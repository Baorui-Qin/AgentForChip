---
description: "Windows Vivado 夹具验证、官方 API 文本调用与版本化项目证据。"
kind: "package-reference"
---

# 第一阶段开发链路

[English](README.md) | 中文

Phase 2 运行基线由 [dev.yaml](configs/dev.yaml) 固定为 Vivado 2026.1；Phase 1 历史实验及 fixture 保留 2025.2 来源。新 snapshot、兼容套件与 evaluator identity 使用配置版本，后续 Static Knowledge 使用 `{"tool":"vivado","tool_version":"2026.1"}`。真实验证范围和未通过项见[迁移报告](../../../../docs/vivado-2026.1/report.md)。

## 概述

通过独立的 dsh 应用，使用 Windows Vivado 验证固定手写 RTL，并调用 DeepSeek 官方 API。doctor 保留环境事实；项目记录保留独立样本、有界诊断和模型响应。执行控制不代表操作系统隔离、自主修复闭环或比赛验收通过。

独立的[三路线开发对照](comparison/README.zh.md) 文档负责冻结的 VerilogEval 生成、独立 Baseline 入口、经审查候选版本与对照报告。

## 目录

- [环境预检](#preflight)
- [Windows 夹具](#windows-fixtures)
- [官方 API](#official-api)
- [单题 counter](#single-counter)
- [执行控制](#execution-controls)
- [数据与事件](#data-and-events)
- [验证](#verification)
- [Model Experience](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)

<a id="preflight"></a>
## 环境预检

编辑 [configs/dev.yaml](configs/dev.yaml) 和 [cordis.patch.yml](cordis.patch.yml) 中的绝对路径。在启动 workspace-write profile 前创建配置的输出目录。示例使用明确可写工作区 `F:/FPGA/AgentforChip/AgentForChip/AMD` 下的 `F:/FPGA/AgentforChip/AgentForChip/AMD/phase2-vivado2026.1`，固定 Vivado 2026.1、`xczu3eg-sbva484-1-e` 和 5 ns；每条命令 300 秒、四线程等限制属于开发配置，不是官方预算。YAML 读取器拒绝可执行标签与未知字段。doctor 配置要求 `model: null`；独立的 API profile 负责模型设置。两个 YAML 文件都不能放置凭据。

从仓库根目录执行：

```powershell
pnpm dsh --profile headless --patch ./rtl-tools/phase1/cordis.patch.yml doctor
```

补丁仅为本次调用禁用 headless 模型运行器、启动参数解析器、遥测导出器与不使用的 RPC 元数据加载器，不修改已发布 profile 或 agent loop。应用仅在 Loader 成功启动后运行，并在受管子进程清理完成后通过启动器请求退出。它遵守 workspace-write 策略，拒绝不完整的文件沙箱保护，绝不无隔离重试。策略拒绝是有效的预检失败，不是 EDA 通过。另行授权完整访问的手写冒烟测试不能证明模型生成 HDL 的最小权限要求已满足。

每次调用创建新的 `doctor-*` 目录。`doctor.json` 记录观察到的版本探测、精确目标器件查询和手写 counter 的综合结果。`environment.lock.json` 记录仓库 commit 或 null、工作树状态观察、依赖锁文件哈希、扩展源码哈希、解析后的开发配置、OS/Node 信息与硬件观察。版本横幅允许信息性退出码 1，但只有正常完成目标查询和综合及报告执行才可确认 `eda_ready`。截断日志不能确认就绪；不会静默替换工具版本或器件。

终端行包含状态和产物位置。退出码 1 表示 `EDA_NOT_READY` 或启动、配置失败；退出码 2 表示 EDA 预检通过，但仍为 `MODEL_NOT_READY`。没有模型就绪证据时不会提供退出码 0。只有 `started.json` 而没有终态 `doctor.json` 的目录仍属未完成。详细报告与限长原始日志保留在磁盘上，不进入模型上下文。GPU 观察、ROCm 版本或推理后端版本缺失时保持 null 或未验证，不推断为零或成功。

<a id="windows-fixtures"></a>
## Windows 夹具

[fixtures.patch.yml](fixtures.patch.yml) 仅为内置手写夹具清单明确授权完整访问，调用前请审查此风险。宿主固定快照 manifest（清单）和资产哈希，再为每个已注册快照发放一次性、非 Agent 调用许可。工具参数和 API 文本不能创建许可或导入清单。既有 Icarus 与独立综合配置保持不变。

```powershell
pnpm dsh --profile headless --patch rtl-tools/phase1/fixtures.patch.yml verify-fixtures
```

宿主依次执行 `xvlog`、`xelab`、`xsim`，再由既有综合运行器仅综合 DUT 源码。每次运行使用全新目录；失败后将后续阶段标为 SKIPPED。counter、语法错误、缺失模块、功能错误与刻意注入的仅综合错误都有固定的预期阶段。最后一例使用 `SYNTHESIS` 条件，不是自然模型生成基准。应用不导入或修改 VerilogEval 资产。

清单还包含 SystemVerilog 语法构造和普通 Verilog counter。[语言与诊断](language/README.zh.md) 定义这些夹具及数据集验证的源文件分组、共享编译截止时间、基于角色的归因和调用证据。

仿真 PASS 要求进程和诊断事实正常、恰好一条完整 `PHASE1_COMPLETE` 记录、正数检查次数与零失配。普通 PASS 文本、缺失判据、重复判据或截断证据均不能通过。此协议仅适用于宿主持有的这些测试台，不适用于任意恶意 HDL。`artifacts.json` 索引保留文件；阶段记录包含进程事实与综合指标。正 WNS 不代表完整时序判定或布线后收敛。退出码 0 表示每个夹具的行为都符合预期，包括预期的设计失败。

<a id="official-api"></a>
## 官方 API

[api.patch.yml](api.patch.yml) 显式选择 `deepseek-flash`，对应仓库目录中的 DeepSeek-V41-Flash 条目。模型可用性仍取决于账户与端点。既有 `deepseek-official` 提供方和凭据服务负责鉴权；使用 Harness 凭据存储或其启动环境中的 `DEEPSEEK_API_KEY`。密钥不能进入 YAML、项目事件或环境快照。profile 每次只发送一条固定的公开开发提示词，不发送工作区文件或参考答案。

```powershell
pnpm dsh --profile headless --patch rtl-tools/phase1/api.patch.yml model-smoke
```

[callText](../src/phase1/model.ts) 消费一次已准备的提供方流，返回完整且有界的文本，不开放工具，也不重试。事件记录提示词、解析后的模型及生成参数、传输方式、响应、用量与终态错误。TTFT 保持 null，原因为 `not_collected`；聚合不会将传输方式从 stream 改为非流式。取消会中止提供方信号并释放迭代，但服务端取消仍未确认。提供方必须遵守其 AbortSignal 生命周期约定。

冒烟测试串行执行十次尝试，不替换失败。每次尝试保留 `model.json`、`response.txt`、事件与运行终态。`model_requests_total` 统计项目调用尝试；`dispatched` 表示已准备的适配器流开始派发，不是已证实的 HTTP 请求计数。提供方可能在网络请求前失败；不可用的 Token 用量保持 null。退出码 0 要求十次响应均无错误。保存的文本没有执行权限；仅调用 API 的运行仍不具备 RTL 验证结果。真实冒烟失败不会被通过的 Mock 快照替代。

<a id="single-counter"></a>
## 单题 counter

[end-to-end.patch.yml](end-to-end.patch.yml) 加载一个分离审查步骤的开发应用，不是 Agent 工具。它使用同一官方提供方，只发送公开的四位同步 counter 规格。从仓库根目录生成一份候选：

```powershell
pnpm dsh --profile headless --patch rtl-tools/phase1/end-to-end.patch.yml generate-counter
```

命令将原始响应、候选和 SHA-256 保存到新运行目录，然后退出，不执行 EDA。宿主操作方必须完整审查源码后才能授权；移除可选的整段 Markdown 代码围栏不是 HDL 校验。模型调用失败或代码围栏提取失败均保留终态记录，不重试。

对于获准候选，创建一份私有补丁副本。将 `generationDirectory` 设为该运行目录，`reviewedSourceSha256` 设为已审查字节的摘要，将 `sandbox-policy.config.mode` 改为 `danger-full-access`，并添加 `permission.config.defaultPreset: danger-full-access`。执行 `pnpm dsh --profile headless --patch <reviewed-overlay.yml> verify-counter`。这次显式无隔离实验仅适用于已检查的 counter，不适用于任意 HDL 或无人审查的模型输出。

验证会检查保存的模型响应与批准源码一致，以排他方式一次性认领该运行，并将候选绑定到未改动的 counter 测试台与 5 ns XDC。阶段标记为 `reviewed_candidate`，而非 `trusted_fixture`。应用只执行一轮编译、展开、仿真、综合，再将保存的候选和精简验证事实发送给模型进行一次只读解读，不执行反馈中的代码。因此，完整实验包含两次模型调用尝试、一份候选和一轮验证，没有重试或修复。设计失败会保留，不重新采样；退出码 0 要求设计 PASS 且反馈调用无错误。

生成目录保留 `verification.json` 和 `end-to-end.json`，通过实验标识关联生成、验证与反馈运行。生成和反馈的 RTL 终态仍为 INCONCLUSIVE；只有验证运行确认设计 PASS。中断且没有汇总回执的运行保持未完成。不能删除排他认领文件来掩盖一次中断尝试。完整操作系统隔离仍为 false；本实验不替代独立的十次 API 冒烟测试。

<a id="execution-controls"></a>
## 执行控制

`verify_rtl` 只接受宿主发放的 `snapshot_id`，拒绝未知或已消费的标识。它的工具注册表仅包含内置夹具。即使部署选择完整访问，普通调用仍要求完整的 workspace-write 保护；只有明确的宿主冒烟许可可豁免此要求。Windows `partial` 保护会拒绝普通调用，且不降级。独立的已审查候选应用不扩大此工具的权限，也不向模型开放任意候选注册。

快照检查器拒绝路径穿越、备用数据流、符号链接、junction 与硬链接别名，并在每个阶段前后复核固定清单和资产哈希。这些检查可以检测变化，但不能阻止写入，也不能消除恶意并发替换。受管进程组在调用结束前完成退出等待，取消和插件卸载也遵守此规则。阶段 stdout/stderr 达到上限后溢出会中止执行。活动产物审计按配置间隔轮询，并在阶段结束后再次检查；检测到超限会中止，不能返回 PASS。轮询观察之间可能发生超额写入，它不是操作系统磁盘配额。输出超限后仍保留最终诊断元数据。

开发 profile 将编译、展开、仿真、综合含报告预算设为 60/60/30/300 秒，整次验证设为 600 秒，清理宽限一秒，线程数四。每条保留流和报告上限为 4 MiB，产物审计预算为 256 MiB，审计间隔 100 ms，单事件上限 1 MiB。这些都是可信配置，不是官方比赛限制。阶段证据区分环境、资源、策略与设计失败；本应用不会把完整隔离标记设为 true。

验证器通过每个 run 自有的 FIFO 队列协调原子 JSON 发布与元数据扫描。等待仍计入原 deadline；取消的等待者不能迟到发布。终态所有者等待活动扫描结算后，再发布结果和索引产物。其他进程不参与此协调，文件系统错误仍会拒绝操作。`filesystem-error.json` 将可用的原始错误字段与取消状态绑定到该 run。见[共享证据协调实现](../src/phase1/evidence-access.ts)。

需要人工授权的 [counter 修复应用](repair/README.zh.md)对 DUT `VRFC 10-3818` 的提案资格和修订比较使用同一个[严格判定函数](../src/phase1/repair-policy.ts)。它要求完整且正常的展开执行、精确的冲突文本、明确 DUT 归属，以及与已验证 manifest 文件哈希、记录的最终源码哈希和实际编译 DUT 输入一致的独立当前 DUT 来源绑定。它使用绑定工作目录解析每条 primary 诊断的当前路径，再与绑定 DUT 路径比较；陈旧归属标签不能代替此检查。伴随错误只能是同次调用中精确且无定位信息的 `XSIM 43-3322` 汇总。原始 `repairable_by_model` 保持 false。未通过判定的 driver 情况不能借助通用 DUT 错误分支获得资格。

<a id="data-and-events"></a>
## 数据与事件

[contracts.ts](../src/phase1/contracts.ts) 定义 `1.0` 记录；[records.ts](../src/phase1/records.ts) 读取 `1.0`、`1.1` 及验证器 `1.3`，保留进程、信任、传输与取消事实。题目示例仍为 `1.0`。[examples.json](examples.json) 包含已校验示例，不是测量结果。公开题目不包含可信测试台或参考源码。模型结果要求 `tool_calls` 为空；不可用的用量和 TTFT 保持 null。未知字段或枚举、不安全整数、缺失标识和非法摘要都会被拒绝，不自动填充默认值。

产物引用使用可移植的相对路径。绝对路径、目录穿越、反斜杠、Windows 备用数据流和保留设备名均被拒绝。原始诊断位置可包含 Windows 绝对路径，因为它们是观察事实，不是文件操作权限。JSON 校验不能证明隔离或真实性。最终 PASS 要求四个阶段使用相同快照与验证键。手写快照绑定哈希；对抗性权威评分仍不属于本应用。对照参考文档负责其候选管理与项目 schema 1.2 信封。

[recorder.ts](../src/phase1/recorder.ts) 为每个独立样本创建一个由宿主持有的私有运行目录。事件信封关联 `experiment_id`、`task_id`、`sample_id`、`revision_id` 与 `call_id`；模型开始事件保留实际 Prompt，不含传输请求头。写入按顺序执行并刷盘，时间戳使用 UTC，耗时使用单调时钟。单事件字节数超限时关闭失败，不静默截断证据。宿主必须阻止候选代码访问该目录；本库不为对抗性 HDL 安装操作系统权限策略。

记录器在返回前持久化 `run.json` 和 `run_started`。终态发布先写入 `run_finished`，再将 JSON 写入同目录临时文件，刷盘后原子重命名为 `result.json`。终态发布开始后不再接受追加。终态文件缺失时，`inspectRun` 返回 `INCOMPLETE`；损坏或串题结果会被拒绝。它不会把可能仍存活的所有者标记为 ABORTED，持有运行的工作流必须先确认其终止。项目事件不替换或迁移已发布的 Harness Session 记录。

模型动作在 `stream.json` 和 `stream.jsonl` 中保留每个已接收的规范化 chunk。独立的[增量审计](../src/phase1/stream-audit.ts)通过同一受管原子写入器发布 `stream-audit.json`。其紧凑 JSON 数组的精确 UTF-8 预算为 `maxEventBytes / 2`，计入方括号、逗号与转义，并为用量和 finish 元数据预留 4096 字节。普通 chunk 整块省略；不保留已省略的正文等待终态裁剪。关键元数据无法容纳时，将 `audit_error` 设为 `AUDIT_METADATA_LIMIT`、`terminal_metadata_preserved` 设为 false，并记录省略计数。该审计错误不改变语义接纳结果，也不截断完整归档。

[提供方用量](../src/phase1/provider-usage.ts)区分 `USAGE_RETURNED`、`USAGE_MISSING_PROVIDER`、`USAGE_LOST_HOST` 和 `USAGE_UNPARSEABLE`；不可用的计数保持 null。返回计数必须为非负安全整数，并具有提供方给出的精确总量。Prompt 用量只将互不重叠的输入与缓存桶相加一次；reasoning 已包含在输出中。不累加相同的规范化样本；冲突或非法样本会明确报告。内容 finish 不等于迭代器正常耗尽；已收到的有效用量在后续中断后仍保留。这些观察事实独立于语义接纳结果，记录在 `model.json.observation.provider_usage` 中。

DeepSeek 适配器仅在观察到 `[DONE]` 并发出此前的用量记录后，才在规范化 finish 中设置可选的 `providerProtocolComplete=true`。遥测将此事实公开为 `model.json.observation.provider_protocol_complete`，来源为 `normalized-provider-stream-marker`。已完成的提供方错误若没有用量，分类为 `USAGE_MISSING_PROVIDER`；没有标记的本地错误，包括响应没有 body 的 `EMPTY_RESPONSE`，分类为 `USAGE_LOST_HOST`。标记缺失本身不提供协议完整结束的证据。语义失败与后续取消各自留证，已收到的有效用量仍可用。这项元数据不改变提供方选择、重试或请求预算。

[动作响应](../src/phase1/p09-action-call.ts)超过语义字节上限后，错误保持 `OUTPUT_TRUNCATED`、message 保持 null，并停止语义组装。同一迭代器在原请求、signal 和计时器下继续观察元数据，直到正常耗尽、原 deadline 或取消；认证、安全拒绝和用户取消路径仍立即终止。原 signal 中止时，提供方必须取消并结算待完成的读取。后续传输、提供方终态、用量、审计和持久化结果各自保留；此 drain 不增加宽限、派发或重试。

<a id="verification"></a>
## 验证

从仓库根目录运行定向检查：

```powershell
node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts
node node_modules/typescript/bin/tsc -p rtl-tools/tsconfig.json --pretty false
node node_modules/oxlint/bin/oxlint rtl-tools/src rtl-tools/tests
```

无需密钥的测试覆盖提供方流与失败、固定判据、受管夹具进程、快照篡改、输出限制和取消。Loader 测试覆盖注册、参数拒绝、不完整沙箱拒绝、项目事件还原与卸载。模块内快照覆盖有界的模型可见输出。Mock、真实手写 EDA 与真实官方 API 产物是独立证据类别；均不代表本地模型或 ROCm 就绪。原有仿真和综合测试仍在同一测试集中。

<a id="model-experience"></a>
## Model Experience

doctor 不发送模型请求。`verify_rtl` 提供可从项目事件还原的有界阶段事实、告警、进程结果与综合指标；日志保留在磁盘。API 应用不向模型开放工具。两个应用都不修复 RTL，也不把 EDA 输出当作指令。JSON 示例和 Mock 快照不是模型真实性能测量。

<a id="known-limitations-and-deferred-work"></a>
## 已知限制与后续工作

G0、G1、G2、完整操作系统隔离与官方镜像就绪状态均保持未验收。本范围不包含对抗性权威判据、只读评分器隔离、本地推理、无人干预修复、统计性批量指标或 ROCm 及断网验证。独立的 [counter 修复应用](repair/README.zh.md)要求逐份人工授权模型候选。此 Windows 开发链路不要求 Linux Vivado 或 WSL 迁移。题目 schema 可以表示 HLS，但没有 HLS 执行路径。真实 API 调用需要凭据；组件测试仍无需密钥。

## Dev Note

[有界 RTL 验证事实](../../.agents/notes/implemented/feature/2026-09-13-rtl-simulation-tool.zh.md)。

[修复资格、有界流审计与提供方用量](../../.agents/notes/implemented/bug-fix/2026-10-09-p3-production-continuity.zh.md)。
