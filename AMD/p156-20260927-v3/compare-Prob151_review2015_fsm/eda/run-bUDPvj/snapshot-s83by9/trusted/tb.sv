`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg reset,
	output reg data, done_counting, ack,
	input tb_match
);
integer netlist_random_seed=1;

	bit failed = 0;
	
	always @(posedge clk, negedge clk)
		if (!tb_match) 
			failed <= 1;
	
	initial begin #101;

		@(posedge clk);
		failed <= 0;
		reset <= 1;
		data <= 0;
		done_counting <= 1'bx;
		ack <= 1'bx;
		@(posedge clk) 
			data <= 1;
			reset <= 0;
		@(posedge clk) data <= 0;
		@(posedge clk) data <= 0;
		@(posedge clk) data <= 1;
		@(posedge clk) data <= 1;
		@(posedge clk) data <= 0;
		@(posedge clk) data <= 1;
		@(posedge clk);
			data <= 1'bx;
		repeat(4) @(posedge clk);
			done_counting <= 1'b0;
		repeat(4) @(posedge clk);
			done_counting <= 1'b1;
		@(posedge clk);
			done_counting <= 1'bx;
			ack <= 1'b0;
		repeat(3) @(posedge clk);
			ack <= 1'b1;
		@(posedge clk);
			ack <= 1'b0;
			data <= 1'b1;
		@(posedge clk);
			ack <= 1'bx;
			data <= 1'b1;
		@(posedge clk);
			data <= 1'b0;
		@(posedge clk);
			data <= 1'b1;
		@(posedge clk);
			data <= 1'bx;
		repeat(4) @(posedge clk);
			done_counting <= 1'b0;
		repeat(4) @(posedge clk);
			done_counting <= 1'b1;
		@(posedge clk);

		if (failed)
			$display("Hint: Your FSM didn't pass the sample timing diagram posted with the problem statement. Perhaps try debugging that?");
		
		
	
		repeat(5000) @(posedge clk, negedge clk) begin
			reset <= !($random(netlist_random_seed) & 255);
			data <= $random(netlist_random_seed);
			done_counting <= !($random(netlist_random_seed) & 31);
			ack <= !($random(netlist_random_seed) & 31);
		end

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  input data,
  output reg shift_ena,
  output reg counting,
  input done_counting,
  output reg done,
  input ack
);

  typedef enum logic[3:0] {
    S, S1, S11, S110, B0, B1, B2, B3, Count, Wait
  } States;

  States state, next;

  always_comb begin
    case (state)
      S: next = States'(data ? S1: S);
      S1: next = States'(data ? S11: S);
      S11: next = States'(data ? S11 : S110);
      S110: next = States'(data ? B0 : S);
      B0: next = B1;
      B1: next = B2;
      B2: next = B3;
      B3: next = Count;
      Count: next = States'(done_counting ? Wait : Count);
      Wait: next = States'(ack ? S : Wait);
      default: next = States'(4'bx);
    endcase
  end

  always @(posedge clk) begin
    if (reset) state <= S;
    else state <= next;
  end

  always_comb begin
    shift_ena = 0; counting = 0; done = 0;
    if (state == B0 || state == B1 || state == B2 || state == B3)
      shift_ena = 1;
    if (state == Count)
      counting = 1;
    if (state == Wait)
      done = 1;

    if (|state === 1'bx) begin
      {shift_ena, counting, done} = 'x;
    end

  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire raw_data; wire drive_data; assign #0.1 drive_data=raw_data;
wire raw_done_counting; wire drive_done_counting; assign #0.1 drive_done_counting=raw_done_counting;
wire raw_ack; wire drive_ack; assign #0.1 drive_ack=raw_ack;
wire gold_shift_ena, dut_shift_ena, raw_dut_shift_ena; reg seen_shift_ena='0;
wire gold_counting, dut_counting, raw_dut_counting; reg seen_counting='0;
wire gold_done, dut_done, raw_dut_done; reg seen_done='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset),.data(raw_data),.done_counting(raw_done_counting),.ack(raw_ack),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.data(drive_data),.done_counting(drive_done_counting),.ack(drive_ack),.shift_ena(gold_shift_ena),.counting(gold_counting),.done(gold_done));
TopModule dut(.clk(clk),.reset(drive_reset),.data(drive_data),.done_counting(drive_done_counting),.ack(drive_ack),.shift_ena(raw_dut_shift_ena),.counting(raw_dut_counting),.done(raw_dut_done));
assign dut_shift_ena=raw_dut_shift_ena;
assign dut_counting=raw_dut_counting;
assign dut_done=raw_dut_done;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_shift_ena === 1'b0 || gold_shift_ena === 1'b1) begin
known=1; seen_shift_ena=1'b1;
if(dut_shift_ena !== gold_shift_ena) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_counting === 1'b0 || gold_counting === 1'b1) begin
known=1; seen_counting=1'b1;
if(dut_counting !== gold_counting) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_done === 1'b0 || gold_done === 1'b1) begin
known=1; seen_done=1'b1;
if(dut_done !== gold_done) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_shift_ena) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:shift_ena");
if((&seen_counting) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:counting");
if((&seen_done) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:done");
if(checks != 10133) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
