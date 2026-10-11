# 参考目录适配器

[English](README.md) | 中文

## 概要

通过协议 mock 或有界 API 开发解题器运行未登记的纯题面任务。两者均使用受支持的 dsh profile，写出候选 RTL 与 trace 证据。两条路径都不运行参考裁判，也不声称隐藏测试正确。

## 目录

- [运行单题](#run-a-task)
- [API 开发](#api-development)
- [输入与结果](#inputs-and-outcomes)
- [实现与检查](#implementation-and-checks)
- [已知限制](#known-limitations)
- [开发备注](#dev-note)

<a id="run-a-task"></a>
## 运行单题

在已配置且具有既有依赖的源码工作区中，一次性安装独立 profile。安装器拒绝替换已有 profile。DSH_HOME 使用绝对路径，并与研究 profile 分开。以下 PowerShell 命令使用调用者选择的新目录：

```powershell
pwsh -File rtl-tools/reference/setup-profile.ps1 -HomeDirectory $env:DSH_HOME
$env:LLM_BACKEND = 'mock'
pwsh -File rtl-tools/reference/run.ps1 $taskDir $outDir
```

等价 shell 入口是 `sh rtl-tools/reference/run.sh <task_dir> <out_dir>`，环境变量相同。两个入口在切到源码工作区前解析调用者的相对路径。该 profile 不安装网络、凭证、LLM（大语言模型）或 EDA 插件。

<a id="api-development"></a>
## API 开发

使用显式 `HomeDirectory`、`BaseUrl`、`Provider`、`Model`、`Xvlog`、`Vivado` 和 `AllowUnisolatedDevelopment` 参数运行 [setup-api-profile.ps1](setup-api-profile.ps1)，随后设置 `LLM_BACKEND=api`。这会选择 `rtl-reference-api`，而非研究 P10。安装器拒绝已有 profile。pi-ai 适配器即使连接匿名本地服务也需要 API 密钥引用：默认引用为 `RTL_LOCAL_RELAY_KEY`；连接回环转发端时，将该变量设为非秘密占位值。需要其他引用时使用 `ApiKeyEnv`。真实凭据仅属于独立组装的转发端。

兼容 Qwen 的路由默认使用 `ThinkingFormat=none`；API 开发时，`ThinkingFormat=deepseek` 显式启用 DeepSeek 重放字段。解题器不设置 reasoning effort，也不导入 P10 tokenizer。上下文容量配置为 32768 tokens；32768 字节请求限制是独立安全限制，不是经过校准的 tokenizer。服务端上下文错误会终止运行。模板/tokenizer 哈希和 GPU 显存仍需本地模型实测。

生成的 profile 允许四次模型尝试、每次 8192 输出 tokens、480000 ms 解题时限及 120000 ms EDA 命令时限。它仅挂载 Agent 核心、提供方与受管子进程服务。唯一工具 `check_rtl` 接受源码文本，不接受文件名或命令。它检查公开的常量位宽 input/output 接口、Vivado 语法与 DUT 独立综合，不使用测试台或参考数据。暂不支持 inout、文件指令、字符串、转义标识符、系统任务及外部代码。工具结果是自检事实，不是 L2、时序收敛或 VERIFIED 证据。

已有 Agent 循环负责对话与工具执行。有界流检查仅在原始 JSON 完整、块已关闭且终止原因成功后允许工具执行；提供方修补过或被截断的参数不会执行。每次请求、原始数据块、工具结果和冻结候选摘要均被记录；排空执行后，持久 Session 事件写入调用目录。只有最终文本而无已检查候选时产生空答案。中止、截断、错误或超预算的运行发布空答案。

可选的[转发插件](../src/reference/relay.ts)仅在回环地址提供 `/v1/models` 与 `/v1/chat/completions`。它核对上游元数据中的指定模型、添加 Authorization，并原样转发请求体，不修改提示词或采样。配置需要新的证据目录、显式模型/凭据引用，以及请求数、时间和费用预约上限。已发送但失败的调用也占用名额；转发端不重试。重启须使用新账本、剩余调用上限和原始 `startedAt`，而非重置实验预算。未经修改的参考基线可通过 `LLM_BASE_URL` 与 `MODEL_NAME` 独立使用该转发端。

<a id="inputs-and-outcomes"></a>
## 输入与结果

任务目录中只读取 `prompt.txt`。支持的参考格式为 `module named Name`，每个端口占一条 `- input/output/inout name (N bits)` 项目；省略位宽表示一位。不支持的声明、重复端口、空题面和缺失文件均显式失败。即使非空也忽略 `interface.txt`。此解析器不声称支持任意自然语言或 HDL 声明。

每次接受的调用有独立的 `.rtl-invocation/run-*` 目录，保存题面、答案和 trace。根目录的 `solution.v` 与 `trace.jsonl` 是外部输出。已有输出或调用占用标记会导致拒绝，且不替换证据；重复题号必须使用新的输出目录。只含 selftest 的 `run.log` 的目录可以接受。错误参数、错误配置或不可写目标可能在输出创建前失败，并通过 stderr 报告。

| 配置 | 含义 |
| --- | --- |
| `LLM_BACKEND` | 显式选择 `mock` 或 `api`；两者不会静默互相回退。 |
| `RTL_MOCK_OUTCOME` | 默认 `stub`，也可为 `empty`、`error`、`timeout`。Stub 将输出置零，不是解答。 |
| `RTL_TIMEOUT_MS` | 正整数，默认 30000；仅为开发任务处理时限，不是正式预算或 CLI（命令行界面）启动截止时间。 |

| 终态 | 退出码 | 答案 |
| --- | --- | --- |
| `mock_candidate` | 0 | 带标记的接口 fixture（测试前置数据） |
| `candidate_ungraded` | 0 | 最后检查过的 API 候选，不是正确性结论 |
| `empty_answer` | 0 | 空 |
| `invalid_input` | 2 | 输出目录接受成功后为空 |
| `internal_error` | 1 | 输出存储仍可写时为空 |
| `timeout` | 124 | 空 |
| `cancelled` | 130 | 空 |

Trace 各行包含 Unix 秒时间戳、工具名和显式证据类别。Mock trace 使用 `explicit_mock_protocol_only`、`mock_generate` 及零次真实模型调用。API trace 使用 `api_development_ungraded` 和 `model_call_attempts`；实际发送次数依据转发账本，而非失败的适配器尝试。所有结果保留 `graded: false`。写入失败会作为进程错误传播；存储故障不保证完整 trace。

<a id="implementation-and-checks"></a>
## 实现与检查

[Mock 插件](../src/reference/index.ts)和 [API 插件](../src/reference/api.ts)将就绪与取消关联到[目录运行器](../src/reference/task.ts)。Dispose（资源释放）会中止并等待当前工作结束。API [解题器](../src/reference/solver.ts)复用 Agent 循环与受管 EDA 进程，不导入研究裁判。[API 决策](../../.agents/notes/implemented/feature/2026-09-28-rtl-reference-api.zh.md)说明了为何保持 [P10 研究验收](../phase1/p10/README.zh.md)独立。

聚焦测试覆盖产物快照、无效输入、重复和并发占用、显式结果与 profile 释放：

```sh
node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts rtl-tools/tests/reference-task.spec.ts
node node_modules/typescript/bin/tsc -p rtl-tools/tsconfig.json --pretty false
node node_modules/oxlint/bin/oxlint rtl-tools/src/reference rtl-tools/tests/reference-task.spec.ts
```

<a id="known-limitations"></a>
## 已知限制

Mock 运行不创建 Session；API 测试使用真实循环、无密钥脚本适配器及所有者目录中的快照。Windows PowerShell 与 Git Bash 检查不能验证 Linux 执行位、SIGTERM 宽限、包含启动的总时限或离线打包。API profile 明确报告 `isolation: capability_only`：工具白名单不是操作系统读取隔离，Windows 写入受限 ACL 不能隔离裁判资产。生产使用需要读隔离环境及独立文件访问审计。外部判定只能在候选冻结、解题器退出后进行，不作为修复工具。API 成功不证明本地 Qwen 就绪或满足单卡显存限制。

<a id="dev-note"></a>
## 开发备注

无。
