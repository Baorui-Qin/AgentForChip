if {[catch {
set_param general.maxThreads 4
open_checkpoint "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-13698a00-03c8-419e-ac58-b9525bc98254/eda/run-kIrebC/build/.rtl-synth-KDhVRq/design.dcp"
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
