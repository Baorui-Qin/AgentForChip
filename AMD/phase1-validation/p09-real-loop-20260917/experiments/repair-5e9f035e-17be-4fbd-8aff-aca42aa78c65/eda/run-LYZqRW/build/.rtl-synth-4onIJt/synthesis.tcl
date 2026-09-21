if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-5e9f035e-17be-4fbd-8aff-aca42aa78c65/eda/run-LYZqRW/snapshot-DcaXzt/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-5e9f035e-17be-4fbd-8aff-aca42aa78c65/eda/run-LYZqRW/snapshot-DcaXzt/trusted/clock.xdc"]
synth_design -top "rising_edge" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-5e9f035e-17be-4fbd-8aff-aca42aa78c65/eda/run-LYZqRW/build/.rtl-synth-4onIJt/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-5e9f035e-17be-4fbd-8aff-aca42aa78c65/eda/run-LYZqRW/build/.rtl-synth-4onIJt/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
