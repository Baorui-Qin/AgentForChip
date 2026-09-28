// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 22:50:55 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob082_lfsr32/eda/run-CfX8ap/build/.rtl-synth-FGYdfk/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (clk,
    reset,
    q);
  input clk;
  input reset;
  output [31:0]q;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [21:0]p_5_out;
  wire [31:0]q;
  wire [31:0]q_OBUF;
  wire reset;
  wire reset_IBUF;

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
  LUT2 #(
    .INIT(4'h6)) 
    \q[0]_i_1 
       (.I0(q_OBUF[0]),
        .I1(q_OBUF[1]),
        .O(p_5_out[0]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \q[1]_i_1 
       (.I0(q_OBUF[0]),
        .I1(q_OBUF[2]),
        .O(p_5_out[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \q[21]_i_1 
       (.I0(q_OBUF[0]),
        .I1(q_OBUF[22]),
        .O(p_5_out[21]));
  OBUF \q_OBUF[0]_inst 
       (.I(q_OBUF[0]),
        .O(q[0]));
  OBUF \q_OBUF[10]_inst 
       (.I(q_OBUF[10]),
        .O(q[10]));
  OBUF \q_OBUF[11]_inst 
       (.I(q_OBUF[11]),
        .O(q[11]));
  OBUF \q_OBUF[12]_inst 
       (.I(q_OBUF[12]),
        .O(q[12]));
  OBUF \q_OBUF[13]_inst 
       (.I(q_OBUF[13]),
        .O(q[13]));
  OBUF \q_OBUF[14]_inst 
       (.I(q_OBUF[14]),
        .O(q[14]));
  OBUF \q_OBUF[15]_inst 
       (.I(q_OBUF[15]),
        .O(q[15]));
  OBUF \q_OBUF[16]_inst 
       (.I(q_OBUF[16]),
        .O(q[16]));
  OBUF \q_OBUF[17]_inst 
       (.I(q_OBUF[17]),
        .O(q[17]));
  OBUF \q_OBUF[18]_inst 
       (.I(q_OBUF[18]),
        .O(q[18]));
  OBUF \q_OBUF[19]_inst 
       (.I(q_OBUF[19]),
        .O(q[19]));
  OBUF \q_OBUF[1]_inst 
       (.I(q_OBUF[1]),
        .O(q[1]));
  OBUF \q_OBUF[20]_inst 
       (.I(q_OBUF[20]),
        .O(q[20]));
  OBUF \q_OBUF[21]_inst 
       (.I(q_OBUF[21]),
        .O(q[21]));
  OBUF \q_OBUF[22]_inst 
       (.I(q_OBUF[22]),
        .O(q[22]));
  OBUF \q_OBUF[23]_inst 
       (.I(q_OBUF[23]),
        .O(q[23]));
  OBUF \q_OBUF[24]_inst 
       (.I(q_OBUF[24]),
        .O(q[24]));
  OBUF \q_OBUF[25]_inst 
       (.I(q_OBUF[25]),
        .O(q[25]));
  OBUF \q_OBUF[26]_inst 
       (.I(q_OBUF[26]),
        .O(q[26]));
  OBUF \q_OBUF[27]_inst 
       (.I(q_OBUF[27]),
        .O(q[27]));
  OBUF \q_OBUF[28]_inst 
       (.I(q_OBUF[28]),
        .O(q[28]));
  OBUF \q_OBUF[29]_inst 
       (.I(q_OBUF[29]),
        .O(q[29]));
  OBUF \q_OBUF[2]_inst 
       (.I(q_OBUF[2]),
        .O(q[2]));
  OBUF \q_OBUF[30]_inst 
       (.I(q_OBUF[30]),
        .O(q[30]));
  OBUF \q_OBUF[31]_inst 
       (.I(q_OBUF[31]),
        .O(q[31]));
  OBUF \q_OBUF[3]_inst 
       (.I(q_OBUF[3]),
        .O(q[3]));
  OBUF \q_OBUF[4]_inst 
       (.I(q_OBUF[4]),
        .O(q[4]));
  OBUF \q_OBUF[5]_inst 
       (.I(q_OBUF[5]),
        .O(q[5]));
  OBUF \q_OBUF[6]_inst 
       (.I(q_OBUF[6]),
        .O(q[6]));
  OBUF \q_OBUF[7]_inst 
       (.I(q_OBUF[7]),
        .O(q[7]));
  OBUF \q_OBUF[8]_inst 
       (.I(q_OBUF[8]),
        .O(q[8]));
  OBUF \q_OBUF[9]_inst 
       (.I(q_OBUF[9]),
        .O(q[9]));
  FDSE \q_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_5_out[0]),
        .Q(q_OBUF[0]),
        .S(reset_IBUF));
  FDRE \q_reg[10] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[11]),
        .Q(q_OBUF[10]),
        .R(reset_IBUF));
  FDRE \q_reg[11] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[12]),
        .Q(q_OBUF[11]),
        .R(reset_IBUF));
  FDRE \q_reg[12] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[13]),
        .Q(q_OBUF[12]),
        .R(reset_IBUF));
  FDRE \q_reg[13] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[14]),
        .Q(q_OBUF[13]),
        .R(reset_IBUF));
  FDRE \q_reg[14] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[15]),
        .Q(q_OBUF[14]),
        .R(reset_IBUF));
  FDRE \q_reg[15] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[16]),
        .Q(q_OBUF[15]),
        .R(reset_IBUF));
  FDRE \q_reg[16] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[17]),
        .Q(q_OBUF[16]),
        .R(reset_IBUF));
  FDRE \q_reg[17] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[18]),
        .Q(q_OBUF[17]),
        .R(reset_IBUF));
  FDRE \q_reg[18] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[19]),
        .Q(q_OBUF[18]),
        .R(reset_IBUF));
  FDRE \q_reg[19] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[20]),
        .Q(q_OBUF[19]),
        .R(reset_IBUF));
  FDRE \q_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_5_out[1]),
        .Q(q_OBUF[1]),
        .R(reset_IBUF));
  FDRE \q_reg[20] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[21]),
        .Q(q_OBUF[20]),
        .R(reset_IBUF));
  FDRE \q_reg[21] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_5_out[21]),
        .Q(q_OBUF[21]),
        .R(reset_IBUF));
  FDRE \q_reg[22] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[23]),
        .Q(q_OBUF[22]),
        .R(reset_IBUF));
  FDRE \q_reg[23] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[24]),
        .Q(q_OBUF[23]),
        .R(reset_IBUF));
  FDRE \q_reg[24] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[25]),
        .Q(q_OBUF[24]),
        .R(reset_IBUF));
  FDRE \q_reg[25] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[26]),
        .Q(q_OBUF[25]),
        .R(reset_IBUF));
  FDRE \q_reg[26] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[27]),
        .Q(q_OBUF[26]),
        .R(reset_IBUF));
  FDRE \q_reg[27] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[28]),
        .Q(q_OBUF[27]),
        .R(reset_IBUF));
  FDRE \q_reg[28] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[29]),
        .Q(q_OBUF[28]),
        .R(reset_IBUF));
  FDRE \q_reg[29] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[30]),
        .Q(q_OBUF[29]),
        .R(reset_IBUF));
  FDRE \q_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[3]),
        .Q(q_OBUF[2]),
        .R(reset_IBUF));
  FDRE \q_reg[30] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[31]),
        .Q(q_OBUF[30]),
        .R(reset_IBUF));
  FDRE \q_reg[31] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[0]),
        .Q(q_OBUF[31]),
        .R(reset_IBUF));
  FDRE \q_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[4]),
        .Q(q_OBUF[3]),
        .R(reset_IBUF));
  FDRE \q_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[5]),
        .Q(q_OBUF[4]),
        .R(reset_IBUF));
  FDRE \q_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[6]),
        .Q(q_OBUF[5]),
        .R(reset_IBUF));
  FDRE \q_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[7]),
        .Q(q_OBUF[6]),
        .R(reset_IBUF));
  FDRE \q_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[8]),
        .Q(q_OBUF[7]),
        .R(reset_IBUF));
  FDRE \q_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[9]),
        .Q(q_OBUF[8]),
        .R(reset_IBUF));
  FDRE \q_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(q_OBUF[10]),
        .Q(q_OBUF[9]),
        .R(reset_IBUF));
  IBUF reset_IBUF_inst
       (.I(reset),
        .O(reset_IBUF));
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
