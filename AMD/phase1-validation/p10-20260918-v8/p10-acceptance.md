# P10 验收：NO-GO

## 结论

固定版本的完整十题预检得到 **0/10 可评测、10/10 测试台兼容性阻塞**；独立 Prob038 哨兵同样阻塞，不计入分母。已按计划停止：Baseline、Agent、40 题均为 **NOT_RUN**，真实模型派发 **0 次**，P09 预算和历史归档未修改。

这不是模型通过率为 0%。可评测分母为零，模型通过率、修复率及收益全部为 null。没有模型生成、模型修复或 Skill 效果证据。已完成的是预检与 NO-GO 交付，不是完整 P10 模型对照实现。

## 原因与边界

Vivado 2025.2 对未修改原始测试台报告 **VRFC 10-3380: identifier 'tb_mismatch' is used before its declaration**，随后 **VRFC 10-8530** 忽略 tb 模块。11 次运行均停在 compile，elaborate、simulation、synthesis 全部 SKIPPED。没有修改 reference/testbench、没有换题、没有调用模型尝试修复 Host 拥有的测试台。

| 任务 | 归属 | 结果 | 原测试台诊断行 |
| --- | --- | --- | --- |
| Prob005_notgate | 正式选题 | 测试台编译阻塞 | 70 |
| Prob035_count1to10 | 正式选题 | 测试台编译阻塞 | 96 |
| Prob045_edgedetect2 | 正式选题 | 测试台编译阻塞 | 78 |
| Prob074_ece241_2014_q4 | 正式选题 | 测试台编译阻塞 | 75 |
| Prob015_vector1 | 正式选题 | 测试台编译阻塞 | 72 |
| Prob033_ece241_2014_q1c | 正式选题 | 测试台编译阻塞 | 79 |
| Prob004_vector2 | 正式选题 | 测试台编译阻塞 | 66 |
| Prob020_mt2015_eq2 | 正式选题 | 测试台编译阻塞 | 54 |
| Prob018_mux256to1 | 正式选题 | 测试台编译阻塞 | 54 |
| Prob061_2014_q4a | 正式选题 | 测试台编译阻塞 | 52 |
| Prob038_count15 | 独立哨兵 | 测试台编译阻塞 | 97 |

这里仅确认所列 11 个评测器的真实 EDA 结果，不由静态相似模式推断其余全部 156 题都失败。版本探测中 vivado -version 返回 1，但输出匹配 2025.2；实际 xvlog 编译日志明确将失败归于测试台。保留原始返回码，不将其改写为成功。

## 已实现

- 固定 origin/revision、干净工作树与 468 个原始资产身份；仅对 Git 声明的 LF/CRLF 检出做身份比较，不改写运行字节。
- 结果前冻结十题选题、完整四十题顺序、公开接口与 5 ns 真实/虚拟时钟策略；manifest 自身哈希使用独立收据。
- dsh Host 专用无模型 profile，永久任务 claim、配置/源码漂移检查及独立目录；复用 VerificationRunner 的前三阶段，预检永远不产生候选 VERIFIED。
- JSON/CSV 对照占位、兼容性表、错误分布、轨迹索引及 GO/NO-GO；普通候选仍要求四阶段。
- 双语 P10 文档与 Agent Note。完整模型分支、P10 派发总账、共享候选接入及公开属性 Skill 过滤未在此停止分支实现。

## 验证与审计

RTL 回归：328 通过、4 跳过、0 失败；P10 定向测试 6 通过；类型检查、定向 lint、git diff --check 通过。双语文档快速检查 16/16 通过。完整 doc-sync 为 33 通过、1 项环境阻塞：Windows 在文档站点测试创建符号链接时返回 EPERM，未修改无关测试。Mock/集成测试不替代真实模型证据。

11 份 EDA 终态 manifest 共 275 项文件已逐项核对大小/SHA-256及完整文件集；结果、verification key、源码哈希、任务身份和最后 run_finished 事件一致。468 个数据集资产未变，72 个冻结运行文件未变，进程快照无遗留 EDA/campaign 进程。P09 三份历史归档合计 9038 个文件及 277 个运行链接复核通过。

预检实际墙钟 47624 ms；十题预检合计 41128 ms，哨兵 4066 ms。模型与候选评分成本未发生。既有工具接口限制、凭据环境清理、进程回收和哈希检查不构成完整 OS 隔离，full_os_isolation_verified=false。

## 交付索引

- [十题 JSON](pilot-10/p10-results-10.json) / [CSV](pilot-10/p10-results-10.csv)
- [对照报告](pilot-10/p10-baseline-vs-agent-10.md)、[兼容性表](pilot-10/p10-benchmark-compatibility-10.csv)、[错误分布](pilot-10/p10-failure-distribution-10.csv)
- [十题 manifest](pilot-10/manifest/p10-manifest-10.json)、[四十题预先冻结顺序](pilot-10/manifest/selection-order.json)、[轨迹索引](pilot-10/trajectory-index.json)
- [GO/NO-GO](pilot-10/p10-go-no-go.json)、[40 题未运行](main-40/NOT_RUN.json)、[审计结果](audit-results.json)、[质量检查](quality-summary.json)
- [归档审计](artifact-manifest-audit.md)、[启动与纠正记录](startup-history.md)、[机器可读验收](p10-acceptance.json)

旧启动失败、解析器缺陷版本及用户中断版本均单独保留，不与当前样本合并。未来如授权兼容性研究，必须另建明确标注的评测器版本，不能补写本次成绩。完整 OS 隔离、ROCm/本地模型/断网部署、全面时序收敛和统计显著收益均未签收。
