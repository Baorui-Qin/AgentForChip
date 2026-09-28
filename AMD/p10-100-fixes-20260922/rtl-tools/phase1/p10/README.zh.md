---
description: "冻结 VerilogEval 选题，并在不调用模型的情况下预检原始评测器。"
kind: "package-reference"
---

# P10 评测器预检

[English](README.md) | 中文

## 摘要

P10 在消耗模型预算前，检查固定版本的本地 VerilogEval 评测器能否运行。它冻结按公开题面选出的十题及完整四十题扩展顺序，使用 Host 生成的纯端口转接模块测试未修改的 reference 和测试台。预检不是模型成绩，也不能授权候选导出。可评测题数为零时输出 NO-GO，模型两条路线和四十题 campaign 均保持未运行。

## 目录

- [Profile](#profile)
- [选题与身份](#selection-and-identity)
- [验证与报告](#verification-and-reports)
- [实现](#implementation)
- [模型体验](#model-experience)
- [已知限制与延后工作](#known-limitations-and-deferred-work)
- [开发说明](#dev-note)

<a id="profile"></a>
## Profile

[rtl-p10-preflight profile](../profiles/rtl-p10-preflight/cordis.patch.yml) 挂载子进程、会话投影及沙箱策略服务，不挂载模型服务。如果组合提供 LLM，预检插件会拒绝运行。唯一命令为 `preflight`，通过 dsh、此 profile 和完整的 Host overlay 启动。Profile overlay 替换整个插件配置，而不是合并其中字段。

Host 提供数据集、campaign、配置和冻结清单路径，以及有限的进程和产物限制。随附 profile 拒绝无隔离执行。明确获准的开发运行需要同时设置 `allowUnisolatedPreflight: true` 和完整访问策略。这些设置仅授权执行，不代表建立了 OS 隔离。Campaign 记录 `full_os_isolation_verified=false`。

<a id="selection-and-identity"></a>
## 选题与身份

数据集必须具有固定 NVlabs 来源、revision `c498220d0a52248f8e3fdffe279075215bde2da6`、干净工作树和 156 组 prompt/reference/test。每个资产均与 Git blob 核对，并记录原始字节 SHA-256。仅在 Git 明确声明 LF 转 CRLF 检出时，允许为 blob 身份比较转换换行；评测器字节和公开题面从不改写。其他内容变化会停止 campaign。

[选题规则](../../src/phase1/p10-dataset.ts) 仅为匹配折叠公开题面的空白和大小写，并按 task ID 顺序为各类别选择第一个尚未选中的任务。后续三十题按 `p10-verilogeval-v1:20260917:` 加 task ID 的 SHA-256 升序选取。选题先于 EDA。十题 manifest 使用独立哈希收据；selection-order.json 预先承诺四十项顺序，但不授权四十题运行。Prob038 是独立哨兵，不进入选题分母。

公开端口解析器支持命名 input/output 和常量数值位宽，包括位宽标注内部空白。不支持的声明会停止该题，不猜测接口。单个标量 clk 或 clock 输入对应 5 ns 真实时钟；没有此类输入时采用 5 ns 虚拟时钟。不支持多个已识别时钟。这是受限开发策略，不是官方 benchmark 时序配置。

<a id="verification-and-reports"></a>
## 验证与报告

Host 专用预检注册原始 reference/testbench 字节和纯 TopModule 到 RefModule 转接模块，复用普通 VerificationRunner 的 compile、elaborate、simulation，失败即停且不请求 synthesis。成功要求仿真完整结束、检查数为正且 mismatch 为零。即使预检成功，持久化记录仍未验证，不能成为四阶段候选 PASS。普通候选验证仍强制要求 synthesis。

报告区分 EVALUATOR_READY、TESTBENCH_COMPATIBILITY_BLOCKED、REFERENCE_COMPATIBILITY_BLOCKED、TOOL_ENVIRONMENT_BLOCKED 和 INCONCLUSIVE。原始诊断保留来源归因。不支持的公开接口记为 INCONCLUSIVE，没有 EDA 证据。JSON/CSV 结果、兼容性及错误分布表、轨迹索引和 GO/NO-GO 覆盖每个选中任务。没有模型派发时，模型状态为 NOT_RUN，逐路线 usage 为 null，空分母比例为 null 而非百分之零。

此入口从不自动启动模型或四十题 campaign。每个任务具有永久 claim，campaign 目录不可复用。执行前后核对源码/配置哈希和数据集身份。Harness 发生修改时需要单独冻结新 campaign，不合并结果。EDA manifest 在终态记录和日志关闭后生成；最终 campaign 归档还需要独立的完整文件大小及哈希审计。

<a id="implementation"></a>
## 实现

<details>
<summary>Host 专用实现</summary>

[p10-preflight.ts](../../src/phase1/p10-preflight.ts) 管理串行 campaign；[p10-dataset.ts](../../src/phase1/p10-dataset.ts) 管理确定性选题、公开接口和原始资产绑定；[p10-report.ts](../../src/phase1/p10-report.ts) 区分评测器结果和未运行的模型路线；[verification.ts](../../src/phase1/verification.ts) 与候选验证共享进程清理、诊断、配额和记录。核心 agent loop 和 HTTP 传输未修改。[决策记录](../../../.agents/notes/implemented/feature/2026-09-18-p10-evaluator-preflight.zh.md) 说明预检边界。

</details>

<a id="model-experience"></a>
## 模型体验

此 profile 不提供任何模型可见工具或请求。Reference 转接模块和校准收据仅为 Host 证据。[P09](../p09/README.zh.md) 描述另一个已有自主修复体验，但它的存在不能证明 P10 的生成或修复成绩。

<a id="known-limitations-and-deferred-work"></a>
## 已知限制与延后工作

已实现边界是评测器预检，而非模型对照 campaign。

- 模型对照仍属于另一个显式冻结的 campaign。预检本身继续不提供模型路线、修复工具或成绩授权。
- 评测器通过本身不构成 GO。独立四十题 campaign 之前仍需要完整十题对照和强制审计。
- 测试台/reference 兼容性修改、本地模型、ROCm、断网部署、完整 OS 隔离和实现级时序收敛不属于本次验收范围。

<a id="dev-note"></a>
## 开发说明

真实运行结果、启动失败和版本专属审计位于独立验证目录。测试及生成的转接模块不能替代真实评测器执行或模型证据。

## 经审查的兼容批次

独立的[兼容构建器](../../src/phase1/p10-compat.ts) 只接受十一份经审查的原始字节哈希。它在 `tb` 内整体搬动两行 net 声明，保留其他所有字节，并在数据集外发布派生 TB、统一差异、可逆行映射及来源元数据。[兼容预检](../../src/phase1/p10-compat-preflight.ts) 保持无模型运行，先记录仅调整声明顺序的探针结果，只有真实 xelab 诊断要求时才启用评测器专属 `1ps/1ps` 默认值，不覆盖显式 timescale。参考转接正例和独立错误 DUT 必须分别呈现预期仿真判据；二者都不是模型成绩。

[模型 profile](../profiles/rtl-p10-model/cordis.patch.yml) 提供 `generate <task-id>`、`compare <task-id>` 和 `repair-control <task-id>`。生成阶段只发起一次不含反馈或技能的纯文本请求；Host 分词器可以使用受管理子进程。对照阶段先评分不可变初始源码，再复用 P09 工具、分词器、已验证技能和诊断进行有界修复。Host 评分与生成使用独立命令。修复校准使用负例 DUT 副本，不进入模型成绩。所有评分读取同一份冻结派生评测器；仅 DUT 综合和 reference 依赖拒绝防止将校准转接模块当作候选。导出要求当前版本四阶段验证通过且源码哈希一致。

这些开发命令需要显式完整访问授权，并保留 `full_os_isolation_verified=false`。P10 对同一 wire 最多执行两次 transport retry，冻结退避为 1000/2000 ms；每个逻辑请求最多执行一次 output recovery。只有零响应字节的连接失败、502/503/504 和请求级 timeout 可以重试；用户取消和 1200 秒活动时限是终态。截断的文本或 tool call 永不执行；恢复请求保留模型、题目、源码和绑定反馈，并记录父请求与恢复请求 SHA。修复恢复采用下文的仅行动设置。恢复派发不增加 semantic repair。

`edit_dut` 被接受后，工具 schema 和 Host 校验只暴露并接受 `verify_rtl`，直至精确的新 revision 完成验证。有效 repair attempt 的持久化记录必须同时证明 Baseline 失败、模型收到绑定到被编辑源码的 live feedback、接受了源码 SHA 发生变化的 edit、新 revision 被验证，以及 Vivado `result.json` 的哈希已保存。独立的 [campaign 审计器](audit-p10-campaign.mjs) 会在共享初始 SHA 不同、计入的 attempt 缺少证据链或结果文件缺失时拒绝发布 repair gain。[run_p10_10.ps1](run_p10_10.ps1) 是固定十题的显式入口，启动时打印实现、legacy 路线状态、manifest 身份和冻结恢复参数。

Campaign 不会自动扩展兼容套件或授权四十题。新规则或协议变化需要单独冻结新批次。原始预检入口和历史结果保持不变。

## 全数据集兼容评测套件

仅供 Host 使用的[套件构建器](../../src/phase1/p10-compat-suite.ts) 接收经过 Git 校验的完整目录和显式、可复现的构建时间。[规则 001](../../src/phase1/p10-compat-rule.ts) 屏蔽注释与字符串，检查声明唯一性及完整已知模块前缀，再搬移两行已有完整声明。未匹配文件保持原字节；作用域或模板有歧义的题仍保留在清单中，标为待人工审查。静态匹配不代表 Vivado 判定。每题记录原始与有效 SHA、revision、规则版本、转换器源码摘要、diff 及可逆行映射。

无模型的[套件预检入口](../../src/phase1/p10-suite-preflight.ts) 使用 `calibrate` 构建两次并逐文件比较，随后执行 Prob005、Prob038 的仅声明前移探针及正负例校准。校准成功后由 Host 执行只读封存。`preflight` 要求封存记录和已验证的写入、新建、删除拒绝凭据，再使用原始固定十题清单，不重新选题。每次调用都有独立快照和构建目录。详细工具结果保存在不可变构建清单之外；未执行的题保持 `NOT_RUN`。

现有共享评测器加载器通过标记文件选择完整套件模式，拒绝未封存或已变化的资产，评分时不转换 TB 字节。Baseline 与 Agent 的快照和验证输入包含任务、上游 revision、兼容版本、有效 TB SHA、套件清单 SHA 和 Vivado 版本。此评测器迁移不改变 Agent 策略、提示词、技能、模型设置或修复预算。[套件决策](../../../../.agents/notes/implemented/bug-fix/2026-09-18-p10-full-compat-suite.md) 说明保守审查的取舍。

<a id="generation-stability-and-tool-evidence"></a>
## 生成稳定性与工具证据

[prepare-stability.ps1](prepare-stability.ps1) 创建固定十题的新批次，冻结源码、配置和评测资产哈希，并复用显式指定的正负例校准。[generation-stability.mjs](generation-stability.mjs) 接收批次目录、仓库目录和 `generation`、`compare`、`smoke` 或 `report` 阶段，仅通过现有 dsh profile 启动模型。生成先于对照；对照要求十题全部获得候选。首个任务耗尽 transport 重试窗口后打开断路器，等待冻结的 15 秒，执行一次独立计数的健康探针。探针失败时，后续题目保持未启动；成功时允许对同一道题执行 `resume-generate <task-id>`，默认最多续跑一次（`maxGenerationResumes`，上限两次）。完整或已有部分输出的响应不能使用此续跑机制。活动取消仍是终态。进程在终态记录前中断时须人工审查，不能自动重新生成。

生成保留一个逻辑请求、原实验身份、不可变的分窗口结果及全部物理尝试。续跑校验相同请求哈希和源码冻结。最新结果通过原子替换更新，不修改历史证据。已有候选永不重新生成；完整但非法的候选属于模型输出失败，不是重试机会。新稳定性入口独立于历史单次批处理，不修改旧实验。

每个模型运行包含 `transport.json`，记录请求准备、stream 调用、实际观测到的 HTTP 响应或 provider 活动、首次输出、usage、finish 和完整成功响应。旧 `dispatched` 仅表示调用 stream。本地产生的错误 finish 不算服务端活动。Node fetch 诊断只保存白名单网络错误码及 HTTP 状态，通过调用的异步上下文隔离。不可用的网络细节保持 null；没有 HTTP 观测不代表服务端一定没收到请求。

P10 写入 `tool-trace.jsonl`，记录可用和选中工具、接受或拒绝、版本变化、时间戳，以及 `HOST_INITIAL` 或 `AGENT_TOOL` 验证来源。阶段执行依据非版本检查的真实进程记录，并关联结果和仿真日志哈希、检查数及失配数。规范化 `feedback_sha256` 标识完整诊断收据；`feedback_projection_sha256` 标识实际序列化进请求的有界反馈。只有该请求产生可观测模型输出时才记录 `consumed_feedback_sha256`。这证明请求绑定和响应活动，不证明模型内部如何使用反馈。最终 PASS 后没有新模型调用，就不声称该反馈被消费。

报告分别展示候选获取、端到端完成评测和可评测模型表现。未启动或基础设施暂停的题目保留可见，不计为 DUT 错误；没有自然修复机会时修复率为 null。[决策记录](../../../.agents/notes/implemented/bug-fix/2026-09-21-p10-transport-evidence.zh.md) 说明采样和可观测性的取舍。

显式授权运行 `prepare-stability.ps1 -Forty -CampaignRoot <新目录>` 时，使用 SHA 固定的历史四十题清单及原始顺序。脚本校验并合并历史四组封存校准，不复用模型候选。`selectedTaskCount` 默认十题，只有显式四十题配置才允许访问后续题目。冻结的四十题配置允许两个独立 EDA 作业，批次最多 375 次模型 dispatch；终态模型输出失败不会阻止后续选定题目，但基础设施断路器不变。`all` 阶段先生成，再对合法候选进行对照；失败和未启动题目均保留在四十行分母中，不覆盖历史脚本和结果。

每次文本或工具请求在响应校验前增量写入 `stream.jsonl`，包含触发超限或拒绝的那个 chunk。文件保存有序、带时间的 Harness 规范化 provider chunk，不是原始 HTTP/SSE 字节。`reasoning.txt` 和 `output.txt` 提取接口返回的文本，包括部分响应；`transcript.json` 记录字节数、SHA-256、完整性及是否返回 reasoning。工具参数保存在流记录和组装的模型响应中，Host 执行结果保存在工具轨迹及验证产物中。无法取得未公开或内部思考，不保存凭据、请求头和不安全的传输异常文本。既有 token、字节和超时上限仍会终止请求，并明确标记响应不完整，不会将有限响应冒充无限制完整输出。

<a id="repair-v2"></a>

[证据恢复决策](../../../.agents/notes/implemented/bug-fix/2026-09-22-p10-evidence-recovery.zh.md)定义 repair-v3 实验。流封装大小不作为输出上限；token、响应字节与超时上限仍然有效。关闭思考的工具回合不会回放到思考模式，而是在下一次请求的事实核心中保留已持久化的 Host 工具结果。最近的工具结果也在压缩后保留。候选拒绝记录区分响应、提取/接口及 RTL 策略失败。

诊断完整性由保留的原始日志、源文件哈希、解析器上限和进程事实确定，而非受限的阶段摘要。展开阶段使用同一次运行中可信的编译源路径确定归属。只有完整的 DUT 过程驱动冲突及完全匹配的同次调用 XSIM 展开摘要才获得专用修复规则；未知错误、评测器错误及环境错误仍被阻塞。历史回放不能授权执行。

显式执行 `prepare-stability.ps1 -Hundred -PreflightRoot <calibrated-root> -HundredManifestSha256 <hash> -CampaignRoot <new-directory>` 要求唯一且由 SHA 固定的 `manifest-100.json`、一致的选题顺序，以及 100 条可评测的正负例校准记录。调用方在获得模型结果前冻结选题与排除项。此模式允许两个比较工作进程，并保留整个实验最多分发 375 次请求的全局上限。`selectedTaskCount` 最大支持 100，但默认仍为十题；仅存在清单不会扩大执行权限。

## 修复 V2

新批次冻结 `repairMaxTokens=16384`、`forcedActionMaxTokens=4096`、`repairMaxResponseBytes=262144`、`compactThreshold=0.8` 和 `maxRepairRounds=3`。初始生成仍使用独立的 `maxTokens=8192` 预算。这些是总输出 token 上限，不是独立的 reasoning token 配额。现有 provider 接口不提供 12000 token 流内行动截止点或强制工具选择标志。截断后切换到 `reasoningEffort=off`，移除 `finish`，要求一个完整工具调用并拒绝非行动响应；不能保证 provider 一定服从。恢复永不执行半截工具参数，也没有无限重试路径。

Action caller 使用固定分词器计量完整 wire。达到阈值或本地超限时，删除已完成的 assistant/tool 历史及可选诊断、Skill，然后重新计量。当前源码、源码 SHA、验证绑定、阻塞失败、最佳版本及事实修复/拒绝账本保持完整。明确的 provider 上下文超限错误允许每个逻辑请求压缩重试一次。必需核心仍放不下、取消、超时、dispatch 上限或工具步数上限仍会终止任务；compact 不重置任何预算。

仿真反馈保留有界的原始 XSim 提示、输出名、失配数和首次失败时间。已有 `build/wave.vcd` 提供最早失败时间附近最多三个时间戳级样本，包含顶层信号及配对的 `*_ref`/`*_dut` 输出，不暴露 reference 模块内部状态。支持的 XSim 子集要求 1ps timescale，并限制字节数、信号数及位宽。缺失或不支持的波形明确记为可选证据缺口，不改变判定。VCD 时间戳末尾的值可能不同于 testbench 在同一时间戳内采样的值。反馈不会编造周期、采样瞬间的 expected/actual 或根因。收据保留原始日志和波形哈希。

Host 在同一冻结评测器下保留证据最好的版本。完整 PASS 优于综合失败、仿真失配、展开失败和编译失败；仿真失配数只在样本数相同时可比较。候选退化或打平时，在下次编辑前恢复最佳源码、revision 和收据，并将候选 SHA 加入拒绝缓存。不可比较或不完整的证据会恢复原最佳版本，但停止并要求调查，不掩盖基础设施故障。每次决策都保留被拒绝候选和验证产物。`best-observed.sv` 是恢复产物，不是通过导出；只有绑定的最终 PASS 才写入 `final.sv`。`revision_decisions`、`rejected_revisions` 和 `context_compactions` 用于批次审计。[修复决策](../../../.agents/notes/implemented/feature/2026-09-21-p10-repair-v2.zh.md) 说明限制及验证范围。
