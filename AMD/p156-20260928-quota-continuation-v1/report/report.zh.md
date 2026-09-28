# 独立续测启动记录

本目录首次启动在加载 `rtl-p10-model` profile 时失败，尚未进入模型或 EDA 执行。原因是准备脚本遗漏复制已存在的 profile。没有 dispatch 目录、没有题目比较结果，新增模型调用为 **0**。

原始 156 题结果未修改。本目录的配置、失败日志与电源请求释放记录全部保留，不重写成成功运行。

已修正独立准备脚本，在新目录复制并冻结相同的 profile；模型、评测器、候选和剩余额度不变。实际续测结果见 [独立续测 v2 报告](../../p156-20260928-quota-continuation-v2/report/report.zh.md)。

证据：[启动日志](../runner.log)、[CLI 错误日志](../runner-logs/Prob133_2014_q3fsm.log)、[终态记录](latest.json)、[电源释放记录](../power-request.jsonl)。
