`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic c, d,
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
		{c, d} <= 0;
		@(negedge clk) wavedrom_start();
			@(posedge clk) {c, d} <= 2'h0;
			@(posedge clk) {c, d} <= 2'h1;
			@(posedge clk) {c, d} <= 2'h2;
			@(posedge clk) {c, d} <= 2'h3;
		@(negedge clk) wavedrom_stop();
		repeat(50) @(posedge clk, negedge clk)
			{c,d} <= $random(netlist_random_seed);

		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input c,
  input d,
  output [3:0] mux_in
);

  assign mux_in[0] = c | d;
  assign mux_in[1] = 0;
  assign mux_in[2] = ~d;
  assign mux_in[3] = c&d;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;
wire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;
wire [3:0] gold_mux_in, dut_mux_in, raw_dut_mux_in; reg [3:0] seen_mux_in='0;
stimulus_gen stim1(.clk(clk),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.c(drive_c),.d(drive_d),.mux_in(gold_mux_in));
TopModule dut(.c(drive_c),.d(drive_d),.mux_in(raw_dut_mux_in));
assign dut_mux_in=raw_dut_mux_in;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<4;b=b+1) begin
if(gold_mux_in[b] === 1'b0 || gold_mux_in[b] === 1'b1) begin
known=1; seen_mux_in[b]=1'b1;
if(dut_mux_in[b] !== gold_mux_in[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_mux_in) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:mux_in");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
