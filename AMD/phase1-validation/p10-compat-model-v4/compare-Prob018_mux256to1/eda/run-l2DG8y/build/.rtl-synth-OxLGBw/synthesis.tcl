if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-compat-model-v4/compare-Prob018_mux256to1/eda/run-l2DG8y/snapshot-tbBPcU/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-compat-model-v4/compare-Prob018_mux256to1/eda/run-l2DG8y/snapshot-tbBPcU/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-compat-model-v4/compare-Prob018_mux256to1/eda/run-l2DG8y/build/.rtl-synth-OxLGBw/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-compat-model-v4/compare-Prob018_mux256to1/eda/run-l2DG8y/build/.rtl-synth-OxLGBw/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
