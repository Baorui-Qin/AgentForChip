---
title: 第一阶段实施与验收指南：跑通 RTL Agent
version: "1.0"
date: "2026-09-14"
scope: "AMD 2026 RTL/HLS 本地智能体设计赛道；第一阶段优先 RTL"
owner_role: "Harness 与全链路集成负责人"
status: "实施方案；不代表代码已实现或验收已通过"
requirements_reference: "competition_requirements.md"
---

# 第一阶段实施与验收指南：跑通 RTL Agent

> **第一阶段的完成标志不是“模型能回答”，而是：给系统一道题，不人工改 RTL，它能生成代码、执行真实验证、根据失败反馈修复、有界退出，并留下可复查的代码和运行证据。**
>
> 本文把任务拆成可交给 Codex 实施的工作包。每个工作包都说明：完成什么、怎么实现、为什么先做、交付什么、如何验收。Markdown 与 HTML 正文一致；HTML 可离线阅读。

**适用分工：**你负责 Harness、工具接口、流程控制、日志和集成；模型队友负责候选模型与能力评测；部署职责负责 ROCm、推理服务和显存验证。部署职责可由现有成员兼任，不因本文新增人员要求。[S2]

**规则与建议的边界：**官方约束来自已提供选题指南和 `competition_requirements.md`；本文的目录、状态名、测试数量、超时配置及阶段门槛均是团队内部实施建议，不是新增比赛规则。[S1][S3]

## 阅读导航

