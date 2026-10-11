# AgentForChip

AgentForChip is a workspace for developing and evaluating an agent-based RTL design and repair system. It combines the AMD competition workspace with the customized DeepSeek Harness used by the project.

## Repository layout

- `AMD/`: integration workspace, experiment data, validation artifacts, VerilogEval data, and project documentation.
- `deepseek-harness/`: customized DeepSeek Harness source and RTL-agent extensions.
- `docs/phase2.md`: phase-two research and development plan.

## Vivado baseline

Phase 2 targets AMD Vivado 2026.1. Historical Phase 1 artifacts retain Vivado 2025.2 provenance. See the [migration audit and validation report](docs/vivado-2026.1/report.md); synthesis acceptance requires the configured target device support.

## Snapshot policy

The `tool-skill` branch includes the current RTL tool, diagnostic Knowledge and optional Skill implementation. See the [tool-skill_v1 delivery notes](releases/tool-skill-v1/README.md) for functionality, installation requirements, verified scope and optional P4–P6 candidate sources. Historical artifacts retain their original results; this source delivery does not complete or promote those stages.

Nested Git metadata, local credentials, installers, downloaded toolchains, dependency directories, virtual environments, and reproducible build caches are excluded from the functional source ZIP.

Each imported component retains the licensing terms included in its own directory. No repository-wide license is implied for files that do not already carry one.
