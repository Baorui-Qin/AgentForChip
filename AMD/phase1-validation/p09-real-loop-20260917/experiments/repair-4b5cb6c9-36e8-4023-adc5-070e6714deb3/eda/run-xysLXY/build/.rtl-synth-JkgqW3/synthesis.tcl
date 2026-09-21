if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-4b5cb6c9-36e8-4023-adc5-070e6714deb3/eda/run-xysLXY/snapshot-SNgUfN/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-4b5cb6c9-36e8-4023-adc5-070e6714deb3/eda/run-xysLXY/snapshot-SNgUfN/trusted/clock.xdc"]
synth_design -top "signed_saturating_add" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-4b5cb6c9-36e8-4023-adc5-070e6714deb3/eda/run-xysLXY/build/.rtl-synth-JkgqW3/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-4b5cb6c9-36e8-4023-adc5-070e6714deb3/eda/run-xysLXY/build/.rtl-synth-JkgqW3/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
