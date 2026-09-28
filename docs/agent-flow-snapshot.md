# Agent-flow Snapshot

Captured on 2026-09-29 (Asia/Shanghai) from the local project working trees. This is a source and research-artifact update, not a new experiment run or a claim that every task passes.

## Sources and layout

- `deepseek-harness/` contains the current non-ignored harness working tree, including its README files, documentation, tests, RTL tools, reference integration, and Agent Notes. The source HEAD was `25828d28f1064c6d265aefcca4031641115bd62c`; local uncommitted reference-integration changes are also included.
- `AMD/` contains the harness integration scripts, local Qwen setup, phase-one/P09/P10 work, calibration, Red Team findings, reference-alignment work, reports, model records, and available non-binary validation artifacts.
- The existing `agent-flow` history and unrelated files are retained. Neither original source checkout is switched, committed, or reset by this import.
- [Upload metadata](harness-upload.json) records source provenance, included file counts, exclusion categories, and compressed-record SHA-256 values.

## Results and limitations

The [final report](../AMD/p156-20260928-final-report/REPORT.zh.md) records Baseline 143/156 and Agent 150/156, with 698 model calls across interrupted runs, the original batch, and independent continuation. These are evaluator acceptance results, not verified public-specification correctness. Original and continuation records remain separate. See [project status](../AMD/doc/PROJECT_STATUS.zh.md) for known evaluator and agent limitations.

## Exclusions

The update excludes local credential stores and `.env` files, nested Git metadata, installed dependencies and toolchains, caches, compiled binaries, installer/archive downloads, and unrelated downloaded reference publications. Existing unrelated files from the earlier snapshot are not removed. Source fixtures tracked by the harness are retained.

Raw text logs, source snapshots, requests, responses, and report data are included where available. This curated upload is not a byte-for-byte copy of every local experiment directory: generated binary artifacts are omitted. Historical integrity reports describe the original local runs and are retained unchanged; their full-directory counts must not be interpreted as counts of this export.

Historical reports and scripts may contain machine-local paths such as `D:/AMD`, `D:/deepseek-harness`, and local Vivado installation paths. They have not been rewritten because changing frozen evidence would invalidate its recorded hashes. Running the harness elsewhere requires configuring the local toolchain paths and credentials.

## Large model records

The following files exceed the ordinary Git single-file size limit and are stored losslessly as gzip rather than omitted or truncated:

- `AMD/p156-0923-v1/analysis/calls.jsonl.gz`
- `AMD/p156-20260927-v3/analysis/calls.jsonl.gz`
- `AMD/p156-20260928-quota-continuation-v2/analysis/calls.jsonl.gz`

The upload metadata provides each original byte count and SHA-256. Compression is checked by decompressing and comparing with the source bytes. No Git LFS subscription or external artifact service is required. Historical scripts expecting `calls.jsonl` need these files decompressed first. With Node.js, run this from the repository root to restore them without overwriting an existing file:

```javascript
// Run with: node --input-type=module
import { readFile } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
const metadata = JSON.parse(await readFile('docs/harness-upload.json', 'utf8'));
for (const record of metadata.compressedRecords) {
  await pipeline(createReadStream(record.storedPath), createGunzip(),
    createWriteStream(record.originalPath, { flags: 'wx' }));
}
```

## Verification

Before upload, 12 focused test files passed (213 tests) in the source harness checkout using `node node_modules/vitest/vitest.mjs run --config rtl-tools/vitest.config.ts` with these explicit file selections under `rtl-tools/tests/`:

`candidates.spec.ts`, `p10-directives.spec.ts`, `p10-interface-errata.spec.ts`, `p10-netlist-catalog.spec.ts`, `p10-netlist-publish.spec.ts`, `p10-netlist-suite.spec.ts`, `p10-netlist.spec.ts`, `p10-settled-rtl.spec.ts`, `reference-provider.spec.ts`, `reference-relay.spec.ts`, `reference-solver.spec.ts`, and `reference-task.spec.ts`.

An additional run selected `p09-auto.spec.ts`, `p10-model.spec.ts`, `p10-repair-v2.spec.ts`, `p10.spec.ts`, `phase1-model.spec.ts`, and `repair.spec.ts`: 171 tests passed and 7 failed in that combined run. The failures involved calibration not completing (`CALIBRATION_FAILED`) or missing verification/current-state data downstream. All 7 failed cases passed when rerun separately, without changing code or timeout settings (1 P09 case and 6 repair cases). Concurrent load is a possible explanation, not a proven root cause; the initial failures are retained here rather than claiming a clean combined run.

`node --test rtl-tools/tests/generation-stability.test.mjs` also passed all 10 tests. Across the three initial selections, 401 distinct tests were exercised; all have a passing result including isolated retries, but the combined regression run remains a recorded reliability caveat.

These tests use local fixtures/mocks. No new paid model calls or full EDA campaign were run for the upload. Full repository tests, full documentation gates, and a fresh installation/build were not rerun. File-byte verification, common secret-pattern scanning, matching against local configured secrets, and single-file size checks cover the exported material; they do not constitute a complete security audit.
