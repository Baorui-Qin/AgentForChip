# Agent Note: Bounded RTL verification facts

Status: implemented

English | [中文](2026-09-13-rtl-simulation-tool.zh.md)

## Problem

RTL repair needs actual compiler and simulation evidence without flooding model context with raw logs. Process success alone cannot establish testbench success, and a first development tool must not change the agent loop or pretend to be the formal competition evaluator.

## Decision

The opt-in [rtl-tools plugin](../../../../rtl-tools/README.md) registers `run_simulation` with one trusted configured top and source list. It consumes existing subprocess and sandbox services. The runner compiles before simulating, streams diagnostics with memory and disk bounds, retains private per-call artifacts, propagates cancellation, and joins managed process ranges before returning. The parser reports observed errors and locations rather than repairing RTL or inferring causal relationships between diagnostics.

PASS requires a clean runtime outcome, a configured whole-line testbench marker, and complete diagnostic lines. Missing evidence is UNCONFIRMED. Testbench markers are not an authoritative scorer and cannot resist a candidate that prints forged evidence. Read-only evaluator assets and external scoring remain deployment responsibilities.

An optional synthesis configuration registers `run_synthesis` with independent design sources, top and trusted XDC files. The tools share bounded stream capture and process ownership, not backend-specific diagnostics or verdict logic. Vivado first exports a netlist and checkpoint, then a separate batch invocation opens the checkpoint for reports. This preserves confirmed synthesizability when reporting fails and costs an additional Vivado startup. Reports supply Used resource counts and post-synthesis WNS; unknown values are null rather than fabricated zeros. A positive WNS is not a complete timing verdict, and a negative WNS does not reject synthesizability.

The [Phase 1 foundations](../../../../rtl-tools/phase1/README.md) keep project JSON at schema version 1.0 outside released Harness Session data. A dsh-launched doctor consumes managed subprocess and sandbox services, records observed environment facts and refuses automatic unconfined fallback. Its readiness report distinguishes EDA from absent model/ROCm evidence. Serial flushed project events and atomic terminal files keep incomplete independent samples visible without falsely declaring a live owner aborted. Schema validation rejects contradictory PASS records but cannot authenticate evaluator evidence or enforce filesystem isolation.

## Alternatives considered

**Direct child_process in the plugin.** This duplicates existing secret scrubbing and process-range cleanup, and can bypass configured file confinement. The plugin uses the existing services instead.

**Return full stdout or only a final tail.** Full logs consume context; a tail loses early compiler errors. Streaming parsing preserves bounded first diagnostics while separately retaining capped raw logs and explicit truncation facts.

**Treat exit zero as functional PASS.** A testbench can terminate without checking the design, so absence of explicit positive evidence is not success.

**Start with a multi-backend workspace package.** A local source plugin avoids changing shipped compositions and workspace metadata. Synthesis is opt-in; Vivado simulation remains outside this plugin's implemented behavior.

**Infer resources from synthesis INFO messages or merge all outcomes into one boolean.** INFO messages are not the resource report and can describe intermediate designs. Separate report parsing and nullable synthesis evidence distinguish unsupported report formats, environment failures, and RTL errors. The parser targets Vivado 2025.2 text tables instead of pretending that a later version's JSON option exists in this version.

## Consequences

The implementation adds no model backend, retry loop, Baseline behavior, RTL repairs or testbench modifications. It is limited to same-host files and processes. Trusted Windows batch arguments reject shell metacharacters and use provider-owned argv quoting; Tcl values are separately escaped. The supplied competition memo motivates Vivado 2025.2 synthesis but is not a claim that Icarus satisfies formal evaluation. The tool does not enforce prior simulation or read-only evaluator mounts.

Focused tests exercise Loader registration, real agent-loop session recording, schema validation, managed processes, failure short-circuiting, cancellation, plugin disposal, bounded output and stable Native snapshots. Actual Icarus and Vivado coverage are separately opt-in and visibly skipped without their executables. Real Vivado tests exercise a constrained counter, a syntax error and an unclocked combinational design through the registered tool. The shipped-profile replay corpus, Linux Vivado execution, post-route timing and adversarial container enforcement are not covered by this local suite.
