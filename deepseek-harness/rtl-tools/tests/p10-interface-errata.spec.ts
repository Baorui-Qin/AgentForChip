import { expect, it } from 'vitest'
import { applyPublicInterfaceErratum } from '../src/phase1/p10-interface-errata.ts'
import { publicInterface, referenceWrapper } from '../src/phase1/p10-dataset.ts'
import { originalErratumTask } from './fixtures/p10-interface-errata.ts'

it.each(['Prob031_dff', 'Prob062_bugs_mux2'] as const)('corrects only approved interface metadata for %s without changing the raw prompt or prior catalog', id => {
  const original = originalErratumTask(id), before = structuredClone(original)
  const task = applyPublicInterfaceErratum(original)
  expect(original).toEqual(before)
  expect(task.spec).toBe(original.spec)
  expect(task.assets).toEqual(original.assets)
  expect(applyPublicInterfaceErratum(task)).toEqual(task)
  expect(task.interface_error).toBeNull()
  expect(task.public_interface_erratum).toMatchObject({ approved_on: '2026-09-27', spec_sha256: original.assets[`dataset_spec-to-rtl/${id}_prompt.txt`] })
  if (id === 'Prob031_dff') {
    expect(publicInterface(original.spec).ports[2]).toMatchObject({ name: 'q', direction: 'input' })
    expect(task.interface!.ports[2]).toMatchObject({ name: 'q', direction: 'output', width: 1 })
    expect(task.clock).toEqual({ kind: 'physical', port: 'clk', period_ns: 5 })
    expect(referenceWrapper(task)).toContain('output wire q')
  } else {
    expect(() => publicInterface(original.spec)).toThrow('PUBLIC_INTERFACE_CONFLICT')
    expect(task.interface!.ports[3]).toMatchObject({ name: 'out', direction: 'output', width: 8 })
    expect(task.clock).toEqual({ kind: 'virtual', port: null, period_ns: 5 })
    expect(referenceWrapper(task)).toContain('output wire [7:0] out')
  }
})

it.each(['Prob031_dff', 'Prob062_bugs_mux2'] as const)('refuses stale approval after %s prompt or asset identity changes', id => {
  const task = originalErratumTask(id)
  expect(() => applyPublicInterfaceErratum({ ...task, spec: task.spec + ' ' })).toThrow('PUBLIC_INTERFACE_ERRATUM_SPEC_CHANGED')
  expect(() => applyPublicInterfaceErratum({ ...task, assets: {} })).toThrow('PUBLIC_INTERFACE_ERRATUM_SPEC_CHANGED')
})

it('does not extrapolate an approval to an unreviewed task with identical text', () => {
  const task = { ...originalErratumTask('Prob062_bugs_mux2'), task_id: 'Prob999_unreviewed' }
  expect(applyPublicInterfaceErratum(task)).toBe(task)
  expect(task.interface).toBeNull()
})
