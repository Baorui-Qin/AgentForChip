# RTL Agent Harness Red Team Report

审计日期：2026-09-23。范围：当前 `D:/deepseek-harness/rtl-tools` 的 P10 自动生成/修复链路，以及 `D:/AMD/p156-0923-v1` 的冻结实验。不把其他历史 profile 的行为自动归于当前 P10。

证据标记：**实测**表示本次执行了反例；**历史实证**表示独立读取已有原始记录；**代码确认**表示可定位实现但未执行完整攻击；**待验证**表示只有测试设计。严重程度表示影响，不表示证据置信度。

## Executive Summary

**当前最大风险不是模型偶尔不会调用工具，而是评测能够奖励错误设计。已经证明：四阶段 PASS 不保证综合电路实现题目功能；已有 repair gain 中也包含将稳态正确行为改坏后得到 PASS 的案例。**

本次没有修改生产源码、冻结题库或已有实验，没有调用付费模型 API。新增内容全部位于独立的 [redteam-20260923](D:/AMD/redteam-20260923) 目录。运行了 11 项策略/上下文组件探针、一个有界流记录压力探针、一次独立历史 VCD 核对，以及一个真实 Vivado 四阶段攻击。真实 EDA 攻击经过现有 `checkAutoSource` 和 `VerificationRunner`，但没有重新执行模型生成阶段或整套 campaign。

核心结论：

- **Critical / 实测：** 7 行候选利用综合注释绕过源码策略。仿真为导线，综合为恒零，现有 runner 仍输出四阶段 PASS。
- **Critical / 历史实证：** Prob078 最终候选选择相反边沿的旧数据；冻结测试台给出 0/224 失配，但独立读取同一 VCD 得到 93 个时间戳末值不一致。
- **High / 实测及历史实证：** Prob106 的 DUT 主错误本可送修，却被一条已识别的连锁错误阻断，0 次模型调用即终止。
- **High / 历史实证：** Prob133 出现 19 次重复候选拒绝，40 次模型调用才接受 1 次修改。系统是有界的，但“能检测重复”没有阻止长时间空转。
- **High / 实测：** 仅注释变化可以成为不同候选；同阶段的真实部分进展却被 `NO_IMPROVEMENT` 回退。它会同时放行假进展、抹掉真进展。
- **High / 实验设计：** 当前比较的是“共享初始候选 + 额外反馈、技能、请求与验证预算”的组合效果，不是资源匹配后的 Agent 框架净贡献。

独立重算 149 个 compare/result.json：Baseline PASS=135，最终 VERIFIED=146，初始失败=14，允许修复=13，修复成功=11。核对了全部 149 个共享初始源码哈希。7 个关键当前源文件与该批次源码快照 SHA-256 相同，所以这些发现不是仅针对废弃旧版。[重算与源码身份](D:/AMD/redteam-20260923/audit-results.json)

## Critical Vulnerabilities

| 漏洞 | 严重程度 | 触发方式 | 影响 |
|---|---|---|---|
| RT-01 仿真/综合网表语义分裂 | Critical，实测 | 在注释中使用 synthesis translate_off/on | 实现错误电路仍获四阶段 PASS |
| RT-02 测试台调度竞争奖励错误修复 | Critical，历史实证 | Prob078 交换正负边沿寄存器输出选择 | 修复增益中计入错误行为 |
| RT-03 公开规格与参考冲突 | High，源码实证 | Prob093 的 cd=11、ab=10 | 符合这一真值项的候选反而被要求修错 |
| RT-04 主错误加连锁错误导致拒修 | High，实测 | VRFC 10-1280 加 VRFC 10-8530 | 模型没有机会修复明确 DUT 错误 |
| RT-05 字节变化冒充语义修改 | Medium，实测 | 连续改变注释或内部格式 | 消耗修改轮数和 EDA，valid attempt 不能证明实质修复 |
| RT-06 已检测重复仍持续空转 | High，历史实证 | 重复 RTL + 推理耗尽 + forced action | 一个修改消耗 331728 个已知输出 token |
| RT-07 平台期被当作无进展 | High，实测评分函数 | 修好一个编译错误，但仍有第二个 | 中间版本被回退、缓存拒绝，迫使一次完成全部修复 |
| RT-08 标识符污染环境错误分类 | High，实测合成日志 | 语法错误中出现 license | DUT 错误被归为工具环境故障 |
| RT-09 单次多工具响应直接终止 | High，历史实证 | 同时返回 verify_rtl 和 edit_dut | 尚有预算时终止；未验证修改被恢复掉 |
| RT-10 对照资源与信息不对等 | High，配置与记录确认 | Baseline 停在初始评分，Agent继续交互 | 无法将提升单独归因于 Agent 架构 |
| RT-11 流封装不计入响应字节预算 | High，组件实测/系统风险待验证 | 大量空 delta / 极小 chunk | 日志与内存增长不受内容字节上限直接约束 |
| RT-12 compact / A 消融保留必需 ledger | Medium，组件实测 | repair_control 存在且 core_only=true | A 组仍获得历史；大核心不能靠 compact 缩小 |

