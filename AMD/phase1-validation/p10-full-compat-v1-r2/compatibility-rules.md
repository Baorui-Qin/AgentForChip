# Vivado 2025.2 Compatibility Rules

Protocol: VerilogEval V2 tasks evaluated with Vivado 2025.2 compatibility evaluator v1. Upstream revision: c498220d0a52248f8e3fdffe279075215bde2da6. This is not an unmodified official VerilogEval score.

## VIVADO_COMPAT_001, Version 1

Name: move_tb_match_declaration_before_first_use. The Host-only converter authenticates exact original bytes against the Git-verified catalog, masks comments and strings, checks the complete recognized module prefix and a unique declaration pair, and moves two existing complete lines before the waveform initial block. Original line endings are retained. Diff and inverse line mapping prove every other byte is unchanged.

Stimulus, reference logic, expected values, comparison operators, clock/reset, delays, timeout, sampling, final verdict and dumpvars are not changed. No rule is exposed as an Agent tool or model context. Runtime scoring loads previously built bytes and never calls the converter.

Zero or multiple matches, incorrect expressions, unrecognized scopes/templates and malformed text never trigger guessed edits. Files remain byte-identical and in the full manifest. Unknown/multiple/error cases require manual review. In this pinned checkout, 155 TBs match; Prob156_review2015_fancytimer has another wire tb_match in stimulus_gen's input ports and is conservatively MULTIPLE_MATCH. It is retained unchanged, not dropped and not declared ready.

## Host Timescale Policy

Declaration-only real runs retain their elaboration errors, including XSIM 43-4099 for modules without a timescale. The reviewed testbenches explicitly use 1 ps / 1 ps. The calibrated Host configuration adds xelab -timescale 1ps/1ps as a default only; it does not use -override_timeunit or -override_timeprecision and does not rewrite any HDL timescale or 5 ns synthesis clock. This is separate evaluator configuration, not another source transformation.

## Reproducibility and Freeze

The explicit build_epoch in freeze.json is the provenance conversion timestamp for both deterministic builds. Both 156-task builds are compared byte-for-byte, including their manifests. Per-task receipts bind upstream path/revision/hash, derived hash, rule/version, converter-source digest, patch and line map. The manifest is a build-time artifact: its tool_validation NOT_RUN means validation had not run at build time. Later real-tool evidence is stored separately in compatibility-validation.json and the fixed-ten report.

After representative calibration, the master derived directory is sealed using a Windows deny-write/delete ACL for the worker SID. Real write, create and delete probes must fail. Every run uses a private managed snapshot, build directory, waveform and logs. Workers cannot write the master with the tested identity. This is not a claim of isolation from a malicious administrator able to change permissions.

## Scoring and Remaining Work

The existing P10 shared loader selects this full suite when its derived directory contains suite-format.json. Unsealed or hash-mismatched assets fail closed. Both comparison arms bind the same effective TB hash and compatibility identity, including Vivado version and full manifest hash, into snapshot and verification inputs. Agent code, prompts, P09 strategy, skills, repair budget and model settings are unchanged.

Only real positive/negative calibration and preflight can establish EVALUATOR_READY. Original blocked evidence is retained, and compatibility migration is not Agent repair. The new model comparison and forty-task expansion are NOT_RUN. A future P10 model campaign must use a new source freeze and preflightRoot pointing to this report directory, retaining current model settings; do not reuse an old campaign freeze or merge scores across evaluator identities.

The first full-suite attempt is retained at ../p10-full-compat-v1. Its reporting predicate incorrectly rejected the informational vivado -version exit code 1 despite matching version output. The corrected predicate and regression test accept that documented existing convention only for version probes; actual compile, elaborate and simulation commands still require exit code zero. No TB rule, verdict criterion, Agent or model setting changed for this retry.

Icarus crosscheck: NOT_RUN, because neither iverilog nor vvp was found on PATH. No dependency was installed and no cross-simulator equivalence is claimed.
