if {[catch {
set_param general.maxThreads 4
open_checkpoint "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob004_vector2/eda/run-O8325j/build/.rtl-synth-ajy4XD/design.dcp"
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
