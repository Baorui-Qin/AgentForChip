if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-45f27379-9272-46b5-80ad-2315025abcdd/eda/run-7GvkaE/snapshot-QUXKlU/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-45f27379-9272-46b5-80ad-2315025abcdd/eda/run-7GvkaE/snapshot-QUXKlU/trusted/clock.xdc"]
synth_design -top "ready_valid_slot" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-45f27379-9272-46b5-80ad-2315025abcdd/eda/run-7GvkaE/build/.rtl-synth-nc1XK0/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-45f27379-9272-46b5-80ad-2315025abcdd/eda/run-7GvkaE/build/.rtl-synth-nc1XK0/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
