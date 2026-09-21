if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-a80c1a92-2a9b-4f8d-9f1b-e63530374233/eda/run-QMzxt2/snapshot-6B1l5M/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-a80c1a92-2a9b-4f8d-9f1b-e63530374233/eda/run-QMzxt2/snapshot-6B1l5M/trusted/clock.xdc"]
synth_design -top "ready_valid_slot" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-a80c1a92-2a9b-4f8d-9f1b-e63530374233/eda/run-QMzxt2/build/.rtl-synth-MyuPAK/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-a80c1a92-2a9b-4f8d-9f1b-e63530374233/eda/run-QMzxt2/build/.rtl-synth-MyuPAK/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
