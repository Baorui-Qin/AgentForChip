// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Mon Sep 21 14:37:51 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob130_circuit5/eda/run-suWgVG/build/.rtl-synth-Z1Z9i4/netlist.v
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
    c,
    d,
    e,
    q);
  input [3:0]a;
  input [3:0]b;
  input [3:0]c;
  input [3:0]d;
  input [3:0]e;
  output [3:0]q;

  wire [3:0]a;
  wire [3:0]a_IBUF;
  wire [3:0]b;
  wire [3:0]b_IBUF;
  wire [3:0]c;
  wire [3:0]c_IBUF;
  wire [3:0]d;
  wire [3:0]d_IBUF;
  wire [3:0]e;
  wire [3:0]e_IBUF;
  wire [3:0]q;
  wire [3:0]q_OBUF;
  wire \q_OBUF[0]_inst_i_2_n_0 ;
  wire \q_OBUF[1]_inst_i_2_n_0 ;
  wire \q_OBUF[2]_inst_i_2_n_0 ;
  wire \q_OBUF[3]_inst_i_2_n_0 ;

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
  IBUF \c_IBUF[0]_inst 
       (.I(c[0]),
        .O(c_IBUF[0]));
  IBUF \c_IBUF[1]_inst 
       (.I(c[1]),
        .O(c_IBUF[1]));
  IBUF \c_IBUF[2]_inst 
       (.I(c[2]),
        .O(c_IBUF[2]));
  IBUF \c_IBUF[3]_inst 
       (.I(c[3]),
        .O(c_IBUF[3]));
  IBUF \d_IBUF[0]_inst 
       (.I(d[0]),
        .O(d_IBUF[0]));
  IBUF \d_IBUF[1]_inst 
       (.I(d[1]),
        .O(d_IBUF[1]));
  IBUF \d_IBUF[2]_inst 
       (.I(d[2]),
        .O(d_IBUF[2]));
  IBUF \d_IBUF[3]_inst 
       (.I(d[3]),
        .O(d_IBUF[3]));
  IBUF \e_IBUF[0]_inst 
       (.I(e[0]),
        .O(e_IBUF[0]));
  IBUF \e_IBUF[1]_inst 
       (.I(e[1]),
        .O(e_IBUF[1]));
  IBUF \e_IBUF[2]_inst 
       (.I(e[2]),
        .O(e_IBUF[2]));
  IBUF \e_IBUF[3]_inst 
       (.I(e[3]),
        .O(e_IBUF[3]));
  OBUF \q_OBUF[0]_inst 
       (.I(q_OBUF[0]),
        .O(q[0]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hFE)) 
    \q_OBUF[0]_inst_i_1 
       (.I0(\q_OBUF[0]_inst_i_2_n_0 ),
        .I1(c_IBUF[2]),
        .I2(c_IBUF[3]),
        .O(q_OBUF[0]));
  LUT6 #(
    .INIT(64'hF0AAFFCCF0AA00CC)) 
    \q_OBUF[0]_inst_i_2 
       (.I0(e_IBUF[0]),
        .I1(b_IBUF[0]),
        .I2(d_IBUF[0]),
        .I3(c_IBUF[1]),
        .I4(c_IBUF[0]),
        .I5(a_IBUF[0]),
        .O(\q_OBUF[0]_inst_i_2_n_0 ));
  OBUF \q_OBUF[1]_inst 
       (.I(q_OBUF[1]),
        .O(q[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hFE)) 
    \q_OBUF[1]_inst_i_1 
       (.I0(\q_OBUF[1]_inst_i_2_n_0 ),
        .I1(c_IBUF[2]),
        .I2(c_IBUF[3]),
        .O(q_OBUF[1]));
  LUT6 #(
    .INIT(64'hF0AAFFCCF0AA00CC)) 
    \q_OBUF[1]_inst_i_2 
       (.I0(e_IBUF[1]),
        .I1(b_IBUF[1]),
        .I2(d_IBUF[1]),
        .I3(c_IBUF[1]),
        .I4(c_IBUF[0]),
        .I5(a_IBUF[1]),
        .O(\q_OBUF[1]_inst_i_2_n_0 ));
  OBUF \q_OBUF[2]_inst 
       (.I(q_OBUF[2]),
        .O(q[2]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hFE)) 
    \q_OBUF[2]_inst_i_1 
       (.I0(\q_OBUF[2]_inst_i_2_n_0 ),
        .I1(c_IBUF[2]),
        .I2(c_IBUF[3]),
        .O(q_OBUF[2]));
  LUT6 #(
    .INIT(64'hF0AAFFCCF0AA00CC)) 
    \q_OBUF[2]_inst_i_2 
       (.I0(e_IBUF[2]),
        .I1(b_IBUF[2]),
        .I2(d_IBUF[2]),
        .I3(c_IBUF[1]),
        .I4(c_IBUF[0]),
        .I5(a_IBUF[2]),
        .O(\q_OBUF[2]_inst_i_2_n_0 ));
  OBUF \q_OBUF[3]_inst 
       (.I(q_OBUF[3]),
        .O(q[3]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hFE)) 
    \q_OBUF[3]_inst_i_1 
       (.I0(\q_OBUF[3]_inst_i_2_n_0 ),
        .I1(c_IBUF[2]),
        .I2(c_IBUF[3]),
        .O(q_OBUF[3]));
  LUT6 #(
    .INIT(64'hF0AAFFCCF0AA00CC)) 
    \q_OBUF[3]_inst_i_2 
       (.I0(e_IBUF[3]),
        .I1(b_IBUF[3]),
        .I2(d_IBUF[3]),
        .I3(c_IBUF[1]),
        .I4(c_IBUF[0]),
        .I5(a_IBUF[3]),
        .O(\q_OBUF[3]_inst_i_2_n_0 ));
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
