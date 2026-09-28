`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13

module stimulus_gen(
	input clk, 
	output logic load, 
	output logic [9:0] data, 
	input tb_match,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	output int wavedrom_hide_after_time
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
		load <= 1'b0;
		wavedrom_start("Count 3, then 10 cycles");
			@(posedge clk) {data, load} <= {10'd3, 1'b1};
			@(posedge clk) {data, load} <= {10'hx, 1'b0};
			@(posedge clk) load <= 0;
			@(posedge clk) load <= 0;
			@(posedge clk) load <= 0;
			@(posedge clk) {data, load} <= {10'd10, 1'b1};
			@(posedge clk) {data, load} <= {10'hx, 1'b0};
			repeat(12) @(posedge clk);
		wavedrom_stop();

		@(posedge clk) {load, data} <= {1'b1, 10'h10};
		@(posedge clk) {load, data} <= {1'b0, 10'h10};
		@(posedge clk) {load, data} <= {1'b1, 10'h0};   // Load 0
		@(posedge clk) {load, data} <= {1'b1, 10'h3ff}; // Load 1023
		@(posedge clk) {load, data} <= {1'b0, 10'h0};
		repeat(1040) @(posedge clk);

		repeat(2500) @(posedge clk) begin
			load <= !($urandom & 10'hf);
			data <= $urandom_range(0,32);
		end

		
		#1 $finish;
	end end

endmodule

`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input load,
  input [9:0] data,
  output tc
);

  logic [9:0] count_value;

  always @(posedge clk)
    if(load) count_value <= data;
    else if(count_value != 0) count_value <= count_value - 1;

  assign tc = count_value == 0;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;
wire [9:0] raw_data; wire [9:0] drive_data; assign #0.1 drive_data=raw_data;
wire gold_tc, dut_tc, raw_dut_tc; reg seen_tc='0;
stimulus_gen stim1(.clk(clk),.load(raw_load),.data(raw_data),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable(),.wavedrom_hide_after_time());
oracle_RefModule gold(.clk(clk),.load(drive_load),.data(drive_data),.tc(gold_tc));
TopModule dut(.clk(clk),.load(drive_load),.data(drive_data),.tc(raw_dut_tc));
assign dut_tc=raw_dut_tc;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_tc === 1'b0 || gold_tc === 1'b1) begin
known=1; seen_tc=1'b1;
if(dut_tc !== gold_tc) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_tc) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:tc");
if(checks != 14249) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
