# P09 真实自主修复验收

实现复用现有 RepairWorkflow、DeepSeek 适配器和 VerificationRunner。默认保留人工审查，自动模式须显式授权。所有结果是冻结缺陷修复实验，不是从题面自然生成的成功率。

## 验收状态

| 项目 | 状态 |
| --- | --- |
| minimal_autonomous_loop | PASS |
| synthesis_only_autonomous | PASS |
| controlled_multi_round | NOT_OBSERVED |
| restricted_tool_interface | PASS_WITHOUT_OS_ISOLATION |
| official_whole_request_counting | PASS_EXACT_LOCAL_ONLY |
| audit | PASS |
| skills | PASS_APPLICABILITY_NOT_EFFICACY |
| ablation_execution | COMPLETE |
| ablation_valid_comparison | BLOCKED_BY_HOST_OR_EDA_FAILURE |
| full_os_isolation | NOT_VERIFIED |
| implementation_timing_closure | NOT_ACCEPTED |
| prob038 | BLOCKED_TESTBENCH_COMPATIBILITY |
| statistical_gain | NOT_ESTABLISHED |

## 正式对照

完成 15/15 单元，四阶段绑定 PASS 9/15。每题各组使用相同冻结错误 DUT，运行顺序、协议、技能与源码均在 ablation-freeze.json 固定。没有复用预验收结果，没有挑选最佳样本。

所有正式单元最多接受一次修复。因此 B 的旧失败账本未在第二次编辑决策中被检验，C 的提示包含技能也不能证明技能带来收益。

## 预算和异常

实际 API 派发 49/375，其中预验收 18/150、主对照 31/225。未知 usage 保留 null，本地 Token 与 provider usage 分别记录。两次早期运行在派发前因运行时路径/硬链接完整性检查停止，API 为零，未删除记录。B 预试运行的候选仿真通过但综合超时，保留为 POLICY_BLOCKED，不重标为设计错误或成功；不能仅凭同时运行过测试便断言超时根因。

## 质量检查

RTL 范围回归 302 通过、0 失败、4 跳过；最后定向测试 46 通过。类型检查、定向 lint、双语配对及 doc-quick 通过。完整 doc-sync 为 33 通过、1 失败：Windows 无符号链接创建权限导致既有文档站测试 EPERM，未修改该无关测试或系统权限。

## 签收边界

P07 历史人工审批 synthesis-only 成功记录保留；P09 自主 synthesis-only 由新证据独立证明。两个指定多轮夹具的一次修好不冒充两轮验收。工具接口受限不等于操作系统隔离，full_os_isolation_verified 始终为 false。全面时序收敛、Prob038 兼容性及统计显著收益均不随闭环成功签收。

详细请求审计见 request-context-audit.json，模型原始工具轨迹与 EDA 记录位于 experiments，各技能证据见 skill-validation.md/json，旧选择器失败调查见 failure-analysis-skill-selector.md。

## 主对照阻塞与批次后修复

正式单元均保留固定分母，但只有 14 个实际进入模型修复。校准失败的单元没有错误 DUT 修复轨迹，不能算作模型失败，也不能为该组推断上下文收益。

| Task | Group | Status | API Calls |
| --- | --- | --- | --- |
| rising_edge | C | CALIBRATION_FAILED | 0 |

Vivado 临时目录消失引发了实时配额扫描的竞争条件。全部正式单元在原冻结代码下完成并由 campaign-end-audit.json 封存后，才对当前源码修复：仅忽略消失的临时子目录 ENOENT，保留根目录、权限、可信资产与终态清单的严格检查。没有重跑或替换失败单元。scan-race-before.json 保留修复前可重现失败，regression-postfix.json 保留修复后回归。post-campaign-fix.json 明确记录正式执行版本与当前交付源码的区别；该修复不冒充已经补齐 C 组真实实验。

## 模型或协议未完成单元

这些结果与宿主校准阻塞分别记录；输出截断不会执行不完整工具参数，也不自动重抽样或增加输出额度。

| Task | Group | Status | API Calls |
| --- | --- | --- | --- |
| signed_saturating_add | A | TIMEOUT | 2 |
| signed_saturating_add | C | OUTPUT_TRUNCATED | 2 |
| sequence_101 | C | OUTPUT_TRUNCATED | 1 |
| ready_valid_slot | A | OUTPUT_TRUNCATED | 3 |
| sequence_101 | B | OUTPUT_TRUNCATED | 1 |
