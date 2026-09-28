`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg load,
	output reg ena,
	output reg[1:0] amount,
	output reg[63:0] data,
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
		load <= 1;
		ena <= 0;
		data <= 'x;
		amount <= 0;
		@(posedge clk) data <= 64'h000100;
		wavedrom_start("Shifting");
			@(posedge clk) load <= 0; ena <= 1;
							amount <= 2;
			@(posedge clk) amount <= 2;
			@(posedge clk) amount <= 2;
			@(posedge clk) amount <= 1;
			@(posedge clk) amount <= 1;
			@(posedge clk) amount <= 0;
			@(posedge clk) amount <= 0;
			@(posedge clk) amount <= 3;
			@(posedge clk) amount <= 3;
			@(posedge clk) amount <= 2;
			@(posedge clk) amount <= 2;
			@(negedge clk);
		wavedrom_stop();
		
		@(posedge clk); load <= 1; data <= 64'hx;
		@(posedge clk); load <= 1; data <= 64'h80000000_00000000;
		wavedrom_start("Arithmetic right shift");
			@(posedge clk) load <= 0; ena <= 1;
							amount <= 2;
			@(posedge clk) amount <= 2;
			@(posedge clk) amount <= 2;
			@(posedge clk) amount <= 2;
			@(posedge clk) amount <= 2;
			@(negedge clk);
		wavedrom_stop();

		@(posedge clk);
		@(posedge clk);
		
		
		
		repeat(4000) @(posedge clk, negedge clk) begin
			load <= !($random(netlist_random_seed) & 31);
			ena <= |($random(netlist_random_seed) & 15);
			amount <= $random(netlist_random_seed);
			data <= {$random(netlist_random_seed),$random(netlist_random_seed)};
		end
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input load,
  input ena,
  input [1:0] amount,
  input [63:0] data,
  output reg [63:0] q
);

  always @(posedge clk) begin
    if (load)
      q <= data;
    else if (ena) case (amount)
      2'b00: q <= {q[62:0], 1'b0};
      2'b01: q <= {q[55:0], 8'b0};
      2'b10: q <= {q[63], q[63:1]};
      2'b11: q <= {{8{q[63]}}, q[63:8]};
      default: q <= 64'hx;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;
wire raw_ena; wire drive_ena; assign #0.1 drive_ena=raw_ena;
wire [1:0] raw_amount; wire [1:0] drive_amount; assign #0.1 drive_amount=raw_amount;
wire [63:0] raw_data; wire [63:0] drive_data; assign #0.1 drive_data=raw_data;
wire [63:0] gold_q, dut_q, raw_dut_q; reg [63:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.load(raw_load),.ena(raw_ena),.amount(raw_amount),.data(raw_data),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.load(drive_load),.ena(drive_ena),.amount(drive_amount),.data(drive_data),.q(gold_q));
TopModule dut(.clk(clk),.load(drive_load),.ena(drive_ena),.amount(drive_amount),.data(drive_data),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<64;b=b+1) begin
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
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
