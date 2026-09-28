# RTL Agent Harness 项目状态

更新日期：2026-09-28。本文件记录当前工程状态，不替代冻结批次结果或历史 Red Team 报告。

## 当前结论

**RT-01 已完成已知入口封堵，并在明确校准范围内接入强制网表验收。156 题原批与两题独立续测已结束，证据审计通过；公开规格有效性仍有已确认限制，不能将验收覆盖直接视为严格正确率。**

| 项目 | 状态 | 边界 |
|---|---|---|
| RT-01 综合分流指令入口 | 已修复 | 生成、纠正、编辑、验证共用检查；含真实探针发现的裸指令及 xilinx 前缀 |
| RT-01 最终网表验收 | 已实现并实测 | 新版 Baseline、Agent、导出、汇总和审计统一使用 p10-netlist-1 |
| 已启用网表题目 | 156/156 题 | 保留原有 3 题，新增 153 题真实正负校准；固定题面、资产和校准库 |
| 公开接口勘误 | 两题已批准并校准 | Prob031_dff 的 q 为一位输出，Prob062_bugs_mux2 的 out 为八位输出；保留原始题面，生成/修复收到相同说明 |
| FPGA 初始化 | 已校准正例 | 未一刀切禁用，不意味着任意初始化任务已支持 |
| 原始 RT-01 攻击 | 验收拒绝 | 错误网表 2 次检查、1 次失配 |
| 历史候选兼容性 | 只读扫描完成 | 301 份源码，新策略拒绝 0；旧分数不变 |
| 回归验证 | 本轮已通过 | 最新 8 个相关文件 95/95（含新 RTL 评测快照）；TypeScript、lint、快速文档 16/16；上轮网表扩展验证保留 |
| 覆盖错误拒绝 | 已修复并实测 | NETLIST_OUTPUT_UNOBSERVED 即使伴随零失配也不能 PASS；实时判定与独立审计一致拒绝 |
| 代码版本 | 已本地提交并冻结 | `25828d28f1064c6d265aefcca4031641115bd62c`，分支 `codex/rt01-netlist-acceptance`；工作区干净，未推送 |
| RT-02 测试台竞争 | 修复已实现，真实反例重放通过 | 新协议 p10-settled-rtl-1：正确 Prob078 为 447 次检查、0 失配；历史错误 PASS 为 216 次失配并被拒绝；缺失必检输出观察不判 PASS |
| 新 RTL 正负例预检 | 156/156 完成 | 312 个真实工具链对照全部符合预期，正负例各 2,319,814 次检查；另 3 个攻击重放；冻结校验通过 |
| 本批新发现的限制 | 已记录，不改写冻结评分 | Prob053 初态要求不在公开题面中，保留 INCONCLUSIVE；Prob058 临时目录扫描 EPERM，保留 TOOL_ERROR；Prob062 参考 mux 极性与公开错误示例的修复方向相反，位宽勘误不授权极性反转 |
| 全量 156 题模型实验 | 原批已取得全部终态并完成审计 | `p156-20260927-v3`：Baseline 143/156，Agent 150/156；462 次调用，其中生成 176、修复 286。Prob133/137 为 HTTP 402 阻塞；Prob093/149 达工具上限。不是 156 题全部通过，也不是公开规格正确率 |
| 模型记录与证据封存 | 完整性检查通过 | 721 个冻结输入、67 份源码快照、33,942 个文件，999,936,786 字节；请求、返回 reasoning、工具轨迹、diff、EDA 原始日志和验收证据已核对 |
| 配额恢复后独立续测 | 已完成并审计，0 题新增通过 | Prob133 新增 114 次调用后请求额度耗尽；Prob137 新增 109 次调用后工具额度耗尽。原候选不变、重建上下文、扣除已用额度。原批 QUOTA 不覆盖；首次续测启动遗漏 profile 的 0 调用失败记录保留 |
| 全部调用与最新验收覆盖 | 已汇总并输出统一索引 | 13 次网络中断批次 + 462 次原批 + 223 次续测 = 698 次，未超过 20124。Baseline 143/156，Agent 仍为 150/156；已知输入/输出 token 为 2,320,416 / 4,498,761，6 次缺失 usage，不猜测费用 |
| 续测证据审计 | 通过 | 检查 751 个冻结输入、8,657 个文件；原批 33,942 个文件逐一复核未变。所有测试进程已结束，临时电源请求已释放 |
| Agent 无效循环与截断 | 实测风险尚未修复 | 原批 77 次重复候选拒绝、15 次已拒版本再次提交；137 次仅 reasoning 耗尽输出上限。边界最终可终止，不代表及时止损 |
| 全仓文档/lint 门禁 | lint 通过；文档 33/34 | 唯一文档失败为网站测试创建 Windows 符号链接时 EPERM；快速文档 16/16 |

