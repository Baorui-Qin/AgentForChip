// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Mon Sep 28 00:05:43 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob141_count_clock/eda/run-sSAHbF/build/.rtl-synth-0jM8LN/netlist.v
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
    ena,
    pm,
    hh,
    mm,
    ss);
  input clk;
  input reset;
  input ena;
  output pm;
  output [7:0]hh;
  output [7:0]mm;
  output [7:0]ss;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire ena;
  wire ena_IBUF;
  wire [7:0]hh;
  wire [4:0]hh_OBUF;
  wire [1:1]hh_ones;
  wire \hh_ones[0]_i_1_n_0 ;
  wire \hh_ones[2]_i_1_n_0 ;
  wire \hh_ones[3]_i_1_n_0 ;
  wire \hh_ones[3]_i_2_n_0 ;
  wire \hh_tens[0]_i_1_n_0 ;
  wire \hh_tens[0]_i_3_n_0 ;
  wire \hh_tens[0]_i_4_n_0 ;
  wire \hh_tens[0]_i_5_n_0 ;
  wire \hh_tens[0]_i_6_n_0 ;
  wire [7:0]mm;
  wire [7:0]mm_OBUF;
  wire [0:0]mm_ones;
  wire \mm_ones[0]_i_1_n_0 ;
  wire \mm_ones[1]_i_1_n_0 ;
  wire \mm_ones[2]_i_1_n_0 ;
  wire \mm_ones[3]_i_2_n_0 ;
  wire [0:0]mm_tens;
  wire \mm_tens[0]_i_1_n_0 ;
  wire \mm_tens[1]_i_1_n_0 ;
  wire \mm_tens[2]_i_1_n_0 ;
  wire \mm_tens[3]_i_2_n_0 ;
  wire \mm_tens[3]_i_3_n_0 ;
  wire pm;
  wire pm_OBUF;
  wire pm_reg0_out;
  wire pm_reg_i_1_n_0;
  wire pm_reg_i_2_n_0;
  wire pm_reg_i_3_n_0;
  wire reset;
  wire reset_IBUF;
  wire [7:0]ss;
  wire [7:0]ss_OBUF;
  wire \ss_ones[0]_i_1_n_0 ;
  wire \ss_ones[1]_i_1_n_0 ;
  wire \ss_ones[2]_i_1_n_0 ;
  wire \ss_ones[3]_i_1_n_0 ;
  wire [0:0]ss_tens;
  wire \ss_tens[0]_i_1_n_0 ;
  wire \ss_tens[1]_i_1_n_0 ;
  wire \ss_tens[2]_i_1_n_0 ;
  wire \ss_tens[3]_i_2_n_0 ;

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
  IBUF ena_IBUF_inst
       (.I(ena),
        .O(ena_IBUF));
  OBUF \hh_OBUF[0]_inst 
       (.I(hh_OBUF[0]),
        .O(hh[0]));
  OBUF \hh_OBUF[1]_inst 
       (.I(hh_OBUF[1]),
        .O(hh[1]));
  OBUF \hh_OBUF[2]_inst 
       (.I(hh_OBUF[2]),
        .O(hh[2]));
  OBUF \hh_OBUF[3]_inst 
       (.I(hh_OBUF[3]),
        .O(hh[3]));
  OBUF \hh_OBUF[4]_inst 
       (.I(hh_OBUF[4]),
        .O(hh[4]));
  OBUF \hh_OBUF[5]_inst 
       (.I(1'b0),
        .O(hh[5]));
  OBUF \hh_OBUF[6]_inst 
       (.I(1'b0),
        .O(hh[6]));
  OBUF \hh_OBUF[7]_inst 
       (.I(1'b0),
        .O(hh[7]));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT2 #(
    .INIT(4'h1)) 
    \hh_ones[0]_i_1 
       (.I0(hh_OBUF[0]),
        .I1(reset_IBUF),
        .O(\hh_ones[0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hBEBEBEBEBEAEBABE)) 
    \hh_ones[1]_i_1 
       (.I0(reset_IBUF),
        .I1(hh_OBUF[1]),
        .I2(hh_OBUF[0]),
        .I3(hh_OBUF[4]),
        .I4(hh_OBUF[3]),
        .I5(hh_OBUF[2]),
        .O(hh_ones));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT4 #(
    .INIT(16'h1540)) 
    \hh_ones[2]_i_1 
       (.I0(reset_IBUF),
        .I1(hh_OBUF[1]),
        .I2(hh_OBUF[0]),
        .I3(hh_OBUF[2]),
        .O(\hh_ones[2]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hAAAAAEAAAAAAAAAA)) 
    \hh_ones[3]_i_1 
       (.I0(reset_IBUF),
        .I1(mm_OBUF[4]),
        .I2(mm_OBUF[7]),
        .I3(mm_OBUF[6]),
        .I4(mm_OBUF[5]),
        .I5(mm_tens),
        .O(\hh_ones[3]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h1444444414404444)) 
    \hh_ones[3]_i_2 
       (.I0(reset_IBUF),
        .I1(hh_OBUF[3]),
        .I2(hh_OBUF[2]),
        .I3(hh_OBUF[1]),
        .I4(hh_OBUF[0]),
        .I5(hh_OBUF[4]),
        .O(\hh_ones[3]_i_2_n_0 ));
  FDRE \hh_ones_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\hh_ones[3]_i_1_n_0 ),
        .D(\hh_ones[0]_i_1_n_0 ),
        .Q(hh_OBUF[0]),
        .R(1'b0));
  FDRE \hh_ones_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\hh_ones[3]_i_1_n_0 ),
        .D(hh_ones),
        .Q(hh_OBUF[1]),
        .R(1'b0));
  FDRE \hh_ones_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\hh_ones[3]_i_1_n_0 ),
        .D(\hh_ones[2]_i_1_n_0 ),
        .Q(hh_OBUF[2]),
        .R(1'b0));
  FDRE \hh_ones_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\hh_ones[3]_i_1_n_0 ),
        .D(\hh_ones[3]_i_2_n_0 ),
        .Q(hh_OBUF[3]),
        .R(1'b0));
  LUT6 #(
    .INIT(64'hFFFFFFFFFFEFAAEA)) 
    \hh_tens[0]_i_1 
       (.I0(pm_reg0_out),
        .I1(\hh_tens[0]_i_3_n_0 ),
        .I2(\hh_tens[0]_i_4_n_0 ),
        .I3(\hh_tens[0]_i_5_n_0 ),
        .I4(hh_OBUF[4]),
        .I5(reset_IBUF),
        .O(\hh_tens[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h00001000)) 
    \hh_tens[0]_i_2 
       (.I0(\mm_tens[3]_i_3_n_0 ),
        .I1(\hh_tens[0]_i_6_n_0 ),
        .I2(ss_tens),
        .I3(pm_reg_i_2_n_0),
        .I4(pm_reg_i_3_n_0),
        .O(pm_reg0_out));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'hFFFFFDFF)) 
    \hh_tens[0]_i_3 
       (.I0(hh_OBUF[1]),
        .I1(hh_OBUF[0]),
        .I2(hh_OBUF[2]),
        .I3(hh_OBUF[4]),
        .I4(hh_OBUF[3]),
        .O(\hh_tens[0]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h0010)) 
    \hh_tens[0]_i_4 
       (.I0(\mm_tens[3]_i_3_n_0 ),
        .I1(\hh_tens[0]_i_6_n_0 ),
        .I2(ss_tens),
        .I3(pm_reg_i_3_n_0),
        .O(\hh_tens[0]_i_4_n_0 ));
  LUT5 #(
    .INIT(32'hFFFFFBDF)) 
    \hh_tens[0]_i_5 
       (.I0(hh_OBUF[1]),
        .I1(hh_OBUF[0]),
        .I2(hh_OBUF[4]),
        .I3(hh_OBUF[3]),
        .I4(hh_OBUF[2]),
        .O(\hh_tens[0]_i_5_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'hFFF7)) 
    \hh_tens[0]_i_6 
       (.I0(mm_OBUF[3]),
        .I1(mm_OBUF[0]),
        .I2(mm_OBUF[2]),
        .I3(mm_OBUF[1]),
        .O(\hh_tens[0]_i_6_n_0 ));
  FDRE \hh_tens_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\hh_tens[0]_i_1_n_0 ),
        .Q(hh_OBUF[4]),
        .R(1'b0));
  OBUF \mm_OBUF[0]_inst 
       (.I(mm_OBUF[0]),
        .O(mm[0]));
  OBUF \mm_OBUF[1]_inst 
       (.I(mm_OBUF[1]),
        .O(mm[1]));
  OBUF \mm_OBUF[2]_inst 
       (.I(mm_OBUF[2]),
        .O(mm[2]));
  OBUF \mm_OBUF[3]_inst 
       (.I(mm_OBUF[3]),
        .O(mm[3]));
  OBUF \mm_OBUF[4]_inst 
       (.I(mm_OBUF[4]),
        .O(mm[4]));
  OBUF \mm_OBUF[5]_inst 
       (.I(mm_OBUF[5]),
        .O(mm[5]));
  OBUF \mm_OBUF[6]_inst 
       (.I(mm_OBUF[6]),
        .O(mm[6]));
  OBUF \mm_OBUF[7]_inst 
       (.I(mm_OBUF[7]),
        .O(mm[7]));
  LUT1 #(
    .INIT(2'h1)) 
    \mm_ones[0]_i_1 
       (.I0(mm_OBUF[0]),
        .O(\mm_ones[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'h0BF0)) 
    \mm_ones[1]_i_1 
       (.I0(mm_OBUF[2]),
        .I1(mm_OBUF[3]),
        .I2(mm_OBUF[1]),
        .I3(mm_OBUF[0]),
        .O(\mm_ones[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'h6A)) 
    \mm_ones[2]_i_1 
       (.I0(mm_OBUF[2]),
        .I1(mm_OBUF[1]),
        .I2(mm_OBUF[0]),
        .O(\mm_ones[2]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00200000)) 
    \mm_ones[3]_i_1 
       (.I0(ss_tens),
        .I1(ss_OBUF[7]),
        .I2(ss_OBUF[6]),
        .I3(ss_OBUF[5]),
        .I4(ss_OBUF[4]),
        .O(mm_ones));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT4 #(
    .INIT(16'h6F80)) 
    \mm_ones[3]_i_2 
       (.I0(mm_OBUF[2]),
        .I1(mm_OBUF[1]),
        .I2(mm_OBUF[0]),
        .I3(mm_OBUF[3]),
        .O(\mm_ones[3]_i_2_n_0 ));
  FDRE \mm_ones_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(mm_ones),
        .D(\mm_ones[0]_i_1_n_0 ),
        .Q(mm_OBUF[0]),
        .R(reset_IBUF));
  FDRE \mm_ones_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(mm_ones),
        .D(\mm_ones[1]_i_1_n_0 ),
        .Q(mm_OBUF[1]),
        .R(reset_IBUF));
  FDRE \mm_ones_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(mm_ones),
        .D(\mm_ones[2]_i_1_n_0 ),
        .Q(mm_OBUF[2]),
        .R(reset_IBUF));
  FDRE \mm_ones_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(mm_ones),
        .D(\mm_ones[3]_i_2_n_0 ),
        .Q(mm_OBUF[3]),
        .R(reset_IBUF));
  LUT1 #(
    .INIT(2'h1)) 
    \mm_tens[0]_i_1 
       (.I0(mm_OBUF[4]),
        .O(\mm_tens[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT4 #(
    .INIT(16'h0DF0)) 
    \mm_tens[1]_i_1 
       (.I0(mm_OBUF[6]),
        .I1(mm_OBUF[7]),
        .I2(mm_OBUF[5]),
        .I3(mm_OBUF[4]),
        .O(\mm_tens[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT4 #(
    .INIT(16'h3BC0)) 
    \mm_tens[2]_i_1 
       (.I0(mm_OBUF[7]),
        .I1(mm_OBUF[4]),
        .I2(mm_OBUF[5]),
        .I3(mm_OBUF[6]),
        .O(\mm_tens[2]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000080)) 
    \mm_tens[3]_i_1 
       (.I0(ss_tens),
        .I1(mm_OBUF[3]),
        .I2(mm_OBUF[0]),
        .I3(mm_OBUF[2]),
        .I4(mm_OBUF[1]),
        .I5(\mm_tens[3]_i_3_n_0 ),
        .O(mm_tens));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT4 #(
    .INIT(16'h6AAA)) 
    \mm_tens[3]_i_2 
       (.I0(mm_OBUF[7]),
        .I1(mm_OBUF[6]),
        .I2(mm_OBUF[4]),
        .I3(mm_OBUF[5]),
        .O(\mm_tens[3]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT4 #(
    .INIT(16'hFFDF)) 
    \mm_tens[3]_i_3 
       (.I0(ss_OBUF[4]),
        .I1(ss_OBUF[5]),
        .I2(ss_OBUF[6]),
        .I3(ss_OBUF[7]),
        .O(\mm_tens[3]_i_3_n_0 ));
  FDRE \mm_tens_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(mm_tens),
        .D(\mm_tens[0]_i_1_n_0 ),
        .Q(mm_OBUF[4]),
        .R(reset_IBUF));
  FDRE \mm_tens_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(mm_tens),
        .D(\mm_tens[1]_i_1_n_0 ),
        .Q(mm_OBUF[5]),
        .R(reset_IBUF));
  FDRE \mm_tens_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(mm_tens),
        .D(\mm_tens[2]_i_1_n_0 ),
        .Q(mm_OBUF[6]),
        .R(reset_IBUF));
  FDRE \mm_tens_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(mm_tens),
        .D(\mm_tens[3]_i_2_n_0 ),
        .Q(mm_OBUF[7]),
        .R(reset_IBUF));
  OBUF pm_OBUF_inst
       (.I(pm_OBUF),
        .O(pm));
  LUT5 #(
    .INIT(32'h0000AA6A)) 
    pm_reg_i_1
       (.I0(pm_OBUF),
        .I1(mm_tens),
        .I2(pm_reg_i_2_n_0),
        .I3(pm_reg_i_3_n_0),
        .I4(reset_IBUF),
        .O(pm_reg_i_1_n_0));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'h00000400)) 
    pm_reg_i_2
       (.I0(hh_OBUF[2]),
        .I1(hh_OBUF[4]),
        .I2(hh_OBUF[3]),
        .I3(hh_OBUF[0]),
        .I4(hh_OBUF[1]),
        .O(pm_reg_i_2_n_0));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT4 #(
    .INIT(16'hFFDF)) 
    pm_reg_i_3
       (.I0(mm_OBUF[4]),
        .I1(mm_OBUF[7]),
        .I2(mm_OBUF[6]),
        .I3(mm_OBUF[5]),
        .O(pm_reg_i_3_n_0));
  FDRE pm_reg_reg
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(pm_reg_i_1_n_0),
        .Q(pm_OBUF),
        .R(1'b0));
  IBUF reset_IBUF_inst
       (.I(reset),
        .O(reset_IBUF));
  OBUF \ss_OBUF[0]_inst 
       (.I(ss_OBUF[0]),
        .O(ss[0]));
  OBUF \ss_OBUF[1]_inst 
       (.I(ss_OBUF[1]),
        .O(ss[1]));
  OBUF \ss_OBUF[2]_inst 
       (.I(ss_OBUF[2]),
        .O(ss[2]));
  OBUF \ss_OBUF[3]_inst 
       (.I(ss_OBUF[3]),
        .O(ss[3]));
  OBUF \ss_OBUF[4]_inst 
       (.I(ss_OBUF[4]),
        .O(ss[4]));
  OBUF \ss_OBUF[5]_inst 
       (.I(ss_OBUF[5]),
        .O(ss[5]));
  OBUF \ss_OBUF[6]_inst 
       (.I(ss_OBUF[6]),
        .O(ss[6]));
  OBUF \ss_OBUF[7]_inst 
       (.I(ss_OBUF[7]),
        .O(ss[7]));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT1 #(
    .INIT(2'h1)) 
    \ss_ones[0]_i_1 
       (.I0(ss_OBUF[0]),
        .O(\ss_ones[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT4 #(
    .INIT(16'h0BF0)) 
    \ss_ones[1]_i_1 
       (.I0(ss_OBUF[2]),
        .I1(ss_OBUF[3]),
        .I2(ss_OBUF[1]),
        .I3(ss_OBUF[0]),
        .O(\ss_ones[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT3 #(
    .INIT(8'h6A)) 
    \ss_ones[2]_i_1 
       (.I0(ss_OBUF[2]),
        .I1(ss_OBUF[1]),
        .I2(ss_OBUF[0]),
        .O(\ss_ones[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT4 #(
    .INIT(16'h6F80)) 
    \ss_ones[3]_i_1 
       (.I0(ss_OBUF[2]),
        .I1(ss_OBUF[1]),
        .I2(ss_OBUF[0]),
        .I3(ss_OBUF[3]),
        .O(\ss_ones[3]_i_1_n_0 ));
  FDRE \ss_ones_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_IBUF),
        .D(\ss_ones[0]_i_1_n_0 ),
        .Q(ss_OBUF[0]),
        .R(reset_IBUF));
  FDRE \ss_ones_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_IBUF),
        .D(\ss_ones[1]_i_1_n_0 ),
        .Q(ss_OBUF[1]),
        .R(reset_IBUF));
  FDRE \ss_ones_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_IBUF),
        .D(\ss_ones[2]_i_1_n_0 ),
        .Q(ss_OBUF[2]),
        .R(reset_IBUF));
  FDRE \ss_ones_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_IBUF),
        .D(\ss_ones[3]_i_1_n_0 ),
        .Q(ss_OBUF[3]),
        .R(reset_IBUF));
  LUT1 #(
    .INIT(2'h1)) 
    \ss_tens[0]_i_1 
       (.I0(ss_OBUF[4]),
        .O(\ss_tens[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT4 #(
    .INIT(16'h0BF0)) 
    \ss_tens[1]_i_1 
       (.I0(ss_OBUF[7]),
        .I1(ss_OBUF[6]),
        .I2(ss_OBUF[5]),
        .I3(ss_OBUF[4]),
        .O(\ss_tens[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT4 #(
    .INIT(16'h3BC0)) 
    \ss_tens[2]_i_1 
       (.I0(ss_OBUF[7]),
        .I1(ss_OBUF[4]),
        .I2(ss_OBUF[5]),
        .I3(ss_OBUF[6]),
        .O(\ss_tens[2]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h02000000)) 
    \ss_tens[3]_i_1 
       (.I0(ena_IBUF),
        .I1(ss_OBUF[1]),
        .I2(ss_OBUF[2]),
        .I3(ss_OBUF[0]),
        .I4(ss_OBUF[3]),
        .O(ss_tens));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT4 #(
    .INIT(16'h6AAA)) 
    \ss_tens[3]_i_2 
       (.I0(ss_OBUF[7]),
        .I1(ss_OBUF[6]),
        .I2(ss_OBUF[4]),
        .I3(ss_OBUF[5]),
        .O(\ss_tens[3]_i_2_n_0 ));
  FDRE \ss_tens_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(ss_tens),
        .D(\ss_tens[0]_i_1_n_0 ),
        .Q(ss_OBUF[4]),
        .R(reset_IBUF));
  FDRE \ss_tens_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(ss_tens),
        .D(\ss_tens[1]_i_1_n_0 ),
        .Q(ss_OBUF[5]),
        .R(reset_IBUF));
  FDRE \ss_tens_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(ss_tens),
        .D(\ss_tens[2]_i_1_n_0 ),
        .Q(ss_OBUF[6]),
        .R(reset_IBUF));
  FDRE \ss_tens_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(ss_tens),
        .D(\ss_tens[3]_i_2_n_0 ),
        .Q(ss_OBUF[7]),
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
