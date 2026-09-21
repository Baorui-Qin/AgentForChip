if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-0d295422-b283-4fff-8c56-179dc1fe69a2/eda/run-wLa0nn/snapshot-SSk5Eb/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-0d295422-b283-4fff-8c56-179dc1fe69a2/eda/run-wLa0nn/snapshot-SSk5Eb/trusted/clock.xdc"]
synth_design -top "rising_edge" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-0d295422-b283-4fff-8c56-179dc1fe69a2/eda/run-wLa0nn/build/.rtl-synth-Y1T3iF/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-0d295422-b283-4fff-8c56-179dc1fe69a2/eda/run-wLa0nn/build/.rtl-synth-Y1T3iF/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
