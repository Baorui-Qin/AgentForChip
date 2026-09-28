if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob155_lemmings4/eda/run-cLrYY6/snapshot-1H33K7/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob155_lemmings4/eda/run-cLrYY6/snapshot-1H33K7/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob155_lemmings4/eda/run-cLrYY6/build/.rtl-synth-HOsmzI/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob155_lemmings4/eda/run-cLrYY6/build/.rtl-synth-HOsmzI/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
