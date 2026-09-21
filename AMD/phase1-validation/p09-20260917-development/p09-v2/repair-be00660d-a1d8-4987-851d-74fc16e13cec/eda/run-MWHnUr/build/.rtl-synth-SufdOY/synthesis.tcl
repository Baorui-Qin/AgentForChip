if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-be00660d-a1d8-4987-851d-74fc16e13cec/eda/run-MWHnUr/snapshot-vDkPja/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-be00660d-a1d8-4987-851d-74fc16e13cec/eda/run-MWHnUr/snapshot-vDkPja/trusted/clock.xdc"]
synth_design -top "enable_counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-be00660d-a1d8-4987-851d-74fc16e13cec/eda/run-MWHnUr/build/.rtl-synth-SufdOY/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-be00660d-a1d8-4987-851d-74fc16e13cec/eda/run-MWHnUr/build/.rtl-synth-SufdOY/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
