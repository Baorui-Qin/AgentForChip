// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 22:26:22 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob063_review2015_shiftcount/eda/run-SCtFuJ/build/.rtl-synth-7dC5Bi/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (clk,
    shift_ena,
    count_ena,
    data,
    q);
  input clk;
  input shift_ena;
  input count_ena;
  input data;
  output [3:0]q;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire count_ena;
  wire count_ena_IBUF;
  wire data;
  wire data_IBUF;
  wire [3:0]p_0_in;
  wire [3:0]q;
  wire \q[3]_i_1_n_0 ;
  wire [3:0]q_OBUF;
  wire shift_ena;
  wire shift_ena_IBUF;

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
  IBUF count_ena_IBUF_inst
       (.I(count_ena),
        .O(count_ena_IBUF));
  IBUF data_IBUF_inst
       (.I(data),
        .O(data_IBUF));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'h8B)) 
    \q[0]_i_1 
       (.I0(data_IBUF),
        .I1(shift_ena_IBUF),
        .I2(q_OBUF[0]),
        .O(p_0_in[0]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hC9)) 
    \q[1]_i_1 
       (.I0(shift_ena_IBUF),
        .I1(q_OBUF[0]),
        .I2(q_OBUF[1]),
        .O(p_0_in[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'hDC89)) 
    \q[2]_i_1 
       (.I0(shift_ena_IBUF),
        .I1(q_OBUF[1]),
        .I2(q_OBUF[0]),
        .I3(q_OBUF[2]),
        .O(p_0_in[2]));
  LUT2 #(
    .INIT(4'hE)) 
    \q[3]_i_1 
       (.I0(count_ena_IBUF),
        .I1(shift_ena_IBUF),
        .O(\q[3]_i_1_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hDDDC8889)) 
    \q[3]_i_2 
       (.I0(shift_ena_IBUF),
        .I1(q_OBUF[2]),
        .I2(q_OBUF[0]),
        .I3(q_OBUF[1]),
        .I4(q_OBUF[3]),
        .O(p_0_in[3]));
  OBUF \q_OBUF[0]_inst 
       (.I(q_OBUF[0]),
        .O(q[0]));
  OBUF \q_OBUF[1]_inst 
       (.I(q_OBUF[1]),
        .O(q[1]));
  OBUF \q_OBUF[2]_inst 
       (.I(q_OBUF[2]),
        .O(q[2]));
  OBUF \q_OBUF[3]_inst 
       (.I(q_OBUF[3]),
        .O(q[3]));
  FDRE \q_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[3]_i_1_n_0 ),
        .D(p_0_in[0]),
        .Q(q_OBUF[0]),
        .R(1'b0));
  FDRE \q_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[3]_i_1_n_0 ),
        .D(p_0_in[1]),
        .Q(q_OBUF[1]),
        .R(1'b0));
  FDRE \q_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[3]_i_1_n_0 ),
        .D(p_0_in[2]),
        .Q(q_OBUF[2]),
        .R(1'b0));
  FDRE \q_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\q[3]_i_1_n_0 ),
        .D(p_0_in[3]),
        .Q(q_OBUF[3]),
        .R(1'b0));
  IBUF shift_ena_IBUF_inst
       (.I(shift_ena),
        .O(shift_ena_IBUF));
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
