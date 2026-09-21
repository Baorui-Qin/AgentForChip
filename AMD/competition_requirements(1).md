---
title: AMD 2026 RTL/HLS 本地智能体设计赛道赛题纪要
file: competition_requirements.md
version: 1.0
updated: 2026-09-13
status: working-source-of-truth
official_source: "《全国大学生嵌入式芯片与系统设计竞赛'2026 FPGA 创新设计赛道选题指南（AMD）》3.1"
scope: "3.1 RTL/HLS 本地智能体设计赛道"
language: zh-CN
---

# AMD 2026 RTL/HLS 本地智能体设计赛道赛题纪要

> **用途**：本文件作为项目开发期间供 Codex、ChatGPT、团队成员和自动化工具查询的赛题要求纪要。  
> **优先级**：若本文件与赛事方后续正式文件、评分细则或通知冲突，**以最新官方文件为最高优先级**。  
> **重要说明**：本文严格区分“官方要求”和“团队当前技术路线”。不得把团队内部策略误认为官方硬性要求。

---

## 0. Codex / 智能体必须遵守的规则

在开发本项目时，Codex 或其他自动化智能体必须优先遵守以下规则：

1. **正式评测 EDA 工具链固定为 AMD Vivado / Vitis 2025.2。**
2. **RTL 正式综合目标器件固定为 `xczu3eg-sbva484-1-e`。**
3. **官方统一时钟约束为 5 ns。**
4. **最终模型必须能够完整容纳于单张 32 GB GPU 中，不允许跨卡。**
5. **正式评测环境不得假设存在 CUDA。最终部署目标为 AMD Radeon + ROCm。**
6. **正式 EDA 环境只保证 Vivado / Vitis，不得假设 Verilator、Icarus Verilog、Yosys 等第三方工具一定存在。**
7. **正式方案必须能够在断网沙箱中完成从读题到输出代码的全过程。**
8. **不得依赖运行时网络搜索、在线 API、远程模型服务或在线文档。**
9. **不得通过修改官方测试台、评分器、隐藏测试或参考答案来提高通过率。**
10. **正式评测窗口内不得修改方案代码、技能包或模型权重。**
11. **Baseline 必须绕过智能体与技能包，只输入题目、单次生成、不重试、不调用工具。**
12. **Baseline 与 Agent 必须使用同一推理服务和同一上下文配置。**
13. **RTL 必须按“可编译 → 仿真通过 → 可综合”的分级判定顺序理解。**
14. **不得仅以“代码能综合”代替“功能正确”。正式 RTL 功能判定依赖 xsim 与参考测试台逐拍比较。**
15. **不得把“5 ns 约束”擅自解释为已经完成实现后 200 MHz 时序收敛；若后续评分细则增加时序阈值，以官方新规则为准。**
16. **任何未知或尚未公布的规则必须标记为 `PENDING`，不得自行编造。**
17. **团队当前“RTL 优先”“使用 DeepSeek Harness”“采用确定性流程”等属于内部策略，不属于官方要求。**

---

# 1. 赛题一句话定义

本赛题要求参赛队伍在 **AMD Radeon 单卡、本地开源模型、ROCm、断网容器** 的条件下，构建一套能够自主完成硬件代码生成、EDA 验证、失败诊断与修复的智能体系统，并通过 AMD Vivado / Vitis 2025.2 对 RTL 或 HLS 设计进行正式评测。

核心不是单独比较“大模型会不会写 Verilog”，而是比较：

```text
Model
+ Inference Stack
+ Agent / Harness
+ Context Management
+ Tool Orchestration
+ Retry / Repair Strategy
+ Skill
+ EDA Feedback
+ Runtime Efficiency
```

组成的完整系统。

---

# 2. 官方核心考察目标

官方重点考察：

- 在一张消费级或工作站级 GPU 的算力与显存约束内运行本地开源模型；
- 利用自行设计的智能体和领域知识；
- 使用 Vivado / Vitis 的编译、仿真、运行与综合反馈；
- 提升硬件设计任务的分级通过率；
- 提升相对同模型裸跑 Baseline 的增益；
- 提高方案稳定性；
- 降低单题与整体墙钟时间；
- 把失败经验沉淀为可复用 Skill。

