if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob151_review2015_fsm/eda/run-MtoiTO/snapshot-ceUJmy/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob151_review2015_fsm/eda/run-MtoiTO/snapshot-ceUJmy/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob151_review2015_fsm/eda/run-MtoiTO/build/.rtl-synth-6x6uNN/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-20260919-v1/group-2/compare-Prob151_review2015_fsm/eda/run-MtoiTO/build/.rtl-synth-6x6uNN/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
