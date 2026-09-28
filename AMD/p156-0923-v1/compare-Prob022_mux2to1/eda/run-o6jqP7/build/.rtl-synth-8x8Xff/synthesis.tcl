if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob022_mux2to1/eda/run-o6jqP7/snapshot-H4PMP6/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob022_mux2to1/eda/run-o6jqP7/snapshot-H4PMP6/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob022_mux2to1/eda/run-o6jqP7/build/.rtl-synth-8x8Xff/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob022_mux2to1/eda/run-o6jqP7/build/.rtl-synth-8x8Xff/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
