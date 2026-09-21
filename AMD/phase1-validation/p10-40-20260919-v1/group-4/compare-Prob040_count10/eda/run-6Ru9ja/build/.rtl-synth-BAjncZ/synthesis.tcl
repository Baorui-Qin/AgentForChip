if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-4/compare-Prob040_count10/eda/run-6Ru9ja/snapshot-pPCHbv/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-4/compare-Prob040_count10/eda/run-6Ru9ja/snapshot-pPCHbv/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-20260919-v1/group-4/compare-Prob040_count10/eda/run-6Ru9ja/build/.rtl-synth-BAjncZ/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-20260919-v1/group-4/compare-Prob040_count10/eda/run-6Ru9ja/build/.rtl-synth-BAjncZ/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
