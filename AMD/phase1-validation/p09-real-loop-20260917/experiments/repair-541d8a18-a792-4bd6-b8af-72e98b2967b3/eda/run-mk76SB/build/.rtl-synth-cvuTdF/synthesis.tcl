if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-541d8a18-a792-4bd6-b8af-72e98b2967b3/eda/run-mk76SB/snapshot-2mrupl/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-541d8a18-a792-4bd6-b8af-72e98b2967b3/eda/run-mk76SB/snapshot-2mrupl/trusted/clock.xdc"]
synth_design -top "signed_saturating_add" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-541d8a18-a792-4bd6-b8af-72e98b2967b3/eda/run-mk76SB/build/.rtl-synth-cvuTdF/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-541d8a18-a792-4bd6-b8af-72e98b2967b3/eda/run-mk76SB/build/.rtl-synth-cvuTdF/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
