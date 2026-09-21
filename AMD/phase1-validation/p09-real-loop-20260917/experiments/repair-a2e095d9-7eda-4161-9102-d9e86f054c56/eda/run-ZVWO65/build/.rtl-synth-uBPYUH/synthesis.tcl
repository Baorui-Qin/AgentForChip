if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-a2e095d9-7eda-4161-9102-d9e86f054c56/eda/run-ZVWO65/snapshot-wC5zkD/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-a2e095d9-7eda-4161-9102-d9e86f054c56/eda/run-ZVWO65/snapshot-wC5zkD/trusted/clock.xdc"]
synth_design -top "enable_counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-a2e095d9-7eda-4161-9102-d9e86f054c56/eda/run-ZVWO65/build/.rtl-synth-uBPYUH/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-a2e095d9-7eda-4161-9102-d9e86f054c56/eda/run-ZVWO65/build/.rtl-synth-uBPYUH/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
