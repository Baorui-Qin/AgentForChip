/** Small project-record validator backed by the existing Harness JSON schema engine. @module rtl-tools/phase1/record-validation */
import { validateJsonSchemaValue, type JsonSchemaNode } from '@deepseek-ai/dsh-tools'
/** Shared host-generated identifier schema. */
export const uuidSchema = { type: 'string', pattern: '^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$' } as const
type Field = Omit<JsonSchemaNode, 'const'> & { const?: unknown; pattern?: string; minimum?: number; maxLength?: number }
/** Strict record schema plus detached typed parser. @param properties - explicit fields. @returns schema and parser. */
export function recordValidator<T>(properties: Record<string, Field>) {
  const structural = Object.fromEntries(Object.entries(properties).map(([key, field]) => {
    const { const: constant, pattern: _pattern, minimum: _minimum, maxLength: _maxLength, ...base } = field
    return [key, { ...base, ...(constant !== undefined && !Array.isArray(constant) ? { const: constant } : {}) } as JsonSchemaNode]
  }))
  const schema: JsonSchemaNode = { type: 'object', properties: structural, required: Object.keys(properties), additionalProperties: false }
  return { properties, parse(value: unknown): T {
    const errors = validateJsonSchemaValue(schema, value)
    if (errors.length) throw new Error(errors.slice(0, 5).join('; '))
    for (const [key, field] of Object.entries(properties)) {
      const item = (value as Record<string, unknown>)[key]
      if (field.const !== undefined && JSON.stringify(item) !== JSON.stringify(field.const)) throw new Error('Invalid constant: ' + key)
      if (field.pattern && (typeof item !== 'string' || !new RegExp(field.pattern).test(item))) throw new Error('Invalid format: ' + key)
      if (field.maxLength !== undefined && (typeof item !== 'string' || item.length > field.maxLength)) throw new Error('Oversized field: ' + key)
      if (field.minimum !== undefined && (typeof item !== 'number' || !Number.isSafeInteger(item) || item < field.minimum)) throw new Error('Invalid integer: ' + key)
    }
    return structuredClone(value) as T
  } }
}
/** Validate an identifier independently of any filesystem operation. @param id - uuid. */
export function checkId(id: string): void { if (!new RegExp(uuidSchema.pattern!).test(id)) throw new Error('Invalid experiment UUID') }
