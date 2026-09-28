if {[catch {
set_param general.maxThreads 4
open_checkpoint "D:/AMD/p156-0923-v1/compare-Prob049_m2014_q4b/eda/run-Nmb1ND/build/.rtl-synth-ewZPiO/design.dcp"
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
