`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg [2:0] y,
	output reg w
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(100) @(posedge clk, negedge clk) begin
			{y,w} <= $random(netlist_random_seed);
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [2:0] y,
  input w,
  output reg Y1
);

  always_comb begin
    case ({y, w})
      4'h0: Y1 = 1'b0;
      4'h1: Y1 = 1'b0;
      4'h2: Y1 = 1'b1;
      4'h3: Y1 = 1'b1;
      4'h4: Y1 = 1'b0;
      4'h5: Y1 = 1'b1;
      4'h6: Y1 = 1'b0;
      4'h7: Y1 = 1'b0;
      4'h8: Y1 = 1'b0;
      4'h9: Y1 = 1'b1;
      4'ha: Y1 = 1'b1;
      4'hb: Y1 = 1'b1;
      default: Y1 = 1'bx;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [2:0] raw_y; wire [2:0] drive_y; assign #0.1 drive_y=raw_y;
wire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;
wire gold_Y1, dut_Y1, raw_dut_Y1; reg seen_Y1='0;
stimulus_gen stim1(.clk(clk),.y(raw_y),.w(raw_w));
oracle_RefModule gold(.y(drive_y),.w(drive_w),.Y1(gold_Y1));
TopModule dut(.y(drive_y),.w(drive_w),.Y1(raw_dut_Y1));
assign dut_Y1=~raw_dut_Y1;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_Y1 === 1'b0 || gold_Y1 === 1'b1) begin
known=1; seen_Y1=1'b1;
if(dut_Y1 !== gold_Y1) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_Y1) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:Y1");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
