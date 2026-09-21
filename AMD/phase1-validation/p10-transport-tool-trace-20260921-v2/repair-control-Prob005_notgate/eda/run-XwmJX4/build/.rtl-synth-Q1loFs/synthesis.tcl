if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/repair-control-Prob005_notgate/eda/run-XwmJX4/snapshot-HZ3uzN/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/repair-control-Prob005_notgate/eda/run-XwmJX4/snapshot-HZ3uzN/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/repair-control-Prob005_notgate/eda/run-XwmJX4/build/.rtl-synth-Q1loFs/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/repair-control-Prob005_notgate/eda/run-XwmJX4/build/.rtl-synth-Q1loFs/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
