if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob067_countslow/eda/run-H00BgV/snapshot-DkiO4n/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob067_countslow/eda/run-H00BgV/snapshot-DkiO4n/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob067_countslow/eda/run-H00BgV/build/.rtl-synth-BZsTSk/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob067_countslow/eda/run-H00BgV/build/.rtl-synth-BZsTSk/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
