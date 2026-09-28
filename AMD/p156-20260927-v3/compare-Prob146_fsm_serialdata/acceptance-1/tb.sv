`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic in,
	output logic reset
);
integer netlist_random_seed=1;


	initial begin #101;
		reset <= 1;
		in <= 1;
		@(posedge clk);
		reset <= 0;
		in <= 0;
		repeat(9) @(posedge clk);
		in <= 1;
		@(posedge clk);
		in <= 0;
		repeat(9) @(posedge clk);
		in <= 1;
		@(posedge clk);
		in <= 0;
		repeat(10) @(posedge clk);
		in <= 1;
		@(posedge clk);
		in <= 0;
		repeat(10) @(posedge clk);
		in <= 1;
		@(posedge clk);
		in <= 0;
		repeat(9) @(posedge clk);
		in <= 1;
		@(posedge clk);
		
		
		
		repeat(800) @(posedge clk, negedge clk) begin
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
  input in,
  input reset,
  output [7:0] out_byte,
  output done
);

  parameter B0=0, B1=1, B2=2, B3=3, B4=4, B5=5, B6=6, B7=7, START=8, STOP=9, DONE=10, ERR=11;
  reg [3:0] state;
  reg [3:0] next;

  reg [9:0] byte_r;

  always_comb begin
    case (state)
      START: next = in ? START : B0;  // start bit is 0
      B0: next = B1;
      B1: next = B2;
      B2: next = B3;
      B3: next = B4;
      B4: next = B5;
      B5: next = B6;
      B6: next = B7;
      B7: next = STOP;
      STOP: next = in ? DONE : ERR;  // stop bit is 1. Idle state is 1.
      DONE: next = in ? START : B0;
      ERR: next = in ? START : ERR;
    endcase
  end

  always @(posedge clk) begin
    if (reset) state <= START;
      else state <= next;
  end

  always @(posedge clk) begin
    byte_r <= {in, byte_r[9:1]};
  end

  assign done = (state==DONE);
  assign out_byte = done ? byte_r[8:1] : 8'hx;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire [7:0] gold_out_byte, dut_out_byte, raw_dut_out_byte; reg [7:0] seen_out_byte='0;
wire gold_done, dut_done, raw_dut_done; reg seen_done='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.reset(raw_reset));
oracle_RefModule gold(.clk(clk),.in(drive_in),.reset(drive_reset),.out_byte(gold_out_byte),.done(gold_done));
TopModule dut(.clk(clk),.in(drive_in),.reset(drive_reset),.out_byte(raw_dut_out_byte),.done(raw_dut_done));
assign dut_out_byte=raw_dut_out_byte;
assign dut_done=raw_dut_done;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<8;b=b+1) begin
if(gold_out_byte[b] === 1'b0 || gold_out_byte[b] === 1'b1) begin
known=1; seen_out_byte[b]=1'b1;
if(dut_out_byte[b] !== gold_out_byte[b]) bad=1;
end end
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
if((&seen_out_byte) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_byte");
if((&seen_done) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:done");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
