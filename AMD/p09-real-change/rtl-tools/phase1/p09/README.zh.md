---
description: "有界修复上下文、离线技能和独立五题对照。"
kind: "package-reference"
---

# P09 上下文开发

[English](README.md) | 中文

## 概述

P09 支持人工审查修复，以及显式启用的冻结错误 DUT 自主修复。A 保留完整公开题面、当前源码与当前失败；B 最多增加两条事实历史；C 最多增加两条有证据的离线规则。这些是修复上下文对照，不是 P06 的无 Agent Baseline。默认模式仍要求每份生成候选都有独立的人工安全决定。

## 目录

- [Profile 与配置](#profile-and-configuration)
- [自动实验](#automatic-experiments)
- [请求与恢复语义](#request-and-recovery-semantics)
- [离线技能](#offline-skills)
- [证据与限制](#evidence-and-limitations)
- [参考资料](#references)
- [开发备注](#dev-note)

<a id="profile-and-configuration"></a>
## Profile 与配置

[rtl-p09 profile](../profiles/rtl-p09/cordis.patch.yml) 使用同一个修复应用、提供方和进程服务。[PowerShell](run.ps1) 与 [shell](run.sh) 包装只调用 dsh。随附配置不授予完整访问执行权限。覆盖层替换整个插件配置，不是合并单个嵌套字段。

[config.example.json](config.example.json) 指定组别、Token 限额、官方分词运行时和可选技能包。其中全零 manifest 摘要是刻意不可用的占位值。人工审查文本请求使用已安装的官方 Python 绑定，自动请求使用下文所述的固定版本官方 Rust 转换器与编码器。缺少依赖时停止请求，不回退到字符估算。

人工审查模式的分词清单包含 revision、package_version、tokenizer、tokenizer_sha256、template_sha256 和 package_files。路径相对于运行时根目录；package_files 将已安装的包文件映射到 SHA-256 摘要。辅助程序从 packages 目录导入，运行期间不下载资源。exact_local 度量的是冻结的本地实现，不代表已证明与云端 Token 口径一致。下列命令描述人工审查模式。

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

<a id="automatic-experiments"></a>
## 自动实验

repair 插件只在具备 P09 与有限循环配置时接受 `autoConfigFile`。执行还要求宿主拥有的 dsh 覆盖层显式设置 `allowUnisolatedAutomatic: true` 和完整访问策略。这是受限工具接口的执行授权，不是操作系统隔离。[决策记录](../../../.agents/notes/implemented/feature/2026-09-17-p09-autonomous-repair.zh.md) 说明了此取舍。核心 agent loop（智能体循环）与提供方传输保持不变。

自动配置指定 `registry`（minimal 或 full）、`campaignRoot`、`bucket`（preflight 或 ablation）、`sampleId`、`runtimeRoot`、`runtimeManifestSha256` 和 `maxToolSteps`（最多 15）。Rust 运行时清单固定 `revision`、`compiler`、`executable`、`tokenizer` 及相对路径 SHA-256 `files`，其中包含源码和依赖锁。可执行程序接受序列化请求文件和分词器文件，仅输出官方本地 Token 数。启动前和每次请求前都会检查运行时身份。

`start TASK` 校准宿主资产，从冻结错误源码开始并请求原生工具。`edit_dut` 接受一份接口兼容的完整 DUT 和预期修订号；`verify_rtl` 只接受该修订及固定测试集。编辑会清除当前验证状态，下一次编辑前不能跳过验证。完整注册表还公开 `read_current_rtl`、确定性的 `retrieve_skill` 和未验证结束 `finish`。最小冒烟运行只公开编辑与验证。宿主在绑定的四阶段 PASS 后终止并导出，模型文本不能宣布成功。

每个完整响应只能包含一个动作。截断参数永不执行，多动作整体拒绝。接受的编辑消耗语义修复预算，读取、拒绝动作和传输重试不消耗。每个返回的动作尝试都消耗工具步数预算。永久原子 claim 防止重复单元，跨进程派发票据将预验收限制为 150 次、主对照为 225 次、合计为 375 次。中断后交付不确定的请求保留票据，不能自动续跑。这些计数不是费用保证。

只有零响应内容的连接失败、超时和 HTTP 502/503/504 才允许按 1/2 秒退避重试两次。底层重试必须关闭。每次派发审计并计量同一份最终序列化请求体，包括 system、工具、回放所需推理字段及最近一对完整工具调用/返回。B 只增加事实，不增加推理文本。可选内容裁剪发生在审计前，发送器不会二次裁剪。自动状态/模型记录使用 schema 1.7，不重写历史状态。`report` 创建按证据分类的新快照，核对终态文件大小、哈希和完整性；清单排除自身。

候选检查拒绝预处理指令、字符串、转义标识符、层次/成员引用、文件访问、DPI，以及除 `$clog2`、`$bits`、`$signed`、`$unsigned` 外的系统调用。它刻意只支持狭窄的单模块子集，不支持任意 SystemVerilog。固定 EDA 命令使用现有凭据清除进程服务、资产哈希、超时、进程树回收和配额。按名称清除环境变量与源码检查都不是完整隔离；`full_os_isolation_verified` 始终为 false。

<a id="request-and-recovery-semantics"></a>
## 请求与恢复语义

宿主先检查完整验证回执，再选择模型可见诊断。必需内容永不截断。独立错误保留在核心内容中，已识别的后继汇总及警告为可选项。原日志证据不完整和提示视图缩减分别记录。输出协议要求在 BEGIN/DONE 标记内返回一份完整源码，提取器不修复代码。

示例采用 16384 Token 项目窗口、2048 输出 Token 和 1024 安全余量。解析后的提供方窗口可以进一步收紧它。预算作用于官方模板渲染后的完整请求，包括角色与 assistant 前缀。软限额分别为反馈 2048、账本 512、技能 768 Token。源码告警不允许截断当前 RTL。

三次语义修复与最多 15 次提供方尝试是不同限额。首次生成消耗后者。一个逻辑请求的多个修订共享两次传输重试。确认的上下文超限与完整响应包装错误，在每个实验中分别最多恢复一次。部分响应、截断、鉴权失败和取消不成为隐蔽重抽样。重复源码字节停止；源码变化但诊断 ID 相同不单独触发停止。

上下文在提供方配置解析后、发送前构建。附属记录保留输入、审计后的文本、序列化基础请求、计量来源及与提供方 usage 的差异。模型记录保持 1.1，验证记录保持 1.3，人工审查工作流状态为 1.6。原生 Harness Session 格式不变。

<a id="offline-skills"></a>
## 离线技能

[skills.draft.json](skills.draft.json) 含三条未验证的起始条目。普通实验不会将草案放入提示。显式 `validationSkillId` 预验收可在非主对照夹具上测试一条有哈希的草案，标为 `draft_under_test`，但不会将其晋升。已验证条目需要规则内容哈希、来源案例及有哈希的验证产物；选择依据观察到的错误标签，不依据题号或参考答案。模型仅接收规则、范围和限制，不接收证据文件。A/B 不读取技能包。

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
