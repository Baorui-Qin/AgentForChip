---
description: "Opt-in Icarus RTL compilation and simulation with bounded diagnostics for local Harness development."
kind: "package-reference"
---

# RTL Tools

English | [中文](README.zh.md)

## Summary

`run_simulation` compiles configured RTL and a trusted testbench, runs Icarus, and returns bounded diagnostic facts. It neither changes source files nor repairs RTL. This is a source-loaded local plugin, not a published workspace package or a formal competition evaluator.

## Table of Contents

- [Load the tool](#load-the-tool)
- [Results and artifacts](#results-and-artifacts)
- [Configuration](#configuration)
- [Verification](#verification)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)

<a id="load-the-tool"></a>
## Load the tool

Prerequisites are a working source checkout of Harness, same-host `iverilog` and `vvp` executables, and the existing tools, subprocess, sandboxPolicy and sandbox services. The base profile supplies those services. Install and validate dependencies before offline deployment; the tool itself performs no network requests.

Edit [cordis.patch.yml](cordis.patch.yml) to set the absolute plugin path, workspace directory, trusted top, and ordered source list. The checked-in paths target `D:/deepseek-harness`. The model supplies only `{"top":"counter_tb"}`; it cannot substitute sources, executables, flags, or verdict markers. Sources and include directories resolve relative to `workspaceRoot`; source paths may point to externally mounted read-only testbenches.

From the repository root, inspect the composition without calling a model:

```powershell
pnpm dsh --profile headless --patch ./rtl-tools/cordis.patch.yml --dump-config
```

After configuring the profile's model provider and installing Icarus, the intended interactive invocation is:

```powershell
pnpm dsh --profile headless --patch ./rtl-tools/cordis.patch.yml "Call run_simulation with top counter_tb. Report the observed result."
```

The profile must allow workspace writes covering the configured workspace. Read-only mode is rejected. Workspace-write calls use the configured sandbox and reject partial or unavailable enforcement; there is no automatic unconfined fallback or escalation. Existing explicit danger-full-access policy is respected, not selected by this plugin.

<a id="results-and-artifacts"></a>
## Results and artifacts

The canonical result contains `status`, `stage`, `backend`, `summary`, `errors`, `warnings`, per-command `runs`, and `artifactsDir`. Compiler failure prevents simulation. Nonzero exits, terminating signals, timeout, cancellation, recognized errors, and the configured whole-line failure marker take precedence over PASS. A zero simulation exit requires the configured whole-line PASS marker and complete diagnostic lines to return `PASS`; otherwise the result is `UNCONFIRMED`. No outcome implies synthesis success.

Native text includes bounded errors, warnings, exit facts and artifact location. It shows a bounded unclassified tail only for unsuccessful runs without recognized errors. The parser preserves original diagnostic messages and locations, removes ANSI noise, deduplicates retained diagnostics, and reports omissions without guessing which syntax error caused another. Output is untrusted data, not a source of instructions.

Each call creates a unique `.rtl-sim-*` directory directly in the workspace. It retains `commands.json`, `sim.out` when compilation produced it, stage-specific stdout/stderr logs, and `result.json` for completed domain outcomes. Log files keep a capped raw prefix; parsing continues through the entire stream, so later failures are not hidden by the log cap. Oversized diagnostic lines and capped logs are marked explicitly. Missing executables, file access errors, provider failures and sandbox refusal surface as Harness tool errors rather than invented RTL failures; these can leave partial artifacts without `result.json`.

<a id="configuration"></a>
## Configuration

Required fields are `workspaceRoot` (absolute existing directory), `top` (simple module identifier), and nonempty `sources` (ordered files including the supplied testbench). Optional fields and development defaults are:

| Field | Default | Meaning |
|---|---|---|
| `iverilog`, `vvp` | Executable names | Resolved by the subprocess provider |
| `includeDirs` | `[]` | Explicit compiler include directories |
| `timeoutMs` | `30000` | Deadline per stage, not an official competition budget |
| `graceMs` | `1000` | Provider termination grace |
| `maxLogBytes` | `4194304` | Per-stage, per-stream raw log byte cap |
| `maxDiagnostics` | `5` | Retained errors and warnings, each per stage |
| `maxLineChars` | `400` | Diagnostic line and fallback tail character cap |
| `passMarker`, `failMarker` | `PASS`, `FAIL` | Distinct exact whole-line testbench evidence |

Processes use exact argv with no shell interpolation. The compiler uses `-g2012 -Wall -s`; the runtime uses `-N`, making `$stop` noninteractive and unsuccessful, as documented by [Icarus](https://steveicarus.github.io/iverilog/usage/vvp_flags.html). Both stages run in the unique artifact directory. Testbenches using relative data files need adaptation of their trusted inputs; this tool does not silently copy or discover them.

<a id="verification"></a>
## Verification

The focused suite exercises the real Loader, tool registry, agent loop and local subprocess provider with deterministic external CLI fixtures. It snapshots both Native output and the session-recorded tool result, and checks that the next model request receives the same compact facts. No model API key is needed.

```powershell
pnpm exec vitest run --config rtl-tools/vitest.config.ts
pnpm exec tsc -b rtl-tools/tsconfig.json --pretty false
```

The optional actual-Icarus test requires both `RTL_IVERILOG` and `RTL_VVP` environment variables to point to same-host executables. Without them, that test is visibly skipped, not reported as a successful real simulation. The local suite is not the repository's shipped-profile recorded-session replay corpus.

## Model Experience

The plugin adds one schema and no system-prompt section. It replaces raw EDA stdout with deterministic bounded observations; errors retain file and line information for the model to reason about and repair. Configurable bounds limit context growth even when a testbench emits many lines.

#### KV Cache effect

Mounting or changing this tool's schema changes the tool portion of the request prefix. Repeated runs use the same schema; only normal tool-result history grows. The tool does not rewrite prior messages.

<a id="known-limitations-and-deferred-work"></a>
## Known Limitations and Deferred Work

Icarus is a development backend. The supplied competition memo identifies Vivado/Vitis 2025.2 with `xvlog/xelab/xsim` as the formal path; this plugin does not implement that path, synthesis, Baseline, the local model setup, or a repair workflow. Those facts are taken from the supplied memo, not independently verified official scoring rules.

PASS markers are testbench evidence, not an unforgeable evaluator verdict: candidate RTL can also print text. The deployment must protect the testbench, configuration, evaluator and reference files with read-only mounts and an external trusted scorer. Fixing the source list does not prevent other tools or simulation code from modifying files allowed by the surrounding sandbox. File sandboxing does not isolate network or constrain waveform disk usage; use an offline, resource-limited container for adversarial designs.

The plugin uses host filesystem APIs and therefore does not support remote subprocess providers. It retains artifacts without automatic deletion; the deployment owns retention and disk quotas. Only one configured testbench top is exposed per plugin. No runtime invariant companion is published because the plugin owns no independent registry or projection; managed process ownership remains with the subprocess provider.
