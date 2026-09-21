if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob023_vector100r/eda/run-l3pNYn/snapshot-WYVc9W/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob023_vector100r/eda/run-l3pNYn/snapshot-WYVc9W/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob023_vector100r/eda/run-l3pNYn/build/.rtl-synth-c7Nd0s/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob023_vector100r/eda/run-l3pNYn/build/.rtl-synth-c7Nd0s/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
