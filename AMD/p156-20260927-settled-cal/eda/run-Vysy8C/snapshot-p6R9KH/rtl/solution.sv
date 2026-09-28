
module CalibrationReference (
  input [15:0] scancode,
  output reg left,
  output reg down,
  output reg right,
  output reg up
);

  always @(*) begin
    {up, left, down, right} = 0;
    case (scancode)
      16'he06b: left = 1;
      16'he072: down = 1;
      16'he074: right = 1;
      16'he075: up = 1;
    endcase
  end

endmodule


module TopModule(input wire [15:0] scancode,output wire left,output wire down,output wire right,output wire up);
wire cal_left;
wire cal_down;
wire cal_right;
wire cal_up;
CalibrationReference control(.scancode(scancode),.left(cal_left),.down(cal_down),.right(cal_right),.up(cal_up));
assign left=~cal_left;
assign down=~cal_down;
assign right=~cal_right;
assign up=~cal_up;
endmodule
