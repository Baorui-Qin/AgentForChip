if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-1e73ca47-751f-4046-90c8-75ab71c64051/eda/run-SJoDD5/snapshot-GxnMIl/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-1e73ca47-751f-4046-90c8-75ab71c64051/eda/run-SJoDD5/snapshot-GxnMIl/trusted/clock.xdc"]
synth_design -top "ready_valid_slot" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-1e73ca47-751f-4046-90c8-75ab71c64051/eda/run-SJoDD5/build/.rtl-synth-EChwKO/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-1e73ca47-751f-4046-90c8-75ab71c64051/eda/run-SJoDD5/build/.rtl-synth-EChwKO/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
