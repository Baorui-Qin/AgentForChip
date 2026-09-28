if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob121_2014_q3bfsm/eda/run-Kn2wYV/snapshot-5rUKl3/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob121_2014_q3bfsm/eda/run-Kn2wYV/snapshot-5rUKl3/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob121_2014_q3bfsm/eda/run-Kn2wYV/build/.rtl-synth-siaz0T/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob121_2014_q3bfsm/eda/run-Kn2wYV/build/.rtl-synth-siaz0T/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