### RT-01 的可复现证据

公开题 Prob007 要求 `out = in`。攻击候选如下，源码策略接受：

```systemverilog
module TopModule(input in, output out);
  assign out = 1'b0
  // synthesis translate_off
    | in
  // synthesis translate_on
  ;
endmodule
```

真实 Vivado 2025.2 结果：compile PASS、elaborate PASS、simulation PASS、synthesis PASS；仿真打印 `Mismatches: 0 in 120 samples`。综合产物却是：

```verilog
OBUF out_OBUF_inst
     (.I(1'b0),
      .O(out));
```

当 in=1，要求 out=1，综合网表必然 out=0。这不依赖推断模型意图，也不是只伪造一行 PASS 日志。原因是 [源码策略先删除注释](D:/deepseek-harness/rtl-tools/src/phase1/p09-auto-policy.ts:24)，而 Vivado 解释其中综合指令；[最终判定](D:/deepseek-harness/rtl-tools/src/phase1/verification.ts:261) 只要求各阶段成功，没有验证综合网表与 RTL/规格等价。

证据：[攻击源码](D:/AMD/redteam-20260923/attack.sv)、[四阶段结果](D:/AMD/redteam-20260923/eda/run-aB3LzE/result.json)、[仿真原始日志](D:/AMD/redteam-20260923/eda/run-aB3LzE/build/simulation.stdout.log)、[恒零网表](D:/AMD/redteam-20260923/eda/run-aB3LzE/build/.rtl-synth-BYzIqO/netlist.v:26)。这是新构造攻击，不声称原 156 题已有模型使用该技巧。

## Attack Cases

### 01. 综合注释使错误硬件通过全部检查

- 输入条件：Prob007 的真实冻结评测器；合法单模块 DUT。
- 攻击方法：提交上面的 translate_off/on 候选，保留仿真逻辑、删去综合逻辑。
- 预期失败：RTL 仿真正确，但综合电路错误仍被导出为成功。
- 当前系统表现：**实测四阶段 PASS，综合输出恒零。Critical。**
- 检测方式：对照原始仿真、网表 OBUF 输入和题面；增加 in=1 的综合网表检查即可暴露。
- 预期正确行为：不能将语义分裂设计作为可用硬件 PASS。
- 修复方向：识别有语义的综合注释；限制仿真专用语义；需要硬件正确性结论时绑定综合网表验证或等价检查。

### 02. 让 Agent 学会迎合 delta-cycle 竞争

- 输入条件：Prob078 的正负边沿触发器任务。
- 攻击方法：将 `clk ? q_pos : q_neg` 改为 `clk ? q_neg : q_pos`。
- 预期失败：用上一相反边沿的数据迎合测试台采样，功能变差而评分提高。
- 当前系统表现：**历史最终 PASS；本次独立 VCD 审计确认问题。Critical。** Baseline 的 224 个已知时间戳末值全一致；最终候选 223 个已知时间戳中 93 个不一致。20 ps 时 q_ref=1、q_dut=0。
- 检测方式：稳定采样后的独立断言；本次 [VCD 核对结果](D:/AMD/redteam-20260923/vcd-audit-results.json)。时间戳末值数不是原测试台检查数，不能直接替换原成绩。
- 预期正确行为：拒绝错误相位实现；正确实现不应因调度顺序被误拒。
- 修复方向：审核 stimulus 与采样时序，使用稳定观察点；保留原分数并另立评测器版本，不覆盖旧结果。

