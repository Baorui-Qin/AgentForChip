# Agent Note: 修复资格、有界流审计与提供方用量

Status: implemented

[English](2026-10-09-p3-production-continuity.md) | 中文

## 问题

修复提案需要当前 DUT 证据，不能把解析器的保守标记当作执行权限。流消费者也需要有界公开审计，同时保留完整归档，并区分语义拒绝、传输完成和提供方用量。这些决策影响不同事实，必须能够独立观察。

## 决策

[修复策略](../../../../rtl-tools/src/phase1/repair-policy.ts)与修订比较共享同一个纯判定函数，用于完整且正常执行的 DUT `VRFC 10-3818` 展开失败。该函数要求精确冲突文本、非空调用标识、明确 DUT 归属和独立的当前 DUT 来源绑定。[诊断加载](../../../../rtl-tools/src/phase1/repair-diagnostics.ts)仅在 manifest 所列文件哈希均验证通过、其中唯一 DUT 与记录的最终源码哈希一致，且非版本探测编译调用的实际 DUT 输入非空并全部匹配该源码时建立绑定。判定函数使用绑定工作目录解析每条 primary 诊断的当前文件，再将其规范路径与绑定 DUT 路径比较。绑定缺失或不一致、陈旧 DUT 归属标签均不能授予资格。它只接纳与合格冲突属于同次调用、精确且无定位信息的 `XSIM 43-3322` 汇总。原始 `repairable_by_model` 保持 false；未通过判定的 driver 情况不能进入通用资格分支。提案批准与源码执行仍各有责任所有者。

[StreamAudit](../../../../rtl-tools/src/phase1/stream-audit.ts)增量维护有界公开投影。受管动作写入器将其 `chunks` 与元数据发布到 `stream-audit.json`；已接收的完整规范化归档仍保留在 `stream.json` 和 `stream.jsonl`。紧凑数组的精确 UTF-8 计数包括方括号、逗号与转义。动作使用不取整的 `maxEventBytes / 2`，并为用量与 finish 预留 4096 字节。普通 chunk 超限后关闭已保留的普通前缀，整块省略后续普通 chunk，不持有其正文。关键元数据超限时记录 `AUDIT_METADATA_LIMIT`、false 的 `terminal_metadata_preserved` 和省略计数；不产生语义 `OUTPUT_TRUNCATED`。归档与投影复用同一个 finish 错误规范化函数。

[提供方用量](../../../../rtl-tools/src/phase1/provider-usage.ts)独立于接纳内容校验已观察的规范化计数。它报告已返回、提供方未返回、宿主观察未完成或不可解析四类用量；不可用计数为 null。宿主观察未完成不证明提供方发送过未读取的计数。输入和互不重叠的缓存桶只计入 Prompt 一次；reasoning 已包含在输出中。计数必须是非负安全整数，且提供方给出的总量必须精确，合法零值也被接纳。不累加相同规范化样本；冲突与非法样本保持明确。遥测记录样本来源与迭代器实际耗尽；已收到的有效用量在后续中断后仍保留。这些新增公开观察字段保持原记录 schema，不追溯分类历史记录。

[DeepSeek 转换器](../../../../packages/llm/llm-deepseek/src/translate.ts)仅在实际观察到 `[DONE]` 并发出此前用量记录后设置可选的 `providerProtocolComplete=true`。遥测在公开的 `provider_protocol_complete` 与 `provider_protocol_completion_source` 中保留这项独立事实；观察到该标记时，来源为 `normalized-provider-stream-marker`。错误码与 Runtime 迭代器正常耗尽均不能区分已完成的提供方空响应和本地生成的无 body `EMPTY_RESPONSE`。显式标记允许将已完成但没有用量的提供方错误分类为“提供方未返回”；没有标记的本地错误仍属“宿主观察未完成”。标记缺失本身不提供协议完整结束的证据，语义拒绝或后续取消也不会抹去已观察的完成事实或有效用量。脱敏归档和有界审计仅在原 finish 字段旁保留允许公开的标记；请求选择、重试和全部预算保持不变。

[动作 drain](../../../../rtl-tools/src/phase1/p09-action-call.ts)使用同一迭代器向归档、审计、遥测和语义组装提供数据。首次语义字节超限会锁定 `OUTPUT_TRUNCATED` 与 null message，停止组装，并在原 controller、signal 和计时器下继续观察元数据。内容 finish 不证明 EOF。后续传输或提供方错误不能替换首个语义错误；独立终态与持久化事实仍可观察。提供方必须在原 signal 中止时结算待完成读取。认证、安全拒绝和用户取消仍立即终止。此 drain 不增加宽限、派发、重试或脱离所有者的读取任务。

## 考虑过的替代方案

**通过原始标记或宽泛诊断类别授予资格。** 拒绝，因为这样会让不完整、归属错误或不同调用的错误授予修复权限。纯判定函数保留保守解析，并在策略与修订排名中要求当前证据。

**裁剪完整归档，或缓存所有审计正文直到 finish。** 拒绝，因为裁剪会丢失证据，延后裁剪会使投影内存无界。增量整块省略只保留允许公开的正文，并明确标识关键元数据缺失。

**估算用量、用零替代缺失或累加重复样本。** 拒绝，因为这些做法会编造提供方用量，或重复计数同次调用。分类只描述在规范化提供方接口观察到的样本。

**语义超限后立即停止，或新建元数据观察窗口。** 拒绝，因为立即停止可能丢失终态用量，新窗口则改变请求预算。单个可取消迭代器保留语义上限，并在原 deadline 内观察元数据。

## 影响

需要有界 chunk 的读取者使用独立审计文件，并依据其省略元数据判断完整性。完整归档保留每个已收到的规范化 chunk 及原有存储成本；投影不宣称整次调用内存有界。审计失败、语义失败、传输失败与用量可用性可以同时存在。内容 finish 本身不足以支持“提供方未返回用量”的分类；待完成读取在预算内结算仍依赖提供方遵守取消要求。[Phase 1 README](../../../../rtl-tools/phase1/README.zh.md)负责消费者指导；原修复审批、时间预算、Job/Scope 所有权、Skill 默认值和 G2 判据保持不变。

## 验证

聚焦生产检查定义在 [driver 测试](../../../../rtl-tools/tests/multiple-driver.spec.ts)、[driver replay](../../../../rtl-tools/tests/multiple-driver-replay.spec.ts)、[流审计测试](../../../../rtl-tools/tests/stream-audit.spec.ts)、[用量分类](../../../../rtl-tools/tests/provider-usage.spec.ts)、[遥测用量](../../../../rtl-tools/tests/model-observation-provider-usage.spec.ts)、[动作用量](../../../../rtl-tools/tests/provider-accounting.spec.ts)和[实际适配器协议完成](../../../../rtl-tools/tests/provider-protocol-completion.spec.ts)中。离线 `contracts-v3` 运行记录 107 PASS / 0 FAIL，包含同批次通过的全部 39 项原能力测试身份。该结果产生于收紧当前 DUT 来源绑定之前。最终候选、双语文档和完整 G1 仍等待 root agent 串行验收；该结果不代表最终验收或真实 Provider 证据。
