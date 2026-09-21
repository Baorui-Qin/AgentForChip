if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-d38c421f-7430-443a-b783-f232be6b1bad/eda/run-KwSOE9/snapshot-3kioO7/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-d38c421f-7430-443a-b783-f232be6b1bad/eda/run-KwSOE9/snapshot-3kioO7/trusted/clock.xdc"]
synth_design -top "signed_saturating_add" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-d38c421f-7430-443a-b783-f232be6b1bad/eda/run-KwSOE9/build/.rtl-synth-sxG3bH/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-d38c421f-7430-443a-b783-f232be6b1bad/eda/run-KwSOE9/build/.rtl-synth-sxG3bH/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
