if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-8af56a57-d1da-44a8-b94d-3a56acc14b3d/eda/run-4nCouN/snapshot-z7JOVA/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-8af56a57-d1da-44a8-b94d-3a56acc14b3d/eda/run-4nCouN/snapshot-z7JOVA/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-8af56a57-d1da-44a8-b94d-3a56acc14b3d/eda/run-4nCouN/build/.rtl-synth-koHELA/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-8af56a57-d1da-44a8-b94d-3a56acc14b3d/eda/run-4nCouN/build/.rtl-synth-koHELA/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
