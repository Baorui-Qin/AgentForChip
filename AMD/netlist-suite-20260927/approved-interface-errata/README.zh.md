# 已批准的公开接口勘误及校准

日期：2026-09-27。用户明确确认两项解释；原始题面、参考实现和原始测试台均未修改。本目录不是模型实验，模型/API 调用数为 0。

## 接口解释

| 题目 | 原始冲突 | 获批解释 | 原始题面 SHA-256 |
|---|---|---|---|
| Prob031_dff | 题面要求 D 触发器，却把 q 列为 input | clk、d 为一位输入；q 为一位输出 | `6e6d5252b2dd621ee0ec83d679278bca5dc125a98a028546c90dd28fe46b662c` |
| Prob062_bugs_mux2 | 要求八位 mux，错误示例却声明一位 out | sel 为一位输入，a、b 为八位输入，out 为八位输出 | `5ad5285b165fa83ab78328347e819f6a0d99f3b3e10ef0a562f24520bc3390ee` |

[代码登记](D:/deepseek-harness/rtl-tools/src/phase1/p10-interface-errata.ts) 只对这两个题目及精确原始题面哈希生效，不从隐藏答案推导公开接口。原始公开解析器仍报告原题面的错误或矛盾，批准层单独生成有效接口。题面变化或哈希缺失会拒绝沿用批准。

新任务目录保留原始 spec，另存 public_interface_erratum。模型生成和 Agent 修复使用同一公开解释，记录在实际任务约束中；无密钥快照验证两条路径一致。参考实现和网表 oracle 不进入模型提示。旧冻结目录不会被自动改写或追溯评分。

## 真实 Vivado 结果

| 题目 | 参考 RTL/综合 | 正例网表 | 输出反相负例 |
|---|---|---|---|
| Prob031_dff | PASS | 240 checks / 0 mismatches，PASS | 240 checks / 240 mismatches，NETLIST_MISMATCH |
| Prob062_bugs_mux2 | PASS | 226 checks / 0 mismatches，PASS | 226 checks / 226 mismatches，NETLIST_MISMATCH |

[冻结清单](freeze.json) 绑定原始目录和独立生成的 [有效目录](effective-catalog.json)。[结果](results.json) 记录两题 CALIBRATED、freeze_verified=true、interrupted=false。每题 positive/negative 目录保留 acceptance.json、原始命令和仿真日志；eda 目录保留编译、仿真和综合产物。

[发布检查](publication-check.json) 记录安装前比对：原有 151 条规则及证据不变，当前代码重建 153 条派生规则全部匹配，新加载的完整数据集目录与冻结有效目录一致。安装后的选择器检查确认 156/156 可选，仓库文件与发布文件逐字节相同。发布 SHA-256 为 `2294bed4969f65889bda86d416b085c301b84471aaeb20b4bff32607cad769f5`。

本轮 7 个定向测试文件共 98 个测试通过，TypeScript、lint、快速文档 16/16 通过。完整文档校验 33/34；唯一失败仍为 Windows 创建符号链接时 EPERM，详见 [doc-sync.log](doc-sync.log)。未修改无关测试绕过该失败。

## 限制

156/156 指已启用网表验收规则，不是 156 道模型答题成功。有限功能仿真不是形式等价证明，输出反相负例也不代表完备变异覆盖。RT-02 旧 RTL 测试台竞争仍未修复；旧兼容性预检不能直接作为这两题已通过所有前置环节的证据。新模型比较必须重新预检并冻结，不能修改旧批次继续计分。本轮改动尚未另建 Git 提交。
