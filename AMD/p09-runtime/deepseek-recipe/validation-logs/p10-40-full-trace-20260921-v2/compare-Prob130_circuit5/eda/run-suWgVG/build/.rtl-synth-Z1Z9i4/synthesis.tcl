if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob130_circuit5/eda/run-suWgVG/snapshot-ykAu7I/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob130_circuit5/eda/run-suWgVG/snapshot-ykAu7I/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob130_circuit5/eda/run-suWgVG/build/.rtl-synth-Z1Z9i4/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob130_circuit5/eda/run-suWgVG/build/.rtl-synth-Z1Z9i4/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
