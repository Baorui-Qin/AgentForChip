# 阶段 2、3 执行记录

日期：2026-09-28。状态：阶段 2 的解题器分离实现与阶段 3 的 API 替代验证已完成；原计划的完整验收尚未完成，仍缺操作系统读取隔离和本地 Qwen/GPU 实测。

## 范围与变更

用户确认暂无 Linux/W7900 千问服务，本轮使用工程现有 DeepSeek API 替代。替代实验只验证协议、工具闭环与原版基线，不证明 Qwen 权重、模板、tokenizer、离线能力或 32 GB 显存符合要求。研究 P10 与历史成绩保持独立。

## 执行计划

1. 建立只含公开题面、候选提交和确定性 DUT 检查的参赛 profile，复用现有 agent loop 与子进程管理。
   - 验证：未知题目、禁止文件读取构造、完整请求与 Session 记录、P10 严格验收负例。
2. 通过已注册 LLM provider 接入 API，不在参赛求解代码固定厂商路由，不使用研究专用 tokenizer。
   - 验证：完整与截断工具参数、终止原因、取消、错误和上下文限制；保留 mock 协议入口。
3. 冻结新实验目录，使用同一 API 服务分别调用 Agent 与未经修改的 baseline.py。
   - 验证：最多 3 道参考示例，逐次记录模型和工具调用、原脚本 SHA、时间和 token；不运行题库，不回馈裁判结果。

## 用户批准的 API 预算

- 最多 15 次生成请求：3 题 Agent 每题最多 4 次，加 3 题原版 baseline 每题 1 次。
- 从首次生成请求起总计最多 30 分钟，单请求最多 300 秒；无自动 API 重试。
- 费用上限人民币 10 元；依据官方价格及请求容量保守预约费用，先检查上限再发请求。
- 仅使用已有 DeepSeek 凭据，不安装模型、不下载权重、不切换其他付费服务。
- 请求失败也消耗调用名额，不补跑超预算；只读 models 查询不计生成次数。

## 已核对的环境限制

- 本机两个候选本地推理端口 8000、18000 拒绝连接，未发起推理。
- 已安装 WSL Ubuntu，但 Linux 内未找到 Node、bubblewrap、Vivado 或 Icarus；未安装 Docker。
- 当前 Windows Harness ACL 后端限制写入，不限制读取。独立工作目录或模型工具白名单不能冒充操作系统级读取隔离。
- 因此，本轮开发模式的 API 实验必须明确标注 `isolation: capability_only`。只有在真实读隔离环境完成拒绝读取裁判资产的测试后，才可关闭阶段 2 的该验收项。

## 资料

