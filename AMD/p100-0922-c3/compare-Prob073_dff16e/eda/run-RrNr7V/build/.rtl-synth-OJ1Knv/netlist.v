// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Tue Sep 22 22:16:04 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p100-0922-c3/compare-Prob073_dff16e/eda/run-RrNr7V/build/.rtl-synth-OJ1Knv/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (clk,
    resetn,
    byteena,
    d,
    q);
  input clk;
  input resetn;
  input [1:0]byteena;
  input [15:0]d;
  output [15:0]q;

  wire [1:0]byteena;
  wire [1:0]byteena_IBUF;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [15:0]d;
  wire [15:0]d_IBUF;
  wire p_0_in;
  wire [15:0]q;
  wire [15:0]q_OBUF;
  wire resetn;
  wire resetn_IBUF;

  IBUF \byteena_IBUF[0]_inst 
       (.I(byteena[0]),
        .O(byteena_IBUF[0]));
  IBUF \byteena_IBUF[1]_inst 
       (.I(byteena[1]),
        .O(byteena_IBUF[1]));
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
  IBUF \d_IBUF[0]_inst 
       (.I(d[0]),
        .O(d_IBUF[0]));
  IBUF \d_IBUF[10]_inst 
       (.I(d[10]),
        .O(d_IBUF[10]));
  IBUF \d_IBUF[11]_inst 
       (.I(d[11]),
        .O(d_IBUF[11]));
  IBUF \d_IBUF[12]_inst 
       (.I(d[12]),
        .O(d_IBUF[12]));
  IBUF \d_IBUF[13]_inst 
       (.I(d[13]),
        .O(d_IBUF[13]));
  IBUF \d_IBUF[14]_inst 
       (.I(d[14]),
        .O(d_IBUF[14]));
  IBUF \d_IBUF[15]_inst 
       (.I(d[15]),
        .O(d_IBUF[15]));
  IBUF \d_IBUF[1]_inst 
       (.I(d[1]),
        .O(d_IBUF[1]));
  IBUF \d_IBUF[2]_inst 
       (.I(d[2]),
        .O(d_IBUF[2]));
  IBUF \d_IBUF[3]_inst 
       (.I(d[3]),
        .O(d_IBUF[3]));
  IBUF \d_IBUF[4]_inst 
       (.I(d[4]),
        .O(d_IBUF[4]));
  IBUF \d_IBUF[5]_inst 
       (.I(d[5]),
        .O(d_IBUF[5]));
  IBUF \d_IBUF[6]_inst 
       (.I(d[6]),
        .O(d_IBUF[6]));
  IBUF \d_IBUF[7]_inst 
       (.I(d[7]),
        .O(d_IBUF[7]));
  IBUF \d_IBUF[8]_inst 
       (.I(d[8]),
        .O(d_IBUF[8]));
  IBUF \d_IBUF[9]_inst 
       (.I(d[9]),
        .O(d_IBUF[9]));
  LUT1 #(
    .INIT(2'h1)) 
    \q[15]_i_1 
       (.I0(resetn_IBUF),
        .O(p_0_in));
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
  OBUF \q_OBUF[1]_inst 
       (.I(q_OBUF[1]),
        .O(q[1]));
  OBUF \q_OBUF[2]_inst 
       (.I(q_OBUF[2]),
        .O(q[2]));
  OBUF \q_OBUF[3]_inst 
       (.I(q_OBUF[3]),
        .O(q[3]));
  OBUF \q_OBUF[4]_inst 
       (.I(q_OBUF[4]),
        .O(q[4]));
  OBUF \q_OBUF[5]_inst 
       (.I(q_OBUF[5]),
        .O(q[5]));
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
        .CE(byteena_IBUF[0]),
        .D(d_IBUF[0]),
        .Q(q_OBUF[0]),
        .R(p_0_in));
  FDRE \q_reg[10] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[1]),
        .D(d_IBUF[10]),
        .Q(q_OBUF[10]),
        .R(p_0_in));
  FDRE \q_reg[11] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[1]),
        .D(d_IBUF[11]),
        .Q(q_OBUF[11]),
        .R(p_0_in));
  FDRE \q_reg[12] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[1]),
        .D(d_IBUF[12]),
        .Q(q_OBUF[12]),
        .R(p_0_in));
  FDRE \q_reg[13] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[1]),
        .D(d_IBUF[13]),
        .Q(q_OBUF[13]),
        .R(p_0_in));
  FDRE \q_reg[14] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[1]),
        .D(d_IBUF[14]),
        .Q(q_OBUF[14]),
        .R(p_0_in));
  FDRE \q_reg[15] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[1]),
        .D(d_IBUF[15]),
        .Q(q_OBUF[15]),
        .R(p_0_in));
  FDRE \q_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[0]),
        .D(d_IBUF[1]),
        .Q(q_OBUF[1]),
        .R(p_0_in));
  FDRE \q_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[0]),
        .D(d_IBUF[2]),
        .Q(q_OBUF[2]),
        .R(p_0_in));
  FDRE \q_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[0]),
        .D(d_IBUF[3]),
        .Q(q_OBUF[3]),
        .R(p_0_in));
  FDRE \q_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[0]),
        .D(d_IBUF[4]),
        .Q(q_OBUF[4]),
        .R(p_0_in));
  FDRE \q_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[0]),
        .D(d_IBUF[5]),
        .Q(q_OBUF[5]),
        .R(p_0_in));
  FDRE \q_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[0]),
        .D(d_IBUF[6]),
        .Q(q_OBUF[6]),
        .R(p_0_in));
  FDRE \q_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[0]),
        .D(d_IBUF[7]),
        .Q(q_OBUF[7]),
        .R(p_0_in));
  FDRE \q_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[1]),
        .D(d_IBUF[8]),
        .Q(q_OBUF[8]),
        .R(p_0_in));
  FDRE \q_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(byteena_IBUF[1]),
        .D(d_IBUF[9]),
        .Q(q_OBUF[9]),
        .R(p_0_in));
  IBUF resetn_IBUF_inst
       (.I(resetn),
        .O(resetn_IBUF));
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
