`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic in,
	output logic [9:0] state,
	input tb_match,
	input [9:0] next_state_ref,
	input [9:0] next_state_dut,
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

	reg [9:0] state_error = 10'h0;
	
	initial begin #101;
		repeat(2) @(posedge clk);
		forever @(posedge clk, negedge clk)
			state_error <= state_error | (next_state_ref^next_state_dut);
	end
		
	initial begin #101;
		state <= 0;
		
		@(negedge clk) wavedrom_start();
		for (int i=0;i<10;i++) begin
			@(negedge clk, posedge clk);
			state <= 1<< i;
			in <= 0;
		end
		for (int i=0;i<10;i++) begin
			@(negedge clk, posedge clk);
			state <= 1<< i;
			in <= 1;
		end			
		@(negedge clk) wavedrom_stop();
		
		// Test the one-hot cases first.
		repeat(200) @(posedge clk, negedge clk) begin
			state <= 1<< ($unsigned($random(netlist_random_seed)) % 10);
			in <= $random(netlist_random_seed);
		end
		
		for (int i=0;i<$bits(state_error);i++)
			$display("Hint: next_state[%0d] is %s.", i, (state_error[i] === 1'b0) ? "correct": "incorrect");

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input in,
  input [9:0] state,
  output [9:0] next_state,
  output out1,
  output out2
);

  assign out1 = state[8] | state[9];
  assign out2 = state[7] | state[9];

  assign next_state[0] = !in && (|state[4:0] | state[7] | state[8] | state[9]);
  assign next_state[1] = in && (state[0] | state[8] | state[9]);
  assign next_state[2] = in && state[1];
  assign next_state[3] = in && state[2];
  assign next_state[4] = in && state[3];
  assign next_state[5] = in && state[4];
  assign next_state[6] = in && state[5];
  assign next_state[7] = in && (state[6] | state[7]);
  assign next_state[8] = !in && state[5];
  assign next_state[9] = !in && state[6];

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;
wire [9:0] raw_state; wire [9:0] drive_state; assign #0.1 drive_state=raw_state;
wire [9:0] gold_next_state, dut_next_state, raw_dut_next_state; reg [9:0] seen_next_state='0;
wire gold_out1, dut_out1, raw_dut_out1; reg seen_out1='0;
wire gold_out2, dut_out2, raw_dut_out2; reg seen_out2='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.state(raw_state),.tb_match(1'b1),.next_state_ref(gold_next_state),.next_state_dut(gold_next_state),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.in(drive_in),.state(drive_state),.next_state(gold_next_state),.out1(gold_out1),.out2(gold_out2));
TopModule dut(.in(drive_in),.state(drive_state),.next_state(raw_dut_next_state),.out1(raw_dut_out1),.out2(raw_dut_out2));
assign dut_next_state=raw_dut_next_state;
assign dut_out1=raw_dut_out1;
assign dut_out2=raw_dut_out2;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<10;b=b+1) begin
if(gold_next_state[b] === 1'b0 || gold_next_state[b] === 1'b1) begin
known=1; seen_next_state[b]=1'b1;
if(dut_next_state[b] !== gold_next_state[b]) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out1 === 1'b0 || gold_out1 === 1'b1) begin
known=1; seen_out1=1'b1;
if(dut_out1 !== gold_out1) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out2 === 1'b0 || gold_out2 === 1'b1) begin
known=1; seen_out2=1'b1;
if(dut_out2 !== gold_out2) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_next_state) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:next_state");
if((&seen_out1) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:out1");
if((&seen_out2) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:out2");
if(checks != 447) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
