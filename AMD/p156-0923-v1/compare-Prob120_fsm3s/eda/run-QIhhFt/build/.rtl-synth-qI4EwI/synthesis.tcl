if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob120_fsm3s/eda/run-QIhhFt/snapshot-bRR2L1/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob120_fsm3s/eda/run-QIhhFt/snapshot-bRR2L1/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob120_fsm3s/eda/run-QIhhFt/build/.rtl-synth-qI4EwI/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob120_fsm3s/eda/run-QIhhFt/build/.rtl-synth-qI4EwI/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
