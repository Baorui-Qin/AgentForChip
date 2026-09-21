if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-3bbe4956-876b-4ab4-ab03-be0cf8aebfd7/eda/run-gYjB4l/snapshot-MXspA3/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-3bbe4956-876b-4ab4-ab03-be0cf8aebfd7/eda/run-gYjB4l/snapshot-MXspA3/trusted/clock.xdc"]
synth_design -top "signed_saturating_add" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-3bbe4956-876b-4ab4-ab03-be0cf8aebfd7/eda/run-gYjB4l/build/.rtl-synth-HwnyjC/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-3bbe4956-876b-4ab4-ab03-be0cf8aebfd7/eda/run-gYjB4l/build/.rtl-synth-HwnyjC/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