因此本赛题的核心评价对象是**完整智能体系统的工程能力与增益**，而不是单一模型排行榜成绩。

---

# 3. 必须包含的完整方案

官方要求方案至少包含以下五个组成部分：

| 组成 | 官方要求 |
|---|---|
| 模型 | 可本地部署的开源权重，须声明来源与版本 |
| 推理栈 | 推理后端及其服务配置 |
| 智能体 | 控制流、重试策略、上下文管理、工具编排 |
| 技能包 | 提示词模板、校验脚本、踩坑清单等领域知识 |
| 基线入口 | 绕过智能体与技能包的单次直接生成脚本 |

最终提交物应基于官方基础镜像构建为可复现方案，并能够在**断网沙箱**内自行完成：

```text
读取题目
  ↓
调用本地模型
  ↓
生成候选代码
  ↓
调用允许的工具
  ↓
读取工具反馈
  ↓
自动修复 / 重试
  ↓
输出最终代码
```

正式运行不应依赖人工改代码。

---

# 4. 两个独立 Track

## 4.1 RTL Track

目标语言：

```text
Verilog / SystemVerilog
```

开发阶段官方推荐数据集：

```text
VerilogEval v2
dataset_spec-to-rtl
https://github.com/NVlabs/verilog-eval
```

---

## 4.2 HLS Track

目标语言：

```text
Vitis HLS C++
```

开发阶段官方推荐数据集：

```text
HLS-Eval
https://github.com/sharc-lab/HLS-Eval
```

---

## 4.3 Track 排名关系

- RTL 与 HLS **独立排名、独立评奖**。
- 官方推荐队伍主要选择一个 Track。
- 若两个 Track 都做，则在两个榜单分别计分。
- 最终排名取两者中较高的一个。

> 团队当前选择：**优先 RTL Track**。  
> 这是内部策略，不是官方强制要求。

---

# 5. 正式评测题集

开发阶段可以使用公开数据集和自行补充的数据集。

正式评测阶段：

- 赛事方另备一套**赛前不公开的评测题集**；
- 于评测窗口向决赛入围队伍分发；
- 隐藏题集上的表现作为泛化能力的真实依据；
- 题量与具体构成赛前另行公告。

因此开发过程中必须防止：

- 针对公开数据集过拟合；
- 将公开 benchmark 题目写入 Skill 作为硬编码答案；
- 依赖人工针对正式题目临时调 Prompt。

目标应是提高**泛化成功率**。

---

# 6. 正式评测冻结规则

进入正式评测窗口后：

- 不得修改方案代码；
- 不得修改技能包；
- 不得修改模型权重；
- 提交材料 Hash 必须与作品提交阶段一致；
- 赛事方会使用队伍提交的容器和脚本抽查复现。

建议项目内部在冻结阶段同时冻结：

```text
model weights
quantization
inference configuration
agent source
prompt
skill
tool wrapper
parser
workflow
retry parameters
context parameters
container dependencies
run.sh
run_baseline.sh
```

运行时仅允许产生：

```text
logs/
results/
cache/
workspace/
temporary files
```

等非方案资产。

---

# 7. RTL Track 正式判定流程

RTL 采用**逐级递进判定**：

```text
Level 1
可编译
   ↓
Level 2
仿真通过
   ↓
Level 3
可综合
```

只有通过前一级才进入下一级。

---

## 7.1 Level 1：可编译

官方判定工具：

```text
xvlog
xelab
```

要求：

- `xvlog` 分析通过；
- `xelab` elaboration 通过。

因此 Agent 至少应能够识别并修复：

- Verilog / SystemVerilog 语法错误；
- 未声明信号；
- 位宽问题；
- 模块端口问题；
- 参数错误；
- elaboration 失败；
- 多驱动或其他导致 elaboration 失败的问题。

---

## 7.2 Level 2：仿真通过

官方使用：

```text
xsim
```

运行官方参考 Testbench。

要求：

> 与参考实现逐拍比对无差异。

