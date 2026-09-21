# Vivado Toolchain Smoke Test

Verified locally on 2026-09-14 using Vivado 2025.2, build 6299465, installed at
`D:\AMDDesignTools\2025.2\Vivado`. No model API calls or API keys were used.

This directory contains handwritten known fixtures for installation and failure-stage
checks. It is not an agent benchmark and does not measure dataset pass rate.

## Simulation

Run with PowerShell 7:

```powershell
& 'D:\AMD\vivado-smoke\run-smoke.ps1' -Suite local
& 'D:\AMD\vivado-smoke\run-smoke.ps1' -Relax
```

The first command uses the local testbench with strict language checking. The second
uses the original VerilogEval `Prob001_zero` testbench and reference with relaxed
language checking. Both execute real `xvlog`, `xelab`, and `xsim` processes.

| Candidate | Observed status | Stage | Mismatches / samples |
| --- | --- | --- | --- |
| Correct constant output | PASS | simulation | 0 / 20 |
| Incorrect constant output | FAIL | simulation | 20 / 20 |
| Syntax error | FAIL | compile | Not run |
| Missing TopModule | FAIL | elaboration | Not run |

All four expected outcomes were verified in both suites:

- [Local strict results](runs/20260914-194214-f6b71024/summary.json)
- [VerilogEval compatibility results](runs/20260914-194235-a986469a/summary.json)

The script retains raw logs in per-run directories and writes structured results.
Simulation success requires one mismatch summary, zero mismatches, and positive
sample count; a zero process exit code alone is not sufficient.

### Compatibility Limits

The original testbench references `tb_mismatch` before its declaration. Strict
`xvlog` rejects this with `VRFC 10-3380` at testbench line 62. `-Relax` explicitly
adds `xvlog -relax`; this is a development compatibility option, not a claim that
competition rules permit it. The testbench was not edited to avoid the error.

The script supplies `xelab -timescale 1ns/1ps` as the default for modules without
a declared timescale. Existing declared timescales are not overridden.

Dataset location: `D:\AMD\verilog-eval`; revision:
`c498220d0a52248f8e3fdffe279075215bde2da6`.
The testbench and reference hashes were unchanged before and after testing; the
dataset Git working tree remained clean. Only one dataset problem was exercised.

## Synthesis

```powershell
& 'D:\AMDDesignTools\2025.2\Vivado\bin\vivado.bat' -mode batch -nojournal -source 'D:\AMD\vivado-smoke\synthesis\run.tcl' -log 'D:\AMD\vivado-smoke\synthesis\vivado.log'
```

The existing harness counter example synthesized successfully for
`xczu3eg-sbva484-1-e`. The synthesis license and device support worked; the completed
run reported zero errors, critical warnings, and warnings.

- [Synthesis script](synthesis/run.tcl)
- [Synthesis log](synthesis/vivado.log)
- [Clock report](synthesis/clocks.rpt): `clk`, 5.000 ns period
- [Utilization report](synthesis/utilization.rpt)
- [Synthesized checkpoint](synthesis/counter_synth.dcp)
- [Functional netlist](synthesis/counter_netlist.v)

This confirms synthesis with a 5 ns clock constraint, not 200 MHz timing closure.
Placement, routing, and post-route timing were not run.

## Integration Boundary

These are independent toolchain smoke tests. The existing `rtl-tools`
`run_simulation` plugin in `D:\deepseek-harness` still uses Icarus; this work does
not add a Vivado backend or a model-driven repair loop. No RTL was automatically
repaired. A later Vivado integration should preserve structured stage diagnostics
and avoid treating process exit status as the testbench verdict.
