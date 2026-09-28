// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 22:55:12 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob087_gates/eda/run-miRjJe/build/.rtl-synth-YYz3M0/netlist.v
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
    out_and,
    out_or,
    out_xor,
    out_nand,
    out_nor,
    out_xnor,
    out_anotb);
  input a;
  input b;
  output out_and;
  output out_or;
  output out_xor;
  output out_nand;
  output out_nor;
  output out_xnor;
  output out_anotb;

  wire a;
  wire a_IBUF;
  wire b;
  wire b_IBUF;
  wire out_and;
  wire out_and_OBUF;
  wire out_anotb;
  wire out_anotb_OBUF;
  wire out_nand;
  wire out_nand_OBUF;
  wire out_nor;
  wire out_nor_OBUF;
  wire out_or;
  wire out_or_OBUF;
  wire out_xnor;
  wire out_xnor_OBUF;
  wire out_xor;
  wire out_xor_OBUF;

  IBUF a_IBUF_inst
       (.I(a),
        .O(a_IBUF));
  IBUF b_IBUF_inst
       (.I(b),
        .O(b_IBUF));
  OBUF out_and_OBUF_inst
       (.I(out_and_OBUF),
        .O(out_and));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h8)) 
    out_and_OBUF_inst_i_1
       (.I0(a_IBUF),
        .I1(b_IBUF),
        .O(out_and_OBUF));
  OBUF out_anotb_OBUF_inst
       (.I(out_anotb_OBUF),
        .O(out_anotb));
  LUT2 #(
    .INIT(4'h2)) 
    out_anotb_OBUF_inst_i_1
       (.I0(a_IBUF),
        .I1(b_IBUF),
        .O(out_anotb_OBUF));
  OBUF out_nand_OBUF_inst
       (.I(out_nand_OBUF),
        .O(out_nand));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h7)) 
    out_nand_OBUF_inst_i_1
       (.I0(b_IBUF),
        .I1(a_IBUF),
        .O(out_nand_OBUF));
  OBUF out_nor_OBUF_inst
       (.I(out_nor_OBUF),
        .O(out_nor));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h1)) 
    out_nor_OBUF_inst_i_1
       (.I0(b_IBUF),
        .I1(a_IBUF),
        .O(out_nor_OBUF));
  OBUF out_or_OBUF_inst
       (.I(out_or_OBUF),
        .O(out_or));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'hE)) 
    out_or_OBUF_inst_i_1
       (.I0(a_IBUF),
        .I1(b_IBUF),
        .O(out_or_OBUF));
  OBUF out_xnor_OBUF_inst
       (.I(out_xnor_OBUF),
        .O(out_xnor));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h9)) 
    out_xnor_OBUF_inst_i_1
       (.I0(a_IBUF),
        .I1(b_IBUF),
        .O(out_xnor_OBUF));
  OBUF out_xor_OBUF_inst
       (.I(out_xor_OBUF),
        .O(out_xor));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h6)) 
    out_xor_OBUF_inst_i_1
       (.I0(b_IBUF),
        .I1(a_IBUF),
        .O(out_xor_OBUF));
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
