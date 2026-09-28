// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Mon Sep 28 00:04:05 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob139_2013_q2bfsm/eda/run-6shxTi/build/.rtl-synth-urL1iv/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* A = "4'b0000" *) (* B = "4'b0001" *) (* C = "4'b0010" *) 
(* D = "4'b0011" *) (* E = "4'b0100" *) (* F = "4'b0101" *) 
(* G = "4'b0110" *) (* P = "4'b0111" *) (* Z = "4'b1000" *) 
(* NotValidForBitStream *)
module TopModule
   (clk,
    resetn,
    x,
    y,
    f,
    g);
  input clk;
  input resetn;
  input x;
  input y;
  output f;
  output g;

  wire \FSM_onehot_state[0]_i_1_n_0 ;
  wire \FSM_onehot_state[1]_i_1_n_0 ;
  wire \FSM_onehot_state[2]_i_1_n_0 ;
  wire \FSM_onehot_state[3]_i_1_n_0 ;
  wire \FSM_onehot_state[6]_i_1_n_0 ;
  wire \FSM_onehot_state[7]_i_1_n_0 ;
  wire \FSM_onehot_state[7]_i_2_n_0 ;
  wire \FSM_onehot_state_reg_n_0_[0] ;
  wire \FSM_onehot_state_reg_n_0_[1] ;
  wire \FSM_onehot_state_reg_n_0_[2] ;
  wire \FSM_onehot_state_reg_n_0_[3] ;
  wire \FSM_onehot_state_reg_n_0_[4] ;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire f;
  wire f_OBUF;
  wire g;
  wire g_OBUF;
  wire p_0_in;
  wire p_1_in;
  wire resetn;
  wire resetn_IBUF;
  wire x;
  wire x_IBUF;
  wire y;
  wire y_IBUF;

  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hC8)) 
    \FSM_onehot_state[0]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[0] ),
        .I1(x_IBUF),
        .I2(\FSM_onehot_state_reg_n_0_[3] ),
        .O(\FSM_onehot_state[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \FSM_onehot_state[1]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[0] ),
        .I1(x_IBUF),
        .O(\FSM_onehot_state[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[2]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[1] ),
        .I1(x_IBUF),
        .O(\FSM_onehot_state[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'hAFAE)) 
    \FSM_onehot_state[3]_i_1 
       (.I0(f_OBUF),
        .I1(\FSM_onehot_state_reg_n_0_[1] ),
        .I2(x_IBUF),
        .I3(\FSM_onehot_state_reg_n_0_[3] ),
        .O(\FSM_onehot_state[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'hFAEA)) 
    \FSM_onehot_state[6]_i_1 
       (.I0(p_1_in),
        .I1(p_0_in),
        .I2(y_IBUF),
        .I3(\FSM_onehot_state_reg_n_0_[2] ),
        .O(\FSM_onehot_state[6]_i_1_n_0 ));
  LUT1 #(
    .INIT(2'h1)) 
    \FSM_onehot_state[7]_i_1 
       (.I0(resetn_IBUF),
        .O(\FSM_onehot_state[7]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \FSM_onehot_state[7]_i_2 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(y_IBUF),
        .O(\FSM_onehot_state[7]_i_2_n_0 ));
  (* FSM_ENCODED_STATES = "D:000000001,E:000000010,C:000001000,B:000100000,A:000010000,P:001000000,G:010000000,Z:100000000,F:000000100" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[0]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[0] ),
        .R(\FSM_onehot_state[7]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "D:000000001,E:000000010,C:000001000,B:000100000,A:000010000,P:001000000,G:010000000,Z:100000000,F:000000100" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[1]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[1] ),
        .R(\FSM_onehot_state[7]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "D:000000001,E:000000010,C:000001000,B:000100000,A:000010000,P:001000000,G:010000000,Z:100000000,F:000000100" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[2]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[2] ),
        .R(\FSM_onehot_state[7]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "D:000000001,E:000000010,C:000001000,B:000100000,A:000010000,P:001000000,G:010000000,Z:100000000,F:000000100" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[3]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[3] ),
        .R(\FSM_onehot_state[7]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "D:000000001,E:000000010,C:000001000,B:000100000,A:000010000,P:001000000,G:010000000,Z:100000000,F:000000100" *) 
  FDSE #(
    .INIT(1'b1)) 
    \FSM_onehot_state_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(1'b0),
        .Q(\FSM_onehot_state_reg_n_0_[4] ),
        .S(\FSM_onehot_state[7]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "D:000000001,E:000000010,C:000001000,B:000100000,A:000010000,P:001000000,G:010000000,Z:100000000,F:000000100" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state_reg_n_0_[4] ),
        .Q(f_OBUF),
        .R(\FSM_onehot_state[7]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "D:000000001,E:000000010,C:000001000,B:000100000,A:000010000,P:001000000,G:010000000,Z:100000000,F:000000100" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[6]_i_1_n_0 ),
        .Q(p_1_in),
        .R(\FSM_onehot_state[7]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "D:000000001,E:000000010,C:000001000,B:000100000,A:000010000,P:001000000,G:010000000,Z:100000000,F:000000100" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[7]_i_2_n_0 ),
        .Q(p_0_in),
        .R(\FSM_onehot_state[7]_i_1_n_0 ));
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
  OBUF f_OBUF_inst
       (.I(f_OBUF),
        .O(f));
  OBUF g_OBUF_inst
       (.I(g_OBUF),
        .O(g));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hFE)) 
    g_OBUF_inst_i_1
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(p_0_in),
        .I2(p_1_in),
        .O(g_OBUF));
  IBUF resetn_IBUF_inst
       (.I(resetn),
        .O(resetn_IBUF));
  IBUF x_IBUF_inst
       (.I(x),
        .O(x_IBUF));
  IBUF y_IBUF_inst
       (.I(y),
        .O(y_IBUF));
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
