if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob074_ece241_2014_q4/eda/run-dXc7Z8/snapshot-laLtlo/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob074_ece241_2014_q4/eda/run-dXc7Z8/snapshot-laLtlo/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob074_ece241_2014_q4/eda/run-dXc7Z8/build/.rtl-synth-47CcM6/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob074_ece241_2014_q4/eda/run-dXc7Z8/build/.rtl-synth-47CcM6/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
