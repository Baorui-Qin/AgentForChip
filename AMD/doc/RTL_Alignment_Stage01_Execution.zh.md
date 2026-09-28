# RTL 对齐阶段 0、1 执行记录

日期：2026-09-28。范围仅为参考契约冻结与显式 mock 单题输入输出；不调用真实模型，不产生比赛成绩。

## 执行计划

1. 冻结参考版本、关键文件哈希、规则对照与未定项。
   - 验证：原 ZIP 的 SHA-256 与已有记录一致，解压文件不改动，规则逐项附文件出处。
2. 阅读主工程指引及受支持的 dsh profile 入口，新增最小独立单题适配。
   - 验证：prompt.txt 为必需输入，interface.txt、登记题号、UUID 和 campaign 均非前提，P10 入口不变。
3. 完成三道示例、边界情况及相关回归，保存可重跑的证据。
   - 验证：solution.v 与 trace.jsonl、独立工作目录、空答案、内部异常、超时、错误参数、空格路径和重复题号。

## 假设与边界

- 工作包名为 rtl-alignment-agent，仅为本地工作名，正式队名待确认。
- 主工程源码仍归 D:\deepseek-harness；其修改需要该路径实际写权限，不以复制替换规避权限。
- 新参考、方案包和本次证据保存在 D:\AMD 的独立目录，不覆盖历史实验。
- 模型候选沿用现有 Qwen3-Coder-30B-A3B-Instruct GGUF Q4_K_M / llama.cpp，不下载或启动。
- 当前 Windows 主机只用于 mock 协议开发验证；目标 Linux / GPU / Vivado 2026.1 机器仍待实际核实。
- 参考 ZIP 是本次冻结对象；网络资料只用于补充核实，不静默替换它。
- 真实模型、裁判隔离、Linux 脚本信号/执行权限、HTTP 服务与能力评分不属于本次完成声明。

## 开始时状态

- D:\AMD 有既存未跟踪资料及实验，保持不动。
- 主工程起点与结束时 HEAD 均为 `25828d28f1064c6d265aefcca4031641115bd62c`；开始时工作树干净。本次只新增 12 个源码、测试、启动脚本及配套双语文档文件，没有更改任何既有已跟踪文件，没有提交代码。

## 阶段 0 结果：完成

- 原 ZIP 保留；SHA-256 与原记录一致。独立参考根目录为 `D:\AMD\rtl-reference-alignment\reference\c544450c0a41141a\rtlagent2026-master`。
- [冻结规则与待确认事项](../rtl-reference-alignment/rules.zh.md)列出输入、输出、失败、基线、环境、采样、计分的来源，以及文档与脚本差异。
- [全文件锁](../rtl-reference-alignment/reference-lock.json)固定全部 57 个参考文件。原版基线的两个文件已逐字节复制到方案包，并复核一致。
- 固定本地方案位置、源码归属、Qwen GGUF 候选和 Linux W7900 验证平台；正式队名、云主机标识、可用性、版本、预算均不假定已知。
- P10 研究成绩、参考自测成绩和本次 mock 协议证据明确分开；已知 Prob053/058/062/093/149 问题保留单独跟踪，未改裁判或历史结果。
- 模型调用：0；EDA 调用：0；未运行参考 selftest 计分。

## 阶段 1 结果：完成显式 Mock 验收

最小入口由独立 `rtl-reference` profile 经现有 `pnpm dsh` 启动。题目目录只读 prompt.txt；接口使用参考的 `module named Name` 与端口项目列表语法，未支持的格式显式失败，不猜接口。支持未知名称与非 TopModule 名称；不查任务清单、UUID、campaign 或 interface.txt。

正常调用产生 solution.v 和 trace.jsonl，并在 `.rtl-invocation/run-*` 保存独立题面与产物。每行 trace 标记 `explicit_mock_protocol_only`；终态包含零真实模型调用和 `graded: false`。输出目录重复使用被拒绝，历史文件不改写，调用者为每次采样使用新目录。

| 终态 | 退出码 | 答案 |
| --- | --- | --- |
| mock_candidate | 0 | 带 EXPLICIT MOCK 标记、输出置零的接口占位，不是模型解答 |
| empty_answer | 0 | 空文件，正常未解出 |
| internal_error | 1 | 空文件，异常另记 |
| invalid_input | 2 | 有可写输出目录时记录空产物；参数/配置错误可在输出建立前拒绝 |
| timeout | 124 | 空文件，区别于空答案 |
| cancelled | 130 | 空文件，profile 释放中止并等待当前调用 |

方案包是[本地开发适配包](../rtl-reference-alignment/rtl-alignment-agent/README.md)，不是完整离线提交包。真实模型接入、同服务基线运行、全局墙钟、HTTP、Linux 和操作系统级裁判隔离未在本次实现，也没有伪造占位文件宣称这些已经完成。

## 代码与文档

