if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/p156-20260927-v3/compare-Prob076_always_case/eda/run-Y2hUup/snapshot-JGzf9c/rtl/solution.sv"]
read_xdc [list "D:/AMD/p156-20260927-v3/compare-Prob076_always_case/eda/run-Y2hUup/snapshot-JGzf9c/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/p156-20260927-v3/compare-Prob076_always_case/eda/run-Y2hUup/build/.rtl-synth-IbDK6b/netlist.v"
write_checkpoint -force "D:/AMD/p156-20260927-v3/compare-Prob076_always_case/eda/run-Y2hUup/build/.rtl-synth-IbDK6b/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
