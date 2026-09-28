if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob045_edgedetect2/eda/run-d511lH/snapshot-dTdf6Z/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob045_edgedetect2/eda/run-d511lH/snapshot-dTdf6Z/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob045_edgedetect2/eda/run-d511lH/build/.rtl-synth-Zu4MOZ/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob045_edgedetect2/eda/run-d511lH/build/.rtl-synth-Zu4MOZ/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