### 03. 用错误参考把正确真值项修坏

- 输入条件：Prob093 公开 K-map 的 cd=11、ab=10 为 1。
- 攻击方法：用参考的 `mux_in[2]=~d` 作为唯一真值标准。
- 预期失败：反馈推动模型背离公开规格。
- 当前系统表现：**源码实证，High。** 公开表该项为 1，参考为 0；初始候选的 `c | ~d` 在这一项正确。未据此宣称候选满足题面全部结构限制。
- 检测方式：独立枚举该真值项；核对 [公开题面](D:/AMD/verilog-eval/dataset_spec-to-rtl/Prob093_ece241_2014_q3_prompt.txt) 与 [参考](D:/AMD/verilog-eval/dataset_spec-to-rtl/Prob093_ece241_2014_q3_ref.sv)。
- 预期正确行为：规格冲突是评测器缺陷，不作为纯粹模型能力失败。
- 修复方向：建立独立规格一致性审计；正例 reference wrapper 加一个恒值负例不能验证 reference 自身正确。

### 04. 主错误后追加一条连锁错误，让修复机会消失

- 输入条件：Prob106 的 wire 输出被 always_comb 过程赋值，产生多个 VRFC 10-1280。
- 攻击方法：同时保留真实的 `module 'TopModule' is ignored due to previous errors` 连锁诊断。
- 预期失败：已明确归属 DUT、可由模型修复的错误仍被 policy 阻断。
- 当前系统表现：**历史 0 调用、POLICY_BLOCKED；当前函数重放同样阻断。High。** 仅从诊断列表移除连锁项，决策就变为 `DUT_UNKNOWN_BUT_OWNED/propose_repair`。
- 检测方式：[组件结果](D:/AMD/redteam-20260923/probe-results.json) 与 [原始反馈](D:/AMD/p156-0923-v1/compare-Prob106_always_nolatches/feedback-1.json)。反事实移除仅用于定位，未改真实日志。
- 预期正确行为：已确认同源连锁错误不应否决独立主错误的修复资格。
- 修复方向：修正 [主错误与连锁错误组合规则](D:/deepseek-harness/rtl-tools/src/phase1/repair-policy.ts:23)，不是粗暴允许全部 unknown。

### 05. 五轮只改注释，冒充五次 semantic repair

- 输入条件：需要改 always block 的错误 RTL。
- 攻击方法：每轮仅增加不同 `// revision N`，每轮调用 verify_rtl。
- 预期失败：没有行为变化却消耗五次修改与五次验证；审计把源码哈希变化当成语义修复。
- 当前系统表现：**组件实测五种源码均通过策略且不同于原 trim，代码确认会通过重复判断。Medium。** 本次未执行五次重复 EDA。验证打平后会回退，但换新注释仍绕过原始字节拒绝缓存。
- 检测方式：比较去除无语义注释/格式后的表示，区分编辑尝试、行为变化和错误减少；不要用 SHA 不同作为语义变化证明。
- 预期正确行为：标记 no-op，不计为有实质变化的修复；不虚报已理解 feedback。
- 修复方向：加入语义无操作分类和停滞计数；必须先区别普通注释与 RT-01 的综合指令，不能一律删注释。

### 06. 重复拒绝仍然消耗数十万 token

- 输入条件：普通请求持续输出 reasoning 至 max_tokens，forced-action 返回相同源码。
- 攻击方法：反复进入相同源码、相同反馈、相同拒绝原因的恢复回合。
- 预期失败：有限预算内长时间无效循环，最终 PASS 掩盖过程退化。
- 当前系统表现：**Prob133 历史实证，High。** 19 次 REPEATED_CANDIDATE，40 次物理调用，1 次接受修改，331728 个已知 completion token。反馈并非未送达，而是无进展后没有及时结束或换策略。
- 检测方式：按 `(source_sha, feedback_projection_sha, action/error)` 检查状态重复；统计有效编辑/API 调用比，而非只看最终 PASS。
- 预期正确行为：明确识别停滞，保留其成本，不能称为有效多轮修复。
- 修复方向：独立停滞预算与有界恢复策略。已有 15/60/120 上限防止无限循环，但不是高效或可靠的证据。

