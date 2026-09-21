# 第一阶段基础组件验收记录

日期：2026-09-14。范围仅为执行指南 A 批 P00/P01，不代表 P00-P11 完成。

2026-09-15 的 P02 → P04 → P03 Windows 开发链路见[独立分项验收](windows-development-acceptance.md)。下文保留为 P00/P01 历史记录，不代表当前开发链路状态。

## 已交付

- `D:/deepseek-harness/rtl-tools/src/phase1/`：doctor、四种版本化数据接口和追加式事件记录器。
- `D:/deepseek-harness/rtl-tools/phase1/`：开发配置、dsh 加载补丁、JSON 示例和双语说明。
- `D:/deepseek-harness/rtl-tools/tests/phase1.spec.ts`、`doctor.spec.ts`：数据校验、事件关联、未完成运行识别和环境故障注入测试。

## 验证结果

本轮 RTL 工具范围测试 78 项通过、4 项按配置跳过、0 项失败。跳过项为真实 Icarus 与真实 Vivado opt-in 测试；本轮没有把夹具输出当作真实工具或真实模型性能。TypeScript 类型检查、oxlint、3 对双语文档配对、6 份文档链接及 Agent Note 格式检查通过。未运行全仓库测试和完整 doc-sync。

真实 `dsh` 入口已执行，但 [doctor.json](doctor-FktD5b/doctor.json) 返回 `EDA_NOT_READY`。直接原因是 Harness 未提供完整文件沙箱执行保护；探测命令没有以无隔离方式重试。这不是已确认的 Vivado 安装错误，也不是完整 EDA 预检通过。实际模式见 [launch.json](doctor-FktD5b/launch.json)，仓库与源码哈希、配置及不可用环境事实见 [environment.lock.json](doctor-FktD5b/environment.lock.json)。

当前环境快照中无法观察到的 commit、工具版本、GPU、ROCm 与后端信息均保持 null 或未验证。仓库 HEAD 曾单独读取为 `c291e7961a515f6d7af9304e7fd1d257929aef26`；这条宿主读取不替代 doctor 中被策略拒绝的命令证据。

P01 的 JSON 示例、未知枚举和非法路径拒绝、Mock 请求到阶段结果的关联、顺序刷盘和 `INCOMPLETE` 识别已通过本地测试。尚无团队接口会签，也未接入真实本地模型和完整宿主验证循环。

## 验收结论

[结构化验收状态](acceptance.json) 将 G0、G1、G2 保持为未通过，官方环境为待取得镜像。已实现可测的 P00/P01 基础组件，P00 的完整本机预检仍受沙箱限制阻塞。

后续需先解决完整文件隔离，或获得仅对固定手写 counter 和环境查询的显式完整访问授权。后一种方式只能验证开发机 EDA 安装，不可用于模型生成 HDL，也不能签收 P03。随后按指南推进 P02/P03，再接入模型适配器；本轮不需要 API key。
