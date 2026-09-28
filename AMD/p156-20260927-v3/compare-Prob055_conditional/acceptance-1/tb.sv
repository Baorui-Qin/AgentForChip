`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [7:0] a, b, c, d,
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
 		{a,b,c,d} <= {8'h1, 8'h2, 8'h3, 8'h4};
 		@(negedge clk);
 		wavedrom_start();
	 		@(posedge clk) {a,b,c,d} <= {8'h1, 8'h2, 8'h3, 8'h4};
	 		@(posedge clk) {a,b,c,d} <= {8'h11, 8'h2, 8'h3, 8'h4};
	 		@(posedge clk) {a,b,c,d} <= {8'h11, 8'h12, 8'h3, 8'h4};
	 		@(posedge clk) {a,b,c,d} <= {8'h11, 8'h12, 8'h13, 8'h4};
	 		@(posedge clk) {a,b,c,d} <= {8'h11, 8'h12, 8'h13, 8'h14};
 		@(negedge clk);
 		wavedrom_stop();
		repeat(100) @(posedge clk, negedge clk)
			{a,b,c,d} <= $random(netlist_random_seed);
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [7:0] a,
  input [7:0] b,
  input [7:0] c,
  input [7:0] d,
  output reg [7:0] min
);

  always_comb begin
    min = a;
    if (min > b) min = b;
    if (min > c) min = c;
    if (min > d) min = d;
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [7:0] raw_a; wire [7:0] drive_a; assign #0.1 drive_a=raw_a;
wire [7:0] raw_b; wire [7:0] drive_b; assign #0.1 drive_b=raw_b;
wire [7:0] raw_c; wire [7:0] drive_c; assign #0.1 drive_c=raw_c;
wire [7:0] raw_d; wire [7:0] drive_d; assign #0.1 drive_d=raw_d;
wire [7:0] gold_min, dut_min, raw_dut_min; reg [7:0] seen_min='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.min(gold_min));
TopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.min(raw_dut_min));
assign dut_min=raw_dut_min;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<8;b=b+1) begin
if(gold_min[b] === 1'b0 || gold_min[b] === 1'b1) begin
known=1; seen_min[b]=1'b1;
if(dut_min[b] !== gold_min[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_min) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:min");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
