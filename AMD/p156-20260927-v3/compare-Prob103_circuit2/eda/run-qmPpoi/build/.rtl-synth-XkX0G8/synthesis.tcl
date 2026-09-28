if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob103_circuit2/eda/run-qmPpoi/snapshot-vHC8f0/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob103_circuit2/eda/run-qmPpoi/snapshot-vHC8f0/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob103_circuit2/eda/run-qmPpoi/build/.rtl-synth-XkX0G8/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob103_circuit2/eda/run-qmPpoi/build/.rtl-synth-XkX0G8/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
