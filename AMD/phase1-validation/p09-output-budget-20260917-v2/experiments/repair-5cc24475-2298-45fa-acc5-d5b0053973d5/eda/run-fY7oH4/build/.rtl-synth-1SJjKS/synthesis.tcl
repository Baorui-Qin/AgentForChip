if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-5cc24475-2298-45fa-acc5-d5b0053973d5/eda/run-fY7oH4/snapshot-SR0ibH/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-5cc24475-2298-45fa-acc5-d5b0053973d5/eda/run-fY7oH4/snapshot-SR0ibH/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-5cc24475-2298-45fa-acc5-d5b0053973d5/eda/run-fY7oH4/build/.rtl-synth-1SJjKS/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-5cc24475-2298-45fa-acc5-d5b0053973d5/eda/run-fY7oH4/build/.rtl-synth-1SJjKS/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
