# Compatibility Validation

VerilogEval V2 tasks evaluated with Vivado 2025.2 compatibility evaluator v1.

Revision: c498220d0a52248f8e3fdffe279075215bde2da6. Manifest SHA256: 880f2dabca449f800238edf3458739ca8e37e811bfc5750d8474298af2b80353.

Static: 155 converted, 1 unchanged, 1 manual review. Static matches are not Vivado results.

Real EDA: two declaration-only probes, two representative positive/negative pairs, then 10 fixed-task positive/negative pairs after read-only freeze. Ready: 10/10. All other tasks: NOT_RUN.

Host default timescale: 1ps/1ps, no explicit unit override. Only two complete TB declaration lines move. Stimulus, reference, comparison, verdict and sampling remain byte-identical.

Baseline and Agent load identical evaluator SHA/version through the shared frozen loader. This is an integration assertion, not a new model score: model calls 0, comparison NOT_RUN, 40-task expansion NOT_RUN. Separate managed snapshot/build/log directories are used for every run. Full adversarial OS isolation is not claimed.
