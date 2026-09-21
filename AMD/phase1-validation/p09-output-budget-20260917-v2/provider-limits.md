# Provider Limits Checked on 2026-09-17

The official model table lists `deepseek-flash` with a 1M-token context and a separate maximum output of 384K. The new 8,192-token setting is below that published output ceiling. The experiment deliberately retains its smaller 16,384-token project window; it does not silently adopt the provider's full context capacity. Source: [DeepSeek model table](https://api-docs.deepseek.com/quick_start/pricing/).

The official thinking-mode guide says `temperature` has no effect in thinking mode. The configured zero is preserved for comparability, not treated as a reproducibility guarantee. Requests carrying tools must return the required reasoning content, which can consume subsequent input context. Source: [DeepSeek thinking mode](https://api-docs.deepseek.com/guides/thinking_mode/).

The local whole-request counter, provider usage, output token cap, response byte cap, event size cap, and timeout are separate observations or constraints. Larger output allowance does not remove any other constraint. The project uses the same pinned official local tokenizer in both arms, without claiming service-side equivalence.

The provider model name is an alias rather than an immutable weight revision. This experiment does not claim that model weights or backend sampling are held fixed by a public model ID.
