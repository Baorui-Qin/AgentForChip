/** Apply only explicit model-authored replacements to unique, disjoint original spans. @module rtl-tools/phase1/p10-exact-edit */

/** A model-selected replacement; the host supplies neither side. */
export interface ExactReplacement { before: string; after: string }
/** Pinpoint one invalid replacement without constructing an alternative. */
export class ExactPatchError extends Error {
  constructor(code: string, readonly details: Record<string, unknown>) { super(code) }
}

/** Parse and apply a model call atomically; never guess missing text. @param text - complete JSON tool arguments. @param source - unchanged bound DUT. @param revision - current revision. @returns candidate and byte-exact edit audit. */
export function exactEdit(text: string, source: string, revision: string) {
  const fail = (code: string): never => { throw new Error(code) }
  const value: unknown = JSON.parse(text)
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fail('INVALID_PATCH')
  const args = value as Record<string, unknown>
  if (Object.keys(args).sort().join(',') !== 'expected_revision_id,replacements' || args.expected_revision_id !== revision) return fail('PATCH_REVISION_REJECTED')
  if (!Array.isArray(args.replacements) || args.replacements.length < 1 || args.replacements.length > 3) return fail('INVALID_PATCH')
  const spans = args.replacements.map((value: unknown, index: number) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return fail('INVALID_PATCH')
    const item = value as Record<string, unknown>
    if (Object.keys(item).sort().join(',') !== 'after,before' || typeof item.before !== 'string' || !item.before.length || typeof item.after !== 'string') return fail('INVALID_PATCH')
    const positions: number[] = []
    for (let start = source.indexOf(item.before); start >= 0; start = source.indexOf(item.before, start + 1)) positions.push(start)
    if (positions.length !== 1) throw new ExactPatchError('PATCH_ANCHOR_NOT_UNIQUE', { replacement_index: index + 1,
      kind: positions.length ? 'ambiguous' : 'missing', occurrences: positions.length,
      lines: positions.slice(0, 3).map(start => source.slice(0, start).split('\n').length),
      instruction: 'Copy a unique span from the current source, adding surrounding context when ambiguous. No partial edit was applied.' })
    const start = positions[0]!
    return { start, end: start + item.before.length, before: item.before, after: item.after }
  }).sort((a, b) => a.start - b.start)
  if (spans.some((row, i) => i > 0 && row.start < spans[i - 1]!.end)) return fail('PATCH_OVERLAP')
  let candidate = '', cursor = 0
  for (const span of spans) { candidate += source.slice(cursor, span.start) + span.after; cursor = span.end }
  candidate += source.slice(cursor)
  if (candidate === source) return fail('REPEATED_CANDIDATE')
  return { source: candidate, spans, untouched_bytes_preserved: true }
}
