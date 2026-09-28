`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic x,
	output logic [2:0] y
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(200) @(posedge clk, negedge clk) begin
			y <= $random(netlist_random_seed);
			x <= $random(netlist_random_seed);
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input x,
  input [2:0] y,
  output reg Y0,
  output reg z
);

  always_comb begin
    case ({y[2:0], x})
      4'h0: Y0 = 0;
      4'h1: Y0 = 1;
      4'h2: Y0 = 1;
      4'h3: Y0 = 0;
      4'h4: Y0 = 0;
      4'h5: Y0 = 1;
      4'h6: Y0 = 1;
      4'h7: Y0 = 0;
      4'h8: Y0 = 1;
      4'h9: Y0 = 0;
      default: Y0 = 1'bx;
    endcase

    case (y[2:0])
      3'h0: z = 0;
      3'h1: z = 0;
      3'h2: z = 0;
      3'h3: z = 1;
      3'h4: z = 1;
      default: z = 1'bx;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;
wire [2:0] raw_y; wire [2:0] drive_y; assign #0.1 drive_y=raw_y;
wire gold_Y0, dut_Y0, raw_dut_Y0; reg seen_Y0='0;
wire gold_z, dut_z, raw_dut_z; reg seen_z='0;
stimulus_gen stim1(.clk(clk),.x(raw_x),.y(raw_y));
oracle_RefModule gold(.clk(clk),.x(drive_x),.y(drive_y),.Y0(gold_Y0),.z(gold_z));
TopModule dut(.clk(clk),.x(drive_x),.y(drive_y),.Y0(raw_dut_Y0),.z(raw_dut_z));
assign dut_Y0=raw_dut_Y0;
assign dut_z=raw_dut_z;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_Y0 === 1'b0 || gold_Y0 === 1'b1) begin
known=1; seen_Y0=1'b1;
if(dut_Y0 !== gold_Y0) bad=1;
end end
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
if((&seen_Y0) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:Y0");
if((&seen_z) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:z");
if(checks != 243) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
