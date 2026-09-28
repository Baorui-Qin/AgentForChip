`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic cpu_overheated, arrived, gas_tank_empty,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable	
);


// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	



	logic [2:0] s = 3'b010;
	assign {cpu_overheated, arrived, gas_tank_empty} = s;

	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		@(negedge clk) wavedrom_start("");
		@(posedge clk) s <= 3'b010;
		@(posedge clk) s <= 3'b100;
		@(posedge clk) s <= 3'b100;
		@(posedge clk) s <= 3'b001;
		@(posedge clk) s <= 3'b000;
		@(posedge clk) s <= 3'b100;
		@(posedge clk) s <= 3'b110;
		@(posedge clk) s <= 3'b111;
		@(posedge clk) s <= 3'b111;
		@(posedge clk) s <= 3'b111;
		wavedrom_stop();
		repeat(100) @(posedge clk, negedge clk)
			s <= $urandom;
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input cpu_overheated,
  output reg shut_off_computer,
  input arrived,
  input gas_tank_empty,
  output reg keep_driving
);

  always @(*) begin
    if (cpu_overheated)
      shut_off_computer = 1;
    else
      shut_off_computer = 0;
  end

  always @(*) begin
    if (~arrived)
      keep_driving = !gas_tank_empty;
    else
      keep_driving = 1'b0;
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_cpu_overheated; wire drive_cpu_overheated; assign #0.1 drive_cpu_overheated=raw_cpu_overheated;
wire raw_arrived; wire drive_arrived; assign #0.1 drive_arrived=raw_arrived;
wire raw_gas_tank_empty; wire drive_gas_tank_empty; assign #0.1 drive_gas_tank_empty=raw_gas_tank_empty;
wire gold_shut_off_computer, dut_shut_off_computer, raw_dut_shut_off_computer; reg seen_shut_off_computer='0;
wire gold_keep_driving, dut_keep_driving, raw_dut_keep_driving; reg seen_keep_driving='0;
stimulus_gen stim1(.clk(clk),.cpu_overheated(raw_cpu_overheated),.arrived(raw_arrived),.gas_tank_empty(raw_gas_tank_empty),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.cpu_overheated(drive_cpu_overheated),.shut_off_computer(gold_shut_off_computer),.arrived(drive_arrived),.gas_tank_empty(drive_gas_tank_empty),.keep_driving(gold_keep_driving));
TopModule dut(.cpu_overheated(drive_cpu_overheated),.shut_off_computer(raw_dut_shut_off_computer),.arrived(drive_arrived),.gas_tank_empty(drive_gas_tank_empty),.keep_driving(raw_dut_keep_driving));
assign dut_shut_off_computer=raw_dut_shut_off_computer;
assign dut_keep_driving=raw_dut_keep_driving;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_shut_off_computer === 1'b0 || gold_shut_off_computer === 1'b1) begin
known=1; seen_shut_off_computer=1'b1;
if(dut_shut_off_computer !== gold_shut_off_computer) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_keep_driving === 1'b0 || gold_keep_driving === 1'b1) begin
known=1; seen_keep_driving=1'b1;
if(dut_keep_driving !== gold_keep_driving) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_shut_off_computer) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:shut_off_computer");
if((&seen_keep_driving) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:keep_driving");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
