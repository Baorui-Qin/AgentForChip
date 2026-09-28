`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [2:0] sel, 
	output logic [3:0] data0,
	output logic [3:0] data1,
	output logic [3:0] data2,
	output logic [3:0] data3,
	output logic [3:0] data4,
	output logic [3:0] data5,
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



	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		data0 <= 4'ha;
		data1 <= 4'hb;
		data2 <= 4'hc;
		data3 <= 4'hd;
		data4 <= 4'he;
		data5 <= 4'hf;
		{sel} <= 3'b111;
		@(negedge clk) wavedrom_start("<b>Sel</b> chooses one of the data inputs");
			repeat(8) @(posedge clk) sel <= sel + 1;
		@(negedge clk) wavedrom_stop();

		repeat(100) @(posedge clk, negedge clk) begin
			{data0, data1, data2, data3} <= $urandom;
			{data4, data5, sel} <= $urandom;
		end
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [2:0] sel,
  input [3:0] data0,
  input [3:0] data1,
  input [3:0] data2,
  input [3:0] data3,
  input [3:0] data4,
  input [3:0] data5,
  output reg [3:0] out
);

  always @(*) begin
    case (sel)
      3'h0: out = data0;
      3'h1: out = data1;
      3'h2: out = data2;
      3'h3: out = data3;
      3'h4: out = data4;
      3'h5: out = data5;
      default: out = 4'b0;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [2:0] raw_sel; wire [2:0] drive_sel; assign #0.1 drive_sel=raw_sel;
wire [3:0] raw_data0; wire [3:0] drive_data0; assign #0.1 drive_data0=raw_data0;
wire [3:0] raw_data1; wire [3:0] drive_data1; assign #0.1 drive_data1=raw_data1;
wire [3:0] raw_data2; wire [3:0] drive_data2; assign #0.1 drive_data2=raw_data2;
wire [3:0] raw_data3; wire [3:0] drive_data3; assign #0.1 drive_data3=raw_data3;
wire [3:0] raw_data4; wire [3:0] drive_data4; assign #0.1 drive_data4=raw_data4;
wire [3:0] raw_data5; wire [3:0] drive_data5; assign #0.1 drive_data5=raw_data5;
wire [3:0] gold_out, dut_out, raw_dut_out; reg [3:0] seen_out='0;
stimulus_gen stim1(.clk(clk),.sel(raw_sel),.data0(raw_data0),.data1(raw_data1),.data2(raw_data2),.data3(raw_data3),.data4(raw_data4),.data5(raw_data5),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.sel(drive_sel),.data0(drive_data0),.data1(drive_data1),.data2(drive_data2),.data3(drive_data3),.data4(drive_data4),.data5(drive_data5),.out(gold_out));
TopModule dut(.sel(drive_sel),.data0(drive_data0),.data1(drive_data1),.data2(drive_data2),.data3(drive_data3),.data4(drive_data4),.data5(drive_data5),.out(raw_dut_out));
assign dut_out=raw_dut_out;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<4;b=b+1) begin
if(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin
known=1; seen_out[b]=1'b1;
if(dut_out[b] !== gold_out[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
