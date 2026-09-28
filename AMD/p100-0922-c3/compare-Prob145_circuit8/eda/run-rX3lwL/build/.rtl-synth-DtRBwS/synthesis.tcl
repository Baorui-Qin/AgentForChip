if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p100-0922-c3/compare-Prob145_circuit8/eda/run-rX3lwL/snapshot-3SM1Ea/rtl/solution.sv"]
read_xdc [list "D:/AMD/p100-0922-c3/compare-Prob145_circuit8/eda/run-rX3lwL/snapshot-3SM1Ea/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p100-0922-c3/compare-Prob145_circuit8/eda/run-rX3lwL/build/.rtl-synth-DtRBwS/netlist.v"
write_checkpoint -force "D:/AMD/p100-0922-c3/compare-Prob145_circuit8/eda/run-rX3lwL/build/.rtl-synth-DtRBwS/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
