# RT-01 仿真/综合网表语义分裂修复计划

日期：2026-09-27。状态：已实施交付 A，以及限定校准范围的交付 B；真实 Vivado 无模型正负例、综合注释探针和只读历史兼容性扫描已完成。未启动全量模型实验，未改写历史成绩。完整门禁存在环境失败，详见[修复报告](RT-01_Fix_Report.zh.md)和[项目状态](../doc/PROJECT_STATUS.zh.md)。

## 目标与边界

目标是阻止模型候选利用仿真/综合解释差异获得错误的最终验收，并用现有真实反例验证修复。计划分为 A「已知入口封堵」和 B「最终网表验收」两个可独立审查的交付，A 完成不能被表述为已经证明所有 RTL 与网表等价。

本次只处理 RT-01。不修改 Prob078 或其他参考/testbench 的已知逻辑问题，不调整模型、修复预算、context 或 rollback，不引入形式验证平台，不重跑全量 156 题模型实验。RT-02 未解决仍是整个 benchmark 正确性结论的限制。

基础约束：Baseline 与 Agent 使用相同规则；不删除综合指令后偷偷替模型修代码；不把源码改写后当作原候选评分；不覆盖历史源码快照、实验收据及结果。

## 已确认的实现事实

- `rtl-tools/src/phase1/p09-auto-policy.ts` 中的 `checkAutoSource` 先删除注释，无法看到综合工具解释的 meta comment。
- P10 初次生成、edit_dut 和 verify 前都调用该检查，适合复用一个修复点，不必改 core agent loop。
- `rtl-tools/src/synthesis.ts` 已输出 `write_verilog -mode funcsim` 的 `netlist.v` 和 `design.dcp`，不需要再运行一次综合来获得网表。
- 共享 `stages` 和诊断/评分代码按四阶段编写。不能只往数组增加一个第五阶段而不处理全部消费者。
- P10 报表和独立审计器直接使用 `initial_status`、`VERIFIED`、`recovered_by_agent`。只阻止 final.sv 写入，不能阻止报表继续计入假成功。

原始证据：[攻击源码](D:/AMD/redteam-20260923/attack.sv)、[旧四阶段 PASS](D:/AMD/redteam-20260923/eda/run-aB3LzE/result.json)、[恒零网表](D:/AMD/redteam-20260923/eda/run-aB3LzE/build/.rtl-synth-BYzIqO/netlist.v)。这些文件保持只读使用，不搬动、不重写。

## 执行步骤

### 1. 固定攻击样本和正常对照

工作：把原 RT-01 源码作为测试 fixture；新增正常导线、普通注释、组合逻辑、带 reset 的寄存器及合法 FPGA 初始化对照。记录旧行为的源码/产物 SHA，不依赖会变化的临时路径。

确认 Vivado 2025.2 接受的控制综合注释形式。官方 2025.2 示例不仅包含 `synthesis translate_off/on`，还包含 `synthesis off/on`，所以只封一个字符串不够。行注释、块注释、空白/换行、大小写及其他前缀的接受范围用文档与小型本地探针确认，不猜测所有工具的共同语法。

验证：原样本在旧证据中为四阶段 PASS 且网表输出恒零；正常导线的规格检查在 in=0、1 均通过。新的回归必须在修复前能够暴露缺口，不能仅测试任意自拟错误码。

### 2. 在候选入口拒绝有语义的综合分流指令（交付 A）

工作：在删除注释之前，按注释 token 边界识别实际指令。使用现有可复用词法能力；若没有，只实现必要的轻量注释扫描，不新建完整 Verilog 解析器。

规则范围：至少拒绝确认支持的 translate_off/on、off/on 综合控制指令；同时检查是否存在同类控制写法。full_case/parallel_case 等其他会改变综合假设的 meta comment 列入审核清单，按固定工具证据决定同批拒绝集合，不将一个关键词黑名单宣称为完整语义防线。普通说明文字和碰巧同名的标识符不能误触发。

处理方式：返回稳定的策略错误码及可追溯位置，不进入 Vivado；保留原候选字节和 SHA。错误进入既有 generation recovery / rejected action 记录，不能被记成工具崩溃，也不能计为一次接受的 semantic repair。沿用现有恢复次数和工具步数上限。

覆盖路径：首次生成、生成纠正、edit_dut、读取已有候选后验证。检查只针对不可信候选 DUT，不能把新的 DUT 限制误施加到可信 testbench/reference 的系统任务上。正式路径不得暴露“跳过策略检查”选项给模型。

