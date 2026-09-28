`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg [15:0] d, output reg [1:0] byteena,
	output reg resetn,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	input tb_match
);
integer netlist_random_seed=1;

	reg reset;
	assign resetn = ~reset;

// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	


	task reset_test(input async=0);
		bit arfail, srfail, datafail;
	
		@(posedge clk);
		@(posedge clk) reset <= 0;
		repeat(3) @(posedge clk);
	
		@(negedge clk) begin datafail = !tb_match ; reset <= 1; end
		@(posedge clk) arfail = !tb_match;
		@(posedge clk) begin
			srfail = !tb_match;
			reset <= 0;
		end
		if (srfail)
			$display("Hint: Your reset doesn't seem to be working.");
		else if (arfail && (async || !datafail))
			$display("Hint: Your reset should be %0s, but doesn't appear to be.", async ? "asynchronous" : "synchronous");
		// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely
		// a functionality error than the reset being implemented asynchronously.
	
	endtask

	
	initial begin #101;
		reset <= 1;
		byteena <= 2'b11;
		d <= 16'habcd;
		@(posedge clk);
		wavedrom_start("Synchronous active-low reset");
		reset_test(0);
		repeat(2) @(posedge clk);
		wavedrom_stop();
		@(posedge clk);
		
		
		byteena <= 2'b11;
		d <= $random(netlist_random_seed);
		@(posedge clk);
		@(negedge clk);
		wavedrom_start("DFF with byte enables");
		repeat(10) @(posedge clk) begin
			d <= $random(netlist_random_seed);
			byteena <= byteena + 1;
		end
		wavedrom_stop();
		
		repeat(400) @(posedge clk, negedge clk) begin
			byteena[0] <= ($random(netlist_random_seed) & 3) != 0;
			byteena[1] <= ($random(netlist_random_seed) & 3) != 0;
			d <= $random(netlist_random_seed);
		end
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input resetn,
  input [1:0] byteena,
  input [15:0] d,
  output reg [15:0] q
);

  always @(posedge clk) begin
    if (!resetn)
      q <= 0;
    else begin
      if (byteena[0])
        q[7:0] <= d[7:0];
      if (byteena[1])
        q[15:8] <= d[15:8];
    end
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_resetn; wire drive_resetn; assign #0.1 drive_resetn=raw_resetn;
wire [1:0] raw_byteena; wire [1:0] drive_byteena; assign #0.1 drive_byteena=raw_byteena;
wire [15:0] raw_d; wire [15:0] drive_d; assign #0.1 drive_d=raw_d;
wire [15:0] gold_q, dut_q, raw_dut_q; reg [15:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.d(raw_d),.byteena(raw_byteena),.resetn(raw_resetn),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.resetn(drive_resetn),.byteena(drive_byteena),.d(drive_d),.q(gold_q));
TopModule dut(.clk(clk),.resetn(drive_resetn),.byteena(drive_byteena),.d(drive_d),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<16;b=b+1) begin
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
