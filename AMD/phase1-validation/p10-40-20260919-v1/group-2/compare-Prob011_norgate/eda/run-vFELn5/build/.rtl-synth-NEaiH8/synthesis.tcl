if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob011_norgate/eda/run-vFELn5/snapshot-9K8PN5/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob011_norgate/eda/run-vFELn5/snapshot-9K8PN5/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob011_norgate/eda/run-vFELn5/build/.rtl-synth-NEaiH8/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob011_norgate/eda/run-vFELn5/build/.rtl-synth-NEaiH8/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
