if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv "D:\\AMD\\vivado-synthesis-validation\\rtl-loader-qIu6g9\\source.sv"
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:\\AMD\\vivado-synthesis-validation\\rtl-loader-qIu6g9\\.rtl-synth-BkFKPG\\netlist.v"
write_checkpoint -force "D:\\AMD\\vivado-synthesis-validation\\rtl-loader-qIu6g9\\.rtl-synth-BkFKPG\\design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
