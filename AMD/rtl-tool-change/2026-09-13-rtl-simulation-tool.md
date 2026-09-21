# Agent Note: Bounded Icarus simulation facts

Status: implemented

English | [中文](2026-09-13-rtl-simulation-tool.zh.md)

## Problem

RTL repair needs actual compiler and simulation evidence without flooding model context with raw logs. Process success alone cannot establish testbench success, and a first development tool must not change the agent loop or pretend to be the formal competition evaluator.

## Decision

The opt-in [rtl-tools plugin](../../../../rtl-tools/README.md) registers `run_simulation` with one trusted configured top and source list. It consumes existing subprocess and sandbox services. The runner compiles before simulating, streams diagnostics with memory and disk bounds, retains private per-call artifacts, propagates cancellation, and joins managed process ranges before returning. The parser reports observed errors and locations rather than repairing RTL or inferring causal relationships between diagnostics.

PASS requires a clean runtime outcome, a configured whole-line testbench marker, and complete diagnostic lines. Missing evidence is UNCONFIRMED. Testbench markers are not an authoritative scorer and cannot resist a candidate that prints forged evidence. Read-only evaluator assets and external scoring remain deployment responsibilities.

## Alternatives considered

**Direct child_process in the plugin.** This duplicates existing secret scrubbing and process-range cleanup, and can bypass configured file confinement. The plugin uses the existing services instead.

**Return full stdout or only a final tail.** Full logs consume context; a tail loses early compiler errors. Streaming parsing preserves bounded first diagnostics while separately retaining capped raw logs and explicit truncation facts.

**Treat exit zero as functional PASS.** A testbench can terminate without checking the design, so absence of explicit positive evidence is not success.

**Start with a multi-backend workspace package.** The current task needs one development tool. A local source plugin avoids changing shipped compositions and workspace metadata; Vivado and synthesis remain explicit follow-up work, not unimplemented public options.

## Consequences

The implementation adds no model backend, retry loop, Baseline behavior, RTL repairs or testbench modifications. It is limited to same-host files and processes. The supplied competition memo motivates future Vivado 2025.2 validation but is not a claim that Icarus satisfies formal evaluation.

Focused tests exercise Loader registration, real agent-loop session recording, schema validation, managed processes, failure short-circuiting, cancellation, bounded output and stable Native snapshots. Actual Icarus coverage is separately opt-in and visibly skipped without its executables. The shipped-profile replay corpus and adversarial container enforcement are not covered by this local suite.
