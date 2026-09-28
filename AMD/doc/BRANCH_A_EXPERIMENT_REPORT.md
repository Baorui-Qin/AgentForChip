# Phase2 分支 A 模型部署与 Thinker–Coder 协作实验报告

**负责人**：队员 A（模型部署与协作策略）  
**开发分支**：`feature/thinker-coder`  
**实验日期**：2026-09-25 至 2026-09-28  
**任务范围**：`phase2.md` 第 4 章  
**数据集**：VerilogEval v2 spec-to-rtl  

## 摘要

本阶段完成了单模型、Coder-only Agent、Thinker→Coder 双模型、上下文分配以及模型驻留方式的对照实验。主实验使用同一组固定分层50题，所有条件共用本地 judge 和记账规则。

最终候选是 30B Q4_K_M Thinker + 8B Q4_K_M Coder，Thinker/Coder context 均为4k，单卡 GPU 同驻。该方案在固定50题上通过33题，通过率66%；同一8B Coder的Coder-only Agent通过23题，通过率46%。逐题比较得到11题改善、1题退化，双侧精确二项检验约为`p=0.0063`。

上下文实验没有发现更长context带来稳定收益。30B→4B条件下，4k/4k、8k/4k、16k/4k、16k/8k的通过率依次为54%、52%、54%、46%。Thinker实际平均输入约229 token、输出约350 token，未接近4k上限。

部署实验中，30B+8B GPU同驻稳态耗时约6.09秒/任务，观测峰值显存25.47GB；串行换权重为21.06秒/任务，CPU offload为36.81秒/任务。因此，同驻适合作为32GB目标卡上的首选，另外两种方式只保留为显存不足时的降级方案。

## 1. 任务与实验问题

分支 A 负责回答以下问题：

1. 单模型能达到什么水平，能否建立可复现baseline；
2. Thinker→Coder是否优于同一Coder的单模型或Coder-only Agent；
3. 增加Thinker/Coder上下文是否提高RTL正确率，是否出现过度reasoning；
4. 双模型同驻、串行切换和CPU offload各自的显存与时间代价；
5. 在单卡32GB约束下，应把显存留给上下文还是更强的Coder。

## 2. 实验环境

### 2.1 推理环境

| 项目 | 配置 |
|---|---|
| GPU | 单张AMD Radeon PRO W7900类设备，`gfx1100` |
| 物理显存 | 51,522,830,336 bytes；实验设置30,000,000,000 bytes硬停止线 |
| CPU | AMD EPYC 9334 32-Core Processor，128 logical CPUs |
| 内存 | 540,696,494,080 bytes，无swap |
| 系统 | Linux 6.8.0-79-generic |
| 推理后端 | llama-server `0.5.0-dev`，GNU 13.3.0构建 |
| 并行方式 | 单卡、`--parallel 1`，没有多卡切分 |

模型如下：

| 角色 | 模型 | 量化 | SHA-256 |
|---|---|---|---|
| Thinker | Qwen3-Coder-30B-A3B-Instruct | Q4_K_M | `fadc3e5f8d42bf7e894a785b05082e47daee4df26680389817e2093056f088ad` |
| Coder | SiliconMind-V1-Qwen3-8B | Q4_K_M | `92f383be0980c2712fdff2bf6e0abe7452ee3f1641db32a55a1a5411fb96e332` |
| 上下文实验Coder | SiliconMind-V1-Qwen3-4B-T-2507 | Q4_K_M | 由各条件manifest记录 |

### 2.2 本地评测环境

| 项目 | 配置 |
|---|---|
| 本地系统 | Microsoft Windows 10.0.26200.9457 |
| 仓库 | `E:\fpga\rtlagent2026` |
| 分支 | `feature/thinker-coder` |
| 记录时提交 | `afd135e7ba5f6ec4c6d77e7c927c894327537801` |
| Vivado | 2026.1；任务目标版本为2025.2 |
| 目标器件 | `xczu3eg-sbva484-1-e` |
| judge | 仓库内Windows judge，调用`xvlog`、`xelab`、`xsim`，仿真通过后再综合 |

