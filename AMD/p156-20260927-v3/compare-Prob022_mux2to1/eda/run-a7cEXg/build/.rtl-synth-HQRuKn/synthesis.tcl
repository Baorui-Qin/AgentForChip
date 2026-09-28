if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob022_mux2to1/eda/run-a7cEXg/snapshot-cOJWK9/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob022_mux2to1/eda/run-a7cEXg/snapshot-cOJWK9/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob022_mux2to1/eda/run-a7cEXg/build/.rtl-synth-HQRuKn/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob022_mux2to1/eda/run-a7cEXg/build/.rtl-synth-HQRuKn/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
