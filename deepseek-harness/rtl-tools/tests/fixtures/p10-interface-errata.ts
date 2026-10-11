import { publicInterface, type P10Task } from '../../src/phase1/p10-dataset.ts'
import { sha256 } from '../../src/phase1/snapshots.ts'

const specs = {
  Prob031_dff: '\r\nI would like you to implement a module named TopModule with the following\r\ninterface. All input and output ports are one bit unless otherwise\r\nspecified.\r\n\r\n - input clk\r\n - input d\r\n - input q\r\n\r\nThe module should implement a single D flip-flop. Assume all sequential\r\nlogic is triggered on the positive edge of the clock.\r\n\r\n',
  Prob062_bugs_mux2: '\r\nConsider the following implementation of an 8-bit 2-to-1 mux:\r\n\r\n  module TopModule (\r\n      input        sel,\r\n      input  [7:0] a,\r\n      input  [7:0] b,\r\n      output       out\r\n  );\r\n\r\n      assign out = (~sel & a) | (sel & b);\r\n\r\n  endmodule\r\n\r\nUnfortunately, this module has a bug. Implement a new version of this\r\nmodule that fixes the bug.\r\n\r\n',
}

/** Exact public text and uncorrected interface, without hidden reference or test contents. @param task_id - reviewed task. @returns a fresh historical-style entry. */
export function originalErratumTask(task_id: keyof typeof specs): P10Task {
  const spec = specs[task_id]
  return { task_id, spec, assets: { [`dataset_spec-to-rtl/${task_id}_prompt.txt`]: sha256(spec) },
    interface: task_id === 'Prob031_dff' ? publicInterface(spec) : null,
    interface_error: task_id === 'Prob031_dff' ? null : 'PUBLIC_INTERFACE_CONFLICT',
    clock: task_id === 'Prob031_dff' ? { kind: 'physical', port: 'clk', period_ns: 5 } : null }
}
