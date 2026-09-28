// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Tue Sep 22 23:02:39 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p100-0922-c3/compare-Prob148_2013_q2afsm/eda/run-axlA2L/build/.rtl-synth-4DZVb1/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* A = "2'b00" *) (* B = "2'b01" *) (* C = "2'b10" *) 
(* D = "2'b11" *) 
(* NotValidForBitStream *)
module TopModule
   (clk,
    resetn,
    r,
    g);
  input clk;
  input resetn;
  input [2:0]r;
  output [2:0]g;

  wire \FSM_sequential_state[1]_i_1_n_0 ;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [2:0]g;
  wire [2:0]g_OBUF;
  wire [1:0]next_state;
  wire [2:0]r;
  wire [2:0]r_IBUF;
  wire resetn;
  wire resetn_IBUF;
  wire [1:0]state;

  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h8888FF04)) 
    \FSM_sequential_state[0]_i_1 
       (.I0(state[0]),
        .I1(r_IBUF[2]),
        .I2(r_IBUF[1]),
        .I3(r_IBUF[0]),
        .I4(state[1]),
        .O(next_state[0]));
  LUT1 #(
    .INIT(2'h1)) 
    \FSM_sequential_state[1]_i_1 
       (.I0(resetn_IBUF),
        .O(\FSM_sequential_state[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hC480D590)) 
    \FSM_sequential_state[1]_i_2 
       (.I0(state[0]),
        .I1(state[1]),
        .I2(r_IBUF[2]),
        .I3(r_IBUF[1]),
        .I4(r_IBUF[0]),
        .O(next_state[1]));
  (* FSM_ENCODED_STATES = "B:01,C:10,A:00,D:11" *) 
  FDRE \FSM_sequential_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(next_state[0]),
        .Q(state[0]),
        .R(\FSM_sequential_state[1]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "B:01,C:10,A:00,D:11" *) 
  FDRE \FSM_sequential_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(next_state[1]),
        .Q(state[1]),
        .R(\FSM_sequential_state[1]_i_1_n_0 ));
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
  OBUF \g_OBUF[0]_inst 
       (.I(g_OBUF[0]),
        .O(g[0]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \g_OBUF[0]_inst_i_1 
       (.I0(state[0]),
        .I1(state[1]),
        .O(g_OBUF[0]));
  OBUF \g_OBUF[1]_inst 
       (.I(g_OBUF[1]),
        .O(g[1]));
  LUT2 #(
    .INIT(4'h2)) 
    \g_OBUF[1]_inst_i_1 
       (.I0(state[1]),
        .I1(state[0]),
        .O(g_OBUF[1]));
  OBUF \g_OBUF[2]_inst 
       (.I(g_OBUF[2]),
        .O(g[2]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \g_OBUF[2]_inst_i_1 
       (.I0(state[0]),
        .I1(state[1]),
        .O(g_OBUF[2]));
  IBUF \r_IBUF[0]_inst 
       (.I(r[0]),
        .O(r_IBUF[0]));
  IBUF \r_IBUF[1]_inst 
       (.I(r[1]),
        .O(r_IBUF[1]));
  IBUF \r_IBUF[2]_inst 
       (.I(r[2]),
        .O(r_IBUF[2]));
  IBUF resetn_IBUF_inst
       (.I(resetn),
        .O(resetn_IBUF));
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
