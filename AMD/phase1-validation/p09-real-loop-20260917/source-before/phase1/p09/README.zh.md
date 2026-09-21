---
description: "有界修复上下文、离线技能和独立五题对照。"
kind: "package-reference"
---

# P09 上下文开发

[English](README.md) | 中文

## 概述

P09 在现有人工审查修复工作流中增加确定性的请求视图。A 保留完整公开题面、当前源码与当前失败；B 最多增加两条事实历史；C 最多增加两条有证据的离线规则。这些是修复上下文对照，不是 P06 的无 Agent Baseline。每份生成候选都需要独立的人工安全决定。

## 目录

- [Profile 与配置](#profile-and-configuration)
- [请求与恢复语义](#request-and-recovery-semantics)
- [离线技能](#offline-skills)
- [证据与限制](#evidence-and-limitations)
- [参考资料](#references)
- [开发备注](#dev-note)

<a id="profile-and-configuration"></a>
## Profile 与配置

[rtl-p09 profile](../profiles/rtl-p09/cordis.patch.yml) 使用同一个修复应用、提供方和进程服务。[PowerShell](run.ps1) 与 [shell](run.sh) 包装只调用 dsh。随附配置不授予完整访问执行权限。覆盖层替换整个插件配置，不是合并单个嵌套字段。

[config.example.json](config.example.json) 指定组别、Token 限额、官方分词运行时和可选技能包。其中全零 manifest 摘要是刻意不可用的占位值。真实计量需要已安装的官方 Python 绑定、分词器、模板身份及哈希固定的运行时清单。缺少依赖时停止请求，不回退到字符估算。

分词运行时清单包含 revision、package_version、tokenizer、tokenizer_sha256、template_sha256 和 package_files。路径相对于运行时根目录；package_files 将已安装的包文件映射到 SHA-256 摘要。辅助程序从 packages 目录导入，运行期间不下载资源。exact_local 度量的是冻结的本地实现，不代表已证明与云端 Token 口径一致。

| 命令 | 行为 |
| --- | --- |
| freeze | 独占创建五题清单和 15 单元运行顺序 |
| calibrate TASK | 执行手写正反例，不请求模型 |
| start TASK | 校准资产，独立生成候选，然后等待审查 |
| start controlled_multi_round | 使用现有注入缺陷夹具与 P09 上下文 |
| approve ID SHA256 / reject ID SHA256 | 记录一份精确候选的安全决定，不执行候选 |
| resume ID / status ID | 继续已审批工作或读取状态，不重新抽样 |
| report | 新建含全部 15 个单元的 JSON/CSV/双语报告快照 |

每个实验冻结题目与配置身份。改变组别或配置会阻止续跑该实验。A/B/C 必须使用独立实验；汇总器拒绝重复题目/组别结果，而不是挑选有利样本。校准回执不是模型生成设计的结果。

<a id="request-and-recovery-semantics"></a>
## 请求与恢复语义

宿主先检查完整验证回执，再选择模型可见诊断。必需内容永不截断。独立错误保留在核心内容中，已识别的后继汇总及警告为可选项。原日志证据不完整和提示视图缩减分别记录。输出协议要求在 BEGIN/DONE 标记内返回一份完整源码，提取器不修复代码。

示例采用 16384 Token 项目窗口、2048 输出 Token 和 1024 安全余量。解析后的提供方窗口可以进一步收紧它。预算作用于官方模板渲染后的完整请求，包括角色与 assistant 前缀。软限额分别为反馈 2048、账本 512、技能 768 Token。源码告警不允许截断当前 RTL。

三次语义修复与最多 15 次提供方尝试是不同限额。首次生成消耗后者。一个逻辑请求的多个修订共享两次传输重试。确认的上下文超限与完整响应包装错误，在每个实验中分别最多恢复一次。部分响应、截断、鉴权失败和取消不成为隐蔽重抽样。重复源码字节停止；源码变化但诊断 ID 相同不单独触发停止。

上下文在提供方配置解析后、发送前构建。附属记录保留输入、审计后的文本、序列化基础请求、计量来源及与提供方 usage 的差异。模型记录保持 1.1，验证记录保持 1.3，人工审查工作流状态为 1.6。原生 Harness Session 格式不变。

<a id="offline-skills"></a>
## 离线技能

[skills.draft.json](skills.draft.json) 含三条未验证的起始条目。草案不会进入提示。已验证条目需要规则内容哈希、来源案例及有哈希的验证产物；选择依据观察到的错误标签，不依据题号或参考答案。模型仅接收规则、范围和限制，不接收证据文件。关闭技能时不读取技能包。

技能在实验期间保持冻结。validated 标签描述支撑证据与限制，不证明规则能提高生成准确率。不使用向量数据库、在线检索、总结模型或跨样本记忆。

<a id="evidence-and-limitations"></a>
## 证据与限制

五个内部任务使用显式的单个 SystemVerilog 编译单元，可信测试台在前、DUT 在后，并采用 5 ns 综合约束和种子 1。综合只读取 DUT。评分资产独立于 VerilogEval，Prob038 兼容性仍是单独的结论。

单测与 Loader 测试使用明确标注的 Mock Token 计数器，不能证明官方分词器可用。新的真实 API/EDA 证据、历史回放与 Mock 结果必须分开。正 WNS 是综合后信息，不代表实现时序收敛。观察到 Vivado 汇总 WNS 为 inf 且 TNS 为 0.000 时，返回 null、non_finite_wns 原因和警告，绝不转成零或宣称收敛。人工审批、哈希和路径检查不等于完整操作系统隔离。

<a id="references"></a>
## 参考资料

实现参考 [The Complexity Trap](https://arxiv.org/abs/2508.21433) 的观察遮蔽，而不增加模型总结调用。官方请求渲染与计量使用 [deepseek-recipe](https://github.com/deepseek-ai/deepseek-recipe/blob/main/docs/tokenizer.md)，部署须固定其提交、资产及许可证。两项参考都不提供 RTL 正确率保证。

<a id="dev-note"></a>
## 开发备注

真实验收、依赖可用性和待审批事项记录在独立验证目录中，不根据模板或测试存在来推断。普通仿真、综合与 P06 Baseline 入口不启用 P09。
