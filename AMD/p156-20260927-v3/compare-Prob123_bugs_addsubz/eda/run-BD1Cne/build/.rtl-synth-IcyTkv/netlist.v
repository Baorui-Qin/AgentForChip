// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 23:47:14 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob123_bugs_addsubz/eda/run-BD1Cne/build/.rtl-synth-IcyTkv/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (do_sub,
    a,
    b,
    out,
    result_is_zero);
  input do_sub;
  input [7:0]a;
  input [7:0]b;
  output [7:0]out;
  output result_is_zero;

  wire [7:0]a;
  wire [7:0]a_IBUF;
  wire [7:0]b;
  wire [7:0]b_IBUF;
  wire do_sub;
  wire do_sub_IBUF;
  wire [7:0]out;
  wire [7:0]out_OBUF;
  wire \out_OBUF[7]_inst_i_1_n_1 ;
  wire \out_OBUF[7]_inst_i_1_n_2 ;
  wire \out_OBUF[7]_inst_i_1_n_3 ;
  wire \out_OBUF[7]_inst_i_1_n_4 ;
  wire \out_OBUF[7]_inst_i_1_n_5 ;
  wire \out_OBUF[7]_inst_i_1_n_6 ;
  wire \out_OBUF[7]_inst_i_1_n_7 ;
  wire \out_OBUF[7]_inst_i_2_n_0 ;
  wire \out_OBUF[7]_inst_i_3_n_0 ;
  wire \out_OBUF[7]_inst_i_4_n_0 ;
  wire \out_OBUF[7]_inst_i_5_n_0 ;
  wire \out_OBUF[7]_inst_i_6_n_0 ;
  wire \out_OBUF[7]_inst_i_7_n_0 ;
  wire \out_OBUF[7]_inst_i_8_n_0 ;
  wire \out_OBUF[7]_inst_i_9_n_0 ;
  wire result_is_zero;
  wire result_is_zero_OBUF;
  wire result_is_zero_OBUF_inst_i_2_n_0;
  wire [7:7]\NLW_out_OBUF[7]_inst_i_1_CO_UNCONNECTED ;

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
  IBUF do_sub_IBUF_inst
       (.I(do_sub),
        .O(do_sub_IBUF));
  OBUF \out_OBUF[0]_inst 
       (.I(out_OBUF[0]),
        .O(out[0]));
  OBUF \out_OBUF[1]_inst 
       (.I(out_OBUF[1]),
        .O(out[1]));
  OBUF \out_OBUF[2]_inst 
       (.I(out_OBUF[2]),
        .O(out[2]));
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
  (* ADDER_THRESHOLD = "35" *) 
  (* METHODOLOGY_DRC_VIOS = "{SYNTH-8 {cell *THIS*}}" *) 
  CARRY8 \out_OBUF[7]_inst_i_1 
       (.CI(do_sub_IBUF),
        .CI_TOP(1'b0),
        .CO({\NLW_out_OBUF[7]_inst_i_1_CO_UNCONNECTED [7],\out_OBUF[7]_inst_i_1_n_1 ,\out_OBUF[7]_inst_i_1_n_2 ,\out_OBUF[7]_inst_i_1_n_3 ,\out_OBUF[7]_inst_i_1_n_4 ,\out_OBUF[7]_inst_i_1_n_5 ,\out_OBUF[7]_inst_i_1_n_6 ,\out_OBUF[7]_inst_i_1_n_7 }),
        .DI({1'b0,a_IBUF[6:0]}),
        .O(out_OBUF),
        .S({\out_OBUF[7]_inst_i_2_n_0 ,\out_OBUF[7]_inst_i_3_n_0 ,\out_OBUF[7]_inst_i_4_n_0 ,\out_OBUF[7]_inst_i_5_n_0 ,\out_OBUF[7]_inst_i_6_n_0 ,\out_OBUF[7]_inst_i_7_n_0 ,\out_OBUF[7]_inst_i_8_n_0 ,\out_OBUF[7]_inst_i_9_n_0 }));
  LUT3 #(
    .INIT(8'h96)) 
    \out_OBUF[7]_inst_i_2 
       (.I0(a_IBUF[7]),
        .I1(b_IBUF[7]),
        .I2(do_sub_IBUF),
        .O(\out_OBUF[7]_inst_i_2_n_0 ));
  LUT3 #(
    .INIT(8'h96)) 
    \out_OBUF[7]_inst_i_3 
       (.I0(a_IBUF[6]),
        .I1(b_IBUF[6]),
        .I2(do_sub_IBUF),
        .O(\out_OBUF[7]_inst_i_3_n_0 ));
  LUT3 #(
    .INIT(8'h96)) 
    \out_OBUF[7]_inst_i_4 
       (.I0(a_IBUF[5]),
        .I1(b_IBUF[5]),
        .I2(do_sub_IBUF),
        .O(\out_OBUF[7]_inst_i_4_n_0 ));
  LUT3 #(
    .INIT(8'h96)) 
    \out_OBUF[7]_inst_i_5 
       (.I0(a_IBUF[4]),
        .I1(b_IBUF[4]),
        .I2(do_sub_IBUF),
        .O(\out_OBUF[7]_inst_i_5_n_0 ));
  LUT3 #(
    .INIT(8'h96)) 
    \out_OBUF[7]_inst_i_6 
       (.I0(a_IBUF[3]),
        .I1(b_IBUF[3]),
        .I2(do_sub_IBUF),
        .O(\out_OBUF[7]_inst_i_6_n_0 ));
  LUT3 #(
    .INIT(8'h96)) 
    \out_OBUF[7]_inst_i_7 
       (.I0(a_IBUF[2]),
        .I1(b_IBUF[2]),
        .I2(do_sub_IBUF),
        .O(\out_OBUF[7]_inst_i_7_n_0 ));
  LUT3 #(
    .INIT(8'h96)) 
    \out_OBUF[7]_inst_i_8 
       (.I0(a_IBUF[1]),
        .I1(b_IBUF[1]),
        .I2(do_sub_IBUF),
        .O(\out_OBUF[7]_inst_i_8_n_0 ));
  LUT3 #(
    .INIT(8'h96)) 
    \out_OBUF[7]_inst_i_9 
       (.I0(a_IBUF[0]),
        .I1(b_IBUF[0]),
        .I2(do_sub_IBUF),
        .O(\out_OBUF[7]_inst_i_9_n_0 ));
  OBUF result_is_zero_OBUF_inst
       (.I(result_is_zero_OBUF),
        .O(result_is_zero));
  LUT5 #(
    .INIT(32'h00000001)) 
    result_is_zero_OBUF_inst_i_1
       (.I0(out_OBUF[4]),
        .I1(out_OBUF[5]),
        .I2(out_OBUF[7]),
        .I3(out_OBUF[6]),
        .I4(result_is_zero_OBUF_inst_i_2_n_0),
        .O(result_is_zero_OBUF));
  LUT4 #(
    .INIT(16'hFFFE)) 
    result_is_zero_OBUF_inst_i_2
       (.I0(out_OBUF[1]),
        .I1(out_OBUF[0]),
        .I2(out_OBUF[3]),
        .I3(out_OBUF[2]),
        .O(result_is_zero_OBUF_inst_i_2_n_0));
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
