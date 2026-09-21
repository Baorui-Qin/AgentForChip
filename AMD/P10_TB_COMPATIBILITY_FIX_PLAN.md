# P10 v8：测试台不兼容原因与 Codex 修复执行计划

版本：1.0，2026-09-18。

依据：用户上传 `p10-20260918-v8.zip` 的真实日志、冻结源码和任务快照。本文将上传证据、外部技术资料、代码推断与建议修改分开。

**结论：当前 10 道选题和 1 道独立 Prob038 哨兵都因同一测试台模板的声明顺序错误停在 xvlog；不是 Agent 解题失败。建议开发方建立最小、可审计的派生评测器，再校准后冻结用于 Baseline/Agent。不要再次只添加 `-sv` 或仅产出另一份 NO-GO 报告。**

## 1. 证据边界与本轮状态

- v8：10/10 选题 `TESTBENCH_COMPATIBILITY_BLOCKED`，独立 Prob038 同样阻塞；全部停在 compile。
- 所有实际编译调用都带 `-sv`，日志明确显示 `Analyzing SystemVerilog file`。
- 首错均为 `VRFC 10-3380`：`identifier 'tb_mismatch' is used before its declaration`。
- 后继均为 `VRFC 10-8530`：`module 'tb' is ignored due to previous errors`。
- compile 返回码为 1；未超时、未取消。elaborate/simulation/synthesis 均为 SKIPPED。
- 模型派发为 0，Baseline/Agent/40 题均 NOT_RUN。可评测分母为零，通过率必须保持 null，而不是 0%。
- 独立复核：482 个归档普通文件的大小与 SHA-256 一致；72 个冻结运行输入 SHA-256 一致。
- 未跟随外部 runtime 链接；没有本地 Vivado/Icarus/模型复跑；没有重新核验未打包原文的全部外部数据集资产。

### 1.1 各题源码位置

| Task | $dumpvars 首次引用行 | tb_match / tb_mismatch 声明行 | 范围 |
|---|---:|---:|---|
| Prob005_notgate | 70 | 74 / 75 | 选题 |
| Prob035_count1to10 | 96 | 100 / 101 | 选题 |
| Prob045_edgedetect2 | 78 | 82 / 83 | 选题 |
| Prob074_ece241_2014_q4 | 75 | 79 / 80 | 选题 |
| Prob015_vector1 | 72 | 76 / 77 | 选题 |
| Prob033_ece241_2014_q1c | 79 | 83 / 84 | 选题 |
| Prob004_vector2 | 66 | 70 / 71 | 选题 |
| Prob020_mt2015_eq2 | 54 | 58 / 59 | 选题 |
| Prob018_mux256to1 | 54 | 58 / 59 | 选题 |
| Prob061_2014_q4a | 52 | 56 / 57 | 选题 |
| Prob038_count15 | 97 | 101 / 102 | 独立哨兵，不进 10 题分母 |

仅这 11 份具有本轮真实 Vivado 失败证据。156 题中的其他任务不能据此自动记为失败；扩展前做静态扫描和真实预检。

## 2. 已确认的源码原因

以 Prob038 为例：

```systemverilog
initial begin
    $dumpfile("wave.vcd");
    $dumpvars(1, stim1.clk, tb_mismatch, clk, reset, q_ref, q_dut);
end

wire tb_match; // Verification
wire tb_mismatch = ~tb_match;
```

本机 Vivado 2025.2 拒绝这里的声明前引用。`-sv` 已经生效，并不会自动将所有先引用后声明的写法整理成合法顺序。这里不需要对 SystemVerilog 标准中所有前向引用作泛化结论，也不能仅由此证明 Vivado 实现有缺陷。

最小候选修补：原两行 net 声明整体前移，在同一个 `module tb` 中置于该 initial 块前。保持两行字节不变。

```systemverilog
wire tb_match; // Verification
wire tb_mismatch = ~tb_match;

initial begin
    $dumpfile("wave.vcd");
    $dumpvars(1, stim1.clk, tb_mismatch, clk, reset, q_ref, q_dut);
end
```

