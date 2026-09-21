/** Tool schema compiled from the project's strict record schema. @module rtl-tools/phase1/verification-output */
import type { JsonSchemaNode, ValueSchemaSpec } from '@deepseek-ai/dsh-tools'
import { recordSchemas } from './records.ts'

// This translator handles only the schema vocabulary owned by records.ts.
function spec(node: JsonSchemaNode): ValueSchemaSpec {
  if (node.oneOf) return { oneOf: node.oneOf.map(spec) as [ValueSchemaSpec, ValueSchemaSpec, ...ValueSchemaSpec[]] }
  if (node.type === 'object') return { type: 'object', additionalProperties: false,
    properties: Object.fromEntries(Object.entries(node.properties!).map(([name, child]) => [name, { ...spec(child), ...(node.required?.includes(name) ? { required: true as const } : {}) }])) }
  if (node.type === 'array') return { type: 'array', items: spec(node.items!) }
  return node as ValueSchemaSpec
}

/** Tool outputs validate every nested stage using the same project record fields. */
export const verificationOutput = {
  type: 'object', additionalProperties: false,
  properties: {
    schema_version: { type: 'string', const: '1.1', required: true }, snapshot_id: { type: 'string', required: true },
    status: { type: 'string', required: true }, stages: { type: 'array', items: spec(recordSchemas.StageResult), required: true },
    artifacts: { type: 'string', required: true }, full_isolation_verified: { type: 'boolean', const: false, required: true },
  },
} as const satisfies ValueSchemaSpec
