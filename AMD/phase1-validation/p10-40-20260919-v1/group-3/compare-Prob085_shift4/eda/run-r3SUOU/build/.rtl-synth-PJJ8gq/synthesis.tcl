if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-3/compare-Prob085_shift4/eda/run-r3SUOU/snapshot-xuLwGw/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-3/compare-Prob085_shift4/eda/run-r3SUOU/snapshot-xuLwGw/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-20260919-v1/group-3/compare-Prob085_shift4/eda/run-r3SUOU/build/.rtl-synth-PJJ8gq/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-20260919-v1/group-3/compare-Prob085_shift4/eda/run-r3SUOU/build/.rtl-synth-PJJ8gq/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
