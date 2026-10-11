# Vivado 2026.1 P0 迁移报告

本轮已迁移当前运行配置、消除执行链路中的固定版本检查，并完成真实 XSim、诊断、波形及代表性 VerilogEval 校准。**P0 的 EDA 核心验收已完成**：器件支持补齐后，在原器件 `xczu3eg-sbva484-1-e` 上补验了综合正负例、资源及时序解析；最终 RTL 测试一次完整执行为 395 通过、0 失败、17 跳过。初轮缺失器件及后续超时记录均保留。完整仓库文档检查仍有两项独立失败，详见第 5、7 节；不宣称仓库所有检查全绿。

工作分支实际为 `tool-skill`。本轮没有提交、切换分支、推送、运行模型或修改 benchmark 正确性标准。

## 1. Repository Audit

修改前扫描了 `2025.2`、`vivado2025.2`、`AMDDesignTools/2025.2`、`expectedVivadoVersion`、`vivado_version`、`compatibilityVersion`、`evaluator` 和 `manifest`。共命中 16,298 个文件；分类包括 Documentation 346、Historical Artifact 15,646、Source Code 277、Runtime 12、Test 17。排除 Git 元数据、依赖目录、虚拟环境、构建 target 和本次审计输出。

完整逐文件清单和原始引用见 [JSON 审计清单](repository-audit.json)，修改前的主要引用表见 [审计表](repository-audit.md)。匹配不等于需要修改：第三方 Harness 源码、AMD 参考资料、已有 campaign 和历史报告均按上下文保留。

| 主要文件或范围 | 原引用 | 分类 | 本轮策略 |
| --- | --- | --- | --- |
| `phase1/configs/dev.yaml` | 2025.2 与 D 盘路径 | Runtime | 迁移到实测的 E 盘 2026.1，输出写入全新目录 |
| `cordis.synthesis.patch.yml` | 2025.2 executable | Runtime | 指向本机 2026.1 |
| `doctor.ts` / `verification.ts` | 固定 2025.2 验证 | Source Code | 使用 `expectedVivadoVersion` |
| `snapshots.ts` | 固定 tool_version | Source Code | 显式传入环境配置 |
| `p10-compat-rule.ts` / `p10-compat-suite.ts` | 固定 identity、manifest 名和类型 | Source Code | 参数化，并检查运行器与 evaluator 版本一致 |
| `p10-suite-preflight.ts` / `p10-report.ts` | 固定版本描述 | Source Code | 从配置生成；先重新探测原始输入 |
| `phase1/p10/audit-p10-campaign.mjs` | 2025.2 和固定历史 hash | 历史 campaign 专用源代码 | 保留原样，不用于审计新套件 |
| `tests/fake-*` 与当前测试 | 2025.2 mock / 固定 schema | Test | 当前 mock 使用 2026.1；保留旧版本识别与不匹配测试 |
| 三组 README | 当前示例与历史描述混合 | Documentation | 更新当前示例；保留历史 2025.2 事实 |
| `AMD/phase1-validation`、旧 p09/p10、campaigns、旧 fixture/snapshot | 真实 2025.2 provenance | Historical Artifact | 不修改 |

## 2. Modified Files

逐文件原行为、改动及原因见本文末尾的修改明细。所有新增真实日志均位于 `deepseek-harness/rtl-tools/tests/fixtures/vivado2026.1/`，其 [provenance](../../deepseek-harness/rtl-tools/tests/fixtures/vivado2026.1/provenance.json) 记录来源路径、SHA-256、工具版本和实际阶段状态。旧 fixture 未改名、未覆盖。

## 3. Preserved Historical Files

`git diff --quiet HEAD` 验证了原有已跟踪 AMD 数据、`phase1/p10/campaigns`、`tests/fixtures/p10`、`tests/__snapshots__` 及旧 campaign 审计脚本没有修改。起始工作区干净。验证记录见 [historical-integrity.json](historical-integrity.json)。

