// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Thu Sep 17 20:28:30 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-541d8a18-a792-4bd6-b8af-72e98b2967b3/eda/run-mk76SB/build/.rtl-synth-cvuTdF/netlist.v
// Design      : signed_saturating_add
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module signed_saturating_add
   (clk,
    rst,
    a,
    b,
    sum);
  input clk;
  input rst;
  input [7:0]a;
  input [7:0]b;
  output [7:0]sum;

  wire [7:0]a;
  wire [7:0]a_IBUF;
  wire [7:0]b;
  wire [7:0]b_IBUF;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [7:0]p_0_in;
  wire rst;
  wire rst_IBUF;
  wire [7:0]sum;
  wire \sum[1]_i_2_n_0 ;
  wire \sum[2]_i_2_n_0 ;
  wire \sum[3]_i_2_n_0 ;
  wire \sum[4]_i_2_n_0 ;
  wire \sum[5]_i_2_n_0 ;
  wire \sum[6]_i_2_n_0 ;
  wire \sum[7]_i_2_n_0 ;
  wire [7:0]sum_OBUF;

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
  IBUF rst_IBUF_inst
       (.I(rst),
        .O(rst_IBUF));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'h02BFBF02)) 
    \sum[0]_i_1 
       (.I0(\sum[7]_i_2_n_0 ),
        .I1(a_IBUF[7]),
        .I2(b_IBUF[7]),
        .I3(a_IBUF[0]),
        .I4(b_IBUF[0]),
        .O(p_0_in[0]));
  LUT6 #(
    .INIT(64'hBF0202BF02BFBF02)) 
    \sum[1]_i_1 
       (.I0(\sum[7]_i_2_n_0 ),
        .I1(a_IBUF[7]),
        .I2(b_IBUF[7]),
        .I3(\sum[1]_i_2_n_0 ),
        .I4(b_IBUF[1]),
        .I5(a_IBUF[1]),
        .O(p_0_in[1]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \sum[1]_i_2 
       (.I0(b_IBUF[0]),
        .I1(a_IBUF[0]),
        .O(\sum[1]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'hBF0202BF02BFBF02)) 
    \sum[2]_i_1 
       (.I0(\sum[7]_i_2_n_0 ),
        .I1(a_IBUF[7]),
        .I2(b_IBUF[7]),
        .I3(\sum[2]_i_2_n_0 ),
        .I4(b_IBUF[2]),
        .I5(a_IBUF[2]),
        .O(p_0_in[2]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT4 #(
    .INIT(16'hE888)) 
    \sum[2]_i_2 
       (.I0(b_IBUF[1]),
        .I1(a_IBUF[1]),
        .I2(a_IBUF[0]),
        .I3(b_IBUF[0]),
        .O(\sum[2]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'hBF0202BF02BFBF02)) 
    \sum[3]_i_1 
       (.I0(\sum[7]_i_2_n_0 ),
        .I1(a_IBUF[7]),
        .I2(b_IBUF[7]),
        .I3(\sum[3]_i_2_n_0 ),
        .I4(b_IBUF[3]),
        .I5(a_IBUF[3]),
        .O(p_0_in[3]));
  LUT6 #(
    .INIT(64'hEEEEE888E8888888)) 
    \sum[3]_i_2 
       (.I0(b_IBUF[2]),
        .I1(a_IBUF[2]),
        .I2(b_IBUF[0]),
        .I3(a_IBUF[0]),
        .I4(a_IBUF[1]),
        .I5(b_IBUF[1]),
        .O(\sum[3]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'hBF0202BF02BFBF02)) 
    \sum[4]_i_1 
       (.I0(\sum[7]_i_2_n_0 ),
        .I1(a_IBUF[7]),
        .I2(b_IBUF[7]),
        .I3(\sum[4]_i_2_n_0 ),
        .I4(b_IBUF[4]),
        .I5(a_IBUF[4]),
        .O(p_0_in[4]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hE8)) 
    \sum[4]_i_2 
       (.I0(b_IBUF[3]),
        .I1(a_IBUF[3]),
        .I2(\sum[3]_i_2_n_0 ),
        .O(\sum[4]_i_2_n_0 ));
  LUT6 #(
    .INIT(64'hBF0202BF02BFBF02)) 
    \sum[5]_i_1 
       (.I0(\sum[7]_i_2_n_0 ),
        .I1(a_IBUF[7]),
        .I2(b_IBUF[7]),
        .I3(\sum[5]_i_2_n_0 ),
        .I4(b_IBUF[5]),
        .I5(a_IBUF[5]),
        .O(p_0_in[5]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT5 #(
    .INIT(32'hEEE8E888)) 
    \sum[5]_i_2 
       (.I0(b_IBUF[4]),
        .I1(a_IBUF[4]),
        .I2(\sum[3]_i_2_n_0 ),
        .I3(a_IBUF[3]),
        .I4(b_IBUF[3]),
        .O(\sum[5]_i_2_n_0 ));
  LUT5 #(
    .INIT(32'h809696FE)) 
    \sum[6]_i_1 
       (.I0(b_IBUF[6]),
        .I1(a_IBUF[6]),
        .I2(\sum[6]_i_2_n_0 ),
        .I3(a_IBUF[7]),
        .I4(b_IBUF[7]),
        .O(p_0_in[6]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'hE8)) 
    \sum[6]_i_2 
       (.I0(b_IBUF[5]),
        .I1(a_IBUF[5]),
        .I2(\sum[5]_i_2_n_0 ),
        .O(\sum[6]_i_2_n_0 ));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'h8E)) 
    \sum[7]_i_1 
       (.I0(b_IBUF[7]),
        .I1(a_IBUF[7]),
        .I2(\sum[7]_i_2_n_0 ),
        .O(p_0_in[7]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT5 #(
    .INIT(32'hEEE8E888)) 
    \sum[7]_i_2 
       (.I0(b_IBUF[6]),
        .I1(a_IBUF[6]),
        .I2(\sum[5]_i_2_n_0 ),
        .I3(a_IBUF[5]),
        .I4(b_IBUF[5]),
        .O(\sum[7]_i_2_n_0 ));
  OBUF \sum_OBUF[0]_inst 
       (.I(sum_OBUF[0]),
        .O(sum[0]));
  OBUF \sum_OBUF[1]_inst 
       (.I(sum_OBUF[1]),
        .O(sum[1]));
  OBUF \sum_OBUF[2]_inst 
       (.I(sum_OBUF[2]),
        .O(sum[2]));
  OBUF \sum_OBUF[3]_inst 
       (.I(sum_OBUF[3]),
        .O(sum[3]));
  OBUF \sum_OBUF[4]_inst 
       (.I(sum_OBUF[4]),
        .O(sum[4]));
  OBUF \sum_OBUF[5]_inst 
       (.I(sum_OBUF[5]),
        .O(sum[5]));
  OBUF \sum_OBUF[6]_inst 
       (.I(sum_OBUF[6]),
        .O(sum[6]));
  OBUF \sum_OBUF[7]_inst 
       (.I(sum_OBUF[7]),
        .O(sum[7]));
  FDRE \sum_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in[0]),
        .Q(sum_OBUF[0]),
        .R(rst_IBUF));
  FDRE \sum_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in[1]),
        .Q(sum_OBUF[1]),
        .R(rst_IBUF));
  FDRE \sum_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in[2]),
        .Q(sum_OBUF[2]),
        .R(rst_IBUF));
  FDRE \sum_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in[3]),
        .Q(sum_OBUF[3]),
        .R(rst_IBUF));
  FDRE \sum_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in[4]),
        .Q(sum_OBUF[4]),
        .R(rst_IBUF));
  FDRE \sum_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in[5]),
        .Q(sum_OBUF[5]),
        .R(rst_IBUF));
  FDRE \sum_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in[6]),
        .Q(sum_OBUF[6]),
        .R(rst_IBUF));
  FDRE \sum_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(p_0_in[7]),
        .Q(sum_OBUF[7]),
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
