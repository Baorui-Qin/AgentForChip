# Prob034：第二个增益同样来自初始化约定

## 已确认的改动与结果

公开规范要求 8 个正边沿触发的 D 触发器，没有显式规定上电初值。初始候选使用 `always @(posedge clk) q <= d`，编译、展开通过，仿真为 1/41 次不匹配，首次计数时间为 5 ps。

Agent 的第一次请求 run-pFFwG5 直接调用 edit_dut，仅增加 `initial q = 8'h00;`。第二次请求 run-Dfm0xp 调用 verify_rtl，新版本通过 41/41 次仿真检查及综合。两次模型请求、两个工具动作均完整且被 Host 接受，没有强制动作恢复。增量 usage 为 6686 输入 token、4368 输出 token。

初始 EDA 为 run-KOqx6B，修复后 EDA 为 run-0BZLqK。初始源 SHA-256 为 `7533b44c970613b4df013fc6860ab8cfd42382e027ec3b4174e8e07bf49944c8`，最终为 `1b15393ea2efc9cf8e45221915add33eb6ca7fc2cc4e50f3d9ecee358c63a6c9`。

## 反馈及事后归因

模型收到的波形摘要显示 time=0 时 `q_ref=00000000`、`q_dut=xxxxxxxx`；time=5 的时间戳结束值则已经相同。模型返回的 reasoning 多次讨论“首次失败在 5，但波形 5 时已经相等”的表面冲突，最终选择补初值。

测试完成后，Host 核对参考源，确认它包含 `initial q = 8'h0`。测试台在时钟边沿直接检查匹配，没有调用其定义的 wait_for_end_of_timestep。因此，边沿检查读取更新前的值，而 VCD 摘要显示更新后的稳定值，是与源码和日志一致的解释；不能把模型 reasoning 中“报告时间可能有 bug”的猜测当成已证实缺陷。本文没有新增事件区域探针，也不冒充记录了检查瞬间的完整调度轨迹。

该案例与 Prob104 属于同一类收益：通过可见反馈适配评测器的初始化约定。它确实是可复核的 FAIL→PASS，但不能据此声称 Agent 已展示复杂算法或状态机修复增益。参考及测试台只用于事后 Host 分析，未送入模型请求。

## 证据

- [比较终态](D:/AMD/p100-0922-c3/compare-Prob034_dff8/result.json)
- [最终 RTL](D:/AMD/p100-0922-c3/compare-Prob034_dff8/final.sv)
- [实际修改请求](D:/AMD/p100-0922-c3/compare-Prob034_dff8/models/run-pFFwG5/prompt-final.txt)
- [接口返回 reasoning](D:/AMD/p100-0922-c3/compare-Prob034_dff8/models/run-pFFwG5/reasoning.txt)
- [逐题完整记录](D:/AMD/p100-0922-c3/analysis/Prob034_dff8.md)
- [参考源](D:/AMD/verilog-eval/dataset_spec-to-rtl/Prob034_dff8_ref.sv)
- [冻结兼容测试台](D:/AMD/phase1-validation/p10-full-compat-v1-r2/derived/Prob034_dff8/tb.sv)
