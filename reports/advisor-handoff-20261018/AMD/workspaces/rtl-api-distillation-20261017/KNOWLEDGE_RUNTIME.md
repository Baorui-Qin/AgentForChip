# Knowledge Runtime

本入口只用于独立教师 Agent 开发联跑，不是原始 Baseline。旧运行、原 Harness、原题库和既有 skill 文件未被改写。

## 两种图谱

- 开发溯源图：`D:/AMD/output/rtl-api-distillation-20261017/agent-04/knowledge/published-graph.json`。含题目与开发证据，只供开发者审查，不加载给求解模型。
- 运行时图：每个新运行的 `knowledge-runtime/runtime-graph.json`，结构为 `symptom -> rule -> skill`。旧付费快照为 44 规则/91 节点/88 边；本轮审查后发布版本为 45 规则/93 节点/90 边。规则保留证据局限，不升级为已证明正确。

`knowledge-runtime/prepare.mjs` 冻结三份 skill、规则目录和加载器源码，生成 SHA-256 清单。清单 hash 固定在该次原生 Harness profile 中。图中没有题号、历史候选、私有测试或开发证据本地路径；完整溯源索引只在不发送给模型的 manifest 中。

## 实际加载路径

1. `agent-v2/launch.py prepare` 为新开发运行默认挂载 skill registry、隔离文件系统 provider 和检索插件。已有冻结 profile 不自动迁移，原始 Baseline 不加载这些组件。
2. 首次请求加入一个原生 `user/message` 检索入口，同时暴露 `lookup_knowledge(query)`。可用中英文短语或规则 ID；受控词项匹配允许修饰词及有限词形变化，仍不声称具备任意语义匹配能力。
3. 已确认同 hash 写回自动检索 H03。指定真实工具的错误反馈检索 H04；同源码、同配置的冻结测试与独立诊断结论分歧检索 H09/R-CONTRACT；结果内源码 hash 不一致检索 R-FRESH。这是提示检查原因，不是自动判定 DUT 或评测错误。
4. 检索沿图的边解析到对应 skill，通过原生 `ctx.skills.get` 加载入口，只附上命中的规则。单次最多 3 条、24,000 字符。消息通过工具 deferred context / post-execute additional context 写入原生会话，再进入本来就允许发生的下一次模型请求。
5. 按 Agent 隔离去重。未命中明确返回 `no_match`，不强凑规则；日志中的命令不作为自动触发权限。skill 不增加读写、外发、预算或取消能力。
6. 新计划标记 `knowledge_runtime_required: true`。模型适配器在外发前检查检索工具和入口消息；缺失即阻止请求。它不会为检索额外发起付费调用。

每次检索记录会话、触发来源、命中/去重、子图规则、skill 与目录 hash、精确注入文本 hash。`retrieval/retrieval.jsonl` 的 `context_prepared` 仅表示准备了上下文；是否真正发送必须与原生 session 和请求关联，不能仅看该记录就声称模型已收到。

## 无密钥结构验证

无密钥脚本模型驱动真实 dsh CLI 和原生 Agent loop，验证自动检索、手动 CDC 检索、未命中、重复命中、会话隔离、工具错误、证据冲突、证据过期、不可信日志及关闭检索对照。逐字核对选中内容进入原生 `user/message` 和下一次适配器请求。脚本模型不是教师 API，不运行 EDA。

运行离线检查：

```powershell
node D:/AMD/workspaces/rtl-api-distillation-20261017/knowledge-runtime/test-core.mjs <新的单元测试输出目录>
& 'C:/Users/qbr/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' -B D:/AMD/workspaces/rtl-api-distillation-20261017/knowledge-runtime/keyless.py --out <新的原生测试输出目录>
```

关闭检索对照追加 `--disabled`，输出目录名须以 `disabled` 结束。原生 CLI 的符号链接创建在受限沙箱中可能需要审批；这不需要 API 密钥。

## 真实 API 联跑：2026-10-17

已运行 `agent-knowledge-01`，不再只有无密钥测试。见 完整报告（历史路径：`D:/AMD/output/rtl-api-distillation-20261017/agent-knowledge-01/RUN_REPORT.md`，本包未收录） 和 独立审查（历史路径：`D:/AMD/output/rtl-api-distillation-20261017/agent-knowledge-01/knowledge-use-review.json`，本包未收录）。本轮复用 `agent-04` 已有候选，明确指示先检索，是有引导的知识使用测试，不是自发使用或配对增益实验。

