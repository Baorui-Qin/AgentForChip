if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob020_mt2015_eq2/eda/run-iGvOwL/snapshot-dsyqf8/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob020_mt2015_eq2/eda/run-iGvOwL/snapshot-dsyqf8/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob020_mt2015_eq2/eda/run-iGvOwL/build/.rtl-synth-wqcMIi/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-transport-tool-trace-20260921-v2/compare-Prob020_mt2015_eq2/eda/run-iGvOwL/build/.rtl-synth-wqcMIi/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