主要文件：`rtl-tools/src/phase1/p09-auto-policy.ts`；必要时调整 `p10-model.ts` 对策略错误详情的日志投影。保持 `initial`、正常注释和既有纯计算系统函数政策不变。

验证：所有确认有效的分流注释写法被拒绝；普通 RTL 通过；generation/edit/verify 三条路径均不能绕过；被拒 edit 不增加接受修改计数、不会启动 EDA。回归 `p09-auto.spec.ts`、`p10-model.spec.ts` 及对应用户可见输出快照。

交付 A 的完成声明只能是「已知综合指令入口被封堵」，不能写成「仿真与网表永远一致」。

### 3. 校准一个独立、有界的 post-synthesis 功能检查器

工作：复用本次综合的 `netlist.v`，在独立构建目录中用 Vivado 的仿真库执行 post-synthesis functional simulation。复用现有 managed subprocess、timeout、日志和产物 quota，不引入未管理子进程或另一份综合实现。

执行输入由 Host 冻结：候选与网表身份、器件和 Vivado 版本、仿真库身份、测试序列、预期输出、reset/初始化与检查启动策略。只编译被验证网表，不得误把原 TopModule RTL 一起编入同一个设计。Tcl、工具路径和测试资产都不能由 Agent 提供。

校准顺序：先完成导线与简单组合电路；再完成带 reset 寄存器与允许的初始化行为。处理 GSR、glbl 和初始化差异时，显式记录测试启动条件。不能通过随意跳过前若干周期、忽略未知值或默认假定 reset 来“调到通过”。

第一组 oracle 使用公开规格独立产生：导线枚举 0/1；组合逻辑枚举小输入空间；时序逻辑明确输入稳定、复位和观察时点。迁移已有评测器时须有 Host 所有的版本化派生记录，不修改旧冻结 testbench。

新增检查结果使用独立版本化 receipt，至少包含：candidate_sha256、原四阶段 verification_key、netlist_sha256、evaluator/profile hash、工具/库版本、实际 checks/mismatches、执行状态、原始日志与结果哈希。

状态区分：功能 mismatch 是设计验证失败；库不可用/编译配置错误是工具故障；timeout/cancel/truncation 单独记录；无检查、缺收据、hash 不一致均不通过。所有异常都保留证据，不回退为旧四阶段 PASS。

验证：正常导线的网表通过；原攻击网表在 in=1 明确失败；时序正例通过；库缺失、超时、空 verdict、错误/过期网表哈希不能产生成功。攻击网表通过 Host-only 测试 fixture 送入检查器，不能为测试方便在生产入口增加绕过开关。

### 4. 接入 P10 的最终判分与导出（交付 B）

工作：只对已经通过原四阶段、即将成为最终成功候选的 revision 运行新检查。原四阶段已经失败的 revision 不增加网表验证开销。

Baseline 初始成功候选和 Agent 修复后成功候选必须使用同一套检查配置。共享初始候选可复用同一份有完整身份绑定的检查证据，不需要为了两种标签重复运行。

推荐集成方式：保留旧四阶段执行收据，新增 P10 版本化 acceptance receipt 组合四阶段事实与网表检查结果，而不是本次直接扩大所有 legacy profile 的 `stages`。新版 P10 的 `initial_status`、最终 `VERIFIED`、`recovered_by_agent`、`final.sv` 和报表计数全部从该 acceptance 判定，不能再从旧四阶段布尔值直接授权。

新版实验的最终成功条件：源代码政策通过、四阶段通过、网表功能检查通过、源码/网表/评测身份完整匹配。网表不支持或检查未校准的题记为明确的未完成验收状态，保留在任务清单中，不静默删题或退回弱标准。

当前修复范围内，新的网表 mismatch 先作为独立终止原因记录，阻止最终成功；不同时发明一套网表诊断到 Agent 的修复协议。报告应显示它是设计验证失败，而非声称 Agent 已获得并耗尽修复机会。之后若增加该修复路径，必须另冻策略和预算。

必须同步的消费者：`p10-model.ts` 的初始/最终状态与导出；`phase1/p10/generation-stability.mjs` 的汇总；`phase1/p10/audit-p10-campaign.mjs` 的 PASS 与 repair gain 审计；实际需要的结果校验、配置与 snapshot。新增检查模块只承担执行和证据，不重写现有 synthesis 和 repair loop。