日期固定的旧 campaign profile 与 freeze 仍属于原实验配置，不能拿来冒充新版本的运行。新实验写入 `AMD/phase2-vivado2026.1/`。本次没有执行旧目录中的配置或覆写其中的 provenance。

## 4. Vivado 2026.1 Compatibility Result

实测安装：`E:/Xilinx/2026.1/Vivado/bin`。Node：`C:/Program Files/nodejs/node.exe`，v24.16.0。依赖按原 lockfile 本地安装，未升级依赖或修改 lockfile。

| 环节 | 状态 | 证据与限制 |
| --- | --- | --- |
| vivado | PASS | 检出 2026.1，`-version` 退出码 1 |
| xvlog | PASS | 检出 2026.1，`-version` 退出码 0 |
| xelab | PASS | 检出 2026.1，`-version` 退出码 0 |
| xsim | PASS | 检出 2026.1，`-version` 退出码 0 |
| Compile | PASS | Verilog、SystemVerilog 正例；语法错误、未声明信号诊断 |
| Elaboration | PASS | 正例；缺失模块、缺失函数、命名端口和端口数量错误 |
| Simulation | PASS | 正例通过；功能负例失败；mismatch 计数正确 |
| Waveform | PASS | 11 个 VerilogEval 负例均有首错信号/时间和有界 VCD 采样 |
| Synthesis | PASS | 原器件支持补齐后，计数器生成网表/checkpoint；故意缺失综合模块的负例检出 `Synth 8-439` |
| Utilization / Timing | PASS（解析） | 计数器 LUT=2、FF=4、BRAM=0、DSP=0；综合后 WNS=4.405 ns。原报告的保持时间失败警告仍保留，不代表时序收敛 |

名称与端口错误按工具实际发生阶段记录：未声明信号在 compile；缺失函数和端口错误在 elaborate。没有为满足预设阶段名称而伪造 compile 错误。

版本命令完整 stdout/stderr、退出码、命令、预期及检出版本见 [version-probes](version-probes/vivado.json)。Harness 每个版本探测也写入独立 JSON，原始 stdout/stderr 保留为日志。

器件补齐前的基础实跑见 [live-results.json](live-results.json)：8 项中 3 项通过、5 项失败；这 5 项当时的共同阻塞是原器件不可用。额外名称与端口诊断见 [diagnostic-results.json](diagnostic-results.json) 和 [name-results.json](name-results.json)；前一轮对缺失函数阶段的预期已按实际展开行为修正，复测通过。以上初始证据没有覆写。

器件补齐后的 doctor 独立复测见 [doctor-supported-results.json](doctor-supported-results.json) 和 [完整 doctor 记录](../../AMD/phase2-vivado2026.1/regression-WdViK3/doctor-result.json)：四个版本检查、原器件查询、综合及报告均通过，`eda_ready=true`。其 `MODEL_NOT_READY` 只表示没有配置或调用模型，不是 EDA 失败。

七个固定 fixture 全部按预期通过验收：counter、Verilog、SystemVerilog 四阶段 PASS；syntax 在编译失败、missing-module 在展开失败、functional 在仿真检出 18/20 mismatch、synthesis-only 在综合检出 `Synth 8-439` 且 `synthesizable=false`。详见 [验收汇总](synthesis-acceptance-summary.json) 与 [本轮原始测试结果](synthesis-supported-results.json)。该次原始测试结果为 7 通过、1 失败；失败的 doctor 已由上述独立复测解决，8 个不同验收项最终均通过，不将两次运行描述为一次全绿。

开发预算经过真实运行校准：120 秒曾使 doctor 和计数器在正常综合过程中超时；计数器成功的综合与报告合计约 138 秒。因此将当前 `dev.yaml` 与独立 synthesis patch 的预算改为 300 秒、固定 fixture profile 总预算改为 600 秒；保留编译/展开/仿真及历史 campaign 的预算。一次 doctor 报告运行记录到约 58 分钟的异常停顿并超时，独立复测在既定 300 秒配置下成功，没有继续增加预算或将超时标成通过。

