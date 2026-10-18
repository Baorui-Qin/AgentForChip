# 七题诊断、规划、修改与拒绝原因

日期：2026-10-18。本文件区分模型诊断缺陷、Host 协议限制、工具环境限制和实际代码改善。结论来自模型公开输出及执行证据，不推断隐藏思维链。下述修复均由模型正常调用 `edit_dut` 提交，未直接改答案。

统一证据：[逐题结果](tasks.csv)、[全部原始输出索引](model-output-index.json)、[规划格式及约束复核](plan-format-review.json)、[候选重算审计](guarded-output-audit.json)。

## Prob039

题目：`Prob039_always_if`。初始编译 VRFC 10-1280，过程块向非变量 `out_always` 赋值，另有由前错引起的模块忽略信息。

两侧规划均定位输出声明，模型修改既有 ANSI 输出的变量属性而非新增重复声明。ON 首先在没有待验证候选时调用 `verify_rtl`，得到 `VERIFICATION_REQUEST_REJECTED` 和 `pending_verification=false`；反馈进入下一请求后改为 `edit_dut`。两侧最终编译、展开、RTL 仿真、综合通过，仿真各执行 226 个检查、0 不匹配。

ON 共 4 次题目推理，OFF 3 次。终态均为环境未校准，不是 DUT 仍然编译失败。[ON 结果](campaign/arms/on/compare-Prob039_always_if/result.json)、[OFF 结果](campaign/arms/off/compare-Prob039_always_if/result.json)。

## Prob060

题目：`Prob060_m2014_q4k`。初始编译 VRFC 10-5010/10-4982，非法字面量 `1'b2'b0` 导致语法错误。两侧规划均定位同一条实际赋值语句，编码器提交有效局部修改。

两侧各 3 次题目推理，四阶段均通过，仿真各执行 593 个检查、0 不匹配。无工具拒绝恢复机会；不能拿该题证明遭拒后改变策略。终态仍受网表库环境限制。[ON 结果](campaign/arms/on/compare-Prob060_m2014_q4k/result.json)、[OFF 结果](campaign/arms/off/compare-Prob060_m2014_q4k/result.json)。

## Prob119

题目：`Prob119_fsm3`。初始编译 VRFC 10-1280，过程赋值的 `out` 仍为非变量声明。两侧规划定位声明，编码器最终采用有效局部修改。

ON 在 `pending_verification=false` 时提前验证，具体拒绝反馈经压缩后的 previous-action 通道送达，下一次改为编辑。ON 4 次、OFF 3 次题目推理，四阶段通过，仿真各 459 个检查、0 不匹配。该例证明压缩后的拒绝观察仍可达及本次动作恢复，不证明一般性语义理解。[ON 结果](campaign/arms/on/compare-Prob119_fsm3/result.json)、[OFF 结果](campaign/arms/off/compare-Prob119_fsm3/result.json)。

## Prob096

题目：`Prob096_review2015_fsmseq`。本轮导入的初始答案编译通过，展开报 VRFC 10-3279：`S4` 枚举编码重复。枚举有 5 个成员，packed 基类型仅 2 位。

ON 首次规划把 `S4` 从 `2'b00` 改为已被 `S1` 占用的 `2'b01`。Host 在不修改 DUT 的预览中返回 `ENUM_CAPACITY`（width=2、members=5）及 `ENUM_DUPLICATE`（S1/S4）。恢复规划仍给出相同修改，且其 `checks` 写道：

> Base type [1:0] can represent 4 unique values, sufficient for 5 members with distinct values

这不是单纯“没看到报错”：请求中已有具体容量及重复成员反馈，模型输出仍同时包含相反的算术断言和无效修改。可以确认其没有有效应用该约束，不能据此声称知道其内部思考状态。

OFF 两次均把 `S4` 改为已被 `S2` 占用的 `2'b10`，也保留容量问题。两侧各 2 次规划、0 次编码调用，终态 `PLANNER_CONSTRAINT_REJECTED`。防护拦住了无效计划，没有证明模型修好了该题。最早的历史“逗号语法”问题不应直接套到本轮：本轮第一项实际失败是展开阶段的枚举重复。

关键原始证据：[ON 恢复输出](campaign/arms/on/plans/Prob096_review2015_fsmseq/f5c2892dcd880612785d723fef440b90432e2e1acea7fde93ba94e766c797de5/run-wNlF9R/output.txt)、[ON 恢复请求](campaign/arms/on/plans/Prob096_review2015_fsmseq/f5c2892dcd880612785d723fef440b90432e2e1acea7fde93ba94e766c797de5/run-wNlF9R/prompt-final.json)、[ON 约束回执](campaign/arms/on/plans/Prob096_review2015_fsmseq/f5c2892dcd880612785d723fef440b90432e2e1acea7fde93ba94e766c797de5/run-wNlF9R/constraint-validation.json)、[OFF 恢复输出](campaign/arms/off/plans/Prob096_review2015_fsmseq/8d52d76fc46e63687034c5a0987ad46fb756cc50d85da5b0550a3f5f4698861c/run-9Gxvgx/output.txt)。

## Prob104

题目：`Prob104_mt2015_muxdff`。初始编译 VRFC 10-3186，对标量固定输入 `q_in` 做数组索引。

