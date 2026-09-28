`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg shift_ena, count_ena, data,
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
		data <= 0;
		shift_ena <= 1;
		count_ena <= 0;
		repeat(5) @(posedge clk);
	
		data <= 1;
		shift_ena <= 0;
		count_ena <= 0;
		@(posedge clk);
		wavedrom_start("Shift mode");
		@(posedge clk) shift_ena <= 1;
		repeat(2) @(posedge clk) shift_ena <= 0;
		@(posedge clk) shift_ena <= 1;
		repeat(4) @(posedge clk);
		@(posedge clk) data <= 0;
		repeat(4) @(posedge clk);
		wavedrom_stop();
	
		data <= 1;
		shift_ena <= 1;		
		repeat(4) @(posedge clk);
		shift_ena <= 0;
		wavedrom_start("Count mode");
		@(posedge clk) count_ena <= 1;
		repeat(2) @(posedge clk) count_ena <= 0;
		@(posedge clk) count_ena <= 1;
		repeat(4) @(posedge clk);
		@(posedge clk) data <= 0;
		repeat(4) @(posedge clk);
		wavedrom_stop();
	
		repeat(2000) @(posedge clk, negedge clk) begin
			{shift_ena, count_ena} <= $unsigned($random(netlist_random_seed)) % 3;
			data <= $random(netlist_random_seed);
		end
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input shift_ena,
  input count_ena,
  input data,
  output reg [3:0] q
);

  always @(posedge clk) begin
    if (shift_ena)
      q <= { q[2:0], data };
    else if (count_ena)
      q <= q - 1'b1;
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_shift_ena; wire drive_shift_ena; assign #0.1 drive_shift_ena=raw_shift_ena;
wire raw_count_ena; wire drive_count_ena; assign #0.1 drive_count_ena=raw_count_ena;
wire raw_data; wire drive_data; assign #0.1 drive_data=raw_data;
wire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.shift_ena(raw_shift_ena),.count_ena(raw_count_ena),.data(raw_data),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.shift_ena(drive_shift_ena),.count_ena(drive_count_ena),.data(drive_data),.q(gold_q));
TopModule dut(.clk(clk),.shift_ena(drive_shift_ena),.count_ena(drive_count_ena),.data(drive_data),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<4;b=b+1) begin
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
