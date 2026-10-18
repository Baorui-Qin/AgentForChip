---
name: rtl-diagnostic-reasoning
description: Explain RTL rule violations and Host repair refusals before a constrained edit. Use for enum, fixed-interface, driver, anchor, replay or verification-state errors.
---

# Explain the Constraint

Use the first bound independent error and actual declarations. State the violated relation, a concrete change and how to check it, not private reasoning or a copied error. Failure alone does not prove non-understanding; distinguish language, contract, protocol, format and environment.

- Enum: n distinct members need n<=2^w AND unique in-range values; 3 members cannot fit 1 bit. Moving a duplicate to another occupied value fails. Check every member and preserve specified encodings.
- Enum type: equal bit width is not equal named type. Inspect both declarations; widening a vector does not fix type identity. Check any conversion against legal states.
- Fixed ports: scalar indexing is not permission to widen a public input. Reconstruct the specified scalar behavior; keep names, directions, widths and signedness unchanged.
- Procedural target: inspect its declaration and drivers; changing an always keyword alone does not make a net a variable. Fix the existing declaration, not a duplicate.
- Multiple drivers: list every writer and its process. An unchanged declaration fixes nothing; resolve conflicting ownership while preserving specified timing.
- Exact edit: before must match current source once. Read rejected index/count/lines; use unique context. A refused edit was not applied; rollback restores the prior source.
- Substance: A-to-A, ordinary comments and rejected-code replays are not repairs. Change the failed relationship, not its wording. Different tokens still do not prove correctness.
- Verification: pending=false with recorded FAIL needs an edit, not repeated verify. After an accepted edit, verify that revision. Planned checks are not observed PASS.
- Format is a Host limit, not HDL law: cause/check<=160, each span<=200, total<=1200, no CR/LF/backticks in strings. Use unique single-line spans; format refusal is not an EDA verdict.

Detailed meanings, counterexamples and limits: [references/rules.json](references/rules.json). The offline builder compiles these summaries into normal Agent guidance; it does not make the Agent read the full graph or learn new weights.
