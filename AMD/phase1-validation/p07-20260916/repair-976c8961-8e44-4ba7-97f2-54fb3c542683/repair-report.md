# Counter Semi-Automatic Repair

functional: VERIFIED

A recorded terminal state is not proof of a successful repair. Fixed negative fixtures remain unchanged. Each model candidate requires human safety review. This does not establish full OS isolation, unattended repair, or Prob038 compatibility.

| Revision | Source SHA256 | Compile | Elaborate | Simulation | Synthesis |
| --- | --- | --- | --- | --- | --- |
| 0 | e49002bb34df0e441a5b5444f6e10c87f817c6ff0b374e4413d8dbac1d8fd08b | PASS | PASS | FAIL | SKIPPED |
| 1 | 641364a1efd28f007cb4cf4678a679fb3e9030f7fda7e7ab3a77308bae6844c1 | PASS | PASS | PASS | PASS |

Model attempts: 1; recorded calls: 1; tokens: 613/172; human wait: 59243 ms. TTFT and price: null.

## Failure Facts and Host Decisions

```json
{
  "decisions": [
    {
      "action": "propose_repair",
      "rule": "FUNCTIONAL_MISMATCH",
      "reason": "Complete calibrated mismatch evidence; source location remains unknown.",
      "stage": "simulation"
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
      "stop_reason": "simulation: FAIL",
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
          "status": "FAIL",
          "evidence": {
            "test_completed": true,
            "checks_executed": 20,
            "mismatch_count": 18,
            "evaluator_id": "handwritten-counter-v1"
          },
          "errors": [
            {
              "category": "functional_mismatch",
              "message_id": null,
              "file": null,
              "line": null,
              "message": "Functional mismatch: 18 of 20 checks failed; simulator exited normally. Inspect the DUT against the specification; no failing signal or cycle was reported.",
              "severity": "ERROR",
              "origin": "unknown",
              "attribution": "UNKNOWN",
              "repairable_by_model": false
            }
          ]
        },
        {
          "stage": "synthesis",
          "status": "SKIPPED",
          "evidence": {
            "test_completed": null,
            "checks_executed": null,
            "mismatch_count": null,
            "evaluator_id": null
          },
          "errors": []
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

Resources, post-synthesis timing, mismatch counts, diagnostics and version bindings: [repair-report.json](repair-report.json).
