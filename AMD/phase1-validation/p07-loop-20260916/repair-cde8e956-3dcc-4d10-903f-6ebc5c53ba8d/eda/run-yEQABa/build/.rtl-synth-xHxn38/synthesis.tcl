if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p07-loop-20260916/repair-cde8e956-3dcc-4d10-903f-6ebc5c53ba8d/eda/run-yEQABa/snapshot-SerE7Z/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p07-loop-20260916/repair-cde8e956-3dcc-4d10-903f-6ebc5c53ba8d/eda/run-yEQABa/snapshot-SerE7Z/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p07-loop-20260916/repair-cde8e956-3dcc-4d10-903f-6ebc5c53ba8d/eda/run-yEQABa/build/.rtl-synth-xHxn38/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p07-loop-20260916/repair-cde8e956-3dcc-4d10-903f-6ebc5c53ba8d/eda/run-yEQABa/build/.rtl-synth-xHxn38/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
