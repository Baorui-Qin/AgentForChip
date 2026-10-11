# tool-skill_v1 功能源码交付

本版本交付当前主线的 RTL 工具与 Skill 基础功能，以及独立保存的 P4–P6 可选候选源码。它是需要安装依赖并配置本机工具路径的源码包。发布、解压和克隆不自动启用实验 Skill，不构成 P3–P6 阶段完成或效果晋升。

## 已实现功能

| 部分 | 功能 |
| --- | --- |
| RTL 工具链 | 受管 RTL 编辑、编译、展开、仿真、综合及诊断反馈；工具结果决定验证状态 |
| 修复流程 | 基于当前来源证据的修复资格与候选评分，保守诊断，故障 seed 修复及重新验证 |
| Skill | Skill 0.5.0 条件选择、上下文注入、编辑前引用与摘要检查；默认 `experimentalSkill01=false` |
| Diagnostic Knowledge V1.1 | 严格来源和 hash 校验、有界检索、上下文注入；不授予修复或执行权限 |
| 模型流与用量 | 完整接收档案、独立有界审计、四态 Provider usage、语义超限后的同预算终态元数据读取 |
| 资源管理 | Windows Job、Scope、取消、进程与写入结算、范围证明及安全清理 |
| 可选 P4–P6 | 波形反馈、Static/Experience Knowledge、多 Skill 与 System Prompt V2 的独立候选源码；见 [可选候选说明](optional/README.md) |

## 安装与使用

保留 `deepseek-harness/` 整个 pnpm workspace、lockfile 和随包的有限 `AMD/` 资产，不要只复制 `rtl-tools/`。使用 workspace 声明的 Node.js 和 pnpm 版本；在 `deepseek-harness/` 中执行 `pnpm install --frozen-lockfile`。构建及应用入口依照 [Harness 开发文档](../../deepseek-harness/docs/development.md) 和 [RTL 使用说明](../../deepseek-harness/rtl-tools/phase1/README.md)，使用受支持的 `dsh` profile。

使用真实 EDA 前，需要自行安装对应 Vivado 2026.1 和目标器件支持，并调整 `phase1/configs/dev.yaml`、相应 Loader overlay 和 profile 中的 repository/output/tool 路径。现有示例保留开发机的 F:/、E:/ 及部分旧 D:/ 路径；下载后不能直接把这些路径当作本机配置。优先使用较短的运行目录，当前深层目录已有 Vivado 内部文件访问失败记录。仅缩短字符串尚不是已验证的修复。

启用 Diagnostic Knowledge 时，将 `knowledgeFile` 指向 `deepseek-harness/rtl-tools/knowledge/diagnostic/bundle.json`，`knowledgeEvidenceRoot` 指向源码包根目录，并使用清单的 `bundle_sha256`。包内保留加载器必须读取的公开日志原字节。旧已验证 Skill 资产位于 `AMD/phase2-tool-skill/runtime/B0-local-10/skills/skills.validated.json`；实验 Skill 位于 `deepseek-harness/rtl-tools/phase3/skill01/skills.draft-v5.json`。启用和执行真实请求仍需要使用者明确配置；本次交付不运行它们。

API Key 由使用者在本机配置，不能写入提交或公开配置。包内不含凭据、真实费用账本、预约资料或原始模型流。

## 验证范围与限制

真实首题 Pilot 已发生 Skill/Knowledge 注入、一次被接受的 RTL 修复和重新验证；编译、展开、仿真通过，仿真 228 项检查、0 个不匹配。综合因内部文件访问失败而未通过，第二题及 G2 未运行。该环境问题获准不阻挡后续进度，原失败没有改记为 PASS。

独立 P4–P6 集成候选的既有完整工程 G1 为 1054 PASS / 0 FAIL / 18 条件 SKIP，旧覆盖 39/39；其 `deployment` 和 `promotion` 均为 false。对应来源摘要见 [验证记录](verification.json)。这些是已有运行证据，本次源码包装不等同于对新机器、新配置或发布副本完成了相同完整运行。

部分历史 replay 测试依赖本机封存目录、tokenizer、外部测试收据或真实流前缀。完整历史依赖和私有流未随源码包发布，因而不能宣称下载后所有历史测试都可直接执行。纯分类、审计、Knowledge 加载与检索等离线测试可以单独选择；Native 测试需要声明的本机设施。封存来源缺失不会被替换为假通过。

`SOURCE_MANIFEST.json` 记录已交付 ZIP 快照的原始字节，不是 Git checkout 的逐字节复现清单。Git 发布按仓库规则规范化普通文本换行，并以限定属性保留来源证据原始字节；发布所需的 Git 属性和此说明不回写旧 ZIP。`optional/manifest.json` 记录可选覆盖包和兼容基础源码身份。许可沿用各目录和第三方组件原有许可，没有新增覆盖所有文件的许可。本轮发布期间，原 P3–P6 进度保持暂停。
