# Agent Note: Read Archive Baselines from the Target Git Worktree

Status: implemented

English | [中文](2026-10-10-archived-agent-note-git-root.zh.md)

## Problem

The archive verifier can run from a Harness directory nested inside a larger Git worktree. Git tree listings can use that directory's relative paths, while `ref:path` object expressions use paths from the Git root. Mixing these interpretations prevents the verifier from reading its committed manifest. Reading working-tree bytes instead would weaken the immutable archive comparison.

## Decision

The [baseline reader](../../../../scripts/archived-agent-notes-git.ts) locates the Git worktree containing the explicit Harness target and converts the manifest path to a slash-separated path relative to that Git root. It resolves the trusted baseline ref to one commit object before reading the manifest blob. Git receives argument arrays; neither the caller's working directory nor shell interpolation determines the object path.

The reader rejects a manifest outside the Harness target, symlink or junction parents, nonregular manifest files, and a manifest inside another nested Git worktree. A missing ref or manifest blob fails explicitly. It never substitutes working-tree content or an empty manifest after a failed object read. A regular working-tree manifest can differ from the selected commit without changing the baseline bytes.

The [archive verifier](../../../../scripts/verify-archived-agent-notes.ts) uses the reader before applying its existing append-only manifest comparison. Closed classes, complete triplets, archive dates, bilingual hashes and frozen-content hashes retain their [archive policy](../process/2026-07-26-frozen-agent-note-archive.md). This fix changes Git path resolution and failure reporting; it does not rewrite archived files or add a documentation exception.

## Alternatives considered

**Build the object expression from the invocation directory.** Rejected because Git object paths have a different base from filesystem paths and tree-listing arguments. An explicit root-relative path remains valid when the command runs from a nested directory.

**Read the current manifest when the baseline object is absent.** Rejected because current bytes cannot establish the prior seals that the verifier must preserve. A missing baseline requires an error, rather than a weaker comparison.

**Share a general Git platform layer across document scripts.** Rejected because this defect belongs to one verifier. Its small reader keeps the target-path checks and tests with that verifier.

## Consequences

Root and nested-directory invocations read the same committed manifest, including worktrees whose paths contain spaces or Chinese characters. A pre-change ref remains authoritative when HEAD or working-tree bytes differ. Missing baseline objects and redirected paths remain visible failures. Existing archived content and documentation rules remain unchanged.

## Verification

The [isolated Git regressions](../../../../scripts/archived-agent-notes-git.spec.ts) invoke the shipping reader in child processes with test-owned repositories and configuration. They cover root and nested directories, Chinese and space paths, committed-versus-working-tree bytes, non-HEAD refs, missing objects, escaped paths, nested repositories and redirected parents. The [archive-format regressions](../../../../scripts/archived-agent-notes.spec.ts) retain the original triplet and seal checks. Full documentation acceptance requires the actual verifier and documentation aggregate results; focused reader tests alone do not establish it.