- 88 次真实 DeepSeek API 请求，574,181 tokens，无自动重试；7 个任务正常结束，5 个受单题上限/总预算预留限制未完成。
- 49 次模型主动检索，1 次自动触发；10 份上下文进入原生会话，其中 9 份已进入实际 API 请求。检索准备不等于模型接收。
- Q035、Q041 有可核对的规则相关检查与真实复验；没有新的 DUT 修改，不能报告新修复或 skill 收益。
- 暴露了自然查询漏召回、truncation 错义匹配、重复检索无进展、Q083 诊断假通过、Q073/Q114 总结虚报本轮修改等问题。原始证据保留，未在运行中悄悄更改规则或结果。

真实轨迹图和 12 份逐题记录见 knowledge-use-audit（历史路径：`D:/AMD/output/rtl-api-distillation-20261017/agent-knowledge-01/knowledge-use-audit`，本包未收录）。604 项证据完整性检查通过，不代表 604 项行为正确性验证。当前结论是检索/送达链路已实证，但可靠知识辅助纠错尚未确认。

**边界：**当前无上下文压缩插件；若后续删去已加载消息，需要同时重新准入检索入口与相关规则。缺入口会阻止外发，而不会静默退化。未覆盖的症状依赖模型主动检索或普通诊断；尚无修复收益或小模型配对增益结论。运输/预算在下一步前已经终止时，不会为了加载规则强行续发请求。本轮统一了单题预算读取和复跑预算根目录，但没有修复无进展取消、诊断失败传播或剩余 RTL 缺陷。

## 原始错误起点的后续修复与重跑

上述 `agent-knowledge-01` 的限制是当时结论。随后按用户要求修复了检索路由、无进展 pre-step 终止、公开诊断失败传播和操作 ID 绑定的总结接口，并执行 `agent-knowledge-02` 与共享剩余预算的 `agent-knowledge-03`。

两次合计 84 次真实请求、574,854 tokens；真实 EDA 25 次。Q073 是独立审查接受的有限新修复；Q114 有真实 DUT 修复但诊断约束不足；Q010 是新生成正例。其余未完成或证据有限者不算成功。详见 原始错误重跑报告（历史路径：`D:/AMD/output/rtl-api-distillation-20261017/agent-knowledge-02/RUN_REPORT.md`，本包未收录）。

新发布的 skill 与运行时图（历史路径：`D:/AMD/output/rtl-api-distillation-20261017/agent-knowledge-02/published-knowledge`，本包未收录） 以及 审查溯源图（历史路径：`D:/AMD/output/rtl-api-distillation-20261017/agent-knowledge-02/reviewed-knowledge/graph.json`，本包未收录） 均有证据和 hash；新规则修订在付费运行结束后发布，不能回称已在这些运行中加载或证明收益。原生结束状态、宿主总结接收、最终测试与独立知识采用判定仍分别保留。

## 五条路径追加授权重跑

`agent-knowledge-04` 使用独立授权上限 80 次请求、900,000 tokens，实际 46 次、376,483 tokens，无自动重试。真实 EDA 共 29 次，包含模型调用 16 次、开发者补验 6 次和运行前回归 7 次。详见 [本轮报告](../../output/rtl-api-distillation-20261017/agent-knowledge-04/RUN_REPORT.md)。

分题预算、原样写回计数不被读取清零、接收总结后的写入拒绝已落地并回归。Q155 完成本轮实际 API 修复及最终验证，原总结错误描述另行纠正。Q193/Q114/Q083 的最终 RTL 有本轮真实验证及独立合规诊断，但不能把开发者修正测试台算作 Agent 自主闭环。Q123 的容量不足已独立复现，仍未修复。Q083 最后请求因单题保守 token 预留不足未发送，没有借用其他题额度。

当前发布 46 条规则与运行时图（历史路径：`D:/AMD/output/rtl-api-distillation-20261017/agent-knowledge-04/published-knowledge`，本包未收录） 及 [541 节点审查图](../../output/rtl-api-distillation-20261017/agent-knowledge-04/reviewed-knowledge/graph.json)。新增 T-021 路由通用时钟握手测试问题；运行后修订通过本地检索回归，尚未再次调用 API 重测。检索送达已实证，可靠采用仍不能保证；不要从加载、引用或单次验证推断因果收益。
