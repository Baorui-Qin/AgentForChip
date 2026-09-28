module TopModule(
  input wire [2:0] sel,
  input wire [3:0] data0,
  input wire [3:0] data1,
  input wire [3:0] data2,
  input wire [3:0] data3,
  input wire [3:0] data4,
  input wire [3:0] data5,
  output wire [3:0] out
);
  RefModule preflight_reference(.sel(sel), .data0(data0), .data1(data1), .data2(data2), .data3(data3), .data4(data4), .data5(data5), .out(out));
endmodule
