if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob025_reduction/eda/run-kIULOU/snapshot-En37KO/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob025_reduction/eda/run-kIULOU/snapshot-En37KO/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob025_reduction/eda/run-kIULOU/build/.rtl-synth-cL1znd/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob025_reduction/eda/run-kIULOU/build/.rtl-synth-cL1znd/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