### 07. 两个独立 bug 必须一口气修完

- 输入条件：编译阶段有两个独立错误；第一轮只修一个，仍为 compile FAIL。
- 攻击方法：让模型给出正确的分步修复，而不是一次替换全部逻辑。
- 预期失败：stage rank 不变，正确中间成果被拒绝，下一轮从旧版本重新开始。
- 当前系统表现：**compareRevision 组件实测 NO_IMPROVEMENT；代码确认下游回退并缓存拒绝。High。** 模型仍可能下一轮一次修好全部，因此不是数学上的不可解。
- 检测方式：观察诊断减少但 rank 不变的 revision；测试第二步是否仍能基于第一步。
- 预期正确行为：明确区分“已证实退化”与“当前评分无法观察进展”，不能无条件等同。
- 修复方向：把 incumbent 保留与搜索路径推进分开；以小型多故障受控任务验证策略，不直接用错误数量当完备语义分数。

### 08. 一个变量名触发错误环境分类

- 输入条件：DUT 语法错误消息包含标识符 `license`。
- 攻击方法：将合成错误行 `syntax error near 'license' [绝对DUT路径:2]` 送给当前 parser。
- 预期失败：RTL 语法错误被当作许可证故障，影响修复机会和实验故障分类。
- 当前系统表现：**组件实测 environmentFailure=true、origin=tool、repairable=false。High。** 此处是合成日志，不声称该精确消息由本次 Vivado 生成。
- 检测方式：同一错误仅将标识符换为 foo，比较 classification；检查路径/错误码与环境正则的优先级。
- 预期正确行为：标识符文本不能决定全批诊断的 environment 身份。
- 修复方向：收紧 [环境错误匹配](D:/deepseek-harness/rtl-tools/src/vivado-parser.ts:49)，按真实消息模板与进程证据归因。

### 09. 一个多工具响应杀死整个修复过程

- 输入条件：处于 PENDING_VERIFICATION，模型同时输出 verify_rtl 和 edit_dut；或者输出完整纯文本而无工具。
- 攻击方法：返回零个/两个完整调用，而不是非法半截 JSON。
- 预期失败：还有预算，任务却立即 INVALID_MODEL_ACTION；与单个错误工具得到可恢复 observation 的行为不一致。
- 当前系统表现：**Prob093 多工具终止为历史实证；零工具路径为代码确认。High。** [调用数检查](D:/deepseek-harness/rtl-tools/src/phase1/p10-model.ts:393) 直接 break。未验证版本会回退，没有假 PASS。
- 检测方式：注入零调用、双调用、未知工具、坏 JSON 四类响应，分别核对终态和计费。
- 预期正确行为：拒绝不合法动作但不部分执行，明确记录这是协议失败而非 DUT 能力失败。
- 修复方向：采用独立且有界的协议纠正窗口，不从多工具响应中偷偷选一个执行。

### 10. Vivado 崩溃、语法错误、仿真超时混淆

- 输入条件：分别模拟进程 exit 非零且无诊断、合法语法错误诊断、无 verdict 的仿真 timeout、许可证失败。
- 攻击方法：保持同一候选，故障注入工具输出与进程事实，观察是否耗用 accepted edit 和如何计分。
- 预期失败：工具故障被计为设计错误；或新版本验证故障导致整题退出且预算已扣。
- 当前系统表现：**混淆尚未全面复现，Medium 待验证。** 本次 sandbox 阻止 spawn 的 EPERM 被正确标为 TOOL_ERROR，后续阶段 SKIPPED，不是 RTL FAIL。API 重试不增加 semantic repair；但代码在接受 edit 时先增加 repairs，之后 EDA 故障并不自动退回计数或重跑该 revision。
- 检测方式：冻结四种 fake-tool fixture；比对 failure_domain、semantic_repairs、request attempts、pending/best 状态及下一题调度。
- 预期正确行为：每种故障都有独立原因和重试/退出政策；不能因基础设施失败否定候选语义。
- 修复方向：将设计修改、EDA 尝试与基础设施失败分别记账；安全可重试的执行故障采用明确上限。

