# P2-FIX-06 Native Batch Stability Report

## 1. Executive Summary

正式状态保持 **P2_NOT_ACCEPTED**。v4 的 T1 为 **14 PASS / 0 FAIL**；T2 与 T3 各为 **124 PASS / 7 FAIL / 0 SKIP**，共 131 个用例。发现 Windows native subprocess 的 **CANCELLATION_PROPAGATION_DEFECT**，已记录 `CODE_DEFECT`。

按照本任务第 23 节“STOP P2-FIX-06 validation”，在确认产品缺陷后停止当前身份验证。**T4、fresh R0、Vivado live 和后续门禁均未执行**。未修改产品源码、既有测试、assertion 或任何 timeout。最新已执行的正式完整 D 仍是 FIX05 的 **468 PASS / 14 FAIL / 18 SKIP**；`REGRESSION_GATE_NOT_MET` 未关闭。

缺陷的核心是：terminate IPC 的 EPIPE 在合法 target-exit 和 runner clean close 到达前拒绝 managed-range promise，随后正常退出证据无法撤销该拒绝，live ownership 未释放，dispose 再次抛出 EPIPE。该条件下的行为已由动态事件和源码共同证明；没有将其归因给历史十四题的所有失败。

## 2. Frozen Input Verification

当前测试设施身份：`P2-FIX-06-diagnostic-v4`；运行时身份：`phase2-diagnostic-knowledge-v1.1-multiple-driver`；分支 `tool-skill`；基础 B0 不变。

| 身份字段 | 冻结值 |
| --- | --- |
| Source commit | `2a882c3729f214e8f669be0f0e5b16eaf33c73b3` |
| Source tree | `9d190088afd332532ec902d083d423699fad3d91` |
| Source diff SHA-256 | `92cd146fd81049332725bb0e663fc98898afe2c7d2aee346c567c7531704ff64` |
| Runtime manifest / files | `0a5cbe7f0bbd9205251a525299d8ecf79f96ec21b1bf065355b5766470d8d461` / 12760 |
| Matrix plan v4 SHA-256 | `88ca415dfb64f9289446bce7be2b74be68b6e63ea7833a343d7421b64eabd7e0` |
| Knowledge bundle | `8eb670fedf959d19c83900181935914077afd9718cb9ff4d3565e331ab7d33a5` |
| Skill bundle | `403441e492248be09e5fd98e61ca3c487ed9ca48d0647d8014539dee93c73d25` |
| Model config | `f9c3068af9be204151f3fcb96be27807a07eaa1dc86ad52ba0570f252d1edfd3` |
| Generation prompt | `f5d9c9ca2206b2ba713365b0c4b56a855a049de71f6888801214a3f40e1cb839` |
| Repair prompt | `0ff0af65017a4e14e32a78a0096815bc02934f6a90f30bb573216a245d63e213` |
| Benchmark | `c498220d0a52248f8e3fdffe279075215bde2da6` |
| R0 manifest | `e7cdc47dc949b699395d548cc8a9efa7ed4959dae09f848ef9d8581d030de225` |
| R1 manifest | `a17ecbbec7c4ee50607746f38b81f5f71dfe3f14e946d5ac47cd8ee167048660` |
| EDA | Vivado/XSim 2026.1; xczu3eg-sbva484-1-e; vivado2026.1-compat-v1 |

`frozen-input-verification.json` 及 T3/T4 前只读复核均为 FROZEN_INPUTS_PASS，12760 个 runtime 文件无差异。最后一次复核时间为 2026-09-28T09:44:23.271Z，发生在停止决定前。它是输入复核，不能替代尚未执行的最终 integrity gate。启动前还只读核验了 FIX05 的 6391 个封存文件；历史 seal SHA-256 为 `de305dfed85edf7dfd4eb87d2c2a31943bf23b306ddfa13a8916641257c816e1`。

## 3. Failure Inventory

