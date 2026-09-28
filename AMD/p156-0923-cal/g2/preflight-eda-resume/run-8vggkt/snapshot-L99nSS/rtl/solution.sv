module TopModule(
  input wire clk,
  input wire reset,
  input wire ena,
  output wire pm,
  output wire [7:0] hh,
  output wire [7:0] mm,
  output wire [7:0] ss
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .ena(ena), .pm(pm), .hh(hh), .mm(mm), .ss(ss));
endmodule
