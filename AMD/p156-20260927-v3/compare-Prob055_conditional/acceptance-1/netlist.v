// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 21:57:50 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob055_conditional/eda/run-oyJKZS/build/.rtl-synth-pJxxzV/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (a,
    b,
    c,
    d,
    min);
  input [7:0]a;
  input [7:0]b;
  input [7:0]c;
  input [7:0]d;
  output [7:0]min;

  wire [7:0]a;
  wire [7:0]a_IBUF;
  wire [7:0]b;
  wire [7:0]b_IBUF;
  wire [7:0]c;
  wire [7:0]c_IBUF;
  wire [7:0]d;
  wire [7:0]d_IBUF;
  wire [7:0]min;
  wire [7:0]min_OBUF;
  wire \min_OBUF[7]_inst_i_10_n_0 ;
  wire \min_OBUF[7]_inst_i_11_n_0 ;
  wire \min_OBUF[7]_inst_i_12_n_0 ;
  wire \min_OBUF[7]_inst_i_13_n_0 ;
  wire \min_OBUF[7]_inst_i_14_n_0 ;
  wire \min_OBUF[7]_inst_i_15_n_0 ;
  wire \min_OBUF[7]_inst_i_16_n_0 ;
  wire \min_OBUF[7]_inst_i_17_n_0 ;
  wire \min_OBUF[7]_inst_i_18_n_0 ;
  wire \min_OBUF[7]_inst_i_19_n_0 ;
  wire \min_OBUF[7]_inst_i_20_n_0 ;
  wire \min_OBUF[7]_inst_i_21_n_0 ;
  wire \min_OBUF[7]_inst_i_22_n_0 ;
  wire \min_OBUF[7]_inst_i_23_n_0 ;
  wire \min_OBUF[7]_inst_i_24_n_0 ;
  wire \min_OBUF[7]_inst_i_25_n_0 ;
  wire \min_OBUF[7]_inst_i_26_n_0 ;
  wire \min_OBUF[7]_inst_i_27_n_0 ;
  wire \min_OBUF[7]_inst_i_28_n_0 ;
  wire \min_OBUF[7]_inst_i_29_n_0 ;
  wire \min_OBUF[7]_inst_i_2_n_5 ;
  wire \min_OBUF[7]_inst_i_2_n_6 ;
  wire \min_OBUF[7]_inst_i_2_n_7 ;
  wire \min_OBUF[7]_inst_i_30_n_5 ;
  wire \min_OBUF[7]_inst_i_30_n_6 ;
  wire \min_OBUF[7]_inst_i_30_n_7 ;
  wire \min_OBUF[7]_inst_i_31_n_0 ;
  wire \min_OBUF[7]_inst_i_32_n_0 ;
  wire \min_OBUF[7]_inst_i_33_n_0 ;
  wire \min_OBUF[7]_inst_i_34_n_0 ;
  wire \min_OBUF[7]_inst_i_35_n_0 ;
  wire \min_OBUF[7]_inst_i_36_n_0 ;
  wire \min_OBUF[7]_inst_i_37_n_0 ;
  wire \min_OBUF[7]_inst_i_38_n_0 ;
  wire \min_OBUF[7]_inst_i_3_n_5 ;
  wire \min_OBUF[7]_inst_i_3_n_6 ;
  wire \min_OBUF[7]_inst_i_3_n_7 ;
  wire \min_OBUF[7]_inst_i_4_n_5 ;
  wire \min_OBUF[7]_inst_i_4_n_6 ;
  wire \min_OBUF[7]_inst_i_4_n_7 ;
  wire \min_OBUF[7]_inst_i_6_n_0 ;
  wire \min_OBUF[7]_inst_i_7_n_0 ;
  wire \min_OBUF[7]_inst_i_8_n_0 ;
  wire \min_OBUF[7]_inst_i_9_n_0 ;
  wire min_ab1;
  wire [7:0]min_cd;
  wire min_cd1;
  wire p_0_in;
  wire p_1_in;
  wire [7:4]\NLW_min_OBUF[7]_inst_i_2_CO_UNCONNECTED ;
  wire [7:0]\NLW_min_OBUF[7]_inst_i_2_O_UNCONNECTED ;
  wire [7:4]\NLW_min_OBUF[7]_inst_i_3_CO_UNCONNECTED ;
  wire [7:0]\NLW_min_OBUF[7]_inst_i_3_O_UNCONNECTED ;
  wire [7:4]\NLW_min_OBUF[7]_inst_i_30_CO_UNCONNECTED ;
  wire [7:0]\NLW_min_OBUF[7]_inst_i_30_O_UNCONNECTED ;
  wire [7:4]\NLW_min_OBUF[7]_inst_i_4_CO_UNCONNECTED ;
  wire [7:0]\NLW_min_OBUF[7]_inst_i_4_O_UNCONNECTED ;

  IBUF \a_IBUF[0]_inst 
       (.I(a[0]),
        .O(a_IBUF[0]));
  IBUF \a_IBUF[1]_inst 
       (.I(a[1]),
        .O(a_IBUF[1]));
  IBUF \a_IBUF[2]_inst 
       (.I(a[2]),
        .O(a_IBUF[2]));
  IBUF \a_IBUF[3]_inst 
       (.I(a[3]),
        .O(a_IBUF[3]));
  IBUF \a_IBUF[4]_inst 
       (.I(a[4]),
        .O(a_IBUF[4]));
  IBUF \a_IBUF[5]_inst 
       (.I(a[5]),
        .O(a_IBUF[5]));
  IBUF \a_IBUF[6]_inst 
       (.I(a[6]),
        .O(a_IBUF[6]));
  IBUF \a_IBUF[7]_inst 
       (.I(a[7]),
        .O(a_IBUF[7]));
  IBUF \b_IBUF[0]_inst 
       (.I(b[0]),
        .O(b_IBUF[0]));
  IBUF \b_IBUF[1]_inst 
       (.I(b[1]),
        .O(b_IBUF[1]));
  IBUF \b_IBUF[2]_inst 
       (.I(b[2]),
        .O(b_IBUF[2]));
  IBUF \b_IBUF[3]_inst 
       (.I(b[3]),
        .O(b_IBUF[3]));
  IBUF \b_IBUF[4]_inst 
       (.I(b[4]),
        .O(b_IBUF[4]));
  IBUF \b_IBUF[5]_inst 
       (.I(b[5]),
        .O(b_IBUF[5]));
  IBUF \b_IBUF[6]_inst 
       (.I(b[6]),
        .O(b_IBUF[6]));
  IBUF \b_IBUF[7]_inst 
       (.I(b[7]),
        .O(b_IBUF[7]));
  IBUF \c_IBUF[0]_inst 
       (.I(c[0]),
        .O(c_IBUF[0]));
  IBUF \c_IBUF[1]_inst 
       (.I(c[1]),
        .O(c_IBUF[1]));
  IBUF \c_IBUF[2]_inst 
       (.I(c[2]),
        .O(c_IBUF[2]));
  IBUF \c_IBUF[3]_inst 
       (.I(c[3]),
        .O(c_IBUF[3]));
  IBUF \c_IBUF[4]_inst 
       (.I(c[4]),
        .O(c_IBUF[4]));
  IBUF \c_IBUF[5]_inst 
       (.I(c[5]),
        .O(c_IBUF[5]));
  IBUF \c_IBUF[6]_inst 
       (.I(c[6]),
        .O(c_IBUF[6]));
  IBUF \c_IBUF[7]_inst 
       (.I(c[7]),
        .O(c_IBUF[7]));
  IBUF \d_IBUF[0]_inst 
       (.I(d[0]),
        .O(d_IBUF[0]));
  IBUF \d_IBUF[1]_inst 
       (.I(d[1]),
        .O(d_IBUF[1]));
  IBUF \d_IBUF[2]_inst 
       (.I(d[2]),
        .O(d_IBUF[2]));
  IBUF \d_IBUF[3]_inst 
       (.I(d[3]),
        .O(d_IBUF[3]));
  IBUF \d_IBUF[4]_inst 
       (.I(d[4]),
        .O(d_IBUF[4]));
  IBUF \d_IBUF[5]_inst 
       (.I(d[5]),
        .O(d_IBUF[5]));
  IBUF \d_IBUF[6]_inst 
       (.I(d[6]),
        .O(d_IBUF[6]));
  IBUF \d_IBUF[7]_inst 
       (.I(d[7]),
        .O(d_IBUF[7]));
  OBUF \min_OBUF[0]_inst 
       (.I(min_OBUF[0]),
        .O(min[0]));
  LUT6 #(
    .INIT(64'hBFB0BFBF8F808080)) 
    \min_OBUF[0]_inst_i_1 
       (.I0(a_IBUF[0]),
        .I1(p_1_in),
        .I2(min_ab1),
        .I3(b_IBUF[0]),
        .I4(p_0_in),
        .I5(min_cd[0]),
        .O(min_OBUF[0]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hAC)) 
    \min_OBUF[0]_inst_i_2 
       (.I0(c_IBUF[0]),
        .I1(d_IBUF[0]),
        .I2(min_cd1),
        .O(min_cd[0]));
  OBUF \min_OBUF[1]_inst 
       (.I(min_OBUF[1]),
        .O(min[1]));
  LUT6 #(
    .INIT(64'hBFB0BFBF8F808080)) 
    \min_OBUF[1]_inst_i_1 
       (.I0(a_IBUF[1]),
        .I1(p_1_in),
        .I2(min_ab1),
        .I3(b_IBUF[1]),
        .I4(p_0_in),
        .I5(min_cd[1]),
        .O(min_OBUF[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hAC)) 
    \min_OBUF[1]_inst_i_2 
       (.I0(c_IBUF[1]),
        .I1(d_IBUF[1]),
        .I2(min_cd1),
        .O(min_cd[1]));
  OBUF \min_OBUF[2]_inst 
       (.I(min_OBUF[2]),
        .O(min[2]));
  LUT6 #(
    .INIT(64'hBFB0BFBF8F808080)) 
    \min_OBUF[2]_inst_i_1 
       (.I0(a_IBUF[2]),
        .I1(p_1_in),
        .I2(min_ab1),
        .I3(b_IBUF[2]),
        .I4(p_0_in),
        .I5(min_cd[2]),
        .O(min_OBUF[2]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hAC)) 
    \min_OBUF[2]_inst_i_2 
       (.I0(c_IBUF[2]),
        .I1(d_IBUF[2]),
        .I2(min_cd1),
        .O(min_cd[2]));
  OBUF \min_OBUF[3]_inst 
       (.I(min_OBUF[3]),
        .O(min[3]));
  LUT6 #(
    .INIT(64'hBFB0BFBF8F808080)) 
    \min_OBUF[3]_inst_i_1 
       (.I0(a_IBUF[3]),
        .I1(p_1_in),
        .I2(min_ab1),
        .I3(b_IBUF[3]),
        .I4(p_0_in),
        .I5(min_cd[3]),
        .O(min_OBUF[3]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hAC)) 
    \min_OBUF[3]_inst_i_2 
       (.I0(c_IBUF[3]),
        .I1(d_IBUF[3]),
        .I2(min_cd1),
        .O(min_cd[3]));
  OBUF \min_OBUF[4]_inst 
       (.I(min_OBUF[4]),
        .O(min[4]));
  LUT6 #(
    .INIT(64'hBFB0BFBF8F808080)) 
    \min_OBUF[4]_inst_i_1 
       (.I0(a_IBUF[4]),
        .I1(p_1_in),
        .I2(min_ab1),
        .I3(b_IBUF[4]),
        .I4(p_0_in),
        .I5(min_cd[4]),
        .O(min_OBUF[4]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hAC)) 
    \min_OBUF[4]_inst_i_2 
       (.I0(c_IBUF[4]),
        .I1(d_IBUF[4]),
        .I2(min_cd1),
        .O(min_cd[4]));
  OBUF \min_OBUF[5]_inst 
       (.I(min_OBUF[5]),
        .O(min[5]));
  LUT6 #(
    .INIT(64'hBFB0BFBF8F808080)) 
    \min_OBUF[5]_inst_i_1 
       (.I0(a_IBUF[5]),
        .I1(p_1_in),
        .I2(min_ab1),
        .I3(b_IBUF[5]),
        .I4(p_0_in),
        .I5(min_cd[5]),
        .O(min_OBUF[5]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hAC)) 
    \min_OBUF[5]_inst_i_2 
       (.I0(c_IBUF[5]),
        .I1(d_IBUF[5]),
        .I2(min_cd1),
        .O(min_cd[5]));
  OBUF \min_OBUF[6]_inst 
       (.I(min_OBUF[6]),
        .O(min[6]));
  LUT6 #(
    .INIT(64'hBFB0BFBF8F808080)) 
    \min_OBUF[6]_inst_i_1 
       (.I0(a_IBUF[6]),
        .I1(p_1_in),
        .I2(min_ab1),
        .I3(b_IBUF[6]),
        .I4(p_0_in),
        .I5(min_cd[6]),
        .O(min_OBUF[6]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'hAC)) 
    \min_OBUF[6]_inst_i_2 
       (.I0(c_IBUF[6]),
        .I1(d_IBUF[6]),
        .I2(min_cd1),
        .O(min_cd[6]));
  OBUF \min_OBUF[7]_inst 
       (.I(min_OBUF[7]),
        .O(min[7]));
  LUT6 #(
    .INIT(64'hBFB0BFBF8F808080)) 
    \min_OBUF[7]_inst_i_1 
       (.I0(a_IBUF[7]),
        .I1(p_1_in),
        .I2(min_ab1),
        .I3(b_IBUF[7]),
        .I4(p_0_in),
        .I5(min_cd[7]),
        .O(min_OBUF[7]));
  LUT6 #(
    .INIT(64'hAC5300000000AC53)) 
    \min_OBUF[7]_inst_i_10 
       (.I0(c_IBUF[6]),
        .I1(d_IBUF[6]),
        .I2(min_cd1),
        .I3(a_IBUF[6]),
        .I4(min_cd[7]),
        .I5(a_IBUF[7]),
        .O(\min_OBUF[7]_inst_i_10_n_0 ));
  LUT6 #(
    .INIT(64'hAC5300000000AC53)) 
    \min_OBUF[7]_inst_i_11 
       (.I0(c_IBUF[4]),
        .I1(d_IBUF[4]),
        .I2(min_cd1),
        .I3(a_IBUF[4]),
        .I4(min_cd[5]),
        .I5(a_IBUF[5]),
        .O(\min_OBUF[7]_inst_i_11_n_0 ));
  LUT6 #(
    .INIT(64'hAC5300000000AC53)) 
    \min_OBUF[7]_inst_i_12 
       (.I0(c_IBUF[2]),
        .I1(d_IBUF[2]),
        .I2(min_cd1),
        .I3(a_IBUF[2]),
        .I4(min_cd[3]),
        .I5(a_IBUF[3]),
        .O(\min_OBUF[7]_inst_i_12_n_0 ));
  LUT6 #(
    .INIT(64'hAC5300000000AC53)) 
    \min_OBUF[7]_inst_i_13 
       (.I0(c_IBUF[0]),
        .I1(d_IBUF[0]),
        .I2(min_cd1),
        .I3(a_IBUF[0]),
        .I4(min_cd[1]),
        .I5(a_IBUF[1]),
        .O(\min_OBUF[7]_inst_i_13_n_0 ));
  LUT4 #(
    .INIT(16'h2F02)) 
    \min_OBUF[7]_inst_i_14 
       (.I0(b_IBUF[6]),
        .I1(a_IBUF[6]),
        .I2(a_IBUF[7]),
        .I3(b_IBUF[7]),
        .O(\min_OBUF[7]_inst_i_14_n_0 ));
  LUT4 #(
    .INIT(16'h2F02)) 
    \min_OBUF[7]_inst_i_15 
       (.I0(b_IBUF[4]),
        .I1(a_IBUF[4]),
        .I2(a_IBUF[5]),
        .I3(b_IBUF[5]),
        .O(\min_OBUF[7]_inst_i_15_n_0 ));
  LUT4 #(
    .INIT(16'h2F02)) 
    \min_OBUF[7]_inst_i_16 
       (.I0(b_IBUF[2]),
        .I1(a_IBUF[2]),
        .I2(a_IBUF[3]),
        .I3(b_IBUF[3]),
        .O(\min_OBUF[7]_inst_i_16_n_0 ));
  LUT4 #(
    .INIT(16'h2F02)) 
    \min_OBUF[7]_inst_i_17 
       (.I0(b_IBUF[0]),
        .I1(a_IBUF[0]),
        .I2(a_IBUF[1]),
        .I3(b_IBUF[1]),
        .O(\min_OBUF[7]_inst_i_17_n_0 ));
  LUT4 #(
    .INIT(16'h9009)) 
    \min_OBUF[7]_inst_i_18 
       (.I0(b_IBUF[6]),
        .I1(a_IBUF[6]),
        .I2(b_IBUF[7]),
        .I3(a_IBUF[7]),
        .O(\min_OBUF[7]_inst_i_18_n_0 ));
  LUT4 #(
    .INIT(16'h9009)) 
    \min_OBUF[7]_inst_i_19 
       (.I0(b_IBUF[4]),
        .I1(a_IBUF[4]),
        .I2(b_IBUF[5]),
        .I3(a_IBUF[5]),
        .O(\min_OBUF[7]_inst_i_19_n_0 ));
  (* COMPARATOR_THRESHOLD = "11" *) 
  CARRY8 \min_OBUF[7]_inst_i_2 
       (.CI(1'b0),
        .CI_TOP(1'b0),
        .CO({\NLW_min_OBUF[7]_inst_i_2_CO_UNCONNECTED [7:4],p_1_in,\min_OBUF[7]_inst_i_2_n_5 ,\min_OBUF[7]_inst_i_2_n_6 ,\min_OBUF[7]_inst_i_2_n_7 }),
        .DI({1'b0,1'b0,1'b0,1'b0,\min_OBUF[7]_inst_i_6_n_0 ,\min_OBUF[7]_inst_i_7_n_0 ,\min_OBUF[7]_inst_i_8_n_0 ,\min_OBUF[7]_inst_i_9_n_0 }),
        .O(\NLW_min_OBUF[7]_inst_i_2_O_UNCONNECTED [7:0]),
        .S({1'b0,1'b0,1'b0,1'b0,\min_OBUF[7]_inst_i_10_n_0 ,\min_OBUF[7]_inst_i_11_n_0 ,\min_OBUF[7]_inst_i_12_n_0 ,\min_OBUF[7]_inst_i_13_n_0 }));
  LUT4 #(
    .INIT(16'h9009)) 
    \min_OBUF[7]_inst_i_20 
       (.I0(b_IBUF[2]),
        .I1(a_IBUF[2]),
        .I2(b_IBUF[3]),
        .I3(a_IBUF[3]),
        .O(\min_OBUF[7]_inst_i_20_n_0 ));
  LUT4 #(
    .INIT(16'h9009)) 
    \min_OBUF[7]_inst_i_21 
       (.I0(b_IBUF[0]),
        .I1(a_IBUF[0]),
        .I2(b_IBUF[1]),
        .I3(a_IBUF[1]),
        .O(\min_OBUF[7]_inst_i_21_n_0 ));
  LUT6 #(
    .INIT(64'h00E4FFFF000000E4)) 
    \min_OBUF[7]_inst_i_22 
       (.I0(min_cd1),
        .I1(d_IBUF[6]),
        .I2(c_IBUF[6]),
        .I3(b_IBUF[6]),
        .I4(b_IBUF[7]),
        .I5(min_cd[7]),
        .O(\min_OBUF[7]_inst_i_22_n_0 ));
  LUT6 #(
    .INIT(64'h00E4FFFF000000E4)) 
    \min_OBUF[7]_inst_i_23 
       (.I0(min_cd1),
        .I1(d_IBUF[4]),
        .I2(c_IBUF[4]),
        .I3(b_IBUF[4]),
        .I4(b_IBUF[5]),
        .I5(min_cd[5]),
        .O(\min_OBUF[7]_inst_i_23_n_0 ));
  LUT6 #(
    .INIT(64'h00E4FFFF000000E4)) 
    \min_OBUF[7]_inst_i_24 
       (.I0(min_cd1),
        .I1(d_IBUF[2]),
        .I2(c_IBUF[2]),
        .I3(b_IBUF[2]),
        .I4(b_IBUF[3]),
        .I5(min_cd[3]),
        .O(\min_OBUF[7]_inst_i_24_n_0 ));
  LUT6 #(
    .INIT(64'h00E4FFFF000000E4)) 
    \min_OBUF[7]_inst_i_25 
       (.I0(min_cd1),
        .I1(d_IBUF[0]),
        .I2(c_IBUF[0]),
        .I3(b_IBUF[0]),
        .I4(b_IBUF[1]),
        .I5(min_cd[1]),
        .O(\min_OBUF[7]_inst_i_25_n_0 ));
  LUT6 #(
    .INIT(64'hAC5300000000AC53)) 
    \min_OBUF[7]_inst_i_26 
       (.I0(c_IBUF[6]),
        .I1(d_IBUF[6]),
        .I2(min_cd1),
        .I3(b_IBUF[6]),
        .I4(min_cd[7]),
        .I5(b_IBUF[7]),
        .O(\min_OBUF[7]_inst_i_26_n_0 ));
  LUT6 #(
    .INIT(64'hAC5300000000AC53)) 
    \min_OBUF[7]_inst_i_27 
       (.I0(c_IBUF[4]),
        .I1(d_IBUF[4]),
        .I2(min_cd1),
        .I3(b_IBUF[4]),
        .I4(min_cd[5]),
        .I5(b_IBUF[5]),
        .O(\min_OBUF[7]_inst_i_27_n_0 ));
  LUT6 #(
    .INIT(64'hAC5300000000AC53)) 
    \min_OBUF[7]_inst_i_28 
       (.I0(c_IBUF[2]),
        .I1(d_IBUF[2]),
        .I2(min_cd1),
        .I3(b_IBUF[2]),
        .I4(min_cd[3]),
        .I5(b_IBUF[3]),
        .O(\min_OBUF[7]_inst_i_28_n_0 ));
  LUT6 #(
    .INIT(64'hAC5300000000AC53)) 
    \min_OBUF[7]_inst_i_29 
       (.I0(c_IBUF[0]),
        .I1(d_IBUF[0]),
        .I2(min_cd1),
        .I3(b_IBUF[0]),
        .I4(min_cd[1]),
        .I5(b_IBUF[1]),
        .O(\min_OBUF[7]_inst_i_29_n_0 ));
  (* COMPARATOR_THRESHOLD = "11" *) 
  CARRY8 \min_OBUF[7]_inst_i_3 
       (.CI(1'b0),
        .CI_TOP(1'b0),
        .CO({\NLW_min_OBUF[7]_inst_i_3_CO_UNCONNECTED [7:4],min_ab1,\min_OBUF[7]_inst_i_3_n_5 ,\min_OBUF[7]_inst_i_3_n_6 ,\min_OBUF[7]_inst_i_3_n_7 }),
        .DI({1'b0,1'b0,1'b0,1'b0,\min_OBUF[7]_inst_i_14_n_0 ,\min_OBUF[7]_inst_i_15_n_0 ,\min_OBUF[7]_inst_i_16_n_0 ,\min_OBUF[7]_inst_i_17_n_0 }),
        .O(\NLW_min_OBUF[7]_inst_i_3_O_UNCONNECTED [7:0]),
        .S({1'b0,1'b0,1'b0,1'b0,\min_OBUF[7]_inst_i_18_n_0 ,\min_OBUF[7]_inst_i_19_n_0 ,\min_OBUF[7]_inst_i_20_n_0 ,\min_OBUF[7]_inst_i_21_n_0 }));
  (* COMPARATOR_THRESHOLD = "11" *) 
  CARRY8 \min_OBUF[7]_inst_i_30 
       (.CI(1'b0),
        .CI_TOP(1'b0),
        .CO({\NLW_min_OBUF[7]_inst_i_30_CO_UNCONNECTED [7:4],min_cd1,\min_OBUF[7]_inst_i_30_n_5 ,\min_OBUF[7]_inst_i_30_n_6 ,\min_OBUF[7]_inst_i_30_n_7 }),
        .DI({1'b0,1'b0,1'b0,1'b0,\min_OBUF[7]_inst_i_31_n_0 ,\min_OBUF[7]_inst_i_32_n_0 ,\min_OBUF[7]_inst_i_33_n_0 ,\min_OBUF[7]_inst_i_34_n_0 }),
        .O(\NLW_min_OBUF[7]_inst_i_30_O_UNCONNECTED [7:0]),
        .S({1'b0,1'b0,1'b0,1'b0,\min_OBUF[7]_inst_i_35_n_0 ,\min_OBUF[7]_inst_i_36_n_0 ,\min_OBUF[7]_inst_i_37_n_0 ,\min_OBUF[7]_inst_i_38_n_0 }));
  LUT4 #(
    .INIT(16'h2F02)) 
    \min_OBUF[7]_inst_i_31 
       (.I0(d_IBUF[6]),
        .I1(c_IBUF[6]),
        .I2(c_IBUF[7]),
        .I3(d_IBUF[7]),
        .O(\min_OBUF[7]_inst_i_31_n_0 ));
  LUT4 #(
    .INIT(16'h2F02)) 
    \min_OBUF[7]_inst_i_32 
       (.I0(d_IBUF[4]),
        .I1(c_IBUF[4]),
        .I2(c_IBUF[5]),
        .I3(d_IBUF[5]),
        .O(\min_OBUF[7]_inst_i_32_n_0 ));
  LUT4 #(
    .INIT(16'h2F02)) 
    \min_OBUF[7]_inst_i_33 
       (.I0(d_IBUF[2]),
        .I1(c_IBUF[2]),
        .I2(c_IBUF[3]),
        .I3(d_IBUF[3]),
        .O(\min_OBUF[7]_inst_i_33_n_0 ));
  LUT4 #(
    .INIT(16'h2F02)) 
    \min_OBUF[7]_inst_i_34 
       (.I0(d_IBUF[0]),
        .I1(c_IBUF[0]),
        .I2(c_IBUF[1]),
        .I3(d_IBUF[1]),
        .O(\min_OBUF[7]_inst_i_34_n_0 ));
  LUT4 #(
    .INIT(16'h9009)) 
    \min_OBUF[7]_inst_i_35 
       (.I0(d_IBUF[6]),
        .I1(c_IBUF[6]),
        .I2(d_IBUF[7]),
        .I3(c_IBUF[7]),
        .O(\min_OBUF[7]_inst_i_35_n_0 ));
  LUT4 #(
    .INIT(16'h9009)) 
    \min_OBUF[7]_inst_i_36 
       (.I0(d_IBUF[4]),
        .I1(c_IBUF[4]),
        .I2(d_IBUF[5]),
        .I3(c_IBUF[5]),
        .O(\min_OBUF[7]_inst_i_36_n_0 ));
  LUT4 #(
    .INIT(16'h9009)) 
    \min_OBUF[7]_inst_i_37 
       (.I0(d_IBUF[2]),
        .I1(c_IBUF[2]),
        .I2(d_IBUF[3]),
        .I3(c_IBUF[3]),
        .O(\min_OBUF[7]_inst_i_37_n_0 ));
  LUT4 #(
    .INIT(16'h9009)) 
    \min_OBUF[7]_inst_i_38 
       (.I0(d_IBUF[0]),
        .I1(c_IBUF[0]),
        .I2(d_IBUF[1]),
        .I3(c_IBUF[1]),
        .O(\min_OBUF[7]_inst_i_38_n_0 ));
  (* COMPARATOR_THRESHOLD = "11" *) 
  CARRY8 \min_OBUF[7]_inst_i_4 
       (.CI(1'b0),
        .CI_TOP(1'b0),
        .CO({\NLW_min_OBUF[7]_inst_i_4_CO_UNCONNECTED [7:4],p_0_in,\min_OBUF[7]_inst_i_4_n_5 ,\min_OBUF[7]_inst_i_4_n_6 ,\min_OBUF[7]_inst_i_4_n_7 }),
        .DI({1'b0,1'b0,1'b0,1'b0,\min_OBUF[7]_inst_i_22_n_0 ,\min_OBUF[7]_inst_i_23_n_0 ,\min_OBUF[7]_inst_i_24_n_0 ,\min_OBUF[7]_inst_i_25_n_0 }),
        .O(\NLW_min_OBUF[7]_inst_i_4_O_UNCONNECTED [7:0]),
        .S({1'b0,1'b0,1'b0,1'b0,\min_OBUF[7]_inst_i_26_n_0 ,\min_OBUF[7]_inst_i_27_n_0 ,\min_OBUF[7]_inst_i_28_n_0 ,\min_OBUF[7]_inst_i_29_n_0 }));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'hAC)) 
    \min_OBUF[7]_inst_i_5 
       (.I0(c_IBUF[7]),
        .I1(d_IBUF[7]),
        .I2(min_cd1),
        .O(min_cd[7]));
  LUT6 #(
    .INIT(64'h00E4FFFF000000E4)) 
    \min_OBUF[7]_inst_i_6 
       (.I0(min_cd1),
        .I1(d_IBUF[6]),
        .I2(c_IBUF[6]),
        .I3(a_IBUF[6]),
        .I4(a_IBUF[7]),
        .I5(min_cd[7]),
        .O(\min_OBUF[7]_inst_i_6_n_0 ));
  LUT6 #(
    .INIT(64'h00E4FFFF000000E4)) 
    \min_OBUF[7]_inst_i_7 
       (.I0(min_cd1),
        .I1(d_IBUF[4]),
        .I2(c_IBUF[4]),
        .I3(a_IBUF[4]),
        .I4(a_IBUF[5]),
        .I5(min_cd[5]),
        .O(\min_OBUF[7]_inst_i_7_n_0 ));
  LUT6 #(
    .INIT(64'h00E4FFFF000000E4)) 
    \min_OBUF[7]_inst_i_8 
       (.I0(min_cd1),
        .I1(d_IBUF[2]),
        .I2(c_IBUF[2]),
        .I3(a_IBUF[2]),
        .I4(a_IBUF[3]),
        .I5(min_cd[3]),
        .O(\min_OBUF[7]_inst_i_8_n_0 ));
  LUT6 #(
    .INIT(64'h00E4FFFF000000E4)) 
    \min_OBUF[7]_inst_i_9 
       (.I0(min_cd1),
        .I1(d_IBUF[0]),
        .I2(c_IBUF[0]),
        .I3(a_IBUF[0]),
        .I4(a_IBUF[1]),
        .I5(min_cd[1]),
        .O(\min_OBUF[7]_inst_i_9_n_0 ));
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