因此：

```text
compile pass ≠ functional pass
```

代码仅能编译或仅能综合不能视为完成任务。

正式 Agent 必须把功能仿真作为核心验证环节。

---

## 7.3 Level 3：可综合

官方使用：

```text
synth_design
```

正式目标器件：

```text
xczu3eg-sbva484-1-e
```

要求：

```text
synth_design 产出网表
AND
无 ERROR
```

统一时钟约束：

```text
5 ns
```

注意：

- 5 ns 对应 200 MHz 的周期目标；
- 当前文件明确的是统一时钟约束和综合判定；
- 不得擅自将其扩展解释为“实现后必须已经完成 200 MHz timing closure”；
- 若后续正式评分细则增加 WNS、implementation 或其他时序阈值，以新规则为准。

---

# 8. HLS Track 正式判定流程

HLS 采用四级递进判定：

```text
可解析
  ↓
可编译
  ↓
可运行
  ↓
可综合
```

其中“可运行”要求：

```text
通过全部测试用例
```

HLS 四级均由：

```text
Vitis HLS
```

完成。

当前团队第一阶段不以 HLS 为关键路径，但 Harness 设计应尽可能保留未来扩展能力。

---

# 9. 正式 EDA 环境

正式判定统一使用：

```text
AMD Vivado / Vitis 2025.2
```

因此开发环境中的最终兼容基线必须是：

```text
Vivado 2025.2
Vitis 2025.2
```

不要把以下版本作为唯一正式验证依据：

```text
2025.1
2025.2.1
2026.1
其他版本
```

它们可用于个人实验，但最终必须在官方 `2025.2` 环境复现。

---

# 10. 第三方 EDA 工具的使用边界

官方固定 EDA 工具链只保证：

```text
Vivado
Vitis
```

**不保证提供第三方工具。**

因此开发阶段可以为了速度使用：

```text
Verilator
Icarus Verilog
Yosys
其他 lint / parser
```

但它们只能作为：

```text
development optimization
```

不能成为正式运行的不可替代依赖，除非最终方案自己合法打包并且官方规则允许。

为了最大兼容性，最终 Harness 必须至少能够只依赖：

```text
xvlog
xelab
xsim
synth_design
```

完成 RTL 正式主链。

---

# 11. GPU 与 ROCm 环境

RTL/HLS 本地智能体赛道使用 AMD Radeon 作为本地模型运行平台。

官方当前给出的平台：

## 11.1 验证窗口

```text
AMD Radeon PRO W7900
VRAM: 48 GB
Architecture: RDNA 3
gfx: gfx1100
```

用途：

```text
验证窗口云资源
```

---

## 11.2 决赛部署验证

```text
AMD Radeon AI PRO R9700
VRAM: 32 GB
Architecture: RDNA 4
gfx: gfx1201
```

因此模型选型不能只满足 W7900 48 GB。

最终必须以：

```text
single R9700
32 GB VRAM
```

作为部署上限来设计。

---

# 12. 单卡 32 GB 显存硬约束

官方明确：

```text
模型必须能在单张 32 GB 卡上完整容纳
```

不允许：

```text
tensor parallel across multiple GPUs
pipeline parallel across multiple GPUs
model split across multiple GPUs
```

即：

```text
NO MULTI-GPU MODEL SHARDING
```

官方不直接限制模型参数量，而以显存为约束。

官方给出的参考量级：

```text
32B 4-bit 约 18 GB，可以容纳
32B FP16 约 64 GB，无法容纳
7B FP16 约 14 GB，可以容纳
```

实际选型必须测量：

```text
model weights
+ runtime overhead
+ KV cache
+ context
+ temporary buffers
+ inference backend overhead
```

的真实峰值，而不是只看模型文件大小。

---

# 13. Context Length

官方不统一限制 Context Length。

队伍可以自行设定，例如：

```text
8K
16K
32K
64K
...
```

但必须在：

```text
MODEL.md
REPORT.md
```

中如实声明。

Context 是本赛题重要优化参数：

```text
context ↑
→ history capacity ↑
→ KV cache ↑
→ VRAM ↑
→ latency ↑
```

