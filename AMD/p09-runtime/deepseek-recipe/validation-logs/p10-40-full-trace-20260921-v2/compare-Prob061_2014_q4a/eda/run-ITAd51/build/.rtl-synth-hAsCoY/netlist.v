// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Mon Sep 21 14:28:51 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/phase1-validation/p10-40-full-trace-20260921-v2/compare-Prob061_2014_q4a/eda/run-ITAd51/build/.rtl-synth-hAsCoY/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (clk,
    w,
    R,
    E,
    L,
    Q);
  input clk;
  input w;
  input R;
  input E;
  input L;
  output Q;

  wire E;
  wire E_IBUF;
  wire L;
  wire L_IBUF;
  wire Q;
  wire Q_OBUF;
  wire Q_i_1_n_0;
  wire Q_i_2_n_0;
  wire R;
  wire R_IBUF;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire w;
  wire w_IBUF;

  IBUF E_IBUF_inst
       (.I(E),
        .O(E_IBUF));
  IBUF L_IBUF_inst
       (.I(L),
        .O(L_IBUF));
  OBUF Q_OBUF_inst
       (.I(Q_OBUF),
        .O(Q));
  LUT2 #(
    .INIT(4'hE)) 
    Q_i_1
       (.I0(E_IBUF),
        .I1(L_IBUF),
        .O(Q_i_1_n_0));
  LUT3 #(
    .INIT(8'hAC)) 
    Q_i_2
       (.I0(R_IBUF),
        .I1(w_IBUF),
        .I2(L_IBUF),
        .O(Q_i_2_n_0));
  FDRE Q_reg
       (.C(clk_IBUF_BUFG),
        .CE(Q_i_1_n_0),
        .D(Q_i_2_n_0),
        .Q(Q_OBUF),
        .R(1'b0));
  IBUF R_IBUF_inst
       (.I(R),
        .O(R_IBUF));
  (* XILINX_LEGACY_PRIM = "BUFG" *) 
  (* XILINX_TRANSFORM_PINMAP = "VCC:CE" *) 
  BUFGCE #(
    .CE_TYPE("ASYNC"),
    .SIM_DEVICE("ULTRASCALE_PLUS")) 
    clk_IBUF_BUFG_inst
       (.CE(1'b1),
        .I(clk_IBUF),
        .O(clk_IBUF_BUFG));
  IBUF clk_IBUF_inst
       (.I(clk),
        .O(clk_IBUF));
  IBUF w_IBUF_inst
       (.I(w),
        .O(w_IBUF));
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
