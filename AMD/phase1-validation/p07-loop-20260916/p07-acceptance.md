# P07 有限修复循环验收

当前结论：**NOT YET VERIFIED**。范围仅为人工逐候选审批的半自动联调。

## 执行范围

新实验不替换历史 functional、syntax 或 synthesis-only 记录；固定负例、TB、XDC 和评分判据不改动。仅固定手写夹具可直接执行，模型候选必须逐份人工安全审查。首次生成调用为 0。

本轮实际 API 请求 1 次，semantic repair 1 轮，transport retry 0 次。
模型耗时 3015 ms；候选 EDA 112069 ms；校准 EDA 175335 ms；已完成审批等待 316085 ms，当前仍在等待 0 ms。人工等待不计入活动预算。
组件测试：233 通过，4 可选跳过，0 失败。它们不是实际模型修复成功的替代证据。

## 历史证据

- functional: VERIFIED，目录：D:\AMD\phase1-validation\p07-20260916\repair-976c8961-8e44-4ba7-97f2-54fb3c542683。本轮未重跑或覆盖。
- syntax: VERIFIED，目录：D:\AMD\phase1-validation\p07-20260916\repair-ba415c6f-29b5-4dc1-8bcc-a66bec7d2dd8。本轮未重跑或覆盖。
- synthesis-only: MODEL_CONNECTION，目录：D:\AMD\phase1-validation\p07-20260916\repair-adbf4093-ae00-40b2-b883-3154293b6b2a。本轮未重跑或覆盖。

## 本轮时间线

### synthesis-only

实验：a5b5290c-57f0-46a0-9779-2f557811a0eb；当前状态：TERMINAL / VERIFIED。

目录：D:\AMD\phase1-validation\p07-loop-20260916\repair-a5b5290c-57f0-46a0-9779-2f557811a0eb

| 验证轮 | 源码 SHA256 | Compile | Elaborate | Simulation | Synthesis |
| --- | --- | --- | --- | --- | --- |
| 0 | ba4634e3a8c463ceee91806036b4990455a11033a87c606f53a6256595116eb1 | PASS | PASS | PASS | FAIL |
| 1 | ef464382e434b880321eaa153feb0f7596fa3bf63aa172ad66a8b6dc50d1e7c7 | PASS | PASS | PASS | PASS |

宿主决策：[{"action":"propose_repair","rule":"DUT_MISSING_SYNTHESIS_MODULE","reason":"Missing DUT dependency with recognized same-invocation summaries.","stage":"synthesis"},{"action":"stop","rule":"VERIFIED","reason":"All stages passed.","stage":null}]。

反馈 1：synthesis；primary={"category":"error","message_id":"Synth 8-439","file":"rtl/solution.sv","line":4,"message":"module 'missing_synthesis_cell' not found","severity":"ERROR","origin":"dut","attribution":"DUT_SYNTHESIS_ERROR","repairable_by_model":false,"kind":"dependency","invocation":"synthesis"}；D:\AMD\phase1-validation\p07-loop-20260916\repair-a5b5290c-57f0-46a0-9779-2f557811a0eb\feedback-1.json

版本 0：67efd2a8-7de9-4eed-99dc-2bdd4a27846b，SHA256=ba4634e3a8c463ceee91806036b4990455a11033a87c606f53a6256595116eb1。

```verilog
module counter(input wire clk, input wire rst, output reg [3:0] count);
always @(posedge clk) if (rst) count <= 0; else count <= count + 1;
`ifdef SYNTHESIS
missing_synthesis_cell broken();
`endif
endmodule
```

版本 1：c57cff86-439e-4c72-8250-b72a4bf0ab62，SHA256=ef464382e434b880321eaa153feb0f7596fa3bf63aa172ad66a8b6dc50d1e7c7。 Diff：D:\AMD\phase1-validation\p07-loop-20260916\repair-a5b5290c-57f0-46a0-9779-2f557811a0eb\revision_0-to-1.diff

```verilog
module counter(input wire clk, input wire rst, output reg [3:0] count);
  always @(posedge clk) begin
    if (rst)
      count <= 4'b0000;
    else
      count <= count + 1'b1;
  end
endmodule
```

模型：semantic round 1 / transport attempt 1；deepseek-official/deepseek-flash；tokens=887/108；wall=3015 ms；error=none。

