if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/redteam-20260927/meta-probe-v1/eda/run-AbHll4/snapshot-dRVHk0/rtl/solution.sv"]
read_xdc [list "D:/AMD/redteam-20260927/meta-probe-v1/eda/run-AbHll4/snapshot-dRVHk0/trusted/clock.xdc"]
synth_design -top "TopModule" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/redteam-20260927/meta-probe-v1/eda/run-AbHll4/build/.rtl-synth-uksXgd/netlist.v"
write_checkpoint -force "D:/AMD/redteam-20260927/meta-probe-v1/eda/run-AbHll4/build/.rtl-synth-uksXgd/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
