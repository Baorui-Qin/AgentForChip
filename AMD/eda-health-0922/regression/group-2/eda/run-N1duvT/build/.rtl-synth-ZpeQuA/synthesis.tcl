if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/eda-health-0922/regression/group-2/eda/run-N1duvT/snapshot-arxde2/rtl/solution.sv"]
read_xdc [list "D:/AMD/eda-health-0922/regression/group-2/eda/run-N1duvT/snapshot-arxde2/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/eda-health-0922/regression/group-2/eda/run-N1duvT/build/.rtl-synth-ZpeQuA/netlist.v"
write_checkpoint -force "D:/AMD/eda-health-0922/regression/group-2/eda/run-N1duvT/build/.rtl-synth-ZpeQuA/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
