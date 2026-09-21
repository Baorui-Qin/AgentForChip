if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-17f7d8e4-052b-4bb1-8e70-fdcedfb72013/eda/run-ZgTnv4/snapshot-BOsCHj/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-17f7d8e4-052b-4bb1-8e70-fdcedfb72013/eda/run-ZgTnv4/snapshot-BOsCHj/trusted/clock.xdc"]
synth_design -top "counter" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-17f7d8e4-052b-4bb1-8e70-fdcedfb72013/eda/run-ZgTnv4/build/.rtl-synth-u01Q35/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-17f7d8e4-052b-4bb1-8e70-fdcedfb72013/eda/run-ZgTnv4/build/.rtl-synth-u01Q35/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
