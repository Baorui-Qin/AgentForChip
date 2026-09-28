// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 22:46:15 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob076_always_case/eda/run-Y2hUup/build/.rtl-synth-IbDK6b/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (sel,
    data0,
    data1,
    data2,
    data3,
    data4,
    data5,
    out);
  input [2:0]sel;
  input [3:0]data0;
  input [3:0]data1;
  input [3:0]data2;
  input [3:0]data3;
  input [3:0]data4;
  input [3:0]data5;
  output [3:0]out;

  wire [3:0]data0;
  wire [3:0]data0_IBUF;
  wire [3:0]data1;
  wire [3:0]data1_IBUF;
  wire [3:0]data2;
  wire [3:0]data2_IBUF;
  wire [3:0]data3;
  wire [3:0]data3_IBUF;
  wire [3:0]data4;
  wire [3:0]data4_IBUF;
  wire [3:0]data5;
  wire [3:0]data5_IBUF;
  wire [3:0]out;
  wire [3:0]out_OBUF;
  wire \out_OBUF[0]_inst_i_2_n_0 ;
  wire \out_OBUF[1]_inst_i_2_n_0 ;
  wire \out_OBUF[2]_inst_i_2_n_0 ;
  wire \out_OBUF[3]_inst_i_2_n_0 ;
  wire [2:0]sel;
  wire [2:0]sel_IBUF;

  IBUF \data0_IBUF[0]_inst 
       (.I(data0[0]),
        .O(data0_IBUF[0]));
  IBUF \data0_IBUF[1]_inst 
       (.I(data0[1]),
        .O(data0_IBUF[1]));
  IBUF \data0_IBUF[2]_inst 
       (.I(data0[2]),
        .O(data0_IBUF[2]));
  IBUF \data0_IBUF[3]_inst 
       (.I(data0[3]),
        .O(data0_IBUF[3]));
  IBUF \data1_IBUF[0]_inst 
       (.I(data1[0]),
        .O(data1_IBUF[0]));
  IBUF \data1_IBUF[1]_inst 
       (.I(data1[1]),
        .O(data1_IBUF[1]));
  IBUF \data1_IBUF[2]_inst 
       (.I(data1[2]),
        .O(data1_IBUF[2]));
  IBUF \data1_IBUF[3]_inst 
       (.I(data1[3]),
        .O(data1_IBUF[3]));
  IBUF \data2_IBUF[0]_inst 
       (.I(data2[0]),
        .O(data2_IBUF[0]));
  IBUF \data2_IBUF[1]_inst 
       (.I(data2[1]),
        .O(data2_IBUF[1]));
  IBUF \data2_IBUF[2]_inst 
       (.I(data2[2]),
        .O(data2_IBUF[2]));
  IBUF \data2_IBUF[3]_inst 
       (.I(data2[3]),
        .O(data2_IBUF[3]));
  IBUF \data3_IBUF[0]_inst 
       (.I(data3[0]),
        .O(data3_IBUF[0]));
  IBUF \data3_IBUF[1]_inst 
       (.I(data3[1]),
        .O(data3_IBUF[1]));
  IBUF \data3_IBUF[2]_inst 
       (.I(data3[2]),
        .O(data3_IBUF[2]));
  IBUF \data3_IBUF[3]_inst 
       (.I(data3[3]),
        .O(data3_IBUF[3]));
  IBUF \data4_IBUF[0]_inst 
       (.I(data4[0]),
        .O(data4_IBUF[0]));
  IBUF \data4_IBUF[1]_inst 
       (.I(data4[1]),
        .O(data4_IBUF[1]));
  IBUF \data4_IBUF[2]_inst 
       (.I(data4[2]),
        .O(data4_IBUF[2]));
  IBUF \data4_IBUF[3]_inst 
       (.I(data4[3]),
        .O(data4_IBUF[3]));
  IBUF \data5_IBUF[0]_inst 
       (.I(data5[0]),
        .O(data5_IBUF[0]));
  IBUF \data5_IBUF[1]_inst 
       (.I(data5[1]),
        .O(data5_IBUF[1]));
  IBUF \data5_IBUF[2]_inst 
       (.I(data5[2]),
        .O(data5_IBUF[2]));
  IBUF \data5_IBUF[3]_inst 
       (.I(data5[3]),
        .O(data5_IBUF[3]));
  OBUF \out_OBUF[0]_inst 
       (.I(out_OBUF[0]),
        .O(out[0]));
  LUT6 #(
    .INIT(64'h3A0A3A3A3A0A0A0A)) 
    \out_OBUF[0]_inst_i_1 
       (.I0(\out_OBUF[0]_inst_i_2_n_0 ),
        .I1(sel_IBUF[1]),
        .I2(sel_IBUF[2]),
        .I3(data5_IBUF[0]),
        .I4(sel_IBUF[0]),
        .I5(data4_IBUF[0]),
        .O(out_OBUF[0]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \out_OBUF[0]_inst_i_2 
       (.I0(data3_IBUF[0]),
        .I1(data2_IBUF[0]),
        .I2(sel_IBUF[1]),
        .I3(data1_IBUF[0]),
        .I4(sel_IBUF[0]),
        .I5(data0_IBUF[0]),
        .O(\out_OBUF[0]_inst_i_2_n_0 ));
  OBUF \out_OBUF[1]_inst 
       (.I(out_OBUF[1]),
        .O(out[1]));
  LUT6 #(
    .INIT(64'h3A0A3A3A3A0A0A0A)) 
    \out_OBUF[1]_inst_i_1 
       (.I0(\out_OBUF[1]_inst_i_2_n_0 ),
        .I1(sel_IBUF[1]),
        .I2(sel_IBUF[2]),
        .I3(data5_IBUF[1]),
        .I4(sel_IBUF[0]),
        .I5(data4_IBUF[1]),
        .O(out_OBUF[1]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \out_OBUF[1]_inst_i_2 
       (.I0(data3_IBUF[1]),
        .I1(data2_IBUF[1]),
        .I2(sel_IBUF[1]),
        .I3(data1_IBUF[1]),
        .I4(sel_IBUF[0]),
        .I5(data0_IBUF[1]),
        .O(\out_OBUF[1]_inst_i_2_n_0 ));
  OBUF \out_OBUF[2]_inst 
       (.I(out_OBUF[2]),
        .O(out[2]));
  LUT6 #(
    .INIT(64'h3A0A3A3A3A0A0A0A)) 
    \out_OBUF[2]_inst_i_1 
       (.I0(\out_OBUF[2]_inst_i_2_n_0 ),
        .I1(sel_IBUF[1]),
        .I2(sel_IBUF[2]),
        .I3(data5_IBUF[2]),
        .I4(sel_IBUF[0]),
        .I5(data4_IBUF[2]),
        .O(out_OBUF[2]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \out_OBUF[2]_inst_i_2 
       (.I0(data3_IBUF[2]),
        .I1(data2_IBUF[2]),
        .I2(sel_IBUF[1]),
        .I3(data1_IBUF[2]),
        .I4(sel_IBUF[0]),
        .I5(data0_IBUF[2]),
        .O(\out_OBUF[2]_inst_i_2_n_0 ));
  OBUF \out_OBUF[3]_inst 
       (.I(out_OBUF[3]),
        .O(out[3]));
  LUT6 #(
    .INIT(64'h3A0A3A3A3A0A0A0A)) 
    \out_OBUF[3]_inst_i_1 
       (.I0(\out_OBUF[3]_inst_i_2_n_0 ),
        .I1(sel_IBUF[1]),
        .I2(sel_IBUF[2]),
        .I3(data5_IBUF[3]),
        .I4(sel_IBUF[0]),
        .I5(data4_IBUF[3]),
        .O(out_OBUF[3]));
  LUT6 #(
    .INIT(64'hAFA0CFCFAFA0C0C0)) 
    \out_OBUF[3]_inst_i_2 
       (.I0(data3_IBUF[3]),
        .I1(data2_IBUF[3]),
        .I2(sel_IBUF[1]),
        .I3(data1_IBUF[3]),
        .I4(sel_IBUF[0]),
        .I5(data0_IBUF[3]),
        .O(\out_OBUF[3]_inst_i_2_n_0 ));
  IBUF \sel_IBUF[0]_inst 
       (.I(sel[0]),
        .O(sel_IBUF[0]));
  IBUF \sel_IBUF[1]_inst 
       (.I(sel[1]),
        .O(sel_IBUF[1]));
  IBUF \sel_IBUF[2]_inst 
       (.I(sel[2]),
        .O(sel_IBUF[2]));
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
