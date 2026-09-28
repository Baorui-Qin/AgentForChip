`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [7:0] in, 
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



	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		@(negedge clk) wavedrom_start("Priority encoder");
			@(posedge clk) in <= 8'h1;
			repeat(8) @(posedge clk) in <= in << 1;
			in <= 8'h10;
			repeat(8) @(posedge clk) in <= in + 1;
		@(negedge clk) wavedrom_stop();

		repeat(50) @(posedge clk, negedge clk) begin
			in <= $urandom;
		end
		repeat(260) @(posedge clk, negedge clk) begin
			in <= in + 1;
		end
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [7:0] in,
  output reg [2:0] pos
);

  always @(*) begin
    casez (in)
      default : pos = 2'h0;
      8'bzzzzzzz1: pos = 3'h0;
      8'bzzzzzz1z: pos = 3'h1;
      8'bzzzzz1zz: pos = 3'h2;
      8'bzzzz1zzz: pos = 3'h3;
      8'bzzz1zzzz: pos = 3'h4;
      8'bzz1zzzzz: pos = 3'h5;
      8'bz1zzzzzz: pos = 3'h6;
      8'b1zzzzzzz: pos = 3'h7;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;
wire [2:0] gold_pos, dut_pos, raw_dut_pos; reg [2:0] seen_pos='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.in(drive_in),.pos(gold_pos));
TopModule dut(.in(drive_in),.pos(raw_dut_pos));
assign dut_pos=raw_dut_pos;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<3;b=b+1) begin
if(gold_pos[b] === 1'b0 || gold_pos[b] === 1'b1) begin
known=1; seen_pos[b]=1'b1;
if(dut_pos[b] !== gold_pos[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_pos) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:pos");
if(checks != 686) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