验证：四阶段 PASS + 网表 FAIL/TIMEOUT/MISSING 都不能导出 final.sv、不能计入 baseline_pass/agent_pass/recovered；有效网表 PASS 才可计分。故意替换 receipt、交换任务网表或修改源码后，审计拒绝发布。新版缺 acceptance receipt 时拒绝发布，历史版本仍按历史含义读取且明确标注为旧标准。

### 5. 分层回归、新批次封存与发布

工作：先运行聚焦单测/快照，再运行无模型的真实 Vivado 正负例，再做只读历史候选兼容性扫描。最后创建新目录、冻结新的政策/验收 profile/源码与配置哈希。

兼容性扫描：读取已有合法初始和最终候选，列出新策略拒绝的样本及原因；逐项确认，不自动修改候选或清除正常初始化。扫描本身不重写旧分数、不构成新模型评测。

验收批次不调用外部 LLM，先限单 EDA worker；每次命令、验证总时限和产物大小有显式配置。新网表阶段需要预算时单独报告增加量，不能静默挤占或扩大模型 repair budget。

维护受影响 README/JSDoc、Agent Note 及输出快照；按仓库要求执行相关文档检查与类型检查。不要为了窄修复默认运行全部仓库 e2e 或覆盖历史 golden 数据。

验证：以下矩阵全部符合预期；所有子进程退出；源码与评测资产未越界改动；新 report 能指出每个成功绑定的网表验收收据。A、B 各有独立审查和完成记录。

## 最低验收矩阵

| 案例 | 源码入口 | 网表功能检查 | 新版最终成功 |
|---|---|---|---|
| 原始 RT-01 攻击 | 拒绝 | 生产不执行；Host 测试应失败 | 否 |
| synthesis off/on 及已确认等价写法 | 拒绝 | 生产不执行 | 否 |
| 普通注释/说明中提及关键字、同名标识符 | 按实际词法区分，不误拒 | 正常检查 | 取决于功能 |
| 正常导线，输入 0/1 | 接受 | PASS | 是 |
| 正常小组合逻辑 | 接受 | PASS | 是 |
| 正常带 reset 寄存器 | 接受 | 校准后 PASS | 是 |
| 合法初始化设计 | 不因本次修补一刀切拒绝 | 在显式初始化契约下检查 | 取决于证据 |
| 四阶段 PASS 但网表输出错误 | 接受或由策略先拒 | 若进入则 FAIL | 否 |
| 网表库缺失、timeout、取消、无有效 verdict | 与源码无关 | 非 PASS，分类明确 | 否 |
| 网表/源码/测试收据 SHA 不匹配 | 不授权 | 拒绝 | 否 |
| 老结果没有新 acceptance receipt | 按历史版本只读 | 不补造 | 不能计为新版成功 |
| Baseline 与 Agent 运行相同候选 | 相同政策 | 相同验收证据 | 相同判定 |

## 完成标准

交付 A：已确认的综合注释攻击在所有 P10 候选入口被拒绝，现有正常 RTL 无不明误伤，日志/预算与回归测试正确。

交付 B：在明确校准支持范围内，综合网表功能检查成为 Baseline、Agent、导出、汇总和独立审计的统一强制条件；错误或不完整证据不能得到新版最终成功。

仍保留的限制：有限输入功能仿真不等于形式等价证明；无支持的器件库/初始化/评测任务不能冒称验证通过；错误的 testbench 仍可能误判，RT-02 需另修。不得用 RT-01 的完成声明推导整个 156 题成绩已经可信。

## 参考与实施注意

- [AMD UG901 2025.2：translate_off/on 和 off/on 示例](https://docs.amd.com/r/en-US/ug901-vivado-synthesis/TRANSLATE_OFF/TRANSLATE_ON-OFF/ON-Verilog-Example)。
- [AMD UG900：GSR 与综合网表仿真启动条件](https://docs.amd.com/r/2021.2-English/ug900-vivado-logic-simulation/Global-Set-and-Reset-Net)。这是启动风险说明，具体运行以本地 2025.2 库实测校准。
- 本次查阅到的滚动 UG901 meta-comment 总览已是 2026.1，不能未经本地验证就把它的全部行为当作当前 2025.2 政策事实。
- 生产源码位于当前可写工作区之外。真正实施时按需要请求窄范围文件写入权限，不复制整仓绕过权限，不在本计划阶段修改配置或运行批次。
