import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const root = 'D:/AMD/p156-20260927-v3';
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const audit = await json(join(root, 'report/evidence-audit.json'));
assert.equal(audit.integrity_audit, 'PASS'); assert.equal(audit.state, 'COMPARISON_FINISHED');
assert.equal(audit.rows.length, 156); assert.equal(audit.summary.compared, 156);
const s = audit.summary, rows = audit.rows;
const calls = await json(join(root, 'report/call-index.json'));
const quotaCalls = calls.filter(c => c.transport?.http_status === 402 || c.model_status === 'QUOTA');
const quotaTasks = rows.filter(r => r.agent_status === 'QUOTA').map(r => r.task_id);
await writeFile(join(root, 'report/api-quota-blocks.json'), JSON.stringify({
  observed_http_status: 402, classification: 'QUOTA', tasks: quotaTasks,
  calls: quotaCalls.map(c => ({ task_id: c.task_id, directory: c.directory, request_sha256: c.request_sha256, transport: c.transport, model_status: c.model_status })),
  local_dispatch_cap_exhausted: s.physical_dispatches >= 20111,
  account_balance_read: false, retries_or_extra_budget_added: false,
  later_successful_request: '../compare-Prob149_ece241_2013_q4/models/run-iffcAo/transport.json',
  independent_supplement_authorized: true,
  interpretation: 'Service-side quota/payment rejection; no model answer received. Not an observed failure of model reasoning or exhaustion of the local campaign call cap. Exact account balance was not read. Full repair experiments for these tasks remain incomplete.'
}, null, 2) + '\n');
const results = await Promise.all(rows.map(row => json(join(root, `compare-${row.task_id}/result.json`))));
const toolEvents = (await readFile(join(root, 'analysis/tool-traces.jsonl'), 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse).filter(e => e.event === 'agent_tool');
const tools = {};
const rejections = {};
for (const event of toolEvents) {
  const stat = tools[event.selected_tool] ??= { selected: 0, accepted: 0, rejected: 0 };
  stat.selected++; stat[event.host_accepted ? 'accepted' : 'rejected']++;
  if (!event.host_accepted) {
    const reason = event.rejection_reason ?? 'UNSPECIFIED';
    rejections[reason] = (rejections[reason] ?? 0) + 1;
  }
}
const predeclared = new Set(['Prob093_ece241_2014_q3', 'Prob149_ece241_2013_q4']);
const exclusions = rows.filter(r => predeclared.has(r.task_id) || r.task_id === 'Prob062_bugs_mux2' || ['INCONCLUSIVE', 'TOOL_ERROR'].includes(r.baseline_status) || r.agent_status === 'QUOTA')
  .map(r => ({ task_id: r.task_id, reason: predeclared.has(r.task_id) ? 'predeclared_spec_reference_conflict' : r.task_id === 'Prob062_bugs_mux2' ? 'posthoc_mux_polarity_conflict' : r.agent_status === 'QUOTA' ? 'provider_quota_blocked_repair_incomplete' : r.baseline_status }));
const excluded = new Set(exclusions.map(r => r.task_id)), screened = rows.filter(r => !excluded.has(r.task_id));
const sensitivity = { label: 'Post-hoc sensitivity only; not a corrected primary score or proof that remaining references are valid.', exclusions,
  selected: screened.length, baseline_pass: screened.filter(r => r.baseline_status === 'PASS').length,
  agent_pass: screened.filter(r => r.agent_status === 'VERIFIED').length,
  repair_opportunities: screened.filter(r => r.repair_eligible).length, repaired: screened.filter(r => r.recovered_by_agent).length };
const stopped = rows.filter(r => r.agent_status !== 'VERIFIED');
const repaired = rows.filter(r => r.recovered_by_agent);
const rollbacks = results.flatMap(r => (r.revision_decisions ?? []).filter(d => d.rolled_back).map(d => ({ task_id: r.task_id, ...d })));
const summary = { ...s, tools, tool_rejections: rejections, posthoc_sensitivity: sensitivity, stopped: stopped.map(r => ({ task_id: r.task_id, baseline: r.baseline_status, agent: r.agent_status, rule: r.terminal_policy_rule })),
  provider_quota_blocked_tasks: quotaTasks, http_402_calls: quotaCalls.length,
  repaired_tasks: repaired.map(r => r.task_id), rolled_back_revisions: rollbacks.length, context_compactions: results.reduce((n, r) => n + (r.context_compactions ?? 0), 0) };
await writeFile(join(root, 'report/final-summary.json'), JSON.stringify(summary, null, 2) + '\n');
const rate = (n, d) => d ? `${n}/${d} (${(100 * n / d).toFixed(2)}%)` : 'N/A';
let md = `# RTL Agent Harness 156 题测试报告

生成时间：${new Date().toISOString()}。批次：\`p156-20260927-v3\`；源码提交：\`25828d28f1064c6d265aefcca4031641115bd62c\`。156 题均已生成并取得比较终态，不代表全部通过，也不代表所有题都完成了完整修复预算。

## 结论

本版 Harness 下，Baseline 的最终验收覆盖为 **${rate(s.baseline_pass, 156)}**，Agent 为 **${rate(s.agent_pass, 156)}**。这衡量冻结参考评测器及网表规则下的验收，不是已经独立证明的公开规格正确率，也不是等资源的 Agent 框架净贡献。

已确认的限制包括 Prob062 的选择极性冲突、预声明的 Prob093/149 题面与参考冲突、Prob053 的未知初态阻塞，以及 Prob058 的 Vivado 临时目录扫描故障。尤其不能把模型迁就错误参考后通过的案例包装成有效修复。

**API 配额阻塞：${quotaTasks.length} 题的修复阶段因服务端 HTTP 402 / QUOTA 中止，完整修复实验未完成。** 受影响题目为 ${quotaTasks.join('、') || '无'}。本地调用次数上限未耗尽，未查询账户余额，不将未收到模型答案的请求计作模型推理失败。没有自动充值、换用模型或追加预算。

本批后续正常请求已观察到 HTTP 200 和模型内容。用户已批准对这些 QUOTA 题追加独立续测；该续测从同一候选重建上下文并扣除已用额度，见 [独立续测报告](../../p156-20260928-quota-continuation-v1/report/report.zh.md)，不回写本批评分。

## 结果与预算

| 指标 | 结果 |
|---|---:|
| 候选生成 / 比较终态 | ${s.legal_candidates}/156 / ${s.compared}/156 |
| 首次调用合法 / 纠正后新增合法 | ${s.initial_attempt_legal} / ${s.recovered_candidates} |
| Baseline 最终验收 | ${rate(s.baseline_pass, 156)} |
| Agent 最终验收 | ${rate(s.agent_pass, 156)} |
| 已观察修复成功 / 触发修复题 | ${rate(s.repaired, s.repair_opportunities)} |
| API 配额阻塞题 / HTTP 402 调用 | ${quotaTasks.length} / ${quotaCalls.length} |
| 已接受 RTL 修改 | ${s.rtl_edits} |
| 本批模型调用 / 硬上限 | ${s.physical_dispatches} / 20111 |
| 含中断批次的总调用 / 总授权 | ${s.combined_physical_dispatches} / 20124 |
| 本批生成 / 修复调用 | ${s.generation_dispatches} / ${s.agent_dispatches} |
| 本批已知输入 / 输出 token | ${s.known_prompt_tokens} / ${s.known_completion_tokens} |
| 本批缺失 usage 的调用 | ${s.unknown_usage_calls} |
| 返回 reasoning 的调用 / 字节 | ${s.reasoning_returned_calls} / ${s.reasoning_bytes} |
| Provider token 上限 / 仅 reasoning 截断 | ${s.provider_max_tokens} / ${s.reasoning_only_truncations} |
| 版本回滚 / 上下文压缩次数 | ${rollbacks.length} / ${summary.context_compactions} |

生成阶段允许最多两次合法候选纠正，因此不是严格单调用 pass@1。Agent 额外获得反馈、技能、工具和修复预算。缺失 usage 不猜测费用；中断批次另有 4 次未知 usage，13 次尝试均已计入总预算。

## 实际工具活动

| 工具 | 选择次数 | 接受 | 拒绝 |
|---|---:|---:|---:|
${Object.entries(tools).map(([name, t]) => `| ${name} | ${t.selected} | ${t.accepted} | ${t.rejected} |`).join('\n')}

上表是 Agent 工具动作。Host 初始验证与 Agent 的 \`verify_rtl\` 触发记录分开，底层 xvlog/xelab/xsim/Vivado 命令在各 verification 的 commands/events 和原始日志中保留，不将 Host 自动执行冒称为模型主动调用。

工具拒绝原因：${Object.entries(rejections).map(([reason, count]) => `\`${reason}\` ${count} 次`).join('；') || '无'}。拒绝重复候选并不等于已经及时终止无效循环，应结合逐题调用数和终止规则检查。

