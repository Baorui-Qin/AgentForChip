if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-5cc24475-2298-45fa-acc5-d5b0053973d5/eda/run-yPrODg/snapshot-m8H79L/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-5cc24475-2298-45fa-acc5-d5b0053973d5/eda/run-yPrODg/snapshot-m8H79L/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-5cc24475-2298-45fa-acc5-d5b0053973d5/eda/run-yPrODg/build/.rtl-synth-Tab6eN/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-5cc24475-2298-45fa-acc5-d5b0053973d5/eda/run-yPrODg/build/.rtl-synth-Tab6eN/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
