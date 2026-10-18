# FPGA Verilog RTL Agent 200题库 v3

面向编写 FPGA Verilog / SystemVerilog RTL 的 Agent。200题分为5档，每档40题。**180道RTL题全部提供可综合风格的参考实现和可执行自检Testbench**，另外20道为Agent评测流程情景审查题，不冒充RTL自动测试。

## 本次补齐

| 内容 | 数量 | 文件 |
|---|---:|---|
| RTL生成题 | 160 | `agent_visible/prompts/`、`starters/` |
| RTL修复题 | 20 | 包含故意含错的完整starter |
| 参考RTL | 180 | `evaluator_only/cases/Qxxx/reference.sv` |
| 自检仿真配置 | 206 | 含默认参数和边界参数变体 |
| Agent情景题 | 20 | 文字审查与验收标准，单独评分 |

本版修复了许可证选择问题，使用真实 Vivado **2026.1** 对原指定器件运行仿真与综合回归。准确结果、向量数、重试记录和证据路径见 验证报告（历史路径：`docs/VALIDATION.md`，本包未收录） 与 `metadata/eda_validation.json`。综合网表、DCP和资源报告随包交付，位于 `evaluator_only/synthesis/`。环境修复过程见 Vivado排查记录（历史路径：`docs/VIVADO_ENVIRONMENT.md`，本包未收录）。

## 一键回归

需要 Vivado 2026.1、目标器件支持和许可证，以及 Node.js 20+；不需要npm安装或联网。以下为PowerShell示例，请按实际安装路径设置 `$bin`：

```powershell
$bin = 'D:\AMDDesignTools\2026.1\Vivado\bin'
$lic = 'D:\AMDDesignTools\Xilinx.lic'
# 仿真与综合，明确选用现有BASIC许可证
.\run_eval.ps1 -VivadoBin $bin -LicenseFile $lic -Reference -Batch -SynthJobs 2
# 仅运行全量参考仿真
.\run_eval.ps1 -VivadoBin $bin -LicenseFile $lic -Reference -Batch -NoSynth
# 评测Agent输出：每题一个 submissions/Qxxx/dut.sv
.\run_eval.ps1 -VivadoBin $bin -LicenseFile $lic -CandidateDir .\submissions
# 只测选定题号，每题仍执行全部参数变体
.\run_eval.ps1 -VivadoBin $bin -LicenseFile $lic -CandidateDir .\submissions -Ids 'Q083,Q106' -NoSynth
```

也可直接调用 `node tools/evaluate.mjs --help`。每次使用独立新工作目录，输出 `results.json`、逐阶段日志和成功综合时的DCP/Verilog网表/资源报告。省略 `-NoSynth` 时，只有仿真成功才进入综合；缺器件单独标记 `synthesis_environment_blocked`，返回非零退出码。`-Batch` 仅供参考实现快速回归，正式候选始终逐题隔离编译运行。

`-LicenseFile`只设置评测进程的许可证路径，不改全局配置或许可证内容；其他机器应换为自己的合法授权。每个综合配置使用全新Vivado进程，避免Windows临时目录锁连带影响下一题。`-SynthJobs`默认1、最大4，请按内存选择；任何进程异常、超时或缺少完成标记都不会被当成全流程通过。

## 题面与答案隔离

只把 `agent_visible/questions.jsonl` 中的 `prompt` 和对应starter交给Agent。不要把 `evaluator_only/`、`metadata/full_cases.json` 或评测运行目录挂载给待测Agent。此评测器不是恶意HDL安全沙箱，正式服务应使用隔离账户或容器并限制资源、网络和文件访问。

目录索引：

- 200题目录（历史路径：`docs/QUESTION_CATALOG.md`，本包未收录）、全部题面（历史路径：`agent_visible/QUESTIONS.md`，本包未收录）、参考答案（历史路径：`evaluator_only/ANSWER_KEY.md`，本包未收录）。
- `evaluator_only/cases/`：本版180份RTL、206份TB及适用的打包向量。
- `evaluator_only/full_source/`：参考RTL、独立行为模型、刺激及TB生成源码。
- `evaluator_only/source/`：原始题面构建源码；`smoke/`保留v1的12个基础示例，不是本版评测入口。
- `tools/evaluate.mjs`：版本检查、编译、展开、仿真、综合及JSON结果。
- 评测指南（历史路径：`docs/EVALUATION_GUIDE.md`，本包未收录）、验证边界（历史路径：`docs/VALIDATION.md`，本包未收录）、综合告警复核（历史路径：`docs/SYNTHESIS_REVIEW.md`，本包未收录）、参考来源（历史路径：`docs/SOURCES.md`，本包未收录）。

## 对齐与边界

用户纪要原要求Vivado2025.2，本版按后续要求使用2026.1。器件仍为 `xczu3eg-sbva484-1-e`、主时钟5ns。内部CDC扩展综合约束采用第二时钟7ns并声明异步时钟组，纯组合题不伪造时钟。这些不是官方新增规则；本包不是官方题集，也不保证隐藏题表现。

175道核心RTL和5道CDC扩展分别统计；20道情景题不进入RTL通过率。仿真通过不等于形式证明、模拟亚稳态验证、布局布线通过或200MHz时序收敛。难度尚未按具体小模型的实测通过率校准。

```powershell
node tools/validate.mjs
node tools/validate_full.mjs
node tools/validate_synthesis.mjs
node --test tools/oracle_checks.mjs
node tools/evaluate_checks.mjs
# 仅开发期：重建完整RTL测试资产，之后必须重新回归并更新清单
node evaluator_only/full_source/build.mjs
```

`evaluate_checks.mjs`是明确标注的mock工具链黑盒测试，不是硬件验证。原始 `evaluator_only/source/build.mjs` 会重写v1元数据，不要在冻结评测包内运行。第三方题库只作为任务组织参考，没有复制其题目、RTL或TB。
