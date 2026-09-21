if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob121_2014_q3bfsm/eda/run-TdOBDN/snapshot-4gJqHx/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob121_2014_q3bfsm/eda/run-TdOBDN/snapshot-4gJqHx/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob121_2014_q3bfsm/eda/run-TdOBDN/build/.rtl-synth-CxcWDX/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob121_2014_q3bfsm/eda/run-TdOBDN/build/.rtl-synth-CxcWDX/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
