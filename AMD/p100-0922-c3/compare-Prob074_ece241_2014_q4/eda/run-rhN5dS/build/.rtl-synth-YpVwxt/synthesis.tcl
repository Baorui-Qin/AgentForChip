if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p100-0922-c2/compare-Prob074_ece241_2014_q4/eda/run-rhN5dS/snapshot-C8DzCD/rtl/solution.sv"]
read_xdc [list "D:/AMD/p100-0922-c2/compare-Prob074_ece241_2014_q4/eda/run-rhN5dS/snapshot-C8DzCD/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p100-0922-c2/compare-Prob074_ece241_2014_q4/eda/run-rhN5dS/build/.rtl-synth-YpVwxt/netlist.v"
write_checkpoint -force "D:/AMD/p100-0922-c2/compare-Prob074_ece241_2014_q4/eda/run-rhN5dS/build/.rtl-synth-YpVwxt/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
