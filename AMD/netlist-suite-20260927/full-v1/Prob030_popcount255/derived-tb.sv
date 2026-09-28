`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [254:0] in,
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


	
	initial begin #101;
		in <= 255'h0;
		wavedrom_start("");
		@(posedge clk, negedge clk) in <= 255'h0;
		@(posedge clk, negedge clk) in <= 255'h0;
		@(posedge clk, negedge clk) in <= 255'h1;
		@(posedge clk, negedge clk) in <= 255'h1;
		@(posedge clk, negedge clk) in <= 255'h3;
		@(posedge clk, negedge clk) in <= 255'h3;
		@(posedge clk, negedge clk) in <= 255'h7;
		@(posedge clk, negedge clk) in <= 255'haaaa;
		@(posedge clk, negedge clk) in <= 255'hf00000;
		@(posedge clk, negedge clk) in <= 255'h0;
		wavedrom_stop();
		repeat (200) @(posedge clk, negedge clk) begin
			in <= {$random, $random, $random, $random, $random, $random, $random, $random};
		end
		@(posedge clk);
		in <= '0;
		@(posedge clk)
		in <= '1;
		@(posedge clk)
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [254:0] in,
  output reg [7:0] out
);

  always_comb  begin
    out = 0;
    for (int i=0;i<255;i++)
      out = out + in[i];
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [254:0] raw_in; wire [254:0] drive_in; assign #0.1 drive_in=raw_in;
wire [7:0] gold_out, dut_out, raw_dut_out; reg [7:0] seen_out='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.in(drive_in),.out(gold_out));
TopModule dut(.in(drive_in),.out(raw_dut_out));
assign dut_out=raw_dut_out;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<8;b=b+1) begin
if(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin
known=1; seen_out[b]=1'b1;
if(dut_out[b] !== gold_out[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.2; sample(); #4.6; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
