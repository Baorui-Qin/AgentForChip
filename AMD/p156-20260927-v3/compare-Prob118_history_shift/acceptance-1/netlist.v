// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 23:39:59 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob118_history_shift/eda/run-xeeI2R/build/.rtl-synth-uzxQZm/netlist.v
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
    predict_valid,
    predict_taken,
    train_mispredicted,
    train_taken,
    train_history,
    predict_history);
  input clk;
  input areset;
  input predict_valid;
  input predict_taken;
  input train_mispredicted;
  input train_taken;
  input [31:0]train_history;
  output [31:0]predict_history;

  wire areset;
  wire areset_IBUF;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire \history[0]_i_1_n_0 ;
  wire \history[10]_i_1_n_0 ;
  wire \history[11]_i_1_n_0 ;
  wire \history[12]_i_1_n_0 ;
  wire \history[13]_i_1_n_0 ;
  wire \history[14]_i_1_n_0 ;
  wire \history[15]_i_1_n_0 ;
  wire \history[16]_i_1_n_0 ;
  wire \history[17]_i_1_n_0 ;
  wire \history[18]_i_1_n_0 ;
  wire \history[19]_i_1_n_0 ;
  wire \history[1]_i_1_n_0 ;
  wire \history[20]_i_1_n_0 ;
  wire \history[21]_i_1_n_0 ;
  wire \history[22]_i_1_n_0 ;
  wire \history[23]_i_1_n_0 ;
  wire \history[24]_i_1_n_0 ;
  wire \history[25]_i_1_n_0 ;
  wire \history[26]_i_1_n_0 ;
  wire \history[27]_i_1_n_0 ;
  wire \history[28]_i_1_n_0 ;
  wire \history[29]_i_1_n_0 ;
  wire \history[2]_i_1_n_0 ;
  wire \history[30]_i_1_n_0 ;
  wire \history[31]_i_1_n_0 ;
  wire \history[31]_i_2_n_0 ;
  wire \history[3]_i_1_n_0 ;
  wire \history[4]_i_1_n_0 ;
  wire \history[5]_i_1_n_0 ;
  wire \history[6]_i_1_n_0 ;
  wire \history[7]_i_1_n_0 ;
  wire \history[8]_i_1_n_0 ;
  wire \history[9]_i_1_n_0 ;
  wire [31:0]predict_history;
  wire [31:0]predict_history_OBUF;
  wire predict_taken;
  wire predict_taken_IBUF;
  wire predict_valid;
  wire predict_valid_IBUF;
  wire [31:0]train_history;
  wire [30:0]train_history_IBUF;
  wire train_mispredicted;
  wire train_mispredicted_IBUF;
  wire train_taken;
  wire train_taken_IBUF;

  IBUF areset_IBUF_inst
       (.I(areset),
        .O(areset_IBUF));
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
  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[0]_i_1 
       (.I0(train_taken_IBUF),
        .I1(train_mispredicted_IBUF),
        .I2(predict_taken_IBUF),
        .O(\history[0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[10]_i_1 
       (.I0(train_history_IBUF[9]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[9]),
        .O(\history[10]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[11]_i_1 
       (.I0(train_history_IBUF[10]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[10]),
        .O(\history[11]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[12]_i_1 
       (.I0(train_history_IBUF[11]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[11]),
        .O(\history[12]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[13]_i_1 
       (.I0(train_history_IBUF[12]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[12]),
        .O(\history[13]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[14]_i_1 
       (.I0(train_history_IBUF[13]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[13]),
        .O(\history[14]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[15]_i_1 
       (.I0(train_history_IBUF[14]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[14]),
        .O(\history[15]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[16]_i_1 
       (.I0(train_history_IBUF[15]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[15]),
        .O(\history[16]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[17]_i_1 
       (.I0(train_history_IBUF[16]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[16]),
        .O(\history[17]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[18]_i_1 
       (.I0(train_history_IBUF[17]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[17]),
        .O(\history[18]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[19]_i_1 
       (.I0(train_history_IBUF[18]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[18]),
        .O(\history[19]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[1]_i_1 
       (.I0(train_history_IBUF[0]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[0]),
        .O(\history[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[20]_i_1 
       (.I0(train_history_IBUF[19]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[19]),
        .O(\history[20]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[21]_i_1 
       (.I0(train_history_IBUF[20]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[20]),
        .O(\history[21]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[22]_i_1 
       (.I0(train_history_IBUF[21]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[21]),
        .O(\history[22]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[23]_i_1 
       (.I0(train_history_IBUF[22]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[22]),
        .O(\history[23]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[24]_i_1 
       (.I0(train_history_IBUF[23]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[23]),
        .O(\history[24]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[25]_i_1 
       (.I0(train_history_IBUF[24]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[24]),
        .O(\history[25]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[26]_i_1 
       (.I0(train_history_IBUF[25]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[25]),
        .O(\history[26]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[27]_i_1 
       (.I0(train_history_IBUF[26]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[26]),
        .O(\history[27]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[28]_i_1 
       (.I0(train_history_IBUF[27]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[27]),
        .O(\history[28]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[29]_i_1 
       (.I0(train_history_IBUF[28]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[28]),
        .O(\history[29]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[2]_i_1 
       (.I0(train_history_IBUF[1]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[1]),
        .O(\history[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[30]_i_1 
       (.I0(train_history_IBUF[29]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[29]),
        .O(\history[30]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'hE)) 
    \history[31]_i_1 
       (.I0(predict_valid_IBUF),
        .I1(train_mispredicted_IBUF),
        .O(\history[31]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[31]_i_2 
       (.I0(train_history_IBUF[30]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[30]),
        .O(\history[31]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[3]_i_1 
       (.I0(train_history_IBUF[2]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[2]),
        .O(\history[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[4]_i_1 
       (.I0(train_history_IBUF[3]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[3]),
        .O(\history[4]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[5]_i_1 
       (.I0(train_history_IBUF[4]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[4]),
        .O(\history[5]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[6]_i_1 
       (.I0(train_history_IBUF[5]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[5]),
        .O(\history[6]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[7]_i_1 
       (.I0(train_history_IBUF[6]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[6]),
        .O(\history[7]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[8]_i_1 
       (.I0(train_history_IBUF[7]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[7]),
        .O(\history[8]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \history[9]_i_1 
       (.I0(train_history_IBUF[8]),
        .I1(train_mispredicted_IBUF),
        .I2(predict_history_OBUF[8]),
        .O(\history[9]_i_1_n_0 ));
  FDCE \history_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[0]_i_1_n_0 ),
        .Q(predict_history_OBUF[0]));
  FDCE \history_reg[10] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[10]_i_1_n_0 ),
        .Q(predict_history_OBUF[10]));
  FDCE \history_reg[11] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[11]_i_1_n_0 ),
        .Q(predict_history_OBUF[11]));
  FDCE \history_reg[12] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[12]_i_1_n_0 ),
        .Q(predict_history_OBUF[12]));
  FDCE \history_reg[13] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[13]_i_1_n_0 ),
        .Q(predict_history_OBUF[13]));
  FDCE \history_reg[14] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[14]_i_1_n_0 ),
        .Q(predict_history_OBUF[14]));
  FDCE \history_reg[15] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[15]_i_1_n_0 ),
        .Q(predict_history_OBUF[15]));
  FDCE \history_reg[16] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[16]_i_1_n_0 ),
        .Q(predict_history_OBUF[16]));
  FDCE \history_reg[17] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[17]_i_1_n_0 ),
        .Q(predict_history_OBUF[17]));
  FDCE \history_reg[18] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[18]_i_1_n_0 ),
        .Q(predict_history_OBUF[18]));
  FDCE \history_reg[19] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[19]_i_1_n_0 ),
        .Q(predict_history_OBUF[19]));
  FDCE \history_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[1]_i_1_n_0 ),
        .Q(predict_history_OBUF[1]));
  FDCE \history_reg[20] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[20]_i_1_n_0 ),
        .Q(predict_history_OBUF[20]));
  FDCE \history_reg[21] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[21]_i_1_n_0 ),
        .Q(predict_history_OBUF[21]));
  FDCE \history_reg[22] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[22]_i_1_n_0 ),
        .Q(predict_history_OBUF[22]));
  FDCE \history_reg[23] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[23]_i_1_n_0 ),
        .Q(predict_history_OBUF[23]));
  FDCE \history_reg[24] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[24]_i_1_n_0 ),
        .Q(predict_history_OBUF[24]));
  FDCE \history_reg[25] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[25]_i_1_n_0 ),
        .Q(predict_history_OBUF[25]));
  FDCE \history_reg[26] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[26]_i_1_n_0 ),
        .Q(predict_history_OBUF[26]));
  FDCE \history_reg[27] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[27]_i_1_n_0 ),
        .Q(predict_history_OBUF[27]));
  FDCE \history_reg[28] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[28]_i_1_n_0 ),
        .Q(predict_history_OBUF[28]));
  FDCE \history_reg[29] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[29]_i_1_n_0 ),
        .Q(predict_history_OBUF[29]));
  FDCE \history_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[2]_i_1_n_0 ),
        .Q(predict_history_OBUF[2]));
  FDCE \history_reg[30] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[30]_i_1_n_0 ),
        .Q(predict_history_OBUF[30]));
  FDCE \history_reg[31] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[31]_i_2_n_0 ),
        .Q(predict_history_OBUF[31]));
  FDCE \history_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[3]_i_1_n_0 ),
        .Q(predict_history_OBUF[3]));
  FDCE \history_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[4]_i_1_n_0 ),
        .Q(predict_history_OBUF[4]));
  FDCE \history_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[5]_i_1_n_0 ),
        .Q(predict_history_OBUF[5]));
  FDCE \history_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[6]_i_1_n_0 ),
        .Q(predict_history_OBUF[6]));
  FDCE \history_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[7]_i_1_n_0 ),
        .Q(predict_history_OBUF[7]));
  FDCE \history_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[8]_i_1_n_0 ),
        .Q(predict_history_OBUF[8]));
  FDCE \history_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[31]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[9]_i_1_n_0 ),
        .Q(predict_history_OBUF[9]));
  OBUF \predict_history_OBUF[0]_inst 
       (.I(predict_history_OBUF[0]),
        .O(predict_history[0]));
  OBUF \predict_history_OBUF[10]_inst 
       (.I(predict_history_OBUF[10]),
        .O(predict_history[10]));
  OBUF \predict_history_OBUF[11]_inst 
       (.I(predict_history_OBUF[11]),
        .O(predict_history[11]));
  OBUF \predict_history_OBUF[12]_inst 
       (.I(predict_history_OBUF[12]),
        .O(predict_history[12]));
  OBUF \predict_history_OBUF[13]_inst 
       (.I(predict_history_OBUF[13]),
        .O(predict_history[13]));
  OBUF \predict_history_OBUF[14]_inst 
       (.I(predict_history_OBUF[14]),
        .O(predict_history[14]));
  OBUF \predict_history_OBUF[15]_inst 
       (.I(predict_history_OBUF[15]),
        .O(predict_history[15]));
  OBUF \predict_history_OBUF[16]_inst 
       (.I(predict_history_OBUF[16]),
        .O(predict_history[16]));
  OBUF \predict_history_OBUF[17]_inst 
       (.I(predict_history_OBUF[17]),
        .O(predict_history[17]));
  OBUF \predict_history_OBUF[18]_inst 
       (.I(predict_history_OBUF[18]),
        .O(predict_history[18]));
  OBUF \predict_history_OBUF[19]_inst 
       (.I(predict_history_OBUF[19]),
        .O(predict_history[19]));
  OBUF \predict_history_OBUF[1]_inst 
       (.I(predict_history_OBUF[1]),
        .O(predict_history[1]));
  OBUF \predict_history_OBUF[20]_inst 
       (.I(predict_history_OBUF[20]),
        .O(predict_history[20]));
  OBUF \predict_history_OBUF[21]_inst 
       (.I(predict_history_OBUF[21]),
        .O(predict_history[21]));
  OBUF \predict_history_OBUF[22]_inst 
       (.I(predict_history_OBUF[22]),
        .O(predict_history[22]));
  OBUF \predict_history_OBUF[23]_inst 
       (.I(predict_history_OBUF[23]),
        .O(predict_history[23]));
  OBUF \predict_history_OBUF[24]_inst 
       (.I(predict_history_OBUF[24]),
        .O(predict_history[24]));
  OBUF \predict_history_OBUF[25]_inst 
       (.I(predict_history_OBUF[25]),
        .O(predict_history[25]));
  OBUF \predict_history_OBUF[26]_inst 
       (.I(predict_history_OBUF[26]),
        .O(predict_history[26]));
  OBUF \predict_history_OBUF[27]_inst 
       (.I(predict_history_OBUF[27]),
        .O(predict_history[27]));
  OBUF \predict_history_OBUF[28]_inst 
       (.I(predict_history_OBUF[28]),
        .O(predict_history[28]));
  OBUF \predict_history_OBUF[29]_inst 
       (.I(predict_history_OBUF[29]),
        .O(predict_history[29]));
  OBUF \predict_history_OBUF[2]_inst 
       (.I(predict_history_OBUF[2]),
        .O(predict_history[2]));
  OBUF \predict_history_OBUF[30]_inst 
       (.I(predict_history_OBUF[30]),
        .O(predict_history[30]));
  OBUF \predict_history_OBUF[31]_inst 
       (.I(predict_history_OBUF[31]),
        .O(predict_history[31]));
  OBUF \predict_history_OBUF[3]_inst 
       (.I(predict_history_OBUF[3]),
        .O(predict_history[3]));
  OBUF \predict_history_OBUF[4]_inst 
       (.I(predict_history_OBUF[4]),
        .O(predict_history[4]));
  OBUF \predict_history_OBUF[5]_inst 
       (.I(predict_history_OBUF[5]),
        .O(predict_history[5]));
  OBUF \predict_history_OBUF[6]_inst 
       (.I(predict_history_OBUF[6]),
        .O(predict_history[6]));
  OBUF \predict_history_OBUF[7]_inst 
       (.I(predict_history_OBUF[7]),
        .O(predict_history[7]));
  OBUF \predict_history_OBUF[8]_inst 
       (.I(predict_history_OBUF[8]),
        .O(predict_history[8]));
  OBUF \predict_history_OBUF[9]_inst 
       (.I(predict_history_OBUF[9]),
        .O(predict_history[9]));
  IBUF predict_taken_IBUF_inst
       (.I(predict_taken),
        .O(predict_taken_IBUF));
  IBUF predict_valid_IBUF_inst
       (.I(predict_valid),
        .O(predict_valid_IBUF));
  IBUF \train_history_IBUF[0]_inst 
       (.I(train_history[0]),
        .O(train_history_IBUF[0]));
  IBUF \train_history_IBUF[10]_inst 
       (.I(train_history[10]),
        .O(train_history_IBUF[10]));
  IBUF \train_history_IBUF[11]_inst 
       (.I(train_history[11]),
        .O(train_history_IBUF[11]));
  IBUF \train_history_IBUF[12]_inst 
       (.I(train_history[12]),
        .O(train_history_IBUF[12]));
  IBUF \train_history_IBUF[13]_inst 
       (.I(train_history[13]),
        .O(train_history_IBUF[13]));
  IBUF \train_history_IBUF[14]_inst 
       (.I(train_history[14]),
        .O(train_history_IBUF[14]));
  IBUF \train_history_IBUF[15]_inst 
       (.I(train_history[15]),
        .O(train_history_IBUF[15]));
  IBUF \train_history_IBUF[16]_inst 
       (.I(train_history[16]),
        .O(train_history_IBUF[16]));
  IBUF \train_history_IBUF[17]_inst 
       (.I(train_history[17]),
        .O(train_history_IBUF[17]));
  IBUF \train_history_IBUF[18]_inst 
       (.I(train_history[18]),
        .O(train_history_IBUF[18]));
  IBUF \train_history_IBUF[19]_inst 
       (.I(train_history[19]),
        .O(train_history_IBUF[19]));
  IBUF \train_history_IBUF[1]_inst 
       (.I(train_history[1]),
        .O(train_history_IBUF[1]));
  IBUF \train_history_IBUF[20]_inst 
       (.I(train_history[20]),
        .O(train_history_IBUF[20]));
  IBUF \train_history_IBUF[21]_inst 
       (.I(train_history[21]),
        .O(train_history_IBUF[21]));
  IBUF \train_history_IBUF[22]_inst 
       (.I(train_history[22]),
        .O(train_history_IBUF[22]));
  IBUF \train_history_IBUF[23]_inst 
       (.I(train_history[23]),
        .O(train_history_IBUF[23]));
  IBUF \train_history_IBUF[24]_inst 
       (.I(train_history[24]),
        .O(train_history_IBUF[24]));
  IBUF \train_history_IBUF[25]_inst 
       (.I(train_history[25]),
        .O(train_history_IBUF[25]));
  IBUF \train_history_IBUF[26]_inst 
       (.I(train_history[26]),
        .O(train_history_IBUF[26]));
  IBUF \train_history_IBUF[27]_inst 
       (.I(train_history[27]),
        .O(train_history_IBUF[27]));
  IBUF \train_history_IBUF[28]_inst 
       (.I(train_history[28]),
        .O(train_history_IBUF[28]));
  IBUF \train_history_IBUF[29]_inst 
       (.I(train_history[29]),
        .O(train_history_IBUF[29]));
  IBUF \train_history_IBUF[2]_inst 
       (.I(train_history[2]),
        .O(train_history_IBUF[2]));
  IBUF \train_history_IBUF[30]_inst 
       (.I(train_history[30]),
        .O(train_history_IBUF[30]));
  IBUF \train_history_IBUF[3]_inst 
       (.I(train_history[3]),
        .O(train_history_IBUF[3]));
  IBUF \train_history_IBUF[4]_inst 
       (.I(train_history[4]),
        .O(train_history_IBUF[4]));
  IBUF \train_history_IBUF[5]_inst 
       (.I(train_history[5]),
        .O(train_history_IBUF[5]));
  IBUF \train_history_IBUF[6]_inst 
       (.I(train_history[6]),
        .O(train_history_IBUF[6]));
  IBUF \train_history_IBUF[7]_inst 
       (.I(train_history[7]),
        .O(train_history_IBUF[7]));
  IBUF \train_history_IBUF[8]_inst 
       (.I(train_history[8]),
        .O(train_history_IBUF[8]));
  IBUF \train_history_IBUF[9]_inst 
       (.I(train_history[9]),
        .O(train_history_IBUF[9]));
  IBUF train_mispredicted_IBUF_inst
       (.I(train_mispredicted),
        .O(train_mispredicted_IBUF));
  IBUF train_taken_IBUF_inst
       (.I(train_taken),
        .O(train_taken_IBUF));
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
