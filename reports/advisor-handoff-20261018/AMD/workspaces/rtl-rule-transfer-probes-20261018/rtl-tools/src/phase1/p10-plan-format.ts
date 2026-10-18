/** Complete, compact planning data; never truncate a model draft into a plan. @module rtl-tools/phase1/p10-plan-format */

/** Fixed wire format below the existing planner output ceiling, not a larger generation budget. */
export const plannerFormat = 'Return exactly one JSON object with only cause, changes, checks. cause is one string up to 160 characters identifying the blocking defect. changes is 1 to 3 strings, each up to 200 characters, specifying concrete edits to the current DUT. checks is 1 to 2 strings, each up to 160 characters, naming semantic cases to verify. Use short English sentences. No Markdown, code blocks, full RTL implementations, examples, repeated question, alternative drafts, or claimed PASS. An exact source-line citation in cause is allowed. Finish the JSON object. Total output must be at most 1200 characters.'

/** Parse and normalize a complete planning object without inventing, clipping or completing advice. @param text - full non-truncated model response. @returns canonical compact JSON. */
export function compactPlan(text: string, structured = false): string {
  const fail = (): never => { throw new Error('PLANNER_PLAN_INVALID') }
  if (text.length > 1200) fail()
  let value: unknown
  try { value = JSON.parse(text) } catch { fail() }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fail()
  const plan = value as Record<string, unknown>
  if (Object.keys(plan).sort().join(',') !== 'cause,changes,checks') fail()
  const sentence = (value: unknown, length: number): value is string => typeof value === 'string' &&
    !!value.trim() && value.length <= length && !/[\r\n`]/.test(value)
  const list = (value: unknown, max: number, length: number): value is string[] => Array.isArray(value) &&
    value.length >= 1 && value.length <= max && value.every(item => sentence(item, length))
  const changes = structured ? Array.isArray(plan.changes) && plan.changes.length >= 1 && plan.changes.length <= 3 && plan.changes.every(item =>
    item && typeof item === 'object' && !Array.isArray(item) && Object.keys(item).sort().join(',') === 'after,before' && sentence(item.before, 200) && typeof item.after === 'string' && item.after.length <= 200 && !/[\r\n`]/.test(item.after)) : list(plan.changes, 3, 200)
  if (!sentence(plan.cause, 160) || !changes || !list(plan.checks, 2, 160)) fail()
  return JSON.stringify({ cause: plan.cause, changes: plan.changes, checks: plan.checks })
}
/** Executable proposal for checking, not an answer applied by the Host. */
export const repairPlanFormat = 'Return exactly one JSON object with only cause, changes, checks. cause: one string up to 160 characters explaining the defect. changes: 1 to 3 objects with exactly before and after strings, each up to 200 characters. Copy each before exactly from current.source, matching once; after must repair the defect. These are checked previews, NOT applied edits. At least one real code change; no A-to-A changes. Preserve trusted port names, directions, widths and signedness. Check all enum values, base-type capacity and uniqueness. checks: 1 to 2 strings up to 160 characters. No Markdown or full DUT. Total JSON at most 1200 characters. Explain only the brief diagnosis, not private reasoning. Finish the object.'
