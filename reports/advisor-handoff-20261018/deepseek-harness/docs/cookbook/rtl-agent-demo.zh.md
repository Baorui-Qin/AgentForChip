# RTL Agent 导师演示指南

English（历史路径：`rtl-agent-demo.md`，本包未收录） | 中文

## 演示目标

用约十二分钟展示一次真实、可审计的 RTL 修复和一次协议失败。以历史真实证据作为稳定的演示主线，新的模型运行单独进行。前置条件及源码归属见[统一入口](../../rtl-tools/agent-demo/README.zh.md)。

## 1. 打开主工程

```powershell
Set-Location D:\deepseek-harness
.\rtl-agent.ps1
.\rtl-agent.ps1 doctor
```

说明：“项目使用 DeepSeek Harness 服务，并增加 RTL 专用规划、受约束修改和 EDA 工作流。框架与模型提供方是两种选择。”文件检查不能证明模型在线或许可证可用。

## 2. 回顾成功修复

```powershell
.\rtl-agent.ps1 case
```

指出 `serial` 是固定标量输入。候选将 `bit_out^serial[4]` 改为 `bit_out^serial`，没有扩大公共接口。展示输出的初始与最终源码、四阶段状态、仿真检查次数、警告和证据路径。通过 `tool_trace` 和报告的日志索引查看实际模型规划及工具动作。

保留记录为 72 次仿真检查、零失配。明确说明终态 `NETLIST_NOT_CALIBRATED`。综合后 WNS 为正不代表其他时序警告消失，也不代表时序收敛。这是从人为设置的错误种子出发的修复，不是独立从规格生成。

## 3. 回顾失败案例

```powershell
.\rtl-agent.ps1 case -Task Probe205_packet_parity
```

展示原始终态和未改变的已验证源码。规划方向识别了过程赋值问题，但 ON 规划文字违反当前格式长度限制，因此未执行。区分协议失败与实际执行后的错误电路，不把未执行方案事后改算为成功。

## 4. 解释实验结论

打开 `case` 输出路径中的最终中文报告。八例结果为 ON 4/8、OFF 6/8 四阶段通过，没有证明 Skill 收益。OFF 仍有规划及工具框架，因此不是原始裸 Baseline。不要与采用不同协议的旧 156 题成绩混算。

## 5. 可选的新单题运行

先不调用模型或 EDA 地准备：

```powershell
.\rtl-agent.ps1 prepare
```

检查新输出目录中的 manifest、本地数据集和 profile；它们引用主工程及导入运行代码，不引用旧实验启动器。准备不等于执行或授权下一步。新的真实运行需要已就绪的固定模型回环服务或由用户管理的隧道，以及 Vivado 2026.1；启动器不会配置这些服务。

可选的无模型本地 EDA 排练会使用另外的新目录：

```powershell
.\rtl-agent.ps1 preflight -AllowUnisolatedDevelopment
```

只有在允许模型请求及无完整隔离的本地 EDA 后执行：

```powershell
.\rtl-agent.ps1 run -AllowModelRequests -AllowUnisolatedDevelopment
```

即使进程正常退出，也要查看新任务结果：流程完成不一定代表修复成功。模型或 EDA 失败及部分输出应保留。不要重跑历史实验脚本、覆盖旧结果、展示凭据，或把预录记录回顾说成现场推理。