原始请求与响应事件：D:\AMD\phase1-validation\p07-loop-20260916\repair-a5b5290c-57f0-46a0-9779-2f557811a0eb\models\run-CXEt3r\events.jsonl；完整响应：D:\AMD\phase1-validation\p07-loop-20260916\repair-a5b5290c-57f0-46a0-9779-2f557811a0eb\models\run-CXEt3r/response.txt。

EDA 结果与逐工具 invocation/log 索引：D:\AMD\phase1-validation\p07-loop-20260916\repair-a5b5290c-57f0-46a0-9779-2f557811a0eb\eda\run-9Nkf8m\result.json。

仿真判据：{"test_completed":true,"checks_executed":20,"mismatch_count":0,"evaluator_id":"handwritten-counter-v1"}。

综合指标：{"synthesizable":false,"resources":{"lut":null,"ff":null,"bram":null,"dsp":null},"timing":{"wns":null,"unit":"ns","stage":"post_synthesis","reason":"report_unavailable"}}。警告：[]。

EDA 结果与逐工具 invocation/log 索引：D:\AMD\phase1-validation\p07-loop-20260916\repair-a5b5290c-57f0-46a0-9779-2f557811a0eb\eda\run-gUbv10\result.json。

仿真判据：{"test_completed":true,"checks_executed":20,"mismatch_count":0,"evaluator_id":"handwritten-counter-v1"}。

综合指标：{"synthesizable":true,"resources":{"lut":2,"ff":4,"bram":0,"dsp":0},"timing":{"wns":4.405,"unit":"ns","stage":"post_synthesis","reason":null}}。警告：[{"category":"timing_constraints_not_met","message_id":null,"file":null,"line":null,"message":"Vivado timing summary states: Timing constraints are not met. WNS alone does not cover all timing checks.","severity":"WARNING","origin":"unknown","attribution":"UNKNOWN","repairable_by_model":false}]。

原始时序表（保留 WNS、WHS 等独立检查，不将正 WNS 当作全面收敛）：D:\AMD\phase1-validation\p07-loop-20260916\repair-a5b5290c-57f0-46a0-9779-2f557811a0eb\eda\run-gUbv10\build\.rtl-synth-xl9YzQ\timing.rpt

```text
    WNS(ns)      TNS(ns)  TNS Failing Endpoints  TNS Total Endpoints      WHS(ns)      THS(ns)  THS Failing Endpoints  THS Total Endpoints     WPWS(ns)     TPWS(ns)  TPWS Failing Endpoints  TPWS Total Endpoints  
    -------      -------  ---------------------  -------------------      -------      -------  ---------------------  -------------------     --------     --------  ----------------------  --------------------  
      4.405        0.000                      0                    4       -0.063       -0.217                      4                    4        2.225        0.000                       0                     5  


Timing constraints are not met.
```

最终导出绑定已确认：true。多轮当前源码/新反馈绑定已确认：false。

### controlled_multi_round

实验：cde8e956-3dcc-4d10-903f-6ebc5c53ba8d；当前状态：TERMINAL / POLICY_BLOCKED。

目录：D:\AMD\phase1-validation\p07-loop-20260916\repair-cde8e956-3dcc-4d10-903f-6ebc5c53ba8d

| 验证轮 | 源码 SHA256 | Compile | Elaborate | Simulation | Synthesis |
| --- | --- | --- | --- | --- | --- |
| 0 | 7c173c15c508b29fe6c54e9a2aa34cf9907c4093c0e800ea2ebe19c1f3c4a19d | FAIL | SKIPPED | SKIPPED | SKIPPED |

宿主决策：[{"action":"blocked","rule":"UNCLASSIFIED_FAILURE","reason":"Evaluator, unknown, or unsupported failure requires host investigation.","stage":"compile"}]。

首次编译已按 SystemVerilog 模式执行。`VRFC 10-4982` 是 DUT 第 5 行语法错误；同位置的 `VRFC 10-8549` 关键字上下文错误未被当前归一化逻辑识别，仍为 `unknown`。宿主因此返回 `UNCLASSIFIED_FAILURE`，模型调用为 0，后续三个阶段均为 SKIPPED。这是宿主识别覆盖缺口，不是 API 错误、遗漏 -sv 或模型修复失败。原夹具、冻结策略和失败记录均保留，未通过重跑或修改评分器绕过。

