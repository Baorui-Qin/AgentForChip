if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob061_2014_q4a/eda/run-neUYks/snapshot-nwMzrM/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob061_2014_q4a/eda/run-neUYks/snapshot-nwMzrM/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob061_2014_q4a/eda/run-neUYks/build/.rtl-synth-0wqlB2/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob061_2014_q4a/eda/run-neUYks/build/.rtl-synth-0wqlB2/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
