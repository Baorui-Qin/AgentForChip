if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob018_mux256to1/eda/run-gndhNR/snapshot-Ho7QWs/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob018_mux256to1/eda/run-gndhNR/snapshot-Ho7QWs/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob018_mux256to1/eda/run-gndhNR/build/.rtl-synth-J9i5cA/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob018_mux256to1/eda/run-gndhNR/build/.rtl-synth-J9i5cA/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
