# Windows 开发链路分项验收

日期：2026-09-15。代码位于 `D:/deepseek-harness/rtl-tools`。本记录对应 P02 → P04 → P03 开发范围，不替代比赛评分或整个第一阶段验收。

## 结论

| 项目 | 本轮结论 | 证据范围 |
|---|---|---|
| P02 | 固定手写夹具组件验收通过 | 真实 Windows Vivado，5/5 行为符合预期 |
| P04 | 官方 API 已接通，十次联调验收未通过 | 真实串行调用 7 次成功、3 次连接错误，未重试补样 |
| P03 | 执行控制验收通过 | 无密钥组件、真实 Loader、受管进程树测试 |
| 完整 OS 隔离 | 未验收 | Windows partial 不被当作完整隔离 |
| 本地模型、ROCm、官方环境及 G0/G1/G2 | 未验收 | 本轮未进行对应部署或验证 |

机器可读状态：[windows-development-acceptance.json](windows-development-acceptance.json)。使用说明：[项目中文 README](D:/deepseek-harness/rtl-tools/phase1/README.zh.md)。

## P02：真实手写夹具

通过 `dsh --profile headless --patch rtl-tools/phase1/fixtures.patch.yml verify-fixtures` 执行。本机 Vivado 2025.2，器件 `xczu3eg-sbva484-1-e`，5 ns 时钟，四线程。完整访问仅用于显式固定夹具集及其宿主许可；不适用于模型生成代码。

| 夹具 | 编译 | 展开 | 仿真 | 综合 | 结果 |
|---|---|---|---|---|---|
| counter | PASS | PASS | PASS | PASS | [运行记录](run-v3gnDK/result.json) |
| syntax | FAIL | SKIPPED | SKIPPED | SKIPPED | [运行记录](run-Tx6F1C/result.json) |
| missing-module | PASS | FAIL | SKIPPED | SKIPPED | [运行记录](run-0UEK1e/result.json) |
| functional | PASS | PASS | FAIL | SKIPPED | [运行记录](run-PU1XOF/result.json) |
| synthesis-only | PASS | PASS | PASS | FAIL | [运行记录](run-tHfI9N/result.json) |

正例仿真完成 20 次检查，零失配。综合结果为 LUT=2、FF=4、BRAM=0、DSP=0，与 [utilization.rpt](run-v3gnDK/build/.rtl-synth-6CEN4l/utilization.rpt) 的 Used 列一致。[timing.rpt](run-v3gnDK/build/.rtl-synth-6CEN4l/timing.rpt) 中 post-synthesis WNS 为 4.405 ns，但 Hold 最差裕量为 -0.063 ns，报告明确写出时序约束未全部满足。因此不签收完整时序收敛或布线后时序。

语法错误保留 `VRFC 10-4982` 与源文件第 1 行；仅综合失败保留 `Synth 8-439` 与第 4 行缺失模块。仅综合失败用例是 `SYNTHESIS` 条件内刻意注入错误的手写夹具，不是自然模型能力指标。VerilogEval 测试台和参考答案未修改。

每次运行有独立目录、manifest、事件、命令、脚本、日志及产物索引。最终套件汇总：[fixtures-6f638eeb-5aca-4a1d-8fcf-45931e3375f9.json](fixtures-6f638eeb-5aca-4a1d-8fcf-45931e3375f9.json)。早期失败目录保留为调试历史，不覆盖或冒充最终通过证据。最终的重复 ERROR 前缀解析修正另有真实日志格式的单元回归，历史日志和旧结果不重写。

## P04：真实官方 API

通过 `dsh --profile headless --patch rtl-tools/phase1/api.patch.yml model-smoke` 执行。现有凭据服务成功解析凭据，无需在聊天或 YAML 中提供密钥。提供方 `deepseek-official`，模型 ID `deepseek-flash`，对应仓库目录中的 DeepSeek-V41-Flash。

固定短请求串行调用 10 次：sample_id 0、1、3、4、5、6、7 成功；2、8、9 返回提供方归一化的 `connection` 错误。其根因尚未确定，不能擅自归因于 DNS、代理或服务端。每次都有独立终态记录，未自动重试、未增加替代样本。

实际记录的生成参数为 maxTokens=2048、temperature=0、解析后 reasoningEffort=high；传输为 stream。TTFT 为 null，原因为未采集。请求计数表示项目调用尝试；`dispatched` 表示适配器流开始派发，不能证明每个 HTTP 请求已到达服务器。模型仅收到固定公开开发提示词，返回文本只保存、不执行，也不开放模型工具。

完整逐次响应、用量和耗时见 [API 汇总](api-18e95258-d8f2-4246-9e3c-39418ad04eda.json) 及其中各运行目录的 `events.jsonl`、`model.json`、`response.txt`、`result.json`。本轮结论是“API 已接通，稳定联调验收未通过”，不是“官方 API 开发联调通过”。

## P03：执行控制

`verify_rtl(snapshot_id)` 只接受宿主登记的固定快照，不接受命令、Tcl、目录、器件、源文件列表或信任标记。普通调用要求完整 workspace-write 保护，不因显式 full-access 配置自动获准；许可只属于固定手写夹具的宿主一次性调用。只读与未授权完整访问在创建快照前拒绝。

组件测试覆盖未知快照、越界路径、备用数据流、junction 逃逸、参数扩展、manifest/评分资产变化、日志及产物超限、阶段和总预算、取消与卸载。测试确认子进程树退出后才完成调用与清理，随后可启动下一任务。真实 Loader 验证 schema、精简呈现、项目事件还原和 partial 拒绝。

哈希复核是篡改检测，不是操作系统写入阻止。产物轮询可能在观察间隔内超额写入，不是 OS 磁盘配额。固定测试台完成标记无法抵御任意恶意 HDL，因此不得将此入口当作权威评分器，API 输出也不会获得自动执行权限。

## 检查与范围

最终插件测试：122 通过、0 失败、4 个可选真实工具测试跳过。机器可读报告：[windows-development-tests.json](windows-development-tests.json)。本节是 Mock/组件测试证据；P02 的真实 Vivado 套件和 P04 的真实 API 调用分别保留，不与 Mock 混算。

TypeScript 类型检查、oxlint、3 对双语文档配对、6 份 Markdown 链接、Agent Note 格式与分类检查通过。没有运行全仓库测试或完整 doc-sync。未修改核心 agent-loop，未安装 Linux Vivado、迁移 WSL、部署本地模型，也未实现自动修复、Baseline 或批量评测。

后续工作是定位 API 连接错误，并独立完成操作系统隔离。任何后续 API 样本批次都应保留为新实验，不覆盖本次失败记录。
