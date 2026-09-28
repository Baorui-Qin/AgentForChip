# AgentForChip 第二阶段研发计划

## 1. 阶段目标

第二阶段目标是在第一阶段完成 AgentForChip 基础 Harness、EDA 调用链和 VerilogEval 测试环境的基础上，围绕 **Agent 推理能力、Agent 控制流程、Agent 工具与知识资产** 三个方向进行系统优化。

本阶段不改变统一实验底座，通过模块化分支开发和严格消融实验，分析：

1. Agent 相比 Baseline 的性能提升来源。
2. 不同 Agent 架构对于 RTL 自动修复任务的贡献。
3. 工具反馈质量、知识资产和 Skill 机制对于成功率的影响。
4. 如何在有限 GPU 资源下提高 Agent 推理效率和吞吐能力。

最终目标：

> 构建一个具有高成功率、可解释、可扩展的 RTL 自动设计与修复 Agent 系统。

---

# 2. 统一实验基础

## 2.1 基础代码仓库

所有开发均基于当前 GitHub 主项目：

```
AgentForChip Repository
```

当前仓库作为：

* Harness 基础框架
* VerilogEval 测试框架
* EDA 调用接口
* 日志系统
* 模型调用接口
* Benchmark 环境

的唯一实验基础。

禁止直接修改 master 分支。

---

## 2.2 统一测试集

第二阶段所有实验统一采用：

```
VerilogEval
```

作为主要 Benchmark。

所有优化必须通过同一测试集验证。

主要评价指标：

### 正确性指标

| 指标              | 说明             |
| --------------- | -------------- |
| pass@1          | 单次 Agent 尝试通过率 |
| pass@5          | 多轮修复后的最终通过率    |
| compile pass    | Verilog 编译通过   |
| simulation pass | 仿真通过           |
| synthesis pass  | 综合通过           |

---

### Agent 行为指标

| 指标             | 说明         |
| -------------- | ---------- |
| repair round   | 修复轮数       |
| tool calls     | 工具调用次数     |
| revision count | RTL 修改次数   |
| rollback count | 回退次数       |
| skill hit      | Skill 命中次数 |

---

### 性能指标

| 指标                | 说明         |
| ----------------- | ---------- |
| prompt tokens     | 输入 token   |
| reasoning tokens  | 思考 token   |
| completion tokens | 输出 token   |
| TTFT              | 首 token 延迟 |
| 总运行时间             | 单题完成时间     |
| GPU 显存占用          | 峰值显存       |
| token/s           | 推理速度       |

---

# 3. Git 分支管理方案

采用：

```
master
 |
 |---- thinker-coder-branch
 |
 |---- agent-flow-branch
 |
 |---- tool-skill-branch
```

模式。

---

## 3.1 master 分支

职责：

* 稳定版本保存
* 最终实验版本
* 比赛提交版本

规则：

* 禁止直接开发
* 所有修改必须经过验证后 merge

---

## 3.2 三个开发分支

### 分支 A

```
feature/thinker-coder
```

负责：

* Thinker/Coder 双模型架构
* 模型调用接口
* 上下文分配
* 推理预算调整
* GPU 调度优化

---

### 分支 B

```
feature/agent-flow
```

负责：

* Agent 状态机
* ReAct 流程
* 工具调用策略
* Feedback 处理
* Context compact
* Revision rollback

---

### 分支 C

```
feature/tool-skill
```

负责：

* 工具能力扩展
* Diagnostic Parser
* XSim 信息提取
* Waveform 分析
* Knowledge Base
* Skill 系统
* System Prompt 优化

---

# 4. 任务一：Thinker + Coder 推理架构优化

负责人：

## 模型架构

采用双模型协作：

### Thinker

模型：

```
Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf
```

职责：

* 任务理解
* RTL 分析
* 错误原因推理
* 修复方案规划

---

### Coder

模型：

```
SiliconMind-V1
```

职责：

* RTL 修改
* 代码生成
* Patch 输出

---

## 研究内容

### 4.1 单模型 Baseline

建立：

```
Qwen3-Coder
       |
       |
   RTL 修复
```

作为基础比较。

---

### 4.2 双模型协作

测试：

```
Thinker
   |
Analysis Plan
   |
Coder
   |
RTL Patch
```

比较：

* 成功率变化
* token 消耗
* 修复质量

---

### 4.3 上下文分配优化

实验：

| Thinker Budget | Coder Budget |
| -------------- | ------------ |
| 4k             | 4k           |
| 8k             | 4k           |
| 16k            | 4k           |
| 16k            | 8k           |

分析：

* 思考长度是否带来收益
* 是否存在过度 reasoning

