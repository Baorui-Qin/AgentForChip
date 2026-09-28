if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob019_m2014_q4f/eda/run-tbZvn7/snapshot-Ql9WVu/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob019_m2014_q4f/eda/run-tbZvn7/snapshot-Ql9WVu/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob019_m2014_q4f/eda/run-tbZvn7/build/.rtl-synth-T6fbnP/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob019_m2014_q4f/eda/run-tbZvn7/build/.rtl-synth-T6fbnP/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
