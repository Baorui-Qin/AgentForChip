if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-38856fc3-c242-40b2-80f9-1a35096c445e/eda/run-lWPoYQ/snapshot-JDY96L/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-38856fc3-c242-40b2-80f9-1a35096c445e/eda/run-lWPoYQ/snapshot-JDY96L/trusted/clock.xdc"]
synth_design -top "ready_valid_slot" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-38856fc3-c242-40b2-80f9-1a35096c445e/eda/run-lWPoYQ/build/.rtl-synth-PQzfUs/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-38856fc3-c242-40b2-80f9-1a35096c445e/eda/run-lWPoYQ/build/.rtl-synth-PQzfUs/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
