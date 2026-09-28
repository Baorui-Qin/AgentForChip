# 模型声明：API 开发实测与本地候选

记录日期：2026-09-28。本文不是已完成的离线参赛声明。本轮按用户授权使用现有 DeepSeek API 替代尚未部署的本地千问服务；两者不视为同一模型或同等验收。

## 本轮实测

| 项目 | 已确认事实 |
| --- | --- |
| 模型请求 ID | `deepseek-flash` |
| 服务端模型名称 | `/v1/models` 返回 `DeepSeek-V4.1-Flash` |
| 上游服务 | `https://api.deepseek.com/v1`，已有 API 凭据 |
| 两条调用路径 | Agent 与原版 baseline 均访问本机受控转发端 `http://127.0.0.1:18891/v1`；实验结束后已停止 |
| 适配器 | Harness 已注册 `llm-pi-ai` OpenAI-compatible provider；参赛 route 为 `rtl-api` |
| 原版基线 SHA-256 | `537783e39db22079c33c19af475dbdb760a29ff1656a48c481d434131f84fb51` |
| 基线协议 | 每题独立单次生成，固定系统提示词，temperature=0、top_p=1、max_tokens=8192，零工具 |
| Agent 协议 | 原有 Agent 循环；每题 4 次尝试上限、8192 输出上限、temperature=0；实际每题 2 次调用、1 次 `check_rtl` |
| 推理模式 | 本次请求不显式设置 reasoning_effort 或 thinking，使用上游默认模式；响应包含 reasoning 内容。此结论不外推给 Qwen |
| 上下文 | 服务元数据报告 1048576 tokens；开发 profile 保守声明 32768，另限制请求体 32768 字节。没有声称完成 tokenizer 精确校准 |
| 工具与 EDA | 只有公开接口、语法、DUT 独立综合；本机 Windows Vivado 2025.2，器件 `xczu3eg-sbva484-1-e`；未施加时钟约束，不报告时序收敛 |
| 3 道示例 | Agent 均产出未评分候选且语法/综合通过；原版基线均单次返回非空代码，finish=stop |
| 用量 | 10 次上游发送尝试，9 次成功，1 次网络失败用量未知；成功请求共 8164 输入、6381 输出 tokens |
| 费用 | 每次保守预约 0.5 元，总预约 5 元，小于批准的 10 元；已知用量按人工保守单价估算 0.101064 元。不是官方账单，未知失败仍保留预约额度 |
| 总时间 | 首次发送 15:27:03.501 UTC，最后一次发送 15:36:39.726 UTC；在原 30 分钟预算内，无预算重置 |
| 权重与模板 | API 不提供本轮实际权重、tokenizer、chat template 文件及哈希，未知 |
| GPU / ROCm / 显存 | 云 API 不可见，未测量，不填写本地 GPU 数据 |
| 外部评分 | 未运行外部裁判，不声称 L2/L3、增益或比赛成绩 |

完整原始请求、流响应、预算、失败记录和逐题审计见[API 审计](../../evidence/stage23-api-20260928-v1/api-audit.json)与[执行记录](../../../doc/RTL_Alignment_Stage23_Execution.zh.md)。转发端只添加鉴权，不改写基线请求体。启动失败、代理故障和成功样本分别保留，不把成功补跑覆盖到失败目录。

## 保留的本地候选

| 项目 | 当前状态 |
| --- | --- |
| 模型 | `Qwen3-Coder-30B-A3B-Instruct` |
| 量化候选 | `unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF` 的 `Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf` |
| 路线 | llama.cpp HIP，单卡完整运行；未自动更换模型或下载权重 |
| 实际权重位置与哈希 | 未取得可用部署，待实测；历史下载资料中的哈希不冒充本机验证 |
| tokenizer / chat template | 实际来源、文件哈希、模板展开和工具格式均待校准 |
| 后端 / GPU / ROCm | 待提供真实机器和版本；原目标 W7900 不等于已可用 |
| 加载 / 运行峰值显存 | 均未测量，不能证明符合 32 GB 限制 |
| CPU offload / 多卡 | 未验证；不假定符合规则 |
| 本地同服务基线与工具闭环 | 未运行 |
| 离线部署 / 断网测试 | 未运行 |

权重文件大小不是运行峰值显存。只有真实部署、模板校准、同服务独立 Agent/Baseline 和显存测量全部有证据后，才能把本地模型部分标为完成。