因此 Harness 应设计 Context Management，而不是无限保留完整 EDA 日志。

---

# 14. 开发阶段算力

开发阶段不限平台。

可以使用：

- AMD GPU；
- NVIDIA GPU；
- 学校服务器；
- 云 GPU；
- CPU；
- 其他可获取资源。

赛事方开发阶段不统一提供算力配额。

但最终方案必须能够迁移并重建到：

```text
ROCm
+
AMD Radeon
+
official container environment
```

---

# 15. 官方固定部分与队伍自主部分

## 15.1 赛事方固定

官方固定：

```text
基础镜像
EDA 工具链
题集
评分器
显存预算
时间预算
```

其中时间预算和其他具体数值以后续评分细则为准。

---

## 15.2 队伍自主

队伍可以自行设计：

```text
模型选择
量化方式
推理后端
推理服务参数
上下文长度
单次输出上限
完整 Agent / Harness
控制流
重试策略
回退策略
Context Management
Tool Orchestration
Prompt
Skill
是否微调
```

这些部分构成本赛题主要创新空间。

---

# 16. 模型要求

模型必须是：

```text
可本地部署的开源权重
```

必须声明：

- 来源；
- 版本；
- 或权重文件校验和。

允许：

```text
公开通用模型
硬件领域专用开源模型
自行微调的模型
```

---

# 17. 微调规则

允许微调。

若使用微调模型：

- 微调后的权重必须开源；
- 必须声明基座模型；
- 必须声明微调方法；
- 必须声明训练数据来源；
- 必须提供微调权重的开源地址。

赛事方不提供训练算力。

因此“是否微调”应通过实际收益决定，而不是默认作为第一阶段任务。

---

# 18. MODEL.md 必须记录的信息

`MODEL.md` 至少应包含：

```text
Model name
Model source repository
Model version / revision
Weight checksum (when appropriate)
Quantization method
Inference backend
Measured VRAM usage
Context length
Single-output token limit
Relevant runtime parameters
```

若使用微调：

```text
Base model
Fine-tuning method
Training data source
Fine-tuned weight source
```

注意：

```text
Measured VRAM ≠ theoretical estimate
```

应保存真实测试环境和峰值测量方法。

---

# 19. Baseline 是正式要求

必须提供独立：

```text
run_baseline.sh
```

其作用是测量：

```text
同一个模型
在没有 Agent / Skill 增益时
到底有多强
```

---

## 19.1 Baseline 与 Agent 必须保持一致的部分

Baseline 与正式 Agent：

```text
使用同一推理服务
使用同一上下文配置
```

---

## 19.2 Baseline 必须绕过的部分

Baseline：

```text
不得使用 Agent
不得使用 Skill
不得调用 EDA Tool
不得 Retry
不得自动 Repair
```

Prompt：

```text
只包含题目本身
```

生成：

```text
单次直接生成
```

---

## 19.3 Baseline 与 Agent 的关系

概念上：

```text
                    ┌──→ run_baseline.sh
Problem ────────────┤      ↓
                    │    Model
                    │      ↓
                    │  one-shot output
                    │
                    └──→ run.sh
                           ↓
                         Agent
                           ↓
                         Model
                           ↓
                          EDA
                           ↓
                         Repair
                           ↓
                       final output
```

赛事方据此计算：

```text
Agent gain over same-model baseline
```

---

## 19.4 同一次运行

官方要求 Baseline 与 Agent 结果：

```text
在同一次运行中产出
```

项目内部建议结果目录：

```text
results/
└── <problem_id>/
    ├── baseline/
    │   ├── output/
    │   ├── request.json
    │   └── metrics.json
    └── agent/
        ├── output/
        ├── trajectory/
        └── metrics.json
```

---

# 20. pass@1 与 pass@5

RTL 与 HLS 都要求同时报告：

```text
pass@1
pass@5
```

开发过程中必须严格区分：

```text
independent sample
```

与：

```text
repair iteration inside one agent run
```

不要把 Agent 内部的一次修复循环误计为新的独立 `pass@k` sample。

