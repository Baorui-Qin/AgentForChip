if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv "D:\\AMD\\vivado-synthesis-validation\\rtl-loader-mW4o5s\\source.sv"
read_xdc "D:\\AMD\\vivado-synthesis-validation\\rtl-loader-mW4o5s\\clock.xdc"
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:\\AMD\\vivado-synthesis-validation\\rtl-loader-mW4o5s\\.rtl-synth-N01FV3\\netlist.v"
write_checkpoint -force "D:\\AMD\\vivado-synthesis-validation\\rtl-loader-mW4o5s\\.rtl-synth-N01FV3\\design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
