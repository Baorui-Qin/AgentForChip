if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p100-0922-c3/compare-Prob101_circuit4/eda/run-w1J2kQ/snapshot-bcosBX/rtl/solution.sv"]
read_xdc [list "D:/AMD/p100-0922-c3/compare-Prob101_circuit4/eda/run-w1J2kQ/snapshot-bcosBX/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p100-0922-c3/compare-Prob101_circuit4/eda/run-w1J2kQ/build/.rtl-synth-e3sxux/netlist.v"
write_checkpoint -force "D:/AMD/p100-0922-c3/compare-Prob101_circuit4/eda/run-w1J2kQ/build/.rtl-synth-e3sxux/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
