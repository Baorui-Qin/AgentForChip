// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 04:45:56 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob094_gatesv/eda/run-IBw66m/build/.rtl-synth-zd5KSX/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (in,
    out_both,
    out_any,
    out_different);
  input [3:0]in;
  output [3:0]out_both;
  output [3:0]out_any;
  output [3:0]out_different;

  wire [3:0]in;
  wire [3:0]in_IBUF;
  wire [3:0]out_any;
  wire [3:1]out_any_OBUF;
  wire [3:0]out_both;
  wire [2:0]out_both_OBUF;
  wire [3:0]out_different;
  wire [3:0]out_different_OBUF;

  IBUF \in_IBUF[0]_inst 
       (.I(in[0]),
        .O(in_IBUF[0]));
  IBUF \in_IBUF[1]_inst 
       (.I(in[1]),
        .O(in_IBUF[1]));
  IBUF \in_IBUF[2]_inst 
       (.I(in[2]),
        .O(in_IBUF[2]));
  IBUF \in_IBUF[3]_inst 
       (.I(in[3]),
        .O(in_IBUF[3]));
  OBUF \out_any_OBUF[0]_inst 
       (.I(1'b0),
        .O(out_any[0]));
  OBUF \out_any_OBUF[1]_inst 
       (.I(out_any_OBUF[1]),
        .O(out_any[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'hE)) 
    \out_any_OBUF[1]_inst_i_1 
       (.I0(in_IBUF[1]),
        .I1(in_IBUF[0]),
        .O(out_any_OBUF[1]));
  OBUF \out_any_OBUF[2]_inst 
       (.I(out_any_OBUF[2]),
        .O(out_any[2]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'hE)) 
    \out_any_OBUF[2]_inst_i_1 
       (.I0(in_IBUF[2]),
        .I1(in_IBUF[1]),
        .O(out_any_OBUF[2]));
  OBUF \out_any_OBUF[3]_inst 
       (.I(out_any_OBUF[3]),
        .O(out_any[3]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'hE)) 
    \out_any_OBUF[3]_inst_i_1 
       (.I0(in_IBUF[3]),
        .I1(in_IBUF[2]),
        .O(out_any_OBUF[3]));
  OBUF \out_both_OBUF[0]_inst 
       (.I(out_both_OBUF[0]),
        .O(out_both[0]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \out_both_OBUF[0]_inst_i_1 
       (.I0(in_IBUF[0]),
        .I1(in_IBUF[1]),
        .O(out_both_OBUF[0]));
  OBUF \out_both_OBUF[1]_inst 
       (.I(out_both_OBUF[1]),
        .O(out_both[1]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \out_both_OBUF[1]_inst_i_1 
       (.I0(in_IBUF[1]),
        .I1(in_IBUF[2]),
        .O(out_both_OBUF[1]));
  OBUF \out_both_OBUF[2]_inst 
       (.I(out_both_OBUF[2]),
        .O(out_both[2]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \out_both_OBUF[2]_inst_i_1 
       (.I0(in_IBUF[2]),
        .I1(in_IBUF[3]),
        .O(out_both_OBUF[2]));
  OBUF \out_both_OBUF[3]_inst 
       (.I(1'b0),
        .O(out_both[3]));
  OBUF \out_different_OBUF[0]_inst 
       (.I(out_different_OBUF[0]),
        .O(out_different[0]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \out_different_OBUF[0]_inst_i_1 
       (.I0(in_IBUF[1]),
        .I1(in_IBUF[0]),
        .O(out_different_OBUF[0]));
  OBUF \out_different_OBUF[1]_inst 
       (.I(out_different_OBUF[1]),
        .O(out_different[1]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \out_different_OBUF[1]_inst_i_1 
       (.I0(in_IBUF[2]),
        .I1(in_IBUF[1]),
        .O(out_different_OBUF[1]));
  OBUF \out_different_OBUF[2]_inst 
       (.I(out_different_OBUF[2]),
        .O(out_different[2]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \out_different_OBUF[2]_inst_i_1 
       (.I0(in_IBUF[3]),
        .I1(in_IBUF[2]),
        .O(out_different_OBUF[2]));
  OBUF \out_different_OBUF[3]_inst 
       (.I(out_different_OBUF[3]),
        .O(out_different[3]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \out_different_OBUF[3]_inst_i_1 
       (.I0(in_IBUF[0]),
        .I1(in_IBUF[3]),
        .O(out_different_OBUF[3]));
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
