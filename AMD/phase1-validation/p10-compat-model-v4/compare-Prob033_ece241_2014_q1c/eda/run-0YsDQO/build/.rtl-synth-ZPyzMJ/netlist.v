// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Fri Sep 18 18:17:36 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/phase1-validation/p10-compat-model-v4/compare-Prob033_ece241_2014_q1c/eda/run-0YsDQO/build/.rtl-synth-ZPyzMJ/netlist.v
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
    s,
    overflow);
  input [7:0]a;
  input [7:0]b;
  output [7:0]s;
  output overflow;

  wire [7:0]a;
  wire [7:0]a_IBUF;
  wire [7:0]b;
  wire [7:0]b_IBUF;
  wire overflow;
  wire overflow_OBUF;
  wire [7:0]s;
  wire [7:0]s_OBUF;
  wire \s_OBUF[4]_inst_i_2_n_0 ;
  wire \s_OBUF[6]_inst_i_2_n_0 ;
  wire \s_OBUF[7]_inst_i_2_n_0 ;

  IBUF \a_IBUF[0]_inst 
       (.I(a[0]),
        .O(a_IBUF[0]));
  IBUF \a_IBUF[1]_inst 
       (.I(a[1]),
        .O(a_IBUF[1]));
  IBUF \a_IBUF[2]_inst 
       (.I(a[2]),
        .O(a_IBUF[2]));
  IBUF \a_IBUF[3]_inst 
       (.I(a[3]),
        .O(a_IBUF[3]));
  IBUF \a_IBUF[4]_inst 
       (.I(a[4]),
        .O(a_IBUF[4]));
  IBUF \a_IBUF[5]_inst 
       (.I(a[5]),
        .O(a_IBUF[5]));
  IBUF \a_IBUF[6]_inst 
       (.I(a[6]),
        .O(a_IBUF[6]));
  IBUF \a_IBUF[7]_inst 
       (.I(a[7]),
        .O(a_IBUF[7]));
  IBUF \b_IBUF[0]_inst 
       (.I(b[0]),
        .O(b_IBUF[0]));
  IBUF \b_IBUF[1]_inst 
       (.I(b[1]),
        .O(b_IBUF[1]));
  IBUF \b_IBUF[2]_inst 
       (.I(b[2]),
        .O(b_IBUF[2]));
  IBUF \b_IBUF[3]_inst 
       (.I(b[3]),
        .O(b_IBUF[3]));
  IBUF \b_IBUF[4]_inst 
       (.I(b[4]),
        .O(b_IBUF[4]));
  IBUF \b_IBUF[5]_inst 
       (.I(b[5]),
        .O(b_IBUF[5]));
  IBUF \b_IBUF[6]_inst 
       (.I(b[6]),
        .O(b_IBUF[6]));
  IBUF \b_IBUF[7]_inst 
       (.I(b[7]),
        .O(b_IBUF[7]));
  OBUF overflow_OBUF_inst
       (.I(overflow_OBUF),
        .O(overflow));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h170000E8)) 
    overflow_OBUF_inst_i_1
       (.I0(\s_OBUF[7]_inst_i_2_n_0 ),
        .I1(a_IBUF[6]),
        .I2(b_IBUF[6]),
        .I3(b_IBUF[7]),
        .I4(a_IBUF[7]),
        .O(overflow_OBUF));
  OBUF \s_OBUF[0]_inst 
       (.I(s_OBUF[0]),
        .O(s[0]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \s_OBUF[0]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(b_IBUF[0]),
        .O(s_OBUF[0]));
  OBUF \s_OBUF[1]_inst 
       (.I(s_OBUF[1]),
        .O(s[1]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'h8778)) 
    \s_OBUF[1]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(b_IBUF[0]),
        .I2(b_IBUF[1]),
        .I3(a_IBUF[1]),
        .O(s_OBUF[1]));
  OBUF \s_OBUF[2]_inst 
       (.I(s_OBUF[2]),
        .O(s[2]));
  LUT6 #(
    .INIT(64'hF880077F077FF880)) 
    \s_OBUF[2]_inst_i_1 
       (.I0(b_IBUF[0]),
        .I1(a_IBUF[0]),
        .I2(a_IBUF[1]),
        .I3(b_IBUF[1]),
        .I4(b_IBUF[2]),
        .I5(a_IBUF[2]),
        .O(s_OBUF[2]));
  OBUF \s_OBUF[3]_inst 
       (.I(s_OBUF[3]),
        .O(s[3]));
  LUT3 #(
    .INIT(8'h96)) 
    \s_OBUF[3]_inst_i_1 
       (.I0(\s_OBUF[4]_inst_i_2_n_0 ),
        .I1(b_IBUF[3]),
        .I2(a_IBUF[3]),
        .O(s_OBUF[3]));
  OBUF \s_OBUF[4]_inst 
       (.I(s_OBUF[4]),
        .O(s[4]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT5 #(
    .INIT(32'hE81717E8)) 
    \s_OBUF[4]_inst_i_1 
       (.I0(\s_OBUF[4]_inst_i_2_n_0 ),
        .I1(a_IBUF[3]),
        .I2(b_IBUF[3]),
        .I3(b_IBUF[4]),
        .I4(a_IBUF[4]),
        .O(s_OBUF[4]));
  LUT6 #(
    .INIT(64'hEEEEE888E8888888)) 
    \s_OBUF[4]_inst_i_2 
       (.I0(b_IBUF[2]),
        .I1(a_IBUF[2]),
        .I2(b_IBUF[0]),
        .I3(a_IBUF[0]),
        .I4(a_IBUF[1]),
        .I5(b_IBUF[1]),
        .O(\s_OBUF[4]_inst_i_2_n_0 ));
  OBUF \s_OBUF[5]_inst 
       (.I(s_OBUF[5]),
        .O(s[5]));
  LUT3 #(
    .INIT(8'h96)) 
    \s_OBUF[5]_inst_i_1 
       (.I0(\s_OBUF[6]_inst_i_2_n_0 ),
        .I1(b_IBUF[5]),
        .I2(a_IBUF[5]),
        .O(s_OBUF[5]));
  OBUF \s_OBUF[6]_inst 
       (.I(s_OBUF[6]),
        .O(s[6]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'hE81717E8)) 
    \s_OBUF[6]_inst_i_1 
       (.I0(\s_OBUF[6]_inst_i_2_n_0 ),
        .I1(a_IBUF[5]),
        .I2(b_IBUF[5]),
        .I3(b_IBUF[6]),
        .I4(a_IBUF[6]),
        .O(s_OBUF[6]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT5 #(
    .INIT(32'hEEE8E888)) 
    \s_OBUF[6]_inst_i_2 
       (.I0(b_IBUF[4]),
        .I1(a_IBUF[4]),
        .I2(\s_OBUF[4]_inst_i_2_n_0 ),
        .I3(a_IBUF[3]),
        .I4(b_IBUF[3]),
        .O(\s_OBUF[6]_inst_i_2_n_0 ));
  OBUF \s_OBUF[7]_inst 
       (.I(s_OBUF[7]),
        .O(s[7]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hE81717E8)) 
    \s_OBUF[7]_inst_i_1 
       (.I0(\s_OBUF[7]_inst_i_2_n_0 ),
        .I1(a_IBUF[6]),
        .I2(b_IBUF[6]),
        .I3(b_IBUF[7]),
        .I4(a_IBUF[7]),
        .O(s_OBUF[7]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hE8)) 
    \s_OBUF[7]_inst_i_2 
       (.I0(b_IBUF[5]),
        .I1(a_IBUF[5]),
        .I2(\s_OBUF[6]_inst_i_2_n_0 ),
        .O(\s_OBUF[7]_inst_i_2_n_0 ));
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
