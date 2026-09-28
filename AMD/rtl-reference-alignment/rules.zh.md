# 阶段 0：参考规则冻结

冻结日期：2026-09-28。范围是所提供 ZIP 的比赛对齐协议，不表示已向赛事方确认最新公告。

## 版本与归属

- 原包：[rtlagent2026-master.zip](../doc/rtlagent2026-master.zip)，SHA-256：`c544450c0a41141a9e39b2d1cd7faf3054e3acc27f2588f4f90cc755dbd98c3b`。ZIP 不带 Git 元数据，上游 commit 未知，不能推断。
- 冻结参考：[rtlagent2026-master](reference/c544450c0a41141a/rtlagent2026-master/README.md)。裁判、导入器与参考题留在该包外目录，不拷入 agent。
- 全文件哈希：[reference-lock.json](reference-lock.json)。其中包含 baseline.py、run_baseline.sh、judge.py、judge/veval-judge、judge/sv-xsim-analyze、judge/l3_synth.tcl、veval_import.py、score.py 与 run_selftest.sh。
- 本地方案包：`D:\AMD\rtl-reference-alignment\rtl-alignment-agent`，工作队名为 `rtl-alignment`，正式队名未确认。当前不是完整离线提交包。
- 源码归属：`D:\deepseek-harness\rtl-tools`；开始时主工程干净，提交为 `25828d28f1064c6d265aefcca4031641115bd62c`。不复制研究工作区。
- 模型候选：沿用 `unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF` 的 `Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf` 与 llama.cpp/HIP，依据[现有用户确认记录](../local-qwen-harness/README.zh.md)。不下载、不换模型、不启动服务。
- 目标验证平台：Radeon Cloud Linux W7900 / gfx1100；单卡运行仍按 32 GB 约束，不能用验证卡更大容量放宽要求。实际主机、访问方式、ROCm、镜像 digest、权重 revision/hash 与显存待实机核对；决赛 R9700 / gfx1201 单列。当前 Windows 仅做协议开发。

## 规则对照

下表的源路径均相对于冻结参考根目录；所有原始文件保持不变。

