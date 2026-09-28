# Prob104：成功修复的收益边界

初始 RTL 正确实现了 `Q <= L ? r_in : q_in`，但没有初始化 Q。Baseline 仿真在 time=5 的首次检查发生 1/199 次不匹配；time=0 的可见波形摘要显示 `Q_ref=0`、`Q_dut=x`。

Agent 用 3 次完整模型请求依次执行 read_current_rtl、edit_dut、verify_rtl，只增加 `initial Q = 1'b0`，其余时序逻辑不变。新版本通过 199/199 次仿真检查及综合，形成一次真实、可追踪的 FAIL→PASS。没有强制动作、重复抽样或 Host 代写候选。

事后核对公开题面与参考实现：题面没有显式要求上电初值，参考 RTL 包含 `initial Q=0`。因此，这次收益准确地说是根据观测反馈适配评测器初始化要求，不能将它夸大为复杂功能逻辑的修复能力。FPGA 综合通过也不自动代表同一初始化写法适合其他目标工艺。

证据：[比较终态](../compare-Prob104_mt2015_muxdff/result.json)、[修复后 RTL](../compare-Prob104_mt2015_muxdff/final.sv)、[修改请求正文](../compare-Prob104_mt2015_muxdff/models/run-gzWE84/prompt-final.txt)、[逐题完整记录](../analysis/Prob104_mt2015_muxdff.md)。参考源仅供事后 Host 归因，没有发送给模型。
