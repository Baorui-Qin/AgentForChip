if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/hdl-20260916/run-UV4hTY/snapshot-Mr43u9/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/hdl-20260916/run-UV4hTY/snapshot-Mr43u9/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/hdl-20260916/run-UV4hTY/build/.rtl-synth-FO72AQ/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/hdl-20260916/run-UV4hTY/build/.rtl-synth-FO72AQ/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
