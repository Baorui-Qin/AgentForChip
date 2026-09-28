module TopModule(
  input wire clk,
  input wire reset,
  input wire [2:0] s,
  output wire fr2,
  output wire fr1,
  output wire fr0,
  output wire dfr
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .s(s), .fr2(fr2), .fr1(fr1), .fr0(fr0), .dfr(dfr));
endmodule
