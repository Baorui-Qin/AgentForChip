if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-3b1c30bb-7914-481b-98fc-86b1d853c59b/eda/run-4Zepj9/snapshot-8mAUeQ/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-3b1c30bb-7914-481b-98fc-86b1d853c59b/eda/run-4Zepj9/snapshot-8mAUeQ/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-3b1c30bb-7914-481b-98fc-86b1d853c59b/eda/run-4Zepj9/build/.rtl-synth-707soU/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-3b1c30bb-7914-481b-98fc-86b1d853c59b/eda/run-4Zepj9/build/.rtl-synth-707soU/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
