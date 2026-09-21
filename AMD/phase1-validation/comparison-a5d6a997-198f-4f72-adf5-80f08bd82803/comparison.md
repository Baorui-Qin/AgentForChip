# Three-Route RTL Comparison

Development observation only. No automatic repair, no statistical gain claim, no full OS isolation.

Evaluator preflight: FAIL. Original evaluator preflight failed; no generation is authorized

| Route | Generation | Compile | Elaborate | Simulation | Synthesis | Interpretation | Verified export |
| --- | --- | --- | --- | --- | --- | --- | --- |
| baseline | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | NOT_APPLICABLE | false |
| agent_base | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | false |
| agent_domain | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | false |

Baseline uses the frozen VerilogEval zero-shot wrapper without optional rules or examples. It has no Agent/EDA services; its external scoring is charged separately.
Agent-Base uses the same initial request. Agent-Domain adds only the frozen five-rule system block. Neither interpretation can change RTL or the evaluator verdict.
Differences in one independently generated sample can be sampling variation. Prompt changes and workflow changes are not proof of a correctness gain.
This uses DeepSeek official streaming API and Windows Vivado, not the original paper environment. top_p is not sent; its effective value is unknown. Price and TTFT are unavailable, not zero.
The testbench retains its 10 ps simulation clock; the independent synthesis XDC is 5 ns. Positive post-synthesis WNS does not establish all timing constraints or post-route closure.

## Cost and Metrics

Call counts are project attempts, not confirmed HTTP delivery. Null means unavailable. Review wait is separate from execution.

- baseline: calls {"generation":0,"interpretation":0,"retries":0}; tokens {"generation":null,"interpretation":null}; wall ms {"generation":null,"evaluation":null,"interpretation":null,"review_wait":null}; resources null; timing null; cost null; TTFT null.
- agent_base: calls {"generation":0,"interpretation":0,"retries":0}; tokens {"generation":null,"interpretation":null}; wall ms {"generation":null,"evaluation":null,"interpretation":null,"review_wait":null}; resources null; timing null; cost null; TTFT null.
- agent_domain: calls {"generation":0,"interpretation":0,"retries":0}; tokens {"generation":null,"interpretation":null}; wall ms {"generation":null,"evaluation":null,"interpretation":null,"review_wait":null}; resources null; timing null; cost null; TTFT null.

## Evidence

- baseline: source unavailable; checks unavailable; mismatches unavailable; warnings []; paths {"generation":null,"verification":null,"interpretation":null}
- agent_base: source unavailable; checks unavailable; mismatches unavailable; warnings []; paths {"generation":null,"verification":null,"interpretation":null}
- agent_domain: source unavailable; checks unavailable; mismatches unavailable; warnings []; paths {"generation":null,"verification":null,"interpretation":null}

## Sources

[VerilogEval v2](https://arxiv.org/html/2408.11053v2): generation protocol and separate scoring. [AutoChip](https://arxiv.org/html/2411.11856v3): feedback and cost accounting, not its search loop. [RTLFixer](https://arxiv.org/html/2311.16543v3): error categories, not its rule-based fixer.
