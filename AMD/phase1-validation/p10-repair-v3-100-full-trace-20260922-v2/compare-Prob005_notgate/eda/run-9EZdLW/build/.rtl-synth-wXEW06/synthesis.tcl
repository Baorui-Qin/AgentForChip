if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob005_notgate/eda/run-9EZdLW/snapshot-VB3yZN/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob005_notgate/eda/run-9EZdLW/snapshot-VB3yZN/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob005_notgate/eda/run-9EZdLW/build/.rtl-synth-wXEW06/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob005_notgate/eda/run-9EZdLW/build/.rtl-synth-wXEW06/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
