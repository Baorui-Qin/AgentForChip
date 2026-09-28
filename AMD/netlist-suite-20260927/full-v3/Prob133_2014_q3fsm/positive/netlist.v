// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 05:45:36 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob133_2014_q3fsm/eda/run-nJk4HP/build/.rtl-synth-Bhjk2w/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* A = "1'b0" *) (* B = "1'b1" *) 
(* NotValidForBitStream *)
module TopModule
   (clk,
    reset,
    s,
    w,
    z);
  input clk;
  input reset;
  input s;
  input w;
  output z;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [1:0]cyc;
  wire \cyc[1]_i_1_n_0 ;
  wire [1:0]ones;
  wire \ones[0]_i_1_n_0 ;
  wire \ones[1]_i_1_n_0 ;
  wire \ones[1]_i_2_n_0 ;
  wire [1:0]p_1_in;
  wire reset;
  wire reset_IBUF;
  wire s;
  wire s_IBUF;
  wire state;
  wire state_i_1_n_0;
  wire w;
  wire w_IBUF;
  wire z;
  wire z_OBUF;

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
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT1 #(
    .INIT(2'h1)) 
    \cyc[0]_i_1 
       (.I0(cyc[0]),
        .O(p_1_in[0]));
  LUT4 #(
    .INIT(16'hDFDD)) 
    \cyc[1]_i_1 
       (.I0(state),
        .I1(reset_IBUF),
        .I2(cyc[0]),
        .I3(cyc[1]),
        .O(\cyc[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \cyc[1]_i_2 
       (.I0(cyc[0]),
        .I1(cyc[1]),
        .O(p_1_in[1]));
  FDRE \cyc_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_1_in[0]),
        .Q(cyc[0]),
        .R(\cyc[1]_i_1_n_0 ));
  FDRE \cyc_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_1_in[1]),
        .Q(cyc[1]),
        .R(\cyc[1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h000000001FE00000)) 
    \ones[0]_i_1 
       (.I0(cyc[1]),
        .I1(cyc[0]),
        .I2(ones[0]),
        .I3(w_IBUF),
        .I4(state),
        .I5(reset_IBUF),
        .O(\ones[0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000007080000)) 
    \ones[1]_i_1 
       (.I0(ones[0]),
        .I1(w_IBUF),
        .I2(\ones[1]_i_2_n_0 ),
        .I3(ones[1]),
        .I4(state),
        .I5(reset_IBUF),
        .O(\ones[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h1)) 
    \ones[1]_i_2 
       (.I0(cyc[1]),
        .I1(cyc[0]),
        .O(\ones[1]_i_2_n_0 ));
  FDRE \ones_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\ones[0]_i_1_n_0 ),
        .Q(ones[0]),
        .R(1'b0));
  FDRE \ones_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\ones[1]_i_1_n_0 ),
        .Q(ones[1]),
        .R(1'b0));
  IBUF reset_IBUF_inst
       (.I(reset),
        .O(reset_IBUF));
  IBUF s_IBUF_inst
       (.I(s),
        .O(s_IBUF));
  LUT3 #(
    .INIT(8'h0E)) 
    state_i_1
       (.I0(state),
        .I1(s_IBUF),
        .I2(reset_IBUF),
        .O(state_i_1_n_0));
  FDRE state_reg
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(state_i_1_n_0),
        .Q(state),
        .R(1'b0));
  IBUF w_IBUF_inst
       (.I(w),
        .O(w_IBUF));
  OBUF z_OBUF_inst
       (.I(z_OBUF),
        .O(z));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h00000200)) 
    z_OBUF_inst_i_1
       (.I0(state),
        .I1(cyc[0]),
        .I2(cyc[1]),
        .I3(ones[1]),
        .I4(ones[0]),
        .O(z_OBUF));
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
