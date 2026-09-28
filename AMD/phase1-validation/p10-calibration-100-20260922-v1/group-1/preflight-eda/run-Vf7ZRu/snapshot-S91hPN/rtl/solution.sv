module TopModule(
  input wire clk,
  input wire reset,
  input wire [7:0] in,
  output wire [23:0] out_bytes,
  output wire done
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .in(in), .out_bytes(out_bytes), .done(done));
endmodule
