if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-6340f479-370f-4b5c-b4d1-cb598a7e72f6/eda/run-LiY4Gv/snapshot-sPX5Ak/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-6340f479-370f-4b5c-b4d1-cb598a7e72f6/eda/run-LiY4Gv/snapshot-sPX5Ak/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-6340f479-370f-4b5c-b4d1-cb598a7e72f6/eda/run-LiY4Gv/build/.rtl-synth-oaZ7aG/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-6340f479-370f-4b5c-b4d1-cb598a7e72f6/eda/run-LiY4Gv/build/.rtl-synth-oaZ7aG/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
