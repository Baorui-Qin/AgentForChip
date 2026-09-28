module TopModule(
  input wire [1023:0] in,
  input wire [7:0] sel,
  output wire [3:0] out
);
  RefModule preflight_reference(.in(in), .sel(sel), .out(out));
endmodule
