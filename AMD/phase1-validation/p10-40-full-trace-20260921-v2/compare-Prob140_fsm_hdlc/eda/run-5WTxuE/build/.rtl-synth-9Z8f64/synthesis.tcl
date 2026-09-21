if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob140_fsm_hdlc/eda/run-5WTxuE/snapshot-9oD5Wh/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob140_fsm_hdlc/eda/run-5WTxuE/snapshot-9oD5Wh/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob140_fsm_hdlc/eda/run-5WTxuE/build/.rtl-synth-9Z8f64/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob140_fsm_hdlc/eda/run-5WTxuE/build/.rtl-synth-9Z8f64/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
