// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Mon Sep 28 00:46:11 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob155_lemmings4/eda/run-04qVrn/build/.rtl-synth-UfSJyk/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* DIG_L = "3'b100" *) (* DIG_R = "3'b101" *) (* FALL_L = "3'b010" *) 
(* FALL_R = "3'b011" *) (* LEFT = "3'b000" *) (* RIGHT = "3'b001" *) 
(* SPLAT = "3'b110" *) 
(* NotValidForBitStream *)
module TopModule
   (clk,
    areset,
    bump_left,
    bump_right,
    ground,
    dig,
    walk_left,
    walk_right,
    aaah,
    digging);
  input clk;
  input areset;
  input bump_left;
  input bump_right;
  input ground;
  input dig;
  output walk_left;
  output walk_right;
  output aaah;
  output digging;

  wire \FSM_onehot_state[0]_i_1_n_0 ;
  wire \FSM_onehot_state[0]_i_2_n_0 ;
  wire \FSM_onehot_state[1]_i_1_n_0 ;
  wire \FSM_onehot_state[2]_i_1_n_0 ;
  wire \FSM_onehot_state[3]_i_1_n_0 ;
  wire \FSM_onehot_state[3]_i_2_n_0 ;
  wire \FSM_onehot_state[3]_i_3_n_0 ;
  wire \FSM_onehot_state[4]_i_1_n_0 ;
  wire \FSM_onehot_state[5]_i_1_n_0 ;
  wire \FSM_onehot_state[6]_i_1_n_0 ;
  wire \FSM_onehot_state_reg_n_0_[1] ;
  wire \FSM_onehot_state_reg_n_0_[4] ;
  wire \FSM_onehot_state_reg_n_0_[6] ;
  wire aaah;
  wire aaah_OBUF;
  wire areset;
  wire areset_IBUF;
  wire bump_left;
  wire bump_left_IBUF;
  wire bump_right;
  wire bump_right_IBUF;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [4:0]cnt;
  wire \cnt[0]_i_1_n_0 ;
  wire \cnt[0]_i_2_n_0 ;
  wire \cnt[1]_i_1_n_0 ;
  wire \cnt[2]_i_1_n_0 ;
  wire \cnt[3]_i_1_n_0 ;
  wire \cnt[3]_i_2_n_0 ;
  wire \cnt[4]_i_2_n_0 ;
  wire \cnt[4]_i_3_n_0 ;
  wire \cnt[4]_i_4_n_0 ;
  wire dig;
  wire dig_IBUF;
  wire digging;
  wire digging_OBUF;
  wire ground;
  wire ground_IBUF;
  wire [0:0]next_cnt;
  wire p_0_in;
  wire p_0_in2_in;
  wire walk_left;
  wire walk_left_OBUF;
  wire walk_right;
  wire walk_right_OBUF;

  LUT4 #(
    .INIT(16'hFF40)) 
    \FSM_onehot_state[0]_i_1 
       (.I0(\FSM_onehot_state[3]_i_2_n_0 ),
        .I1(ground_IBUF),
        .I2(\FSM_onehot_state_reg_n_0_[4] ),
        .I3(\FSM_onehot_state[0]_i_2_n_0 ),
        .O(\FSM_onehot_state[0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h00000000F2220000)) 
    \FSM_onehot_state[0]_i_2 
       (.I0(walk_left_OBUF),
        .I1(bump_left_IBUF),
        .I2(bump_right_IBUF),
        .I3(walk_right_OBUF),
        .I4(ground_IBUF),
        .I5(dig_IBUF),
        .O(\FSM_onehot_state[0]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'hFEAAAAAA)) 
    \FSM_onehot_state[1]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[1] ),
        .I1(\FSM_onehot_state_reg_n_0_[4] ),
        .I2(p_0_in2_in),
        .I3(ground_IBUF),
        .I4(\FSM_onehot_state[3]_i_2_n_0 ),
        .O(\FSM_onehot_state[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT4 #(
    .INIT(16'h5554)) 
    \FSM_onehot_state[2]_i_1 
       (.I0(ground_IBUF),
        .I1(p_0_in),
        .I2(walk_right_OBUF),
        .I3(p_0_in2_in),
        .O(\FSM_onehot_state[2]_i_1_n_0 ));
  LUT4 #(
    .INIT(16'hFF40)) 
    \FSM_onehot_state[3]_i_1 
       (.I0(\FSM_onehot_state[3]_i_2_n_0 ),
        .I1(ground_IBUF),
        .I2(p_0_in2_in),
        .I3(\FSM_onehot_state[3]_i_3_n_0 ),
        .O(\FSM_onehot_state[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hAAAA8880)) 
    \FSM_onehot_state[3]_i_2 
       (.I0(cnt[4]),
        .I1(cnt[2]),
        .I2(cnt[1]),
        .I3(cnt[0]),
        .I4(cnt[3]),
        .O(\FSM_onehot_state[3]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000088F80000)) 
    \FSM_onehot_state[3]_i_3 
       (.I0(walk_left_OBUF),
        .I1(bump_left_IBUF),
        .I2(walk_right_OBUF),
        .I3(bump_right_IBUF),
        .I4(ground_IBUF),
        .I5(dig_IBUF),
        .O(\FSM_onehot_state[3]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT4 #(
    .INIT(16'h5554)) 
    \FSM_onehot_state[4]_i_1 
       (.I0(ground_IBUF),
        .I1(\FSM_onehot_state_reg_n_0_[6] ),
        .I2(walk_left_OBUF),
        .I3(\FSM_onehot_state_reg_n_0_[4] ),
        .O(\FSM_onehot_state[4]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT4 #(
    .INIT(16'hC8C0)) 
    \FSM_onehot_state[5]_i_1 
       (.I0(walk_right_OBUF),
        .I1(ground_IBUF),
        .I2(p_0_in),
        .I3(dig_IBUF),
        .O(\FSM_onehot_state[5]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT4 #(
    .INIT(16'hC8C0)) 
    \FSM_onehot_state[6]_i_1 
       (.I0(walk_left_OBUF),
        .I1(ground_IBUF),
        .I2(\FSM_onehot_state_reg_n_0_[6] ),
        .I3(dig_IBUF),
        .O(\FSM_onehot_state[6]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "DIG_L:1000000,DIG_R:0100000,FALL_L:0010000,LEFT:0000001,FALL_R:0000100,RIGHT:0001000,SPLAT:0000010" *) 
  FDPE #(
    .INIT(1'b1)) 
    \FSM_onehot_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(walk_left_OBUF));
  (* FSM_ENCODED_STATES = "DIG_L:1000000,DIG_R:0100000,FALL_L:0010000,LEFT:0000001,FALL_R:0000100,RIGHT:0001000,SPLAT:0000010" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[1]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[1] ));
  (* FSM_ENCODED_STATES = "DIG_L:1000000,DIG_R:0100000,FALL_L:0010000,LEFT:0000001,FALL_R:0000100,RIGHT:0001000,SPLAT:0000010" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[2]_i_1_n_0 ),
        .Q(p_0_in2_in));
  (* FSM_ENCODED_STATES = "DIG_L:1000000,DIG_R:0100000,FALL_L:0010000,LEFT:0000001,FALL_R:0000100,RIGHT:0001000,SPLAT:0000010" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[3]_i_1_n_0 ),
        .Q(walk_right_OBUF));
  (* FSM_ENCODED_STATES = "DIG_L:1000000,DIG_R:0100000,FALL_L:0010000,LEFT:0000001,FALL_R:0000100,RIGHT:0001000,SPLAT:0000010" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[4]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[4] ));
  (* FSM_ENCODED_STATES = "DIG_L:1000000,DIG_R:0100000,FALL_L:0010000,LEFT:0000001,FALL_R:0000100,RIGHT:0001000,SPLAT:0000010" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[5]_i_1_n_0 ),
        .Q(p_0_in));
  (* FSM_ENCODED_STATES = "DIG_L:1000000,DIG_R:0100000,FALL_L:0010000,LEFT:0000001,FALL_R:0000100,RIGHT:0001000,SPLAT:0000010" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[6]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[6] ));
  OBUF aaah_OBUF_inst
       (.I(aaah_OBUF),
        .O(aaah));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'hE)) 
    aaah_OBUF_inst_i_1
       (.I0(\FSM_onehot_state_reg_n_0_[4] ),
        .I1(p_0_in2_in),
        .O(aaah_OBUF));
  IBUF areset_IBUF_inst
       (.I(areset),
        .O(areset_IBUF));
  IBUF bump_left_IBUF_inst
       (.I(bump_left),
        .O(bump_left_IBUF));
  IBUF bump_right_IBUF_inst
       (.I(bump_right),
        .O(bump_right_IBUF));
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
  LUT6 #(
    .INIT(64'hFFFEFFFEFFFEFFFF)) 
    \cnt[0]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[6] ),
        .I1(walk_left_OBUF),
        .I2(p_0_in),
        .I3(walk_right_OBUF),
        .I4(\cnt[0]_i_2_n_0 ),
        .I5(cnt[0]),
        .O(\cnt[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hAB)) 
    \cnt[0]_i_2 
       (.I0(ground_IBUF),
        .I1(\FSM_onehot_state_reg_n_0_[4] ),
        .I2(p_0_in2_in),
        .O(\cnt[0]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT5 #(
    .INIT(32'h00006660)) 
    \cnt[1]_i_1 
       (.I0(cnt[1]),
        .I1(cnt[0]),
        .I2(p_0_in2_in),
        .I3(\FSM_onehot_state_reg_n_0_[4] ),
        .I4(ground_IBUF),
        .O(\cnt[1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h000000000EE0E0E0)) 
    \cnt[2]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[4] ),
        .I1(p_0_in2_in),
        .I2(cnt[2]),
        .I3(cnt[1]),
        .I4(cnt[0]),
        .I5(ground_IBUF),
        .O(\cnt[2]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000007F80)) 
    \cnt[3]_i_1 
       (.I0(cnt[2]),
        .I1(cnt[0]),
        .I2(cnt[1]),
        .I3(cnt[3]),
        .I4(ground_IBUF),
        .I5(\cnt[3]_i_2_n_0 ),
        .O(\cnt[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h1)) 
    \cnt[3]_i_2 
       (.I0(p_0_in2_in),
        .I1(\FSM_onehot_state_reg_n_0_[4] ),
        .O(\cnt[3]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFFFCFFDFDFDCC)) 
    \cnt[4]_i_1 
       (.I0(\FSM_onehot_state[3]_i_2_n_0 ),
        .I1(\FSM_onehot_state_reg_n_0_[1] ),
        .I2(ground_IBUF),
        .I3(p_0_in2_in),
        .I4(\FSM_onehot_state_reg_n_0_[4] ),
        .I5(\cnt[4]_i_3_n_0 ),
        .O(next_cnt));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT5 #(
    .INIT(32'h0000E00E)) 
    \cnt[4]_i_2 
       (.I0(\FSM_onehot_state_reg_n_0_[4] ),
        .I1(p_0_in2_in),
        .I2(cnt[4]),
        .I3(\cnt[4]_i_4_n_0 ),
        .I4(ground_IBUF),
        .O(\cnt[4]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT4 #(
    .INIT(16'hFFFE)) 
    \cnt[4]_i_3 
       (.I0(walk_right_OBUF),
        .I1(p_0_in),
        .I2(walk_left_OBUF),
        .I3(\FSM_onehot_state_reg_n_0_[6] ),
        .O(\cnt[4]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h7FFF)) 
    \cnt[4]_i_4 
       (.I0(cnt[2]),
        .I1(cnt[0]),
        .I2(cnt[1]),
        .I3(cnt[3]),
        .O(\cnt[4]_i_4_n_0 ));
  FDCE \cnt_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(next_cnt),
        .CLR(areset_IBUF),
        .D(\cnt[0]_i_1_n_0 ),
        .Q(cnt[0]));
  FDCE \cnt_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(next_cnt),
        .CLR(areset_IBUF),
        .D(\cnt[1]_i_1_n_0 ),
        .Q(cnt[1]));
  FDCE \cnt_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(next_cnt),
        .CLR(areset_IBUF),
        .D(\cnt[2]_i_1_n_0 ),
        .Q(cnt[2]));
  FDCE \cnt_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(next_cnt),
        .CLR(areset_IBUF),
        .D(\cnt[3]_i_1_n_0 ),
        .Q(cnt[3]));
  FDCE \cnt_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(next_cnt),
        .CLR(areset_IBUF),
        .D(\cnt[4]_i_2_n_0 ),
        .Q(cnt[4]));
  IBUF dig_IBUF_inst
       (.I(dig),
        .O(dig_IBUF));
  OBUF digging_OBUF_inst
       (.I(digging_OBUF),
        .O(digging));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT2 #(
    .INIT(4'hE)) 
    digging_OBUF_inst_i_1
       (.I0(p_0_in),
        .I1(\FSM_onehot_state_reg_n_0_[6] ),
        .O(digging_OBUF));
  IBUF ground_IBUF_inst
       (.I(ground),
        .O(ground_IBUF));
  OBUF walk_left_OBUF_inst
       (.I(walk_left_OBUF),
        .O(walk_left));
  OBUF walk_right_OBUF_inst
       (.I(walk_right_OBUF),
        .O(walk_right));
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
