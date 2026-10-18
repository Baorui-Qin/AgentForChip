# 五十题实测失效原因复核

本文件复核 30 道发生过候选拒绝、输出截断或初始 RTL 失败的题目，其中 4 道在恢复或修复后通过 RTL 四阶段，另外 26 道未通过。本轮不改写模型答案，也未将这些复核意见追加给运行中的模型。完整数量及逐题状态以 `summary.json`、`tasks.csv` 和 `failure-reasons.json` 为准。编译器或仿真器确认的现象与源码分析分开表述。

## Prob086 lfsr5

**已确认的实现错误：**公开题面要求右移 Galois LFSR，抽头位置以原最低位 `q[0]` 向相关位注入 XOR。初始模型代码却使用 `{q[3:0], q[4] ^ q[2]}`，既是左移，又是集中反馈形式，而非要求的 Galois 拓扑；注释所说的右移也与代码不符。

**实际验证：**初始仿真 8,544/8,885 次检查失配。第一次修复仅改为 `{q[4] ^ q[2], q[4:1]}`，修正了方向但仍未实现题面要求的抽头注入，失配增至 8,816/8,885。Harness 将该修订判定为回归并恢复初始较佳版本。此后模型又两次提交已经被拒绝的修订，最终触发 `REPEATED_ACTION_REJECTED`，不是 HTTP 或云端故障。

**证据：**[初始代码](campaign/generate-Prob086_lfsr5/initial.sv)、[回归修订](campaign/compare-Prob086_lfsr5/revisions/f99b6228-0830-4ac9-b494-788c3377c39e/solution.sv)、[修复与回退记录](campaign/compare-Prob086_lfsr5/result.json)。

## Prob141 count clock

**已确认的实现错误：**题面要求复位为 BCD `12:00 AM`，模型却将小时两个数字都置为 2，输出 `hh=8'h22`。秒计数也只增加低位，没有实现低位从 9 到 0 并向高位进位的逻辑，不能得到要求的 BCD 00 至 59 序列。初始仿真 704,825/704,825 次检查失配。

**修复流程失效：**收到失败反馈后，8B 没有先修改 DUT，而是连续两次请求验证没有待验证修订的源码；`pending_verification=false`，两次均被工具契约拒绝，最终为 `REPEATED_ACTION_REJECTED`。有效修复为 0，不能把这些调用当成完成了代码修复。

**证据：**[初始代码](campaign/generate-Prob141_count_clock/initial.sv)、[拒绝与终态记录](campaign/compare-Prob141_count_clock/result.json)。

## Prob039 always if

**已确认的编译错误：**`out_always` 被声明为默认 net 类型的 `output`，却在 `always` 中进行过程赋值。Vivado 两次报 `VRFC 10-1280`，要求左值为可过程赋值的变量；随后报出模块因先前错误被忽略的 `VRFC 10-8530`。

**Harness 限制：**这些错误完整归属于 DUT，记录中 `repairable_by_model=true`，但现有 `diagnosticKind` 没有将该主错误识别为受支持的编译类别；同时存在 consequential 类型的模块忽略消息，使兜底分支也不成立。因此实际终态为 `POLICY_BLOCKED / UNCLASSIFIED_FAILURE`，模型未获得一次修复机会。这是生成错误与 Harness 诊断策略覆盖不足的组合，不是云端连接问题。本轮不在运行中修改该策略。

**证据：**[初始代码](campaign/generate-Prob039_always_if/initial.sv)、[终态与策略](campaign/compare-Prob039_always_if/result.json)、[编译证据](campaign/compare-Prob039_always_if/eda/run-9zOn9C/result.json)。

## Prob105 rotate100

**已确认的拒绝原因：**原始候选的注释 `100-bit` 中实际使用了 U+2011 非 ASCII 连字符，而不是 ASCII `-`。现有 `checkAutoSource` 限制源码字节为 ASCII 可打印字符及常用空白，因而以 `UNSUPPORTED_RTL_BYTES` 拒绝整份候选。这里尚未运行 EDA，不能据此判断旋转逻辑是否正确。

