---
description: "冻结的 VerilogEval 提示协议、经审查候选版本与三路线开发证据。"
kind: "package-reference"
---

# 三路线 RTL 开发对照

[English](README.md) | 中文

## 摘要

在固定的 Prob038_count15 上，对照 Baseline、Agent-Base 与 Agent-Domain 各一次独立生成。Baseline 进程不加载 Agent 或 EDA 服务。Agent 路线增加宿主验证和一次只读解读，不进行修复。真实生成要求原始评分器预检通过，执行要求绑定源码的人工审查。这些组件支持开发对照，不构成论文复现或正确率增益证明。

## 目录

- [协议](#protocol)
- [入口](#entry-points)
- [审查与发布](#review-and-publication)
- [证据](#evidence)
- [Model Experience](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)

<a id="protocol"></a>
## 协议

数据集版本为 `c498220d0a52248f8e3fdffe279075215bde2da6`。[protocol.ts](../../src/phase1/protocol.ts) 在读取公开提示或评分资产前检查固定的字节哈希。`protocol.json` 保留原始 system prompt、Question/Answer 包装、BEGIN/DONE 协议、可选规则、公开题面与哈希。首次准备请求时将解析后的提供方、模型、推理级别、温度和 Token 上限冻结到 `request-config.json`；后续漂移会在分派前失败。默认使用 `deepseek-flash`、temperature 0 和 maxTokens 2048。不发送 top_p，服务端有效值未知。

| 路线 | 生成请求 | 生成后行为 | 正常项目调用数 |
| --- | --- | --- | --- |
| baseline | 原始零样本 system 与 user 包装；无规则或示例 | 保存后停止；独立宿主评分，不反馈模型 | 1 |
| agent_base | system 与 user 内容完全等同于 baseline | 宿主审查、验证、只读解读 | 2 |
| agent_domain | 相同公共协议加冻结的五规则 system 块 | 相同审查、验证和解读模板 | 2 |

五条规则逐字来自固定版本的 [sv-generate](https://raw.githubusercontent.com/NVlabs/verilog-eval/c498220d0a52248f8e3fdffe279075215bde2da6/scripts/sv-generate)，涵盖 logic 声明、组合逻辑敏感列表、带位宽的非零常量、读取信号的 always 块和同步复位。本项目将它们追加到 system，上游追加到 user。协议产物记录此差异并保留原文。集成附带[上游 MIT 声明](../VERILOGEVAL-LICENSE.txt)。该块不包含本题答案或由运行结果产生的建议。

| 来源 | 采用的方法 | 排除的方法 |
| --- | --- | --- |
| [VerilogEval v2](https://arxiv.org/html/2408.11053v2) | 固定生成协议；独立外部评分 | 网络重试、宽松响应截取、论文模型或后端假设 |
| [AutoChip](https://arxiv.org/html/2411.11856v3)、[代码](https://github.com/shailja-thakur/AutoChip) | 区分模型调用、EDA 反馈和成本统计 | 搜索、迭代修复、混用模型 |
| [RTLFixer](https://arxiv.org/html/2311.16543v3)、[代码](https://github.com/NVlabs/RTLFixer) | 区分提取、编译和功能结果 | 规则式语法修正、RAG 与 ReAct 修复 |

这里使用 VerilogEval 零样本 Baseline，不是比赛的仅题面 Baseline。DeepSeek 官方流式 API 和 Windows Vivado 替代论文环境。两种 Agent 标签指确定性的宿主工作流，不表示自主工具选择或核心 agent loop。只读解读不能改善已经生成的候选。每条路线仅有一次独立采样，不能建立统计显著性。

<a id="entry-points"></a>
## 入口

[setup-profiles.ps1](../setup-profiles.ps1) 将两个示例 profile 安装到 `DSH_HOME`，默认 `D:/AMD/p05-home`；它拒绝覆盖内容不同的已有文件。使用前检查 [baseline](../profiles/rtl-baseline/cordis.patch.yml) 和 [agent](../profiles/rtl-agent/cordis.patch.yml) 配置：路径是本机 Windows 示例，Agent profile 明确为固定预检夹具或逐份获批候选启用完整访问。凭据保留在既有凭据服务中，不进入 YAML 或实验产物。

以下接口从仓库根目录运行。初始化和报告不调用 API。预检已用真实 Vivado 执行；生成、审查和验证续跑由 Loader/Mock 测试覆盖，但固定原始测试台的真实链路仍受兼容性问题阻塞，不能静默修改协议。

```powershell
./rtl-tools/phase1/setup-profiles.ps1
./rtl-tools/phase1/run.ps1 preflight
./rtl-tools/phase1/run_baseline.ps1 init
./rtl-tools/phase1/run_baseline.ps1 generate <experiment-uuid>
./rtl-tools/phase1/run.ps1 generate <experiment-uuid> agent_base
./rtl-tools/phase1/run.ps1 generate <experiment-uuid> agent_domain
./rtl-tools/phase1/run.ps1 verify <experiment-uuid> baseline
./rtl-tools/phase1/run.ps1 verify <experiment-uuid> agent_base
./rtl-tools/phase1/run.ps1 verify <experiment-uuid> agent_domain
./rtl-tools/phase1/run.ps1 report <experiment-uuid>
```

[run_baseline.sh](../run_baseline.sh) 和 [run.sh](../run.sh) 是等价的薄包装，不是 Linux Vivado 安装程序。[compare.ps1](../compare.ps1) 协调 `Generate`、`Evaluate` 或 `Report`；生成后退出等待审查，验证不重新生成。独立路线目录保留失败或中断的尝试。不能删除认领文件，通过重新采样来续跑。缺少成功的 `dataset-preflight.json` 时，所有真实生成均在模型尝试前被阻止。

预检使用独立编写的正确和错误 DUT，配合原始测试台与参考实现。测试台顶层为 `tb`，设计顶层为 `TopModule`，请求的仿真种子为 1，原始 10 ps 测试台时钟不变。仅用于 DUT 综合的 XDC 提供 5 ns 约束。PASS 要求进程与诊断事实正常，且唯一完整的 `Mismatches: N in M samples` 满足 M 为正、N 为零；TIMEOUT、致命诊断或证据截断都会拒绝通过。可信评分文件的编译错误属于环境故障，不是候选正确性证据。

<a id="review-and-publication"></a>
## 审查与发布

[candidates.ts](../../src/phase1/candidates.ts) 接受唯一完整标记区段，否则接受一个明确标注 HDL 的代码围栏或裸 HDL。标记区段内允许一层完整围栏。歧义区段、冲突代码块、不完整分隔符、空白或截断或超限输出、NUL 和非法 Unicode 均被拒绝。提取器保留源码子串，记录响应与源码哈希以及 UTF-8 字节范围，绝不插入 endmodule 或改变行为。声明检查器接受普通常量位宽 ANSI/非 ANSI 语法下的单个 TopModule，端口为 clk/reset 输入及四位 q 输出。不支持的形式不误标为编译错误；语法和功能判定由 Vivado 负责。

每条路线在 `revisions/<revision>/rtl/solution.sv` 下拥有新的 UUID 版本。操作方完整审查该确切源码的执行安全性后，在路线目录放置 `approval.json`：复制该版本 `candidate.json` 的全部字段，再添加 `approved`（布尔值）、`reviewed_at`（UTC ISO 时间戳）和 `note`（最多 2000 字符）。不接受其他字段。这是人工决定，不是自动生成的批准。审查时不修复代码，也不为重新采样而拒绝功能错误。拒绝的审批保留为路线结果。

宿主将审批绑定到实验、路线、版本、响应、源码与评分哈希，验证仅消费一次。全新干净快照绑定 DUT、原始测试台和参考实现、XDC、数据集版本、工具标识、配置与种子。导出前重新检查候选及全部快照资产。发布先刷盘私有临时文件，再以排他链接生成最终文件名并移除临时链接。导出中断且没有回执时保持未验证；已有输出绝不覆盖。只有哈希一致的四阶段 PASS 才具有 `final_verified=true`；失败运行可导出未变字节供检查，但标记为 false。只读源码属性和哈希用于防止或检测误改，不阻止对抗性操作系统写入。

<a id="evidence"></a>
## 证据

实验清单、候选、审批、路线事件和对照报告使用项目 schema 1.2。模型记录使用 1.1；验证器使用 [1.3 调用与归因证据](../language/README.zh.md)，保留 1.0/1.1 读取。专用校验器读取实验身份。不改变已发布的 Harness Session 格式。路线事件关联实验、题目、路线与调用用途；原生运行事件保留每次调用身份。路线事件总量与原生事件均有存储上限。部分发布保持未完成，绝不推断 PASS。

`comparison.json`、`comparison.csv` 和 `comparison.md` 是可从路线回执重建的视图，区分提取、审查、四个 EDA 阶段、导出与解读；JSON 包含哈希、检查数、失配数、资源和时序指标、告警、用量，以及独立的生成、评分、解读和审查耗时。调用数是项目尝试数，不是确认送达的 HTTP 数。缺失用量、价格、TTFT 或指标使用 null，不填零。可选且哈希匹配的 `preflight.json` 附加原始预检回执，呈现实验阻塞而不虚构模型失败。正的综合后 WNS 不代表布线后时序收敛。

[候选测试](../../tests/candidates.spec.ts) 和 [Loader 对照测试](../../tests/comparison.spec.ts) 属于现有 RTL 测试集，检查严格提取与发布、路线隔离、隐藏资产哨兵、1/2/2 次调用、生成提示完全一致、失败及拒绝尝试、配置漂移、旧 PASS 冒用、不可变导出与卸载清理。无需密钥的结果快照验证三路线阶段及调用汇总。上级文档的[验证命令](../README.zh.md#verification) 运行这些测试及原有仿真和综合回归。真实证据、Mock 证据与 API 观察必须分开。

<a id="model-experience"></a>
## Model Experience

生成只看到公开题面和冻结协议。独立 Baseline 不得加载 Agent、工具、子进程或技能服务，也不接收评分反馈。两种 Agent 解读调用共享一个模板，接收公开源码与有界事实，不包含测试台或参考实现内容。任何模型调用都不获得 shell/Tcl 能力或修改审批的权限。完整提示、响应和失败终态可从磁盘还原，无须将完整 EDA 日志返回模型。

<a id="known-limitations-and-deferred-work"></a>
## 已知限制与后续工作

本机 Vivado 对原始 Prob038_count15 的预检受 VRFC 10-3380 阻塞：测试台在声明前引用 tb_mismatch。两个手写对照均停在编译阶段。因此真实种子处理、功能评分及三路真实生成仍未验证；不隐含授权修改测试台或替换后端。本范围不验收自动修复、Agent 性能提升、完整操作系统隔离、本地推理及 ROCm、G1/G2 或比赛复现。审查后完整访问不适用于未经审查的恶意 HDL。

## Dev Note

[有界 RTL 验证事实](../../../.agents/notes/implemented/feature/2026-09-13-rtl-simulation-tool.zh.md)。
