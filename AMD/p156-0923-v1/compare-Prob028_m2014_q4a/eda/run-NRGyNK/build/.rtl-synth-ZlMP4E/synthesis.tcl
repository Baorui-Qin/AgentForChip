if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob028_m2014_q4a/eda/run-NRGyNK/snapshot-UQJTs3/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob028_m2014_q4a/eda/run-NRGyNK/snapshot-UQJTs3/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob028_m2014_q4a/eda/run-NRGyNK/build/.rtl-synth-ZlMP4E/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob028_m2014_q4a/eda/run-NRGyNK/build/.rtl-synth-ZlMP4E/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
