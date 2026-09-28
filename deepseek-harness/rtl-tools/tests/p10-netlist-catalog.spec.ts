import { expect, it } from 'vitest'
import { netlistProfile, netlistProfiles } from '../src/phase1/p10-netlist-profiles.ts'
import { calibratedNetlistProfiles, netlistCalibrationEvidence } from '../src/phase1/p10-netlist-calibrated.ts'
import type { P10Task } from '../src/phase1/p10-dataset.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { applyPublicInterfaceErratum } from '../src/phase1/p10-interface-errata.ts'
import { originalErratumTask } from './fixtures/p10-interface-errata.ts'

function zeroTask(): P10Task {
  return { task_id: 'Prob001_zero', spec: '\r\nI would like you to implement a module named TopModule with the following\r\ninterface. All input and output ports are one bit unless otherwise\r\nspecified.\r\n\r\n - output zero\r\n\r\nThe module should always outputs a LOW.\r\n\r\n',
    assets: { ...calibratedNetlistProfiles.Prob001_zero!.provenance!.assets }, interface: null, interface_error: null, clock: { kind: 'virtual', port: null, period_ns: 5 } }
}

it('enables calibrated rules without replacing the three original public-spec controls', () => {
  expect(Object.keys(calibratedNetlistProfiles)).toHaveLength(153)
  expect(Object.keys(netlistProfiles)).toHaveLength(156)
  expect(netlistProfiles.Prob007_wire!.id).toBe('wire-01-v1')
  expect(netlistProfiles.Prob005_notgate!.id).toBe('not-01-v1')
  expect(netlistProfiles.Prob041_dff8r!.id).toBe('dff8r-sync-v1')
  expect(netlistProfiles.Prob031_dff!.checks).toBe(240)
  expect(netlistProfiles.Prob062_bugs_mux2!.checks).toBe(226)
})

it.each(['Prob031_dff', 'Prob062_bugs_mux2'] as const)('requires the frozen public erratum to enable %s without upgrading an old catalog', id => {
  const profile = calibratedNetlistProfiles[id]!
  const oldTask = { ...originalErratumTask(id), assets: { ...profile.provenance!.assets } }
  expect(netlistProfile(oldTask)).toBeNull()
  const task = applyPublicInterfaceErratum(oldTask)
  expect(netlistProfile(task)).toBe(profile)
  expect(profile.provenance!.public_interface_erratum).toEqual(task.public_interface_erratum)
  for (const key of ['id', 'approved_on', 'spec_sha256', 'explanation'] as const) {
    expect(netlistProfile({ ...task, public_interface_erratum: { ...task.public_interface_erratum!, [key]: 'changed' } })).toBeNull()
  }
})

it('binds every published profile to its positive and negative calibration receipt hashes', () => {
  for (const [id, profile] of Object.entries(calibratedNetlistProfiles)) {
    const evidence = netlistCalibrationEvidence[id as keyof typeof netlistCalibrationEvidence]
    expect(evidence.profile_sha256).toBe(sha256(JSON.stringify(profile)))
    expect(evidence.positive.status).toBe('PASS')
    expect(evidence.positive.checks).toBe(profile.checks)
    expect(evidence.negative.status).toBe('NETLIST_MISMATCH')
    expect(evidence.negative.checks).toBe(profile.checks)
    expect(evidence.negative.mismatches).toBeGreaterThan(0)
    expect(profile.checks).toBeGreaterThan(0)
    expect(profile.provenance!.assets[`dataset_spec-to-rtl/${id}_test.sv`]).toMatch(/^[a-f0-9]{64}$/)
    expect(profile.provenance!.assets[`dataset_spec-to-rtl/${id}_ref.sv`]).toMatch(/^[a-f0-9]{64}$/)
  }
})

it('selects a generated oracle only for the exact public spec and complete asset set', () => {
  const task = zeroTask()
  expect(netlistProfile(task)).toBe(calibratedNetlistProfiles.Prob001_zero)
  expect(netlistProfile({ ...task, spec: task.spec + ' ' })).toBeNull()
  for (const path of Object.keys(task.assets)) {
    expect(netlistProfile({ ...task, assets: { ...task.assets, [path]: '0'.repeat(64) } })).toBeNull()
    const assets = { ...task.assets }; delete assets[path]
    expect(netlistProfile({ ...task, assets })).toBeNull()
  }
  expect(netlistProfile({ ...task, assets: { ...task.assets, unexpected: '0'.repeat(64) } })).toBeNull()
})
