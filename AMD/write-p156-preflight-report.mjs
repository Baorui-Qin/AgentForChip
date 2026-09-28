import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
const root = 'D:/AMD/p156-20260927-v2', cal = 'D:/AMD/p156-20260927-settled-cal';
const result = JSON.parse(await readFile(join(cal, 'results.json'), 'utf8'));
const frozen = JSON.parse(await readFile(join(root, 'configuration-check.json'), 'utf8'));
const positiveChecks = result.rows.reduce((n, row) => n + row.positive.checks, 0);
await mkdir(join(root, 'report'), { recursive: true });
const status = { state: 'AWAITING_EXPLICIT_EXTERNAL_API_AUTHORIZATION', recorded_at: new Date().toISOString(),
  model_api_requests: 0, tasks: 156, calibrated: result.rows.filter(row => row.evaluable).length,
  positive_checks: positiveChecks, negative_checks: result.rows.reduce((n, row) => n + row.negative.checks, 0),
  code_commit: frozen.git_commit, freeze_sha256: frozen.freeze_sha256,
  blocked_reason: 'Automatic safety review rejected paid external DeepSeek execution without explicit current authorization naming the service, data transfer, fees and 20124-call ceiling.',
  next_action: 'Wait for explicit user authorization; do not bypass the review or treat calibration as model scores.' };
await writeFile(join(root, 'report/execution-status.json'), JSON.stringify(status, null, 2) + '\n');
let md = `# 156 题评测准备与无模型预检报告

## 当前状态

修复和预检完成；真实模型全量测试尚未启动，API 调用为 0。本报告不是 Baseline/Agent 成绩报告。自动安全审核要求用户明确确认 DeepSeek 服务、数据发送、实际费用及调用上限；执行未绕过该限制。

代码提交：\`${frozen.git_commit}\`，分支 \`codex/rt01-netlist-acceptance\`，本地已提交且未推送。冻结清单 SHA-256：\`${frozen.freeze_sha256}\`。新批次在独立目录中保存，历史批次未覆盖。

## 已完成验证

| 项目 | 结果 |
|---|---:|
| 启用网表检测规则 | 156/156 |
| 新 RTL 正例 | 156/156 通过 |
| 新 RTL 错误输出负例 | 156/156 被拒绝 |
| 正例检查数 | ${positiveChecks} |
| 负例检查数 | ${status.negative_checks} |
| 冻结输入校验 | 通过，717 个文件 |
| 归档源码与配置 | 67 个文件 |
| 相关单元测试 | 8 文件，95/95 |
| TypeScript、lint、Git diff 检查 | 通过 |
| 快速文档检查 | 16/16 |
| 全量文档检查 | 33/34，网站测试 Windows symlink EPERM |
| 实际模型请求、工具调用 | 0、0 |

RT-02 历史重放：正确 Prob078 实现完成 447 次检查、0 失配；曾被旧评测器接受的错误实现出现 216 次失配，被新评测器拒绝。缺少必检输出观察的攻击为 INCONCLUSIVE，未输出测试完成标记，不能 PASS。

RTL 协议为 \`p10-settled-rtl-1\`，与网表规则共用稳定采样、固定激励和比较逻辑，但移除 FPGA 专用 GSR 断言。最终成功仍必须通过四阶段验证和 \`p10-netlist-1\` 网表验收。

## 待授权实验配置

DeepSeek 官方 API \`https://api.deepseek.com\`，模型 \`deepseek-flash\`。全批硬上限 20124 次实际调用，并非预计量；每题最多 15 次接受的 RTL 修改、60 个工具动作、120 次修复请求。生成最多初次加两次合法候选纠正，不择优采样，故不是严格单调用 pass@1。两组共享同一初始候选和评测器，Agent 额外使用反馈、技能和修复预算。

编译和展开各 60 秒，RTL 仿真 120 秒，综合 600 秒，单次四阶段验证总计 900 秒，网表验收另限 120 秒。模型请求 120 秒，每题活动上限 8 小时；两个比较工作进程。临时防休眠只在实际批次运行期间申请，不修改永久电源设置。本轮因拦截尚未申请。

## 日志保留方案

实际运行后保留完整模型请求、接口实际返回的 reasoning/output、规范化流、token usage、请求延迟、工具选择及参数、Host 接受/拒绝与执行结果、修复轨迹、每版源码及相对实际父版本的 diff、编译/展开/仿真/综合日志、原始 VCD、综合网表和网表验收收据。归档不包含凭据、HTTP 头或接口未返回的内部思考；缺失 usage 不猜测。

冻结的 \`analyze.mjs\` 输出逐题 Markdown、完整调用 JSONL、工具轨迹 JSONL、调用索引、156 行 CSV 和中文报告。\`final-integrity.mjs\` 核对请求账本、源码快照、校准清单、文件哈希及临时电源请求释放。未运行时不生成虚假的模型结果。

## 实验有效性限制

- Prob031 的 q 为输出、Prob062 的 out 为 8 位输出，依据用户明确批准；原题面保留，两组收到相同公开说明。
- Prob093、Prob149 存在已知题面/参考冲突，继续实际运行并保留原始 156 题统计，同时给出预声明排除这两题的辅助统计，不能称参考匹配率为规格正确率。
- RTL 和网表共用参考 oracle，保持时序一致，但不形成独立参考证明；有限仿真不是形式等价。
- 不把跨评测版本分数变化直接归因于模型提升；Agent 额外资源不等于等资源框架净贡献。
- \`full_os_isolation_verified=false\`；文档网站的符号链接权限问题独立记录，未掩盖或改写失败。

## 证据入口

- [校准结果](../../p156-20260927-settled-cal/results.json)
- [校准完整文件清单](../../p156-20260927-settled-cal/calibration-evidence.json)
- [冻结配置](../campaign-freeze.json)
- [源码归档索引](../source-snapshot.json)
- [执行状态](execution-status.json)
- [已知规格冲突证据](../known-spec-conflicts.json)

## 逐题正负例

| 题目 | 可评测 | 正例检查 | 正例失配 | 负例检查 | 负例失配 |
|---|---|---:|---:|---:|---:|
`;
md += result.rows.map(row => `| ${row.task_id} | ${row.evaluable ? '是' : '否'} | ${row.positive.checks} | ${row.positive.mismatches} | ${row.negative.checks} | ${row.negative.mismatches} |`).join('\n') + '\n';
await writeFile(join(root, 'report/preflight.zh.md'), md);
process.stdout.write(JSON.stringify(status, null, 2) + '\n');
