if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-1df8344c-185e-4aab-ae74-3627333ef5bd/eda/run-SPVnT5/snapshot-QT0rFn/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-1df8344c-185e-4aab-ae74-3627333ef5bd/eda/run-SPVnT5/snapshot-QT0rFn/trusted/clock.xdc"]
synth_design -top "rising_edge" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-1df8344c-185e-4aab-ae74-3627333ef5bd/eda/run-SPVnT5/build/.rtl-synth-poBBis/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-1df8344c-185e-4aab-ae74-3627333ef5bd/eda/run-SPVnT5/build/.rtl-synth-poBBis/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
