if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob020_mt2015_eq2/eda/run-GhIupv/snapshot-3guAcn/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob020_mt2015_eq2/eda/run-GhIupv/snapshot-3guAcn/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob020_mt2015_eq2/eda/run-GhIupv/build/.rtl-synth-75XXyE/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob020_mt2015_eq2/eda/run-GhIupv/build/.rtl-synth-75XXyE/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