Vivado版本差异记录为最终复核项。本阶段没有把2026.1结果冒充2025.2官方成绩。

## 3. 数据集和判分口径

主实验采用任务集`veval-v2-spec-to-rtl-stratified-50-v1`。题目列表为`fixed50_v1.txt`，共50个互不重复任务，文件SHA-256为：

```text
cc9b7497b02e7686e71a08f0666e266f2d6ac8dfbf62b692f72d31ec11dd0972
```

所有对照使用同一任务列表。每题只保留一条首轮实验轨迹；已有题目录不覆盖，服务失败、工具错误或没有有效候选均记为unrun。通过率统一按`sim pass / 50`计算，unrun不从分母中扣除。

judge分级为：

- L0：未得到可评测RTL；
- L1：有RTL，但仿真未通过；
- L2：仿真通过，综合未通过或未得到有效综合结果；
- L3：仿真和综合均通过。

报告中的`sim pass`等于L2+L3。没有改动`solution.v`中的设计逻辑，也没有用其他条件的生成物补题。

## 4. Agent使用方法

### 4.1 三个对照条件

| 条件 | 模型和控制流程 |
|---|---|
| C0：8B direct | 不使用Agent工具链，8B根据题面单次生成RTL |
| C1：8B Coder-only Agent | 不调用Thinker；8B进入最多3轮的生成、检查和错误反馈循环 |
| C2：30B→8B Agent | 30B先生成plan，随后8B使用题面、接口提示和plan进入与C1相同的最多3轮循环 |

C0/C1/C2使用同一个8B Coder服务和4k context。C1、C2的Coder输出上限均为2048；C2的Thinker输出上限为2048，允许一次continuation。采样参数固定为`temperature=0`、`top_p=1`。

### 4.2 Agent控制流

```text
仅C2：题面 → 30B Thinker → thinker.txt / plan
                               ↓
题面 + 接口提示 + plan + 上轮错误 → 8B Coder
                               ↓
接口检查 → lint/elaboration → synth
        ├─ 失败：截取错误日志，进入下一轮重新生成
        └─ 通过：接受候选
                               ↓
外部judge：xvlog → xelab → xsim → synth
```

Coder请求使用Verilog code prefill，并附加`/no_think`；8B服务同时配置`--reasoning off --reasoning-budget 0 --reasoning-format none`。这样可以避免模型把RTL写入reasoning字段、正文却为空。适配层仍保留`reasoning_content`回退，并在trace中记录实际读取字段。

每题保存plan、manifest、trace、token、时延和工具日志。发生接口、lint/elaboration或综合错误时，错误摘要会回传Coder。综合通过后Agent接受候选，xsim功能错误由外部judge发现，目前不会进入下一轮修复。因此，本报告中的Agent是“规划 + 静态检查/综合反馈”流程，不是完整的功能仿真闭环修复。

## 5. §4.1–§4.2：baseline与双模型协作

### 5.1 固定50题主结果

| 条件 | Pass | Fail | Unrun | 通过率 | 完整summary平均时间 |
|---|---:|---:|---:|---:|---:|
| 8B direct，4k/2k | 19 | 28 | 3 | 38% | 28.83 s |
| 8B Coder-only Agent，4k/2k | 23 | 27 | 0 | 46% | 88.68 s |
| 30B→8B Agent，4k/4k，输出各2k | **33** | 14 | 3 | **66%** | 117.18 s |

8B direct的19个通过样本中，18个达到L3，1个为L2。C1的23个和C2的33个通过样本全部达到L3。因此，C2的提升没有依赖“仿真通过但综合失败”的样本。

C0和C2各有47个完整summary，表中时间按可用summary求均值。缺失summary没有补算，也没有用于缩小正确率分母。

### 5.2 逐题配对

C1与C2的逐题结果如下：

| 配对状态 | 题数 |
|---|---:|
| C1、C2共同通过 | 22 |
| C1失败、C2通过 | 11 |
| C1通过、C2失败 | 1 |
| C1、C2共同失败 | 13 |
| C1有判定、C2 unrun | 3 |

