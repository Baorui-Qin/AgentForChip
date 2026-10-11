# P4–P6 可选源码覆盖包（tool-skill_v1）

此目录交付已实现、已完成本地工程验证的独立候选源码和有限来源资产。主 tool-skill 功能包保持当前主 Runtime；不会因下载、解压或发布本目录而自动加载候选、启用 Skill 或晋升 P4–P6。

## 内容和来源

`overlay/deepseek-harness/rtl-tools/` 只包含 9 个发生候选变化的 TypeScript 源文件。`assets/` 包含工程知识和多 Skill 的 6 个条目/清单文件。`evidence/` 只含加载器要求的 5 个既有公开来源 JSON：两份历史 EDA 结果、一个 AMD 文档作者摘要、两份离线契约测试收据。所有来源文件保留原字节及 hash；历史 EDA 和离线测试均不是本次新真实运行或模型效果证明。历史结果内部保留的原机器路径仅是历史记录，不是执行配置。

有效候选为 `phase6-agent-entry-effective-runtime-v1`；既有完整 G1 结果为 1054 PASS / 0 FAIL / 18 SKIP，旧覆盖 39/39。本次包装没有重新运行候选、构建、执行测试或真实请求；新的可移植配置也不是原冻结配置身份。

## 在独立工作副本中使用

1. 保留原主工作目录。另建独立副本，以发布的 tool-skill 主源码和依赖为基础；先核对发布清单内 `compatible_base_source_bindings` 的 78 个相同基础源码 hash。仅在该独立副本中，将 `overlay/` 的 9 个文件按其相对目录复制到对应位置。不要把候选中的临时 package.json 或带机器绝对路径的 tsconfig 复制过去。
2. 使用原 workspace 的依赖、包配置和构建方式。候选并非独立 npm 包，不能在 `optional/` 中直接 npm install 或作为完整 Agent 启动。使用源 TypeScript 的加载或构建入口依照原 workspace 配置。覆盖后的入口导入关系仍在同一 rtl-tools 目录内。
3. 从发行包生成 `assets/agent-guidance.portable.example.json`，使用随选择清单给出的 `portable_profile` 精确对象。其知识和 Skill `file` 相对该配置目录；两处 `evidence_root` 必须为 `../evidence`。保留整个有限 evidence 路径层级，因此条目的既有相对引用和 SHA 无须改变。
4. 新配置与资产路径由读取器相对配置目录解析，不需要 F:/FPGA。启用时设置 Host 的 `agentGuidanceFile` 为实际配置文件，`agentGuidanceSha256` 为该文件 UTF-8 实际字节的 SHA-256。可以用 PowerShell `Get-FileHash -LiteralPath <配置路径> -Algorithm SHA256` 得到 hash。配置文件内容或换行变化后应重新计算，不能沿用历史冻结配置的摘要。
5. 仅已有自动 RepairWorkflow，及 P10 compare、repair-control、repair-seed 修复入口接受该配置。加载前会验证来源 hash/schema，缺失、漂移、超限或不支持的命令会拒绝；不会放宽来源校验。工程知识和多 Skill 两组字段可以分别设为 null 来关闭，但需重新计算配置文件 hash。

## 默认值与能力边界

发布与解压后 `agentGuidanceFile` 和 `agentGuidanceSha256` 均保持空，新增能力默认关闭；原 Skill 0.5.0 的 `experimentalSkill01` 默认关闭。可选配置不授予工具权限、真实请求额度或新的实验授权；不得据此自动启动 Pilot、G2 或正式实验。

两组输入仍保持各自 top_k=2、max_tokens=768 上限，并受原共同上下文和请求窗口限制。多 Skill 条目保持 draft，工程知识有来源但不替代当前验证事实；版本限定 Vivado 2026.1，有效期至 2026-12-31，过期条目会被选择器排除。System Prompt V2 仅为可选候选，在配置启用并满足既有边界时参与；它不改变 PASS、预算、工具或安全权限。

此包没有复制整个 AMD 历史目录、冻结副本、机器配置、模型原始流、私有推理、凭据或真实费用账本。P3–P6 进度继续暂停；可选源码交付不构成阶段最终验收、主 Runtime 部署或效果 promotion。
