if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/run-1rPALq/snapshot-St5xch/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/run-1rPALq/snapshot-St5xch/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/run-1rPALq/build/.rtl-synth-zScKus/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/run-1rPALq/build/.rtl-synth-zScKus/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
