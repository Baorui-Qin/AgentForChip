if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-context-skill-20260917/experiments/repair-48ee6037-9082-49a5-a72a-908e74c199a4/eda/run-GuJpaW/snapshot-GWFRO6/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-context-skill-20260917/experiments/repair-48ee6037-9082-49a5-a72a-908e74c199a4/eda/run-GuJpaW/snapshot-GWFRO6/trusted/clock.xdc"]
synth_design -top "rising_edge" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-context-skill-20260917/experiments/repair-48ee6037-9082-49a5-a72a-908e74c199a4/eda/run-GuJpaW/build/.rtl-synth-4LEDVs/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-context-skill-20260917/experiments/repair-48ee6037-9082-49a5-a72a-908e74c199a4/eda/run-GuJpaW/build/.rtl-synth-4LEDVs/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
