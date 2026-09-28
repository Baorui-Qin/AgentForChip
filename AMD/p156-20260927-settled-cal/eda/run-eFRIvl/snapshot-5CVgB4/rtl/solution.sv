
module CalibrationReference (
  input [2:0] sel,
  input [3:0] data0,
  input [3:0] data1,
  input [3:0] data2,
  input [3:0] data3,
  input [3:0] data4,
  input [3:0] data5,
  output reg [3:0] out
);

  always @(*) begin
    case (sel)
      3'h0: out = data0;
      3'h1: out = data1;
      3'h2: out = data2;
      3'h3: out = data3;
      3'h4: out = data4;
      3'h5: out = data5;
      default: out = 4'b0;
    endcase
  end

endmodule


module TopModule(input wire [2:0] sel,input wire [3:0] data0,input wire [3:0] data1,input wire [3:0] data2,input wire [3:0] data3,input wire [3:0] data4,input wire [3:0] data5,output wire [3:0] out);
wire [3:0] cal_out;
CalibrationReference control(.sel(sel),.data0(data0),.data1(data1),.data2(data2),.data3(data3),.data4(data4),.data5(data5),.out(cal_out));
assign out=~cal_out;
endmodule
