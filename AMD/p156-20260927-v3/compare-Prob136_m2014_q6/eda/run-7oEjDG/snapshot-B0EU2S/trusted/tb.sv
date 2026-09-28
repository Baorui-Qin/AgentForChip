`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic reset,
	output logic w
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(200) @(posedge clk, negedge clk) begin
			w <= $random(netlist_random_seed);
			reset <= ($random(netlist_random_seed) & 15) == 0;
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  input w,
  output z
);

  parameter A=0, B=1, C=2, D=3, E=4, F=5;
  reg [2:0] state, next;

  always @(posedge clk)
    if (reset)
      state <= A;
    else
      state <= next;

  always_comb begin
    case(state)
      A: next = w ? A : B;
      B: next = w ? D : C;
      C: next = w ? D : E;
      D: next = w ? A : F;
      E: next = w ? D : E;
      F: next = w ? D : C;
      default: next = 'x;
    endcase
  end

  assign z = (state == E || state == F);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;
wire gold_z, dut_z, raw_dut_z; reg seen_z='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset),.w(raw_w));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.w(drive_w),.z(gold_z));
TopModule dut(.clk(clk),.reset(drive_reset),.w(drive_w),.z(raw_dut_z));
assign dut_z=raw_dut_z;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_z === 1'b0 || gold_z === 1'b1) begin
known=1; seen_z=1'b1;
if(dut_z !== gold_z) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_z) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:z");
if(checks != 339) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
