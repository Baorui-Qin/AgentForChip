/** Bounded XSim observations; waveform values do not replace the testbench verdict. @module rtl-tools/phase1/waveform-feedback */

/** A testbench-reported output failure, without inferred values or clock cycles. */
export interface OutputMismatch {
  signal: string; mismatches: number; first_time: number; raw: string
}
/** Selected raw output and optional timestamp-level VCD observations. */
export interface SimulationFeedback {
  outputs: OutputMismatch[]; raw_excerpt: string[]; omitted_lines: number
  first_failure_time: number | null; first_failure_cycle: null
  waveform: { status: 'available' | 'unavailable'; reason: string | null; timescale: string | null
    samples: { time: number; values: Record<string, string> }[]; sampling: string }
}
/** Preserve useful non-error XSim lines before the diagnostic severity filter. @param lines - decoded simulation output. @returns bounded observed facts. */
export function simulationFeedback(lines: string[]): SimulationFeedback {
  const outputs: OutputMismatch[] = [], raw: string[] = []
  let omitted = 0
  for (const line of lines) {
    if (!/^(?:Hint:|Mismatches:|Simulation finished|PHASE1_|\s*Fatal:|\s*FATAL:|TIMEOUT\b)|\b(?:expected|actual|mismatch)\b/i.test(line)) continue
    if (raw.length < 24) raw.push(line.slice(0, 512)); else omitted++
    const match = /^Hint: Output '([A-Za-z_][\w$]*)' has (\d+) mismatches\. First mismatch occurred at time (\d+)\.$/.exec(line.trim())
    if (match && outputs.length < 16 && [Number(match[2]), Number(match[3])].every(Number.isSafeInteger)) {
      outputs.push({ signal: match[1]!, mismatches: Number(match[2]), first_time: Number(match[3]), raw: line.slice(0, 512) })
    }
  }
  return { outputs, raw_excerpt: raw, omitted_lines: omitted,
    first_failure_time: outputs.length ? Math.min(...outputs.map(o => o.first_time)) : null, first_failure_cycle: null,
    waveform: { status: 'unavailable', reason: 'NO_WAVEFORM', timescale: null, samples: [],
      sampling: 'VCD samples are end-of-timestamp values, not testbench sampling events. *_ref is observed reference output; *_dut is observed DUT output. Do not infer a cycle, exact sampled expected/actual value, or root cause from these alone.' } }
}

/** Read the XSim-generated VCD subset and expose top-level signals and paired outputs near a reported failure. @param text - bounded VCD bytes. @param feedback - log-derived observations. @returns feedback with at most three waveform samples. */
export function withWaveform(text: string, feedback: SimulationFeedback): SimulationFeedback {
  const fail = (reason: string): SimulationFeedback => ({ ...feedback, waveform: { ...feedback.waveform, reason } })
  if (feedback.first_failure_time === null) return fail('NO_REPORTED_FAILURE_TIME')
  const headerEnd = text.indexOf('$enddefinitions $end')
  if (headerEnd < 0) return fail('UNSUPPORTED_VCD_HEADER')
  const header = text.slice(0, headerEnd), scope: string[] = []
  const variables = new Map<string, { name: string; width: number }[]>()
  let count = 0
  for (const directive of header.matchAll(/\$(scope|upscope|var)\s+([\s\S]*?)\$end/g)) {
    const parts = directive[2]!.trim().split(/\s+/)
    if (directive[1] === 'scope') scope.push(parts[1]!)
    else if (directive[1] === 'upscope') scope.pop()
    else if (scope.length === 1 && scope[0] === 'tb') {
      const [, widthText, id, name] = parts, width = Number(widthText)
      if (!id || !name || !Number.isSafeInteger(width) || width < 1 || width > 256) continue
      if (!feedback.outputs.some(o => name === o.signal + '_ref' || name === o.signal + '_dut') &&
        (!/^[A-Za-z_][\w$]*$/.test(name) || /_ref$|_dut$|wavedrom|stats|strobe|tb_match/.test(name))) continue
      if (++count > 32) continue
      variables.set(id, [...variables.get(id) ?? [], { name, width }])
    }
  }
  if (!feedback.outputs.some(o => [...variables.values()].flat().some(v => v.name === o.signal + '_ref') &&
    [...variables.values()].flat().some(v => v.name === o.signal + '_dut'))) return fail('NO_PAIRED_OUTPUTS')
  const timescale = /\$timescale\s+(\d+\s*(?:s|ms|us|ns|ps|fs))\s+\$end/.exec(header)?.[1]?.replace(/\s/g, '') ?? null
  // Testbench %t uses its own precision. Only the calibrated 1ps dataset scale is comparable here.
  if (timescale !== '1ps') return fail('UNSUPPORTED_TIME_ALIGNMENT')
  let time = 0, before: { time: number; values: Record<string, string> } | null = null
  const samples: { time: number; values: Record<string, string> }[] = [], values: Record<string, string> = {}
  const flush = () => {
    const sample = { time, values: { ...values } }
    if (time < feedback.first_failure_time!) before = sample
    else if (samples.length < 2) samples.push(sample)
  }
  for (const line of text.slice(headerEnd + '$enddefinitions $end'.length).split(/\r?\n/)) {
    const tick = /^#(\d+)\s*$/.exec(line)
    if (tick) {
      const next = Number(tick[1])
      if (!Number.isSafeInteger(next) || next < time) return fail('INVALID_VCD_TIME')
      if (next !== time) { flush(); if (samples.length === 2) break; time = next }
      continue
    }
    const vector = /^[bB]([01xXzZ]+)\s+(\S+)\s*$/.exec(line)
    const scalar = /^([01xXzZ])(\S+)\s*$/.exec(line)
    const change = vector ?? scalar
    if (!change) continue
    for (const variable of variables.get(change[2]!) ?? []) {
      const bits = change[1]!.toLowerCase()
      if (bits.length > variable.width) return fail('INVALID_VCD_WIDTH')
      values[variable.name] = bits.padStart(variable.width, /^[xz]/.test(bits) ? bits[0] : '0')
    }
  }
  if (samples.length < 2) flush()
  if (!samples.length) return fail('FAILURE_TIME_OUTSIDE_WAVEFORM')
  return { ...feedback, waveform: { ...feedback.waveform, status: 'available', reason: null, timescale,
    samples: [...before ? [before] : [], ...samples] } }
}
