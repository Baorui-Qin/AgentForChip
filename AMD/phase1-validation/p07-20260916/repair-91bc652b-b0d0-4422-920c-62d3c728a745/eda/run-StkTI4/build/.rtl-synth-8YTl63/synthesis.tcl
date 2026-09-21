if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p07-20260916/repair-91bc652b-b0d0-4422-920c-62d3c728a745/eda/run-StkTI4/snapshot-o2I2j8/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p07-20260916/repair-91bc652b-b0d0-4422-920c-62d3c728a745/eda/run-StkTI4/snapshot-o2I2j8/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p07-20260916/repair-91bc652b-b0d0-4422-920c-62d3c728a745/eda/run-StkTI4/build/.rtl-synth-8YTl63/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p07-20260916/repair-91bc652b-b0d0-4422-920c-62d3c728a745/eda/run-StkTI4/build/.rtl-synth-8YTl63/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
