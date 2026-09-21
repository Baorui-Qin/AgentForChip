if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-752f7c9f-00c3-47b5-9a1e-197022d6ae13/eda/run-rPxRni/snapshot-jjqZ6Q/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-752f7c9f-00c3-47b5-9a1e-197022d6ae13/eda/run-rPxRni/snapshot-jjqZ6Q/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-752f7c9f-00c3-47b5-9a1e-197022d6ae13/eda/run-rPxRni/build/.rtl-synth-xLZ4wB/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-752f7c9f-00c3-47b5-9a1e-197022d6ae13/eda/run-rPxRni/build/.rtl-synth-xLZ4wB/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