**恢复结果：**允许的一次输出恢复再次生成相同源码，两个候选的源码 SHA256 完全一致，仍被同一规则拒绝。两个 HTTP 响应均成功且完整，属于输出字节约束及恢复无效，不是网络或服务失败。

**证据：**[生成结果及两个候选哈希](campaign/generate-Prob105_rotate100/result.json)、[首次原始模型输出](campaign/generate-Prob105_rotate100/models/run-SDqpr5/native-submission.json)。

## Prob101 circuit4

**已确认的实现错误：**公开波形表已给出反例：`a,b,c,d=0,1,0,0` 时输出应为 1；`1,0,0,0` 时应为 0。初始答案 `q=a|(b&c)` 分别产生 0 和 1，与这两行均相反，属于从波形归纳布尔函数失败，不是未覆盖的边界猜测。

**实际验证及回退：**初始 70/240 次检查失配；两次有效修改并验证后，失配分别增至 100/240 和 122/240，均被回归判定回退。最终保留较佳的初始版本并以 `REPAIR_BUDGET` 停止，仍有 70/240 次失配。这里的“有效修复尝试 2 次”仅表示编辑及验证流程完整，不表示修复成功。

**证据：**[初始代码](campaign/generate-Prob101_circuit4/initial.sv)、[两次修订及回退记录](campaign/compare-Prob101_circuit4/result.json)。

## Prob060 m2014 q4k

**已确认的编译错误：**复位赋值被生成为 `q3 <= 1'b2'b0`，是非法数字字面量。Vivado 报 `VRFC 10-5010` 非法二进制字符 `2`，以及 `VRFC 10-4982` 语法错误。

**Harness 限制：**这组错误虽完整归属于 DUT，但包含未分类的非法数字消息、已分类的语法消息及模块忽略的 consequential 消息；现有修复策略不接受这一组合，终态为 `POLICY_BLOCKED / UNCLASSIFIED_FAILURE`，没有调用模型修复。不能把未获得修复机会解释为模型尝试修复后仍失败。

**证据：**[初始代码第 14 行](campaign/generate-Prob060_m2014_q4k/initial.sv)、[终态及策略](campaign/compare-Prob060_m2014_q4k/result.json)。

## Prob119 fsm3

**已确认的编译错误：**输出 `out` 采用默认 net 声明，却在 `always` 中赋值，Vivado 报两条 `VRFC 10-1280`。它与 Prob039 属于同一种可过程赋值变量声明遗漏。

**Harness 限制：**该主诊断未被现有编译错误类别覆盖，又伴随模块忽略消息，终态同样为 `POLICY_BLOCKED / UNCLASSIFIED_FAILURE`；有效修复为 0。本轮没有改变分类规则来让该题额外获得修复机会。

**证据：**[初始代码](campaign/generate-Prob119_fsm3/initial.sv)、[终态及策略](campaign/compare-Prob119_fsm3/result.json)。

## Prob117 circuit9

**已确认的行为理解错误：**公开波形显示输入 `a=1` 时输出稳定为 4，随后 `a=0` 时输出按 5、6、0、1 变化。模型却写成 `a=1` 时递增、`a=0` 时清零，既没有实现加载 4，也不符合所示循环序列。初始仿真 424/488 次检查失配。

**修复流程失效：**后续两次 `edit_dut` 均提交了与当前源码相同的候选，触发 `REPEATED_CANDIDATE`，再触发 `REPEATED_ACTION_REJECTED`。没有接受新修订，也没有形成有效编辑后重验证。

**证据：**[初始代码](campaign/generate-Prob117_circuit9/initial.sv)、[重复候选及终态](campaign/compare-Prob117_circuit9/result.json)。

