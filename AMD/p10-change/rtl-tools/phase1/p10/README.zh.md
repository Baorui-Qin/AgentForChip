---
description: "冻结 VerilogEval 选题，并在不调用模型的情况下预检原始评测器。"
kind: "package-reference"
---

# P10 评测器预检

[English](README.md) | 中文

## 摘要

P10 在消耗模型预算前，检查固定版本的本地 VerilogEval 评测器能否运行。它冻结按公开题面选出的十题及完整四十题扩展顺序，使用 Host 生成的纯端口转接模块测试未修改的 reference 和测试台。预检不是模型成绩，也不能授权候选导出。可评测题数为零时输出 NO-GO，模型两条路线和四十题 campaign 均保持未运行。

## 目录

- [Profile](#profile)
- [选题与身份](#selection-and-identity)
- [验证与报告](#verification-and-reports)
- [实现](#implementation)
- [模型体验](#model-experience)
- [已知限制与延后工作](#known-limitations-and-deferred-work)
- [开发说明](#dev-note)

<a id="profile"></a>
## Profile

[rtl-p10-preflight profile](../profiles/rtl-p10-preflight/cordis.patch.yml) 挂载子进程、会话投影及沙箱策略服务，不挂载模型服务。如果组合提供 LLM，预检插件会拒绝运行。唯一命令为 `preflight`，通过 dsh、此 profile 和完整的 Host overlay 启动。Profile overlay 替换整个插件配置，而不是合并其中字段。

Host 提供数据集、campaign、配置和冻结清单路径，以及有限的进程和产物限制。随附 profile 拒绝无隔离执行。明确获准的开发运行需要同时设置 `allowUnisolatedPreflight: true` 和完整访问策略。这些设置仅授权执行，不代表建立了 OS 隔离。Campaign 记录 `full_os_isolation_verified=false`。

<a id="selection-and-identity"></a>
## 选题与身份

数据集必须具有固定 NVlabs 来源、revision `c498220d0a52248f8e3fdffe279075215bde2da6`、干净工作树和 156 组 prompt/reference/test。每个资产均与 Git blob 核对，并记录原始字节 SHA-256。仅在 Git 明确声明 LF 转 CRLF 检出时，允许为 blob 身份比较转换换行；评测器字节和公开题面从不改写。其他内容变化会停止 campaign。

[选题规则](../../src/phase1/p10-dataset.ts) 仅为匹配折叠公开题面的空白和大小写，并按 task ID 顺序为各类别选择第一个尚未选中的任务。后续三十题按 `p10-verilogeval-v1:20260917:` 加 task ID 的 SHA-256 升序选取。选题先于 EDA。十题 manifest 使用独立哈希收据；selection-order.json 预先承诺四十项顺序，但不授权四十题运行。Prob038 是独立哨兵，不进入选题分母。

公开端口解析器支持命名 input/output 和常量数值位宽，包括位宽标注内部空白。不支持的声明会停止该题，不猜测接口。单个标量 clk 或 clock 输入对应 5 ns 真实时钟；没有此类输入时采用 5 ns 虚拟时钟。不支持多个已识别时钟。这是受限开发策略，不是官方 benchmark 时序配置。

<a id="verification-and-reports"></a>
## 验证与报告

Host 专用预检注册原始 reference/testbench 字节和纯 TopModule 到 RefModule 转接模块，复用普通 VerificationRunner 的 compile、elaborate、simulation，失败即停且不请求 synthesis。成功要求仿真完整结束、检查数为正且 mismatch 为零。即使预检成功，持久化记录仍未验证，不能成为四阶段候选 PASS。普通候选验证仍强制要求 synthesis。

报告区分 EVALUATOR_READY、TESTBENCH_COMPATIBILITY_BLOCKED、REFERENCE_COMPATIBILITY_BLOCKED、TOOL_ENVIRONMENT_BLOCKED 和 INCONCLUSIVE。原始诊断保留来源归因。不支持的公开接口记为 INCONCLUSIVE，没有 EDA 证据。JSON/CSV 结果、兼容性及错误分布表、轨迹索引和 GO/NO-GO 覆盖每个选中任务。没有模型派发时，模型状态为 NOT_RUN，逐路线 usage 为 null，空分母比例为 null 而非百分之零。

此入口从不自动启动模型或四十题 campaign。每个任务具有永久 claim，campaign 目录不可复用。执行前后核对源码/配置哈希和数据集身份。Harness 发生修改时需要单独冻结新 campaign，不合并结果。EDA manifest 在终态记录和日志关闭后生成；最终 campaign 归档还需要独立的完整文件大小及哈希审计。

<a id="implementation"></a>
## 实现

<details>
<summary>Host 专用实现</summary>

[p10-preflight.ts](../../src/phase1/p10-preflight.ts) 管理串行 campaign；[p10-dataset.ts](../../src/phase1/p10-dataset.ts) 管理确定性选题、公开接口和原始资产绑定；[p10-report.ts](../../src/phase1/p10-report.ts) 区分评测器结果和未运行的模型路线；[verification.ts](../../src/phase1/verification.ts) 与候选验证共享进程清理、诊断、配额和记录。核心 agent loop 和 HTTP 传输未修改。[决策记录](../../../.agents/notes/implemented/feature/2026-09-18-p10-evaluator-preflight.md) 说明预检边界。

</details>

<a id="model-experience"></a>
## 模型体验

此 profile 不提供任何模型可见工具或请求。Reference 转接模块和校准收据仅为 Host 证据。[P09](../p09/README.md) 描述另一个已有自主修复体验，但它的存在不能证明 P10 的生成或修复成绩。

<a id="known-limitations-and-deferred-work"></a>
## 已知限制与延后工作

已实现边界是评测器预检，而非模型对照 campaign。

- 此预检入口未实现 P10 裸 Baseline、外部共享候选修复绑定、格式恢复分支、P10 派发总账或公开任务属性技能过滤。
- 评测器通过本身不构成 GO。独立四十题 campaign 之前仍需要完整十题对照和强制审计。
- 测试台/reference 兼容性修改、本地模型、ROCm、断网部署、完整 OS 隔离和实现级时序收敛不属于本次验收范围。

<a id="dev-note"></a>
## 开发说明

真实运行结果、启动失败和版本专属审计位于独立验证目录。测试及生成的转接模块不能替代真实评测器执行或模型证据。
