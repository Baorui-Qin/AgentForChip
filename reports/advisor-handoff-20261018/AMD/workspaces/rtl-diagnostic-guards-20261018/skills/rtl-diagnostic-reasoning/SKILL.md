---
name: rtl-diagnostic-reasoning
description: Interpret live RTL diagnostics and concrete tool rejections before proposing a constrained local repair. Use for compilation, enum, interface, indexing or rejected-candidate failures.
---

# Diagnose Before Editing

Read the first independent DUT error, its statement, operand declarations and public interface. Briefly explain the violated rule; repeating an error message or citing its line is not a repair. Comments and a previous plan are not proof.

- Non-register procedural assignment (VRFC 10-1280): inspect the destination declaration. Change the existing ANSI output declaration when appropriate; do not append a second body declaration or merely rename the always construct.
- Enum assignment (10-2649): compare the named enum types of both operands. Preserve the public interface; a vector of the same width is not automatically the same enum type.
- Duplicate enum values (10-3279): inspect every member, base width and value. Member count must fit, values must be unique and representable. Choosing another occupied value does not repair the error.
- Scalar indexing (10-3186): the fixed port is authoritative. Reconstruct the intended scalar behavior from the specification; do not expand an input to make an incorrect expression compile.
- Syntax errors: repair the actual statement grammar without regenerating unrelated statements.

Propose exact before/after spans from the CURRENT source. After an anchor refusal, inspect its replacement index, missing/ambiguous kind and occurrence lines; use enough unchanged context to match once. A rejected edit was not applied. After rollback, use the restored source, not the failed draft.

Ordinary comment/whitespace changes and replaying rejected code are not new repairs. Change the failed strategy, not its wording. Call verify_rtl only when a new candidate is pending; a recorded failure with pending=false needs an edit, not another verification. After verification, use its result rather than claiming success.
