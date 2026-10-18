# 八例逐项分析：诊断、规划、编码与拒绝恢复

日期：2026-10-18。全部 16 个运行均保留。四阶段通过是本地 RTL 证据，不是正式网表接受；所有新探针均无校准网表 profile。模型内部理解不可直接观察，以下只判断实际输出、修改和工具结果。

统一索引：[模型原文](model-output-index.json)、[调用与 HTTP/SSE](call-index.json)、[规划复核](plan-format-review.json)、[代码与恢复证据](rule-transfer-evidence.json)。

## Probe201：容量例没有到达模型

六个隐式枚举成员使用两位基类型。真实展开报 `VRFC 10-8928`：Z4 超出可表示范围；`10-3279`：Z5 的值重复；随后有 `XSIM 43-3322` 展开摘要。前两项虽归因为 DUT 错误，但该组合未被修复路由接受，返回 `UNCLASSIFIED_FAILURE`。

ON/OFF 均 `POLICY_BLOCKED`、0 次规划/编码。不能评价模型是否应用了 n<=2^w 的规则，也不能把它计为模型胡乱修改。本地预检证明错误可检出，不证明正常 Agent 能接到这个错误。这是需要独立修复的路由缺口，本轮没有为通过测试而放宽准入。

[ON 结果及原始 EDA 路径](campaign/arms/on/compare-Probe201_six_phase/result.json)、[OFF 结果](campaign/arms/off/compare-Probe201_six_phase/result.json)。

## Probe202：唯一性修复，两种不同的恢复

四个成员用两位可以容纳，但 FLUSH 错用 SCAN 的编码。两侧最终只把 FLUSH 的重复值改为规定值，保持类型、公共接口和其余状态码。规划与编码器实际修改逐字一致，72 次仿真检查、0 不匹配，四阶段通过。

OFF 第一规划虽然诊断和代码修改正确，但 cause 只引用错误说明，没有引用对应实际源码，定位检查未通过。恢复后补齐源码引用，原修改方向保持不变，成功进入编码。ON 第一工具动作在没有新候选时提前验证；Host 拒绝后下一动作改为有效编辑。两侧各 4 次推理，不能仅按调用次数断言技能更优。

[ON 动作与结果](campaign/arms/on/compare-Probe202_unique_stage/result.json)、[OFF 结果](campaign/arms/off/compare-Probe202_unique_stage/result.json)。

## Probe203：类型诊断正确，ON 未适应多行限制

普通三位向量赋给命名 enum，初始报 `VRFC 10-2649`。ON 两次均指出类型身份不同，提出把存储声明统一为 enum 类型，但 before/after 同时包含两行；在当前 Host 的 CR/LF 禁令下无效。恢复只调整 checks 的标点，保留相同多行方案。ON 共 2 次规划、0 次编码，未执行任何候选验证，不得将拟议方案判为已修好或已证伪。

OFF 首次也有多行片段，cause 为 201 字符；恢复改用单行显式 enum 转换，并缩短 cause。编码器逐字落实，四阶段通过，72 检查、0 不匹配。这是本轮真实规划策略改变的正例，发生在 OFF，而非新技能组。

[ON 恢复原文](campaign/arms/on/plans/Probe203_typed_toggle/42ec76ad3ca6092c5473f8692c946cb2d937e2370e281c302571e95f330a922a/run-fUFuqk/output.txt)、[OFF 首次输出](campaign/arms/off/plans/Probe203_typed_toggle/d50b17bd873aaa89ba7f3a1b3191e25224a3db0a4ce5e17e8e2e15520dac7de0/run-MRyLEy/output.txt)、[OFF 最终结果](campaign/arms/off/compare-Probe203_typed_toggle/result.json)。

## Probe204：没有扩宽固定标量接口

反馈存储单元错误使用 `serial[4]`，但 serial 是固定标量。两侧均依据规格去掉错误索引，保留装载优先、前值 XOR 反馈、复位与保持关系。编码器与规划逐字一致，只有错误索引被移除，没有扩大端口或重新生成整个模块。

两侧各 3 次推理，四阶段通过，72 检查、0 不匹配。这支持在这个新例子上能做受约束修复；因为 OFF 同样成功，不支持新技能额外收益。

[ON 结果](campaign/arms/on/compare-Probe204_feedback_serial/result.json)、[OFF 结果](campaign/arms/off/compare-Probe204_feedback_serial/result.json)。

