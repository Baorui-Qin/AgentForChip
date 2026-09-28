if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/netlist-suite-20260927/probe-v5/eda/run-uFIg3q/snapshot-0w5zdA/rtl/solution.sv"]
read_xdc [list "D:/AMD/netlist-suite-20260927/probe-v5/eda/run-uFIg3q/snapshot-0w5zdA/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/netlist-suite-20260927/probe-v5/eda/run-uFIg3q/build/.rtl-synth-0dxo22/netlist.v"
write_checkpoint -force "D:/AMD/netlist-suite-20260927/probe-v5/eda/run-uFIg3q/build/.rtl-synth-0dxo22/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
