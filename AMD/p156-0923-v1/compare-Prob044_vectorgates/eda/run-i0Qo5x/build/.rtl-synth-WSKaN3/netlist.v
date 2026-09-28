// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 04:07:57 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob044_vectorgates/eda/run-i0Qo5x/build/.rtl-synth-WSKaN3/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (a,
    b,
    out_or_bitwise,
    out_or_logical,
    out_not);
  input [2:0]a;
  input [2:0]b;
  output [2:0]out_or_bitwise;
  output out_or_logical;
  output [5:0]out_not;

  wire [2:0]a;
  wire [2:0]a_IBUF;
  wire [2:0]b;
  wire [2:0]b_IBUF;
  wire [5:0]out_not;
  wire [5:0]out_not_OBUF;
  wire [2:0]out_or_bitwise;
  wire [2:0]out_or_bitwise_OBUF;
  wire out_or_logical;
  wire out_or_logical_OBUF;

  IBUF \a_IBUF[0]_inst 
       (.I(a[0]),
        .O(a_IBUF[0]));
  IBUF \a_IBUF[1]_inst 
       (.I(a[1]),
        .O(a_IBUF[1]));
  IBUF \a_IBUF[2]_inst 
       (.I(a[2]),
        .O(a_IBUF[2]));
  IBUF \b_IBUF[0]_inst 
       (.I(b[0]),
        .O(b_IBUF[0]));
  IBUF \b_IBUF[1]_inst 
       (.I(b[1]),
        .O(b_IBUF[1]));
  IBUF \b_IBUF[2]_inst 
       (.I(b[2]),
        .O(b_IBUF[2]));
  OBUF \out_not_OBUF[0]_inst 
       (.I(out_not_OBUF[0]),
        .O(out_not[0]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT1 #(
    .INIT(2'h1)) 
    \out_not_OBUF[0]_inst_i_1 
       (.I0(a_IBUF[0]),
        .O(out_not_OBUF[0]));
  OBUF \out_not_OBUF[1]_inst 
       (.I(out_not_OBUF[1]),
        .O(out_not[1]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT1 #(
    .INIT(2'h1)) 
    \out_not_OBUF[1]_inst_i_1 
       (.I0(a_IBUF[1]),
        .O(out_not_OBUF[1]));
  OBUF \out_not_OBUF[2]_inst 
       (.I(out_not_OBUF[2]),
        .O(out_not[2]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT1 #(
    .INIT(2'h1)) 
    \out_not_OBUF[2]_inst_i_1 
       (.I0(a_IBUF[2]),
        .O(out_not_OBUF[2]));
  OBUF \out_not_OBUF[3]_inst 
       (.I(out_not_OBUF[3]),
        .O(out_not[3]));
  LUT1 #(
    .INIT(2'h1)) 
    \out_not_OBUF[3]_inst_i_1 
       (.I0(b_IBUF[0]),
        .O(out_not_OBUF[3]));
  OBUF \out_not_OBUF[4]_inst 
       (.I(out_not_OBUF[4]),
        .O(out_not[4]));
  LUT1 #(
    .INIT(2'h1)) 
    \out_not_OBUF[4]_inst_i_1 
       (.I0(b_IBUF[1]),
        .O(out_not_OBUF[4]));
  OBUF \out_not_OBUF[5]_inst 
       (.I(out_not_OBUF[5]),
        .O(out_not[5]));
  LUT1 #(
    .INIT(2'h1)) 
    \out_not_OBUF[5]_inst_i_1 
       (.I0(b_IBUF[2]),
        .O(out_not_OBUF[5]));
  OBUF \out_or_bitwise_OBUF[0]_inst 
       (.I(out_or_bitwise_OBUF[0]),
        .O(out_or_bitwise[0]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'hE)) 
    \out_or_bitwise_OBUF[0]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(b_IBUF[0]),
        .O(out_or_bitwise_OBUF[0]));
  OBUF \out_or_bitwise_OBUF[1]_inst 
       (.I(out_or_bitwise_OBUF[1]),
        .O(out_or_bitwise[1]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'hE)) 
    \out_or_bitwise_OBUF[1]_inst_i_1 
       (.I0(a_IBUF[1]),
        .I1(b_IBUF[1]),
        .O(out_or_bitwise_OBUF[1]));
  OBUF \out_or_bitwise_OBUF[2]_inst 
       (.I(out_or_bitwise_OBUF[2]),
        .O(out_or_bitwise[2]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'hE)) 
    \out_or_bitwise_OBUF[2]_inst_i_1 
       (.I0(a_IBUF[2]),
        .I1(b_IBUF[2]),
        .O(out_or_bitwise_OBUF[2]));
  OBUF out_or_logical_OBUF_inst
       (.I(out_or_logical_OBUF),
        .O(out_or_logical));
  LUT6 #(
    .INIT(64'hFFFFFFFFFFFFFFFE)) 
    out_or_logical_OBUF_inst_i_1
       (.I0(a_IBUF[2]),
        .I1(a_IBUF[0]),
        .I2(a_IBUF[1]),
        .I3(b_IBUF[2]),
        .I4(b_IBUF[0]),
        .I5(b_IBUF[1]),
        .O(out_or_logical_OBUF));
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
