`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [7:0] in,
	output logic reset
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(200) @(negedge clk) begin
			in <= $random(netlist_random_seed);
			reset <= !($random(netlist_random_seed) & 31);
		end

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input [7:0] in,
  input reset,
  output done
);

  parameter BYTE1=0, BYTE2=1, BYTE3=2, DONE=3;
  reg [1:0] state;
  reg [1:0] next;

  wire in3 = in[3];

  always_comb begin
    case (state)
      BYTE1: next = in3 ? BYTE2 : BYTE1;
      BYTE2: next = BYTE3;
      BYTE3: next = DONE;
      DONE: next = in3 ? BYTE2 : BYTE1;
    endcase
  end

  always @(posedge clk) begin
    if (reset) state <= BYTE1;
      else state <= next;
  end

  assign done = (state==DONE);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;
wire gold_done, dut_done, raw_dut_done; reg seen_done='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.reset(raw_reset));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.done(gold_done));
TopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.done(raw_dut_done));
assign dut_done=~raw_dut_done;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_done === 1'b0 || gold_done === 1'b1) begin
known=1; seen_done=1'b1;
if(dut_done !== gold_done) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_done) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:done");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
