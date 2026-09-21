# P05/P06 开发验收

结论：组件实现和无密钥测试通过；原始评分器与 Vivado 的兼容性阻塞真实三路线验收。本轮没有发送真实模型请求。

## 交付范围

- P05：严格提取与接口检查、不可覆盖 UUID 版本、原始响应和源码 SHA-256、逐路审批绑定、一次性验证、快照复核及原子导出。
- P06：独立 Baseline、Agent-Base、Agent-Domain 的 dsh 入口，PowerShell 与 shell 薄包装，协调器及可重建的 JSON/CSV/Markdown 对照报告。
- 正常完成时调用预算为 1/2/2；无重试、重新采样或修复。只读解读不能改变候选及 EDA 事实。
- 基于固定 VerilogEval 零样本协议，不是比赛仅题面的 Baseline。文献方法、提示差异与实验限制见[中文技术路线](../../deepseek-harness/rtl-tools/phase1/comparison/README.zh.md)和[英文技术路线](../../deepseek-harness/rtl-tools/phase1/comparison/README.md)。

## 组件证据

| 检查 | 结果 |
| --- | --- |
| RTL 全部组件测试及回归 | 164 通过，0 失败，4 可选真实工具测试跳过 |
| 插件 TypeScript / lint | 通过 |
| 仓库 test:docs | 16 项通过，0 失败 |
| 定向双语 / 链接 | 3 个文档对一致，6 份文档无坏链接 |
| Agent Note 格式及分类 | 通过 |
| PowerShell / shell 语法 | 通过 |
| profile 安装与重复安装 | 干净目标安装通过；已有不同内容拒绝覆盖 |
| 真实 dsh 初始化及报告入口 | 通过，无 API 调用 |

[测试 JSON](p05-p06-final-tests.json) 包含逐项结果。跳过项是环境变量控制的 Icarus 正例及三个 standalone Vivado 用例，不计为通过；本轮真实 Vivado 证据来自下述独立预检。Loader/Mock 覆盖三路隔离、提示一致性、隐藏资产哨兵、1/2/2 次调用、鉴权/连接/超时、拒绝审批、EDA 失败、解读失败、篡改及卸载进程退出。固定快照位于 comparison.spec.ts。

未运行完整 doc-sync 或全仓库 lint，不对其结果作通过声明。核心 agent-loop 和已有 Harness Session 格式未修改；新实验信封为 1.2，嵌套原生记录保留 1.1，既有 1.0/1.1 读取不变。

## 真实预检阻塞

固定题目：Prob038_count15。固定数据集版本：c498220d0a52248f8e3fdffe279075215bde2da6。

正确手写 DUT：[run-iiip1k](run-iiip1k/result.json)。故意错误 DUT：[run-tAtULM](run-tAtULM/result.json)。两次 xvlog 均以退出码 1 停止，后续展开、仿真、综合为 SKIPPED。

```text
ERROR: [VRFC 10-3380] identifier 'tb_mismatch' is used before its declaration
trusted/tb.sv:97
ERROR: [VRFC 10-8530] module 'tb' is ignored due to previous errors
```

这是原始测试台兼容性问题，不是模型生成结果。原始[预检回执](preflight-7faed676-009e-4700-b5d4-f13474ea0c48.json)保留当时的 FAIL/design 分类，不重写历史；当前实现将可信测试文件错误归为 TOOL_ERROR/environment，并有专门 Mock 回归。数据集工作区仍干净，测试台与参考实现未修改，未切换后端。由于尚未进入 xsim，真实种子参数和功能判据兼容性也未验收。

## 三路线结果

[comparison.md](comparison-a5d6a997-198f-4f72-adf5-80f08bd82803/comparison.md)、[comparison.json](comparison-a5d6a997-198f-4f72-adf5-80f08bd82803/comparison.json)、[comparison.csv](comparison-a5d6a997-198f-4f72-adf5-80f08bd82803/comparison.csv) 已从实际回执生成。三路均为 NOT_RUN；真实 API 请求 0，生成候选 0。不可用用量、时序、资源、价格和 TTFT 为 null，而非零值。公开提示原文及规则保存在同目录 protocol.json。

尚未批准三路线真实联调、Agent 增益、自动修复、完整 OS 隔离、本地模型、ROCm、G1/G2 或比赛及论文复现。下一步须明确批准评分器兼容性适配或评测后端选择；本次计划不授权静默修改原始测试台，也不在预检失败后消耗生成请求。
