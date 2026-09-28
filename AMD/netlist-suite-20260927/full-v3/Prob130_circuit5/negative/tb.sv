`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [3:0] a,b,c,d,e,
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
		@(negedge clk) wavedrom_start("Unknown circuit");
			@(posedge clk) {a,b,c,d,e} <= {20'hab0de};
			repeat(18) @(posedge clk, negedge clk) c <= c + 1;
		wavedrom_stop();

		@(negedge clk) wavedrom_start("Unknown circuit");
			@(posedge clk) {a,b,c,d,e} <= {20'h12034};
			repeat(8) @(posedge clk, negedge clk) c <= c + 1;
			@(posedge clk) {a,b,c,d,e} <= {20'h56078};
			repeat(8) @(posedge clk, negedge clk) c <= c + 1;
		wavedrom_stop();
		
		repeat(100) @(posedge clk, negedge clk)
			{a,b,c,d,e} <= $urandom;
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [3:0] a,
  input [3:0] b,
  input [3:0] c,
  input [3:0] d,
  input [3:0] e,
  output reg [3:0] q
);

  always @(*)
    case (c)
      0: q = b;
      1: q = e;
      2: q = a;
      3: q = d;
      default: q = 4'hf;
    endcase

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [3:0] raw_a; wire [3:0] drive_a; assign #0.1 drive_a=raw_a;
wire [3:0] raw_b; wire [3:0] drive_b; assign #0.1 drive_b=raw_b;
wire [3:0] raw_c; wire [3:0] drive_c; assign #0.1 drive_c=raw_c;
wire [3:0] raw_d; wire [3:0] drive_d; assign #0.1 drive_d=raw_d;
wire [3:0] raw_e; wire [3:0] drive_e; assign #0.1 drive_e=raw_e;
wire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.e(raw_e),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.q(gold_q));
TopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.q(raw_dut_q));
assign dut_q=~raw_dut_q;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<4;b=b+1) begin
if(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin
known=1; seen_q[b]=1'b1;
if(dut_q[b] !== gold_q[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_q) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:q");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
