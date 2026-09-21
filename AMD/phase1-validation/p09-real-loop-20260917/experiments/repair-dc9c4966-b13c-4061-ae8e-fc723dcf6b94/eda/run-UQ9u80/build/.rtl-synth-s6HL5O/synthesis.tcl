if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-dc9c4966-b13c-4061-ae8e-fc723dcf6b94/eda/run-UQ9u80/snapshot-0C7XZv/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-dc9c4966-b13c-4061-ae8e-fc723dcf6b94/eda/run-UQ9u80/snapshot-0C7XZv/trusted/clock.xdc"]
synth_design -top "sequence_101" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-dc9c4966-b13c-4061-ae8e-fc723dcf6b94/eda/run-UQ9u80/build/.rtl-synth-s6HL5O/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-dc9c4966-b13c-4061-ae8e-fc723dcf6b94/eda/run-UQ9u80/build/.rtl-synth-s6HL5O/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