## Prob016 m2014 q4j 修复后通过 RTL

**进入 EDA 前的恢复：**最早的原始候选使用 `fa[i-1].carry_out` 等层次引用，触发 `RTL_HIERARCHY_REJECTED`。允许的一次候选恢复后才产生下面的 `initial.sv`；因此它不是严格意义上“一次调用直接得到”的初始答案。原始拒绝及候选都保留在生成目录。

**已确认的初始实现错误：**四位全加器链只声明 `c[3:0]`，求和却使用 `c[i+1]`，进位写入 `c[i+2]`，最终还读取 `c[5]`；既未正确连接初始进位，也存在进位索引越界。初始仿真 199/199 次检查失配。

**自动修复结果：**Agent 将进位扩为 `c[4:0]`，各级读取 `c[i]`、产生 `c[i+1]`，最终输出 `c[4]`，一次有效编辑及重验证后通过 RTL 四阶段。完整网表仍因版本库校验而被环境阻断，不能将其写为正式验收成功。

**证据：**[初始代码](campaign/generate-Prob016_m2014_q4j/initial.sv)、[修复源码及验证关联](campaign/compare-Prob016_m2014_q4j/result.json)。

## Prob068 countbcd

**已确认的实现错误：**初始输出使能检查的是被使能数字自身是否为 9，而不是所有较低位是否同时即将进位。例如个位为 9、十位为 0 时，十位应获使能，模型的 `ena[0]=(十位==9)` 却为 0。初始源码还保留两套 `always` 过程同时写 `q_reg`，没有将自我改写后的旧实现移除。

**修复及回退：**初始失配为 78,016/79,609。第一轮移除了重复计数过程，改善至 26,128/79,609，但保留了错误的使能表达式。第二轮为 79,232/79,609，被判定回归并回退到第一轮版本；随后达到两轮修复预算，终态为 `REPAIR_BUDGET`。不能把“失配减少”当作通过验证。

**证据：**[初始代码](campaign/generate-Prob068_countbcd/initial.sv)、[第一轮较佳版本](campaign/compare-Prob068_countbcd/revisions/83d1b88d-d24f-48f2-a123-8cfa8e4af50c/solution.sv)、[各次失配及回退](campaign/compare-Prob068_countbcd/result.json)。

## Prob089 ece241 2014 q5a

**已确认的终止原因：**首次生成及一次输出恢复都达到 2,048 个输出 token，原生响应 `finish_kind=max-tokens`，两次均为 `OUTPUT_TRUNCATED`，无法提取完整 RTL 候选。合计输出 4,096 token，未进入 EDA。

这不是请求超时，也不是 HTTP 错误：两个调用均为 HTTP 200，带完整 usage 和结束事件。传输正常结束不等于返回了完整、有效的工具参数或源码。本轮不在看到失败后临时提高输出预算，也不把半截候选补齐后计为模型成功。

**证据：**[生成及恢复记录](campaign/generate-Prob089_ece241_2014_q5a/result.json)、[首次响应](campaign/generate-Prob089_ece241_2014_q5a/models/run-zopASE/native-submission.json)、[恢复响应](campaign/generate-Prob089_ece241_2014_q5a/models/run-r7nW1N/native-submission.json)。

## Prob094 gatesv

**已确认的实现错误：**题面要求 `out_different[i]` 比较本位和左侧较高索引位，最高位与最低位环绕。模型却比较了较低索引邻位，环绕方向相反。例如题面明确要求第 2 位比较 `in[2]` 与 `in[3]`，源码却比较 `in[2]` 与 `in[1]`。

**实际修复结果：**初始 333/425 次检查失配，两轮有效编辑及验证后均为 400/425，更差的修订均被回退，保留初始较佳版本；终态为 `REPAIR_BUDGET`。已确认的是邻位方向错误，不把这项静态分析当作其他输出位均已正确的证明。

