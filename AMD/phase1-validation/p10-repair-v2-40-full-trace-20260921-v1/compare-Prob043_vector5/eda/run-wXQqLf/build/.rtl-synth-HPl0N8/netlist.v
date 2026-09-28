// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Mon Sep 21 20:37:10 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1/compare-Prob043_vector5/eda/run-wXQqLf/build/.rtl-synth-HPl0N8/netlist.v
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
    out);
  input a;
  input b;
  input c;
  input d;
  input e;
  output [24:0]out;

  wire a;
  wire a_IBUF;
  wire b;
  wire b_IBUF;
  wire c;
  wire c_IBUF;
  wire d;
  wire d_IBUF;
  wire e;
  wire e_IBUF;
  wire [24:0]out;
  wire [19:1]out_OBUF;

  IBUF a_IBUF_inst
       (.I(a),
        .O(a_IBUF));
  IBUF b_IBUF_inst
       (.I(b),
        .O(b_IBUF));
  IBUF c_IBUF_inst
       (.I(c),
        .O(c_IBUF));
  IBUF d_IBUF_inst
       (.I(d),
        .O(d_IBUF));
  IBUF e_IBUF_inst
       (.I(e),
        .O(e_IBUF));
  OBUF \out_OBUF[0]_inst 
       (.I(1'b1),
        .O(out[0]));
  OBUF \out_OBUF[10]_inst 
       (.I(out_OBUF[2]),
        .O(out[10]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[10]_inst_i_1 
       (.I0(e_IBUF),
        .I1(c_IBUF),
        .O(out_OBUF[2]));
  OBUF \out_OBUF[11]_inst 
       (.I(out_OBUF[7]),
        .O(out[11]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[11]_inst_i_1 
       (.I0(d_IBUF),
        .I1(c_IBUF),
        .O(out_OBUF[7]));
  OBUF \out_OBUF[12]_inst 
       (.I(1'b1),
        .O(out[12]));
  OBUF \out_OBUF[13]_inst 
       (.I(out_OBUF[13]),
        .O(out[13]));
  OBUF \out_OBUF[14]_inst 
       (.I(out_OBUF[14]),
        .O(out[14]));
  OBUF \out_OBUF[15]_inst 
       (.I(out_OBUF[3]),
        .O(out[15]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[15]_inst_i_1 
       (.I0(e_IBUF),
        .I1(b_IBUF),
        .O(out_OBUF[3]));
  OBUF \out_OBUF[16]_inst 
       (.I(out_OBUF[8]),
        .O(out[16]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[16]_inst_i_1 
       (.I0(d_IBUF),
        .I1(b_IBUF),
        .O(out_OBUF[8]));
  OBUF \out_OBUF[17]_inst 
       (.I(out_OBUF[13]),
        .O(out[17]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[17]_inst_i_1 
       (.I0(c_IBUF),
        .I1(b_IBUF),
        .O(out_OBUF[13]));
  OBUF \out_OBUF[18]_inst 
       (.I(1'b1),
        .O(out[18]));
  OBUF \out_OBUF[19]_inst 
       (.I(out_OBUF[19]),
        .O(out[19]));
  OBUF \out_OBUF[1]_inst 
       (.I(out_OBUF[1]),
        .O(out[1]));
  OBUF \out_OBUF[20]_inst 
       (.I(out_OBUF[4]),
        .O(out[20]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[20]_inst_i_1 
       (.I0(e_IBUF),
        .I1(a_IBUF),
        .O(out_OBUF[4]));
  OBUF \out_OBUF[21]_inst 
       (.I(out_OBUF[9]),
        .O(out[21]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[21]_inst_i_1 
       (.I0(d_IBUF),
        .I1(a_IBUF),
        .O(out_OBUF[9]));
  OBUF \out_OBUF[22]_inst 
       (.I(out_OBUF[14]),
        .O(out[22]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[22]_inst_i_1 
       (.I0(c_IBUF),
        .I1(a_IBUF),
        .O(out_OBUF[14]));
  OBUF \out_OBUF[23]_inst 
       (.I(out_OBUF[19]),
        .O(out[23]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[23]_inst_i_1 
       (.I0(b_IBUF),
        .I1(a_IBUF),
        .O(out_OBUF[19]));
  OBUF \out_OBUF[24]_inst 
       (.I(1'b1),
        .O(out[24]));
  OBUF \out_OBUF[2]_inst 
       (.I(out_OBUF[2]),
        .O(out[2]));
  OBUF \out_OBUF[3]_inst 
       (.I(out_OBUF[3]),
        .O(out[3]));
  OBUF \out_OBUF[4]_inst 
       (.I(out_OBUF[4]),
        .O(out[4]));
  OBUF \out_OBUF[5]_inst 
       (.I(out_OBUF[1]),
        .O(out[5]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h9)) 
    \out_OBUF[5]_inst_i_1 
       (.I0(e_IBUF),
        .I1(d_IBUF),
        .O(out_OBUF[1]));
  OBUF \out_OBUF[6]_inst 
       (.I(1'b1),
        .O(out[6]));
  OBUF \out_OBUF[7]_inst 
       (.I(out_OBUF[7]),
        .O(out[7]));
  OBUF \out_OBUF[8]_inst 
       (.I(out_OBUF[8]),
        .O(out[8]));
  OBUF \out_OBUF[9]_inst 
       (.I(out_OBUF[9]),
        .O(out[9]));
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
