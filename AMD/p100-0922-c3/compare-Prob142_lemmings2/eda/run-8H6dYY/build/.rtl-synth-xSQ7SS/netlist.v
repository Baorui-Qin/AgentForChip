// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Tue Sep 22 22:15:48 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p100-0922-c3/compare-Prob142_lemmings2/eda/run-8H6dYY/build/.rtl-synth-xSQ7SS/netlist.v
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
    bump_left,
    bump_right,
    ground,
    walk_left,
    walk_right,
    aaah);
  input clk;
  input areset;
  input bump_left;
  input bump_right;
  input ground;
  output walk_left;
  output walk_right;
  output aaah;

  wire aaah;
  wire aaah_OBUF;
  wire areset;
  wire areset_IBUF;
  wire bump_left;
  wire bump_left_IBUF;
  wire bump_right;
  wire bump_right_IBUF;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire ground;
  wire ground_IBUF;
  wire [0:0]next;
  wire [0:0]state;
  wire \state[1]_i_1_n_0 ;
  wire walk_left;
  wire walk_left_OBUF;
  wire walk_right;
  wire walk_right_OBUF;

  OBUF aaah_OBUF_inst
       (.I(aaah_OBUF),
        .O(aaah));
  IBUF areset_IBUF_inst
       (.I(areset),
        .O(areset_IBUF));
  IBUF bump_left_IBUF_inst
       (.I(bump_left),
        .O(bump_left_IBUF));
  IBUF bump_right_IBUF_inst
       (.I(bump_right),
        .O(bump_right_IBUF));
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
  IBUF ground_IBUF_inst
       (.I(ground),
        .O(ground_IBUF));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hCCCC74CC)) 
    \state[0]_i_1 
       (.I0(bump_right_IBUF),
        .I1(state),
        .I2(bump_left_IBUF),
        .I3(ground_IBUF),
        .I4(aaah_OBUF),
        .O(next));
  LUT1 #(
    .INIT(2'h1)) 
    \state[1]_i_1 
       (.I0(ground_IBUF),
        .O(\state[1]_i_1_n_0 ));
  FDCE \state_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(next),
        .Q(state));
  FDCE \state_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .CLR(areset_IBUF),
        .D(\state[1]_i_1_n_0 ),
        .Q(aaah_OBUF));
  OBUF walk_left_OBUF_inst
       (.I(walk_left_OBUF),
        .O(walk_left));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h1)) 
    walk_left_OBUF_inst_i_1
       (.I0(aaah_OBUF),
        .I1(state),
        .O(walk_left_OBUF));
  OBUF walk_right_OBUF_inst
       (.I(walk_right_OBUF),
        .O(walk_right));
  LUT2 #(
    .INIT(4'h2)) 
    walk_right_OBUF_inst_i_1
       (.I0(state),
        .I1(aaah_OBUF),
        .O(walk_right_OBUF));
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
