---
name: rtl-agent-correction
description: Diagnose and repair RTL through a tool-using edit-test loop, investigate DUT versus testbench failures, and retain source-bound verification evidence. Use for RTL debugging and verification, not for altering private evaluators or treating simulation as CDC sign-off.
---

# RTL Agent Correction

Use the available task tools to perform the correction, not merely propose one. Respect the granted file and command scope.

## Diagnose Before Editing

- Distinguish compiler errors, functional mismatches, testbench races, evaluator/specification conflicts, infrastructure failures and output truncation. A tool failure is not automatically a DUT failure.
- Reproduce a concrete failure before changing the relevant logic. If a candidate already passes, inspect and test it without gratuitous rewriting.
- For an independent testbench, respect valid/ready input stability and sample the specified pre-edge or post-NBA values. Check its driver and scoreboard scheduling before attributing a mismatch to the DUT.
- For clocked handshake diagnostics, use rule T-021 in the reference catalog; for asynchronous FIFO scheduling also use T-002. A continuously asserted valid may offer several transactions, not one named test item.
- Read only the relevant conditional rules in [references/rules.json](references/rules.json). Their evidence strength and caveats are part of the rule, not optional footnotes.

## Execute And Verify

- Record each actual tool call and returned diagnostic. Preserve the before/after diff and source hash for each edit. Equal hashes mean no repair occurred; do not count repeated identical writes as progress.
- Run the necessary compile, elaboration, functional simulation and synthesis stages on the final source. Bind results to source, test/configuration and tool version. An earlier revision's pass does not transfer to a later revision.
- Keep independently written diagnostics separate from frozen evaluation. Preserve evaluator conflicts and failures rather than editing the oracle or overfitting excluded behavior.
- On repeated no-progress actions, unavailable tools or incomplete provider output, stop or request a bounded continuation. Do not silently repeat a possibly charged request or claim a truncated action executed.

## Summarize The Actual Correction

State the observed symptom, edits actually made, verification performed and remaining limits. Separate model-authored explanations from developer review and confirmed tool results.

Digital simulation and synthesis do not prove metastability safety, physical CDC closure, mathematical correctness or skill gains on new tasks. A self-authored test is finite supporting evidence, not an independent reference solution.

Keep reusable rules conditional and solution-free. Case IDs, previous answers, private vectors and full provenance graphs belong outside the next solver's skill context.
