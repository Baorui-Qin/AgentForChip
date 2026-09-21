if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-0ab3e93e-041c-4a94-a8a1-5514371d6b05/eda/run-mhcQbS/snapshot-UULOyl/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-0ab3e93e-041c-4a94-a8a1-5514371d6b05/eda/run-mhcQbS/snapshot-UULOyl/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-0ab3e93e-041c-4a94-a8a1-5514371d6b05/eda/run-mhcQbS/build/.rtl-synth-IsZhgj/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-0ab3e93e-041c-4a94-a8a1-5514371d6b05/eda/run-mhcQbS/build/.rtl-synth-IsZhgj/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
