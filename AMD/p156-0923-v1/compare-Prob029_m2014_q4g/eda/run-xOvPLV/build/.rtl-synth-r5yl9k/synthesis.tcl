if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob029_m2014_q4g/eda/run-xOvPLV/snapshot-sGwwdE/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob029_m2014_q4g/eda/run-xOvPLV/snapshot-sGwwdE/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob029_m2014_q4g/eda/run-xOvPLV/build/.rtl-synth-r5yl9k/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob029_m2014_q4g/eda/run-xOvPLV/build/.rtl-synth-r5yl9k/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
