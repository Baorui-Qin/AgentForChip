if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-966e9c03-701b-4e18-bd81-ea4ed27fcfe6/eda/run-1AJGDc/snapshot-fih3BG/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-966e9c03-701b-4e18-bd81-ea4ed27fcfe6/eda/run-1AJGDc/snapshot-fih3BG/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-966e9c03-701b-4e18-bd81-ea4ed27fcfe6/eda/run-1AJGDc/build/.rtl-synth-K7ntoj/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-966e9c03-701b-4e18-bd81-ea4ed27fcfe6/eda/run-1AJGDc/build/.rtl-synth-K7ntoj/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
