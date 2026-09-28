if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob058_alwaysblock2/eda/run-G37Hv4/snapshot-m08gtF/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob058_alwaysblock2/eda/run-G37Hv4/snapshot-m08gtF/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob058_alwaysblock2/eda/run-G37Hv4/build/.rtl-synth-GwN6Ea/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob058_alwaysblock2/eda/run-G37Hv4/build/.rtl-synth-GwN6Ea/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
