// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Mon Sep 28 00:47:43 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob156_review2015_fancytimer/eda/run-Y0obLs/build/.rtl-synth-YGr6QV/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* COUNT = "2'b10" *) (* DONE = "2'b11" *) (* READ = "2'b01" *) 
(* SEARCH = "2'b00" *) 
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

  wire \FSM_sequential_state[1]_i_1_n_0 ;
  wire \FSM_sequential_state[1]_i_3_n_0 ;
  wire \FSM_sequential_state[1]_i_4_n_0 ;
  wire \FSM_sequential_state[1]_i_5_n_0 ;
  wire \FSM_sequential_state[1]_i_6_n_0 ;
  wire \FSM_sequential_state[1]_i_7_n_0 ;
  wire \FSM_sequential_state[1]_i_8_n_0 ;
  wire ack;
  wire ack_IBUF;
  wire [1:0]bit_count;
  wire \bit_count[1]_i_1_n_0 ;
  wire \bit_count_reg_n_0_[0] ;
  wire \bit_count_reg_n_0_[1] ;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [3:0]count;
  wire [3:0]count_OBUF;
  wire counting;
  wire counting_OBUF;
  wire \cycle_cnt[0]_i_1_n_0 ;
  wire \cycle_cnt[1]_i_1_n_0 ;
  wire \cycle_cnt[2]_i_1_n_0 ;
  wire \cycle_cnt[3]_i_1_n_0 ;
  wire \cycle_cnt[3]_i_2_n_0 ;
  wire \cycle_cnt[4]_i_1_n_0 ;
  wire \cycle_cnt[5]_i_1_n_0 ;
  wire \cycle_cnt[5]_i_2_n_0 ;
  wire \cycle_cnt[5]_i_3_n_0 ;
  wire \cycle_cnt[6]_i_1_n_0 ;
  wire \cycle_cnt[6]_i_2_n_0 ;
  wire \cycle_cnt[7]_i_1_n_0 ;
  wire \cycle_cnt[7]_i_2_n_0 ;
  wire \cycle_cnt[7]_i_3_n_0 ;
  wire \cycle_cnt[7]_i_4_n_0 ;
  wire \cycle_cnt[8]_i_1_n_0 ;
  wire \cycle_cnt[9]_i_1_n_0 ;
  wire \cycle_cnt[9]_i_2_n_0 ;
  wire \cycle_cnt_reg_n_0_[0] ;
  wire \cycle_cnt_reg_n_0_[1] ;
  wire \cycle_cnt_reg_n_0_[2] ;
  wire \cycle_cnt_reg_n_0_[3] ;
  wire \cycle_cnt_reg_n_0_[4] ;
  wire \cycle_cnt_reg_n_0_[5] ;
  wire \cycle_cnt_reg_n_0_[6] ;
  wire \cycle_cnt_reg_n_0_[7] ;
  wire \cycle_cnt_reg_n_0_[8] ;
  wire \cycle_cnt_reg_n_0_[9] ;
  wire data;
  wire data_IBUF;
  wire [3:0]delay_cnt;
  wire \delay_cnt[3]_i_1_n_0 ;
  wire \delay_cnt[3]_i_3_n_0 ;
  wire \delay_cnt[3]_i_4_n_0 ;
  wire \delay_cnt[3]_i_5_n_0 ;
  wire \delay_cnt[3]_i_6_n_0 ;
  wire \delay_cnt_reg_n_0_[0] ;
  wire \delay_cnt_reg_n_0_[1] ;
  wire \delay_cnt_reg_n_0_[2] ;
  wire \delay_cnt_reg_n_0_[3] ;
  wire [2:0]delay_shift;
  wire done;
  wire done_OBUF;
  wire [3:1]p_0_in;
  wire [3:1]p_0_in__0;
  wire reset;
  wire reset_IBUF;
  wire [2:0]shift_reg;
  wire \shift_reg[2]_i_1_n_0 ;
  wire [1:0]state;
  wire [1:0]state__0;

  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT1 #(
    .INIT(2'h1)) 
    \FSM_sequential_state[0]_i_1 
       (.I0(state[0]),
        .O(state__0[0]));
  LUT6 #(
    .INIT(64'hFEFEFEFEFEFFFEFE)) 
    \FSM_sequential_state[1]_i_1 
       (.I0(\FSM_sequential_state[1]_i_3_n_0 ),
        .I1(\FSM_sequential_state[1]_i_4_n_0 ),
        .I2(\FSM_sequential_state[1]_i_5_n_0 ),
        .I3(\FSM_sequential_state[1]_i_6_n_0 ),
        .I4(\FSM_sequential_state[1]_i_7_n_0 ),
        .I5(\FSM_sequential_state[1]_i_8_n_0 ),
        .O(\FSM_sequential_state[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \FSM_sequential_state[1]_i_2 
       (.I0(state[1]),
        .I1(state[0]),
        .O(state__0[1]));
  LUT6 #(
    .INIT(64'h0002000000000000)) 
    \FSM_sequential_state[1]_i_3 
       (.I0(data_IBUF),
        .I1(p_0_in[1]),
        .I2(state[0]),
        .I3(state[1]),
        .I4(p_0_in[3]),
        .I5(p_0_in[2]),
        .O(\FSM_sequential_state[1]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT3 #(
    .INIT(8'h80)) 
    \FSM_sequential_state[1]_i_4 
       (.I0(ack_IBUF),
        .I1(state[1]),
        .I2(state[0]),
        .O(\FSM_sequential_state[1]_i_4_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h4000)) 
    \FSM_sequential_state[1]_i_5 
       (.I0(state[1]),
        .I1(state[0]),
        .I2(\bit_count_reg_n_0_[1] ),
        .I3(\bit_count_reg_n_0_[0] ),
        .O(\FSM_sequential_state[1]_i_5_n_0 ));
  LUT6 #(
    .INIT(64'h7FFFFFFFFFFFFFFF)) 
    \FSM_sequential_state[1]_i_6 
       (.I0(\cycle_cnt_reg_n_0_[7] ),
        .I1(\cycle_cnt_reg_n_0_[6] ),
        .I2(\cycle_cnt_reg_n_0_[5] ),
        .I3(\cycle_cnt_reg_n_0_[1] ),
        .I4(\cycle_cnt_reg_n_0_[0] ),
        .I5(\cycle_cnt_reg_n_0_[2] ),
        .O(\FSM_sequential_state[1]_i_6_n_0 ));
  LUT6 #(
    .INIT(64'h0000020000000000)) 
    \FSM_sequential_state[1]_i_7 
       (.I0(state[1]),
        .I1(\cycle_cnt_reg_n_0_[3] ),
        .I2(state[0]),
        .I3(\cycle_cnt_reg_n_0_[8] ),
        .I4(\cycle_cnt_reg_n_0_[4] ),
        .I5(\cycle_cnt_reg_n_0_[9] ),
        .O(\FSM_sequential_state[1]_i_7_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT4 #(
    .INIT(16'hFFFE)) 
    \FSM_sequential_state[1]_i_8 
       (.I0(\delay_cnt_reg_n_0_[2] ),
        .I1(\delay_cnt_reg_n_0_[0] ),
        .I2(\delay_cnt_reg_n_0_[1] ),
        .I3(\delay_cnt_reg_n_0_[3] ),
        .O(\FSM_sequential_state[1]_i_8_n_0 ));
  (* FSM_ENCODED_STATES = "SEARCH:00,READ:01,COUNT:10,DONE:11" *) 
  FDRE \FSM_sequential_state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_sequential_state[1]_i_1_n_0 ),
        .D(state__0[0]),
        .Q(state[0]),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "SEARCH:00,READ:01,COUNT:10,DONE:11" *) 
  FDRE \FSM_sequential_state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_sequential_state[1]_i_1_n_0 ),
        .D(state__0[1]),
        .Q(state[1]),
        .R(reset_IBUF));
  IBUF ack_IBUF_inst
       (.I(ack),
        .O(ack_IBUF));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT3 #(
    .INIT(8'h04)) 
    \bit_count[0]_i_1 
       (.I0(state[1]),
        .I1(state[0]),
        .I2(\bit_count_reg_n_0_[0] ),
        .O(bit_count[0]));
  LUT6 #(
    .INIT(64'hFFFFFFFFF0770000)) 
    \bit_count[1]_i_1 
       (.I0(\bit_count_reg_n_0_[0] ),
        .I1(\bit_count_reg_n_0_[1] ),
        .I2(ack_IBUF),
        .I3(state[1]),
        .I4(state[0]),
        .I5(\FSM_sequential_state[1]_i_3_n_0 ),
        .O(\bit_count[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT4 #(
    .INIT(16'h0220)) 
    \bit_count[1]_i_2 
       (.I0(state[0]),
        .I1(state[1]),
        .I2(\bit_count_reg_n_0_[0] ),
        .I3(\bit_count_reg_n_0_[1] ),
        .O(bit_count[1]));
  FDRE \bit_count_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\bit_count[1]_i_1_n_0 ),
        .D(bit_count[0]),
        .Q(\bit_count_reg_n_0_[0] ),
        .R(reset_IBUF));
  FDRE \bit_count_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\bit_count[1]_i_1_n_0 ),
        .D(bit_count[1]),
        .Q(\bit_count_reg_n_0_[1] ),
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
  OBUF \count_OBUF[0]_inst 
       (.I(count_OBUF[0]),
        .O(count[0]));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT3 #(
    .INIT(8'h40)) 
    \count_OBUF[0]_inst_i_1 
       (.I0(state[0]),
        .I1(state[1]),
        .I2(\delay_cnt_reg_n_0_[0] ),
        .O(count_OBUF[0]));
  OBUF \count_OBUF[1]_inst 
       (.I(count_OBUF[1]),
        .O(count[1]));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT3 #(
    .INIT(8'h40)) 
    \count_OBUF[1]_inst_i_1 
       (.I0(state[0]),
        .I1(state[1]),
        .I2(\delay_cnt_reg_n_0_[1] ),
        .O(count_OBUF[1]));
  OBUF \count_OBUF[2]_inst 
       (.I(count_OBUF[2]),
        .O(count[2]));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT3 #(
    .INIT(8'h40)) 
    \count_OBUF[2]_inst_i_1 
       (.I0(state[0]),
        .I1(state[1]),
        .I2(\delay_cnt_reg_n_0_[2] ),
        .O(count_OBUF[2]));
  OBUF \count_OBUF[3]_inst 
       (.I(count_OBUF[3]),
        .O(count[3]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'h40)) 
    \count_OBUF[3]_inst_i_1 
       (.I0(state[0]),
        .I1(state[1]),
        .I2(\delay_cnt_reg_n_0_[3] ),
        .O(count_OBUF[3]));
  OBUF counting_OBUF_inst
       (.I(counting_OBUF),
        .O(counting));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT2 #(
    .INIT(4'h2)) 
    counting_OBUF_inst_i_1
       (.I0(state[1]),
        .I1(state[0]),
        .O(counting_OBUF));
  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT2 #(
    .INIT(4'h1)) 
    \cycle_cnt[0]_i_1 
       (.I0(state[0]),
        .I1(\cycle_cnt_reg_n_0_[0] ),
        .O(\cycle_cnt[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT3 #(
    .INIT(8'h06)) 
    \cycle_cnt[1]_i_1 
       (.I0(\cycle_cnt_reg_n_0_[0] ),
        .I1(\cycle_cnt_reg_n_0_[1] ),
        .I2(state[0]),
        .O(\cycle_cnt[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT4 #(
    .INIT(16'h0078)) 
    \cycle_cnt[2]_i_1 
       (.I0(\cycle_cnt_reg_n_0_[0] ),
        .I1(\cycle_cnt_reg_n_0_[1] ),
        .I2(\cycle_cnt_reg_n_0_[2] ),
        .I3(state[0]),
        .O(\cycle_cnt[2]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h00FF0000000000FD)) 
    \cycle_cnt[3]_i_1 
       (.I0(\cycle_cnt_reg_n_0_[5] ),
        .I1(\cycle_cnt[3]_i_2_n_0 ),
        .I2(\delay_cnt[3]_i_4_n_0 ),
        .I3(state[0]),
        .I4(\cycle_cnt_reg_n_0_[3] ),
        .I5(\cycle_cnt[5]_i_3_n_0 ),
        .O(\cycle_cnt[3]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h7)) 
    \cycle_cnt[3]_i_2 
       (.I0(\cycle_cnt_reg_n_0_[6] ),
        .I1(\cycle_cnt_reg_n_0_[7] ),
        .O(\cycle_cnt[3]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h000000007FFF8000)) 
    \cycle_cnt[4]_i_1 
       (.I0(\cycle_cnt_reg_n_0_[3] ),
        .I1(\cycle_cnt_reg_n_0_[1] ),
        .I2(\cycle_cnt_reg_n_0_[0] ),
        .I3(\cycle_cnt_reg_n_0_[2] ),
        .I4(\cycle_cnt_reg_n_0_[4] ),
        .I5(state[0]),
        .O(\cycle_cnt[4]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hECECEFECFCFCEFEC)) 
    \cycle_cnt[5]_i_1 
       (.I0(\cycle_cnt[7]_i_4_n_0 ),
        .I1(\cycle_cnt[5]_i_2_n_0 ),
        .I2(\cycle_cnt_reg_n_0_[5] ),
        .I3(\cycle_cnt[7]_i_2_n_0 ),
        .I4(\cycle_cnt[5]_i_3_n_0 ),
        .I5(state[0]),
        .O(\cycle_cnt[5]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT5 #(
    .INIT(32'h00020202)) 
    \cycle_cnt[5]_i_2 
       (.I0(\cycle_cnt_reg_n_0_[5] ),
        .I1(\cycle_cnt_reg_n_0_[3] ),
        .I2(state[0]),
        .I3(\cycle_cnt_reg_n_0_[7] ),
        .I4(\cycle_cnt_reg_n_0_[6] ),
        .O(\cycle_cnt[5]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'h7F)) 
    \cycle_cnt[5]_i_3 
       (.I0(\cycle_cnt_reg_n_0_[1] ),
        .I1(\cycle_cnt_reg_n_0_[0] ),
        .I2(\cycle_cnt_reg_n_0_[2] ),
        .O(\cycle_cnt[5]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'hFCFCFEFECCFCCECE)) 
    \cycle_cnt[6]_i_1 
       (.I0(\cycle_cnt[7]_i_2_n_0 ),
        .I1(\cycle_cnt[6]_i_2_n_0 ),
        .I2(\cycle_cnt_reg_n_0_[6] ),
        .I3(state[0]),
        .I4(\cycle_cnt[7]_i_3_n_0 ),
        .I5(\cycle_cnt[7]_i_4_n_0 ),
        .O(\cycle_cnt[6]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT4 #(
    .INIT(16'h0004)) 
    \cycle_cnt[6]_i_2 
       (.I0(\cycle_cnt_reg_n_0_[7] ),
        .I1(\cycle_cnt_reg_n_0_[6] ),
        .I2(state[0]),
        .I3(\cycle_cnt_reg_n_0_[3] ),
        .O(\cycle_cnt[6]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'hF0F0F8F800F00838)) 
    \cycle_cnt[7]_i_1 
       (.I0(\cycle_cnt[7]_i_2_n_0 ),
        .I1(\cycle_cnt_reg_n_0_[6] ),
        .I2(\cycle_cnt_reg_n_0_[7] ),
        .I3(state[0]),
        .I4(\cycle_cnt[7]_i_3_n_0 ),
        .I5(\cycle_cnt[7]_i_4_n_0 ),
        .O(\cycle_cnt[7]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT3 #(
    .INIT(8'h40)) 
    \cycle_cnt[7]_i_2 
       (.I0(state[0]),
        .I1(\cycle_cnt_reg_n_0_[3] ),
        .I2(\cycle_cnt_reg_n_0_[4] ),
        .O(\cycle_cnt[7]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT4 #(
    .INIT(16'h7FFF)) 
    \cycle_cnt[7]_i_3 
       (.I0(\cycle_cnt_reg_n_0_[2] ),
        .I1(\cycle_cnt_reg_n_0_[0] ),
        .I2(\cycle_cnt_reg_n_0_[1] ),
        .I3(\cycle_cnt_reg_n_0_[5] ),
        .O(\cycle_cnt[7]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'h00000FF7)) 
    \cycle_cnt[7]_i_4 
       (.I0(\cycle_cnt_reg_n_0_[9] ),
        .I1(\cycle_cnt_reg_n_0_[8] ),
        .I2(\cycle_cnt_reg_n_0_[4] ),
        .I3(\cycle_cnt_reg_n_0_[3] ),
        .I4(state[0]),
        .O(\cycle_cnt[7]_i_4_n_0 ));
  LUT6 #(
    .INIT(64'h0C0C0C0C030C0C04)) 
    \cycle_cnt[8]_i_1 
       (.I0(\cycle_cnt_reg_n_0_[9] ),
        .I1(\cycle_cnt_reg_n_0_[8] ),
        .I2(state[0]),
        .I3(\cycle_cnt_reg_n_0_[3] ),
        .I4(\cycle_cnt_reg_n_0_[4] ),
        .I5(\FSM_sequential_state[1]_i_6_n_0 ),
        .O(\cycle_cnt[8]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hAAFFC000)) 
    \cycle_cnt[9]_i_1 
       (.I0(ack_IBUF),
        .I1(\bit_count_reg_n_0_[0] ),
        .I2(\bit_count_reg_n_0_[1] ),
        .I3(state[0]),
        .I4(state[1]),
        .O(\cycle_cnt[9]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h2222222212202222)) 
    \cycle_cnt[9]_i_2 
       (.I0(\cycle_cnt_reg_n_0_[9] ),
        .I1(state[0]),
        .I2(\cycle_cnt_reg_n_0_[3] ),
        .I3(\cycle_cnt_reg_n_0_[4] ),
        .I4(\cycle_cnt_reg_n_0_[8] ),
        .I5(\FSM_sequential_state[1]_i_6_n_0 ),
        .O(\cycle_cnt[9]_i_2_n_0 ));
  FDRE \cycle_cnt_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[0]_i_1_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[0] ),
        .R(reset_IBUF));
  FDRE \cycle_cnt_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[1]_i_1_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[1] ),
        .R(reset_IBUF));
  FDRE \cycle_cnt_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[2]_i_1_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[2] ),
        .R(reset_IBUF));
  FDRE \cycle_cnt_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[3]_i_1_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[3] ),
        .R(reset_IBUF));
  FDRE \cycle_cnt_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[4]_i_1_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[4] ),
        .R(reset_IBUF));
  FDRE \cycle_cnt_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[5]_i_1_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[5] ),
        .R(reset_IBUF));
  FDRE \cycle_cnt_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[6]_i_1_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[6] ),
        .R(reset_IBUF));
  FDRE \cycle_cnt_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[7]_i_1_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[7] ),
        .R(reset_IBUF));
  FDRE \cycle_cnt_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[8]_i_1_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[8] ),
        .R(reset_IBUF));
  FDRE \cycle_cnt_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(\cycle_cnt[9]_i_1_n_0 ),
        .D(\cycle_cnt[9]_i_2_n_0 ),
        .Q(\cycle_cnt_reg_n_0_[9] ),
        .R(reset_IBUF));
  IBUF data_IBUF_inst
       (.I(data),
        .O(data_IBUF));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT4 #(
    .INIT(16'h444F)) 
    \delay_cnt[0]_i_1 
       (.I0(state[1]),
        .I1(data_IBUF),
        .I2(state[0]),
        .I3(\delay_cnt_reg_n_0_[0] ),
        .O(delay_cnt[0]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT5 #(
    .INIT(32'h2F22222F)) 
    \delay_cnt[1]_i_1 
       (.I0(p_0_in__0[1]),
        .I1(state[1]),
        .I2(state[0]),
        .I3(\delay_cnt_reg_n_0_[0] ),
        .I4(\delay_cnt_reg_n_0_[1] ),
        .O(delay_cnt[1]));
  LUT6 #(
    .INIT(64'h2F2F2F222222222F)) 
    \delay_cnt[2]_i_1 
       (.I0(p_0_in__0[2]),
        .I1(state[1]),
        .I2(state[0]),
        .I3(\delay_cnt_reg_n_0_[1] ),
        .I4(\delay_cnt_reg_n_0_[0] ),
        .I5(\delay_cnt_reg_n_0_[2] ),
        .O(delay_cnt[2]));
  LUT6 #(
    .INIT(64'hABAAAAAAAAAAAAAA)) 
    \delay_cnt[3]_i_1 
       (.I0(\delay_cnt[3]_i_3_n_0 ),
        .I1(\FSM_sequential_state[1]_i_6_n_0 ),
        .I2(\delay_cnt[3]_i_4_n_0 ),
        .I3(\delay_cnt[3]_i_5_n_0 ),
        .I4(state[1]),
        .I5(\FSM_sequential_state[1]_i_8_n_0 ),
        .O(\delay_cnt[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT5 #(
    .INIT(32'h2222F22F)) 
    \delay_cnt[3]_i_2 
       (.I0(p_0_in__0[3]),
        .I1(state[1]),
        .I2(\delay_cnt[3]_i_6_n_0 ),
        .I3(\delay_cnt_reg_n_0_[3] ),
        .I4(state[0]),
        .O(delay_cnt[3]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hAA00C000)) 
    \delay_cnt[3]_i_3 
       (.I0(ack_IBUF),
        .I1(\bit_count_reg_n_0_[0] ),
        .I2(\bit_count_reg_n_0_[1] ),
        .I3(state[0]),
        .I4(state[1]),
        .O(\delay_cnt[3]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hDF)) 
    \delay_cnt[3]_i_4 
       (.I0(\cycle_cnt_reg_n_0_[9] ),
        .I1(\cycle_cnt_reg_n_0_[4] ),
        .I2(\cycle_cnt_reg_n_0_[8] ),
        .O(\delay_cnt[3]_i_4_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT2 #(
    .INIT(4'h1)) 
    \delay_cnt[3]_i_5 
       (.I0(\cycle_cnt_reg_n_0_[3] ),
        .I1(state[0]),
        .O(\delay_cnt[3]_i_5_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT3 #(
    .INIT(8'hFE)) 
    \delay_cnt[3]_i_6 
       (.I0(\delay_cnt_reg_n_0_[1] ),
        .I1(\delay_cnt_reg_n_0_[0] ),
        .I2(\delay_cnt_reg_n_0_[2] ),
        .O(\delay_cnt[3]_i_6_n_0 ));
  FDRE \delay_cnt_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\delay_cnt[3]_i_1_n_0 ),
        .D(delay_cnt[0]),
        .Q(\delay_cnt_reg_n_0_[0] ),
        .R(reset_IBUF));
  FDRE \delay_cnt_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\delay_cnt[3]_i_1_n_0 ),
        .D(delay_cnt[1]),
        .Q(\delay_cnt_reg_n_0_[1] ),
        .R(reset_IBUF));
  FDRE \delay_cnt_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\delay_cnt[3]_i_1_n_0 ),
        .D(delay_cnt[2]),
        .Q(\delay_cnt_reg_n_0_[2] ),
        .R(reset_IBUF));
  FDRE \delay_cnt_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\delay_cnt[3]_i_1_n_0 ),
        .D(delay_cnt[3]),
        .Q(\delay_cnt_reg_n_0_[3] ),
        .R(reset_IBUF));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT3 #(
    .INIT(8'h40)) 
    \delay_shift[0]_i_1 
       (.I0(state[1]),
        .I1(state[0]),
        .I2(data_IBUF),
        .O(delay_shift[0]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT3 #(
    .INIT(8'h40)) 
    \delay_shift[1]_i_1 
       (.I0(state[1]),
        .I1(state[0]),
        .I2(p_0_in__0[1]),
        .O(delay_shift[1]));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT3 #(
    .INIT(8'h40)) 
    \delay_shift[2]_i_1 
       (.I0(state[1]),
        .I1(state[0]),
        .I2(p_0_in__0[2]),
        .O(delay_shift[2]));
  FDRE \delay_shift_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\bit_count[1]_i_1_n_0 ),
        .D(delay_shift[0]),
        .Q(p_0_in__0[1]),
        .R(reset_IBUF));
  FDRE \delay_shift_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\bit_count[1]_i_1_n_0 ),
        .D(delay_shift[1]),
        .Q(p_0_in__0[2]),
        .R(reset_IBUF));
  FDRE \delay_shift_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\bit_count[1]_i_1_n_0 ),
        .D(delay_shift[2]),
        .Q(p_0_in__0[3]),
        .R(reset_IBUF));
  OBUF done_OBUF_inst
       (.I(done_OBUF),
        .O(done));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT2 #(
    .INIT(4'h8)) 
    done_OBUF_inst_i_1
       (.I0(state[0]),
        .I1(state[1]),
        .O(done_OBUF));
  IBUF reset_IBUF_inst
       (.I(reset),
        .O(reset_IBUF));
  LUT2 #(
    .INIT(4'h2)) 
    \shift_reg[0]_i_1 
       (.I0(data_IBUF),
        .I1(state[1]),
        .O(shift_reg[0]));
  (* SOFT_HLUTNM = "soft_lutpair16" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \shift_reg[1]_i_1 
       (.I0(p_0_in[1]),
        .I1(state[1]),
        .O(shift_reg[1]));
  LUT3 #(
    .INIT(8'h83)) 
    \shift_reg[2]_i_1 
       (.I0(ack_IBUF),
        .I1(state[1]),
        .I2(state[0]),
        .O(\shift_reg[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair16" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \shift_reg[2]_i_2 
       (.I0(p_0_in[2]),
        .I1(state[1]),
        .O(shift_reg[2]));
  FDRE \shift_reg_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\shift_reg[2]_i_1_n_0 ),
        .D(shift_reg[0]),
        .Q(p_0_in[1]),
        .R(reset_IBUF));
  FDRE \shift_reg_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\shift_reg[2]_i_1_n_0 ),
        .D(shift_reg[1]),
        .Q(p_0_in[2]),
        .R(reset_IBUF));
  FDRE \shift_reg_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\shift_reg[2]_i_1_n_0 ),
        .D(shift_reg[2]),
        .Q(p_0_in[3]),
        .R(reset_IBUF));
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
