if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-35ae6469-616e-4841-b87c-306756c5c209/eda/run-Aoaq8D/snapshot-KsqXfG/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-35ae6469-616e-4841-b87c-306756c5c209/eda/run-Aoaq8D/snapshot-KsqXfG/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-35ae6469-616e-4841-b87c-306756c5c209/eda/run-Aoaq8D/build/.rtl-synth-qtthwt/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-35ae6469-616e-4841-b87c-306756c5c209/eda/run-Aoaq8D/build/.rtl-synth-qtthwt/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
