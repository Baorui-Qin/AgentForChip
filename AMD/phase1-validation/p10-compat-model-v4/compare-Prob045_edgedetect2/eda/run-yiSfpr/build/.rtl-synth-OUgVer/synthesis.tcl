if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-compat-model-v4/compare-Prob045_edgedetect2/eda/run-yiSfpr/snapshot-d16laV/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-compat-model-v4/compare-Prob045_edgedetect2/eda/run-yiSfpr/snapshot-d16laV/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-compat-model-v4/compare-Prob045_edgedetect2/eda/run-yiSfpr/build/.rtl-synth-OUgVer/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-compat-model-v4/compare-Prob045_edgedetect2/eda/run-yiSfpr/build/.rtl-synth-OUgVer/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
