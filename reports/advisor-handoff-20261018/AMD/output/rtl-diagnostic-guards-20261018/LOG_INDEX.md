# 本轮日志与复核入口

根目录：`D:/AMD/output/rtl-diagnostic-guards-20261018`。独立源码：`D:/AMD/workspaces/rtl-diagnostic-guards-20261018`。所有原始请求、模型输出、工具调用及失败记录保留，不更新封存交接包。

## 先读结论

- [中文报告](REPORT.zh.md)：结果、预算、限制和保全。
- [逐题失效分析](FAILURE_ANALYSIS.zh.md)：区分诊断、格式、约束和环境问题，包含重点题原始输出直达链接。
- [结果汇总](summary.json)、[同期对照](comparison.csv)、[逐题阶段 CSV](tasks.csv)。
- [结论适用范围](PROMOTION_DECISION.json)：本轮不是 skill 增益证明，也不是全部修复。

## 模型输出与请求

- [42 个题目模型输出索引](model-output-index.json)：定位规划器及编码器的原始文件。
- [题目调用索引](call-index.json)、[调用 CSV](calls.csv)：关联 arm、题目、模型、请求哈希、HTTP 和输出路径。
- [探针 17 次调用与 6 个控制结果](capability-audit.json)：包括失败，不另挑成功重试。
- [HTTP/模型错误索引](model-errors.json)：本轮题目模型错误为 0，不表示规划内容正确。
- [原生 token 计数索引](token-counter-index.json)：238 条题目计数记录，不是推理次数。

`campaign/http/<id>/` 和 `campaign/capability/http/<id>/` 保留原始 `request.json`、传输记录及响应；各模型目录保留 `output.txt`、`reasoning.txt`、`transcript.json`、`stream.jsonl`、`prompt-final.json`、`transport.json` 和原始 `run.json`。以索引中实际文件路径为准。没有把 reasoning 输出伪称为完整隐藏思维链。

## 规划、工具与候选

- [21 次题目规划索引](planner-validation-index.json)：规划是否通过、是否恢复及约束回执。
- [题目加探针的逐字段格式复核](plan-format-review.json)：30 次规划；区分长度/换行拒绝和实际约束违规。该文件是事后审计，不代表模型当时收到逐字段格式反馈。
- [技能可达性和请求投影](skill-usage-audit.json)：新 skill 出现在 17 个题目请求；OFF 技能数为 0，旧六项未变。
- [规划与编辑重算](guarded-output-audit.json)：九个编码器编辑均可由模型原始参数准确重算，无 Host 答案替换。
- [规划器/编码器证据](planner-coder-evidence.json)、[语义修改索引](semantic-repair-evidence.json)。
- [三次真实工具拒绝](tool-rejections.json)、[拒绝后恢复核验](recovery-effectiveness.json)。
- [失败分类及首个实际 EDA 错误](failure-reasons.json)。

每题 `campaign/arms/<on|off>/compare-<task>/result.json` 为任务终态，`models/` 为编码调用，`plans/<task>/.../` 为规划调用，`eda/run-*/` 包含该版本的 snapshot、四阶段日志与结果，`acceptance-*/` 为额外网表验收结果。不能只看最终 terminal 就遗漏已通过的阶段，也不能只看模型自述判定成功。

## 复现输入与预算

- [七题及执行顺序](campaign/manifest-7.json)、[冻结文件哈希](campaign/campaign-freeze.json)。
- [独立本轮预算](../../workspaces/rtl-diagnostic-guards-20261018/campaign-budget.json)：每侧 100 派发、60 分钟，实际 ON 30/OFF 29；没有延长前轮期限。
- [相邻前轮比较](previous-vs-current.json)：只作历史参考，不能隔离因果。
- [历史生成尝试索引](imported-generation-attempts.csv)：七题初始来源，当前生成调用为 0。

## 测试与环境

- [90 项 Harness 测试](unit-loop-pass.log)、[19 项约束测试](unit-guards-complete.log)，合计 109，通过中含 24 项新增。
- [本版类型检查](typecheck-final.log)、[前版类型检查](typecheck-previous.log)：70 条既存依赖诊断，逐字节相同，非全量通过。
- [网表环境审计](netlist-environment-audit.json)：2026.1/2025.2 三项库哈希不匹配，不计正式比赛通过。
- [semantic 控制日志](semantic-driver.log)、[preflight 控制日志](preflight-driver.log)、[模型运行日志](diagnostic-driver.log)。

较早的测试运行失败日志 `unit-loop.log`、`unit-loop-host.log`、`unit-loop-ready.log`、`unit-loop-final.log` 原样保留。分别涉及沙箱 Vite 缓存权限、缺少新测试目录、技能选择断言更新、测试夹具及提前规划拒绝的终态收尾问题；最终修正后的结果在上述 pass 日志，不把早期失败删除或伪改为通过。Python skill 校验器缺 PyYAML，使用已有 js-yaml 的本地校验替代，没有联网安装依赖。

## 收尾与保全

- [日志绑定审计](log-audit.json)：389 个冻结文件、42 次题目输出、14 个任务结果、请求及候选哈希均关联。原始模型 `RUNNING` 字段未重写，以任务结果、完整 HTTP/SSE、驱动退出回执判定完成。
- [SSH/隧道清理回执](cleanup.json)、[进程与端口复核](post-run-checks.json)。
- [原工程/题库/封存包保全](preservation.json)、[额外 8557 个历史文件保全](additional-history-preservation.json)。其他七个历史轮次各有 `*-round-preservation.json`，均未变化。
- [最终证据核验](delivery-verification.json)：验证冻结、预算、请求、测试、引用文件及保全，不声称三个重点题已修复。