**证据：**[初始代码](campaign/generate-Prob094_gatesv/initial.sv)、[两次修订及回退](campaign/compare-Prob094_gatesv/result.json)。

## Prob083 mt2015 q4b

**已确认的函数归纳错误：**公开波形中 `x=y=1` 时 `z=1`，初始代码 `z=~(x|y)` 却产生 0。它只符合两个输入都为 0 的部分样本，没有覆盖题面已提供的全部输入组合。初始 64/219 次检查失配。

**实际修复结果：**第一次修改验证被判回归，第二次完整编辑后验证仍为 64/219 失配，另一次原样候选被拒绝；最终 `REPAIR_BUDGET`。未因修复调用发生就将该题算作修复成功。

**证据：**[初始代码](campaign/generate-Prob083_mt2015_q4b/initial.sv)、[修复与回退](campaign/compare-Prob083_mt2015_q4b/result.json)。

## Prob096 review2015 fsmseq

**已确认的展开错误：**模型用 2 位 enum 编码五个命名状态，并将 `S4` 与 `S0` 同时赋值为 `2'b00`。Vivado 报 `VRFC 10-3279` 重复枚举成员值，静态展开失败，尚未进入仿真。

**Harness 限制：**主错误伴随无源码归属的 `XSIM 43-3322` 展开失败汇总；现有策略没有接受这一组合，终态为 `POLICY_BLOCKED / UNCLASSIFIED_FAILURE`，有效修复为 0。不能把该题写成通过编译后仅有行为失配。

**证据：**[初始状态编码](campaign/generate-Prob096_review2015_fsmseq/initial.sv)、[终态及展开诊断](campaign/compare-Prob096_review2015_fsmseq/result.json)。

## Prob098 circuit7

**已确认的行为理解错误：**公开波形在输入 `a=1` 稳定后显示输出为 0；模型却在每个 `a=1` 的上升沿将 `q` 置为 1，`a=0` 时保持原值。这与题面所示稳定行为相矛盾。初始 132/240 次检查失配。

**修复及回退：**两轮候选均为 240/240 次失配，均回退到初始较佳版本，最终 `REPAIR_BUDGET`，仍为 132/240 失配。

**证据：**[初始代码](campaign/generate-Prob098_circuit7/initial.sv)、[各次失配和回退](campaign/compare-Prob098_circuit7/result.json)。

## Prob138 2012 q2fsm

**已确认的实现错误：**题面规定状态 E、F 的 Moore 输出都为 1；源码只检查 `state==E`，遗漏 F。其他状态转移照题面写出，并不能弥补输出条件遗漏。初始 104/795 次检查失配。

**修复流程失效：**随后交替请求没有待验证修改的 `verify_rtl`、提交原样 `edit_dut`，分别触发 `VERIFICATION_REQUEST_REJECTED` 和 `REPEATED_CANDIDATE`，最终 `REPEATED_ACTION_REJECTED`。有效编辑后重验证为 0。

**证据：**[初始输出逻辑](campaign/generate-Prob138_2012_q2fsm/initial.sv)、[工具拒绝与终态](campaign/compare-Prob138_2012_q2fsm/result.json)。

## Prob137 fsm serial

**已确认的初始缺陷：**`done_reg` 在有效停止位时置 1，却没有正常的一周期清零路径；`bit_cnt`、`done_reg` 还同时出现在时序与组合写入过程。初始 672/1,809 次检查失配。

**修复仍失败的具体原因：**第一轮较佳版本把 `next_state==IDLE` 的清零放在更高优先级，而检测到有效停止位时恰好会令 `next_state=IDLE`，导致后面的 `state==CHECK_STOP` 置位分支被屏蔽。所以“清除状态残留”的修改同时抑制了本应产生的完成信号。第一轮为 76/1,809 失配，第二轮为 256/1,809 并被回退；达到 `REPAIR_BUDGET` 后保留第一轮。失配数减少并不等于接收协议已正确实现。

