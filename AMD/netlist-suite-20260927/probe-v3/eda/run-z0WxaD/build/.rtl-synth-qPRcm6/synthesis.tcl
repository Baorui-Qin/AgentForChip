if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/netlist-suite-20260927/probe-v3/eda/run-z0WxaD/snapshot-ED8cfk/rtl/solution.sv"]
read_xdc [list "D:/AMD/netlist-suite-20260927/probe-v3/eda/run-z0WxaD/snapshot-ED8cfk/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/netlist-suite-20260927/probe-v3/eda/run-z0WxaD/build/.rtl-synth-qPRcm6/netlist.v"
write_checkpoint -force "D:/AMD/netlist-suite-20260927/probe-v3/eda/run-z0WxaD/build/.rtl-synth-qPRcm6/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
