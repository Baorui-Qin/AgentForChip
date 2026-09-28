// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 03:46:36 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob015_vector1/eda/run-HJlx4m/build/.rtl-synth-xqIo5L/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (in,
    out_hi,
    out_lo);
  input [15:0]in;
  output [7:0]out_hi;
  output [7:0]out_lo;

  wire [15:0]in;
  wire [7:0]out_hi;
  wire [7:0]out_hi_OBUF;
  wire [7:0]out_lo;
  wire [7:0]out_lo_OBUF;

  IBUF \in_IBUF[0]_inst 
       (.I(in[0]),
        .O(out_lo_OBUF[0]));
  IBUF \in_IBUF[10]_inst 
       (.I(in[10]),
        .O(out_hi_OBUF[2]));
  IBUF \in_IBUF[11]_inst 
       (.I(in[11]),
        .O(out_hi_OBUF[3]));
  IBUF \in_IBUF[12]_inst 
       (.I(in[12]),
        .O(out_hi_OBUF[4]));
  IBUF \in_IBUF[13]_inst 
       (.I(in[13]),
        .O(out_hi_OBUF[5]));
  IBUF \in_IBUF[14]_inst 
       (.I(in[14]),
        .O(out_hi_OBUF[6]));
  IBUF \in_IBUF[15]_inst 
       (.I(in[15]),
        .O(out_hi_OBUF[7]));
  IBUF \in_IBUF[1]_inst 
       (.I(in[1]),
        .O(out_lo_OBUF[1]));
  IBUF \in_IBUF[2]_inst 
       (.I(in[2]),
        .O(out_lo_OBUF[2]));
  IBUF \in_IBUF[3]_inst 
       (.I(in[3]),
        .O(out_lo_OBUF[3]));
  IBUF \in_IBUF[4]_inst 
       (.I(in[4]),
        .O(out_lo_OBUF[4]));
  IBUF \in_IBUF[5]_inst 
       (.I(in[5]),
        .O(out_lo_OBUF[5]));
  IBUF \in_IBUF[6]_inst 
       (.I(in[6]),
        .O(out_lo_OBUF[6]));
  IBUF \in_IBUF[7]_inst 
       (.I(in[7]),
        .O(out_lo_OBUF[7]));
  IBUF \in_IBUF[8]_inst 
       (.I(in[8]),
        .O(out_hi_OBUF[0]));
  IBUF \in_IBUF[9]_inst 
       (.I(in[9]),
        .O(out_hi_OBUF[1]));
  OBUF \out_hi_OBUF[0]_inst 
       (.I(out_hi_OBUF[0]),
        .O(out_hi[0]));
  OBUF \out_hi_OBUF[1]_inst 
       (.I(out_hi_OBUF[1]),
        .O(out_hi[1]));
  OBUF \out_hi_OBUF[2]_inst 
       (.I(out_hi_OBUF[2]),
        .O(out_hi[2]));
  OBUF \out_hi_OBUF[3]_inst 
       (.I(out_hi_OBUF[3]),
        .O(out_hi[3]));
  OBUF \out_hi_OBUF[4]_inst 
       (.I(out_hi_OBUF[4]),
        .O(out_hi[4]));
  OBUF \out_hi_OBUF[5]_inst 
       (.I(out_hi_OBUF[5]),
        .O(out_hi[5]));
  OBUF \out_hi_OBUF[6]_inst 
       (.I(out_hi_OBUF[6]),
        .O(out_hi[6]));
  OBUF \out_hi_OBUF[7]_inst 
       (.I(out_hi_OBUF[7]),
        .O(out_hi[7]));
  OBUF \out_lo_OBUF[0]_inst 
       (.I(out_lo_OBUF[0]),
        .O(out_lo[0]));
  OBUF \out_lo_OBUF[1]_inst 
       (.I(out_lo_OBUF[1]),
        .O(out_lo[1]));
  OBUF \out_lo_OBUF[2]_inst 
       (.I(out_lo_OBUF[2]),
        .O(out_lo[2]));
  OBUF \out_lo_OBUF[3]_inst 
       (.I(out_lo_OBUF[3]),
        .O(out_lo[3]));
  OBUF \out_lo_OBUF[4]_inst 
       (.I(out_lo_OBUF[4]),
        .O(out_lo[4]));
  OBUF \out_lo_OBUF[5]_inst 
       (.I(out_lo_OBUF[5]),
        .O(out_lo[5]));
  OBUF \out_lo_OBUF[6]_inst 
       (.I(out_lo_OBUF[6]),
        .O(out_lo[6]));
  OBUF \out_lo_OBUF[7]_inst 
       (.I(out_lo_OBUF[7]),
        .O(out_lo[7]));
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
