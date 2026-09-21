if {[catch {
set_param general.maxThreads 4
create_project -in_memory -part "xczu3eg-sbva484-1-e"
set_property include_dirs [list ] [current_fileset]
read_verilog -sv [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-66a58a91-658b-428f-8901-6855c6b9e4d0/eda/run-aYCrCS/snapshot-LqgDNS/rtl/solution.sv"]
read_xdc [list "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-66a58a91-658b-428f-8901-6855c6b9e4d0/eda/run-aYCrCS/snapshot-LqgDNS/trusted/clock.xdc"]
synth_design -top "signed_saturating_add" -part "xczu3eg-sbva484-1-e"
write_verilog -force -mode funcsim "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-66a58a91-658b-428f-8901-6855c6b9e4d0/eda/run-aYCrCS/build/.rtl-synth-KxeoYV/netlist.v"
write_checkpoint -force "D:/AMD/phase1-validation/p09-20260917-development/p09-v2/repair-66a58a91-658b-428f-8901-6855c6b9e4d0/eda/run-aYCrCS/build/.rtl-synth-KxeoYV/design.dcp"
} message]} {
  puts stderr "ERROR: $message"
  exit 1
}
exit 0
