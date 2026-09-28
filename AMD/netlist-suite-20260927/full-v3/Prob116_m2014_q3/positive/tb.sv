`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [3:0] x
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(100) @(posedge clk, negedge clk) begin
			x <= $random(netlist_random_seed);
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [3:0] x,
  output logic f
);

  always_comb begin
    case (x)
      4'h0: f = 1'bx;
      4'h1: f = 1'bx;
      4'h2: f = 0;
      4'h3: f = 1'bx;
      4'h4: f = 1;
      4'h5: f = 1'bx;
      4'h6: f = 1;
      4'h7: f = 0;
      4'h8: f = 0;
      4'h9: f = 0;
      4'ha: f = 1'bx;
      4'hb: f = 1;
      4'hc: f = 1;
      4'hd: f = 1'bx;
      4'he: f = 1;
      4'hf: f = 1'bx;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [3:0] raw_x; wire [3:0] drive_x; assign #0.1 drive_x=raw_x;
wire gold_f, dut_f, raw_dut_f; reg seen_f='0;
stimulus_gen stim1(.clk(clk),.x(raw_x));
oracle_RefModule gold(.x(drive_x),.f(gold_f));
TopModule dut(.x(drive_x),.f(raw_dut_f));
assign dut_f=raw_dut_f;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_f === 1'b0 || gold_f === 1'b1) begin
known=1; seen_f=1'b1;
if(dut_f !== gold_f) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_f) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:f");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