| 项目 | 冻结采用的口径 | 来源 |
| --- | --- | --- |
| 目录输入 | `run.sh <task_dir> <out_dir>`；必需 prompt.txt，接口从题面取得，不要求 interface.txt | docs/API_CONTRACT.md §4、§8；SCORING.md §5.2；三道 tasks/*/prompt.txt |
| 目录输出 | solution.v、trace.jsonl；未解出写空文件，退出 0 表示文件已产出；非 0 表示放弃/错误 | docs/API_CONTRACT.md §8；SCORING.md §5.2 |
| Trace | 每次模型及工具调用一条 JSON 对象；ts/tool/rc/excerpt/token 为建议字段 | docs/API_CONTRACT.md §5 |
| HTTP | Bearer 验证 health/solve；task_id 原样返回，nonce、mode、prompt、interface、deadline_s 输入；solution、trace、elapsed_s 输出 | docs/API_CONTRACT.md §2-4；example/serve/serve_api.py；本次不实现 HTTP |
| 空答案与异常 | 空答案是正常未解出，内部异常与超时另记；HTTP 失败最终按 L0，无赛事侧重试 | README.md 注意事项；docs/API_CONTRACT.md §3-4、§8 |
| 原版基线 | 原文件、一次生成、无 agent/技能/工具/MCP；固定系统提示词及题面，temperature=0、top_p=1、max_tokens=8192，单 HTTP timeout=300s | example/baseline.py 的 SYS/TEMPERATURE/TOP_P/MAX_TOKENS/TIMEOUT_S 与 main；example/run_baseline.sh |
| 基线服务 | 同一次运行、同一模型/量化/上下文/推理服务；使用 LLM_BASE_URL，模型选择读 MODEL_NAME 或 /models；不以 P10 共享初始候选代替独立调用 | SCORING.md §3.2；baseline.py 的 BASE_URL、served_model、main |
| 采样 | 正式每题独立 5 次，计分 pass@1，pass@5 只作诊断；selftest 默认 samples=1 不是正式采样数 | SCORING.md §3.1.4；selftest/run_selftest.sh 的 SAMPLES |
| 判级 | L0/L1/L2/L3 系数 0/0.2/0.7/1.0，逐级 xvlog+xelab、xsim、synth_design | SCORING.md §3.1；selftest/judge.py；selftest/judge/veval-judge |
| 计分 | 每题有效样本系数均值后按有效题数平均；诊断 pass@5 实现取现有样本最大值，非恰好 5 次时须同时披露样本数 | selftest/score.py summarize |
| 排除 | LICENSE_ERROR、PART_NOT_LICENSED、FIXTURE_ERROR、JUDGE_ERROR 及适配层读解失败、判定超时可生成 tool_error；score.py 排除并披露分母 | selftest/judge.py TOOL_VERDICTS、judge、_translate；score.py summarize |
| 导入器 | 原版仅移除 waveform dump initial 块；不生成 interface.txt；ref/tb/reference 只供外部裁判 | selftest/veval_import.py patch_testbench、convert_one |
| 环境 | Linux、Vivado 2026.1（仍以公告为准）、xczu3eg-sbva484-1-e、5ns；不开第三方 HDL 仿真/综合/形式验证路径 | README.md 技术要求；SCORING.md §1.1、§3.1.2 |
| 资源与网络 | 单卡 32GB、断网、实际模型推理；服务绑 127.0.0.1；读取 XILINX_* / EDA_TMP；每次独立本地工作目录 | SCORING.md §1-2；docs/API_CONTRACT.md §7-10 |
| 时间 | 官方单题/全题预算未定；deadline_s=360 是例子；外部超时多 20s，目录 SIGTERM 后 10s 宽限 | SCORING.md §1.3；docs/API_CONTRACT.md §3-4、§8 |

## 文档与脚本差异、待确认项

1. “基线只有题面”是概述，原版脚本实际包含固定系统提示词，且可追加非空 interface.txt。正式 RTL interface 为空；以原脚本为准，不删除系统提示词，也不注入额外提示词。
2. `run_selftest.sh --timeout` 默认 1800 秒只传给 judge.py，并未约束 Agent 的 run.sh。原版 baseline 的 300 秒是单请求上限。均不能作为正式解题总墙钟预算。
3. 原版 selftest 用 `for task_dir in $TASK_LIST` 拆分路径，含空格任务路径不能靠该驱动验证；本次直接测适配入口。参考文件不修改。
4. API 文档提醒 source 环境避免 `set -u`，但 selftest 仍启用 `set -uo pipefail` 后 source env.sh。目标 Linux 的实际环境加载需阶段 4 检查。
5. judge.py 的 work/log 名称含 task_id 且日志按题覆盖，不能把它当逐样本完整证据库；阶段 6 须独立保留样本输出，不能用现有 judge_elapsed_s 冒充解题墙钟。
6. 计分器默认增益满分线 2.5 是占位；正式满分线、基线零分处理、效率基准、题量、时间窗口、镜像及平台访问细节均待公告。报告只列原始指标，不猜总分。
7. API 对命名采用纯小写表述，但目标结构含 Dockerfile/MODEL.md/REPORT.md；保留参考规定的固定文件名，其余用英文路径。
8. 参考 ZIP 上游地址和 commit、最新规则版本、目标机器可用性、正式队名均未确认。阶段 0 冻结的是可追溯开发依据，不伪造这些未知信息。

## 两套记录

P10 记录为“研究验证协议 / p10-netlist-1、p10-settled-rtl-1 的验收覆盖”；参考记录为“冻结 ZIP 比赛对齐自测 / L0-L3 / pass@1”。历史 143/156、150/156 不迁移为参考成绩。此次记录为“显式 mock 文件协议验证”，不产生 L0-L3、pass@1 或增益。基线没有真实调用。

## 独立问题跟踪

| ID | 已知事项 | 本次处理与后续要求 |
| --- | --- | --- |
| VALID-053 | Prob053_m2014_q4d 公开题面未规定的初态要求，历史 INCONCLUSIVE | 保留，外部裁判冻结后独立复现，不当成已确认模型错误 |
| ENV-058 | Prob058_alwaysblock2 临时目录扫描 EPERM / TOOL_ERROR | 保留环境故障；阶段 4 单独查，不改历史终态 |
| SPEC-062 | Prob062_bugs_mux2 位宽勘误不授权反转参考 mux 极性 | 保留原文与原裁判，不把匹配参考等同规格正确 |
| SPEC-093 | Prob093_ece241_2014_q3 预先记录的题面/参考冲突 | 保留历史预算耗尽；独立问题报告，不自选剔除 |
| SPEC-149 | Prob149_ece241_2013_q4 预先记录的题面/参考冲突 | 同上 |
| RT-01/02 | 已有修复及特定校准证据 | 不重新列为未修复，不把 Windows 2025.2 证据迁移为 Linux 2026.1 通过 |

问题依据：[当前状态](../doc/PROJECT_STATUS.zh.md)、[冻结实验报告](../p156-20260928-final-report/REPORT.zh.md)。此次不重新裁定问题，也不修改裁判提高得分。

## 资料搜集

- 已阅读本地 README、SCORING、API_CONTRACT、baseline、selftest driver、judge adapter、importer、score，以及主工程 AGENTS、启动约定、测试和文档规则。
- [NVlabs/verilog-eval](https://github.com/NVlabs/verilog-eval)：核对公开数据集来源；不抓取答案用于 mock。
- [Qwen 官方模型仓库](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct/tree/main)与[所选 GGUF 发布页](https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF/blob/main/Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf)：确认候选来源可访问，不代表本机或云机已加载。
- 搜索 `rtlagent2026` 未取得可确认的公开仓库结果；[赛事官网](http://www.fpgachina.cn/)本次访问返回错误。未确认最新公告，不据此改变 ZIP。

## 验证

运行 `pwsh -File ./freeze-reference.ps1 -Verify` 核对原包、全部参考文件和方案包中两个原版基线文件。原版 selftest 未执行，Vivado 与模型调用均为零。