计数器原始资源报告为 LUT=2、FF=4、BRAM=0、DSP=0；时序摘要 WNS=4.405 ns、WHS=-0.063 ns。Harness 保留 `timing_constraints_not_met` 警告。这里验收的是综合成功及资源/时序解析，不是板级实现、完整 I/O 约束或布局布线后的时序收敛。

## 5. Test Result

最终一次完整 RTL 执行：**Test Suites 29（28 执行通过、1 个 live 文件整组跳过），Passed 395，Failed 0，Skipped 17**，用时约 20 分 49 秒。新增 5 项真实综合日志回归均通过。见 [最终汇总](test-summary-completion.json)、[原始 JSON](unit-completion-results.json) 和 [执行日志](unit-completion-output.txt)。上一轮 390 通过的合并结果仍保留在 [旧汇总](test-summary.json)，不再作为当前验收计数。

初次沙箱执行受 `tsx` 的 `uv_os_get_passwd ENOMEM` 影响，Harness Windows Job runner 无法启动；经授权在宿主环境复跑后该问题消失。宿主全量首跑有 7 项失败，逐项定位和复测记录均保留。

- 旧 CRLF hash 测试从 LF checkout 读取时失败：仅在测试内构造其明确要求的 CRLF 字节，历史 fixture 和 allowlist 不变。
- 两项多轮/多 fixture 测试超过 Windows 的 30 秒测试等待：只增加测试等待时间，该轮没有放宽 EDA 或 benchmark 运行预算；后续器件补齐验收中的开发配置调整见上文。
- 一个 600 ms 超时测试可能早于 Windows 子进程启动：Windows 测试预算改为 2 秒，仍验证超时与子进程回收。
- 旧 snapshot 未包含已有 waveform feedback 字段：保留原 snapshot 的诊断投影，并单独断言新增波形字段，没有覆盖历史 snapshot。
- 其他瞬时失败串行复测通过，未修改产品判定。

17 项跳过包括原有的三项 Vivado registered-tool 测试、一项真实 Icarus 测试，以及关闭 `VIVADO_LIVE` 时整组跳过的 13 项真实集成测试。真实集成测试的环境、固定 fixture、名称/端口及兼容性校准证据分别保存在本报告链接的 opt-in 执行记录中，未把本次跳过项算作通过。

本轮 `tsc -b rtl-tools/tsconfig.json --pretty false`、`oxlint rtl-tools` 和 `git diff --check` 均通过，见 [静态检查退出码](static-completion-exits.json) 与 [历史保护复核](historical-integrity-completion.json)。

文档复验已执行快速与完整检查：`pnpm run test:docs` 为 15 通过、1 失败；`pnpm run doc-sync` 为 32 通过、2 失败，未跳过检查。完整日志见 [快速检查](doc-quick-completion.txt)、[完整检查](doc-sync-completion.txt) 和 [退出码](doc-completion-exits.json)。文档类型检查、站点构建、双语配对、链接及格式均通过。剩余失败不属于 Vivado 解析或 EDA 链路：

- archived-notes 检查假设 Harness 自身是 Git 根目录，读取 `HEAD:.agents/notes/archived/manifest.json` 失败；实际路径带 `deepseek-harness/` 前缀。未修改历史归档或扩展修复仓库布局。
- 站点检查的 69 项测试中 68 项通过，1 项创建临时文件符号链接时得到 Windows `EPERM`；未跳过、削弱此安全测试或更改系统权限。站点实际构建已通过。

## 6. VerilogEval Compatibility Result

