if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917/experiments/repair-fb375587-36b2-4924-8c68-543137c08c75/eda/run-vKx2u4/snapshot-awZUCu/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917/experiments/repair-fb375587-36b2-4924-8c68-543137c08c75/eda/run-vKx2u4/snapshot-awZUCu/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917/experiments/repair-fb375587-36b2-4924-8c68-543137c08c75/eda/run-vKx2u4/build/.rtl-synth-iybAZS/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917/experiments/repair-fb375587-36b2-4924-8c68-543137c08c75/eda/run-vKx2u4/build/.rtl-synth-iybAZS/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
