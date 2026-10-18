# AgentForChip 审阅材料

2026-10-18 整理。报告与相关实验日志的交接，不是新增模型实验或正式比赛成绩。

## 直接阅读

- [完整阶段报告](REPORT.zh.md)
- [典型失败及成功案例导航](CASES.zh.md)
- [50 题实测报告](AMD/output/cloud-agent-questions50-20261017/REPORT.zh.md)
- [8 题独立复核报告](AMD/output/rtl-rule-transfer-review-20261018/REPORT.zh.md)

最近 50 题有 24 题通过本地编译、展开、仿真和综合。最新 8 题同期对照为 Skill ON 4/8、OFF 6/8，没有证明技能有稳定收益；OFF 不是裸模型 Baseline。失败既有硬件约束判断问题，也有规划格式、执行与 Host 路由问题。完整网表验收与目标比赛环境仍有缺口，详见报告。

## 下载完整包

[AgentForChip-advisor-handoff-20261018.zip](AgentForChip-advisor-handoff-20261018.zip)

- 大小：45,884,139 字节，约 43.8 MiB。
- 解压后共 28,653 个文件；包含报告、模型请求与返回、SSE、实际工具动作、RTL 修订、EDA 文本日志、规则和相关源码快照。
- 原始文本证据逐字节保留；常见凭据模式扫描未命中，未包含模型权重、认证配置、许可证内容、安装目录、波形和二进制缓存。
- 本目录仅提供便于在线阅读的精选副本，不是完整展开目录；完整内容以 ZIP、其中的 `MANIFEST.json` 及 [压缩包使用说明](ARCHIVE_README.zh.md)为准。
- 历史原报告有部分不准确文字，保留原文；Probe205 长度顺序以独立复核的 297 → 223 为准，不能说恢复后反而变长。

SHA-256：

```text
c2f9afb529f21e08b703eb00f6cc74513e976ac7f284d5f3e6a468cf5cdf9095
```

校验摘要：[CHECKSUMS.txt](CHECKSUMS.txt)、[压缩包逐文件核验](ARCHIVE_VERIFICATION.json)、[边界与凭据模式检查](SECURITY_SCAN.json)、[在线副本索引](BROWSE_MANIFEST.json)。

解压后可用 Node.js 运行 `node tools/verify-package.mjs`，无需安装依赖、不联网、不调用模型或 EDA。原始结果中的历史绝对路径按包内说明映射；不能把回放、离线测试或开发者补验当作新的模型自主修复。

GitHub 阅读副本仅为便携性调整 Markdown 链接，未改变技术结论；模型输出、JSON/CSV、源码及 EDA 日志不改写。第三方材料沿用原有许可，许可文件见 `licenses/`，不对整个交接包另行套用统一许可证。
