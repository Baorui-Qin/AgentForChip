if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-6af80fca-df2d-43d7-8916-a23286c8a6c6/eda/run-VDH2U1/snapshot-QPGa7C/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-6af80fca-df2d-43d7-8916-a23286c8a6c6/eda/run-VDH2U1/snapshot-QPGa7C/trusted/clock.xdc"]
synth_design -top "rising_edge" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-6af80fca-df2d-43d7-8916-a23286c8a6c6/eda/run-VDH2U1/build/.rtl-synth-2RMvLt/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-6af80fca-df2d-43d7-8916-a23286c8a6c6/eda/run-VDH2U1/build/.rtl-synth-2RMvLt/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
