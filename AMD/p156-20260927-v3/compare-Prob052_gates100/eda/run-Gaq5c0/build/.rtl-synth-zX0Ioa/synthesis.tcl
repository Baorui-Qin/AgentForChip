if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob052_gates100/eda/run-Gaq5c0/snapshot-Y4b0tk/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob052_gates100/eda/run-Gaq5c0/snapshot-Y4b0tk/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob052_gates100/eda/run-Gaq5c0/build/.rtl-synth-zX0Ioa/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob052_gates100/eda/run-Gaq5c0/build/.rtl-synth-zX0Ioa/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
