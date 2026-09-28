`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg too_cold, too_hot, mode, fan_on,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable
);
integer netlist_random_seed=1;



// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	



	initial begin #101;
		{too_cold, too_hot, mode, fan_on} <= 4'b0010;
		@(negedge clk);
		wavedrom_start("Winter");
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0010;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0010;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1010;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1011;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0010;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0011;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0010;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0110;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1110;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0111;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1111;
		@(negedge clk) wavedrom_stop();

		{too_cold, too_hot, mode, fan_on} <= 4'b0000;
		@(negedge clk);
		wavedrom_start("Summer");
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0000;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0000;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0100;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0101;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0000;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0001;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0000;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1000;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1100;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1001;
			@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1101;
		@(negedge clk) wavedrom_stop();
		
		repeat(200)
			@(posedge clk, negedge clk) {too_cold, too_hot, mode, fan_on} <= $random(netlist_random_seed);
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input mode,
  input too_cold,
  input too_hot,
  input fan_on,
  output heater,
  output aircon,
  output fan
);

  assign fan = (mode ? too_cold : too_hot) | fan_on;
  assign heater = (mode & too_cold);
  assign aircon = (~mode & too_hot);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_mode; wire drive_mode; assign #0.1 drive_mode=raw_mode;
wire raw_too_cold; wire drive_too_cold; assign #0.1 drive_too_cold=raw_too_cold;
wire raw_too_hot; wire drive_too_hot; assign #0.1 drive_too_hot=raw_too_hot;
wire raw_fan_on; wire drive_fan_on; assign #0.1 drive_fan_on=raw_fan_on;
wire gold_heater, dut_heater, raw_dut_heater; reg seen_heater='0;
wire gold_aircon, dut_aircon, raw_dut_aircon; reg seen_aircon='0;
wire gold_fan, dut_fan, raw_dut_fan; reg seen_fan='0;
stimulus_gen stim1(.clk(clk),.too_cold(raw_too_cold),.too_hot(raw_too_hot),.mode(raw_mode),.fan_on(raw_fan_on),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.mode(drive_mode),.too_cold(drive_too_cold),.too_hot(drive_too_hot),.fan_on(drive_fan_on),.heater(gold_heater),.aircon(gold_aircon),.fan(gold_fan));
TopModule dut(.mode(drive_mode),.too_cold(drive_too_cold),.too_hot(drive_too_hot),.fan_on(drive_fan_on),.heater(raw_dut_heater),.aircon(raw_dut_aircon),.fan(raw_dut_fan));
assign dut_heater=~raw_dut_heater;
assign dut_aircon=~raw_dut_aircon;
assign dut_fan=~raw_dut_fan;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_heater === 1'b0 || gold_heater === 1'b1) begin
known=1; seen_heater=1'b1;
if(dut_heater !== gold_heater) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_aircon === 1'b0 || gold_aircon === 1'b1) begin
known=1; seen_aircon=1'b1;
if(dut_aircon !== gold_aircon) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_fan === 1'b0 || gold_fan === 1'b1) begin
known=1; seen_fan=1'b1;
if(dut_fan !== gold_fan) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_heater) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:heater");
if((&seen_aircon) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:aircon");
if((&seen_fan) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:fan");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
