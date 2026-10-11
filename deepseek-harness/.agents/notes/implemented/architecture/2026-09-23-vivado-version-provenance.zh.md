# Agent Note: 配置化 Vivado 版本与实验来源

Status: implemented

[English](2026-09-23-vivado-version-provenance.md) | 中文

## Problem

执行检查和 evaluator 元数据中的固定版本可能误标新实验，也会阻止仅通过配置完成工具链迁移。历史日志和 hash 始终记录其原始环境。

## Decision

开发 YAML 是 Vivado 预期版本的配置来源。Doctor、verification 和 snapshot 使用该值；探测产物同时保留预期版本、实测版本、命令与进程证据。版本不一致的 evaluator 不能注册到当前运行配置。

兼容 identity 和 manifest 文件名由配置版本派生。校准先运行原始上游 testbench，再决定是否应用声明顺序规则；随后验证展开行为，再决定是否添加缺失 timescale 的默认值。静态转换不代表工具验证通过。[冻结套件决策](../bug-fix/2026-09-18-p10-full-compat-suite.zh.md)继续有效，因为不可变产物及正负例校准的理由仍然适用；本记录补充版本选择，不替代该理由。

## Alternatives considered

**替换所有旧版本字符串。** 拒绝，因为这会使历史实验来源记录失真。

**复制 manifest 并改名。** 拒绝，因为原始输入、转换、工具行为及 hash 都需要重新校准。

**更换配置中的 FPGA 使综合通过。** 拒绝，因为资源及时序结果与器件相关，这样无法验证同一基线。

## Consequences

Phase 2 配置采用 2026.1，Phase 1 产物保留 2025.2。原始回归日志携带采集元数据及 hash。即使仿真正常，缺少目标器件支持仍会阻止综合验收。本次迁移不发起模型请求、不实现知识库、不重构系统提示词。[验证报告](../../../../../docs/vivado-2026.1/report.md)记录已完成及受阻检查。
