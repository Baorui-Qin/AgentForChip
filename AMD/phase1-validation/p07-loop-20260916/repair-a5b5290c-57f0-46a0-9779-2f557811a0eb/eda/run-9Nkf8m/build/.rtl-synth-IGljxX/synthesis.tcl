if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p07-loop-20260916/repair-a5b5290c-57f0-46a0-9779-2f557811a0eb/eda/run-9Nkf8m/snapshot-bnx4SV/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p07-loop-20260916/repair-a5b5290c-57f0-46a0-9779-2f557811a0eb/eda/run-9Nkf8m/snapshot-bnx4SV/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p07-loop-20260916/repair-a5b5290c-57f0-46a0-9779-2f557811a0eb/eda/run-9Nkf8m/build/.rtl-synth-IGljxX/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p07-loop-20260916/repair-a5b5290c-57f0-46a0-9779-2f557811a0eb/eda/run-9Nkf8m/build/.rtl-synth-IGljxX/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