官方最终统计口径若有进一步细则，以后续正式文件为准。

---

# 21. 官方优化目标

官方明确提出：

1. 提高评测题集的分级通过率；
2. 尤其提高最终“可综合”通过率；
3. 缩小 `pass@1` 与 `pass@5` 的差值；
4. 提高方案稳定性；
5. 提高相对同模型裸跑 Baseline 的增益；
6. 降低单题墙钟时间；
7. 降低总墙钟时间；
8. 将失败诊断经验整理为可复用 Skill。

因此 Agent 不应只追求：

```text
最大推理深度
```

还必须平衡：

```text
success rate
stability
latency
VRAM
retry count
tool cost
```

---

# 22. 当前公布的评分权重

当前选题指南给出的权重：

| 评测项 | 权重 |
|---|---:|
| 能力：题集加权通过率 | 30% |
| 增益：相对同模型裸跑 Baseline 的提升 | 40% |
| 代价：墙钟效率 | 10% |
| 智能体与技能包的工程质量 | 20% |
| **合计** | **100%** |

重要结论：

```text
Agent gain = 40%
```

是当前已公布权重中最大的单项。

因此本项目不能只做：

```text
select strongest model
→ one-shot generation
```

必须证明 Harness / Skill / EDA Feedback 对同模型带来了真实增益。

---

# 23. 评分公式尚未完全公布

当前官方文件明确：

> 评分公式、判定阈值与各项预算的具体数值以后续本赛道《评分细则》为准。

因此以下内容当前必须标为：

```text
PENDING
```

包括但不限于：

- 正式题量；
- RTL / HLS 题型比例；
- 每题具体时间预算；
- 总时间预算；
- 显存统计方法；
- pass@k 的最终统计实现；
- 各判定等级具体加权；
- 超时处理；
- 崩溃处理；
- 多时钟题目的具体约束方式；
- 无时钟组合逻辑题如何应用统一约束；
- 是否进一步检查 implementation timing；
- 正式输入输出目录和文件命名协议；
- 正式评分器接口；
- 正式容器基础镜像 tag / digest。

Codex 遇到上述问题时：

```text
DO NOT GUESS
```

应该保留配置接口并等待正式规则。

---

# 24. Skill 技能包

Skill 是正式提交内容之一。

应包含可复用的领域知识，例如：

```text
Prompt templates
RTL design checklist
Simulation debug rules
Synthesis debug rules
Common Vivado errors
Sequential logic pitfalls
Reset rules
FSM design patterns
Width / signedness rules
Latch avoidance
Multi-driver diagnostics
Failure triage
Tool parsers / validation scripts
```

Skill 应优先来自：

```text
real failure
→ diagnosis
→ repair
→ repeated validation
→ reusable rule
```

而不是无依据地堆积长 Prompt。

---

# 25. Skill 的正确定位

Skill 不应成为：

```text
hidden benchmark answer cache
```

而应成为：

```text
general hardware engineering knowledge
+
validated failure-handling knowledge
```

对于每项重要 Skill，建议保存：

```text
source failure
applicable scenario
rule
usage
known limitation
validation cases
measured effect
```

---

# 26. 设计报告要求

官方设计报告至少应覆盖：

- 方案总体架构；
- 设计依据；
- 模型选择理由；
- 曾评估但放弃的候选模型及原因；
- Agent 控制流；
- Retry 策略；
- Fallback 策略；
- Context Management；
- Skill 的提炼过程；
- Skill 如何验证有效；
- 所选数据集上的实际测试结果；
- 失败案例分析；
- 哪类题仍然失败；
- 失败原因；
- 完整复现说明。

因此开发过程中必须持续保留实验数据和 trajectory。

---

# 27. 建议提交目录

官方参考目录：

```text
<team_name>-agent/
├── Dockerfile
├── model/
│   └── MODEL.md
├── agent/
├── skill/
├── serve/
├── run.sh
├── run_baseline.sh
└── REPORT.md
```

团队可以在 `agent/` 内进一步组织：

```text
agent/
├── harness/
├── tools/
├── parsers/
├── prompts/
├── policies/
├── workflow/
├── context/
└── config/
```

