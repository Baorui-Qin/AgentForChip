if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob094_gatesv/eda/run-lC3QNm/snapshot-j9SYZy/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob094_gatesv/eda/run-lC3QNm/snapshot-j9SYZy/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob094_gatesv/eda/run-lC3QNm/build/.rtl-synth-oA1tkO/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob094_gatesv/eda/run-lC3QNm/build/.rtl-synth-oA1tkO/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