`failure-inventory.json` 保留 FIX05 原十四题、原 assertion/error、expected/actual、耗时、Vitest/EDA limits 和缺失字段。历史单题 start/failure monotonic 时间、最后 child/receipt/abort/cleanup 状态未采集，使用 null，未从本轮 PASS 反推历史状态。原始 suite 文件路径也保留，不能视为单题起始时间。

| ID | 原固定 failing case | Vitest body deadline | T1 | T2 | T3 | 当前分类 |
| --- | --- | --- | --- | --- | --- | --- |
| F01 | rejects stale revision and unknown suite without verification and then accepts the correct request | 60s | PASS | PASS | PASS | UNRESOLVED |
| F02 | never turns finish into PASS | 60s | PASS | PASS | PASS | UNRESOLVED |
| F03 | does not execute or retry a partial tool response | 60s | PASS | PASS | PASS | UNRESOLVED |
| F04 | stops a repeated candidate without consuming another repair | 60s | PASS | PASS | PASS | UNRESOLVED |
| F05 | counts rejected edits but never skips verification of a candidate | 60s | PASS | PASS | PASS | UNRESOLVED |
| F06 | unloading the application cancels a live verifier and joins its child tree | 30s | PASS | PASS | PASS | UNRESOLVED |
| F07 | records an evaluator-specific default without overriding source timescales | 30s | PASS | PASS | PASS | UNRESOLVED |
| F08 | preflights a dataset through simulation without synthesis or a candidate PASS | 30s | PASS | FAIL | PASS | NONDETERMINISTIC_TEST_RUNTIME |
| F09 | does not mark an unhealthy evaluator ready: Mismatches: 0 in 0 samples | 30s | PASS | PASS | PASS | UNRESOLVED |
| F10 | does not mark an unhealthy evaluator ready: Mismatches: 2 in 20 samples | 30s | PASS | PASS | PASS | UNRESOLVED |
| F11 | completes all mixed groups in order without adding sv flags to elaboration or simulation | 30s | PASS | PASS | PASS | UNRESOLVED |
| F12 | cancels a mixed compile group, joins its tree, then accepts the next snapshot | 30s | PASS | PASS | PASS | UNRESOLVED |
| F13 | offers a bounded repair for synthesis-only and restarts at compile after approval | 30s | PASS | PASS | PASS | UNRESOLVED |
| F14 | stops semantic budget exhaustion, not transport retries, after three valid failed candidates | 30s | PASS | PASS | FAIL | EVIDENCE_WRITE_CLEANUP_RACE |

预先候选分组保留：A 时间敏感（F01/F04/F07/F08/F09/F10/F11/F14），B evidence 缺失（F06/F07/F12/F13），C 上层 workflow assertion（F01/F02/F03/F04/F05）。分组是调查线索，分类详见第 14 节。F06/F12 的历史 child.pid 缺失无法进一步可靠区分 never-created、read-too-early 或 cleanup-before-read。

## 4. Timeline Instrumentation

统一事件使用 `process.hrtime.bigint()` monotonic ns，并携带 writer instance、PID/thread、test、operation、managed process 和 signal ID。记录 Mock request/chunks/response、VerificationRunner、workflow 状态、IPC、target exit、runner close、stream drain、range join、Abort、timer 与文件生命周期。原日志保持原样，派生分析只对 recorder.append 的对象型 event 标签覆盖做明确归一化，见 `analysis-event-normalization.json`。

T0–T20 是协议槽位，实际执行不到的 model/stage/receipt/assertion 阶段不伪造事件。`setup_complete` 对应 workflow start 的进入点，不代表每个纯 verifier 测试的完整 beforeEach 已结束；assertion hook 记录可观察断言事件。Mock reset/restore 内部时间戳未直接截获。原始 raw timeline 是最终来源，派生脚本在矩阵停止后运行，不是额外测试轮次。

测试设施版本变更均单独冻结并保留：v1 sequencer 注册错误导致零测试；v2 PID 重用造成 wx trace 文件冲突；v3 递归 backup 跟随 circular junction 导致 observer worker crash，独立 observer-only smoke 复现退出码 3221226505。v1–v3 不作为有效矩阵结果，也未用其 PASS 替代 v4 FAIL。v4 使用唯一 writer instance 与不跟随 link/junction 的 backup；原 rm 行为保持不变。见各 `observer-invalidated-*.json` 和 `observer-copy-smoke/`。

