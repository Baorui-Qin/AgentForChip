if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/run-v3gnDK/snapshot-V864dK/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/run-v3gnDK/snapshot-V864dK/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/run-v3gnDK/build/.rtl-synth-6CEN4l/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/run-v3gnDK/build/.rtl-synth-6CEN4l/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