- 主工程 AGENTS.md、docs/architecture.md、docs/defensive-patterns.md。
- 已冻结参考 ZIP 与原版 baseline.py；原版基线不设置 Authorization，需要保留原脚本，在本地受控转发端添加凭据，不能修改其 prompt 或采样参数。
- [DeepSeek Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion/) 与[官方价格](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/)。
- [llama.cpp 工具调用文档](https://github.com/ggml-org/llama.cpp/blob/master/docs/function-calling.md)：后续本地 Qwen 仍需实际模板与服务校准，不能从 API 成功推断本地成功。

## 实现结果

- 参赛 `rtl-reference-api` 与 mock、研究 P10 profile 独立。未改核心 Agent 循环，未加载题库 manifest、oracle、参考 RTL、裁判测试台或历史答案。唯一共享改动是将纯接口解析器从研究候选模块抽出，并保留原调用 API 与默认行为。
- 仅开放 `check_rtl(source)`，不提供 shell、文件路径、读取工具或外部裁判。通用技能和题面进入 Session；请求、原始模型流、工具结果、候选 SHA 和 Session 事件均落盘。可访问文件的 HDL 指令、字符串、系统任务、外部代码与转义标识符在进入编译器前被拒绝。
- 复用 Harness 子进程所有权处理语法和 DUT 独立综合。没有参考测试台，没有自建功能仿真，也没有把综合通过标为 L2、VERIFIED 或时序收敛。
- 参赛模型路由和模型 ID 来自 profile，使用既有 `llm-pi-ai`。不复用 DeepSeek 专用 tokenizer，不强设 reasoningEffort；研究 P10 的 DeepSeek 专用线路保留，未将其专用计数协议冒用到 Qwen。
- 完整流、工具 JSON、JSON 被提供方修补、截断、缺失终止、取消、服务错误、上下文错误和预算拒绝均有无费用测试。工具参数必须完整且流成功结束才执行。
- 原版 baseline.py 和 run_baseline.sh 字节不变。本地转发端只添加鉴权，并统一限制两个调用者的预算；实验结束后已停止，18891 端口已确认关闭。

## 真实 API 小样本

上游模型 ID 为 `deepseek-flash`，`/v1/models` 报告 `DeepSeek-V4.1-Flash`。两条路径使用相同上游与回环端点，但分别生成，不共享初始候选。基线请求的固定系统提示词、temperature=0、top_p=1、max_tokens=8192 以及零工具经过原始 HTTP 请求审计。

| 题目 | Agent 模型调用 | Agent 解题时间 | Agent 自检 | 原版基线时间 | 基线结果 |
| --- | --- | --- | --- | --- | --- |
| ex01_popcount8 | 2 | 68.979 秒 | 接口、语法、DUT 综合通过 | 4.06 秒 | 单次生成、非空、stop |
| ex02_detect_1101 | 2 | 70.942 秒 | 接口、语法、DUT 综合通过 | 5.29 秒 | 单次生成、非空、stop |
| ex03_lfsr8 | 2 | 65.110 秒 | 接口、语法、DUT 综合通过 | 2.74 秒 | 单次生成、非空、stop |

上述时间是解题处理时间，不包含 dsh 冷启动。所有候选均为 `candidate_ungraded`。未调用参考裁判，未建立 L0-L3、pass@1 或增益结论。基线代码未在本轮运行 EDA 判定。

共 10 次上游发送尝试：9 次成功（Agent 6、基线 3），1 次代理网络故障且用量未知。成功请求合计 8164 输入、6381 输出 tokens。调用按每次 0.5 元保守预约，共 5 元；已知用量按人工保守单价计算为 0.101064 元，不是实际账单。未知失败的预约未释放。首次发送 15:27:03.501 UTC，最后发送 15:36:39.726 UTC，始终沿用原 30 分钟起点，未重置预算。

启动过程还保留两类未到达上游的失败：Agent 本地适配器缺少匿名服务占位凭据，以及 Python 基线未绕过本机 localhost 代理。修复只改变配置/网络路径；原失败输出没有被覆盖。API 网络故障计入发送预算，修复后使用新账本且仅开放剩余 14 次名额。没有把启动问题归为模型能力失败。

## 验证

- 参赛目录、真实 Agent 循环、HTTP 转发预算测试：48 项通过。
- 真实 OpenAI-compatible HTTP 适配器测试：7 项通过；Qwen 风格测试路由无 DeepSeek thinking/reasoning 字段。
- P10 严格验收、模型、指令、网表、settled RTL 及 phase1 聚焦回归：175 项通过；与当时参赛测试合并执行共 218 项通过，之后新增测试分开记录，不将重复运行相加。
- RTL TypeScript 类型检查、相关文件 oxlint、`git diff --check` 通过。
- `test:docs`：16 个检查通过。`doc-sync`：33 个检查通过，1 个环境失败；`scripts/project-doc-site.spec.ts:160` 创建符号链接时 EPERM，与阶段 0、1 相同，提升到主机权限仍存在。未修改无关测试或系统策略。
- 原 ZIP、57 个参考文件、2 个原版基线文件哈希校验通过。
- 修改后的真实 PowerShell 入口 11 项 mock 协议回归通过；Git Bash 入口的 3 道 mock 示例通过，均无模型调用。
- API trace、原始请求、用量与逐题产物由审计脚本重算；baseline SHA 为 `537783e39db22079c33c19af475dbdb760a29ff1656a48c481d434131f84fb51`。

## 收尾证据

- 代码提交：未创建提交。基准 HEAD 保持 `25828d28f1064c6d265aefcca4031641115bd62c`；改动保留在主工程工作树，已有阶段 0、1 文件未回退。
- 主工程实现与说明：[参赛 README](D:/deepseek-harness/rtl-tools/reference/README.zh.md)、`rtl-tools/src/reference`、共享 `rtl-tools/src/interface.ts`、聚焦测试和配对 Agent Note。
- [完整 API 审计](../rtl-reference-alignment/evidence/stage23-api-20260928-v1/api-audit.json)、[冻结预算](../rtl-reference-alignment/evidence/stage23-api-20260928-v1/freeze.json)、[保留预算的网络修复记录](../rtl-reference-alignment/evidence/stage23-api-20260928-v1/amendment-v2.json)。
- [成功 API 运行的源码快照哈希](../rtl-reference-alignment/evidence/stage23-api-20260928-v1/source-api-success-hashes.json)及同目录 `source-api-success/`。原阶段 0、1 收据作为历史快照保留，没有覆盖。
- [模型声明](../rtl-reference-alignment/rtl-alignment-agent/model/MODEL.md)：本地候选、API 实测、未知哈希和显存明确分开。

## 未完成验收

1. 阶段 2：缺少操作系统强制读取隔离环境及真实文件访问拒绝审计。未知题名/新题面和请求内容审计已通过，但不能据此宣称解题进程无法读取裁判资产。
2. 阶段 3 原定本地范围：Qwen 权重、tokenizer/template 哈希、llama.cpp/HIP/ROCm 版本、模板 token 计数、真实工具闭环、原版基线和加载/峰值显存均未测量。API 替代不关闭这些项。
3. 阶段 4：尚未具备完整启动验收条件。可准备部署环境，但不可声称 Linux/Vivado 2026.1、断网或 32 GB 单卡要求已通过。
