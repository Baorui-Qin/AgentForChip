import { expect, it } from 'vitest'
import { providerUsage } from '../src/phase1/provider-usage.ts'

it('separates absent, interrupted and invalid provider usage without substituting zero', () => {
  expect(providerUsage(undefined, true)).toMatchObject({ state: 'USAGE_MISSING_PROVIDER', code: 'PROVIDER_USAGE_NOT_RETURNED', total_tokens: null, source: 'unavailable' })
  expect(providerUsage(undefined, false)).toMatchObject({ state: 'USAGE_LOST_HOST', code: 'HOST_STREAM_INCOMPLETE', total_tokens: null, source: 'unavailable' })
  expect(providerUsage({ inputTokens: 1, outputTokens: 2, totalTokens: 4 }, true)).toMatchObject({ state: 'USAGE_UNPARSEABLE', total_tokens: null })
  expect(providerUsage({ inputTokens: 1, outputTokens: 2, totalTokens: 3 }, false)).toMatchObject({ state: 'USAGE_RETURNED', total_tokens: 3, source: 'provider' })
})

it('counts disjoint cache buckets once and leaves reasoning within output', () => {
  expect(providerUsage({ inputTokens: 101, cacheReadTokens: 7, cacheWriteTokens: 2, outputTokens: 53, reasoningTokens: 11, totalTokens: 163 }, true))
    .toEqual({ state: 'USAGE_RETURNED', code: null, prompt_tokens: 110, completion_tokens: 53, total_tokens: 163, source: 'provider' })
})

it('accepts a real exact zero sample and preserves it after interruption', () => {
  expect(providerUsage({ inputTokens: 0, outputTokens: 0, totalTokens: 0 }, false))
    .toEqual({ state: 'USAGE_RETURNED', code: null, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0, source: 'provider' })
})

it.each([
  ['negative', -1], ['fractional', 1.5], ['NaN', NaN], ['infinite', Infinity],
  ['unsafe', Number.MAX_SAFE_INTEGER + 1], ['string', '1'], ['null', null], ['boolean', true],
])('rejects %s counters without coercion or zero replacement', (_kind, inputTokens) => {
  expect(providerUsage({ inputTokens, outputTokens: 2, totalTokens: 3 }, true))
    .toEqual({ state: 'USAGE_UNPARSEABLE', code: 'PROVIDER_USAGE_UNPARSEABLE', prompt_tokens: null, completion_tokens: null, total_tokens: null, source: 'unavailable' })
})

it.each(['cacheReadTokens', 'cacheWriteTokens', 'reasoningTokens'] as const)('rejects malformed optional %s counters', field => {
  expect(providerUsage({ inputTokens: 1, outputTokens: 2, totalTokens: 3, [field]: null }, true).state).toBe('USAGE_UNPARSEABLE')
})

it('rejects absent exact totals and unsafe aggregate arithmetic', () => {
  for (const value of [
    { inputTokens: 1, outputTokens: 2 },
    { inputTokens: Number.MAX_SAFE_INTEGER, cacheReadTokens: 1, outputTokens: 0, totalTokens: Number.MAX_SAFE_INTEGER },
    { inputTokens: Number.MAX_SAFE_INTEGER, outputTokens: 1, totalTokens: Number.MAX_SAFE_INTEGER },
    { inputTokens: 1, outputTokens: 2, reasoningTokens: 3, totalTokens: 3 },
    { inputTokens: 1, outputTokens: 2, totalTokens: 9 },
  ]) expect(providerUsage(value, true)).toMatchObject({ state: 'USAGE_UNPARSEABLE', total_tokens: null, source: 'unavailable' })
})

it.each([['null', null], ['array', []], ['string', 'usage']] as const)('rejects a %s sample instead of declaring it absent', (_kind, value) => {
  expect(providerUsage(value, true)).toMatchObject({ state: 'USAGE_UNPARSEABLE', total_tokens: null })
})
