// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Thu Sep 17 21:31:45 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-5cc24475-2298-45fa-acc5-d5b0053973d5/eda/run-yPrODg/build/.rtl-synth-Tab6eN/netlist.v
// Design      : sequence_101
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module sequence_101
   (clk,
    rst,
    din,
    hit);
  input clk;
  input rst;
  input din;
  output hit;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire din;
  wire din_IBUF;
  wire [1:0]history;
  wire hit;
  wire hit_OBUF;
  wire hit_i_1_n_0;
  wire p_0_in;
  wire [1:1]p_0_in__0;
  wire rst;
  wire rst_IBUF;

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
  IBUF din_IBUF_inst
       (.I(din),
        .O(din_IBUF));
  FDRE \history_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(din_IBUF),
        .Q(history[0]),
        .R(rst_IBUF));
  FDRE \history_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(history[0]),
        .Q(history[1]),
        .R(rst_IBUF));
  OBUF hit_OBUF_inst
       (.I(hit_OBUF),
        .O(hit));
  LUT4 #(
    .INIT(16'h0800)) 
    hit_i_1
       (.I0(p_0_in),
        .I1(history[1]),
        .I2(history[0]),
        .I3(din_IBUF),
        .O(hit_i_1_n_0));
  FDRE hit_reg
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(hit_i_1_n_0),
        .Q(hit_OBUF),
        .R(rst_IBUF));
  IBUF rst_IBUF_inst
       (.I(rst),
        .O(rst_IBUF));
  FDRE \valid_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(1'b1),
        .Q(p_0_in__0),
        .R(rst_IBUF));
  FDRE \valid_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in__0),
        .Q(p_0_in),
        .R(rst_IBUF));
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
