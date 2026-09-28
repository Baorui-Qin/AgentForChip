if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob038_count15/eda/run-3ZgZST/snapshot-SaddGX/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob038_count15/eda/run-3ZgZST/snapshot-SaddGX/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob038_count15/eda/run-3ZgZST/build/.rtl-synth-O0QiuM/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob038_count15/eda/run-3ZgZST/build/.rtl-synth-O0QiuM/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