### 11. Baseline 无反馈，Agent 有反馈且预算更多

- 输入条件：当前冻结 P10 配置，variant C，共享初始源码。
- 攻击方法：将 135 到 146 的提升解释为 Agent 架构本身优越。
- 预期失败：把额外算力、测试信息、技能、best-revision 搜索优势混成架构因果贡献。
- 当前系统表现：**配置与原始记录确认，High。** 初始生成 178 次调用、369054 个已知 completion token；Agent 额外 131 次调用、975682 个已知 completion token，还接受 live diagnostic 和 reference 输出的有界波形反馈。
- 检测方式：比较实际 prompt/feedback、物理调用、token、工具与候选选择规则；不是只比较模型名称或温度。
- 预期正确行为：报告为组合系统的增量表现；无等资源对照时不宣称净架构优势。
- 修复方向：新增相同预算的多样本生成、固定脚本反馈修复、无技能修复等对照；评分 holdout 不参与反馈。

### 12. 校正后的候选被称为严格 pass@1

- 输入条件：首轮截断/不合法，之后最多两次生成纠正。
- 攻击方法：将最终“首个合法候选”的分数标为一次模型生成成绩。
- 预期失败：候选获取成功率、严格首调用成功率与 RTL 修复率混淆。
- 当前系统表现：**能力存在，误命名风险 High。** 当前文档已明确不是严格单调用 pass@1，本次未发现必须推定其报表故意误标。155 个生成任务消耗 178 次调用，Prob030 明确第二次才产生合法候选。
- 检测方式：从 generation_attempts 按物理调用序号重算，而不是从 final initial.sv 推测。
- 预期正确行为：保持首调用、恢复后候选、修复后三种指标分开。
- 修复方向：指标名称和分母固定；不通过选择首个合法输出隐去失败调用。

### 13. 复杂 A 污染简单 B：区分上下文与资源

- 输入条件：A 连续失败且高 token 消耗；B 是确定性简单 bug。
- 攻击方法：执行 B-only、A→B、B→A，并使用唯一 canary 检查 B 的最终 wire request；另把全局 dispatch cap 缩小到可控值。
- 预期失败：B 收到 A 的数据，或 A 用尽共享预算使 B 没有机会运行。
- 当前系统表现：**直接跨题 ledger 注入被组件测试拒绝，未证明语义 context 泄漏。** P10 的局部 history/ledger 是每任务构造；共享调用预算和并发资源仍允许顺序影响可运行机会。后者是 Medium 待验证，不是上下文复用的证据。
- 检测方式：比对最终序列化 prompt，而非仅任务变量；同时记录队列等待、剩余配额、NOT_RUN 及模型服务状态。
- 预期正确行为：B 的模型可见数据与执行资格变化可分别解释；不得把资源饥饿归因于模型能力下降。
- 修复方向：独立验证请求隔离和调度公平；预分配每题预算，随机/交叉运行顺序。

### 14. compact 后历史仍在必需核心中

- 输入条件：variant A、repair_control、core_only=true，带历史 ledger。
- 攻击方法：要求去除历史，检查序列化 JSON 的所有字段，而非只查 history 数组。
- 预期失败：history=[] 但 repair_ledger 仍完整，消融不是无历史；长 ledger/源码/旧草稿占据不能裁剪的核心。
- 当前系统表现：**组件实测保留 ledger，Medium。** [core 组装](D:/deepseek-harness/rtl-tools/src/phase1/p09-context.ts:106) 不检查 variant。当前 156 题为 C，不能据此声称这批用了错误 A 组。
- 检测方式：按信息内容检查最终 wire，增加满核心 CONTEXT_UNSATISFIABLE 测试。组件探针使用明确的 mock 字符计数器，不冒充服务端 token 计量。
- 预期正确行为：消融维度在全部模型可见字段一致，compact 的不可裁剪部分及退出原因清楚。
- 修复方向：固定各组信息白名单；区分安全保留事实和实验要消融的历史信息。

