if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/eda-health-0922/regression/group-1/eda/run-dfKAku/snapshot-zI3hdu/rtl/solution.sv"]
read_xdc [list "D:/AMD/eda-health-0922/regression/group-1/eda/run-dfKAku/snapshot-zI3hdu/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/eda-health-0922/regression/group-1/eda/run-dfKAku/build/.rtl-synth-JxgsYk/netlist.v"
write_checkpoint -force "D:/AMD/eda-health-0922/regression/group-1/eda/run-dfKAku/build/.rtl-synth-JxgsYk/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
