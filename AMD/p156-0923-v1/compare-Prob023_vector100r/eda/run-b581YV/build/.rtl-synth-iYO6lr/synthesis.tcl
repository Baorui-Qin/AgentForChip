if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob023_vector100r/eda/run-b581YV/snapshot-xiJ1pp/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob023_vector100r/eda/run-b581YV/snapshot-xiJ1pp/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob023_vector100r/eda/run-b581YV/build/.rtl-synth-iYO6lr/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob023_vector100r/eda/run-b581YV/build/.rtl-synth-iYO6lr/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
