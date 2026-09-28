import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const root = 'D:/AMD/p156-20260928-final-report';
const prior = 'D:/AMD/p156-20260927-v2', primary = 'D:/AMD/p156-20260927-v3';
const extra = 'D:/AMD/p156-20260928-quota-continuation-v2';
const json = async p => JSON.parse(await readFile(p, 'utf8'));
const hash = b => createHash('sha256').update(b).digest('hex');
const original = await json(join(primary, 'report/final-summary.json'));
const supplementary = await json(join(extra, 'report/evidence-audit.json'));
const combined = await json(join(extra, 'report/combined-results.json'));
assert.equal(supplementary.integrity_audit, 'PASS');
assert.equal(supplementary.state, 'SUPPLEMENTAL_FINISHED');
assert.equal(combined.rows.length, 156);
assert.equal((await json(join(primary, 'report/final-integrity.json'))).status, 'PASS');
const batches = [];
for (const path of [prior, primary, extra]) {
  const calls = await json(join(path, 'report/call-index.json'));
  batches.push({ campaign: path.split('/').at(-1), root: path, calls,
    dispatched: calls.filter(c => c.dispatched).length,
    unknown_usage: calls.filter(c => c.dispatched && (c.prompt_tokens == null || c.completion_tokens == null)).length });
}
const index = batches.flatMap(b => b.calls.map(c => ({ campaign: b.campaign,
  full_records: join(b.root, 'analysis/calls.jsonl'), ...c })));