这些 observer 修正不属于产品修复。它们增加同步 hash、listener 和备份开销，可能改变时序；未测量去除 observer 后的发生率，不声称本轮耗时等于原始 suite 耗时。

## 5. T1 Individual Results

v4 原十四题各执行一次，14/14 PASS；选择、原顺序与身份核对均通过。按 testNamePattern 过滤出的其他用例不作为正式条件 SKIP，也不进入十四题分母。没有 isolated deterministic failure reproducer。T1 均无 pending operation 留到 test_end。

例如 F01 25.566s（40 个 managed commands），F06 4.497s，F12 7.348s，F14 26.254s。较短的 fake target 脚本仍需要 native runner bootstrap；不能将全部时间视作 RTL 编译。证据：`individual-results.json`、`checks-v4/T1/`、`analysis-v4/T1/`。

## 6. T2 File-Level Results

四文件保持各自内部原顺序，文件调度沿用 Formal D 实际顺序。

| 文件 | PASS | FAIL | 总数 | CLI elapsed |
| --- | --- | --- | --- | --- |
| p09-auto.spec.ts | 30 | 1 | 31 | 294.027s |
| phase1-loader.spec.ts | 5 | 0 | 5 | 43.513s |
| repair.spec.ts | 49 | 5 | 54 | 625.682s |
| phase1-verification.spec.ts | 40 | 1 | 41 | 192.356s |
| 合计 | 124 | 7 | 131 | — |

原十四题只有 F08 在本轮 T2 失败。其 compile stage 仍为 5000ms，四次 version probe 与三个 compile group 共用此预算。七个 direct target-exit 均先于 stage abort，最后一个 direct exit 为 `26207281309000` ns，stage controller abort 为 `26207330134100` ns（晚 48.825ms）。receipt 为 compile TIMEOUT、后续 SKIPPED；Vitest 30000ms body timer未触发。此失败发生于 stage deadline 与 post-command 工作的边界，不能靠增加 Vitest timeout 解决。详见 `F08-stage-timeout-proof.json`。

其余六题是新增失败，均有绑定的 compile TIMEOUT receipt。部分 version probe/native startup 消耗了大部分 5000ms，例如 p09 calibration 的四 probe 合计约 3.8s；partial TIMEOUT Mock 用例的一次 xelab-version preload 前延迟约 2.203s，后续 compile 剩余预算约 128ms。该上层失败不证明 Mock/provider/parser/repair 策略有语义缺陷。所有七个用例 test_end 和进入时 prior pending 均为空。详见 `file-level-results.json` 与附加失败表。

## 7. T3 Combined-File Results

固定原 Formal D 文件顺序为 p09-auto → phase1-loader → repair → phase1-verification。四文件组合只执行一次，结果 124 PASS / 7 FAIL / 0 SKIP，131 个用例、身份、选择和顺序均一致；CLI elapsed 1267.861s。未替换、删除或跳过失败题。

原十四题只有 F14 失败，F08 在 T3 PASS。新增六个失败包括 Loader compact-output 用例中的已确认产品缺陷，其余五个具有 compile TIMEOUT receipt。未知 synthesis error 用例在 calibration compile 阶段已失败，verification_run 为 null，随后 test 调用 readDiagnostics(null) 抛 TypeError；其 synthesis/parser 目标路径未到达，不能称为新 parser defect。

T2/T3 附加失败共十二个不同 case，全部保存，未混入原十四题清单：

