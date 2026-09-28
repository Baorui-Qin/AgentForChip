// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 23:20:49 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob106_always_nolatches/eda/run-3tE0wd/build/.rtl-synth-umaZVh/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (scancode,
    left,
    down,
    right,
    up);
  input [15:0]scancode;
  output left;
  output down;
  output right;
  output up;

  wire down;
  wire down_OBUF;
  wire down_OBUF_inst_i_2_n_0;
  wire left;
  wire left_OBUF;
  wire left_OBUF_inst_i_2_n_0;
  wire left_OBUF_inst_i_3_n_0;
  wire left_OBUF_inst_i_4_n_0;
  wire right;
  wire right_OBUF;
  wire right_OBUF_inst_i_2_n_0;
  wire [15:0]scancode;
  wire [15:0]scancode_IBUF;
  wire up;
  wire up_OBUF;
  wire up_OBUF_inst_i_2_n_0;

  OBUF down_OBUF_inst
       (.I(down_OBUF),
        .O(down));
  LUT6 #(
    .INIT(64'h0200000000000000)) 
    down_OBUF_inst_i_1
       (.I0(down_OBUF_inst_i_2_n_0),
        .I1(left_OBUF_inst_i_3_n_0),
        .I2(left_OBUF_inst_i_4_n_0),
        .I3(scancode_IBUF[13]),
        .I4(scancode_IBUF[14]),
        .I5(scancode_IBUF[15]),
        .O(down_OBUF));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h00000020)) 
    down_OBUF_inst_i_2
       (.I0(scancode_IBUF[1]),
        .I1(scancode_IBUF[2]),
        .I2(scancode_IBUF[4]),
        .I3(scancode_IBUF[3]),
        .I4(scancode_IBUF[0]),
        .O(down_OBUF_inst_i_2_n_0));
  OBUF left_OBUF_inst
       (.I(left_OBUF),
        .O(left));
  LUT6 #(
    .INIT(64'h0200000000000000)) 
    left_OBUF_inst_i_1
       (.I0(left_OBUF_inst_i_2_n_0),
        .I1(left_OBUF_inst_i_3_n_0),
        .I2(left_OBUF_inst_i_4_n_0),
        .I3(scancode_IBUF[13]),
        .I4(scancode_IBUF[14]),
        .I5(scancode_IBUF[15]),
        .O(left_OBUF));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h00400000)) 
    left_OBUF_inst_i_2
       (.I0(scancode_IBUF[2]),
        .I1(scancode_IBUF[1]),
        .I2(scancode_IBUF[0]),
        .I3(scancode_IBUF[4]),
        .I4(scancode_IBUF[3]),
        .O(left_OBUF_inst_i_2_n_0));
  LUT4 #(
    .INIT(16'hFFFE)) 
    left_OBUF_inst_i_3
       (.I0(scancode_IBUF[11]),
        .I1(scancode_IBUF[12]),
        .I2(scancode_IBUF[9]),
        .I3(scancode_IBUF[10]),
        .O(left_OBUF_inst_i_3_n_0));
  LUT4 #(
    .INIT(16'hEFFF)) 
    left_OBUF_inst_i_4
       (.I0(scancode_IBUF[7]),
        .I1(scancode_IBUF[8]),
        .I2(scancode_IBUF[5]),
        .I3(scancode_IBUF[6]),
        .O(left_OBUF_inst_i_4_n_0));
  OBUF right_OBUF_inst
       (.I(right_OBUF),
        .O(right));
  LUT6 #(
    .INIT(64'h0200000000000000)) 
    right_OBUF_inst_i_1
       (.I0(right_OBUF_inst_i_2_n_0),
        .I1(left_OBUF_inst_i_3_n_0),
        .I2(left_OBUF_inst_i_4_n_0),
        .I3(scancode_IBUF[13]),
        .I4(scancode_IBUF[14]),
        .I5(scancode_IBUF[15]),
        .O(right_OBUF));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'h00000020)) 
    right_OBUF_inst_i_2
       (.I0(scancode_IBUF[2]),
        .I1(scancode_IBUF[0]),
        .I2(scancode_IBUF[4]),
        .I3(scancode_IBUF[3]),
        .I4(scancode_IBUF[1]),
        .O(right_OBUF_inst_i_2_n_0));
  IBUF \scancode_IBUF[0]_inst 
       (.I(scancode[0]),
        .O(scancode_IBUF[0]));
  IBUF \scancode_IBUF[10]_inst 
       (.I(scancode[10]),
        .O(scancode_IBUF[10]));
  IBUF \scancode_IBUF[11]_inst 
       (.I(scancode[11]),
        .O(scancode_IBUF[11]));
  IBUF \scancode_IBUF[12]_inst 
       (.I(scancode[12]),
        .O(scancode_IBUF[12]));
  IBUF \scancode_IBUF[13]_inst 
       (.I(scancode[13]),
        .O(scancode_IBUF[13]));
  IBUF \scancode_IBUF[14]_inst 
       (.I(scancode[14]),
        .O(scancode_IBUF[14]));
  IBUF \scancode_IBUF[15]_inst 
       (.I(scancode[15]),
        .O(scancode_IBUF[15]));
  IBUF \scancode_IBUF[1]_inst 
       (.I(scancode[1]),
        .O(scancode_IBUF[1]));
  IBUF \scancode_IBUF[2]_inst 
       (.I(scancode[2]),
        .O(scancode_IBUF[2]));
  IBUF \scancode_IBUF[3]_inst 
       (.I(scancode[3]),
        .O(scancode_IBUF[3]));
  IBUF \scancode_IBUF[4]_inst 
       (.I(scancode[4]),
        .O(scancode_IBUF[4]));
  IBUF \scancode_IBUF[5]_inst 
       (.I(scancode[5]),
        .O(scancode_IBUF[5]));
  IBUF \scancode_IBUF[6]_inst 
       (.I(scancode[6]),
        .O(scancode_IBUF[6]));
  IBUF \scancode_IBUF[7]_inst 
       (.I(scancode[7]),
        .O(scancode_IBUF[7]));
  IBUF \scancode_IBUF[8]_inst 
       (.I(scancode[8]),
        .O(scancode_IBUF[8]));
  IBUF \scancode_IBUF[9]_inst 
       (.I(scancode[9]),
        .O(scancode_IBUF[9]));
  OBUF up_OBUF_inst
       (.I(up_OBUF),
        .O(up));
  LUT6 #(
    .INIT(64'h0200000000000000)) 
    up_OBUF_inst_i_1
       (.I0(up_OBUF_inst_i_2_n_0),
        .I1(left_OBUF_inst_i_3_n_0),
        .I2(left_OBUF_inst_i_4_n_0),
        .I3(scancode_IBUF[13]),
        .I4(scancode_IBUF[14]),
        .I5(scancode_IBUF[15]),
        .O(up_OBUF));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'h00400000)) 
    up_OBUF_inst_i_2
       (.I0(scancode_IBUF[3]),
        .I1(scancode_IBUF[2]),
        .I2(scancode_IBUF[0]),
        .I3(scancode_IBUF[1]),
        .I4(scancode_IBUF[4]),
        .O(up_OBUF_inst_i_2_n_0));
endmodule
`ifndef GLBL
`define GLBL
`timescale  1 ps / 1 ps

module glbl ();

    parameter ROC_WIDTH = 100000;
    parameter TOC_WIDTH = 0;
    parameter GRES_WIDTH = 10000;
    parameter GRES_START = 10000;

//--------   STARTUP Globals --------------
    wire GSR;
    wire GTS;
    wire GWE;
    wire PRLD;
    wire GRESTORE;
    tri1 p_up_tmp;
    tri (weak1, strong0) PLL_LOCKG = p_up_tmp;

    wire PROGB_GLBL;
    wire CCLKO_GLBL;
    wire FCSBO_GLBL;
    wire [3:0] DO_GLBL;
    wire [3:0] DI_GLBL;
   
    reg GSR_int;
    reg GTS_int;
    reg PRLD_int;
    reg GRESTORE_int;

//--------   JTAG Globals --------------
    wire JTAG_TDO_GLBL;
    wire JTAG_TCK_GLBL;
    wire JTAG_TDI_GLBL;
    wire JTAG_TMS_GLBL;
    wire JTAG_TRST_GLBL;

    reg JTAG_CAPTURE_GLBL;
    reg JTAG_RESET_GLBL;
    reg JTAG_SHIFT_GLBL;
    reg JTAG_UPDATE_GLBL;
    reg JTAG_RUNTEST_GLBL;

    reg JTAG_SEL1_GLBL = 0;
    reg JTAG_SEL2_GLBL = 0 ;
    reg JTAG_SEL3_GLBL = 0;
    reg JTAG_SEL4_GLBL = 0;

    reg JTAG_USER_TDO1_GLBL = 1'bz;
    reg JTAG_USER_TDO2_GLBL = 1'bz;
    reg JTAG_USER_TDO3_GLBL = 1'bz;
    reg JTAG_USER_TDO4_GLBL = 1'bz;

    assign (strong1, weak0) GSR = GSR_int;
    assign (strong1, weak0) GTS = GTS_int;
    assign (weak1, weak0) PRLD = PRLD_int;
    assign (strong1, weak0) GRESTORE = GRESTORE_int;

    initial begin
	GSR_int = 1'b1;
	PRLD_int = 1'b1;
	#(ROC_WIDTH)
	GSR_int = 1'b0;
	PRLD_int = 1'b0;
    end

    initial begin
	GTS_int = 1'b1;
	#(TOC_WIDTH)
	GTS_int = 1'b0;
    end

    initial begin 
	GRESTORE_int = 1'b0;
	#(GRES_START);
	GRESTORE_int = 1'b1;
	#(GRES_WIDTH);
	GRESTORE_int = 1'b0;
    end

endmodule
`endif
