if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob142_lemmings2/eda/run-LD99b5/snapshot-o05HIw/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob142_lemmings2/eda/run-LD99b5/snapshot-o05HIw/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob142_lemmings2/eda/run-LD99b5/build/.rtl-synth-WBzqZh/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob142_lemmings2/eda/run-LD99b5/build/.rtl-synth-WBzqZh/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
