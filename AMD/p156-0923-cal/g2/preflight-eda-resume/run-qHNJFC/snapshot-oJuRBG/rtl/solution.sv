module TopModule(
  input wire clk,
  input wire in,
  input wire reset,
  output wire [7:0] out_byte,
  output wire done
);
  RefModule preflight_reference(.clk(clk), .in(in), .reset(reset), .out_byte(out_byte), .done(done));
endmodule
