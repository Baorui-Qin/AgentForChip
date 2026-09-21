if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-af05ca66-b9c8-45a9-bb1e-a48ec2676b96/eda/run-00vpYB/snapshot-18rPOe/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-af05ca66-b9c8-45a9-bb1e-a48ec2676b96/eda/run-00vpYB/snapshot-18rPOe/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-af05ca66-b9c8-45a9-bb1e-a48ec2676b96/eda/run-00vpYB/build/.rtl-synth-kVvPwI/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-af05ca66-b9c8-45a9-bb1e-a48ec2676b96/eda/run-00vpYB/build/.rtl-synth-kVvPwI/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
