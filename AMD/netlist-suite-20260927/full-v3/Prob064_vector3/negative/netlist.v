// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 04:21:44 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob064_vector3/eda/run-dvb7aL/build/.rtl-synth-l9Tqad/netlist.v
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
    f,
    w,
    x,
    y,
    z);
  input [4:0]a;
  input [4:0]b;
  input [4:0]c;
  input [4:0]d;
  input [4:0]e;
  input [4:0]f;
  output [7:0]w;
  output [7:0]x;
  output [7:0]y;
  output [7:0]z;

  wire [4:0]a;
  wire [4:0]b;
  wire [4:0]c;
  wire [4:0]d;
  wire [4:0]e;
  wire [4:0]f;
  wire [7:0]w;
  wire [7:0]w_OBUF;
  wire [7:0]x;
  wire [7:0]x_OBUF;
  wire [7:0]y;
  wire [7:0]y_OBUF;
  wire [7:0]z;
  wire [7:2]z_OBUF;

  IBUF \a_IBUF[0]_inst 
       (.I(a[0]),
        .O(w_OBUF[3]));
  IBUF \a_IBUF[1]_inst 
       (.I(a[1]),
        .O(w_OBUF[4]));
  IBUF \a_IBUF[2]_inst 
       (.I(a[2]),
        .O(w_OBUF[5]));
  IBUF \a_IBUF[3]_inst 
       (.I(a[3]),
        .O(w_OBUF[6]));
  IBUF \a_IBUF[4]_inst 
       (.I(a[4]),
        .O(w_OBUF[7]));
  IBUF \b_IBUF[0]_inst 
       (.I(b[0]),
        .O(x_OBUF[6]));
  IBUF \b_IBUF[1]_inst 
       (.I(b[1]),
        .O(x_OBUF[7]));
  IBUF \b_IBUF[2]_inst 
       (.I(b[2]),
        .O(w_OBUF[0]));
  IBUF \b_IBUF[3]_inst 
       (.I(b[3]),
        .O(w_OBUF[1]));
  IBUF \b_IBUF[4]_inst 
       (.I(b[4]),
        .O(w_OBUF[2]));
  IBUF \c_IBUF[0]_inst 
       (.I(c[0]),
        .O(x_OBUF[1]));
  IBUF \c_IBUF[1]_inst 
       (.I(c[1]),
        .O(x_OBUF[2]));
  IBUF \c_IBUF[2]_inst 
       (.I(c[2]),
        .O(x_OBUF[3]));
  IBUF \c_IBUF[3]_inst 
       (.I(c[3]),
        .O(x_OBUF[4]));
  IBUF \c_IBUF[4]_inst 
       (.I(c[4]),
        .O(x_OBUF[5]));
  IBUF \d_IBUF[0]_inst 
       (.I(d[0]),
        .O(y_OBUF[4]));
  IBUF \d_IBUF[1]_inst 
       (.I(d[1]),
        .O(y_OBUF[5]));
  IBUF \d_IBUF[2]_inst 
       (.I(d[2]),
        .O(y_OBUF[6]));
  IBUF \d_IBUF[3]_inst 
       (.I(d[3]),
        .O(y_OBUF[7]));
  IBUF \d_IBUF[4]_inst 
       (.I(d[4]),
        .O(x_OBUF[0]));
  IBUF \e_IBUF[0]_inst 
       (.I(e[0]),
        .O(z_OBUF[7]));
  IBUF \e_IBUF[1]_inst 
       (.I(e[1]),
        .O(y_OBUF[0]));
  IBUF \e_IBUF[2]_inst 
       (.I(e[2]),
        .O(y_OBUF[1]));
  IBUF \e_IBUF[3]_inst 
       (.I(e[3]),
        .O(y_OBUF[2]));
  IBUF \e_IBUF[4]_inst 
       (.I(e[4]),
        .O(y_OBUF[3]));
  IBUF \f_IBUF[0]_inst 
       (.I(f[0]),
        .O(z_OBUF[2]));
  IBUF \f_IBUF[1]_inst 
       (.I(f[1]),
        .O(z_OBUF[3]));
  IBUF \f_IBUF[2]_inst 
       (.I(f[2]),
        .O(z_OBUF[4]));
  IBUF \f_IBUF[3]_inst 
       (.I(f[3]),
        .O(z_OBUF[5]));
  IBUF \f_IBUF[4]_inst 
       (.I(f[4]),
        .O(z_OBUF[6]));
  OBUF \w_OBUF[0]_inst 
       (.I(w_OBUF[0]),
        .O(w[0]));
  OBUF \w_OBUF[1]_inst 
       (.I(w_OBUF[1]),
        .O(w[1]));
  OBUF \w_OBUF[2]_inst 
       (.I(w_OBUF[2]),
        .O(w[2]));
  OBUF \w_OBUF[3]_inst 
       (.I(w_OBUF[3]),
        .O(w[3]));
  OBUF \w_OBUF[4]_inst 
       (.I(w_OBUF[4]),
        .O(w[4]));
  OBUF \w_OBUF[5]_inst 
       (.I(w_OBUF[5]),
        .O(w[5]));
  OBUF \w_OBUF[6]_inst 
       (.I(w_OBUF[6]),
        .O(w[6]));
  OBUF \w_OBUF[7]_inst 
       (.I(w_OBUF[7]),
        .O(w[7]));
  OBUF \x_OBUF[0]_inst 
       (.I(x_OBUF[0]),
        .O(x[0]));
  OBUF \x_OBUF[1]_inst 
       (.I(x_OBUF[1]),
        .O(x[1]));
  OBUF \x_OBUF[2]_inst 
       (.I(x_OBUF[2]),
        .O(x[2]));
  OBUF \x_OBUF[3]_inst 
       (.I(x_OBUF[3]),
        .O(x[3]));
  OBUF \x_OBUF[4]_inst 
       (.I(x_OBUF[4]),
        .O(x[4]));
  OBUF \x_OBUF[5]_inst 
       (.I(x_OBUF[5]),
        .O(x[5]));
  OBUF \x_OBUF[6]_inst 
       (.I(x_OBUF[6]),
        .O(x[6]));
  OBUF \x_OBUF[7]_inst 
       (.I(x_OBUF[7]),
        .O(x[7]));
  OBUF \y_OBUF[0]_inst 
       (.I(y_OBUF[0]),
        .O(y[0]));
  OBUF \y_OBUF[1]_inst 
       (.I(y_OBUF[1]),
        .O(y[1]));
  OBUF \y_OBUF[2]_inst 
       (.I(y_OBUF[2]),
        .O(y[2]));
  OBUF \y_OBUF[3]_inst 
       (.I(y_OBUF[3]),
        .O(y[3]));
  OBUF \y_OBUF[4]_inst 
       (.I(y_OBUF[4]),
        .O(y[4]));
  OBUF \y_OBUF[5]_inst 
       (.I(y_OBUF[5]),
        .O(y[5]));
  OBUF \y_OBUF[6]_inst 
       (.I(y_OBUF[6]),
        .O(y[6]));
  OBUF \y_OBUF[7]_inst 
       (.I(y_OBUF[7]),
        .O(y[7]));
  OBUF \z_OBUF[0]_inst 
       (.I(1'b1),
        .O(z[0]));
  OBUF \z_OBUF[1]_inst 
       (.I(1'b1),
        .O(z[1]));
  OBUF \z_OBUF[2]_inst 
       (.I(z_OBUF[2]),
        .O(z[2]));
  OBUF \z_OBUF[3]_inst 
       (.I(z_OBUF[3]),
        .O(z[3]));
  OBUF \z_OBUF[4]_inst 
       (.I(z_OBUF[4]),
        .O(z[4]));
  OBUF \z_OBUF[5]_inst 
       (.I(z_OBUF[5]),
        .O(z[5]));
  OBUF \z_OBUF[6]_inst 
       (.I(z_OBUF[6]),
        .O(z[6]));
  OBUF \z_OBUF[7]_inst 
       (.I(z_OBUF[7]),
        .O(z[7]));
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
