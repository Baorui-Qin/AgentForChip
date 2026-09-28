`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg load,
	output reg[1:0] ena,
	output reg[99:0] data
);
integer netlist_random_seed=1;


	always @(posedge clk)
		data <= {$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)};
	
	initial begin #101;
		load <= 1;
		@(posedge clk);
		@(posedge clk);
		@(posedge clk);
		repeat(4000) @(posedge clk, negedge clk) begin
			load <= !($random(netlist_random_seed) & 31);
			ena <= $random(netlist_random_seed);
		end
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input load,
  input [1:0] ena,
  input [99:0] data,
  output reg [99:0] q
);

  always @(posedge clk) begin
    if (load)
      q <= data;
    else if (ena == 2'h1)
      q <= {q[0], q[99:1]};
    else if (ena == 2'h2)
      q <= {q[98:0], q[99]};
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;
wire [1:0] raw_ena; wire [1:0] drive_ena; assign #0.1 drive_ena=raw_ena;
wire [99:0] raw_data; wire [99:0] drive_data; assign #0.1 drive_data=raw_data;
wire [99:0] gold_q, dut_q, raw_dut_q; reg [99:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.load(raw_load),.ena(raw_ena),.data(raw_data));
oracle_RefModule gold(.clk(clk),.load(drive_load),.ena(drive_ena),.data(drive_data),.q(gold_q));
TopModule dut(.clk(clk),.load(drive_load),.ena(drive_ena),.data(drive_data),.q(raw_dut_q));
assign dut_q=~raw_dut_q;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<100;b=b+1) begin
if(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin
known=1; seen_q[b]=1'b1;
if(dut_q[b] !== gold_q[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_q) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:q");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
