if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob129_ece241_2013_q8/eda/run-pCClMo/snapshot-r3fPHj/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob129_ece241_2013_q8/eda/run-pCClMo/snapshot-r3fPHj/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob129_ece241_2013_q8/eda/run-pCClMo/build/.rtl-synth-deR24t/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob129_ece241_2013_q8/eda/run-pCClMo/build/.rtl-synth-deR24t/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
