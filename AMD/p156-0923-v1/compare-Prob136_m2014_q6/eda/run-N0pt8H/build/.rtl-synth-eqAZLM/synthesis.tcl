if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob136_m2014_q6/eda/run-N0pt8H/snapshot-9jyrFs/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob136_m2014_q6/eda/run-N0pt8H/snapshot-9jyrFs/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob136_m2014_q6/eda/run-N0pt8H/build/.rtl-synth-eqAZLM/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob136_m2014_q6/eda/run-N0pt8H/build/.rtl-synth-eqAZLM/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
