# Agent Note: Exact prompt identities across LF and CRLF

Status: implemented

English | [中文](2026-10-11-p10-exact-prompt-line-endings.zh.md)

## Problem

The approved public interpretations for Prob031_dff and Prob062_bugs_mux2 bind only CRLF prompt hashes. The pinned Git dataset and preserved P2 catalog contain the identical public text with LF endings. Reading the current full dataset rejects these entries before EDA calibration starts. A passing CRLF fixture does not exercise that deployment.

## Decision

The erratum registry lists both exact raw SHA256 identities for each of these two prompts. The text hash must match one listed identity and the corresponding prompt asset hash must match that same text hash. The registry preserves raw text, the original interpretation, semantic approval date and erratum id. The returned spec_sha256 binds the actual accepted raw representation. This adds no interface interpretation and does not change Git or dataset files.

## Alternatives considered

**Normalize arbitrary input text before approval.** Rejected because it hides representation drift and admits unreviewed mixtures or transformations. Exact LF and CRLF pins retain the existing rejection boundary.

**Rewrite the dataset or historical catalog to CRLF.** Rejected because historical asset hashes and byte identity are evidence. A deployment fix belongs in the current reader.

**Ignore these entries during calibration.** Rejected because the production reader creates the full catalog and rejects stale approval; filtering would conceal a real deployment failure.

## Consequences

CRLF consumers retain their existing metadata. LF consumers receive an explicit actual raw spec hash. Netlist calibration still requires its own exact source and provenance match; this change does not rebind or promote historical netlist profiles. Mixed line endings, changed content, mismatched assets and unreviewed task ids remain outside this approval. The local source change establishes a successor Runtime; prior G1 results are historical, and fresh final acceptance remains necessary.

## Verification

The two LF positive cases fail against the original production API. The implementation and unchanged caller chain pass the focused interface, dataset, converter, netlist-catalog and model-input regressions. The task-owned evidence binds LF bytes to the fixed Git commit, P2 catalog and exact CRLF counterparts. Local EDA receipts are separate from model requests or Skill effectiveness.
