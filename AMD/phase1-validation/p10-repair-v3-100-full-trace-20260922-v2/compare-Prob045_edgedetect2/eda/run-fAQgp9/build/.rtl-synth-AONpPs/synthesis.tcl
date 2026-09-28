if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob045_edgedetect2/eda/run-fAQgp9/snapshot-uwmXHX/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob045_edgedetect2/eda/run-fAQgp9/snapshot-uwmXHX/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob045_edgedetect2/eda/run-fAQgp9/build/.rtl-synth-AONpPs/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob045_edgedetect2/eda/run-fAQgp9/build/.rtl-synth-AONpPs/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
