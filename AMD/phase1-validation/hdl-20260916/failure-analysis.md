# functional 与 synthesis-only：失败原因及修复对照

本页补充原验收报告缺失的错误解释，依据保留的 Vivado 2025.2 真实产物。两个案例均是宿主手写、故意注入错误的回归夹具，不是模型生成的正常设计；其定义见 [fixtures.ts](../../../deepseek-harness/rtl-tools/src/phase1/fixtures.ts)。没有修改负例、测试台、原始 result.json 或历史 acceptance-final.json，没有调用模型 API。

## 1. synthesis-only

### 工具事实

- [阶段结果](run-m7NaJj/result.json)：编译、展开、仿真 PASS，仿真完成 20 次检查、0 失配；综合 FAIL，综合进程退出码 1，未超时、未取消、未截断。
- [综合 stderr](run-m7NaJj/build/.rtl-synth-Jl8ZI2/synthesis.stderr.log)：`ERROR: [Synth 8-439] module 'missing_synthesis_cell' not found`，位置为 [DUT 第 4 行](run-m7NaJj/snapshot-eEOt7P/rtl/solution.sv)。后继 `Synth 8-6156` 表示 counter 综合失败，`Common 17-69` 是命令失败汇总，不是另一个独立 RTL 缺陷。
- [综合 stdout](run-m7NaJj/build/.rtl-synth-Jl8ZI2/synthesis.stdout.log) 表明许可证取得成功、器件加载完成，失败发生在 RTL 展开。不是本次语言模式、许可证、超时或时序不达标导致的失败；资源与 WNS 不可用，不能当成零。

### 原因及修复

原 DUT 保留正确 counter 行为，但人为插入：

```verilog
`ifdef SYNTHESIS
missing_synthesis_cell broken();
`endif
```

