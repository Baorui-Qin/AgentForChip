// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 05:13:43 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob126_circuit6/eda/run-BQ6wVy/build/.rtl-synth-puETTt/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (a,
    q);
  input [2:0]a;
  output [15:0]q;

  wire [2:0]a;
  wire [2:0]a_IBUF;
  wire [15:0]q;
  wire [15:0]q_OBUF;

  IBUF \a_IBUF[0]_inst 
       (.I(a[0]),
        .O(a_IBUF[0]));
  IBUF \a_IBUF[1]_inst 
       (.I(a[1]),
        .O(a_IBUF[1]));
  IBUF \a_IBUF[2]_inst 
       (.I(a[2]),
        .O(a_IBUF[2]));
  OBUF \q_OBUF[0]_inst 
       (.I(q_OBUF[0]),
        .O(q[0]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'h80)) 
    \q_OBUF[0]_inst_i_1 
       (.I0(a_IBUF[1]),
        .I1(a_IBUF[2]),
        .I2(a_IBUF[0]),
        .O(q_OBUF[0]));
  OBUF \q_OBUF[10]_inst 
       (.I(q_OBUF[10]),
        .O(q[10]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT3 #(
    .INIT(8'hE6)) 
    \q_OBUF[10]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(a_IBUF[1]),
        .I2(a_IBUF[2]),
        .O(q_OBUF[10]));
  OBUF \q_OBUF[11]_inst 
       (.I(q_OBUF[11]),
        .O(q[11]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT3 #(
    .INIT(8'h8A)) 
    \q_OBUF[11]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(a_IBUF[1]),
        .I2(a_IBUF[2]),
        .O(q_OBUF[11]));
  OBUF \q_OBUF[12]_inst 
       (.I(q_OBUF[12]),
        .O(q[12]));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT3 #(
    .INIT(8'h41)) 
    \q_OBUF[12]_inst_i_1 
       (.I0(a_IBUF[2]),
        .I1(a_IBUF[1]),
        .I2(a_IBUF[0]),
        .O(q_OBUF[12]));
  OBUF \q_OBUF[13]_inst 
       (.I(q_OBUF[13]),
        .O(q[13]));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT3 #(
    .INIT(8'hD6)) 
    \q_OBUF[13]_inst_i_1 
       (.I0(a_IBUF[1]),
        .I1(a_IBUF[2]),
        .I2(a_IBUF[0]),
        .O(q_OBUF[13]));
  OBUF \q_OBUF[14]_inst 
       (.I(q_OBUF[14]),
        .O(q[14]));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'h68)) 
    \q_OBUF[14]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(a_IBUF[1]),
        .I2(a_IBUF[2]),
        .O(q_OBUF[14]));
  OBUF \q_OBUF[15]_inst 
       (.I(q_OBUF[15]),
        .O(q[15]));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'h42)) 
    \q_OBUF[15]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(a_IBUF[1]),
        .I2(a_IBUF[2]),
        .O(q_OBUF[15]));
  OBUF \q_OBUF[1]_inst 
       (.I(q_OBUF[1]),
        .O(q[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'h6B)) 
    \q_OBUF[1]_inst_i_1 
       (.I0(a_IBUF[2]),
        .I1(a_IBUF[1]),
        .I2(a_IBUF[0]),
        .O(q_OBUF[1]));
  OBUF \q_OBUF[2]_inst 
       (.I(q_OBUF[2]),
        .O(q[2]));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT3 #(
    .INIT(8'h6E)) 
    \q_OBUF[2]_inst_i_1 
       (.I0(a_IBUF[1]),
        .I1(a_IBUF[2]),
        .I2(a_IBUF[0]),
        .O(q_OBUF[2]));
  OBUF \q_OBUF[3]_inst 
       (.I(q_OBUF[3]),
        .O(q[3]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hA8)) 
    \q_OBUF[3]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(a_IBUF[1]),
        .I2(a_IBUF[2]),
        .O(q_OBUF[3]));
  OBUF \q_OBUF[4]_inst 
       (.I(q_OBUF[4]),
        .O(q[4]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'h83)) 
    \q_OBUF[4]_inst_i_1 
       (.I0(a_IBUF[1]),
        .I1(a_IBUF[0]),
        .I2(a_IBUF[2]),
        .O(q_OBUF[4]));
  OBUF \q_OBUF[5]_inst 
       (.I(q_OBUF[5]),
        .O(q[5]));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT3 #(
    .INIT(8'h1D)) 
    \q_OBUF[5]_inst_i_1 
       (.I0(a_IBUF[1]),
        .I1(a_IBUF[2]),
        .I2(a_IBUF[0]),
        .O(q_OBUF[5]));
  OBUF \q_OBUF[6]_inst 
       (.I(q_OBUF[6]),
        .O(q[6]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'h56)) 
    \q_OBUF[6]_inst_i_1 
       (.I0(a_IBUF[1]),
        .I1(a_IBUF[2]),
        .I2(a_IBUF[0]),
        .O(q_OBUF[6]));
  OBUF \q_OBUF[7]_inst 
       (.I(q_OBUF[7]),
        .O(q[7]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'h26)) 
    \q_OBUF[7]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(a_IBUF[1]),
        .I2(a_IBUF[2]),
        .O(q_OBUF[7]));
  OBUF \q_OBUF[8]_inst 
       (.I(q_OBUF[8]),
        .O(q[8]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'h8A)) 
    \q_OBUF[8]_inst_i_1 
       (.I0(a_IBUF[1]),
        .I1(a_IBUF[2]),
        .I2(a_IBUF[0]),
        .O(q_OBUF[8]));
  OBUF \q_OBUF[9]_inst 
       (.I(q_OBUF[9]),
        .O(q[9]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'hD5)) 
    \q_OBUF[9]_inst_i_1 
       (.I0(a_IBUF[2]),
        .I1(a_IBUF[0]),
        .I2(a_IBUF[1]),
        .O(q_OBUF[9]));
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