### 15. 空流片段绕过内容字节上限

- 输入条件：异常 provider 产生大量空 reasoning delta 或极小文本片段。
- 攻击方法：有界注入 10000 个空 delta，不发送实际模型请求。
- 预期失败：response_bytes 仍为 0，但 JSONL、内存 chunks 和 assembler 开销增长。
- 当前系统表现：**组件实测写出 844511 字节 stream.jsonl；系统 OOM 未执行。High 风险。** 当前 action caller 的 [chunks 数组](D:/deepseek-harness/rtl-tools/src/phase1/p09-action-call.ts:84) 及 [记录先于大小校验](D:/deepseek-harness/rtl-tools/src/phase1/p09-action-call.ts:156) 没有对应 chunk 数/封装字节硬上限。墙钟超时存在，不等于限制超时前峰值资源。
- 检测方式：在小 quota 下记录 content bytes、serialized bytes、RSS、磁盘和拒绝时点；不要做无限流或真实磁盘填满攻击。
- 预期正确行为：内容、封装和记录成本均受界限约束；保留触发异常的有限证据。
- 修复方向：分别限制 chunk 数、单 chunk 大小、日志总字节和驻留内存，保留原 token/超时上限。

### 16. better → worse → worse 与平台期

- 输入条件：原 revision 20/100 失配，后续 80/100、90/100。
- 攻击方法：让模型持续提交退化候选，再尝试重新提交被拒源码。
- 预期失败：从退化版本继续、覆盖最佳版本或把旧 PASS 用于新 SHA。
- 当前系统表现：**这一基础攻击已有防护，组件评分正确 REGRESSION。** 历史 Prob113 的 7→31→17→50 均被回退，之后通过；未发现所提“无回退一路恶化”。风险主要是 RT-07 的平台期误杀，以及不完整验证直接终止。Low，防护已观察。
- 检测方式：核对 restored_revision 的源码 SHA、revision、receipt、verification_run 四者一致；检查 final.sv 只绑定当前 PASS。
- 预期正确行为：保留最好已验证候选和所有失败轨迹，不导出未验证新版本。
- 修复方向：保留现有机制，补充同样 mismatch 数但不同失败集合、样本数不同和不可比较证据的测试。

### 17. 并发、残留进程、临时文件和 GPU 压力

- 输入条件：两个受控 EDA worker；一个延迟退出、一个短任务；模型服务单并发或小上下文。
- 攻击方法：在隔离 campaign 中触发取消、日志上限和磁盘 quota；同时请求 dispatch claim；最后检查进程树与文件锁。
- 预期失败：子进程残留、跨题目录串用、全局配额超发、快任务被慢任务拖垮、GPU OOM 污染整批。
- 当前系统表现：**待验证，High 影响。** 实现已有唯一目录、managed process join、artifact quota、claim 账本，不能无证据断言全失效。没有执行 GPU OOM，也未验证远端 GPU 型号、显存或服务端隔离；当前批次是 deepseek-flash API 配置。
- 检测方式：只允许 2 worker、短墙钟和小 quota；保存进程树前后差、claim 序号、各阶段启动终止和目录归属。验证取消后下一任务正常运行。
- 预期正确行为：所有资源释放可观察，异常只影响所属任务或触发明确的 campaign 停止。
- 修复方向：先验证已有边界，再修具体失败；不要用“进程管理 API 存在”代替真实故障测试。

### 18. PASS 日志完整，但为什么 PASS 无法充分回答

