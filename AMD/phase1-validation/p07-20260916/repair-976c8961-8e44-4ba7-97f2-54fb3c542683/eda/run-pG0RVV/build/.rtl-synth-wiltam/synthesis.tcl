if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p07-20260916/repair-976c8961-8e44-4ba7-97f2-54fb3c542683/eda/run-pG0RVV/snapshot-P4KjuM/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p07-20260916/repair-976c8961-8e44-4ba7-97f2-54fb3c542683/eda/run-pG0RVV/snapshot-P4KjuM/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p07-20260916/repair-976c8961-8e44-4ba7-97f2-54fb3c542683/eda/run-pG0RVV/build/.rtl-synth-wiltam/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p07-20260916/repair-976c8961-8e44-4ba7-97f2-54fb3c542683/eda/run-pG0RVV/build/.rtl-synth-wiltam/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
