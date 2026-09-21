if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-ac48920d-c9b9-45c1-9ed1-2a08a83c452f/eda/run-RK8jUl/snapshot-Qe5wYz/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-ac48920d-c9b9-45c1-9ed1-2a08a83c452f/eda/run-RK8jUl/snapshot-Qe5wYz/trusted/clock.xdc"]
synth_design -top "ready_valid_slot" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-ac48920d-c9b9-45c1-9ed1-2a08a83c452f/eda/run-RK8jUl/build/.rtl-synth-MIRGFt/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-ac48920d-c9b9-45c1-9ed1-2a08a83c452f/eda/run-RK8jUl/build/.rtl-synth-MIRGFt/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