---

# 28. 推荐保存的运行证据

为了最后报告和问题定位，建议每题至少保存：

```text
problem id
original spec
model id
model revision
quantization
inference config
context length
random seed / sampling config
start time
end time
wall-clock time
peak VRAM
model calls
tool calls
retry count
generated RTL versions
xvlog result
xelab result
xsim result
synth_design result
final status
final code hash
trajectory
```

正式评测能否保留全部日志以官方接口为准，但开发阶段应尽量完整。

---

# 29. Harness 的正确职责边界

Harness 应主要负责：

```text
task loading
prompt assembly
model invocation
tool registration
tool execution
EDA feedback collection
log parsing
context compression
state management
retry control
policy enforcement
trajectory recording
result export
```

模型主要负责：

```text
理解 Spec
设计硬件逻辑
分析错误原因
提出修复方案
修改 RTL / HLS
```

原则：

```text
Harness extracts facts.
LLM reasons over facts.
```

不要把大量硬编码“修 Verilog 规则”直接写进 Harness，除非它们属于确定性的安全/流程约束。

---

# 30. EDA Feedback 处理原则

不建议把完整 Vivado Log 原样全部塞入模型上下文。

推荐：

```text
raw EDA log
   ↓
parser
   ↓
structured result
   ↓
priority filter
   ↓
LLM
```

例如：

```json
{
  "stage": "compile",
  "status": "failed",
  "errors": [
    {
      "file": "fifo.sv",
      "line": 73,
      "type": "syntax_error",
      "message": "..."
    }
  ],
  "warnings": [],
  "summary": "Compilation failed with one primary error."
}
```

同时保留原始日志供必要时查询。

---

# 31. 正式 RTL Agent 推荐状态机

与官方判定流程一致的基础状态机：

```text
LOAD_SPEC
   ↓
GENERATE_RTL
   ↓
XVLOG / XELAB
   ├── FAIL → DIAGNOSE → REPAIR ─┐
   │                              │
   └── PASS                       │
         ↓                        │
       XSIM                       │
         ├── FAIL → DIAGNOSE → REPAIR
         │                        │
         └── PASS                 │
               ↓                  │
          SYNTH_DESIGN            │
               ├── FAIL → DIAGNOSE → REPAIR
               │
               └── PASS
                     ↓
                    DONE
```

需要设置：

```text
max model calls
max repair rounds
wall-clock guard
context guard
fatal-error handling
```

具体预算当前为 `PENDING`。

---

# 32. 开发期与正式期必须分离

## 开发期可以

```text
使用 Verilator
使用 Icarus
使用额外 lint
人工查看日志
调 Prompt
调 Skill
调模型
调 Workflow
增加测试
修改 Parser
```

## 正式冻结后不可以

```text
针对隐藏题人工修改 Prompt
修改 Skill
修改 Agent code
修改模型权重
临时增加题目答案
修改评测文件
```

因此项目应有明确：

```text
DEV_MODE
OFFICIAL_MODE
```

并确保 `OFFICIAL_MODE` 不依赖人工干预。

---

# 33. 团队当前技术路线（非官方要求）

> 本节为团队当前内部决策，可根据实验结果修改。不得把本节内容描述为赛事硬性要求。

当前主线：

```text
Track:
RTL first

Agent framework:
DeepSeek Harness as initial base

Model architecture:
single local model first

Control:
deterministic workflow where practical

Repair:
EDA-feedback-driven limited repair loop

Skills:
small validated RTL skill library

Deployment:
ROCm + AMD Radeon

Official EDA compatibility:
Vivado / Vitis 2025.2

Expansion:
HLS after RTL end-to-end chain is stable
```

---

# 34. 团队第一阶段目标

第一阶段不是追求最终高分，而是打通完整链路。

必须实现：

```text
Spec
 ↓
Harness
 ↓
Local Model
 ↓
Generate RTL
 ↓
Write Workspace
 ↓
xvlog / xelab
 ↓
Parse Errors
 ↓
Model Repair
 ↓
xsim
 ↓
Functional Repair
 ↓
synth_design
 ↓
Parse Report
 ↓
Final RTL
 ↓
Trajectory + Metrics
```

