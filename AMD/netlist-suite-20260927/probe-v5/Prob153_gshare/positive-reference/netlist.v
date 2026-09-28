// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 15:44:42 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/netlist-suite-20260927/probe-v5/eda/run-hTyfSQ/build/.rtl-synth-9mWpNP/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* LNT = "2'b01" *) (* LT = "2'b10" *) (* SNT = "2'b00" *) 
(* ST = "2'b11" *) (* n = "7" *) 
(* NotValidForBitStream *)
module TopModule
   (clk,
    areset,
    predict_valid,
    predict_pc,
    predict_taken,
    predict_history,
    train_valid,
    train_taken,
    train_mispredicted,
    train_history,
    train_pc);
  input clk;
  input areset;
  input predict_valid;
  input [6:0]predict_pc;
  output predict_taken;
  output [6:0]predict_history;
  input train_valid;
  input train_taken;
  input train_mispredicted;
  input [6:0]train_history;
  input [6:0]train_pc;

  wire areset;
  wire areset_IBUF;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire \pht[0][1]_i_1_n_0 ;
  wire \pht[100][1]_i_1_n_0 ;
  wire \pht[101][0]_i_1_n_0 ;
  wire \pht[101][1]_i_1_n_0 ;
  wire \pht[101][1]_i_2_n_0 ;
  wire \pht[101][1]_i_3_n_0 ;
  wire \pht[102][1]_i_1_n_0 ;
  wire \pht[102][1]_i_2_n_0 ;
  wire \pht[103][0]_i_1_n_0 ;
  wire \pht[103][0]_i_2_n_0 ;
  wire \pht[103][1]_i_1_n_0 ;
  wire \pht[104][1]_i_1_n_0 ;
  wire \pht[105][1]_i_1_n_0 ;
  wire \pht[106][1]_i_1_n_0 ;
  wire \pht[107][1]_i_1_n_0 ;
  wire \pht[108][1]_i_1_n_0 ;
  wire \pht[109][0]_i_1_n_0 ;
  wire \pht[109][1]_i_1_n_0 ;
  wire \pht[10][1]_i_1_n_0 ;
  wire \pht[110][0]_i_1_n_0 ;
  wire \pht[110][0]_i_2_n_0 ;
  wire \pht[110][1]_i_1_n_0 ;
  wire \pht[111][1]_i_1_n_0 ;
  wire \pht[111][1]_i_2_n_0 ;
  wire \pht[111][1]_i_3_n_0 ;
  wire \pht[111][1]_i_4_n_0 ;
  wire \pht[112][1]_i_1_n_0 ;
  wire \pht[112][1]_i_2_n_0 ;
  wire \pht[113][1]_i_1_n_0 ;
  wire \pht[113][1]_i_2_n_0 ;
  wire \pht[114][1]_i_1_n_0 ;
  wire \pht[114][1]_i_2_n_0 ;
  wire \pht[115][1]_i_1_n_0 ;
  wire \pht[115][1]_i_2_n_0 ;
  wire \pht[116][1]_i_1_n_0 ;
  wire \pht[116][1]_i_2_n_0 ;
  wire \pht[116][1]_i_3_n_0 ;
  wire \pht[116][1]_i_4_n_0 ;
  wire \pht[117][1]_i_1_n_0 ;
  wire \pht[117][1]_i_2_n_0 ;
  wire \pht[117][1]_i_3_n_0 ;
  wire \pht[117][1]_i_4_n_0 ;
  wire \pht[118][0]_i_1_n_0 ;
  wire \pht[118][1]_i_1_n_0 ;
  wire \pht[118][1]_i_2_n_0 ;
  wire \pht[118][1]_i_3_n_0 ;
  wire \pht[118][1]_i_4_n_0 ;
  wire \pht[118][1]_i_5_n_0 ;
  wire \pht[119][1]_i_1_n_0 ;
  wire \pht[119][1]_i_2_n_0 ;
  wire \pht[119][1]_i_3_n_0 ;
  wire \pht[119][1]_i_4_n_0 ;
  wire \pht[11][1]_i_1_n_0 ;
  wire \pht[120][1]_i_1_n_0 ;
  wire \pht[120][1]_i_2_n_0 ;
  wire \pht[121][1]_i_1_n_0 ;
  wire \pht[121][1]_i_2_n_0 ;
  wire \pht[122][1]_i_1_n_0 ;
  wire \pht[122][1]_i_2_n_0 ;
  wire \pht[123][1]_i_1_n_0 ;
  wire \pht[123][1]_i_2_n_0 ;
  wire \pht[124][1]_i_1_n_0 ;
  wire \pht[124][1]_i_2_n_0 ;
  wire \pht[125][1]_i_1_n_0 ;
  wire \pht[125][1]_i_2_n_0 ;
  wire \pht[126][0]_i_1_n_0 ;
  wire \pht[126][1]_i_1_n_0 ;
  wire \pht[126][1]_i_2_n_0 ;
  wire \pht[126][1]_i_3_n_0 ;
  wire \pht[126][1]_i_4_n_0 ;
  wire \pht[127][0]_i_10_n_0 ;
  wire \pht[127][0]_i_11_n_0 ;
  wire \pht[127][0]_i_12_n_0 ;
  wire \pht[127][0]_i_13_n_0 ;
  wire \pht[127][0]_i_14_n_0 ;
  wire \pht[127][0]_i_15_n_0 ;
  wire \pht[127][0]_i_16_n_0 ;
  wire \pht[127][0]_i_17_n_0 ;
  wire \pht[127][0]_i_18_n_0 ;
  wire \pht[127][0]_i_19_n_0 ;
  wire \pht[127][0]_i_1_n_0 ;
  wire \pht[127][0]_i_20_n_0 ;
  wire \pht[127][0]_i_21_n_0 ;
  wire \pht[127][0]_i_22_n_0 ;
  wire \pht[127][0]_i_23_n_0 ;
  wire \pht[127][0]_i_24_n_0 ;
  wire \pht[127][0]_i_25_n_0 ;
  wire \pht[127][0]_i_26_n_0 ;
  wire \pht[127][0]_i_27_n_0 ;
  wire \pht[127][0]_i_28_n_0 ;
  wire \pht[127][0]_i_29_n_0 ;
  wire \pht[127][0]_i_2_n_0 ;
  wire \pht[127][0]_i_30_n_0 ;
  wire \pht[127][0]_i_31_n_0 ;
  wire \pht[127][0]_i_32_n_0 ;
  wire \pht[127][0]_i_33_n_0 ;
  wire \pht[127][0]_i_34_n_0 ;
  wire \pht[127][0]_i_35_n_0 ;
  wire \pht[127][0]_i_36_n_0 ;
  wire \pht[127][0]_i_37_n_0 ;
  wire \pht[127][0]_i_38_n_0 ;
  wire \pht[127][0]_i_39_n_0 ;
  wire \pht[127][0]_i_3_n_0 ;
  wire \pht[127][0]_i_40_n_0 ;
  wire \pht[127][0]_i_41_n_0 ;
  wire \pht[127][0]_i_42_n_0 ;
  wire \pht[127][0]_i_43_n_0 ;
  wire \pht[127][0]_i_44_n_0 ;
  wire \pht[127][0]_i_45_n_0 ;
  wire \pht[127][0]_i_46_n_0 ;
  wire \pht[127][0]_i_47_n_0 ;
  wire \pht[127][0]_i_48_n_0 ;
  wire \pht[127][0]_i_49_n_0 ;
  wire \pht[127][0]_i_4_n_0 ;
  wire \pht[127][0]_i_50_n_0 ;
  wire \pht[127][0]_i_51_n_0 ;
  wire \pht[127][0]_i_52_n_0 ;
  wire \pht[127][0]_i_53_n_0 ;
  wire \pht[127][0]_i_54_n_0 ;
  wire \pht[127][0]_i_55_n_0 ;
  wire \pht[127][0]_i_56_n_0 ;
  wire \pht[127][0]_i_57_n_0 ;
  wire \pht[127][0]_i_58_n_0 ;
  wire \pht[127][0]_i_59_n_0 ;
  wire \pht[127][0]_i_5_n_0 ;
  wire \pht[127][0]_i_60_n_0 ;
  wire \pht[127][0]_i_61_n_0 ;
  wire \pht[127][0]_i_62_n_0 ;
  wire \pht[127][0]_i_63_n_0 ;
  wire \pht[127][0]_i_64_n_0 ;
  wire \pht[127][0]_i_65_n_0 ;
  wire \pht[127][0]_i_66_n_0 ;
  wire \pht[127][0]_i_67_n_0 ;
  wire \pht[127][0]_i_68_n_0 ;
  wire \pht[127][0]_i_69_n_0 ;
  wire \pht[127][0]_i_6_n_0 ;
  wire \pht[127][0]_i_70_n_0 ;
  wire \pht[127][0]_i_71_n_0 ;
  wire \pht[127][0]_i_72_n_0 ;
  wire \pht[127][0]_i_73_n_0 ;
  wire \pht[127][0]_i_74_n_0 ;
  wire \pht[127][0]_i_75_n_0 ;
  wire \pht[127][0]_i_7_n_0 ;
  wire \pht[127][0]_i_8_n_0 ;
  wire \pht[127][0]_i_9_n_0 ;
  wire \pht[127][1]_i_1_n_0 ;
  wire \pht[127][1]_i_2_n_0 ;
  wire \pht[127][1]_i_3_n_0 ;
  wire \pht[127][1]_i_4_n_0 ;
  wire \pht[127][1]_i_5_n_0 ;
  wire \pht[127][1]_i_6_n_0 ;
  wire \pht[127][1]_i_7_n_0 ;
  wire \pht[127][1]_i_8_n_0 ;
  wire \pht[127][1]_i_9_n_0 ;
  wire \pht[12][0]_i_1_n_0 ;
  wire \pht[12][1]_i_1_n_0 ;
  wire \pht[13][1]_i_1_n_0 ;
  wire \pht[14][1]_i_1_n_0 ;
  wire \pht[15][1]_i_1_n_0 ;
  wire \pht[15][1]_i_2_n_0 ;
  wire \pht[15][1]_i_3_n_0 ;
  wire \pht[16][1]_i_1_n_0 ;
  wire \pht[16][1]_i_2_n_0 ;
  wire \pht[16][1]_i_3_n_0 ;
  wire \pht[17][1]_i_1_n_0 ;
  wire \pht[17][1]_i_2_n_0 ;
  wire \pht[17][1]_i_3_n_0 ;
  wire \pht[18][1]_i_1_n_0 ;
  wire \pht[18][1]_i_2_n_0 ;
  wire \pht[18][1]_i_3_n_0 ;
  wire \pht[19][0]_i_1_n_0 ;
  wire \pht[19][1]_i_1_n_0 ;
  wire \pht[1][1]_i_1_n_0 ;
  wire \pht[20][1]_i_1_n_0 ;
  wire \pht[21][1]_i_1_n_0 ;
  wire \pht[21][1]_i_2_n_0 ;
  wire \pht[22][1]_i_1_n_0 ;
  wire \pht[22][1]_i_2_n_0 ;
  wire \pht[23][1]_i_1_n_0 ;
  wire \pht[23][1]_i_2_n_0 ;
  wire \pht[24][1]_i_1_n_0 ;
  wire \pht[25][1]_i_1_n_0 ;
  wire \pht[26][1]_i_1_n_0 ;
  wire \pht[27][0]_i_1_n_0 ;
  wire \pht[27][1]_i_1_n_0 ;
  wire \pht[28][0]_i_1_n_0 ;
  wire \pht[28][1]_i_1_n_0 ;
  wire \pht[29][1]_i_1_n_0 ;
  wire \pht[2][1]_i_1_n_0 ;
  wire \pht[30][1]_i_1_n_0 ;
  wire \pht[31][0]_i_1_n_0 ;
  wire \pht[31][1]_i_1_n_0 ;
  wire \pht[31][1]_i_2_n_0 ;
  wire \pht[31][1]_i_3_n_0 ;
  wire \pht[32][1]_i_1_n_0 ;
  wire \pht[33][1]_i_1_n_0 ;
  wire \pht[33][1]_i_2_n_0 ;
  wire \pht[34][1]_i_1_n_0 ;
  wire \pht[34][1]_i_2_n_0 ;
  wire \pht[35][0]_i_1_n_0 ;
  wire \pht[35][1]_i_1_n_0 ;
  wire \pht[36][1]_i_1_n_0 ;
  wire \pht[37][1]_i_1_n_0 ;
  wire \pht[38][1]_i_1_n_0 ;
  wire \pht[39][1]_i_1_n_0 ;
  wire \pht[3][1]_i_1_n_0 ;
  wire \pht[3][1]_i_2_n_0 ;
  wire \pht[40][1]_i_1_n_0 ;
  wire \pht[41][1]_i_1_n_0 ;
  wire \pht[42][1]_i_1_n_0 ;
  wire \pht[43][1]_i_1_n_0 ;
  wire \pht[44][1]_i_1_n_0 ;
  wire \pht[45][1]_i_1_n_0 ;
  wire \pht[46][1]_i_1_n_0 ;
  wire \pht[47][1]_i_1_n_0 ;
  wire \pht[47][1]_i_2_n_0 ;
  wire \pht[47][1]_i_3_n_0 ;
  wire \pht[48][1]_i_1_n_0 ;
  wire \pht[48][1]_i_2_n_0 ;
  wire \pht[48][1]_i_3_n_0 ;
  wire \pht[48][1]_i_4_n_0 ;
  wire \pht[49][0]_i_1_n_0 ;
  wire \pht[49][1]_i_1_n_0 ;
  wire \pht[4][0]_i_1_n_0 ;
  wire \pht[4][1]_i_1_n_0 ;
  wire \pht[50][0]_i_1_n_0 ;
  wire \pht[50][1]_i_1_n_0 ;
  wire \pht[51][1]_i_1_n_0 ;
  wire \pht[52][0]_i_1_n_0 ;
  wire \pht[52][1]_i_1_n_0 ;
  wire \pht[52][1]_i_2_n_0 ;
  wire \pht[53][1]_i_1_n_0 ;
  wire \pht[54][0]_i_10_n_0 ;
  wire \pht[54][0]_i_11_n_0 ;
  wire \pht[54][0]_i_12_n_0 ;
  wire \pht[54][0]_i_13_n_0 ;
  wire \pht[54][0]_i_14_n_0 ;
  wire \pht[54][0]_i_15_n_0 ;
  wire \pht[54][0]_i_16_n_0 ;
  wire \pht[54][0]_i_17_n_0 ;
  wire \pht[54][0]_i_18_n_0 ;
  wire \pht[54][0]_i_19_n_0 ;
  wire \pht[54][0]_i_1_n_0 ;
  wire \pht[54][0]_i_20_n_0 ;
  wire \pht[54][0]_i_21_n_0 ;
  wire \pht[54][0]_i_22_n_0 ;
  wire \pht[54][0]_i_23_n_0 ;
  wire \pht[54][0]_i_24_n_0 ;
  wire \pht[54][0]_i_25_n_0 ;
  wire \pht[54][0]_i_26_n_0 ;
  wire \pht[54][0]_i_27_n_0 ;
  wire \pht[54][0]_i_28_n_0 ;
  wire \pht[54][0]_i_29_n_0 ;
  wire \pht[54][0]_i_2_n_0 ;
  wire \pht[54][0]_i_30_n_0 ;
  wire \pht[54][0]_i_31_n_0 ;
  wire \pht[54][0]_i_32_n_0 ;
  wire \pht[54][0]_i_33_n_0 ;
  wire \pht[54][0]_i_34_n_0 ;
  wire \pht[54][0]_i_35_n_0 ;
  wire \pht[54][0]_i_36_n_0 ;
  wire \pht[54][0]_i_37_n_0 ;
  wire \pht[54][0]_i_38_n_0 ;
  wire \pht[54][0]_i_39_n_0 ;
  wire \pht[54][0]_i_3_n_0 ;
  wire \pht[54][0]_i_40_n_0 ;
  wire \pht[54][0]_i_41_n_0 ;
  wire \pht[54][0]_i_42_n_0 ;
  wire \pht[54][0]_i_43_n_0 ;
  wire \pht[54][0]_i_44_n_0 ;
  wire \pht[54][0]_i_45_n_0 ;
  wire \pht[54][0]_i_46_n_0 ;
  wire \pht[54][0]_i_47_n_0 ;
  wire \pht[54][0]_i_48_n_0 ;
  wire \pht[54][0]_i_49_n_0 ;
  wire \pht[54][0]_i_4_n_0 ;
  wire \pht[54][0]_i_50_n_0 ;
  wire \pht[54][0]_i_51_n_0 ;
  wire \pht[54][0]_i_52_n_0 ;
  wire \pht[54][0]_i_53_n_0 ;
  wire \pht[54][0]_i_54_n_0 ;
  wire \pht[54][0]_i_55_n_0 ;
  wire \pht[54][0]_i_56_n_0 ;
  wire \pht[54][0]_i_57_n_0 ;
  wire \pht[54][0]_i_58_n_0 ;
  wire \pht[54][0]_i_59_n_0 ;
  wire \pht[54][0]_i_5_n_0 ;
  wire \pht[54][0]_i_60_n_0 ;
  wire \pht[54][0]_i_61_n_0 ;
  wire \pht[54][0]_i_62_n_0 ;
  wire \pht[54][0]_i_63_n_0 ;
  wire \pht[54][0]_i_64_n_0 ;
  wire \pht[54][0]_i_65_n_0 ;
  wire \pht[54][0]_i_66_n_0 ;
  wire \pht[54][0]_i_67_n_0 ;
  wire \pht[54][0]_i_68_n_0 ;
  wire \pht[54][0]_i_69_n_0 ;
  wire \pht[54][0]_i_6_n_0 ;
  wire \pht[54][0]_i_70_n_0 ;
  wire \pht[54][0]_i_71_n_0 ;
  wire \pht[54][0]_i_72_n_0 ;
  wire \pht[54][0]_i_7_n_0 ;
  wire \pht[54][0]_i_8_n_0 ;
  wire \pht[54][0]_i_9_n_0 ;
  wire \pht[54][1]_i_1_n_0 ;
  wire \pht[54][1]_i_2_n_0 ;
  wire \pht[55][0]_i_1_n_0 ;
  wire \pht[55][1]_i_1_n_0 ;
  wire \pht[56][1]_i_1_n_0 ;
  wire \pht[57][0]_i_1_n_0 ;
  wire \pht[57][1]_i_1_n_0 ;
  wire \pht[58][0]_i_1_n_0 ;
  wire \pht[58][0]_i_2_n_0 ;
  wire \pht[58][1]_i_1_n_0 ;
  wire \pht[59][1]_i_1_n_0 ;
  wire \pht[5][0]_i_1_n_0 ;
  wire \pht[5][1]_i_1_n_0 ;
  wire \pht[60][0]_i_1_n_0 ;
  wire \pht[60][1]_i_1_n_0 ;
  wire \pht[61][1]_i_1_n_0 ;
  wire \pht[62][0]_i_1_n_0 ;
  wire \pht[62][1]_i_1_n_0 ;
  wire \pht[63][0]_i_1_n_0 ;
  wire \pht[63][1]_i_1_n_0 ;
  wire \pht[63][1]_i_2_n_0 ;
  wire \pht[63][1]_i_3_n_0 ;
  wire \pht[64][1]_i_1_n_0 ;
  wire \pht[65][1]_i_1_n_0 ;
  wire \pht[65][1]_i_2_n_0 ;
  wire \pht[65][1]_i_3_n_0 ;
  wire \pht[66][1]_i_1_n_0 ;
  wire \pht[67][1]_i_1_n_0 ;
  wire \pht[67][1]_i_2_n_0 ;
  wire \pht[67][1]_i_3_n_0 ;
  wire \pht[68][1]_i_1_n_0 ;
  wire \pht[68][1]_i_2_n_0 ;
  wire \pht[68][1]_i_3_n_0 ;
  wire \pht[69][1]_i_1_n_0 ;
  wire \pht[6][1]_i_1_n_0 ;
  wire \pht[70][0]_i_1_n_0 ;
  wire \pht[70][1]_i_1_n_0 ;
  wire \pht[71][1]_i_1_n_0 ;
  wire \pht[72][1]_i_1_n_0 ;
  wire \pht[73][1]_i_1_n_0 ;
  wire \pht[74][1]_i_1_n_0 ;
  wire \pht[75][1]_i_1_n_0 ;
  wire \pht[76][1]_i_1_n_0 ;
  wire \pht[77][1]_i_1_n_0 ;
  wire \pht[78][1]_i_1_n_0 ;
  wire \pht[79][1]_i_1_n_0 ;
  wire \pht[79][1]_i_2_n_0 ;
  wire \pht[79][1]_i_3_n_0 ;
  wire \pht[79][1]_i_4_n_0 ;
  wire \pht[7][1]_i_1_n_0 ;
  wire \pht[80][1]_i_1_n_0 ;
  wire \pht[81][1]_i_1_n_0 ;
  wire \pht[82][1]_i_1_n_0 ;
  wire \pht[83][1]_i_1_n_0 ;
  wire \pht[84][1]_i_1_n_0 ;
  wire \pht[84][1]_i_2_n_0 ;
  wire \pht[84][1]_i_3_n_0 ;
  wire \pht[85][1]_i_1_n_0 ;
  wire \pht[85][1]_i_2_n_0 ;
  wire \pht[86][1]_i_1_n_0 ;
  wire \pht[86][1]_i_2_n_0 ;
  wire \pht[87][1]_i_1_n_0 ;
  wire \pht[87][1]_i_2_n_0 ;
  wire \pht[87][1]_i_3_n_0 ;
  wire \pht[88][1]_i_1_n_0 ;
  wire \pht[89][1]_i_1_n_0 ;
  wire \pht[8][1]_i_1_n_0 ;
  wire \pht[90][1]_i_1_n_0 ;
  wire \pht[91][1]_i_1_n_0 ;
  wire \pht[92][1]_i_1_n_0 ;
  wire \pht[93][0]_i_1_n_0 ;
  wire \pht[93][1]_i_1_n_0 ;
  wire \pht[94][0]_i_1_n_0 ;
  wire \pht[94][1]_i_1_n_0 ;
  wire \pht[95][1]_i_1_n_0 ;
  wire \pht[95][1]_i_2_n_0 ;
  wire \pht[95][1]_i_3_n_0 ;
  wire \pht[95][1]_i_4_n_0 ;
  wire \pht[96][1]_i_1_n_0 ;
  wire \pht[97][1]_i_1_n_0 ;
  wire \pht[97][1]_i_2_n_0 ;
  wire \pht[98][0]_i_1_n_0 ;
  wire \pht[98][1]_i_1_n_0 ;
  wire \pht[98][1]_i_2_n_0 ;
  wire \pht[98][1]_i_3_n_0 ;
  wire \pht[99][1]_i_1_n_0 ;
  wire \pht[9][1]_i_1_n_0 ;
  wire [1:0]\pht_reg[0] ;
  wire [1:0]\pht_reg[100] ;
  wire [1:0]\pht_reg[101] ;
  wire [1:0]\pht_reg[102] ;
  wire [1:0]\pht_reg[103] ;
  wire [1:0]\pht_reg[104] ;
  wire [1:0]\pht_reg[105] ;
  wire [1:0]\pht_reg[106] ;
  wire [1:0]\pht_reg[107] ;
  wire [1:0]\pht_reg[108] ;
  wire [1:0]\pht_reg[109] ;
  wire [1:0]\pht_reg[10] ;
  wire [1:0]\pht_reg[110] ;
  wire [1:0]\pht_reg[111] ;
  wire [1:0]\pht_reg[112] ;
  wire [1:0]\pht_reg[113] ;
  wire [1:0]\pht_reg[114] ;
  wire [1:0]\pht_reg[115] ;
  wire [1:0]\pht_reg[116] ;
  wire [1:0]\pht_reg[117] ;
  wire [1:0]\pht_reg[118] ;
  wire [1:0]\pht_reg[119] ;
  wire [1:0]\pht_reg[11] ;
  wire [1:0]\pht_reg[120] ;
  wire [1:0]\pht_reg[121] ;
  wire [1:0]\pht_reg[122] ;
  wire [1:0]\pht_reg[123] ;
  wire [1:0]\pht_reg[124] ;
  wire [1:0]\pht_reg[125] ;
  wire [1:0]\pht_reg[126] ;
  wire [1:0]\pht_reg[127] ;
  wire [1:0]\pht_reg[12] ;
  wire [1:0]\pht_reg[13] ;
  wire [1:0]\pht_reg[14] ;
  wire [1:0]\pht_reg[15] ;
  wire [1:0]\pht_reg[16] ;
  wire [1:0]\pht_reg[17] ;
  wire [1:0]\pht_reg[18] ;
  wire [1:0]\pht_reg[19] ;
  wire [1:0]\pht_reg[1] ;
  wire [1:0]\pht_reg[20] ;
  wire [1:0]\pht_reg[21] ;
  wire [1:0]\pht_reg[22] ;
  wire [1:0]\pht_reg[23] ;
  wire [1:0]\pht_reg[24] ;
  wire [1:0]\pht_reg[25] ;
  wire [1:0]\pht_reg[26] ;
  wire [1:0]\pht_reg[27] ;
  wire [1:0]\pht_reg[28] ;
  wire [1:0]\pht_reg[29] ;
  wire [1:0]\pht_reg[2] ;
  wire [1:0]\pht_reg[30] ;
  wire [1:0]\pht_reg[31] ;
  wire [1:0]\pht_reg[32] ;
  wire [1:0]\pht_reg[33] ;
  wire [1:0]\pht_reg[34] ;
  wire [1:0]\pht_reg[35] ;
  wire [1:0]\pht_reg[36] ;
  wire [1:0]\pht_reg[37] ;
  wire [1:0]\pht_reg[38] ;
  wire [1:0]\pht_reg[39] ;
  wire [1:0]\pht_reg[3] ;
  wire [1:0]\pht_reg[40] ;
  wire [1:0]\pht_reg[41] ;
  wire [1:0]\pht_reg[42] ;
  wire [1:0]\pht_reg[43] ;
  wire [1:0]\pht_reg[44] ;
  wire [1:0]\pht_reg[45] ;
  wire [1:0]\pht_reg[46] ;
  wire [1:0]\pht_reg[47] ;
  wire [1:0]\pht_reg[48] ;
  wire [1:0]\pht_reg[49] ;
  wire [1:0]\pht_reg[4] ;
  wire [1:0]\pht_reg[50] ;
  wire [1:0]\pht_reg[51] ;
  wire [1:0]\pht_reg[52] ;
  wire [1:0]\pht_reg[53] ;
  wire [1:0]\pht_reg[54] ;
  wire [1:0]\pht_reg[55] ;
  wire [1:0]\pht_reg[56] ;
  wire [1:0]\pht_reg[57] ;
  wire [1:0]\pht_reg[58] ;
  wire [1:0]\pht_reg[59] ;
  wire [1:0]\pht_reg[5] ;
  wire [1:0]\pht_reg[60] ;
  wire [1:0]\pht_reg[61] ;
  wire [1:0]\pht_reg[62] ;
  wire [1:0]\pht_reg[63] ;
  wire [1:0]\pht_reg[64] ;
  wire [1:0]\pht_reg[65] ;
  wire [1:0]\pht_reg[66] ;
  wire [1:0]\pht_reg[67] ;
  wire [1:0]\pht_reg[68] ;
  wire [1:0]\pht_reg[69] ;
  wire [1:0]\pht_reg[6] ;
  wire [1:0]\pht_reg[70] ;
  wire [1:0]\pht_reg[71] ;
  wire [1:0]\pht_reg[72] ;
  wire [1:0]\pht_reg[73] ;
  wire [1:0]\pht_reg[74] ;
  wire [1:0]\pht_reg[75] ;
  wire [1:0]\pht_reg[76] ;
  wire [1:0]\pht_reg[77] ;
  wire [1:0]\pht_reg[78] ;
  wire [1:0]\pht_reg[79] ;
  wire [1:0]\pht_reg[7] ;
  wire [1:0]\pht_reg[80] ;
  wire [1:0]\pht_reg[81] ;
  wire [1:0]\pht_reg[82] ;
  wire [1:0]\pht_reg[83] ;
  wire [1:0]\pht_reg[84] ;
  wire [1:0]\pht_reg[85] ;
  wire [1:0]\pht_reg[86] ;
  wire [1:0]\pht_reg[87] ;
  wire [1:0]\pht_reg[88] ;
  wire [1:0]\pht_reg[89] ;
  wire [1:0]\pht_reg[8] ;
  wire [1:0]\pht_reg[90] ;
  wire [1:0]\pht_reg[91] ;
  wire [1:0]\pht_reg[92] ;
  wire [1:0]\pht_reg[93] ;
  wire [1:0]\pht_reg[94] ;
  wire [1:0]\pht_reg[95] ;
  wire [1:0]\pht_reg[96] ;
  wire [1:0]\pht_reg[97] ;
  wire [1:0]\pht_reg[98] ;
  wire [1:0]\pht_reg[99] ;
  wire [1:0]\pht_reg[9] ;
  wire [6:0]predict_history;
  wire [6:0]predict_history_OBUF;
  wire \predict_history_r[0]_i_10_n_0 ;
  wire \predict_history_r[0]_i_11_n_0 ;
  wire \predict_history_r[0]_i_12_n_0 ;
  wire \predict_history_r[0]_i_13_n_0 ;
  wire \predict_history_r[0]_i_14_n_0 ;
  wire \predict_history_r[0]_i_15_n_0 ;
  wire \predict_history_r[0]_i_16_n_0 ;
  wire \predict_history_r[0]_i_17_n_0 ;
  wire \predict_history_r[0]_i_18_n_0 ;
  wire \predict_history_r[0]_i_1_n_0 ;
  wire \predict_history_r[0]_i_2_n_0 ;
  wire \predict_history_r[0]_i_3_n_0 ;
  wire \predict_history_r[0]_i_4_n_0 ;
  wire \predict_history_r[0]_i_5_n_0 ;
  wire \predict_history_r[0]_i_6_n_0 ;
  wire \predict_history_r[0]_i_7_n_0 ;
  wire \predict_history_r[0]_i_8_n_0 ;
  wire \predict_history_r[0]_i_9_n_0 ;
  wire \predict_history_r[1]_i_1_n_0 ;
  wire \predict_history_r[2]_i_1_n_0 ;
  wire \predict_history_r[3]_i_1_n_0 ;
  wire \predict_history_r[4]_i_1_n_0 ;
  wire \predict_history_r[5]_i_1_n_0 ;
  wire \predict_history_r[6]_i_1_n_0 ;
  wire \predict_history_r[6]_i_2_n_0 ;
  wire [6:0]predict_pc;
  wire [6:0]predict_pc_IBUF;
  wire predict_taken;
  wire predict_taken_OBUF;
  wire predict_taken_OBUF_inst_i_10_n_0;
  wire predict_taken_OBUF_inst_i_11_n_0;
  wire predict_taken_OBUF_inst_i_12_n_0;
  wire predict_taken_OBUF_inst_i_13_n_0;
  wire predict_taken_OBUF_inst_i_14_n_0;
  wire predict_taken_OBUF_inst_i_15_n_0;
  wire predict_taken_OBUF_inst_i_16_n_0;
  wire predict_taken_OBUF_inst_i_17_n_0;
  wire predict_taken_OBUF_inst_i_18_n_0;
  wire predict_taken_OBUF_inst_i_19_n_0;
  wire predict_taken_OBUF_inst_i_20_n_0;
  wire predict_taken_OBUF_inst_i_21_n_0;
  wire predict_taken_OBUF_inst_i_22_n_0;
  wire predict_taken_OBUF_inst_i_23_n_0;
  wire predict_taken_OBUF_inst_i_24_n_0;
  wire predict_taken_OBUF_inst_i_25_n_0;
  wire predict_taken_OBUF_inst_i_26_n_0;
  wire predict_taken_OBUF_inst_i_27_n_0;
  wire predict_taken_OBUF_inst_i_28_n_0;
  wire predict_taken_OBUF_inst_i_29_n_0;
  wire predict_taken_OBUF_inst_i_2_n_0;
  wire predict_taken_OBUF_inst_i_30_n_0;
  wire predict_taken_OBUF_inst_i_31_n_0;
  wire predict_taken_OBUF_inst_i_32_n_0;
  wire predict_taken_OBUF_inst_i_33_n_0;
  wire predict_taken_OBUF_inst_i_34_n_0;
  wire predict_taken_OBUF_inst_i_35_n_0;
  wire predict_taken_OBUF_inst_i_36_n_0;
  wire predict_taken_OBUF_inst_i_37_n_0;
  wire predict_taken_OBUF_inst_i_38_n_0;
  wire predict_taken_OBUF_inst_i_39_n_0;
  wire predict_taken_OBUF_inst_i_3_n_0;
  wire predict_taken_OBUF_inst_i_40_n_0;
  wire predict_taken_OBUF_inst_i_41_n_0;
  wire predict_taken_OBUF_inst_i_42_n_0;
  wire predict_taken_OBUF_inst_i_43_n_0;
  wire predict_taken_OBUF_inst_i_44_n_0;
  wire predict_taken_OBUF_inst_i_45_n_0;
  wire predict_taken_OBUF_inst_i_46_n_0;
  wire predict_taken_OBUF_inst_i_47_n_0;
  wire predict_taken_OBUF_inst_i_48_n_0;
  wire predict_taken_OBUF_inst_i_49_n_0;
  wire predict_taken_OBUF_inst_i_4_n_0;
  wire predict_taken_OBUF_inst_i_50_n_0;
  wire predict_taken_OBUF_inst_i_51_n_0;
  wire predict_taken_OBUF_inst_i_52_n_0;
  wire predict_taken_OBUF_inst_i_53_n_0;
  wire predict_taken_OBUF_inst_i_54_n_0;
  wire predict_taken_OBUF_inst_i_55_n_0;
  wire predict_taken_OBUF_inst_i_56_n_0;
  wire predict_taken_OBUF_inst_i_57_n_0;
  wire predict_taken_OBUF_inst_i_58_n_0;
  wire predict_taken_OBUF_inst_i_59_n_0;
  wire predict_taken_OBUF_inst_i_5_n_0;
  wire predict_taken_OBUF_inst_i_60_n_0;
  wire predict_taken_OBUF_inst_i_61_n_0;
  wire predict_taken_OBUF_inst_i_62_n_0;
  wire predict_taken_OBUF_inst_i_63_n_0;
  wire predict_taken_OBUF_inst_i_64_n_0;
  wire predict_taken_OBUF_inst_i_65_n_0;
  wire predict_taken_OBUF_inst_i_66_n_0;
  wire predict_taken_OBUF_inst_i_67_n_0;
  wire predict_taken_OBUF_inst_i_68_n_0;
  wire predict_taken_OBUF_inst_i_69_n_0;
  wire predict_taken_OBUF_inst_i_6_n_0;
  wire predict_taken_OBUF_inst_i_70_n_0;
  wire predict_taken_OBUF_inst_i_71_n_0;
  wire predict_taken_OBUF_inst_i_72_n_0;
  wire predict_taken_OBUF_inst_i_73_n_0;
  wire predict_taken_OBUF_inst_i_74_n_0;
  wire predict_taken_OBUF_inst_i_75_n_0;
  wire predict_taken_OBUF_inst_i_76_n_0;
  wire predict_taken_OBUF_inst_i_77_n_0;
  wire predict_taken_OBUF_inst_i_78_n_0;
  wire predict_taken_OBUF_inst_i_79_n_0;
  wire predict_taken_OBUF_inst_i_7_n_0;
  wire predict_taken_OBUF_inst_i_80_n_0;
  wire predict_taken_OBUF_inst_i_81_n_0;
  wire predict_taken_OBUF_inst_i_82_n_0;
  wire predict_taken_OBUF_inst_i_8_n_0;
  wire predict_taken_OBUF_inst_i_9_n_0;
  wire predict_valid;
  wire predict_valid_IBUF;
  wire [6:0]train_history;
  wire [6:0]train_history_IBUF;
  wire train_mispredicted;
  wire train_mispredicted_IBUF;
  wire [6:0]train_pc;
  wire [6:0]train_pc_IBUF;
  wire train_taken;
  wire train_taken_IBUF;
  wire train_valid;
  wire train_valid_IBUF;

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
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[0][1]_i_1 
       (.I0(\pht[112][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[0][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00020200)) 
    \pht[100][1]_i_1 
       (.I0(\pht[116][1]_i_4_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[100][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair22" *) 
  LUT4 #(
    .INIT(16'hD7FF)) 
    \pht[101][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[117][1]_i_4_n_0 ),
        .O(\pht[101][0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000001400000000)) 
    \pht[101][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[117][1]_i_3_n_0 ),
        .I4(\pht[111][1]_i_3_n_0 ),
        .I5(\pht[118][1]_i_3_n_0 ),
        .O(\pht[101][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[101][1]_i_2 
       (.I0(\pht[101][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[101][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000828200)) 
    \pht[101][1]_i_3 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(train_pc_IBUF[4]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[5]),
        .I4(train_history_IBUF[5]),
        .I5(\pht[117][1]_i_3_n_0 ),
        .O(\pht[101][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00020200)) 
    \pht[102][1]_i_1 
       (.I0(\pht[102][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[102][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT5 #(
    .INIT(32'h00000990)) 
    \pht[102][1]_i_2 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[118][1]_i_4_n_0 ),
        .O(\pht[102][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair21" *) 
  LUT4 #(
    .INIT(16'hDFFF)) 
    \pht[103][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(\pht[103][0]_i_2_n_0 ),
        .I2(\pht[127][1]_i_7_n_0 ),
        .I3(\pht[118][1]_i_3_n_0 ),
        .O(\pht[103][0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair27" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[103][0]_i_2 
       (.I0(train_pc_IBUF[1]),
        .I1(train_history_IBUF[1]),
        .I2(train_pc_IBUF[0]),
        .I3(train_history_IBUF[0]),
        .O(\pht[103][0]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00020200)) 
    \pht[103][1]_i_1 
       (.I0(\pht[119][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[103][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[104][1]_i_1 
       (.I0(\pht[120][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[104][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[105][1]_i_1 
       (.I0(\pht[121][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[105][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[106][1]_i_1 
       (.I0(\pht[122][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[106][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[107][1]_i_1 
       (.I0(\pht[123][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[107][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[108][1]_i_1 
       (.I0(\pht[124][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[108][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair24" *) 
  LUT4 #(
    .INIT(16'hFFBF)) 
    \pht[109][0]_i_1 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(\pht[127][0]_i_2_n_0 ),
        .I2(\pht[127][1]_i_7_n_0 ),
        .I3(\pht[110][0]_i_2_n_0 ),
        .O(\pht[109][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[109][1]_i_1 
       (.I0(\pht[125][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[109][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[10][1]_i_1 
       (.I0(\pht[122][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[10][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair23" *) 
  LUT4 #(
    .INIT(16'hFFBF)) 
    \pht[110][0]_i_1 
       (.I0(\pht[118][1]_i_4_n_0 ),
        .I1(\pht[127][0]_i_2_n_0 ),
        .I2(\pht[127][1]_i_7_n_0 ),
        .I3(\pht[110][0]_i_2_n_0 ),
        .O(\pht[110][0]_i_1_n_0 ));
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[110][0]_i_2 
       (.I0(train_pc_IBUF[2]),
        .I1(train_history_IBUF[2]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[3]),
        .O(\pht[110][0]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[110][1]_i_1 
       (.I0(\pht[126][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[110][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[111][1]_i_1 
       (.I0(\pht[127][1]_i_4_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[111][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00003400)) 
    \pht[111][1]_i_2 
       (.I0(\pht[127][1]_i_8_n_0 ),
        .I1(train_taken_IBUF),
        .I2(\pht[127][1]_i_9_n_0 ),
        .I3(train_valid_IBUF),
        .I4(\pht[111][1]_i_4_n_0 ),
        .O(\pht[111][1]_i_2_n_0 ));
  LUT4 #(
    .INIT(16'hF66F)) 
    \pht[111][1]_i_3 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[5]),
        .O(\pht[111][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'hFFFF9FF99FF9FFFF)) 
    \pht[111][1]_i_4 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(train_pc_IBUF[6]),
        .I5(train_history_IBUF[6]),
        .O(\pht[111][1]_i_4_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[112][1]_i_1 
       (.I0(\pht[112][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[112][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT5 #(
    .INIT(32'hBEFFFFBE)) 
    \pht[112][1]_i_2 
       (.I0(\pht[116][1]_i_3_n_0 ),
        .I1(train_history_IBUF[3]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .O(\pht[112][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[113][1]_i_1 
       (.I0(\pht[113][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[113][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT5 #(
    .INIT(32'hBEFFFFBE)) 
    \pht[113][1]_i_2 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(train_history_IBUF[3]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .O(\pht[113][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[114][1]_i_1 
       (.I0(\pht[114][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[114][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair16" *) 
  LUT5 #(
    .INIT(32'hBEFFFFBE)) 
    \pht[114][1]_i_2 
       (.I0(\pht[118][1]_i_4_n_0 ),
        .I1(train_history_IBUF[3]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .O(\pht[114][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[115][1]_i_1 
       (.I0(\pht[115][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[115][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair17" *) 
  LUT5 #(
    .INIT(32'hFFFF6FF6)) 
    \pht[115][1]_i_2 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .O(\pht[115][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000014000000)) 
    \pht[116][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[127][1]_i_5_n_0 ),
        .I4(\pht[118][1]_i_3_n_0 ),
        .I5(\pht[116][1]_i_3_n_0 ),
        .O(\pht[116][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[116][1]_i_2 
       (.I0(\pht[116][1]_i_4_n_0 ),
        .I1(\pht[126][1]_i_4_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[116][1]_i_2_n_0 ));
  LUT4 #(
    .INIT(16'h6FF6)) 
    \pht[116][1]_i_3 
       (.I0(train_pc_IBUF[1]),
        .I1(train_history_IBUF[1]),
        .I2(train_pc_IBUF[0]),
        .I3(train_history_IBUF[0]),
        .O(\pht[116][1]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT5 #(
    .INIT(32'h82000082)) 
    \pht[116][1]_i_4 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(train_history_IBUF[0]),
        .I2(train_pc_IBUF[0]),
        .I3(train_history_IBUF[1]),
        .I4(train_pc_IBUF[1]),
        .O(\pht[116][1]_i_4_n_0 ));
  LUT6 #(
    .INIT(64'h0010100000000000)) 
    \pht[117][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][1]_i_5_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .I5(\pht[118][1]_i_3_n_0 ),
        .O(\pht[117][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[117][1]_i_2 
       (.I0(\pht[117][1]_i_4_n_0 ),
        .I1(\pht[126][1]_i_4_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[117][1]_i_2_n_0 ));
  LUT4 #(
    .INIT(16'hF66F)) 
    \pht[117][1]_i_3 
       (.I0(train_pc_IBUF[1]),
        .I1(train_history_IBUF[1]),
        .I2(train_pc_IBUF[0]),
        .I3(train_history_IBUF[0]),
        .O(\pht[117][1]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT5 #(
    .INIT(32'h00000990)) 
    \pht[117][1]_i_4 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[117][1]_i_3_n_0 ),
        .O(\pht[117][1]_i_4_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair30" *) 
  LUT2 #(
    .INIT(4'h7)) 
    \pht[118][0]_i_1 
       (.I0(\pht[127][1]_i_7_n_0 ),
        .I1(\pht[127][0]_i_2_n_0 ),
        .O(\pht[118][0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000014000000)) 
    \pht[118][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[127][1]_i_5_n_0 ),
        .I4(\pht[118][1]_i_3_n_0 ),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[118][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[118][1]_i_2 
       (.I0(\pht[118][1]_i_5_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[118][1]_i_2_n_0 ));
  LUT4 #(
    .INIT(16'h6006)) 
    \pht[118][1]_i_3 
       (.I0(train_pc_IBUF[2]),
        .I1(train_history_IBUF[2]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[3]),
        .O(\pht[118][1]_i_3_n_0 ));
  LUT4 #(
    .INIT(16'hF66F)) 
    \pht[118][1]_i_4 
       (.I0(train_pc_IBUF[0]),
        .I1(train_history_IBUF[0]),
        .I2(train_pc_IBUF[1]),
        .I3(train_history_IBUF[1]),
        .O(\pht[118][1]_i_4_n_0 ));
  LUT6 #(
    .INIT(64'h0000044004400000)) 
    \pht[118][1]_i_5 
       (.I0(\pht[118][1]_i_4_n_0 ),
        .I1(\pht[118][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[4]),
        .I3(train_history_IBUF[4]),
        .I4(train_pc_IBUF[5]),
        .I5(train_history_IBUF[5]),
        .O(\pht[118][1]_i_5_n_0 ));
  LUT5 #(
    .INIT(32'h00000880)) 
    \pht[119][1]_i_1 
       (.I0(\pht[119][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[119][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h000000000A200000)) 
    \pht[119][1]_i_2 
       (.I0(\pht[127][1]_i_7_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .I5(\pht[119][1]_i_4_n_0 ),
        .O(\pht[119][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT5 #(
    .INIT(32'h00282800)) 
    \pht[119][1]_i_3 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(train_history_IBUF[0]),
        .I2(train_pc_IBUF[0]),
        .I3(train_history_IBUF[1]),
        .I4(train_pc_IBUF[1]),
        .O(\pht[119][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'hF99FFFFF)) 
    \pht[119][1]_i_4 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(\pht[119][1]_i_3_n_0 ),
        .O(\pht[119][1]_i_4_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[11][1]_i_1 
       (.I0(\pht[123][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[11][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[120][1]_i_1 
       (.I0(\pht[120][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[120][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT5 #(
    .INIT(32'hEBFFFFEB)) 
    \pht[120][1]_i_2 
       (.I0(\pht[116][1]_i_3_n_0 ),
        .I1(train_history_IBUF[3]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .O(\pht[120][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[121][1]_i_1 
       (.I0(\pht[121][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[121][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT5 #(
    .INIT(32'hEBFFFFEB)) 
    \pht[121][1]_i_2 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(train_history_IBUF[3]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .O(\pht[121][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[122][1]_i_1 
       (.I0(\pht[122][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[122][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair16" *) 
  LUT5 #(
    .INIT(32'hEBFFFFEB)) 
    \pht[122][1]_i_2 
       (.I0(\pht[118][1]_i_4_n_0 ),
        .I1(train_history_IBUF[3]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .O(\pht[122][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[123][1]_i_1 
       (.I0(\pht[123][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[123][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair17" *) 
  LUT5 #(
    .INIT(32'hFFFF9FF9)) 
    \pht[123][1]_i_2 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .O(\pht[123][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[124][1]_i_1 
       (.I0(\pht[124][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[124][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT5 #(
    .INIT(32'hFFFFF99F)) 
    \pht[124][1]_i_2 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[116][1]_i_3_n_0 ),
        .O(\pht[124][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[125][1]_i_1 
       (.I0(\pht[125][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[125][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT5 #(
    .INIT(32'hFFFFF99F)) 
    \pht[125][1]_i_2 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[117][1]_i_3_n_0 ),
        .O(\pht[125][1]_i_2_n_0 ));
  LUT3 #(
    .INIT(8'hD7)) 
    \pht[126][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .O(\pht[126][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[126][1]_i_1 
       (.I0(\pht[126][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[126][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h0A200000)) 
    \pht[126][1]_i_2 
       (.I0(\pht[126][1]_i_4_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .O(\pht[126][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT5 #(
    .INIT(32'hFFFFF99F)) 
    \pht[126][1]_i_3 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[118][1]_i_4_n_0 ),
        .O(\pht[126][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0000066006600000)) 
    \pht[126][1]_i_4 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(train_pc_IBUF[6]),
        .I5(train_history_IBUF[6]),
        .O(\pht[126][1]_i_4_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair28" *) 
  LUT3 #(
    .INIT(8'hD7)) 
    \pht[127][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .O(\pht[127][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[127][0]_i_10 
       (.I0(\pht_reg[18] [0]),
        .I1(\pht[114][1]_i_2_n_0 ),
        .I2(\pht_reg[24] [0]),
        .I3(\pht[120][1]_i_2_n_0 ),
        .I4(\pht[127][0]_i_35_n_0 ),
        .O(\pht[127][0]_i_10_n_0 ));
  LUT5 #(
    .INIT(32'hAEAEFFAE)) 
    \pht[127][0]_i_11 
       (.I0(\pht[127][0]_i_36_n_0 ),
        .I1(\pht_reg[16] [0]),
        .I2(\pht[112][1]_i_2_n_0 ),
        .I3(\pht_reg[30] [0]),
        .I4(\pht[126][1]_i_3_n_0 ),
        .O(\pht[127][0]_i_11_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[127][0]_i_12 
       (.I0(\pht_reg[19] [0]),
        .I1(\pht[115][1]_i_2_n_0 ),
        .I2(\pht_reg[26] [0]),
        .I3(\pht[122][1]_i_2_n_0 ),
        .I4(\pht[127][0]_i_37_n_0 ),
        .O(\pht[127][0]_i_12_n_0 ));
  LUT6 #(
    .INIT(64'h0F5500330F55FF33)) 
    \pht[127][0]_i_13 
       (.I0(\pht_reg[118] [0]),
        .I1(\pht_reg[116] [0]),
        .I2(\pht_reg[119] [0]),
        .I3(\pht[127][0]_i_33_n_0 ),
        .I4(\pht[127][0]_i_34_n_0 ),
        .I5(\pht_reg[117] [0]),
        .O(\pht[127][0]_i_13_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[127][0]_i_14 
       (.I0(\pht_reg[114] [0]),
        .I1(\pht[114][1]_i_2_n_0 ),
        .I2(\pht_reg[120] [0]),
        .I3(\pht[120][1]_i_2_n_0 ),
        .I4(\pht[127][0]_i_38_n_0 ),
        .O(\pht[127][0]_i_14_n_0 ));
  LUT5 #(
    .INIT(32'hA2A200A2)) 
    \pht[127][0]_i_15 
       (.I0(\pht[127][0]_i_39_n_0 ),
        .I1(\pht_reg[112] [0]),
        .I2(\pht[112][1]_i_2_n_0 ),
        .I3(\pht_reg[126] [0]),
        .I4(\pht[126][1]_i_3_n_0 ),
        .O(\pht[127][0]_i_15_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[127][0]_i_16 
       (.I0(\pht_reg[115] [0]),
        .I1(\pht[115][1]_i_2_n_0 ),
        .I2(\pht_reg[122] [0]),
        .I3(\pht[122][1]_i_2_n_0 ),
        .I4(\pht[127][0]_i_40_n_0 ),
        .O(\pht[127][0]_i_16_n_0 ));
  LUT6 #(
    .INIT(64'h0F5500330F55FF33)) 
    \pht[127][0]_i_17 
       (.I0(\pht_reg[86] [0]),
        .I1(\pht_reg[84] [0]),
        .I2(\pht_reg[87] [0]),
        .I3(\pht[127][0]_i_33_n_0 ),
        .I4(\pht[127][0]_i_34_n_0 ),
        .I5(\pht_reg[85] [0]),
        .O(\pht[127][0]_i_17_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[127][0]_i_18 
       (.I0(\pht_reg[82] [0]),
        .I1(\pht[114][1]_i_2_n_0 ),
        .I2(\pht_reg[88] [0]),
        .I3(\pht[120][1]_i_2_n_0 ),
        .I4(\pht[127][0]_i_41_n_0 ),
        .O(\pht[127][0]_i_18_n_0 ));
  LUT5 #(
    .INIT(32'hAEAEFFAE)) 
    \pht[127][0]_i_19 
       (.I0(\pht[127][0]_i_42_n_0 ),
        .I1(\pht_reg[80] [0]),
        .I2(\pht[112][1]_i_2_n_0 ),
        .I3(\pht_reg[94] [0]),
        .I4(\pht[126][1]_i_3_n_0 ),
        .O(\pht[127][0]_i_19_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFFFFEFFFFFFFF)) 
    \pht[127][0]_i_2 
       (.I0(\pht[127][0]_i_3_n_0 ),
        .I1(\pht[127][0]_i_4_n_0 ),
        .I2(\pht[127][0]_i_5_n_0 ),
        .I3(\pht[127][0]_i_6_n_0 ),
        .I4(\pht[127][0]_i_7_n_0 ),
        .I5(\pht[127][0]_i_8_n_0 ),
        .O(\pht[127][0]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[127][0]_i_20 
       (.I0(\pht_reg[83] [0]),
        .I1(\pht[115][1]_i_2_n_0 ),
        .I2(\pht_reg[90] [0]),
        .I3(\pht[122][1]_i_2_n_0 ),
        .I4(\pht[127][0]_i_43_n_0 ),
        .O(\pht[127][0]_i_20_n_0 ));
  LUT6 #(
    .INIT(64'h0F5500330F55FF33)) 
    \pht[127][0]_i_21 
       (.I0(\pht_reg[54] [0]),
        .I1(\pht_reg[52] [0]),
        .I2(\pht_reg[55] [0]),
        .I3(\pht[127][0]_i_33_n_0 ),
        .I4(\pht[127][0]_i_34_n_0 ),
        .I5(\pht_reg[53] [0]),
        .O(\pht[127][0]_i_21_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[127][0]_i_22 
       (.I0(\pht_reg[50] [0]),
        .I1(\pht[114][1]_i_2_n_0 ),
        .I2(\pht_reg[56] [0]),
        .I3(\pht[120][1]_i_2_n_0 ),
        .I4(\pht[127][0]_i_44_n_0 ),
        .O(\pht[127][0]_i_22_n_0 ));
  LUT5 #(
    .INIT(32'hAEAEFFAE)) 
    \pht[127][0]_i_23 
       (.I0(\pht[127][0]_i_45_n_0 ),
        .I1(\pht_reg[48] [0]),
        .I2(\pht[112][1]_i_2_n_0 ),
        .I3(\pht_reg[62] [0]),
        .I4(\pht[126][1]_i_3_n_0 ),
        .O(\pht[127][0]_i_23_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[127][0]_i_24 
       (.I0(\pht_reg[51] [0]),
        .I1(\pht[115][1]_i_2_n_0 ),
        .I2(\pht_reg[58] [0]),
        .I3(\pht[122][1]_i_2_n_0 ),
        .I4(\pht[127][0]_i_46_n_0 ),
        .O(\pht[127][0]_i_24_n_0 ));
  LUT6 #(
    .INIT(64'hFFFEFFFFFFFEFFFE)) 
    \pht[127][0]_i_25 
       (.I0(\pht[127][0]_i_47_n_0 ),
        .I1(\pht[127][0]_i_48_n_0 ),
        .I2(\pht[127][0]_i_49_n_0 ),
        .I3(\pht[127][0]_i_50_n_0 ),
        .I4(\pht[115][1]_i_2_n_0 ),
        .I5(\pht_reg[35] [0]),
        .O(\pht[127][0]_i_25_n_0 ));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    \pht[127][0]_i_26 
       (.I0(\pht[127][0]_i_51_n_0 ),
        .I1(\pht[127][0]_i_52_n_0 ),
        .I2(\pht[120][1]_i_2_n_0 ),
        .I3(\pht_reg[40] [0]),
        .I4(\pht[114][1]_i_2_n_0 ),
        .I5(\pht_reg[34] [0]),
        .O(\pht[127][0]_i_26_n_0 ));
  LUT6 #(
    .INIT(64'hFFFEFFFFFFFEFFFE)) 
    \pht[127][0]_i_27 
       (.I0(\pht[127][0]_i_53_n_0 ),
        .I1(\pht[127][0]_i_54_n_0 ),
        .I2(\pht[127][0]_i_55_n_0 ),
        .I3(\pht[127][0]_i_56_n_0 ),
        .I4(\pht[115][1]_i_2_n_0 ),
        .I5(\pht_reg[99] [0]),
        .O(\pht[127][0]_i_27_n_0 ));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    \pht[127][0]_i_28 
       (.I0(\pht[127][0]_i_57_n_0 ),
        .I1(\pht[127][0]_i_58_n_0 ),
        .I2(\pht[120][1]_i_2_n_0 ),
        .I3(\pht_reg[104] [0]),
        .I4(\pht[114][1]_i_2_n_0 ),
        .I5(\pht_reg[98] [0]),
        .O(\pht[127][0]_i_28_n_0 ));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    \pht[127][0]_i_29 
       (.I0(\pht[127][0]_i_59_n_0 ),
        .I1(\pht[127][0]_i_60_n_0 ),
        .I2(\pht[120][1]_i_2_n_0 ),
        .I3(\pht_reg[8] [0]),
        .I4(\pht[114][1]_i_2_n_0 ),
        .I5(\pht_reg[2] [0]),
        .O(\pht[127][0]_i_29_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFFFF400000000)) 
    \pht[127][0]_i_3 
       (.I0(\pht[127][0]_i_9_n_0 ),
        .I1(\pht[118][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_10_n_0 ),
        .I3(\pht[127][0]_i_11_n_0 ),
        .I4(\pht[127][0]_i_12_n_0 ),
        .I5(\pht[31][1]_i_3_n_0 ),
        .O(\pht[127][0]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0004000000040004)) 
    \pht[127][0]_i_30 
       (.I0(\pht[127][0]_i_61_n_0 ),
        .I1(\pht[127][0]_i_62_n_0 ),
        .I2(\pht[127][0]_i_63_n_0 ),
        .I3(\pht[127][0]_i_64_n_0 ),
        .I4(\pht[115][1]_i_2_n_0 ),
        .I5(\pht_reg[3] [0]),
        .O(\pht[127][0]_i_30_n_0 ));
  LUT6 #(
    .INIT(64'hFFFEFFFFFFFEFFFE)) 
    \pht[127][0]_i_31 
       (.I0(\pht[127][0]_i_65_n_0 ),
        .I1(\pht[127][0]_i_66_n_0 ),
        .I2(\pht[127][0]_i_67_n_0 ),
        .I3(\pht[127][0]_i_68_n_0 ),
        .I4(\pht[115][1]_i_2_n_0 ),
        .I5(\pht_reg[67] [0]),
        .O(\pht[127][0]_i_31_n_0 ));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    \pht[127][0]_i_32 
       (.I0(\pht[127][0]_i_69_n_0 ),
        .I1(\pht[127][0]_i_70_n_0 ),
        .I2(\pht[120][1]_i_2_n_0 ),
        .I3(\pht_reg[72] [0]),
        .I4(\pht[114][1]_i_2_n_0 ),
        .I5(\pht_reg[66] [0]),
        .O(\pht[127][0]_i_32_n_0 ));
  LUT2 #(
    .INIT(4'h6)) 
    \pht[127][0]_i_33 
       (.I0(train_history_IBUF[0]),
        .I1(train_pc_IBUF[0]),
        .O(\pht[127][0]_i_33_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair27" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \pht[127][0]_i_34 
       (.I0(train_history_IBUF[1]),
        .I1(train_pc_IBUF[1]),
        .O(\pht[127][0]_i_34_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[127][0]_i_35 
       (.I0(\pht_reg[27] [0]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[31] [0]),
        .O(\pht[127][0]_i_35_n_0 ));
  LUT5 #(
    .INIT(32'h040F0404)) 
    \pht[127][0]_i_36 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(\pht_reg[29] [0]),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[28] [0]),
        .O(\pht[127][0]_i_36_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[127][0]_i_37 
       (.I0(\pht_reg[17] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[25] [0]),
        .O(\pht[127][0]_i_37_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[127][0]_i_38 
       (.I0(\pht_reg[123] [0]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[127] [0]),
        .O(\pht[127][0]_i_38_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[127][0]_i_39 
       (.I0(\pht_reg[125] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[124] [0]),
        .O(\pht[127][0]_i_39_n_0 ));
  LUT6 #(
    .INIT(64'hAAAAAAAAAA20AAAA)) 
    \pht[127][0]_i_4 
       (.I0(\pht[126][1]_i_4_n_0 ),
        .I1(\pht[127][0]_i_13_n_0 ),
        .I2(\pht[118][1]_i_3_n_0 ),
        .I3(\pht[127][0]_i_14_n_0 ),
        .I4(\pht[127][0]_i_15_n_0 ),
        .I5(\pht[127][0]_i_16_n_0 ),
        .O(\pht[127][0]_i_4_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[127][0]_i_40 
       (.I0(\pht_reg[113] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[121] [0]),
        .O(\pht[127][0]_i_40_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[127][0]_i_41 
       (.I0(\pht_reg[91] [0]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[95] [0]),
        .O(\pht[127][0]_i_41_n_0 ));
  LUT5 #(
    .INIT(32'h040F0404)) 
    \pht[127][0]_i_42 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(\pht_reg[93] [0]),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[92] [0]),
        .O(\pht[127][0]_i_42_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[127][0]_i_43 
       (.I0(\pht_reg[81] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[89] [0]),
        .O(\pht[127][0]_i_43_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[127][0]_i_44 
       (.I0(\pht_reg[59] [0]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[63] [0]),
        .O(\pht[127][0]_i_44_n_0 ));
  LUT5 #(
    .INIT(32'h040F0404)) 
    \pht[127][0]_i_45 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(\pht_reg[61] [0]),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[60] [0]),
        .O(\pht[127][0]_i_45_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[127][0]_i_46 
       (.I0(\pht_reg[49] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[57] [0]),
        .O(\pht[127][0]_i_46_n_0 ));
  LUT6 #(
    .INIT(64'h101010FF10101010)) 
    \pht[127][0]_i_47 
       (.I0(\pht[110][0]_i_2_n_0 ),
        .I1(\pht[118][1]_i_4_n_0 ),
        .I2(\pht_reg[46] [0]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[98][1]_i_3_n_0 ),
        .I5(\pht_reg[32] [0]),
        .O(\pht[127][0]_i_47_n_0 ));
  LUT5 #(
    .INIT(32'h040F0404)) 
    \pht[127][0]_i_48 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(\pht_reg[45] [0]),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[44] [0]),
        .O(\pht[127][0]_i_48_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[127][0]_i_49 
       (.I0(\pht_reg[33] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[41] [0]),
        .O(\pht[127][0]_i_49_n_0 ));
  LUT6 #(
    .INIT(64'hAAAAAAAAAAAAAA20)) 
    \pht[127][0]_i_5 
       (.I0(\pht[95][1]_i_4_n_0 ),
        .I1(\pht[127][0]_i_17_n_0 ),
        .I2(\pht[118][1]_i_3_n_0 ),
        .I3(\pht[127][0]_i_18_n_0 ),
        .I4(\pht[127][0]_i_19_n_0 ),
        .I5(\pht[127][0]_i_20_n_0 ),
        .O(\pht[127][0]_i_5_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000828200)) 
    \pht[127][0]_i_50 
       (.I0(\pht_reg[42] [0]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[3]),
        .I4(train_history_IBUF[3]),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[127][0]_i_50_n_0 ));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    \pht[127][0]_i_51 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(\pht[127][0]_i_72_n_0 ),
        .I2(\pht_reg[36] [0]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_4_n_0 ),
        .I5(\pht_reg[38] [0]),
        .O(\pht[127][0]_i_51_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[127][0]_i_52 
       (.I0(\pht_reg[43] [0]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[47] [0]),
        .O(\pht[127][0]_i_52_n_0 ));
  LUT6 #(
    .INIT(64'h101010FF10101010)) 
    \pht[127][0]_i_53 
       (.I0(\pht[110][0]_i_2_n_0 ),
        .I1(\pht[118][1]_i_4_n_0 ),
        .I2(\pht_reg[110] [0]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[98][1]_i_3_n_0 ),
        .I5(\pht_reg[96] [0]),
        .O(\pht[127][0]_i_53_n_0 ));
  LUT5 #(
    .INIT(32'h040F0404)) 
    \pht[127][0]_i_54 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(\pht_reg[109] [0]),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[108] [0]),
        .O(\pht[127][0]_i_54_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[127][0]_i_55 
       (.I0(\pht_reg[97] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[105] [0]),
        .O(\pht[127][0]_i_55_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000828200)) 
    \pht[127][0]_i_56 
       (.I0(\pht_reg[106] [0]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[3]),
        .I4(train_history_IBUF[3]),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[127][0]_i_56_n_0 ));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    \pht[127][0]_i_57 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(\pht[127][0]_i_73_n_0 ),
        .I2(\pht_reg[100] [0]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_4_n_0 ),
        .I5(\pht_reg[102] [0]),
        .O(\pht[127][0]_i_57_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[127][0]_i_58 
       (.I0(\pht_reg[107] [0]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[111] [0]),
        .O(\pht[127][0]_i_58_n_0 ));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    \pht[127][0]_i_59 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(\pht[127][0]_i_74_n_0 ),
        .I2(\pht_reg[4] [0]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_4_n_0 ),
        .I5(\pht_reg[6] [0]),
        .O(\pht[127][0]_i_59_n_0 ));
  LUT6 #(
    .INIT(64'hAAAAAAAAAAAAAA20)) 
    \pht[127][0]_i_6 
       (.I0(\pht[63][1]_i_3_n_0 ),
        .I1(\pht[127][0]_i_21_n_0 ),
        .I2(\pht[118][1]_i_3_n_0 ),
        .I3(\pht[127][0]_i_22_n_0 ),
        .I4(\pht[127][0]_i_23_n_0 ),
        .I5(\pht[127][0]_i_24_n_0 ),
        .O(\pht[127][0]_i_6_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[127][0]_i_60 
       (.I0(\pht_reg[11] [0]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[15] [0]),
        .O(\pht[127][0]_i_60_n_0 ));
  LUT6 #(
    .INIT(64'h101010FF10101010)) 
    \pht[127][0]_i_61 
       (.I0(\pht[110][0]_i_2_n_0 ),
        .I1(\pht[118][1]_i_4_n_0 ),
        .I2(\pht_reg[14] [0]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[98][1]_i_3_n_0 ),
        .I5(\pht_reg[0] [0]),
        .O(\pht[127][0]_i_61_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[127][0]_i_62 
       (.I0(\pht_reg[13] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[12] [0]),
        .O(\pht[127][0]_i_62_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[127][0]_i_63 
       (.I0(\pht_reg[1] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[9] [0]),
        .O(\pht[127][0]_i_63_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000828200)) 
    \pht[127][0]_i_64 
       (.I0(\pht_reg[10] [0]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[3]),
        .I4(train_history_IBUF[3]),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[127][0]_i_64_n_0 ));
  LUT6 #(
    .INIT(64'h101010FF10101010)) 
    \pht[127][0]_i_65 
       (.I0(\pht[110][0]_i_2_n_0 ),
        .I1(\pht[118][1]_i_4_n_0 ),
        .I2(\pht_reg[78] [0]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[98][1]_i_3_n_0 ),
        .I5(\pht_reg[64] [0]),
        .O(\pht[127][0]_i_65_n_0 ));
  LUT5 #(
    .INIT(32'h040F0404)) 
    \pht[127][0]_i_66 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(\pht_reg[77] [0]),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[76] [0]),
        .O(\pht[127][0]_i_66_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[127][0]_i_67 
       (.I0(\pht_reg[65] [0]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[73] [0]),
        .O(\pht[127][0]_i_67_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000828200)) 
    \pht[127][0]_i_68 
       (.I0(\pht_reg[74] [0]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[3]),
        .I4(train_history_IBUF[3]),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[127][0]_i_68_n_0 ));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    \pht[127][0]_i_69 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(\pht[127][0]_i_75_n_0 ),
        .I2(\pht_reg[68] [0]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_4_n_0 ),
        .I5(\pht_reg[70] [0]),
        .O(\pht[127][0]_i_69_n_0 ));
  LUT6 #(
    .INIT(64'h0F0E0F0E0F0E000E)) 
    \pht[127][0]_i_7 
       (.I0(\pht[127][0]_i_25_n_0 ),
        .I1(\pht[127][0]_i_26_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(\pht[127][1]_i_7_n_0 ),
        .I4(\pht[127][0]_i_27_n_0 ),
        .I5(\pht[127][0]_i_28_n_0 ),
        .O(\pht[127][0]_i_7_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[127][0]_i_70 
       (.I0(\pht_reg[75] [0]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[79] [0]),
        .O(\pht[127][0]_i_70_n_0 ));
  LUT2 #(
    .INIT(4'h6)) 
    \pht[127][0]_i_71 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .O(\pht[127][0]_i_71_n_0 ));
  LUT6 #(
    .INIT(64'h00BEBE0000828200)) 
    \pht[127][0]_i_72 
       (.I0(\pht_reg[37] [0]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[1]),
        .I3(train_pc_IBUF[0]),
        .I4(train_history_IBUF[0]),
        .I5(\pht_reg[39] [0]),
        .O(\pht[127][0]_i_72_n_0 ));
  LUT6 #(
    .INIT(64'h00BEBE0000828200)) 
    \pht[127][0]_i_73 
       (.I0(\pht_reg[101] [0]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[1]),
        .I3(train_pc_IBUF[0]),
        .I4(train_history_IBUF[0]),
        .I5(\pht_reg[103] [0]),
        .O(\pht[127][0]_i_73_n_0 ));
  LUT6 #(
    .INIT(64'h00BEBE0000828200)) 
    \pht[127][0]_i_74 
       (.I0(\pht_reg[5] [0]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[1]),
        .I3(train_pc_IBUF[0]),
        .I4(train_history_IBUF[0]),
        .I5(\pht_reg[7] [0]),
        .O(\pht[127][0]_i_74_n_0 ));
  LUT6 #(
    .INIT(64'h00BEBE0000828200)) 
    \pht[127][0]_i_75 
       (.I0(\pht_reg[69] [0]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[1]),
        .I3(train_pc_IBUF[0]),
        .I4(train_history_IBUF[0]),
        .I5(\pht_reg[71] [0]),
        .O(\pht[127][0]_i_75_n_0 ));
  LUT6 #(
    .INIT(64'h000FFFFF4444FFFF)) 
    \pht[127][0]_i_8 
       (.I0(\pht[127][0]_i_29_n_0 ),
        .I1(\pht[127][0]_i_30_n_0 ),
        .I2(\pht[127][0]_i_31_n_0 ),
        .I3(\pht[127][0]_i_32_n_0 ),
        .I4(\pht[79][1]_i_3_n_0 ),
        .I5(\pht[127][1]_i_7_n_0 ),
        .O(\pht[127][0]_i_8_n_0 ));
  LUT6 #(
    .INIT(64'h0F5500330F55FF33)) 
    \pht[127][0]_i_9 
       (.I0(\pht_reg[22] [0]),
        .I1(\pht_reg[20] [0]),
        .I2(\pht_reg[23] [0]),
        .I3(\pht[127][0]_i_33_n_0 ),
        .I4(\pht[127][0]_i_34_n_0 ),
        .I5(\pht_reg[21] [0]),
        .O(\pht[127][0]_i_9_n_0 ));
  LUT5 #(
    .INIT(32'h00140000)) 
    \pht[127][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[127][1]_i_4_n_0 ),
        .I4(\pht[127][1]_i_5_n_0 ),
        .O(\pht[127][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[127][1]_i_2 
       (.I0(\pht[127][1]_i_6_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[127][1]_i_2_n_0 ));
  LUT4 #(
    .INIT(16'h24FF)) 
    \pht[127][1]_i_3 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(\pht[54][0]_i_2_n_0 ),
        .I2(train_taken_IBUF),
        .I3(train_valid_IBUF),
        .O(\pht[127][1]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair18" *) 
  LUT5 #(
    .INIT(32'hFFFFF99F)) 
    \pht[127][1]_i_4 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .O(\pht[127][1]_i_4_n_0 ));
  LUT4 #(
    .INIT(16'h0660)) 
    \pht[127][1]_i_5 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[5]),
        .O(\pht[127][1]_i_5_n_0 ));
  LUT5 #(
    .INIT(32'h00000660)) 
    \pht[127][1]_i_6 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(\pht[127][1]_i_4_n_0 ),
        .O(\pht[127][1]_i_6_n_0 ));
  LUT2 #(
    .INIT(4'h6)) 
    \pht[127][1]_i_7 
       (.I0(train_history_IBUF[6]),
        .I1(train_pc_IBUF[6]),
        .O(\pht[127][1]_i_7_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \pht[127][1]_i_8 
       (.I0(\pht[54][0]_i_2_n_0 ),
        .I1(\pht[127][0]_i_2_n_0 ),
        .O(\pht[127][1]_i_8_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \pht[127][1]_i_9 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(\pht[54][0]_i_2_n_0 ),
        .O(\pht[127][1]_i_9_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT5 #(
    .INIT(32'hBEFFFFBE)) 
    \pht[12][0]_i_1 
       (.I0(\pht[54][0]_i_1_n_0 ),
        .I1(train_history_IBUF[5]),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[4]),
        .I4(train_pc_IBUF[4]),
        .O(\pht[12][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[12][1]_i_1 
       (.I0(\pht[124][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[12][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[13][1]_i_1 
       (.I0(\pht[125][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[13][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[14][1]_i_1 
       (.I0(\pht[126][1]_i_3_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[14][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h04000004)) 
    \pht[15][1]_i_1 
       (.I0(\pht[127][1]_i_4_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(\pht[127][1]_i_3_n_0 ),
        .I3(train_history_IBUF[6]),
        .I4(train_pc_IBUF[6]),
        .O(\pht[15][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h0A200000)) 
    \pht[15][1]_i_2 
       (.I0(\pht[15][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .O(\pht[15][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h9009000000009009)) 
    \pht[15][1]_i_3 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(train_pc_IBUF[6]),
        .I5(train_history_IBUF[6]),
        .O(\pht[15][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h01000001)) 
    \pht[16][1]_i_1 
       (.I0(\pht[95][1]_i_3_n_0 ),
        .I1(\pht[112][1]_i_2_n_0 ),
        .I2(\pht[127][1]_i_3_n_0 ),
        .I3(train_history_IBUF[6]),
        .I4(train_pc_IBUF[6]),
        .O(\pht[16][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h000000000A200000)) 
    \pht[16][1]_i_2 
       (.I0(\pht[16][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .I5(\pht[127][1]_i_7_n_0 ),
        .O(\pht[16][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h14000014)) 
    \pht[16][1]_i_3 
       (.I0(\pht[112][1]_i_2_n_0 ),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[4]),
        .I3(train_history_IBUF[5]),
        .I4(train_pc_IBUF[5]),
        .O(\pht[16][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[17][1]_i_1 
       (.I0(\pht[113][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[17][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0022020000000000)) 
    \pht[17][1]_i_2 
       (.I0(\pht[17][1]_i_3_n_0 ),
        .I1(\pht[48][1]_i_4_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[17][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h14000014)) 
    \pht[17][1]_i_3 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[4]),
        .I3(train_history_IBUF[5]),
        .I4(train_pc_IBUF[5]),
        .O(\pht[17][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[18][1]_i_1 
       (.I0(\pht[114][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[18][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0022020000000000)) 
    \pht[18][1]_i_2 
       (.I0(\pht[18][1]_i_3_n_0 ),
        .I1(\pht[48][1]_i_4_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[18][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h14000014)) 
    \pht[18][1]_i_3 
       (.I0(\pht[118][1]_i_4_n_0 ),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[4]),
        .I3(train_history_IBUF[5]),
        .I4(train_pc_IBUF[5]),
        .O(\pht[18][1]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hFFBEBEFF)) 
    \pht[19][0]_i_1 
       (.I0(\pht[54][0]_i_1_n_0 ),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[5]),
        .I3(train_pc_IBUF[4]),
        .I4(train_history_IBUF[4]),
        .O(\pht[19][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[19][1]_i_1 
       (.I0(\pht[115][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[19][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h04000004)) 
    \pht[1][1]_i_1 
       (.I0(\pht[113][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(\pht[127][1]_i_3_n_0 ),
        .I3(train_history_IBUF[6]),
        .I4(train_pc_IBUF[6]),
        .O(\pht[1][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000082)) 
    \pht[20][1]_i_1 
       (.I0(\pht[116][1]_i_4_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[20][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0004000000000004)) 
    \pht[21][1]_i_1 
       (.I0(\pht[95][1]_i_3_n_0 ),
        .I1(\pht[118][1]_i_3_n_0 ),
        .I2(\pht[117][1]_i_3_n_0 ),
        .I3(\pht[127][1]_i_3_n_0 ),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[21][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[21][1]_i_2 
       (.I0(\pht[117][1]_i_4_n_0 ),
        .I1(\pht[31][1]_i_3_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[21][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0004000000000004)) 
    \pht[22][1]_i_1 
       (.I0(\pht[95][1]_i_3_n_0 ),
        .I1(\pht[118][1]_i_3_n_0 ),
        .I2(\pht[118][1]_i_4_n_0 ),
        .I3(\pht[127][1]_i_3_n_0 ),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[22][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[22][1]_i_2 
       (.I0(\pht[102][1]_i_2_n_0 ),
        .I1(\pht[31][1]_i_3_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[22][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0004000000000004)) 
    \pht[23][1]_i_1 
       (.I0(\pht[95][1]_i_3_n_0 ),
        .I1(\pht[118][1]_i_3_n_0 ),
        .I2(\pht[103][0]_i_2_n_0 ),
        .I3(\pht[127][1]_i_3_n_0 ),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[23][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h000000000A200000)) 
    \pht[23][1]_i_2 
       (.I0(\pht[87][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .I5(\pht[127][1]_i_7_n_0 ),
        .O(\pht[23][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[24][1]_i_1 
       (.I0(\pht[120][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[24][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[25][1]_i_1 
       (.I0(\pht[121][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[25][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[26][1]_i_1 
       (.I0(\pht[122][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[26][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair21" *) 
  LUT4 #(
    .INIT(16'hFFFD)) 
    \pht[27][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(\pht[103][0]_i_2_n_0 ),
        .I2(\pht[127][1]_i_7_n_0 ),
        .I3(\pht[58][0]_i_2_n_0 ),
        .O(\pht[27][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[27][1]_i_1 
       (.I0(\pht[123][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[27][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT5 #(
    .INIT(32'hFFFF9FF9)) 
    \pht[28][0]_i_1 
       (.I0(train_history_IBUF[4]),
        .I1(train_pc_IBUF[4]),
        .I2(train_history_IBUF[5]),
        .I3(train_pc_IBUF[5]),
        .I4(\pht[54][0]_i_1_n_0 ),
        .O(\pht[28][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[28][1]_i_1 
       (.I0(\pht[124][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[28][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[29][1]_i_1 
       (.I0(\pht[125][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[29][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000900)) 
    \pht[2][1]_i_1 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(\pht[127][1]_i_3_n_0 ),
        .I3(\pht[79][1]_i_3_n_0 ),
        .I4(\pht[114][1]_i_2_n_0 ),
        .O(\pht[2][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[30][1]_i_1 
       (.I0(\pht[126][1]_i_3_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[30][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair29" *) 
  LUT3 #(
    .INIT(8'h6F)) 
    \pht[31][0]_i_1 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(\pht[127][0]_i_2_n_0 ),
        .O(\pht[31][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[31][1]_i_1 
       (.I0(\pht[127][1]_i_4_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[31][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h0A200000)) 
    \pht[31][1]_i_2 
       (.I0(\pht[31][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .O(\pht[31][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0990000000000990)) 
    \pht[31][1]_i_3 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(train_history_IBUF[5]),
        .I5(train_pc_IBUF[5]),
        .O(\pht[31][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[32][1]_i_1 
       (.I0(\pht[112][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[32][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0001000000000001)) 
    \pht[33][1]_i_1 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(\pht[111][1]_i_3_n_0 ),
        .I2(\pht[98][1]_i_3_n_0 ),
        .I3(\pht[127][1]_i_3_n_0 ),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[33][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0044040000000000)) 
    \pht[33][1]_i_2 
       (.I0(\pht[113][1]_i_2_n_0 ),
        .I1(\pht[47][1]_i_3_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[33][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0001000000000001)) 
    \pht[34][1]_i_1 
       (.I0(\pht[118][1]_i_4_n_0 ),
        .I1(\pht[111][1]_i_3_n_0 ),
        .I2(\pht[98][1]_i_3_n_0 ),
        .I3(\pht[127][1]_i_3_n_0 ),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[34][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0044040000000000)) 
    \pht[34][1]_i_2 
       (.I0(\pht[114][1]_i_2_n_0 ),
        .I1(\pht[47][1]_i_3_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[34][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT5 #(
    .INIT(32'hFFFFF66F)) 
    \pht[35][0]_i_1 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[5]),
        .I4(\pht[54][0]_i_1_n_0 ),
        .O(\pht[35][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000009)) 
    \pht[35][1]_i_1 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(\pht[127][1]_i_3_n_0 ),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[115][1]_i_2_n_0 ),
        .O(\pht[35][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000082)) 
    \pht[36][1]_i_1 
       (.I0(\pht[116][1]_i_4_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[36][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000082)) 
    \pht[37][1]_i_1 
       (.I0(\pht[117][1]_i_4_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[37][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000082)) 
    \pht[38][1]_i_1 
       (.I0(\pht[102][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[38][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000082)) 
    \pht[39][1]_i_1 
       (.I0(\pht[119][1]_i_3_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[39][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h04000004)) 
    \pht[3][1]_i_1 
       (.I0(\pht[115][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(\pht[127][1]_i_3_n_0 ),
        .I3(train_history_IBUF[6]),
        .I4(train_pc_IBUF[6]),
        .O(\pht[3][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h000000000A200000)) 
    \pht[3][1]_i_2 
       (.I0(\pht[67][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .I5(\pht[127][1]_i_7_n_0 ),
        .O(\pht[3][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[40][1]_i_1 
       (.I0(\pht[120][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[40][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[41][1]_i_1 
       (.I0(\pht[121][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[41][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[42][1]_i_1 
       (.I0(\pht[122][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[42][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[43][1]_i_1 
       (.I0(\pht[123][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[43][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[44][1]_i_1 
       (.I0(\pht[124][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[44][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[45][1]_i_1 
       (.I0(\pht[125][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[45][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[46][1]_i_1 
       (.I0(\pht[126][1]_i_3_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[46][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000041)) 
    \pht[47][1]_i_1 
       (.I0(\pht[127][1]_i_4_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[111][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[47][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h0A200000)) 
    \pht[47][1]_i_2 
       (.I0(\pht[47][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .O(\pht[47][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0990000000000990)) 
    \pht[47][1]_i_3 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_history_IBUF[5]),
        .I3(train_pc_IBUF[5]),
        .I4(train_history_IBUF[4]),
        .I5(train_pc_IBUF[4]),
        .O(\pht[47][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[48][1]_i_1 
       (.I0(\pht[112][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[48][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0022020000000000)) 
    \pht[48][1]_i_2 
       (.I0(\pht[48][1]_i_3_n_0 ),
        .I1(\pht[48][1]_i_4_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[48][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00000660)) 
    \pht[48][1]_i_3 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(\pht[116][1]_i_3_n_0 ),
        .O(\pht[48][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h6FF6FFFFFFFF6FF6)) 
    \pht[48][1]_i_4 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_history_IBUF[3]),
        .I3(train_pc_IBUF[3]),
        .I4(train_history_IBUF[2]),
        .I5(train_pc_IBUF[2]),
        .O(\pht[48][1]_i_4_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair26" *) 
  LUT4 #(
    .INIT(16'hFEFF)) 
    \pht[49][0]_i_1 
       (.I0(\pht[117][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[98][1]_i_3_n_0 ),
        .I3(\pht[127][0]_i_2_n_0 ),
        .O(\pht[49][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[49][1]_i_1 
       (.I0(\pht[113][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[49][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair28" *) 
  LUT3 #(
    .INIT(8'h7D)) 
    \pht[4][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .O(\pht[4][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h08000008)) 
    \pht[4][1]_i_1 
       (.I0(\pht[79][1]_i_3_n_0 ),
        .I1(\pht[116][1]_i_4_n_0 ),
        .I2(\pht[127][1]_i_3_n_0 ),
        .I3(train_history_IBUF[6]),
        .I4(train_pc_IBUF[6]),
        .O(\pht[4][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair26" *) 
  LUT4 #(
    .INIT(16'hFEFF)) 
    \pht[50][0]_i_1 
       (.I0(\pht[118][1]_i_4_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[98][1]_i_3_n_0 ),
        .I3(\pht[127][0]_i_2_n_0 ),
        .O(\pht[50][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[50][1]_i_1 
       (.I0(\pht[114][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[50][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[51][1]_i_1 
       (.I0(\pht[115][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[51][1]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'hD)) 
    \pht[52][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .O(\pht[52][0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0008000000000008)) 
    \pht[52][1]_i_1 
       (.I0(\pht[127][1]_i_5_n_0 ),
        .I1(\pht[118][1]_i_3_n_0 ),
        .I2(\pht[116][1]_i_3_n_0 ),
        .I3(\pht[127][1]_i_3_n_0 ),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[52][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[52][1]_i_2 
       (.I0(\pht[116][1]_i_4_n_0 ),
        .I1(\pht[63][1]_i_3_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[52][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00008008)) 
    \pht[53][1]_i_1 
       (.I0(\pht[117][1]_i_4_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[53][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h6FFF6F6FFFFFFFFF)) 
    \pht[54][0]_i_1 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(\pht[127][0]_i_2_n_0 ),
        .I3(\pht[54][0]_i_2_n_0 ),
        .I4(train_taken_IBUF),
        .I5(train_valid_IBUF),
        .O(\pht[54][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[54][0]_i_10 
       (.I0(\pht_reg[66] [1]),
        .I1(\pht[114][1]_i_2_n_0 ),
        .I2(\pht_reg[72] [1]),
        .I3(\pht[120][1]_i_2_n_0 ),
        .I4(\pht[54][0]_i_33_n_0 ),
        .O(\pht[54][0]_i_10_n_0 ));
  LUT5 #(
    .INIT(32'hA2A200A2)) 
    \pht[54][0]_i_11 
       (.I0(\pht[54][0]_i_34_n_0 ),
        .I1(\pht_reg[64] [1]),
        .I2(\pht[112][1]_i_2_n_0 ),
        .I3(\pht_reg[78] [1]),
        .I4(\pht[126][1]_i_3_n_0 ),
        .O(\pht[54][0]_i_11_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[54][0]_i_12 
       (.I0(\pht_reg[67] [1]),
        .I1(\pht[115][1]_i_2_n_0 ),
        .I2(\pht_reg[74] [1]),
        .I3(\pht[122][1]_i_2_n_0 ),
        .I4(\pht[54][0]_i_35_n_0 ),
        .O(\pht[54][0]_i_12_n_0 ));
  LUT6 #(
    .INIT(64'h0F5500330F55FF33)) 
    \pht[54][0]_i_13 
       (.I0(\pht_reg[86] [1]),
        .I1(\pht_reg[84] [1]),
        .I2(\pht_reg[87] [1]),
        .I3(\pht[127][0]_i_33_n_0 ),
        .I4(\pht[127][0]_i_34_n_0 ),
        .I5(\pht_reg[85] [1]),
        .O(\pht[54][0]_i_13_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[54][0]_i_14 
       (.I0(\pht_reg[82] [1]),
        .I1(\pht[114][1]_i_2_n_0 ),
        .I2(\pht_reg[88] [1]),
        .I3(\pht[120][1]_i_2_n_0 ),
        .I4(\pht[54][0]_i_36_n_0 ),
        .O(\pht[54][0]_i_14_n_0 ));
  LUT5 #(
    .INIT(32'hA2A200A2)) 
    \pht[54][0]_i_15 
       (.I0(\pht[54][0]_i_37_n_0 ),
        .I1(\pht_reg[80] [1]),
        .I2(\pht[112][1]_i_2_n_0 ),
        .I3(\pht_reg[94] [1]),
        .I4(\pht[126][1]_i_3_n_0 ),
        .O(\pht[54][0]_i_15_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[54][0]_i_16 
       (.I0(\pht_reg[83] [1]),
        .I1(\pht[115][1]_i_2_n_0 ),
        .I2(\pht_reg[90] [1]),
        .I3(\pht[122][1]_i_2_n_0 ),
        .I4(\pht[54][0]_i_38_n_0 ),
        .O(\pht[54][0]_i_16_n_0 ));
  LUT6 #(
    .INIT(64'h0F5500330F55FF33)) 
    \pht[54][0]_i_17 
       (.I0(\pht_reg[102] [1]),
        .I1(\pht_reg[100] [1]),
        .I2(\pht_reg[103] [1]),
        .I3(\pht[127][0]_i_33_n_0 ),
        .I4(\pht[127][0]_i_34_n_0 ),
        .I5(\pht_reg[101] [1]),
        .O(\pht[54][0]_i_17_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[54][0]_i_18 
       (.I0(\pht_reg[98] [1]),
        .I1(\pht[114][1]_i_2_n_0 ),
        .I2(\pht_reg[104] [1]),
        .I3(\pht[120][1]_i_2_n_0 ),
        .I4(\pht[54][0]_i_39_n_0 ),
        .O(\pht[54][0]_i_18_n_0 ));
  LUT5 #(
    .INIT(32'hA2A200A2)) 
    \pht[54][0]_i_19 
       (.I0(\pht[54][0]_i_40_n_0 ),
        .I1(\pht_reg[96] [1]),
        .I2(\pht[112][1]_i_2_n_0 ),
        .I3(\pht_reg[110] [1]),
        .I4(\pht[126][1]_i_3_n_0 ),
        .O(\pht[54][0]_i_19_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000010)) 
    \pht[54][0]_i_2 
       (.I0(\pht[54][0]_i_3_n_0 ),
        .I1(\pht[54][0]_i_4_n_0 ),
        .I2(\pht[54][0]_i_5_n_0 ),
        .I3(\pht[54][0]_i_6_n_0 ),
        .I4(\pht[54][0]_i_7_n_0 ),
        .I5(\pht[54][0]_i_8_n_0 ),
        .O(\pht[54][0]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[54][0]_i_20 
       (.I0(\pht_reg[99] [1]),
        .I1(\pht[115][1]_i_2_n_0 ),
        .I2(\pht_reg[106] [1]),
        .I3(\pht[122][1]_i_2_n_0 ),
        .I4(\pht[54][0]_i_41_n_0 ),
        .O(\pht[54][0]_i_20_n_0 ));
  LUT6 #(
    .INIT(64'h0F5500330F55FF33)) 
    \pht[54][0]_i_21 
       (.I0(\pht_reg[22] [1]),
        .I1(\pht_reg[20] [1]),
        .I2(\pht_reg[23] [1]),
        .I3(\pht[127][0]_i_33_n_0 ),
        .I4(\pht[127][0]_i_34_n_0 ),
        .I5(\pht_reg[21] [1]),
        .O(\pht[54][0]_i_21_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[54][0]_i_22 
       (.I0(\pht_reg[18] [1]),
        .I1(\pht[114][1]_i_2_n_0 ),
        .I2(\pht_reg[24] [1]),
        .I3(\pht[120][1]_i_2_n_0 ),
        .I4(\pht[54][0]_i_42_n_0 ),
        .O(\pht[54][0]_i_22_n_0 ));
  LUT5 #(
    .INIT(32'hA2A200A2)) 
    \pht[54][0]_i_23 
       (.I0(\pht[54][0]_i_43_n_0 ),
        .I1(\pht_reg[16] [1]),
        .I2(\pht[112][1]_i_2_n_0 ),
        .I3(\pht_reg[30] [1]),
        .I4(\pht[126][1]_i_3_n_0 ),
        .O(\pht[54][0]_i_23_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \pht[54][0]_i_24 
       (.I0(\pht_reg[19] [1]),
        .I1(\pht[115][1]_i_2_n_0 ),
        .I2(\pht_reg[26] [1]),
        .I3(\pht[122][1]_i_2_n_0 ),
        .I4(\pht[54][0]_i_44_n_0 ),
        .O(\pht[54][0]_i_24_n_0 ));
  LUT6 #(
    .INIT(64'h0004000000040004)) 
    \pht[54][0]_i_25 
       (.I0(\pht[54][0]_i_45_n_0 ),
        .I1(\pht[54][0]_i_46_n_0 ),
        .I2(\pht[54][0]_i_47_n_0 ),
        .I3(\pht[54][0]_i_48_n_0 ),
        .I4(\pht[115][1]_i_2_n_0 ),
        .I5(\pht_reg[35] [1]),
        .O(\pht[54][0]_i_25_n_0 ));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    \pht[54][0]_i_26 
       (.I0(\pht[54][0]_i_49_n_0 ),
        .I1(\pht[54][0]_i_50_n_0 ),
        .I2(\pht[120][1]_i_2_n_0 ),
        .I3(\pht_reg[40] [1]),
        .I4(\pht[114][1]_i_2_n_0 ),
        .I5(\pht_reg[34] [1]),
        .O(\pht[54][0]_i_26_n_0 ));
  LUT6 #(
    .INIT(64'h0004000000040004)) 
    \pht[54][0]_i_27 
       (.I0(\pht[54][0]_i_51_n_0 ),
        .I1(\pht[54][0]_i_52_n_0 ),
        .I2(\pht[54][0]_i_53_n_0 ),
        .I3(\pht[54][0]_i_54_n_0 ),
        .I4(\pht[115][1]_i_2_n_0 ),
        .I5(\pht_reg[115] [1]),
        .O(\pht[54][0]_i_27_n_0 ));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    \pht[54][0]_i_28 
       (.I0(\pht[54][0]_i_55_n_0 ),
        .I1(\pht[54][0]_i_56_n_0 ),
        .I2(\pht[120][1]_i_2_n_0 ),
        .I3(\pht_reg[120] [1]),
        .I4(\pht[114][1]_i_2_n_0 ),
        .I5(\pht_reg[114] [1]),
        .O(\pht[54][0]_i_28_n_0 ));
  LUT6 #(
    .INIT(64'h0004000000040004)) 
    \pht[54][0]_i_29 
       (.I0(\pht[54][0]_i_57_n_0 ),
        .I1(\pht[54][0]_i_58_n_0 ),
        .I2(\pht[54][0]_i_59_n_0 ),
        .I3(\pht[54][0]_i_60_n_0 ),
        .I4(\pht[115][1]_i_2_n_0 ),
        .I5(\pht_reg[3] [1]),
        .O(\pht[54][0]_i_29_n_0 ));
  LUT6 #(
    .INIT(64'hAAAAAAAAAA20AAAA)) 
    \pht[54][0]_i_3 
       (.I0(\pht[79][1]_i_4_n_0 ),
        .I1(\pht[54][0]_i_9_n_0 ),
        .I2(\pht[118][1]_i_3_n_0 ),
        .I3(\pht[54][0]_i_10_n_0 ),
        .I4(\pht[54][0]_i_11_n_0 ),
        .I5(\pht[54][0]_i_12_n_0 ),
        .O(\pht[54][0]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    \pht[54][0]_i_30 
       (.I0(\pht[54][0]_i_61_n_0 ),
        .I1(\pht[54][0]_i_62_n_0 ),
        .I2(\pht[120][1]_i_2_n_0 ),
        .I3(\pht_reg[8] [1]),
        .I4(\pht[114][1]_i_2_n_0 ),
        .I5(\pht_reg[2] [1]),
        .O(\pht[54][0]_i_30_n_0 ));
  LUT6 #(
    .INIT(64'h0004000000040004)) 
    \pht[54][0]_i_31 
       (.I0(\pht[54][0]_i_63_n_0 ),
        .I1(\pht[54][0]_i_64_n_0 ),
        .I2(\pht[54][0]_i_65_n_0 ),
        .I3(\pht[54][0]_i_66_n_0 ),
        .I4(\pht[115][1]_i_2_n_0 ),
        .I5(\pht_reg[51] [1]),
        .O(\pht[54][0]_i_31_n_0 ));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    \pht[54][0]_i_32 
       (.I0(\pht[54][0]_i_67_n_0 ),
        .I1(\pht[54][0]_i_68_n_0 ),
        .I2(\pht[120][1]_i_2_n_0 ),
        .I3(\pht_reg[56] [1]),
        .I4(\pht[114][1]_i_2_n_0 ),
        .I5(\pht_reg[50] [1]),
        .O(\pht[54][0]_i_32_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[54][0]_i_33 
       (.I0(\pht_reg[75] [1]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[79] [1]),
        .O(\pht[54][0]_i_33_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[54][0]_i_34 
       (.I0(\pht_reg[77] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[76] [1]),
        .O(\pht[54][0]_i_34_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[54][0]_i_35 
       (.I0(\pht_reg[65] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[73] [1]),
        .O(\pht[54][0]_i_35_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[54][0]_i_36 
       (.I0(\pht_reg[91] [1]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[95] [1]),
        .O(\pht[54][0]_i_36_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[54][0]_i_37 
       (.I0(\pht_reg[93] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[92] [1]),
        .O(\pht[54][0]_i_37_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[54][0]_i_38 
       (.I0(\pht_reg[81] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[89] [1]),
        .O(\pht[54][0]_i_38_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[54][0]_i_39 
       (.I0(\pht_reg[107] [1]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[111] [1]),
        .O(\pht[54][0]_i_39_n_0 ));
  LUT6 #(
    .INIT(64'hAAAAAAAAAA20AAAA)) 
    \pht[54][0]_i_4 
       (.I0(\pht[95][1]_i_4_n_0 ),
        .I1(\pht[54][0]_i_13_n_0 ),
        .I2(\pht[118][1]_i_3_n_0 ),
        .I3(\pht[54][0]_i_14_n_0 ),
        .I4(\pht[54][0]_i_15_n_0 ),
        .I5(\pht[54][0]_i_16_n_0 ),
        .O(\pht[54][0]_i_4_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[54][0]_i_40 
       (.I0(\pht_reg[109] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[108] [1]),
        .O(\pht[54][0]_i_40_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[54][0]_i_41 
       (.I0(\pht_reg[97] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[105] [1]),
        .O(\pht[54][0]_i_41_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[54][0]_i_42 
       (.I0(\pht_reg[27] [1]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[31] [1]),
        .O(\pht[54][0]_i_42_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[54][0]_i_43 
       (.I0(\pht_reg[29] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[28] [1]),
        .O(\pht[54][0]_i_43_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[54][0]_i_44 
       (.I0(\pht_reg[17] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[25] [1]),
        .O(\pht[54][0]_i_44_n_0 ));
  LUT6 #(
    .INIT(64'h101010FF10101010)) 
    \pht[54][0]_i_45 
       (.I0(\pht[110][0]_i_2_n_0 ),
        .I1(\pht[118][1]_i_4_n_0 ),
        .I2(\pht_reg[46] [1]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[98][1]_i_3_n_0 ),
        .I5(\pht_reg[32] [1]),
        .O(\pht[54][0]_i_45_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[54][0]_i_46 
       (.I0(\pht_reg[45] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[44] [1]),
        .O(\pht[54][0]_i_46_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[54][0]_i_47 
       (.I0(\pht_reg[33] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[41] [1]),
        .O(\pht[54][0]_i_47_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000828200)) 
    \pht[54][0]_i_48 
       (.I0(\pht_reg[42] [1]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[3]),
        .I4(train_history_IBUF[3]),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[54][0]_i_48_n_0 ));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    \pht[54][0]_i_49 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(\pht[54][0]_i_69_n_0 ),
        .I2(\pht_reg[36] [1]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_4_n_0 ),
        .I5(\pht_reg[38] [1]),
        .O(\pht[54][0]_i_49_n_0 ));
  LUT6 #(
    .INIT(64'hAAAAAAAAAAEFAAAA)) 
    \pht[54][0]_i_5 
       (.I0(\pht[111][1]_i_4_n_0 ),
        .I1(\pht[54][0]_i_17_n_0 ),
        .I2(\pht[118][1]_i_3_n_0 ),
        .I3(\pht[54][0]_i_18_n_0 ),
        .I4(\pht[54][0]_i_19_n_0 ),
        .I5(\pht[54][0]_i_20_n_0 ),
        .O(\pht[54][0]_i_5_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[54][0]_i_50 
       (.I0(\pht_reg[43] [1]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[47] [1]),
        .O(\pht[54][0]_i_50_n_0 ));
  LUT6 #(
    .INIT(64'h101010FF10101010)) 
    \pht[54][0]_i_51 
       (.I0(\pht[110][0]_i_2_n_0 ),
        .I1(\pht[118][1]_i_4_n_0 ),
        .I2(\pht_reg[126] [1]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[98][1]_i_3_n_0 ),
        .I5(\pht_reg[112] [1]),
        .O(\pht[54][0]_i_51_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[54][0]_i_52 
       (.I0(\pht_reg[125] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[124] [1]),
        .O(\pht[54][0]_i_52_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[54][0]_i_53 
       (.I0(\pht_reg[113] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[121] [1]),
        .O(\pht[54][0]_i_53_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000828200)) 
    \pht[54][0]_i_54 
       (.I0(\pht_reg[122] [1]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[3]),
        .I4(train_history_IBUF[3]),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[54][0]_i_54_n_0 ));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    \pht[54][0]_i_55 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(\pht[54][0]_i_70_n_0 ),
        .I2(\pht_reg[116] [1]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_4_n_0 ),
        .I5(\pht_reg[118] [1]),
        .O(\pht[54][0]_i_55_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[54][0]_i_56 
       (.I0(\pht_reg[123] [1]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[127] [1]),
        .O(\pht[54][0]_i_56_n_0 ));
  LUT6 #(
    .INIT(64'h101010FF10101010)) 
    \pht[54][0]_i_57 
       (.I0(\pht[110][0]_i_2_n_0 ),
        .I1(\pht[118][1]_i_4_n_0 ),
        .I2(\pht_reg[14] [1]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[98][1]_i_3_n_0 ),
        .I5(\pht_reg[0] [1]),
        .O(\pht[54][0]_i_57_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[54][0]_i_58 
       (.I0(\pht_reg[13] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[12] [1]),
        .O(\pht[54][0]_i_58_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[54][0]_i_59 
       (.I0(\pht_reg[1] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[9] [1]),
        .O(\pht[54][0]_i_59_n_0 ));
  LUT6 #(
    .INIT(64'hAAAAAAAAAA20AAAA)) 
    \pht[54][0]_i_6 
       (.I0(\pht[31][1]_i_3_n_0 ),
        .I1(\pht[54][0]_i_21_n_0 ),
        .I2(\pht[118][1]_i_3_n_0 ),
        .I3(\pht[54][0]_i_22_n_0 ),
        .I4(\pht[54][0]_i_23_n_0 ),
        .I5(\pht[54][0]_i_24_n_0 ),
        .O(\pht[54][0]_i_6_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000828200)) 
    \pht[54][0]_i_60 
       (.I0(\pht_reg[10] [1]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[3]),
        .I4(train_history_IBUF[3]),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[54][0]_i_60_n_0 ));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    \pht[54][0]_i_61 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(\pht[54][0]_i_71_n_0 ),
        .I2(\pht_reg[4] [1]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_4_n_0 ),
        .I5(\pht_reg[6] [1]),
        .O(\pht[54][0]_i_61_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[54][0]_i_62 
       (.I0(\pht_reg[11] [1]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[15] [1]),
        .O(\pht[54][0]_i_62_n_0 ));
  LUT6 #(
    .INIT(64'h101010FF10101010)) 
    \pht[54][0]_i_63 
       (.I0(\pht[110][0]_i_2_n_0 ),
        .I1(\pht[118][1]_i_4_n_0 ),
        .I2(\pht_reg[62] [1]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[98][1]_i_3_n_0 ),
        .I5(\pht_reg[48] [1]),
        .O(\pht[54][0]_i_63_n_0 ));
  LUT5 #(
    .INIT(32'hFDF0FDFD)) 
    \pht[54][0]_i_64 
       (.I0(\pht_reg[61] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht_reg[60] [1]),
        .O(\pht[54][0]_i_64_n_0 ));
  LUT6 #(
    .INIT(64'h3200003202000002)) 
    \pht[54][0]_i_65 
       (.I0(\pht_reg[49] [1]),
        .I1(\pht[117][1]_i_3_n_0 ),
        .I2(\pht[127][0]_i_71_n_0 ),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht_reg[57] [1]),
        .O(\pht[54][0]_i_65_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000828200)) 
    \pht[54][0]_i_66 
       (.I0(\pht_reg[58] [1]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[3]),
        .I4(train_history_IBUF[3]),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[54][0]_i_66_n_0 ));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    \pht[54][0]_i_67 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(\pht[54][0]_i_72_n_0 ),
        .I2(\pht_reg[52] [1]),
        .I3(\pht[116][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_4_n_0 ),
        .I5(\pht_reg[54] [1]),
        .O(\pht[54][0]_i_67_n_0 ));
  LUT6 #(
    .INIT(64'h00008CC800008008)) 
    \pht[54][0]_i_68 
       (.I0(\pht_reg[59] [1]),
        .I1(\pht[127][0]_i_71_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(\pht[103][0]_i_2_n_0 ),
        .I5(\pht_reg[63] [1]),
        .O(\pht[54][0]_i_68_n_0 ));
  LUT6 #(
    .INIT(64'h00BEBE0000828200)) 
    \pht[54][0]_i_69 
       (.I0(\pht_reg[37] [1]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[1]),
        .I3(train_pc_IBUF[0]),
        .I4(train_history_IBUF[0]),
        .I5(\pht_reg[39] [1]),
        .O(\pht[54][0]_i_69_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFD0FFD0D0D0D0)) 
    \pht[54][0]_i_7 
       (.I0(\pht[54][0]_i_25_n_0 ),
        .I1(\pht[54][0]_i_26_n_0 ),
        .I2(\pht[47][1]_i_3_n_0 ),
        .I3(\pht[54][0]_i_27_n_0 ),
        .I4(\pht[54][0]_i_28_n_0 ),
        .I5(\pht[126][1]_i_4_n_0 ),
        .O(\pht[54][0]_i_7_n_0 ));
  LUT6 #(
    .INIT(64'h00BEBE0000828200)) 
    \pht[54][0]_i_70 
       (.I0(\pht_reg[117] [1]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[1]),
        .I3(train_pc_IBUF[0]),
        .I4(train_history_IBUF[0]),
        .I5(\pht_reg[119] [1]),
        .O(\pht[54][0]_i_70_n_0 ));
  LUT6 #(
    .INIT(64'h00BEBE0000828200)) 
    \pht[54][0]_i_71 
       (.I0(\pht_reg[5] [1]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[1]),
        .I3(train_pc_IBUF[0]),
        .I4(train_history_IBUF[0]),
        .I5(\pht_reg[7] [1]),
        .O(\pht[54][0]_i_71_n_0 ));
  LUT6 #(
    .INIT(64'h00BEBE0000828200)) 
    \pht[54][0]_i_72 
       (.I0(\pht_reg[53] [1]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[1]),
        .I3(train_pc_IBUF[0]),
        .I4(train_history_IBUF[0]),
        .I5(\pht_reg[55] [1]),
        .O(\pht[54][0]_i_72_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFD0FFD0D0D0D0)) 
    \pht[54][0]_i_8 
       (.I0(\pht[54][0]_i_29_n_0 ),
        .I1(\pht[54][0]_i_30_n_0 ),
        .I2(\pht[15][1]_i_3_n_0 ),
        .I3(\pht[54][0]_i_31_n_0 ),
        .I4(\pht[54][0]_i_32_n_0 ),
        .I5(\pht[63][1]_i_3_n_0 ),
        .O(\pht[54][0]_i_8_n_0 ));
  LUT6 #(
    .INIT(64'h0F5500330F55FF33)) 
    \pht[54][0]_i_9 
       (.I0(\pht_reg[70] [1]),
        .I1(\pht_reg[68] [1]),
        .I2(\pht_reg[71] [1]),
        .I3(\pht[127][0]_i_33_n_0 ),
        .I4(\pht[127][0]_i_34_n_0 ),
        .I5(\pht_reg[69] [1]),
        .O(\pht[54][0]_i_9_n_0 ));
  LUT6 #(
    .INIT(64'h0008000000000008)) 
    \pht[54][1]_i_1 
       (.I0(\pht[127][1]_i_5_n_0 ),
        .I1(\pht[118][1]_i_3_n_0 ),
        .I2(\pht[118][1]_i_4_n_0 ),
        .I3(\pht[127][1]_i_3_n_0 ),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[54][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h000000000A200000)) 
    \pht[54][1]_i_2 
       (.I0(\pht[118][1]_i_5_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .I5(\pht[127][1]_i_7_n_0 ),
        .O(\pht[54][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT5 #(
    .INIT(32'hFFFFF99F)) 
    \pht[55][0]_i_1 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[5]),
        .I4(\pht[54][0]_i_1_n_0 ),
        .O(\pht[55][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00008008)) 
    \pht[55][1]_i_1 
       (.I0(\pht[119][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[55][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[56][1]_i_1 
       (.I0(\pht[120][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[56][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair25" *) 
  LUT4 #(
    .INIT(16'hFFFD)) 
    \pht[57][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[58][0]_i_2_n_0 ),
        .I3(\pht[117][1]_i_3_n_0 ),
        .O(\pht[57][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[57][1]_i_1 
       (.I0(\pht[121][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[57][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair25" *) 
  LUT4 #(
    .INIT(16'hFFEF)) 
    \pht[58][0]_i_1 
       (.I0(\pht[58][0]_i_2_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[127][0]_i_2_n_0 ),
        .I3(\pht[118][1]_i_4_n_0 ),
        .O(\pht[58][0]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair18" *) 
  LUT4 #(
    .INIT(16'hF66F)) 
    \pht[58][0]_i_2 
       (.I0(train_pc_IBUF[2]),
        .I1(train_history_IBUF[2]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[3]),
        .O(\pht[58][0]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[58][1]_i_1 
       (.I0(\pht[122][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[58][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[59][1]_i_1 
       (.I0(\pht[123][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[59][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'hBEFFFFBE)) 
    \pht[5][0]_i_1 
       (.I0(\pht[54][0]_i_1_n_0 ),
        .I1(train_pc_IBUF[4]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[5]),
        .I4(train_history_IBUF[5]),
        .O(\pht[5][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00008008)) 
    \pht[5][1]_i_1 
       (.I0(\pht[117][1]_i_4_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[5][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'hFFEBEBFF)) 
    \pht[60][0]_i_1 
       (.I0(\pht[54][0]_i_1_n_0 ),
        .I1(train_history_IBUF[5]),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[4]),
        .I4(train_pc_IBUF[4]),
        .O(\pht[60][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[60][1]_i_1 
       (.I0(\pht[124][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[60][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[61][1]_i_1 
       (.I0(\pht[125][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[61][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair22" *) 
  LUT3 #(
    .INIT(8'h7D)) 
    \pht[62][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .O(\pht[62][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[62][1]_i_1 
       (.I0(\pht[126][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[62][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hFFEBEBFF)) 
    \pht[63][0]_i_1 
       (.I0(\pht[54][0]_i_1_n_0 ),
        .I1(train_pc_IBUF[4]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[5]),
        .I4(train_history_IBUF[5]),
        .O(\pht[63][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[63][1]_i_1 
       (.I0(\pht[127][1]_i_4_n_0 ),
        .I1(\pht[127][1]_i_5_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[63][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h0A200000)) 
    \pht[63][1]_i_2 
       (.I0(\pht[63][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .O(\pht[63][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0660000000000660)) 
    \pht[63][1]_i_3 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(train_pc_IBUF[6]),
        .I5(train_history_IBUF[6]),
        .O(\pht[63][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[64][1]_i_1 
       (.I0(\pht[112][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[64][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[65][1]_i_1 
       (.I0(\pht[113][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[65][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[65][1]_i_2 
       (.I0(\pht[65][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[65][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00009009)) 
    \pht[65][1]_i_3 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(\pht[113][1]_i_2_n_0 ),
        .O(\pht[65][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[66][1]_i_1 
       (.I0(\pht[114][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[66][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[67][1]_i_1 
       (.I0(\pht[115][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[67][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[67][1]_i_2 
       (.I0(\pht[67][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[67][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h00009009)) 
    \pht[67][1]_i_3 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(\pht[115][1]_i_2_n_0 ),
        .O(\pht[67][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h14000000)) 
    \pht[68][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[79][1]_i_3_n_0 ),
        .I4(\pht[116][1]_i_4_n_0 ),
        .O(\pht[68][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[68][1]_i_2 
       (.I0(\pht[68][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[68][1]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h82000082)) 
    \pht[68][1]_i_3 
       (.I0(\pht[116][1]_i_4_n_0 ),
        .I1(train_history_IBUF[5]),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[4]),
        .I4(train_pc_IBUF[4]),
        .O(\pht[68][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00000880)) 
    \pht[69][1]_i_1 
       (.I0(\pht[117][1]_i_4_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[69][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h09000000)) 
    \pht[6][1]_i_1 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(\pht[127][1]_i_3_n_0 ),
        .I3(\pht[102][1]_i_2_n_0 ),
        .I4(\pht[79][1]_i_3_n_0 ),
        .O(\pht[6][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair29" *) 
  LUT3 #(
    .INIT(8'h9F)) 
    \pht[70][0]_i_1 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(\pht[127][0]_i_2_n_0 ),
        .O(\pht[70][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000880)) 
    \pht[70][1]_i_1 
       (.I0(\pht[102][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[70][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000880)) 
    \pht[71][1]_i_1 
       (.I0(\pht[119][1]_i_3_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[71][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[72][1]_i_1 
       (.I0(\pht[120][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[72][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[73][1]_i_1 
       (.I0(\pht[121][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[73][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[74][1]_i_1 
       (.I0(\pht[122][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[74][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[75][1]_i_1 
       (.I0(\pht[123][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[75][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[76][1]_i_1 
       (.I0(\pht[124][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[76][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[77][1]_i_1 
       (.I0(\pht[125][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[77][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[78][1]_i_1 
       (.I0(\pht[126][1]_i_3_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[78][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000440)) 
    \pht[79][1]_i_1 
       (.I0(\pht[127][1]_i_4_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[79][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h0A200000)) 
    \pht[79][1]_i_2 
       (.I0(\pht[79][1]_i_4_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .O(\pht[79][1]_i_2_n_0 ));
  LUT4 #(
    .INIT(16'h9009)) 
    \pht[79][1]_i_3 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[5]),
        .O(\pht[79][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0000900990090000)) 
    \pht[79][1]_i_4 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(train_pc_IBUF[6]),
        .I5(train_history_IBUF[6]),
        .O(\pht[79][1]_i_4_n_0 ));
  LUT5 #(
    .INIT(32'h00008008)) 
    \pht[7][1]_i_1 
       (.I0(\pht[119][1]_i_3_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[7][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[80][1]_i_1 
       (.I0(\pht[112][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[80][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[81][1]_i_1 
       (.I0(\pht[113][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[81][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[82][1]_i_1 
       (.I0(\pht[114][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[82][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[83][1]_i_1 
       (.I0(\pht[115][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[83][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000028)) 
    \pht[84][1]_i_1 
       (.I0(\pht[116][1]_i_4_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[84][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000828)) 
    \pht[84][1]_i_2 
       (.I0(train_valid_IBUF),
        .I1(\pht[127][1]_i_9_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_8_n_0 ),
        .I4(\pht[84][1]_i_3_n_0 ),
        .I5(\pht[116][1]_i_3_n_0 ),
        .O(\pht[84][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'hFF7D7DFFFFFFFFFF)) 
    \pht[84][1]_i_3 
       (.I0(\pht[118][1]_i_3_n_0 ),
        .I1(train_pc_IBUF[5]),
        .I2(train_history_IBUF[5]),
        .I3(train_pc_IBUF[4]),
        .I4(train_history_IBUF[4]),
        .I5(\pht[127][1]_i_7_n_0 ),
        .O(\pht[84][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000140000)) 
    \pht[85][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_3_n_0 ),
        .I5(\pht[117][1]_i_3_n_0 ),
        .O(\pht[85][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[85][1]_i_2 
       (.I0(\pht[117][1]_i_4_n_0 ),
        .I1(\pht[95][1]_i_4_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[85][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000140000)) 
    \pht[86][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_3_n_0 ),
        .I5(\pht[118][1]_i_4_n_0 ),
        .O(\pht[86][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[86][1]_i_2 
       (.I0(\pht[102][1]_i_2_n_0 ),
        .I1(\pht[95][1]_i_4_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[86][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000140000)) 
    \pht[87][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[118][1]_i_3_n_0 ),
        .I5(\pht[103][0]_i_2_n_0 ),
        .O(\pht[87][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0088080000000000)) 
    \pht[87][1]_i_2 
       (.I0(\pht[87][1]_i_3_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[127][1]_i_8_n_0 ),
        .I3(train_taken_IBUF),
        .I4(\pht[127][1]_i_9_n_0 ),
        .I5(train_valid_IBUF),
        .O(\pht[87][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000400440040000)) 
    \pht[87][1]_i_3 
       (.I0(\pht[103][0]_i_2_n_0 ),
        .I1(\pht[118][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[5]),
        .I4(train_pc_IBUF[4]),
        .I5(train_history_IBUF[4]),
        .O(\pht[87][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[88][1]_i_1 
       (.I0(\pht[120][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[88][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[89][1]_i_1 
       (.I0(\pht[121][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[89][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[8][1]_i_1 
       (.I0(\pht[120][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[8][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[90][1]_i_1 
       (.I0(\pht[122][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[90][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[91][1]_i_1 
       (.I0(\pht[123][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[91][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[92][1]_i_1 
       (.I0(\pht[124][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[92][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair24" *) 
  LUT4 #(
    .INIT(16'hFFF7)) 
    \pht[93][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[117][1]_i_3_n_0 ),
        .O(\pht[93][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[93][1]_i_1 
       (.I0(\pht[125][1]_i_2_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[93][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair23" *) 
  LUT4 #(
    .INIT(16'hFFF7)) 
    \pht[94][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .I2(\pht[110][0]_i_2_n_0 ),
        .I3(\pht[118][1]_i_4_n_0 ),
        .O(\pht[94][0]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[94][1]_i_1 
       (.I0(\pht[126][1]_i_3_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[94][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00000014)) 
    \pht[95][1]_i_1 
       (.I0(\pht[127][1]_i_4_n_0 ),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(\pht[95][1]_i_3_n_0 ),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[95][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h0A200000)) 
    \pht[95][1]_i_2 
       (.I0(\pht[95][1]_i_4_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .O(\pht[95][1]_i_2_n_0 ));
  LUT4 #(
    .INIT(16'hF66F)) 
    \pht[95][1]_i_3 
       (.I0(train_pc_IBUF[5]),
        .I1(train_history_IBUF[5]),
        .I2(train_pc_IBUF[4]),
        .I3(train_history_IBUF[4]),
        .O(\pht[95][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0660000000000660)) 
    \pht[95][1]_i_4 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .I4(train_history_IBUF[5]),
        .I5(train_pc_IBUF[5]),
        .O(\pht[95][1]_i_4_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[96][1]_i_1 
       (.I0(\pht[112][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[96][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000014)) 
    \pht[97][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[117][1]_i_3_n_0 ),
        .I4(\pht[111][1]_i_3_n_0 ),
        .I5(\pht[98][1]_i_3_n_0 ),
        .O(\pht[97][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000005100000)) 
    \pht[97][1]_i_2 
       (.I0(\pht[113][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .I5(\pht[111][1]_i_4_n_0 ),
        .O(\pht[97][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair30" *) 
  LUT2 #(
    .INIT(4'h7)) 
    \pht[98][0]_i_1 
       (.I0(\pht[127][0]_i_2_n_0 ),
        .I1(\pht[127][1]_i_7_n_0 ),
        .O(\pht[98][0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000014)) 
    \pht[98][1]_i_1 
       (.I0(\pht[127][1]_i_3_n_0 ),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(\pht[118][1]_i_4_n_0 ),
        .I4(\pht[111][1]_i_3_n_0 ),
        .I5(\pht[98][1]_i_3_n_0 ),
        .O(\pht[98][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000005100000)) 
    \pht[98][1]_i_2 
       (.I0(\pht[114][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_8_n_0 ),
        .I2(train_taken_IBUF),
        .I3(\pht[127][1]_i_9_n_0 ),
        .I4(train_valid_IBUF),
        .I5(\pht[111][1]_i_4_n_0 ),
        .O(\pht[98][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT4 #(
    .INIT(16'h6FF6)) 
    \pht[98][1]_i_3 
       (.I0(train_pc_IBUF[2]),
        .I1(train_history_IBUF[2]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[3]),
        .O(\pht[98][1]_i_3_n_0 ));
  LUT5 #(
    .INIT(32'h00010100)) 
    \pht[99][1]_i_1 
       (.I0(\pht[115][1]_i_2_n_0 ),
        .I1(\pht[127][1]_i_3_n_0 ),
        .I2(\pht[111][1]_i_3_n_0 ),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .O(\pht[99][1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'h00004004)) 
    \pht[9][1]_i_1 
       (.I0(\pht[121][1]_i_2_n_0 ),
        .I1(\pht[79][1]_i_3_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(\pht[127][1]_i_3_n_0 ),
        .O(\pht[9][1]_i_1_n_0 ));
  FDPE \pht_reg[0][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[0][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[0] [0]));
  FDCE \pht_reg[0][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[0][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[0] [1]));
  FDPE \pht_reg[100][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[100][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[100] [0]));
  FDCE \pht_reg[100][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[100][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[100] [1]));
  FDPE \pht_reg[101][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[101][1]_i_1_n_0 ),
        .D(\pht[101][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[101] [0]));
  FDCE \pht_reg[101][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[101][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[101][1]_i_2_n_0 ),
        .Q(\pht_reg[101] [1]));
  FDPE \pht_reg[102][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[102][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[102] [0]));
  FDCE \pht_reg[102][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[102][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[102] [1]));
  FDPE \pht_reg[103][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[103][1]_i_1_n_0 ),
        .D(\pht[103][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[103] [0]));
  FDCE \pht_reg[103][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[103][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[103] [1]));
  FDPE \pht_reg[104][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[104][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[104] [0]));
  FDCE \pht_reg[104][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[104][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[104] [1]));
  FDPE \pht_reg[105][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[105][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[105] [0]));
  FDCE \pht_reg[105][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[105][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[105] [1]));
  FDPE \pht_reg[106][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[106][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[106] [0]));
  FDCE \pht_reg[106][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[106][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[106] [1]));
  FDPE \pht_reg[107][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[107][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[107] [0]));
  FDCE \pht_reg[107][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[107][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[107] [1]));
  FDPE \pht_reg[108][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[108][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[108] [0]));
  FDCE \pht_reg[108][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[108][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[108] [1]));
  FDPE \pht_reg[109][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[109][1]_i_1_n_0 ),
        .D(\pht[109][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[109] [0]));
  FDCE \pht_reg[109][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[109][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[109] [1]));
  FDPE \pht_reg[10][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[10][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[10] [0]));
  FDCE \pht_reg[10][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[10][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[10] [1]));
  FDPE \pht_reg[110][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[110][1]_i_1_n_0 ),
        .D(\pht[110][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[110] [0]));
  FDCE \pht_reg[110][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[110][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[110] [1]));
  FDPE \pht_reg[111][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[111][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[111] [0]));
  FDCE \pht_reg[111][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[111][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[111] [1]));
  FDPE \pht_reg[112][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[112][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[112] [0]));
  FDCE \pht_reg[112][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[112][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[112] [1]));
  FDPE \pht_reg[113][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[113][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[113] [0]));
  FDCE \pht_reg[113][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[113][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[113] [1]));
  FDPE \pht_reg[114][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[114][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[114] [0]));
  FDCE \pht_reg[114][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[114][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[114] [1]));
  FDPE \pht_reg[115][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[115][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[115] [0]));
  FDCE \pht_reg[115][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[115][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[115] [1]));
  FDPE \pht_reg[116][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[116][1]_i_1_n_0 ),
        .D(\pht[118][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[116] [0]));
  FDCE \pht_reg[116][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[116][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[116][1]_i_2_n_0 ),
        .Q(\pht_reg[116] [1]));
  FDPE \pht_reg[117][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[117][1]_i_1_n_0 ),
        .D(\pht[118][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[117] [0]));
  FDCE \pht_reg[117][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[117][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[117][1]_i_2_n_0 ),
        .Q(\pht_reg[117] [1]));
  FDPE \pht_reg[118][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[118][1]_i_1_n_0 ),
        .D(\pht[118][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[118] [0]));
  FDCE \pht_reg[118][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[118][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[118][1]_i_2_n_0 ),
        .Q(\pht_reg[118] [1]));
  FDPE \pht_reg[119][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[119][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[119] [0]));
  FDCE \pht_reg[119][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[119][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[119][1]_i_2_n_0 ),
        .Q(\pht_reg[119] [1]));
  FDPE \pht_reg[11][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[11][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[11] [0]));
  FDCE \pht_reg[11][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[11][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[11] [1]));
  FDPE \pht_reg[120][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[120][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[120] [0]));
  FDCE \pht_reg[120][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[120][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[120] [1]));
  FDPE \pht_reg[121][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[121][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[121] [0]));
  FDCE \pht_reg[121][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[121][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[121] [1]));
  FDPE \pht_reg[122][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[122][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[122] [0]));
  FDCE \pht_reg[122][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[122][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[122] [1]));
  FDPE \pht_reg[123][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[123][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[123] [0]));
  FDCE \pht_reg[123][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[123][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[123] [1]));
  FDPE \pht_reg[124][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[124][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[124] [0]));
  FDCE \pht_reg[124][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[124][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[124] [1]));
  FDPE \pht_reg[125][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[125][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[125] [0]));
  FDCE \pht_reg[125][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[125][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[125] [1]));
  FDPE \pht_reg[126][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[126][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[126] [0]));
  FDCE \pht_reg[126][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[126][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[126][1]_i_2_n_0 ),
        .Q(\pht_reg[126] [1]));
  FDPE \pht_reg[127][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[127][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[127] [0]));
  FDCE \pht_reg[127][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[127][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[127][1]_i_2_n_0 ),
        .Q(\pht_reg[127] [1]));
  FDPE \pht_reg[12][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[12][1]_i_1_n_0 ),
        .D(\pht[12][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[12] [0]));
  FDCE \pht_reg[12][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[12][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[12] [1]));
  FDPE \pht_reg[13][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[13][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[13] [0]));
  FDCE \pht_reg[13][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[13][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[13] [1]));
  FDPE \pht_reg[14][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[14][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[14] [0]));
  FDCE \pht_reg[14][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[14][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[14] [1]));
  FDPE \pht_reg[15][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[15][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[15] [0]));
  FDCE \pht_reg[15][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[15][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[15] [1]));
  FDPE \pht_reg[16][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[16][1]_i_1_n_0 ),
        .D(\pht[19][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[16] [0]));
  FDCE \pht_reg[16][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[16][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[16][1]_i_2_n_0 ),
        .Q(\pht_reg[16] [1]));
  FDPE \pht_reg[17][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[17][1]_i_1_n_0 ),
        .D(\pht[31][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[17] [0]));
  FDCE \pht_reg[17][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[17][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[17][1]_i_2_n_0 ),
        .Q(\pht_reg[17] [1]));
  FDPE \pht_reg[18][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[18][1]_i_1_n_0 ),
        .D(\pht[31][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[18] [0]));
  FDCE \pht_reg[18][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[18][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[18][1]_i_2_n_0 ),
        .Q(\pht_reg[18] [1]));
  FDPE \pht_reg[19][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[19][1]_i_1_n_0 ),
        .D(\pht[19][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[19] [0]));
  FDCE \pht_reg[19][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[19][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[19] [1]));
  FDPE \pht_reg[1][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[1][1]_i_1_n_0 ),
        .D(\pht[4][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[1] [0]));
  FDCE \pht_reg[1][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[1][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[1] [1]));
  FDPE \pht_reg[20][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[20][1]_i_1_n_0 ),
        .D(\pht[31][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[20] [0]));
  FDCE \pht_reg[20][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[20][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[20] [1]));
  FDPE \pht_reg[21][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[21][1]_i_1_n_0 ),
        .D(\pht[54][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[21] [0]));
  FDCE \pht_reg[21][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[21][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[21][1]_i_2_n_0 ),
        .Q(\pht_reg[21] [1]));
  FDPE \pht_reg[22][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[22][1]_i_1_n_0 ),
        .D(\pht[54][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[22] [0]));
  FDCE \pht_reg[22][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[22][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[22][1]_i_2_n_0 ),
        .Q(\pht_reg[22] [1]));
  FDPE \pht_reg[23][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[23][1]_i_1_n_0 ),
        .D(\pht[54][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[23] [0]));
  FDCE \pht_reg[23][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[23][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[23][1]_i_2_n_0 ),
        .Q(\pht_reg[23] [1]));
  FDPE \pht_reg[24][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[24][1]_i_1_n_0 ),
        .D(\pht[31][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[24] [0]));
  FDCE \pht_reg[24][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[24][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[24] [1]));
  FDPE \pht_reg[25][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[25][1]_i_1_n_0 ),
        .D(\pht[31][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[25] [0]));
  FDCE \pht_reg[25][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[25][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[25] [1]));
  FDPE \pht_reg[26][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[26][1]_i_1_n_0 ),
        .D(\pht[31][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[26] [0]));
  FDCE \pht_reg[26][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[26][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[26] [1]));
  FDPE \pht_reg[27][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[27][1]_i_1_n_0 ),
        .D(\pht[27][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[27] [0]));
  FDCE \pht_reg[27][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[27][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[27] [1]));
  FDPE \pht_reg[28][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[28][1]_i_1_n_0 ),
        .D(\pht[28][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[28] [0]));
  FDCE \pht_reg[28][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[28][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[28] [1]));
  FDPE \pht_reg[29][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[29][1]_i_1_n_0 ),
        .D(\pht[31][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[29] [0]));
  FDCE \pht_reg[29][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[29][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[29] [1]));
  FDPE \pht_reg[2][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[2][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[2] [0]));
  FDCE \pht_reg[2][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[2][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[2] [1]));
  FDPE \pht_reg[30][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[30][1]_i_1_n_0 ),
        .D(\pht[31][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[30] [0]));
  FDCE \pht_reg[30][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[30][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[30] [1]));
  FDPE \pht_reg[31][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[31][1]_i_1_n_0 ),
        .D(\pht[31][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[31] [0]));
  FDCE \pht_reg[31][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[31][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[31][1]_i_2_n_0 ),
        .Q(\pht_reg[31] [1]));
  FDPE \pht_reg[32][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[32][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[32] [0]));
  FDCE \pht_reg[32][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[32][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[32] [1]));
  FDPE \pht_reg[33][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[33][1]_i_1_n_0 ),
        .D(\pht[54][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[33] [0]));
  FDCE \pht_reg[33][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[33][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[33][1]_i_2_n_0 ),
        .Q(\pht_reg[33] [1]));
  FDPE \pht_reg[34][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[34][1]_i_1_n_0 ),
        .D(\pht[54][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[34] [0]));
  FDCE \pht_reg[34][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[34][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[34][1]_i_2_n_0 ),
        .Q(\pht_reg[34] [1]));
  FDPE \pht_reg[35][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[35][1]_i_1_n_0 ),
        .D(\pht[35][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[35] [0]));
  FDCE \pht_reg[35][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[35][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[35] [1]));
  FDPE \pht_reg[36][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[36][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[36] [0]));
  FDCE \pht_reg[36][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[36][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[36] [1]));
  FDPE \pht_reg[37][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[37][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[37] [0]));
  FDCE \pht_reg[37][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[37][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[37] [1]));
  FDPE \pht_reg[38][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[38][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[38] [0]));
  FDCE \pht_reg[38][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[38][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[38] [1]));
  FDPE \pht_reg[39][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[39][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[39] [0]));
  FDCE \pht_reg[39][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[39][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[39] [1]));
  FDPE \pht_reg[3][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[3][1]_i_1_n_0 ),
        .D(\pht[4][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[3] [0]));
  FDCE \pht_reg[3][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[3][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[3][1]_i_2_n_0 ),
        .Q(\pht_reg[3] [1]));
  FDPE \pht_reg[40][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[40][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[40] [0]));
  FDCE \pht_reg[40][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[40][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[40] [1]));
  FDPE \pht_reg[41][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[41][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[41] [0]));
  FDCE \pht_reg[41][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[41][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[41] [1]));
  FDPE \pht_reg[42][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[42][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[42] [0]));
  FDCE \pht_reg[42][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[42][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[42] [1]));
  FDPE \pht_reg[43][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[43][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[43] [0]));
  FDCE \pht_reg[43][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[43][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[43] [1]));
  FDPE \pht_reg[44][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[44][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[44] [0]));
  FDCE \pht_reg[44][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[44][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[44] [1]));
  FDPE \pht_reg[45][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[45][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[45] [0]));
  FDCE \pht_reg[45][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[45][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[45] [1]));
  FDPE \pht_reg[46][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[46][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[46] [0]));
  FDCE \pht_reg[46][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[46][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[46] [1]));
  FDPE \pht_reg[47][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[47][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[47] [0]));
  FDCE \pht_reg[47][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[47][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[47][1]_i_2_n_0 ),
        .Q(\pht_reg[47] [1]));
  FDPE \pht_reg[48][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[48][1]_i_1_n_0 ),
        .D(\pht[63][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[48] [0]));
  FDCE \pht_reg[48][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[48][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[48][1]_i_2_n_0 ),
        .Q(\pht_reg[48] [1]));
  FDPE \pht_reg[49][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[49][1]_i_1_n_0 ),
        .D(\pht[49][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[49] [0]));
  FDCE \pht_reg[49][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[49][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[49] [1]));
  FDPE \pht_reg[4][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[4][1]_i_1_n_0 ),
        .D(\pht[4][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[4] [0]));
  FDCE \pht_reg[4][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[4][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[4] [1]));
  FDPE \pht_reg[50][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[50][1]_i_1_n_0 ),
        .D(\pht[50][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[50] [0]));
  FDCE \pht_reg[50][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[50][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[50] [1]));
  FDPE \pht_reg[51][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[51][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[51] [0]));
  FDCE \pht_reg[51][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[51][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[51] [1]));
  FDPE \pht_reg[52][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[52][1]_i_1_n_0 ),
        .D(\pht[52][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[52] [0]));
  FDCE \pht_reg[52][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[52][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[52][1]_i_2_n_0 ),
        .Q(\pht_reg[52] [1]));
  FDPE \pht_reg[53][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[53][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[53] [0]));
  FDCE \pht_reg[53][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[53][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[53] [1]));
  FDPE \pht_reg[54][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[54][1]_i_1_n_0 ),
        .D(\pht[54][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[54] [0]));
  FDCE \pht_reg[54][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[54][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[54][1]_i_2_n_0 ),
        .Q(\pht_reg[54] [1]));
  FDPE \pht_reg[55][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[55][1]_i_1_n_0 ),
        .D(\pht[55][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[55] [0]));
  FDCE \pht_reg[55][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[55][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[55] [1]));
  FDPE \pht_reg[56][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[56][1]_i_1_n_0 ),
        .D(\pht[60][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[56] [0]));
  FDCE \pht_reg[56][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[56][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[56] [1]));
  FDPE \pht_reg[57][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[57][1]_i_1_n_0 ),
        .D(\pht[57][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[57] [0]));
  FDCE \pht_reg[57][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[57][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[57] [1]));
  FDPE \pht_reg[58][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[58][1]_i_1_n_0 ),
        .D(\pht[58][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[58] [0]));
  FDCE \pht_reg[58][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[58][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[58] [1]));
  FDPE \pht_reg[59][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[59][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[59] [0]));
  FDCE \pht_reg[59][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[59][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[59] [1]));
  FDPE \pht_reg[5][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[5][1]_i_1_n_0 ),
        .D(\pht[5][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[5] [0]));
  FDCE \pht_reg[5][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[5][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[5] [1]));
  FDPE \pht_reg[60][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[60][1]_i_1_n_0 ),
        .D(\pht[60][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[60] [0]));
  FDCE \pht_reg[60][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[60][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[60] [1]));
  FDPE \pht_reg[61][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[61][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[61] [0]));
  FDCE \pht_reg[61][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[61][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[61] [1]));
  FDPE \pht_reg[62][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[62][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[62] [0]));
  FDCE \pht_reg[62][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[62][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[62] [1]));
  FDPE \pht_reg[63][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[63][1]_i_1_n_0 ),
        .D(\pht[63][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[63] [0]));
  FDCE \pht_reg[63][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[63][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[63][1]_i_2_n_0 ),
        .Q(\pht_reg[63] [1]));
  FDPE \pht_reg[64][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[64][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[64] [0]));
  FDCE \pht_reg[64][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[64][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[64] [1]));
  FDPE \pht_reg[65][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[65][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[65] [0]));
  FDCE \pht_reg[65][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[65][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[65][1]_i_2_n_0 ),
        .Q(\pht_reg[65] [1]));
  FDPE \pht_reg[66][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[66][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[66] [0]));
  FDCE \pht_reg[66][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[66][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[66] [1]));
  FDPE \pht_reg[67][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[67][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[67] [0]));
  FDCE \pht_reg[67][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[67][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[67][1]_i_2_n_0 ),
        .Q(\pht_reg[67] [1]));
  FDPE \pht_reg[68][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[68][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[68] [0]));
  FDCE \pht_reg[68][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[68][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[68][1]_i_2_n_0 ),
        .Q(\pht_reg[68] [1]));
  FDPE \pht_reg[69][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[69][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[69] [0]));
  FDCE \pht_reg[69][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[69][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[69] [1]));
  FDPE \pht_reg[6][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[6][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[6] [0]));
  FDCE \pht_reg[6][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[6][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[6] [1]));
  FDPE \pht_reg[70][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[70][1]_i_1_n_0 ),
        .D(\pht[70][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[70] [0]));
  FDCE \pht_reg[70][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[70][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[70] [1]));
  FDPE \pht_reg[71][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[71][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[71] [0]));
  FDCE \pht_reg[71][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[71][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[71] [1]));
  FDPE \pht_reg[72][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[72][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[72] [0]));
  FDCE \pht_reg[72][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[72][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[72] [1]));
  FDPE \pht_reg[73][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[73][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[73] [0]));
  FDCE \pht_reg[73][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[73][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[73] [1]));
  FDPE \pht_reg[74][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[74][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[74] [0]));
  FDCE \pht_reg[74][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[74][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[74] [1]));
  FDPE \pht_reg[75][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[75][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[75] [0]));
  FDCE \pht_reg[75][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[75][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[75] [1]));
  FDPE \pht_reg[76][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[76][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[76] [0]));
  FDCE \pht_reg[76][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[76][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[76] [1]));
  FDPE \pht_reg[77][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[77][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[77] [0]));
  FDCE \pht_reg[77][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[77][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[77] [1]));
  FDPE \pht_reg[78][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[78][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[78] [0]));
  FDCE \pht_reg[78][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[78][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[78] [1]));
  FDPE \pht_reg[79][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[79][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[79] [0]));
  FDCE \pht_reg[79][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[79][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[79][1]_i_2_n_0 ),
        .Q(\pht_reg[79] [1]));
  FDPE \pht_reg[7][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[7][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[7] [0]));
  FDCE \pht_reg[7][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[7][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[7] [1]));
  FDPE \pht_reg[80][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[80][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[80] [0]));
  FDCE \pht_reg[80][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[80][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[80] [1]));
  FDPE \pht_reg[81][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[81][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[81] [0]));
  FDCE \pht_reg[81][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[81][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[81] [1]));
  FDPE \pht_reg[82][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[82][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[82] [0]));
  FDCE \pht_reg[82][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[82][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[82] [1]));
  FDPE \pht_reg[83][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[83][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[83] [0]));
  FDCE \pht_reg[83][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[83][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[83] [1]));
  FDPE \pht_reg[84][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[84][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[84] [0]));
  FDCE \pht_reg[84][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[84][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[84][1]_i_2_n_0 ),
        .Q(\pht_reg[84] [1]));
  FDPE \pht_reg[85][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[85][1]_i_1_n_0 ),
        .D(\pht[118][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[85] [0]));
  FDCE \pht_reg[85][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[85][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[85][1]_i_2_n_0 ),
        .Q(\pht_reg[85] [1]));
  FDPE \pht_reg[86][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[86][1]_i_1_n_0 ),
        .D(\pht[118][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[86] [0]));
  FDCE \pht_reg[86][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[86][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[86][1]_i_2_n_0 ),
        .Q(\pht_reg[86] [1]));
  FDPE \pht_reg[87][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[87][1]_i_1_n_0 ),
        .D(\pht[98][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[87] [0]));
  FDCE \pht_reg[87][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[87][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[87][1]_i_2_n_0 ),
        .Q(\pht_reg[87] [1]));
  FDPE \pht_reg[88][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[88][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[88] [0]));
  FDCE \pht_reg[88][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[88][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[88] [1]));
  FDPE \pht_reg[89][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[89][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[89] [0]));
  FDCE \pht_reg[89][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[89][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[89] [1]));
  FDPE \pht_reg[8][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[8][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[8] [0]));
  FDCE \pht_reg[8][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[8][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[8] [1]));
  FDPE \pht_reg[90][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[90][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[90] [0]));
  FDCE \pht_reg[90][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[90][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[90] [1]));
  FDPE \pht_reg[91][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[91][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[91] [0]));
  FDCE \pht_reg[91][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[91][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[91] [1]));
  FDPE \pht_reg[92][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[92][1]_i_1_n_0 ),
        .D(\pht[127][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[92] [0]));
  FDCE \pht_reg[92][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[92][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[92] [1]));
  FDPE \pht_reg[93][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[93][1]_i_1_n_0 ),
        .D(\pht[93][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[93] [0]));
  FDCE \pht_reg[93][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[93][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[93] [1]));
  FDPE \pht_reg[94][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[94][1]_i_1_n_0 ),
        .D(\pht[94][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[94] [0]));
  FDCE \pht_reg[94][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[94][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[94] [1]));
  FDPE \pht_reg[95][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[95][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[95] [0]));
  FDCE \pht_reg[95][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[95][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[95][1]_i_2_n_0 ),
        .Q(\pht_reg[95] [1]));
  FDPE \pht_reg[96][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[96][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[96] [0]));
  FDCE \pht_reg[96][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[96][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[96] [1]));
  FDPE \pht_reg[97][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[97][1]_i_1_n_0 ),
        .D(\pht[98][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[97] [0]));
  FDCE \pht_reg[97][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[97][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[97][1]_i_2_n_0 ),
        .Q(\pht_reg[97] [1]));
  FDPE \pht_reg[98][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[98][1]_i_1_n_0 ),
        .D(\pht[98][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[98] [0]));
  FDCE \pht_reg[98][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[98][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[98][1]_i_2_n_0 ),
        .Q(\pht_reg[98] [1]));
  FDPE \pht_reg[99][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[99][1]_i_1_n_0 ),
        .D(\pht[126][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[99] [0]));
  FDCE \pht_reg[99][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[99][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[111][1]_i_2_n_0 ),
        .Q(\pht_reg[99] [1]));
  FDPE \pht_reg[9][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[9][1]_i_1_n_0 ),
        .D(\pht[62][0]_i_1_n_0 ),
        .PRE(areset_IBUF),
        .Q(\pht_reg[9] [0]));
  FDCE \pht_reg[9][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[9][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\pht[15][1]_i_2_n_0 ),
        .Q(\pht_reg[9] [1]));
  OBUF \predict_history_OBUF[0]_inst 
       (.I(predict_history_OBUF[0]),
        .O(predict_history[0]));
  OBUF \predict_history_OBUF[1]_inst 
       (.I(predict_history_OBUF[1]),
        .O(predict_history[1]));
  OBUF \predict_history_OBUF[2]_inst 
       (.I(predict_history_OBUF[2]),
        .O(predict_history[2]));
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
  LUT6 #(
    .INIT(64'hFFFFFFFF55555554)) 
    \predict_history_r[0]_i_1 
       (.I0(\predict_history_r[0]_i_2_n_0 ),
        .I1(\predict_history_r[0]_i_3_n_0 ),
        .I2(\predict_history_r[0]_i_4_n_0 ),
        .I3(\predict_history_r[0]_i_5_n_0 ),
        .I4(\predict_history_r[0]_i_6_n_0 ),
        .I5(\predict_history_r[0]_i_7_n_0 ),
        .O(\predict_history_r[0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFAEFFAEFFFFFFAE)) 
    \predict_history_r[0]_i_10 
       (.I0(predict_taken_OBUF_inst_i_36_n_0),
        .I1(predict_taken_OBUF_inst_i_27_n_0),
        .I2(\predict_history_r[0]_i_15_n_0 ),
        .I3(predict_taken_OBUF_inst_i_34_n_0),
        .I4(\pht_reg[1] [1]),
        .I5(predict_taken_OBUF_inst_i_28_n_0),
        .O(\predict_history_r[0]_i_10_n_0 ));
  LUT6 #(
    .INIT(64'h44F444F4FFFF44F4)) 
    \predict_history_r[0]_i_11 
       (.I0(\predict_history_r[0]_i_16_n_0 ),
        .I1(\pht_reg[12] [1]),
        .I2(\pht_reg[2] [1]),
        .I3(predict_taken_OBUF_inst_i_38_n_0),
        .I4(\pht_reg[3] [1]),
        .I5(predict_taken_OBUF_inst_i_37_n_0),
        .O(\predict_history_r[0]_i_11_n_0 ));
  LUT5 #(
    .INIT(32'hFFFFFFAE)) 
    \predict_history_r[0]_i_12 
       (.I0(predict_taken_OBUF_inst_i_17_n_0),
        .I1(\pht_reg[104] [1]),
        .I2(predict_taken_OBUF_inst_i_15_n_0),
        .I3(\predict_history_r[0]_i_17_n_0 ),
        .I4(predict_taken_OBUF_inst_i_44_n_0),
        .O(\predict_history_r[0]_i_12_n_0 ));
  LUT4 #(
    .INIT(16'hFFF4)) 
    \predict_history_r[0]_i_13 
       (.I0(predict_taken_OBUF_inst_i_10_n_0),
        .I1(\pht_reg[62] [1]),
        .I2(predict_taken_OBUF_inst_i_55_n_0),
        .I3(\predict_history_r[0]_i_18_n_0 ),
        .O(\predict_history_r[0]_i_13_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \predict_history_r[0]_i_14 
       (.I0(\pht_reg[65] [1]),
        .I1(predict_taken_OBUF_inst_i_28_n_0),
        .I2(predict_taken_OBUF_inst_i_27_n_0),
        .I3(predict_taken_OBUF_inst_i_26_n_0),
        .I4(predict_taken_OBUF_inst_i_25_n_0),
        .O(\predict_history_r[0]_i_14_n_0 ));
  LUT6 #(
    .INIT(64'h3300550F33FF550F)) 
    \predict_history_r[0]_i_15 
       (.I0(\pht_reg[6] [1]),
        .I1(\pht_reg[7] [1]),
        .I2(\pht_reg[4] [1]),
        .I3(predict_taken_OBUF_inst_i_60_n_0),
        .I4(predict_taken_OBUF_inst_i_61_n_0),
        .I5(\pht_reg[5] [1]),
        .O(\predict_history_r[0]_i_15_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT5 #(
    .INIT(32'hFFEBEBFF)) 
    \predict_history_r[0]_i_16 
       (.I0(predict_taken_OBUF_inst_i_40_n_0),
        .I1(predict_history_OBUF[2]),
        .I2(predict_pc_IBUF[2]),
        .I3(predict_history_OBUF[3]),
        .I4(predict_pc_IBUF[3]),
        .O(\predict_history_r[0]_i_16_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \predict_history_r[0]_i_17 
       (.I0(\pht_reg[98] [1]),
        .I1(predict_taken_OBUF_inst_i_38_n_0),
        .I2(\pht_reg[99] [1]),
        .I3(predict_taken_OBUF_inst_i_37_n_0),
        .I4(predict_taken_OBUF_inst_i_45_n_0),
        .O(\predict_history_r[0]_i_17_n_0 ));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    \predict_history_r[0]_i_18 
       (.I0(\pht_reg[49] [1]),
        .I1(predict_taken_OBUF_inst_i_28_n_0),
        .I2(predict_taken_OBUF_inst_i_27_n_0),
        .I3(predict_taken_OBUF_inst_i_54_n_0),
        .I4(predict_taken_OBUF_inst_i_53_n_0),
        .O(\predict_history_r[0]_i_18_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT3 #(
    .INIT(8'h8F)) 
    \predict_history_r[0]_i_2 
       (.I0(train_mispredicted_IBUF),
        .I1(train_valid_IBUF),
        .I2(predict_valid_IBUF),
        .O(\predict_history_r[0]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h00000000EEE20000)) 
    \predict_history_r[0]_i_3 
       (.I0(predict_taken_OBUF_inst_i_12_n_0),
        .I1(predict_taken_OBUF_inst_i_11_n_0),
        .I2(\predict_history_r[0]_i_8_n_0 ),
        .I3(predict_taken_OBUF_inst_i_8_n_0),
        .I4(predict_taken_OBUF_inst_i_5_n_0),
        .I5(predict_taken_OBUF_inst_i_6_n_0),
        .O(\predict_history_r[0]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h000000000000EEE2)) 
    \predict_history_r[0]_i_4 
       (.I0(\predict_history_r[0]_i_9_n_0 ),
        .I1(predict_taken_OBUF_inst_i_11_n_0),
        .I2(\predict_history_r[0]_i_10_n_0 ),
        .I3(\predict_history_r[0]_i_11_n_0 ),
        .I4(predict_taken_OBUF_inst_i_5_n_0),
        .I5(predict_taken_OBUF_inst_i_6_n_0),
        .O(\predict_history_r[0]_i_4_n_0 ));
  LUT6 #(
    .INIT(64'hEB28000000000000)) 
    \predict_history_r[0]_i_5 
       (.I0(predict_taken_OBUF_inst_i_19_n_0),
        .I1(predict_pc_IBUF[4]),
        .I2(predict_history_OBUF[4]),
        .I3(\predict_history_r[0]_i_12_n_0 ),
        .I4(predict_taken_OBUF_inst_i_5_n_0),
        .I5(predict_taken_OBUF_inst_i_6_n_0),
        .O(\predict_history_r[0]_i_5_n_0 ));
  LUT6 #(
    .INIT(64'h00000000FE0E0000)) 
    \predict_history_r[0]_i_6 
       (.I0(\predict_history_r[0]_i_13_n_0 ),
        .I1(predict_taken_OBUF_inst_i_21_n_0),
        .I2(predict_taken_OBUF_inst_i_11_n_0),
        .I3(predict_taken_OBUF_inst_i_20_n_0),
        .I4(predict_taken_OBUF_inst_i_6_n_0),
        .I5(predict_taken_OBUF_inst_i_5_n_0),
        .O(\predict_history_r[0]_i_6_n_0 ));
  LUT3 #(
    .INIT(8'h80)) 
    \predict_history_r[0]_i_7 
       (.I0(train_mispredicted_IBUF),
        .I1(train_valid_IBUF),
        .I2(train_taken_IBUF),
        .O(\predict_history_r[0]_i_7_n_0 ));
  LUT4 #(
    .INIT(16'hFFF4)) 
    \predict_history_r[0]_i_8 
       (.I0(predict_taken_OBUF_inst_i_10_n_0),
        .I1(\pht_reg[78] [1]),
        .I2(predict_taken_OBUF_inst_i_29_n_0),
        .I3(\predict_history_r[0]_i_14_n_0 ),
        .O(\predict_history_r[0]_i_8_n_0 ));
  LUT4 #(
    .INIT(16'hFFAE)) 
    \predict_history_r[0]_i_9 
       (.I0(predict_taken_OBUF_inst_i_14_n_0),
        .I1(\pht_reg[24] [1]),
        .I2(predict_taken_OBUF_inst_i_15_n_0),
        .I3(predict_taken_OBUF_inst_i_16_n_0),
        .O(\predict_history_r[0]_i_9_n_0 ));
  LUT5 #(
    .INIT(32'hF8880888)) 
    \predict_history_r[1]_i_1 
       (.I0(predict_valid_IBUF),
        .I1(predict_history_OBUF[0]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .I4(train_history_IBUF[0]),
        .O(\predict_history_r[1]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hF8880888)) 
    \predict_history_r[2]_i_1 
       (.I0(predict_valid_IBUF),
        .I1(predict_history_OBUF[1]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .I4(train_history_IBUF[1]),
        .O(\predict_history_r[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT5 #(
    .INIT(32'hF8880888)) 
    \predict_history_r[3]_i_1 
       (.I0(predict_valid_IBUF),
        .I1(predict_history_OBUF[2]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .I4(train_history_IBUF[2]),
        .O(\predict_history_r[3]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hF8880888)) 
    \predict_history_r[4]_i_1 
       (.I0(predict_valid_IBUF),
        .I1(predict_history_OBUF[3]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .I4(train_history_IBUF[3]),
        .O(\predict_history_r[4]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hF8880888)) 
    \predict_history_r[5]_i_1 
       (.I0(predict_valid_IBUF),
        .I1(predict_history_OBUF[4]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .I4(train_history_IBUF[4]),
        .O(\predict_history_r[5]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hEA)) 
    \predict_history_r[6]_i_1 
       (.I0(predict_valid_IBUF),
        .I1(train_mispredicted_IBUF),
        .I2(train_valid_IBUF),
        .O(\predict_history_r[6]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hF8880888)) 
    \predict_history_r[6]_i_2 
       (.I0(predict_valid_IBUF),
        .I1(predict_history_OBUF[5]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .I4(train_history_IBUF[5]),
        .O(\predict_history_r[6]_i_2_n_0 ));
  FDCE \predict_history_r_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\predict_history_r[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\predict_history_r[0]_i_1_n_0 ),
        .Q(predict_history_OBUF[0]));
  FDCE \predict_history_r_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\predict_history_r[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\predict_history_r[1]_i_1_n_0 ),
        .Q(predict_history_OBUF[1]));
  FDCE \predict_history_r_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\predict_history_r[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\predict_history_r[2]_i_1_n_0 ),
        .Q(predict_history_OBUF[2]));
  FDCE \predict_history_r_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\predict_history_r[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\predict_history_r[3]_i_1_n_0 ),
        .Q(predict_history_OBUF[3]));
  FDCE \predict_history_r_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\predict_history_r[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\predict_history_r[4]_i_1_n_0 ),
        .Q(predict_history_OBUF[4]));
  FDCE \predict_history_r_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\predict_history_r[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\predict_history_r[5]_i_1_n_0 ),
        .Q(predict_history_OBUF[5]));
  FDCE \predict_history_r_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\predict_history_r[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\predict_history_r[6]_i_2_n_0 ),
        .Q(predict_history_OBUF[6]));
  IBUF \predict_pc_IBUF[0]_inst 
       (.I(predict_pc[0]),
        .O(predict_pc_IBUF[0]));
  IBUF \predict_pc_IBUF[1]_inst 
       (.I(predict_pc[1]),
        .O(predict_pc_IBUF[1]));
  IBUF \predict_pc_IBUF[2]_inst 
       (.I(predict_pc[2]),
        .O(predict_pc_IBUF[2]));
  IBUF \predict_pc_IBUF[3]_inst 
       (.I(predict_pc[3]),
        .O(predict_pc_IBUF[3]));
  IBUF \predict_pc_IBUF[4]_inst 
       (.I(predict_pc[4]),
        .O(predict_pc_IBUF[4]));
  IBUF \predict_pc_IBUF[5]_inst 
       (.I(predict_pc[5]),
        .O(predict_pc_IBUF[5]));
  IBUF \predict_pc_IBUF[6]_inst 
       (.I(predict_pc[6]),
        .O(predict_pc_IBUF[6]));
  OBUF predict_taken_OBUF_inst
       (.I(predict_taken_OBUF),
        .O(predict_taken));
  LUT6 #(
    .INIT(64'hF0FFAACCF000AACC)) 
    predict_taken_OBUF_inst_i_1
       (.I0(predict_taken_OBUF_inst_i_2_n_0),
        .I1(predict_taken_OBUF_inst_i_3_n_0),
        .I2(predict_taken_OBUF_inst_i_4_n_0),
        .I3(predict_taken_OBUF_inst_i_5_n_0),
        .I4(predict_taken_OBUF_inst_i_6_n_0),
        .I5(predict_taken_OBUF_inst_i_7_n_0),
        .O(predict_taken_OBUF));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT5 #(
    .INIT(32'hFFEBEBFF)) 
    predict_taken_OBUF_inst_i_10
       (.I0(predict_taken_OBUF_inst_i_30_n_0),
        .I1(predict_history_OBUF[2]),
        .I2(predict_pc_IBUF[2]),
        .I3(predict_history_OBUF[3]),
        .I4(predict_pc_IBUF[3]),
        .O(predict_taken_OBUF_inst_i_10_n_0));
  LUT2 #(
    .INIT(4'h9)) 
    predict_taken_OBUF_inst_i_11
       (.I0(predict_history_OBUF[4]),
        .I1(predict_pc_IBUF[4]),
        .O(predict_taken_OBUF_inst_i_11_n_0));
  LUT5 #(
    .INIT(32'hFFFFFFAE)) 
    predict_taken_OBUF_inst_i_12
       (.I0(predict_taken_OBUF_inst_i_31_n_0),
        .I1(\pht_reg[88] [1]),
        .I2(predict_taken_OBUF_inst_i_15_n_0),
        .I3(predict_taken_OBUF_inst_i_32_n_0),
        .I4(predict_taken_OBUF_inst_i_33_n_0),
        .O(predict_taken_OBUF_inst_i_12_n_0));
  LUT6 #(
    .INIT(64'hFFFFFFFFFFFFFFBA)) 
    predict_taken_OBUF_inst_i_13
       (.I0(\predict_history_r[0]_i_11_n_0 ),
        .I1(predict_taken_OBUF_inst_i_28_n_0),
        .I2(\pht_reg[1] [1]),
        .I3(predict_taken_OBUF_inst_i_34_n_0),
        .I4(predict_taken_OBUF_inst_i_35_n_0),
        .I5(predict_taken_OBUF_inst_i_36_n_0),
        .O(predict_taken_OBUF_inst_i_13_n_0));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    predict_taken_OBUF_inst_i_14
       (.I0(\pht_reg[19] [1]),
        .I1(predict_taken_OBUF_inst_i_37_n_0),
        .I2(\pht_reg[18] [1]),
        .I3(predict_taken_OBUF_inst_i_38_n_0),
        .I4(predict_taken_OBUF_inst_i_39_n_0),
        .O(predict_taken_OBUF_inst_i_14_n_0));
  LUT5 #(
    .INIT(32'hFFFF9FF9)) 
    predict_taken_OBUF_inst_i_15
       (.I0(predict_history_OBUF[3]),
        .I1(predict_pc_IBUF[3]),
        .I2(predict_history_OBUF[2]),
        .I3(predict_pc_IBUF[2]),
        .I4(predict_taken_OBUF_inst_i_40_n_0),
        .O(predict_taken_OBUF_inst_i_15_n_0));
  LUT6 #(
    .INIT(64'hFFFFFFFFF4F4FFF4)) 
    predict_taken_OBUF_inst_i_16
       (.I0(predict_taken_OBUF_inst_i_41_n_0),
        .I1(predict_taken_OBUF_inst_i_27_n_0),
        .I2(predict_taken_OBUF_inst_i_42_n_0),
        .I3(\pht_reg[17] [1]),
        .I4(predict_taken_OBUF_inst_i_28_n_0),
        .I5(predict_taken_OBUF_inst_i_43_n_0),
        .O(predict_taken_OBUF_inst_i_16_n_0));
  LUT6 #(
    .INIT(64'h44F444F4FFFF44F4)) 
    predict_taken_OBUF_inst_i_17
       (.I0(predict_taken_OBUF_inst_i_10_n_0),
        .I1(\pht_reg[110] [1]),
        .I2(\pht_reg[111] [1]),
        .I3(predict_taken_OBUF_inst_i_23_n_0),
        .I4(\pht_reg[109] [1]),
        .I5(predict_taken_OBUF_inst_i_24_n_0),
        .O(predict_taken_OBUF_inst_i_17_n_0));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    predict_taken_OBUF_inst_i_18
       (.I0(predict_taken_OBUF_inst_i_44_n_0),
        .I1(predict_taken_OBUF_inst_i_45_n_0),
        .I2(predict_taken_OBUF_inst_i_37_n_0),
        .I3(\pht_reg[99] [1]),
        .I4(predict_taken_OBUF_inst_i_38_n_0),
        .I5(\pht_reg[98] [1]),
        .O(predict_taken_OBUF_inst_i_18_n_0));
  LUT5 #(
    .INIT(32'hFFBAFFFF)) 
    predict_taken_OBUF_inst_i_19
       (.I0(predict_taken_OBUF_inst_i_46_n_0),
        .I1(predict_taken_OBUF_inst_i_47_n_0),
        .I2(predict_taken_OBUF_inst_i_27_n_0),
        .I3(predict_taken_OBUF_inst_i_48_n_0),
        .I4(predict_taken_OBUF_inst_i_49_n_0),
        .O(predict_taken_OBUF_inst_i_19_n_0));
  LUT6 #(
    .INIT(64'hEEFEFFFFEEFE0000)) 
    predict_taken_OBUF_inst_i_2
       (.I0(predict_taken_OBUF_inst_i_8_n_0),
        .I1(predict_taken_OBUF_inst_i_9_n_0),
        .I2(\pht_reg[78] [1]),
        .I3(predict_taken_OBUF_inst_i_10_n_0),
        .I4(predict_taken_OBUF_inst_i_11_n_0),
        .I5(predict_taken_OBUF_inst_i_12_n_0),
        .O(predict_taken_OBUF_inst_i_2_n_0));
  LUT5 #(
    .INIT(32'hFFFFFFAE)) 
    predict_taken_OBUF_inst_i_20
       (.I0(predict_taken_OBUF_inst_i_50_n_0),
        .I1(\pht_reg[46] [1]),
        .I2(predict_taken_OBUF_inst_i_10_n_0),
        .I3(predict_taken_OBUF_inst_i_51_n_0),
        .I4(predict_taken_OBUF_inst_i_52_n_0),
        .O(predict_taken_OBUF_inst_i_20_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_21
       (.I0(predict_taken_OBUF_inst_i_23_n_0),
        .I1(\pht_reg[63] [1]),
        .I2(predict_taken_OBUF_inst_i_24_n_0),
        .I3(\pht_reg[61] [1]),
        .O(predict_taken_OBUF_inst_i_21_n_0));
  LUT6 #(
    .INIT(64'hFFFFFFFFBAFFBABA)) 
    predict_taken_OBUF_inst_i_22
       (.I0(predict_taken_OBUF_inst_i_53_n_0),
        .I1(predict_taken_OBUF_inst_i_54_n_0),
        .I2(predict_taken_OBUF_inst_i_27_n_0),
        .I3(predict_taken_OBUF_inst_i_28_n_0),
        .I4(\pht_reg[49] [1]),
        .I5(predict_taken_OBUF_inst_i_55_n_0),
        .O(predict_taken_OBUF_inst_i_22_n_0));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT5 #(
    .INIT(32'hFFEBEBFF)) 
    predict_taken_OBUF_inst_i_23
       (.I0(predict_taken_OBUF_inst_i_56_n_0),
        .I1(predict_history_OBUF[2]),
        .I2(predict_pc_IBUF[2]),
        .I3(predict_history_OBUF[3]),
        .I4(predict_pc_IBUF[3]),
        .O(predict_taken_OBUF_inst_i_23_n_0));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT5 #(
    .INIT(32'hFFEBEBFF)) 
    predict_taken_OBUF_inst_i_24
       (.I0(predict_taken_OBUF_inst_i_57_n_0),
        .I1(predict_history_OBUF[2]),
        .I2(predict_pc_IBUF[2]),
        .I3(predict_history_OBUF[3]),
        .I4(predict_pc_IBUF[3]),
        .O(predict_taken_OBUF_inst_i_24_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_25
       (.I0(predict_taken_OBUF_inst_i_58_n_0),
        .I1(\pht_reg[73] [1]),
        .I2(predict_taken_OBUF_inst_i_59_n_0),
        .I3(\pht_reg[74] [1]),
        .O(predict_taken_OBUF_inst_i_25_n_0));
  LUT6 #(
    .INIT(64'h3300550F33FF550F)) 
    predict_taken_OBUF_inst_i_26
       (.I0(\pht_reg[70] [1]),
        .I1(\pht_reg[71] [1]),
        .I2(\pht_reg[68] [1]),
        .I3(predict_taken_OBUF_inst_i_60_n_0),
        .I4(predict_taken_OBUF_inst_i_61_n_0),
        .I5(\pht_reg[69] [1]),
        .O(predict_taken_OBUF_inst_i_26_n_0));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT4 #(
    .INIT(16'h6006)) 
    predict_taken_OBUF_inst_i_27
       (.I0(predict_pc_IBUF[2]),
        .I1(predict_history_OBUF[2]),
        .I2(predict_pc_IBUF[3]),
        .I3(predict_history_OBUF[3]),
        .O(predict_taken_OBUF_inst_i_27_n_0));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT5 #(
    .INIT(32'hFFFF6FF6)) 
    predict_taken_OBUF_inst_i_28
       (.I0(predict_history_OBUF[2]),
        .I1(predict_pc_IBUF[2]),
        .I2(predict_history_OBUF[3]),
        .I3(predict_pc_IBUF[3]),
        .I4(predict_taken_OBUF_inst_i_57_n_0),
        .O(predict_taken_OBUF_inst_i_28_n_0));
  LUT6 #(
    .INIT(64'hFFFFFFFFFFFF22F2)) 
    predict_taken_OBUF_inst_i_29
       (.I0(\pht_reg[76] [1]),
        .I1(\predict_history_r[0]_i_16_n_0 ),
        .I2(\pht_reg[75] [1]),
        .I3(predict_taken_OBUF_inst_i_62_n_0),
        .I4(predict_taken_OBUF_inst_i_63_n_0),
        .I5(predict_taken_OBUF_inst_i_64_n_0),
        .O(predict_taken_OBUF_inst_i_29_n_0));
  LUT6 #(
    .INIT(64'hBBBBBBBBB8B8BBB8)) 
    predict_taken_OBUF_inst_i_3
       (.I0(predict_taken_OBUF_inst_i_13_n_0),
        .I1(predict_taken_OBUF_inst_i_11_n_0),
        .I2(predict_taken_OBUF_inst_i_14_n_0),
        .I3(\pht_reg[24] [1]),
        .I4(predict_taken_OBUF_inst_i_15_n_0),
        .I5(predict_taken_OBUF_inst_i_16_n_0),
        .O(predict_taken_OBUF_inst_i_3_n_0));
  (* SOFT_HLUTNM = "soft_lutpair19" *) 
  LUT4 #(
    .INIT(16'hF66F)) 
    predict_taken_OBUF_inst_i_30
       (.I0(predict_pc_IBUF[0]),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[1]),
        .I3(predict_history_OBUF[1]),
        .O(predict_taken_OBUF_inst_i_30_n_0));
  LUT6 #(
    .INIT(64'h44F444F4FFFF44F4)) 
    predict_taken_OBUF_inst_i_31
       (.I0(predict_taken_OBUF_inst_i_10_n_0),
        .I1(\pht_reg[94] [1]),
        .I2(\pht_reg[93] [1]),
        .I3(predict_taken_OBUF_inst_i_24_n_0),
        .I4(\pht_reg[95] [1]),
        .I5(predict_taken_OBUF_inst_i_23_n_0),
        .O(predict_taken_OBUF_inst_i_31_n_0));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    predict_taken_OBUF_inst_i_32
       (.I0(\pht_reg[82] [1]),
        .I1(predict_taken_OBUF_inst_i_38_n_0),
        .I2(\pht_reg[83] [1]),
        .I3(predict_taken_OBUF_inst_i_37_n_0),
        .I4(predict_taken_OBUF_inst_i_65_n_0),
        .O(predict_taken_OBUF_inst_i_32_n_0));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    predict_taken_OBUF_inst_i_33
       (.I0(predict_taken_OBUF_inst_i_66_n_0),
        .I1(predict_taken_OBUF_inst_i_67_n_0),
        .I2(predict_taken_OBUF_inst_i_58_n_0),
        .I3(\pht_reg[89] [1]),
        .I4(predict_taken_OBUF_inst_i_62_n_0),
        .I5(\pht_reg[91] [1]),
        .O(predict_taken_OBUF_inst_i_33_n_0));
  LUT5 #(
    .INIT(32'hAEAEFFAE)) 
    predict_taken_OBUF_inst_i_34
       (.I0(predict_taken_OBUF_inst_i_68_n_0),
        .I1(\pht_reg[8] [1]),
        .I2(predict_taken_OBUF_inst_i_15_n_0),
        .I3(\pht_reg[0] [1]),
        .I4(predict_taken_OBUF_inst_i_69_n_0),
        .O(predict_taken_OBUF_inst_i_34_n_0));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    predict_taken_OBUF_inst_i_35
       (.I0(predict_taken_OBUF_inst_i_27_n_0),
        .I1(predict_taken_OBUF_inst_i_70_n_0),
        .I2(\pht_reg[7] [1]),
        .I3(predict_taken_OBUF_inst_i_56_n_0),
        .I4(predict_taken_OBUF_inst_i_30_n_0),
        .I5(\pht_reg[6] [1]),
        .O(predict_taken_OBUF_inst_i_35_n_0));
  LUT6 #(
    .INIT(64'h44F444F4FFFF44F4)) 
    predict_taken_OBUF_inst_i_36
       (.I0(predict_taken_OBUF_inst_i_59_n_0),
        .I1(\pht_reg[10] [1]),
        .I2(\pht_reg[11] [1]),
        .I3(predict_taken_OBUF_inst_i_62_n_0),
        .I4(\pht_reg[9] [1]),
        .I5(predict_taken_OBUF_inst_i_58_n_0),
        .O(predict_taken_OBUF_inst_i_36_n_0));
  LUT5 #(
    .INIT(32'hFFFF6FF6)) 
    predict_taken_OBUF_inst_i_37
       (.I0(predict_history_OBUF[2]),
        .I1(predict_pc_IBUF[2]),
        .I2(predict_history_OBUF[3]),
        .I3(predict_pc_IBUF[3]),
        .I4(predict_taken_OBUF_inst_i_56_n_0),
        .O(predict_taken_OBUF_inst_i_37_n_0));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT5 #(
    .INIT(32'hBEFFFFBE)) 
    predict_taken_OBUF_inst_i_38
       (.I0(predict_taken_OBUF_inst_i_30_n_0),
        .I1(predict_history_OBUF[2]),
        .I2(predict_pc_IBUF[2]),
        .I3(predict_history_OBUF[3]),
        .I4(predict_pc_IBUF[3]),
        .O(predict_taken_OBUF_inst_i_38_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_39
       (.I0(\predict_history_r[0]_i_16_n_0 ),
        .I1(\pht_reg[28] [1]),
        .I2(predict_taken_OBUF_inst_i_69_n_0),
        .I3(\pht_reg[16] [1]),
        .O(predict_taken_OBUF_inst_i_39_n_0));
  LUT6 #(
    .INIT(64'hFFAEFFFFFFAE0000)) 
    predict_taken_OBUF_inst_i_4
       (.I0(predict_taken_OBUF_inst_i_17_n_0),
        .I1(\pht_reg[104] [1]),
        .I2(predict_taken_OBUF_inst_i_15_n_0),
        .I3(predict_taken_OBUF_inst_i_18_n_0),
        .I4(predict_taken_OBUF_inst_i_11_n_0),
        .I5(predict_taken_OBUF_inst_i_19_n_0),
        .O(predict_taken_OBUF_inst_i_4_n_0));
  (* SOFT_HLUTNM = "soft_lutpair20" *) 
  LUT4 #(
    .INIT(16'h6FF6)) 
    predict_taken_OBUF_inst_i_40
       (.I0(predict_pc_IBUF[0]),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[1]),
        .I3(predict_history_OBUF[1]),
        .O(predict_taken_OBUF_inst_i_40_n_0));
  LUT6 #(
    .INIT(64'h00330F55FF330F55)) 
    predict_taken_OBUF_inst_i_41
       (.I0(\pht_reg[20] [1]),
        .I1(\pht_reg[21] [1]),
        .I2(\pht_reg[22] [1]),
        .I3(predict_taken_OBUF_inst_i_60_n_0),
        .I4(predict_taken_OBUF_inst_i_61_n_0),
        .I5(\pht_reg[23] [1]),
        .O(predict_taken_OBUF_inst_i_41_n_0));
  LUT6 #(
    .INIT(64'h44F444F4FFFF44F4)) 
    predict_taken_OBUF_inst_i_42
       (.I0(predict_taken_OBUF_inst_i_59_n_0),
        .I1(\pht_reg[26] [1]),
        .I2(\pht_reg[25] [1]),
        .I3(predict_taken_OBUF_inst_i_58_n_0),
        .I4(\pht_reg[27] [1]),
        .I5(predict_taken_OBUF_inst_i_62_n_0),
        .O(predict_taken_OBUF_inst_i_42_n_0));
  LUT6 #(
    .INIT(64'h44F444F4FFFF44F4)) 
    predict_taken_OBUF_inst_i_43
       (.I0(predict_taken_OBUF_inst_i_10_n_0),
        .I1(\pht_reg[30] [1]),
        .I2(\pht_reg[29] [1]),
        .I3(predict_taken_OBUF_inst_i_24_n_0),
        .I4(\pht_reg[31] [1]),
        .I5(predict_taken_OBUF_inst_i_23_n_0),
        .O(predict_taken_OBUF_inst_i_43_n_0));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    predict_taken_OBUF_inst_i_44
       (.I0(predict_taken_OBUF_inst_i_71_n_0),
        .I1(predict_taken_OBUF_inst_i_72_n_0),
        .I2(predict_taken_OBUF_inst_i_58_n_0),
        .I3(\pht_reg[105] [1]),
        .I4(predict_taken_OBUF_inst_i_62_n_0),
        .I5(\pht_reg[107] [1]),
        .O(predict_taken_OBUF_inst_i_44_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_45
       (.I0(\predict_history_r[0]_i_16_n_0 ),
        .I1(\pht_reg[108] [1]),
        .I2(predict_taken_OBUF_inst_i_69_n_0),
        .I3(\pht_reg[96] [1]),
        .O(predict_taken_OBUF_inst_i_45_n_0));
  LUT6 #(
    .INIT(64'h44F444F4FFFF44F4)) 
    predict_taken_OBUF_inst_i_46
       (.I0(\predict_history_r[0]_i_16_n_0 ),
        .I1(\pht_reg[124] [1]),
        .I2(\pht_reg[114] [1]),
        .I3(predict_taken_OBUF_inst_i_38_n_0),
        .I4(\pht_reg[115] [1]),
        .I5(predict_taken_OBUF_inst_i_37_n_0),
        .O(predict_taken_OBUF_inst_i_46_n_0));
  LUT6 #(
    .INIT(64'h3300550F33FF550F)) 
    predict_taken_OBUF_inst_i_47
       (.I0(\pht_reg[118] [1]),
        .I1(\pht_reg[119] [1]),
        .I2(\pht_reg[116] [1]),
        .I3(predict_taken_OBUF_inst_i_60_n_0),
        .I4(predict_taken_OBUF_inst_i_61_n_0),
        .I5(\pht_reg[117] [1]),
        .O(predict_taken_OBUF_inst_i_47_n_0));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    predict_taken_OBUF_inst_i_48
       (.I0(\pht_reg[123] [1]),
        .I1(predict_taken_OBUF_inst_i_62_n_0),
        .I2(\pht_reg[121] [1]),
        .I3(predict_taken_OBUF_inst_i_58_n_0),
        .I4(predict_taken_OBUF_inst_i_73_n_0),
        .O(predict_taken_OBUF_inst_i_48_n_0));
  LUT5 #(
    .INIT(32'hA2A200A2)) 
    predict_taken_OBUF_inst_i_49
       (.I0(predict_taken_OBUF_inst_i_74_n_0),
        .I1(\pht_reg[120] [1]),
        .I2(predict_taken_OBUF_inst_i_15_n_0),
        .I3(\pht_reg[112] [1]),
        .I4(predict_taken_OBUF_inst_i_69_n_0),
        .O(predict_taken_OBUF_inst_i_49_n_0));
  LUT2 #(
    .INIT(4'h6)) 
    predict_taken_OBUF_inst_i_5
       (.I0(predict_history_OBUF[6]),
        .I1(predict_pc_IBUF[6]),
        .O(predict_taken_OBUF_inst_i_5_n_0));
  LUT6 #(
    .INIT(64'h44F444F4FFFF44F4)) 
    predict_taken_OBUF_inst_i_50
       (.I0(predict_taken_OBUF_inst_i_15_n_0),
        .I1(\pht_reg[40] [1]),
        .I2(\pht_reg[47] [1]),
        .I3(predict_taken_OBUF_inst_i_23_n_0),
        .I4(\pht_reg[45] [1]),
        .I5(predict_taken_OBUF_inst_i_24_n_0),
        .O(predict_taken_OBUF_inst_i_50_n_0));
  LUT5 #(
    .INIT(32'hFFFF22F2)) 
    predict_taken_OBUF_inst_i_51
       (.I0(\pht_reg[35] [1]),
        .I1(predict_taken_OBUF_inst_i_37_n_0),
        .I2(\pht_reg[34] [1]),
        .I3(predict_taken_OBUF_inst_i_38_n_0),
        .I4(predict_taken_OBUF_inst_i_75_n_0),
        .O(predict_taken_OBUF_inst_i_51_n_0));
  LUT6 #(
    .INIT(64'hEFEEFFFFEFEEEFEE)) 
    predict_taken_OBUF_inst_i_52
       (.I0(predict_taken_OBUF_inst_i_76_n_0),
        .I1(predict_taken_OBUF_inst_i_77_n_0),
        .I2(predict_taken_OBUF_inst_i_62_n_0),
        .I3(\pht_reg[43] [1]),
        .I4(predict_taken_OBUF_inst_i_58_n_0),
        .I5(\pht_reg[41] [1]),
        .O(predict_taken_OBUF_inst_i_52_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_53
       (.I0(predict_taken_OBUF_inst_i_59_n_0),
        .I1(\pht_reg[58] [1]),
        .I2(predict_taken_OBUF_inst_i_58_n_0),
        .I3(\pht_reg[57] [1]),
        .O(predict_taken_OBUF_inst_i_53_n_0));
  LUT6 #(
    .INIT(64'h3300550F33FF550F)) 
    predict_taken_OBUF_inst_i_54
       (.I0(\pht_reg[54] [1]),
        .I1(\pht_reg[55] [1]),
        .I2(\pht_reg[52] [1]),
        .I3(predict_taken_OBUF_inst_i_60_n_0),
        .I4(predict_taken_OBUF_inst_i_61_n_0),
        .I5(\pht_reg[53] [1]),
        .O(predict_taken_OBUF_inst_i_54_n_0));
  LUT6 #(
    .INIT(64'hFFFFFFFFFFFF22F2)) 
    predict_taken_OBUF_inst_i_55
       (.I0(\pht_reg[60] [1]),
        .I1(\predict_history_r[0]_i_16_n_0 ),
        .I2(\pht_reg[59] [1]),
        .I3(predict_taken_OBUF_inst_i_62_n_0),
        .I4(predict_taken_OBUF_inst_i_78_n_0),
        .I5(predict_taken_OBUF_inst_i_79_n_0),
        .O(predict_taken_OBUF_inst_i_55_n_0));
  (* SOFT_HLUTNM = "soft_lutpair19" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    predict_taken_OBUF_inst_i_56
       (.I0(predict_pc_IBUF[0]),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[1]),
        .I3(predict_history_OBUF[1]),
        .O(predict_taken_OBUF_inst_i_56_n_0));
  (* SOFT_HLUTNM = "soft_lutpair20" *) 
  LUT4 #(
    .INIT(16'hF66F)) 
    predict_taken_OBUF_inst_i_57
       (.I0(predict_pc_IBUF[1]),
        .I1(predict_history_OBUF[1]),
        .I2(predict_pc_IBUF[0]),
        .I3(predict_history_OBUF[0]),
        .O(predict_taken_OBUF_inst_i_57_n_0));
  LUT5 #(
    .INIT(32'hFFFF9FF9)) 
    predict_taken_OBUF_inst_i_58
       (.I0(predict_history_OBUF[3]),
        .I1(predict_pc_IBUF[3]),
        .I2(predict_history_OBUF[2]),
        .I3(predict_pc_IBUF[2]),
        .I4(predict_taken_OBUF_inst_i_57_n_0),
        .O(predict_taken_OBUF_inst_i_58_n_0));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT5 #(
    .INIT(32'hEBFFFFEB)) 
    predict_taken_OBUF_inst_i_59
       (.I0(predict_taken_OBUF_inst_i_30_n_0),
        .I1(predict_history_OBUF[3]),
        .I2(predict_pc_IBUF[3]),
        .I3(predict_history_OBUF[2]),
        .I4(predict_pc_IBUF[2]),
        .O(predict_taken_OBUF_inst_i_59_n_0));
  LUT2 #(
    .INIT(4'h6)) 
    predict_taken_OBUF_inst_i_6
       (.I0(predict_history_OBUF[5]),
        .I1(predict_pc_IBUF[5]),
        .O(predict_taken_OBUF_inst_i_6_n_0));
  LUT2 #(
    .INIT(4'h6)) 
    predict_taken_OBUF_inst_i_60
       (.I0(predict_history_OBUF[1]),
        .I1(predict_pc_IBUF[1]),
        .O(predict_taken_OBUF_inst_i_60_n_0));
  LUT2 #(
    .INIT(4'h6)) 
    predict_taken_OBUF_inst_i_61
       (.I0(predict_history_OBUF[0]),
        .I1(predict_pc_IBUF[0]),
        .O(predict_taken_OBUF_inst_i_61_n_0));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT5 #(
    .INIT(32'hFFFF9FF9)) 
    predict_taken_OBUF_inst_i_62
       (.I0(predict_history_OBUF[3]),
        .I1(predict_pc_IBUF[3]),
        .I2(predict_history_OBUF[2]),
        .I3(predict_pc_IBUF[2]),
        .I4(predict_taken_OBUF_inst_i_56_n_0),
        .O(predict_taken_OBUF_inst_i_62_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_63
       (.I0(predict_taken_OBUF_inst_i_15_n_0),
        .I1(\pht_reg[72] [1]),
        .I2(predict_taken_OBUF_inst_i_37_n_0),
        .I3(\pht_reg[67] [1]),
        .O(predict_taken_OBUF_inst_i_63_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_64
       (.I0(predict_taken_OBUF_inst_i_38_n_0),
        .I1(\pht_reg[66] [1]),
        .I2(predict_taken_OBUF_inst_i_69_n_0),
        .I3(\pht_reg[64] [1]),
        .O(predict_taken_OBUF_inst_i_64_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_65
       (.I0(\predict_history_r[0]_i_16_n_0 ),
        .I1(\pht_reg[92] [1]),
        .I2(predict_taken_OBUF_inst_i_69_n_0),
        .I3(\pht_reg[80] [1]),
        .O(predict_taken_OBUF_inst_i_65_n_0));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    predict_taken_OBUF_inst_i_66
       (.I0(predict_taken_OBUF_inst_i_27_n_0),
        .I1(predict_taken_OBUF_inst_i_80_n_0),
        .I2(\pht_reg[87] [1]),
        .I3(predict_taken_OBUF_inst_i_56_n_0),
        .I4(predict_taken_OBUF_inst_i_30_n_0),
        .I5(\pht_reg[86] [1]),
        .O(predict_taken_OBUF_inst_i_66_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_67
       (.I0(predict_taken_OBUF_inst_i_59_n_0),
        .I1(\pht_reg[90] [1]),
        .I2(predict_taken_OBUF_inst_i_28_n_0),
        .I3(\pht_reg[81] [1]),
        .O(predict_taken_OBUF_inst_i_67_n_0));
  LUT6 #(
    .INIT(64'h44F444F4FFFF44F4)) 
    predict_taken_OBUF_inst_i_68
       (.I0(predict_taken_OBUF_inst_i_10_n_0),
        .I1(\pht_reg[14] [1]),
        .I2(\pht_reg[15] [1]),
        .I3(predict_taken_OBUF_inst_i_23_n_0),
        .I4(\pht_reg[13] [1]),
        .I5(predict_taken_OBUF_inst_i_24_n_0),
        .O(predict_taken_OBUF_inst_i_68_n_0));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT5 #(
    .INIT(32'hFFFF6FF6)) 
    predict_taken_OBUF_inst_i_69
       (.I0(predict_history_OBUF[2]),
        .I1(predict_pc_IBUF[2]),
        .I2(predict_history_OBUF[3]),
        .I3(predict_pc_IBUF[3]),
        .I4(predict_taken_OBUF_inst_i_40_n_0),
        .O(predict_taken_OBUF_inst_i_69_n_0));
  LUT6 #(
    .INIT(64'hBBB8BBB8BBBBBBB8)) 
    predict_taken_OBUF_inst_i_7
       (.I0(predict_taken_OBUF_inst_i_20_n_0),
        .I1(predict_taken_OBUF_inst_i_11_n_0),
        .I2(predict_taken_OBUF_inst_i_21_n_0),
        .I3(predict_taken_OBUF_inst_i_22_n_0),
        .I4(\pht_reg[62] [1]),
        .I5(predict_taken_OBUF_inst_i_10_n_0),
        .O(predict_taken_OBUF_inst_i_7_n_0));
  LUT6 #(
    .INIT(64'hEB0000EB28000028)) 
    predict_taken_OBUF_inst_i_70
       (.I0(\pht_reg[5] [1]),
        .I1(predict_pc_IBUF[0]),
        .I2(predict_history_OBUF[0]),
        .I3(predict_pc_IBUF[1]),
        .I4(predict_history_OBUF[1]),
        .I5(\pht_reg[4] [1]),
        .O(predict_taken_OBUF_inst_i_70_n_0));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    predict_taken_OBUF_inst_i_71
       (.I0(predict_taken_OBUF_inst_i_27_n_0),
        .I1(predict_taken_OBUF_inst_i_81_n_0),
        .I2(\pht_reg[103] [1]),
        .I3(predict_taken_OBUF_inst_i_56_n_0),
        .I4(predict_taken_OBUF_inst_i_30_n_0),
        .I5(\pht_reg[102] [1]),
        .O(predict_taken_OBUF_inst_i_71_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_72
       (.I0(predict_taken_OBUF_inst_i_59_n_0),
        .I1(\pht_reg[106] [1]),
        .I2(predict_taken_OBUF_inst_i_28_n_0),
        .I3(\pht_reg[97] [1]),
        .O(predict_taken_OBUF_inst_i_72_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_73
       (.I0(predict_taken_OBUF_inst_i_59_n_0),
        .I1(\pht_reg[122] [1]),
        .I2(predict_taken_OBUF_inst_i_28_n_0),
        .I3(\pht_reg[113] [1]),
        .O(predict_taken_OBUF_inst_i_73_n_0));
  LUT6 #(
    .INIT(64'hDD0DDD0D0000DD0D)) 
    predict_taken_OBUF_inst_i_74
       (.I0(\pht_reg[126] [1]),
        .I1(predict_taken_OBUF_inst_i_10_n_0),
        .I2(\pht_reg[125] [1]),
        .I3(predict_taken_OBUF_inst_i_24_n_0),
        .I4(\pht_reg[127] [1]),
        .I5(predict_taken_OBUF_inst_i_23_n_0),
        .O(predict_taken_OBUF_inst_i_74_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_75
       (.I0(\predict_history_r[0]_i_16_n_0 ),
        .I1(\pht_reg[44] [1]),
        .I2(predict_taken_OBUF_inst_i_69_n_0),
        .I3(\pht_reg[32] [1]),
        .O(predict_taken_OBUF_inst_i_75_n_0));
  LUT6 #(
    .INIT(64'h88A8AAAA88A888A8)) 
    predict_taken_OBUF_inst_i_76
       (.I0(predict_taken_OBUF_inst_i_27_n_0),
        .I1(predict_taken_OBUF_inst_i_82_n_0),
        .I2(\pht_reg[39] [1]),
        .I3(predict_taken_OBUF_inst_i_56_n_0),
        .I4(predict_taken_OBUF_inst_i_30_n_0),
        .I5(\pht_reg[38] [1]),
        .O(predict_taken_OBUF_inst_i_76_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_77
       (.I0(predict_taken_OBUF_inst_i_59_n_0),
        .I1(\pht_reg[42] [1]),
        .I2(predict_taken_OBUF_inst_i_28_n_0),
        .I3(\pht_reg[33] [1]),
        .O(predict_taken_OBUF_inst_i_77_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_78
       (.I0(predict_taken_OBUF_inst_i_15_n_0),
        .I1(\pht_reg[56] [1]),
        .I2(predict_taken_OBUF_inst_i_37_n_0),
        .I3(\pht_reg[51] [1]),
        .O(predict_taken_OBUF_inst_i_78_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_79
       (.I0(predict_taken_OBUF_inst_i_69_n_0),
        .I1(\pht_reg[48] [1]),
        .I2(predict_taken_OBUF_inst_i_38_n_0),
        .I3(\pht_reg[50] [1]),
        .O(predict_taken_OBUF_inst_i_79_n_0));
  LUT4 #(
    .INIT(16'h4F44)) 
    predict_taken_OBUF_inst_i_8
       (.I0(predict_taken_OBUF_inst_i_23_n_0),
        .I1(\pht_reg[79] [1]),
        .I2(predict_taken_OBUF_inst_i_24_n_0),
        .I3(\pht_reg[77] [1]),
        .O(predict_taken_OBUF_inst_i_8_n_0));
  LUT6 #(
    .INIT(64'hEB0000EB28000028)) 
    predict_taken_OBUF_inst_i_80
       (.I0(\pht_reg[85] [1]),
        .I1(predict_pc_IBUF[0]),
        .I2(predict_history_OBUF[0]),
        .I3(predict_pc_IBUF[1]),
        .I4(predict_history_OBUF[1]),
        .I5(\pht_reg[84] [1]),
        .O(predict_taken_OBUF_inst_i_80_n_0));
  LUT6 #(
    .INIT(64'hEB0000EB28000028)) 
    predict_taken_OBUF_inst_i_81
       (.I0(\pht_reg[101] [1]),
        .I1(predict_pc_IBUF[0]),
        .I2(predict_history_OBUF[0]),
        .I3(predict_pc_IBUF[1]),
        .I4(predict_history_OBUF[1]),
        .I5(\pht_reg[100] [1]),
        .O(predict_taken_OBUF_inst_i_81_n_0));
  LUT6 #(
    .INIT(64'hEB0000EB28000028)) 
    predict_taken_OBUF_inst_i_82
       (.I0(\pht_reg[37] [1]),
        .I1(predict_pc_IBUF[0]),
        .I2(predict_history_OBUF[0]),
        .I3(predict_pc_IBUF[1]),
        .I4(predict_history_OBUF[1]),
        .I5(\pht_reg[36] [1]),
        .O(predict_taken_OBUF_inst_i_82_n_0));
  LUT6 #(
    .INIT(64'hFFFFFFFFBAFFBABA)) 
    predict_taken_OBUF_inst_i_9
       (.I0(predict_taken_OBUF_inst_i_25_n_0),
        .I1(predict_taken_OBUF_inst_i_26_n_0),
        .I2(predict_taken_OBUF_inst_i_27_n_0),
        .I3(predict_taken_OBUF_inst_i_28_n_0),
        .I4(\pht_reg[65] [1]),
        .I5(predict_taken_OBUF_inst_i_29_n_0),
        .O(predict_taken_OBUF_inst_i_9_n_0));
  IBUF predict_valid_IBUF_inst
       (.I(predict_valid),
        .O(predict_valid_IBUF));
  IBUF \train_history_IBUF[0]_inst 
       (.I(train_history[0]),
        .O(train_history_IBUF[0]));
  IBUF \train_history_IBUF[1]_inst 
       (.I(train_history[1]),
        .O(train_history_IBUF[1]));
  IBUF \train_history_IBUF[2]_inst 
       (.I(train_history[2]),
        .O(train_history_IBUF[2]));
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
  IBUF train_mispredicted_IBUF_inst
       (.I(train_mispredicted),
        .O(train_mispredicted_IBUF));
  IBUF \train_pc_IBUF[0]_inst 
       (.I(train_pc[0]),
        .O(train_pc_IBUF[0]));
  IBUF \train_pc_IBUF[1]_inst 
       (.I(train_pc[1]),
        .O(train_pc_IBUF[1]));
  IBUF \train_pc_IBUF[2]_inst 
       (.I(train_pc[2]),
        .O(train_pc_IBUF[2]));
  IBUF \train_pc_IBUF[3]_inst 
       (.I(train_pc[3]),
        .O(train_pc_IBUF[3]));
  IBUF \train_pc_IBUF[4]_inst 
       (.I(train_pc[4]),
        .O(train_pc_IBUF[4]));
  IBUF \train_pc_IBUF[5]_inst 
       (.I(train_pc[5]),
        .O(train_pc_IBUF[5]));
  IBUF \train_pc_IBUF[6]_inst 
       (.I(train_pc[6]),
        .O(train_pc_IBUF[6]));
  IBUF train_taken_IBUF_inst
       (.I(train_taken),
        .O(train_taken_IBUF));
  IBUF train_valid_IBUF_inst
       (.I(train_valid),
        .O(train_valid_IBUF));
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
