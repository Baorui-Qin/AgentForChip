if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob113_2012_q1g/eda/run-fQIJ7M/snapshot-c0JckF/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob113_2012_q1g/eda/run-fQIJ7M/snapshot-c0JckF/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob113_2012_q1g/eda/run-fQIJ7M/build/.rtl-synth-ozsTdd/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob113_2012_q1g/eda/run-fQIJ7M/build/.rtl-synth-ozsTdd/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
