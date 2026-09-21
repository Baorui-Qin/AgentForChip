if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p07-20260916/repair-adbf4093-ae00-40b2-b883-3154293b6b2a/eda/run-IRhgdt/snapshot-wXQ24m/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p07-20260916/repair-adbf4093-ae00-40b2-b883-3154293b6b2a/eda/run-IRhgdt/snapshot-wXQ24m/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p07-20260916/repair-adbf4093-ae00-40b2-b883-3154293b6b2a/eda/run-IRhgdt/build/.rtl-synth-nGx6n3/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p07-20260916/repair-adbf4093-ae00-40b2-b883-3154293b6b2a/eda/run-IRhgdt/build/.rtl-synth-nGx6n3/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
