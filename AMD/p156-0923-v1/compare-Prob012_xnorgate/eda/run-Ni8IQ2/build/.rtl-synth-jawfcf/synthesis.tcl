if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-0923-v1/compare-Prob012_xnorgate/eda/run-Ni8IQ2/snapshot-ExLOas/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-0923-v1/compare-Prob012_xnorgate/eda/run-Ni8IQ2/snapshot-ExLOas/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-0923-v1/compare-Prob012_xnorgate/eda/run-Ni8IQ2/build/.rtl-synth-jawfcf/netlist.v"
write_checkpoint -force "D:/AMD/p156-0923-v1/compare-Prob012_xnorgate/eda/run-Ni8IQ2/build/.rtl-synth-jawfcf/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