- [01｜目标、范围与阶段门槛](#s01)
- [02｜架构与分工](#s02)
- [03｜实施顺序总表](#s03)
- [04｜P00—P11 工作包](#s04)
- [05｜必须先约定的数据接口](#s05)
- [06｜Vivado 自动验证的实现细节](#s06)
- [07｜修复循环与上下文管理](#s07)
- [08｜遥测：给模型队友的数据](#s08)
- [09｜最小权限与故障处理](#s09)
- [10｜验收用例矩阵](#s10)
- [11｜交付目录与验收操作](#s11)
- [12｜交给 Codex 的开发约束](#s12)
- [13｜阶段签收表与待确认事项](#s13)
- [14｜依据与版本记录](#s14)

<a id="s01"></a>
## 01｜目标、范围与阶段门槛

### 1.1 第一阶段最终要跑通什么

```text
同一道题、同一模型服务、同一上下文配置
                   │
        ┌──────────┴───────────┐
        ▼                      ▼
Baseline：单次直接生成      Agent：生成候选 RTL
        │                      │
        │                 xvlog → xelab
        │                      │
        │                     xsim
        │                      │
        │                 synth_design
        │                      │
        │              失败 → 诊断 → 修复
        │                      │
        ▼                      ▼
外部评分，不回馈模型       通过或达到停止条件
        └──────────┬───────────┘
                   ▼
最终代码 + 分阶段结果 + 轨迹 + 时间/Token/显存记录
```

**这里的“自动”有三个条件：**执行过程中不人工编辑 RTL；不人工决定下一条 EDA 命令；不由模型一句“完成了”决定是否成功。成功必须由验证器产生的证据确认。

正式 RTL 判定采用 `xvlog + xelab → xsim → synth_design`；工具链为 Vivado / Vitis 2025.2，目标器件为 `xczu3eg-sbva484-1-e`，统一时钟约束为 5 ns。[S1 §3.1.2]

### 1.2 本阶段做与不做的边界

| 必须做 | 暂不作为第一阶段关键路径 |
|---|---|
| 单模型、单题和小批量运行 | 多智能体分工、复杂规划搜索 |
| 真实 Vivado 编译、仿真、综合 | 布局布线、PPA 极限优化、上板 |
| 小范围、有限次数修复 | 无限制自反思、长链搜索 |
| Agent / Baseline 双入口 | 大规模模型全榜单评测 |
| 基础 Prompt、小型经验证技能 | 微调、庞大知识库、自动扩充技能 |
| 最小权限、超时、日志、可复现 | 复杂前端、波形智能浏览器 |
| 一个可用的 ROCm 本地推理方案 | 所有推理框架同时适配 |
| HLS 类型与接口占位 | HLS 全链路实施与优化 |

**HLS 占位必须诚实。**收到 `track=hls` 时，如果尚未实现，返回 `UNSUPPORTED_TRACK`；不能空跑后给 PASS，也不能把 RTL 流程套给 C++。

### 1.3 用三个门槛区分“哪里跑通了”

| 门槛 | 必须提供的证据 | 可以声称什么 |
|---|---|---|
| G0：组件可测 | 手写 RTL 的 EDA 正反例通过；模型接口与日志契约可测试 | “组件与接口已就绪” |
| G1：`MVP_LOCAL_READY` | 真实本地模型 + 真实 Vivado 自动闭环；正常题、修复题和失败退出有证据；Baseline 合规 | “本地 Agent 闭环已跑通” |
| G2：`PHASE1_DONE` | G1 全部通过；至少一个模型在 ROCm 实跑；断外网启动与全链路复跑；另一成员可复现；小批量记录完整 | “第一阶段完成”，并列明实际 GPU 与环境覆盖范围 |

**正式赛事就绪另设 `OFFICIAL_READY`，不自动等于 G2。**官方镜像、最终 R9700、32 GB 部署边界、预算与接口需要按实际获得的环境复验。只在 W7900 上运行成功，不能据此宣称已经在 R9700 上验证；官方镜像尚未取得时写 `PENDING_OFFICIAL_IMAGE`，不要写“官方环境已通过”。[S1 §2.5、§3.1.3]

32 GB 约束从模型选型开始考虑。G2 报告必须给出实际显存数据和测试条件；若还没有目标 32 GB 卡实测，明确标注兼容性待验证，不把估算写成部署证明。

### 1.4 本文补正此前讨论中的易混淆点

内部修复 3 次不等于 `pass@3`；`pass@5` 需要与独立样本/完整运行相区分，正式计算口径以评分细则为准。5 ns 是时钟约束，不是已经取得实现后 200 MHz 的证明。官方只保证 Vivado / Vitis，不应让第三方仿真器成为唯一验证链。[S1 §3.1.2—§3.1.3]

公开开发测试可以向 Agent 提供合法反馈；**正式隐藏测试台、参考实现及详细失败信息是否可见，现有指南没有给出足够接口细节**。工具层必须允许“仅公开自测”与“官方授权反馈”两种配置，禁止默认将隐藏答案或参考源码送给模型。

<a id="s02"></a>
## 02｜架构与分工

### 2.1 建议只保留六个业务模块

```text
TaskLoader     读入题目、接口、可信配置
    ↓
ModelAdapter   调用已配置的本地模型，返回原始输出与指标
    ↓
ArtifactStore  提取代码、校验、写入不可变版本
    ↓
EdaRunner      固定命令编译 / 仿真 / 综合
    ↓
ResultParser   提取证据、分类失败、生成有限反馈
    ↓
Workflow       决定重试、回退、结束

EventRecorder 贯穿全部模块：从首次调用就记录，而不是最后补日志
```

这是职责划分，不要求一定拆成六个进程。第一阶段推荐一个控制进程、一个本地推理服务和受控 EDA 子进程，先串行运行。独立 EDA 任务工作目录不复用。

### 2.2 你与队友的接口

| 职责 | 主要工作 | 对接时必须交付 |
|---|---|---|
| H：你，Harness / 集成 | 数据契约、工具封装、状态机、Baseline、日志、测试 | 一套稳定调用协议、可复现失败案例、CSV/JSON 指标 |
| M：模型选择 | 候选模型、生成/修复能力、采样建议、模型声明 | 固定模型版本、量化方式、配置建议、模型能力测试结果 |
| R：部署职责 | ROCm、推理服务、离线依赖、资源测量 | 服务端点、启动/停止方法、上下文上限、峰值显存、环境清单 |

本分工沿用已有第一阶段文件；任务重点仍是你负责 Harness，而不是让你重新承担模型选型全流程。[S2]

**你不必等待最终模型选型完成。**先用固定响应的 Mock 测控制流，用手写 RTL 测 EDA；真实模型就绪后，只替换 `ModelAdapter` 配置。Mock 通过只算接口测试，不能算 Agent 能力或 ROCm 部署通过。

### 2.3 DeepSeek Harness 应该怎么改

DeepSeek Harness 的公开实现采用插件化架构；工具可通过工具注册服务接入，执行策略和结果记录有相应扩展点。第一阶段优先新增项目自己的适配层与领域插件，不直接修改上游核心循环。[S4][S5]

建议的项目扩展职责如下，**目录和插件名为本项目建议，并非官方固定路径**：

| 扩展 | 职责 |
|---|---|
| `rtl-tools` | 受控提交候选代码、调用 EDA、读取获准反馈 |
| `rtl-policy` | 文件白名单、工具白名单、禁止修改评分资产 |
| `rtl-context` | 固定设计规则、最新代码和有限错误上下文 |
| `rtl-workflow` | 固定阶段顺序、停止条件、成功证据检查 |
| `rtl-telemetry` | 将运行时事件转为项目统一日志 |
| `model-adapter` | 屏蔽不同本地推理后端的响应格式差异 |

**先锁定仓库 commit，再按该版本的实际类型签名开发。**将 commit、依赖锁文件和加载配置写入 `environment.lock.json`。此前聊天中的插件代码只是思路，不能视作任何最新版本都能直接编译的 API 合同。

建议一期采用**宿主确定性状态机**：代码决定何时验证、是否可以综合和何时结束；模型负责生成与修复。它可以作为项目插件或宿主控制器接入 Harness，无须让模型学会自由编排所有工具。使用哪个公开服务接口，以固定 commit 为准。

模型支持原生 tool calling 时，可暴露受控的 `submit_rtl` 工具；不支持时，由适配器接收受约束的文本代码输出，再由宿主提交。**两条方式选定一条作为一期主路径，不必同时实现两套完整 Agent。**无论采用哪条路径，都必须经过相同的代码校验、权限检查、EDA runner 和日志层。

独立 Python 脚本跑通 Vivado 只是组件完成；要声称 DeepSeek Harness 已集成，必须从项目实际 Harness 入口启动，并在同一运行记录中看到真实模型调用、候选提交、工具执行和最终判定。不要让两个独立循环同时控制一个任务。

<a id="s03"></a>
## 03｜实施顺序总表

### 3.1 先把确定的部分做对，再引入模型随机性

```text
P00 锁定约束 / 环境清单
              ↓
P01 契约 + EventRecorder
     ┌────────┴─────────┐
     ▼                  ▼
P02 手写 RTL 验证     P04 本地模型适配
     ↓                  │
P03 最小权限 Runner     │
     └────────┬─────────┘
              ▼
P05 输出提取 / 不可变代码版本
              ↓
P06 Baseline + 单次 Agent 生成
              ↓
P07 状态机 / 错误解析 / 自动修复
              ↓
P08 失败注入 / 预算 / 回退验证
              ↓
P09 小技能包 / 上下文裁剪
              ↓
P10 小批量回归 / 指标导出
              ↓
P11 ROCm / 断网复现 / 阶段签收
```

P04 的部署准备与 P02/P03 并行；P11 的离线依赖检查、显存测量可提前做。权限与超时必须在第一次执行模型生成代码前生效，不能等到 P08 才补；P08 是系统性破坏测试。

| 编号 | 必须完成的功能 | 关键交付物 | 依赖 | 主责 |
|---|---|---|---|---|
| P00 | 约束冻结、环境预检 | 配置、版本与器件检查报告 | 无 | H + R |
| P01 | 输入输出契约、标识与事件日志 | Schema、结果枚举、`events.jsonl` | P00 | H，M/R 会签 |
| P02 | 不接模型的 EDA 正反例 | 编译/仿真/综合脚本和日志 | P00 | H |
| P03 | 受控进程、权限、验证工具 | `EdaRunner`、路径与超时测试 | P01/P02 | H |
| P04 | 可替换的本地模型接口 | Adapter、能力声明、真实请求记录 | P01 | R + H，M 配置 |
| P05 | 可靠落盘与版本绑定 | 提取器、候选快照、哈希清单 | P01/P03 | H |
| P06 | 双入口与单次生成闭环 | `run.sh`、`run_baseline.sh` | P03/P04/P05 | H |
| P07 | 反馈诊断与有限修复 | 状态机、Parser、修复轨迹 | P06 | H |
| P08 | 故障恢复、停止和诚实判定 | 故障测试报告 | P07 | H + R |
| P09 | 最小上下文管理与技能包 | 固定 Prompt、小技能与验证记录 | P07 | H + M |
| P10 | 小批量评测与汇总 | `summary.csv`、逐题结果 | P08/P09 | H + M |
| P11 | ROCm 离线复跑与交接 | 部署说明、资源证据、签收表 | P10，部署可提前 | R + H |

不预设固定日程；按退出条件推进。P02 失败时先修工具链，不通过换模型来绕过；P04 不可用时继续用 Mock 开发，不假称真实端到端通过。

<a id="s04"></a>
## 04｜P00—P11 工作包

### P00｜锁定约束，建立可执行环境预检

**完成什么。**固定 RTL 主线、EDA 版本、器件、时钟约束、模型服务配置入口和工作目录。第一版支持一个单时钟、单 DUT 顶层的任务子集；复杂任务清楚报不支持，不能默默改题。

**怎么实现。**建立 `configs/dev.yaml` 和 `environment.lock.json`。实现 `doctor` 预检：定位 Vivado 安装目录，记录 `vivado -version`，确认 `xvlog/xelab/xsim` 可执行；通过 Vivado 查询目标器件，再实际综合一个小设计验证器件支持与许可证。模型侧检查服务可达、配置模型是否可调用，并记录实际 OS、GPU、驱动、ROCm 和后端版本。

安装器显示安装完成、GUI 能打开、License 文件复制成功，都不能替代一次目标器件的真实综合。Windows 开发可以保留，但正式 Linux/ROCm 路径必须独立验证，不默认 Windows 成功即可迁移。

**为什么先做。**避免一边调模型，一边才发现工具版本不符、缺器件或许可证问题。正式版本来自规则，不根据个人习惯任意换成其他版本。[S1 §3.1.2]

**交付与验收。**`doctor.json` 包含工具实际路径、版本、器件查询与小设计验证状态；版本不符和器件不可用应失败关闭，不自动换器件。模型未就绪允许 `MODEL_NOT_READY`，但不得伪造其他检查通过。

### P01｜统一契约，第一天就接入日志

**完成什么。**区分题目、完整独立运行、内部修复轮和单次调用；统一所有模块输入输出、状态与错误枚举。

**怎么实现。**按第 05 节定义 `TaskSpec`、`ModelResult`、`StageResult`、`RunResult`；所有消息带 `schema_version`。使用 `experiment_id → task_id → sample_id → revision_id → call_id` 关联链。先实现追加写 `events.jsonl`，再开发业务功能。开始事件尽快落盘；终止结果采用临时文件 + 原子替换，崩溃后可识别未完成运行。

字段变化采用兼容扩展；破坏性变化升级 Schema。业务结果和遥测分离，新增 TTFT 等指标不应改变 Agent 的工具参数。

**为什么先做。**接口不先统一，模型队友的测试脚本、EDA parser 和 Harness 会各自定义 PASS、耗时和“第几次”，到汇总时无法比较。

**交付与验收。**至少三类 JSON 示例通过 Schema；未知枚举、缺 task_id、非法路径被拒绝；一次 Mock 请求能关联到工具事件与结果；进程中断后能识别 `ABORTED`/未完成状态，而不是漏掉该题。

### P02｜不接模型，先跑通手写 RTL 的 EDA 链

**完成什么。**用人工确认的正确设计验证 `xvlog → xelab → xsim → synth_design`，并用故意错误设计检查失败判定。[S6][S7]

**怎么实现。**准备开发者自有测试夹具：一个同步复位计数器作为正例；一个语法错误、一个模块实例化错误、一个功能错误，以及一个经实际工具确认的综合失败例。每个夹具保存预期失败阶段。测试台不能由本次被测模型生成并自行宣称正确。

先在命令行运行，再接入脚本。分开记录编译、展开、仿真、综合；不把所有失败都叫 `compile_error`。第 06 节给出参考调用方式。

**为什么先做。**先证明“裁判可信”，后面才能用它判断模型。若错误 RTL 也能被判为 PASS，继续优化 Prompt 只会优化错误指标。

**交付与验收。**正例全部阶段 PASS；语法错停在编译、实例化错停在展开、功能错停在仿真；综合失败夹具在指定工具版本上确认。每次使用干净构建目录，旧网表不能让新失败变为通过。

### P03｜实现最小权限 EDA Runner

**完成什么。**模型只能提交候选代码或请求受限验证，不能指定任意 Shell、Tcl、工作目录、器件或评分脚本。

**怎么实现。**工具只接受服务端分配的 `snapshot_id`；Runner 在内部从可信 manifest 取得 top、源文件、测试台和 XDC，生成固定命令参数。用非 Shell 参数数组启动进程，逐个阶段收集返回码、日志与产物；设进程级超时、总墙钟预算、输出大小限制和取消机制。Windows 批处理启动器单独实现与测试，不能把任意模型字符串拼给 `cmd.exe`。[S9]

源码写入范围仅为候选 `rtl/`；脚本、参考文件、约束、评分文件对模型不可写。不要只靠 Prompt。文件权限/容器限制、工具 Guard 和前后哈希共同防护，工作目录本身不是沙箱。

**为什么现在做。**在执行第一份模型生成代码前就建立边界。否则即使工具名叫“仿真”，模型仍可能通过路径、命令参数或 HDL 文件访问造成越权。

**交付与验收。**越界写、路径穿越、符号链接逃逸、未授权工具请求被拒绝；无限仿真被终止且其后代进程被清理；校验器和测试台哈希不变；正确代码仍可通过。

### P04｜接一个可用本地模型，不等待最终选型

**完成什么。**Harness 只依赖统一 Adapter，不依赖某个具体模型品牌。第一阶段至少跑通一个真实本地模型；ROCm 实跑是阶段签收的一部分。

**怎么实现。**队友提供端点、模型 ID/版本、量化配置、上下文上限、单次输出上限、请求格式与启动方式。Adapter 将后端响应规范化为文本、停止原因、usage、耗时和错误。先用非流式调用简化逻辑；流式及 tool calling 按实测能力启用。没有原生工具调用能力，不意味着不能做确定性工作流 Agent。

异常分类覆盖连接失败、超时、认证/配置错误、空输出、截断、无法解析和 GPU OOM。网络/服务错误不要当成 RTL 错误喂给模型。取消 HTTP 等待后，需要确认服务端生成是否确实停止，不能让幽灵请求继续消耗显存。

**为什么并行做。**模型部署和 EDA 封装互不应阻塞；通过统一契约，最后只是连接两个已单测的模块。

**交付与验收。**固定配置连续请求 10 次，全部产生可解析终态且无未捕获异常；内容正确性另测。模拟断开、空输出、超时各一次均正确分类。切换 Mock/真实端点不修改 Workflow。非流式调用的 TTFT 填 `null`，不拿总耗时充数。

### P05｜可靠提取代码，绑定不可变候选版本

**完成什么。**将模型输出变成能被工具读取的 RTL 文件，并保证“验证的代码就是最后交付的代码”。

**怎么实现。**一期优先完整文件替换，避免同时实现复杂 patch。模型只生成 HDL 内容，服务端决定文件名。提取器处理裸代码、单个明确的 Verilog/SystemVerilog 代码块；多个互相冲突代码块、空输出、截断输出不盲拼。检查输入规模、编码和规定顶层接口，再写入新 `revision_id`。

每一候选计算内容哈希；验证前复制到新的只读快照。`verification_key` 关联源码、测试资产、约束、工具版本、配置及随机种子。只对 DUT 文件做综合，不能把测试台混入。第一阶段默认不复用跨轮编译缓存。

**为什么必须单独做。**模型输出文字不是编译器输入；落盘与缓存错误会让系统看起来会修复，实际上一直运行旧代码。

**交付与验收。**裸代码/代码块正常落盘；非法输出明确失败；同一修复任务产生不同版本；修改一个字符后旧 PASS 自动失效。导出的最终文件哈希与最后一次成功验证的源码哈希相同。

### P06｜建立 Baseline 和单次生成闭环

**完成什么。**先完成“一次生成 → 验证 → 导出”，并让 Baseline 与 Agent 从一开始可比较。

**怎么实现。**`run_baseline.sh` 只做题目输入、一次模型生成、统一提取和保存；不加载技能、不添加 RTL 专家提示、不调用工具、不修复。外部评测驱动随后验证输出，但结果绝不送回 Baseline。Baseline 不做后台重抽样；一次调用的服务异常如实记为基础设施错误。[S1 §3.1.5.2]

`run.sh` 是 Agent 主入口，先不开修复。两入口复用相同 Adapter 配置；Agent 允许领域 Prompt。公共题面需要包含必要模块接口；归一化必须无损且两入口一致，不能为 Baseline 偷加“只输出代码”等优化指令。

同一次实验内顺序产出两份结果，隔离会话和文件目录；不要求两条路径同时占用单卡。精确调度口径等待官方接口，内部先用同一个 `experiment_id` 关联。

**为什么先做 Baseline。**官方要求它，也是后续证明 Agent 增益的参照。最后补 Baseline 容易混入技能、修复或不同服务参数，导致比较失真。

**交付与验收。**一题得到 `baseline/`、`agent/` 两套产物；Baseline 生成调用次数严格为 1、工具调用为 0；请求中无技能/诊断上下文。外部评分单独记账，不能误计为 Baseline 自主调用工具。

### P07｜结构化反馈与有限修复状态机

**完成什么。**失败能够被分层诊断，正确的反馈触发自动修复，修复后重新验证。

**怎么实现。**按第 07 节状态机驱动。Parser 输出阶段、严重性、原始错误 ID、文件/行号（工具提供时）和短消息；不确定类型用 `unknown`，不编造定位。修复 Prompt 包含原始题面、接口、当前代码、首要错误和上轮摘要。

建议内部初值：首次生成 1 次，最多 3 轮语义修复；模型请求总数另设硬上限。每次代码变化回到编译起点，不能从旧仿真 PASS 直接跳综合。工具故障不消耗为“逻辑修复机会”后反复让模型乱改。

**为什么把流程交给代码。**“先编译、再仿真、再综合”属于确定性条件；由宿主执行能避免模型跳过验证、重复调用昂贵工具或提前结束。

**交付与验收。**Mock 固定输出“错 → 对”能证明控制流；真实模型还需分别修好至少一个编译类、一个功能类、一个综合类的预验证故障夹具。人工注入的修复成绩单独统计，不伪装成自然题生成增益。

### P08｜故障、预算、取消与回退

**完成什么。**失败时也能稳定结束、保存证据，不拖垮批量任务，不交付未经验证的新版本。

**怎么实现。**在 P03 的保护基础上，测试模型超时、EDA 挂起、未知日志、空结果、输出爆量、重复代码、路径越界、文件损坏和进程取消。设置每阶段超时、每题墙钟、调用上限与文件大小限制。取消时终止整棵 EDA 进程树，等待退出并记录清理结果。

保存最好候选：优先已有完整通过版本，其次按通过阶段排序；同级保留较早的稳定候选即可。未全部通过时可输出调试用最佳候选，但 `final_verified=false`，不得标成完成。

**为什么必须验失败。**演示成功只证明顺路可用，比赛会遇到错误代码、长输出、服务波动和未知题；失控的一题会耗尽总预算。

**交付与验收。**第 10 节阻断性故障用例全部符合预期；每题都有终态和日志；预算结束不再请求模型；清理完成后能继续跑下一题。判定未知时输出 `INCONCLUSIVE`，不能兜底 PASS。

### P09｜最小 Prompt、技能与上下文预算

**完成什么。**让模型获得够用而不过量的设计约束与失败信息；保留一个能解释来源的小型技能包。

**怎么实现。**保留固定块：题目、接口、平台约束、输出协议；可变块只放当前代码、最新首要诊断和极短修复历史。超过预算优先删除重复日志与陈旧版本，不删必要接口。没有合适 Tokenizer 时使用明确标注的保守估算，并处理服务端超长错误。

先收录 3—5 条真实验证过的规则，例如顺序逻辑赋值、位宽/符号、复位约定与多驱动。每条记录来源故障、适用范围、失效条件和验证例。不在评测运行时动态修改冻结技能包。Baseline 不读这些内容。

**为什么此时才做。**先有真实失败，再总结技能；否则容易堆砌无法证明有效的长提示词。第一阶段不需要向量数据库或复杂长期记忆。

**交付与验收。**构造长日志后仍在上下文预算内，题面/接口不丢失；记录裁剪前后大小和截断标志；技能开启/关闭能用配置复验，不能凭感觉宣称提高通过率。

### P10｜小批量评测与指标导出

**完成什么。**从演示一题走向可以定位瓶颈的连续运行，并给模型队友可直接分析的数据。

**怎么实现。**先固定 5 道简单自测题，再扩至 10 道；全串行跑 Agent/Baseline。建议至少包含计数器、边沿检测、简单 FSM、位宽/符号和一个握手或小 FIFO 任务。题目选择、数据版本、随机种子与顺序记录到 manifest。

逐题保存终态，汇总编译/展开/仿真/综合状态、调用数、修复轮、墙钟、Token、峰值显存和错误类别。分清“基础设施正常完成”与“代码最终正确”。第一阶段不要求整个公开 Benchmark 达到某个高通过率。

**为什么要小批量。**一题成功很可能是偶然；连续运行会暴露缓存污染、目录冲突、显存泄漏与长尾超时。数据量先小，方便逐个核对真伪。

**交付与验收。**5 道预选普通题至少 3 道真实 Agent 全链 PASS，其中至少 1 道在本轮 Prompt/技能定稿后才加入；10 道批量运行全部有终态、无漏题、无错题串目录。自然题成功率照实报告，不强求一期已证明统计显著的增益。

### P11｜ROCm、断网复现与阶段交接

**完成什么。**确认链路不是依赖你当前电脑缓存或在线服务才能运行，并完成另一成员独立复现。

**怎么实现。**队友在 ROCm 环境启动本地模型；记录硬件、驱动、后端、模型文件版本/校验和、上下文和采样配置。测模型加载后、典型题以及配置允许的长上下文/输出场景的显存。记录原始字节数或 MiB/GiB、测量方法及采样间隔；“权重大小约 18 GB”不是总峰值证明。

预备好模型、Tokenizer、配置、依赖及本地资料后，阻断外网并重新启动。第一阶段可用本地部署容器验证；拿到官方基础镜像后再重建复验。`--network none` 只保留回环网络，同容器模型服务可走 localhost；不能假设它还能连接另一个容器或宿主机。[S10]

EDA片段依赖远程许可证服务器时，需先确认官方许可方式；不能为了跑通擅自开放外网，也不能绕过许可证。分机开发方案仅证明开发接口，不等于断网沙箱提交形态。

**为什么最后要复现。**可重复运行才是可交付系统；R9700 与 W7900 的验证覆盖也必须分别记录，ROCm/后端支持组合依据官方矩阵和实测确认。[S11]

**交付与验收。**从干净的运行目录按 README 启动，另一个成员不改源码完成至少 1 题完整 PASS、1 题真实修复以及一轮小批量；断外网期间无必需在线依赖。签收时所有未覆盖的官方环境、最终 GPU 和预算项明确列为待验证。

<a id="s05"></a>
## 05｜必须先约定的数据接口

> 下列字段、类型与工具名是内部接口建议；不是赛事方已经公布的输入输出协议。正式接口到来后，只替换边界适配层，不推翻整个 Workflow。

### 5.1 任务：公共题面与可信评测配置分开

```json
{
  "schema_version": "1.0",
  "task_id": "counter_001",
  "track": "rtl",
  "public_spec": "设计 counter 模块，含 clk、同步高有效 rst、en 和 8 位 q。rst 优先于 en；en=0 时保持，计数按 256 回绕。题面附完整端口定义。",
  "interface": {
    "dut_top": "counter",
    "language": "systemverilog",
    "clock_ports": ["clk"]
  },
  "evaluation_profile_id": "dev_counter_2025_2",
  "dataset_revision": "team_smoke_v1"
}
```

`public_spec` 的正式版本应来自原始题目并包含完整接口；这里文字仅用于解释字段。不要把参考答案藏在输入里给模型。`evaluation_profile_id` 由可信加载器映射到下面的内部 manifest，模型无权覆盖。

```json
{
  "profile_id": "dev_counter_2025_2",
  "vivado_version": "2025.2",
  "part": "xczu3eg-sbva484-1-e",
  "clock_period_ns": 5.0,
  "dut_sources": ["rtl/solution.sv"],
  "tb_top": "phase1_tb",
  "tb_sources": ["trusted/tb.sv"],
  "xdc_path": "trusted/constraints.xdc",
  "feedback_policy": "public_development_tests_only"
}
```

`dut_top` 用于综合；`tb_top` 用于仿真，二者不能混用。公开测试台是否允许模型读取由题目授权决定；参考实现、未授权测试文件和评分器不进入模型文件工具范围。

### 5.2 模型适配器：业务输出与测量信息分开

```json
{
  "schema_version": "1.0",
  "call_id": "call_0001",
  "model_id": "configured_local_model",
  "content": "module counter ... endmodule",
  "finish_reason": "stop",
  "truncated": false,
  "tool_calls": [],
  "usage": {
    "prompt_tokens": null,
    "completion_tokens": null,
    "source": "unavailable"
  },
  "timing": {
    "request_wall_ms": 12500,
    "ttft_ms": null,
    "ttft_source": "not_observed_non_streaming"
  },
  "error": null
}
```

数值仅为格式示例，不是性能实测。后端没有返回的字段填 `null` 并说明原因；不要填 0。推理模型的分析文本不能被提取器误当 HDL；只处理适配器明确认定的最终代码输出通道。

### 5.3 最小验证工具接口

模型或域控制器提交的验证请求建议只有：

```json
{
  "tool": "verify_rtl",
  "arguments": {
    "snapshot_id": "snap_0002"
  }
}
```

`verify_rtl` 内部按顺序执行编译、展开、仿真和综合；失败即停止后续阶段。额外的 `compile_rtl`、`simulate_rtl`、`synthesize_rtl` 可以先作为内部函数，不必全部暴露给模型。工具名不是越多越好。

若采用原生工具调用路径，可使用 `submit_rtl({"source_text":"..."})`：先由同一代码校验与快照层落盘，再调用验证链。模型不得自选 `command`、`shell`、`tcl`、`part`、`tb_path`、`cwd`、超时上限或评分选项。

### 5.4 阶段结果：不能只返回 success 布尔值

```json
{
  "schema_version": "1.0",
  "snapshot_id": "snap_0002",
  "verification_key": "sha256:<source+assets+tool+config+seed>",
  "stage": "simulation",
  "status": "FAIL",
  "failure_domain": "design",
  "exit_code": 0,
  "duration_ms": 2100,
  "errors": [
    {
      "category": "functional_mismatch",
      "message_id": null,
      "file": null,
      "line": null,
      "message": "公开测试在复位后发现输出不符",
      "cycle": 9,
      "expected": "0",
      "actual": "1"
    }
  ],
  "evidence": {
    "test_completed": true,
    "checks_executed": 100,
    "mismatch_count": 1,
    "evaluator_id": "dev_counter_checker_v1"
  },
  "raw_log_path": "logs/xsim.log",
  "diagnostic_excerpt_truncated": false
}
```

**这个例子故意展示 `exit_code=0` 但 `status=FAIL`。**工具退出与逻辑正确性是两个事实。没有完整检查证据时应为 `INCONCLUSIVE`；没有运行的后续阶段是 `SKIPPED`，不是 PASS。

推荐阶段状态：`PASS / FAIL / SKIPPED / TIMEOUT / TOOL_ERROR / INCONCLUSIVE`；终态另含 `INVALID_OUTPUT / BUDGET_EXCEEDED / ABORTED / UNSUPPORTED_TRACK`。资源或环境错误通过 `failure_domain=environment|resource|policy|design|unknown` 区分，避免错误修复。

### 5.5 运行结果：交付版本必须绑定验证证据

```json
{
  "schema_version": "1.0",
  "experiment_id": "exp_001",
  "task_id": "counter_001",
  "mode": "agent",
  "sample_id": 0,
  "final_status": "PASS",
  "final_revision_id": "r02",
  "final_source_sha256": "<actual_sha256>",
  "verification_key": "<actual_verification_key>",
  "final_verified": true,
  "stages": {
    "compile": "PASS",
    "elaborate": "PASS",
    "simulation": "PASS",
    "synthesis": "PASS"
  },
  "semantic_repairs": 2,
  "model_requests_total": 3,
  "transport_retries": 0,
  "stop_reason": "verified_pass",
  "artifact_manifest": "artifacts_manifest.json"
}
```

`sample_id` 是完整独立运行的编号，`revision_id` 是运行内部修复版本。上例修了两次，仍然只有一个 sample。

<a id="s06"></a>
## 06｜Vivado 自动验证的实现细节

### 6.1 先预检，再编译

以下命令以 Linux、已加载 Vivado 环境、当前目录为独立构建目录为前提。Windows 使用对应安装目录下的启动脚本，并由固定 Runner 处理批处理转义。**命令用于实施说明，本次文档生成环境未安装 Vivado，未实际执行这些示例。**

```bash
vivado -version
xvlog -sv -work work rtl/solution.sv trusted/tb.sv -log logs/xvlog.log
xelab work.phase1_tb -s phase1_snapshot -log logs/xelab.log
xsim phase1_snapshot -tclbatch trusted/run_sim.tcl -log logs/xsim.log
vivado -mode batch -source trusted/run_synth.tcl \
  -log logs/vivado.log -journal logs/vivado.jou
```

AMD 2025.2 文档说明了 `xvlog` 分析、`xelab` 生成仿真快照以及 `xsim` 运行快照的独立命令流程，`xsim` 支持 Tcl 批处理。[S6]

**实现要求：**提前创建目录；每一命令结束后先判定再进入下一命令；只使用可信配置规定的库、宏、文件列表与 top；不把 `work.*`、`xsim.dir` 或综合产物跨候选复用。单条命令可执行，不代表上面五条可以无条件一路运行到底。

### 6.2 仿真 PASS 必须有可信检查证据

自有测试夹具应至少给出：测试是否完成、执行了多少检查、错了多少次，必要时含首个错误周期。测试台应覆盖复位、正常操作和边界条件，且有受控结束方式。

优先由**受信检查器/控制脚本**读取测试台结果并生成 verdict；正式环境使用官方返回的判定。不要仅搜索日志中出现 `PASS`：DUT 的 `$display` 也能打印这几个字。测试台发出的固定文本标记可以用于人工 smoke 排查，但不能单独构成抗伪造的最终判据。

即使读取测试台状态，也应隔离参考资产、限制候选 HDL 对测试层级和文件系统的访问，避免把信任放在一个字符串上。对测试与参考源码的可见范围按实际授权处理。

**内部通过谓词建议：**

```text
simulation_pass =
    compile_pass
    AND elaborate_pass
    AND verifier_report_valid
    AND test_completed
    AND checks_executed >= fixture_minimum_checks
    AND mismatch_count == 0
    AND no_fatal_runtime_error
    AND snapshot_id_matches_current_source
```

仿真运行到时间上限、没有输出、提前 `$finish`、零检查数、输出丢失，都不是自动 PASS。外部进程 watchdog 与测试台仿真时间上限同时存在，防止真实墙钟无限消耗。

第一阶段不要允许模型自行选择 `-ignore_assertions` 或将 Error/Fatal 降级的选项；这些选项确实存在，但会改变检查语义，不能拿来“修复”设计。[S6]

### 6.3 综合脚本只读 DUT，不读测试台

下面是**单时钟 counter 自测任务**的参考骨架；完整项目应由可信 manifest 填入路径与顶层，不接受模型生成 Tcl。

`trusted/constraints.xdc`：

```tcl
create_clock -name clk -period 5.000 [get_ports clk]
```

`trusted/run_synth.tcl`：

```tcl
file mkdir artifacts
file mkdir reports

if {[catch {
    read_verilog -sv [list rtl/solution.sv]
    read_xdc trusted/constraints.xdc
    synth_design -top counter -part xczu3eg-sbva484-1-e

    set clocks [get_clocks -quiet clk]
    if {[llength $clocks] != 1} {
        error "Expected one applied clock named clk"
    }
    set period [get_property PERIOD $clocks]
    if {abs($period - 5.0) > 0.000001} {
        error "Clock period does not match the trusted profile"
    }

    write_checkpoint -force artifacts/post_synth.dcp
    write_verilog -force artifacts/post_synth.v
} detail]} {
    puts stderr "HARNESS_SYNTH_FAILURE: $detail"
    exit 1
}

# Reports are collected separately from the synthesis success predicate.
# A report error must be recorded, not mislabeled as an RTL syntax error.
if {[catch {report_utilization -file reports/utilization.rpt} detail]} {
    puts stderr "HARNESS_REPORT_WARNING: $detail"
}
if {[catch {report_timing_summary -file reports/timing.rpt} detail]} {
    puts stderr "HARNESS_REPORT_WARNING: $detail"
}
exit 0
```

`synth_design` 的 `-top`、`-part` 和非工程模式由 AMD Tcl 文档说明；`create_clock` 的周期单位为 ns。[S7][S8] 当前脚本是单时钟夹具示例，不是多时钟、无时钟或全部公开题的通用约束器。

**通过检查至少包括：**本轮综合过程成功、日志不存在有效 ERROR、产生本轮非空网表/检查点、top/器件/时钟约束与可信配置一致。产物在进程启动前不得预先存在。完成标记由 Runner 生成，模型无权写；实际产物与源码快照绑定。

资源数据记录 LUT、FF、DSP、BRAM；WNS/TNS 记录报告所处阶段。没有有效时序路径或报告失败时填 `null` 并注明原因，不填 0。综合时序估计不能冒充布局布线后收敛。

### 6.4 不要把环境故障交给模型修 RTL

| 现象 | 归属 | 正确动作 |
|---|---|---|
| DUT 语法/端口错误 | `design` | 提取诊断，有限修复 |
| 公开测试功能不符 | `design` | 保留题意与首个失败证据，修逻辑 |
| DUT 在综合时被明确拒绝 | `design` | 修复后从编译重新验证 |
| Vivado 找不到、器件未安装、许可证失败 | `environment` | 终止并提示环境修复，不改 DUT |
| 推理 GPU OOM / 服务失联 | `resource` / `environment` | 记录配置和资源，停止或受控恢复 |
| 约束端口不存在 | 先核对接口与可信配置 | 模型漏端口则设计错；manifest 配错则环境/配置错 |
| 无法解析日志、缺检查结果 | `unknown` | `INCONCLUSIVE`，保存原日志，不假设成功 |

<a id="s07"></a>
## 07｜修复循环与上下文管理

### 7.1 推荐状态转移

```text
LOAD_TASK → VALIDATE_INPUT → GENERATE → EXTRACT → SNAPSHOT
                                             │
                                             ▼
                         COMPILE → ELABORATE → SIMULATE → SYNTHESIZE
                            │          │           │           │
                            └──────────┴───────────┴───────────┘
                                        设计失败
                                           ↓
                                    BUILD_FEEDBACK
                                           ↓
                                      CHECK_BUDGET
                                      │          │
                                   允许修复     不允许
                                      ↓          ↓
                                    REPAIR     EXPORT_FAILED
                                      ↓
                                   新快照 → 从 COMPILE 重来

全链通过 → CHECK_EVIDENCE → EXPORT_PASS
环境/权限/严重资源故障 → EXPORT_ERROR
取消或墙钟耗尽 → 终止相关工作 → EXPORT_ABORTED / BUDGET_EXCEEDED
```

### 7.2 对每轮修复的四项约束

**只改可写源码。**不能改题目、接口定义、时钟约束、测试台、Golden 或评测脚本。输出协议错误可以给 Agent 一次受预算控制的格式修正机会，但它也是一次模型请求；Baseline 没有这次机会。

**失败后重新起点验证。**编译修好不代表功能正确；综合修好也可能破坏先前仿真结果。只有同一快照完整通过，才能最终 PASS。

**保留最好版本，不保留最后幻想。**如果输出新版本后预算耗尽，不能沿用旧版本 PASS 给新代码。回退到旧快照时也只能引用那个快照对应的有效证据。

**无进展就停止。**连续两次提交完全相同的源码哈希且失败签名不变，可提前终止为 `NO_PROGRESS`；相似但不完全相同的错误不做过度启发式判断，仍受总预算约束。

### 7.3 内部配置示例

```yaml
profile: phase1_dev
track: rtl
execution:
  task_concurrency: 1
  eda_concurrency: 1
agent:
  max_semantic_repairs: 3       # 首次生成之外，最多修 3 轮
  max_model_requests_total: 6   # 语义、格式及允许的传输请求合计
  max_identical_failed_revisions: 2
baseline:
  max_model_requests_total: 1
  transport_retries: 0
  use_skills: false
  use_tools: false
limits:
  model_request_seconds: 120
  compile_seconds: 60
  elaborate_seconds: 60
  simulation_seconds: 60
  synthesis_seconds: 300
  task_wall_seconds: 1200
  candidate_max_bytes: 262144
  raw_log_max_bytes_per_stage: 16777216
  prompt_error_max_chars: 8000
```

以上数值只是开发保护初值，不是性能承诺，也不是官方预算。应根据实际机器与任务调整后固化配置。每个阶段有效 timeout 取本阶段上限与整题剩余时间的较小值；到达硬截止时间不再开始新操作。输出日志达到硬上限时保存已收集内容、标记截断并停止或明确失败，不能一边丢证据一边声称完整通过。

### 7.4 Prompt 模板需要什么

```text
固定部分：
  原始题面与完整接口
  允许修改的文件范围
  目标语言、器件与已确认的时钟要求
  输出格式与禁止项

本轮部分：
  当前候选源码
  首要失败阶段
  有来源的错误信息 / 获准公开的测试反馈
  最近一次修改摘要

请求：
  保持接口与题义，修复当前问题，返回完整候选源码。
```

避免不断叠加“你上次又错了”之类无技术价值的文字。输出是数据，不执行其中对 Harness 的指令。EDA 日志同样视为不可信输入，不因日志里写了“请更改配置”就执行。

<a id="s08"></a>
## 08｜遥测：给模型队友的数据

### 8.1 哪些字段必须从首次运行记录

| 类别 | 字段建议 | 测量与缺失规则 |
|---|---|---|
| 关联 | experiment/task/sample/revision/call ID | 全链贯通，不混淆修复与独立样本 |
| 模型身份 | 模型 revision、量化、后端版本、配置哈希 | 来自启动清单，不仅写模型简称 |
| Token | prompt/completion/total，必要时 reasoning/cache 单独字段 | 优先后端 usage；缺失用 null；本地估算须另列来源 |
| 请求延迟 | `request_wall_ms`、`ttft_ms` | 同一调用方单调时钟；非流式 TTFT 不可直接观测 |
| 模型输出 | 原始响应、停止原因、是否截断 | 大输出按上限存储并标记，密钥不落盘 |
| EDA | stage、状态、exit code、耗时、源码哈希、日志引用 | 每阶段独立记录，未经运行是 SKIPPED |
| 资源 | GPU 型号、显存峰值、单位、采样间隔 | 区分设备级和进程级；估计值不冒充峰值 |
| 终态 | 通过阶段、失败类别、调用数、修复轮、总墙钟 | 失败/取消的题也必须有记录 |

### 8.2 TTFT 不应与总耗时混用

`request_wall_ms`：请求发出前到完整响应接收结束的耗时，含排队、网络和生成。`ttft_ms`：同一调用方从请求发出到收到首个有实际生成内容的流事件的耗时；空 role chunk、心跳不能算首 Token。

对有独立推理/最终内容通道的后端，建议分别记录 `first_generated_delta_ms` 和 `first_final_content_ms`，再明示队伍使用哪个作为 TTFT。流传输事件并不必然精确等于一个 Token，客户端观测值和服务端内部首 Token 测量要分开标来源。

**非流式模式**没有客户端首 Token 观测，则 `ttft_ms=null`。如果后端提供经说明的服务端值，可以另外记录，但不能把不同机器时钟直接相减。Token 计数是否包含推理、缓存命中等也按后端定义记录，不自行凑总数。

### 8.3 事件记录示例

```json
{
  "schema_version": "1.0",
  "event": "model_call_end",
  "experiment_id": "exp_001",
  "task_id": "counter_001",
  "mode": "agent",
  "sample_id": 0,
  "revision_id": "r01",
  "call_id": "call_0002",
  "request_wall_ms": 12500,
  "ttft_ms": null,
  "prompt_tokens": null,
  "completion_tokens": null,
  "usage_source": "unavailable",
  "finish_reason": "stop",
  "success": true
}
```

数值仍为示例。事件时间用 UTC 时间戳便于排序，持续时间用本进程单调时钟，避免系统时钟调整产生负耗时。

### 8.4 这与队友的模型接口是否冲突

**通常不需要改变业务工具接口。**H 负责在 Adapter、Runner 和总控外围计时；R 负责 usage 可用性、流式能力与显存监测；M 消费统一 JSON/CSV 做对比。能否精确拿到 usage、TTFT、取消确认，由接口能力清单声明。

对外只增加可选 `metrics` / `capabilities` 元数据，旧工作流仍只读 `content/error`。严格 Schema 的消费者需要同步升级并测兼容，不可直接假设添加字段绝对无影响。达不到的测量标缺失原因，不阻止基本生成，但签收表必须列出缺项。

### 8.5 汇总不应误导模型选择

一轮完整 Agent 尝试里可以包含多次修复；它仍只算一个样本。要测内部实验的五次独立尝试，就新建五个 `sample_id`、隔离会话/输出和预算；正式 `pass@k` 以官方细则实现，不能把修复次数当 k。[S1 §3.1.2][S3]

一期先报告 `baseline_one_run_success`、`agent_one_run_success`、`repair_success_rate` 和各阶段成功数。每个比例写清分母；基础设施失败单列，同时保留全体任务结果，不能悄悄删除失败题以提高通过率。缓存状态、冷启动/热启动与运行顺序记录下来；不伪称所有时间分项相加必然等于整体墙钟。

<a id="s09"></a>
## 09｜最小权限与故障处理

### 9.1 一期不开放通用 Shell

一期核心需求只是落盘 RTL 和执行固定验证链；通用 Shell 会增加参数猜错、文件误改、路径越界和难以复现的空间。采用“固定 executable + 校验过的参数 + 可信工作目录”，比让模型自行生成命令容易测试。

Python `subprocess` 支持参数序列与超时，但进程树清理需要另外实现和验证。不要以为只给最外层 `subprocess` 设置 timeout，就一定清除了所有 Vivado/xsim 后代进程。[S9]

### 9.2 文件与进程的边界

| 区域 | 模型权限 | Runner 权限 |
|---|---|---|
| 公共题面 | 只读 | 只读 |
| 当前候选源码 | 通过受控提交接口替换 | 建快照并读取 |
| 测试台 / XDC / 评分脚本 | 不可写；读取按授权 | 只读 |
| Golden / 未授权隐藏资产 | 不提供给模型 | 仅在确有授权时由受信验证器使用 |
| 模型权重 / 服务配置 | 不可改 | 本地推理服务按需读取 |
| 日志 / 网表 / verdict | 可读经批准摘要，不可伪造 | 独立创建、校验与导出 |
| 宿主机其他文件 / 凭据 | 不挂载、不提供 | 不应需要 |

拒绝绝对路径、`..` 逃逸、链接跨界和 Windows 特殊路径形式；允许的内部相对路径经过规范化后再次核验。路径检查与文件打开之间也应避免被同一运行中的可写链接替换；优先用不可变快照和不共享写权限消除竞态。

生成 HDL 本身也可能请求文件访问或提前结束仿真。不要把正则筛掉几个系统任务当成完整沙箱；结合 OS 权限/挂载边界、资源上限、DUT 与评分资产隔离及可信验证器。第一阶段不把宿主主目录、密钥、Docker socket 等暴露给 EDA 进程。

### 9.3 DeepSeek Harness 的超时特别注意

公开工具文档指出：`timeoutMs` 字段本身是声明，执行 deadline 需要相应 timeout policy；工具还需要响应取消信号。[S5] 因此要同时做到：Harness 层超时策略确实加载、Runner 层终止真实进程树、模型服务取消被确认。只在 JSON 或 ToolDefinition 写一个数字不算验收。

### 9.4 失败处理表

| 故障 | 应做 | 不应做 |
|---|---|---|
| 模型输出为空或格式歧义 | 保存响应，Agent 可受预算修正；Baseline 原样失败 | 取不相关代码拼起来 |
| 日志太长 | 保存受限原日志，标记截断，反馈有限摘录 | OOM 或无记录地丢掉错误 |
| 接口超时 | 明确取消/停止，记录服务状态 | 默默多抽一个更好的答案 |
| 生成同一错误代码 | 无进展停止或耗尽预算 | 无限循环 |
| 测试台被改 | `POLICY_VIOLATION`，终止且保留证据 | 重新算哈希后当合法测试 |
| 综合报告缺字段 | null + 来源/缺失原因 | WNS=0、LUT=0 冒充实测 |
| 进程被取消 | 清理后代、落盘终态 | 丢失结果或输出旧 PASS |
| 不能识别错误 | `unknown` / `INCONCLUSIVE` | 硬归类为语法错误或自动通过 |

<a id="s10"></a>
## 10｜验收用例矩阵

> 下表所有数量与门槛均为内部建议。它验收的是工程能力，不替代官方评分。测试中的“预期”必须由开发者预先确认，不由被测模型自己决定。

### 10.1 工具链、证据与权限：全部属于阻断项

| ID | 用例与操作 | 合格标准 | 证据 |
|---|---|---|---|
| T01 | 正确手写同步计数器 | 编译/展开/仿真/综合均 PASS | 本轮日志、verdict、网表、哈希 |
| T02 | 缺少分号等已验证语法错误 | compile FAIL；后续 SKIPPED | xvlog 日志、阶段结果 |
| T03 | 实例化缺失模块 | elaborate FAIL；不运行 xsim | xelab 日志 |
| T04 | 错误复位/计数功能 | compile/elaborate PASS，simulation FAIL | 检查次数、首错证据 |
| T05 | 已在 2025.2 确认的综合失败夹具 | 前级按夹具预期，synthesis FAIL | 原始综合诊断 |
| T06 | 删除/破坏 top 或端口 | 拒绝接口不符或真实工具失败，不能换 top 绕过 | 接口校验/EDA 证据 |
| T07 | DUT 打印 PASS，但实际功能错 | 仍判 FAIL | 受信检查器 verdict |
| T08 | DUT 提前结束或检查数为 0 | 不得 PASS；FAIL/INCONCLUSIVE | 完成标志与检查数 |
| T09 | 无限仿真 / 挂起进程 | 到预算终止，后代清理，下一题可跑 | timeout 事件、进程清理记录 |
| T10 | 旧构建目录放入成功网表，再提交坏代码 | 新快照不得借旧产物 PASS | 独立构建目录与哈希 |
| T11 | 成功后修改一个字符再导出 | 必须重新验证或拒绝沿用旧 PASS | verification_key 变化 |
| T12 | 尝试写测试台、脚本、XDC | 拒绝，受保护文件哈希不变 | policy 日志、前后清单 |
| T13 | `../`、绝对路径、符号链接逃逸 | 全部拒绝，无越界写入 | 安全测试结果 |
| T14 | 注入任意 Shell/Tcl 参数或未知工具 | Schema/白名单拒绝 | 拒绝事件 |
| T15 | 工具缺失、器件或许可证异常 | 环境错误，不让模型盲修 RTL | doctor/错误分类 |
| T16 | verdict 缺失、日志乱码/截断影响判定 | INCONCLUSIVE 或 TOOL_ERROR，不得 PASS | 原始证据与缺失原因 |

### 10.2 模型、修复和指标

| ID | 用例与操作 | 合格标准 | 证据 |
|---|---|---|---|
| T17 | Mock 固定输出“错 → 对” | 确实产生新候选并重跑整条验证链 | 两轮快照和轨迹；只算控制流测试 |
| T18 | 真实模型修编译类故障 | 至少 1 个夹具在预算内全链 PASS | 调用原文、修改前后差异 |
| T19 | 真实模型修功能类故障 | 至少 1 个夹具在预算内全链 PASS | 首错反馈、复测 verdict |
| T20 | 真实模型修综合类故障 | 至少 1 个夹具全链 PASS；修后重跑仿真 | 综合反馈及全部复测记录 |
| T21 | 固定 5 道普通题，不人工修改 | 至少 3 道全链 PASS；含 1 道本轮保留题 | 题目清单、真实源码、逐题结果 |
| T22 | 超时、空输出、截断、重复失败输出 | 有界退出，终态准确，没有隐藏重抽样 | Adapter 与 Workflow 测试 |
| T23 | Baseline/Agent 配对运行 | 同服务和上下文；Baseline 一次请求/无工具/无技能 | 请求体、配置哈希、外部评分记录 |
| T24 | 非流式模型及缺 usage 后端 | TTFT/usage 为 null 并说明原因；无虚构数字 | 指标 JSON |
| T25 | 长日志、长历史输入 | 必要题面与接口保留，预算控制生效 | 上下文裁剪报告 |
| T26 | 完整运行 5 个 sample，各含若干修复 | sample 与 revision 分开，结果数恰当 | 汇总与原始计数一致 |
| T27 | 连续 10 道小批量任务 | 10 道均有终态，无串目录/漏日志/悬挂进程 | summary + manifests |

T18—T20 是修复能力测试，不计入自然生成准确率或官方增益。若真实模型不能通过某类夹具，说明该修复能力未验收；Mock 成功不能替代它。G1 签收要求这些核心修复类型有真实成功证据。

### 10.3 部署与交接

| ID | 用例与操作 | 合格标准 | 证据 |
|---|---|---|---|
| T28 | ROCm 本地模型真实请求与完整任务 | 至少 1 个模型真实执行，不是在线 API 或 Mock | GPU/后端日志、调用记录 |
| T29 | 典型与长上下文显存测量 | 数据含硬件、单位、配置、峰值采样；32 GB 目标风险明确 | 原始采样数据与摘要 |
| T30 | 预置依赖后断外网重启整个流程 | 模型加载、生成、EDA 和结果导出无需外网 | 网络配置、启动与运行日志 |
| T31 | 另一成员按 README 从干净运行目录复现 | 不改源码，完成 1 题 PASS、1 题修复与小批量 | 复现者环境清单与签收 |
| T32 | 未取得官方镜像/未测 R9700 | 明确 PENDING，不误写 OFFICIAL_READY | readiness 清单 |

### 10.4 哪些问题必须阻止签收

**硬阻断：**错误代码假 PASS、Baseline 偷重试、测试资产可改、无限运行、最终代码与证据不一致、只跑 Mock 却声称真实模型完成。这些不能以“模型准确率很高”抵消。

**覆盖不足但可透明记录：**尚未取得官方镜像、R9700 不可用、正式预算/反馈接口未公布。它们不会抹掉本地 G1/G2 已完成的证据，但会阻止 `OFFICIAL_READY`；要逐项记录，不能悄悄删除。

<a id="s11"></a>
## 11｜交付目录与验收操作

### 11.1 建议项目结构

```text
team-agent/
├── competition_requirements.md
├── docs/
│   ├── phase1_agent_implementation_guide.md
│   ├── phase1_agent_implementation_guide.html
│   ├── interfaces.md
│   ├── environment.md
│   └── acceptance_report.md
├── configs/
│   ├── dev.yaml
│   └── official_profile.pending.yaml
├── environment.lock.json
├── agent/
│   ├── task_loader.*
│   ├── model_adapter.*
│   ├── artifact_store.*
│   ├── eda_runner.*
│   ├── result_parser.*
│   ├── workflow.*
│   └── telemetry.*
├── plugins/
│   └── rtl/                  # DeepSeek Harness 适配层
├── scripts/
│   ├── doctor.*
│   ├── run_sim.tcl
│   └── run_synth.tcl
├── tests/
│   ├── unit/
│   ├── fixtures/
│   └── integration/
├── data/smoke/
├── skill/
│   └── README.md
├── model/
│   └── MODEL.md
├── serve/
├── run.sh                    # Agent 入口
├── run_baseline.sh
├── evaluate_pair.*
├── runs/                     # 运行产物，不是冻结的方案资产
├── Dockerfile
└── README.md
```

`.*` 表示按项目既有语言选择扩展名，不要求同时写 TypeScript 和 Python 两套业务逻辑。DeepSeek 适配层采用仓库需要的语言；EDA 子进程服务可用 Python，但只保留一份 Parser、状态与判定逻辑。

### 11.2 每题输出结构

```text
runs/<experiment_id>/<task_id>/
├── task.json
├── config_manifest.json
├── baseline/sample_000/
│   ├── request.json
│   ├── response.json
│   ├── generated/solution.sv
│   ├── evaluation/           # 外部评分，不反馈给模型
│   └── result.json
└── agent/sample_000/
    ├── events.jsonl
    ├── revisions/
    │   ├── r00/
    │   │   ├── prompt.json
    │   │   ├── response.json
    │   │   ├── rtl/solution.sv
    │   │   ├── logs/
    │   │   ├── stage_results.json
    │   │   └── manifest.json
    │   └── r01/...
    ├── final/solution.sv
    ├── artifacts_manifest.json
    └── result.json
```

`final/solution.sv` 只在确有候选时导出；失败运行允许保留 `best_failed_candidate`，不能让用户误当成功作品。不要共享 Baseline 与 Agent 的可写工作目录。

### 11.3 建议实现的命令入口

以下是**应实现的内部 CLI 合同**，不是本次已经交付的可执行程序；正式赛事参数格式仍待官方确认。

```bash
# 1. 预检
python -m rtl_agent doctor --config configs/dev.yaml

# 2. 不接模型，跑 EDA 夹具
python -m rtl_agent verify-fixtures --suite tests/fixtures

# 3. 单题 Agent
bash run.sh --task data/smoke/counter_001/task.json --out runs/demo_agent

# 4. 同次实验产出 Baseline 与 Agent
python -m rtl_agent evaluate-pair --suite data/smoke --out runs/paired

# 5. 执行阶段验收并输出报告
python -m rtl_agent acceptance --config configs/dev.yaml --out runs/acceptance
```

如果既有 Harness 以 Node/TypeScript 为入口，提供同等语义的命令即可，不为照搬名字额外建 Python 主控。`run.sh` 与 `run_baseline.sh` 保持可复现薄封装，不能各自偷偷实现不同题目预处理。

### 11.4 验收时实际怎么检查

**先看 doctor。**核对版本、器件、时钟和模型身份，再查是否存在 PENDING。不要先看最终绿灯。

**再看负例。**先运行 T02/T04/T07/T10，确认真能抓住语法错、功能错、伪造 PASS 和旧缓存；再运行正例。

**再看修复证据。**核对第一次错误、送回模型的反馈、代码变化和第二次真实工具调用。只有两份不同源码而无新 EDA 日志，不算修复通过。

**最后看交付哈希与复现。**把 final 源码放进全新的构建目录，用同一可信评测配置再次验证；它应与结果中声明的源码一致。另一成员按说明复跑，签收实际覆盖的阶段。

<a id="s12"></a>
## 12｜交给 Codex 的开发约束

### 12.1 每次派任务使用同一份约定

```text
先读取 competition_requirements.md 和本实施指南。
本轮只实现指定工作包，不扩展为多智能体、HLS 或前端项目。

在改代码前：
1. 识别项目实际入口、固定的 DeepSeek Harness commit、已有配置和测试。
2. 复用已有模块；接口变更先说明影响，不写第二套并行判定器。
3. 官方参数来自可信配置，模型无权覆盖。

在改代码时：
1. 所有真实模型与工具调用保留关联日志。
2. 错误、未知、跳过、超时与通过必须分开。
3. 不开放通用 shell，不修改测试台、约束或评分器来让题通过。
4. Baseline 只输入题目，一次生成，无技能、工具与重试。
5. 每次 RTL 修改重新完整验证，不复用不同快照的 PASS。

交付时：
列出改动文件、实现内容、执行过的测试及真实结果。
缺少 Vivado/GPU 时明确哪些测试未运行，不能编造验收通过。
给出复现命令与下一工作包的前置条件，不顺带重构未要求模块。
```

### 12.2 推荐分批提交给 Codex

| 批次 | 包含工作包 | 退出条件 |
|---|---|---|
| A | P00/P01 | 约束可检查、契约可验证、日志可关联 |
| B | P02/P03 | 手写正反例与最小权限 Runner 真实工作 |
| C | P04/P05 | 真实模型可调用、候选落盘与版本绑定正确 |
| D | P06/P07 | 双入口、真实反馈与自动修复闭环 |
| E | P08/P09 | 破坏测试通过、上下文与技能有界 |
| F | P10/P11 | 小批量、ROCm 离线复跑、另一成员签收 |

这不是要求一次实现完。每批只在已有证据基础上推进，避免 Codex 同时修改模型接口、工具命令、目录和评测判据，导致失败无法定位。

### 12.3 现在开始最值得先完成的三个产物

先有 `doctor` 和真实手写正反例日志，再有统一 `TaskSpec/StageResult` 与事件记录，再把一个本地模型接入同样链路。其余功能围绕这三项迭代，而不是先画复杂多 Agent 流程。

<a id="s13"></a>
## 13｜阶段签收表与待确认事项

### 13.1 阶段签收表

填写实测状态；本文件中的空项不代表已完成。状态使用 `PASS / FAIL / NOT_RUN / PENDING_EXTERNAL`，不要默认全部打勾。

| 检查项 | 门槛 | 状态 | 证据位置 |
|---|---|---|---|
| Vivado 2025.2 与目标器件真实验证 | G0 | NOT_RUN | 待填写 |
| EDA 正反例与可信 PASS 判据 | G0 | NOT_RUN | 待填写 |
| 模型/工具/结果 Schema 与遥测 | G0 | NOT_RUN | 待填写 |
| 最小权限和真实超时清理 | G1 | NOT_RUN | 待填写 |
| 真实本地模型与实际 Harness 集成 | G1 | NOT_RUN | 待填写 |
| 5 题 smoke 至少 3 题完整 PASS | G1 | NOT_RUN | 待填写 |
| 编译/功能/综合三类真实修复证据 | G1 | NOT_RUN | 待填写 |
| Baseline 一次生成、无工具/技能/重试 | G1 | NOT_RUN | 待填写 |
| 最终源码与验证快照严格匹配 | G1 | NOT_RUN | 待填写 |
| 10 题批量无漏题与无限挂起 | G2 | NOT_RUN | 待填写 |
| ROCm 本地模型真实运行 | G2 | NOT_RUN | 待填写 |
| 显存采样、长上下文与配置记录 | G2 | NOT_RUN | 待填写 |
| 断外网完整启动与复跑 | G2 | NOT_RUN | 待填写 |
| 另一成员不改源码可复现 | G2 | NOT_RUN | 待填写 |
| 官方基础镜像与评分接口 | OFFICIAL_READY | PENDING_EXTERNAL | 待官方配置 |
| 最终 R9700 / 32 GB 边界复验 | OFFICIAL_READY | NOT_RUN | 待目标环境实测 |

### 13.2 需要保留配置接口，不能自行猜定的内容

现有选题指南要求后续评分公式、判定阈值与预算以评分细则为准。[S1 §3.1.5.5] 本文不声称检索到了更晚的完整评分接口。

| 待确认项 | 第一阶段怎么做 |
|---|---|
| 官方基础镜像 tag/digest、挂载和入口协议 | 使用内部适配层，镜像发布后替换并复验 |
| 单题/总墙钟、采样与 pass@k 口径 | 开发值配置化，独立样本与修复轮先分开 |
| 隐藏测试反馈可见范围 | 默认不暴露；仅接授权的公开自测/反馈 |
| 多时钟、组合逻辑的统一约束方式 | 一期支持明确的单时钟夹具；其他输入明确处理 |
| ROCm、后端、最终 GPU 的具体组合 | 记录实际组合，按官方环境再测，不凭型号推断 |
| 许可证与离线沙箱的配置 | 跟随合法官方方式，不临时联网绕过 |

### 13.3 第一期结束后的正确结论形式

```text
第一阶段状态：PHASE1_DONE / MVP_LOCAL_READY / NOT_READY
实际运行环境：<OS / GPU / ROCm / model / Vivado / commit>
普通任务：<通过数 / 总数>
故障修复：<编译 / 功能 / 综合，各自通过数>
阻断性测试：<通过数 / 应测数>
Baseline 审计：<结果>
离线复现与另一成员复跑：<结果>
显存峰值：<数值、单位、采样方法与配置>
未覆盖事项：<官方镜像 / R9700 / 正式预算 / 其他>
下一阶段优先优化：<依据实际失败分布选择，不凭猜测>
```

<a id="s14"></a>
## 14｜依据与版本记录

### 14.1 规则与项目来源

**[S1] 官方选题指南（用户已提供的 `AMD赛题.pdf`）。**《全国大学生嵌入式芯片与系统设计竞赛’2026 FPGA 创新设计赛道选题指南（AMD）》。重点为 §2.5、§3.1.1—§3.1.6、§4.3；§3.1 位于印刷页 6—9，对应该 28 页 PDF 的物理页 9—12。用于确认工具链、器件、约束、本地容器、Baseline 和冻结规则；不是本文内部门槛的来源。

**[S2] 既有团队文件 `phase1_task_division.md`。**用于承接 Harness、模型和 ROCm 部署分工及“先跑通闭环”的目标。原文曾将修复次数与 pass@N 放在一起描述，本文已明确分开，避免后续统计混淆。

**[S3] 本项目 `competition_requirements.md` v1.0。**作为赛题摘要入口，建议与本文件一并放进仓库。其优先级低于正式官方文件；其中内部路线不是赛事强制要求。

### 14.2 技术实现核对资料

下列网页核对日期为 2026-09-14。DeepSeek Harness 页面指向可变分支，实施时必须锁定实际 commit；AMD 命令资料明确使用 2025.2 路径。以下资料支持 API 与命令用法，不替代赛题规则，也不代表已在本机实测。

**[S4] DeepSeek Harness 仓库与 Agent Loop 文档。**用于插件化结构、公共运行时、模型/工具循环的职责边界。

- https://github.com/deepseek-ai/deepseek-harness
- https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/core/agent-loop/README.md

**[S5] DeepSeek Harness Tools 与 Adding a Tool 文档。**用于工具注册、Guard、执行流水线、取消与 timeout policy 限制。

- https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/core/tools/README.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-tool.md

**[S6] AMD UG900，Vivado Logic Simulation 2025.2。**用于独立仿真流程、xvlog/xelab/xsim 和 Tcl 批处理选项。

- https://docs.amd.com/r/2025.2-English/ug900-vivado-logic-simulation/Vivado-Simulator-Quick-Reference-Guide
- https://docs.amd.com/r/2025.2-English/ug900-vivado-logic-simulation/xsim-Executable-Options

**[S7] AMD UG835，synth_design，2025.2。**用于综合命令、top 与 part 参数。

- https://docs.amd.com/r/2025.2-English/ug835-vivado-tcl-commands/synth_design

**[S8] AMD UG835，create_clock，2025.2。**用于主时钟与周期单位。

- https://docs.amd.com/r/2025.2-English/ug835-vivado-tcl-commands/create_clock

**[S9] Python 官方 subprocess 文档。**用于子进程、参数序列、返回码和超时；项目需按选定 Python 版本实测 Windows/Linux 启动行为。

- https://docs.python.org/3/library/subprocess.html

**[S10] Docker 官方 None Network Driver 文档。**用于断网络容器的网络边界与回环行为。

- https://docs.docker.com/engine/network/drivers/none/

**[S11] AMD ROCm Radeon Linux 支持矩阵。**用于核对实际 GPU、OS 与 ROCm 组合；不固定本文中的 ROCm 版本。

- https://rocm.docs.amd.com/projects/radeon-ryzen/en/latest/docs/compatibility/compatibilityrad/native_linux/native_linux_compatibility.html

### 14.3 版本记录

**v1.0 · 2026-09-14：**首次建立第一阶段实施与验收指南。补齐 P00—P11 工作包、数据契约、最小权限工具、真实验证判据、不可变快照、Baseline 审计、遥测口径、32 项验收用例与部署覆盖声明。

**文档生成验证边界：**本次交付为 MD 与 HTML 实施指南；未修改用户仓库中的 Harness，未运行真实 Vivado/ROCm/模型测试，所有验收状态保持待执行。文中代码及命令为参考骨架或拟实现接口，不能据此声称工程已经完成。
