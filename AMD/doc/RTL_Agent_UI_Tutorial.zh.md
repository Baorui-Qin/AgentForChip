# RTL Agent UI 使用教程：选择自己的题目、运行测试与查看日志

核对日期：2026-09-23。适用于本机 `D:\deepseek-harness` 与已完成的 `p156-0923-v1` 批次。

## 先看结论

**当前没有“一键上传题目并按 P10 协议评分”的专用网页。** 本次 156 题使用的 P10 Agent 是独立命令入口。UI 可以作为操作入口，让聊天 Agent 调用它，但不能把普通聊天回答当成 P10 测试结果。

你有两种界面入口：

| 使用入口 | 怎样使用 | 是否需要先构建 Web |
|---|---|---|
| 当前 Codex 界面 | 在本任务中发送第 4 章的测试模板，由 Agent 调用本机 P10 入口 | 不需要 |
| DeepSeek Harness 自带 Web 界面 | 按第 2、3 章启动和配置，再发送第 4 章模板 | 需要，当前前端产物缺失 |

**第一次建议只测 `Prob005_notgate`。** 跑通结果与日志后，再换成需要的题目。它很简单，可能 Baseline 已通过、修复次数为 0；这不是 Agent 没有运行。

如果你要测试题库以外的题目，或修复自己已有的 RTL，请先看第 7 章。现有 P10 入口不能直接把任意 `dut.sv` 当作固定初始候选导入。

## 1. 先找到报告

- [156 题完整报告](D:/AMD/p156-0923-v1/report/report.zh.md)
- [问题分析与改进方向](D:/AMD/p156-0923-v1/report/findings.zh.md)
- [逐题修复案例](D:/AMD/p156-0923-v1/report/repair-cases.zh.md)
- [评测器校准问题](D:/AMD/p156-0923-v1/report/calibration-findings.zh.md)

该批次完成了 149 道可比较题，冻结测试台原始判定为 Baseline `135/149`、Agent `146/149`。另外 7 道校准阻塞题不是模型答错。报告已披露 Prob078 的采样误判和 Prob093、Prob149 的题面/参考答案矛盾，不能将原始通过率等同于独立证明的功能准确率。

本教程另存于 `D:\AMD\doc`，不修改已完成批次及其完整性清单。以前的 20124 次调用授权属于那一批测试，不自动延续到每一次新测试。

## 2. 启动 DeepSeek Harness Web

如果使用当前 Codex 界面，可以跳过本章和第 3 章。

### 2.1 在 PowerShell 中启动

打开 **PowerShell 7**，执行以下命令。首次构建可能耗时，必须等构建成功再启动 Web：

```powershell
Set-Location 'D:\deepseek-harness'
$env:DSH_HOME = 'C:\Users\qbr\.dsh'
pnpm run build
if ($LASTEXITCODE -ne 0) { throw '构建失败，请先处理构建错误，不要继续启动。' }
pnpm dsh web --host 127.0.0.1 --port 3080 --no-open
```

