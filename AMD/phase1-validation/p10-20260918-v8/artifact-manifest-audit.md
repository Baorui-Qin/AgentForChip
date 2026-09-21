# Artifact Manifest Audit

## Verified Before Sealing

- 11 terminal EDA manifests: complete file sets, 275 file sizes and SHA-256 digests match; result.json equals the final run_finished event.
- Independent task, wrapper hash and verification key bindings match. No candidate export or stale PASS exists.
- All 468 original dataset assets and 72 frozen runtime inputs match. Raw reference/testbench bytes are unchanged.
- Three P09 archives retain 9038 regular files and 277 runtime links. Their existing manifest bytes match the pre-run freeze.
- The model-free profile dispatched no model requests. Model-route audits are NOT_RUN, not vacuous model acceptance.
- Process snapshot contains no surviving EDA or campaign Node/cmd processes. This is not OS isolation evidence.

## Campaign Seal

The campaign manifest is generated only after this document, acceptance files and quality logs are closed. It records every regular file with size/SHA-256 and excludes only campaign-artifact-manifest.json itself. Only dsh profile node_modules runtime links are permitted; targets are recorded without following them or claiming their contents are archived.

The seal procedure scans twice before writing and once afterward. A separate read-only verification is required after sealing. Its receipt is stored beside, not inside, the archive as ../p10-20260918-v8.receipt.json, avoiding a self-referential manifest. Earlier P10 launches are sealed independently and never pooled into the v8 scores.

The artifact audit does not sign off Baseline/Agent execution, tokenizer requests, repair gain, forty-task results, full isolation or benchmark compatibility fixes.
