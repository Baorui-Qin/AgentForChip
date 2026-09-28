`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13
`default_nettype none


module stimulus_gen (
	input wire clk,
	output reg reset,
	output reg data, 
	output reg ack,
	input wire tb_match,
	input wire counting_dut
);
	bit failed = 0;
	int counting_cycles = 0;
	
	always @(posedge clk, negedge clk)
		if (!tb_match) 
			failed <= 1;
			
	always @(posedge clk)
		if (counting_dut)
			counting_cycles++;
	
	initial begin #101;

		@(posedge clk);
		failed <= 0;
		reset <= 1;
		data <= 0;
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
		@(posedge clk) data <= 0;
		@(posedge clk) data <= 0;
		@(posedge clk) data <= 0;
		@(posedge clk) data <= 1;
		@(posedge clk);
			data <= 1'bx;
		repeat(2000) @(posedge clk);
			ack <= 1'b0;
		repeat(3) @(posedge clk);
			ack <= 1'b1;
		@(posedge clk);
			ack <= 1'b0;
			data <= 1'b1;
		if (counting_cycles != 2000)
			$display("Hint: The first test case should count for 2000 cycles. Your circuit counted %0d", counting_cycles);
		counting_cycles <= 0;
		@(posedge clk);
			ack <= 1'bx;
			data <= 1'b1;
		@(posedge clk);
			data <= 1'b0;
		@(posedge clk);
			data <= 1'b1;
		@(posedge clk);	data <= 1'b1;
		@(posedge clk);	data <= 1'b1;
		@(posedge clk);	data <= 1'b1;
		@(posedge clk);	data <= 1'b0;
		repeat(14800) @(posedge clk);
		ack <= 1'b0;
		repeat(400) @(posedge clk);

		if (counting_cycles != 15000)
			$display("Hint: The second test case should count for 15000 cycles. Your circuit counted %0d", counting_cycles);
		counting_cycles <= 0;

		if (failed)
			$display("Hint: Your FSM didn't pass the sample timing diagram posted with the problem statement. Perhaps try debugging that?");
		
		
	
		repeat(1000) @(posedge clk, negedge clk) begin
			reset <= !($random & 8191);
			data <= $random;
			ack <= !($random & 31);
		end
		repeat(100000) @(posedge clk) begin
			reset <= !($random & 8191);
			data <= $random;
			ack <= !($random & 31);
		end

		#1 $finish;
	end
	
endmodule

`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input wire clk,
  input wire reset,
  input wire data,
  output wire [3:0] count,
  output reg counting,
  output reg done,
  input wire ack
);

  typedef enum logic[3:0] {
    S, S1, S11, S110, B0, B1, B2, B3, Count, Wait
  } States;

  States state, next;

  reg shift_ena;
  reg [9:0] fcount;
  reg [3:0] scount;
  wire done_counting = (scount == 0) && (fcount == 999);

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

  // Shift register
  always @(posedge clk) begin
    if (shift_ena)
      scount <= {scount[2:0], data};
    else if (counting && fcount == 999)
      scount <= scount - 1'b1;
  end

  // Fast counter
  always @(posedge clk)
    if (!counting)
      fcount <= 10'h0;
    else if (fcount == 999)
      fcount <= 10'h0;
    else
      fcount <= fcount + 1'b1;

  assign count = counting ? scount : 'x;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire raw_data; wire drive_data; assign #0.1 drive_data=raw_data;
wire raw_ack; wire drive_ack; assign #0.1 drive_ack=raw_ack;
wire [3:0] gold_count, dut_count, raw_dut_count; reg [3:0] seen_count='0;
wire gold_counting, dut_counting, raw_dut_counting; reg seen_counting='0;
wire gold_done, dut_done, raw_dut_done; reg seen_done='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset),.data(raw_data),.ack(raw_ack),.tb_match(1'b1),.counting_dut(gold_counting));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.data(drive_data),.count(gold_count),.counting(gold_counting),.done(gold_done),.ack(drive_ack));
TopModule dut(.clk(clk),.reset(drive_reset),.data(drive_data),.count(raw_dut_count),.counting(raw_dut_counting),.done(raw_dut_done),.ack(drive_ack));
assign dut_count=raw_dut_count;
assign dut_counting=raw_dut_counting;
assign dut_done=raw_dut_done;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<4;b=b+1) begin
if(gold_count[b] === 1'b0 || gold_count[b] === 1'b1) begin
known=1; seen_count[b]=1'b1;
if(dut_count[b] !== gold_count[b]) bad=1;
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
always @(posedge clk, negedge clk) if(started) begin #0.2; sample(); #4.6; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_count) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:count");
if((&seen_counting) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:counting");
if((&seen_done) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:done");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
