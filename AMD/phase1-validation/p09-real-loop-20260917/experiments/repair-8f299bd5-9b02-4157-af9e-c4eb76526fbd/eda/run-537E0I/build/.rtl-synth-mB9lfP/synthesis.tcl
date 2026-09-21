if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-8f299bd5-9b02-4157-af9e-c4eb76526fbd/eda/run-537E0I/snapshot-xeW23I/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-8f299bd5-9b02-4157-af9e-c4eb76526fbd/eda/run-537E0I/snapshot-xeW23I/trusted/clock.xdc"]
synth_design -top "rising_edge" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-8f299bd5-9b02-4157-af9e-c4eb76526fbd/eda/run-537E0I/build/.rtl-synth-mB9lfP/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-8f299bd5-9b02-4157-af9e-c4eb76526fbd/eda/run-537E0I/build/.rtl-synth-mB9lfP/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
