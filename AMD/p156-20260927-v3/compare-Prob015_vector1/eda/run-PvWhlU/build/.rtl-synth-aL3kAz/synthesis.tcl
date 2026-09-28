if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob015_vector1/eda/run-PvWhlU/snapshot-6aOuB6/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob015_vector1/eda/run-PvWhlU/snapshot-6aOuB6/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob015_vector1/eda/run-PvWhlU/build/.rtl-synth-aL3kAz/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob015_vector1/eda/run-PvWhlU/build/.rtl-synth-aL3kAz/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
