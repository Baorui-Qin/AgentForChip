# Agent Note: Configured Vivado Version and Experiment Provenance

Status: implemented

English | [中文](2026-09-23-vivado-version-provenance.zh.md)

## Problem

Fixed tool versions in execution checks and evaluator metadata can mislabel new experiments or prevent a configuration-only toolchain migration. Historical logs and hashes remain facts about their original environment.

## Decision

The development YAML owns the expected Vivado release. Doctor, verification and snapshots consume that value; probe artifacts retain the expected and observed release alongside command and process evidence. A mismatched evaluator cannot register with a different configured runtime.

Compatibility identities and manifest filenames derive from the configured release. Calibration probes original upstream testbenches before choosing the declaration-order rule, then probes elaboration before selecting any missing-timescale default. Static conversion never establishes tool validation. The [frozen-suite decision](../bug-fix/2026-09-18-p10-full-compat-suite.md) remains active because its immutability and positive/negative calibration rationale still applies; this note adds version selection without superseding that rationale.

## Alternatives considered

**Replace every old version string.** Rejected because historical experiment provenance would become false.

**Copy a manifest under a new name.** Rejected because original inputs, conversions, tool behavior and hashes require a new calibration.

**Change the configured FPGA to make synthesis pass.** Rejected because target-dependent resource and timing observations would no longer validate the same baseline.

## Consequences

The Phase 2 configuration targets 2026.1 while Phase 1 artifacts keep 2025.2. Raw regression logs have capture metadata and hashes. Missing target-device support blocks synthesis acceptance even when simulation works. No model request, knowledge-base implementation or system-prompt redesign is part of this migration. The [validation report](../../../../../docs/vivado-2026.1/report.md) records completed and blocked checks.