本次仿真未启用这一分支，综合则启用并尝试解析该实例。Vivado 综合自动定义 `SYNTHESIS` 的行为也有 [AMD UG901 文档](https://www.amd.com/content/dam/xilinx/support/documents/sw_manuals/xilinx2022_1/ug901-vivado-synthesis.pdf)说明；此文档是 2022.1 背景参考，本机 2025.2 的实际结果由上述日志确认。仿真通过只证明仿真所执行的代码满足当前测试，不证明综合条件分支也有效。

**对这个人工负例的修复：删除整个三行注入块，保留计数器逻辑。** 该模块并不是题目要求的功能，所以不需要添加空模块或改变宏定义来掩盖错误。

真实项目若确实依赖该模块或 IP，应检查模块名称、条件编译及可信综合输入清单，提供实际可综合的实现/依赖，而不是照搬“删除实例”。依赖配置修正属于宿主配置，不应由模型通过任意路径参数绕过授权。修复后用新版本、新快照先跑仿真，再跑综合，并核对实际网表；不能沿用旧 PASS。此处是人工分析与修复建议，不是 Harness 自动插入或删改 RTL 的规则。

## 2. functional

### 工具事实

- [阶段结果](run-jDuNm6/result.json)：编译、展开 PASS；仿真进程退出码为 0，功能判定 FAIL；综合 SKIPPED，不能表述为“综合也失败”。
- [仿真 stdout](run-jDuNm6/build/simulation.stdout.log) 保留唯一完成记录：`PHASE1_COMPLETE checks=20 mismatches=18`。
- 原始测试台没有输出每次失配的信号值或周期。不能把源代码推理出的周期写成“工具已报告”的诊断位置。

### 原因及修复

[DUT 第 2 行](run-jDuNm6/snapshot-8XrQ0C/rtl/solution.sv) 非复位时每周期加 2，而 [测试台](run-jDuNm6/snapshot-8XrQ0C/trusted/tb.sv) 按题意每周期加 1。编译、展开只检查可解析和可绑定，不检验这条功能要求；`$finish` 正常结束也不会把非零失配变成通过。

```diff
-always @(posedge clk) if (rst) count <= 0; else count <= count + 2;
+always @(posedge clk) if (rst) count <= 0; else count <= count + 1;
```

**修复 DUT 的步长，不修改测试台的期望值或零失配判据。** 从源码可推导，复位样本匹配，随后 4 位计数在第 16 次递增时两条序列同时回到 0，另外 18 个样本不同；这解释了真实总数，但不是额外采集的逐周期波形证据。

这里的 `+2` 本身不是不可综合语法，当前流程仅因仿真失败而停止，没有对该负例作综合结论。

## 3. 修复后的双通过证据

对上述两个负例分别进行建议的文本修改后，与已有真实正例 [counter 源码](run-zStthU/snapshot-Sy5IGc/rtl/solution.sv) 逐字节相同：

```verilog
module counter(input wire clk, input wire rst, output reg [3:0] count);
always @(posedge clk) if (rst) count <= 0; else count <= count + 1;
endmodule
```

| 核对项 | 已确认结果 |
| --- | --- |
| 两种修复后的 UTF-8 源文件 SHA256 | `79aee3f7cc0b617c19cfdad10072fe854a405223670c036f232dc542996809ab` |
| 三次运行的测试台 SHA256 | 均为 `217c70453fd169053210738741dba7e682bc6e69caff11cb44955022e34f9e8c` |
| 三次运行的 5 ns XDC SHA256 | 均为 `8383122a0057edfc0a3af73976e1e89d252f5e9ee9be9a0390b32728f7d2ab2e` |
| 正例四阶段 | 编译、展开、仿真、综合均 PASS |
| 正例仿真 | 20 次检查，0 失配 |
| 正例综合 | LUT 2、FF 4、BRAM 0、DSP 0；WNS 4.405 ns，post_synthesis |

这些是 [run-zStthU](run-zStthU/result.json) 已有真实运行和本次源码、评分资产一致性核对的证据，不是本次重新运行自动修复闭环，也不会把两个历史 FAIL 改为 PASS。WNS 为正不等于完整时序收敛；该原始报告仍有负 WHS。

## 4. 报告与诊断修正

原 functional 记录使用泛化的“判据缺失/冲突/失败”提示，并归为 `HARNESS_CONFIGURATION`。这个归因不准确，本页明确更正解释但保留历史记录。验证器现将正常退出且判据完整的正失配数报告为 `category=functional_mismatch`，消息包含实际失败/总检查数，`failure_domain=design`。汇总判据无法确定源码根因，所以 origin 为 unknown、attribution 为 UNKNOWN、file/line 为 null，仍不授予自动修复资格。

缺失、重复、致命或计数矛盾的判据单独报告 `simulation_evidence`、INCONCLUSIVE，不再因为其中出现正失配数就称为已确认的功能失败。两种情况都停止后续综合。原 synthesis-only 的关键诊断已经在结构化结果和原始日志中，遗漏发生在人工验收报告的摘要层，本页补齐。

后续报告对每个失败至少列出：案例是否为故意负例、首次失败阶段、进程状态、首要诊断及证据路径、实际检查/失配数、后续跳过原因、事实与推断的区分、修复对象及重新验证要求。不能只写“符合预期失败”。

## 5. 本次补充验证

- `phase1-verification.spec.ts` 与 `phase1-loader.spec.ts`：40 项定向测试通过，覆盖完整功能失配、重复/致命/矛盾判据、原始数据集格式的失配、后续阶段跳过及既有执行控制。
- 新增功能失败呈现快照，并单独无更新回放通过，见 [快照回放 JSON](tests-functional-diagnostic.json)。该文件是筛选后的单项 Mock 测试，其他未选测试不计通过；Mock 特意使用 19/20，以验证消息取自观察计数，不能把它当成本机真实负例的 18/20。
- 插件类型检查与本次修改的定向 lint 通过；doc-quick 16 项通过，两组受影响的中英文配对校验通过。
- 本次没有重新启动 Vivado；修复正确性的 EDA 对照来自未修改的历史正例，另对两种修复后的 UTF-8 字节及测试台/XDC 哈希做了独立核对。没有以 Mock 代替真实 EDA 证据，没有执行模型修复循环。
