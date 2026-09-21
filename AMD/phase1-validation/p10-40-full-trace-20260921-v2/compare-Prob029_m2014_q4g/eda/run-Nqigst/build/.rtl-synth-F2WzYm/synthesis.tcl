if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob029_m2014_q4g/eda/run-Nqigst/snapshot-hu30wb/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob029_m2014_q4g/eda/run-Nqigst/snapshot-hu30wb/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob029_m2014_q4g/eda/run-Nqigst/build/.rtl-synth-F2WzYm/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob029_m2014_q4g/eda/run-Nqigst/build/.rtl-synth-F2WzYm/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
