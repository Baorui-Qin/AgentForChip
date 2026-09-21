if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-agent-rerun-10-20260920-v1/compare-Prob020_mt2015_eq2/eda/run-UcbpBq/snapshot-aqzDco/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-agent-rerun-10-20260920-v1/compare-Prob020_mt2015_eq2/eda/run-UcbpBq/snapshot-aqzDco/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-agent-rerun-10-20260920-v1/compare-Prob020_mt2015_eq2/eda/run-UcbpBq/build/.rtl-synth-Nt78fy/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-agent-rerun-10-20260920-v1/compare-Prob020_mt2015_eq2/eda/run-UcbpBq/build/.rtl-synth-Nt78fy/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
