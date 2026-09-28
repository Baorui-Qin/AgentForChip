if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/netlist-suite-20260927/probe-v5/eda/run-RrDMib/snapshot-bt8JQe/rtl/solution.sv"]
read_xdc [list "D:/AMD/netlist-suite-20260927/probe-v5/eda/run-RrDMib/snapshot-bt8JQe/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/netlist-suite-20260927/probe-v5/eda/run-RrDMib/build/.rtl-synth-BpytHC/netlist.v"
write_checkpoint -force "D:/AMD/netlist-suite-20260927/probe-v5/eda/run-RrDMib/build/.rtl-synth-BpytHC/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