主工程新增：`rtl-tools/src/reference/{task,index}.ts`、`rtl-tools/tests/reference-task.spec.ts`、`rtl-tools/reference/{run.sh,run.ps1,setup-profile.ps1,README.md,README.zh.md,README.i18n.yaml}`，以及 `.agents/notes/implemented/feature/2026-09-28-rtl-reference-directory-mock` 的中英文及 sidecar 三件套。P10 入口和严格验收源码未改动。

工作区新增：冻结参考及哈希锁、规则表、开发方案包装入口、原版基线、可重跑冻结/PowerShell/shell 检查脚本、本次证据。更新本文及原计划的阶段 0、1 勾选状态；历史资料不覆盖。

## 实际验证

| 检查 | 实际结果 | 证据 |
| --- | --- | --- |
| ZIP、57 个参考文件、2 个基线文件 | 通过，SHA-256 一致 | [冻结脚本](../rtl-reference-alignment/freeze-reference.ps1)、[文件锁](../rtl-reference-alignment/reference-lock.json) |
| 新适配器单元与 profile 生命周期 | 27/27 通过，包含产物快照、无 interface、空 interface、冲突 interface、未知模块名、重复输出、并发占用、异常、超时、取消、错误参数 | [unit-tests-final.log](../rtl-reference-alignment/evidence/unit-tests-final.log) |
| 真实 dsh + PowerShell 入口 | 11/11 通过，三道示例只复制题面；输入输出路径含空格；含重复题号、空答案、异常、超时、参数错误、拒绝真实后端及输出重用 | [summary.json](../rtl-reference-alignment/evidence/smoke-08e0d523a8e249d480de3e5b7ffe1db7/summary.json) |
| 标准 run.sh + Windows Git Bash | 3/3 示例通过；输入输出均含空格，两个 shell 脚本语法检查通过，新增及原版基线 shell 均无 CR 字节 | [summary.json](../rtl-reference-alignment/evidence/shell-cf2c7136ad6b4a4fb416f87b2f579c77/summary.json) |
| 原有 P10 相关回归 | 6 文件、175/175 通过；p10、p10-model、p10-directives、p10-netlist、p10-settled-rtl、phase1 | [p10-regression.log](../rtl-reference-alignment/evidence/p10-regression.log) |
| RTL TypeScript 类型检查 | 通过，退出 0 | [typecheck-final.log](../rtl-reference-alignment/evidence/typecheck-final.log) |
| 新代码聚焦 lint | 通过，退出 0 | [lint.log](../rtl-reference-alignment/evidence/lint.log) |
| test:docs | 16/16 检查通过 | [doc-quick-final.log](../rtl-reference-alignment/evidence/doc-quick-final.log) |
| doc-sync | 33 通过，1 项环境失败，不能声称全通过 | [doc-sync.log](../rtl-reference-alignment/evidence/doc-sync.log) |
| diff 与空白检查 | 既有 tracked diff 为空；12 个新增文件逐个检查无空白错误 | [最终源码收据](../rtl-reference-alignment/evidence/implementation-receipt.json) |

完整文档检查唯一失败为已有 `scripts/project-doc-site.spec.ts:160` 的 `publishableImage > refuses a target whose real path escapes the repository`，创建文件符号链接时报 Windows `EPERM`，尚未进入断言。该命令已通过宿主权限审批执行，仍缺文件 symlink 权限；没有修改无关测试、跳过断言或更改 Windows 设置。可在支持文件 symlink 的开发环境重跑此项。

本次早期的启动沙箱 EPERM、错误 Vitest 配置、测试参数表展开、测试类型、PowerShell 嵌套参数及双语锚点问题已修复并重测。保留初次失败日志，不冒充首次即通过。未运行全仓全部单元测试。

## 复跑

在 `D:\AMD\rtl-reference-alignment` 下执行：

```powershell
pwsh -NoProfile -File .\freeze-reference.ps1 -Verify
pwsh -NoProfile -File .\verify-stage1.ps1
pwsh -NoProfile -File .\verify-shell.ps1
```

后两者每次创建新的 evidence 子目录，不覆盖旧结果。verify-shell 依赖此 Windows 主机现有 Git Bash 及 runtime-home；不是 Linux 可移植性检查。

## 阶段收尾

- 阶段与状态：阶段 0 完成，阶段 1 按显式 mock 范围完成；doc-sync 保留一项 Windows 权限限制。
- 代码提交 / 工作树改动：未提交；主工程新增 12 个文件，既有源码无改动；收据固定每个新增文件的 SHA-256。
- 模型与资源：真实模型请求 0、模型费用 0、GPU 推理 0、真实 Vivado 调用 0；未承接历史 API 授权。
- 证据目录：`D:\AMD\rtl-reference-alignment\evidence`，不是历史 P10 实验目录。
- 未验证事项：阶段 2 的操作系统级隔离；阶段 3 的真实模型与原版基线；阶段 4 的 Linux 执行位、信号、目标工具/显存/断网和完整运行包；阶段 5 的 HTTP。模型/平台与正式规则未定项见冻结表。
- 下一阶段：可以开展阶段 2，阶段 3 真模型运行仍须先具备目标服务并单独冻结预算。本次不继续执行后续阶段。
