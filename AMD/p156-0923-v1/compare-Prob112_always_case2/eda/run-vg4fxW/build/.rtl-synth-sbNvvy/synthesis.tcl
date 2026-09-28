if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob112_always_case2/eda/run-vg4fxW/snapshot-JnFGY7/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob112_always_case2/eda/run-vg4fxW/snapshot-JnFGY7/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob112_always_case2/eda/run-vg4fxW/build/.rtl-synth-sbNvvy/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob112_always_case2/eda/run-vg4fxW/build/.rtl-synth-sbNvvy/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
