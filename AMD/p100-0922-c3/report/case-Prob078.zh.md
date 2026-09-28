# Prob078：工具能执行，但反馈分辨率和修改质量限制修复

## 实际轨迹

Baseline 编译、展开通过，仿真 93/224 次不匹配。初始实现为分别在正负边沿更新两个寄存器，再使用 `assign q = clk ? q_pos : q_neg` 选择输出。修复策略正确开放 FUNCTIONAL_MISMATCH，没有证据/归因规则阻塞。

Agent 共发起 12 次模型请求：4 次正常 high reasoning 请求达到 16384 completion token 上限后触发 4 次 reasoning-off 强制动作恢复。Host 处理 8 次工具动作，接受 7 次，拒绝 1 次已否决版本重提。3 次 edit_dut 被接受，并且全部由 verify_rtl 实际重新验证；最终 REPAIR_BUDGET，保留初始的最佳已观测版本。

| 修改轮 | 实际变化 | 仿真结果 | 修订决策 |
|---|---|---:|---|
| 1 | output wire 改为 output logic，时序与 mux 逻辑不变 | 93/224 | NO_IMPROVEMENT，回退 |
| 2 | 相对第一轮主要是前置空行，仍为相同 mux 逻辑 | 93/224 | NO_IMPROVEMENT，回退 |
| 3 | 改为初始化 p/n 为 0 的双边沿 XOR 状态方案 | 223/224 | REGRESSION，回退 |

第一次重复提交因精确源哈希相同而被 REJECTED_REVISION 拒绝，随后空白变化产生新哈希，仍消耗一轮语义修复额度。这说明“字节变化”和“工具接受”不能等价于有意义的逻辑修改。回退机制确实避免将退化版本当最终成果，但不会自动创造更好的修复。

## 模型真实可见的证据

首次请求明确告诉模型 q 在 time=10 首次失败，共 93/224 次不匹配；VCD 摘要在 time=5、10、15 的记录却全部是 `q_ref == q_dut == 0`、`tb_mismatch == 0`。正文同时明确说明这些是时间戳结束值，不是 testbench 采样事件，不能据此猜测精确采样值。没有把本地存在但未发送的文件算作模型已看到的内容。

这是反馈分辨率的真实限制：日志给出边沿采样失败，摘要只展示同一物理时间最终稳定后的值，无法直接呈现 delta-cycle 中的先后变化。模型的返回 reasoning 多次在“标准双边沿实现”“零延迟采样”和“综合可接受性”之间来回推敲，消耗完整推理预算。强制动作使其产生可执行工具请求，却有两轮仅做了不改变目标行为的修改。

## 事后 Host 分析，不是模型输入

只在测试结束后的案例分析中读取参考与 testbench。参考文件明确通过组合 always 中的非阻塞赋值 `q <= clk ? qp : qn` 增加 delta-cycle 延迟；其注释也指出连续 assign 会在 clk 变化时过早改变 q。testbench 在正负时钟边沿检查匹配。因此，当前结果对事件调度顺序敏感，不能单纯解释为模型不会实现双边沿采样。

第三轮代码虽初始化 p/n，但反馈 XOR 方案还依赖输入在启动边沿有效。实际保留的 wave.vcd 中，q_dut 在 time=0 为 x，之后没有任何其他值变化记录，确认未知值贯穿运行。testbench 的 clk 从初始态设为 0，d 通过初始非阻塞赋值更新；结合代码，零时刻采样未知 d 污染交叉反馈状态是有依据的解释。VCD 未导出 p/n 内部信号，因此内部传播路径仍属于代码归因，不冒充内部波形实测。

## 后续应验证的改进

- 优先增加与 testbench 实际采样事件绑定的 expected/actual、采样区域或 delta 序号，不能把 end-of-timestamp VCD 值冒充失败瞬间。
- 对精确重复、纯空白/声明形式变化区分“新字节”与“新修复假设”，在下一版协议中明确无效修改如何计费、如何计轮次。
- 将更长 reasoning、强制动作及反馈增强作为独立对照；本轮没有中途修改问题、参考、候选或修复预算。

证据：[比较终态](../compare-Prob078_dualedge/result.json)、[工具轨迹](../compare-Prob078_dualedge/tool-trace.jsonl)、[首次请求正文](../compare-Prob078_dualedge/models/run-GVxPs2/prompt-final.txt)、[逐题完整记录](../analysis/Prob078_dualedge.md)。参考与 testbench 的读取只用于事后分析，不加入任何模型请求。
