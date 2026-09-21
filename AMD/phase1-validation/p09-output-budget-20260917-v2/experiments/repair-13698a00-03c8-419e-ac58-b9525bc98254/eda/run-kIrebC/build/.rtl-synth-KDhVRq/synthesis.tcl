if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-13698a00-03c8-419e-ac58-b9525bc98254/eda/run-kIrebC/snapshot-6SXpE9/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-13698a00-03c8-419e-ac58-b9525bc98254/eda/run-kIrebC/snapshot-6SXpE9/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-13698a00-03c8-419e-ac58-b9525bc98254/eda/run-kIrebC/build/.rtl-synth-KDhVRq/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-13698a00-03c8-419e-ac58-b9525bc98254/eda/run-kIrebC/build/.rtl-synth-KDhVRq/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
