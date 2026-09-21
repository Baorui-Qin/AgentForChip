if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob018_mux256to1/eda/run-SdwusS/snapshot-W2HYY0/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob018_mux256to1/eda/run-SdwusS/snapshot-W2HYY0/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob018_mux256to1/eda/run-SdwusS/build/.rtl-synth-WgMN0M/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob018_mux256to1/eda/run-SdwusS/build/.rtl-synth-WgMN0M/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
