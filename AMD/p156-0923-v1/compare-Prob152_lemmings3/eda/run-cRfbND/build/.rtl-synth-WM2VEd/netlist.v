// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 05:52:58 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob152_lemmings3/eda/run-cRfbND/build/.rtl-synth-WM2VEd/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

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
  wire \FSM_onehot_state[4]_i_1_n_0 ;
  wire \FSM_onehot_state[5]_i_1_n_0 ;
  wire \FSM_onehot_state_reg_n_0_[1] ;
  wire \FSM_onehot_state_reg_n_0_[2] ;
  wire \FSM_onehot_state_reg_n_0_[4] ;
  wire \FSM_onehot_state_reg_n_0_[5] ;
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
  wire dig;
  wire dig_IBUF;
  wire digging;
  wire digging_OBUF;
  wire ground;
  wire ground_IBUF;
  wire walk_left;
  wire walk_left_OBUF;
  wire walk_right;
  wire walk_right_OBUF;

  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hF8)) 
    \FSM_onehot_state[0]_i_1 
       (.I0(ground_IBUF),
        .I1(\FSM_onehot_state_reg_n_0_[2] ),
        .I2(\FSM_onehot_state[0]_i_2_n_0 ),
        .O(\FSM_onehot_state[0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h000080F000008080)) 
    \FSM_onehot_state[0]_i_2 
       (.I0(bump_right_IBUF),
        .I1(walk_right_OBUF),
        .I2(ground_IBUF),
        .I3(bump_left_IBUF),
        .I4(dig_IBUF),
        .I5(walk_left_OBUF),
        .O(\FSM_onehot_state[0]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'hF080)) 
    \FSM_onehot_state[1]_i_1 
       (.I0(dig_IBUF),
        .I1(walk_left_OBUF),
        .I2(ground_IBUF),
        .I3(\FSM_onehot_state_reg_n_0_[1] ),
        .O(\FSM_onehot_state[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h0F0E)) 
    \FSM_onehot_state[2]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[1] ),
        .I1(walk_left_OBUF),
        .I2(ground_IBUF),
        .I3(\FSM_onehot_state_reg_n_0_[2] ),
        .O(\FSM_onehot_state[2]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF0200)) 
    \FSM_onehot_state[3]_i_1 
       (.I0(ground_IBUF),
        .I1(bump_right_IBUF),
        .I2(dig_IBUF),
        .I3(walk_right_OBUF),
        .I4(\FSM_onehot_state[3]_i_2_n_0 ),
        .O(\FSM_onehot_state[3]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h8C888888)) 
    \FSM_onehot_state[3]_i_2 
       (.I0(\FSM_onehot_state_reg_n_0_[5] ),
        .I1(ground_IBUF),
        .I2(dig_IBUF),
        .I3(bump_left_IBUF),
        .I4(walk_left_OBUF),
        .O(\FSM_onehot_state[3]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'hF080)) 
    \FSM_onehot_state[4]_i_1 
       (.I0(dig_IBUF),
        .I1(walk_right_OBUF),
        .I2(ground_IBUF),
        .I3(\FSM_onehot_state_reg_n_0_[4] ),
        .O(\FSM_onehot_state[4]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'h0F0E)) 
    \FSM_onehot_state[5]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[4] ),
        .I1(walk_right_OBUF),
        .I2(ground_IBUF),
        .I3(\FSM_onehot_state_reg_n_0_[5] ),
        .O(\FSM_onehot_state[5]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "LEFT:000001,RIGHT:001000,FALL_L:000100,DIG_L:000010,FALL_R:100000,DIG_R:010000" *) 
  FDPE #(
    .INIT(1'b1)) 
    \FSM_onehot_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(walk_left_OBUF));
  (* FSM_ENCODED_STATES = "LEFT:000001,RIGHT:001000,FALL_L:000100,DIG_L:000010,FALL_R:100000,DIG_R:010000" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[1]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[1] ));
  (* FSM_ENCODED_STATES = "LEFT:000001,RIGHT:001000,FALL_L:000100,DIG_L:000010,FALL_R:100000,DIG_R:010000" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[2]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[2] ));
  (* FSM_ENCODED_STATES = "LEFT:000001,RIGHT:001000,FALL_L:000100,DIG_L:000010,FALL_R:100000,DIG_R:010000" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[3]_i_1_n_0 ),
        .Q(walk_right_OBUF));
  (* FSM_ENCODED_STATES = "LEFT:000001,RIGHT:001000,FALL_L:000100,DIG_L:000010,FALL_R:100000,DIG_R:010000" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[4]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[4] ));
  (* FSM_ENCODED_STATES = "LEFT:000001,RIGHT:001000,FALL_L:000100,DIG_L:000010,FALL_R:100000,DIG_R:010000" *) 
  FDCE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\FSM_onehot_state[5]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[5] ));
  OBUF aaah_OBUF_inst
       (.I(aaah_OBUF),
        .O(aaah));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'hE)) 
    aaah_OBUF_inst_i_1
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(\FSM_onehot_state_reg_n_0_[5] ),
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
  IBUF dig_IBUF_inst
       (.I(dig),
        .O(dig_IBUF));
  OBUF digging_OBUF_inst
       (.I(digging_OBUF),
        .O(digging));
  LUT2 #(
    .INIT(4'hE)) 
    digging_OBUF_inst_i_1
       (.I0(\FSM_onehot_state_reg_n_0_[1] ),
        .I1(\FSM_onehot_state_reg_n_0_[4] ),
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
