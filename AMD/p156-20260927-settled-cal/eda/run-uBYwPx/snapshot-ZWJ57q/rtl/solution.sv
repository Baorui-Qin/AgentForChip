
module CalibrationReference (
  input clk,
  input j,
  input k,
  input areset,
  output out
);

  parameter A=0, B=1;
  reg state;
  reg next;

    always_comb begin
    case (state)
      A: next = j ? B : A;
      B: next = k ? A : B;
    endcase
    end

    always @(posedge clk, posedge areset) begin
    if (areset) state <= A;
        else state <= next;
  end

  assign out = (state==B);

endmodule


module TopModule(input wire clk,input wire areset,input wire j,input wire k,output wire out);
wire cal_out;
CalibrationReference control(.clk(clk),.areset(areset),.j(j),.k(k),.out(cal_out));
assign out=~cal_out;
endmodule