## Probe205：拒绝后诊断反而更长

初始 `parity` 不允许过程赋值，报 `VRFC 10-1280`。ON 正确指出声明问题，并拟议在既有输出声明增加 reg；但首次 cause 长 223 字符，超过 160。恢复没有压缩，反而增加到 297 字符，仍被拒绝。两次均完整输出、未截断；不是输出 token 不够，也不是没有识别报错类型。

ON 无编码调用。OFF 使用简短诊断，同样的声明修改方向通过规划，由编码器落实后四阶段通过，72 检查、0 不匹配。该例说明“更多规则解释”不自动等于“更好的受限执行”；不得在事后截短 ON 输出或直接套用 OFF 修改来提高成绩。

[ON 首次原文](campaign/arms/on/plans/Probe205_packet_parity/872ac47314bcdaa1834226313745f96d7271740300b758626ac7089b049190f4/run-TySJR8/output.txt)、[ON 恢复原文](campaign/arms/on/plans/Probe205_packet_parity/872ac47314bcdaa1834226313745f96d7271740300b758626ac7089b049190f4/run-wjx1Yo/output.txt)、[OFF 结果](campaign/arms/off/compare-Probe205_packet_parity/result.json)。

## Probe206：多驱动方向合理，但两侧规划都未交执行

初始 pulse_reg 被时钟过程及组合过程同时写入，展开报 `VRFC 10-3818`。两侧都定位两个写入者并拟议移除组合驱动，保留注册输出、复位和保持时序；并非完全不识别多驱动。

两侧首次及恢复均保留多行 before/after，违反当前 Host 格式。OFF 恢复另将 cause 增至 201 字符。两侧各 2 次规划、0 次编码，均 `PLANNER_PLAN_INVALID`。未跑候选 EDA，不能称方案已验证有效；同时应单列这个 Host 格式限制，而非说编译器证伪了拟议删除操作。

[ON 恢复原文](campaign/arms/on/plans/Probe206_owned_pulse/d752447f7957515236c7e65df6abde72101f9720cae7b1867a78785b45ca6923/run-KmBm7U/output.txt)、[OFF 恢复原文](campaign/arms/off/plans/Probe206_owned_pulse/21ab4d356df7e0a5cf0b2c661b1737ae8e8b5af7ddcc95442722cc74d2f8596f/run-Xpltgl/output.txt)。

## Probe207：合法向量没有被当成标量

word 是合法五位向量，错误是选错了位，而不是不能位选。两侧只将表达式中的位 3 改为规格要求的位 2，保留 word[0]、输入宽度和输出宽度，没有套用“标量不得索引”而去掉全部位选。

两侧各 3 次推理，四阶段通过，穷举 32 个输入、0 不匹配。两侧修改均与规划逐字一致。

[ON 结果](campaign/arms/on/compare-Probe207_valid_bitselect/result.json)、[OFF 结果](campaign/arms/off/compare-Probe207_valid_bitselect/result.json)。

## Probe208：合法容量和状态编码保持不变

原 enum 有三个成员、两位容量充足，编码本来合法。错误是 marker 指向中间态而不是末态。两侧仅修改 marker 的比较条件；类型、容量和 FIRST/MIDDLE/LAST 的原始声明与编码逐字保留。

ON 又先在 `pending=false` 时调用验证，被拒后转为有效编辑；OFF 直接编辑。ON 4 次、OFF 3 次推理，四阶段通过，72 检查、0 不匹配。新技能没有阻止这次错误动作，但具体反馈后的局部恢复成立。

[ON 结果与拒绝反馈](campaign/arms/on/compare-Probe208_valid_capacity/result.json)、[OFF 结果](campaign/arms/off/compare-Probe208_valid_capacity/result.json)。

## 汇总边界

10 个实际编辑全部与通过检查的规划逐字一致，并通过内部四阶段；未发现仅改注释、原样重放或违反固定端口的编码器候选。没有这些实际拒绝机会，不等于已验证它们的恢复能力。

规划无效共 10 次：9 次格式问题，1 次实际源码引用不合规。新技能确实进入 16 个请求，OFF 没有技能。ON 的三次规划恢复均失败，OFF 三次有两次成功；两个真实工具拒绝均在 ON，后续都变成有效修改。不能笼统写“加入技能后模型已经理解规则”，也不能把所有失败归因于胡乱改 RTL。
