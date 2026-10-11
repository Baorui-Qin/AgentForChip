# Agent Note: Native runner dependencies and terminal-aware test waits

Status: implemented

English | [中文](2026-10-10-native-runner-and-terminal-waits.zh.md)

## Problem

Repeated Windows source-runner startup imports parent process collection and Host services through environment construction even though the child only needs target selection and executable lookup. Separately, a Loader test can continue polling for an expected successful exit after the real command has published failure; a seven-fixture test can overwrite the first target's run identity with a later fixture. A bounded event prefix can omit cleanup observations while the independent final range facts remain available.

## Decision

The private [runner-target module](../../../../packages/subprocess/subprocess-local/src/runner-target.ts) owns the existing selector, argv parser and Windows executable lookup bodies. [runner-launch](../../../../packages/subprocess/subprocess-local/src/runner-launch.ts) reexports the same names for parent callers; the child entry and core import the pure module directly. Source, built and packaged launch selection, environment scrubbing, IPC, Job ownership, target arguments and deadlines retain their contracts. This changes the initialization dependency graph, not the isolation model.

The [repair Loader tests](../../../../rtl-tools/tests/repair-loader.spec.ts) subscribe before triggering their exact command and observe its first real terminal before checking the original expected exit. The [development Loader test](../../../../rtl-tools/tests/phase1-loader.spec.ts) binds the first counter fixture and its run; later fixture results cannot replace that target. Existing readiness waits join in-flight reads, detach listeners and retain their original deadlines. Durable production failure publication and the seven-fixture production loop stay intact.

The [Scope](../../../../rtl-tools/tests/test-operation-scope.ts) publishes four fixed cleanup timestamps alongside its final audit. They survive the unchanged 128-event prefix cap, use the same worker clock and describe the actual pre-removal publication point. They neither claim deletion has happened nor fill historical event omissions. Direct exit, range proof, writer settlement and business outcome remain separate under the [continuity contract](../testing/2026-10-09-p3-g1-continuity.md).

The [Target observer](../../../../rtl-tools/tests/helpers/g1-target-witness.ts) optionally records the first nonempty output received on each stream without consuming it. `G1_NATIVE_LIFECYCLE_TRACE=1` enables this bounded diagnostic extension; formal verification clears it together with the [interstep switch](../testing/2026-10-10-p09-interstep-timing.md). The original handle, push arguments and return value are preserved, and observer faults are counted separately. Worker reception does not establish OS runner spawn, target start or producer time, and clocks from separate processes are not subtracted.

Fixed dispatched/resolved/rejected counters for the three existing execution classes survive the unchanged 512-event cap. Their publication does not restore omitted timing events. The retained observer sequence is complete only when neither capacity omissions nor receive-observer errors occurred; its direct-result counts do not replace independent range proof.

## Alternatives considered

**Extend budgets, cache successful versions or isolate Native core work.** These change the accepted work or timing contract. Native calibration, subtree cancellation and the original 15-step workload remain current-candidate checks.

**Move failure publication ahead of durable writes or stop the fixture suite at any failure.** This weakens persistence or changes the suite's intentional negative fixtures. Tests consume the existing terminal facts instead.

**Expand event storage or add a second writer.** This adds unbounded or competing evidence work. Fixed final timestamps complement the existing bounded prefix and managed-range snapshot.

## Consequences

The smaller child dependency graph preserves the existing public entries. It does not guarantee a latency threshold on every host: a single import comparison has lower CPU consumption but greater wall time, and current business measurements remain distinct from historical failures. Terminal-aware waits reveal an upstream failure earlier; they do not turn failed calibration into success. Snapshot completion is not proof of a complete event sequence or of business PASS.

## Verification

The [runner compatibility test](../../../../packages/subprocess/subprocess-local/tests/spawn-runner.spec.ts) exercises the old and new selector/parser entries; existing Windows lookup and protocol tests retain the original parent entry. The [Scope tests](../../../../rtl-tools/tests/test-operation-scope.spec.ts) cover overflowing evidence with proven and unproven ranges. The [Target tests](../../../../rtl-tools/tests/g1-reliability.spec.ts) cover disabled and enabled observation, original handle/output identity and observer failure containment. A real Loader calibration-failure test retains `CALIBRATION_FAILED`, exit one and zero model preparation. These checks accompany current Native, safety, static and full-regression evidence; they do not authorize Provider dispatch or establish Skill effectiveness.
