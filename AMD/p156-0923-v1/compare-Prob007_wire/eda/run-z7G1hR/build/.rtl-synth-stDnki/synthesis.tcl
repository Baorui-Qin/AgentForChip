if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob007_wire/eda/run-z7G1hR/snapshot-0dIu9r/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob007_wire/eda/run-z7G1hR/snapshot-0dIu9r/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob007_wire/eda/run-z7G1hR/build/.rtl-synth-stDnki/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob007_wire/eda/run-z7G1hR/build/.rtl-synth-stDnki/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
