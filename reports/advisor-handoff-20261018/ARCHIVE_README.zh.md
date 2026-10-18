# AgentForChip 师兄审阅交接包

日期：2026-10-18。本包整理现有报告、真实模型输出和 EDA 日志，供讨论项目进展、失败原因及后续研究方向。打包过程不调用模型、不运行 EDA、不修题目答案、不更新历史成绩。

## 建议阅读顺序

1. [微信版简要汇报](WECHAT.zh.md)：项目现状和希望请教的问题。
2. [完整阶段报告](REPORT.zh.md)：事实、限制、创新想法和验证方案。
3. [典型案例导航](CASES.zh.md)：从失败原因直接进入规划原文、实际修改和 EDA 结果。
4. [50 题结果](AMD/output/cloud-agent-questions50-20261017/REPORT.zh.md)、[8 题独立复核](AMD/output/rtl-rule-transfer-review-20261018/REPORT.zh.md)：原批报告与后续纠正分开保留。

## 先明确结论

- 最近 50 题有 24 题通过本地编译、展开、RTL 仿真和综合，含自动修复后新增通过的 2 题；未跑原始裸模型 Baseline，不是正式比赛得分。
- 最新 8 题同期对照为 Skill ON 4/8、OFF 6/8。OFF 仍有规划、工具和 Host 防护，不是裸模型；样本小，不能证明 Skill 普遍有害，也没有证明其有稳定收益。
- 新探针的完整终态仍受网表校准限制。四阶段通过与完整网表验收、时序收敛必须分开。
- 30B/8B 试验线的图谱主要离线编译为技能摘要；教师 API 试验线另有运行时检索。两条线没有被拼成一个已全面验证的系统。
- Probe205 的 cause 长度以独立复核为准：首次 297，恢复 223，仍超出 160 上限；旧报告的顺序错误原样保留，不能继续据此说“恢复后反而更长”。

## 包含内容

| 目录 | 内容 |
| --- | --- |
| `AMD/output/cloud-agent-questions50-20261017/` | 50 题结果、逐题失败分析、216 次调用索引、请求和 SSE、模型输出、工具轨迹、RTL 版本及 EDA 文本日志 |
| `AMD/output/rtl-rule-transfer-probes-20261018/` | 8 题 ON/OFF 结果、42 次调用、20 份规划、源码、实际编辑及验证记录 |
| `AMD/output/rtl-rule-transfer-review-20261018/` | 8 题后续独立复核与原文纠错 |
| `AMD/output/rtl-grounded-minimal-fixed-20261018/`、`rtl-plan-effectiveness-audit-20261018/`、`rtl-diagnostic-guards-20261018/` | 历史规划与执行脱节、重复动作及诊断防护对照的原始依据 |
| `AMD/output/rtl-rule-explanations-offline-20261018/` | 离线规则解释、图谱及技能接入验证记录 |
| `AMD/output/rtl-api-distillation-20261017/agent-knowledge-04/`、`agent-knowledge-07-smallstep/` | 教师线独立反例、知识采用限制及最新小步停止观察；不是小模型配对增益实验 |
| `AMD/workspaces/` | 相关独立实验脚本、RTL 实现、技能、图谱及审计工具的只读快照；不含依赖安装目录 |
| `AMD/p156-20260928-final-report/` | 历史 156 题背景汇总，不能与近期双模型成绩混算 |
| `deepseek-harness/` | 主工程入口说明、演示指南及许可证说明的选定文件，不是完整 Harness 发行包 |

本包不是可一键执行的完整开发环境。实验脚本包含历史绝对路径，需要现有 Harness 依赖、相应模型与 EDA/许可证才能重新运行。审阅只需解压并阅读；不要直接批量执行脚本或重跑历史目录。求解模型也不应接触本包中的 evaluator-only 资产。

## 原始记录与脱敏边界

原始请求、回答、工具轨迹、源码和 EDA 文本文件按字节复制，未改写 PASS/FAIL、模型答案或失败终态。部分底层 `run.json` 保留历史 `RUNNING` 字段，是否已结束应结合任务结果、传输和退出回执，不要单独依据这个字段判断。

排除模型权重、密钥与认证配置、SSH/人工授权材料、许可证文件、依赖与工具安装目录、Vivado 复制的脚本库、可执行文件、DCP/WDB/VCD 及缓存。大量全工作区保全清单包含无关文件名，亦不外发；保留与本实验有关的汇总回执。排除明细见 `EXCLUSIONS.json`，不是“所有本地文件都已上传”。

`REPORT.zh.md` 是完整报告的便携阅读副本，仅将已收录证据的本机绝对 Markdown 链接改为包内相对链接。原报告保留在 `AMD/doc/`。其他原始报告、JSON/CSV 中的历史绝对路径保持不变；`D:/AMD/...` 对应包内 `AMD/...`，`D:/deepseek-harness/...` 对应 `deepseek-harness/...`。可使用下面命令定位：

```powershell
node tools/verify-package.mjs --resolve "D:/AMD/output/rtl-rule-transfer-probes-20261018/comparison-summary.json"
```

## 完整性核验

需要 Node.js，无需安装依赖、不联网、不调用模型或 EDA：

```powershell
node tools/verify-package.mjs
```

`MANIFEST.json` 记录导出文件的相对路径、来源、SHA-256、大小和是否经过阅读版链接转换；`SOURCE_SNAPSHOT.json` 记录原始来源哈希。打包时再次核对原始来源未变。`PACKAGE_VERIFICATION.json` 还检查 216/42 次调用关联、关键统计及便携报告的证据链接。`SECURITY_SCAN.json` 是常见凭据模式和文件边界检查，不是对所有可能敏感内容的绝对保证。

历史报告里“测试通过”仅指原批记录；本次新增的仅是打包、文件哈希、统计与内容边界检查，不是新的模型能力或 EDA 正确性结论。第三方文件沿用各自已有许可，见 `licenses/` 及原工程说明，不对全部材料另行套用统一许可证。
