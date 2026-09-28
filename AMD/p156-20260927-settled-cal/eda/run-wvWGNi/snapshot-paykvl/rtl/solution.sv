
module CalibrationReference (
  input [1:0] A,
  input [1:0] B,
  output z
);

  assign z = A[1:0]==B[1:0];

endmodule


module TopModule(input wire [1:0] A,input wire [1:0] B,output wire z);
wire cal_z;
CalibrationReference control(.A(A),.B(B),.z(cal_z));
assign z=~cal_z;
endmodule
