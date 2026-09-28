# 固定 40 题 Repair V2 执行记录

## 当前状态

2026-09-21 20:50（Asia/Shanghai）：调度器已以退出码 0 结束，状态为 `COMPARISON_FINISHED`。固定 40 题中，2 题历史校准阻塞、5 题生成截断、33 题完成对照；Baseline 和 Agent 最终通过数均为 29，自然修复成功 1/3。详见 [主报告](report/report.zh.md) 与 [异常分析](report/findings.zh.md)。

2026-09-21 20:12：用户已明确回复“授权本次测试，继续执行”，授权下述目的地、载荷和 API 费用范围，随后启动本次冻结批次。

此前 20:08 的启动被自动安全审查拦截，没有产生模型调用或 EDA 执行。批次已完成 839 个输入文件的哈希冻结和 58 个仓库源文件的快照。

## 授权范围

目的地为配置的 DeepSeek 官方模型服务，代码中的默认地址为 https://api.deepseek.com 。请求内容包括测试题目、候选 RTL、技能提示、工具定义、前序工具结果及诊断/波形摘要。使用已有 API 凭据认证，可能产生调用费用；凭据不写入报告。

## 固定协议

- 固定 40 题，清单 SHA-256：`78f895dfebde67ce39905ca19a7454db5f904fb469966648a9d5fa273f865106`。
- 2 题历史评测器校准阻塞，38 题可运行；不替换题目，不计为模型错误。
- `deepseek-flash`，temperature 0；生成预算 8192 token；正常修复预算 16384 token；截断后一次 4096 token 强制工具调用且 reasoning off。
- 最多 3 轮语义修复；触发阈值后压缩可选上下文；保留已验证的最佳修订。
- 生成串行、对照验证最多 2 个独立作业。
- 原始校准复用历史已封存数据。本次测试不是完整操作系统隔离运行。

## 日志范围

保存模型接口交给 Harness 的全部规范化流记录、返回的 reasoning、正文、工具调用参数与 Host 执行结果。保留每次请求、超时/截断时已经收到的部分记录、RTL 修订、EDA 命令及 stdout/stderr、诊断与现有波形产物。

这不是原始 HTTP/SSE 抓包，也不包含服务端未公开或未发送的内部思考。请求受冻结的 token、时间和字节上限约束；保存了全部已收到内容不等于回答没有被截断。

## 执行入口

从 `D:\deepseek-harness` 启动现有 dsh profile 调度器，不直接绕过应用启动契约：

```powershell
node rtl-tools/phase1/p10/generation-stability.mjs 'D:\AMD\phase1-validation\p10-repair-v2-40-full-trace-20260921-v1' 'D:\deepseek-harness' all
```

结束后运行批次内 `analyze-campaign.mjs`，校验冻结文件、流记录投影、字节数和 SHA-256、工具调用绑定及最终最佳修订，并生成中文报告、逐题分析、完整调用 JSONL 和文件清单。源码冻结后不得修改；历史结果不覆盖。
