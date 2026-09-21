if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-agent-rerun-10-20260920-v1/compare-Prob061_2014_q4a/eda/run-FXABh5/snapshot-IXzkPh/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-agent-rerun-10-20260920-v1/compare-Prob061_2014_q4a/eda/run-FXABh5/snapshot-IXzkPh/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-agent-rerun-10-20260920-v1/compare-Prob061_2014_q4a/eda/run-FXABh5/build/.rtl-synth-AscXGW/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-agent-rerun-10-20260920-v1/compare-Prob061_2014_q4a/eda/run-FXABh5/build/.rtl-synth-AscXGW/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
