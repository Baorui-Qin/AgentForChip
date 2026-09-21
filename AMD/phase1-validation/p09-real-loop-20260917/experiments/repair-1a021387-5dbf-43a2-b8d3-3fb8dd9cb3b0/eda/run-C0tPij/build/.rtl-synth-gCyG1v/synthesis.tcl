if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-1a021387-5dbf-43a2-b8d3-3fb8dd9cb3b0/eda/run-C0tPij/snapshot-rXswCy/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-1a021387-5dbf-43a2-b8d3-3fb8dd9cb3b0/eda/run-C0tPij/snapshot-rXswCy/trusted/clock.xdc"]
synth_design -top "rising_edge" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-1a021387-5dbf-43a2-b8d3-3fb8dd9cb3b0/eda/run-C0tPij/build/.rtl-synth-gCyG1v/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-1a021387-5dbf-43a2-b8d3-3fb8dd9cb3b0/eda/run-C0tPij/build/.rtl-synth-gCyG1v/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
