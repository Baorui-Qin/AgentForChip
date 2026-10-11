/** Exact normalized provider accounting, independent from semantic acceptance. @module rtl-tools/phase1/provider-usage */

/** LOST_HOST means incomplete observation, not proof that the provider sent unread counters. */
export interface ProviderUsage {
  state: 'USAGE_RETURNED' | 'USAGE_MISSING_PROVIDER' | 'USAGE_LOST_HOST' | 'USAGE_UNPARSEABLE'
  code: string | null
  prompt_tokens: number | null; completion_tokens: number | null; total_tokens: number | null
  source: 'provider' | 'unavailable'
}

function count(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

/**
 * Validate one normalized full-call sample without coercion or local estimates.
 * @param usage - provider sample; undefined means no sample was observed.
 * @param exhausted - observed normal iterator EOF without an error or aborted finish.
 * @returns one of four accounting states with unavailable counts explicitly null.
 */
export function providerUsage(usage: unknown, exhausted: boolean): ProviderUsage {
  const empty = { prompt_tokens: null, completion_tokens: null, total_tokens: null, source: 'unavailable' as const }
  if (usage === undefined) return { ...empty, state: exhausted ? 'USAGE_MISSING_PROVIDER' : 'USAGE_LOST_HOST',
    code: exhausted ? 'PROVIDER_USAGE_NOT_RETURNED' : 'HOST_STREAM_INCOMPLETE' }
  const invalid: ProviderUsage = { ...empty, state: 'USAGE_UNPARSEABLE', code: 'PROVIDER_USAGE_UNPARSEABLE' }
  if (usage === null || typeof usage !== 'object' || Array.isArray(usage)) return invalid
  const value = usage as Record<string, unknown>
  const input = value.inputTokens, output = value.outputTokens, total = value.totalTokens
  const read = value.cacheReadTokens === undefined ? 0 : value.cacheReadTokens
  const write = value.cacheWriteTokens === undefined ? 0 : value.cacheWriteTokens
  if (!count(input) || !count(output) || !count(total) || !count(read) || !count(write)) return invalid
  if (value.reasoningTokens !== undefined && (!count(value.reasoningTokens) || value.reasoningTokens > output)) return invalid
  // TokenUsage input excludes cache buckets; reasoning is already part of output.
  const prompt = input + read + write
  if (!count(prompt) || !count(prompt + output) || total !== prompt + output) return invalid
  return { state: 'USAGE_RETURNED', code: null, prompt_tokens: prompt, completion_tokens: output, total_tokens: total, source: 'provider' }
}
