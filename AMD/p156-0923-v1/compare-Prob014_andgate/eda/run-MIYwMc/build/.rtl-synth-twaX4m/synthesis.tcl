if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob014_andgate/eda/run-MIYwMc/snapshot-pdW6Vt/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob014_andgate/eda/run-MIYwMc/snapshot-pdW6Vt/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob014_andgate/eda/run-MIYwMc/build/.rtl-synth-twaX4m/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob014_andgate/eda/run-MIYwMc/build/.rtl-synth-twaX4m/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