ON 两次规划均准确引用标量索引语句，提出扩大内部寄存器并改用内部位选择的多行替换，没有在该方案里扩大公共输入。但本轮结构化规划继承了旧文本字段的换行禁令，`before/after` 含 CR/LF，被格式检查拦下。没有编码调用或候选 EDA，不能断言该拟议电路正确，也不能把这一拒绝直接说成模型没读懂标量报错。

OFF 首次给出相同多行方案，也被格式拒绝；恢复后改为三个单行替换，其中把固定端口 `q_in` 从宽度 1 扩到 3，Host 返回 `FIXED_PORT`，列明 expected width=1、actual width=3。该方案为绕过编译错误而违反固定接口，不可接受。两侧各 2 次规划、0 次编码调用；ON 终态 `PLANNER_PLAN_INVALID`，OFF 为 `PLANNER_CONSTRAINT_REJECTED`，原始编译问题仍在。

关键原始证据：[ON 恢复输出](campaign/arms/on/plans/Prob104_mt2015_muxdff/b684d8d143e0dd86b6a9263eb90d1a408cc2558bccfdc8ae9d8d45f2aa4b7f1a/run-vDxuI6/output.txt)、[OFF 恢复输出](campaign/arms/off/plans/Prob104_mt2015_muxdff/1a984638af9ac8639624f7b68ec379a9b13b5a4f07730cdabe552da11a2f7bc5/run-UYVfx7/output.txt)、[OFF 具体约束拒绝](campaign/arms/off/plans/Prob104_mt2015_muxdff/1a984638af9ac8639624f7b68ec379a9b13b5a4f07730cdabe552da11a2f7bc5/run-UYVfx7/constraint-validation.json)。

## Prob142

题目：`Prob142_lemmings2`。初始编译 VRFC 10-2649，普通向量向命名 enum 变量赋值，底层宽度相同并不使类型相同。

ON 指出了类型关系并提出显式 enum 转型，方向与报错相符。但首次 cause 为 204 字符（上限 160），before/after 为 252/262（每项上限 200），且含换行。恢复虽缩短代码跨度，仍保留 204 字符 cause 和多行片段；终态 `PLANNER_PLAN_INVALID`，两次规划、0 次编码调用。不能将这一失败归为没有识别 enum 类型错误。

OFF 第一次规划通过并提出转型；编码器自己选择把存储声明改为同一 enum 类型，候选被接受并经 EDA 确认编译通过，随后展开报 VRFC 10-3818：输出寄存器存在无效组合的过程驱动。这个编译改善保留为当前最佳版本，不是回退为原始编译错误。

后续规划虽指出 `always_comb` 与 `always_ff` 多驱动，却提交 before=after 的整块方案，且超过总长度/cause/代码跨度限制；一次恢复后仅保留完全相同的变量声明替换，Host 以无实质修改的 `REPEATED_CANDIDATE` 拒绝。OFF 共 3 次规划、2 次编码推理、1 个有效修改，终态 `PLANNER_CONSTRAINT_REJECTED`。能命名多驱动错误但不能给出改变驱动关系的修改，是“诊断文字不等于有效修复”的直接例子。

关键原始证据：[ON 恢复输出](campaign/arms/on/plans/Prob142_lemmings2/5f4994cbaaeccc88217596976f4b849a442ad24e09b3cdd9d07c4d4abef0f345/run-SVpba9/output.txt)、[OFF 无修改恢复输出](campaign/arms/off/plans/Prob142_lemmings2/dee9754158b3c3af29f9f30db5344d542f295805db4edb47c8ca19e5039ca810/run-wrBtYz/output.txt)、[OFF 最终结果](campaign/arms/off/compare-Prob142_lemmings2/result.json)。

## Prob058

题目：`Prob058_alwaysblock2`。初始编译 VRFC 10-1280，`out_always_comb` 和 `out_always_ff` 的声明不允许过程赋值。两侧最终模型修改既有输出声明，四阶段通过，仿真各 437 个检查、0 不匹配。

ON 提前验证被拒后转为有效编辑，4 次题目推理；OFF 为 3 次，无该拒绝。终态均为网表环境未校准。[ON 结果](campaign/arms/on/compare-Prob058_alwaysblock2/result.json)、[OFF 结果](campaign/arms/off/compare-Prob058_alwaysblock2/result.json)。

## 跨题观察与边界

三次提前验证拒绝都得到下一次有效编辑，均通过 RTL 四阶段；两侧的九个编辑均按原工具参数重算成功。本批没有编码器锚点或注释重放的真实拒绝机会，不能把单元测试当作真实模型的这两类恢复能力证据。

三个重点题的六个运行中五个没有编码调用，另一个只有编译阶段改善。较少的重复工具调用有 Host 门控作用，不能称为模型自然停止胡乱修改。七题 21 次规划共有 12 次无效，其中 6 次格式、6 次约束；格式错误需要单列，不能混入“模型没理解错误”的计数。

六个额外能力探针仅 4 个成功：ControlComma ON/OFF 通过，ControlEnum ON 格式失败/OFF 通过，ControlScalar ON 通过/OFF 格式失败。失败日志未删、未补跑选优。新技能在正常路径中可达但未显示七题额外通过率收益，保留为候选技能，不宣称已学会通用纠错。

共同环境终态：所有八个四阶段成功运行都因 2026.1/2025.2 库哈希不一致，未获得完整网表验收。所有原始生成历史候选尝试仍保留并与当前零新增生成调用区分，见 [导入生成历史](imported-generation-attempts.csv)。