assert.equal(new Set(index.map(c => c.directory)).size, index.length);
const sent = index.filter(c => c.dispatched), known = sent.filter(c => c.prompt_tokens != null && c.completion_tokens != null);
assert.equal(sent.length, supplementary.summary.combined_dispatches);
assert.ok(sent.length <= 20124);
const tools = {};
for (const path of [primary, extra]) {
  const events = (await readFile(join(path, 'analysis/tool-traces.jsonl'), 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);
  for (const event of events.filter(e => e.event === 'agent_tool')) {
    const t = tools[event.selected_tool] ??= { accepted: 0, rejected: 0 };
    t[event.host_accepted ? 'accepted' : 'rejected']++;
  }
}
const summary = { original: { baseline_pass: original.baseline_pass, agent_pass: original.agent_pass, denominator: 156 },
  supplementary: supplementary.summary, physical_dispatches_all_batches: sent.length,
  known_prompt_tokens_all_batches: known.reduce((n, c) => n + c.prompt_tokens, 0),
  known_completion_tokens_all_batches: known.reduce((n, c) => n + c.completion_tokens, 0),
  unknown_usage_all_batches: sent.length - known.length,
  provider_reasoning_returned_calls: sent.filter(c => c.transcript.reasoning_status === 'returned').length,
  known_model_request_wall_ms_sum: sent.reduce((n, c) => n + (c.request_wall_ms ?? 0), 0),
  tools, batches: batches.map(({ calls, ...batch }) => batch) };
await mkdir(root);
await writeFile(join(root, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
await writeFile(join(root, 'model-call-index.jsonl'), index.map(c => JSON.stringify(c)).join('\n') + '\n');
await copyFile(join(extra, 'report/combined-results.csv'), join(root, 'task-results-156.csv'), 1);
const rate = n => `${n}/156 (${(n / 156 * 100).toFixed(2)}%)`;
const stopped = combined.rows.filter(r => r.agent_status !== 'VERIFIED');
const reasons = {
  Prob053_m2014_q4d: '公开题面未规定的已知初态要求导致 INCONCLUSIVE，非已确认模型功能错误',
  Prob058_alwaysblock2: 'Vivado 临时目录扫描 EPERM，TOOL_ERROR，未伪造为功能失败',
  Prob093_ece241_2014_q3: '已知题面/参考冲突；工具动作预算耗尽',
  Prob149_ece241_2013_q4: '已知题面/参考冲突；工具动作预算耗尽'
};
await writeFile(join(root, 'REPORT.zh.md'), `# RTL Agent Harness 156 题测试报告

生成时间：${new Date().toISOString()}。代码版本：\`25828d28f1064c6d265aefcca4031641115bd62c\`，分支 \`codex/rt01-netlist-acceptance\`。

## 结论

156 题已全部重新生成并取得原批终态；API 配额恢复后的两题独立续测也已取得终态并完成证据审计。完成测试不等于所有题通过。

| 口径 | 验收结果 |
|---|---:|
| 冻结原批 Baseline | ${rate(original.baseline_pass)} |
| 冻结原批 Agent | ${rate(original.agent_pass)} |
| 加入独立续测后的 Agent 验收覆盖 | ${rate(supplementary.summary.supplemental_acceptance_coverage)} |

原批评分不修改。续测从同一初始 RTL 重建上下文，扣除之前已用的请求、工具与修改额度，不能伪装成连续上下文的一次实验。以上是冻结参考评测器和网表规则下的验收覆盖，不是已经独立证明的公开规格正确率，也不是等资源的框架净贡献。

## 配额恢复续测

| 题目 | 原批终态 | 独立续测终态 | 新增模型调用 |
|---|---|---|---:|
${supplementary.rows.map(r => `| ${r.task_id} | QUOTA | ${r.agent_status} | ${r.model_calls} |`).join('\n')}

原候选不重新生成、不挑选新答案、不增加已授权总额。续测准备曾因遗漏 profile 在启动前失败，该目录及日志保留，新增 API 调用为 0。

## 未通过与有效性风险

| 题目 | 最新记录终态 | 说明 |
|---|---|---|
${stopped.map(r => `| ${r.task_id} | ${r.agent_status} | ${reasons[r.task_id] ?? '保留实际修复终态和完整调用轨迹；不以人工修改代替模型解题'} |`).join('\n')}

此外，Prob062 的隐藏参考选择极性与公开错误示例的修复方向相反。用户批准的是 8 位输出勘误，不是极性反转，因此其参考匹配成功不能直接当作有效规格修复。Prob093/149 为事先标记的冲突；新增发现与事后敏感性分析另行标注，不静默改变主评分。

原批 137 次调用仅输出 reasoning 后达到 token 上限；工具层拒绝了 77 次重复候选和 15 次已拒版本。系统有最终预算边界，但长循环仍显著浪费资源。正负校准和有限仿真也不构成形式等价证明，\`full_os_isolation_verified=false\`。

## 模型调用与工具

| 批次 | 实际调用 | 缺失 usage |
|---|---:|---:|
${batches.map(b => `| ${b.campaign} | ${b.dispatched} | ${b.unknown_usage} |`).join('\n')}
| 合计 | ${sent.length} / 20124 | ${summary.unknown_usage_all_batches} |

已知输入 token ${summary.known_prompt_tokens_all_batches}，输出 token ${summary.known_completion_tokens_all_batches}；${summary.provider_reasoning_returned_calls} 次调用返回 reasoning。缺少 usage 的请求不猜测费用。逐调用延迟保存在统一索引中；请求耗时总和不等于并发实验的实际墙钟时长。

| Agent 工具 | 接受 | 拒绝 |
|---|---:|---:|
${Object.entries(tools).map(([name, t]) => `| ${name} | ${t.accepted} | ${t.rejected} |`).join('\n')}

这里统计模型选择的工具，不把 Host 自动初始验证说成模型主动调用。底层 xvlog/xelab/xsim/Vivado 命令另保存在工具轨迹和原始 EDA 目录。

## 检查入口

- [156 题原批与续测并列表](task-results-156.csv)
- [跨批次逐调用统一索引](model-call-index.jsonl)：模型、请求哈希、调用目录、token、延迟、返回 reasoning 状态与工具名。
- [原始 156 题详细报告](${primary}/report/summary.zh.md)；[逐题完整解题记录](${primary}/report/report.zh.md)
- [独立续测报告](${extra}/report/report.zh.md)；[Prob133 只读反例分析](${extra}/report/host-observations.zh.md)
- [原批完整请求、reasoning、输出及工具参数](${primary}/analysis/calls.jsonl)；[续测完整模型调用](${extra}/analysis/calls.jsonl)；[网络中断批次调用](${prior}/analysis/calls.jsonl)
- [原批 Host 工具轨迹](${primary}/analysis/tool-traces.jsonl)；[续测 Host 工具轨迹](${extra}/analysis/tool-traces.jsonl)
- [原批最终完整性检查](${primary}/report/final-integrity.json)；[续测证据审计](${extra}/report/evidence-audit.json)
- [原批文件哈希清单](${primary}/evidence-files.json)；[续测文件哈希清单](${extra}/evidence-files.json)

每题分析文件保存完整 prompt、接口实际返回的 reasoning/response 和工具记录。RTL 各版本、相对实际父版本的 diff、已执行阶段的原始编译/仿真日志、VCD、综合报告、网表和验收收据均保留；未执行阶段明确为 skipped，不伪造记录。规范化流不是原始 HTTP/SSE 抓包。没有保存凭据，也不声称获取接口未公开的内部思考。

## 后续问题

P0：独立裁定并修复题面/参考冲突和初态要求，修复临时目录扫描的基础设施故障；保留本版全部历史成绩。

P1：为重复候选和重复被拒版本建立更早的终止规则，核对 reasoning 截断与强制动作路径，并补全全局 API 配额熔断。新的协议必须另开冻结实验，不能回填修改本轮得分。

P2：在等模型、等 token/调用/工具预算下另做框架消融；需要更强正确性结论时增加独立规格验证或形式验证。
`);
const outputs = ['REPORT.zh.md', 'summary.json', 'model-call-index.jsonl', 'task-results-156.csv'];
await writeFile(join(root, 'report-manifest.json'), JSON.stringify({ created_at: new Date().toISOString(),
  source_evidence: await Promise.all([join(primary, 'evidence-files.json'), join(extra, 'evidence-files.json'), join(prior, 'report/evidence-audit.json')]
    .map(async path => ({ path, sha256: hash(await readFile(path)) }))),
  outputs: await Promise.all(outputs.map(async path => ({ path, sha256: hash(await readFile(join(root, path))) }))) }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