---

### 4.4 模型切换优化

研究：

* 模型常驻显存
* CPU offload
* 快速切换
* 请求调度

目标：

提高：

* 单题吞吐
* 多题测试速度
* GPU 利用率

---

# 5. 任务二：Agent 流程优化

负责人：

## 核心目标

分析：

> Agent 为什么比 Baseline 强，或者为什么没有提升？

重点优化 Agent 决策链。

---

## 5.1 当前流程分析

统计：

* 模型是否真正调用工具
* 是否只是 reasoning
* 是否浪费上下文
* 是否跨题污染 context

---

## 5.2 工具调用策略优化

研究：

当前：

```
LLM
 |
自主决定
 |
Tool
```

优化：

```
Error Type
 |
Policy Router
 |
推荐工具
 |
Feedback
 |
Repair
```

例如：

Compile Error：

优先：

```
syntax parser
module checker
```

Simulation Error：

优先：

```
waveform
mismatch analysis
signal tracing
```

---

## 5.3 Context 管理

实现：

```
Long History
      |
 Context Compressor
      |
 Important State
      |
 Continue Repair
```

保留：

* 当前 RTL
* 最新失败原因
* 最优 revision
* 已尝试方案
* 未解决问题

---

## 5.4 Revision 回退机制

增加：

Best Verified Revision

机制：

```
Revision 1
 |
验证失败

Revision 2
 |
验证成功

保存 Revision 2

后续失败
 |
回退 Revision 2
```

避免 Agent 沿错误方向持续修改。

---

# 6. 任务三：工具、知识库、Skill 系统优化

负责人：

## 核心目标

提高 Agent 单轮调用成功率。

---

# 6.1 工具优化

重点：

提升 EDA Feedback 质量。

当前：

```
Simulation Failed
93 mismatch
```

优化：

```
First mismatch:
cycle 43

Signal:
counter

Expected:
15

Actual:
14

Related RTL:
counter.v line 38-46

Possible cause:
enable/reset logic
```

---

# 6.2 知识库建设

分为：

## Static Knowledge

内容：

* Vivado 2025.2
* SystemVerilog
* FPGA coding rules
* synthesis rules

---

## Diagnostic Knowledge

内容：

```
Error
 |
Cause
 |
Repair Method
 |
Example
```

例如：

```
Synth 8-439

Cause:
missing module

Repair:
check include path
ifdef condition
module declaration
```

---

## Experience Knowledge

来源：

真实 Agent 失败轨迹。

流程：

```
Failure
 |
Analysis
 |
Successful Repair
 |
Regression Test
 |
Skill Promotion
```

---

# 6.3 Skill 系统

目标：

将重复问题自动沉淀。

Skill 示例：

```
skills/

vivado/
 |
 synth_error/

simulation/
 |
 counter_mismatch/

systemverilog/
 |
 always_block_bug/
```

每个 Skill 包含：

```
README.md
trigger condition
solution procedure
example
verification result
```

---

# 6.4 System Prompt 优化

优化方向：

* 工具选择规则
* 修复策略
* 输出格式
* 失败处理
* 回退规则

避免：

* 无效思考
* 重复分析
* 无限修改

---

# 7. 三条路线联合实验流程

所有实验遵循：

```
修改分支

↓

VerilogEval 测试

↓

自动记录日志

↓

分析指标

↓

生成实验报告

↓

确认有效

↓

Merge Master
```

---

# 8. Merge 前验证标准

任何分支合并必须满足：

## 功能验证

* Harness 正常运行
* VerilogEval 可重复测试
* 日志完整

## 性能验证

至少提供：

* Baseline 对比
* 当前版本对比
* token 消耗
* 时间变化

## 消融实验

证明：

该修改带来的提升来自：

* 模型架构
* 流程优化
* 工具增强
* Skill 知识

而不是随机波动。

---

# 9. 第二阶段最终交付目标

完成后形成：

```
AgentForChip V2

        |
        |
 --------------------
 |        |          |
Thinker  Agent     Knowledge
Coder    Loop      Skill
 |        |          |
 --------------------
          |
       Harness
          |
      VerilogEval
```

最终输出：

1. 可运行 AgentForChip V2 系统。
2. 完整 Benchmark 实验数据。
3. Ablation 实验报告。
4. Agent 架构分析文档。
5. 比赛提交版本。

---

# 10. 阶段核心原则

1. 所有优化必须基于统一 Benchmark。
2. 所有贡献必须通过实验验证。
3. 不追求复杂 Agent，而追求有效 Agent。
4. 工具反馈质量优先于增加模型思考长度。
5. 保持代码模块化，保证最终可以合并。