**证据：**[初始代码](campaign/generate-Prob137_fsm_serial/initial.sv)、[各修订及回退](campaign/compare-Prob137_fsm_serial/result.json)。

## Prob103 circuit2 修复后通过 RTL

**已确认的初始错误：**题面波形在四个输入均为零时输出为 1，模型却实现四输入 XOR，得到 0；初始 240/240 次检查失配，是所需偶校验函数的极性反了。

**自动修复结果：**先有一次无待验证修订的验证请求被拒绝，随后 Agent 真正修改为两组 XOR 相等判断，完成编辑后验证并通过 RTL 四阶段。完整网表仍是环境阻断，不计为正式恢复成功。

**证据：**[初始代码](campaign/generate-Prob103_circuit2/initial.sv)、[修复源码](campaign/compare-Prob103_circuit2/revisions/ef70816b-818c-41aa-9c8f-3a584914488f/solution.sv)、[工具及验证记录](campaign/compare-Prob103_circuit2/result.json)。

## Prob069 truthtable1

**已确认的遗漏：**真值表中 `x3,x2,x1=0,1,0` 应输出 1，初始表达式的所有积项却都要求 `x1=1`，使该行输出 0。初始为 4/114 次检查失配。

**修复流程：**一次完整编辑及验证仍为 4/114，判定无改善并回退；随后再次提交已经被拒绝的修订，最终 `REPEATED_ACTION_REJECTED`。不能因为大多数样本通过，就忽略题面已明确给出的这一反例。

**证据：**[初始表达式](campaign/generate-Prob069_truthtable1/initial.sv)、[验证与重复拒绝](campaign/compare-Prob069_truthtable1/result.json)。

## Prob057 kmap2

**已确认的初始错误：**公开 Karnaugh 表的 `ab=01, cd=01` 格为 0；模型表达式中的 `b & ~c & d` 却使该输入输出 1。初始 260/463 次检查失配，第一次编辑改善到 210/463，仍未通过。

**最终停止原因：**随后 30B 的第二轮修复规划及其一次输出恢复都达到 1,024 个输出 token，记录 `finish_reason=length`，最终 `PLANNER_OUTPUT_TRUNCATED`。这是规划侧输出上限，不是 8B 代码生成超时，也不是云端 HTTP 失败。

**日志质量说明：**异常终止路径的顶层结果未写入 `valid_repair_attempts` 汇总字段，但 `repair_attempts` 已保留一条 `valid=true` 且绑定实际重验证的完整记录。最终派生汇总会明确标注从该记录重建 1 次有效尝试，不把缺失字段默认为没有修复，也不回写原始结果。

**证据：**[初始表达式](campaign/generate-Prob057_kmap2/initial.sv)、[修改及终态](campaign/compare-Prob057_kmap2/result.json)、规划及恢复原始记录目录（历史路径：`campaign/plans/Prob057_kmap2/`，本包未收录）。

## Prob062 bugs mux2

**已确认的修复任务理解不完整：**初始答案把 `out` 改为八位，却保留题面待修复实现中的一位 `sel` 直接与八位数据逐位 AND 的表达式，没有形成对全部数据位一致的选择。初始为 192/226 次失配。

**实际修复：**第一轮只交换两路数据，仍使用同样的标量掩码写法，失配降到 90/226 但未通过；第二轮又回到 192/226，被回退。最终为 `REPAIR_BUDGET`，保留第一轮较佳但仍不正确的版本。这说明单看失配下降不足以确认修复满足 mux 规格。

**证据：**[初始代码](campaign/generate-Prob062_bugs_mux2/initial.sv)、[第一轮版本](campaign/compare-Prob062_bugs_mux2/revisions/ce143798-b367-4538-accf-18cacf201df5/solution.sv)、[失配及回退记录](campaign/compare-Prob062_bugs_mux2/result.json)。

## Prob104 mt2015 muxdff

