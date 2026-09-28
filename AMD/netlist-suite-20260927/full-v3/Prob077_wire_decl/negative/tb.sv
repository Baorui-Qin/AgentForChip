`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13
// hdlbits_prop {len: 5}


module stimulus_gen (
	input clk,
	output reg a,b,c,d,
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
		{a,b,c,d} = 4'h0;
		@(negedge clk);
		wavedrom_start("Exhaustive test");
		repeat(20) @(posedge clk, negedge clk)
			{d,c,b,a} <= {d,c,b,a} + 1'b1;
		wavedrom_stop();
		repeat(100) @(posedge clk, negedge clk) begin
			{a,b,c,d} <= $random(netlist_random_seed);
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input a,
  input b,
  input c,
  input d,
  output out,
  output out_n
);

  wire w1, w2;
  assign w1 = a&b;
  assign w2 = c&d;
  assign out = w1|w2;
  assign out_n = ~out;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;
wire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;
wire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;
wire gold_out, dut_out, raw_dut_out; reg seen_out='0;
wire gold_out_n, dut_out_n, raw_dut_out_n; reg seen_out_n='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(gold_out),.out_n(gold_out_n));
TopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(raw_dut_out),.out_n(raw_dut_out_n));
assign dut_out=~raw_dut_out;
assign dut_out_n=~raw_dut_out_n;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_out === 1'b0 || gold_out === 1'b1) begin
known=1; seen_out=1'b1;
if(dut_out !== gold_out) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_n === 1'b0 || gold_out_n === 1'b1) begin
known=1; seen_out_n=1'b1;
if(dut_out_n !== gold_out_n) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
if((&seen_out_n) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_n");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
