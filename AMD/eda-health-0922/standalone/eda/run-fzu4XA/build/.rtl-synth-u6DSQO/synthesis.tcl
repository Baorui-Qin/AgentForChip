if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/eda-health-0922/standalone/eda/run-fzu4XA/snapshot-QNRJVH/rtl/solution.sv"]
read_xdc [list "D:/AMD/eda-health-0922/standalone/eda/run-fzu4XA/snapshot-QNRJVH/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/eda-health-0922/standalone/eda/run-fzu4XA/build/.rtl-synth-u6DSQO/netlist.v"
write_checkpoint -force "D:/AMD/eda-health-0922/standalone/eda/run-fzu4XA/build/.rtl-synth-u6DSQO/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
