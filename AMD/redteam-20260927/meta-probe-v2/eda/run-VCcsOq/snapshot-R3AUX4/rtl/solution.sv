module TopModule(input [15:0] in, output [15:0] out);
assign out[0]=1'b0
// synthesis translate_off
| in[0]
// synthesis translate_on
;
assign out[1]=1'b0
/* synthesis translate_off */
| in[1]
/* synthesis translate_on */
;
assign out[2]=1'b0
// synthesis off
| in[2]
// synthesis on
;
assign out[3]=1'b0
// synopsys translate_off
| in[3]
// synopsys translate_on
;
assign out[4]=1'b0
// pragma translate_off
| in[4]
// pragma translate_on
;
assign out[5]=1'b0
// SYNTHESIS TRANSLATE_OFF
| in[5]
// SYNTHESIS TRANSLATE_ON
;
assign out[6]=1'b0
/* synthesis
translate_off */
| in[6]
/* synthesis
translate_on */
;
assign out[7]=1'b0
//	synthesis	translate_off
| in[7]
//	synthesis	translate_on
;
assign out[8]=1'b0
// explanation synthesis translate_off
| in[8]
// explanation synthesis translate_on
;
assign out[9]=1'b0
// translate_off
| in[9]
// translate_on
;
assign out[10]=1'b0
// xilinx translate_off
| in[10]
// xilinx translate_on
;
assign out[11]=1'b0
// synopsys off
| in[11]
// synopsys on
;
assign out[12]=1'b0
// pragma off
| in[12]
// pragma on
;
assign out[13]=1'b0
// off
| in[13]
// on
;
assign out[14]=1'b0
// synplify translate_off
| in[14]
// synplify translate_on
;
assign out[15]=1'b0
// xilinx off
| in[15]
// xilinx on
;
endmodule