第一阶段完成标准：

> 给一题未见过的 RTL 题，在不人工修改 RTL 的情况下，Agent 能够自主完成生成、编译、仿真、修复、综合，并输出结果和完整运行记录。

---

# 35. 当前 Harness 改造优先级（团队策略）

推荐优先级：

```text
P0  跑通原版 Harness
P1  接通本地模型推理接口
P2  接通官方 Vivado 2025.2 CLI
P3  xvlog / xelab wrapper
P4  xsim wrapper
P5  synth_design wrapper
P6  EDA log parser
P7  RTL system prompt
P8  immutable testbench / evaluator policy
P9  retry / repair workflow
P10 context compression
P11 Skill library
P12 benchmark automation
P13 ROCm / R9700 optimization
P14 optional HLS extension
```

第一阶段不要优先大改 DeepSeek Harness 的核心 `agent-loop`。

优先通过：

```text
tools
prompt
policy
parser
profile
workflow
```

扩展。

---

# 36. 项目中不得混淆的几个概念

## 36.1 Model Capability

模型本身能否根据 Spec 生成正确 RTL。

## 36.2 Baseline

同模型、同上下文配置、只给题目、单次生成、不使用 Agent / Skill / Tool。

## 36.3 Agent Capability

Harness + Skill + EDA Feedback + Repair 给同一模型带来的提升。

## 36.4 Repair Round

同一个 Agent run 内针对一个候选的修复。

## 36.5 pass@k Sample

独立采样/运行意义上的评测样本。

Repair round 不应自动等同于 pass@k 中新的 sample。

---

# 37. 推荐内部验收指标

以下属于团队建议指标，不是官方最终评分公式：

```text
compile_pass_rate
simulation_pass_rate
synthesis_pass_rate
pass@1
pass@5
baseline_pass@1
agent_gain
average_model_calls
average_repair_rounds
average_wall_clock
p95_wall_clock
peak_vram
tool_failure_rate
invalid_output_rate
timeout_rate
```

还应按错误类型统计：

```text
syntax
elaboration
functional
reset
timing-related
signedness
width
latch
multi-driver
unsupported construct
synthesis-only failure
agent/tool failure
```

---

# 38. Codex 修改项目时的开发纪律

Codex 修改 Harness 或赛题项目时：

1. 先读取本文件；
2. 明确改动属于“官方要求”还是“团队策略”；
3. 不得修改官方约束值以方便测试；
4. 允许把值配置化，但正式 profile 必须保持官方值；
5. 不得删除 Baseline 入口；
6. 不得让 Baseline 间接调用 Agent / Skill / Tool；
7. 不得假设网络存在；
8. 不得硬编码某一道 benchmark 答案；
9. 不得为了让测试通过修改 evaluator / testbench；
10. EDA 原始日志与结构化日志应尽可能同时保留；
11. 重要行为必须可复现；
12. 配置更改应进入版本控制；
13. 若官方规则未明确，使用配置占位并标记 `PENDING`；
14. 若新增第三方工具，必须确认正式容器是否允许并能够打包，否则只能作为开发辅助；
15. 优先避免修改 Harness 核心，尽量通过插件和工具层扩展。

---

# 39. 推荐正式配置常量

建议项目维护统一配置，例如：

```yaml
competition:
  year: 2026
  track: rtl

eda:
  vendor: amd
  vivado_version: "2025.2"
  vitis_version: "2025.2"
  rtl_compile:
    - xvlog
    - xelab
  rtl_simulator: xsim
  rtl_synthesis: synth_design
  part: xczu3eg-sbva484-1-e
  clock_period_ns: 5.0

runtime:
  network: disabled
  max_gpu_count: 1
  max_vram_gb: 32
  final_gpu: Radeon_AI_PRO_R9700
  backend_family: ROCm

evaluation:
  report_pass_at_1: true
  report_pass_at_5: true
```

未知预算不要自行填写：

```yaml
limits:
  per_problem_seconds: PENDING
  total_seconds: PENDING
  max_agent_steps: INTERNAL_CONFIG
```

