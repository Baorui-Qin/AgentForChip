if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-cdf6dede-fd5a-4033-8657-4e17cb877f65/eda/run-NAdSyP/snapshot-SUSo5Z/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-cdf6dede-fd5a-4033-8657-4e17cb877f65/eda/run-NAdSyP/snapshot-SUSo5Z/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-cdf6dede-fd5a-4033-8657-4e17cb877f65/eda/run-NAdSyP/build/.rtl-synth-oxc7d3/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-cdf6dede-fd5a-4033-8657-4e17cb877f65/eda/run-NAdSyP/build/.rtl-synth-oxc7d3/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