**已确认的接口理解错误：**任务要求从三位父模块中分解一个一位 mux 加触发器子模块，当前 `q_in` 明确为一位。模型却将父模块的三位拼接表达式直接写进子模块，并访问 `q_in[1]`、`q_in[2]`。Vivado 报 `VRFC 10-3186`，不能索引该非数组标量。

**Harness 限制：**该主诊断未被现有编译类别覆盖，且伴随模块忽略消息，终态 `POLICY_BLOCKED / UNCLASSIFIED_FAILURE`，没有修复机会。这里有明确的当前题面父模块表达式来源，不应仅凭答案出现三位表达式就推断发生跨题上下文串扰。

**证据：**[初始代码](campaign/generate-Prob104_mt2015_muxdff/initial.sv)、[编译终态](campaign/compare-Prob104_mt2015_muxdff/result.json)。

## Prob133 2014 q3fsm

**已确认的终止原因：**8B 首次候选和一次输出恢复都触及 2,048 输出 token 上限，累计 4,096，均记录 `OUTPUT_TRUNCATED`，无法得到完整候选，因此未运行 EDA。两个调用均为 HTTP 200 且带 usage，不是云端断连。

**证据：**[两次生成及恢复记录](campaign/generate-Prob133_2014_q3fsm/result.json)。原始工具参数片段在对应请求的 SSE 和模型 stream 文件中，空的正文文件不表示模型没有输出。

## Prob092 gatesv100

**已确认的方向错误：**与四位的 Prob094 同类：`out_different` 应比较本位和较高索引邻位，最高位环绕最低位，源码却比较较低索引邻位并在第 0 位环绕。例如第 98 位被写成 `in[98]^in[97]`，而题意要求与 `in[99]` 比较。

**实际验证：**初始及两轮有效修改后均为 401/401 次检查失配，均无改善并回退，最终 `REPAIR_BUDGET`。不能因位宽从 4 扩为 100 就把相同方向错误当作新的网络故障。

**证据：**[初始邻位表达式](campaign/generate-Prob092_gatesv100/initial.sv)、[两轮无改善的验证](campaign/compare-Prob092_gatesv100/result.json)。

## Prob139 2013 q2bfsm

**已确认的时序实现错误：**题面要求复位释放后的下一个边沿产生 `f` 脉冲；模型用旧 `state==B` 更新 `f_reg`，使该脉冲再迟一个周期。题面还要求等待 y 的两周期内保持 `g=1`，但初始代码仅在 E 状态置 `g_reg=1`，等待状态 D 仍保持原来的 0。初始为 252/2,003 次检查失配。

**修复后仍失败：**一次编辑及重验证改善到 172/2,003，但后续又请求无待验证修改的验证、重复提交当前候选，最终 `REPEATED_ACTION_REJECTED`。改善版本仍未通过，不能算作成功恢复。

**证据：**[初始输出时序](campaign/generate-Prob139_2013_q2bfsm/initial.sv)、[改善及工具拒绝记录](campaign/compare-Prob139_2013_q2bfsm/result.json)。

## Prob102 circuit3

**已确认的函数归纳错误：**初始式为 `(b & (c|d)) | (~b & d)`，完全忽略输入 a。公开波形的 `a,b,c,d=0,0,0,1` 应输出 0，模型却输出 1；`1,0,1,0` 应为 1，模型却为 0。初始 50/240 次检查失配。

**修复流程失效：**先请求没有待验证修改的验证，随后两次原样候选均被拒绝，最终 `REPEATED_ACTION_REJECTED`。有效修复为 0。

**证据：**[初始表达式](campaign/generate-Prob102_circuit3/initial.sv)、[工具拒绝及终态](campaign/compare-Prob102_circuit3/result.json)。

## Prob142 lemmings2