## 未验收终态

| 题目 | Baseline | Agent | 策略规则 |
|---|---|---|---|
${stopped.map(r => `| ${r.task_id} | ${r.baseline_status} | ${r.agent_status} | ${r.terminal_policy_rule ?? '-'} |`).join('\n')}

\`TOOL_ERROR\`、\`INCONCLUSIVE\`、\`QUOTA\` 和策略阻塞不等于已确认的模型功能失败。Baseline 的功能失配与 Agent 未获 API 回复是不同事件。没有篡改这些终态以凑齐通过率；涉及配额阻塞的修复率是不完整观察，不可当作足额修复能力估计。

## 实验有效性

预声明只排除 Prob093/149 的辅助口径：Baseline ${rate(s.spec_conflict_screened.baseline_pass, s.spec_conflict_screened.selected)}，Agent ${rate(s.spec_conflict_screened.agent_pass, s.spec_conflict_screened.selected)}。该口径仍包括运行中新增发现的问题。

事后敏感性分析另排除 Prob062 选择极性冲突、所有 Baseline 为 INCONCLUSIVE/TOOL_ERROR 的题，以及 Agent 被 QUOTA 阻塞的题：Baseline ${rate(sensitivity.baseline_pass, sensitivity.selected)}，Agent ${rate(sensitivity.agent_pass, sensitivity.selected)}。这是明确标注的事后辅助统计，不替换主结果，不证明剩余题库完全正确，也会排除部分较难且尚未完成修复的题。排除名单和原因见 [JSON 汇总](final-summary.json)。

- [初态与 mux 极性问题](evaluator-limitations.json)：无模型参考泄漏，原始题面与隐藏参考均未修改。
- [临时目录故障及比较续跑](comparison-resumes.json)：只运行尚无比较结果的题，不覆盖既有失败、不重新生成答案、不增加预算。
- [API 配额阻塞明细](api-quota-blocks.json)：服务端 HTTP 402，无模型输出；后续 API 恢复已观察到，受影响题另行续测，原批次记录不覆盖。
- [网络故障与独立新批次](../restart-decision.json)：中断批次全部保留，新批次仅对实验进程设置 DeepSeek 域名直连，不改变系统代理或 TLS 校验。
- [运行条件观察](run-conditions.json)：Vivado 延迟存在明显波动，不能直接把总运行时间差异归因于模型或框架。

RTL 使用 \`p10-settled-rtl-1\`，最终验收要求 \`p10-netlist-1\`。正负校准与有限仿真不是形式等价，也不是独立的参考规格审计。\`full_os_isolation_verified=false\`。

## 审计资料

- [完整取证报告与逐题索引](report.zh.md)
- [156 行结果 CSV](task-results.csv)
- [完整模型请求、返回 reasoning/输出及工具参数 JSONL](../analysis/calls.jsonl)
- [Host 工具与验证轨迹 JSONL](../analysis/tool-traces.jsonl)
- [逐调用 token、延迟与工具索引](call-index.json)
- [证据审计](evidence-audit.json)；[最终完整性检查](final-integrity.json)；[完整文件哈希清单](../evidence-files.json)
- [中断批次的 13 次调用记录](../../p156-20260927-v2/analysis/calls.jsonl)

每题 \`analysis/<task>.md\` 包含完整请求、接口实际返回的 reasoning、输出和工具轨迹，\`*-revision-*.diff\` 对应接受修改的实际父版本。原始 model/EDA 目录保留规范化流、所有 RTL 版本、日志、VCD、综合网表与验收收据。不保存凭据，不声称记录接口未公开的内部思考；规范化流不是原始 HTTP/SSE 抓包。
`;
await writeFile(join(root, 'report/summary.zh.md'), md);
console.log(JSON.stringify(summary, null, 2));
