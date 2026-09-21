if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-2acbc976-1bfd-49ba-97e9-027a5326ef65/eda/run-onNHFG/snapshot-azp7Fd/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-2acbc976-1bfd-49ba-97e9-027a5326ef65/eda/run-onNHFG/snapshot-azp7Fd/trusted/clock.xdc"]
synth_design -top "ready_valid_slot" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-2acbc976-1bfd-49ba-97e9-027a5326ef65/eda/run-onNHFG/build/.rtl-synth-C4DDUD/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-2acbc976-1bfd-49ba-97e9-027a5326ef65/eda/run-onNHFG/build/.rtl-synth-C4DDUD/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