在两边都有pass/fail判定的47题中，C2净增加10题。对12道结果翻转题做双侧精确二项检验，`p≈0.0063`。在本实验合同下，30B Thinker为8B Coder带来了可重复的正向增益。

C0→C1为4题新增通过、1题退化，另有3题C0 unrun。Agent外壳对8B有一定帮助，但证据强度低于C1→C2。

### 5.3 单模型参考

30B direct使用16k context、4096输出上限，在同一固定50题上通过22题，通过率44%，其中21题达到L3。它的上下文和输出预算与8B主对照不同，因此只作为单模型能力参考，不参与C1→C2的严格归因。

## 6. §4.3：上下文分配实验

上下文消融使用30B Thinker + 4B Coder和同一固定50题。

| Thinker/Coder `-c` | Pass | Fail | Unrun | 通过率 |
|---|---:|---:|---:|---:|
| 4k/4k | 27 | 23 | 0 | 54% |
| 8k/4k | 26 | 24 | 0 | 52% |
| 16k/4k | 27 | 22 | 1 | 54% |
| 16k/8k | 23 | 24 | 3 | 46% |

固定Coder 4k时，Thinker从4k增加到8k和16k，通过率为54%、52%、54%，没有单调变化。固定Thinker 16k时，Coder从4k增加到8k，通过率由54%降至46%。

三档Thinker平均输入约229 token、输出约350 token，均一次完成，没有触发续写。当前题面和plan协议没有消耗4k以上的context。配置更大的`-c`只增加容量，并不会自动产生更长、质量更高的推理。

这组实验支持停止64k/128k扩展。现阶段应把显存用于更强Coder，只有trace显示输入、历史或工具反馈逼近4k上限时，再扩大context。

## 7. Coder规模对比

30B→4B与30B→8B在4k/4k、固定50题、相同输出上限下的结果为：

| Coder | Pass | Fail | Unrun | 通过率 |
|---|---:|---:|---:|---:|
| 4B | 27 | 23 | 0 | 54% |
| 8B | 33 | 14 | 3 | 66% |

逐题比较为9题由4B失败变为8B通过、2题由4B通过变为8B失败，另有3题8B unrun。只统计11道结果翻转题，双侧精确检验约为`p=0.065`。结果支持优先选择8B Coder，但尚不足以把“8B必然优于4B”写成无条件规律。

## 8. §4.4：驻留、快速切换和CPU offload

本节是部署微基准，不参与RTL通过率统计。三种策略使用同一个`Prob100_fsm3comb`请求、相同4k/4k context、`temperature=0`和`top_p=1`。Thinker/Coder输出上限固定为128/256，每种策略运行3次；首次请求单列，后两次取稳态均值。

| 策略 | 启动或切换时间 | 首题耗时 | 稳态耗时/题 | 观测峰值显存 |
|---|---:|---:|---:|---:|
| 30B+8B GPU同驻 | 冷启动5.21 s | 6.62 s | **6.09 s** | 25.47 GB |
| GPU串行换权重 | 30B 4.99 s + 8B 3.09 s/题 | 20.27 s | 21.06 s | 19.49 GB |
| 30B CPU + 8B GPU | 冷启动4.31 s | 42.33 s | 36.81 s | **6.76 GB** |

串行换权重的稳态耗时约为同驻的3.46倍，CPU offload约为同驻的6.04倍。30B在GPU上的生成速度约116 token/s，在CPU条件约4 token/s；8B在GPU上约99 token/s。

显存在模型加载后、Thinker请求后和Coder请求后采样，表中为采样点最大值。固定请求使常驻方案可以复用prompt cache，而串行方案每题重新加载模型并丢失cache；这正是实际服务调度的差异，但该微基准不等同于纯算力测试。

固定50题运行中，30B+8B同驻的最高显存记录约25.51GB，与本节25.47GB的独立测量接近。实验在48GB卡上进行，只能说明观测占用低于30GB，不能代替真实32GB卡复核。

## 9. 历史实验的使用方式

早期实验的Agent版本、输出协议、上下文和失败记账方式不同，不与固定50题主结果直接比较。它们只用于检查趋势是否重复出现。

