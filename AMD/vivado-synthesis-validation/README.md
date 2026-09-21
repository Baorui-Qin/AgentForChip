# Registered run_synthesis Validation

Validated on 2026-09-14 with Vivado 2025.2, build 6299465, through the real Cordis Loader, tool registry and Harness-managed local subprocess provider. No model API call or API key was used. The final real tests also exercise workspace paths containing spaces.

## Final Real Runs

| Candidate | Tool success | Synthesizable | LUT / FF / BRAM / DSP | WNS (ns) |
| --- | --- | --- | --- | --- |
| Constrained counter | true | true | 2 / 4 / 0 / 0 | 4.405 |
| Syntax error | false | false | Unknown | Unknown |
| Constant combinational output | true | true | 0 / 0 / 0 / 0 | null: no_clocks |

- [Counter result](<rtl loader-xGDkxm/.rtl-synth-Yuhm0i/result.json>)
- [Counter utilization report](<rtl loader-xGDkxm/.rtl-synth-Yuhm0i/utilization.rpt>)
- [Counter timing report](<rtl loader-xGDkxm/.rtl-synth-Yuhm0i/timing.rpt>)
- [Syntax-error result](<rtl loader-l5tot1/.rtl-synth-YLhBht/result.json>)
- [Combinational result](<rtl loader-LmG7F2/.rtl-synth-OQmVVI/result.json>)

The counter clock report confirms a 5.000 ns period. Its WNS is positive, but WHS is -0.063 ns and Vivado states that timing constraints are not met. The tool retains this as a warning. These are post-synthesis estimates, not post-route timing closure; no placement or routing was performed.

The syntax-error result retains Vivado code `Synth 8-2716` and line 1 of the generated candidate. The combinational case has no clock constraints and returns null WNS rather than fabricating zero slack. All candidates are handwritten known fixtures, not evidence of model benchmark accuracy or a model-driven repair loop.

## Checks

- Focused plugin suite: 50 passed, 4 optional real-EDA cases skipped in the keyless fixture run.
- Explicit real-Vivado run: all 3 cases passed their expected outcomes; real Icarus was not enabled.
- Recorded-session snapshot verification: simulation and synthesis both passed after obsolete snapshot cleanup.
- TypeScript strict check and targeted oxlint: passed.
- README and Agent Note bilingual pairing, Markdown wrapping, relative links and Agent Note format: passed.
- The synthesis patch composes successfully through `pnpm dsh --profile headless --patch ./rtl-tools/cordis.synthesis.patch.yml --dump-config`.

Real-EDA tests use explicitly configured full-access policy for trusted fixtures. They do not establish production file-sandbox compatibility. Refusal tests confirm that the plugin does not fall back to unconfined execution. Linux Vivado, adversarial container isolation, model API integration and Vivado simulation remain outside this validation.

Earlier failed debugging runs remain in this directory for traceability. The links above identify the accepted final runs.