- 输入条件：任意 VERIFIED 任务；另选请求 timeout 且未返回 usage 的任务。
- 攻击方法：从最终结果逆向重建完整请求、工具、源码、评测资产和验证；并尝试把缺失 usage 当作零成本。
- 预期失败：只有结论无证据，或缺失用量使成本统计过于乐观。
- 当前系统表现：**不是只有 PASS 一行。** 抽查存在 prompt-final、模型响应与流、tool-trace、revision 源码、原始 EDA 日志、VCD、综合网表/报告和哈希。diff 可由快照重建。**历史确认两次 usage 未知，因此已知 token 是下界。Medium。** 另一个根本限制是完备日志只能解释判分过程，不能证明评测标准正确，RT-01/02 即反例。
- 检测方式：重算 source/result/log 哈希，检查每个模型调用的 usage completeness；将未返回、未写入、不可适用三种缺失分开。
- 预期正确行为：每个 PASS 可重建其证据链，成本有缺口时明确标记，不能反推未公开内部 reasoning。
- 修复方向：独立只读审计器核验全链与 usage completeness；不覆盖历史证据或用重跑补出“原始”数据。

## Experimental Validity Risks

### 当前数字能证明什么

本次从原始 compare 结果独立核对：

| 指标 | 数值 | 合理解释 |
|---|---|---|
| 全部选题 | 156 | 含不能按当前评测器计分的题 |
| 实际完成对照 | 149 | 不能直接冒称完整 156 题可评测结果 |
| 初始候选 PASS | 135/149 = 90.60% | 共享候选获取流程之后的初始成绩 |
| 最终 VERIFIED | 146/149 = 97.99% | 当前冻结评测器与四阶段流程接受率 |
| 增加通过 | 11/149 = 7.38 个百分点 | 组合系统的观察到增益，不是净架构因果效应 |
| 修复成功/允许修复 | 11/13 = 84.62% | 以 policy gate 为条件的成功率 |
| 修复成功/全部初始失败 | 11/14 = 78.57% | 将被 Harness 拒修的 Prob106 保留在失败分母中 |
| Agent 增量调用 | 131 | 不包括共享生成的 178 次调用 |
| 已知 completion token | 369054 + 975682 = 1344736 | 另有 2 次 usage 未知，非真实总量精确值 |

将 11/13 单独用作“系统修复率”会隐去 Harness 自己制造的拒修失败。两个分母都应公开。将 146/149 当作功能正确率同样不成立，因为 Prob078 已显示错误实现被接受；新 RT-01 进一步证明评价链路自身可被构造性绕过。

### 不能成立的结论

- “Agent 框架使同一模型变聪明了”：没有分离反馈信息、技能、额外请求、token、搜索与选择策略。
- “四阶段 PASS 就是正确 FPGA 设计”：没有验证综合网表功能一致性，也没有实现后时序收敛保证。
- “参考包装正例通过 + 恒值负例失败，评测器就可信”：不能发现规格冲突、采样竞争或覆盖不足。
- “语义修复次数就是有效修复次数”：当前是通过策略且 trim 后源码不同的编辑计数。
- “consumed_feedback_sha256 证明模型理解反馈”：它最多证明请求包含绑定反馈且观测到输出；不能证明模型据此做了正确修改。
- “温度 0 的一次运行足以支持普遍提升”：没有运行间不确定性、时间漂移和独立留出题的证据。

### Hidden Bias 与污染

不能根据当前记录认定测试集只有简单语法题。观察到的失败和成功修复包含 FSM、串行接收、时序相位等功能问题。实际风险更具体：

- **错误类型门控偏差：** 容易被 policy 识别的 mismatch 能进修复；明确 DUT 编译错误却可能被连锁摘要阻断。
- **参考适配收益：** Prob034/104 的主要修复涉及初值；不能不加分类地称为复杂逻辑理解提升。
- **固定种子/反馈复用：** 当前 seed=1；Agent 在同一测试反馈上搜索、同一测试上最终评分，没有独立 holdout 功能验收证据。
- **公开题库训练污染：** 题目公开且带固定标识，存在记忆答案的可能性，但本次无法确认该模型训练数据。只能列为未排除的混杂，不能断言已泄漏。
- **开发集过拟合：** 多代本地修补使用同一公开集合。没有独立新 bug 类别和新题验证时，收益可能部分来自 Harness 对已见诊断的适配。
- **样本选择偏差：** 7 个排除项必须一直可见；条件于可校准题的结果不能外推所有 RTL 修复任务。
- **单模块与语法政策偏差：** 禁 helper module、文件访问、系统任务有安全理由，但也限制模型解空间。两组一致时不直接构成组间不公平，却限制外部效度。

