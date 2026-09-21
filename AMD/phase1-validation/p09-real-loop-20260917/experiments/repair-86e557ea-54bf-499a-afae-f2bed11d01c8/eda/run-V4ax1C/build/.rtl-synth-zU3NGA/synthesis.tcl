if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-86e557ea-54bf-499a-afae-f2bed11d01c8/eda/run-V4ax1C/snapshot-mD1TzX/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-86e557ea-54bf-499a-afae-f2bed11d01c8/eda/run-V4ax1C/snapshot-mD1TzX/trusted/clock.xdc"]
synth_design -top "rising_edge" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-86e557ea-54bf-499a-afae-f2bed11d01c8/eda/run-V4ax1C/build/.rtl-synth-zU3NGA/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-86e557ea-54bf-499a-afae-f2bed11d01c8/eda/run-V4ax1C/build/.rtl-synth-zU3NGA/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