| 行 | 附加 failing case | 耗时 | 当前分类 |
| --- | --- | --- | --- |
| T2/file-1 | does not export an edited but unverified candidate on finish | 5.975s | NONDETERMINISTIC_TEST_RUNTIME |
| T2/file-3 | retains invalid model output and terminates without executing it | 11.925s | NONDETERMINISTIC_TEST_RUNTIME |
| T2/file-3 | stops identical proposals without another verification | 5.580s | NONDETERMINISTIC_TEST_RUNTIME |
| T2/file-3 | does not retry authentication, non-temporary service errors or partial answers: {"error":"SERVER","status":501} | 5.660s | NONDETERMINISTIC_TEST_RUNTIME |
| T2/file-3 | does not retry authentication, non-temporary service errors or partial answers: {"error":"TRANSPORT","partial":"module counter("} | 6.545s | NONDETERMINISTIC_TEST_RUNTIME |
| T2/file-3 | does not retry authentication, non-temporary service errors or partial answers: {"error":"TIMEOUT","partial":"module counter(input wire clk, input wire rst, output reg [3:0] count);\nalways @(posedge clk) if (rst) count <= 0; else count <= count + 1;\nendmodule\n"} | 6.317s | NONDETERMINISTIC_TEST_RUNTIME |
| T3/combined | loads the snapshot-only tool through Loader and reconstructs its compact output from project events | 91.567s | CANCELLATION_PROPAGATION_DEFECT |
| T3/combined | preserves informational version exit 1 without accepting exit 1 from an actual compiler | 7.089s | NONDETERMINISTIC_TEST_RUNTIME |
| T3/combined | joins the child process tree on timeout before allowing another task | 11.983s | NONDETERMINISTIC_TEST_RUNTIME |
| T3/combined | uses at most two requests; second candidate repaired=true | 6.245s | NONDETERMINISTIC_TEST_RUNTIME |
| T3/combined | does not ignore additional unknown synthesis errors | 5.783s | NONDETERMINISTIC_TEST_RUNTIME |
| T3/combined | uses fresh feedback and the previous candidate in a two-round controlled loop | 24.946s | NONDETERMINISTIC_TEST_RUNTIME |

`additional-failure-inventory.json`、`combined-files-results.json` 与 `analysis-v4/T3/combined.json` 保留全部细节。原 Mock repair/export 目标在本轮文件与组合观察仍通过，未继续作为唯一根因焦点。

## 8. T4 Formal D Results

**NOT_RUN_CODE_DEFECT_STOP**。计划中的完整 500 题、原 assertions、timeouts、config、ordering 没有改动。确认产品缺陷后按第 23 节立即停止验证；没有“边修边继续”、没有完整 D retry-until-green。T4 counts 为 null，不能解释为 0 FAIL。停止后只运行只读/派生制品分析与封存。

## 9. Workflow Settlement Analysis

child exit ≠ range join ≠ runCommand resolved ≠ receipt published ≠ workflow settled。runCommand 等待 direct outcome、stdout/stderr capture 与 managed range join；VerificationRunner 还处理 quota、artifact index、recorder finish/close 与 manifest。RepairWorkflow.operation 的 finally save 与 resume/locked 的状态迁移、report 和 lock release 都属于返回 promise 的完成路径。

BUSY 期间存在 receipt 可以是正常中间态，resume/locked 返回 promise 才是 caller 的 settlement 边界。没有仅凭 BUSY 或 receipt available 推断漏 resolve/reject。

F14 T3 中，30000ms body timer 于 `27617029599500` ns 触发，cleanup 于 `27617032935100` ns 开始，仅晚 3.336ms；resume、locked、verify、operation、save 五个 promise 尚未结束。cleanup 在 `27617683880000` ns 报 ENOTEMPTY，后续 commands.json、state 或 lock 工作在已被移除的 root 内发生 ENOENT。下一个 case 在 `27617686553900` ns 开始，观察到五个 prior pending operation；该后继 case PASS，未证明它受到了 Mock/revision 污染。

该机制归为 **EVIDENCE_WRITE_CLEANUP_RACE，origin=TEST_LIFECYCLE**。`RepairWorkflow.close` 的文档要求 caller 先 settle active operations，它只 join unused recorder registrations；原 afterEach 的 close → context dispose → rm 不能接管被 Vitest deadline 留下的 caller promise。没有将其自动判作产品 close contract defect。证据：`F14-settlement-cleanup-proof.json`、`workflow-settlement-audit.json`。

