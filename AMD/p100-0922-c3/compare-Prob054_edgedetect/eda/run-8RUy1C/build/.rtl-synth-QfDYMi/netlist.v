// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Tue Sep 22 22:53:26 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p100-0922-c3/compare-Prob054_edgedetect/eda/run-8RUy1C/build/.rtl-synth-QfDYMi/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (clk,
    in,
    pedge);
  input clk;
  input [7:0]in;
  output [7:0]pedge;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [7:0]in;
  wire [7:0]in_IBUF;
  wire [7:0]pedge;
  wire \pedge[0]_i_1_n_0 ;
  wire \pedge[1]_i_1_n_0 ;
  wire \pedge[2]_i_1_n_0 ;
  wire \pedge[3]_i_1_n_0 ;
  wire \pedge[4]_i_1_n_0 ;
  wire \pedge[5]_i_1_n_0 ;
  wire \pedge[6]_i_1_n_0 ;
  wire \pedge[7]_i_1_n_0 ;
  wire [7:0]pedge_OBUF;
  wire [7:0]prev;

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
  IBUF \in_IBUF[1]_inst 
       (.I(in[1]),
        .O(in_IBUF[1]));
  IBUF \in_IBUF[2]_inst 
       (.I(in[2]),
        .O(in_IBUF[2]));
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
  LUT2 #(
    .INIT(4'h2)) 
    \pedge[0]_i_1 
       (.I0(in_IBUF[0]),
        .I1(prev[0]),
        .O(\pedge[0]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \pedge[1]_i_1 
       (.I0(in_IBUF[1]),
        .I1(prev[1]),
        .O(\pedge[1]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \pedge[2]_i_1 
       (.I0(in_IBUF[2]),
        .I1(prev[2]),
        .O(\pedge[2]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \pedge[3]_i_1 
       (.I0(in_IBUF[3]),
        .I1(prev[3]),
        .O(\pedge[3]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \pedge[4]_i_1 
       (.I0(in_IBUF[4]),
        .I1(prev[4]),
        .O(\pedge[4]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \pedge[5]_i_1 
       (.I0(in_IBUF[5]),
        .I1(prev[5]),
        .O(\pedge[5]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \pedge[6]_i_1 
       (.I0(in_IBUF[6]),
        .I1(prev[6]),
        .O(\pedge[6]_i_1_n_0 ));
  LUT2 #(
    .INIT(4'h2)) 
    \pedge[7]_i_1 
       (.I0(in_IBUF[7]),
        .I1(prev[7]),
        .O(\pedge[7]_i_1_n_0 ));
  OBUF \pedge_OBUF[0]_inst 
       (.I(pedge_OBUF[0]),
        .O(pedge[0]));
  OBUF \pedge_OBUF[1]_inst 
       (.I(pedge_OBUF[1]),
        .O(pedge[1]));
  OBUF \pedge_OBUF[2]_inst 
       (.I(pedge_OBUF[2]),
        .O(pedge[2]));
  OBUF \pedge_OBUF[3]_inst 
       (.I(pedge_OBUF[3]),
        .O(pedge[3]));
  OBUF \pedge_OBUF[4]_inst 
       (.I(pedge_OBUF[4]),
        .O(pedge[4]));
  OBUF \pedge_OBUF[5]_inst 
       (.I(pedge_OBUF[5]),
        .O(pedge[5]));
  OBUF \pedge_OBUF[6]_inst 
       (.I(pedge_OBUF[6]),
        .O(pedge[6]));
  OBUF \pedge_OBUF[7]_inst 
       (.I(pedge_OBUF[7]),
        .O(pedge[7]));
  FDRE \pedge_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\pedge[0]_i_1_n_0 ),
        .Q(pedge_OBUF[0]),
        .R(1'b0));
  FDRE \pedge_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\pedge[1]_i_1_n_0 ),
        .Q(pedge_OBUF[1]),
        .R(1'b0));
  FDRE \pedge_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\pedge[2]_i_1_n_0 ),
        .Q(pedge_OBUF[2]),
        .R(1'b0));
  FDRE \pedge_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\pedge[3]_i_1_n_0 ),
        .Q(pedge_OBUF[3]),
        .R(1'b0));
  FDRE \pedge_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\pedge[4]_i_1_n_0 ),
        .Q(pedge_OBUF[4]),
        .R(1'b0));
  FDRE \pedge_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\pedge[5]_i_1_n_0 ),
        .Q(pedge_OBUF[5]),
        .R(1'b0));
  FDRE \pedge_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\pedge[6]_i_1_n_0 ),
        .Q(pedge_OBUF[6]),
        .R(1'b0));
  FDRE \pedge_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(\pedge[7]_i_1_n_0 ),
        .Q(pedge_OBUF[7]),
        .R(1'b0));
  FDRE \prev_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[0]),
        .Q(prev[0]),
        .R(1'b0));
  FDRE \prev_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[1]),
        .Q(prev[1]),
        .R(1'b0));
  FDRE \prev_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(in_IBUF[2]),
        .Q(prev[2]),
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
