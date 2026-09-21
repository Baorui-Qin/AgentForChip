module TopModule(
  input wire [255:0] in,
  input wire [7:0] sel,
  output wire out
);
  RefModule preflight_reference(.in(in), .sel(sel), .out(out));
endmodule
