// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 16:55:01 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/netlist-suite-20260927/full-v3/eda/run-mxZeXr/build/.rtl-synth-OZBSXo/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* A2 = "0" *) (* B1 = "1" *) (* B2 = "2" *) 
(* C1 = "3" *) (* C2 = "4" *) (* D1 = "5" *) 
(* NotValidForBitStream *)
module TopModule
   (clk,
    reset,
    s,
    fr2,
    fr1,
    fr0,
    dfr);
  input clk;
  input reset;
  input [2:0]s;
  output fr2;
  output fr1;
  output fr0;
  output dfr;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire dfr;
  wire dfr_OBUF;
  wire fr0;
  wire fr0_OBUF;
  wire fr1;
  wire fr1_OBUF;
  wire fr2;
  wire fr2_OBUF;
  wire [2:0]next;
  wire reset;
  wire reset_IBUF;
  wire [2:0]s;
  wire [2:0]s_IBUF;
  wire [2:0]state;

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
  OBUF dfr_OBUF_inst
       (.I(dfr_OBUF),
        .O(dfr));
  LUT1 #(
    .INIT(2'h1)) 
    dfr_OBUF_inst_i_1
       (.I0(state[0]),
        .O(dfr_OBUF));
  OBUF fr0_OBUF_inst
       (.I(fr0_OBUF),
        .O(fr0));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h7)) 
    fr0_OBUF_inst_i_1
       (.I0(state[2]),
        .I1(state[0]),
        .O(fr0_OBUF));
  OBUF fr1_OBUF_inst
       (.I(fr1_OBUF),
        .O(fr1));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'h07)) 
    fr1_OBUF_inst_i_1
       (.I0(state[0]),
        .I1(state[1]),
        .I2(state[2]),
        .O(fr1_OBUF));
  OBUF fr2_OBUF_inst
       (.I(fr2_OBUF),
        .O(fr2));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'h01)) 
    fr2_OBUF_inst_i_1
       (.I0(state[2]),
        .I1(state[0]),
        .I2(state[1]),
        .O(fr2_OBUF));
  IBUF reset_IBUF_inst
       (.I(reset),
        .O(reset_IBUF));
  IBUF \s_IBUF[0]_inst 
       (.I(s[0]),
        .O(s_IBUF[0]));
  IBUF \s_IBUF[1]_inst 
       (.I(s[1]),
        .O(s_IBUF[1]));
  IBUF \s_IBUF[2]_inst 
       (.I(s[2]),
        .O(s_IBUF[2]));
  LUT6 #(
    .INIT(64'hDDCDDD8DDDC8D888)) 
    \state[0]_i_1 
       (.I0(state[2]),
        .I1(s_IBUF[2]),
        .I2(state[1]),
        .I3(s_IBUF[1]),
        .I4(state[0]),
        .I5(s_IBUF[0]),
        .O(next[0]));
  LUT6 #(
    .INIT(64'h1155550011007222)) 
    \state[1]_i_1 
       (.I0(state[2]),
        .I1(s_IBUF[2]),
        .I2(s_IBUF[0]),
        .I3(state[1]),
        .I4(state[0]),
        .I5(s_IBUF[1]),
        .O(next[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hFCCCCC88)) 
    \state[2]_i_1 
       (.I0(s_IBUF[1]),
        .I1(state[2]),
        .I2(state[1]),
        .I3(s_IBUF[2]),
        .I4(state[0]),
        .O(next[2]));
  FDRE \state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(next[0]),
        .Q(state[0]),
        .R(reset_IBUF));
  FDRE \state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(next[1]),
        .Q(state[1]),
        .R(reset_IBUF));
  FDRE \state_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(next[2]),
        .Q(state[2]),
        .R(reset_IBUF));
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
