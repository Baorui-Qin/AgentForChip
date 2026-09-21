# Vivado 语言模式与诊断验收

结论：语言配置、结构化诊断和执行控制组件通过；原始 Prob038_count15 与当前 Vivado 的兼容性仍阻塞。真实模型 API 请求为 0，数据集工作树干净，测试台与参考实现未修改。

## 检查结果

| 项目 | 结果与证据 |
| --- | --- |
| AC1 语言解析 | 通过，覆盖扩展名、显式语言、未知扩展名、冲突和字符串兼容 |
| AC2 命令生成 | 通过，覆盖连续分组、SV 参数预检、Tcl/Windows 转义及 DUT-only 综合 |
| AC3 诊断归因 | 文件归属检查通过；后续核对发现功能失配被误写为配置问题，诊断修正及补充验证见[失败分析](failure-analysis.md)，原始记录不改写 |
| AC4 真实语言夹具 | 通过，SystemVerilog 与普通 Verilog 正例均完成四阶段 |
| AC5 原始 Prob038 | **阻塞**，正确和故意错误 DUT 均在原始测试台编译处失败 |
| AC6 生命周期与绑定 | 通过，配置篡改、多组编译停止、共享预算、取消、卸载及进程树退出均有测试 |
| AC7 Loader 与记录 | 通过，schema 1.3、旧记录读取、事件还原和无密钥快照 |
| AC8 回归与文档 | 184 测试通过、0 失败、4 个可选工具测试跳过；类型和定向 lint 通过；doc-quick 16 项通过；5 组双语、8 份定向链接检查通过 |

机器可读证据见 [acceptance-final.json](acceptance-final.json)，逐项测试结果见 [tests-final.json](tests-final.json)。模型可见进程事实补充调用标签、版本匹配和语言模式后，另行执行 [呈现定向回归](tests-presentation.json)。初步验收 JSON 与中间测试报告保留，不覆盖旧证据。未运行全仓库 lint、构建或完整 doc-sync，不对这些检查作通过声明。四个跳过项是环境变量控制的 Icarus 与 standalone Vivado 测试，不算真实工具通过；下表才是本次独立 dsh 的真实 EDA 证据。

## 真实 Vivado

| 夹具 | 编译 | 展开 | 仿真 | 综合 | 产物 |
| --- | --- | --- | --- | --- | --- |
| counter | PASS | PASS | PASS | PASS | [run-zStthU](run-zStthU/result.json) |
| syntax | FAIL | SKIPPED | SKIPPED | SKIPPED | [run-8mA8Ql](run-8mA8Ql/result.json) |
| missing-module | PASS | FAIL | SKIPPED | SKIPPED | [run-DvyMyh](run-DvyMyh/result.json) |
| functional | PASS | PASS | FAIL | SKIPPED | [run-jDuNm6](run-jDuNm6/result.json) |
| synthesis-only | PASS | PASS | PASS | FAIL | [run-m7NaJj](run-m7NaJj/result.json) |
| systemverilog | PASS | PASS | PASS | PASS | [run-UV4hTY](run-UV4hTY/result.json) |
| verilog | PASS | PASS | PASS | PASS | [run-Lq6rit](run-Lq6rit/result.json) |
| Prob038 正确 DUT | TOOL_ERROR | SKIPPED | SKIPPED | SKIPPED | [run-N7m6L4](run-N7m6L4/result.json) |
| Prob038 错误 DUT | TOOL_ERROR | SKIPPED | SKIPPED | SKIPPED | [run-qjacth](run-qjacth/result.json) |

三个通过的 counter 均检查 20 次、失配 0；LUT=2、FF=4、BRAM=0、DSP=0，综合网表与 checkpoint 已产生。WNS=4.405 ns（post_synthesis），与原始报告一致。原始 timing 报告还有负 WHS，故正 WNS 不代表完整时序收敛，更不代表布线后结果。

`functional` 和 `synthesis-only` 是故意注入缺陷的负例，不是正常 counter 意外失败。前者将步长从 `+1` 改成 `+2`，真实日志记录 20 次检查、18 次失配；仿真进程虽正常退出，功能判定仍为 FAIL，综合未执行。后者仿真通过，但综合条件分支实例化不存在的 `missing_synthesis_cell`，Vivado 在 DUT 第 4 行报 `Synth 8-439`。删除这一人工注入块，或把前者步长恢复为 `+1`，均得到与已通过四阶段的 counter 完全相同的源文件。逐项原始证据、修复差异、哈希核对及真实项目处理方式见[失败分析与修复对照](failure-analysis.md)。负例命中预期表示测试覆盖有效，不表示负例设计通过。

Prob038 保留 `xvlog -sv`，按 DUT、参考实现、测试台顺序编译。原始错误为 `VRFC 10-3380`，`trusted/tb.sv:97`，`identifier 'tb_mismatch' is used before its declaration`；另有 `VRFC 10-8530` 后继错误。新字段为 `origin=testbench`、`attribution=TESTBENCH_COMPATIBILITY`、`repairable_by_model=false`。它是定位归属，不是对语言标准根因的判决。

## 命令与首次失败

历史 Prob038 命令已经是 `xvlog.bat -sv <solution.sv> <ref.sv> <tb.sv>`；本轮命令仍然如此。变化是语言来源、角色、分组及真实启动参数被显式绑定和记录，并非声称遗漏 `-sv` 导致原始失败。普通 `.v` 夹具不带 `-sv`，综合使用 `read_verilog`；SystemVerilog 使用 `xvlog -sv` 和 `read_verilog -sv`。完整前后命令在 acceptance.json 中。

首次真实夹具启动产生 [run-YU5n2H](run-YU5n2H/events.jsonl)，由于新增记录读取器未区分版本查询的信息性退出码 1，在发布编译阶段时失败。该不完整目录保留，不计为 PASS。修复将例外限制到匹配 2025.2 横幅的正常 `-version` 调用，并补充正反测试，之后重新创建快照运行。版本探测事实不被改写成退出码零。另有两次启动器配置/沙箱失败发生在执行夹具之前，不是 HDL 验证结果。

## 实现与边界

共享语言解析位于 `rtl-tools/src/hdl.ts`；验证器、综合、快照、schema、诊断归因、固定夹具及相应测试完成接入。可信综合配置支持 `{path, language?, role?}`，旧字符串数组继续可用；Icarus 不变。已有 Agent Note、双语 README、加载示例和语言说明同步更新，详细来源见 [中文说明](../../../deepseek-harness/rtl-tools/phase1/language/README.zh.md)。

本轮只借鉴 Edalize 显式文件类型映射，固定 Vivado 参考提交为 `9a6f648c596bfe74224ae82f529075e565d4182b`，源码头声明 BSD-2-Clause。未复制框架代码；旧 XSim 为背景参考，不作为依赖。AMD 社区未发现可核验的本案例解决办法，不宣称社区修复已验证。

没有修复循环、RAG、虚拟机部署、评测资产改写或模型请求。本报告不签收 P07/P08、完整 OS 隔离、Agent 性能提升或比赛复现。
