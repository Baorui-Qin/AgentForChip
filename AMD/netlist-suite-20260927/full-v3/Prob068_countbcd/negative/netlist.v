// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 04:24:50 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob068_countbcd/eda/run-ipIxP0/build/.rtl-synth-vWVYsS/netlist.v
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
    ena,
    q);
  input clk;
  input reset;
  output [3:1]ena;
  output [15:0]q;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [3:1]ena;
  wire ena_20;
  wire [3:1]ena_OBUF;
  wire [15:1]p_3_out;
  wire [15:0]q;
  wire \q[0]_i_1_n_0 ;
  wire \q[12]_i_1_n_0 ;
  wire \q[4]_i_1_n_0 ;
  wire \q[8]_i_1_n_0 ;
  wire [15:0]q_OBUF;
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
  OBUF \ena_OBUF[1]_inst 
       (.I(ena_OBUF[1]),
        .O(ena[1]));
  LUT4 #(
    .INIT(16'h1000)) 
    \ena_OBUF[1]_inst_i_1 
       (.I0(q_OBUF[2]),
        .I1(q_OBUF[1]),
        .I2(q_OBUF[3]),
        .I3(q_OBUF[0]),
        .O(ena_OBUF[1]));
  OBUF \ena_OBUF[2]_inst 
       (.I(ena_OBUF[2]),
        .O(ena[2]));
  LUT5 #(
    .INIT(32'h00000080)) 
    \ena_OBUF[2]_inst_i_1 
       (.I0(ena_OBUF[1]),
        .I1(q_OBUF[7]),
        .I2(q_OBUF[4]),
        .I3(q_OBUF[6]),
        .I4(q_OBUF[5]),
        .O(ena_OBUF[2]));
  OBUF \ena_OBUF[3]_inst 
       (.I(ena_OBUF[3]),
        .O(ena[3]));
  LUT6 #(
    .INIT(64'h1000000000000000)) 
    \ena_OBUF[3]_inst_i_1 
       (.I0(q_OBUF[5]),
        .I1(q_OBUF[6]),
        .I2(q_OBUF[4]),
        .I3(q_OBUF[7]),
        .I4(ena_OBUF[1]),
        .I5(ena_20),
        .O(ena_OBUF[3]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h1000)) 
    \ena_OBUF[3]_inst_i_2 
       (.I0(q_OBUF[9]),
        .I1(q_OBUF[10]),
        .I2(q_OBUF[8]),
        .I3(q_OBUF[11]),
        .O(ena_20));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT1 #(
    .INIT(2'h1)) 
    \q[0]_i_1 
       (.I0(q_OBUF[0]),
        .O(\q[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'h6C)) 
    \q[10]_i_1 
       (.I0(q_OBUF[8]),
        .I1(q_OBUF[10]),
        .I2(q_OBUF[9]),
        .O(p_3_out[10]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h6CC4)) 
    \q[11]_i_1 
       (.I0(q_OBUF[8]),
        .I1(q_OBUF[11]),
        .I2(q_OBUF[10]),
        .I3(q_OBUF[9]),
        .O(p_3_out[11]));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT1 #(
    .INIT(2'h1)) 
    \q[12]_i_1 
       (.I0(q_OBUF[12]),
        .O(\q[12]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT4 #(
    .INIT(16'h55A2)) 
    \q[13]_i_1 
       (.I0(q_OBUF[12]),
        .I1(q_OBUF[15]),
        .I2(q_OBUF[14]),
        .I3(q_OBUF[13]),
        .O(p_3_out[13]));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT3 #(
    .INIT(8'h6C)) 
    \q[14]_i_1 
       (.I0(q_OBUF[12]),
        .I1(q_OBUF[14]),
        .I2(q_OBUF[13]),
        .O(p_3_out[14]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT4 #(
    .INIT(16'h6CC4)) 
    \q[15]_i_1 
       (.I0(q_OBUF[12]),
        .I1(q_OBUF[15]),
        .I2(q_OBUF[14]),
        .I3(q_OBUF[13]),
        .O(p_3_out[15]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'h23CC)) 
    \q[1]_i_1 
       (.I0(q_OBUF[2]),
        .I1(q_OBUF[1]),
        .I2(q_OBUF[3]),
        .I3(q_OBUF[0]),
        .O(p_3_out[1]));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'h6A)) 
    \q[2]_i_1 
       (.I0(q_OBUF[2]),
        .I1(q_OBUF[1]),
        .I2(q_OBUF[0]),
        .O(p_3_out[2]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'h68F0)) 
    \q[3]_i_1 
       (.I0(q_OBUF[2]),
        .I1(q_OBUF[1]),
        .I2(q_OBUF[3]),
        .I3(q_OBUF[0]),
        .O(p_3_out[3]));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT1 #(
    .INIT(2'h1)) 
    \q[4]_i_1 
       (.I0(q_OBUF[4]),
        .O(\q[4]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'h55A2)) 
    \q[5]_i_1 
       (.I0(q_OBUF[4]),
        .I1(q_OBUF[7]),
        .I2(q_OBUF[6]),
        .I3(q_OBUF[5]),
        .O(p_3_out[5]));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT3 #(
    .INIT(8'h6C)) 
    \q[6]_i_1 
       (.I0(q_OBUF[4]),
        .I1(q_OBUF[6]),
        .I2(q_OBUF[5]),
        .O(p_3_out[6]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'h6CC4)) 
    \q[7]_i_1 
       (.I0(q_OBUF[4]),
        .I1(q_OBUF[7]),
        .I2(q_OBUF[6]),
        .I3(q_OBUF[5]),
        .O(p_3_out[7]));
  LUT1 #(
    .INIT(2'h1)) 
    \q[8]_i_1 
       (.I0(q_OBUF[8]),
        .O(\q[8]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT4 #(
    .INIT(16'h55A2)) 
    \q[9]_i_1 
       (.I0(q_OBUF[8]),
        .I1(q_OBUF[11]),
        .I2(q_OBUF[10]),
        .I3(q_OBUF[9]),
        .O(p_3_out[9]));
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
  OBUF \q_OBUF[1]_inst 
       (.I(q_OBUF[1]),
        .O(q[1]));
  OBUF \q_OBUF[2]_inst 
       (.I(q_OBUF[2]),
        .O(q[2]));
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
  FDRE \q_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[0]_i_1_n_0 ),
        .Q(q_OBUF[0]),
        .R(reset_IBUF));
  FDRE \q_reg[10] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[2]),
        .D(p_3_out[10]),
        .Q(q_OBUF[10]),
        .R(reset_IBUF));
  FDRE \q_reg[11] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[2]),
        .D(p_3_out[11]),
        .Q(q_OBUF[11]),
        .R(reset_IBUF));
  FDRE \q_reg[12] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[3]),
        .D(\q[12]_i_1_n_0 ),
        .Q(q_OBUF[12]),
        .R(reset_IBUF));
  FDRE \q_reg[13] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[3]),
        .D(p_3_out[13]),
        .Q(q_OBUF[13]),
        .R(reset_IBUF));
  FDRE \q_reg[14] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[3]),
        .D(p_3_out[14]),
        .Q(q_OBUF[14]),
        .R(reset_IBUF));
  FDRE \q_reg[15] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[3]),
        .D(p_3_out[15]),
        .Q(q_OBUF[15]),
        .R(reset_IBUF));
  FDRE \q_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_3_out[1]),
        .Q(q_OBUF[1]),
        .R(reset_IBUF));
  FDRE \q_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_3_out[2]),
        .Q(q_OBUF[2]),
        .R(reset_IBUF));
  FDRE \q_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_3_out[3]),
        .Q(q_OBUF[3]),
        .R(reset_IBUF));
  FDRE \q_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[1]),
        .D(\q[4]_i_1_n_0 ),
        .Q(q_OBUF[4]),
        .R(reset_IBUF));
  FDRE \q_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[1]),
        .D(p_3_out[5]),
        .Q(q_OBUF[5]),
        .R(reset_IBUF));
  FDRE \q_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[1]),
        .D(p_3_out[6]),
        .Q(q_OBUF[6]),
        .R(reset_IBUF));
  FDRE \q_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[1]),
        .D(p_3_out[7]),
        .Q(q_OBUF[7]),
        .R(reset_IBUF));
  FDRE \q_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[2]),
        .D(\q[8]_i_1_n_0 ),
        .Q(q_OBUF[8]),
        .R(reset_IBUF));
  FDRE \q_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_OBUF[2]),
        .D(p_3_out[9]),
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
