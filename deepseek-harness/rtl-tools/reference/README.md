# Reference directory adapter

English | [中文](README.zh.md)

## Summary

Run an unregistered prompt-only task through a protocol mock or a bounded API development solver. Both use supported dsh profiles and write candidate RTL plus trace evidence. Neither path runs a reference judge or claims hidden-test correctness.

## Table of Contents

- [Run a task](#run-a-task)
- [API development](#api-development)
- [Inputs and outcomes](#inputs-and-outcomes)
- [Implementation and checks](#implementation-and-checks)
- [Known limitations](#known-limitations)
- [Dev Note](#dev-note)

<a id="run-a-task"></a>
## Run a task

From a configured source checkout with its existing dependencies, install the isolated profile once. The installer refuses to replace a profile. Keep DSH_HOME absolute and separate from research profiles. These PowerShell commands use fresh directories chosen by the caller:

```powershell
pwsh -File rtl-tools/reference/setup-profile.ps1 -HomeDirectory $env:DSH_HOME
$env:LLM_BACKEND = 'mock'
pwsh -File rtl-tools/reference/run.ps1 $taskDir $outDir
```

The equivalent shell entry is `sh rtl-tools/reference/run.sh <task_dir> <out_dir>` with the same environment. Both entries preserve caller-relative paths before selecting the source checkout. The profile installs no network, credentials, LLM, or EDA plugins.

<a id="api-development"></a>
## API development

Install [setup-api-profile.ps1](setup-api-profile.ps1) with explicit `HomeDirectory`, `BaseUrl`, `Provider`, `Model`, `Xvlog`, `Vivado` and `AllowUnisolatedDevelopment` arguments, then set `LLM_BACKEND=api`. This selects `rtl-reference-api`, not research P10. The installer refuses existing profiles. The pi-ai adapter requires an API-key reference even for anonymous local servers: its default reference is `RTL_LOCAL_RELAY_KEY`; set that variable to a non-secret placeholder for the loopback relay. `ApiKeyEnv` selects another reference when needed. Real credentials belong only to the separately composed relay.

`ThinkingFormat=none` is the default for the Qwen-compatible route; `ThinkingFormat=deepseek` explicitly enables DeepSeek replay fields for API development. The solver does not set reasoning effort or import the P10 tokenizer. Context capacity is a configured 32768 tokens; the 32768-byte request cap is a separate safety limit, not a calibrated tokenizer. Server context errors terminate the run. Template/tokenizer hashes and GPU memory still need local-model measurement.

The generated profile permits four model attempts, 8192 output tokens per call, a 480000 ms solve deadline and 120000 ms EDA commands. It mounts only the agent kernel, provider and managed subprocess service. The single `check_rtl` tool accepts source text, never a filename or command. It checks the public constant-width input/output interface, Vivado syntax and DUT-only synthesis with no testbench or reference data. Inout, file directives, strings, escaped identifiers, system tasks and foreign code are deliberately unsupported. Tool results are self-check facts, not L2, timing closure or VERIFIED evidence.

The existing agent loop owns conversation and tool execution. A bounded stream guard admits tools only after complete raw JSON, closed blocks and a successful terminal finish; provider-repaired or truncated arguments never execute. Each request, raw chunk, tool result and frozen candidate digest is recorded; the durable Session events are written to the invocation directory after draining. Final text without a checked candidate yields an empty answer. Aborted, truncated, errored or over-budget runs publish an empty solution.

The optional [relay plugin](../src/reference/relay.ts) serves only loopback `/v1/models` and `/v1/chat/completions`. It verifies the selected model against upstream metadata, adds Authorization, and forwards request bodies without altering prompts or sampling. Configure a fresh evidence directory, explicit model/credential reference and request/time/cost-reservation caps. Failed dispatched calls consume slots; the relay never retries. Restarting requires a new ledger plus the remaining call cap and original `startedAt`, not a fresh experiment budget. An unmodified reference baseline can use this relay independently through `LLM_BASE_URL` and `MODEL_NAME`.

<a id="inputs-and-outcomes"></a>
## Inputs and outcomes

Only `prompt.txt` is read from the task directory. The supported reference grammar declares `module named Name` and one `- input/output/inout name (N bits)` bullet per port; omitted width means one bit. Unsupported declarations, duplicates, empty prompts and missing files fail explicitly. `interface.txt` is ignored even when nonempty. This parser does not claim to parse arbitrary prose or HDL declarations.

Every admitted invocation has a private `.rtl-invocation/run-*` directory containing its prompt, solution and trace. Root `solution.v` and `trace.jsonl` are the external outputs. Existing outputs or a prior invocation claim cause refusal without replacing evidence; callers use fresh output directories for repeated task names. A directory containing only selftest's `run.log` is accepted. Invalid argv, invalid configuration or unwritable destinations can fail before output creation and are reported on stderr.

| Configuration | Meaning |
| --- | --- |
| `LLM_BACKEND` | Explicit `mock` or `api`; neither silently falls back to the other. |
| `RTL_MOCK_OUTCOME` | `stub` by default, or `empty`, `error`, `timeout`. Stub drives outputs to zero and is not a solution. |
| `RTL_TIMEOUT_MS` | Positive integer, default 30000; development task-processing limit, not an official budget or a CLI startup deadline. |

| Terminal status | Exit code | Solution |
| --- | --- | --- |
| `mock_candidate` | 0 | Marked interface fixture |
| `candidate_ungraded` | 0 | Last checked API candidate, not a correctness verdict |
| `empty_answer` | 0 | Empty |
| `invalid_input` | 2 | Empty when output admission succeeded |
| `internal_error` | 1 | Empty when output storage remains writable |
| `timeout` | 124 | Empty |
| `cancelled` | 130 | Empty |

Trace lines contain Unix-second timestamps, tool names and an explicit evidence category. Mock traces use `explicit_mock_protocol_only`, `mock_generate` and zero real model calls. API traces use `api_development_ungraded` and `model_call_attempts`; the relay ledger, not a failed adapter attempt, establishes physical dispatch counts. All results retain `graded: false`. Failed writes propagate as process errors; a storage failure does not promise a complete trace.

<a id="implementation-and-checks"></a>
## Implementation and checks

The [mock plugin](../src/reference/index.ts) and [API plugin](../src/reference/api.ts) bind readiness and cancellation to the [directory runner](../src/reference/task.ts). Disposal aborts and joins active work. The API [solver](../src/reference/solver.ts) reuses the agent loop and managed EDA process owner, without importing research evaluators. The [API decision](../../.agents/notes/implemented/feature/2026-09-28-rtl-reference-api.md) explains why [P10 research acceptance](../phase1/p10/README.md) remains independent.

Focused tests cover output snapshots, invalid inputs, repeat/concurrent admission, explicit outcomes and profile disposal:

```sh
node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts rtl-tools/tests/reference-task.spec.ts
node node_modules/typescript/bin/tsc -p rtl-tools/tsconfig.json --pretty false
node node_modules/oxlint/bin/oxlint rtl-tools/src/reference rtl-tools/tests/reference-task.spec.ts
```

<a id="known-limitations"></a>
## Known limitations

Mock runs create no Session; API tests use the real loop with a keyless scripted adapter and owner-local snapshots. Windows PowerShell and Git Bash checks do not validate Linux executable bits, SIGTERM grace, startup-inclusive deadlines or offline packaging. The API profile explicitly reports `isolation: capability_only`: its tool allowlist is not OS read confinement, and Windows write-restricted ACLs do not isolate judge assets. Production use needs a read-confined environment and independent file-access audit. External judging happens only after the candidate is frozen and the solver exits; it is not a repair tool. API success does not establish local Qwen readiness or the single-card memory limit.

<a id="dev-note"></a>
## Dev Note

None.
