if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob033_ece241_2014_q1c/eda/run-4HDMw0/snapshot-EHjhyO/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob033_ece241_2014_q1c/eda/run-4HDMw0/snapshot-EHjhyO/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob033_ece241_2014_q1c/eda/run-4HDMw0/build/.rtl-synth-0OOnV5/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2/compare-Prob033_ece241_2014_q1c/eda/run-4HDMw0/build/.rtl-synth-0OOnV5/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
