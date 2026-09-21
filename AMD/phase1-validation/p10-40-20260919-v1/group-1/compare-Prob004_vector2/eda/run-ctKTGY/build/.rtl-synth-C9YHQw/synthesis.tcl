if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-1/compare-Prob004_vector2/eda/run-ctKTGY/snapshot-fp4s1f/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p10-40-20260919-v1/group-1/compare-Prob004_vector2/eda/run-ctKTGY/snapshot-fp4s1f/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p10-40-20260919-v1/group-1/compare-Prob004_vector2/eda/run-ctKTGY/build/.rtl-synth-C9YHQw/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p10-40-20260919-v1/group-1/compare-Prob004_vector2/eda/run-ctKTGY/build/.rtl-synth-C9YHQw/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