独立调查记录：D:\AMD\phase1-validation\p07-loop-20260916\controlled-blocker.json

版本 0：09609cfd-1a93-4378-a4e2-c0795f0dff82，SHA256=7c173c15c508b29fe6c54e9a2aa34cf9907c4093c0e800ea2ebe19c1f3c4a19d。

```verilog
module counter(input wire clk, input wire rst, output reg [3:0] count);
always @(posedge clk) begin
    if (rst) count <= 0;
    else count <= count + 2
end
endmodule
```

EDA 结果与逐工具 invocation/log 索引：D:\AMD\phase1-validation\p07-loop-20260916\repair-cde8e956-3dcc-4d10-903f-6ebc5c53ba8d\eda\run-7IAtVC\result.json。

仿真判据：{"test_completed":null,"checks_executed":null,"mismatch_count":null,"evaluator_id":null}。

最终导出绑定已确认：false。多轮当前源码/新反馈绑定已确认：false。

## AC-P07-1 至 AC-P07-10

| 验收项 | 状态 | 证据边界 |
| --- | --- | --- |
| AC-P07-1 | PASS | Historical real functional/syntax plus this independent synthesis repair. |
| AC-P07-2 | PASS | Historical connection failure preserved; new independent synthesis experiment. |
| AC-P07-3 | NOT YET VERIFIED | Real first repair fails; second uses new current-source feedback and passes. |
| AC-P07-4 | PASS | Reviewed candidate verifications start at compilation with distinct snapshots; Mock also covers multiple rounds. |
| AC-P07-5 | PASS | Frozen evaluator/config/code and historical artifact hashes remain unchanged. |
| AC-P07-6 | PASS | Mock Loader and workflow distinguish transport attempts from semantic rounds. |
| AC-P07-7 | PASS | Mock transport exhaustion stops with transport, not semantic, failure. |
| AC-P07-8 | PASS | Mock repair-budget branch; not a forced real cloud failure. |
| AC-P07-9 | PASS | Mock repeated candidate cycle stops before revalidation. |
| AC-P07-10 | NOT YET VERIFIED | Current verified/exported source hashes match, without stale PASS. |

## 逐项回答

1. synthesis-only 是否补跑成功：是，本次真实四阶段通过。
2. 本轮实际 transport retry：0 次；Mock 故障注入单独统计。
3. synthesis-only 实际修改：以上版本源码和自动生成的 diff 是权威记录，不由宿主代写补丁。
4. synthesis-only 四阶段全 PASS：是。
5. 实际第二轮 semantic repair：尚无满足两轮 FAIL→PASS 的真实实验。
6. Round 1 未通过原因：见实际四阶段结果及新反馈；未执行时不推断。
7. Round 2 新反馈：见 feedback-2.json；未产生时不存在。
8. Round 2 修改：见 revision_1-to-2.diff；不人工修改模型答案。
9. 每份新候选必须从 compile 开始；当前实测见时间线，组件测试覆盖两轮重启。
10. 冻结资产或实现变化：未发现；历史文件和冻结实现/配置已重新核对。
11. repeated candidate：组件测试验证跨轮哈希重复会停止；不将 Mock 结果称作真实模型行为。
12. repair budget exhausted：组件测试验证最多三轮后停止；不额外调用 API 强行耗尽预算。
13. 当前仍需逐轮人工批准。
14. 即使全部 AC 通过，也只能签收受控/半自动闭环，不签收无人干预 Agent。
15. Prob038 original evaluator compatibility: BLOCKED。
16. 当前可签收范围：组件实现及已取得的单步证据；真实多轮闭环尚不能签收。

## 日志位置与限制

每个实验的 event-*.json 是追加状态事件；models/run-*/events.jsonl 保存实际请求、响应与 usage，transport.json 记录有限重试。eda/run-*/result.json 索引每次 xvlog/xelab/xsim/Vivado 的参数、stdout/stderr 和退出事实。完整日志不回灌模型。

TTFT 未采集，价格未知，不推算费用；正 WNS 不是实现后全面时序收敛。自然缺陷、完整 OS 隔离、无人干预执行和 Prob038 原评分资产兼容性未通过本实验验收。
