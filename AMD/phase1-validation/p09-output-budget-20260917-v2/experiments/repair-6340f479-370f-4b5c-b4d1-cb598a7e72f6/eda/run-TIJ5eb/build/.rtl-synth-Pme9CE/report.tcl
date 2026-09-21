if {[catch {
set_param general.maxThreads 4
open_checkpoint "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-6340f479-370f-4b5c-b4d1-cb598a7e72f6/eda/run-TIJ5eb/build/.rtl-synth-Pme9CE/design.dcp"
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
