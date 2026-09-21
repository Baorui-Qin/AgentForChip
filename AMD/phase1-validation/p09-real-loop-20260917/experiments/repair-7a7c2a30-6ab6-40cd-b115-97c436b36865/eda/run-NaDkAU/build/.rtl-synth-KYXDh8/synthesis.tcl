if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-7a7c2a30-6ab6-40cd-b115-97c436b36865/eda/run-NaDkAU/snapshot-tIv52t/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-7a7c2a30-6ab6-40cd-b115-97c436b36865/eda/run-NaDkAU/snapshot-tIv52t/trusted/clock.xdc"]
synth_design -top "signed_saturating_add" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-7a7c2a30-6ab6-40cd-b115-97c436b36865/eda/run-NaDkAU/build/.rtl-synth-KYXDh8/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-7a7c2a30-6ab6-40cd-b115-97c436b36865/eda/run-NaDkAU/build/.rtl-synth-KYXDh8/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