| 字段 | 结果 |
| --- | --- |
| compatibilityVersion | `vivado2026.1-compat-v1` |
| 上游固定提交 | `c498220d0a52248f8e3fdffe279075215bde2da6` |
| manifest | `verilogeval-vivado2026.1-compat-v1-manifest.json` |
| manifest SHA-256 | `39bd27d633c95007c1d1de48506cdfb4a02f8a3af238e663beddadfd50e61faf` |
| evaluator 示例 | `verilogeval-Prob005_notgate-vivado2026.1-compat-v1-no-default-timescale` |
| 全量静态清单 | 156 项；155 项可审计转换，1 项保留原文等待人工审查 |
| 真实校准 | 固定十题 + `Prob038_count15` sentinel，11 个正例及 11 个负例通过校准 |
| 规则 | 原始 notgate / count15 在 2026.1 复现 `VRFC 10-3380`，保留 `VIVADO_COMPAT_001` |
| timescale | 两个代表任务不加默认值即可展开；本轮 11 题均未添加旧 timescale 参数 |
| 可复现性 | 相同构建时间和输入生成字节相同的 manifest；每项有原始/有效 hash、patch 和行映射 |

新套件位于 [derived 目录](../../AMD/phase2-vivado2026.1/regression-nub70B/derived/)，校准详情见 [compatibility-result.json](compatibility-result.json)、[compat-results.json](compat-results.json) 和 [26 次原始/转换/正负运行记录](../../AMD/phase2-vivado2026.1/regression-nub70B/compat-runs.json)。上游 checkout 保持干净；Baseline/Agent 使用同一 loader 的 identity/hash 校验已通过。没有生成模型分数。

未自动处理的任务是 `Prob156_review2015_fancytimer`：静态扫描报告 `MULTIPLE_MATCH / non_unique_declaration_or_waveform`。该项仍为 `NEEDS_MANUAL_COMPAT_REVIEW`，没有被强行转换。其余未实跑的任务只表示静态转换完成；manifest 中的 `tool_validation: NOT_RUN` 不被改写成全量通过。校准记录独立保存。

## 7. Remaining Risks / 下一步

1. 原器件支持已补齐，doctor 已复测通过。综合后时序报告含保持时间失败，不应将正 WNS 用作时序收敛结论；本任务没有运行 implementation 或 bitstream。
2. 全 156 题没有逐题实跑；11 题校准不能替代全量 benchmark 兼容结论。上述 1 项保守拒绝需要单独审查。
3. 真实 2026.1 综合 PASS 与设计性 FAIL 使用独立的 `fixtures/vivado2026.1/synthesis-supported/` 记录；旧缺失器件环境错误 fixture 保留。新增样例覆盖当前器件与小型设计，不能保证所有器件和任意复杂 RTL 的报告格式或运行预算。
4. 文档 UG900 链接已指向 2026.1；本轮网页工具无法读取该地址，未声称核验其全文。命令行为依据本机实际运行。
5. 新套件完成 hash sealing；未重新建立多 worker Windows ACL 隔离证明，不宣称对抗性 OS 隔离。旧 campaign 的 ACL 证明不能迁移为新证据。
6. 完整仓库文档检查仍有上述 Git 根目录假设及 Windows 符号链接权限两项失败；EDA 基线通过不等于仓库全部检查通过。

在仓库的 `deepseek-harness` 目录运行可复验检查：

```powershell
node node_modules/typescript/bin/tsc -b rtl-tools/tsconfig.json --pretty false
node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts --maxWorkers 1
$env:VIVADO_LIVE = '1'
node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts rtl-tools/tests/vivado-live.spec.ts --maxWorkers 1
```

真实兼容测试使用本轮新建并固定提交的 `AMD/phase2-vivado2026.1/verilog-eval` checkout。输出始终分配新目录。完整 live 命令验证配置的原器件；缺少器件或超时仍按实际失败记录。

## 修改明细

