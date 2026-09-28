if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob104_mt2015_muxdff/eda/run-X6j9zw/snapshot-T1HLxk/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob104_mt2015_muxdff/eda/run-X6j9zw/snapshot-T1HLxk/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob104_mt2015_muxdff/eda/run-X6j9zw/build/.rtl-synth-z10Bma/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob104_mt2015_muxdff/eda/run-X6j9zw/build/.rtl-synth-z10Bma/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
