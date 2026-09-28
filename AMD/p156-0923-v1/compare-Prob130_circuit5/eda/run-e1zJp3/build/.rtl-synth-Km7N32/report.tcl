if {[catch {
set_param general.maxThreads 4
open_checkpoint "D:/AMD/p156-0923-v1/compare-Prob130_circuit5/eda/run-e1zJp3/build/.rtl-synth-Km7N32/design.dcp"
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
