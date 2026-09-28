`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [15:0] a,b,c,d,e,f,g,h,i,
	output logic [3:0] sel,
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
		{a,b,c,d,e,f,g,h,i,sel} <= { 16'ha, 16'hb, 16'hc, 16'hd, 16'he, 16'hf, 16'h11, 16'h12, 16'h13, 4'h0 };
		@(negedge clk) wavedrom_start();
			@(posedge clk) sel <= 4'h1;
			@(posedge clk) sel <= 4'h2;
			@(posedge clk) sel <= 4'h3;
			@(posedge clk) sel <= 4'h4;
			@(posedge clk) sel <= 4'h7;
			@(posedge clk) sel <= 4'h8;
			@(posedge clk) sel <= 4'h9;
			@(posedge clk) sel <= 4'ha;
			@(posedge clk) sel <= 4'hb;
		@(negedge clk) wavedrom_stop();
			
		repeat(200) @(negedge clk, posedge clk) begin
			{a,b,c,d,e,f,g,h,i,sel} <= {$random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed)};
		end
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [15:0] a,
  input [15:0] b,
  input [15:0] c,
  input [15:0] d,
  input [15:0] e,
  input [15:0] f,
  input [15:0] g,
  input [15:0] h,
  input [15:0] i,
  input [3:0] sel,
  output logic [15:0] out
);

  always @(*) begin
    out = '1;
    case (sel)
      4'h0: out = a;
      4'h1: out = b;
      4'h2: out = c;
      4'h3: out = d;
      4'h4: out = e;
      4'h5: out = f;
      4'h6: out = g;
      4'h7: out = h;
      4'h8: out = i;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [15:0] raw_a; wire [15:0] drive_a; assign #0.1 drive_a=raw_a;
wire [15:0] raw_b; wire [15:0] drive_b; assign #0.1 drive_b=raw_b;
wire [15:0] raw_c; wire [15:0] drive_c; assign #0.1 drive_c=raw_c;
wire [15:0] raw_d; wire [15:0] drive_d; assign #0.1 drive_d=raw_d;
wire [15:0] raw_e; wire [15:0] drive_e; assign #0.1 drive_e=raw_e;
wire [15:0] raw_f; wire [15:0] drive_f; assign #0.1 drive_f=raw_f;
wire [15:0] raw_g; wire [15:0] drive_g; assign #0.1 drive_g=raw_g;
wire [15:0] raw_h; wire [15:0] drive_h; assign #0.1 drive_h=raw_h;
wire [15:0] raw_i; wire [15:0] drive_i; assign #0.1 drive_i=raw_i;
wire [3:0] raw_sel; wire [3:0] drive_sel; assign #0.1 drive_sel=raw_sel;
wire [15:0] gold_out, dut_out, raw_dut_out; reg [15:0] seen_out='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.e(raw_e),.f(raw_f),.g(raw_g),.h(raw_h),.i(raw_i),.sel(raw_sel),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.f(drive_f),.g(drive_g),.h(drive_h),.i(drive_i),.sel(drive_sel),.out(gold_out));
TopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.f(drive_f),.g(drive_g),.h(drive_h),.i(drive_i),.sel(drive_sel),.out(raw_dut_out));
assign dut_out=~raw_dut_out;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<16;b=b+1) begin
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
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
