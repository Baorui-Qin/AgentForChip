if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob046_dff8p/eda/run-IDquKk/snapshot-WVvqDd/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob046_dff8p/eda/run-IDquKk/snapshot-WVvqDd/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob046_dff8p/eda/run-IDquKk/build/.rtl-synth-ZAHJgX/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob046_dff8p/eda/run-IDquKk/build/.rtl-synth-ZAHJgX/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
