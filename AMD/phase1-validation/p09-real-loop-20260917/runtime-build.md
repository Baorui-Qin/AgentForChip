# Official Counter Runtime

- Official repository revision: 8cadfede7063c896b944e7bae05daa3549ae97ea
- Compiler: rustc 1.97.1 (8bab26f4f 2026-07-14)
- Runtime manifest SHA256: a1085327ca27c2fd99e86cbc0d7874fc150b8cdf3d1fd13e25d0ddd75883b825
- Executable SHA256: 0bdbf6b9c8e92996ce128e403253f533634ee5a83be83906274449a9f06859ed
- Tokenizer SHA256: df385ab3ba4bbb1815327f3e71bba5b263263f5d015a838e6ff295ca69b3198e
- Official Rust conversion: ChatCompletionRequest.convert with ConversionOptions::default.
- Official rendering/encoding: DeepseekV41Encoding and PromptEncoding::encode.
- Python image dependencies: not installed or used.
- Handwritten serving template: none.
- Provider serving equivalence: unconfirmed.

The frozen executable, tokenizer, selected official source files, helper source and dependency locks are copied under official-counter-runtime. The upstream MIT license is retained. Build inputs use a sibling official checkout named deepseek-recipe; its pinned revision supplies the upstream workspace manifests. Local Rust/MSVC build tools reside under D:/AMD/p09-runtime. This is not a claim of a hermetic toolchain or complete OS isolation.

Cargo originally produced a hardlinked executable. It was not admitted by the host file guard; a standalone byte-for-byte copy was pinned before successful dispatch. The guard was not weakened. Real request recount and exact-core/one-token-over tests are in tokenizer-boundary.json and tokenizer-boundary-full-v2.json. The first full-registry boundary analysis incorrectly expected optional guidance to be unprunable; its retained work directory is tokenizer-boundary-full. The corrected test explicitly tests the non-prunable core.