旧156题Agent合同中，4B direct、4B Coder-only Agent、30B→4B Agent分别通过73、67、71题；最后一组有69题unrun，不能据此证明Thinker稳定有效。更早的裸模矩阵中，B0、TC和DUAL的context变化也没有表现出单调收益。

旧DUAL结果曾因明细重复而出现超过100%的错误比率。重新按`cell+task_id`去重后，重复记录之间没有状态冲突，修正后的结果只保留在历史证据表中。旧批次同时改变了提示词、续写和输出协议，因此不能把其高分只归因于双模型。

不同合同反复出现的可靠趋势有两点：增加未使用的context没有稳定收益；Coder能力和输出协议比单纯扩大`-c`更值得优先投入。

## 10. 部署方案与阶段结论

分支 A 推荐以下开发候选：

```text
Thinker: Qwen3-Coder-30B-A3B-Instruct Q4_K_M
Coder:   SiliconMind-V1-Qwen3-8B Q4_K_M
Context: Thinker 4096 / Coder 4096
Output:  Thinker 2048 / Coder 2048
Deploy:  单卡GPU同驻，串行执行Thinker plan → Coder Agent
Limit:   运行时显存达到30,000,000,000 bytes立即停止
```

选择该方案的依据是：

- 与同一8B Coder-only Agent相比，30B→8B由23/50提高到33/50，逐题净增加10题；
- 4k以上context没有显示收益，继续扩大只会挤占显存；
- 同驻峰值约25.5GB，低于30GB开发限；
- 串行换权重和CPU offload虽然省显存，但时间代价明显。

按`phase2.md`原始第4章的开发研究口径，分支 A 已完成单模型baseline、双模型协作、上下文分配和三种部署方式的实验，并形成了明确的候选配置。

## 11. 结果边界和后续交付

本报告可以用于Phase2阶段汇报和模型部署决策，但不是赛事最终成绩。以下内容仍需在最终方案阶段完成：

- 对最终30B→8B Agent运行完整156题pass@1；
- 按官方采样协议补pass@5；
- 在真实单卡32GB环境复核显存和稳定性；
- 用Vivado 2025.2复核judge结果；
- 组装正式容器、`MODEL.md`、`serve.sh`、`run.sh`、`run_baseline.sh`和最终报告；
- 若要声称“多轮功能修复”，需把xsim mismatch回灌Agent，而不是只在外部judge中记录。

## 12. 证据索引

- 主实验聚合：`selftest/agent_a/report/PHASE2_FIXED50_ANALYSIS.json`
- 30B→8B三条件结果：`selftest/agent_a/phase2_30b8b_fixed50_operator_20260928/p3_queue_v4_full/`
- 各条件明细：条件目录下的`FIXED50_SUMMARY.json`和`FIXED50_DETAIL.csv`
- G0环境快照：`p3_queue_v4_full/g0_coder_only.json`、`g0_pair_c4k4k.json`
- §4.4原始数据：`selftest/agent_a/phase2_44_20260928/SECTION44_RESULTS.json`
- §4.4复现脚本：`selftest/agent_a/phase2_44_20260928/run_section44_benchmark.py`
- Agent实现：`selftest/agent_a/agent_protocol_v2_workspace/agent/main.py`
- 历史证据账本：`selftest/agent_a/report/PHASE2_HISTORICAL_EVIDENCE.csv`

## 13. 可直接用于周报的结论

本阶段在同一固定50题上完成了8B direct、8B Coder-only Agent和30B→8B Agent对照。30B→8B通过33题，较Coder-only Agent多10题；逐题结果为11题改善、1题退化。30B→4B四档上下文通过率为54%、52%、54%、46%，Thinker平均只输出约350 token，说明当前4k context已经够用。部署对照中，30B+8B GPU同驻稳态约6.09秒/任务，峰值显存约25.47GB，明显快于串行换权重和CPU offload。分支 A 因此选择30B Q4 Thinker + 8B Q4 Coder、4k/4k、单卡同驻作为下一阶段候选。
