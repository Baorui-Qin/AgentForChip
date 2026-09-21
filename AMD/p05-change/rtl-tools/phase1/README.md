---
description: "Windows Vivado fixture verification, official API text calls and versioned project evidence."
kind: "package-reference"
---

# Phase 1 Development

English | [中文](README.zh.md)

## Summary

Verify fixed handwritten RTL with Windows Vivado and call the DeepSeek official API through separate dsh applications. The doctor preserves environment facts; project records retain independent samples, bounded diagnostics and model responses. Execution controls do not establish OS isolation, an autonomous repair loop or competition acceptance.

The separate [three-route development comparison](comparison/README.md) owns frozen VerilogEval generation, independent Baseline entry, reviewed candidate revisions and comparison reports.

## Table of Contents

- [Preflight](#preflight)
- [Windows fixtures](#windows-fixtures)
- [Official API](#official-api)
- [Single counter](#single-counter)
- [Execution controls](#execution-controls)
- [Data and events](#data-and-events)
- [Verification](#verification)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)

<a id="preflight"></a>
## Preflight

Edit the absolute paths in [configs/dev.yaml](configs/dev.yaml) and [cordis.patch.yml](cordis.patch.yml). Create the configured output directory before launching a workspace-write profile. The example uses `D:/AMD/phase1-validation` under the explicit `D:/AMD` writable workspace. It pins Vivado 2025.2, `xczu3eg-sbva484-1-e` and 5 ns; limits such as 120 seconds per command and four threads are development settings, not official budgets. The YAML reader rejects executable tags and unknown fields. The doctor configuration requires `model: null`; the separate API profile owns model settings. Never put credentials in either YAML file.

From the repository root:

```powershell
pnpm dsh --profile headless --patch ./rtl-tools/phase1/cordis.patch.yml doctor
```

The overlay disables the headless model runner, startup argument parser, telemetry exporter and unused RPC metadata loader for this invocation. It does not change shipped profiles or the agent loop. The application begins only after successful Loader startup and requests exit through the launcher after managed child cleanup. It obeys workspace-write policy, rejects incomplete file-sandbox enforcement and never retries unconfined. A policy refusal is a valid failed preflight, not an EDA pass. Handwritten smoke tests with separately authorized full access cannot establish least-privilege readiness for model-generated HDL.

Each invocation creates a new `doctor-*` directory. `doctor.json` records observed version probes, exact target-part query and the handwritten counter's synthesis result. `environment.lock.json` records the repository commit or null, dirty-state observation, dependency-lock hash, extension source hashes, resolved development settings, OS/Node details and hardware observations. Version banners allow informational exit code 1, but only a clean target query and successful synthesis/report execution can establish `eda_ready`. Truncated logs cannot establish readiness. There is no silent version or device substitution.

The terminal line contains status and artifact location. Exit 1 means `EDA_NOT_READY` or a startup/configuration failure; exit 2 means EDA preflight passed but `MODEL_NOT_READY`. No exit 0 is available without model readiness. A directory with only `started.json` and no terminal `doctor.json` remains incomplete. Detailed reports and capped raw logs stay on disk, not in model context. A missing GPU observation, ROCm version or inference-backend version stays null/unverified, not an inferred zero or success.

<a id="windows-fixtures"></a>
## Windows fixtures

[fixtures.patch.yml](fixtures.patch.yml) explicitly authorizes full access only for the built-in handwritten catalog. Review this risk before invoking it. The host pins a snapshot manifest and asset hashes, then issues a one-call, non-agent permit for each registered snapshot. Tool arguments and API text cannot create a permit or import a manifest. Existing Icarus and standalone synthesis configurations are unchanged.

```powershell
pnpm dsh --profile headless --patch rtl-tools/phase1/fixtures.patch.yml verify-fixtures
```

The host runs `xvlog`, `xelab`, `xsim`, then the existing synthesis runner on DUT-only sources. Each run has a fresh directory; failures leave later stages SKIPPED. Counter, syntax, missing-module, functional and deliberately synthesis-only faults have fixed expected stages. The last case uses a `SYNTHESIS` conditional, not a natural model-generation benchmark. VerilogEval assets are neither imported nor modified.

Simulation PASS requires clean process and diagnostic facts, exactly one complete `PHASE1_COMPLETE` record, positive checks and zero mismatches. Ordinary PASS text, missing verdicts, duplicate verdicts and truncated evidence cannot pass. This protocol is valid only for these host-owned testbenches, not arbitrary hostile HDL. `artifacts.json` indexes retained files; stage records include process facts and synthesis metrics. Positive WNS is not a complete timing verdict or post-route closure. Exit 0 means every fixture behaved as expected, including expected design failures.

<a id="official-api"></a>
## Official API

[api.patch.yml](api.patch.yml) explicitly selects `deepseek-flash`, corresponding to the repository catalog's DeepSeek-V41-Flash entry. Model availability still depends on the account and endpoint. The existing `deepseek-official` provider and credential service own authentication; use the Harness credential store or its `DEEPSEEK_API_KEY` launch environment. No secret belongs in YAML, project events or environment snapshots. The profile sends only one fixed public development prompt per call, never workspace files or reference solutions.

```powershell
pnpm dsh --profile headless --patch rtl-tools/phase1/api.patch.yml model-smoke
```

[callText](../src/phase1/model.ts) consumes one prepared provider stream and returns complete bounded text without tools or retries. Events record the prompt, resolved model/generation parameters, transport, response, usage and terminal error. TTFT stays null with `not_collected`; aggregation does not change the transport from stream. Cancellation aborts the provider signal and releases iteration, but server cancellation remains unconfirmed. The provider must honor its AbortSignal lifecycle contract.

The smoke performs ten serial attempts without replacing failures. Every attempt retains `model.json`, `response.txt`, events and a terminal run. `model_requests_total` counts project call attempts, while `dispatched` means prepared adapter-stream dispatch, not a proven HTTP request count. Provider failures can precede a network request; unavailable token usage remains null. Exit 0 requires ten error-free responses. Saved text has no execution authorization; API-only runs remain unverified for RTL. A failed real smoke is not replaced by a passing Mock snapshot.

<a id="single-counter"></a>
## Single counter

[end-to-end.patch.yml](end-to-end.patch.yml) loads a review-separated development application, not an agent tool. It uses the same official provider and sends only a public four-bit synchronous counter specification. From the repository root, generate one candidate:

```powershell
pnpm dsh --profile headless --patch rtl-tools/phase1/end-to-end.patch.yml generate-counter
```

The command saves the raw response, candidate and SHA-256 in a fresh run directory, then exits without EDA execution. A host operator reviews the complete source before authorizing it; removing an optional whole-response Markdown fence is not HDL validation. Failed model calls or invalid fence extraction retain terminal records without retrying.

For an approved candidate, create a private copy of the overlay. Set `generationDirectory` to that run and `reviewedSourceSha256` to the reviewed bytes' digest, change `sandbox-policy.config.mode` to `danger-full-access`, and add `permission.config.defaultPreset: danger-full-access`. Run `pnpm dsh --profile headless --patch <reviewed-overlay.yml> verify-counter`. This explicitly unconfined experiment is appropriate only for the inspected counter, not arbitrary HDL or unattended model output.

Verification checks the saved model response against the approved source, exclusively claims that run once, and binds the candidate to the unchanged counter testbench and 5 ns XDC. Stages are labelled `reviewed_candidate`, not `trusted_fixture`. It executes one compile/elaborate/simulate/synthesize sequence, then makes one read-only model call with the saved candidate and compact verification facts. No feedback code is executed. A completed experiment therefore has two model call attempts, one candidate and one verification round, with no retries or repairs. A design failure is preserved rather than resampled; exit 0 requires both design PASS and error-free feedback.

The generation directory retains `verification.json` and `end-to-end.json`, linking generation, verification and feedback runs by experiment id. Generation and feedback terminal records remain INCONCLUSIVE for RTL; only verification establishes design PASS. Interrupted runs without a receipt remain incomplete. Do not delete the exclusive claim to conceal an interrupted attempt. Full OS isolation remains false, and this experiment does not replace the independent ten-call API smoke.

<a id="execution-controls"></a>
## Execution controls

`verify_rtl` accepts only a host-issued `snapshot_id`; unknown or consumed ids reject. Its tool registry contains only built-in fixtures. Normal calls require full workspace-write enforcement, even when the deployment selects full access; only the explicit host smoke permit bypasses that requirement. Windows `partial` enforcement refuses ordinary calls without fallback. The separate reviewed-candidate applications do not widen this tool's permissions or expose arbitrary-candidate registration to models.

The snapshot checker rejects traversal, alternate streams, symlinks, junctions and hardlink aliases, and rechecks the pinned manifest and asset hashes before and after each stage. These checks detect changes but do not prevent writes or eliminate hostile concurrent replacement. Managed process groups join before a call completes, including cancellation and plugin unloading. Stage stdout/stderr caps abort execution on overflow. A live artifact audit polls every configured interval and checks again after stages; detected overflow aborts and cannot yield PASS. Polling can overshoot between observations and is not an OS disk quota. Final diagnostic metadata remains available after an output-limit failure.

The development profile sets compile/elaborate/simulation/combined-synthesis budgets to 60/60/30/120 seconds, total verification to 300 seconds, cleanup grace to one second and threads to four. It sets each retained stream/report cap to 4 MiB, artifact audit budget to 256 MiB, audit interval to 100 ms and event cap to 1 MiB. All are trusted configuration values, not official contest limits. Stage evidence keeps environment, resource, policy and design failures distinct; no full-isolation flag can become true in this application.

<a id="data-and-events"></a>
## Data and events

[contracts.ts](../src/phase1/contracts.ts) owns the `1.0` records; [records.ts](../src/phase1/records.ts) reads both `1.0` and `1.1`, adding process, trust, transport and cancellation facts for new development runs. Task examples remain `1.0`. [examples.json](examples.json) contains validated examples, not measurements. Public tasks contain no trusted testbench or reference source. Model results require empty `tool_calls`; unavailable usage and TTFT remain null. Unknown fields/enums, unsafe integers, missing identifiers and invalid digests reject rather than being defaulted.

Artifact references are portable relative paths. Absolute paths, traversal, backslashes, Windows alternate streams and reserved device names reject. Original diagnostic locations may contain absolute Windows paths because they are observations, not filesystem capabilities. JSON validation does not prove confinement or truth. Final PASS requires all four stages with the same snapshot and verification key. Handwritten snapshots bind hashes; authoritative adversarial scoring remains outside this application. The comparison reference owns its candidate management and project schema 1.2 envelopes.

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

Keyless tests cover provider streams and failures, fixed verdicts, managed fixture processes, snapshot mutation, output limits and cancellation. Loader tests exercise registration, argument rejection, partial-sandbox refusal, project-event reconstruction and unloading. Owner-local snapshots cover bounded model-visible output. Mock, real handwritten EDA and real official API artifacts are separate evidence categories; none establishes local model or ROCm readiness. Existing simulation and synthesis tests remain in the same suite.

<a id="model-experience"></a>
## Model Experience

The doctor sends no model requests. `verify_rtl` exposes bounded stage facts, warnings, process outcomes and synthesis metrics that project events can reconstruct; logs remain on disk. The API application exposes no tools to its model. Neither application repairs RTL or treats EDA output as instructions. JSON examples and Mock snapshots are not real-model performance measurements.

<a id="known-limitations-and-deferred-work"></a>
## Known Limitations and Deferred Work

G0, G1, G2, complete OS isolation and official-image readiness remain unaccepted. This scope excludes adversarial authoritative verdicts, read-only evaluator isolation, local inference, repairs, statistical batch metrics and ROCm/offline verification. No Linux Vivado or WSL migration is required for this Windows development chain. HLS can be represented by the task schema but has no execution path. Real API calls require credentials; component tests remain keyless.

## Dev Note

[Bounded RTL verification facts](../../.agents/notes/implemented/feature/2026-09-13-rtl-simulation-tool.md).
