# RTL alignment development package

This development package supports the explicit protocol mock and a separate API candidate solver. It is not an offline submission or an OS-isolated competition environment. Source ownership remains in the harness `rtl-tools/reference` and `rtl-tools/src/reference` directories. No research campaign, oracle, reference RTL, testbench, history, or model weights are packaged here.

Install the isolated profile once, then select mock explicitly:

```powershell
$env:DSH_HARNESS_ROOT = 'D:\deepseek-harness'
$env:DSH_HOME = 'D:\AMD\rtl-reference-alignment\runtime-home'
# Skip installation if this profile already exists; the installer refuses overwrite.
pwsh -File "$env:DSH_HARNESS_ROOT\rtl-tools\reference\setup-profile.ps1" -HomeDirectory $env:DSH_HOME
$env:LLM_BACKEND = 'mock'
.\run.ps1 '<task_dir>' '<fresh_out_dir>'
```

The shell interface is `run.sh <task_dir> <out_dir>` with the same environment variables. Use absolute `DSH_HOME` and `DSH_HARNESS_ROOT` paths. Linux executable modes, signals, package dependencies and offline portability remain stage 4 work.

Only `prompt.txt` is required. Module and ports come from `module named Name` and `- input/output/inout name (N bits)` bullets; one bit is the default. Unsupported declarations fail explicitly. `interface.txt` is neither required nor authoritative. Each invocation writes `solution.v`, `trace.jsonl` and private `.rtl-invocation/run-*` evidence. An existing output pair or invocation claim is never reused, even after a failed run. A pre-created output directory containing selftest's `run.log` is allowed.

`RTL_MOCK_OUTCOME` accepts `stub` (default, zero-driven interface fixture), `empty`, `error`, `timeout`. All trace lines say `explicit_mock_protocol_only`, with zero real model calls. `RTL_TIMEOUT_MS` defaults to 30000 for development; it bounds mock task processing, not CLI startup or final filesystem flush, and is not the official deadline. No results count toward L0-L3, pass@1, or gain. Do not run scoring on these fixtures.

`baseline.py` and `run_baseline.sh` are byte-for-byte copies of the frozen reference. They ignore `LLM_BACKEND=mock` and make real HTTP calls: never invoke them in protocol-only tests. API development uses independent Agent and baseline calls to the same bounded loopback relay; the relay adds authentication without rewriting prompt or sampling. P10's shared initial candidate is not this baseline. The completed API smoke and still-unverified local Qwen deployment are separated in [model/MODEL.md](model/MODEL.md).

For API mode, install the source harness's `setup-api-profile.ps1` into a fresh home, explicitly consent to unisolated development, and set `LLM_BACKEND=api`. Only `check_rtl` is exposed. API output is `candidate_ungraded`, never VERIFIED. The source README documents provider configuration, local placeholder credentials and fixed development limits. The experimental relay is stopped after the run; it is not an always-running service.

The future Dockerfile, deployment manifest, isolated runtime and solve HTTP service are not represented by dummy files. See [frozen rules](../rules.zh.md), [stage 0/1 evidence](../../doc/RTL_Alignment_Stage01_Execution.zh.md) and [stage 2/3 evidence](../../doc/RTL_Alignment_Stage23_Execution.zh.md).
