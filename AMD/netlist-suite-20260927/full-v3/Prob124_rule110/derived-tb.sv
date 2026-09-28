`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg load,
	output reg[511:0] data,
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
		data[0] <= 1'b1;
		load <= 1;
		@(posedge clk); wavedrom_start("Load q[511:0] = 1: See Hint.");
		@(posedge clk);
		@(posedge clk);
		load <= 0;
		repeat(10) @(posedge clk);		
		wavedrom_stop();
		
		data <= 0;
		data[256] <= 1'b1;
		load <= 1;
		@(posedge clk);
		@(posedge clk);
		@(posedge clk);
		load <= 0;
		repeat(1000) @(posedge clk) begin
		end
		data <= 512'h4df;
		load <= 1;
		@(posedge clk);
		load <= 0;
		repeat(1000) @(posedge clk) begin
		end
		data <= $random(netlist_random_seed);
		load <= 1;
		@(posedge clk);
		load <= 0;
		repeat(1000) @(posedge clk) begin
		end

		data <= 0;
		load <= 1;
		repeat (20) @(posedge clk);
		@(posedge clk) data <= 2;
		@(posedge clk) data <= 4;
		@(posedge clk) begin
			data <= 9;
			load <= 0;
		end
		@(posedge clk) data <= 12;
		repeat(100) @(posedge clk);

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input load,
  input [511:0] data,
  output reg [511:0] q
);

  always @(posedge clk) begin
    if (load)
      q <= data;
    else begin
      q <=
      ~((q[$bits(q)-1:1] & q[$bits(q)-1:0] & {q[$bits(q)-2:0], 1'b0}) |
      (~q[$bits(q)-1:1] & ~q[$bits(q)-1:0] & ~{q[$bits(q)-2:0], 1'b0}) |
      (q[$bits(q)-1:1] & ~q[$bits(q)-1:0] & ~{q[$bits(q)-2:0], 1'b0}) )
      ;
    end
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;
wire [511:0] raw_data; wire [511:0] drive_data; assign #0.1 drive_data=raw_data;
wire [511:0] gold_q, dut_q, raw_dut_q; reg [511:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.load(raw_load),.data(raw_data),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.load(drive_load),.data(drive_data),.q(gold_q));
TopModule dut(.clk(clk),.load(drive_load),.data(drive_data),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<512;b=b+1) begin
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