保持这个终端运行，然后在浏览器打开 [本机 Web 界面](http://127.0.0.1:3080)。若 3080 已被占用，将启动命令中的端口改为 3081，并打开对应地址。不要停止不属于本次操作的已有服务。

说明：

- 绑定 `127.0.0.1`，不向局域网公开服务。
- `--no-open` 表示不自动弹出浏览器，需要自己打开上述地址。
- 使用本机源码入口 `pnpm dsh`；不要直接运行插件的 `.ts` 文件。
- 不要用 `D:\AMD\local-qwen-harness\start-harness.ps1` 代替上述命令。它配置的是本地 Qwen 路线，不是这次 DeepSeek P10 测试环境。

### 2.2 本机核验状态

本次已实际运行 `pnpm dsh web --help`，确认上述 `--host`、`--port` 和 `--no-open` 参数存在。也使用独立临时配置尝试启动，确认缺少 **45 个前端 client bundle**，错误明确要求先执行 `pnpm run build`。

本次编写教程没有执行整个项目构建，也没有成功启动网页。浏览器自动化连接不可用，因此下文的 UI 操作依据当前源码及项目文档核对，**尚未完成逐项点击实测**。如果构建后仍打不开，保留终端错误，不要反复启动付费测试来排查 UI。

## 3. 在 Web 中配置模型和工作区

### 3.1 配置聊天模型

1. 打开 **设置 → 模型**。
2. 找到 DeepSeek 提供商配置，按界面填写并保存 API Key。如果已有有效配置，不需要重新录入。
3. 返回聊天界面，在模型选择器中选择可用的 DeepSeek 模型。

**不要把 API Key 发到聊天框、写进题目、截图或测试报告。** 正常设置流程将凭据保存到 `DSH_HOME` 下的凭据文件，设置中使用凭据引用。

上述启动命令使用 `C:\Users\qbr\.dsh`；当前 P10 配置也指向该目录的 `.credentials.yaml`。这两个位置要匹配。若改用其他 `DSH_HOME`，Web 能聊天并不意味着 P10 能读取到同一凭据。处理时只核对路径及凭据是否存在，不让 Agent 输出文件内容。

**Web 模型选择器控制的是外层聊天模型。** 内层 P10 仍按冻结的 `model.patch.yml` 使用 `deepseek-flash`。在网页中切换模型，不会自动改变正式测试模型或修复轮数。

### 3.2 选择工作区

1. 使用 **选择工作区**，添加并选中 `D:\AMD`。
2. 新建一次对话，避免把其他题目的历史答案混进本次操作。
3. 先发送第 4.2 节的只读预检模板。

没有选中工作区时，当前界面的输入可能不可用。后续调用入口位于 `D:\deepseek-harness`，如果权限弹窗提示访问工作区以外的这个路径，需要核对具体命令后决定是否批准。

不要为了省事开启对所有目录、所有命令永久批准。网页聊天工具受到权限策略限制时，应明确授权具体操作，或者在 PowerShell 手动执行第 8 章的对应命令。

## 4. 在 UI 中测试题库里的指定题目

### 4.1 选择完整题目 ID

从 [逐题结果表](D:/AMD/p156-0923-v1/report/report.zh.md) 找到题目，使用完整 ID，例如 `Prob005_notgate`，不要只写 `005`。也可以先让聊天 Agent 只列出公开题目 ID，再由你选择。

不要把已有冻结文件改成自己的题目。新测试必须创建新的批次目录，旧的 `D:\AMD\p156-0923-v1` 只读。

首次练习不建议选以下项目：

- 校准阻塞：031、053、062、082、099、141、156。
- 已发现评测语义问题：078、093、149。
- 已发现 Host 分类问题：106。

这些项目可以专门研究，但不能仅增加重试次数后宣称评测已可靠。

### 4.2 先发预检消息

把下面这段粘贴到当前 Codex 或已配置好的 Web 聊天框。替换题目 ID 即可；此时不要启动测试：

```text
我要使用本机 P10 RTL Agent 测试指定题目：Prob005_notgate。

先做预检，不调用 P10 模型，不启动生成或 EDA 测试，不读取或显示凭据内容。
只测试我列出的 ID，不启动全量批测。

代码库：D:\deepseek-harness
历史报告：D:\AMD\p156-0923-v1\report\report.zh.md
校准目录：D:\AMD\p156-0923-cal\preflight-156
EDA 设置来源：D:\AMD\p156-0923-v1\eda-settings.yaml

请核对题目是否在冻结题库中、是否校准可运行，以及已知评测问题。
提出一个全新的 D:\AMD 下批次目录，不覆盖任何旧结果。
使用 prepare-stability.ps1 生成的新 model.patch.yml，不直接使用旧 profile 默认参数。

每题最多 15 次接受的 RTL 修改、60 个工具动作、120 次修复请求；
候选生成最多初次加 2 次纠正。单次综合 600 秒，整个验证 900 秒。
本次只有 1 题，P10 物理调用硬上限先设为 129 次。

列出将运行的命令、实际预算、发送给 DeepSeek API 的数据类型，
说明未完整 OS 隔离的风险，以及日志和报告保存位置。
参考实现、测试台和标准答案只供本地评测器使用，不读取后传给模型。
完成以上说明后停下，等我确认执行。
```

外层 Web 聊天本身也可能产生模型费用；“不调用 P10 模型”不表示网页对话完全免费。`129` 是本例单题 P10 费用保护上限，不是预计必然用满的调用量，也不包含外层聊天费用。更换题目数量时，应重新核定总预算，而不是默默沿用全库授权。

### 4.3 检查方案，再批准执行

检查 Agent 是否满足以下条件：

| 检查项 | 应看到的内容 |
|---|---|
| 题目范围 | 只有你指定的完整题目 ID |
| 新结果目录 | 新路径，不是旧的 156 题目录 |
| 修改预算 | `maxRepairRounds: 15` |
| 工具/请求预算 | 60 个工具动作、120 次修复请求，另外有总物理调用上限 |
| 综合超时 | `eda-settings.yaml` 中 `limits.timeoutMs: 600000` |
| 启动方式 | 带新批次 `--patch` 的 `rtl-p10-model`，逐题 `generate` 后 `compare` |
| 数据和安全 | API 发送范围已说明；不会读取凭据给模型；未完整 OS 隔离已说明 |

**重要：当前准备脚本生成 `danger-full-access` 和 `allowUnisolatedAutomatic: true` 配置。** 这是已知的开发环境运行方式，不是安全沙箱。只对你信任的本机题目和评测资产执行。不要将不可信来源的 RTL、脚本、插件或测试台直接放进去运行。内层 P10 也不保证每个动作都弹窗，所以必须在启动前确认范围。

确认后可以发送：

```text
确认按刚才核对的题目清单、新目录和预算执行。
授权本次新测试向 DeepSeek 官方 API 发送题面、候选 RTL、技能、
工具定义，以及受控诊断和波形摘要，并产生对应调用费用。
已知当前不是完整 OS 隔离，仅运行本次确认的可信评测资产。

按 generate -> 检查生成结果 -> compare 顺序执行，只运行指定题目。
保留模型实际返回的 reasoning、输出、规范化流、工具调用及 Host 拒绝记录，
保留每轮 RTL、EDA 命令、stdout/stderr、诊断与波形，不保存凭据。
结束后输出 Markdown 报告，分别说明 Baseline、Agent、修改次数、
物理调用量、停止原因、非法候选原因及评测器问题。
任何超预算、扩大题目范围或新的高风险操作都先问我。
```

若需要临时防睡眠，应另行说明并批准“只在本次运行期间生效，结束立即释放”；不要更改永久电源计划。以前批次的防睡眠保护已经释放，不能假设新测试会自动继承。

## 5. 运行时看什么

UI 是操作入口，**实际进度以工具返回和磁盘文件为准**：

1. **准备配置**：新目录出现 `campaign-freeze.json`、`model.patch.yml`、`eda-settings.yaml`。
2. **生成候选**：出现 `generate-<题目ID>` 目录及模型记录。
3. **首次验证**：`compare-<题目ID>` 中保存共享初始候选的验证结果，这是 Baseline。
4. **按需修复**：只有验证失败且 Host 策略允许时，Agent 才调用工具、修改 RTL、重新验证。
5. **结束**：读取本题 `result.json`，再汇总报告，不能凭聊天中的“应该通过”判定成功。

15 次是**允许的 RTL 修改上限**，不是强制修改 15 次，也不是 15 条聊天消息。已通过、Host 阻塞、工具动作耗尽、请求预算耗尽和传输失败都可能更早停止；必须分别报告，不得统称“15 轮已用完”。

单次综合最长 10 分钟，不等于整道题只能运行 10 分钟。编译、展开、仿真和多轮修复也需要时间，但仍受各自超时与整体预算约束。

需要停止时，要求 Agent **取消本次子进程、等待退出并释放本次电源保护**。不要仅关闭网页就认为 EDA 已停止，也不要手动删除 claim/锁文件后重复启动。中断后的续跑应先核对已有记录和剩余预算。

## 6. 查看结果、日志与报告

以下路径以你本次的新批次目录为根目录，不是旧报告目录。

| 位置 | 用途 |
|---|---|
| `generate-<ID>/initial.sv` | 第一个合法格式/接口候选，尚不能据此认定功能正确 |
| `generate-<ID>/result.json` | 生成终态、恢复尝试与调用信息 |
| `generate-<ID>/models/run-*/` | 每次生成调用的独立记录 |
| `compare-<ID>/result.json` | Baseline、Agent、预算、停止原因和最终证据 |
| `compare-<ID>/models/run-*/` | 修复模型调用记录；没有发生修复调用时可以不存在 |
| `compare-<ID>/tool-trace.jsonl` | Host 工具处理、拒绝和相关证据 |
| `compare-<ID>/revisions/` | 保存的 RTL 版本 |
| `compare-<ID>/eda/run-*/` | EDA 命令、输出、分阶段结果和波形等 |
| `compare-<ID>/final.sv` | 在本协议中达到 `VERIFIED` 后导出的 RTL |
| `compare-<ID>/best-observed.sv` | 已观察到的较优候选，不保证通过 |

每次模型调用目录通常包含 `reasoning.txt`、`output.txt`、`stream.jsonl`、`prompt-final.json`、`transcript.json` 和 `transport.json` 等。保存的是**接口实际返回的 reasoning**，不是未公开的内部思考；`stream.jsonl` 是 Harness 规范化流，不是原始网络 SSE 抓包。未收到的内容无法补出，缺失 usage 不能猜成 0。

读取比较结果时，重点看：

- `initial_status`：共享初始候选的 Baseline 判定。
- `status`、`terminal_reason`：Agent 最终状态和停止原因。
- `semantic_repairs`：实际接受的 RTL 修改次数。
- `recovered_by_agent`：是否在本协议下从失败修复到通过。
- `budget_limits`、`physical_dispatches`：该阶段预算与调用记录。整题费用要合计生成、修复及实际物理调用，不能只看 compare。
- `final_verification_run`、源码哈希和验证标识：结果是否绑定到同一份 RTL。

`GENERATED_UNVERIFIED` 只表示已生成候选。`VERIFIED` 表示通过当前冻结评测流程，仍受到测试台覆盖面和已知缺陷的限制。综合成功也不等于功能验证成功。

结束后可以在 UI 发：

```text
请仅依据本次指定题目的实际 result.json 和调用/工具/EDA 日志，
在本次新目录写 REPORT.zh.md。
列出题目 ID、生成状态、Baseline、Agent、实际 RTL 修改次数、
生成/修复物理调用数、停止原因、最终 RTL 和日志路径。
分析非法候选原因、工具拒绝、重复诊断、预算消耗、评测器风险和改进方向。
只用真正完成有效比较的指定题目计算通过率；未运行、校准阻塞单列。
不要套用旧的 156 题报告脚本或把未运行题目计入分母。
不要修改旧批次，不覆盖本次原始证据，不补造缺失日志。
```

普通 Web 对话日志位于对应 `DSH_HOME` 的 `sessions` 目录，当前默认采用压缩会话持久化；它与上述 P10 逐调用归档不是一回事。不要把一次聊天的文字导出称为完整 P10 工具证据包。

## 7. 测试自己编写的题目或已有 RTL

### 7.1 先分清要做什么

| 需求 | 当前可用方式 |
|---|---|
| 从现有题库挑题，让 P10 生成并修复 | 按第 4 章操作 |
| 查看、解释或检查已有 RTL | 在独立工作区中让 UI 聊天 Agent 读取公开规格和 DUT |
| 用你已有的可信测试工程验证 RTL | 让 UI Agent 调用你确认过的本机测试命令，单独保存日志；这不是自动获得 P10 评分 |
| 任意新题或自带初始 RTL，要求完整 P10 配对评测 | 当前没有直接导入按钮，需要先实现并校准相应接入流程 |

不要通过覆盖 `initial.sv` 或将自定义题伪装成已有 `Prob...` ID 来导入。源码哈希、题目身份、候选绑定与冻结记录会失效，得到的比较也不再可信。

### 7.2 准备独立目录和规格

可另建 `D:\AMD\my-rtl-tests\counter8-v1`，不要放到已完成批次或冻结数据集中。至少准备以下内容：

- `spec.md`：功能、模块名、完整端口、位宽、时钟边沿、复位极性与同步/异步、优先级、边界行为。
- `dut.sv`：你已有的待测 RTL；若要从头生成，明确说明尚无初始候选。
- 独立的可信测试工程：测试台、断言或参考实现，以及明确的编译、仿真和综合入口。
- 可核对的正负校准：一个应通过实现和一个故意错误的实现，证明测试器既能放行也能拒绝。

参考实现与测试台应作为本地 Host 资产管理，不放进发给模型的题面。仅在聊天中说“禁止修改测试台”不构成技术隔离；正式比较需要文件权限、冻结哈希和上下文边界实际生效。

### 7.3 可粘贴的自定义题预检模板

```text
我要测试自己的 RTL，不是题库里的固定题目。
独立目录：D:\AMD\my-rtl-tests\counter8-v1
公开规格：spec.md
待测实现：dut.sv

先只读取规格和 DUT，确认端口、时钟、复位与边界行为。
没有确认的地方直接问我，不猜测功能要求。
不要读取或向模型传入本地参考实现/隐藏测试台，不修改已有测试台。

先判断该目录是否已有可信、可运行且经过正负例校准的测试工程。
没有的话，列出缺少的接入工作，不能宣称已经可以用 P10 正式评分。
有的话，列出实际要调用的本机命令、超时、文件权限、日志保存方式，
说明是独立验证流程还是已实现并校准的 P10 接入。
在我确认命令、数据发送范围和费用预算之前，不开始模型修复或 EDA 测试。
```

如果只让模型根据同一段模糊题面同时编写 DUT 和测试台，两者可能共同理解错误。这样的自测只能作为开发辅助，不能单独支撑“准确率”结论。

## 8. 附录：指定题目的实际命令

这一章供你核对 UI Agent 的工具调用，或在权限不支持时手动执行。**B 段会产生新模型调用费用；C 段会启动 EDA，并可能继续调用模型。不要在未确认预算和运行风险时执行。**

### A. 只准备新配置，不开始测试

在 PowerShell 7 执行。示例只给 1 道题的 P10 总调用上限：

```powershell
$preflight = 'D:\AMD\p156-0923-cal\preflight-156'
$campaign = Join-Path 'D:\AMD' ('p10-ui-' + (Get-Date -Format 'yyyyMMdd-HHmmss-fff'))
$manifest = Join-Path $preflight 'manifest-156.json'
$manifestHash = (Get-FileHash -LiteralPath $manifest -Algorithm SHA256).Hash.ToLowerInvariant()

& 'D:\deepseek-harness\rtl-tools\phase1\p10\prepare-stability.ps1' `
  -CampaignRoot $campaign `
  -PreflightRoot $preflight `
  -AllTasks `
  -FullManifestSha256 $manifestHash `
  -MaxDispatches 129 `
  -SettingsFile 'D:\AMD\p156-0923-v1\eda-settings.yaml'

$campaign
Get-Content -LiteralPath (Join-Path $campaign 'model.patch.yml')
Select-String -LiteralPath (Join-Path $campaign 'eda-settings.yaml') -Pattern 'timeoutMs'
```

`-AllTasks` 在这里用于载入现有 156 题清单并保留校准排除记录，**准备脚本本身不执行 156 题**。实际只运行后面指定的 ID。不要随后启动全量 runner，否则就改变了本次测试范围。

脚本复用历史校准，不重新证明所有测试台都正确。应结合已知问题列表选择题目。示例从旧批次复制 EDA 设置到新目录，不修改旧文件；当前 P10 运行器会将 EDA 输出根路径覆盖为该题新目录下的 `eda`。

本次已实际验证这一准备流程，生成了 [只准备、不执行的核验配置](D:/AMD/ui-guide-check/prepare-only/campaign-freeze.json)：1171 个冻结文件、15 次修改、120 次修复请求、60 个工具动作、129 次总物理调用上限、综合超时 600000 ms，生成和比较目录均为 0。该目录只是教程核验产物，不是一次完成的题目测试。

### B. 获得授权后生成指定题目的候选

在同一 PowerShell 会话继续；如果换了窗口，先将 `$campaign` 设为 A 段打印的**实际新目录**：

```powershell
Set-Location 'D:\deepseek-harness'
$env:DSH_HOME = Join-Path $campaign 'dsh-home'
$env:XILINX_LOCAL_USER_DATA = 'no'
$taskId = 'Prob005_notgate'

pnpm dsh --profile rtl-p10-model --patch "$campaign\model.patch.yml" generate $taskId
if ($LASTEXITCODE -ne 0) { throw '生成入口异常，请检查新批次日志，不要继续比较。' }

$generated = Get-Content -LiteralPath "$campaign\generate-$taskId\result.json" -Raw | ConvertFrom-Json
$generated.status
if ($generated.status -ne 'GENERATED_UNVERIFIED') {
  throw '候选尚未生成成功，请先分析 result.json，不要手动伪造 initial.sv。'
}
```

不要省略 `--patch`。仓库旧 profile 文件仍含 `maxRepairRounds: 3`；最新 15 次修改等参数来自准备脚本生成的覆盖配置。

### C. 比较 Baseline 并按需修复

只有 B 段确实生成成功后再运行：

```powershell
pnpm dsh --profile rtl-p10-model --patch "$campaign\model.patch.yml" compare $taskId
if ($LASTEXITCODE -ne 0) { throw '比较入口异常，请保留日志并检查，不要反复重跑。' }

Get-Content -LiteralPath "$campaign\compare-$taskId\result.json" -Raw |
  ConvertFrom-Json |
  Select-Object task_id, initial_status, status, terminal_reason, semantic_repairs, recovered_by_agent, physical_dispatches
```

`compare` 先验证 B 段的共享初始候选，再决定是否修复，不需要你另外调用一个“Baseline 模型”。进程返回码不是最终功能判定，仍须读取 `result.json`。

本次编写教程**没有执行 B、C 段**，没有产生新 P10 模型费用。这两个入口与已完成批次使用的 P10 实现一致；新一轮的具体模型响应、权限与 UI 调用体验仍需在你授权后验证。

## 9. 常见问题

| 现象 | 正确处理 |
|---|---|
| 网页无法打开，提示 `client bundles not found` | 先完成 `pnpm run build`，再启动 Web；不是 API Key 问题 |
| 输入框不可用 | 先检查是否选中了工作区、是否配置了聊天模型 |
| Web 能聊天，P10 报凭据错误 | 核对 Web 的 `DSH_HOME` 与 P10 凭据路径；不要在聊天中打印密钥 |
| 又显示 3 轮 | 检查命令是否漏了新批次 `--patch`，核对最终预算记录，不要只改提示词 |
| 约 2 分钟综合就超时 | 检查是否错误使用默认 `dev.yaml`；本例明确复制 600000 ms 设置 |
| 已综合成功但不能判定通过 | 还需要其余验证阶段及可信功能测试；看完整 `result.json` |
| 状态是候选非法或接口阻塞 | 单独统计生成/接口问题，不伪装成功能失败或改参考接口绕过 |
| 测试台、策略或基础设施阻塞 | 分析日志和规则后处理，不能用增加 RTL 轮数掩盖 |
| 同一目录提示已存在、已占用或冻结不匹配 | 保留现状，核对是否中断及如何恢复；不要删锁或改冻结哈希 |
| 想换成自己的模型/自己的 RTL | Web 选择器或文件替换不能完成正式接入；另建配置/接入流程并重新校准 |

## 10. 核对依据与边界

- [项目 Web 使用指南](D:/deepseek-harness/docs/user/guide/index.zh.md)
- [模型与提供商设置](D:/deepseek-harness/docs/user/guide/providers.zh.md)
- [P10 说明](D:/deepseek-harness/rtl-tools/phase1/p10/README.zh.md)
- [实际 P10 入口源码](D:/deepseek-harness/rtl-tools/src/phase1/p10-model.ts)
- [新批次准备脚本](D:/deepseek-harness/rtl-tools/phase1/p10/prepare-stability.ps1)
- [普通会话日志说明](D:/deepseek-harness/packages/session/session-persistence-jsonl/README.zh.md)

已核验：入口参数、缺失前端构建的启动错误、只准备配置的流程、15/120/60/129 预算与 600 秒综合设置、旧批次真实结果和日志目录。

尚未核验：完整 Web 构建后的浏览器逐项点击、从 Web 聊天成功调起新 P10 测试、自定义新题的正式 P10 导入。这些不能视为已交付的 UI 功能。
