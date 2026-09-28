if {[catch {
set_param general.maxThreads 2
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/rtl-reference-alignment/evidence/stage23-api-20260928-v1/agent-v3/ex02_detect_1101/.rtl-invocation/run-F7FXUP/candidate-1/candidate.sv"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/rtl-reference-alignment/evidence/stage23-api-20260928-v1/agent-v3/ex02_detect_1101/.rtl-invocation/run-F7FXUP/candidate-1/.rtl-synth-WQzbsP/netlist.v"
write_checkpoint -force "D:/AMD/rtl-reference-alignment/evidence/stage23-api-20260928-v1/agent-v3/ex02_detect_1101/.rtl-invocation/run-F7FXUP/candidate-1/.rtl-synth-WQzbsP/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
