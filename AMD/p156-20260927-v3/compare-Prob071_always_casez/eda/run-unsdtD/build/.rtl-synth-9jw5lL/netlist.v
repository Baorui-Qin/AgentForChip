// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 22:43:08 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob071_always_casez/eda/run-unsdtD/build/.rtl-synth-9jw5lL/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (in,
    pos);
  input [7:0]in;
  output [2:0]pos;

  wire [7:0]in;
  wire [7:0]in_IBUF;
  wire [2:0]pos;
  wire [2:0]pos_OBUF;
  wire \pos_OBUF[0]_inst_i_2_n_0 ;
  wire \pos_OBUF[1]_inst_i_2_n_0 ;
  wire \pos_OBUF[2]_inst_i_2_n_0 ;

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
  IBUF \in_IBUF[4]_inst 
       (.I(in[4]),
        .O(in_IBUF[4]));
  IBUF \in_IBUF[5]_inst 
       (.I(in[5]),
        .O(in_IBUF[5]));
  IBUF \in_IBUF[6]_inst 
       (.I(in[6]),
        .O(in_IBUF[6]));
  IBUF \in_IBUF[7]_inst 
       (.I(in[7]),
        .O(in_IBUF[7]));
  OBUF \pos_OBUF[0]_inst 
       (.I(pos_OBUF[0]),
        .O(pos[0]));
  LUT6 #(
    .INIT(64'h1111111100001101)) 
    \pos_OBUF[0]_inst_i_1 
       (.I0(in_IBUF[0]),
        .I1(\pos_OBUF[0]_inst_i_2_n_0 ),
        .I2(in_IBUF[4]),
        .I3(in_IBUF[3]),
        .I4(in_IBUF[2]),
        .I5(in_IBUF[1]),
        .O(pos_OBUF[0]));
  LUT6 #(
    .INIT(64'h1101110100001101)) 
    \pos_OBUF[0]_inst_i_2 
       (.I0(in_IBUF[1]),
        .I1(in_IBUF[5]),
        .I2(in_IBUF[7]),
        .I3(in_IBUF[6]),
        .I4(in_IBUF[3]),
        .I5(in_IBUF[2]),
        .O(\pos_OBUF[0]_inst_i_2_n_0 ));
  OBUF \pos_OBUF[1]_inst 
       (.I(pos_OBUF[1]),
        .O(pos[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'h10)) 
    \pos_OBUF[1]_inst_i_1 
       (.I0(in_IBUF[0]),
        .I1(in_IBUF[1]),
        .I2(\pos_OBUF[1]_inst_i_2_n_0 ),
        .O(pos_OBUF[1]));
  LUT6 #(
    .INIT(64'hEEEFEEEFEEEFEEEE)) 
    \pos_OBUF[1]_inst_i_2 
       (.I0(in_IBUF[2]),
        .I1(in_IBUF[3]),
        .I2(in_IBUF[5]),
        .I3(in_IBUF[4]),
        .I4(in_IBUF[6]),
        .I5(in_IBUF[7]),
        .O(\pos_OBUF[1]_inst_i_2_n_0 ));
  OBUF \pos_OBUF[2]_inst 
       (.I(pos_OBUF[2]),
        .O(pos[2]));
  LUT5 #(
    .INIT(32'hFFFE0000)) 
    \pos_OBUF[2]_inst_i_1 
       (.I0(in_IBUF[5]),
        .I1(in_IBUF[4]),
        .I2(in_IBUF[6]),
        .I3(in_IBUF[7]),
        .I4(\pos_OBUF[2]_inst_i_2_n_0 ),
        .O(pos_OBUF[2]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h0001)) 
    \pos_OBUF[2]_inst_i_2 
       (.I0(in_IBUF[0]),
        .I1(in_IBUF[3]),
        .I2(in_IBUF[1]),
        .I3(in_IBUF[2]),
        .O(\pos_OBUF[2]_inst_i_2_n_0 ));
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