## 10. Child Process Lifecycle

有效 v4 全部矩阵观察共 **3238** 个 managed process，direct done/error 均观察到；只有 **1** 个未出现 join_end，正是 CODE_DEFECT 的 managed ID。monotonic writer 错序数为 0。negative fixture 的非零 exit/取消按原 assertions 解释，不等于产品错误。

关键实例 runner PID 24764：target-exit(0) 于 `26975015142800` ns，native exit(0,null) 于 `26975027570200` ns，native close(0,null) 于 `26975032759900` ns，stdout/stderr end/close 亦有日志。range promise 已拒绝，之后约 58.202s 的 dispose 仍从同一 managed ID 收到 EPIPE。runner 实际结束并不保证 caller 的 join/ownership 状态正确。详见 `process-lifecycle-audit.json` 和 `code-defect-proof.json`。

## 11. Evidence Lifecycle

`evidence-lifecycle-audit.json` 索引 7759 个 canonical path/row 记录，包含 child.pid、result.json、state.json、stdout/stderr 的 publication/read、可用 fsync/close、cleanup 与错误。原 raw timeline 保留临时 writer 路径、rename/link 双端点、consumer operation 和 omitted link 元数据。没有无观测地承诺每个文件均有 fsync 时间戳。

轮询中的 ENOENT 后出现正常 publication/read，说明那一次读取早于可见性，不能一概判作失败根因。F08 receipt 正常存在并报告 stage TIMEOUT；F14 是 cleanup 与 late writer 重叠；EPIPE Loader 用例首轮 receipt 为 TIMEOUT，后续另一个 run PASS，不能用“最后一个 PASS receipt”解释前一轮/应用退出错误。直接 verifier 多 run 的 latest_receipt 摘要有选择局限，归因必须绑定具体 run，EPIPE 为 run-GFjkQL。

历史 FIX05 已删除 temp roots，F06/F12 缺失 PID 和 F13 EXECUTION_OR_EVIDENCE 的准确 lifecycle 不可恢复。v4 临时根由 mkdtemp 唯一命名；未发现路径复用/碰撞的正面证据。v3 observer-only circular junction 与部分副本保留，不重新跟随它们，私有 crash temp 未宣称已清理。

## 12. Abort / Cancellation Analysis

本轮区分 target-exit IPC 边界和 managed-range done 边界。target 口径 ACTIVE_ABORT=15、POST_EXIT_ABORT=1949、TARGET_NOT_OBSERVED=12；range 口径另为 27/1949。未观察到 target 的情况不伪装成“运行中杀死 target”。统计涵盖有意取消的 negative fixture，不能直接当作失败数。

CODE_DEFECT 证据链（全部 monotonic ns）：

| 事件 | 时间 |
| --- | --- |
| terminate send | 26974990578400 |
| managed/direct EPIPE | 26975007895600 |
| range join rejects EPIPE | 26975008253800 |
| valid target-exit(0) | 26975015142800 |
| runner close(0,null) | 26975032759900 |
| later disposal join rejects same EPIPE | 27033234264900 |

EPIPE 到有效 direct-exit 通知仅 7.247ms，到 clean close 24.864ms。消息通知前 directResultType 未定义时，WindowsJobOwner.signal 调用 failInfrastructure；该函数同时拒绝 direct 与 rangeExit。后来的 clean proof 调用 rangeExit.resolve 无法撤销已发生的 reject。LocalSubprocessRuntime 只有 waitForExit 成功后才从 live Set 删除句柄，故后来 dispose 再失败。live Set 未直接 dump，保留 ownership 由同一 ID 的后续 dispose/join 和源码路径共同支持。

源码证据及 hash：

