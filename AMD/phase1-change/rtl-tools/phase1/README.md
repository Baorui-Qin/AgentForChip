---
description: "Keyless environment preflight and versioned RTL task, result and event records."
kind: "package-reference"
---

# Phase 1 Foundations

English | [中文](README.zh.md)

## Summary

Run a keyless development preflight and validate project-owned task and result JSON before connecting a model. The doctor preserves command facts and an environment snapshot; the event recorder persists independent samples without confusing them with internal revisions. These are P00/P01 components, not acceptance of an RTL Agent or a competition evaluator.

## Table of Contents

- [Preflight](#preflight)
- [Data and events](#data-and-events)
- [Verification](#verification)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)

<a id="preflight"></a>
## Preflight

Edit the absolute paths in [configs/dev.yaml](configs/dev.yaml) and [cordis.patch.yml](cordis.patch.yml). Create the configured output directory before launching a workspace-write profile. The example uses `D:/AMD/phase1-validation` under the explicit `D:/AMD` writable workspace. It pins Vivado 2025.2, `xczu3eg-sbva484-1-e` and 5 ns; limits such as 120 seconds per command and four threads are development settings, not official budgets. The YAML reader rejects executable tags and unknown fields. `model: null` is mandatory until a model adapter is connected; do not put credentials in this file.

From the repository root:

```powershell
pnpm dsh --profile headless --patch ./rtl-tools/phase1/cordis.patch.yml doctor
```

The overlay disables the headless model runner, startup argument parser, telemetry exporter and unused RPC metadata loader for this invocation. It does not change shipped profiles or the agent loop. The application begins only after successful Loader startup and requests exit through the launcher after managed child cleanup. It obeys workspace-write policy, rejects incomplete file-sandbox enforcement and never retries unconfined. A policy refusal is a valid failed preflight, not an EDA pass. Handwritten smoke tests with separately authorized full access cannot establish least-privilege readiness for model-generated HDL.

Each invocation creates a new `doctor-*` directory. `doctor.json` records observed version probes, exact target-part query and the handwritten counter's synthesis result. `environment.lock.json` records the repository commit or null, dirty-state observation, dependency-lock hash, extension source hashes, resolved development settings, OS/Node details and hardware observations. Version banners allow informational exit code 1, but only a clean target query and successful synthesis/report execution can establish `eda_ready`. Truncated logs cannot establish readiness. There is no silent version or device substitution.

The terminal line contains status and artifact location. Exit 1 means `EDA_NOT_READY` or a startup/configuration failure; exit 2 means EDA preflight passed but `MODEL_NOT_READY`. No exit 0 is available without model readiness. A directory with only `started.json` and no terminal `doctor.json` remains incomplete. Detailed reports and capped raw logs stay on disk, not in model context. A missing GPU observation, ROCm version or inference-backend version stays null/unverified, not an inferred zero or success.

<a id="data-and-events"></a>
## Data and events

[contracts.ts](../src/phase1/contracts.ts) owns schema version `1.0` for `TaskSpec`, `ModelResult`, `StageResult` and `RunResult`. [examples.json](examples.json) contains four validated examples, explicitly not measured runs. Public tasks contain no trusted testbench or reference source. The text-only model result requires empty `tool_calls`; unavailable token usage and non-streaming TTFT remain null. Unknown fields/enums, unsafe integers, missing identifiers and invalid digest strings reject rather than being defaulted.

Artifact references are portable relative paths. Absolute paths, traversal, backslashes, Windows alternate streams and reserved device names reject. Original diagnostic locations may still contain absolute Windows paths because they are observations, not filesystem capabilities. JSON validation does not prove that a file is confined or that a result is true. Simulation PASS requires nonempty evaluator evidence; final PASS requires all four stages with the same snapshot and verification key. Actual evidence authentication and source-hash verification belong to the future evaluator and immutable snapshot store.

[recorder.ts](../src/phase1/recorder.ts) creates one private host-owned run directory per independent sample. Its event envelope joins `experiment_id`, `task_id`, `sample_id`, `revision_id` and `call_id`; model-start events retain the actual prompt without transport headers. Writes are serialized and flushed, timestamps use UTC, and elapsed durations use a monotonic clock. Event byte overflow fails closed rather than silently truncating evidence. The host must keep the directory inaccessible to candidate code; this library does not install OS permissions for adversarial HDL.

The recorder persists `run.json` and `run_started` before returning. Terminal publication writes `run_finished`, then a same-directory temporary JSON file, flushes it and atomically renames it to `result.json`. No append is accepted after terminal publication begins. `inspectRun` reports `INCOMPLETE` when the terminal file is missing and rejects corrupt or cross-task results. It does not label a possibly live owner ABORTED; an owning workflow must first establish termination. Project events do not replace or migrate released Harness Session records.

<a id="verification"></a>
## Verification

Run the scoped checks from the repository root:

```powershell
node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts
node node_modules/typescript/bin/tsc -p rtl-tools/tsconfig.json --pretty false
node node_modules/oxlint/bin/oxlint rtl-tools/src rtl-tools/tests
```

The keyless event snapshot links a fixed mock request to a fixture stage and a terminal result. Doctor tests inject version mismatch, missing device, missing netlist and sandbox refusal using managed fixture processes. These checks establish interface and failure behavior only; the real EDA smoke and real model/ROCm evidence are separate acceptance work. Existing simulation and synthesis tests remain in the same suite.

<a id="model-experience"></a>
## Model Experience

The doctor sends no model request and registers no model-callable tool. It is a host preflight application, not a new autonomous control loop. Its JSON records and examples must not be presented as real-model performance measurements.

<a id="known-limitations-and-deferred-work"></a>
## Known Limitations and Deferred Work

G0, G1, G2 and official-image readiness remain unaccepted in the environment snapshot. This scope does not implement the Vivado simulation chain, trusted external verdicts, read-only evaluator isolation, immutable candidates, a local-model adapter, repairs, Baseline, batch metrics or ROCm/offline verification. Windows GPU inventory is observational; Linux GPU collection and actual model reachability require the deployment integration. HLS can be represented by the task schema but has no execution path. No API key is needed for these foundations.

## Dev Note

[Bounded RTL verification facts](../../.agents/notes/implemented/feature/2026-09-13-rtl-simulation-tool.md).