不需要同时拆写 assign、不需要删掉波形记录、不需要改比较表达式。该变换预期只解决当前诊断；是否仍有后续问题，要重新经过 xvlog/xelab/xsim，不能由文本检查承诺全部 PASS。

外部旁证：NVlabs/verilog-eval Issue #9 报告同一模板在 Icarus 13 中失败，报告者通过调整声明和 initial 块顺序解决。它是上游使用者复现，不是 AMD 对 Vivado 的修复认证。冻结版本 README 的实验环境是 Icarus 12，明确不支持当时的 Icarus 13 开发版本。[S1][S2]

## 3. 边界纠正：不可由参赛模型改测试台，不等于开发者不能移植评测器

不要让运行中的 RTL Agent 根据失败任意修改测试台、参考实现、断言或评分门槛。

但开发阶段可以建立独立、经审查和校准的兼容评测器：

```text
原始数据集（固定 commit、保持只读）
  → 开发期受审查兼容转换
  → 派生测试资产 + diff + 原始/派生 hash + 行映射
  → 正负例校准
  → 冻结后的 vivado-compat 评测器
  → Baseline 与 Agent 共用
```

这是开发者的评测资产准备流程，不是模型修复 RTL 的一步。保留原始 v8 的阻塞结论，另开 `p10-compat-v1` 类开发 campaign。

正式赛事隐藏资产是否允许转换，以赛事授权为准。本计划不授权修改正式隐藏评测器。对外成绩标明“VerilogEval 固定版本 + Vivado 2025.2 兼容评测协议”，不得直接等同上游 Icarus benchmark 或官方隐藏评分结果。

## 4. 针对实际源码的接入位置

本包 `frozen-source/<sha256>` 可通过 `freeze.json.files` 还原运行时源码；不能只检查 delivery-source 下的文档和测试。

### 4.1 p10-dataset.ts

当前 `p10PreflightAssets()`（约 107—120 行）直接把未修改 `_test.sv` 填进 `trusted/tb.sv`，并使用 `...-original-v1` evaluatorId。

建议增加独立的开发期构建器：

- 继续先核对原始 dataset commit、原资产 SHA、干净工作树。
- 兼容副本写在 dataset 根目录外，不改原文件。
- 新 adapter 只接受经审查的模板与原始 SHA；不认识则 `COMPAT_RULE_UNSUPPORTED`。
- snapshot 中可沿用 `trusted/tb.sv` 这个角色路径，但其身份必须是派生 SHA，不再冒充原始 SHA。
- preflight 与真实候选评分必须读取同一份固定派生文件，不能只给校准路径打补丁。
- 原始 prompt/ref 不变；不允许公开任务输入携带 reference 源码。

建议元数据（项目 schema 草案，不是现有原生字段）：

```json
{
  "evaluator_id": "p10-verilogeval-Prob038_count15-vivado-compat-v1",
  "upstream_revision": "c498220d0a52248f8e3fdffe279075215bde2da6",
  "original_tb_sha256": "<raw bytes hash>",
  "effective_tb_sha256": "<derived bytes hash>",
  "adapter_rule_id": "tb-net-declaration-order-v1",
  "adapter_source_sha256": "<adapter implementation hash>",
  "patch_sha256": "<diff hash>",
  "source_map_sha256": "<new line -> original line hash>",
  "default_sim_timescale": "1ps/1ps",
  "preserve_explicit_timescales": true
}
```

将这些有效配置以及实际 source list、seed 纳入 verification key。真实诊断同时保留派生文件实际位置，必要时增加映射后的原文件位置；不能用映射覆盖原始工具诊断。

### 4.2 verification.ts：默认 timescale 的潜在下一关

实际执行源码约第 189 行：

```typescript
...(snapshot.evaluation ? [] : ['-timescale', '1ns/1ps'])
```

这意味着数据集路径不显式添加默认时间单位。此次 11 份 TB 全部声明 `1 ps/1 ps`；预检 wrapper 与 ref 没有 timescale，且读取顺序为 DUT → ref → TB。