- [deepseek-harness/packages/subprocess/subprocess-local/src/windows-job.ts:83](../../../deepseek-harness/packages/subprocess/subprocess-local/src/windows-job.ts#L83)：SHA-256 `04fa708c704b6be74df17a957de3bd787e62a559a2b9e078c3b4752641292e7b`。
- [deepseek-harness/packages/subprocess/subprocess-local/src/windows-job.ts:146](../../../deepseek-harness/packages/subprocess/subprocess-local/src/windows-job.ts#L146)：SHA-256 `04fa708c704b6be74df17a957de3bd787e62a559a2b9e078c3b4752641292e7b`。
- [deepseek-harness/packages/subprocess/subprocess-local/src/windows-job.ts:170](../../../deepseek-harness/packages/subprocess/subprocess-local/src/windows-job.ts#L170)：SHA-256 `04fa708c704b6be74df17a957de3bd787e62a559a2b9e078c3b4752641292e7b`。
- [deepseek-harness/packages/subprocess/subprocess-local/src/windows-job.ts:209](../../../deepseek-harness/packages/subprocess/subprocess-local/src/windows-job.ts#L209)：SHA-256 `04fa708c704b6be74df17a957de3bd787e62a559a2b9e078c3b4752641292e7b`。
- [deepseek-harness/packages/subprocess/subprocess-local/src/index.ts:106](../../../deepseek-harness/packages/subprocess/subprocess-local/src/index.ts#L106)：SHA-256 `81398ec668d58923aa5f23555b7f56b10637b9f0ad04706a7023002c58b7665d`。
- [deepseek-harness/packages/subprocess/subprocess-local/src/index.ts:178](../../../deepseek-harness/packages/subprocess/subprocess-local/src/index.ts#L178)：SHA-256 `81398ec668d58923aa5f23555b7f56b10637b9f0ad04706a7023002c58b7665d`。

源码节选、原 send 透明转发、raw 文件 hash 与完整事件在 `code-defect-proof.json`。不能将所有 EPIPE 一概忽略，也不能将控制通道错误直接等同于范围已经退出或未退出；未来修复必须保留非法协议、missing result、unsafe exit 的 fail-closed 行为。

## 13. Mock / Revision State Analysis

`mock-state-audit.json` 保存 Mock instance/call IDs、顺序、arguments，原始 response/chunk 完成事件在 raw。expected calls 来自未改动的 assertions；没有伪造 reset/restore 时间戳。T2/T3 多个用例在 calibration/initial verification 失败前未到 model request，其零调用不能单独证明 Mock 状态泄漏。

`revision-state-audit.json` 绑定 workflow object/test 与当前 revision、attempt/budget、receipt hash 和临时根；原 state write/receipt 保留完整 candidate/hash/score 等可用字段。未发现旧 revision/Mock 污染后续测试的正面证据。F14 确有跨测试边界的 pending operation，不能据此扩展为全部跨文件 singleton/cache 泄漏。Vitest 文件 worker isolation 也不能排除旧 worker 停止期间短暂重叠；当前未证明稳定资源累积。

## 14. Root Cause Classification

原十四题：F08 当前 T2 归 **NONDETERMINISTIC_TEST_RUNTIME**，具体是共享 compile-stage budget 耗尽，非 Vitest body timeout；F14 当前 T3 归 **EVIDENCE_WRITE_CLEANUP_RACE**。其余十二题为 **UNRESOLVED**：这是缺少历史生命周期证据后的证据结论，逐题记录具体上层症状、候选、反证和下一条缺失证据，不使用“flaky”作根因。

额外 T3 Loader 为高置信度 **CANCELLATION_PROPAGATION_DEFECT**，触发顺序敏感，按给定事件顺序产品 promise 状态演变确定。尚未执行新身份下的 deterministic regression fixture，未称其为“每次 isolated 都失败”的缺陷。其他附加失败确有 compile TIMEOUT，资源层面的 scheduler/I/O 归因仍未证明。

原十四题的历史 exact ordering 均未证明，F08/F14 只是同一 case 在本轮的具体机制。不存在把新 EPIPE 因果反填到旧十四题的结论。

## 15. Minimal Fix

当前身份 **未实施产品 fix**。确认产品缺陷后继续修改源码或跑 T4 会违反第 23 节。仅修正了 observer 的 sequencer、writer identity 和 link-safe backup，并分别冻结新测试设施身份。

下一独立 fix 任务应把 control-send error 与 managed-range exit proof 的 promise/ownership 职责分开：实际 target/direct 结果、流 drain、native range clean proof 与 ownership release 必须按已观测事实 settle；缺失/非法 proof 继续 fail closed。先在新 source identity 下显式构造 EPIPE → valid target-exit → clean close 的事件顺序并验证 join/dispose/ownership，再做固定完整 regression。

F14 的 test lifecycle 需要明确 caller promise 的取消、settlement 和 teardown ownership；先 settle/flush consumer，后 rm。这里是未来修复方向，未新增 sleep、retry、任意延迟，也没有将测试 30s 或 EDA 5s 放大。

## 16. Fix Impact Analysis

产品源码、Knowledge bundle/retrieval/budget、taxonomy、Skill selector/bundle、Prompt、Agent policy、DeepSeek replay/provider accounting、模型参数、token/repair/EDA budgets、Benchmark、R0/R1 和 PASS criteria 修改数均为 0。既有 test/assertion 修改数为 0。矩阵身份核对与停止前 source recheck 提供边界证据。

当前 observer 不进入真实 Agent runtime path，不重跑 R1；该影响面理由见 `fix-impact-analysis.json`。未来产品 fix 是否需要 R1 重跑必须以新改动影响面重新判断，本报告不提前免除。历史 R1 的 B0 6/7、K2 5/7 未变，不能据本轮 native 调查宣称 Knowledge 修复收益。

## 17. Final Formal D

当前身份没有执行完整 Formal D，无新的 0 FAIL 证据。正式 blocker **REGRESSION_GATE_NOT_MET** 保持 OPEN；新增 blocker **CODE_DEFECT**。T1 通过不覆盖 T2/T3 失败，更不覆盖旧 Formal D 失败。adapter 400/400、replay 6/6、tsc/lint PASS 都是 FIX05 历史结果；本轮未运行这些 gate。

## 18. Fresh R0

**NOT_RUN_CODE_DEFECT_STOP**，未发送新的模型请求。固定十题 manifest、Benchmark、Model/PASS identity 保持冻结。FIX04 的 10/10 仅为历史观察，不能作为本轮 fresh R0 PASS。

## 19. Vivado Live

**NOT_RUN_CODE_DEFECT_STOP**。本轮 T1/T2/T3 使用既有 fake-verification/native process fixture，不能计作 Vivado live。FIX04 的 13/13 不替代当前身份 live gate。

## 20. Provider / Metric Validation

新 live/provider model 请求数为 0；没有新的 provider usage，provider accounting completeness 和 metric binding **未验证**，值为 null/NOT_RUN。Mock fixture 的合成 response 与 usage-missing 字段不是 DeepSeek 账单或当前 provider 验证。计数绑定以各原始 Vitest JSON 为来源；pending/unexecuted assertions 不计 PASS。

补充环境采样：

| 阶段 | 样本数 | CPU 采样峰值 | 最低可用内存 | 磁盘队列峰值 | 最大采样间隔 |
| --- | --- | --- | --- | --- | --- |
| T1 | 40 | 36% | 12.33 GiB | 0 | 11018 ms |
| T2 | 178 | 32% | 12.34 GiB | 2 | 13652 ms |
| T3 | 192 | 34% | 13.36 GiB | 1 | 9134 ms |

没有修改全局电源设置。该低频 wall-clock 采样不能证明无休眠、无短时 I/O/scheduler stall，也不能把失败归因于 CPU/磁盘高负载。主要排序证据均为 monotonic 时间。

## 21. Integrity Audit

输入核验在停止前完成，当前源码与 FIX05/FIX04 冻结 runtime manifest 一致，无 BASELINE_DRIFT。所有新制品限定在本目录；未执行历史 output-producing helper，没有改写历史 Attempts。observer v1–v3 失败日志完整保留，未删除失败样本、改 skip、放宽 PASS 或更换题。

**最终 integrity postgate 未执行**：它受 Formal D=0 FAIL 与 CODE_DEFECT stop 限制。不能用输入复核或历史 69081-file 审计替代当前最终门禁。新调查制品的本地封存与内容 hash 校验是制品操作，结果单独存于 `artifact-seal.json`、`artifact-seal.sha256`、`seal-verification.json`，不代表产品 integrity gate PASS。

Seal 使用 lstat，link/junction 只记录 link target 身份且不跟随；避免 observer-only circular junction 递归。索引包括报告、脚本、全部有效和作废观察，seal 自身及 verification sidecar 排除以避免循环 hash。复现索引：`matrix-plan-v4.json` 绑定实际 infrastructure hashes、case/file 顺序及运行参数；`checks-v4/` 保留原始 reporter/timeline/evidence。不得继续在已停止/封存身份上追加 validation；新 fix 需新 source identity。

## 22. Acceptance Decision

`acceptance.json` 已记录 **P2_NOT_ACCEPTED**、STOPPED_CODE_DEFECT 和两个 OPEN blockers。调查清单、T1/T2/T3、证据审计、分类与报告已完成；产品修复、T4 0 FAIL、fresh R0/live/provider/metric/final integrity 均未完成。制品封存校验状态以 `seal-verification.json` 为准。

最终十六问：

1. **十四个失败分别是什么类型？** F08 当前为 NONDETERMINISTIC_TEST_RUNTIME；F14 当前为 EVIDENCE_WRITE_CLEANUP_RACE；F01–F07、F09–F13 共十二题的历史唯一根因为 UNRESOLVED，逐题症状/候选/反证保留。新 Loader EPIPE 另列产品缺陷。
2. **哪些 isolated 复现？** 有效 v4 T1 无，14/14 PASS；不据此排除产品 race。
3. **哪些在 same-file 观察到？** 原十四题仅 F08；另有六个新增 case。仅是本矩阵观察范围，不能推断永远只在 same-file。
4. **哪些在 combined/full 观察到？** 原十四题 F14 在 T3 失败；T3 另有六个新增 case。T4 未运行，不能判断 full-only 类型。
5. **子进程何时结束？** 每个 process 的 direct/runner/stream/join 时间在 audit；EPIPE 实例 clean close=26975032759900ns，仍在后续 dispose 拒绝 join。
6. **workflow 为什么未 settle？** F14 body timeout 时 caller-owned resume/locked/verify/operation/save 尚待 finally save/lock release，teardown 抢先；正常 BUSY+receipt 并非漏 settle。
7. **evidence 未生成、太早读取还是 cleanup？** 当前 F08 正常生成 TIMEOUT receipt；F14 late writer 遇到 cleanup；历史 F06/F12 PID 不能精确区分，未伪造归因。
8. **有 abort/cancellation race 吗？** 有已证明的 terminate EPIPE→range promise irreversible rejection→clean proof 无效链；target/range abort 边界分开记录。
9. **有 cross-test leakage 吗？** F14 的五个 prior pending 已观察到；Mock/revision/cache 状态污染或 cross-file accumulation 未证明。
10. **timeout 真的过紧吗？** 没有满足“唯一原因是测试 deadline 太短且无 race”的证据。F08 是 product-stage 5s，F14 有 cleanup ownership race；未调整 timeout。
11. **发现 deterministic product defect 吗？** 发现给定 IPC 事件顺序下确定发生的产品 promise/ownership 缺陷；触发概率/isolated 频率与新单元 fixture 尚未验证。
12. **最小修复是什么？** 下一任务在新 source identity 下分离 control-send 与 range proof、正确释放 ownership并保留 fail closed；另明确 test caller/teardown settlement。当前未应用产品 fix。
13. **Formal D 最终 0 FAIL 吗？** 否；T4 NOT_RUN，最新已执行正式 D 仍为 468/14/18。
14. **Fresh R0 10/10 吗？** 未执行，不能声称。
15. **Vivado live 通过吗？** 未执行，不能声称。
16. **P2 可以 ACCEPT 吗？** **不能。P2_NOT_ACCEPTED**，需独立新身份修复与新 regression，Formal D 满足 0 FAIL 后再按序做后续门禁。
