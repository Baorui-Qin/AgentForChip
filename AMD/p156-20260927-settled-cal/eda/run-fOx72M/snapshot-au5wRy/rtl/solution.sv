
module CalibrationReference (
  input clk,
  input load,
  input [511:0] data,
  output reg [511:0] q
);

  always @(posedge clk) begin
    if (load)
      q <= data;
    else begin
      q <= q[$bits(q)-1:1] ^ {q[$bits(q)-2:0], 1'b0} ;
    end
  end

endmodule


module TopModule(input wire clk,input wire load,input wire [511:0] data,output wire [511:0] q);
wire [511:0] cal_q;
CalibrationReference control(.clk(clk),.load(load),.data(data),.q(cal_q));
assign q=~cal_q;
endmodule
