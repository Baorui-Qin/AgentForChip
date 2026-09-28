// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 05:37:40 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob140_fsm_hdlc/eda/run-FGWyNX/build/.rtl-synth-m8k6jo/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* DISC = "4'b0111" *) (* ERR = "4'b1001" *) (* FLAG = "4'b1000" *) 
(* S0 = "4'b0000" *) (* S1 = "4'b0001" *) (* S2 = "4'b0010" *) 
(* S3 = "4'b0011" *) (* S4 = "4'b0100" *) (* S5 = "4'b0101" *) 
(* S6 = "4'b0110" *) 
(* NotValidForBitStream *)
module TopModule
   (clk,
    reset,
    in,
    disc,
    flag,
    err);
  input clk;
  input reset;
  input in;
  output disc;
  output flag;
  output err;

  wire \FSM_onehot_state[0]_i_1_n_0 ;
  wire \FSM_onehot_state[0]_i_2_n_0 ;
  wire \FSM_onehot_state[1]_i_1_n_0 ;
  wire \FSM_onehot_state[2]_i_1_n_0 ;
  wire \FSM_onehot_state[3]_i_1_n_0 ;
  wire \FSM_onehot_state[4]_i_1_n_0 ;
  wire \FSM_onehot_state[5]_i_1_n_0 ;
  wire \FSM_onehot_state[6]_i_1_n_0 ;
  wire \FSM_onehot_state[7]_i_1_n_0 ;
  wire \FSM_onehot_state[8]_i_1_n_0 ;
  wire \FSM_onehot_state[9]_i_1_n_0 ;
  wire \FSM_onehot_state_reg_n_0_[0] ;
  wire \FSM_onehot_state_reg_n_0_[1] ;
  wire \FSM_onehot_state_reg_n_0_[2] ;
  wire \FSM_onehot_state_reg_n_0_[3] ;
  wire \FSM_onehot_state_reg_n_0_[4] ;
  wire \FSM_onehot_state_reg_n_0_[5] ;
  wire \FSM_onehot_state_reg_n_0_[6] ;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire disc;
  wire disc_OBUF;
  wire err;
  wire err_OBUF;
  wire flag;
  wire flag_OBUF;
  wire in;
  wire in_IBUF;
  wire reset;
  wire reset_IBUF;

  LUT4 #(
    .INIT(16'h00FE)) 
    \FSM_onehot_state[0]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[4] ),
        .I1(\FSM_onehot_state[0]_i_2_n_0 ),
        .I2(\FSM_onehot_state_reg_n_0_[3] ),
        .I3(in_IBUF),
        .O(\FSM_onehot_state[0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFFFFFFFFFFFFE)) 
    \FSM_onehot_state[0]_i_2 
       (.I0(\FSM_onehot_state_reg_n_0_[1] ),
        .I1(flag_OBUF),
        .I2(disc_OBUF),
        .I3(\FSM_onehot_state_reg_n_0_[0] ),
        .I4(\FSM_onehot_state_reg_n_0_[2] ),
        .I5(err_OBUF),
        .O(\FSM_onehot_state[0]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'hFE00)) 
    \FSM_onehot_state[1]_i_1 
       (.I0(flag_OBUF),
        .I1(disc_OBUF),
        .I2(\FSM_onehot_state_reg_n_0_[0] ),
        .I3(in_IBUF),
        .O(\FSM_onehot_state[1]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[2]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[1] ),
        .I1(in_IBUF),
        .O(\FSM_onehot_state[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[3]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(in_IBUF),
        .O(\FSM_onehot_state[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[4]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[3] ),
        .I1(in_IBUF),
        .O(\FSM_onehot_state[4]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[5]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[4] ),
        .I1(in_IBUF),
        .O(\FSM_onehot_state[5]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[6]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[5] ),
        .I1(in_IBUF),
        .O(\FSM_onehot_state[6]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hE0)) 
    \FSM_onehot_state[7]_i_1 
       (.I0(err_OBUF),
        .I1(\FSM_onehot_state_reg_n_0_[6] ),
        .I2(in_IBUF),
        .O(\FSM_onehot_state[7]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \FSM_onehot_state[8]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[6] ),
        .I1(in_IBUF),
        .O(\FSM_onehot_state[8]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \FSM_onehot_state[9]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[5] ),
        .I1(in_IBUF),
        .O(\FSM_onehot_state[9]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDSE #(
    .INIT(1'b1)) 
    \FSM_onehot_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[0]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[0] ),
        .S(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[1]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[1] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[2]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[2] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[3]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[3] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[4]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[4] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[5]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[5] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[6]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[6] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[7]_i_1_n_0 ),
        .Q(err_OBUF),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[8]_i_1_n_0 ),
        .Q(flag_OBUF),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000001000,S4:0000010000,S2:0000000100,S1:0000000010,S0:0000000001,DISC:1000000000,ERR:0010000000,S6:0001000000,FLAG:0100000000,S5:0000100000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[9]_i_1_n_0 ),
        .Q(disc_OBUF),
        .R(reset_IBUF));
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
  OBUF disc_OBUF_inst
       (.I(disc_OBUF),
        .O(disc));
  OBUF err_OBUF_inst
       (.I(err_OBUF),
        .O(err));
  OBUF flag_OBUF_inst
       (.I(flag_OBUF),
        .O(flag));
  IBUF in_IBUF_inst
       (.I(in),
        .O(in_IBUF));
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
