`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [3:0] in, 
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
			@(posedge clk) in <= 4'h1;
			repeat(4) @(posedge clk) in <= in << 1;
			in <= 0;
			repeat(16) @(posedge clk) in <= in + 1;
		@(negedge clk) wavedrom_stop();

		repeat(50) @(posedge clk, negedge clk) begin
			in <= $urandom;
		end
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [3:0] in,
  output reg [1:0] pos
);

  always @(*) begin
    case (in)
      4'h0: pos = 2'h0;
      4'h1: pos = 2'h0;
      4'h2: pos = 2'h1;
      4'h3: pos = 2'h0;
      4'h4: pos = 2'h2;
      4'h5: pos = 2'h0;
      4'h6: pos = 2'h1;
      4'h7: pos = 2'h0;
      4'h8: pos = 2'h3;
      4'h9: pos = 2'h0;
      4'ha: pos = 2'h1;
      4'hb: pos = 2'h0;
      4'hc: pos = 2'h2;
      4'hd: pos = 2'h0;
      4'he: pos = 2'h1;
      4'hf: pos = 2'h0;
      default: pos = 2'b0;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [3:0] raw_in; wire [3:0] drive_in; assign #0.1 drive_in=raw_in;
wire [1:0] gold_pos, dut_pos, raw_dut_pos; reg [1:0] seen_pos='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.in(drive_in),.pos(gold_pos));
TopModule dut(.in(drive_in),.pos(raw_dut_pos));
assign dut_pos=raw_dut_pos;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<2;b=b+1) begin
if(gold_pos[b] === 1'b0 || gold_pos[b] === 1'b1) begin
known=1; seen_pos[b]=1'b1;
if(dut_pos[b] !== gold_pos[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_pos) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:pos");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
