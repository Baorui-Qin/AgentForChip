`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	input tb_match,
	input [255:0] q_ref,
	input [255:0] q_dut,
	output reg load,
	output reg[255:0] data
);
integer netlist_random_seed=1;


	logic errored = 0;
	int blinker_cycle = 0;

	initial begin #101;
		data <= 3'h7;			// Simple blinker, period 2
		load <= 1;
		@(posedge clk);
		load <= 0;
		data <= 4'hx;
		errored = 0;
		blinker_cycle = 0;
		repeat(5) @(posedge clk) begin
			blinker_cycle++;
			if (!tb_match) begin
				if (!errored) begin
					errored = 1;
					$display("Hint: The first test case is a blinker (initial state = 256'h7). First mismatch occurred at cycle %0d.\nHint:", blinker_cycle);
				end
			end
			
			if (errored) begin
				$display ("Hint: Cycle %0d:         Your game state       Reference game state", blinker_cycle);
				for (int i=15;i>=0;i--) begin
					$display("Hint:   q[%3d:%3d]     %016b      %016b", i*16+15, i*16, q_dut [ i*16 +: 16 ], q_ref[ i*16 +: 16 ]);
				end
				$display("Hint:\nHint:\n");
			end
		end


		data <= 48'h000200010007;	// Glider, Traveling diagonal down-right.
		load <= 1;
		@(posedge clk);
		@(posedge clk);
		@(posedge clk);
		load <= 0;
		data <= 4'hx;
		errored = 0;
		blinker_cycle = 0;
		repeat(100) @(posedge clk) begin
			blinker_cycle++;
			if (!tb_match) begin
				if (!errored) begin
					errored = 1;
					$display("Hint: The second test case is a glider (initial state = 256'h000200010007). First mismatch occurred at cycle %0d.\nHint:", blinker_cycle);
				end
			end
			
			if (errored && blinker_cycle < 20) begin
				$display ("Hint: Cycle %0d:         Your game state       Reference game state", blinker_cycle);
				for (int i=15;i>=0;i--) begin
					$display("Hint:   q[%3d:%3d]     %016b      %016b", i*16+15, i*16, q_dut [ i*16 +: 16 ], q_ref[ i*16 +: 16 ]);
				end
				$display("Hint:\nHint:\n");
			end
		end


		data <= 48'h0040001000ce;			// Acorn
		load <= 1;
		@(posedge clk);
		load <= 0;
		repeat(2000) @(posedge clk);

		
		data <= {$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)};		// Some random test cases.
		load <= 1;
		@(posedge clk);
		load <= 0;
		repeat(200) @(posedge clk);

		data <= {$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)}&		// Random with more zeros.
				{$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)}&
				{$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)}&
				{$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)};
		load <= 1;
		@(posedge clk);
		load <= 0;
		repeat(200) @(posedge clk);


		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input load,
  input [255:0] data,
  output reg [255:0] q
);

  logic [323:0] q_pad;
  always@(*) begin
    for (int i=0;i<16;i++)
      q_pad[18*(i+1)+1 +: 16] = q[16*i +: 16];
    q_pad[1 +: 16] = q[16*15 +: 16];
    q_pad[18*17+1 +: 16] = q[0 +: 16];

    for (int i=0; i<18; i++) begin
      q_pad[i*18] = q_pad[i*18+16];
      q_pad[i*18+17] = q_pad[i*18+1];
    end
  end

  always @(posedge clk) begin
    for (int i=0;i<16;i++)
    for (int j=0;j<16;j++) begin
      q[i*16+j] <=
        ((q_pad[(i+1)*18+j+1 -1+18] + q_pad[(i+1)*18+j+1 +18] + q_pad[(i+1)*18+j+1 +1+18] +
        q_pad[(i+1)*18+j+1 -1]                                + q_pad[(i+1)*18+j+1+1] +
        q_pad[(i+1)*18+j+1 -1-18]   + q_pad[(i+1)*18+j+1 -18] + q_pad[(i+1)*18+j+1 +1-18]) & 3'h7 | q[i*16+j]) == 3'h3;
    end

    if (load)
      q <= data;

  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;
wire [255:0] raw_data; wire [255:0] drive_data; assign #0.1 drive_data=raw_data;
wire [255:0] gold_q, dut_q, raw_dut_q; reg [255:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.tb_match(1'b1),.q_ref(gold_q),.q_dut(gold_q),.load(raw_load),.data(raw_data));
oracle_RefModule gold(.clk(clk),.load(drive_load),.data(drive_data),.q(gold_q));
TopModule dut(.clk(clk),.load(drive_load),.data(drive_data),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<256;b=b+1) begin
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
