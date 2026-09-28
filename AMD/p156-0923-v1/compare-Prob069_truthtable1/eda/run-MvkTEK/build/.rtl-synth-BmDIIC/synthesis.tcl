if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob069_truthtable1/eda/run-MvkTEK/snapshot-qG03Qh/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob069_truthtable1/eda/run-MvkTEK/snapshot-qG03Qh/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob069_truthtable1/eda/run-MvkTEK/build/.rtl-synth-BmDIIC/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob069_truthtable1/eda/run-MvkTEK/build/.rtl-synth-BmDIIC/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
