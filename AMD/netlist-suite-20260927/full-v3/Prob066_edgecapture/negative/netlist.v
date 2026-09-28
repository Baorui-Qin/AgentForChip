// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 04:23:17 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob066_edgecapture/eda/run-CSLh7M/build/.rtl-synth-HHwbcM/netlist.v
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
    in,
    out);
  input clk;
  input reset;
  input [31:0]in;
  output [31:0]out;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [31:0]in;
  wire [31:0]in_IBUF;
  wire [31:0]out;
  wire \out[0]_i_1_n_0 ;
  wire \out[10]_i_1_n_0 ;
  wire \out[11]_i_1_n_0 ;
  wire \out[12]_i_1_n_0 ;
  wire \out[13]_i_1_n_0 ;
  wire \out[14]_i_1_n_0 ;
  wire \out[15]_i_1_n_0 ;
  wire \out[16]_i_1_n_0 ;
  wire \out[17]_i_1_n_0 ;
  wire \out[18]_i_1_n_0 ;
  wire \out[19]_i_1_n_0 ;
  wire \out[1]_i_1_n_0 ;
  wire \out[20]_i_1_n_0 ;
  wire \out[21]_i_1_n_0 ;
  wire \out[22]_i_1_n_0 ;
  wire \out[23]_i_1_n_0 ;
  wire \out[24]_i_1_n_0 ;
  wire \out[25]_i_1_n_0 ;
  wire \out[26]_i_1_n_0 ;
  wire \out[27]_i_1_n_0 ;
  wire \out[28]_i_1_n_0 ;
  wire \out[29]_i_1_n_0 ;
  wire \out[2]_i_1_n_0 ;
  wire \out[30]_i_1_n_0 ;
  wire \out[31]_i_1_n_0 ;
  wire \out[3]_i_1_n_0 ;
  wire \out[4]_i_1_n_0 ;
  wire \out[5]_i_1_n_0 ;
  wire \out[6]_i_1_n_0 ;
  wire \out[7]_i_1_n_0 ;
  wire \out[8]_i_1_n_0 ;
  wire \out[9]_i_1_n_0 ;
  wire [31:0]out_OBUF;
  wire [31:0]prev;
  wire reset;
  wire reset_IBUF;

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
  IBUF \in_IBUF[0]_inst 
       (.I(in[0]),
        .O(in_IBUF[0]));
  IBUF \in_IBUF[10]_inst 
       (.I(in[10]),
        .O(in_IBUF[10]));
  IBUF \in_IBUF[11]_inst 
       (.I(in[11]),
        .O(in_IBUF[11]));
  IBUF \in_IBUF[12]_inst 
       (.I(in[12]),
        .O(in_IBUF[12]));
  IBUF \in_IBUF[13]_inst 
       (.I(in[13]),
        .O(in_IBUF[13]));
  IBUF \in_IBUF[14]_inst 
       (.I(in[14]),
        .O(in_IBUF[14]));
  IBUF \in_IBUF[15]_inst 
       (.I(in[15]),
        .O(in_IBUF[15]));
  IBUF \in_IBUF[16]_inst 
       (.I(in[16]),
        .O(in_IBUF[16]));
  IBUF \in_IBUF[17]_inst 
       (.I(in[17]),
        .O(in_IBUF[17]));
  IBUF \in_IBUF[18]_inst 
       (.I(in[18]),
        .O(in_IBUF[18]));
  IBUF \in_IBUF[19]_inst 
       (.I(in[19]),
        .O(in_IBUF[19]));
  IBUF \in_IBUF[1]_inst 
       (.I(in[1]),
        .O(in_IBUF[1]));
  IBUF \in_IBUF[20]_inst 
       (.I(in[20]),
        .O(in_IBUF[20]));
  IBUF \in_IBUF[21]_inst 
       (.I(in[21]),
        .O(in_IBUF[21]));
  IBUF \in_IBUF[22]_inst 
       (.I(in[22]),
        .O(in_IBUF[22]));
  IBUF \in_IBUF[23]_inst 
       (.I(in[23]),
        .O(in_IBUF[23]));
  IBUF \in_IBUF[24]_inst 
       (.I(in[24]),
        .O(in_IBUF[24]));
  IBUF \in_IBUF[25]_inst 
       (.I(in[25]),
        .O(in_IBUF[25]));
  IBUF \in_IBUF[26]_inst 
       (.I(in[26]),
        .O(in_IBUF[26]));
  IBUF \in_IBUF[27]_inst 
       (.I(in[27]),
        .O(in_IBUF[27]));
  IBUF \in_IBUF[28]_inst 
       (.I(in[28]),
        .O(in_IBUF[28]));
  IBUF \in_IBUF[29]_inst 
       (.I(in[29]),
        .O(in_IBUF[29]));
  IBUF \in_IBUF[2]_inst 
       (.I(in[2]),
        .O(in_IBUF[2]));
  IBUF \in_IBUF[30]_inst 
       (.I(in[30]),
        .O(in_IBUF[30]));
  IBUF \in_IBUF[31]_inst 
       (.I(in[31]),
        .O(in_IBUF[31]));
  IBUF \in_IBUF[3]_inst 
       (.I(in[3]),
        .O(in_IBUF[3]));
  IBUF \in_IBUF[4]_inst 
       (.I(in[4]),
        .O(in_IBUF[4]));
  IBUF \in_IBUF[5]_inst 
       (.I(in[5]),
        .O(in_IBUF[5]));
  IBUF \in_IBUF[6]_inst 
       (.I(in[6]),
        .O(in_IBUF[6]));
  IBUF \in_IBUF[7]_inst 
       (.I(in[7]),
        .O(in_IBUF[7]));
  IBUF \in_IBUF[8]_inst 
       (.I(in[8]),
        .O(in_IBUF[8]));
  IBUF \in_IBUF[9]_inst 
       (.I(in[9]),
        .O(in_IBUF[9]));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[0]_i_1 
       (.I0(out_OBUF[0]),
        .I1(in_IBUF[0]),
        .I2(prev[0]),
        .O(\out[0]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[10]_i_1 
       (.I0(out_OBUF[10]),
        .I1(in_IBUF[10]),
        .I2(prev[10]),
        .O(\out[10]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[11]_i_1 
       (.I0(out_OBUF[11]),
        .I1(in_IBUF[11]),
        .I2(prev[11]),
        .O(\out[11]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[12]_i_1 
       (.I0(out_OBUF[12]),
        .I1(in_IBUF[12]),
        .I2(prev[12]),
        .O(\out[12]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[13]_i_1 
       (.I0(out_OBUF[13]),
        .I1(in_IBUF[13]),
        .I2(prev[13]),
        .O(\out[13]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[14]_i_1 
       (.I0(out_OBUF[14]),
        .I1(in_IBUF[14]),
        .I2(prev[14]),
        .O(\out[14]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[15]_i_1 
       (.I0(out_OBUF[15]),
        .I1(in_IBUF[15]),
        .I2(prev[15]),
        .O(\out[15]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[16]_i_1 
       (.I0(out_OBUF[16]),
        .I1(in_IBUF[16]),
        .I2(prev[16]),
        .O(\out[16]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[17]_i_1 
       (.I0(out_OBUF[17]),
        .I1(in_IBUF[17]),
        .I2(prev[17]),
        .O(\out[17]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[18]_i_1 
       (.I0(out_OBUF[18]),
        .I1(in_IBUF[18]),
        .I2(prev[18]),
        .O(\out[18]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[19]_i_1 
       (.I0(out_OBUF[19]),
        .I1(in_IBUF[19]),
        .I2(prev[19]),
        .O(\out[19]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[1]_i_1 
       (.I0(out_OBUF[1]),
        .I1(in_IBUF[1]),
        .I2(prev[1]),
        .O(\out[1]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[20]_i_1 
       (.I0(out_OBUF[20]),
        .I1(in_IBUF[20]),
        .I2(prev[20]),
        .O(\out[20]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[21]_i_1 
       (.I0(out_OBUF[21]),
        .I1(in_IBUF[21]),
        .I2(prev[21]),
        .O(\out[21]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[22]_i_1 
       (.I0(out_OBUF[22]),
        .I1(in_IBUF[22]),
        .I2(prev[22]),
        .O(\out[22]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[23]_i_1 
       (.I0(out_OBUF[23]),
        .I1(in_IBUF[23]),
        .I2(prev[23]),
        .O(\out[23]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[24]_i_1 
       (.I0(out_OBUF[24]),
        .I1(in_IBUF[24]),
        .I2(prev[24]),
        .O(\out[24]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[25]_i_1 
       (.I0(out_OBUF[25]),
        .I1(in_IBUF[25]),
        .I2(prev[25]),
        .O(\out[25]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[26]_i_1 
       (.I0(out_OBUF[26]),
        .I1(in_IBUF[26]),
        .I2(prev[26]),
        .O(\out[26]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[27]_i_1 
       (.I0(out_OBUF[27]),
        .I1(in_IBUF[27]),
        .I2(prev[27]),
        .O(\out[27]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[28]_i_1 
       (.I0(out_OBUF[28]),
        .I1(in_IBUF[28]),
        .I2(prev[28]),
        .O(\out[28]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[29]_i_1 
       (.I0(out_OBUF[29]),
        .I1(in_IBUF[29]),
        .I2(prev[29]),
        .O(\out[29]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[2]_i_1 
       (.I0(out_OBUF[2]),
        .I1(in_IBUF[2]),
        .I2(prev[2]),
        .O(\out[2]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[30]_i_1 
       (.I0(out_OBUF[30]),
        .I1(in_IBUF[30]),
        .I2(prev[30]),
        .O(\out[30]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[31]_i_1 
       (.I0(out_OBUF[31]),
        .I1(in_IBUF[31]),
        .I2(prev[31]),
        .O(\out[31]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[3]_i_1 
       (.I0(out_OBUF[3]),
        .I1(in_IBUF[3]),
        .I2(prev[3]),
        .O(\out[3]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[4]_i_1 
       (.I0(out_OBUF[4]),
        .I1(in_IBUF[4]),
        .I2(prev[4]),
        .O(\out[4]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[5]_i_1 
       (.I0(out_OBUF[5]),
        .I1(in_IBUF[5]),
        .I2(prev[5]),
        .O(\out[5]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[6]_i_1 
       (.I0(out_OBUF[6]),
        .I1(in_IBUF[6]),
        .I2(prev[6]),
        .O(\out[6]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[7]_i_1 
       (.I0(out_OBUF[7]),
        .I1(in_IBUF[7]),
        .I2(prev[7]),
        .O(\out[7]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[8]_i_1 
       (.I0(out_OBUF[8]),
        .I1(in_IBUF[8]),
        .I2(prev[8]),
        .O(\out[8]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hBA)) 
    \out[9]_i_1 
       (.I0(out_OBUF[9]),
        .I1(in_IBUF[9]),
        .I2(prev[9]),
        .O(\out[9]_i_1_n_0 ));
  OBUF \out_OBUF[0]_inst 
       (.I(out_OBUF[0]),
        .O(out[0]));
  OBUF \out_OBUF[10]_inst 
       (.I(out_OBUF[10]),
        .O(out[10]));
  OBUF \out_OBUF[11]_inst 
       (.I(out_OBUF[11]),
        .O(out[11]));
  OBUF \out_OBUF[12]_inst 
       (.I(out_OBUF[12]),
        .O(out[12]));
  OBUF \out_OBUF[13]_inst 
       (.I(out_OBUF[13]),
        .O(out[13]));
  OBUF \out_OBUF[14]_inst 
       (.I(out_OBUF[14]),
        .O(out[14]));
  OBUF \out_OBUF[15]_inst 
       (.I(out_OBUF[15]),
        .O(out[15]));
  OBUF \out_OBUF[16]_inst 
       (.I(out_OBUF[16]),
        .O(out[16]));
  OBUF \out_OBUF[17]_inst 
       (.I(out_OBUF[17]),
        .O(out[17]));
  OBUF \out_OBUF[18]_inst 
       (.I(out_OBUF[18]),
        .O(out[18]));
  OBUF \out_OBUF[19]_inst 
       (.I(out_OBUF[19]),
        .O(out[19]));
  OBUF \out_OBUF[1]_inst 
       (.I(out_OBUF[1]),
        .O(out[1]));
  OBUF \out_OBUF[20]_inst 
       (.I(out_OBUF[20]),
        .O(out[20]));
  OBUF \out_OBUF[21]_inst 
       (.I(out_OBUF[21]),
        .O(out[21]));
  OBUF \out_OBUF[22]_inst 
       (.I(out_OBUF[22]),
        .O(out[22]));
  OBUF \out_OBUF[23]_inst 
       (.I(out_OBUF[23]),
        .O(out[23]));
  OBUF \out_OBUF[24]_inst 
       (.I(out_OBUF[24]),
        .O(out[24]));
  OBUF \out_OBUF[25]_inst 
       (.I(out_OBUF[25]),
        .O(out[25]));
  OBUF \out_OBUF[26]_inst 
       (.I(out_OBUF[26]),
        .O(out[26]));
  OBUF \out_OBUF[27]_inst 
       (.I(out_OBUF[27]),
        .O(out[27]));
  OBUF \out_OBUF[28]_inst 
       (.I(out_OBUF[28]),
        .O(out[28]));
  OBUF \out_OBUF[29]_inst 
       (.I(out_OBUF[29]),
        .O(out[29]));
  OBUF \out_OBUF[2]_inst 
       (.I(out_OBUF[2]),
        .O(out[2]));
  OBUF \out_OBUF[30]_inst 
       (.I(out_OBUF[30]),
        .O(out[30]));
  OBUF \out_OBUF[31]_inst 
       (.I(out_OBUF[31]),
        .O(out[31]));
  OBUF \out_OBUF[3]_inst 
       (.I(out_OBUF[3]),
        .O(out[3]));
  OBUF \out_OBUF[4]_inst 
       (.I(out_OBUF[4]),
        .O(out[4]));
  OBUF \out_OBUF[5]_inst 
       (.I(out_OBUF[5]),
        .O(out[5]));
  OBUF \out_OBUF[6]_inst 
       (.I(out_OBUF[6]),
        .O(out[6]));
  OBUF \out_OBUF[7]_inst 
       (.I(out_OBUF[7]),
        .O(out[7]));
  OBUF \out_OBUF[8]_inst 
       (.I(out_OBUF[8]),
        .O(out[8]));
  OBUF \out_OBUF[9]_inst 
       (.I(out_OBUF[9]),
        .O(out[9]));
  FDRE \out_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[0]_i_1_n_0 ),
        .Q(out_OBUF[0]),
        .R(reset_IBUF));
  FDRE \out_reg[10] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[10]_i_1_n_0 ),
        .Q(out_OBUF[10]),
        .R(reset_IBUF));
  FDRE \out_reg[11] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[11]_i_1_n_0 ),
        .Q(out_OBUF[11]),
        .R(reset_IBUF));
  FDRE \out_reg[12] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[12]_i_1_n_0 ),
        .Q(out_OBUF[12]),
        .R(reset_IBUF));
  FDRE \out_reg[13] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[13]_i_1_n_0 ),
        .Q(out_OBUF[13]),
        .R(reset_IBUF));
  FDRE \out_reg[14] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[14]_i_1_n_0 ),
        .Q(out_OBUF[14]),
        .R(reset_IBUF));
  FDRE \out_reg[15] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[15]_i_1_n_0 ),
        .Q(out_OBUF[15]),
        .R(reset_IBUF));
  FDRE \out_reg[16] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[16]_i_1_n_0 ),
        .Q(out_OBUF[16]),
        .R(reset_IBUF));
  FDRE \out_reg[17] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[17]_i_1_n_0 ),
        .Q(out_OBUF[17]),
        .R(reset_IBUF));
  FDRE \out_reg[18] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[18]_i_1_n_0 ),
        .Q(out_OBUF[18]),
        .R(reset_IBUF));
  FDRE \out_reg[19] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[19]_i_1_n_0 ),
        .Q(out_OBUF[19]),
        .R(reset_IBUF));
  FDRE \out_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[1]_i_1_n_0 ),
        .Q(out_OBUF[1]),
        .R(reset_IBUF));
  FDRE \out_reg[20] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[20]_i_1_n_0 ),
        .Q(out_OBUF[20]),
        .R(reset_IBUF));
  FDRE \out_reg[21] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[21]_i_1_n_0 ),
        .Q(out_OBUF[21]),
        .R(reset_IBUF));
  FDRE \out_reg[22] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[22]_i_1_n_0 ),
        .Q(out_OBUF[22]),
        .R(reset_IBUF));
  FDRE \out_reg[23] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[23]_i_1_n_0 ),
        .Q(out_OBUF[23]),
        .R(reset_IBUF));
  FDRE \out_reg[24] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[24]_i_1_n_0 ),
        .Q(out_OBUF[24]),
        .R(reset_IBUF));
  FDRE \out_reg[25] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[25]_i_1_n_0 ),
        .Q(out_OBUF[25]),
        .R(reset_IBUF));
  FDRE \out_reg[26] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[26]_i_1_n_0 ),
        .Q(out_OBUF[26]),
        .R(reset_IBUF));
  FDRE \out_reg[27] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[27]_i_1_n_0 ),
        .Q(out_OBUF[27]),
        .R(reset_IBUF));
  FDRE \out_reg[28] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[28]_i_1_n_0 ),
        .Q(out_OBUF[28]),
        .R(reset_IBUF));
  FDRE \out_reg[29] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[29]_i_1_n_0 ),
        .Q(out_OBUF[29]),
        .R(reset_IBUF));
  FDRE \out_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[2]_i_1_n_0 ),
        .Q(out_OBUF[2]),
        .R(reset_IBUF));
  FDRE \out_reg[30] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[30]_i_1_n_0 ),
        .Q(out_OBUF[30]),
        .R(reset_IBUF));
  FDRE \out_reg[31] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[31]_i_1_n_0 ),
        .Q(out_OBUF[31]),
        .R(reset_IBUF));
  FDRE \out_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[3]_i_1_n_0 ),
        .Q(out_OBUF[3]),
        .R(reset_IBUF));
  FDRE \out_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[4]_i_1_n_0 ),
        .Q(out_OBUF[4]),
        .R(reset_IBUF));
  FDRE \out_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[5]_i_1_n_0 ),
        .Q(out_OBUF[5]),
        .R(reset_IBUF));
  FDRE \out_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[6]_i_1_n_0 ),
        .Q(out_OBUF[6]),
        .R(reset_IBUF));
  FDRE \out_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[7]_i_1_n_0 ),
        .Q(out_OBUF[7]),
        .R(reset_IBUF));
  FDRE \out_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[8]_i_1_n_0 ),
        .Q(out_OBUF[8]),
        .R(reset_IBUF));
  FDRE \out_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\out[9]_i_1_n_0 ),
        .Q(out_OBUF[9]),
        .R(reset_IBUF));
  FDRE \prev_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[0]),
        .Q(prev[0]),
        .R(1'b0));
  FDRE \prev_reg[10] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[10]),
        .Q(prev[10]),
        .R(1'b0));
  FDRE \prev_reg[11] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[11]),
        .Q(prev[11]),
        .R(1'b0));
  FDRE \prev_reg[12] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[12]),
        .Q(prev[12]),
        .R(1'b0));
  FDRE \prev_reg[13] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[13]),
        .Q(prev[13]),
        .R(1'b0));
  FDRE \prev_reg[14] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[14]),
        .Q(prev[14]),
        .R(1'b0));
  FDRE \prev_reg[15] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[15]),
        .Q(prev[15]),
        .R(1'b0));
  FDRE \prev_reg[16] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[16]),
        .Q(prev[16]),
        .R(1'b0));
  FDRE \prev_reg[17] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[17]),
        .Q(prev[17]),
        .R(1'b0));
  FDRE \prev_reg[18] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[18]),
        .Q(prev[18]),
        .R(1'b0));
  FDRE \prev_reg[19] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[19]),
        .Q(prev[19]),
        .R(1'b0));
  FDRE \prev_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[1]),
        .Q(prev[1]),
        .R(1'b0));
  FDRE \prev_reg[20] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[20]),
        .Q(prev[20]),
        .R(1'b0));
  FDRE \prev_reg[21] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[21]),
        .Q(prev[21]),
        .R(1'b0));
  FDRE \prev_reg[22] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[22]),
        .Q(prev[22]),
        .R(1'b0));
  FDRE \prev_reg[23] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[23]),
        .Q(prev[23]),
        .R(1'b0));
  FDRE \prev_reg[24] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[24]),
        .Q(prev[24]),
        .R(1'b0));
  FDRE \prev_reg[25] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[25]),
        .Q(prev[25]),
        .R(1'b0));
  FDRE \prev_reg[26] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[26]),
        .Q(prev[26]),
        .R(1'b0));
  FDRE \prev_reg[27] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[27]),
        .Q(prev[27]),
        .R(1'b0));
  FDRE \prev_reg[28] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[28]),
        .Q(prev[28]),
        .R(1'b0));
  FDRE \prev_reg[29] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[29]),
        .Q(prev[29]),
        .R(1'b0));
  FDRE \prev_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[2]),
        .Q(prev[2]),
        .R(1'b0));
  FDRE \prev_reg[30] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[30]),
        .Q(prev[30]),
        .R(1'b0));
  FDRE \prev_reg[31] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[31]),
        .Q(prev[31]),
        .R(1'b0));
  FDRE \prev_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[3]),
        .Q(prev[3]),
        .R(1'b0));
  FDRE \prev_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[4]),
        .Q(prev[4]),
        .R(1'b0));
  FDRE \prev_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[5]),
        .Q(prev[5]),
        .R(1'b0));
  FDRE \prev_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[6]),
        .Q(prev[6]),
        .R(1'b0));
  FDRE \prev_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[7]),
        .Q(prev[7]),
        .R(1'b0));
  FDRE \prev_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[8]),
        .Q(prev[8]),
        .R(1'b0));
  FDRE \prev_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[9]),
        .Q(prev[9]),
        .R(1'b0));
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
