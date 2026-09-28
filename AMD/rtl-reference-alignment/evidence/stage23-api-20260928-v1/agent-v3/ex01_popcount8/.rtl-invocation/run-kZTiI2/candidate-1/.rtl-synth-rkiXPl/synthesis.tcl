if {[catch {
set_param general.maxThreads 2
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/rtl-reference-alignment/evidence/stage23-api-20260928-v1/agent-v3/ex01_popcount8/.rtl-invocation/run-kZTiI2/candidate-1/candidate.sv"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/rtl-reference-alignment/evidence/stage23-api-20260928-v1/agent-v3/ex01_popcount8/.rtl-invocation/run-kZTiI2/candidate-1/.rtl-synth-rkiXPl/netlist.v"
write_checkpoint -force "D:/AMD/rtl-reference-alignment/evidence/stage23-api-20260928-v1/agent-v3/ex01_popcount8/.rtl-invocation/run-kZTiI2/candidate-1/.rtl-synth-rkiXPl/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