| 文件 | 原行为 | 修改内容 | 原因 |
| --- | --- | --- | --- |
| `README.md` | 当前/历史环境说明混合 | 当前基线改 2026.1，并链接实测报告 | 保留历史事实并明确未验收项 |
| `deepseek-harness/rtl-tools/README.i18n.yaml` | 旧双语一致性 hash | 重录当前中英文配对 | 保持配对验证 |
| `deepseek-harness/rtl-tools/README.md` | 当前/历史环境说明混合 | 当前基线改 2026.1，并链接实测报告 | 保留历史事实并明确未验收项 |
| `deepseek-harness/rtl-tools/README.zh.md` | 当前/历史环境说明混合 | 当前基线改 2026.1，并链接实测报告 | 保留历史事实并明确未验收项 |
| `deepseek-harness/rtl-tools/cordis.synthesis.patch.yml` | D 盘 Vivado 2025.2 | 本机 2026.1 和当前源码路径 | 有效 runtime 配置 |
| `deepseek-harness/rtl-tools/phase1/README.i18n.yaml` | 旧双语一致性 hash | 重录当前中英文配对 | 保持配对验证 |
| `deepseek-harness/rtl-tools/phase1/README.md` | 当前/历史环境说明混合 | 当前基线改 2026.1，并链接实测报告 | 保留历史事实并明确未验收项 |
| `deepseek-harness/rtl-tools/phase1/README.zh.md` | 当前/历史环境说明混合 | 当前基线改 2026.1，并链接实测报告 | 保留历史事实并明确未验收项 |
| `deepseek-harness/rtl-tools/phase1/configs/dev.yaml` | 2025.2、D 盘源码/输出路径 | 2026.1、已确认的 E 盘工具和独立输出目录 | 使用真实环境 |
| `deepseek-harness/rtl-tools/phase1/cordis.patch.yml` | D 盘 doctor profile | 当前源码、配置和输出工作区 | 可在本机定位配置 |
| `deepseek-harness/rtl-tools/phase1/fixtures.patch.yml` | D 盘 fixture profile | 当前源码、配置和输出工作区 | 复用原有链路 |
| `deepseek-harness/rtl-tools/phase1/language/README.i18n.yaml` | 旧双语一致性 hash | 重录当前中英文配对 | 保持配对验证 |
| `deepseek-harness/rtl-tools/phase1/language/README.md` | 当前/历史环境说明混合 | 当前基线改 2026.1，并链接实测报告 | 保留历史事实并明确未验收项 |
| `deepseek-harness/rtl-tools/phase1/language/README.zh.md` | 当前/历史环境说明混合 | 当前基线改 2026.1，并链接实测报告 | 保留历史事实并明确未验收项 |
| `deepseek-harness/rtl-tools/src/phase1/doctor.ts` | 只允许固定 2025.2 | 校验版本格式并保存 expected/actual | 配置成为版本来源 |
| `deepseek-harness/rtl-tools/src/phase1/p10-compat-rule.ts` | 固定 compatibilityVersion 常量 | 带格式检查的版本派生函数 | 避免重复版本常量 |
| `deepseek-harness/rtl-tools/src/phase1/p10-compat-suite.ts` | 固定 manifest、类型及规则默认应用 | 配置化名称/identity，显式 rule policy，加载时校验 identity | 新实验必须独立构建 |
| `deepseek-harness/rtl-tools/src/phase1/p10-preflight.ts` | 未传报告工具版本 | 传入 expectedVivadoVersion | 绑定报告与当前运行 |
| `deepseek-harness/rtl-tools/src/phase1/p10-report.ts` | CSV 固定 2025.2 | 使用调用方配置版本 | 报告不误标 |
| `deepseek-harness/rtl-tools/src/phase1/p10-suite-preflight.ts` | 转换后才校准，报告固定旧版本 | 先探测原始输入并决定规则，再构建和校准 | 不盲用历史规则 |
| `deepseek-harness/rtl-tools/src/phase1/repair-diagnostics.ts` | 部分端口措辞分类为 unknown | 新增实测 VRFC 10-3180 / 10-8616 分类 | 真实 2026.1 诊断回归 |
| `deepseek-harness/rtl-tools/src/phase1/snapshots.ts` | 固定 tool_version/器件/时钟元数据 | 显式接收环境参数 | 新 snapshot 不误标旧版本 |
| `deepseek-harness/rtl-tools/src/phase1/verification.ts` | 固定版本探测及 snapshot 版本 | 传入配置、保存版本 JSON、拒绝 evaluator 版本不符 | 确保执行与 provenance 一致 |
| `deepseek-harness/rtl-tools/src/vivado-parser.ts` | utilization 注释限定旧版本 | 说明格式解析与历史 fixture 关系；保留旧 inf 行为 | 不以改注释冒充真实综合验证 |
| `deepseek-harness/rtl-tools/tests/end-to-end.spec.ts` | snapshot 无环境参数 | 传入显式测试环境 | 更新 API 消费方 |
| `deepseek-harness/rtl-tools/tests/fake-doctor.mjs` | 2025.2 mock | 2026.1 mock；2025.2 作为 mismatch | 当前配置正反测试 |
| `deepseek-harness/rtl-tools/tests/fake-verification.mjs` | 固定 2025.2 mock | 2026.1 默认值及显式 actualVersion 测试输入 | 验证 mismatch fail-closed |
| `deepseek-harness/rtl-tools/tests/p10-compat-suite.spec.ts` | 固定旧 identity、CRLF 文本假设 | 配置化 policy/identity 测试、无规则保真测试 | 覆盖新套件且兼容 checkout 换行 |
| `deepseek-harness/rtl-tools/tests/p10-compat.spec.ts` | 直接依赖 checkout 是 CRLF | 测试内重建已钉住的历史 CRLF 字节 | 保留旧 fixture 和 hash |
| `deepseek-harness/rtl-tools/tests/p10.spec.ts` | report 无版本入参 | 传入明确工具版本 | 更新 report API 消费方 |
| `deepseek-harness/rtl-tools/tests/phase1-loader.spec.ts` | 全部 fixture 共用 30 秒测试等待 | 仅 Windows 多 fixture 测试延长等待 | 实测宿主启动开销；不改变产品预算 |
| `deepseek-harness/rtl-tools/tests/phase1-verification.spec.ts` | snapshot 无环境参数、短 Windows 超时 | 显式环境、版本拒绝测试、Windows 启动留量 | 覆盖新行为并保持 timeout/reap 断言 |
| `deepseek-harness/rtl-tools/tests/phase1.spec.ts` | 固定 schema 与旧 banner 测试 | 新增 2026.1/旧版本 mismatch；保留旧 banner 回归 | 参数化不失去版本约束 |
| `deepseek-harness/rtl-tools/tests/repair-loader.spec.ts` | 旧 snapshot 与新增 waveform 字段混比 | 保留旧投影并单独断言波形字段 | 旧 snapshot 不被覆盖 |
| `deepseek-harness/rtl-tools/tests/repair.spec.ts` | 多轮集成测试 30 秒等待 | 仅对应 Windows 测试延长等待 | 保留各轮结果断言 |