**这是静态检查发现的后续风险，不是 v8 已发生的第二个错误。v8 尚未进入 xelab，不能说它已经报了 XSIM 43-4099。**

处理次序：先只前移声明，重新编译；若 xelab 随后出现时间单位错误，再在新的、记录明确的 evaluator 配置中设置默认时间单位。建议对当前模板采用 `1ps/1ps`，并记录为何选该值。不要把这一值全局强加给所有任务。

AMD UG900 2025.2 将 `-timescale` 定义为默认值；`-override_timeunit` 与 `-override_timeprecision` 则会覆盖已有声明，两者不可混淆。[S3]

诊断示例（不是已经执行的命令，也不代替宿主现有路径转义和子进程管理）：

```text
xvlog -sv solution.sv reference.sv tb.compat.sv
xelab tb -s compat_snapshot -timescale 1ps/1ps -debug typical
xsim compat_snapshot -tclbatch simulate.tcl -sv_seed 1
```

`simulate.tcl` 保持 `run all` / `quit`，而非人为缩短测试。

不要使用 override 参数覆盖原 TB 的 1ps；不要修改 `#5`、复位激励或超时来凑 5ns。TB 的仿真延迟时间尺度与 XDC 的 5ns 综合时钟约束不是同一个参数。

### 4.3 simulation-evidence.ts：复用现有数据集判据解析，不再造另一种协议

当前已经支持：

```text
Mismatches: <非负整数> in <正整数> samples
```

并区分重复记录、TIMEOUT/FATAL、计数关系与退出状态。它不是只能识别 `PHASE1_COMPLETE` 的旧手写夹具路径。下一轮核对该解析器在真实 xsim 下确实收到完整唯一记录。

不要改原 TB 加 `PHASE1_COMPLETE`；不要把进程 exit=0 当 PASS；不要把 unknown/X 计数转成 0；timeout 后即使 final 块输出 0 失配，也不能 PASS。命中的诊断首错/summary 分组不能改变判据本身。

### 4.4 p10-preflight.ts / p10-report.ts：预检不是完整 P10 模型入口

`p10-preflight.ts` 约第 35 行在检测到 llm 服务时主动抛出 `P10_PREFLIGHT_MUST_NOT_LOAD_MODEL`；只运行 preflight 入口。

`p10-report.ts` 将模型结果写为 NOT_RUN，reportP10Preflight 的 recommendation 为 NO_GO，若有可评测任务则 reason 为 MODEL_PHASE_NOT_RUN。

**因此即使兼容性预检成功，重跑这个入口也不会自动开始 Baseline/Agent。**保留 model-free 预检的设计，另接已有 P09 model/agent 能力建立真正 P10 模型对照入口。不要删除预检的无模型保护来假装已实现模型分支。

## 5. 最小试验顺序（不要立刻全量 40 题）

### R0：保留与复现

封存 v8，不改原历史终态、manifest 或 claim。固定原 10 题顺序与 Prob038 哨兵。新 campaign 引用旧批次为 predecessor。

### R1：只处理声明顺序

先取两题：`Prob005_notgate`（最简单组合逻辑）和 `Prob038_count15`（长期阻塞哨兵）。使用本包 diff 或等价 TypeScript 实现建立派生资产。

只做已描述的声明前移，验证 `xvlog -sv`。若存在新首错，保存并按同样原则分析；不要扩大工具宽松选项或修改 DUT 来掩盖评测器问题。

### R2：展开与仿真

通过编译后，执行真实 xelab/xsim。观察实际时间单位与 VCD/判据行为。若出现 timescale 错误，再按第 4.2 节做独立可追踪的默认值配置修正。

### R3：正负例校准

正例：继续使用只在 Host 内可见的 `TopModule → RefModule` 转接模块。它检查“工具和测试台可运行”，不是证明参考实现一定符合题面；参考自对照有天然局限。

必须补可观测负例：

