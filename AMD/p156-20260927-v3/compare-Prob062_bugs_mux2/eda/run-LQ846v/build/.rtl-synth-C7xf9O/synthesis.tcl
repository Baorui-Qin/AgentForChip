if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob062_bugs_mux2/eda/run-LQ846v/snapshot-r23U0B/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob062_bugs_mux2/eda/run-LQ846v/snapshot-r23U0B/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob062_bugs_mux2/eda/run-LQ846v/build/.rtl-synth-C7xf9O/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob062_bugs_mux2/eda/run-LQ846v/build/.rtl-synth-C7xf9O/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
