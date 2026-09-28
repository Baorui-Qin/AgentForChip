// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 16:51:24 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/netlist-suite-20260927/full-v3/eda/run-zjaSEG/build/.rtl-synth-FsJZ95/netlist.v
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
  wire \hh[0]_i_1_n_0 ;
  wire \hh[1]_i_1_n_0 ;
  wire \hh[1]_i_2_n_0 ;
  wire \hh[2]_i_1_n_0 ;
  wire \hh[3]_i_1_n_0 ;
  wire \hh[3]_i_2_n_0 ;
  wire \hh[3]_i_3_n_0 ;
  wire \hh[4]_i_1_n_0 ;
  wire \hh[5]_i_1_n_0 ;
  wire \hh[6]_i_1_n_0 ;
  wire \hh[7]_i_1_n_0 ;
  wire \hh[7]_i_2_n_0 ;
  wire \hh[7]_i_3_n_0 ;
  wire \hh[7]_i_4_n_0 ;
  wire \hh[7]_i_5_n_0 ;
  wire \hh[7]_i_6_n_0 ;
  wire \hh[7]_i_7_n_0 ;
  wire \hh[7]_i_8_n_0 ;
  wire [7:0]hh_OBUF;
  wire [7:0]mm;
  wire [3:0]mm0;
  wire \mm[0]_i_1_n_0 ;
  wire \mm[1]_i_1_n_0 ;
  wire \mm[2]_i_1_n_0 ;
  wire \mm[3]_i_1_n_0 ;
  wire \mm[3]_i_2_n_0 ;
  wire \mm[3]_i_3_n_0 ;
  wire \mm[7]_i_1_n_0 ;
  wire \mm[7]_i_2_n_0 ;
  wire \mm[7]_i_4_n_0 ;
  wire [7:0]mm_OBUF;
  wire pm;
  wire pm_OBUF;
  wire pm_i_1_n_0;
  wire reset;
  wire reset_IBUF;
  wire [7:0]ss;
  wire [3:0]ss0;
  wire \ss[0]_i_1_n_0 ;
  wire \ss[1]_i_1_n_0 ;
  wire \ss[2]_i_1_n_0 ;
  wire \ss[3]_i_1_n_0 ;
  wire \ss[3]_i_2_n_0 ;
  wire \ss[7]_i_1_n_0 ;
  wire \ss[7]_i_2_n_0 ;
  wire [7:0]ss_OBUF;

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
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT2 #(
    .INIT(4'h1)) 
    \hh[0]_i_1 
       (.I0(hh_OBUF[0]),
        .I1(reset_IBUF),
        .O(\hh[0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hAEBEBEBEAABEBABE)) 
    \hh[1]_i_1 
       (.I0(reset_IBUF),
        .I1(hh_OBUF[1]),
        .I2(hh_OBUF[0]),
        .I3(\hh[7]_i_3_n_0 ),
        .I4(hh_OBUF[3]),
        .I5(\hh[1]_i_2_n_0 ),
        .O(\hh[1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hFFFFFEFF)) 
    \hh[1]_i_2 
       (.I0(hh_OBUF[3]),
        .I1(hh_OBUF[6]),
        .I2(hh_OBUF[5]),
        .I3(hh_OBUF[4]),
        .I4(hh_OBUF[7]),
        .O(\hh[1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT4 #(
    .INIT(16'h1540)) 
    \hh[2]_i_1 
       (.I0(reset_IBUF),
        .I1(hh_OBUF[1]),
        .I2(hh_OBUF[0]),
        .I3(hh_OBUF[2]),
        .O(\hh[2]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0D000D0D000D0000)) 
    \hh[3]_i_1 
       (.I0(\hh[7]_i_3_n_0 ),
        .I1(\hh[3]_i_2_n_0 ),
        .I2(reset_IBUF),
        .I3(\hh[3]_i_3_n_0 ),
        .I4(hh_OBUF[2]),
        .I5(hh_OBUF[3]),
        .O(\hh[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT4 #(
    .INIT(16'hCBFB)) 
    \hh[3]_i_2 
       (.I0(\hh[1]_i_2_n_0 ),
        .I1(hh_OBUF[1]),
        .I2(hh_OBUF[0]),
        .I3(hh_OBUF[3]),
        .O(\hh[3]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT2 #(
    .INIT(4'h7)) 
    \hh[3]_i_3 
       (.I0(hh_OBUF[1]),
        .I1(hh_OBUF[0]),
        .O(\hh[3]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'hB)) 
    \hh[4]_i_1 
       (.I0(reset_IBUF),
        .I1(hh_OBUF[4]),
        .O(\hh[4]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h14001414)) 
    \hh[5]_i_1 
       (.I0(reset_IBUF),
        .I1(hh_OBUF[5]),
        .I2(hh_OBUF[4]),
        .I3(\hh[7]_i_5_n_0 ),
        .I4(\hh[7]_i_3_n_0 ),
        .O(\hh[5]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'h1540)) 
    \hh[6]_i_1 
       (.I0(reset_IBUF),
        .I1(hh_OBUF[5]),
        .I2(hh_OBUF[4]),
        .I3(hh_OBUF[6]),
        .O(\hh[6]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFFFFF00808888)) 
    \hh[7]_i_1 
       (.I0(ena_IBUF),
        .I1(\hh[7]_i_3_n_0 ),
        .I2(hh_OBUF[3]),
        .I3(\hh[7]_i_4_n_0 ),
        .I4(\hh[7]_i_5_n_0 ),
        .I5(reset_IBUF),
        .O(\hh[7]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'h15554000)) 
    \hh[7]_i_2 
       (.I0(reset_IBUF),
        .I1(hh_OBUF[4]),
        .I2(hh_OBUF[5]),
        .I3(hh_OBUF[6]),
        .I4(hh_OBUF[7]),
        .O(\hh[7]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00010000)) 
    \hh[7]_i_3 
       (.I0(\hh[7]_i_6_n_0 ),
        .I1(\mm[7]_i_4_n_0 ),
        .I2(hh_OBUF[2]),
        .I3(\hh[7]_i_7_n_0 ),
        .I4(\hh[7]_i_8_n_0 ),
        .O(\hh[7]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT2 #(
    .INIT(4'hB)) 
    \hh[7]_i_4 
       (.I0(hh_OBUF[1]),
        .I1(hh_OBUF[0]),
        .O(\hh[7]_i_4_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'hFB)) 
    \hh[7]_i_5 
       (.I0(\hh[1]_i_2_n_0 ),
        .I1(hh_OBUF[1]),
        .I2(hh_OBUF[0]),
        .O(\hh[7]_i_5_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT4 #(
    .INIT(16'hFFDF)) 
    \hh[7]_i_6 
       (.I0(mm_OBUF[0]),
        .I1(mm_OBUF[1]),
        .I2(mm_OBUF[3]),
        .I3(mm_OBUF[2]),
        .O(\hh[7]_i_6_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT4 #(
    .INIT(16'hFFDF)) 
    \hh[7]_i_7 
       (.I0(ss_OBUF[0]),
        .I1(ss_OBUF[1]),
        .I2(ss_OBUF[3]),
        .I3(ss_OBUF[2]),
        .O(\hh[7]_i_7_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT4 #(
    .INIT(16'h0008)) 
    \hh[7]_i_8 
       (.I0(mm_OBUF[4]),
        .I1(mm_OBUF[6]),
        .I2(mm_OBUF[5]),
        .I3(mm_OBUF[7]),
        .O(\hh[7]_i_8_n_0 ));
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
       (.I(hh_OBUF[5]),
        .O(hh[5]));
  OBUF \hh_OBUF[6]_inst 
       (.I(hh_OBUF[6]),
        .O(hh[6]));
  OBUF \hh_OBUF[7]_inst 
       (.I(hh_OBUF[7]),
        .O(hh[7]));
  FDRE \hh_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[7]_i_1_n_0 ),
        .D(\hh[0]_i_1_n_0 ),
        .Q(hh_OBUF[0]),
        .R(1'b0));
  FDRE \hh_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[7]_i_1_n_0 ),
        .D(\hh[1]_i_1_n_0 ),
        .Q(hh_OBUF[1]),
        .R(1'b0));
  FDRE \hh_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[7]_i_1_n_0 ),
        .D(\hh[2]_i_1_n_0 ),
        .Q(hh_OBUF[2]),
        .R(1'b0));
  FDRE \hh_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[7]_i_1_n_0 ),
        .D(\hh[3]_i_1_n_0 ),
        .Q(hh_OBUF[3]),
        .R(1'b0));
  FDRE \hh_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\hh[7]_i_1_n_0 ),
        .D(\hh[4]_i_1_n_0 ),
        .Q(hh_OBUF[4]),
        .R(1'b0));
  FDRE \hh_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\hh[7]_i_1_n_0 ),
        .D(\hh[5]_i_1_n_0 ),
        .Q(hh_OBUF[5]),
        .R(1'b0));
  FDRE \hh_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\hh[7]_i_1_n_0 ),
        .D(\hh[6]_i_1_n_0 ),
        .Q(hh_OBUF[6]),
        .R(1'b0));
  FDRE \hh_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\hh[7]_i_1_n_0 ),
        .D(\hh[7]_i_2_n_0 ),
        .Q(hh_OBUF[7]),
        .R(1'b0));
  LUT1 #(
    .INIT(2'h1)) 
    \mm[0]_i_1 
       (.I0(mm_OBUF[0]),
        .O(\mm[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \mm[1]_i_1 
       (.I0(mm_OBUF[0]),
        .I1(mm_OBUF[1]),
        .O(\mm[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT3 #(
    .INIT(8'h6A)) 
    \mm[2]_i_1 
       (.I0(mm_OBUF[2]),
        .I1(mm_OBUF[1]),
        .I2(mm_OBUF[0]),
        .O(\mm[2]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'hE)) 
    \mm[3]_i_1 
       (.I0(reset_IBUF),
        .I1(\mm[7]_i_2_n_0 ),
        .O(\mm[3]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h02000000)) 
    \mm[3]_i_2 
       (.I0(\ss[7]_i_2_n_0 ),
        .I1(ss_OBUF[7]),
        .I2(ss_OBUF[5]),
        .I3(ss_OBUF[6]),
        .I4(ss_OBUF[4]),
        .O(\mm[3]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT4 #(
    .INIT(16'h6AAA)) 
    \mm[3]_i_3 
       (.I0(mm_OBUF[3]),
        .I1(mm_OBUF[0]),
        .I2(mm_OBUF[1]),
        .I3(mm_OBUF[2]),
        .O(\mm[3]_i_3_n_0 ));
  LUT1 #(
    .INIT(2'h1)) 
    \mm[4]_i_1 
       (.I0(mm_OBUF[4]),
        .O(mm0[0]));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \mm[5]_i_1 
       (.I0(mm_OBUF[4]),
        .I1(mm_OBUF[5]),
        .O(mm0[1]));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT3 #(
    .INIT(8'h6A)) 
    \mm[6]_i_1 
       (.I0(mm_OBUF[6]),
        .I1(mm_OBUF[5]),
        .I2(mm_OBUF[4]),
        .O(mm0[2]));
  LUT6 #(
    .INIT(64'hAAAAAAAAAAAAEAAA)) 
    \mm[7]_i_1 
       (.I0(reset_IBUF),
        .I1(\mm[7]_i_2_n_0 ),
        .I2(mm_OBUF[4]),
        .I3(mm_OBUF[6]),
        .I4(mm_OBUF[5]),
        .I5(mm_OBUF[7]),
        .O(\mm[7]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000002000000000)) 
    \mm[7]_i_2 
       (.I0(mm_OBUF[0]),
        .I1(mm_OBUF[1]),
        .I2(mm_OBUF[3]),
        .I3(mm_OBUF[2]),
        .I4(\mm[7]_i_4_n_0 ),
        .I5(\ss[7]_i_2_n_0 ),
        .O(\mm[7]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT4 #(
    .INIT(16'h6AAA)) 
    \mm[7]_i_3 
       (.I0(mm_OBUF[7]),
        .I1(mm_OBUF[6]),
        .I2(mm_OBUF[4]),
        .I3(mm_OBUF[5]),
        .O(mm0[3]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'hFFF7)) 
    \mm[7]_i_4 
       (.I0(ss_OBUF[4]),
        .I1(ss_OBUF[6]),
        .I2(ss_OBUF[5]),
        .I3(ss_OBUF[7]),
        .O(\mm[7]_i_4_n_0 ));
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
  FDRE \mm_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[3]_i_2_n_0 ),
        .D(\mm[0]_i_1_n_0 ),
        .Q(mm_OBUF[0]),
        .R(\mm[3]_i_1_n_0 ));
  FDRE \mm_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[3]_i_2_n_0 ),
        .D(\mm[1]_i_1_n_0 ),
        .Q(mm_OBUF[1]),
        .R(\mm[3]_i_1_n_0 ));
  FDRE \mm_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[3]_i_2_n_0 ),
        .D(\mm[2]_i_1_n_0 ),
        .Q(mm_OBUF[2]),
        .R(\mm[3]_i_1_n_0 ));
  FDRE \mm_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[3]_i_2_n_0 ),
        .D(\mm[3]_i_3_n_0 ),
        .Q(mm_OBUF[3]),
        .R(\mm[3]_i_1_n_0 ));
  FDRE \mm_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[7]_i_2_n_0 ),
        .D(mm0[0]),
        .Q(mm_OBUF[4]),
        .R(\mm[7]_i_1_n_0 ));
  FDRE \mm_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[7]_i_2_n_0 ),
        .D(mm0[1]),
        .Q(mm_OBUF[5]),
        .R(\mm[7]_i_1_n_0 ));
  FDRE \mm_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[7]_i_2_n_0 ),
        .D(mm0[2]),
        .Q(mm_OBUF[6]),
        .R(\mm[7]_i_1_n_0 ));
  FDRE \mm_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\mm[7]_i_2_n_0 ),
        .D(mm0[3]),
        .Q(mm_OBUF[7]),
        .R(\mm[7]_i_1_n_0 ));
  OBUF pm_OBUF_inst
       (.I(pm_OBUF),
        .O(pm));
  LUT6 #(
    .INIT(64'h00000000AAAAA6AA)) 
    pm_i_1
       (.I0(pm_OBUF),
        .I1(\hh[7]_i_3_n_0 ),
        .I2(\hh[7]_i_4_n_0 ),
        .I3(ena_IBUF),
        .I4(\hh[1]_i_2_n_0 ),
        .I5(reset_IBUF),
        .O(pm_i_1_n_0));
  FDRE pm_reg
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(pm_i_1_n_0),
        .Q(pm_OBUF),
        .R(1'b0));
  IBUF reset_IBUF_inst
       (.I(reset),
        .O(reset_IBUF));
  LUT1 #(
    .INIT(2'h1)) 
    \ss[0]_i_1 
       (.I0(ss_OBUF[0]),
        .O(\ss[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \ss[1]_i_1 
       (.I0(ss_OBUF[0]),
        .I1(ss_OBUF[1]),
        .O(\ss[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT3 #(
    .INIT(8'h6A)) 
    \ss[2]_i_1 
       (.I0(ss_OBUF[2]),
        .I1(ss_OBUF[1]),
        .I2(ss_OBUF[0]),
        .O(\ss[2]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hAAAAAEAAAAAAAAAA)) 
    \ss[3]_i_1 
       (.I0(reset_IBUF),
        .I1(ss_OBUF[0]),
        .I2(ss_OBUF[1]),
        .I3(ss_OBUF[3]),
        .I4(ss_OBUF[2]),
        .I5(ena_IBUF),
        .O(\ss[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT4 #(
    .INIT(16'h6AAA)) 
    \ss[3]_i_2 
       (.I0(ss_OBUF[3]),
        .I1(ss_OBUF[0]),
        .I2(ss_OBUF[1]),
        .I3(ss_OBUF[2]),
        .O(\ss[3]_i_2_n_0 ));
  LUT1 #(
    .INIT(2'h1)) 
    \ss[4]_i_1 
       (.I0(ss_OBUF[4]),
        .O(ss0[0]));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \ss[5]_i_1 
       (.I0(ss_OBUF[4]),
        .I1(ss_OBUF[5]),
        .O(ss0[1]));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT3 #(
    .INIT(8'h6A)) 
    \ss[6]_i_1 
       (.I0(ss_OBUF[6]),
        .I1(ss_OBUF[5]),
        .I2(ss_OBUF[4]),
        .O(ss0[2]));
  LUT6 #(
    .INIT(64'hAAAAAAEAAAAAAAAA)) 
    \ss[7]_i_1 
       (.I0(reset_IBUF),
        .I1(ss_OBUF[4]),
        .I2(ss_OBUF[6]),
        .I3(ss_OBUF[5]),
        .I4(ss_OBUF[7]),
        .I5(\ss[7]_i_2_n_0 ),
        .O(\ss[7]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00200000)) 
    \ss[7]_i_2 
       (.I0(ena_IBUF),
        .I1(ss_OBUF[2]),
        .I2(ss_OBUF[3]),
        .I3(ss_OBUF[1]),
        .I4(ss_OBUF[0]),
        .O(\ss[7]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'h6AAA)) 
    \ss[7]_i_3 
       (.I0(ss_OBUF[7]),
        .I1(ss_OBUF[6]),
        .I2(ss_OBUF[4]),
        .I3(ss_OBUF[5]),
        .O(ss0[3]));
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
  FDRE \ss_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_IBUF),
        .D(\ss[0]_i_1_n_0 ),
        .Q(ss_OBUF[0]),
        .R(\ss[3]_i_1_n_0 ));
  FDRE \ss_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_IBUF),
        .D(\ss[1]_i_1_n_0 ),
        .Q(ss_OBUF[1]),
        .R(\ss[3]_i_1_n_0 ));
  FDRE \ss_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_IBUF),
        .D(\ss[2]_i_1_n_0 ),
        .Q(ss_OBUF[2]),
        .R(\ss[3]_i_1_n_0 ));
  FDRE \ss_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(ena_IBUF),
        .D(\ss[3]_i_2_n_0 ),
        .Q(ss_OBUF[3]),
        .R(\ss[3]_i_1_n_0 ));
  FDRE \ss_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\ss[7]_i_2_n_0 ),
        .D(ss0[0]),
        .Q(ss_OBUF[4]),
        .R(\ss[7]_i_1_n_0 ));
  FDRE \ss_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\ss[7]_i_2_n_0 ),
        .D(ss0[1]),
        .Q(ss_OBUF[5]),
        .R(\ss[7]_i_1_n_0 ));
  FDRE \ss_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\ss[7]_i_2_n_0 ),
        .D(ss0[2]),
        .Q(ss_OBUF[6]),
        .R(\ss[7]_i_1_n_0 ));
  FDRE \ss_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\ss[7]_i_2_n_0 ),
        .D(ss0[3]),
        .Q(ss_OBUF[7]),
        .R(\ss[7]_i_1_n_0 ));
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
