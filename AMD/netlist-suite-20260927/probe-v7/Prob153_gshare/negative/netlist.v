// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 05:58:08 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob153_gshare/eda/run-At7ZR6/build/.rtl-synth-DhSDHn/netlist.v
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
  wire \history[0]_i_1_n_0 ;
  wire \history[0]_i_2_n_0 ;
  wire \history[0]_i_3_n_0 ;
  wire \history[1]_i_1_n_0 ;
  wire \history[2]_i_1_n_0 ;
  wire \history[3]_i_1_n_0 ;
  wire \history[4]_i_1_n_0 ;
  wire \history[5]_i_1_n_0 ;
  wire \history[6]_i_1_n_0 ;
  wire \history[6]_i_2_n_0 ;
  wire [1:0]pht0_in;
  wire \pht[0][1]_i_1_n_0 ;
  wire \pht[100][1]_i_1_n_0 ;
  wire \pht[101][1]_i_1_n_0 ;
  wire \pht[101][1]_i_2_n_0 ;
  wire \pht[102][1]_i_1_n_0 ;
  wire \pht[103][1]_i_1_n_0 ;
  wire \pht[104][1]_i_1_n_0 ;
  wire \pht[104][1]_i_2_n_0 ;
  wire \pht[105][1]_i_1_n_0 ;
  wire \pht[106][1]_i_1_n_0 ;
  wire \pht[106][1]_i_2_n_0 ;
  wire \pht[107][1]_i_1_n_0 ;
  wire \pht[108][1]_i_1_n_0 ;
  wire \pht[109][1]_i_1_n_0 ;
  wire \pht[10][1]_i_1_n_0 ;
  wire \pht[10][1]_i_2_n_0 ;
  wire \pht[110][1]_i_1_n_0 ;
  wire \pht[111][1]_i_1_n_0 ;
  wire \pht[112][1]_i_1_n_0 ;
  wire \pht[113][1]_i_1_n_0 ;
  wire \pht[114][1]_i_1_n_0 ;
  wire \pht[115][1]_i_1_n_0 ;
  wire \pht[116][1]_i_1_n_0 ;
  wire \pht[117][1]_i_1_n_0 ;
  wire \pht[118][1]_i_1_n_0 ;
  wire \pht[119][1]_i_1_n_0 ;
  wire \pht[11][1]_i_1_n_0 ;
  wire \pht[120][1]_i_1_n_0 ;
  wire \pht[121][1]_i_1_n_0 ;
  wire \pht[122][1]_i_1_n_0 ;
  wire \pht[123][1]_i_1_n_0 ;
  wire \pht[124][1]_i_1_n_0 ;
  wire \pht[125][1]_i_1_n_0 ;
  wire \pht[126][1]_i_1_n_0 ;
  wire \pht[127][1]_i_1_n_0 ;
  wire \pht[12][1]_i_1_n_0 ;
  wire \pht[12][1]_i_2_n_0 ;
  wire \pht[13][1]_i_1_n_0 ;
  wire \pht[14][1]_i_1_n_0 ;
  wire \pht[15][1]_i_1_n_0 ;
  wire \pht[15][1]_i_2_n_0 ;
  wire \pht[16][1]_i_1_n_0 ;
  wire \pht[16][1]_i_2_n_0 ;
  wire \pht[17][1]_i_1_n_0 ;
  wire \pht[18][1]_i_1_n_0 ;
  wire \pht[19][1]_i_1_n_0 ;
  wire \pht[1][1]_i_100_n_0 ;
  wire \pht[1][1]_i_101_n_0 ;
  wire \pht[1][1]_i_102_n_0 ;
  wire \pht[1][1]_i_103_n_0 ;
  wire \pht[1][1]_i_104_n_0 ;
  wire \pht[1][1]_i_105_n_0 ;
  wire \pht[1][1]_i_106_n_0 ;
  wire \pht[1][1]_i_107_n_0 ;
  wire \pht[1][1]_i_108_n_0 ;
  wire \pht[1][1]_i_109_n_0 ;
  wire \pht[1][1]_i_10_n_0 ;
  wire \pht[1][1]_i_110_n_0 ;
  wire \pht[1][1]_i_111_n_0 ;
  wire \pht[1][1]_i_112_n_0 ;
  wire \pht[1][1]_i_113_n_0 ;
  wire \pht[1][1]_i_114_n_0 ;
  wire \pht[1][1]_i_115_n_0 ;
  wire \pht[1][1]_i_116_n_0 ;
  wire \pht[1][1]_i_117_n_0 ;
  wire \pht[1][1]_i_118_n_0 ;
  wire \pht[1][1]_i_119_n_0 ;
  wire \pht[1][1]_i_120_n_0 ;
  wire \pht[1][1]_i_121_n_0 ;
  wire \pht[1][1]_i_122_n_0 ;
  wire \pht[1][1]_i_1_n_0 ;
  wire \pht[1][1]_i_3_n_0 ;
  wire \pht[1][1]_i_59_n_0 ;
  wire \pht[1][1]_i_5_n_0 ;
  wire \pht[1][1]_i_60_n_0 ;
  wire \pht[1][1]_i_61_n_0 ;
  wire \pht[1][1]_i_62_n_0 ;
  wire \pht[1][1]_i_63_n_0 ;
  wire \pht[1][1]_i_64_n_0 ;
  wire \pht[1][1]_i_65_n_0 ;
  wire \pht[1][1]_i_66_n_0 ;
  wire \pht[1][1]_i_67_n_0 ;
  wire \pht[1][1]_i_68_n_0 ;
  wire \pht[1][1]_i_69_n_0 ;
  wire \pht[1][1]_i_6_n_0 ;
  wire \pht[1][1]_i_70_n_0 ;
  wire \pht[1][1]_i_71_n_0 ;
  wire \pht[1][1]_i_72_n_0 ;
  wire \pht[1][1]_i_73_n_0 ;
  wire \pht[1][1]_i_74_n_0 ;
  wire \pht[1][1]_i_75_n_0 ;
  wire \pht[1][1]_i_76_n_0 ;
  wire \pht[1][1]_i_77_n_0 ;
  wire \pht[1][1]_i_78_n_0 ;
  wire \pht[1][1]_i_79_n_0 ;
  wire \pht[1][1]_i_80_n_0 ;
  wire \pht[1][1]_i_81_n_0 ;
  wire \pht[1][1]_i_82_n_0 ;
  wire \pht[1][1]_i_83_n_0 ;
  wire \pht[1][1]_i_84_n_0 ;
  wire \pht[1][1]_i_85_n_0 ;
  wire \pht[1][1]_i_86_n_0 ;
  wire \pht[1][1]_i_87_n_0 ;
  wire \pht[1][1]_i_88_n_0 ;
  wire \pht[1][1]_i_89_n_0 ;
  wire \pht[1][1]_i_8_n_0 ;
  wire \pht[1][1]_i_90_n_0 ;
  wire \pht[1][1]_i_91_n_0 ;
  wire \pht[1][1]_i_92_n_0 ;
  wire \pht[1][1]_i_93_n_0 ;
  wire \pht[1][1]_i_94_n_0 ;
  wire \pht[1][1]_i_95_n_0 ;
  wire \pht[1][1]_i_96_n_0 ;
  wire \pht[1][1]_i_97_n_0 ;
  wire \pht[1][1]_i_98_n_0 ;
  wire \pht[1][1]_i_99_n_0 ;
  wire \pht[1][1]_i_9_n_0 ;
  wire \pht[20][1]_i_1_n_0 ;
  wire \pht[21][1]_i_1_n_0 ;
  wire \pht[22][1]_i_1_n_0 ;
  wire \pht[23][1]_i_1_n_0 ;
  wire \pht[23][1]_i_2_n_0 ;
  wire \pht[24][1]_i_1_n_0 ;
  wire \pht[25][1]_i_1_n_0 ;
  wire \pht[26][1]_i_1_n_0 ;
  wire \pht[27][1]_i_1_n_0 ;
  wire \pht[27][1]_i_2_n_0 ;
  wire \pht[28][1]_i_1_n_0 ;
  wire \pht[29][1]_i_1_n_0 ;
  wire \pht[29][1]_i_2_n_0 ;
  wire \pht[29][1]_i_3_n_0 ;
  wire \pht[2][1]_i_1_n_0 ;
  wire \pht[2][1]_i_4_n_0 ;
  wire \pht[30][1]_i_1_n_0 ;
  wire \pht[30][1]_i_2_n_0 ;
  wire \pht[31][1]_i_1_n_0 ;
  wire \pht[32][1]_i_1_n_0 ;
  wire \pht[32][1]_i_2_n_0 ;
  wire \pht[33][1]_i_1_n_0 ;
  wire \pht[34][1]_i_1_n_0 ;
  wire \pht[35][1]_i_1_n_0 ;
  wire \pht[35][1]_i_2_n_0 ;
  wire \pht[36][1]_i_1_n_0 ;
  wire \pht[37][1]_i_1_n_0 ;
  wire \pht[38][1]_i_1_n_0 ;
  wire \pht[39][1]_i_1_n_0 ;
  wire \pht[39][1]_i_2_n_0 ;
  wire \pht[39][1]_i_3_n_0 ;
  wire \pht[3][1]_i_1_n_0 ;
  wire \pht[40][1]_i_1_n_0 ;
  wire \pht[40][1]_i_2_n_0 ;
  wire \pht[41][1]_i_1_n_0 ;
  wire \pht[41][1]_i_2_n_0 ;
  wire \pht[42][1]_i_1_n_0 ;
  wire \pht[42][1]_i_2_n_0 ;
  wire \pht[43][1]_i_1_n_0 ;
  wire \pht[43][1]_i_2_n_0 ;
  wire \pht[44][1]_i_1_n_0 ;
  wire \pht[45][1]_i_1_n_0 ;
  wire \pht[45][1]_i_2_n_0 ;
  wire \pht[46][1]_i_1_n_0 ;
  wire \pht[47][1]_i_1_n_0 ;
  wire \pht[48][1]_i_1_n_0 ;
  wire \pht[49][1]_i_1_n_0 ;
  wire \pht[4][1]_i_1_n_0 ;
  wire \pht[4][1]_i_2_n_0 ;
  wire \pht[50][1]_i_1_n_0 ;
  wire \pht[51][1]_i_1_n_0 ;
  wire \pht[51][1]_i_2_n_0 ;
  wire \pht[52][1]_i_1_n_0 ;
  wire \pht[53][1]_i_1_n_0 ;
  wire \pht[53][1]_i_2_n_0 ;
  wire \pht[54][1]_i_1_n_0 ;
  wire \pht[55][1]_i_1_n_0 ;
  wire \pht[55][1]_i_2_n_0 ;
  wire \pht[56][1]_i_1_n_0 ;
  wire \pht[57][1]_i_1_n_0 ;
  wire \pht[58][1]_i_1_n_0 ;
  wire \pht[59][1]_i_1_n_0 ;
  wire \pht[5][1]_i_1_n_0 ;
  wire \pht[60][1]_i_1_n_0 ;
  wire \pht[60][1]_i_2_n_0 ;
  wire \pht[61][1]_i_1_n_0 ;
  wire \pht[61][1]_i_2_n_0 ;
  wire \pht[62][1]_i_1_n_0 ;
  wire \pht[63][1]_i_1_n_0 ;
  wire \pht[64][1]_i_1_n_0 ;
  wire \pht[65][1]_i_1_n_0 ;
  wire \pht[65][1]_i_2_n_0 ;
  wire \pht[66][1]_i_1_n_0 ;
  wire \pht[67][1]_i_1_n_0 ;
  wire \pht[67][1]_i_2_n_0 ;
  wire \pht[68][1]_i_1_n_0 ;
  wire \pht[68][1]_i_2_n_0 ;
  wire \pht[69][1]_i_1_n_0 ;
  wire \pht[69][1]_i_2_n_0 ;
  wire \pht[6][1]_i_1_n_0 ;
  wire \pht[70][1]_i_1_n_0 ;
  wire \pht[71][1]_i_1_n_0 ;
  wire \pht[72][1]_i_1_n_0 ;
  wire \pht[73][1]_i_1_n_0 ;
  wire \pht[73][1]_i_2_n_0 ;
  wire \pht[74][1]_i_1_n_0 ;
  wire \pht[75][1]_i_1_n_0 ;
  wire \pht[75][1]_i_2_n_0 ;
  wire \pht[76][1]_i_1_n_0 ;
  wire \pht[77][1]_i_1_n_0 ;
  wire \pht[77][1]_i_2_n_0 ;
  wire \pht[77][1]_i_3_n_0 ;
  wire \pht[78][1]_i_1_n_0 ;
  wire \pht[79][1]_i_1_n_0 ;
  wire \pht[7][1]_i_1_n_0 ;
  wire \pht[80][1]_i_1_n_0 ;
  wire \pht[81][1]_i_1_n_0 ;
  wire \pht[82][1]_i_1_n_0 ;
  wire \pht[83][1]_i_1_n_0 ;
  wire \pht[83][1]_i_2_n_0 ;
  wire \pht[84][1]_i_1_n_0 ;
  wire \pht[85][1]_i_1_n_0 ;
  wire \pht[85][1]_i_2_n_0 ;
  wire \pht[86][1]_i_1_n_0 ;
  wire \pht[87][1]_i_1_n_0 ;
  wire \pht[88][1]_i_1_n_0 ;
  wire \pht[88][1]_i_2_n_0 ;
  wire \pht[89][1]_i_1_n_0 ;
  wire \pht[8][1]_i_1_n_0 ;
  wire \pht[8][1]_i_3_n_0 ;
  wire \pht[90][1]_i_1_n_0 ;
  wire \pht[90][1]_i_2_n_0 ;
  wire \pht[90][1]_i_3_n_0 ;
  wire \pht[91][1]_i_1_n_0 ;
  wire \pht[92][1]_i_1_n_0 ;
  wire \pht[93][1]_i_1_n_0 ;
  wire \pht[94][1]_i_1_n_0 ;
  wire \pht[95][1]_i_1_n_0 ;
  wire \pht[96][1]_i_1_n_0 ;
  wire \pht[97][1]_i_1_n_0 ;
  wire \pht[98][1]_i_1_n_0 ;
  wire \pht[99][1]_i_1_n_0 ;
  wire \pht[99][1]_i_2_n_0 ;
  wire \pht[9][1]_i_1_n_0 ;
  wire \pht_reg[1][1]_i_11_n_0 ;
  wire \pht_reg[1][1]_i_12_n_0 ;
  wire \pht_reg[1][1]_i_13_n_0 ;
  wire \pht_reg[1][1]_i_14_n_0 ;
  wire \pht_reg[1][1]_i_15_n_0 ;
  wire \pht_reg[1][1]_i_16_n_0 ;
  wire \pht_reg[1][1]_i_17_n_0 ;
  wire \pht_reg[1][1]_i_18_n_0 ;
  wire \pht_reg[1][1]_i_19_n_0 ;
  wire \pht_reg[1][1]_i_20_n_0 ;
  wire \pht_reg[1][1]_i_21_n_0 ;
  wire \pht_reg[1][1]_i_22_n_0 ;
  wire \pht_reg[1][1]_i_23_n_0 ;
  wire \pht_reg[1][1]_i_24_n_0 ;
  wire \pht_reg[1][1]_i_25_n_0 ;
  wire \pht_reg[1][1]_i_26_n_0 ;
  wire \pht_reg[1][1]_i_27_n_0 ;
  wire \pht_reg[1][1]_i_28_n_0 ;
  wire \pht_reg[1][1]_i_29_n_0 ;
  wire \pht_reg[1][1]_i_30_n_0 ;
  wire \pht_reg[1][1]_i_31_n_0 ;
  wire \pht_reg[1][1]_i_32_n_0 ;
  wire \pht_reg[1][1]_i_33_n_0 ;
  wire \pht_reg[1][1]_i_34_n_0 ;
  wire \pht_reg[1][1]_i_35_n_0 ;
  wire \pht_reg[1][1]_i_36_n_0 ;
  wire \pht_reg[1][1]_i_37_n_0 ;
  wire \pht_reg[1][1]_i_38_n_0 ;
  wire \pht_reg[1][1]_i_39_n_0 ;
  wire \pht_reg[1][1]_i_40_n_0 ;
  wire \pht_reg[1][1]_i_41_n_0 ;
  wire \pht_reg[1][1]_i_42_n_0 ;
  wire \pht_reg[1][1]_i_43_n_0 ;
  wire \pht_reg[1][1]_i_44_n_0 ;
  wire \pht_reg[1][1]_i_45_n_0 ;
  wire \pht_reg[1][1]_i_46_n_0 ;
  wire \pht_reg[1][1]_i_47_n_0 ;
  wire \pht_reg[1][1]_i_48_n_0 ;
  wire \pht_reg[1][1]_i_49_n_0 ;
  wire \pht_reg[1][1]_i_50_n_0 ;
  wire \pht_reg[1][1]_i_51_n_0 ;
  wire \pht_reg[1][1]_i_52_n_0 ;
  wire \pht_reg[1][1]_i_53_n_0 ;
  wire \pht_reg[1][1]_i_54_n_0 ;
  wire \pht_reg[1][1]_i_55_n_0 ;
  wire \pht_reg[1][1]_i_56_n_0 ;
  wire \pht_reg[1][1]_i_57_n_0 ;
  wire \pht_reg[1][1]_i_58_n_0 ;
  wire \pht_reg_n_0_[0][0] ;
  wire \pht_reg_n_0_[0][1] ;
  wire \pht_reg_n_0_[100][0] ;
  wire \pht_reg_n_0_[100][1] ;
  wire \pht_reg_n_0_[101][0] ;
  wire \pht_reg_n_0_[101][1] ;
  wire \pht_reg_n_0_[102][0] ;
  wire \pht_reg_n_0_[102][1] ;
  wire \pht_reg_n_0_[103][0] ;
  wire \pht_reg_n_0_[103][1] ;
  wire \pht_reg_n_0_[104][0] ;
  wire \pht_reg_n_0_[104][1] ;
  wire \pht_reg_n_0_[105][0] ;
  wire \pht_reg_n_0_[105][1] ;
  wire \pht_reg_n_0_[106][0] ;
  wire \pht_reg_n_0_[106][1] ;
  wire \pht_reg_n_0_[107][0] ;
  wire \pht_reg_n_0_[107][1] ;
  wire \pht_reg_n_0_[108][0] ;
  wire \pht_reg_n_0_[108][1] ;
  wire \pht_reg_n_0_[109][0] ;
  wire \pht_reg_n_0_[109][1] ;
  wire \pht_reg_n_0_[10][0] ;
  wire \pht_reg_n_0_[10][1] ;
  wire \pht_reg_n_0_[110][0] ;
  wire \pht_reg_n_0_[110][1] ;
  wire \pht_reg_n_0_[111][0] ;
  wire \pht_reg_n_0_[111][1] ;
  wire \pht_reg_n_0_[112][0] ;
  wire \pht_reg_n_0_[112][1] ;
  wire \pht_reg_n_0_[113][0] ;
  wire \pht_reg_n_0_[113][1] ;
  wire \pht_reg_n_0_[114][0] ;
  wire \pht_reg_n_0_[114][1] ;
  wire \pht_reg_n_0_[115][0] ;
  wire \pht_reg_n_0_[115][1] ;
  wire \pht_reg_n_0_[116][0] ;
  wire \pht_reg_n_0_[116][1] ;
  wire \pht_reg_n_0_[117][0] ;
  wire \pht_reg_n_0_[117][1] ;
  wire \pht_reg_n_0_[118][0] ;
  wire \pht_reg_n_0_[118][1] ;
  wire \pht_reg_n_0_[119][0] ;
  wire \pht_reg_n_0_[119][1] ;
  wire \pht_reg_n_0_[11][0] ;
  wire \pht_reg_n_0_[11][1] ;
  wire \pht_reg_n_0_[120][0] ;
  wire \pht_reg_n_0_[120][1] ;
  wire \pht_reg_n_0_[121][0] ;
  wire \pht_reg_n_0_[121][1] ;
  wire \pht_reg_n_0_[122][0] ;
  wire \pht_reg_n_0_[122][1] ;
  wire \pht_reg_n_0_[123][0] ;
  wire \pht_reg_n_0_[123][1] ;
  wire \pht_reg_n_0_[124][0] ;
  wire \pht_reg_n_0_[124][1] ;
  wire \pht_reg_n_0_[125][0] ;
  wire \pht_reg_n_0_[125][1] ;
  wire \pht_reg_n_0_[126][0] ;
  wire \pht_reg_n_0_[126][1] ;
  wire \pht_reg_n_0_[127][0] ;
  wire \pht_reg_n_0_[127][1] ;
  wire \pht_reg_n_0_[12][0] ;
  wire \pht_reg_n_0_[12][1] ;
  wire \pht_reg_n_0_[13][0] ;
  wire \pht_reg_n_0_[13][1] ;
  wire \pht_reg_n_0_[14][0] ;
  wire \pht_reg_n_0_[14][1] ;
  wire \pht_reg_n_0_[15][0] ;
  wire \pht_reg_n_0_[15][1] ;
  wire \pht_reg_n_0_[16][0] ;
  wire \pht_reg_n_0_[16][1] ;
  wire \pht_reg_n_0_[17][0] ;
  wire \pht_reg_n_0_[17][1] ;
  wire \pht_reg_n_0_[18][0] ;
  wire \pht_reg_n_0_[18][1] ;
  wire \pht_reg_n_0_[19][0] ;
  wire \pht_reg_n_0_[19][1] ;
  wire \pht_reg_n_0_[1][0] ;
  wire \pht_reg_n_0_[1][1] ;
  wire \pht_reg_n_0_[20][0] ;
  wire \pht_reg_n_0_[20][1] ;
  wire \pht_reg_n_0_[21][0] ;
  wire \pht_reg_n_0_[21][1] ;
  wire \pht_reg_n_0_[22][0] ;
  wire \pht_reg_n_0_[22][1] ;
  wire \pht_reg_n_0_[23][0] ;
  wire \pht_reg_n_0_[23][1] ;
  wire \pht_reg_n_0_[24][0] ;
  wire \pht_reg_n_0_[24][1] ;
  wire \pht_reg_n_0_[25][0] ;
  wire \pht_reg_n_0_[25][1] ;
  wire \pht_reg_n_0_[26][0] ;
  wire \pht_reg_n_0_[26][1] ;
  wire \pht_reg_n_0_[27][0] ;
  wire \pht_reg_n_0_[27][1] ;
  wire \pht_reg_n_0_[28][0] ;
  wire \pht_reg_n_0_[28][1] ;
  wire \pht_reg_n_0_[29][0] ;
  wire \pht_reg_n_0_[29][1] ;
  wire \pht_reg_n_0_[2][0] ;
  wire \pht_reg_n_0_[2][1] ;
  wire \pht_reg_n_0_[30][0] ;
  wire \pht_reg_n_0_[30][1] ;
  wire \pht_reg_n_0_[31][0] ;
  wire \pht_reg_n_0_[31][1] ;
  wire \pht_reg_n_0_[32][0] ;
  wire \pht_reg_n_0_[32][1] ;
  wire \pht_reg_n_0_[33][0] ;
  wire \pht_reg_n_0_[33][1] ;
  wire \pht_reg_n_0_[34][0] ;
  wire \pht_reg_n_0_[34][1] ;
  wire \pht_reg_n_0_[35][0] ;
  wire \pht_reg_n_0_[35][1] ;
  wire \pht_reg_n_0_[36][0] ;
  wire \pht_reg_n_0_[36][1] ;
  wire \pht_reg_n_0_[37][0] ;
  wire \pht_reg_n_0_[37][1] ;
  wire \pht_reg_n_0_[38][0] ;
  wire \pht_reg_n_0_[38][1] ;
  wire \pht_reg_n_0_[39][0] ;
  wire \pht_reg_n_0_[39][1] ;
  wire \pht_reg_n_0_[3][0] ;
  wire \pht_reg_n_0_[3][1] ;
  wire \pht_reg_n_0_[40][0] ;
  wire \pht_reg_n_0_[40][1] ;
  wire \pht_reg_n_0_[41][0] ;
  wire \pht_reg_n_0_[41][1] ;
  wire \pht_reg_n_0_[42][0] ;
  wire \pht_reg_n_0_[42][1] ;
  wire \pht_reg_n_0_[43][0] ;
  wire \pht_reg_n_0_[43][1] ;
  wire \pht_reg_n_0_[44][0] ;
  wire \pht_reg_n_0_[44][1] ;
  wire \pht_reg_n_0_[45][0] ;
  wire \pht_reg_n_0_[45][1] ;
  wire \pht_reg_n_0_[46][0] ;
  wire \pht_reg_n_0_[46][1] ;
  wire \pht_reg_n_0_[47][0] ;
  wire \pht_reg_n_0_[47][1] ;
  wire \pht_reg_n_0_[48][0] ;
  wire \pht_reg_n_0_[48][1] ;
  wire \pht_reg_n_0_[49][0] ;
  wire \pht_reg_n_0_[49][1] ;
  wire \pht_reg_n_0_[4][0] ;
  wire \pht_reg_n_0_[4][1] ;
  wire \pht_reg_n_0_[50][0] ;
  wire \pht_reg_n_0_[50][1] ;
  wire \pht_reg_n_0_[51][0] ;
  wire \pht_reg_n_0_[51][1] ;
  wire \pht_reg_n_0_[52][0] ;
  wire \pht_reg_n_0_[52][1] ;
  wire \pht_reg_n_0_[53][0] ;
  wire \pht_reg_n_0_[53][1] ;
  wire \pht_reg_n_0_[54][0] ;
  wire \pht_reg_n_0_[54][1] ;
  wire \pht_reg_n_0_[55][0] ;
  wire \pht_reg_n_0_[55][1] ;
  wire \pht_reg_n_0_[56][0] ;
  wire \pht_reg_n_0_[56][1] ;
  wire \pht_reg_n_0_[57][0] ;
  wire \pht_reg_n_0_[57][1] ;
  wire \pht_reg_n_0_[58][0] ;
  wire \pht_reg_n_0_[58][1] ;
  wire \pht_reg_n_0_[59][0] ;
  wire \pht_reg_n_0_[59][1] ;
  wire \pht_reg_n_0_[5][0] ;
  wire \pht_reg_n_0_[5][1] ;
  wire \pht_reg_n_0_[60][0] ;
  wire \pht_reg_n_0_[60][1] ;
  wire \pht_reg_n_0_[61][0] ;
  wire \pht_reg_n_0_[61][1] ;
  wire \pht_reg_n_0_[62][0] ;
  wire \pht_reg_n_0_[62][1] ;
  wire \pht_reg_n_0_[63][0] ;
  wire \pht_reg_n_0_[63][1] ;
  wire \pht_reg_n_0_[64][0] ;
  wire \pht_reg_n_0_[64][1] ;
  wire \pht_reg_n_0_[65][0] ;
  wire \pht_reg_n_0_[65][1] ;
  wire \pht_reg_n_0_[66][0] ;
  wire \pht_reg_n_0_[66][1] ;
  wire \pht_reg_n_0_[67][0] ;
  wire \pht_reg_n_0_[67][1] ;
  wire \pht_reg_n_0_[68][0] ;
  wire \pht_reg_n_0_[68][1] ;
  wire \pht_reg_n_0_[69][0] ;
  wire \pht_reg_n_0_[69][1] ;
  wire \pht_reg_n_0_[6][0] ;
  wire \pht_reg_n_0_[6][1] ;
  wire \pht_reg_n_0_[70][0] ;
  wire \pht_reg_n_0_[70][1] ;
  wire \pht_reg_n_0_[71][0] ;
  wire \pht_reg_n_0_[71][1] ;
  wire \pht_reg_n_0_[72][0] ;
  wire \pht_reg_n_0_[72][1] ;
  wire \pht_reg_n_0_[73][0] ;
  wire \pht_reg_n_0_[73][1] ;
  wire \pht_reg_n_0_[74][0] ;
  wire \pht_reg_n_0_[74][1] ;
  wire \pht_reg_n_0_[75][0] ;
  wire \pht_reg_n_0_[75][1] ;
  wire \pht_reg_n_0_[76][0] ;
  wire \pht_reg_n_0_[76][1] ;
  wire \pht_reg_n_0_[77][0] ;
  wire \pht_reg_n_0_[77][1] ;
  wire \pht_reg_n_0_[78][0] ;
  wire \pht_reg_n_0_[78][1] ;
  wire \pht_reg_n_0_[79][0] ;
  wire \pht_reg_n_0_[79][1] ;
  wire \pht_reg_n_0_[7][0] ;
  wire \pht_reg_n_0_[7][1] ;
  wire \pht_reg_n_0_[80][0] ;
  wire \pht_reg_n_0_[80][1] ;
  wire \pht_reg_n_0_[81][0] ;
  wire \pht_reg_n_0_[81][1] ;
  wire \pht_reg_n_0_[82][0] ;
  wire \pht_reg_n_0_[82][1] ;
  wire \pht_reg_n_0_[83][0] ;
  wire \pht_reg_n_0_[83][1] ;
  wire \pht_reg_n_0_[84][0] ;
  wire \pht_reg_n_0_[84][1] ;
  wire \pht_reg_n_0_[85][0] ;
  wire \pht_reg_n_0_[85][1] ;
  wire \pht_reg_n_0_[86][0] ;
  wire \pht_reg_n_0_[86][1] ;
  wire \pht_reg_n_0_[87][0] ;
  wire \pht_reg_n_0_[87][1] ;
  wire \pht_reg_n_0_[88][0] ;
  wire \pht_reg_n_0_[88][1] ;
  wire \pht_reg_n_0_[89][0] ;
  wire \pht_reg_n_0_[89][1] ;
  wire \pht_reg_n_0_[8][0] ;
  wire \pht_reg_n_0_[8][1] ;
  wire \pht_reg_n_0_[90][0] ;
  wire \pht_reg_n_0_[90][1] ;
  wire \pht_reg_n_0_[91][0] ;
  wire \pht_reg_n_0_[91][1] ;
  wire \pht_reg_n_0_[92][0] ;
  wire \pht_reg_n_0_[92][1] ;
  wire \pht_reg_n_0_[93][0] ;
  wire \pht_reg_n_0_[93][1] ;
  wire \pht_reg_n_0_[94][0] ;
  wire \pht_reg_n_0_[94][1] ;
  wire \pht_reg_n_0_[95][0] ;
  wire \pht_reg_n_0_[95][1] ;
  wire \pht_reg_n_0_[96][0] ;
  wire \pht_reg_n_0_[96][1] ;
  wire \pht_reg_n_0_[97][0] ;
  wire \pht_reg_n_0_[97][1] ;
  wire \pht_reg_n_0_[98][0] ;
  wire \pht_reg_n_0_[98][1] ;
  wire \pht_reg_n_0_[99][0] ;
  wire \pht_reg_n_0_[99][1] ;
  wire \pht_reg_n_0_[9][0] ;
  wire \pht_reg_n_0_[9][1] ;
  wire [6:0]predict_history;
  wire [6:0]predict_history_OBUF;
  wire [5:1]predict_index;
  wire [6:0]predict_pc;
  wire [6:0]predict_pc_IBUF;
  wire predict_taken;
  wire predict_taken_OBUF;
  wire predict_taken_OBUF_inst_i_10_n_0;
  wire predict_taken_OBUF_inst_i_11_n_0;
  wire predict_taken_OBUF_inst_i_12_n_0;
  wire predict_taken_OBUF_inst_i_13_n_0;
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
  wire predict_taken_OBUF_inst_i_32_n_0;
  wire predict_taken_OBUF_inst_i_34_n_0;
  wire predict_taken_OBUF_inst_i_35_n_0;
  wire predict_taken_OBUF_inst_i_36_n_0;
  wire predict_taken_OBUF_inst_i_37_n_0;
  wire predict_taken_OBUF_inst_i_38_n_0;
  wire predict_taken_OBUF_inst_i_39_n_0;
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
  wire predict_taken_OBUF_inst_i_83_n_0;
  wire predict_taken_OBUF_inst_i_84_n_0;
  wire predict_taken_OBUF_inst_i_85_n_0;
  wire predict_taken_OBUF_inst_i_86_n_0;
  wire predict_taken_OBUF_inst_i_87_n_0;
  wire predict_taken_OBUF_inst_i_88_n_0;
  wire predict_taken_OBUF_inst_i_89_n_0;
  wire predict_taken_OBUF_inst_i_8_n_0;
  wire predict_taken_OBUF_inst_i_90_n_0;
  wire predict_taken_OBUF_inst_i_91_n_0;
  wire predict_taken_OBUF_inst_i_92_n_0;
  wire predict_taken_OBUF_inst_i_93_n_0;
  wire predict_taken_OBUF_inst_i_94_n_0;
  wire predict_taken_OBUF_inst_i_95_n_0;
  wire predict_taken_OBUF_inst_i_96_n_0;
  wire predict_taken_OBUF_inst_i_97_n_0;
  wire predict_taken_OBUF_inst_i_98_n_0;
  wire predict_taken_OBUF_inst_i_9_n_0;
  wire predict_valid;
  wire predict_valid_IBUF;
  wire [6:0]train_history;
  wire [6:0]train_history_IBUF;
  wire [6:0]train_index;
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
  LUT6 #(
    .INIT(64'hAAAAAAAAFCCF0CC0)) 
    \history[0]_i_1 
       (.I0(train_taken_IBUF),
        .I1(\history[0]_i_2_n_0 ),
        .I2(predict_history_OBUF[6]),
        .I3(predict_pc_IBUF[6]),
        .I4(predict_taken_OBUF_inst_i_5_n_0),
        .I5(\history[0]_i_3_n_0 ),
        .O(\history[0]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFB8B8FF00B8B800)) 
    \history[0]_i_2 
       (.I0(predict_taken_OBUF_inst_i_8_n_0),
        .I1(predict_index[4]),
        .I2(predict_taken_OBUF_inst_i_7_n_0),
        .I3(predict_history_OBUF[5]),
        .I4(predict_pc_IBUF[5]),
        .I5(predict_taken_OBUF_inst_i_4_n_0),
        .O(\history[0]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \history[0]_i_3 
       (.I0(train_valid_IBUF),
        .I1(train_mispredicted_IBUF),
        .O(\history[0]_i_3_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'hACCC)) 
    \history[1]_i_1 
       (.I0(train_history_IBUF[0]),
        .I1(predict_history_OBUF[0]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .O(\history[1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT4 #(
    .INIT(16'hACCC)) 
    \history[2]_i_1 
       (.I0(train_history_IBUF[1]),
        .I1(predict_history_OBUF[1]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .O(\history[2]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT4 #(
    .INIT(16'hACCC)) 
    \history[3]_i_1 
       (.I0(train_history_IBUF[2]),
        .I1(predict_history_OBUF[2]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .O(\history[3]_i_1_n_0 ));
  LUT4 #(
    .INIT(16'hACCC)) 
    \history[4]_i_1 
       (.I0(train_history_IBUF[3]),
        .I1(predict_history_OBUF[3]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .O(\history[4]_i_1_n_0 ));
  LUT4 #(
    .INIT(16'hACCC)) 
    \history[5]_i_1 
       (.I0(train_history_IBUF[4]),
        .I1(predict_history_OBUF[4]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .O(\history[5]_i_1_n_0 ));
  LUT3 #(
    .INIT(8'hEA)) 
    \history[6]_i_1 
       (.I0(predict_valid_IBUF),
        .I1(train_mispredicted_IBUF),
        .I2(train_valid_IBUF),
        .O(\history[6]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT4 #(
    .INIT(16'hACCC)) 
    \history[6]_i_2 
       (.I0(train_history_IBUF[5]),
        .I1(predict_history_OBUF[5]),
        .I2(train_valid_IBUF),
        .I3(train_mispredicted_IBUF),
        .O(\history[6]_i_2_n_0 ));
  FDCE \history_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[0]_i_1_n_0 ),
        .Q(predict_history_OBUF[0]));
  FDCE \history_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[1]_i_1_n_0 ),
        .Q(predict_history_OBUF[1]));
  FDCE \history_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[2]_i_1_n_0 ),
        .Q(predict_history_OBUF[2]));
  FDCE \history_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[3]_i_1_n_0 ),
        .Q(predict_history_OBUF[3]));
  FDCE \history_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[4]_i_1_n_0 ),
        .Q(predict_history_OBUF[4]));
  FDCE \history_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[5]_i_1_n_0 ),
        .Q(predict_history_OBUF[5]));
  FDCE \history_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\history[6]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(\history[6]_i_2_n_0 ),
        .Q(predict_history_OBUF[6]));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[0][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[2]),
        .I2(train_index[3]),
        .I3(\pht[4][1]_i_2_n_0 ),
        .I4(train_index[5]),
        .I5(\pht[45][1]_i_2_n_0 ),
        .O(\pht[0][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000800000000000)) 
    \pht[100][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[2]),
        .I3(train_index[5]),
        .I4(\pht[4][1]_i_2_n_0 ),
        .I5(train_index[6]),
        .O(\pht[100][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[101][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(\pht[101][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[4]),
        .I5(train_index[1]),
        .O(\pht[101][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT3 #(
    .INIT(8'h9F)) 
    \pht[101][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_index[0]),
        .O(\pht[101][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000200000000000)) 
    \pht[102][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(train_index[6]),
        .I3(train_index[1]),
        .I4(train_index[3]),
        .I5(\pht[40][1]_i_2_n_0 ),
        .O(\pht[102][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[103][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[77][1]_i_2_n_0 ),
        .I2(\pht[39][1]_i_3_n_0 ),
        .I3(train_index[4]),
        .I4(train_index[5]),
        .I5(train_index[3]),
        .O(\pht[103][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[104][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[1]),
        .I2(train_index[4]),
        .I3(train_index[3]),
        .I4(train_index[5]),
        .I5(\pht[104][1]_i_2_n_0 ),
        .O(\pht[104][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'hF9FFFFF9)) 
    \pht[104][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_index[0]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .O(\pht[104][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[105][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[43][1]_i_2_n_0 ),
        .I2(\pht[101][1]_i_2_n_0 ),
        .I3(train_index[2]),
        .I4(train_index[4]),
        .I5(train_index[1]),
        .O(\pht[105][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000008000000000)) 
    \pht[106][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[5]),
        .I2(train_index[3]),
        .I3(\pht[106][1]_i_2_n_0 ),
        .I4(train_index[2]),
        .I5(\pht[40][1]_i_2_n_0 ),
        .O(\pht[106][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[106][1]_i_2 
       (.I0(train_history_IBUF[1]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[6]),
        .I3(train_pc_IBUF[6]),
        .O(\pht[106][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000020020000)) 
    \pht[107][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[75][1]_i_2_n_0 ),
        .I2(train_pc_IBUF[4]),
        .I3(train_history_IBUF[4]),
        .I4(train_index[5]),
        .I5(train_index[2]),
        .O(\pht[107][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000200000000000)) 
    \pht[108][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(train_index[6]),
        .I3(train_index[3]),
        .I4(train_index[1]),
        .I5(\pht[40][1]_i_2_n_0 ),
        .O(\pht[108][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[109][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[61][1]_i_2_n_0 ),
        .I2(\pht[101][1]_i_2_n_0 ),
        .I3(train_index[4]),
        .I4(train_index[5]),
        .I5(train_index[1]),
        .O(\pht[109][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[10][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[0]),
        .I2(train_index[4]),
        .I3(train_index[2]),
        .I4(train_index[3]),
        .I5(\pht[10][1]_i_2_n_0 ),
        .O(\pht[10][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h9FF9FFFFFFFF9FF9)) 
    \pht[10][1]_i_2 
       (.I0(train_pc_IBUF[1]),
        .I1(train_history_IBUF[1]),
        .I2(train_history_IBUF[6]),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[5]),
        .I5(train_pc_IBUF[5]),
        .O(\pht[10][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[110][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[61][1]_i_2_n_0 ),
        .I2(\pht[106][1]_i_2_n_0 ),
        .I3(train_index[4]),
        .I4(train_index[5]),
        .I5(train_index[0]),
        .O(\pht[110][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000020002000000)) 
    \pht[111][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[15][1]_i_2_n_0 ),
        .I2(train_index[4]),
        .I3(train_index[5]),
        .I4(train_pc_IBUF[6]),
        .I5(train_history_IBUF[6]),
        .O(\pht[111][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[112][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[1]),
        .I3(train_index[4]),
        .I4(train_index[5]),
        .I5(\pht[104][1]_i_2_n_0 ),
        .O(\pht[112][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[113][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[51][1]_i_2_n_0 ),
        .I2(\pht[101][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[2]),
        .I5(train_index[1]),
        .O(\pht[113][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[114][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[51][1]_i_2_n_0 ),
        .I2(\pht[106][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[2]),
        .I5(train_index[0]),
        .O(\pht[114][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[115][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[83][1]_i_2_n_0 ),
        .I2(\pht[39][1]_i_3_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[5]),
        .I5(train_index[2]),
        .O(\pht[115][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[116][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(\pht[83][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[1]),
        .I5(train_index[0]),
        .O(\pht[116][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[117][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[29][1]_i_2_n_0 ),
        .I2(\pht[101][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[5]),
        .I5(train_index[1]),
        .O(\pht[117][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[118][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[29][1]_i_2_n_0 ),
        .I2(\pht[106][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[5]),
        .I5(train_index[0]),
        .O(\pht[118][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000080)) 
    \pht[119][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[6]),
        .I2(train_index[2]),
        .I3(\pht[39][1]_i_3_n_0 ),
        .I4(train_index[3]),
        .I5(\pht[51][1]_i_2_n_0 ),
        .O(\pht[119][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[11][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[2]),
        .I2(train_index[4]),
        .I3(train_index[1]),
        .I4(train_index[3]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[11][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[120][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[43][1]_i_2_n_0 ),
        .I2(\pht[83][1]_i_2_n_0 ),
        .I3(train_index[2]),
        .I4(train_index[1]),
        .I5(train_index[0]),
        .O(\pht[120][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[121][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[60][1]_i_2_n_0 ),
        .I2(\pht[101][1]_i_2_n_0 ),
        .I3(train_index[2]),
        .I4(train_index[5]),
        .I5(train_index[1]),
        .O(\pht[121][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[122][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[60][1]_i_2_n_0 ),
        .I2(\pht[106][1]_i_2_n_0 ),
        .I3(train_index[2]),
        .I4(train_index[5]),
        .I5(train_index[0]),
        .O(\pht[122][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000080)) 
    \pht[123][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[6]),
        .I2(train_index[3]),
        .I3(\pht[39][1]_i_3_n_0 ),
        .I4(train_index[2]),
        .I5(\pht[51][1]_i_2_n_0 ),
        .O(\pht[123][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[124][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[61][1]_i_2_n_0 ),
        .I2(\pht[83][1]_i_2_n_0 ),
        .I3(train_index[1]),
        .I4(train_index[5]),
        .I5(train_index[0]),
        .O(\pht[124][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000080)) 
    \pht[125][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[2]),
        .I3(\pht[101][1]_i_2_n_0 ),
        .I4(train_index[1]),
        .I5(\pht[51][1]_i_2_n_0 ),
        .O(\pht[125][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000080)) 
    \pht[126][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[2]),
        .I3(\pht[106][1]_i_2_n_0 ),
        .I4(train_index[0]),
        .I5(\pht[51][1]_i_2_n_0 ),
        .O(\pht[126][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0220000000000000)) 
    \pht[127][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[15][1]_i_2_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(train_index[4]),
        .I5(train_index[5]),
        .O(\pht[127][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[12][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[1]),
        .I2(train_index[4]),
        .I3(train_index[0]),
        .I4(train_index[3]),
        .I5(\pht[12][1]_i_2_n_0 ),
        .O(\pht[12][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h9FF9FFFFFFFF9FF9)) 
    \pht[12][1]_i_2 
       (.I0(train_pc_IBUF[2]),
        .I1(train_history_IBUF[2]),
        .I2(train_history_IBUF[6]),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[5]),
        .I5(train_pc_IBUF[5]),
        .O(\pht[12][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[13][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[1]),
        .I2(train_index[4]),
        .I3(train_index[2]),
        .I4(train_index[3]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[13][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[14][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[0]),
        .I2(train_index[4]),
        .I3(train_index[1]),
        .I4(train_index[3]),
        .I5(\pht[12][1]_i_2_n_0 ),
        .O(\pht[14][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0002000000000002)) 
    \pht[15][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[15][1]_i_2_n_0 ),
        .I2(train_index[5]),
        .I3(train_index[4]),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[15][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hF99FFFFFFFFFFFFF)) 
    \pht[15][1]_i_2 
       (.I0(train_pc_IBUF[3]),
        .I1(train_history_IBUF[3]),
        .I2(train_pc_IBUF[2]),
        .I3(train_history_IBUF[2]),
        .I4(train_index[0]),
        .I5(train_index[1]),
        .O(\pht[15][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0008000000000000)) 
    \pht[16][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[16][1]_i_2_n_0 ),
        .I2(train_index[1]),
        .I3(train_index[2]),
        .I4(train_index[4]),
        .I5(\pht[2][1]_i_4_n_0 ),
        .O(\pht[16][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair16" *) 
  LUT3 #(
    .INIT(8'h41)) 
    \pht[16][1]_i_2 
       (.I0(train_index[0]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[3]),
        .O(\pht[16][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[17][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[1]),
        .I3(train_index[2]),
        .I4(train_index[4]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[17][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[18][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[0]),
        .I3(train_index[2]),
        .I4(train_index[4]),
        .I5(\pht[10][1]_i_2_n_0 ),
        .O(\pht[18][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[19][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[2]),
        .I2(train_index[3]),
        .I3(train_index[1]),
        .I4(train_index[4]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[19][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h8888A0FAEEEEA0FA)) 
    \pht[1][0]_i_1 
       (.I0(train_taken_IBUF),
        .I1(\pht[1][1]_i_6_n_0 ),
        .I2(\pht[1][1]_i_8_n_0 ),
        .I3(\pht[1][1]_i_10_n_0 ),
        .I4(train_index[6]),
        .I5(\pht[1][1]_i_9_n_0 ),
        .O(pht0_in[0]));
  LUT6 #(
    .INIT(64'h0000000008000008)) 
    \pht[1][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[1]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[1][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_10 
       (.I0(\pht_reg[1][1]_i_23_n_0 ),
        .I1(\pht_reg[1][1]_i_24_n_0 ),
        .I2(train_index[5]),
        .I3(\pht_reg[1][1]_i_25_n_0 ),
        .I4(train_index[4]),
        .I5(\pht_reg[1][1]_i_26_n_0 ),
        .O(\pht[1][1]_i_10_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_100 
       (.I0(\pht_reg_n_0_[87][0] ),
        .I1(\pht_reg_n_0_[86][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[85][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[84][0] ),
        .O(\pht[1][1]_i_100_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_101 
       (.I0(\pht_reg_n_0_[91][0] ),
        .I1(\pht_reg_n_0_[90][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[89][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[88][0] ),
        .O(\pht[1][1]_i_101_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_102 
       (.I0(\pht_reg_n_0_[95][0] ),
        .I1(\pht_reg_n_0_[94][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[93][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[92][0] ),
        .O(\pht[1][1]_i_102_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_103 
       (.I0(\pht_reg_n_0_[67][0] ),
        .I1(\pht_reg_n_0_[66][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[65][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[64][0] ),
        .O(\pht[1][1]_i_103_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_104 
       (.I0(\pht_reg_n_0_[71][0] ),
        .I1(\pht_reg_n_0_[70][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[69][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[68][0] ),
        .O(\pht[1][1]_i_104_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_105 
       (.I0(\pht_reg_n_0_[75][0] ),
        .I1(\pht_reg_n_0_[74][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[73][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[72][0] ),
        .O(\pht[1][1]_i_105_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_106 
       (.I0(\pht_reg_n_0_[79][0] ),
        .I1(\pht_reg_n_0_[78][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[77][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[76][0] ),
        .O(\pht[1][1]_i_106_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_107 
       (.I0(\pht_reg_n_0_[51][0] ),
        .I1(\pht_reg_n_0_[50][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[49][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[48][0] ),
        .O(\pht[1][1]_i_107_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_108 
       (.I0(\pht_reg_n_0_[55][0] ),
        .I1(\pht_reg_n_0_[54][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[53][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[52][0] ),
        .O(\pht[1][1]_i_108_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_109 
       (.I0(\pht_reg_n_0_[59][0] ),
        .I1(\pht_reg_n_0_[58][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[57][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[56][0] ),
        .O(\pht[1][1]_i_109_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_110 
       (.I0(\pht_reg_n_0_[63][0] ),
        .I1(\pht_reg_n_0_[62][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[61][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[60][0] ),
        .O(\pht[1][1]_i_110_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_111 
       (.I0(\pht_reg_n_0_[35][0] ),
        .I1(\pht_reg_n_0_[34][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[33][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[32][0] ),
        .O(\pht[1][1]_i_111_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_112 
       (.I0(\pht_reg_n_0_[39][0] ),
        .I1(\pht_reg_n_0_[38][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[37][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[36][0] ),
        .O(\pht[1][1]_i_112_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_113 
       (.I0(\pht_reg_n_0_[43][0] ),
        .I1(\pht_reg_n_0_[42][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[41][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[40][0] ),
        .O(\pht[1][1]_i_113_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_114 
       (.I0(\pht_reg_n_0_[47][0] ),
        .I1(\pht_reg_n_0_[46][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[45][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[44][0] ),
        .O(\pht[1][1]_i_114_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_115 
       (.I0(\pht_reg_n_0_[19][0] ),
        .I1(\pht_reg_n_0_[18][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[17][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[16][0] ),
        .O(\pht[1][1]_i_115_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_116 
       (.I0(\pht_reg_n_0_[23][0] ),
        .I1(\pht_reg_n_0_[22][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[21][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[20][0] ),
        .O(\pht[1][1]_i_116_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_117 
       (.I0(\pht_reg_n_0_[27][0] ),
        .I1(\pht_reg_n_0_[26][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[25][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[24][0] ),
        .O(\pht[1][1]_i_117_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_118 
       (.I0(\pht_reg_n_0_[31][0] ),
        .I1(\pht_reg_n_0_[30][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[29][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[28][0] ),
        .O(\pht[1][1]_i_118_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_119 
       (.I0(\pht_reg_n_0_[3][0] ),
        .I1(\pht_reg_n_0_[2][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[1][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[0][0] ),
        .O(\pht[1][1]_i_119_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_120 
       (.I0(\pht_reg_n_0_[7][0] ),
        .I1(\pht_reg_n_0_[6][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[5][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[4][0] ),
        .O(\pht[1][1]_i_120_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_121 
       (.I0(\pht_reg_n_0_[11][0] ),
        .I1(\pht_reg_n_0_[10][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[9][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[8][0] ),
        .O(\pht[1][1]_i_121_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_122 
       (.I0(\pht_reg_n_0_[15][0] ),
        .I1(\pht_reg_n_0_[14][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[13][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[12][0] ),
        .O(\pht[1][1]_i_122_n_0 ));
  LUT6 #(
    .INIT(64'hEFEA8F8AEAE08A80)) 
    \pht[1][1]_i_2 
       (.I0(train_taken_IBUF),
        .I1(\pht[1][1]_i_6_n_0 ),
        .I2(train_index[6]),
        .I3(\pht[1][1]_i_8_n_0 ),
        .I4(\pht[1][1]_i_9_n_0 ),
        .I5(\pht[1][1]_i_10_n_0 ),
        .O(pht0_in[1]));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT4 #(
    .INIT(16'h9009)) 
    \pht[1][1]_i_3 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[3]),
        .O(\pht[1][1]_i_3_n_0 ));
  LUT2 #(
    .INIT(4'h6)) 
    \pht[1][1]_i_4 
       (.I0(train_history_IBUF[1]),
        .I1(train_pc_IBUF[1]),
        .O(train_index[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h7DFFFF7D)) 
    \pht[1][1]_i_5 
       (.I0(train_index[0]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[5]),
        .I4(train_pc_IBUF[5]),
        .O(\pht[1][1]_i_5_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_59 
       (.I0(\pht_reg_n_0_[115][1] ),
        .I1(\pht_reg_n_0_[114][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[113][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[112][1] ),
        .O(\pht[1][1]_i_59_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_6 
       (.I0(\pht_reg[1][1]_i_11_n_0 ),
        .I1(\pht_reg[1][1]_i_12_n_0 ),
        .I2(train_index[5]),
        .I3(\pht_reg[1][1]_i_13_n_0 ),
        .I4(train_index[4]),
        .I5(\pht_reg[1][1]_i_14_n_0 ),
        .O(\pht[1][1]_i_6_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_60 
       (.I0(\pht_reg_n_0_[119][1] ),
        .I1(\pht_reg_n_0_[118][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[117][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[116][1] ),
        .O(\pht[1][1]_i_60_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_61 
       (.I0(\pht_reg_n_0_[123][1] ),
        .I1(\pht_reg_n_0_[122][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[121][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[120][1] ),
        .O(\pht[1][1]_i_61_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_62 
       (.I0(\pht_reg_n_0_[127][1] ),
        .I1(\pht_reg_n_0_[126][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[125][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[124][1] ),
        .O(\pht[1][1]_i_62_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_63 
       (.I0(\pht_reg_n_0_[99][1] ),
        .I1(\pht_reg_n_0_[98][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[97][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[96][1] ),
        .O(\pht[1][1]_i_63_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_64 
       (.I0(\pht_reg_n_0_[103][1] ),
        .I1(\pht_reg_n_0_[102][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[101][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[100][1] ),
        .O(\pht[1][1]_i_64_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_65 
       (.I0(\pht_reg_n_0_[107][1] ),
        .I1(\pht_reg_n_0_[106][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[105][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[104][1] ),
        .O(\pht[1][1]_i_65_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_66 
       (.I0(\pht_reg_n_0_[111][1] ),
        .I1(\pht_reg_n_0_[110][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[109][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[108][1] ),
        .O(\pht[1][1]_i_66_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_67 
       (.I0(\pht_reg_n_0_[83][1] ),
        .I1(\pht_reg_n_0_[82][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[81][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[80][1] ),
        .O(\pht[1][1]_i_67_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_68 
       (.I0(\pht_reg_n_0_[87][1] ),
        .I1(\pht_reg_n_0_[86][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[85][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[84][1] ),
        .O(\pht[1][1]_i_68_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_69 
       (.I0(\pht_reg_n_0_[91][1] ),
        .I1(\pht_reg_n_0_[90][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[89][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[88][1] ),
        .O(\pht[1][1]_i_69_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair21" *) 
  LUT2 #(
    .INIT(4'h6)) 
    \pht[1][1]_i_7 
       (.I0(train_history_IBUF[6]),
        .I1(train_pc_IBUF[6]),
        .O(train_index[6]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_70 
       (.I0(\pht_reg_n_0_[95][1] ),
        .I1(\pht_reg_n_0_[94][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[93][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[92][1] ),
        .O(\pht[1][1]_i_70_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_71 
       (.I0(\pht_reg_n_0_[67][1] ),
        .I1(\pht_reg_n_0_[66][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[65][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[64][1] ),
        .O(\pht[1][1]_i_71_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_72 
       (.I0(\pht_reg_n_0_[71][1] ),
        .I1(\pht_reg_n_0_[70][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[69][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[68][1] ),
        .O(\pht[1][1]_i_72_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_73 
       (.I0(\pht_reg_n_0_[75][1] ),
        .I1(\pht_reg_n_0_[74][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[73][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[72][1] ),
        .O(\pht[1][1]_i_73_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_74 
       (.I0(\pht_reg_n_0_[79][1] ),
        .I1(\pht_reg_n_0_[78][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[77][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[76][1] ),
        .O(\pht[1][1]_i_74_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_75 
       (.I0(\pht_reg_n_0_[51][1] ),
        .I1(\pht_reg_n_0_[50][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[49][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[48][1] ),
        .O(\pht[1][1]_i_75_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_76 
       (.I0(\pht_reg_n_0_[55][1] ),
        .I1(\pht_reg_n_0_[54][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[53][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[52][1] ),
        .O(\pht[1][1]_i_76_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_77 
       (.I0(\pht_reg_n_0_[59][1] ),
        .I1(\pht_reg_n_0_[58][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[57][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[56][1] ),
        .O(\pht[1][1]_i_77_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_78 
       (.I0(\pht_reg_n_0_[63][1] ),
        .I1(\pht_reg_n_0_[62][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[61][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[60][1] ),
        .O(\pht[1][1]_i_78_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_79 
       (.I0(\pht_reg_n_0_[35][1] ),
        .I1(\pht_reg_n_0_[34][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[33][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[32][1] ),
        .O(\pht[1][1]_i_79_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_8 
       (.I0(\pht_reg[1][1]_i_15_n_0 ),
        .I1(\pht_reg[1][1]_i_16_n_0 ),
        .I2(train_index[5]),
        .I3(\pht_reg[1][1]_i_17_n_0 ),
        .I4(train_index[4]),
        .I5(\pht_reg[1][1]_i_18_n_0 ),
        .O(\pht[1][1]_i_8_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_80 
       (.I0(\pht_reg_n_0_[39][1] ),
        .I1(\pht_reg_n_0_[38][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[37][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[36][1] ),
        .O(\pht[1][1]_i_80_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_81 
       (.I0(\pht_reg_n_0_[43][1] ),
        .I1(\pht_reg_n_0_[42][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[41][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[40][1] ),
        .O(\pht[1][1]_i_81_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_82 
       (.I0(\pht_reg_n_0_[47][1] ),
        .I1(\pht_reg_n_0_[46][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[45][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[44][1] ),
        .O(\pht[1][1]_i_82_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_83 
       (.I0(\pht_reg_n_0_[19][1] ),
        .I1(\pht_reg_n_0_[18][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[17][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[16][1] ),
        .O(\pht[1][1]_i_83_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_84 
       (.I0(\pht_reg_n_0_[23][1] ),
        .I1(\pht_reg_n_0_[22][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[21][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[20][1] ),
        .O(\pht[1][1]_i_84_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_85 
       (.I0(\pht_reg_n_0_[27][1] ),
        .I1(\pht_reg_n_0_[26][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[25][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[24][1] ),
        .O(\pht[1][1]_i_85_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_86 
       (.I0(\pht_reg_n_0_[31][1] ),
        .I1(\pht_reg_n_0_[30][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[29][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[28][1] ),
        .O(\pht[1][1]_i_86_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_87 
       (.I0(\pht_reg_n_0_[3][1] ),
        .I1(\pht_reg_n_0_[2][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[1][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[0][1] ),
        .O(\pht[1][1]_i_87_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_88 
       (.I0(\pht_reg_n_0_[7][1] ),
        .I1(\pht_reg_n_0_[6][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[5][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[4][1] ),
        .O(\pht[1][1]_i_88_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_89 
       (.I0(\pht_reg_n_0_[11][1] ),
        .I1(\pht_reg_n_0_[10][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[9][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[8][1] ),
        .O(\pht[1][1]_i_89_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_9 
       (.I0(\pht_reg[1][1]_i_19_n_0 ),
        .I1(\pht_reg[1][1]_i_20_n_0 ),
        .I2(train_index[5]),
        .I3(\pht_reg[1][1]_i_21_n_0 ),
        .I4(train_index[4]),
        .I5(\pht_reg[1][1]_i_22_n_0 ),
        .O(\pht[1][1]_i_9_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_90 
       (.I0(\pht_reg_n_0_[15][1] ),
        .I1(\pht_reg_n_0_[14][1] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[13][1] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[12][1] ),
        .O(\pht[1][1]_i_90_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_91 
       (.I0(\pht_reg_n_0_[115][0] ),
        .I1(\pht_reg_n_0_[114][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[113][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[112][0] ),
        .O(\pht[1][1]_i_91_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_92 
       (.I0(\pht_reg_n_0_[119][0] ),
        .I1(\pht_reg_n_0_[118][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[117][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[116][0] ),
        .O(\pht[1][1]_i_92_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_93 
       (.I0(\pht_reg_n_0_[123][0] ),
        .I1(\pht_reg_n_0_[122][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[121][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[120][0] ),
        .O(\pht[1][1]_i_93_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_94 
       (.I0(\pht_reg_n_0_[127][0] ),
        .I1(\pht_reg_n_0_[126][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[125][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[124][0] ),
        .O(\pht[1][1]_i_94_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_95 
       (.I0(\pht_reg_n_0_[99][0] ),
        .I1(\pht_reg_n_0_[98][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[97][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[96][0] ),
        .O(\pht[1][1]_i_95_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_96 
       (.I0(\pht_reg_n_0_[103][0] ),
        .I1(\pht_reg_n_0_[102][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[101][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[100][0] ),
        .O(\pht[1][1]_i_96_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_97 
       (.I0(\pht_reg_n_0_[107][0] ),
        .I1(\pht_reg_n_0_[106][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[105][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[104][0] ),
        .O(\pht[1][1]_i_97_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_98 
       (.I0(\pht_reg_n_0_[111][0] ),
        .I1(\pht_reg_n_0_[110][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[109][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[108][0] ),
        .O(\pht[1][1]_i_98_n_0 ));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \pht[1][1]_i_99 
       (.I0(\pht_reg_n_0_[83][0] ),
        .I1(\pht_reg_n_0_[82][0] ),
        .I2(train_index[1]),
        .I3(\pht_reg_n_0_[81][0] ),
        .I4(train_index[0]),
        .I5(\pht_reg_n_0_[80][0] ),
        .O(\pht[1][1]_i_99_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[20][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[1]),
        .I3(train_index[0]),
        .I4(train_index[4]),
        .I5(\pht[12][1]_i_2_n_0 ),
        .O(\pht[20][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[21][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[1]),
        .I3(train_index[2]),
        .I4(train_index[4]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[21][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[22][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[0]),
        .I3(train_index[1]),
        .I4(train_index[4]),
        .I5(\pht[12][1]_i_2_n_0 ),
        .O(\pht[22][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0002000000000002)) 
    \pht[23][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[23][1]_i_2_n_0 ),
        .I2(train_index[5]),
        .I3(train_index[3]),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[23][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hF99FFFFFFFFFFFFF)) 
    \pht[23][1]_i_2 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[2]),
        .I3(train_history_IBUF[2]),
        .I4(train_index[0]),
        .I5(train_index[1]),
        .O(\pht[23][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[24][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[0]),
        .I2(train_index[1]),
        .I3(train_index[2]),
        .I4(train_index[4]),
        .I5(\pht[8][1]_i_3_n_0 ),
        .O(\pht[24][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[25][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[1]),
        .I2(train_index[2]),
        .I3(train_index[3]),
        .I4(train_index[4]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[25][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[26][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[0]),
        .I2(train_index[2]),
        .I3(train_index[1]),
        .I4(train_index[4]),
        .I5(\pht[8][1]_i_3_n_0 ),
        .O(\pht[26][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0002000000000002)) 
    \pht[27][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[27][1]_i_2_n_0 ),
        .I2(train_index[5]),
        .I3(train_index[2]),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[27][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hF99FFFFFFFFFFFFF)) 
    \pht[27][1]_i_2 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[3]),
        .I4(train_index[0]),
        .I5(train_index[1]),
        .O(\pht[27][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[28][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[0]),
        .I2(train_index[1]),
        .I3(train_index[2]),
        .I4(train_index[4]),
        .I5(\pht[8][1]_i_3_n_0 ),
        .O(\pht[28][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[29][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[29][1]_i_2_n_0 ),
        .I2(train_index[0]),
        .I3(train_index[3]),
        .I4(train_index[5]),
        .I5(\pht[29][1]_i_3_n_0 ),
        .O(\pht[29][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[29][1]_i_2 
       (.I0(train_history_IBUF[2]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .O(\pht[29][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair11" *) 
  LUT4 #(
    .INIT(16'h6FF6)) 
    \pht[29][1]_i_3 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[1]),
        .I3(train_history_IBUF[1]),
        .O(\pht[29][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0008000000000000)) 
    \pht[2][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[0]),
        .I3(train_index[2]),
        .I4(train_index[1]),
        .I5(\pht[2][1]_i_4_n_0 ),
        .O(\pht[2][1]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h6)) 
    \pht[2][1]_i_2 
       (.I0(train_history_IBUF[0]),
        .I1(train_pc_IBUF[0]),
        .O(train_index[0]));
  LUT2 #(
    .INIT(4'h6)) 
    \pht[2][1]_i_3 
       (.I0(train_history_IBUF[2]),
        .I1(train_pc_IBUF[2]),
        .O(train_index[2]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h9009)) 
    \pht[2][1]_i_4 
       (.I0(train_pc_IBUF[5]),
        .I1(train_history_IBUF[5]),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .O(\pht[2][1]_i_4_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[30][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[29][1]_i_2_n_0 ),
        .I2(train_index[3]),
        .I3(train_index[1]),
        .I4(train_index[5]),
        .I5(\pht[30][1]_i_2_n_0 ),
        .O(\pht[30][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair21" *) 
  LUT3 #(
    .INIT(8'hF6)) 
    \pht[30][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_index[0]),
        .O(\pht[30][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0200000000000200)) 
    \pht[31][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[15][1]_i_2_n_0 ),
        .I2(train_index[5]),
        .I3(train_index[4]),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[31][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[32][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(\pht[32][1]_i_2_n_0 ),
        .I3(train_index[5]),
        .I4(train_index[6]),
        .I5(train_index[0]),
        .O(\pht[32][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT4 #(
    .INIT(16'h9009)) 
    \pht[32][1]_i_2 
       (.I0(train_pc_IBUF[2]),
        .I1(train_history_IBUF[2]),
        .I2(train_pc_IBUF[1]),
        .I3(train_history_IBUF[1]),
        .O(\pht[32][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000008000000)) 
    \pht[33][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[2]),
        .I3(train_index[5]),
        .I4(train_index[0]),
        .I5(\pht[29][1]_i_3_n_0 ),
        .O(\pht[33][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000008000000)) 
    \pht[34][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[2]),
        .I3(train_index[5]),
        .I4(train_index[1]),
        .I5(\pht[30][1]_i_2_n_0 ),
        .O(\pht[34][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000020000020)) 
    \pht[35][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[35][1]_i_2_n_0 ),
        .I2(train_index[0]),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .I5(train_index[2]),
        .O(\pht[35][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hFFFFBEFFBEFFFFFF)) 
    \pht[35][1]_i_2 
       (.I0(train_index[3]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[4]),
        .I3(train_index[1]),
        .I4(train_history_IBUF[5]),
        .I5(train_pc_IBUF[5]),
        .O(\pht[35][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000008000000)) 
    \pht[36][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[0]),
        .I3(train_index[5]),
        .I4(train_index[2]),
        .I5(\pht[29][1]_i_3_n_0 ),
        .O(\pht[36][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000080000000)) 
    \pht[37][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[2]),
        .I3(train_index[5]),
        .I4(train_index[0]),
        .I5(\pht[29][1]_i_3_n_0 ),
        .O(\pht[37][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000080000000)) 
    \pht[38][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[1]),
        .I3(train_index[5]),
        .I4(train_index[2]),
        .I5(\pht[30][1]_i_2_n_0 ),
        .O(\pht[38][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[39][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(\pht[39][1]_i_3_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[4]),
        .I5(train_index[6]),
        .O(\pht[39][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[39][1]_i_2 
       (.I0(train_history_IBUF[2]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[5]),
        .I3(train_pc_IBUF[5]),
        .O(\pht[39][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair7" *) 
  LUT3 #(
    .INIT(8'h9F)) 
    \pht[39][1]_i_3 
       (.I0(train_pc_IBUF[1]),
        .I1(train_history_IBUF[1]),
        .I2(train_index[0]),
        .O(\pht[39][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0000000080080000)) 
    \pht[3][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_history_IBUF[2]),
        .I3(train_pc_IBUF[2]),
        .I4(train_index[1]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[3][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000008000000)) 
    \pht[40][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[40][1]_i_2_n_0 ),
        .I2(train_index[2]),
        .I3(train_index[5]),
        .I4(train_index[3]),
        .I5(\pht[29][1]_i_3_n_0 ),
        .O(\pht[40][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair15" *) 
  LUT3 #(
    .INIT(8'h09)) 
    \pht[40][1]_i_2 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_index[0]),
        .O(\pht[40][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[41][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[1]),
        .I2(train_index[4]),
        .I3(train_index[3]),
        .I4(train_index[5]),
        .I5(\pht[41][1]_i_2_n_0 ),
        .O(\pht[41][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'h7DFFFF7D)) 
    \pht[41][1]_i_2 
       (.I0(train_index[0]),
        .I1(train_pc_IBUF[6]),
        .I2(train_history_IBUF[6]),
        .I3(train_pc_IBUF[2]),
        .I4(train_history_IBUF[2]),
        .O(\pht[41][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000080000000)) 
    \pht[42][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[40][1]_i_2_n_0 ),
        .I2(train_index[1]),
        .I3(train_index[5]),
        .I4(train_index[3]),
        .I5(\pht[42][1]_i_2_n_0 ),
        .O(\pht[42][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT4 #(
    .INIT(16'h6FF6)) 
    \pht[42][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[2]),
        .I3(train_history_IBUF[2]),
        .O(\pht[42][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[43][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[43][1]_i_2_n_0 ),
        .I2(\pht[39][1]_i_3_n_0 ),
        .I3(train_index[2]),
        .I4(train_index[4]),
        .I5(train_index[6]),
        .O(\pht[43][1]_i_1_n_0 ));
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[43][1]_i_2 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[5]),
        .I3(train_pc_IBUF[5]),
        .O(\pht[43][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000080000000)) 
    \pht[44][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[40][1]_i_2_n_0 ),
        .I2(train_index[2]),
        .I3(train_index[5]),
        .I4(train_index[3]),
        .I5(\pht[29][1]_i_3_n_0 ),
        .O(\pht[44][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[45][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(train_index[0]),
        .I3(train_index[3]),
        .I4(train_index[1]),
        .I5(\pht[45][1]_i_2_n_0 ),
        .O(\pht[45][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair19" *) 
  LUT4 #(
    .INIT(16'h6FF6)) 
    \pht[45][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[4]),
        .I3(train_history_IBUF[4]),
        .O(\pht[45][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[46][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(train_index[3]),
        .I3(train_index[1]),
        .I4(train_index[0]),
        .I5(\pht[45][1]_i_2_n_0 ),
        .O(\pht[46][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0200000000000200)) 
    \pht[47][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[15][1]_i_2_n_0 ),
        .I2(train_index[4]),
        .I3(train_index[5]),
        .I4(train_history_IBUF[6]),
        .I5(train_pc_IBUF[6]),
        .O(\pht[47][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000008000000)) 
    \pht[48][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[16][1]_i_2_n_0 ),
        .I2(train_index[2]),
        .I3(train_index[5]),
        .I4(train_index[4]),
        .I5(\pht[29][1]_i_3_n_0 ),
        .O(\pht[48][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[49][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[1]),
        .I3(train_index[4]),
        .I4(train_index[5]),
        .I5(\pht[41][1]_i_2_n_0 ),
        .O(\pht[49][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[4][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[4][1]_i_2_n_0 ),
        .I2(\pht[1][1]_i_3_n_0 ),
        .I3(train_index[2]),
        .I4(train_index[6]),
        .I5(train_index[5]),
        .O(\pht[4][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT3 #(
    .INIT(8'hF6)) 
    \pht[4][1]_i_2 
       (.I0(train_pc_IBUF[1]),
        .I1(train_history_IBUF[1]),
        .I2(train_index[0]),
        .O(\pht[4][1]_i_2_n_0 ));
  LUT2 #(
    .INIT(4'h6)) 
    \pht[4][1]_i_3 
       (.I0(train_history_IBUF[5]),
        .I1(train_pc_IBUF[5]),
        .O(train_index[5]));
  LUT6 #(
    .INIT(64'h0000000080000000)) 
    \pht[50][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[16][1]_i_2_n_0 ),
        .I2(train_index[1]),
        .I3(train_index[5]),
        .I4(train_index[4]),
        .I5(\pht[42][1]_i_2_n_0 ),
        .O(\pht[50][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[51][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[51][1]_i_2_n_0 ),
        .I2(\pht[39][1]_i_3_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[2]),
        .I5(train_index[6]),
        .O(\pht[51][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair18" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[51][1]_i_2 
       (.I0(train_history_IBUF[4]),
        .I1(train_pc_IBUF[4]),
        .I2(train_history_IBUF[5]),
        .I3(train_pc_IBUF[5]),
        .O(\pht[51][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000080000000)) 
    \pht[52][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[16][1]_i_2_n_0 ),
        .I2(train_index[2]),
        .I3(train_index[5]),
        .I4(train_index[4]),
        .I5(\pht[29][1]_i_3_n_0 ),
        .O(\pht[52][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[53][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(\pht[53][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[1]),
        .I5(train_index[6]),
        .O(\pht[53][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair18" *) 
  LUT3 #(
    .INIT(8'h9F)) 
    \pht[53][1]_i_2 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_index[0]),
        .O(\pht[53][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[54][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(train_index[4]),
        .I3(train_index[1]),
        .I4(train_index[3]),
        .I5(\pht[30][1]_i_2_n_0 ),
        .O(\pht[54][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000080)) 
    \pht[55][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[4]),
        .I2(train_index[2]),
        .I3(\pht[39][1]_i_3_n_0 ),
        .I4(train_index[3]),
        .I5(\pht[55][1]_i_2_n_0 ),
        .O(\pht[55][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair20" *) 
  LUT4 #(
    .INIT(16'hF66F)) 
    \pht[55][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[5]),
        .I3(train_history_IBUF[5]),
        .O(\pht[55][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000020000000)) 
    \pht[56][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[4][1]_i_2_n_0 ),
        .I2(train_index[3]),
        .I3(train_index[5]),
        .I4(train_index[4]),
        .I5(\pht[42][1]_i_2_n_0 ),
        .O(\pht[56][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[57][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[43][1]_i_2_n_0 ),
        .I2(\pht[53][1]_i_2_n_0 ),
        .I3(train_index[2]),
        .I4(train_index[1]),
        .I5(train_index[6]),
        .O(\pht[57][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[58][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[43][1]_i_2_n_0 ),
        .I2(train_index[4]),
        .I3(train_index[1]),
        .I4(train_index[2]),
        .I5(\pht[30][1]_i_2_n_0 ),
        .O(\pht[58][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000080)) 
    \pht[59][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[4]),
        .I2(train_index[3]),
        .I3(\pht[39][1]_i_3_n_0 ),
        .I4(train_index[2]),
        .I5(\pht[55][1]_i_2_n_0 ),
        .O(\pht[59][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000080800)) 
    \pht[5][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[1]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[5][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[60][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[39][1]_i_2_n_0 ),
        .I2(\pht[60][1]_i_2_n_0 ),
        .I3(train_index[1]),
        .I4(train_index[0]),
        .I5(train_index[6]),
        .O(\pht[60][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair8" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[60][1]_i_2 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .O(\pht[60][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[61][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[61][1]_i_2_n_0 ),
        .I2(train_index[0]),
        .I3(train_index[4]),
        .I4(train_index[1]),
        .I5(\pht[55][1]_i_2_n_0 ),
        .O(\pht[61][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair16" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[61][1]_i_2 
       (.I0(train_history_IBUF[2]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[3]),
        .I3(train_pc_IBUF[3]),
        .O(\pht[61][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[62][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[61][1]_i_2_n_0 ),
        .I2(train_index[4]),
        .I3(train_index[1]),
        .I4(train_index[0]),
        .I5(\pht[55][1]_i_2_n_0 ),
        .O(\pht[62][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h2002000000000000)) 
    \pht[63][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[15][1]_i_2_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(train_index[5]),
        .I5(train_index[4]),
        .O(\pht[63][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[64][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(\pht[32][1]_i_2_n_0 ),
        .I3(train_index[6]),
        .I4(train_index[0]),
        .I5(train_index[5]),
        .O(\pht[64][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[65][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(\pht[65][1]_i_2_n_0 ),
        .I3(train_index[0]),
        .I4(train_index[1]),
        .I5(train_index[5]),
        .O(\pht[65][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair13" *) 
  LUT4 #(
    .INIT(16'h6006)) 
    \pht[65][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[2]),
        .I3(train_history_IBUF[2]),
        .O(\pht[65][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[66][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(\pht[65][1]_i_2_n_0 ),
        .I3(train_index[1]),
        .I4(train_index[0]),
        .I5(train_index[5]),
        .O(\pht[66][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[67][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(\pht[67][1]_i_2_n_0 ),
        .I3(train_index[0]),
        .I4(train_index[2]),
        .I5(train_index[5]),
        .O(\pht[67][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair12" *) 
  LUT4 #(
    .INIT(16'h0660)) 
    \pht[67][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[1]),
        .I3(train_history_IBUF[1]),
        .O(\pht[67][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0800000000000000)) 
    \pht[68][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[0]),
        .I3(train_index[6]),
        .I4(train_index[2]),
        .I5(\pht[68][1]_i_2_n_0 ),
        .O(\pht[68][1]_i_1_n_0 ));
  LUT4 #(
    .INIT(16'h9009)) 
    \pht[68][1]_i_2 
       (.I0(train_pc_IBUF[5]),
        .I1(train_history_IBUF[5]),
        .I2(train_pc_IBUF[1]),
        .I3(train_history_IBUF[1]),
        .O(\pht[68][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[69][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(\pht[69][1]_i_2_n_0 ),
        .I3(train_index[0]),
        .I4(train_index[1]),
        .I5(train_index[5]),
        .O(\pht[69][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT4 #(
    .INIT(16'h0660)) 
    \pht[69][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[2]),
        .I3(train_history_IBUF[2]),
        .O(\pht[69][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0800000000000000)) 
    \pht[6][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[0]),
        .I3(train_index[2]),
        .I4(train_index[1]),
        .I5(\pht[2][1]_i_4_n_0 ),
        .O(\pht[6][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[70][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(\pht[67][1]_i_2_n_0 ),
        .I3(train_index[2]),
        .I4(train_index[0]),
        .I5(train_index[5]),
        .O(\pht[70][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000008000000000)) 
    \pht[71][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[6]),
        .I2(train_index[2]),
        .I3(\pht[39][1]_i_3_n_0 ),
        .I4(train_index[5]),
        .I5(\pht[1][1]_i_3_n_0 ),
        .O(\pht[71][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[72][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[40][1]_i_2_n_0 ),
        .I2(\pht[65][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[1]),
        .I5(train_index[5]),
        .O(\pht[72][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[73][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[1]),
        .I2(train_index[4]),
        .I3(train_index[3]),
        .I4(train_index[6]),
        .I5(\pht[73][1]_i_2_n_0 ),
        .O(\pht[73][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT5 #(
    .INIT(32'h7DFFFF7D)) 
    \pht[73][1]_i_2 
       (.I0(train_index[0]),
        .I1(train_history_IBUF[2]),
        .I2(train_pc_IBUF[2]),
        .I3(train_history_IBUF[5]),
        .I4(train_pc_IBUF[5]),
        .O(\pht[73][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[74][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[40][1]_i_2_n_0 ),
        .I2(\pht[67][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[2]),
        .I5(train_index[5]),
        .O(\pht[74][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000002)) 
    \pht[75][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[75][1]_i_2_n_0 ),
        .I2(train_index[5]),
        .I3(train_pc_IBUF[4]),
        .I4(train_history_IBUF[4]),
        .I5(train_index[2]),
        .O(\pht[75][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'hF99FFFFFFFFFFFFF)) 
    \pht[75][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[3]),
        .I4(train_index[0]),
        .I5(train_index[1]),
        .O(\pht[75][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[76][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[40][1]_i_2_n_0 ),
        .I2(\pht[69][1]_i_2_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[1]),
        .I5(train_index[5]),
        .O(\pht[76][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000200000000000)) 
    \pht[77][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[77][1]_i_2_n_0 ),
        .I2(train_index[0]),
        .I3(train_index[3]),
        .I4(train_index[5]),
        .I5(\pht[77][1]_i_3_n_0 ),
        .O(\pht[77][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair14" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[77][1]_i_2 
       (.I0(train_history_IBUF[2]),
        .I1(train_pc_IBUF[2]),
        .I2(train_history_IBUF[6]),
        .I3(train_pc_IBUF[6]),
        .O(\pht[77][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT4 #(
    .INIT(16'h9009)) 
    \pht[77][1]_i_3 
       (.I0(train_pc_IBUF[4]),
        .I1(train_history_IBUF[4]),
        .I2(train_pc_IBUF[1]),
        .I3(train_history_IBUF[1]),
        .O(\pht[77][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0000200000000000)) 
    \pht[78][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[77][1]_i_2_n_0 ),
        .I2(train_index[3]),
        .I3(train_index[1]),
        .I4(train_index[5]),
        .I5(\pht[40][1]_i_2_n_0 ),
        .O(\pht[78][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020200)) 
    \pht[79][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[15][1]_i_2_n_0 ),
        .I2(train_index[5]),
        .I3(train_history_IBUF[6]),
        .I4(train_pc_IBUF[6]),
        .I5(train_index[4]),
        .O(\pht[79][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000808000)) 
    \pht[7][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[1]),
        .I3(train_history_IBUF[2]),
        .I4(train_pc_IBUF[2]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[7][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[80][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[16][1]_i_2_n_0 ),
        .I2(\pht[65][1]_i_2_n_0 ),
        .I3(train_index[4]),
        .I4(train_index[1]),
        .I5(train_index[5]),
        .O(\pht[80][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000002000000)) 
    \pht[81][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[3]),
        .I2(train_index[1]),
        .I3(train_index[4]),
        .I4(train_index[6]),
        .I5(\pht[73][1]_i_2_n_0 ),
        .O(\pht[81][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[82][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[16][1]_i_2_n_0 ),
        .I2(\pht[67][1]_i_2_n_0 ),
        .I3(train_index[4]),
        .I4(train_index[2]),
        .I5(train_index[5]),
        .O(\pht[82][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[83][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[83][1]_i_2_n_0 ),
        .I2(\pht[39][1]_i_3_n_0 ),
        .I3(train_index[5]),
        .I4(train_index[2]),
        .I5(train_index[3]),
        .O(\pht[83][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair19" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[83][1]_i_2 
       (.I0(train_history_IBUF[4]),
        .I1(train_pc_IBUF[4]),
        .I2(train_history_IBUF[6]),
        .I3(train_pc_IBUF[6]),
        .O(\pht[83][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000008000)) 
    \pht[84][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[16][1]_i_2_n_0 ),
        .I2(\pht[69][1]_i_2_n_0 ),
        .I3(train_index[4]),
        .I4(train_index[1]),
        .I5(train_index[5]),
        .O(\pht[84][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000200000000000)) 
    \pht[85][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[77][1]_i_2_n_0 ),
        .I2(train_index[0]),
        .I3(train_index[4]),
        .I4(train_index[5]),
        .I5(\pht[85][1]_i_2_n_0 ),
        .O(\pht[85][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair10" *) 
  LUT4 #(
    .INIT(16'h9009)) 
    \pht[85][1]_i_2 
       (.I0(train_pc_IBUF[1]),
        .I1(train_history_IBUF[1]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[3]),
        .O(\pht[85][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000200000000000)) 
    \pht[86][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[77][1]_i_2_n_0 ),
        .I2(train_index[4]),
        .I3(train_index[1]),
        .I4(train_index[5]),
        .I5(\pht[16][1]_i_2_n_0 ),
        .O(\pht[86][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020200)) 
    \pht[87][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[23][1]_i_2_n_0 ),
        .I2(train_index[5]),
        .I3(train_history_IBUF[6]),
        .I4(train_pc_IBUF[6]),
        .I5(train_index[3]),
        .O(\pht[87][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[88][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[4][1]_i_2_n_0 ),
        .I2(\pht[88][1]_i_2_n_0 ),
        .I3(train_index[4]),
        .I4(train_index[2]),
        .I5(train_index[5]),
        .O(\pht[88][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair17" *) 
  LUT4 #(
    .INIT(16'h0660)) 
    \pht[88][1]_i_2 
       (.I0(train_pc_IBUF[6]),
        .I1(train_history_IBUF[6]),
        .I2(train_pc_IBUF[3]),
        .I3(train_history_IBUF[3]),
        .O(\pht[88][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000008000000000)) 
    \pht[89][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[6]),
        .I2(train_index[3]),
        .I3(\pht[53][1]_i_2_n_0 ),
        .I4(train_index[5]),
        .I5(\pht[32][1]_i_2_n_0 ),
        .O(\pht[89][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[8][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[0]),
        .I2(train_index[4]),
        .I3(train_index[1]),
        .I4(train_index[2]),
        .I5(\pht[8][1]_i_3_n_0 ),
        .O(\pht[8][1]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h6)) 
    \pht[8][1]_i_2 
       (.I0(train_history_IBUF[4]),
        .I1(train_pc_IBUF[4]),
        .O(train_index[4]));
  LUT6 #(
    .INIT(64'h9FF9FFFFFFFF9FF9)) 
    \pht[8][1]_i_3 
       (.I0(train_pc_IBUF[3]),
        .I1(train_history_IBUF[3]),
        .I2(train_history_IBUF[6]),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[5]),
        .I5(train_pc_IBUF[5]),
        .O(\pht[8][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000002)) 
    \pht[90][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[90][1]_i_2_n_0 ),
        .I2(\pht[90][1]_i_3_n_0 ),
        .I3(train_index[5]),
        .I4(train_index[2]),
        .I5(train_index[0]),
        .O(\pht[90][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair17" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[90][1]_i_2 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .I2(train_history_IBUF[6]),
        .I3(train_pc_IBUF[6]),
        .O(\pht[90][1]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair9" *) 
  LUT4 #(
    .INIT(16'hF99F)) 
    \pht[90][1]_i_3 
       (.I0(train_history_IBUF[1]),
        .I1(train_pc_IBUF[1]),
        .I2(train_history_IBUF[4]),
        .I3(train_pc_IBUF[4]),
        .O(\pht[90][1]_i_3_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020200)) 
    \pht[91][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[27][1]_i_2_n_0 ),
        .I2(train_index[5]),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .I5(train_index[2]),
        .O(\pht[91][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000002000)) 
    \pht[92][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[77][1]_i_2_n_0 ),
        .I2(train_index[4]),
        .I3(train_index[3]),
        .I4(train_index[5]),
        .I5(\pht[4][1]_i_2_n_0 ),
        .O(\pht[92][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[93][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[61][1]_i_2_n_0 ),
        .I2(\pht[53][1]_i_2_n_0 ),
        .I3(train_index[5]),
        .I4(train_index[6]),
        .I5(train_index[1]),
        .O(\pht[93][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[94][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[61][1]_i_2_n_0 ),
        .I2(\pht[90][1]_i_3_n_0 ),
        .I3(train_index[5]),
        .I4(train_index[6]),
        .I5(train_index[0]),
        .O(\pht[94][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0002020000000000)) 
    \pht[95][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[15][1]_i_2_n_0 ),
        .I2(train_index[5]),
        .I3(train_pc_IBUF[6]),
        .I4(train_history_IBUF[6]),
        .I5(train_index[4]),
        .O(\pht[95][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000080000000000)) 
    \pht[96][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[2]),
        .I3(train_index[5]),
        .I4(\pht[4][1]_i_2_n_0 ),
        .I5(train_index[6]),
        .O(\pht[96][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h8000000000000000)) 
    \pht[97][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[1][1]_i_3_n_0 ),
        .I2(train_index[6]),
        .I3(train_index[5]),
        .I4(train_index[0]),
        .I5(\pht[32][1]_i_2_n_0 ),
        .O(\pht[97][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000220)) 
    \pht[98][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[35][1]_i_2_n_0 ),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .I4(train_index[0]),
        .I5(train_index[2]),
        .O(\pht[98][1]_i_1_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000000008)) 
    \pht[99][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(\pht[99][1]_i_2_n_0 ),
        .I2(\pht[39][1]_i_3_n_0 ),
        .I3(train_index[3]),
        .I4(train_index[4]),
        .I5(train_index[2]),
        .O(\pht[99][1]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair20" *) 
  LUT4 #(
    .INIT(16'h0660)) 
    \pht[99][1]_i_2 
       (.I0(train_pc_IBUF[5]),
        .I1(train_history_IBUF[5]),
        .I2(train_pc_IBUF[6]),
        .I3(train_history_IBUF[6]),
        .O(\pht[99][1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'h0000000000020000)) 
    \pht[9][1]_i_1 
       (.I0(train_valid_IBUF),
        .I1(train_index[1]),
        .I2(train_index[4]),
        .I3(train_index[2]),
        .I4(train_index[3]),
        .I5(\pht[1][1]_i_5_n_0 ),
        .O(\pht[9][1]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h6)) 
    \pht[9][1]_i_2 
       (.I0(train_history_IBUF[3]),
        .I1(train_pc_IBUF[3]),
        .O(train_index[3]));
  FDPE \pht_reg[0][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[0][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[0][0] ));
  FDCE \pht_reg[0][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[0][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[0][1] ));
  FDPE \pht_reg[100][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[100][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[100][0] ));
  FDCE \pht_reg[100][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[100][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[100][1] ));
  FDPE \pht_reg[101][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[101][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[101][0] ));
  FDCE \pht_reg[101][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[101][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[101][1] ));
  FDPE \pht_reg[102][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[102][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[102][0] ));
  FDCE \pht_reg[102][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[102][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[102][1] ));
  FDPE \pht_reg[103][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[103][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[103][0] ));
  FDCE \pht_reg[103][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[103][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[103][1] ));
  FDPE \pht_reg[104][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[104][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[104][0] ));
  FDCE \pht_reg[104][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[104][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[104][1] ));
  FDPE \pht_reg[105][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[105][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[105][0] ));
  FDCE \pht_reg[105][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[105][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[105][1] ));
  FDPE \pht_reg[106][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[106][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[106][0] ));
  FDCE \pht_reg[106][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[106][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[106][1] ));
  FDPE \pht_reg[107][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[107][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[107][0] ));
  FDCE \pht_reg[107][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[107][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[107][1] ));
  FDPE \pht_reg[108][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[108][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[108][0] ));
  FDCE \pht_reg[108][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[108][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[108][1] ));
  FDPE \pht_reg[109][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[109][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[109][0] ));
  FDCE \pht_reg[109][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[109][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[109][1] ));
  FDPE \pht_reg[10][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[10][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[10][0] ));
  FDCE \pht_reg[10][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[10][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[10][1] ));
  FDPE \pht_reg[110][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[110][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[110][0] ));
  FDCE \pht_reg[110][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[110][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[110][1] ));
  FDPE \pht_reg[111][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[111][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[111][0] ));
  FDCE \pht_reg[111][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[111][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[111][1] ));
  FDPE \pht_reg[112][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[112][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[112][0] ));
  FDCE \pht_reg[112][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[112][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[112][1] ));
  FDPE \pht_reg[113][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[113][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[113][0] ));
  FDCE \pht_reg[113][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[113][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[113][1] ));
  FDPE \pht_reg[114][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[114][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[114][0] ));
  FDCE \pht_reg[114][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[114][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[114][1] ));
  FDPE \pht_reg[115][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[115][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[115][0] ));
  FDCE \pht_reg[115][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[115][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[115][1] ));
  FDPE \pht_reg[116][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[116][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[116][0] ));
  FDCE \pht_reg[116][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[116][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[116][1] ));
  FDPE \pht_reg[117][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[117][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[117][0] ));
  FDCE \pht_reg[117][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[117][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[117][1] ));
  FDPE \pht_reg[118][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[118][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[118][0] ));
  FDCE \pht_reg[118][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[118][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[118][1] ));
  FDPE \pht_reg[119][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[119][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[119][0] ));
  FDCE \pht_reg[119][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[119][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[119][1] ));
  FDPE \pht_reg[11][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[11][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[11][0] ));
  FDCE \pht_reg[11][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[11][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[11][1] ));
  FDPE \pht_reg[120][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[120][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[120][0] ));
  FDCE \pht_reg[120][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[120][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[120][1] ));
  FDPE \pht_reg[121][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[121][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[121][0] ));
  FDCE \pht_reg[121][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[121][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[121][1] ));
  FDPE \pht_reg[122][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[122][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[122][0] ));
  FDCE \pht_reg[122][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[122][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[122][1] ));
  FDPE \pht_reg[123][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[123][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[123][0] ));
  FDCE \pht_reg[123][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[123][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[123][1] ));
  FDPE \pht_reg[124][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[124][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[124][0] ));
  FDCE \pht_reg[124][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[124][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[124][1] ));
  FDPE \pht_reg[125][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[125][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[125][0] ));
  FDCE \pht_reg[125][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[125][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[125][1] ));
  FDPE \pht_reg[126][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[126][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[126][0] ));
  FDCE \pht_reg[126][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[126][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[126][1] ));
  FDPE \pht_reg[127][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[127][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[127][0] ));
  FDCE \pht_reg[127][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[127][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[127][1] ));
  FDPE \pht_reg[12][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[12][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[12][0] ));
  FDCE \pht_reg[12][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[12][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[12][1] ));
  FDPE \pht_reg[13][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[13][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[13][0] ));
  FDCE \pht_reg[13][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[13][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[13][1] ));
  FDPE \pht_reg[14][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[14][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[14][0] ));
  FDCE \pht_reg[14][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[14][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[14][1] ));
  FDPE \pht_reg[15][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[15][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[15][0] ));
  FDCE \pht_reg[15][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[15][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[15][1] ));
  FDPE \pht_reg[16][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[16][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[16][0] ));
  FDCE \pht_reg[16][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[16][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[16][1] ));
  FDPE \pht_reg[17][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[17][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[17][0] ));
  FDCE \pht_reg[17][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[17][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[17][1] ));
  FDPE \pht_reg[18][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[18][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[18][0] ));
  FDCE \pht_reg[18][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[18][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[18][1] ));
  FDPE \pht_reg[19][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[19][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[19][0] ));
  FDCE \pht_reg[19][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[19][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[19][1] ));
  FDPE \pht_reg[1][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[1][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[1][0] ));
  FDCE \pht_reg[1][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[1][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[1][1] ));
  MUXF8 \pht_reg[1][1]_i_11 
       (.I0(\pht_reg[1][1]_i_27_n_0 ),
        .I1(\pht_reg[1][1]_i_28_n_0 ),
        .O(\pht_reg[1][1]_i_11_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_12 
       (.I0(\pht_reg[1][1]_i_29_n_0 ),
        .I1(\pht_reg[1][1]_i_30_n_0 ),
        .O(\pht_reg[1][1]_i_12_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_13 
       (.I0(\pht_reg[1][1]_i_31_n_0 ),
        .I1(\pht_reg[1][1]_i_32_n_0 ),
        .O(\pht_reg[1][1]_i_13_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_14 
       (.I0(\pht_reg[1][1]_i_33_n_0 ),
        .I1(\pht_reg[1][1]_i_34_n_0 ),
        .O(\pht_reg[1][1]_i_14_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_15 
       (.I0(\pht_reg[1][1]_i_35_n_0 ),
        .I1(\pht_reg[1][1]_i_36_n_0 ),
        .O(\pht_reg[1][1]_i_15_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_16 
       (.I0(\pht_reg[1][1]_i_37_n_0 ),
        .I1(\pht_reg[1][1]_i_38_n_0 ),
        .O(\pht_reg[1][1]_i_16_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_17 
       (.I0(\pht_reg[1][1]_i_39_n_0 ),
        .I1(\pht_reg[1][1]_i_40_n_0 ),
        .O(\pht_reg[1][1]_i_17_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_18 
       (.I0(\pht_reg[1][1]_i_41_n_0 ),
        .I1(\pht_reg[1][1]_i_42_n_0 ),
        .O(\pht_reg[1][1]_i_18_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_19 
       (.I0(\pht_reg[1][1]_i_43_n_0 ),
        .I1(\pht_reg[1][1]_i_44_n_0 ),
        .O(\pht_reg[1][1]_i_19_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_20 
       (.I0(\pht_reg[1][1]_i_45_n_0 ),
        .I1(\pht_reg[1][1]_i_46_n_0 ),
        .O(\pht_reg[1][1]_i_20_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_21 
       (.I0(\pht_reg[1][1]_i_47_n_0 ),
        .I1(\pht_reg[1][1]_i_48_n_0 ),
        .O(\pht_reg[1][1]_i_21_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_22 
       (.I0(\pht_reg[1][1]_i_49_n_0 ),
        .I1(\pht_reg[1][1]_i_50_n_0 ),
        .O(\pht_reg[1][1]_i_22_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_23 
       (.I0(\pht_reg[1][1]_i_51_n_0 ),
        .I1(\pht_reg[1][1]_i_52_n_0 ),
        .O(\pht_reg[1][1]_i_23_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_24 
       (.I0(\pht_reg[1][1]_i_53_n_0 ),
        .I1(\pht_reg[1][1]_i_54_n_0 ),
        .O(\pht_reg[1][1]_i_24_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_25 
       (.I0(\pht_reg[1][1]_i_55_n_0 ),
        .I1(\pht_reg[1][1]_i_56_n_0 ),
        .O(\pht_reg[1][1]_i_25_n_0 ),
        .S(train_index[3]));
  MUXF8 \pht_reg[1][1]_i_26 
       (.I0(\pht_reg[1][1]_i_57_n_0 ),
        .I1(\pht_reg[1][1]_i_58_n_0 ),
        .O(\pht_reg[1][1]_i_26_n_0 ),
        .S(train_index[3]));
  MUXF7 \pht_reg[1][1]_i_27 
       (.I0(\pht[1][1]_i_59_n_0 ),
        .I1(\pht[1][1]_i_60_n_0 ),
        .O(\pht_reg[1][1]_i_27_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_28 
       (.I0(\pht[1][1]_i_61_n_0 ),
        .I1(\pht[1][1]_i_62_n_0 ),
        .O(\pht_reg[1][1]_i_28_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_29 
       (.I0(\pht[1][1]_i_63_n_0 ),
        .I1(\pht[1][1]_i_64_n_0 ),
        .O(\pht_reg[1][1]_i_29_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_30 
       (.I0(\pht[1][1]_i_65_n_0 ),
        .I1(\pht[1][1]_i_66_n_0 ),
        .O(\pht_reg[1][1]_i_30_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_31 
       (.I0(\pht[1][1]_i_67_n_0 ),
        .I1(\pht[1][1]_i_68_n_0 ),
        .O(\pht_reg[1][1]_i_31_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_32 
       (.I0(\pht[1][1]_i_69_n_0 ),
        .I1(\pht[1][1]_i_70_n_0 ),
        .O(\pht_reg[1][1]_i_32_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_33 
       (.I0(\pht[1][1]_i_71_n_0 ),
        .I1(\pht[1][1]_i_72_n_0 ),
        .O(\pht_reg[1][1]_i_33_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_34 
       (.I0(\pht[1][1]_i_73_n_0 ),
        .I1(\pht[1][1]_i_74_n_0 ),
        .O(\pht_reg[1][1]_i_34_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_35 
       (.I0(\pht[1][1]_i_75_n_0 ),
        .I1(\pht[1][1]_i_76_n_0 ),
        .O(\pht_reg[1][1]_i_35_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_36 
       (.I0(\pht[1][1]_i_77_n_0 ),
        .I1(\pht[1][1]_i_78_n_0 ),
        .O(\pht_reg[1][1]_i_36_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_37 
       (.I0(\pht[1][1]_i_79_n_0 ),
        .I1(\pht[1][1]_i_80_n_0 ),
        .O(\pht_reg[1][1]_i_37_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_38 
       (.I0(\pht[1][1]_i_81_n_0 ),
        .I1(\pht[1][1]_i_82_n_0 ),
        .O(\pht_reg[1][1]_i_38_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_39 
       (.I0(\pht[1][1]_i_83_n_0 ),
        .I1(\pht[1][1]_i_84_n_0 ),
        .O(\pht_reg[1][1]_i_39_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_40 
       (.I0(\pht[1][1]_i_85_n_0 ),
        .I1(\pht[1][1]_i_86_n_0 ),
        .O(\pht_reg[1][1]_i_40_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_41 
       (.I0(\pht[1][1]_i_87_n_0 ),
        .I1(\pht[1][1]_i_88_n_0 ),
        .O(\pht_reg[1][1]_i_41_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_42 
       (.I0(\pht[1][1]_i_89_n_0 ),
        .I1(\pht[1][1]_i_90_n_0 ),
        .O(\pht_reg[1][1]_i_42_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_43 
       (.I0(\pht[1][1]_i_91_n_0 ),
        .I1(\pht[1][1]_i_92_n_0 ),
        .O(\pht_reg[1][1]_i_43_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_44 
       (.I0(\pht[1][1]_i_93_n_0 ),
        .I1(\pht[1][1]_i_94_n_0 ),
        .O(\pht_reg[1][1]_i_44_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_45 
       (.I0(\pht[1][1]_i_95_n_0 ),
        .I1(\pht[1][1]_i_96_n_0 ),
        .O(\pht_reg[1][1]_i_45_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_46 
       (.I0(\pht[1][1]_i_97_n_0 ),
        .I1(\pht[1][1]_i_98_n_0 ),
        .O(\pht_reg[1][1]_i_46_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_47 
       (.I0(\pht[1][1]_i_99_n_0 ),
        .I1(\pht[1][1]_i_100_n_0 ),
        .O(\pht_reg[1][1]_i_47_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_48 
       (.I0(\pht[1][1]_i_101_n_0 ),
        .I1(\pht[1][1]_i_102_n_0 ),
        .O(\pht_reg[1][1]_i_48_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_49 
       (.I0(\pht[1][1]_i_103_n_0 ),
        .I1(\pht[1][1]_i_104_n_0 ),
        .O(\pht_reg[1][1]_i_49_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_50 
       (.I0(\pht[1][1]_i_105_n_0 ),
        .I1(\pht[1][1]_i_106_n_0 ),
        .O(\pht_reg[1][1]_i_50_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_51 
       (.I0(\pht[1][1]_i_107_n_0 ),
        .I1(\pht[1][1]_i_108_n_0 ),
        .O(\pht_reg[1][1]_i_51_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_52 
       (.I0(\pht[1][1]_i_109_n_0 ),
        .I1(\pht[1][1]_i_110_n_0 ),
        .O(\pht_reg[1][1]_i_52_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_53 
       (.I0(\pht[1][1]_i_111_n_0 ),
        .I1(\pht[1][1]_i_112_n_0 ),
        .O(\pht_reg[1][1]_i_53_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_54 
       (.I0(\pht[1][1]_i_113_n_0 ),
        .I1(\pht[1][1]_i_114_n_0 ),
        .O(\pht_reg[1][1]_i_54_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_55 
       (.I0(\pht[1][1]_i_115_n_0 ),
        .I1(\pht[1][1]_i_116_n_0 ),
        .O(\pht_reg[1][1]_i_55_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_56 
       (.I0(\pht[1][1]_i_117_n_0 ),
        .I1(\pht[1][1]_i_118_n_0 ),
        .O(\pht_reg[1][1]_i_56_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_57 
       (.I0(\pht[1][1]_i_119_n_0 ),
        .I1(\pht[1][1]_i_120_n_0 ),
        .O(\pht_reg[1][1]_i_57_n_0 ),
        .S(train_index[2]));
  MUXF7 \pht_reg[1][1]_i_58 
       (.I0(\pht[1][1]_i_121_n_0 ),
        .I1(\pht[1][1]_i_122_n_0 ),
        .O(\pht_reg[1][1]_i_58_n_0 ),
        .S(train_index[2]));
  FDPE \pht_reg[20][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[20][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[20][0] ));
  FDCE \pht_reg[20][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[20][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[20][1] ));
  FDPE \pht_reg[21][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[21][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[21][0] ));
  FDCE \pht_reg[21][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[21][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[21][1] ));
  FDPE \pht_reg[22][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[22][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[22][0] ));
  FDCE \pht_reg[22][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[22][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[22][1] ));
  FDPE \pht_reg[23][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[23][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[23][0] ));
  FDCE \pht_reg[23][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[23][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[23][1] ));
  FDPE \pht_reg[24][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[24][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[24][0] ));
  FDCE \pht_reg[24][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[24][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[24][1] ));
  FDPE \pht_reg[25][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[25][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[25][0] ));
  FDCE \pht_reg[25][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[25][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[25][1] ));
  FDPE \pht_reg[26][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[26][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[26][0] ));
  FDCE \pht_reg[26][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[26][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[26][1] ));
  FDPE \pht_reg[27][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[27][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[27][0] ));
  FDCE \pht_reg[27][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[27][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[27][1] ));
  FDPE \pht_reg[28][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[28][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[28][0] ));
  FDCE \pht_reg[28][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[28][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[28][1] ));
  FDPE \pht_reg[29][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[29][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[29][0] ));
  FDCE \pht_reg[29][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[29][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[29][1] ));
  FDPE \pht_reg[2][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[2][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[2][0] ));
  FDCE \pht_reg[2][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[2][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[2][1] ));
  FDPE \pht_reg[30][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[30][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[30][0] ));
  FDCE \pht_reg[30][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[30][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[30][1] ));
  FDPE \pht_reg[31][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[31][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[31][0] ));
  FDCE \pht_reg[31][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[31][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[31][1] ));
  FDPE \pht_reg[32][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[32][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[32][0] ));
  FDCE \pht_reg[32][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[32][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[32][1] ));
  FDPE \pht_reg[33][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[33][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[33][0] ));
  FDCE \pht_reg[33][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[33][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[33][1] ));
  FDPE \pht_reg[34][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[34][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[34][0] ));
  FDCE \pht_reg[34][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[34][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[34][1] ));
  FDPE \pht_reg[35][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[35][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[35][0] ));
  FDCE \pht_reg[35][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[35][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[35][1] ));
  FDPE \pht_reg[36][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[36][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[36][0] ));
  FDCE \pht_reg[36][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[36][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[36][1] ));
  FDPE \pht_reg[37][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[37][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[37][0] ));
  FDCE \pht_reg[37][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[37][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[37][1] ));
  FDPE \pht_reg[38][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[38][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[38][0] ));
  FDCE \pht_reg[38][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[38][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[38][1] ));
  FDPE \pht_reg[39][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[39][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[39][0] ));
  FDCE \pht_reg[39][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[39][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[39][1] ));
  FDPE \pht_reg[3][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[3][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[3][0] ));
  FDCE \pht_reg[3][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[3][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[3][1] ));
  FDPE \pht_reg[40][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[40][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[40][0] ));
  FDCE \pht_reg[40][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[40][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[40][1] ));
  FDPE \pht_reg[41][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[41][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[41][0] ));
  FDCE \pht_reg[41][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[41][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[41][1] ));
  FDPE \pht_reg[42][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[42][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[42][0] ));
  FDCE \pht_reg[42][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[42][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[42][1] ));
  FDPE \pht_reg[43][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[43][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[43][0] ));
  FDCE \pht_reg[43][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[43][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[43][1] ));
  FDPE \pht_reg[44][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[44][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[44][0] ));
  FDCE \pht_reg[44][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[44][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[44][1] ));
  FDPE \pht_reg[45][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[45][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[45][0] ));
  FDCE \pht_reg[45][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[45][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[45][1] ));
  FDPE \pht_reg[46][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[46][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[46][0] ));
  FDCE \pht_reg[46][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[46][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[46][1] ));
  FDPE \pht_reg[47][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[47][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[47][0] ));
  FDCE \pht_reg[47][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[47][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[47][1] ));
  FDPE \pht_reg[48][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[48][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[48][0] ));
  FDCE \pht_reg[48][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[48][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[48][1] ));
  FDPE \pht_reg[49][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[49][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[49][0] ));
  FDCE \pht_reg[49][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[49][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[49][1] ));
  FDPE \pht_reg[4][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[4][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[4][0] ));
  FDCE \pht_reg[4][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[4][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[4][1] ));
  FDPE \pht_reg[50][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[50][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[50][0] ));
  FDCE \pht_reg[50][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[50][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[50][1] ));
  FDPE \pht_reg[51][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[51][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[51][0] ));
  FDCE \pht_reg[51][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[51][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[51][1] ));
  FDPE \pht_reg[52][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[52][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[52][0] ));
  FDCE \pht_reg[52][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[52][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[52][1] ));
  FDPE \pht_reg[53][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[53][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[53][0] ));
  FDCE \pht_reg[53][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[53][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[53][1] ));
  FDPE \pht_reg[54][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[54][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[54][0] ));
  FDCE \pht_reg[54][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[54][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[54][1] ));
  FDPE \pht_reg[55][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[55][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[55][0] ));
  FDCE \pht_reg[55][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[55][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[55][1] ));
  FDPE \pht_reg[56][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[56][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[56][0] ));
  FDCE \pht_reg[56][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[56][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[56][1] ));
  FDPE \pht_reg[57][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[57][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[57][0] ));
  FDCE \pht_reg[57][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[57][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[57][1] ));
  FDPE \pht_reg[58][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[58][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[58][0] ));
  FDCE \pht_reg[58][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[58][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[58][1] ));
  FDPE \pht_reg[59][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[59][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[59][0] ));
  FDCE \pht_reg[59][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[59][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[59][1] ));
  FDPE \pht_reg[5][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[5][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[5][0] ));
  FDCE \pht_reg[5][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[5][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[5][1] ));
  FDPE \pht_reg[60][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[60][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[60][0] ));
  FDCE \pht_reg[60][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[60][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[60][1] ));
  FDPE \pht_reg[61][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[61][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[61][0] ));
  FDCE \pht_reg[61][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[61][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[61][1] ));
  FDPE \pht_reg[62][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[62][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[62][0] ));
  FDCE \pht_reg[62][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[62][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[62][1] ));
  FDPE \pht_reg[63][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[63][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[63][0] ));
  FDCE \pht_reg[63][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[63][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[63][1] ));
  FDPE \pht_reg[64][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[64][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[64][0] ));
  FDCE \pht_reg[64][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[64][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[64][1] ));
  FDPE \pht_reg[65][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[65][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[65][0] ));
  FDCE \pht_reg[65][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[65][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[65][1] ));
  FDPE \pht_reg[66][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[66][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[66][0] ));
  FDCE \pht_reg[66][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[66][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[66][1] ));
  FDPE \pht_reg[67][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[67][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[67][0] ));
  FDCE \pht_reg[67][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[67][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[67][1] ));
  FDPE \pht_reg[68][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[68][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[68][0] ));
  FDCE \pht_reg[68][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[68][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[68][1] ));
  FDPE \pht_reg[69][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[69][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[69][0] ));
  FDCE \pht_reg[69][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[69][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[69][1] ));
  FDPE \pht_reg[6][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[6][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[6][0] ));
  FDCE \pht_reg[6][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[6][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[6][1] ));
  FDPE \pht_reg[70][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[70][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[70][0] ));
  FDCE \pht_reg[70][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[70][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[70][1] ));
  FDPE \pht_reg[71][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[71][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[71][0] ));
  FDCE \pht_reg[71][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[71][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[71][1] ));
  FDPE \pht_reg[72][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[72][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[72][0] ));
  FDCE \pht_reg[72][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[72][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[72][1] ));
  FDPE \pht_reg[73][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[73][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[73][0] ));
  FDCE \pht_reg[73][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[73][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[73][1] ));
  FDPE \pht_reg[74][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[74][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[74][0] ));
  FDCE \pht_reg[74][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[74][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[74][1] ));
  FDPE \pht_reg[75][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[75][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[75][0] ));
  FDCE \pht_reg[75][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[75][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[75][1] ));
  FDPE \pht_reg[76][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[76][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[76][0] ));
  FDCE \pht_reg[76][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[76][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[76][1] ));
  FDPE \pht_reg[77][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[77][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[77][0] ));
  FDCE \pht_reg[77][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[77][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[77][1] ));
  FDPE \pht_reg[78][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[78][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[78][0] ));
  FDCE \pht_reg[78][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[78][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[78][1] ));
  FDPE \pht_reg[79][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[79][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[79][0] ));
  FDCE \pht_reg[79][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[79][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[79][1] ));
  FDPE \pht_reg[7][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[7][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[7][0] ));
  FDCE \pht_reg[7][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[7][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[7][1] ));
  FDPE \pht_reg[80][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[80][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[80][0] ));
  FDCE \pht_reg[80][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[80][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[80][1] ));
  FDPE \pht_reg[81][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[81][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[81][0] ));
  FDCE \pht_reg[81][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[81][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[81][1] ));
  FDPE \pht_reg[82][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[82][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[82][0] ));
  FDCE \pht_reg[82][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[82][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[82][1] ));
  FDPE \pht_reg[83][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[83][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[83][0] ));
  FDCE \pht_reg[83][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[83][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[83][1] ));
  FDPE \pht_reg[84][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[84][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[84][0] ));
  FDCE \pht_reg[84][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[84][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[84][1] ));
  FDPE \pht_reg[85][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[85][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[85][0] ));
  FDCE \pht_reg[85][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[85][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[85][1] ));
  FDPE \pht_reg[86][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[86][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[86][0] ));
  FDCE \pht_reg[86][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[86][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[86][1] ));
  FDPE \pht_reg[87][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[87][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[87][0] ));
  FDCE \pht_reg[87][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[87][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[87][1] ));
  FDPE \pht_reg[88][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[88][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[88][0] ));
  FDCE \pht_reg[88][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[88][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[88][1] ));
  FDPE \pht_reg[89][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[89][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[89][0] ));
  FDCE \pht_reg[89][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[89][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[89][1] ));
  FDPE \pht_reg[8][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[8][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[8][0] ));
  FDCE \pht_reg[8][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[8][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[8][1] ));
  FDPE \pht_reg[90][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[90][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[90][0] ));
  FDCE \pht_reg[90][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[90][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[90][1] ));
  FDPE \pht_reg[91][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[91][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[91][0] ));
  FDCE \pht_reg[91][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[91][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[91][1] ));
  FDPE \pht_reg[92][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[92][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[92][0] ));
  FDCE \pht_reg[92][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[92][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[92][1] ));
  FDPE \pht_reg[93][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[93][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[93][0] ));
  FDCE \pht_reg[93][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[93][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[93][1] ));
  FDPE \pht_reg[94][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[94][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[94][0] ));
  FDCE \pht_reg[94][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[94][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[94][1] ));
  FDPE \pht_reg[95][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[95][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[95][0] ));
  FDCE \pht_reg[95][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[95][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[95][1] ));
  FDPE \pht_reg[96][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[96][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[96][0] ));
  FDCE \pht_reg[96][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[96][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[96][1] ));
  FDPE \pht_reg[97][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[97][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[97][0] ));
  FDCE \pht_reg[97][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[97][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[97][1] ));
  FDPE \pht_reg[98][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[98][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[98][0] ));
  FDCE \pht_reg[98][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[98][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[98][1] ));
  FDPE \pht_reg[99][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[99][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[99][0] ));
  FDCE \pht_reg[99][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[99][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[99][1] ));
  FDPE \pht_reg[9][0] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[9][1]_i_1_n_0 ),
        .D(pht0_in[0]),
        .PRE(areset_IBUF),
        .Q(\pht_reg_n_0_[9][0] ));
  FDCE \pht_reg[9][1] 
       (.C(clk_IBUF_BUFG),
        .CE(\pht[9][1]_i_1_n_0 ),
        .CLR(areset_IBUF),
        .D(pht0_in[1]),
        .Q(\pht_reg_n_0_[9][1] ));
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
    .INIT(64'hFFB8B8FF00B8B800)) 
    predict_taken_OBUF_inst_i_1
       (.I0(predict_taken_OBUF_inst_i_2_n_0),
        .I1(predict_index[5]),
        .I2(predict_taken_OBUF_inst_i_4_n_0),
        .I3(predict_history_OBUF[6]),
        .I4(predict_pc_IBUF[6]),
        .I5(predict_taken_OBUF_inst_i_5_n_0),
        .O(predict_taken_OBUF));
  MUXF7 predict_taken_OBUF_inst_i_10
       (.I0(predict_taken_OBUF_inst_i_21_n_0),
        .I1(predict_taken_OBUF_inst_i_22_n_0),
        .O(predict_taken_OBUF_inst_i_10_n_0),
        .S(predict_index[3]));
  MUXF7 predict_taken_OBUF_inst_i_11
       (.I0(predict_taken_OBUF_inst_i_23_n_0),
        .I1(predict_taken_OBUF_inst_i_24_n_0),
        .O(predict_taken_OBUF_inst_i_11_n_0),
        .S(predict_index[3]));
  MUXF7 predict_taken_OBUF_inst_i_12
       (.I0(predict_taken_OBUF_inst_i_25_n_0),
        .I1(predict_taken_OBUF_inst_i_26_n_0),
        .O(predict_taken_OBUF_inst_i_12_n_0),
        .S(predict_index[3]));
  MUXF8 predict_taken_OBUF_inst_i_13
       (.I0(predict_taken_OBUF_inst_i_27_n_0),
        .I1(predict_taken_OBUF_inst_i_28_n_0),
        .O(predict_taken_OBUF_inst_i_13_n_0),
        .S(predict_index[4]));
  LUT2 #(
    .INIT(4'h6)) 
    predict_taken_OBUF_inst_i_14
       (.I0(predict_history_OBUF[3]),
        .I1(predict_pc_IBUF[3]),
        .O(predict_index[3]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_15
       (.I0(predict_taken_OBUF_inst_i_29_n_0),
        .I1(predict_taken_OBUF_inst_i_30_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_32_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_34_n_0),
        .O(predict_taken_OBUF_inst_i_15_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_16
       (.I0(predict_taken_OBUF_inst_i_35_n_0),
        .I1(predict_taken_OBUF_inst_i_36_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_37_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_38_n_0),
        .O(predict_taken_OBUF_inst_i_16_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_17
       (.I0(predict_taken_OBUF_inst_i_39_n_0),
        .I1(predict_taken_OBUF_inst_i_40_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_41_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_42_n_0),
        .O(predict_taken_OBUF_inst_i_17_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_18
       (.I0(predict_taken_OBUF_inst_i_43_n_0),
        .I1(predict_taken_OBUF_inst_i_44_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_45_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_46_n_0),
        .O(predict_taken_OBUF_inst_i_18_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_19
       (.I0(predict_taken_OBUF_inst_i_47_n_0),
        .I1(predict_taken_OBUF_inst_i_48_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_49_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_50_n_0),
        .O(predict_taken_OBUF_inst_i_19_n_0));
  MUXF8 predict_taken_OBUF_inst_i_2
       (.I0(predict_taken_OBUF_inst_i_7_n_0),
        .I1(predict_taken_OBUF_inst_i_8_n_0),
        .O(predict_taken_OBUF_inst_i_2_n_0),
        .S(predict_index[4]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_20
       (.I0(predict_taken_OBUF_inst_i_51_n_0),
        .I1(predict_taken_OBUF_inst_i_52_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_53_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_54_n_0),
        .O(predict_taken_OBUF_inst_i_20_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_21
       (.I0(predict_taken_OBUF_inst_i_55_n_0),
        .I1(predict_taken_OBUF_inst_i_56_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_57_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_58_n_0),
        .O(predict_taken_OBUF_inst_i_21_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_22
       (.I0(predict_taken_OBUF_inst_i_59_n_0),
        .I1(predict_taken_OBUF_inst_i_60_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_61_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_62_n_0),
        .O(predict_taken_OBUF_inst_i_22_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_23
       (.I0(predict_taken_OBUF_inst_i_63_n_0),
        .I1(predict_taken_OBUF_inst_i_64_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_65_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_66_n_0),
        .O(predict_taken_OBUF_inst_i_23_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_24
       (.I0(predict_taken_OBUF_inst_i_67_n_0),
        .I1(predict_taken_OBUF_inst_i_68_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_69_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_70_n_0),
        .O(predict_taken_OBUF_inst_i_24_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_25
       (.I0(predict_taken_OBUF_inst_i_71_n_0),
        .I1(predict_taken_OBUF_inst_i_72_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_73_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_74_n_0),
        .O(predict_taken_OBUF_inst_i_25_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_26
       (.I0(predict_taken_OBUF_inst_i_75_n_0),
        .I1(predict_taken_OBUF_inst_i_76_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_77_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_78_n_0),
        .O(predict_taken_OBUF_inst_i_26_n_0));
  MUXF7 predict_taken_OBUF_inst_i_27
       (.I0(predict_taken_OBUF_inst_i_79_n_0),
        .I1(predict_taken_OBUF_inst_i_80_n_0),
        .O(predict_taken_OBUF_inst_i_27_n_0),
        .S(predict_index[3]));
  MUXF7 predict_taken_OBUF_inst_i_28
       (.I0(predict_taken_OBUF_inst_i_81_n_0),
        .I1(predict_taken_OBUF_inst_i_82_n_0),
        .O(predict_taken_OBUF_inst_i_28_n_0),
        .S(predict_index[3]));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_29
       (.I0(\pht_reg_n_0_[103][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[102][1] ),
        .O(predict_taken_OBUF_inst_i_29_n_0));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT2 #(
    .INIT(4'h6)) 
    predict_taken_OBUF_inst_i_3
       (.I0(predict_history_OBUF[5]),
        .I1(predict_pc_IBUF[5]),
        .O(predict_index[5]));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_30
       (.I0(\pht_reg_n_0_[101][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[100][1] ),
        .O(predict_taken_OBUF_inst_i_30_n_0));
  (* SOFT_HLUTNM = "soft_lutpair5" *) 
  LUT2 #(
    .INIT(4'h6)) 
    predict_taken_OBUF_inst_i_31
       (.I0(predict_history_OBUF[2]),
        .I1(predict_pc_IBUF[2]),
        .O(predict_index[2]));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_32
       (.I0(\pht_reg_n_0_[99][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[98][1] ),
        .O(predict_taken_OBUF_inst_i_32_n_0));
  (* SOFT_HLUTNM = "soft_lutpair6" *) 
  LUT2 #(
    .INIT(4'h6)) 
    predict_taken_OBUF_inst_i_33
       (.I0(predict_history_OBUF[1]),
        .I1(predict_pc_IBUF[1]),
        .O(predict_index[1]));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_34
       (.I0(\pht_reg_n_0_[97][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[96][1] ),
        .O(predict_taken_OBUF_inst_i_34_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_35
       (.I0(\pht_reg_n_0_[111][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[110][1] ),
        .O(predict_taken_OBUF_inst_i_35_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_36
       (.I0(\pht_reg_n_0_[109][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[108][1] ),
        .O(predict_taken_OBUF_inst_i_36_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_37
       (.I0(\pht_reg_n_0_[107][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[106][1] ),
        .O(predict_taken_OBUF_inst_i_37_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_38
       (.I0(\pht_reg_n_0_[105][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[104][1] ),
        .O(predict_taken_OBUF_inst_i_38_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_39
       (.I0(\pht_reg_n_0_[119][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[118][1] ),
        .O(predict_taken_OBUF_inst_i_39_n_0));
  MUXF8 predict_taken_OBUF_inst_i_4
       (.I0(predict_taken_OBUF_inst_i_9_n_0),
        .I1(predict_taken_OBUF_inst_i_10_n_0),
        .O(predict_taken_OBUF_inst_i_4_n_0),
        .S(predict_index[4]));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_40
       (.I0(\pht_reg_n_0_[117][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[116][1] ),
        .O(predict_taken_OBUF_inst_i_40_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_41
       (.I0(\pht_reg_n_0_[115][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[114][1] ),
        .O(predict_taken_OBUF_inst_i_41_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_42
       (.I0(\pht_reg_n_0_[113][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[112][1] ),
        .O(predict_taken_OBUF_inst_i_42_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_43
       (.I0(\pht_reg_n_0_[127][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[126][1] ),
        .O(predict_taken_OBUF_inst_i_43_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_44
       (.I0(\pht_reg_n_0_[125][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[124][1] ),
        .O(predict_taken_OBUF_inst_i_44_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_45
       (.I0(\pht_reg_n_0_[123][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[122][1] ),
        .O(predict_taken_OBUF_inst_i_45_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_46
       (.I0(\pht_reg_n_0_[121][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[120][1] ),
        .O(predict_taken_OBUF_inst_i_46_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_47
       (.I0(\pht_reg_n_0_[71][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[70][1] ),
        .O(predict_taken_OBUF_inst_i_47_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_48
       (.I0(\pht_reg_n_0_[69][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[68][1] ),
        .O(predict_taken_OBUF_inst_i_48_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_49
       (.I0(\pht_reg_n_0_[67][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[66][1] ),
        .O(predict_taken_OBUF_inst_i_49_n_0));
  LUT6 #(
    .INIT(64'hFFB8B8FF00B8B800)) 
    predict_taken_OBUF_inst_i_5
       (.I0(predict_taken_OBUF_inst_i_11_n_0),
        .I1(predict_index[4]),
        .I2(predict_taken_OBUF_inst_i_12_n_0),
        .I3(predict_history_OBUF[5]),
        .I4(predict_pc_IBUF[5]),
        .I5(predict_taken_OBUF_inst_i_13_n_0),
        .O(predict_taken_OBUF_inst_i_5_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_50
       (.I0(\pht_reg_n_0_[65][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[64][1] ),
        .O(predict_taken_OBUF_inst_i_50_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_51
       (.I0(\pht_reg_n_0_[79][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[78][1] ),
        .O(predict_taken_OBUF_inst_i_51_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_52
       (.I0(\pht_reg_n_0_[77][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[76][1] ),
        .O(predict_taken_OBUF_inst_i_52_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_53
       (.I0(\pht_reg_n_0_[75][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[74][1] ),
        .O(predict_taken_OBUF_inst_i_53_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_54
       (.I0(\pht_reg_n_0_[73][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[72][1] ),
        .O(predict_taken_OBUF_inst_i_54_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_55
       (.I0(\pht_reg_n_0_[87][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[86][1] ),
        .O(predict_taken_OBUF_inst_i_55_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_56
       (.I0(\pht_reg_n_0_[85][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[84][1] ),
        .O(predict_taken_OBUF_inst_i_56_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_57
       (.I0(\pht_reg_n_0_[83][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[82][1] ),
        .O(predict_taken_OBUF_inst_i_57_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_58
       (.I0(\pht_reg_n_0_[81][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[80][1] ),
        .O(predict_taken_OBUF_inst_i_58_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_59
       (.I0(\pht_reg_n_0_[95][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[94][1] ),
        .O(predict_taken_OBUF_inst_i_59_n_0));
  LUT2 #(
    .INIT(4'h6)) 
    predict_taken_OBUF_inst_i_6
       (.I0(predict_history_OBUF[4]),
        .I1(predict_pc_IBUF[4]),
        .O(predict_index[4]));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_60
       (.I0(\pht_reg_n_0_[93][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[92][1] ),
        .O(predict_taken_OBUF_inst_i_60_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_61
       (.I0(\pht_reg_n_0_[91][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[90][1] ),
        .O(predict_taken_OBUF_inst_i_61_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_62
       (.I0(\pht_reg_n_0_[89][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[88][1] ),
        .O(predict_taken_OBUF_inst_i_62_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_63
       (.I0(\pht_reg_n_0_[55][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[54][1] ),
        .O(predict_taken_OBUF_inst_i_63_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_64
       (.I0(\pht_reg_n_0_[53][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[52][1] ),
        .O(predict_taken_OBUF_inst_i_64_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_65
       (.I0(\pht_reg_n_0_[51][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[50][1] ),
        .O(predict_taken_OBUF_inst_i_65_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_66
       (.I0(\pht_reg_n_0_[49][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[48][1] ),
        .O(predict_taken_OBUF_inst_i_66_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_67
       (.I0(\pht_reg_n_0_[63][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[62][1] ),
        .O(predict_taken_OBUF_inst_i_67_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_68
       (.I0(\pht_reg_n_0_[61][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[60][1] ),
        .O(predict_taken_OBUF_inst_i_68_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_69
       (.I0(\pht_reg_n_0_[59][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[58][1] ),
        .O(predict_taken_OBUF_inst_i_69_n_0));
  MUXF7 predict_taken_OBUF_inst_i_7
       (.I0(predict_taken_OBUF_inst_i_15_n_0),
        .I1(predict_taken_OBUF_inst_i_16_n_0),
        .O(predict_taken_OBUF_inst_i_7_n_0),
        .S(predict_index[3]));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_70
       (.I0(\pht_reg_n_0_[57][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[56][1] ),
        .O(predict_taken_OBUF_inst_i_70_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_71
       (.I0(\pht_reg_n_0_[39][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[38][1] ),
        .O(predict_taken_OBUF_inst_i_71_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_72
       (.I0(\pht_reg_n_0_[37][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[36][1] ),
        .O(predict_taken_OBUF_inst_i_72_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_73
       (.I0(\pht_reg_n_0_[35][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[34][1] ),
        .O(predict_taken_OBUF_inst_i_73_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_74
       (.I0(\pht_reg_n_0_[33][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[32][1] ),
        .O(predict_taken_OBUF_inst_i_74_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_75
       (.I0(\pht_reg_n_0_[47][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[46][1] ),
        .O(predict_taken_OBUF_inst_i_75_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_76
       (.I0(\pht_reg_n_0_[45][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[44][1] ),
        .O(predict_taken_OBUF_inst_i_76_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_77
       (.I0(\pht_reg_n_0_[43][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[42][1] ),
        .O(predict_taken_OBUF_inst_i_77_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_78
       (.I0(\pht_reg_n_0_[41][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[40][1] ),
        .O(predict_taken_OBUF_inst_i_78_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_79
       (.I0(predict_taken_OBUF_inst_i_83_n_0),
        .I1(predict_taken_OBUF_inst_i_84_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_85_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_86_n_0),
        .O(predict_taken_OBUF_inst_i_79_n_0));
  MUXF7 predict_taken_OBUF_inst_i_8
       (.I0(predict_taken_OBUF_inst_i_17_n_0),
        .I1(predict_taken_OBUF_inst_i_18_n_0),
        .O(predict_taken_OBUF_inst_i_8_n_0),
        .S(predict_index[3]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_80
       (.I0(predict_taken_OBUF_inst_i_87_n_0),
        .I1(predict_taken_OBUF_inst_i_88_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_89_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_90_n_0),
        .O(predict_taken_OBUF_inst_i_80_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_81
       (.I0(predict_taken_OBUF_inst_i_91_n_0),
        .I1(predict_taken_OBUF_inst_i_92_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_93_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_94_n_0),
        .O(predict_taken_OBUF_inst_i_81_n_0));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    predict_taken_OBUF_inst_i_82
       (.I0(predict_taken_OBUF_inst_i_95_n_0),
        .I1(predict_taken_OBUF_inst_i_96_n_0),
        .I2(predict_index[2]),
        .I3(predict_taken_OBUF_inst_i_97_n_0),
        .I4(predict_index[1]),
        .I5(predict_taken_OBUF_inst_i_98_n_0),
        .O(predict_taken_OBUF_inst_i_82_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_83
       (.I0(\pht_reg_n_0_[7][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[6][1] ),
        .O(predict_taken_OBUF_inst_i_83_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_84
       (.I0(\pht_reg_n_0_[5][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[4][1] ),
        .O(predict_taken_OBUF_inst_i_84_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_85
       (.I0(\pht_reg_n_0_[3][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[2][1] ),
        .O(predict_taken_OBUF_inst_i_85_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_86
       (.I0(\pht_reg_n_0_[1][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[0][1] ),
        .O(predict_taken_OBUF_inst_i_86_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_87
       (.I0(\pht_reg_n_0_[15][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[14][1] ),
        .O(predict_taken_OBUF_inst_i_87_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_88
       (.I0(\pht_reg_n_0_[13][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[12][1] ),
        .O(predict_taken_OBUF_inst_i_88_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_89
       (.I0(\pht_reg_n_0_[11][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[10][1] ),
        .O(predict_taken_OBUF_inst_i_89_n_0));
  MUXF7 predict_taken_OBUF_inst_i_9
       (.I0(predict_taken_OBUF_inst_i_19_n_0),
        .I1(predict_taken_OBUF_inst_i_20_n_0),
        .O(predict_taken_OBUF_inst_i_9_n_0),
        .S(predict_index[3]));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_90
       (.I0(\pht_reg_n_0_[9][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[8][1] ),
        .O(predict_taken_OBUF_inst_i_90_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_91
       (.I0(\pht_reg_n_0_[23][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[22][1] ),
        .O(predict_taken_OBUF_inst_i_91_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_92
       (.I0(\pht_reg_n_0_[21][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[20][1] ),
        .O(predict_taken_OBUF_inst_i_92_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_93
       (.I0(\pht_reg_n_0_[19][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[18][1] ),
        .O(predict_taken_OBUF_inst_i_93_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_94
       (.I0(\pht_reg_n_0_[17][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[16][1] ),
        .O(predict_taken_OBUF_inst_i_94_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_95
       (.I0(\pht_reg_n_0_[31][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[30][1] ),
        .O(predict_taken_OBUF_inst_i_95_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_96
       (.I0(\pht_reg_n_0_[29][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[28][1] ),
        .O(predict_taken_OBUF_inst_i_96_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_97
       (.I0(\pht_reg_n_0_[27][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[26][1] ),
        .O(predict_taken_OBUF_inst_i_97_n_0));
  LUT4 #(
    .INIT(16'hEB28)) 
    predict_taken_OBUF_inst_i_98
       (.I0(\pht_reg_n_0_[25][1] ),
        .I1(predict_history_OBUF[0]),
        .I2(predict_pc_IBUF[0]),
        .I3(\pht_reg_n_0_[24][1] ),
        .O(predict_taken_OBUF_inst_i_98_n_0));
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