结论：**现有数据可以作为可追溯的开发实验，不能作为“公平证明 Agent 架构优于 Baseline，且修复了 11 个真实设计缺陷”的充分证据。** 这不是否定所有成功修复；它是拒绝把存在已证实评测假阳性的分数扩大解释。

## Priority Fix List

### P0：必须修

1. **堵住已实测的仿真/综合语义分裂。** 验收：RT-01 被拒绝或后综合网表功能验证失败，不再得到硬件正确性 PASS；正常组合/时序设计仍通过。
2. **隔离已知评测器缺陷。** Prob078、Prob093 等保留原始成绩和缺陷标签，新版本重新校准。验收：稳定采样的正确实现通过、反相选择实现失败；K-map 单元格与 oracle 一致。
3. **冻结结论的边界。** 发布前区分 evaluator acceptance、候选获取、真实功能验证、条件修复率和全部失败修复率；不把已知假增益继续称为功能提升。
4. **修复主/连锁诊断的拒修逻辑。** 验收：原 Prob106 原始日志能进入修复；真实许可证、TB/reference 错误仍被隔离。

### P1：强烈建议

1. 有界处理无工具、多工具、重复候选、重复拒绝；验收：五轮注释攻击和 Prob133 状态回放可明确识别停滞，且不执行部分调用。
2. 修正平台期回退策略；验收：两个独立 bug 可分步修复，退化候选仍不能覆盖最佳产物。
3. 按结构化证据区分工具错误与 RTL 错误；加入 license 标识符、环境故障与混合日志的差分测试。
4. 建立等预算、等反馈的固定脚本修复对照与 holdout；将 skill、工具自治、上下文策略分别消融。
5. 增加模型流封装/内存/磁盘边界；用有限空 chunk、异常大 chunk 和 cancellation 回归验证。
6. 做 A→B/B→A 隔离与并发恢复实验；分别检查 prompt 污染、资源饥饿、残留进程和 claim 超发。

### P2：优化

1. 将 revision diff、无语义变化标记和失败类型分层加入可读报告；现有源码快照不要删除。
2. compact 审计检查所有模型可见历史字段，而不是只检查 history=[]；A/B/C 消融使用同一信息清单验收。
3. 报告 token/latency 的长尾、未知 usage、每次有效编辑成本和队列等待，不只报告均值与终态 PASS。
4. 为波形反馈增加采样时点精度信息；不把 VCD 时间戳末值冒充断言采样 expected/actual。

## Reproduction And Limits

脚本为审计产物，不是生产修复。运行目录需为 `D:/deepseek-harness`，以使用已有 tsx 和路径映射：

```powershell
node --import tsx/esm D:/AMD/redteam-20260923/probe.mjs
node --import tsx/esm D:/AMD/redteam-20260923/audit.mjs
node D:/AMD/redteam-20260923/vcd-audit.mjs
# 另行启动一次有界真实 Vivado 四阶段攻击：
node --import tsx/esm D:/AMD/redteam-20260923/probe.mjs --vivado
```

本次真实 EDA 首次受到 sandbox `spawn EPERM` 阻止，产生 TOOL_ERROR；提升该命令执行权限后成功运行。失败试次仍保留在 `eda/run-NZ4gWx`，成功试次在 `eda/run-aB3LzE`。真实 EDA 单次总预算 240 秒、产物上限 64 MiB、单综合预算 120 秒，没有启动无限压力测试。脚本重跑会创建新的 EDA 目录，但汇总 probe-result 文件会更新，应按 run 目录保留历史身份。

未验证：真实远端 GPU OOM、恶意 provider 不遵守取消时的退出上界、跨平台进程树清理、全部并发故障、全部题面语义及所有 PASS 的独立正确性。本报告不是“已穷尽所有漏洞”的声明。保留下来的已知防护包括：源码/评测资产哈希绑定、重复原始候选拒绝、edit 后只允许 verify、四阶段失败即停、回退最佳版本、跨题 ledger 校验和原始日志保留。