## 证据入口

- [最终统一报告](../p156-20260928-final-report/REPORT.zh.md)
- [156 题原批与续测并列表](../p156-20260928-final-report/task-results-156.csv)
- [698 次跨批次模型调用统一索引](../p156-20260928-final-report/model-call-index.jsonl)
- [独立续测完整报告](../p156-20260928-quota-continuation-v2/report/report.zh.md)
- [独立续测模型原始记录](../p156-20260928-quota-continuation-v2/analysis/calls.jsonl)
- [独立续测证据审计](../p156-20260928-quota-continuation-v2/report/evidence-audit.json)
- [RT-01 修复与验收报告](../redteam-20260927/RT-01_Fix_Report.zh.md)
- [网表规则扩展与校准报告](../netlist-suite-20260927/README.zh.md)
- [已批准接口勘误与两题实测](../netlist-suite-20260927/approved-interface-errata/README.zh.md)
- [RT-02 真实反例重放](../rt02-settled-probe-v2-20260927/results.json)
- [156 题 RTL 预检结果](../p156-20260927-settled-cal/results.json)
- [新批次准备与预检报告](../p156-20260927-v2/report/preflight.zh.md)
- [中断批次调用审计](../p156-20260927-v2/report/evidence-audit.json)
- [新批次执行状态](../p156-20260927-v3/report/execution-status.json)
- [156 题中文结论报告](../p156-20260927-v3/report/summary.zh.md)
- [完整逐题取证报告](../p156-20260927-v3/report/report.zh.md)
- [原批最终完整性检查](../p156-20260927-v3/report/final-integrity.json)
- [原批完整模型调用](../p156-20260927-v3/analysis/calls.jsonl)
- [原批 Host 工具轨迹](../p156-20260927-v3/analysis/tool-traces.jsonl)
- [配额恢复后的独立续测配置](../p156-20260928-quota-continuation-v2/continuation.json)
- [首次续测启动失败记录](../p156-20260928-quota-continuation-v1/report/report.zh.md)
- [网络中断与重新冻结记录](../p156-20260927-v3/restart-decision.json)
- [本批评测限制](../p156-20260927-v3/report/evaluator-limitations.json)
- [比较阶段继续执行记录](../p156-20260927-v3/report/comparison-resumes.json)
- [前 59 题及调用完整性检查点](../p156-20260927-v3/report/audit-checkpoint-59.json)
- [最终无模型验收结果](../redteam-20260927/acceptance-release-v2/validation-results.json)
- [16 种综合注释实测](../redteam-20260927/meta-probe-v2/meta-results.json)
- [实施计划及完成状态](../redteam-20260927/RT-01_Fix_Plan.zh.md)
- [项目内协议说明](D:/deepseek-harness/rtl-tools/phase1/p10/README.zh.md#netlist-acceptance)
- [项目内决策记录](D:/deepseek-harness/.agents/notes/implemented/bug-fix/2026-09-27-p10-netlist-acceptance.zh.md)

## 下一步优先级

用户已确认 DeepSeek API 测试及配额恢复后独立续测授权，现已执行完毕。首次批次因代理路由连接重置中断，13 次尝试保留；后续完整批次仅对实验进程直连 api.deepseek.com，不改系统代理或 TLS 校验，全部题重新生成。两题 HTTP 402 后续测没有重置已有消耗。原批和续测分开保存，不从中断批次挑选答案、不覆盖失败记录；6 次缺失 usage 不猜测费用。

P0：独立裁定并修复 Prob062/093/149 参考规格冲突、Prob053 初态限制和 Prob058 临时目录故障。保留本次全部历史成绩，修改评测器后另开冻结实验；验收率不能直接解释为公开规格正确率。

P1：原批 156 个任务终态、462 次调用、源码/请求/收据哈希、工具轨迹和网表验收已核对，中文报告已生成。后续改进无效循环止损和全局配额熔断；Agent 额外反馈、技能和预算不等于等资源框架收益。仓库快速文档 16/16、8 文件 95 个相关测试和 TypeScript 已通过；全量文档仍有独立的 Windows 符号链接权限失败（33/34），未修改无关网站测试。

P2：根据后续需要评估形式等价或网表失败反馈协议。本次有限功能仿真不构成形式等价证明，也未授权扩大模型预算。
