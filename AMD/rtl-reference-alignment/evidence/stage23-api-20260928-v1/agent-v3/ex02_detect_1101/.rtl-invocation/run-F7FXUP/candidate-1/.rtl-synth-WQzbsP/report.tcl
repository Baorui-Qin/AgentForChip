if {[catch {
set_param general.maxThreads 2
open_checkpoint "D:/AMD/rtl-reference-alignment/evidence/stage23-api-20260928-v1/agent-v3/ex02_detect_1101/.rtl-invocation/run-F7FXUP/candidate-1/.rtl-synth-WQzbsP/design.dcp"
report_utilization -file utilization.rpt
report_timing_summary -delay_type min_max -report_unconstrained -file timing.rpt
set f [open clocks.count w]
puts $f [llength [get_clocks -quiet *]]
close $f
set f [open paths.count w]
puts $f [llength [get_timing_paths -quiet -delay_type max -max_paths 1]]
close $f
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
