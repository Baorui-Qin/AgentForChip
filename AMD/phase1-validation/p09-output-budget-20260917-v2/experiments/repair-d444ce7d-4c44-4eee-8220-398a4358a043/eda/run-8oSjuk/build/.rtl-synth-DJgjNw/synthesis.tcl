if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-d444ce7d-4c44-4eee-8220-398a4358a043/eda/run-8oSjuk/snapshot-9USfSC/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-d444ce7d-4c44-4eee-8220-398a4358a043/eda/run-8oSjuk/snapshot-9USfSC/trusted/clock.xdc"]
synth_design -top "signed_saturating_add" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-d444ce7d-4c44-4eee-8220-398a4358a043/eda/run-8oSjuk/build/.rtl-synth-DJgjNw/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-d444ce7d-4c44-4eee-8220-398a4358a043/eda/run-8oSjuk/build/.rtl-synth-DJgjNw/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
