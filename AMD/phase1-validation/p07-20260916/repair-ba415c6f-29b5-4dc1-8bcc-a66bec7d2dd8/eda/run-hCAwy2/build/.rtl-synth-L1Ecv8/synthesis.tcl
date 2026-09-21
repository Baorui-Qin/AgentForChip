if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p07-20260916/repair-ba415c6f-29b5-4dc1-8bcc-a66bec7d2dd8/eda/run-hCAwy2/snapshot-A7wQ87/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p07-20260916/repair-ba415c6f-29b5-4dc1-8bcc-a66bec7d2dd8/eda/run-hCAwy2/snapshot-A7wQ87/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p07-20260916/repair-ba415c6f-29b5-4dc1-8bcc-a66bec7d2dd8/eda/run-hCAwy2/build/.rtl-synth-L1Ecv8/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p07-20260916/repair-ba415c6f-29b5-4dc1-8bcc-a66bec7d2dd8/eda/run-hCAwy2/build/.rtl-synth-L1Ecv8/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