新增 `tests/vivado-live.spec.ts` 提供显式启用的真实 Harness/EDA 校准；`tests/vivado-2026.1.spec.ts` 回放真实日志、校验来源 hash 并验证首错和 VCD。新增 `tests/fixtures/vivado2026.1/*` 的逐文件来源见 provenance.json。新增 `.agents/notes/implemented/architecture/2026-09-23-vivado-version-provenance` 中英文记录及 sidecar，说明版本与历史来源边界；旧 full-suite 决策继续有效。审计、测试记录及本报告位于 `docs/vivado-2026.1/`，实跑产物位于全新的 `AMD/phase2-vivado2026.1/`。

器件补齐后的补充改动：`configs/dev.yaml` 与 `cordis.synthesis.patch.yml` 将开发综合预算从 120 秒改为 300 秒；`fixtures.patch.yml` 将总预算改为 600 秒；Phase 1 README 中英文说明及配对记录同步。`vivado-live.spec.ts` 增加综合设计错误和具体资源/时序断言，doctor 测试等待覆盖完整探测与两个 batch 阶段。`vivado-2026.1.spec.ts` 增加 5 项综合回归；独立 `fixtures/vivado2026.1/synthesis-supported/` 保存 34 份原始日志、报告及 Harness 记录，并用单独 provenance 固化来源和 SHA-256。此前的缺失器件 fixture 没有覆写。
