`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic reset, in
);
integer netlist_random_seed=1;


	
	initial begin #101;
		reset <= 1;
		in <= 0;
		@(posedge clk);
		repeat(800) @(posedge clk, negedge clk) begin
			reset <= !($random(netlist_random_seed) & 31);
			in <= |($random(netlist_random_seed)&7);
		end
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  input in,
  output disc,
  output flag,
  output err
);

  parameter [3:0] S0=0, S1=1, S2=2, S3=3, S4=4, S5=5, S6=6, SERR=7, SDISC=8, SFLAG=9;
  reg [3:0] state, next;

  assign disc = state == SDISC;
  assign flag = state == SFLAG;
  assign err = state == SERR;

  always @(posedge clk) begin
    case (state)
      S0: state <= in ? S1 : S0;
      S1: state <= in ? S2 : S0;
      S2: state <= in ? S3 : S0;
      S3: state <= in ? S4 : S0;
      S4: state <= in ? S5 : S0;
      S5: state <= in ? S6 : SDISC;
      S6: state <= in ? SERR : SFLAG;
      SERR: state <= in ? SERR : S0;
      SFLAG: state <= in ? S1 : S0;
      SDISC: state <= in ? S1 : S0;
      default: state <= 'x;
    endcase

    if (reset) state <= S0;
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;
wire gold_disc, dut_disc, raw_dut_disc; reg seen_disc='0;
wire gold_flag, dut_flag, raw_dut_flag; reg seen_flag='0;
wire gold_err, dut_err, raw_dut_err; reg seen_err='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset),.in(raw_in));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.disc(gold_disc),.flag(gold_flag),.err(gold_err));
TopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.disc(raw_dut_disc),.flag(raw_dut_flag),.err(raw_dut_err));
assign dut_disc=raw_dut_disc;
assign dut_flag=raw_dut_flag;
assign dut_err=raw_dut_err;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_disc === 1'b0 || gold_disc === 1'b1) begin
known=1; seen_disc=1'b1;
if(dut_disc !== gold_disc) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_flag === 1'b0 || gold_flag === 1'b1) begin
known=1; seen_flag=1'b1;
if(dut_flag !== gold_flag) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_err === 1'b0 || gold_err === 1'b1) begin
known=1; seen_err=1'b1;
if(dut_err !== gold_err) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_disc) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:disc");
if((&seen_flag) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:flag");
if((&seen_err) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:err");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
