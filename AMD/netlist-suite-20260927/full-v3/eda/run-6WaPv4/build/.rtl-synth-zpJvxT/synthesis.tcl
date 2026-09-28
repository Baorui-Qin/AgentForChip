if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/netlist-suite-20260927/full-v3/eda/run-6WaPv4/snapshot-jS3m85/rtl/solution.sv"]
read_xdc [list "D:/AMD/netlist-suite-20260927/full-v3/eda/run-6WaPv4/snapshot-jS3m85/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/netlist-suite-20260927/full-v3/eda/run-6WaPv4/build/.rtl-synth-zpJvxT/netlist.v"
write_checkpoint -force "D:/AMD/netlist-suite-20260927/full-v3/eda/run-6WaPv4/build/.rtl-synth-zpJvxT/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