---

# 40. 当前最关键的工程风险

## R1. 在 NVIDIA / CUDA 上开发成功，但 ROCm 不能运行

应尽早进行 W7900 / ROCm 验证。

## R2. 模型权重小于 32 GB，但真实运行超过 32 GB

必须测量包括 KV Cache 和 Runtime 在内的峰值显存。

## R3. Harness 依赖第三方工具，正式镜像不存在

正式主链必须适配官方 Vivado / Vitis。

## R4. Agent 能通过公开 benchmark，但隐藏题泛化差

Skill 必须提炼通用设计原则，避免题目答案记忆化。

## R5. Repair Loop 无限循环

必须设计 step / call / time guard。

## R6. EDA 日志吞噬 Context

必须做 Parser、错误筛选和上下文压缩。

## R7. Baseline 实现不合规

必须严格 one-shot、no-tool、no-skill、no-retry。

## R8. 评测冻结后方案仍会修改自身文件

正式运行应区分只读方案资产和可写运行目录。

## R9. 只关注 compile，而忽略功能仿真

正式得分链必须以功能正确为核心。

## R10. 过早做复杂多 Agent

第一阶段优先验证单模型 + 确定性控制 + EDA repair 是否带来稳定增益。

---

# 41. 尚待官方确认事项

以下项目必须持续跟踪赛事方后续公告：

```text
[PENDING] 正式评分细则
[PENDING] 隐藏题集题量
[PENDING] 题型构成
[PENDING] 单题时间预算
[PENDING] 总墙钟预算
[PENDING] 显存统计口径
[PENDING] pass@k 具体统计实现
[PENDING] 各级通过率的加权方式
[PENDING] 超时后的计分方式
[PENDING] 正式容器基础镜像 tag / digest
[PENDING] run.sh 输入输出协议
[PENDING] 评分器文件接口
[PENDING] 是否有额外 implementation/timing 指标
[PENDING] 正式验证窗口与测评窗口日期
[PENDING] GPU 云资源具体配额
```

一旦官方发布新文件，应更新本纪要版本。

---

# 42. Source of Truth 优先级

项目开发中的信息优先级：

```text
1. 最新赛事官方公告 / 正式评分细则
2. 最新官方选题指南
3. competition_requirements.md
4. 团队正式架构与决策文档
5. 实验记录
6. 聊天记录
7. Codex / LLM 自己的推测
```

如果第 7 项和前面任何一项冲突：

```text
LLM assumption loses.
```

---

# 43. 官方来源

主要依据：

**《全国大学生嵌入式芯片与系统设计竞赛'2026 FPGA 创新设计赛道选题指南（AMD）》**

重点章节：

```text
2.5 AMD Radeon PRO W7900 与 Radeon AI PRO R9700
3.1 RTL/HLS 本地智能体设计赛道
3.1.1 赛道简介
3.1.2 设计任务
3.1.3 设计与优化要求
3.1.4 优化目标
3.1.5 提交内容
3.1.6 赛程安排
4.3 GPU 云资源
```

开发阶段官方推荐公开数据集：

```text
VerilogEval v2
https://github.com/NVlabs/verilog-eval

HLS-Eval
https://github.com/sharc-lab/HLS-Eval
```

---

# 44. 版本记录

## v1.0 — 2026-09-13

首次建立长期赛题要求纪要。

已纳入：

- RTL / HLS Track；
- 隐藏题与冻结规则；
- Vivado / Vitis 2025.2；
- `xczu3eg-sbva484-1-e`；
- 5 ns 时钟约束；
- RTL 三级判定；
- HLS 四级判定；
- W7900 / R9700；
- 单卡 32 GB；
- 模型 / 推理栈 / Agent / Skill / Baseline；
- Baseline 合规规则；
- pass@1 / pass@5；
- 当前评分权重；
- 提交目录；
- 设计报告；
- 当前团队 RTL 优先策略；
- Codex 开发纪律；
- 尚未公布事项列表。

后续官方规则变化时，应新增版本记录，不要静默修改关键约束。
