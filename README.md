# AgentForChip

AgentForChip is a workspace for developing and evaluating an agent-based RTL design and repair system. It combines the AMD competition workspace with the customized DeepSeek Harness used by the project.

## Repository layout

- `AMD/`: integration workspace, experiment data, validation artifacts, VerilogEval data, and project documentation.
- `deepseek-harness/`: customized DeepSeek Harness source and RTL-agent extensions.
- `docs/phase2.md`: phase-two research and development plan.
- [Agent-flow snapshot](docs/agent-flow-snapshot.md): import scope, verification, exclusions, and large-record restoration.

## Harness and reports

- [Harness README](deepseek-harness/README.md) / [Chinese README](deepseek-harness/README.zh.md)
- [RTL tools](deepseek-harness/rtl-tools/README.zh.md)
- [Project status](AMD/doc/PROJECT_STATUS.zh.md)
- [Final 156-task report](AMD/p156-20260928-final-report/REPORT.zh.md)
- [Task results](AMD/p156-20260928-final-report/task-results-156.csv)
- [Model-call index](AMD/p156-20260928-final-report/model-call-index.jsonl)
- [Independent continuation report](AMD/p156-20260928-quota-continuation-v2/report/report.zh.md)
- [RT-01 fix report](AMD/redteam-20260927/RT-01_Fix_Report.zh.md)
- [Netlist calibration](AMD/netlist-suite-20260927/README.zh.md)
- [Reference alignment](AMD/doc/RTL_Alignment_Stage23_Execution.zh.md)
- [UI tutorial](AMD/doc/RTL_Agent_UI_Tutorial.zh.md)
- [Local Qwen setup](AMD/local-qwen-harness/README.zh.md)

## Snapshot policy

The `agent-flow` branch updates the original 2026-09-21 snapshot with the harness working tree and related reports and experiment records captured on 2026-09-29 (Asia/Shanghai). This includes local uncommitted harness changes. Existing unrelated repository content and branch history are preserved. Nested Git metadata, local credentials, installers, downloaded toolchains, dependency directories, virtual environments, and generated binaries are excluded from this update. Three large JSONL records are stored as lossless gzip files; see the snapshot notes before replaying historical analysis scripts.

Each imported component retains the licensing terms included in its own directory. No repository-wide license is implied for files that do not already carry one.
