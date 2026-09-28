if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob125_kmap3/eda/run-1Fn5XT/snapshot-v1AyXI/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob125_kmap3/eda/run-1Fn5XT/snapshot-v1AyXI/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob125_kmap3/eda/run-1Fn5XT/build/.rtl-synth-LBHkvJ/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob125_kmap3/eda/run-1Fn5XT/build/.rtl-synth-LBHkvJ/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
