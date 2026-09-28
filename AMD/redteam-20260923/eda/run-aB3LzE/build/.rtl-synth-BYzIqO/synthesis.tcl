if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/redteam-20260923/eda/run-aB3LzE/snapshot-iHVmpr/rtl/solution.sv"]
read_xdc [list "D:/AMD/redteam-20260923/eda/run-aB3LzE/snapshot-iHVmpr/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/redteam-20260923/eda/run-aB3LzE/build/.rtl-synth-BYzIqO/netlist.v"
write_checkpoint -force "D:/AMD/redteam-20260923/eda/run-aB3LzE/build/.rtl-synth-BYzIqO/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
