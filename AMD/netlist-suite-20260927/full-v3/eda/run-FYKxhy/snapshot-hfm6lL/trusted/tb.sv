`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic S, enable,
	output logic A, B, C,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable
);
integer netlist_random_seed=1;



// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	



	initial begin #101;
		enable <= 0;
		{A,B,C} <= 0;
		S <= 1'bx;
		@(negedge clk) wavedrom_start("A 3-input AND gate");
			@(posedge clk);
			@(posedge clk) enable <= 1; S <= 1;
			@(posedge clk) S <= 0;
			@(posedge clk) S <= 0;
			@(posedge clk) S <= 0;
			@(posedge clk) S <= 0;
			@(posedge clk) S <= 0;
			@(posedge clk) S <= 0;
			@(posedge clk) S <= 0;
			@(posedge clk) enable <= 0; S <= 1'bx;
			{A,B,C} <= 5;
			@(posedge clk) {A,B,C} <= 6;
			@(posedge clk) {A,B,C} <= 7;
			@(posedge clk) {A,B,C} <= 0;
			@(posedge clk) {A,B,C} <= 1;
		@(negedge clk) wavedrom_stop();

		repeat(500) @(posedge clk, negedge clk) begin
			{A,B,C,S} <= $random(netlist_random_seed);
			enable <= ($random(netlist_random_seed)&3) == 0;
		end
		
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input enable,
  input S,
  input A,
  input B,
  input C,
  output reg Z
);

  reg [7:0] q;
  always @(posedge clk) begin
    if (enable)
      q <= {q[6:0], S};
  end

  assign Z = q[ {A, B, C} ];

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_enable; wire drive_enable; assign #0.1 drive_enable=raw_enable;
wire raw_S; wire drive_S; assign #0.1 drive_S=raw_S;
wire raw_A; wire drive_A; assign #0.1 drive_A=raw_A;
wire raw_B; wire drive_B; assign #0.1 drive_B=raw_B;
wire raw_C; wire drive_C; assign #0.1 drive_C=raw_C;
wire gold_Z, dut_Z, raw_dut_Z; reg seen_Z='0;
stimulus_gen stim1(.clk(clk),.S(raw_S),.enable(raw_enable),.A(raw_A),.B(raw_B),.C(raw_C),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.enable(drive_enable),.S(drive_S),.A(drive_A),.B(drive_B),.C(drive_C),.Z(gold_Z));
TopModule dut(.clk(clk),.enable(drive_enable),.S(drive_S),.A(drive_A),.B(drive_B),.C(drive_C),.Z(raw_dut_Z));
assign dut_Z=raw_dut_Z;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_Z === 1'b0 || gold_Z === 1'b1) begin
known=1; seen_Z=1'b1;
if(dut_Z !== gold_Z) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_Z) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:Z");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