- notgate 正确行为是取反，负例用直通，要求仿真检查数为正且实际失配 >0。
- count15 可用经审查的提前回绕或错误步长负例，要求编译/展开通过后出现实际功能失配。
- 后续每个任务的负例必须确实被测试检测到，不能假定任意突变都会被覆盖。

负例保持原样，后续 Agent 修复使用副本。绝不修改 reference、激励、比较、timeout、样本数或忽略 X 的规则。

若有 Icarus 12 环境，可分别用原 TB 和派生 TB 跑同一组正负例作为移植对照。记录后端与随机配置；不要假定不同仿真器使用同一数字 seed 就有逐项相同随机序列。跨工具检查是补充，不替代 Vivado 验收，也不应重新成为无限期阻塞主线的依赖。

### R4：复验 10 题与哨兵

对所有已选择 10 题生成兼容资产，逐个完成 compile/elaborate/simulation 正负例预检，保持原始/兼容两个状态并列。

未被规则覆盖或仍失败的任务明确列出，不删除，不换简单题。已可用任务可以进入下一步 1 题试跑，但完整 10 题批次必须保留所有选题及原因。不要用预检四阶段以外的状态充当候选 VERIFIED。

### R5：接上真正 P10 单题模型对照

复用 P09：同一生成设置、同一原始题面、同一派生 evaluator、同一时钟/seed/预算。

共享初始候选时明示 shared_initial=true，测量的是同一个种子候选继续修复的边际收益；独立裸模型入口保留，其评分由 Host 在生成后完成，不把反馈送回 Baseline，不让模型看到 reference。公共 init 成本与 Agent 增量成本同时记录，避免一份生成被物理总账算两次。

模型任务状态只含公开题目、当前 DUT、允许披露的反馈及冻结技能，不含预检 wrapper/reference。可读可信资产与“运行评分器能使用”是不同权限。禁止模型编造 `RefModule` 依赖借用评分 reference；保留现有 DUT-only 综合和源列表边界，并增加借用 reference 的负向验收。

候选通过要求新 revision 四阶段 PASS，final exported SHA == verified SHA。不是 reference 转接校准 PASS。

### R6：完整 10 题后再到 40

兼容规则、执行源码、时钟策略、Tokenizer、模型采样/预算都冻结后再跑完整 10 题。经身份、账目、进程与结果审计后，按预先选题顺序扩到 40。

中途必须改规则则封存新版本，不能把不同 evaluator 或 policy 的结果混为一批。低模型分数不是换题理由；评测器兼容失败也不能计成模型逻辑错误。

## 6. 不应尝试的“捷径”

- 重复给已有命令追加 `-sv`。
- 把 VRFC 10-3380 降级为 warning 或强行继续执行。
- 把 `-relax`、`-ignore_assertions` 当成未验证的全局修复手段。
- 删除 `$dumpvars` 或错误比较逻辑以消灭诊断，而不说明评测器变化。
- 关闭 integrity check，静默覆盖上游 `_test.sv`。
- 让 RTL Agent 编辑评测器、Harness、预算和日志。
- 更换其他 EDA 版本或用 Icarus 成绩冒充 Vivado 成绩。
- 修好预检后仍只运行无模型 profile，然后把占位 NOT_RUN 表误称为完整 P10。

## 7. 验收矩阵

