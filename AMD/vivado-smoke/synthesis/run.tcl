# Installation smoke test, not a timing-closure or benchmark result.
set script_dir [file dirname [file normalize [info script]]]
set_param general.maxThreads 4
read_verilog {D:/deepseek-harness/rtl-tools/example/rtl/counter.sv}
read_xdc [file join $script_dir clock.xdc]
synth_design -top counter -part xczu3eg-sbva484-1-e
write_checkpoint -force [file join $script_dir counter_synth.dcp]
write_verilog -force -mode funcsim [file join $script_dir counter_netlist.v]
report_utilization -file [file join $script_dir utilization.rpt]
report_clocks -file [file join $script_dir clocks.rpt]
puts "SYNTHESIS_SMOKE_PASS"
