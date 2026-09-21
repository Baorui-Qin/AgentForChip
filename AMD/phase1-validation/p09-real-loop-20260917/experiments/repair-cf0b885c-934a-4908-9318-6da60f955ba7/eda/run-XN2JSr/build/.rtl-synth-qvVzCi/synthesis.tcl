if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-cf0b885c-934a-4908-9318-6da60f955ba7/eda/run-XN2JSr/snapshot-aaHuJh/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-cf0b885c-934a-4908-9318-6da60f955ba7/eda/run-XN2JSr/snapshot-aaHuJh/trusted/clock.xdc"]
synth_design -top "enable_counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-cf0b885c-934a-4908-9318-6da60f955ba7/eda/run-XN2JSr/build/.rtl-synth-qvVzCi/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-cf0b885c-934a-4908-9318-6da60f955ba7/eda/run-XN2JSr/build/.rtl-synth-qvVzCi/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
