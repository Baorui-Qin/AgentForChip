# Agent Note: Bounded RTL verification facts

Status: implemented

English | [中文](2026-09-13-rtl-simulation-tool.zh.md)

## Problem

RTL repair needs actual compiler and simulation evidence without flooding model context with raw logs. Process success alone cannot establish testbench success, and a first development tool must not change the agent loop or pretend to be the formal competition evaluator.

## Decision

The opt-in [rtl-tools plugin](../../../../rtl-tools/README.md) registers `run_simulation` with one trusted configured top and source list. It consumes existing subprocess and sandbox services. The runner compiles before simulating, streams diagnostics with memory and disk bounds, retains private per-call artifacts, propagates cancellation, and joins managed process ranges before returning. The parser reports observed errors and locations rather than repairing RTL or inferring causal relationships between diagnostics.

PASS requires a clean runtime outcome, a configured whole-line testbench marker, and complete diagnostic lines. Missing evidence is UNCONFIRMED. Testbench markers are not an authoritative scorer and cannot resist a candidate that prints forged evidence. Read-only evaluator assets and external scoring remain deployment responsibilities.

An optional synthesis configuration registers `run_synthesis` with independent design sources, top and trusted XDC files. The tools share bounded stream capture and process ownership, not backend-specific diagnostics or verdict logic. Vivado first exports a netlist and checkpoint, then a separate batch invocation opens the checkpoint for reports. This preserves confirmed synthesizability when reporting fails and costs an additional Vivado startup. Reports supply Used resource counts and post-synthesis WNS; unknown values are null rather than fabricated zeros. A positive WNS is not a complete timing verdict, and a negative WNS does not reject synthesizability.

The [Phase 1 development applications](../../../../rtl-tools/phase1/README.md) keep project records outside released Harness Session data. New records use 1.1 while readers retain 1.0 support. The dsh doctor records observed environment facts and refuses automatic unconfined fallback. A separate Windows fixture application orders compile, elaborate, simulate and synthesize; host-issued snapshot ids bind fixed assets and hashes. Only explicit non-agent, one-call smoke permits allow full access. Ordinary calls require full sandbox enforcement. Hash checks detect mutation but cannot prevent it, so complete OS isolation remains a separate obligation.

The official API application reuses prepared calls and the existing credential provider rather than creating another HTTP client or local inference service. It aggregates a streamed response into bounded text, records the actual prompt and resolved request settings, and never offers tools or executes returned code. Project attempt counts do not claim to measure HTTP delivery. Cancellation releases the client stream without asserting cloud-side termination. Ten sequential attempts preserve failures instead of resampling them into a passing acceptance result.

The single-counter development application separates generation from host review and execution. An explicit source digest authorizes one saved response against an unchanged evaluator; a disk claim prevents reusing that generation for another verification. Its `reviewed_candidate` trust label distinguishes inspected model output from handwritten fixtures. This narrow host-only path makes real feedback observable without granting models a general full-access permit. A second read-only call receives compact facts but cannot execute a repair. The ordinary fixture tool and API-only smoke retain their original authorization boundaries.

The [three-route comparison](../../../../rtl-tools/phase1/comparison/README.md) isolates a genuine Baseline process from Agent and EDA services. Its frozen VerilogEval prompt matches Agent-Base generation exactly; Agent-Domain adds only upstream rules. Host scoring is independent from generation, and one read-only interpretation cannot repair or improve that candidate. Strict substring extraction and exclusive, hash-bound revision/approval/export records prevent silent answer correction and stale PASS reuse. New experiment envelopes use 1.2 while native model/verifier records retain 1.1 and older readers remain compatible. Original-evaluator preflight blocks real generation on incompatibility rather than silently porting the benchmark.

## Alternatives considered

**Direct child_process in the plugin.** This duplicates existing secret scrubbing and process-range cleanup, and can bypass configured file confinement. The plugin uses the existing services instead.

**Return full stdout or only a final tail.** Full logs consume context; a tail loses early compiler errors. Streaming parsing preserves bounded first diagnostics while separately retaining capped raw logs and explicit truncation facts.

**Treat exit zero as functional PASS.** A testbench can terminate without checking the design, so absence of explicit positive evidence is not success.

**Start with a multi-backend workspace package.** A local source plugin avoids changing shipped compositions and workspace metadata. Synthesis remains opt-in, and the separate Vivado fixture application does not replace Icarus behavior.

**Infer resources from synthesis INFO messages or merge all outcomes into one boolean.** INFO messages are not the resource report and can describe intermediate designs. Separate report parsing and nullable synthesis evidence distinguish unsupported report formats, environment failures, and RTL errors. The parser targets Vivado 2025.2 text tables instead of pretending that a later version's JSON option exists in this version.

## Consequences

The implementation adds no local model backend, retry loop, RTL repairs or dataset testbench modifications. EDA execution uses same-host files and processes. Trusted Windows batch arguments reject shell metacharacters and use provider-owned argv quoting; Tcl values are separately escaped. Host verification sequences enforce prior simulation, not the standalone synthesis tool. Polling artifact audits stop observed overruns but are not OS disk quotas. Full-access fixture and reviewed-candidate workflows cannot establish protection against hostile HDL or formal competition readiness. Single-task route differences cannot establish statistical or Agent correctness gains.

Focused tests exercise Loader registration, real agent-loop session recording for the standalone tools, project-event reconstruction, schema validation, managed process cleanup, failure short-circuiting, hash checks, cancellation, plugin disposal and bounded snapshots. API Mock tests cover complete streams, protocol errors, credentials, service failures, timeout and cancellation. Actual Vivado fixtures and official API attempts have separate dsh artifacts, not Mock evidence. Linux Vivado, post-route timing, local model/ROCm and adversarial OS isolation are not established by these components.
