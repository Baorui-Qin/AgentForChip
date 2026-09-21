# Counter 半自动修复实验

synthesis-only: VERIFIED

流程终态与设计修复成功分别记录。固定负例未改写；每份模型候选需人工安全审批。没有完整 OS 隔离证明，不签收无人干预修复或 Prob038 兼容性。

| Revision | Source SHA256 | Compile | Elaborate | Simulation | Synthesis |
| --- | --- | --- | --- | --- | --- |
| 0 | ba4634e3a8c463ceee91806036b4990455a11033a87c606f53a6256595116eb1 | PASS | PASS | PASS | FAIL |
| 1 | ef464382e434b880321eaa153feb0f7596fa3bf63aa172ad66a8b6dc50d1e7c7 | PASS | PASS | PASS | PASS |

Semantic proposals: 1; recorded calls: 1; transport retries: 0; tokens: 887/108; human wait: 316085 ms. TTFT and price: null.

## 失败事实与宿主决策

```json
{
  "decisions": [
    {
      "action": "propose_repair",
      "rule": "DUT_MISSING_SYNTHESIS_MODULE",
      "reason": "Missing DUT dependency with recognized same-invocation summaries.",
      "stage": "synthesis"
    },
    {
      "action": "stop",
      "rule": "VERIFIED",
      "reason": "All stages passed.",
      "stage": null
    }
  ],
  "observed": [
    {
      "revision": 0,
      "stop_reason": "synthesis: FAIL",
      "stages": [
        {
          "stage": "compile",
          "status": "PASS",
          "evidence": {
            "test_completed": null,
            "checks_executed": null,
            "mismatch_count": null,
            "evaluator_id": null
          },
          "errors": []
        },
        {
          "stage": "elaborate",
          "status": "PASS",
          "evidence": {
            "test_completed": null,
            "checks_executed": null,
            "mismatch_count": null,
            "evaluator_id": null
          },
          "errors": []
        },
        {
          "stage": "simulation",
          "status": "PASS",
          "evidence": {
            "test_completed": true,
            "checks_executed": 20,
            "mismatch_count": 0,
            "evaluator_id": "handwritten-counter-v1"
          },
          "errors": []
        },
        {
          "stage": "synthesis",
          "status": "FAIL",
          "evidence": {
            "test_completed": null,
            "checks_executed": null,
            "mismatch_count": null,
            "evaluator_id": null
          },
          "errors": [
            {
              "category": "error",
              "message_id": "Synth 8-439",
              "file": "D:/AMD/phase1-validation/p07-loop-20260916/repair-a5b5290c-57f0-46a0-9779-2f557811a0eb/eda/run-9Nkf8m/snapshot-bnx4SV/rtl/solution.sv",
              "line": 4,
              "message": "module 'missing_synthesis_cell' not found",
              "severity": "ERROR",
              "origin": "dut",
              "attribution": "DUT_SYNTHESIS_ERROR",
              "repairable_by_model": false
            },
            {
              "category": "error",
              "message_id": "Synth 8-6156",
              "file": "D:/AMD/phase1-validation/p07-loop-20260916/repair-a5b5290c-57f0-46a0-9779-2f557811a0eb/eda/run-9Nkf8m/snapshot-bnx4SV/rtl/solution.sv",
              "line": 1,
              "message": "failed synthesizing module 'counter'",
              "severity": "ERROR",
              "origin": "dut",
              "attribution": "DUT_SYNTHESIS_ERROR",
              "repairable_by_model": false
            },
            {
              "category": "error",
              "message_id": "Common 17-69",
              "file": null,
              "line": null,
              "message": "Command failed: Synthesis failed - please see the console or run log file for details",
              "severity": "ERROR",
              "origin": "unknown",
              "attribution": "UNKNOWN",
              "repairable_by_model": false
            }
          ]
        }
      ]
    },
    {
      "revision": 1,
      "stop_reason": "reviewed_candidate completed all stages; not an adversarial evaluator.",
      "stages": [
        {
          "stage": "compile",
          "status": "PASS",
          "evidence": {
            "test_completed": null,
            "checks_executed": null,
            "mismatch_count": null,
            "evaluator_id": null
          },
          "errors": []
        },
        {
          "stage": "elaborate",
          "status": "PASS",
          "evidence": {
            "test_completed": null,
            "checks_executed": null,
            "mismatch_count": null,
            "evaluator_id": null
          },
          "errors": []
        },
        {
          "stage": "simulation",
          "status": "PASS",
          "evidence": {
            "test_completed": true,
            "checks_executed": 20,
            "mismatch_count": 0,
            "evaluator_id": "handwritten-counter-v1"
          },
          "errors": []
        },
        {
          "stage": "synthesis",
          "status": "PASS",
          "evidence": {
            "test_completed": null,
            "checks_executed": null,
            "mismatch_count": null,
            "evaluator_id": null
          },
          "errors": []
        }
      ]
    }
  ]
}
```

资源、综合后时序、失配计数、诊断和版本绑定见 [repair-report.json](repair-report.json).
