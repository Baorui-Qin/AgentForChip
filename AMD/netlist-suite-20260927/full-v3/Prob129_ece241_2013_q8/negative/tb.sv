`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic aresetn,
	output logic x,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	input tb_match
);
integer netlist_random_seed=1;

	reg reset;
	assign aresetn = ~reset;


// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	


	task reset_test(input async=0);
		bit arfail, srfail, datafail;
	
		@(posedge clk);
		@(posedge clk) reset <= 0;
		repeat(3) @(posedge clk);
	
		@(negedge clk) begin datafail = !tb_match ; reset <= 1; end
		@(posedge clk) arfail = !tb_match;
		@(posedge clk) begin
			srfail = !tb_match;
			reset <= 0;
		end
		if (srfail)
			$display("Hint: Your reset doesn't seem to be working.");
		else if (arfail && (async || !datafail))
			$display("Hint: Your reset should be %0s, but doesn't appear to be.", async ? "asynchronous" : "synchronous");
		// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely
		// a functionality error than the reset being implemented asynchronously.
	
	endtask


	initial begin #101;
		x <= 0;
		repeat(3) @(posedge clk);
		@(posedge clk) x <= 1;
		@(posedge clk) x <= 0;
		@(posedge clk) x <= 1;
	end
	
	initial begin #101;
		reset <= 1;
		@(posedge clk) reset <= 0;
		reset_test(1);
		
		@(negedge clk) wavedrom_start();
			@(posedge clk) x <= 0;
			@(posedge clk) x <= 0;
			@(posedge clk) x <= 0;
			@(posedge clk) x <= 1;
			@(posedge clk) x <= 0;
			@(posedge clk) x <= 1;
			@(posedge clk) x <= 0;
			@(posedge clk) x <= 1;
			@(posedge clk) x <= 1;
			@(posedge clk) x <= 0;
			@(posedge clk) x <= 1;
			@(posedge clk) x <= 0;
		@(negedge clk) wavedrom_stop();

		repeat(400) @(posedge clk, negedge clk) begin
			x <= $random(netlist_random_seed);
			reset <= ($random(netlist_random_seed)&31) == 0;
		end
		
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input aresetn,
  input x,
  output reg z
);

  parameter S=0, S1=1, S10=2;
  reg[1:0] state, next;

  always@(posedge clk, negedge aresetn)
    if (!aresetn)
      state <= S;
    else
      state <= next;

  always_comb begin
    case (state)
      S: next = x ? S1 : S;
      S1: next = x ? S1 : S10;
      S10: next = x ? S1 : S;
      default: next = 'x;
    endcase
  end

  always_comb begin
    case (state)
      S: z = 0;
      S1: z = 0;
      S10: z = x;
      default: z = 'x;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_aresetn; wire drive_aresetn; assign #0.1 drive_aresetn=raw_aresetn;
wire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;
wire gold_z, dut_z, raw_dut_z; reg seen_z='0;
stimulus_gen stim1(.clk(clk),.aresetn(raw_aresetn),.x(raw_x),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.aresetn(drive_aresetn),.x(drive_x),.z(gold_z));
TopModule dut(.clk(clk),.aresetn(drive_aresetn),.x(drive_x),.z(raw_dut_z));
assign dut_z=~raw_dut_z;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_z === 1'b0 || gold_z === 1'b1) begin
known=1; seen_z=1'b1;
if(dut_z !== gold_z) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_z) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:z");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
