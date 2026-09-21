if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-9e94912d-ec28-49bf-9450-d8891c0a1318/eda/run-czo01G/snapshot-8KCD9c/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-9e94912d-ec28-49bf-9450-d8891c0a1318/eda/run-czo01G/snapshot-8KCD9c/trusted/clock.xdc"]
synth_design -top "enable_counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-9e94912d-ec28-49bf-9450-d8891c0a1318/eda/run-czo01G/build/.rtl-synth-oLZA8F/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-9e94912d-ec28-49bf-9450-d8891c0a1318/eda/run-czo01G/build/.rtl-synth-oLZA8F/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
