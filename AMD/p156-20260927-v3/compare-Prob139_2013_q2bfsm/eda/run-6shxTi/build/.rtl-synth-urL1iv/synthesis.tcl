if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob139_2013_q2bfsm/eda/run-6shxTi/snapshot-l9ZUoo/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob139_2013_q2bfsm/eda/run-6shxTi/snapshot-l9ZUoo/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob139_2013_q2bfsm/eda/run-6shxTi/build/.rtl-synth-urL1iv/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob139_2013_q2bfsm/eda/run-6shxTi/build/.rtl-synth-urL1iv/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
