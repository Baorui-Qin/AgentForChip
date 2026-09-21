if {[catch {
set_param general.maxThreads 4
open_checkpoint "D:/AMD/phase1-validation/p07-20260916/repair-ba415c6f-29b5-4dc1-8bcc-a66bec7d2dd8/eda/run-hCAwy2/build/.rtl-synth-L1Ecv8/design.dcp"
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
