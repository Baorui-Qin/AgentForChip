// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Tue Sep 22 21:38:36 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p100-0922-c3/compare-Prob151_review2015_fsm/eda/run-TFB4Px/build/.rtl-synth-08vUTR/netlist.v
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
    data,
    done_counting,
    ack,
    shift_ena,
    counting,
    done);
  input clk;
  input reset;
  input data;
  input done_counting;
  input ack;
  output shift_ena;
  output counting;
  output done;

  wire \FSM_onehot_state[0]_i_1_n_0 ;
  wire \FSM_onehot_state[1]_i_1_n_0 ;
  wire \FSM_onehot_state[2]_i_1_n_0 ;
  wire \FSM_onehot_state[4]_i_1_n_0 ;
  wire \FSM_onehot_state[5]_i_1_n_0 ;
  wire \FSM_onehot_state[7]_i_1_n_0 ;
  wire \FSM_onehot_state[8]_i_1_n_0 ;
  wire \FSM_onehot_state_reg_n_0_[0] ;
  wire \FSM_onehot_state_reg_n_0_[1] ;
  wire \FSM_onehot_state_reg_n_0_[2] ;
  wire \FSM_onehot_state_reg_n_0_[3] ;
  wire \FSM_onehot_state_reg_n_0_[4] ;
  wire \FSM_onehot_state_reg_n_0_[5] ;
  wire \FSM_onehot_state_reg_n_0_[6] ;
  wire ack;
  wire ack_IBUF;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire counting;
  wire counting_OBUF;
  wire data;
  wire data_IBUF;
  wire done;
  wire done_OBUF;
  wire done_counting;
  wire done_counting_IBUF;
  wire p_0_in;
  wire reset;
  wire reset_IBUF;
  wire shift_ena;
  wire shift_ena_OBUF;

  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \FSM_onehot_state[0]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[4] ),
        .I1(data_IBUF),
        .O(\FSM_onehot_state[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[1]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[0] ),
        .I1(data_IBUF),
        .O(\FSM_onehot_state[1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h8888FFFF8888FFF8)) 
    \FSM_onehot_state[2]_i_1 
       (.I0(done_OBUF),
        .I1(ack_IBUF),
        .I2(\FSM_onehot_state_reg_n_0_[5] ),
        .I3(\FSM_onehot_state_reg_n_0_[0] ),
        .I4(data_IBUF),
        .I5(\FSM_onehot_state_reg_n_0_[2] ),
        .O(\FSM_onehot_state[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hC8)) 
    \FSM_onehot_state[4]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[4] ),
        .I1(data_IBUF),
        .I2(\FSM_onehot_state_reg_n_0_[5] ),
        .O(\FSM_onehot_state[4]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[5]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(data_IBUF),
        .O(\FSM_onehot_state[5]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hBA)) 
    \FSM_onehot_state[7]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[6] ),
        .I1(done_counting_IBUF),
        .I2(counting_OBUF),
        .O(\FSM_onehot_state[7]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h8F88)) 
    \FSM_onehot_state[8]_i_1 
       (.I0(done_counting_IBUF),
        .I1(counting_OBUF),
        .I2(ack_IBUF),
        .I3(done_OBUF),
        .O(\FSM_onehot_state[8]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[0]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[0] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[1]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[1] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDSE #(
    .INIT(1'b1)) 
    \FSM_onehot_state_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[2]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[2] ),
        .S(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state_reg_n_0_[1] ),
        .Q(\FSM_onehot_state_reg_n_0_[3] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[4]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[4] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[5]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[5] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in),
        .Q(\FSM_onehot_state_reg_n_0_[6] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[7]_i_1_n_0 ),
        .Q(counting_OBUF),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[8]_i_1_n_0 ),
        .Q(done_OBUF),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S3:0000000001,SHIFT1:0000000010,S2:0000010000,S1:0000100000,S0:0000000100,SHIFT4:0001000000,DONE:0100000000,COUNT:0010000000,SHIFT3:1000000000,SHIFT2:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state_reg_n_0_[3] ),
        .Q(p_0_in),
        .R(reset_IBUF));
  IBUF ack_IBUF_inst
       (.I(ack),
        .O(ack_IBUF));
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
  OBUF counting_OBUF_inst
       (.I(counting_OBUF),
        .O(counting));
  IBUF data_IBUF_inst
       (.I(data),
        .O(data_IBUF));
  OBUF done_OBUF_inst
       (.I(done_OBUF),
        .O(done));
  IBUF done_counting_IBUF_inst
       (.I(done_counting),
        .O(done_counting_IBUF));
  IBUF reset_IBUF_inst
       (.I(reset),
        .O(reset_IBUF));
  OBUF shift_ena_OBUF_inst
       (.I(shift_ena_OBUF),
        .O(shift_ena));
  LUT4 #(
    .INIT(16'hFFFE)) 
    shift_ena_OBUF_inst_i_1
       (.I0(\FSM_onehot_state_reg_n_0_[6] ),
        .I1(\FSM_onehot_state_reg_n_0_[1] ),
        .I2(\FSM_onehot_state_reg_n_0_[3] ),
        .I3(p_0_in),
        .O(shift_ena_OBUF));
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