| ID | 标准 | 需要的证据 |
|---|---|---|
| C01 | 原始数据集不变 | 原 commit/全部原资产哈希，派生目录在数据集外 |
| C02 | 最小变换 | diff 仅原两行声明搬动，同一 tb 作用域，原始行/行尾逐字节可恢复 |
| C03 | 未知输入拒绝 | 不在 allowlist、错误 hash、错误 scope、重复声明均拒绝 |
| C04 | 派生资产可追踪 | 原/新 SHA、规则版本、规则源码 hash、行映射、evaluatorId |
| C05 | 两题真实编译 | notgate/count15 的新 xvlog 无当前声明错误；新首错必须保留 |
| C06 | 时间单位处理可解释 | 已声明 TB 不变；仅配置 default，无 override；实际命令日志 |
| C07 | 两题正例仿真 | compile/elaborate/simulation PASS，唯一有效 summary，checks>0，mismatches=0 |
| C08 | 两题负例仿真 | 语法/展开通过后明确功能 FAIL，mismatches>0 |
| C09 | 无效判据不通过 | timeout、缺记录、重复、矛盾、X/未知计数、截断不判 PASS |
| C10 | 10题+哨兵完整记录 | 原始与兼容状态分列，不把静态匹配当实跑结果 |
| C11 | 原始与派生成绩隔离 | v8 保持 NO-GO；新 campaign 独立；上游分数与移植分数不混 |
| C12 | P10模型入口真实接通 | 非预检 profile 实际派发，有 request/response/actions，模型无 reference |
| C13 | Baseline未污染 | 一次生成、无工具选择/技能/反馈/修复，Host评分与生成隔离 |
| C14 | Agent实际修复 | 相同初始候选→真实失败→新模型候选→新四阶段验证 |
| C15 | 新结果版本正确 | 当前/验证/导出源码 SHA 一致，日志与请求账目完整 |
| C16 | 扩40前冻结 | 10题证据审计通过，原选题顺序保留，没有跨版本拼接 |

本研究包的 C02/C03 有离线原型测试支持，其余涉及用户仓库实现或 EDA 的项目仍必须由 Codex 实际执行，不能据此预填 PASS。

## 8. Codex 执行要求（直接使用）

请先读取当前 AGENTS.md、P10 v8 的 freeze、实际冻结源码和本计划，确认本文的路径仍对应当前仓库。不要把源码哈希文件当作文件缺失，按 freeze.json 还原阅读。

本次目标分两段：先解除评测器模板兼容性问题，再接通真正 P10 模型对照。开发阶段允许建立受审查的派生测试台，禁止参赛模型编辑评分资产。无需反复生成只有 NO-GO 的规划；按 R0—R6 实施并输出实际证据。遇到工具缺失、权限限制、不同首错或预算不足时保留独立终态，不能跳过判据或编造成功。

本包 `tools/tb_compat_preview.py` 是离线研究原型，不是要求引入新的线上 Python 依赖。生产路径优先用项目既有 TypeScript 工具实现同样窄的规则。当前预览白名单只覆盖所审查 11 份原始字节；扩展必须静态核查并复验。

最终交付：

```text
compatibility-manifest.json
compatibility-review.md
compat-preflight-results.json
compat-positive-negative-results.json
p10-compat-single-task-baseline-agent.json
p10-compat-acceptance.md
原始/派生哈希、diff、行映射、真实 EDA 与模型记录索引
```

必须回答：当前 10-3380 是否真实消失、是否出现下一层首错、timescale 是否实际验证、负例是否仍可被拒绝、哪几个任务可评测、有没有真正启动 Baseline/Agent、是否只做了预检、原始上游及历史 v8 是否保持不变。

## 9. 外部资料（技术旁证，不是本机成功证据）

[S1] VerilogEval 固定版本 README，Icarus 12 使用环境与版本边界：
https://raw.githubusercontent.com/NVlabs/verilog-eval/c498220d0a52248f8e3fdffe279075215bde2da6/README.md

[S2] NVlabs/verilog-eval Issue #9：同一 tb_mismatch 模板问题；报告者在 Icarus 13 中通过声明前移解决。不是 AMD 官方修复认证：
https://github.com/NVlabs/verilog-eval/issues/9

[S3] AMD UG900 2025.2，命令选项：默认 -timescale 与 override 的区别，-sv 与 -relax 的作用：
https://docs.amd.com/r/2025.2-English/ug900-vivado-logic-simulation/xelab-xvhdl-and-xvlog-xsim-Command-Options

[S4] AMD UG900 2025.2，SystemVerilog standalone / prj 方式：
https://docs.amd.com/r/2025.2-English/ug900-vivado-logic-simulation/Running-SystemVerilog-in-Standalone-or-prj-Mode

所有“已发生”结论依赖上传文件；本文没有运行 Vivado，没有验证修改后的 11 题通过，也没有声称给用户本地仓库打过补丁。
