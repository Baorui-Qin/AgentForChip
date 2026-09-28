// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Mon Sep 28 00:09:50 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob146_fsm_serialdata/eda/run-YgjQz3/build/.rtl-synth-WTQhTo/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* DATA = "3'b010" *) (* IDLE = "3'b000" *) (* START = "3'b001" *) 
(* STOP = "3'b011" *) (* WAIT = "3'b100" *) 
(* NotValidForBitStream *)
module TopModule
   (clk,
    in,
    reset,
    out_byte,
    done);
  input clk;
  input in;
  input reset;
  output [7:0]out_byte;
  output done;

  wire \FSM_onehot_state[0]_i_1_n_0 ;
  wire \FSM_onehot_state[1]_i_1_n_0 ;
  wire \FSM_onehot_state[2]_i_1_n_0 ;
  wire \FSM_onehot_state[3]_i_1_n_0 ;
  wire \FSM_onehot_state[4]_i_1_n_0 ;
  wire \FSM_onehot_state_reg_n_0_[0] ;
  wire \FSM_onehot_state_reg_n_0_[1] ;
  wire \FSM_onehot_state_reg_n_0_[2] ;
  wire \FSM_onehot_state_reg_n_0_[3] ;
  wire \FSM_onehot_state_reg_n_0_[4] ;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire \cnt[0]_i_1_n_0 ;
  wire \cnt[1]_i_1_n_0 ;
  wire \cnt[2]_i_1_n_0 ;
  wire \cnt[3]_i_1_n_0 ;
  wire \cnt[3]_i_2_n_0 ;
  wire \cnt_reg_n_0_[0] ;
  wire \cnt_reg_n_0_[1] ;
  wire \cnt_reg_n_0_[2] ;
  wire \cnt_reg_n_0_[3] ;
  wire [6:0]data0_in;
  wire \data_reg_n_0_[0] ;
  wire done;
  wire done_OBUF;
  wire done_i_1_n_0;
  wire in;
  wire in_IBUF;
  wire [7:0]out_byte;
  wire [7:0]out_byte_OBUF;
  wire reset;
  wire reset_IBUF;

  LUT4 #(
    .INIT(16'hF0E0)) 
    \FSM_onehot_state[0]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[3] ),
        .I1(\FSM_onehot_state_reg_n_0_[0] ),
        .I2(in_IBUF),
        .I3(\FSM_onehot_state_reg_n_0_[4] ),
        .O(\FSM_onehot_state[0]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \FSM_onehot_state[1]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[0] ),
        .I1(in_IBUF),
        .O(\FSM_onehot_state[1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFFFBFAAAAAAAA)) 
    \FSM_onehot_state[2]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[1] ),
        .I1(\cnt_reg_n_0_[1] ),
        .I2(\cnt_reg_n_0_[2] ),
        .I3(\cnt_reg_n_0_[0] ),
        .I4(\cnt_reg_n_0_[3] ),
        .I5(\FSM_onehot_state_reg_n_0_[2] ),
        .O(\FSM_onehot_state[2]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000080)) 
    \FSM_onehot_state[3]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(\cnt_reg_n_0_[2] ),
        .I2(\cnt_reg_n_0_[1] ),
        .I3(\cnt_reg_n_0_[0] ),
        .I4(\cnt_reg_n_0_[3] ),
        .O(\FSM_onehot_state[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'h32)) 
    \FSM_onehot_state[4]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[3] ),
        .I1(in_IBUF),
        .I2(\FSM_onehot_state_reg_n_0_[4] ),
        .O(\FSM_onehot_state[4]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "START:00010,DATA:00100,STOP:01000,WAIT:10000,IDLE:00001" *) 
  FDSE #(
    .INIT(1'b1)) 
    \FSM_onehot_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[0]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[0] ),
        .S(reset_IBUF));
  (* FSM_ENCODED_STATES = "START:00010,DATA:00100,STOP:01000,WAIT:10000,IDLE:00001" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[1]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[1] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "START:00010,DATA:00100,STOP:01000,WAIT:10000,IDLE:00001" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[2]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[2] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "START:00010,DATA:00100,STOP:01000,WAIT:10000,IDLE:00001" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[3]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[3] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "START:00010,DATA:00100,STOP:01000,WAIT:10000,IDLE:00001" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[4]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[4] ),
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
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \cnt[0]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(\cnt_reg_n_0_[0] ),
        .O(\cnt[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'h28)) 
    \cnt[1]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(\cnt_reg_n_0_[1] ),
        .I2(\cnt_reg_n_0_[0] ),
        .O(\cnt[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h2888)) 
    \cnt[2]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(\cnt_reg_n_0_[2] ),
        .I2(\cnt_reg_n_0_[1] ),
        .I3(\cnt_reg_n_0_[0] ),
        .O(\cnt[2]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'hE)) 
    \cnt[3]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[1] ),
        .I1(\FSM_onehot_state_reg_n_0_[2] ),
        .O(\cnt[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h28888888)) 
    \cnt[3]_i_2 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(\cnt_reg_n_0_[3] ),
        .I2(\cnt_reg_n_0_[2] ),
        .I3(\cnt_reg_n_0_[0] ),
        .I4(\cnt_reg_n_0_[1] ),
        .O(\cnt[3]_i_2_n_0 ));
  FDRE \cnt_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\cnt[3]_i_1_n_0 ),
        .D(\cnt[0]_i_1_n_0 ),
        .Q(\cnt_reg_n_0_[0] ),
        .R(reset_IBUF));
  FDRE \cnt_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\cnt[3]_i_1_n_0 ),
        .D(\cnt[1]_i_1_n_0 ),
        .Q(\cnt_reg_n_0_[1] ),
        .R(reset_IBUF));
  FDRE \cnt_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\cnt[3]_i_1_n_0 ),
        .D(\cnt[2]_i_1_n_0 ),
        .Q(\cnt_reg_n_0_[2] ),
        .R(reset_IBUF));
  FDRE \cnt_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\cnt[3]_i_1_n_0 ),
        .D(\cnt[3]_i_2_n_0 ),
        .Q(\cnt_reg_n_0_[3] ),
        .R(reset_IBUF));
  FDRE \data_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[2] ),
        .D(data0_in[0]),
        .Q(\data_reg_n_0_[0] ),
        .R(reset_IBUF));
  FDRE \data_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[2] ),
        .D(data0_in[1]),
        .Q(data0_in[0]),
        .R(reset_IBUF));
  FDRE \data_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[2] ),
        .D(data0_in[2]),
        .Q(data0_in[1]),
        .R(reset_IBUF));
  FDRE \data_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[2] ),
        .D(data0_in[3]),
        .Q(data0_in[2]),
        .R(reset_IBUF));
  FDRE \data_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[2] ),
        .D(data0_in[4]),
        .Q(data0_in[3]),
        .R(reset_IBUF));
  FDRE \data_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[2] ),
        .D(data0_in[5]),
        .Q(data0_in[4]),
        .R(reset_IBUF));
  FDRE \data_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[2] ),
        .D(data0_in[6]),
        .Q(data0_in[5]),
        .R(reset_IBUF));
  FDRE \data_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\cnt[3]_i_1_n_0 ),
        .D(in_IBUF),
        .Q(data0_in[6]),
        .R(reset_IBUF));
  OBUF done_OBUF_inst
       (.I(done_OBUF),
        .O(done));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h8)) 
    done_i_1
       (.I0(\FSM_onehot_state_reg_n_0_[3] ),
        .I1(in_IBUF),
        .O(done_i_1_n_0));
  FDRE done_reg
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(done_i_1_n_0),
        .Q(done_OBUF),
        .R(reset_IBUF));
  IBUF in_IBUF_inst
       (.I(in),
        .O(in_IBUF));
  OBUF \out_byte_OBUF[0]_inst 
       (.I(out_byte_OBUF[0]),
        .O(out_byte[0]));
  OBUF \out_byte_OBUF[1]_inst 
       (.I(out_byte_OBUF[1]),
        .O(out_byte[1]));
  OBUF \out_byte_OBUF[2]_inst 
       (.I(out_byte_OBUF[2]),
        .O(out_byte[2]));
  OBUF \out_byte_OBUF[3]_inst 
       (.I(out_byte_OBUF[3]),
        .O(out_byte[3]));
  OBUF \out_byte_OBUF[4]_inst 
       (.I(out_byte_OBUF[4]),
        .O(out_byte[4]));
  OBUF \out_byte_OBUF[5]_inst 
       (.I(out_byte_OBUF[5]),
        .O(out_byte[5]));
  OBUF \out_byte_OBUF[6]_inst 
       (.I(out_byte_OBUF[6]),
        .O(out_byte[6]));
  OBUF \out_byte_OBUF[7]_inst 
       (.I(out_byte_OBUF[7]),
        .O(out_byte[7]));
  FDRE \out_byte_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[3] ),
        .D(\data_reg_n_0_[0] ),
        .Q(out_byte_OBUF[0]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[3] ),
        .D(data0_in[0]),
        .Q(out_byte_OBUF[1]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[3] ),
        .D(data0_in[1]),
        .Q(out_byte_OBUF[2]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[3] ),
        .D(data0_in[2]),
        .Q(out_byte_OBUF[3]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[3] ),
        .D(data0_in[3]),
        .Q(out_byte_OBUF[4]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[3] ),
        .D(data0_in[4]),
        .Q(out_byte_OBUF[5]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[3] ),
        .D(data0_in[5]),
        .Q(out_byte_OBUF[6]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_state_reg_n_0_[3] ),
        .D(data0_in[6]),
        .Q(out_byte_OBUF[7]),
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
