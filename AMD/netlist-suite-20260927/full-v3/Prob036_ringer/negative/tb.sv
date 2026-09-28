`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg ring, vibrate_mode,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable
);


// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	



	initial begin #101; begin
		int count; count = 0;
		{vibrate_mode,ring} <= 1'b0;
		wavedrom_start();
		repeat(10) @(posedge clk)
			{vibrate_mode,ring} <= count++;		
		wavedrom_stop();
		
		#1 $finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input ring,
  input vibrate_mode,
  output ringer,
  output motor
);

  assign ringer = ring & ~vibrate_mode;
  assign motor = ring & vibrate_mode;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_ring; wire drive_ring; assign #0.1 drive_ring=raw_ring;
wire raw_vibrate_mode; wire drive_vibrate_mode; assign #0.1 drive_vibrate_mode=raw_vibrate_mode;
wire gold_ringer, dut_ringer, raw_dut_ringer; reg seen_ringer='0;
wire gold_motor, dut_motor, raw_dut_motor; reg seen_motor='0;
stimulus_gen stim1(.clk(clk),.ring(raw_ring),.vibrate_mode(raw_vibrate_mode),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.ring(drive_ring),.vibrate_mode(drive_vibrate_mode),.ringer(gold_ringer),.motor(gold_motor));
TopModule dut(.ring(drive_ring),.vibrate_mode(drive_vibrate_mode),.ringer(raw_dut_ringer),.motor(raw_dut_motor));
assign dut_ringer=~raw_dut_ringer;
assign dut_motor=~raw_dut_motor;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_ringer === 1'b0 || gold_ringer === 1'b1) begin
known=1; seen_ringer=1'b1;
if(dut_ringer !== gold_ringer) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_motor === 1'b0 || gold_motor === 1'b1) begin
known=1; seen_motor=1'b1;
if(dut_motor !== gold_motor) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_ringer) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:ringer");
if((&seen_motor) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:motor");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
