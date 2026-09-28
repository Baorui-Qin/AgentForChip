if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob131_mt2015_q4/eda/run-VXzp2z/snapshot-vSU727/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob131_mt2015_q4/eda/run-VXzp2z/snapshot-vSU727/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob131_mt2015_q4/eda/run-VXzp2z/build/.rtl-synth-5H0WlG/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob131_mt2015_q4/eda/run-VXzp2z/build/.rtl-synth-5H0WlG/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