**已确认的编译错误：**`current_state` 为 `state_t` 枚举，`state_reg` 却是普通 `logic[1:0]`，源码直接 `assign current_state=state_reg`。Vivado 报 `VRFC 10-2649`：枚举变量只能由相同枚举类型或其成员赋值。该候选没有进入行为仿真，不能用未测试的 FSM 行为代替编译失败原因。

**Harness 限制：**主诊断与模块忽略消息的组合未被当前修复分类覆盖，终态为 `POLICY_BLOCKED / UNCLASSIFIED_FAILURE`，有效修复为 0。

**证据：**[初始类型及赋值](campaign/generate-Prob142_lemmings2/initial.sv)、[编译终态](campaign/compare-Prob142_lemmings2/result.json)。

## Prob058 alwaysblock2

**已确认的编译错误：**`out_always_comb`、`out_always_ff` 均为默认 net 输出，分别被组合与时序 `always` 过程赋值。Vivado 报两条 `VRFC 10-1280`。这是与 Prob039、Prob119 同类的过程赋值目标声明错误，而非 XOR 运算本身的失配。

**Harness 限制：**同样被现有未知主诊断加 consequential 消息组合阻断，终态 `POLICY_BLOCKED / UNCLASSIFIED_FAILURE`，没有得到模型修复机会。

**证据：**[初始输出声明](campaign/generate-Prob058_alwaysblock2/initial.sv)、[编译及策略终态](campaign/compare-Prob058_alwaysblock2/result.json)。

## Prob030 popcount255 候选恢复后通过 RTL

**已确认的可恢复错误：**首次 8B 原生候选触发 `OUTPUT_TRUNCATED`，没有完整可提取的 RTL。按冻结协议执行的一次输出恢复生成了有效候选，该候选随后通过 RTL 四阶段，未进行基于 EDA 反馈的语义修复。完整网表仍被环境阻断。

这类候选恢复与 `edit_dut` 后重验证的语义修复不是同一种计数；它也意味着本轮“首个有效候选通过”不能直接当作严格单次生成的 pass@1。

**证据：**[两次候选调用](campaign/generate-Prob030_popcount255/result.json)、[RTL 验证终态](campaign/compare-Prob030_popcount255/result.json)。

## Prob131 mt2015 q4 规划恢复后通过 RTL

**已确认的可恢复错误：**30B 首次规划达到输出上限，记录为 truncated；按照已有协议请求较短的完整计划后继续，随后 8B 候选通过 RTL 四阶段。没有进行基于 EDA 的语义修复，完整网表仍环境阻断。不能因任务最后通过 RTL 就从调用日志里删除这次规划失败。

**证据：**规划及恢复记录（历史路径：`campaign/plans/Prob131_mt2015_q4/`，本包未收录）、[RTL 验证终态](campaign/compare-Prob131_mt2015_q4/result.json)、[模型级错误索引](model-errors.csv)。

## 规划截断的完整对账

除各题的最终终态外，30B 共发生 16 次输出截断，涉及以下 10 题。14 次所在的规划绑定之后成功生成了完整计划并继续；Prob057 的两次截断发生在同一失败绑定，最终没有完整计划。它们不是 HTTP 失败，也不应全部计为额外的失败题目。

| 题目 | 规划截断调用次数 |
| --- | --- |
| Prob057_kmap2 | 2 |
| Prob068_countbcd | 1 |
| Prob069_truthtable1 | 1 |
| Prob083_mt2015_q4b | 3 |
| Prob098_circuit7 | 2 |
| Prob101_circuit4 | 2 |
| Prob102_circuit3 | 1 |
| Prob131_mt2015_q4 | 1 |
| Prob138_2012_q2fsm | 1 |
| Prob139_2013_q2bfsm | 2 |

8B 候选生成另有 5 次输出截断：Prob030 一次，Prob089 两次，Prob133 两次。合计 21 次模型级输出错误均在 [model-errors.csv](model-errors.csv) 中保留；其中的规划错误与各题功能错误可以同时发生，不能把调用次数与失败题数相加。
