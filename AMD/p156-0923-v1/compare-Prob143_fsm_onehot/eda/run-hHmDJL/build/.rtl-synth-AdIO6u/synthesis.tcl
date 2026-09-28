if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob143_fsm_onehot/eda/run-hHmDJL/snapshot-qhZWl5/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob143_fsm_onehot/eda/run-hHmDJL/snapshot-qhZWl5/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob143_fsm_onehot/eda/run-hHmDJL/build/.rtl-synth-AdIO6u/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob143_fsm_onehot/eda/run-hHmDJL/build/.rtl-synth-AdIO6u/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
