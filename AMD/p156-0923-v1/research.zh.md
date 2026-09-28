# 本次修补参考与证据边界

## 候选和工具恢复

- [DeepSeek Thinking Mode](https://api-docs.deepseek.com/guides/thinking_mode/)：工具历史需要按思考模式要求保留返回的 reasoning；关闭思考的行动回合不应伪造 reasoning 后重放。本项目保留实际返回文本及 Host 工具结果。
- [DeepSeek JSON Output](https://api-docs.deepseek.com/guides/json_mode/)：结构化输出并不保证非空输出，因此不把换成 JSON 视为非法候选的充分修复。
- [SWE-agent Agent 实现](https://github.com/SWE-agent/SWE-agent/blob/main/sweagent/agent/agents.py)：格式/动作错误采用有界纠正，失败轨迹保留。这里借鉴“独立有界纠正 + 明确拒绝反馈”，未直接导入代码或新增依赖。
- [smolagents Agent 实现](https://github.com/huggingface/smolagents/blob/main/src/smolagents/agents.py)：记录动作错误和有界步骤。这里不声称该项目能直接解决 RTL 功能正确性。

## 题库缺陷

- [NVlabs VerilogEval Issue #13](https://github.com/NVlabs/verilog-eval/issues/13)：上游已有 Prob099 输出端口命名不一致的报告。本地固定版本的接口为 Y1/Y3，而测试台使用 Y2/Y4；本次校准确认编译/展开失败。
- [NVlabs VerilogEval Issue #21](https://github.com/NVlabs/verilog-eval/issues/21)：上游报告 Prob082、Prob141、Prob156 即使用参考实现也会触发 TIMEOUT。本地读取确认测试台的 `#1000000` 截止早于部分刺激序列完成；这不是 Vivado 综合的十分钟墙钟上限。Prob156 本次另被既有兼容转换的人工审核门控拦住，不能冒称已在本批次复现其运行超时。
- [NVlabs VerilogEval Issue #9](https://github.com/NVlabs/verilog-eval/issues/9)：上游讨论 `tb_mismatch` 使用前声明问题。本项目既有兼容层只移动已审核的完整声明行，不改变刺激、比较表达式或结果判定；不直接采用宽泛正则改写整个题库。
- [NVlabs VerilogEval Issue #8](https://github.com/NVlabs/verilog-eval/issues/8)：讨论参考初始化与公开需求不一致。它支持把初始化要求纳入题库质量审查，不证明所有初始化修复都是无效增益。

## 本地直接确认

Prob031 的公开接口将 q 写为 input；参考包装正例产生“assignment to input q”警告及 120/121 次失配。因此此前仅推测层级/调度影响是不充分的，应首先归因于接口冲突。本次不擅自把它改成 output。

Prob002 的公开需求是恒零输出。旧恒零“负例”没有故障，本次将负例改为恒一，未改题面、参考、测试台或计分规则。

上游 issue 是独立佐证，不替代本地原始日志。没有拉取或合并新题库版本，也没有将参考 RTL、上述 Host 分析或隐藏测试代码发送给生成模型。
