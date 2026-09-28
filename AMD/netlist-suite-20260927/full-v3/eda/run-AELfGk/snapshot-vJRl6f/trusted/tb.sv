`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic x,
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
		x <= 0;
		@(negedge clk) wavedrom_start();
			@(posedge clk) x <= 2'h0;
			@(posedge clk) x <= 2'h0;
			@(posedge clk) x <= 2'h0;
			@(posedge clk) x <= 2'h0;
			@(posedge clk) x <= 2'h1;
			@(posedge clk) x <= 2'h1;
			@(posedge clk) x <= 2'h1;
			@(posedge clk) x <= 2'h1;
		@(negedge clk) wavedrom_stop();
		repeat(100) @(posedge clk, negedge clk)
			x <= $random(netlist_random_seed);

		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input x,
  output z
);

  reg [2:0] s = 0;

  always @(posedge clk) begin
    s <= { s[2] ^ x, ~s[1] & x, ~s[0] | x };
  end

  assign z = ~|s;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;
wire gold_z, dut_z, raw_dut_z; reg seen_z='0;
stimulus_gen stim1(.clk(clk),.x(raw_x),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.x(drive_x),.z(gold_z));
TopModule dut(.clk(clk),.x(drive_x),.z(raw_dut_z));
assign dut_z=raw_dut_z;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_z === 1'b0 || gold_z === 1'b1) begin
known=1; seen_z=1'b1;
if(dut_z !== gold_z) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_z) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:z");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
