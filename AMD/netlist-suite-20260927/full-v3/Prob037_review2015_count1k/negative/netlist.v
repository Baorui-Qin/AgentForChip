// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 04:03:21 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob037_review2015_count1k/eda/run-D3HfU5/build/.rtl-synth-HAUiD8/netlist.v
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
  output [9:0]q;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [9:0]q;
  wire \q[0]_i_1_n_0 ;
  wire \q[1]_i_1_n_0 ;
  wire \q[2]_i_1_n_0 ;
  wire \q[3]_i_1_n_0 ;
  wire \q[4]_i_1_n_0 ;
  wire \q[5]_i_1_n_0 ;
  wire \q[6]_i_1_n_0 ;
  wire \q[7]_i_1_n_0 ;
  wire \q[8]_i_1_n_0 ;
  wire \q[9]_i_1_n_0 ;
  wire \q[9]_i_2_n_0 ;
  wire \q[9]_i_3_n_0 ;
  wire \q[9]_i_4_n_0 ;
  wire [9:0]q_OBUF;
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
  LUT1 #(
    .INIT(2'h1)) 
    \q[0]_i_1 
       (.I0(q_OBUF[0]),
        .O(\q[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \q[1]_i_1 
       (.I0(q_OBUF[0]),
        .I1(q_OBUF[1]),
        .O(\q[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'h78)) 
    \q[2]_i_1 
       (.I0(q_OBUF[0]),
        .I1(q_OBUF[1]),
        .I2(q_OBUF[2]),
        .O(\q[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'h7F80)) 
    \q[3]_i_1 
       (.I0(q_OBUF[1]),
        .I1(q_OBUF[0]),
        .I2(q_OBUF[2]),
        .I3(q_OBUF[3]),
        .O(\q[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'h7FFF8000)) 
    \q[4]_i_1 
       (.I0(q_OBUF[2]),
        .I1(q_OBUF[0]),
        .I2(q_OBUF[1]),
        .I3(q_OBUF[3]),
        .I4(q_OBUF[4]),
        .O(\q[4]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h7FFFFFFF80000000)) 
    \q[5]_i_1 
       (.I0(q_OBUF[3]),
        .I1(q_OBUF[1]),
        .I2(q_OBUF[0]),
        .I3(q_OBUF[2]),
        .I4(q_OBUF[4]),
        .I5(q_OBUF[5]),
        .O(\q[5]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \q[6]_i_1 
       (.I0(\q[9]_i_4_n_0 ),
        .I1(q_OBUF[6]),
        .O(\q[6]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'h78)) 
    \q[7]_i_1 
       (.I0(\q[9]_i_4_n_0 ),
        .I1(q_OBUF[6]),
        .I2(q_OBUF[7]),
        .O(\q[7]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h7F80)) 
    \q[8]_i_1 
       (.I0(q_OBUF[6]),
        .I1(\q[9]_i_4_n_0 ),
        .I2(q_OBUF[7]),
        .I3(q_OBUF[8]),
        .O(\q[8]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFFFFF08000000)) 
    \q[9]_i_1 
       (.I0(q_OBUF[1]),
        .I1(q_OBUF[0]),
        .I2(q_OBUF[3]),
        .I3(q_OBUF[2]),
        .I4(\q[9]_i_3_n_0 ),
        .I5(reset_IBUF),
        .O(\q[9]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h7FFF8000)) 
    \q[9]_i_2 
       (.I0(q_OBUF[7]),
        .I1(\q[9]_i_4_n_0 ),
        .I2(q_OBUF[6]),
        .I3(q_OBUF[8]),
        .I4(q_OBUF[9]),
        .O(\q[9]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h2000000000000000)) 
    \q[9]_i_3 
       (.I0(q_OBUF[5]),
        .I1(q_OBUF[4]),
        .I2(q_OBUF[6]),
        .I3(q_OBUF[7]),
        .I4(q_OBUF[9]),
        .I5(q_OBUF[8]),
        .O(\q[9]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h8000000000000000)) 
    \q[9]_i_4 
       (.I0(q_OBUF[5]),
        .I1(q_OBUF[3]),
        .I2(q_OBUF[1]),
        .I3(q_OBUF[0]),
        .I4(q_OBUF[2]),
        .I5(q_OBUF[4]),
        .O(\q[9]_i_4_n_0 ));
  OBUF \q_OBUF[0]_inst 
       (.I(q_OBUF[0]),
        .O(q[0]));
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
        .R(\q[9]_i_1_n_0 ));
  FDRE \q_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[1]_i_1_n_0 ),
        .Q(q_OBUF[1]),
        .R(\q[9]_i_1_n_0 ));
  FDRE \q_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[2]_i_1_n_0 ),
        .Q(q_OBUF[2]),
        .R(\q[9]_i_1_n_0 ));
  FDRE \q_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[3]_i_1_n_0 ),
        .Q(q_OBUF[3]),
        .R(\q[9]_i_1_n_0 ));
  FDRE \q_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[4]_i_1_n_0 ),
        .Q(q_OBUF[4]),
        .R(\q[9]_i_1_n_0 ));
  FDRE \q_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[5]_i_1_n_0 ),
        .Q(q_OBUF[5]),
        .R(\q[9]_i_1_n_0 ));
  FDRE \q_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[6]_i_1_n_0 ),
        .Q(q_OBUF[6]),
        .R(\q[9]_i_1_n_0 ));
  FDRE \q_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[7]_i_1_n_0 ),
        .Q(q_OBUF[7]),
        .R(\q[9]_i_1_n_0 ));
  FDRE \q_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[8]_i_1_n_0 ),
        .Q(q_OBUF[8]),
        .R(\q[9]_i_1_n_0 ));
  FDRE \q_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\q[9]_i_2_n_0 ),
        .Q(q_OBUF[9]),
        .R(\q[9]_i_1_n_0 ));
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
