// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 16:58:15 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/netlist-suite-20260927/full-v3/eda/run-wUOpMO/build/.rtl-synth-LEpzFT/netlist.v
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
    count,
    counting,
    done,
    ack);
  input clk;
  input reset;
  input data;
  output [3:0]count;
  output counting;
  output done;
  input ack;

  wire \FSM_onehot_state[0]_i_1_n_0 ;
  wire \FSM_onehot_state[1]_i_1_n_0 ;
  wire \FSM_onehot_state[2]_i_1_n_0 ;
  wire \FSM_onehot_state[4]_i_1_n_0 ;
  wire \FSM_onehot_state[5]_i_1_n_0 ;
  wire \FSM_onehot_state[7]_i_1_n_0 ;
  wire \FSM_onehot_state[8]_i_1_n_0 ;
  wire \FSM_onehot_state[8]_i_2_n_0 ;
  wire \FSM_onehot_state[8]_i_3_n_0 ;
  wire \FSM_onehot_state[8]_i_4_n_0 ;
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
  wire [3:0]count;
  wire [3:0]count_OBUF;
  wire counting;
  wire counting_OBUF;
  wire data;
  wire data_IBUF;
  wire done;
  wire done_OBUF;
  wire \fcount[0]_i_1_n_0 ;
  wire \fcount[1]_i_1_n_0 ;
  wire \fcount[2]_i_1_n_0 ;
  wire \fcount[3]_i_1_n_0 ;
  wire \fcount[4]_i_1_n_0 ;
  wire \fcount[5]_i_1_n_0 ;
  wire \fcount[6]_i_1_n_0 ;
  wire \fcount[6]_i_2_n_0 ;
  wire \fcount[7]_i_1_n_0 ;
  wire \fcount[8]_i_1_n_0 ;
  wire \fcount[9]_i_1_n_0 ;
  wire \fcount[9]_i_2_n_0 ;
  wire \fcount[9]_i_3_n_0 ;
  wire [9:0]fcount_reg;
  wire p_0_in;
  wire [3:0]p_0_in__0;
  wire reset;
  wire reset_IBUF;
  wire \scount[3]_i_1_n_0 ;
  wire shift_ena;

  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \FSM_onehot_state[0]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[4] ),
        .I1(data_IBUF),
        .O(\FSM_onehot_state[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[1]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[0] ),
        .I1(data_IBUF),
        .O(\FSM_onehot_state[1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFFF00FE00FE00FE)) 
    \FSM_onehot_state[2]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(\FSM_onehot_state_reg_n_0_[0] ),
        .I2(\FSM_onehot_state_reg_n_0_[5] ),
        .I3(data_IBUF),
        .I4(done_OBUF),
        .I5(ack_IBUF),
        .O(\FSM_onehot_state[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT3 #(
    .INIT(8'hC8)) 
    \FSM_onehot_state[4]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[5] ),
        .I1(data_IBUF),
        .I2(\FSM_onehot_state_reg_n_0_[4] ),
        .O(\FSM_onehot_state[4]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \FSM_onehot_state[5]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[2] ),
        .I1(data_IBUF),
        .O(\FSM_onehot_state[5]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF7F00)) 
    \FSM_onehot_state[7]_i_1 
       (.I0(\FSM_onehot_state[8]_i_2_n_0 ),
        .I1(\FSM_onehot_state[8]_i_3_n_0 ),
        .I2(\FSM_onehot_state[8]_i_4_n_0 ),
        .I3(counting_OBUF),
        .I4(\FSM_onehot_state_reg_n_0_[6] ),
        .O(\FSM_onehot_state[7]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hF444444444444444)) 
    \FSM_onehot_state[8]_i_1 
       (.I0(ack_IBUF),
        .I1(done_OBUF),
        .I2(\FSM_onehot_state[8]_i_2_n_0 ),
        .I3(\FSM_onehot_state[8]_i_3_n_0 ),
        .I4(\FSM_onehot_state[8]_i_4_n_0 ),
        .I5(counting_OBUF),
        .O(\FSM_onehot_state[8]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'h0001)) 
    \FSM_onehot_state[8]_i_2 
       (.I0(count_OBUF[3]),
        .I1(count_OBUF[2]),
        .I2(count_OBUF[1]),
        .I3(count_OBUF[0]),
        .O(\FSM_onehot_state[8]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT4 #(
    .INIT(16'h0800)) 
    \FSM_onehot_state[8]_i_3 
       (.I0(fcount_reg[1]),
        .I1(fcount_reg[0]),
        .I2(fcount_reg[3]),
        .I3(fcount_reg[2]),
        .O(\FSM_onehot_state[8]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h2000000000000000)) 
    \FSM_onehot_state[8]_i_4 
       (.I0(fcount_reg[5]),
        .I1(fcount_reg[4]),
        .I2(fcount_reg[6]),
        .I3(fcount_reg[7]),
        .I4(fcount_reg[9]),
        .I5(fcount_reg[8]),
        .O(\FSM_onehot_state[8]_i_4_n_0 ));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[0]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[0] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[1]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[1] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
  FDSE #(
    .INIT(1'b1)) 
    \FSM_onehot_state_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[2]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[2] ),
        .S(reset_IBUF));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state_reg_n_0_[1] ),
        .Q(\FSM_onehot_state_reg_n_0_[3] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[4]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[4] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[5]_i_1_n_0 ),
        .Q(\FSM_onehot_state_reg_n_0_[5] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in),
        .Q(\FSM_onehot_state_reg_n_0_[6] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[7]_i_1_n_0 ),
        .Q(counting_OBUF),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_state_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\FSM_onehot_state[8]_i_1_n_0 ),
        .Q(done_OBUF),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "S110:0000000001,B0:0000000010,S11:0000010000,S1:0000100000,S:0000000100,B3:0001000000,Wait:0100000000,Count:0010000000,B2:1000000000,B1:0000001000" *) 
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
  OBUF \count_OBUF[0]_inst 
       (.I(count_OBUF[0]),
        .O(count[0]));
  OBUF \count_OBUF[1]_inst 
       (.I(count_OBUF[1]),
        .O(count[1]));
  OBUF \count_OBUF[2]_inst 
       (.I(count_OBUF[2]),
        .O(count[2]));
  OBUF \count_OBUF[3]_inst 
       (.I(count_OBUF[3]),
        .O(count[3]));
  OBUF counting_OBUF_inst
       (.I(counting_OBUF),
        .O(counting));
  IBUF data_IBUF_inst
       (.I(data),
        .O(data_IBUF));
  OBUF done_OBUF_inst
       (.I(done_OBUF),
        .O(done));
  LUT1 #(
    .INIT(2'h1)) 
    \fcount[0]_i_1 
       (.I0(fcount_reg[0]),
        .O(\fcount[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \fcount[1]_i_1 
       (.I0(fcount_reg[0]),
        .I1(fcount_reg[1]),
        .O(\fcount[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'h78)) 
    \fcount[2]_i_1 
       (.I0(fcount_reg[1]),
        .I1(fcount_reg[0]),
        .I2(fcount_reg[2]),
        .O(\fcount[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'h7F80)) 
    \fcount[3]_i_1 
       (.I0(fcount_reg[0]),
        .I1(fcount_reg[1]),
        .I2(fcount_reg[2]),
        .I3(fcount_reg[3]),
        .O(\fcount[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT5 #(
    .INIT(32'h7FFF8000)) 
    \fcount[4]_i_1 
       (.I0(fcount_reg[2]),
        .I1(fcount_reg[1]),
        .I2(fcount_reg[0]),
        .I3(fcount_reg[3]),
        .I4(fcount_reg[4]),
        .O(\fcount[4]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h7FFFFFFF80000000)) 
    \fcount[5]_i_1 
       (.I0(fcount_reg[3]),
        .I1(fcount_reg[0]),
        .I2(fcount_reg[1]),
        .I3(fcount_reg[2]),
        .I4(fcount_reg[4]),
        .I5(fcount_reg[5]),
        .O(\fcount[5]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h7FFFFFFF80000000)) 
    \fcount[6]_i_1 
       (.I0(fcount_reg[4]),
        .I1(fcount_reg[2]),
        .I2(\fcount[6]_i_2_n_0 ),
        .I3(fcount_reg[3]),
        .I4(fcount_reg[5]),
        .I5(fcount_reg[6]),
        .O(\fcount[6]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \fcount[6]_i_2 
       (.I0(fcount_reg[0]),
        .I1(fcount_reg[1]),
        .O(\fcount[6]_i_2_n_0 ));
  LUT3 #(
    .INIT(8'h78)) 
    \fcount[7]_i_1 
       (.I0(\fcount[9]_i_3_n_0 ),
        .I1(fcount_reg[6]),
        .I2(fcount_reg[7]),
        .O(\fcount[7]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h7F80)) 
    \fcount[8]_i_1 
       (.I0(fcount_reg[6]),
        .I1(\fcount[9]_i_3_n_0 ),
        .I2(fcount_reg[7]),
        .I3(fcount_reg[8]),
        .O(\fcount[8]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h08000000FFFFFFFF)) 
    \fcount[9]_i_1 
       (.I0(fcount_reg[1]),
        .I1(fcount_reg[0]),
        .I2(fcount_reg[3]),
        .I3(fcount_reg[2]),
        .I4(\FSM_onehot_state[8]_i_4_n_0 ),
        .I5(counting_OBUF),
        .O(\fcount[9]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h7FFF8000)) 
    \fcount[9]_i_2 
       (.I0(fcount_reg[7]),
        .I1(\fcount[9]_i_3_n_0 ),
        .I2(fcount_reg[6]),
        .I3(fcount_reg[8]),
        .I4(fcount_reg[9]),
        .O(\fcount[9]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h8000000000000000)) 
    \fcount[9]_i_3 
       (.I0(fcount_reg[5]),
        .I1(fcount_reg[3]),
        .I2(fcount_reg[0]),
        .I3(fcount_reg[1]),
        .I4(fcount_reg[2]),
        .I5(fcount_reg[4]),
        .O(\fcount[9]_i_3_n_0 ));
  FDRE \fcount_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[0]_i_1_n_0 ),
        .Q(fcount_reg[0]),
        .R(\fcount[9]_i_1_n_0 ));
  FDRE \fcount_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[1]_i_1_n_0 ),
        .Q(fcount_reg[1]),
        .R(\fcount[9]_i_1_n_0 ));
  FDRE \fcount_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[2]_i_1_n_0 ),
        .Q(fcount_reg[2]),
        .R(\fcount[9]_i_1_n_0 ));
  FDRE \fcount_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[3]_i_1_n_0 ),
        .Q(fcount_reg[3]),
        .R(\fcount[9]_i_1_n_0 ));
  FDRE \fcount_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[4]_i_1_n_0 ),
        .Q(fcount_reg[4]),
        .R(\fcount[9]_i_1_n_0 ));
  FDRE \fcount_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[5]_i_1_n_0 ),
        .Q(fcount_reg[5]),
        .R(\fcount[9]_i_1_n_0 ));
  FDRE \fcount_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[6]_i_1_n_0 ),
        .Q(fcount_reg[6]),
        .R(\fcount[9]_i_1_n_0 ));
  FDRE \fcount_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[7]_i_1_n_0 ),
        .Q(fcount_reg[7]),
        .R(\fcount[9]_i_1_n_0 ));
  FDRE \fcount_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[8]_i_1_n_0 ),
        .Q(fcount_reg[8]),
        .R(\fcount[9]_i_1_n_0 ));
  FDRE \fcount_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\fcount[9]_i_2_n_0 ),
        .Q(fcount_reg[9]),
        .R(\fcount[9]_i_1_n_0 ));
  IBUF reset_IBUF_inst
       (.I(reset),
        .O(reset_IBUF));
  LUT6 #(
    .INIT(64'hAAAAAAA8AAAAAAAB)) 
    \scount[0]_i_1 
       (.I0(data_IBUF),
        .I1(\FSM_onehot_state_reg_n_0_[3] ),
        .I2(p_0_in),
        .I3(\FSM_onehot_state_reg_n_0_[6] ),
        .I4(\FSM_onehot_state_reg_n_0_[1] ),
        .I5(count_OBUF[0]),
        .O(p_0_in__0[0]));
  LUT6 #(
    .INIT(64'hFFFFFFFE00000001)) 
    \scount[1]_i_1 
       (.I0(\FSM_onehot_state_reg_n_0_[3] ),
        .I1(p_0_in),
        .I2(\FSM_onehot_state_reg_n_0_[6] ),
        .I3(\FSM_onehot_state_reg_n_0_[1] ),
        .I4(count_OBUF[1]),
        .I5(count_OBUF[0]),
        .O(p_0_in__0[1]));
  LUT4 #(
    .INIT(16'hFA09)) 
    \scount[2]_i_1 
       (.I0(count_OBUF[2]),
        .I1(count_OBUF[0]),
        .I2(shift_ena),
        .I3(count_OBUF[1]),
        .O(p_0_in__0[2]));
  LUT6 #(
    .INIT(64'hFFFFFFFF08000000)) 
    \scount[3]_i_1 
       (.I0(\FSM_onehot_state[8]_i_4_n_0 ),
        .I1(fcount_reg[2]),
        .I2(fcount_reg[3]),
        .I3(\fcount[6]_i_2_n_0 ),
        .I4(counting_OBUF),
        .I5(shift_ena),
        .O(\scount[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'hFFAA00A9)) 
    \scount[3]_i_2 
       (.I0(count_OBUF[3]),
        .I1(count_OBUF[1]),
        .I2(count_OBUF[0]),
        .I3(shift_ena),
        .I4(count_OBUF[2]),
        .O(p_0_in__0[3]));
  LUT4 #(
    .INIT(16'hFFFE)) 
    \scount[3]_i_3 
       (.I0(\FSM_onehot_state_reg_n_0_[3] ),
        .I1(p_0_in),
        .I2(\FSM_onehot_state_reg_n_0_[6] ),
        .I3(\FSM_onehot_state_reg_n_0_[1] ),
        .O(shift_ena));
  FDRE \scount_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\scount[3]_i_1_n_0 ),
        .D(p_0_in__0[0]),
        .Q(count_OBUF[0]),
        .R(1'b0));
  FDRE \scount_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\scount[3]_i_1_n_0 ),
        .D(p_0_in__0[1]),
        .Q(count_OBUF[1]),
        .R(1'b0));
  FDRE \scount_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\scount[3]_i_1_n_0 ),
        .D(p_0_in__0[2]),
        .Q(count_OBUF[2]),
        .R(1'b0));
  FDRE \scount_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\scount[3]_i_1_n_0 ),
        .D(p_0_in__0[3]),
        .Q(count_OBUF[3]),
        .R(1'b0));
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
