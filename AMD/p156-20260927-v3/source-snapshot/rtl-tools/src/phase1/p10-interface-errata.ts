/** User-approved public interface errata, independent of hidden evaluator contents. @module rtl-tools/phase1/p10-interface-errata */
import type { P10Task } from './p10-dataset.ts'
import { sha256 } from './snapshots.ts'

/** Public interpretation frozen alongside the unchanged prompt and shared by both model arms. */
export interface PublicInterfaceErratum {
  id: string; approved_on: string; spec_sha256: string; explanation: string
}

const approved: Record<string, { erratum: PublicInterfaceErratum; ports: NonNullable<P10Task['interface']>['ports']; clock: P10Task['clock'] }> = {
  Prob031_dff: {
    erratum: { id: 'p10-public-interface-031-v1', approved_on: '2026-09-27', spec_sha256: '6e6d5252b2dd621ee0ec83d679278bca5dc125a98a028546c90dd28fe46b662c',
      explanation: 'The public prompt lists q as input, but requires a positive-edge D flip-flop. Interpret q as a one-bit output; clk and d remain one-bit inputs. This approved interface correction overrides only that port-direction typo; the original prompt is preserved.' },
    ports: [{ name: 'clk', direction: 'input', width: 1, signed: false }, { name: 'd', direction: 'input', width: 1, signed: false }, { name: 'q', direction: 'output', width: 1, signed: false }],
    clock: { kind: 'physical', port: 'clk', period_ns: 5 },
  },
  Prob062_bugs_mux2: {
    erratum: { id: 'p10-public-interface-062-v1', approved_on: '2026-09-27', spec_sha256: '5ad5285b165fa83ab78328347e819f6a0d99f3b3e10ef0a562f24520bc3390ee',
      explanation: 'The public prompt requires an 8-bit 2-to-1 mux, but its buggy example declares out as one bit. Interpret out as an eight-bit output; sel remains a one-bit input and a and b remain eight-bit inputs. This approved interface correction overrides only that output-width typo; the original prompt is preserved.' },
    ports: [{ name: 'sel', direction: 'input', width: 1, signed: false }, { name: 'a', direction: 'input', width: 8, signed: false }, { name: 'b', direction: 'input', width: 8, signed: false }, { name: 'out', direction: 'output', width: 8, signed: false }],
    clock: { kind: 'virtual', port: null, period_ns: 5 },
  },
}

/** Apply only exact-prompt, explicitly approved corrections when creating a new catalog. @param task - original catalog entry, never modified in place. @returns effective interface and public erratum, with spec and asset identities preserved. */
export function applyPublicInterfaceErratum(task: P10Task): P10Task {
  const entry = approved[task.task_id]
  if (!entry) return task
  if (sha256(task.spec) !== entry.erratum.spec_sha256 || task.assets[`dataset_spec-to-rtl/${task.task_id}_prompt.txt`] !== entry.erratum.spec_sha256) throw new Error('PUBLIC_INTERFACE_ERRATUM_SPEC_CHANGED')
  return { ...task, interface: { top: 'TopModule', ports: structuredClone(entry.ports) }, interface_error: null,
    clock: structuredClone(entry.clock), public_interface_erratum: { ...entry.erratum } }
}
