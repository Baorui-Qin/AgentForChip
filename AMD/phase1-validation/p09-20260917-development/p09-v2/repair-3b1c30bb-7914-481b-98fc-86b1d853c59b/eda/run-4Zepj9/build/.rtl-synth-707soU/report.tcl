if {[catch {
set_param general.maxThreads 4
open_checkpoint "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-3b1c30bb-7914-481b-98fc-86b1d853c59b/eda/run-4Zepj9/build/.rtl-synth-707soU/design.dcp"
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
