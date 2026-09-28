// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 05:46:38 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob146_fsm_serialdata/eda/run-BLfz8B/build/.rtl-synth-ZXQdmy/netlist.v
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

  wire \FSM_sequential_state[0]_i_2_n_0 ;
  wire [0:0]bit_cnt;
  wire \bit_cnt[0]_i_1_n_0 ;
  wire \bit_cnt[1]_i_1_n_0 ;
  wire \bit_cnt[2]_i_2_n_0 ;
  wire \bit_cnt_reg_n_0_[0] ;
  wire \bit_cnt_reg_n_0_[1] ;
  wire \bit_cnt_reg_n_0_[2] ;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [0:0]data_reg;
  wire [7:7]data_reg0_in;
  wire \data_reg[0]_i_1_n_0 ;
  wire \data_reg[1]_i_1_n_0 ;
  wire \data_reg[2]_i_1_n_0 ;
  wire \data_reg[3]_i_1_n_0 ;
  wire \data_reg[4]_i_1_n_0 ;
  wire \data_reg[5]_i_1_n_0 ;
  wire \data_reg[6]_i_1_n_0 ;
  wire \data_reg[7]_i_1_n_0 ;
  wire \data_reg[7]_i_3_n_0 ;
  wire \data_reg_reg_n_0_[0] ;
  wire \data_reg_reg_n_0_[1] ;
  wire \data_reg_reg_n_0_[2] ;
  wire \data_reg_reg_n_0_[3] ;
  wire \data_reg_reg_n_0_[4] ;
  wire \data_reg_reg_n_0_[5] ;
  wire \data_reg_reg_n_0_[6] ;
  wire \data_reg_reg_n_0_[7] ;
  wire done;
  wire done_OBUF;
  wire in;
  wire in_IBUF;
  wire [2:0]next_state;
  wire [7:0]out_byte;
  wire \out_byte[7]_i_1_n_0 ;
  wire [7:0]out_byte_OBUF;
  wire reset;
  wire reset_IBUF;
  wire [2:0]state;

  LUT6 #(
    .INIT(64'h000000400000004F)) 
    \FSM_sequential_state[0]_i_1 
       (.I0(\FSM_sequential_state[0]_i_2_n_0 ),
        .I1(\bit_cnt_reg_n_0_[2] ),
        .I2(state[1]),
        .I3(state[2]),
        .I4(state[0]),
        .I5(in_IBUF),
        .O(next_state[0]));
  LUT2 #(
    .INIT(4'h7)) 
    \FSM_sequential_state[0]_i_2 
       (.I0(\bit_cnt_reg_n_0_[0] ),
        .I1(\bit_cnt_reg_n_0_[1] ),
        .O(\FSM_sequential_state[0]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'h06)) 
    \FSM_sequential_state[1]_i_1 
       (.I0(state[0]),
        .I1(state[1]),
        .I2(state[2]),
        .O(next_state[1]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'h0F08)) 
    \FSM_sequential_state[2]_i_1 
       (.I0(state[0]),
        .I1(state[1]),
        .I2(in_IBUF),
        .I3(state[2]),
        .O(next_state[2]));
  (* FSM_ENCODED_STATES = "START:001,DATA:010,STOP:011,WAIT:100,IDLE:000" *) 
  FDRE \FSM_sequential_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(next_state[0]),
        .Q(state[0]),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "START:001,DATA:010,STOP:011,WAIT:100,IDLE:000" *) 
  FDRE \FSM_sequential_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(next_state[1]),
        .Q(state[1]),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "START:001,DATA:010,STOP:011,WAIT:100,IDLE:000" *) 
  FDRE \FSM_sequential_state_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(next_state[2]),
        .Q(state[2]),
        .R(reset_IBUF));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT4 #(
    .INIT(16'h00BA)) 
    \bit_cnt[0]_i_1 
       (.I0(state[0]),
        .I1(\bit_cnt_reg_n_0_[0] ),
        .I2(state[1]),
        .I3(state[2]),
        .O(\bit_cnt[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h0220)) 
    \bit_cnt[1]_i_1 
       (.I0(state[1]),
        .I1(state[2]),
        .I2(\bit_cnt_reg_n_0_[0] ),
        .I3(\bit_cnt_reg_n_0_[1] ),
        .O(\bit_cnt[1]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'h17)) 
    \bit_cnt[2]_i_1 
       (.I0(state[2]),
        .I1(state[1]),
        .I2(state[0]),
        .O(bit_cnt));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h07000800)) 
    \bit_cnt[2]_i_2 
       (.I0(\bit_cnt_reg_n_0_[0] ),
        .I1(\bit_cnt_reg_n_0_[1] ),
        .I2(state[2]),
        .I3(state[1]),
        .I4(\bit_cnt_reg_n_0_[2] ),
        .O(\bit_cnt[2]_i_2_n_0 ));
  FDRE \bit_cnt_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(bit_cnt),
        .D(\bit_cnt[0]_i_1_n_0 ),
        .Q(\bit_cnt_reg_n_0_[0] ),
        .R(reset_IBUF));
  FDRE \bit_cnt_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(bit_cnt),
        .D(\bit_cnt[1]_i_1_n_0 ),
        .Q(\bit_cnt_reg_n_0_[1] ),
        .R(reset_IBUF));
  FDRE \bit_cnt_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(bit_cnt),
        .D(\bit_cnt[2]_i_2_n_0 ),
        .Q(\bit_cnt_reg_n_0_[2] ),
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
  LUT4 #(
    .INIT(16'h2F20)) 
    \data_reg[0]_i_1 
       (.I0(in_IBUF),
        .I1(state[2]),
        .I2(data_reg),
        .I3(\data_reg_reg_n_0_[0] ),
        .O(\data_reg[0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h000000000001FF00)) 
    \data_reg[0]_i_2 
       (.I0(\bit_cnt_reg_n_0_[0] ),
        .I1(\bit_cnt_reg_n_0_[1] ),
        .I2(\bit_cnt_reg_n_0_[2] ),
        .I3(state[0]),
        .I4(state[1]),
        .I5(state[2]),
        .O(data_reg));
  LUT6 #(
    .INIT(64'hFFFBFFFF00080000)) 
    \data_reg[1]_i_1 
       (.I0(data_reg0_in),
        .I1(\bit_cnt_reg_n_0_[0] ),
        .I2(\bit_cnt_reg_n_0_[1] ),
        .I3(\bit_cnt_reg_n_0_[2] ),
        .I4(\data_reg[7]_i_3_n_0 ),
        .I5(\data_reg_reg_n_0_[1] ),
        .O(\data_reg[1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFEFFFFF00200000)) 
    \data_reg[2]_i_1 
       (.I0(data_reg0_in),
        .I1(\bit_cnt_reg_n_0_[2] ),
        .I2(\bit_cnt_reg_n_0_[1] ),
        .I3(\bit_cnt_reg_n_0_[0] ),
        .I4(\data_reg[7]_i_3_n_0 ),
        .I5(\data_reg_reg_n_0_[2] ),
        .O(\data_reg[2]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hEFFFFFFF20000000)) 
    \data_reg[3]_i_1 
       (.I0(data_reg0_in),
        .I1(\bit_cnt_reg_n_0_[2] ),
        .I2(\bit_cnt_reg_n_0_[0] ),
        .I3(\bit_cnt_reg_n_0_[1] ),
        .I4(\data_reg[7]_i_3_n_0 ),
        .I5(\data_reg_reg_n_0_[3] ),
        .O(\data_reg[3]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFEFFFFF00200000)) 
    \data_reg[4]_i_1 
       (.I0(data_reg0_in),
        .I1(\bit_cnt_reg_n_0_[1] ),
        .I2(\bit_cnt_reg_n_0_[2] ),
        .I3(\bit_cnt_reg_n_0_[0] ),
        .I4(\data_reg[7]_i_3_n_0 ),
        .I5(\data_reg_reg_n_0_[4] ),
        .O(\data_reg[4]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFBFFFFF00800000)) 
    \data_reg[5]_i_1 
       (.I0(data_reg0_in),
        .I1(\bit_cnt_reg_n_0_[0] ),
        .I2(\bit_cnt_reg_n_0_[2] ),
        .I3(\bit_cnt_reg_n_0_[1] ),
        .I4(\data_reg[7]_i_3_n_0 ),
        .I5(\data_reg_reg_n_0_[5] ),
        .O(\data_reg[5]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFBFFFFF00800000)) 
    \data_reg[6]_i_1 
       (.I0(data_reg0_in),
        .I1(\bit_cnt_reg_n_0_[2] ),
        .I2(\bit_cnt_reg_n_0_[1] ),
        .I3(\bit_cnt_reg_n_0_[0] ),
        .I4(\data_reg[7]_i_3_n_0 ),
        .I5(\data_reg_reg_n_0_[6] ),
        .O(\data_reg[6]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hBFFFFFFF80000000)) 
    \data_reg[7]_i_1 
       (.I0(data_reg0_in),
        .I1(\data_reg[7]_i_3_n_0 ),
        .I2(\bit_cnt_reg_n_0_[2] ),
        .I3(\bit_cnt_reg_n_0_[0] ),
        .I4(\bit_cnt_reg_n_0_[1] ),
        .I5(\data_reg_reg_n_0_[7] ),
        .O(\data_reg[7]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'h40)) 
    \data_reg[7]_i_2 
       (.I0(state[2]),
        .I1(state[1]),
        .I2(in_IBUF),
        .O(data_reg0_in));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'h04)) 
    \data_reg[7]_i_3 
       (.I0(state[2]),
        .I1(state[1]),
        .I2(state[0]),
        .O(\data_reg[7]_i_3_n_0 ));
  FDRE \data_reg_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\data_reg[0]_i_1_n_0 ),
        .Q(\data_reg_reg_n_0_[0] ),
        .R(reset_IBUF));
  FDRE \data_reg_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\data_reg[1]_i_1_n_0 ),
        .Q(\data_reg_reg_n_0_[1] ),
        .R(reset_IBUF));
  FDRE \data_reg_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\data_reg[2]_i_1_n_0 ),
        .Q(\data_reg_reg_n_0_[2] ),
        .R(reset_IBUF));
  FDRE \data_reg_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\data_reg[3]_i_1_n_0 ),
        .Q(\data_reg_reg_n_0_[3] ),
        .R(reset_IBUF));
  FDRE \data_reg_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\data_reg[4]_i_1_n_0 ),
        .Q(\data_reg_reg_n_0_[4] ),
        .R(reset_IBUF));
  FDRE \data_reg_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\data_reg[5]_i_1_n_0 ),
        .Q(\data_reg_reg_n_0_[5] ),
        .R(reset_IBUF));
  FDRE \data_reg_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\data_reg[6]_i_1_n_0 ),
        .Q(\data_reg_reg_n_0_[6] ),
        .R(reset_IBUF));
  FDRE \data_reg_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\data_reg[7]_i_1_n_0 ),
        .Q(\data_reg_reg_n_0_[7] ),
        .R(reset_IBUF));
  OBUF done_OBUF_inst
       (.I(done_OBUF),
        .O(done));
  FDRE done_reg
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out_byte[7]_i_1_n_0 ),
        .Q(done_OBUF),
        .R(reset_IBUF));
  IBUF in_IBUF_inst
       (.I(in),
        .O(in_IBUF));
  LUT4 #(
    .INIT(16'h0800)) 
    \out_byte[7]_i_1 
       (.I0(in_IBUF),
        .I1(state[0]),
        .I2(state[2]),
        .I3(state[1]),
        .O(\out_byte[7]_i_1_n_0 ));
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
        .CE(\out_byte[7]_i_1_n_0 ),
        .D(\data_reg_reg_n_0_[0] ),
        .Q(out_byte_OBUF[0]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_byte[7]_i_1_n_0 ),
        .D(\data_reg_reg_n_0_[1] ),
        .Q(out_byte_OBUF[1]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_byte[7]_i_1_n_0 ),
        .D(\data_reg_reg_n_0_[2] ),
        .Q(out_byte_OBUF[2]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_byte[7]_i_1_n_0 ),
        .D(\data_reg_reg_n_0_[3] ),
        .Q(out_byte_OBUF[3]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_byte[7]_i_1_n_0 ),
        .D(\data_reg_reg_n_0_[4] ),
        .Q(out_byte_OBUF[4]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_byte[7]_i_1_n_0 ),
        .D(\data_reg_reg_n_0_[5] ),
        .Q(out_byte_OBUF[5]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_byte[7]_i_1_n_0 ),
        .D(\data_reg_reg_n_0_[6] ),
        .Q(out_byte_OBUF[6]),
        .R(reset_IBUF));
  FDRE \out_byte_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_byte[7]_i_1_n_0 ),
        .D(\data_reg_reg_n_0_[7] ),
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
