// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 05:04:25 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob115_shift18/eda/run-FFSzpk/build/.rtl-synth-aOzlNs/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (clk,
    load,
    ena,
    amount,
    data,
    q);
  input clk;
  input load;
  input ena;
  input [1:0]amount;
  input [63:0]data;
  output [63:0]q;

  wire [1:0]amount;
  wire [1:0]amount_IBUF;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [63:0]data;
  wire [63:0]data_IBUF;
  wire ena;
  wire ena_IBUF;
  wire load;
  wire load_IBUF;
  wire [63:0]p_1_in;
  wire [63:0]q;
  wire \q[10]_i_2_n_0 ;
  wire \q[11]_i_2_n_0 ;
  wire \q[12]_i_2_n_0 ;
  wire \q[13]_i_2_n_0 ;
  wire \q[14]_i_2_n_0 ;
  wire \q[15]_i_2_n_0 ;
  wire \q[16]_i_2_n_0 ;
  wire \q[17]_i_2_n_0 ;
  wire \q[18]_i_2_n_0 ;
  wire \q[19]_i_2_n_0 ;
  wire \q[1]_i_2_n_0 ;
  wire \q[20]_i_2_n_0 ;
  wire \q[21]_i_2_n_0 ;
  wire \q[22]_i_2_n_0 ;
  wire \q[23]_i_2_n_0 ;
  wire \q[24]_i_2_n_0 ;
  wire \q[25]_i_2_n_0 ;
  wire \q[26]_i_2_n_0 ;
  wire \q[27]_i_2_n_0 ;
  wire \q[28]_i_2_n_0 ;
  wire \q[29]_i_2_n_0 ;
  wire \q[2]_i_2_n_0 ;
  wire \q[30]_i_2_n_0 ;
  wire \q[31]_i_2_n_0 ;
  wire \q[32]_i_2_n_0 ;
  wire \q[33]_i_2_n_0 ;
  wire \q[34]_i_2_n_0 ;
  wire \q[35]_i_2_n_0 ;
  wire \q[36]_i_2_n_0 ;
  wire \q[37]_i_2_n_0 ;
  wire \q[38]_i_2_n_0 ;
  wire \q[39]_i_2_n_0 ;
  wire \q[3]_i_2_n_0 ;
  wire \q[40]_i_2_n_0 ;
  wire \q[41]_i_2_n_0 ;
  wire \q[42]_i_2_n_0 ;
  wire \q[43]_i_2_n_0 ;
  wire \q[44]_i_2_n_0 ;
  wire \q[45]_i_2_n_0 ;
  wire \q[46]_i_2_n_0 ;
  wire \q[47]_i_2_n_0 ;
  wire \q[48]_i_2_n_0 ;
  wire \q[49]_i_2_n_0 ;
  wire \q[4]_i_2_n_0 ;
  wire \q[50]_i_2_n_0 ;
  wire \q[51]_i_2_n_0 ;
  wire \q[52]_i_2_n_0 ;
  wire \q[53]_i_2_n_0 ;
  wire \q[54]_i_2_n_0 ;
  wire \q[55]_i_2_n_0 ;
  wire \q[56]_i_2_n_0 ;
  wire \q[57]_i_2_n_0 ;
  wire \q[58]_i_2_n_0 ;
  wire \q[59]_i_2_n_0 ;
  wire \q[5]_i_2_n_0 ;
  wire \q[60]_i_2_n_0 ;
  wire \q[61]_i_2_n_0 ;
  wire \q[62]_i_2_n_0 ;
  wire \q[63]_i_1_n_0 ;
  wire \q[63]_i_3_n_0 ;
  wire \q[6]_i_2_n_0 ;
  wire \q[7]_i_2_n_0 ;
  wire \q[8]_i_2_n_0 ;
  wire \q[9]_i_2_n_0 ;
  wire [63:0]q_OBUF;

  IBUF \amount_IBUF[0]_inst 
       (.I(amount[0]),
        .O(amount_IBUF[0]));
  IBUF \amount_IBUF[1]_inst 
       (.I(amount[1]),
        .O(amount_IBUF[1]));
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
  IBUF \data_IBUF[0]_inst 
       (.I(data[0]),
        .O(data_IBUF[0]));
  IBUF \data_IBUF[10]_inst 
       (.I(data[10]),
        .O(data_IBUF[10]));
  IBUF \data_IBUF[11]_inst 
       (.I(data[11]),
        .O(data_IBUF[11]));
  IBUF \data_IBUF[12]_inst 
       (.I(data[12]),
        .O(data_IBUF[12]));
  IBUF \data_IBUF[13]_inst 
       (.I(data[13]),
        .O(data_IBUF[13]));
  IBUF \data_IBUF[14]_inst 
       (.I(data[14]),
        .O(data_IBUF[14]));
  IBUF \data_IBUF[15]_inst 
       (.I(data[15]),
        .O(data_IBUF[15]));
  IBUF \data_IBUF[16]_inst 
       (.I(data[16]),
        .O(data_IBUF[16]));
  IBUF \data_IBUF[17]_inst 
       (.I(data[17]),
        .O(data_IBUF[17]));
  IBUF \data_IBUF[18]_inst 
       (.I(data[18]),
        .O(data_IBUF[18]));
  IBUF \data_IBUF[19]_inst 
       (.I(data[19]),
        .O(data_IBUF[19]));
  IBUF \data_IBUF[1]_inst 
       (.I(data[1]),
        .O(data_IBUF[1]));
  IBUF \data_IBUF[20]_inst 
       (.I(data[20]),
        .O(data_IBUF[20]));
  IBUF \data_IBUF[21]_inst 
       (.I(data[21]),
        .O(data_IBUF[21]));
  IBUF \data_IBUF[22]_inst 
       (.I(data[22]),
        .O(data_IBUF[22]));
  IBUF \data_IBUF[23]_inst 
       (.I(data[23]),
        .O(data_IBUF[23]));
  IBUF \data_IBUF[24]_inst 
       (.I(data[24]),
        .O(data_IBUF[24]));
  IBUF \data_IBUF[25]_inst 
       (.I(data[25]),
        .O(data_IBUF[25]));
  IBUF \data_IBUF[26]_inst 
       (.I(data[26]),
        .O(data_IBUF[26]));
  IBUF \data_IBUF[27]_inst 
       (.I(data[27]),
        .O(data_IBUF[27]));
  IBUF \data_IBUF[28]_inst 
       (.I(data[28]),
        .O(data_IBUF[28]));
  IBUF \data_IBUF[29]_inst 
       (.I(data[29]),
        .O(data_IBUF[29]));
  IBUF \data_IBUF[2]_inst 
       (.I(data[2]),
        .O(data_IBUF[2]));
  IBUF \data_IBUF[30]_inst 
       (.I(data[30]),
        .O(data_IBUF[30]));
  IBUF \data_IBUF[31]_inst 
       (.I(data[31]),
        .O(data_IBUF[31]));
  IBUF \data_IBUF[32]_inst 
       (.I(data[32]),
        .O(data_IBUF[32]));
  IBUF \data_IBUF[33]_inst 
       (.I(data[33]),
        .O(data_IBUF[33]));
  IBUF \data_IBUF[34]_inst 
       (.I(data[34]),
        .O(data_IBUF[34]));
  IBUF \data_IBUF[35]_inst 
       (.I(data[35]),
        .O(data_IBUF[35]));
  IBUF \data_IBUF[36]_inst 
       (.I(data[36]),
        .O(data_IBUF[36]));
  IBUF \data_IBUF[37]_inst 
       (.I(data[37]),
        .O(data_IBUF[37]));
  IBUF \data_IBUF[38]_inst 
       (.I(data[38]),
        .O(data_IBUF[38]));
  IBUF \data_IBUF[39]_inst 
       (.I(data[39]),
        .O(data_IBUF[39]));
  IBUF \data_IBUF[3]_inst 
       (.I(data[3]),
        .O(data_IBUF[3]));
  IBUF \data_IBUF[40]_inst 
       (.I(data[40]),
        .O(data_IBUF[40]));
  IBUF \data_IBUF[41]_inst 
       (.I(data[41]),
        .O(data_IBUF[41]));
  IBUF \data_IBUF[42]_inst 
       (.I(data[42]),
        .O(data_IBUF[42]));
  IBUF \data_IBUF[43]_inst 
       (.I(data[43]),
        .O(data_IBUF[43]));
  IBUF \data_IBUF[44]_inst 
       (.I(data[44]),
        .O(data_IBUF[44]));
  IBUF \data_IBUF[45]_inst 
       (.I(data[45]),
        .O(data_IBUF[45]));
  IBUF \data_IBUF[46]_inst 
       (.I(data[46]),
        .O(data_IBUF[46]));
  IBUF \data_IBUF[47]_inst 
       (.I(data[47]),
        .O(data_IBUF[47]));
  IBUF \data_IBUF[48]_inst 
       (.I(data[48]),
        .O(data_IBUF[48]));
  IBUF \data_IBUF[49]_inst 
       (.I(data[49]),
        .O(data_IBUF[49]));
  IBUF \data_IBUF[4]_inst 
       (.I(data[4]),
        .O(data_IBUF[4]));
  IBUF \data_IBUF[50]_inst 
       (.I(data[50]),
        .O(data_IBUF[50]));
  IBUF \data_IBUF[51]_inst 
       (.I(data[51]),
        .O(data_IBUF[51]));
  IBUF \data_IBUF[52]_inst 
       (.I(data[52]),
        .O(data_IBUF[52]));
  IBUF \data_IBUF[53]_inst 
       (.I(data[53]),
        .O(data_IBUF[53]));
  IBUF \data_IBUF[54]_inst 
       (.I(data[54]),
        .O(data_IBUF[54]));
  IBUF \data_IBUF[55]_inst 
       (.I(data[55]),
        .O(data_IBUF[55]));
  IBUF \data_IBUF[56]_inst 
       (.I(data[56]),
        .O(data_IBUF[56]));
  IBUF \data_IBUF[57]_inst 
       (.I(data[57]),
        .O(data_IBUF[57]));
  IBUF \data_IBUF[58]_inst 
       (.I(data[58]),
        .O(data_IBUF[58]));
  IBUF \data_IBUF[59]_inst 
       (.I(data[59]),
        .O(data_IBUF[59]));
  IBUF \data_IBUF[5]_inst 
       (.I(data[5]),
        .O(data_IBUF[5]));
  IBUF \data_IBUF[60]_inst 
       (.I(data[60]),
        .O(data_IBUF[60]));
  IBUF \data_IBUF[61]_inst 
       (.I(data[61]),
        .O(data_IBUF[61]));
  IBUF \data_IBUF[62]_inst 
       (.I(data[62]),
        .O(data_IBUF[62]));
  IBUF \data_IBUF[63]_inst 
       (.I(data[63]),
        .O(data_IBUF[63]));
  IBUF \data_IBUF[6]_inst 
       (.I(data[6]),
        .O(data_IBUF[6]));
  IBUF \data_IBUF[7]_inst 
       (.I(data[7]),
        .O(data_IBUF[7]));
  IBUF \data_IBUF[8]_inst 
       (.I(data[8]),
        .O(data_IBUF[8]));
  IBUF \data_IBUF[9]_inst 
       (.I(data[9]),
        .O(data_IBUF[9]));
  IBUF ena_IBUF_inst
       (.I(ena),
        .O(ena_IBUF));
  IBUF load_IBUF_inst
       (.I(load),
        .O(load_IBUF));
  LUT6 #(
    .INIT(64'hB8B8B8888888B888)) 
    \q[0]_i_1 
       (.I0(data_IBUF[0]),
        .I1(load_IBUF),
        .I2(amount_IBUF[1]),
        .I3(q_OBUF[1]),
        .I4(amount_IBUF[0]),
        .I5(q_OBUF[8]),
        .O(p_1_in[0]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[10]_i_1 
       (.I0(data_IBUF[10]),
        .I1(load_IBUF),
        .I2(\q[10]_i_2_n_0 ),
        .O(p_1_in[10]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[10]_i_2 
       (.I0(q_OBUF[18]),
        .I1(q_OBUF[2]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[11]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[9]),
        .O(\q[10]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[11]_i_1 
       (.I0(data_IBUF[11]),
        .I1(load_IBUF),
        .I2(\q[11]_i_2_n_0 ),
        .O(p_1_in[11]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[11]_i_2 
       (.I0(q_OBUF[19]),
        .I1(q_OBUF[3]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[12]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[10]),
        .O(\q[11]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[12]_i_1 
       (.I0(data_IBUF[12]),
        .I1(load_IBUF),
        .I2(\q[12]_i_2_n_0 ),
        .O(p_1_in[12]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[12]_i_2 
       (.I0(q_OBUF[20]),
        .I1(q_OBUF[4]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[13]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[11]),
        .O(\q[12]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[13]_i_1 
       (.I0(data_IBUF[13]),
        .I1(load_IBUF),
        .I2(\q[13]_i_2_n_0 ),
        .O(p_1_in[13]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[13]_i_2 
       (.I0(q_OBUF[21]),
        .I1(q_OBUF[5]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[14]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[12]),
        .O(\q[13]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[14]_i_1 
       (.I0(data_IBUF[14]),
        .I1(load_IBUF),
        .I2(\q[14]_i_2_n_0 ),
        .O(p_1_in[14]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[14]_i_2 
       (.I0(q_OBUF[22]),
        .I1(q_OBUF[6]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[15]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[13]),
        .O(\q[14]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[15]_i_1 
       (.I0(data_IBUF[15]),
        .I1(load_IBUF),
        .I2(\q[15]_i_2_n_0 ),
        .O(p_1_in[15]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[15]_i_2 
       (.I0(q_OBUF[23]),
        .I1(q_OBUF[7]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[16]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[14]),
        .O(\q[15]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[16]_i_1 
       (.I0(data_IBUF[16]),
        .I1(load_IBUF),
        .I2(\q[16]_i_2_n_0 ),
        .O(p_1_in[16]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[16]_i_2 
       (.I0(q_OBUF[24]),
        .I1(q_OBUF[8]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[17]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[15]),
        .O(\q[16]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[17]_i_1 
       (.I0(data_IBUF[17]),
        .I1(load_IBUF),
        .I2(\q[17]_i_2_n_0 ),
        .O(p_1_in[17]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[17]_i_2 
       (.I0(q_OBUF[25]),
        .I1(q_OBUF[9]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[18]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[16]),
        .O(\q[17]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[18]_i_1 
       (.I0(data_IBUF[18]),
        .I1(load_IBUF),
        .I2(\q[18]_i_2_n_0 ),
        .O(p_1_in[18]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[18]_i_2 
       (.I0(q_OBUF[26]),
        .I1(q_OBUF[10]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[19]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[17]),
        .O(\q[18]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[19]_i_1 
       (.I0(data_IBUF[19]),
        .I1(load_IBUF),
        .I2(\q[19]_i_2_n_0 ),
        .O(p_1_in[19]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[19]_i_2 
       (.I0(q_OBUF[27]),
        .I1(q_OBUF[11]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[20]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[18]),
        .O(\q[19]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair27" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[1]_i_1 
       (.I0(data_IBUF[1]),
        .I1(load_IBUF),
        .I2(\q[1]_i_2_n_0 ),
        .O(p_1_in[1]));
  LUT5 #(
    .INIT(32'hB833B800)) 
    \q[1]_i_2 
       (.I0(q_OBUF[9]),
        .I1(amount_IBUF[0]),
        .I2(q_OBUF[2]),
        .I3(amount_IBUF[1]),
        .I4(q_OBUF[0]),
        .O(\q[1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[20]_i_1 
       (.I0(data_IBUF[20]),
        .I1(load_IBUF),
        .I2(\q[20]_i_2_n_0 ),
        .O(p_1_in[20]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[20]_i_2 
       (.I0(q_OBUF[28]),
        .I1(q_OBUF[12]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[21]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[19]),
        .O(\q[20]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[21]_i_1 
       (.I0(data_IBUF[21]),
        .I1(load_IBUF),
        .I2(\q[21]_i_2_n_0 ),
        .O(p_1_in[21]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[21]_i_2 
       (.I0(q_OBUF[29]),
        .I1(q_OBUF[13]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[22]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[20]),
        .O(\q[21]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[22]_i_1 
       (.I0(data_IBUF[22]),
        .I1(load_IBUF),
        .I2(\q[22]_i_2_n_0 ),
        .O(p_1_in[22]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[22]_i_2 
       (.I0(q_OBUF[30]),
        .I1(q_OBUF[14]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[23]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[21]),
        .O(\q[22]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[23]_i_1 
       (.I0(data_IBUF[23]),
        .I1(load_IBUF),
        .I2(\q[23]_i_2_n_0 ),
        .O(p_1_in[23]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[23]_i_2 
       (.I0(q_OBUF[31]),
        .I1(q_OBUF[15]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[24]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[22]),
        .O(\q[23]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[24]_i_1 
       (.I0(data_IBUF[24]),
        .I1(load_IBUF),
        .I2(\q[24]_i_2_n_0 ),
        .O(p_1_in[24]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[24]_i_2 
       (.I0(q_OBUF[32]),
        .I1(q_OBUF[16]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[25]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[23]),
        .O(\q[24]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[25]_i_1 
       (.I0(data_IBUF[25]),
        .I1(load_IBUF),
        .I2(\q[25]_i_2_n_0 ),
        .O(p_1_in[25]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[25]_i_2 
       (.I0(q_OBUF[33]),
        .I1(q_OBUF[17]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[26]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[24]),
        .O(\q[25]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[26]_i_1 
       (.I0(data_IBUF[26]),
        .I1(load_IBUF),
        .I2(\q[26]_i_2_n_0 ),
        .O(p_1_in[26]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[26]_i_2 
       (.I0(q_OBUF[34]),
        .I1(q_OBUF[18]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[27]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[25]),
        .O(\q[26]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[27]_i_1 
       (.I0(data_IBUF[27]),
        .I1(load_IBUF),
        .I2(\q[27]_i_2_n_0 ),
        .O(p_1_in[27]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[27]_i_2 
       (.I0(q_OBUF[35]),
        .I1(q_OBUF[19]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[28]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[26]),
        .O(\q[27]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[28]_i_1 
       (.I0(data_IBUF[28]),
        .I1(load_IBUF),
        .I2(\q[28]_i_2_n_0 ),
        .O(p_1_in[28]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[28]_i_2 
       (.I0(q_OBUF[36]),
        .I1(q_OBUF[20]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[29]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[27]),
        .O(\q[28]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[29]_i_1 
       (.I0(data_IBUF[29]),
        .I1(load_IBUF),
        .I2(\q[29]_i_2_n_0 ),
        .O(p_1_in[29]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[29]_i_2 
       (.I0(q_OBUF[37]),
        .I1(q_OBUF[21]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[30]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[28]),
        .O(\q[29]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair27" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[2]_i_1 
       (.I0(data_IBUF[2]),
        .I1(load_IBUF),
        .I2(\q[2]_i_2_n_0 ),
        .O(p_1_in[2]));
  LUT5 #(
    .INIT(32'hB833B800)) 
    \q[2]_i_2 
       (.I0(q_OBUF[10]),
        .I1(amount_IBUF[0]),
        .I2(q_OBUF[3]),
        .I3(amount_IBUF[1]),
        .I4(q_OBUF[1]),
        .O(\q[2]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[30]_i_1 
       (.I0(data_IBUF[30]),
        .I1(load_IBUF),
        .I2(\q[30]_i_2_n_0 ),
        .O(p_1_in[30]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[30]_i_2 
       (.I0(q_OBUF[38]),
        .I1(q_OBUF[22]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[31]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[29]),
        .O(\q[30]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[31]_i_1 
       (.I0(data_IBUF[31]),
        .I1(load_IBUF),
        .I2(\q[31]_i_2_n_0 ),
        .O(p_1_in[31]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[31]_i_2 
       (.I0(q_OBUF[39]),
        .I1(q_OBUF[23]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[32]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[30]),
        .O(\q[31]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[32]_i_1 
       (.I0(data_IBUF[32]),
        .I1(load_IBUF),
        .I2(\q[32]_i_2_n_0 ),
        .O(p_1_in[32]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[32]_i_2 
       (.I0(q_OBUF[40]),
        .I1(q_OBUF[24]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[33]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[31]),
        .O(\q[32]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair16" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[33]_i_1 
       (.I0(data_IBUF[33]),
        .I1(load_IBUF),
        .I2(\q[33]_i_2_n_0 ),
        .O(p_1_in[33]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[33]_i_2 
       (.I0(q_OBUF[41]),
        .I1(q_OBUF[25]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[34]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[32]),
        .O(\q[33]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair16" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[34]_i_1 
       (.I0(data_IBUF[34]),
        .I1(load_IBUF),
        .I2(\q[34]_i_2_n_0 ),
        .O(p_1_in[34]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[34]_i_2 
       (.I0(q_OBUF[42]),
        .I1(q_OBUF[26]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[35]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[33]),
        .O(\q[34]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair17" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[35]_i_1 
       (.I0(data_IBUF[35]),
        .I1(load_IBUF),
        .I2(\q[35]_i_2_n_0 ),
        .O(p_1_in[35]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[35]_i_2 
       (.I0(q_OBUF[43]),
        .I1(q_OBUF[27]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[36]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[34]),
        .O(\q[35]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair17" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[36]_i_1 
       (.I0(data_IBUF[36]),
        .I1(load_IBUF),
        .I2(\q[36]_i_2_n_0 ),
        .O(p_1_in[36]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[36]_i_2 
       (.I0(q_OBUF[44]),
        .I1(q_OBUF[28]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[37]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[35]),
        .O(\q[36]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair18" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[37]_i_1 
       (.I0(data_IBUF[37]),
        .I1(load_IBUF),
        .I2(\q[37]_i_2_n_0 ),
        .O(p_1_in[37]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[37]_i_2 
       (.I0(q_OBUF[45]),
        .I1(q_OBUF[29]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[38]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[36]),
        .O(\q[37]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair18" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[38]_i_1 
       (.I0(data_IBUF[38]),
        .I1(load_IBUF),
        .I2(\q[38]_i_2_n_0 ),
        .O(p_1_in[38]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[38]_i_2 
       (.I0(q_OBUF[46]),
        .I1(q_OBUF[30]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[39]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[37]),
        .O(\q[38]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair19" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[39]_i_1 
       (.I0(data_IBUF[39]),
        .I1(load_IBUF),
        .I2(\q[39]_i_2_n_0 ),
        .O(p_1_in[39]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[39]_i_2 
       (.I0(q_OBUF[47]),
        .I1(q_OBUF[31]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[40]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[38]),
        .O(\q[39]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair28" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[3]_i_1 
       (.I0(data_IBUF[3]),
        .I1(load_IBUF),
        .I2(\q[3]_i_2_n_0 ),
        .O(p_1_in[3]));
  LUT5 #(
    .INIT(32'hB833B800)) 
    \q[3]_i_2 
       (.I0(q_OBUF[11]),
        .I1(amount_IBUF[0]),
        .I2(q_OBUF[4]),
        .I3(amount_IBUF[1]),
        .I4(q_OBUF[2]),
        .O(\q[3]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair19" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[40]_i_1 
       (.I0(data_IBUF[40]),
        .I1(load_IBUF),
        .I2(\q[40]_i_2_n_0 ),
        .O(p_1_in[40]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[40]_i_2 
       (.I0(q_OBUF[48]),
        .I1(q_OBUF[32]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[41]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[39]),
        .O(\q[40]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair20" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[41]_i_1 
       (.I0(data_IBUF[41]),
        .I1(load_IBUF),
        .I2(\q[41]_i_2_n_0 ),
        .O(p_1_in[41]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[41]_i_2 
       (.I0(q_OBUF[49]),
        .I1(q_OBUF[33]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[42]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[40]),
        .O(\q[41]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair20" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[42]_i_1 
       (.I0(data_IBUF[42]),
        .I1(load_IBUF),
        .I2(\q[42]_i_2_n_0 ),
        .O(p_1_in[42]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[42]_i_2 
       (.I0(q_OBUF[50]),
        .I1(q_OBUF[34]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[43]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[41]),
        .O(\q[42]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair21" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[43]_i_1 
       (.I0(data_IBUF[43]),
        .I1(load_IBUF),
        .I2(\q[43]_i_2_n_0 ),
        .O(p_1_in[43]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[43]_i_2 
       (.I0(q_OBUF[51]),
        .I1(q_OBUF[35]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[44]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[42]),
        .O(\q[43]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair21" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[44]_i_1 
       (.I0(data_IBUF[44]),
        .I1(load_IBUF),
        .I2(\q[44]_i_2_n_0 ),
        .O(p_1_in[44]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[44]_i_2 
       (.I0(q_OBUF[52]),
        .I1(q_OBUF[36]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[45]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[43]),
        .O(\q[44]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair22" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[45]_i_1 
       (.I0(data_IBUF[45]),
        .I1(load_IBUF),
        .I2(\q[45]_i_2_n_0 ),
        .O(p_1_in[45]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[45]_i_2 
       (.I0(q_OBUF[53]),
        .I1(q_OBUF[37]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[46]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[44]),
        .O(\q[45]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair22" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[46]_i_1 
       (.I0(data_IBUF[46]),
        .I1(load_IBUF),
        .I2(\q[46]_i_2_n_0 ),
        .O(p_1_in[46]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[46]_i_2 
       (.I0(q_OBUF[54]),
        .I1(q_OBUF[38]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[47]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[45]),
        .O(\q[46]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair23" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[47]_i_1 
       (.I0(data_IBUF[47]),
        .I1(load_IBUF),
        .I2(\q[47]_i_2_n_0 ),
        .O(p_1_in[47]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[47]_i_2 
       (.I0(q_OBUF[55]),
        .I1(q_OBUF[39]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[48]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[46]),
        .O(\q[47]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair23" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[48]_i_1 
       (.I0(data_IBUF[48]),
        .I1(load_IBUF),
        .I2(\q[48]_i_2_n_0 ),
        .O(p_1_in[48]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[48]_i_2 
       (.I0(q_OBUF[56]),
        .I1(q_OBUF[40]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[49]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[47]),
        .O(\q[48]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair24" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[49]_i_1 
       (.I0(data_IBUF[49]),
        .I1(load_IBUF),
        .I2(\q[49]_i_2_n_0 ),
        .O(p_1_in[49]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[49]_i_2 
       (.I0(q_OBUF[57]),
        .I1(q_OBUF[41]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[50]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[48]),
        .O(\q[49]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair28" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[4]_i_1 
       (.I0(data_IBUF[4]),
        .I1(load_IBUF),
        .I2(\q[4]_i_2_n_0 ),
        .O(p_1_in[4]));
  LUT5 #(
    .INIT(32'hB833B800)) 
    \q[4]_i_2 
       (.I0(q_OBUF[12]),
        .I1(amount_IBUF[0]),
        .I2(q_OBUF[5]),
        .I3(amount_IBUF[1]),
        .I4(q_OBUF[3]),
        .O(\q[4]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair24" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[50]_i_1 
       (.I0(data_IBUF[50]),
        .I1(load_IBUF),
        .I2(\q[50]_i_2_n_0 ),
        .O(p_1_in[50]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[50]_i_2 
       (.I0(q_OBUF[58]),
        .I1(q_OBUF[42]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[51]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[49]),
        .O(\q[50]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair25" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[51]_i_1 
       (.I0(data_IBUF[51]),
        .I1(load_IBUF),
        .I2(\q[51]_i_2_n_0 ),
        .O(p_1_in[51]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[51]_i_2 
       (.I0(q_OBUF[59]),
        .I1(q_OBUF[43]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[52]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[50]),
        .O(\q[51]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair25" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[52]_i_1 
       (.I0(data_IBUF[52]),
        .I1(load_IBUF),
        .I2(\q[52]_i_2_n_0 ),
        .O(p_1_in[52]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[52]_i_2 
       (.I0(q_OBUF[60]),
        .I1(q_OBUF[44]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[53]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[51]),
        .O(\q[52]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair26" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[53]_i_1 
       (.I0(data_IBUF[53]),
        .I1(load_IBUF),
        .I2(\q[53]_i_2_n_0 ),
        .O(p_1_in[53]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[53]_i_2 
       (.I0(q_OBUF[61]),
        .I1(q_OBUF[45]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[54]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[52]),
        .O(\q[53]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair26" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[54]_i_1 
       (.I0(data_IBUF[54]),
        .I1(load_IBUF),
        .I2(\q[54]_i_2_n_0 ),
        .O(p_1_in[54]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[54]_i_2 
       (.I0(q_OBUF[62]),
        .I1(q_OBUF[46]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[55]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[53]),
        .O(\q[54]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[55]_i_1 
       (.I0(data_IBUF[55]),
        .I1(load_IBUF),
        .I2(\q[55]_i_2_n_0 ),
        .O(p_1_in[55]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[55]_i_2 
       (.I0(q_OBUF[63]),
        .I1(q_OBUF[47]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[56]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[54]),
        .O(\q[55]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[56]_i_1 
       (.I0(data_IBUF[56]),
        .I1(load_IBUF),
        .I2(\q[56]_i_2_n_0 ),
        .O(p_1_in[56]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[56]_i_2 
       (.I0(q_OBUF[63]),
        .I1(q_OBUF[48]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[57]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[55]),
        .O(\q[56]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[57]_i_1 
       (.I0(data_IBUF[57]),
        .I1(load_IBUF),
        .I2(\q[57]_i_2_n_0 ),
        .O(p_1_in[57]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[57]_i_2 
       (.I0(q_OBUF[63]),
        .I1(q_OBUF[49]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[58]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[56]),
        .O(\q[57]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[58]_i_1 
       (.I0(data_IBUF[58]),
        .I1(load_IBUF),
        .I2(\q[58]_i_2_n_0 ),
        .O(p_1_in[58]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[58]_i_2 
       (.I0(q_OBUF[63]),
        .I1(q_OBUF[50]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[59]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[57]),
        .O(\q[58]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[59]_i_1 
       (.I0(data_IBUF[59]),
        .I1(load_IBUF),
        .I2(\q[59]_i_2_n_0 ),
        .O(p_1_in[59]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[59]_i_2 
       (.I0(q_OBUF[63]),
        .I1(q_OBUF[51]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[60]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[58]),
        .O(\q[59]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair29" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[5]_i_1 
       (.I0(data_IBUF[5]),
        .I1(load_IBUF),
        .I2(\q[5]_i_2_n_0 ),
        .O(p_1_in[5]));
  LUT5 #(
    .INIT(32'hB833B800)) 
    \q[5]_i_2 
       (.I0(q_OBUF[13]),
        .I1(amount_IBUF[0]),
        .I2(q_OBUF[6]),
        .I3(amount_IBUF[1]),
        .I4(q_OBUF[4]),
        .O(\q[5]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[60]_i_1 
       (.I0(data_IBUF[60]),
        .I1(load_IBUF),
        .I2(\q[60]_i_2_n_0 ),
        .O(p_1_in[60]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[60]_i_2 
       (.I0(q_OBUF[63]),
        .I1(q_OBUF[52]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[61]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[59]),
        .O(\q[60]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[61]_i_1 
       (.I0(data_IBUF[61]),
        .I1(load_IBUF),
        .I2(\q[61]_i_2_n_0 ),
        .O(p_1_in[61]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[61]_i_2 
       (.I0(q_OBUF[63]),
        .I1(q_OBUF[53]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[62]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[60]),
        .O(\q[61]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair30" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[62]_i_1 
       (.I0(data_IBUF[62]),
        .I1(load_IBUF),
        .I2(\q[62]_i_2_n_0 ),
        .O(p_1_in[62]));
  LUT5 #(
    .INIT(32'hF0BBF088)) 
    \q[62]_i_2 
       (.I0(q_OBUF[54]),
        .I1(amount_IBUF[0]),
        .I2(q_OBUF[63]),
        .I3(amount_IBUF[1]),
        .I4(q_OBUF[61]),
        .O(\q[62]_i_2_n_0 ));
  LUT2 #(
    .INIT(4'hE)) 
    \q[63]_i_1 
       (.I0(ena_IBUF),
        .I1(load_IBUF),
        .O(\q[63]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hB8)) 
    \q[63]_i_2 
       (.I0(data_IBUF[63]),
        .I1(load_IBUF),
        .I2(\q[63]_i_3_n_0 ),
        .O(p_1_in[63]));
  LUT5 #(
    .INIT(32'hF0BBF088)) 
    \q[63]_i_3 
       (.I0(q_OBUF[55]),
        .I1(amount_IBUF[0]),
        .I2(q_OBUF[63]),
        .I3(amount_IBUF[1]),
        .I4(q_OBUF[62]),
        .O(\q[63]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair29" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[6]_i_1 
       (.I0(data_IBUF[6]),
        .I1(load_IBUF),
        .I2(\q[6]_i_2_n_0 ),
        .O(p_1_in[6]));
  LUT5 #(
    .INIT(32'hB833B800)) 
    \q[6]_i_2 
       (.I0(q_OBUF[14]),
        .I1(amount_IBUF[0]),
        .I2(q_OBUF[7]),
        .I3(amount_IBUF[1]),
        .I4(q_OBUF[5]),
        .O(\q[6]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair30" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[7]_i_1 
       (.I0(data_IBUF[7]),
        .I1(load_IBUF),
        .I2(\q[7]_i_2_n_0 ),
        .O(p_1_in[7]));
  LUT5 #(
    .INIT(32'hB833B800)) 
    \q[7]_i_2 
       (.I0(q_OBUF[15]),
        .I1(amount_IBUF[0]),
        .I2(q_OBUF[8]),
        .I3(amount_IBUF[1]),
        .I4(q_OBUF[6]),
        .O(\q[7]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[8]_i_1 
       (.I0(data_IBUF[8]),
        .I1(load_IBUF),
        .I2(\q[8]_i_2_n_0 ),
        .O(p_1_in[8]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[8]_i_2 
       (.I0(q_OBUF[16]),
        .I1(q_OBUF[0]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[9]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[7]),
        .O(\q[8]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT3 #(
    .INIT(8'hB8)) 
    \q[9]_i_1 
       (.I0(data_IBUF[9]),
        .I1(load_IBUF),
        .I2(\q[9]_i_2_n_0 ),
        .O(p_1_in[9]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \q[9]_i_2 
       (.I0(q_OBUF[17]),
        .I1(q_OBUF[1]),
        .I2(amount_IBUF[0]),
        .I3(q_OBUF[10]),
        .I4(amount_IBUF[1]),
        .I5(q_OBUF[8]),
        .O(\q[9]_i_2_n_0 ));
  OBUF \q_OBUF[0]_inst 
       (.I(q_OBUF[0]),
        .O(q[0]));
  OBUF \q_OBUF[10]_inst 
       (.I(q_OBUF[10]),
        .O(q[10]));
  OBUF \q_OBUF[11]_inst 
       (.I(q_OBUF[11]),
        .O(q[11]));
  OBUF \q_OBUF[12]_inst 
       (.I(q_OBUF[12]),
        .O(q[12]));
  OBUF \q_OBUF[13]_inst 
       (.I(q_OBUF[13]),
        .O(q[13]));
  OBUF \q_OBUF[14]_inst 
       (.I(q_OBUF[14]),
        .O(q[14]));
  OBUF \q_OBUF[15]_inst 
       (.I(q_OBUF[15]),
        .O(q[15]));
  OBUF \q_OBUF[16]_inst 
       (.I(q_OBUF[16]),
        .O(q[16]));
  OBUF \q_OBUF[17]_inst 
       (.I(q_OBUF[17]),
        .O(q[17]));
  OBUF \q_OBUF[18]_inst 
       (.I(q_OBUF[18]),
        .O(q[18]));
  OBUF \q_OBUF[19]_inst 
       (.I(q_OBUF[19]),
        .O(q[19]));
  OBUF \q_OBUF[1]_inst 
       (.I(q_OBUF[1]),
        .O(q[1]));
  OBUF \q_OBUF[20]_inst 
       (.I(q_OBUF[20]),
        .O(q[20]));
  OBUF \q_OBUF[21]_inst 
       (.I(q_OBUF[21]),
        .O(q[21]));
  OBUF \q_OBUF[22]_inst 
       (.I(q_OBUF[22]),
        .O(q[22]));
  OBUF \q_OBUF[23]_inst 
       (.I(q_OBUF[23]),
        .O(q[23]));
  OBUF \q_OBUF[24]_inst 
       (.I(q_OBUF[24]),
        .O(q[24]));
  OBUF \q_OBUF[25]_inst 
       (.I(q_OBUF[25]),
        .O(q[25]));
  OBUF \q_OBUF[26]_inst 
       (.I(q_OBUF[26]),
        .O(q[26]));
  OBUF \q_OBUF[27]_inst 
       (.I(q_OBUF[27]),
        .O(q[27]));
  OBUF \q_OBUF[28]_inst 
       (.I(q_OBUF[28]),
        .O(q[28]));
  OBUF \q_OBUF[29]_inst 
       (.I(q_OBUF[29]),
        .O(q[29]));
  OBUF \q_OBUF[2]_inst 
       (.I(q_OBUF[2]),
        .O(q[2]));
  OBUF \q_OBUF[30]_inst 
       (.I(q_OBUF[30]),
        .O(q[30]));
  OBUF \q_OBUF[31]_inst 
       (.I(q_OBUF[31]),
        .O(q[31]));
  OBUF \q_OBUF[32]_inst 
       (.I(q_OBUF[32]),
        .O(q[32]));
  OBUF \q_OBUF[33]_inst 
       (.I(q_OBUF[33]),
        .O(q[33]));
  OBUF \q_OBUF[34]_inst 
       (.I(q_OBUF[34]),
        .O(q[34]));
  OBUF \q_OBUF[35]_inst 
       (.I(q_OBUF[35]),
        .O(q[35]));
  OBUF \q_OBUF[36]_inst 
       (.I(q_OBUF[36]),
        .O(q[36]));
  OBUF \q_OBUF[37]_inst 
       (.I(q_OBUF[37]),
        .O(q[37]));
  OBUF \q_OBUF[38]_inst 
       (.I(q_OBUF[38]),
        .O(q[38]));
  OBUF \q_OBUF[39]_inst 
       (.I(q_OBUF[39]),
        .O(q[39]));
  OBUF \q_OBUF[3]_inst 
       (.I(q_OBUF[3]),
        .O(q[3]));
  OBUF \q_OBUF[40]_inst 
       (.I(q_OBUF[40]),
        .O(q[40]));
  OBUF \q_OBUF[41]_inst 
       (.I(q_OBUF[41]),
        .O(q[41]));
  OBUF \q_OBUF[42]_inst 
       (.I(q_OBUF[42]),
        .O(q[42]));
  OBUF \q_OBUF[43]_inst 
       (.I(q_OBUF[43]),
        .O(q[43]));
  OBUF \q_OBUF[44]_inst 
       (.I(q_OBUF[44]),
        .O(q[44]));
  OBUF \q_OBUF[45]_inst 
       (.I(q_OBUF[45]),
        .O(q[45]));
  OBUF \q_OBUF[46]_inst 
       (.I(q_OBUF[46]),
        .O(q[46]));
  OBUF \q_OBUF[47]_inst 
       (.I(q_OBUF[47]),
        .O(q[47]));
  OBUF \q_OBUF[48]_inst 
       (.I(q_OBUF[48]),
        .O(q[48]));
  OBUF \q_OBUF[49]_inst 
       (.I(q_OBUF[49]),
        .O(q[49]));
  OBUF \q_OBUF[4]_inst 
       (.I(q_OBUF[4]),
        .O(q[4]));
  OBUF \q_OBUF[50]_inst 
       (.I(q_OBUF[50]),
        .O(q[50]));
  OBUF \q_OBUF[51]_inst 
       (.I(q_OBUF[51]),
        .O(q[51]));
  OBUF \q_OBUF[52]_inst 
       (.I(q_OBUF[52]),
        .O(q[52]));
  OBUF \q_OBUF[53]_inst 
       (.I(q_OBUF[53]),
        .O(q[53]));
  OBUF \q_OBUF[54]_inst 
       (.I(q_OBUF[54]),
        .O(q[54]));
  OBUF \q_OBUF[55]_inst 
       (.I(q_OBUF[55]),
        .O(q[55]));
  OBUF \q_OBUF[56]_inst 
       (.I(q_OBUF[56]),
        .O(q[56]));
  OBUF \q_OBUF[57]_inst 
       (.I(q_OBUF[57]),
        .O(q[57]));
  OBUF \q_OBUF[58]_inst 
       (.I(q_OBUF[58]),
        .O(q[58]));
  OBUF \q_OBUF[59]_inst 
       (.I(q_OBUF[59]),
        .O(q[59]));
  OBUF \q_OBUF[5]_inst 
       (.I(q_OBUF[5]),
        .O(q[5]));
  OBUF \q_OBUF[60]_inst 
       (.I(q_OBUF[60]),
        .O(q[60]));
  OBUF \q_OBUF[61]_inst 
       (.I(q_OBUF[61]),
        .O(q[61]));
  OBUF \q_OBUF[62]_inst 
       (.I(q_OBUF[62]),
        .O(q[62]));
  OBUF \q_OBUF[63]_inst 
       (.I(q_OBUF[63]),
        .O(q[63]));
  OBUF \q_OBUF[6]_inst 
       (.I(q_OBUF[6]),
        .O(q[6]));
  OBUF \q_OBUF[7]_inst 
       (.I(q_OBUF[7]),
        .O(q[7]));
  OBUF \q_OBUF[8]_inst 
       (.I(q_OBUF[8]),
        .O(q[8]));
  OBUF \q_OBUF[9]_inst 
       (.I(q_OBUF[9]),
        .O(q[9]));
  FDRE \q_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[0]),
        .Q(q_OBUF[0]),
        .R(1'b0));
  FDRE \q_reg[10] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[10]),
        .Q(q_OBUF[10]),
        .R(1'b0));
  FDRE \q_reg[11] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[11]),
        .Q(q_OBUF[11]),
        .R(1'b0));
  FDRE \q_reg[12] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[12]),
        .Q(q_OBUF[12]),
        .R(1'b0));
  FDRE \q_reg[13] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[13]),
        .Q(q_OBUF[13]),
        .R(1'b0));
  FDRE \q_reg[14] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[14]),
        .Q(q_OBUF[14]),
        .R(1'b0));
  FDRE \q_reg[15] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[15]),
        .Q(q_OBUF[15]),
        .R(1'b0));
  FDRE \q_reg[16] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[16]),
        .Q(q_OBUF[16]),
        .R(1'b0));
  FDRE \q_reg[17] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[17]),
        .Q(q_OBUF[17]),
        .R(1'b0));
  FDRE \q_reg[18] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[18]),
        .Q(q_OBUF[18]),
        .R(1'b0));
  FDRE \q_reg[19] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[19]),
        .Q(q_OBUF[19]),
        .R(1'b0));
  FDRE \q_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[1]),
        .Q(q_OBUF[1]),
        .R(1'b0));
  FDRE \q_reg[20] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[20]),
        .Q(q_OBUF[20]),
        .R(1'b0));
  FDRE \q_reg[21] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[21]),
        .Q(q_OBUF[21]),
        .R(1'b0));
  FDRE \q_reg[22] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[22]),
        .Q(q_OBUF[22]),
        .R(1'b0));
  FDRE \q_reg[23] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[23]),
        .Q(q_OBUF[23]),
        .R(1'b0));
  FDRE \q_reg[24] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[24]),
        .Q(q_OBUF[24]),
        .R(1'b0));
  FDRE \q_reg[25] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[25]),
        .Q(q_OBUF[25]),
        .R(1'b0));
  FDRE \q_reg[26] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[26]),
        .Q(q_OBUF[26]),
        .R(1'b0));
  FDRE \q_reg[27] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[27]),
        .Q(q_OBUF[27]),
        .R(1'b0));
  FDRE \q_reg[28] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[28]),
        .Q(q_OBUF[28]),
        .R(1'b0));
  FDRE \q_reg[29] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[29]),
        .Q(q_OBUF[29]),
        .R(1'b0));
  FDRE \q_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[2]),
        .Q(q_OBUF[2]),
        .R(1'b0));
  FDRE \q_reg[30] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[30]),
        .Q(q_OBUF[30]),
        .R(1'b0));
  FDRE \q_reg[31] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[31]),
        .Q(q_OBUF[31]),
        .R(1'b0));
  FDRE \q_reg[32] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[32]),
        .Q(q_OBUF[32]),
        .R(1'b0));
  FDRE \q_reg[33] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[33]),
        .Q(q_OBUF[33]),
        .R(1'b0));
  FDRE \q_reg[34] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[34]),
        .Q(q_OBUF[34]),
        .R(1'b0));
  FDRE \q_reg[35] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[35]),
        .Q(q_OBUF[35]),
        .R(1'b0));
  FDRE \q_reg[36] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[36]),
        .Q(q_OBUF[36]),
        .R(1'b0));
  FDRE \q_reg[37] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[37]),
        .Q(q_OBUF[37]),
        .R(1'b0));
  FDRE \q_reg[38] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[38]),
        .Q(q_OBUF[38]),
        .R(1'b0));
  FDRE \q_reg[39] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[39]),
        .Q(q_OBUF[39]),
        .R(1'b0));
  FDRE \q_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[3]),
        .Q(q_OBUF[3]),
        .R(1'b0));
  FDRE \q_reg[40] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[40]),
        .Q(q_OBUF[40]),
        .R(1'b0));
  FDRE \q_reg[41] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[41]),
        .Q(q_OBUF[41]),
        .R(1'b0));
  FDRE \q_reg[42] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[42]),
        .Q(q_OBUF[42]),
        .R(1'b0));
  FDRE \q_reg[43] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[43]),
        .Q(q_OBUF[43]),
        .R(1'b0));
  FDRE \q_reg[44] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[44]),
        .Q(q_OBUF[44]),
        .R(1'b0));
  FDRE \q_reg[45] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[45]),
        .Q(q_OBUF[45]),
        .R(1'b0));
  FDRE \q_reg[46] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[46]),
        .Q(q_OBUF[46]),
        .R(1'b0));
  FDRE \q_reg[47] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[47]),
        .Q(q_OBUF[47]),
        .R(1'b0));
  FDRE \q_reg[48] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[48]),
        .Q(q_OBUF[48]),
        .R(1'b0));
  FDRE \q_reg[49] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[49]),
        .Q(q_OBUF[49]),
        .R(1'b0));
  FDRE \q_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[4]),
        .Q(q_OBUF[4]),
        .R(1'b0));
  FDRE \q_reg[50] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[50]),
        .Q(q_OBUF[50]),
        .R(1'b0));
  FDRE \q_reg[51] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[51]),
        .Q(q_OBUF[51]),
        .R(1'b0));
  FDRE \q_reg[52] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[52]),
        .Q(q_OBUF[52]),
        .R(1'b0));
  FDRE \q_reg[53] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[53]),
        .Q(q_OBUF[53]),
        .R(1'b0));
  FDRE \q_reg[54] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[54]),
        .Q(q_OBUF[54]),
        .R(1'b0));
  FDRE \q_reg[55] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[55]),
        .Q(q_OBUF[55]),
        .R(1'b0));
  FDRE \q_reg[56] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[56]),
        .Q(q_OBUF[56]),
        .R(1'b0));
  FDRE \q_reg[57] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[57]),
        .Q(q_OBUF[57]),
        .R(1'b0));
  FDRE \q_reg[58] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[58]),
        .Q(q_OBUF[58]),
        .R(1'b0));
  FDRE \q_reg[59] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[59]),
        .Q(q_OBUF[59]),
        .R(1'b0));
  FDRE \q_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[5]),
        .Q(q_OBUF[5]),
        .R(1'b0));
  FDRE \q_reg[60] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[60]),
        .Q(q_OBUF[60]),
        .R(1'b0));
  FDRE \q_reg[61] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[61]),
        .Q(q_OBUF[61]),
        .R(1'b0));
  FDRE \q_reg[62] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[62]),
        .Q(q_OBUF[62]),
        .R(1'b0));
  FDRE \q_reg[63] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[63]),
        .Q(q_OBUF[63]),
        .R(1'b0));
  FDRE \q_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[6]),
        .Q(q_OBUF[6]),
        .R(1'b0));
  FDRE \q_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[7]),
        .Q(q_OBUF[7]),
        .R(1'b0));
  FDRE \q_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[8]),
        .Q(q_OBUF[8]),
        .R(1'b0));
  FDRE \q_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[63]_i_1_n_0 ),
        .D(p_1_in[9]),
        .Q(q_OBUF[9]),
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
