// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Sun Sep 27 22:49:18 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-20260927-v3/compare-Prob080_timer/eda/run-Mv0tMw/build/.rtl-synth-jclYnA/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (clk,
    load,
    data,
    tc);
  input clk;
  input load;
  input [9:0]data;
  output tc;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire \count[5]_i_2_n_0 ;
  wire \count[9]_i_1_n_0 ;
  wire \count[9]_i_3_n_0 ;
  wire [9:0]count_reg;
  wire [9:0]data;
  wire [9:0]data_IBUF;
  wire load;
  wire load_IBUF;
  wire [9:0]p_0_in;
  wire tc;
  wire tc_OBUF;
  wire tc_OBUF_inst_i_2_n_0;

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
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'h8B)) 
    \count[0]_i_1 
       (.I0(data_IBUF[0]),
        .I1(load_IBUF),
        .I2(count_reg[0]),
        .O(p_0_in[0]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'hB88B)) 
    \count[1]_i_1 
       (.I0(data_IBUF[1]),
        .I1(load_IBUF),
        .I2(count_reg[0]),
        .I3(count_reg[1]),
        .O(p_0_in[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT5 #(
    .INIT(32'hBBB8888B)) 
    \count[2]_i_1 
       (.I0(data_IBUF[2]),
        .I1(load_IBUF),
        .I2(count_reg[0]),
        .I3(count_reg[1]),
        .I4(count_reg[2]),
        .O(p_0_in[2]));
  LUT6 #(
    .INIT(64'hBBBBBBB88888888B)) 
    \count[3]_i_1 
       (.I0(data_IBUF[3]),
        .I1(load_IBUF),
        .I2(count_reg[2]),
        .I3(count_reg[1]),
        .I4(count_reg[0]),
        .I5(count_reg[3]),
        .O(p_0_in[3]));
  LUT5 #(
    .INIT(32'hB8B8B88B)) 
    \count[4]_i_1 
       (.I0(data_IBUF[4]),
        .I1(load_IBUF),
        .I2(count_reg[4]),
        .I3(\count[5]_i_2_n_0 ),
        .I4(count_reg[3]),
        .O(p_0_in[4]));
  LUT6 #(
    .INIT(64'hB8B8B8B8B8B8B88B)) 
    \count[5]_i_1 
       (.I0(data_IBUF[5]),
        .I1(load_IBUF),
        .I2(count_reg[5]),
        .I3(count_reg[3]),
        .I4(count_reg[4]),
        .I5(\count[5]_i_2_n_0 ),
        .O(p_0_in[5]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hFE)) 
    \count[5]_i_2 
       (.I0(count_reg[2]),
        .I1(count_reg[1]),
        .I2(count_reg[0]),
        .O(\count[5]_i_2_n_0 ));
  LUT4 #(
    .INIT(16'h8BB8)) 
    \count[6]_i_1 
       (.I0(data_IBUF[6]),
        .I1(load_IBUF),
        .I2(count_reg[6]),
        .I3(tc_OBUF_inst_i_2_n_0),
        .O(p_0_in[6]));
  LUT5 #(
    .INIT(32'hB88BB8B8)) 
    \count[7]_i_1 
       (.I0(data_IBUF[7]),
        .I1(load_IBUF),
        .I2(count_reg[7]),
        .I3(count_reg[6]),
        .I4(tc_OBUF_inst_i_2_n_0),
        .O(p_0_in[7]));
  LUT6 #(
    .INIT(64'hB8B8B8B8B88BB8B8)) 
    \count[8]_i_1 
       (.I0(data_IBUF[8]),
        .I1(load_IBUF),
        .I2(count_reg[8]),
        .I3(count_reg[7]),
        .I4(tc_OBUF_inst_i_2_n_0),
        .I5(count_reg[6]),
        .O(p_0_in[8]));
  LUT6 #(
    .INIT(64'hFFFFFFFFFFFFFEFF)) 
    \count[9]_i_1 
       (.I0(load_IBUF),
        .I1(count_reg[9]),
        .I2(count_reg[7]),
        .I3(tc_OBUF_inst_i_2_n_0),
        .I4(count_reg[6]),
        .I5(count_reg[8]),
        .O(\count[9]_i_1_n_0 ));
  LUT5 #(
    .INIT(32'hB88BB8B8)) 
    \count[9]_i_2 
       (.I0(data_IBUF[9]),
        .I1(load_IBUF),
        .I2(count_reg[9]),
        .I3(count_reg[8]),
        .I4(\count[9]_i_3_n_0 ),
        .O(p_0_in[9]));
  LUT6 #(
    .INIT(64'h0000000000000001)) 
    \count[9]_i_3 
       (.I0(count_reg[6]),
        .I1(count_reg[3]),
        .I2(count_reg[4]),
        .I3(\count[5]_i_2_n_0 ),
        .I4(count_reg[5]),
        .I5(count_reg[7]),
        .O(\count[9]_i_3_n_0 ));
  FDRE \count_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[0]),
        .Q(count_reg[0]),
        .R(1'b0));
  FDRE \count_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[1]),
        .Q(count_reg[1]),
        .R(1'b0));
  FDRE \count_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[2]),
        .Q(count_reg[2]),
        .R(1'b0));
  FDRE \count_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[3]),
        .Q(count_reg[3]),
        .R(1'b0));
  FDRE \count_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[4]),
        .Q(count_reg[4]),
        .R(1'b0));
  FDRE \count_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[5]),
        .Q(count_reg[5]),
        .R(1'b0));
  FDRE \count_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[6]),
        .Q(count_reg[6]),
        .R(1'b0));
  FDRE \count_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[7]),
        .Q(count_reg[7]),
        .R(1'b0));
  FDRE \count_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[8]),
        .Q(count_reg[8]),
        .R(1'b0));
  FDRE \count_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(\count[9]_i_1_n_0 ),
        .D(p_0_in[9]),
        .Q(count_reg[9]),
        .R(1'b0));
  IBUF \data_IBUF[0]_inst 
       (.I(data[0]),
        .O(data_IBUF[0]));
  IBUF \data_IBUF[1]_inst 
       (.I(data[1]),
        .O(data_IBUF[1]));
  IBUF \data_IBUF[2]_inst 
       (.I(data[2]),
        .O(data_IBUF[2]));
  IBUF \data_IBUF[3]_inst 
       (.I(data[3]),
        .O(data_IBUF[3]));
  IBUF \data_IBUF[4]_inst 
       (.I(data[4]),
        .O(data_IBUF[4]));
  IBUF \data_IBUF[5]_inst 
       (.I(data[5]),
        .O(data_IBUF[5]));
  IBUF \data_IBUF[6]_inst 
       (.I(data[6]),
        .O(data_IBUF[6]));
  IBUF \data_IBUF[7]_inst 
       (.I(data[7]),
        .O(data_IBUF[7]));
  IBUF \data_IBUF[8]_inst 
       (.I(data[8]),
        .O(data_IBUF[8]));
  IBUF \data_IBUF[9]_inst 
       (.I(data[9]),
        .O(data_IBUF[9]));
  IBUF load_IBUF_inst
       (.I(load),
        .O(load_IBUF));
  OBUF tc_OBUF_inst
       (.I(tc_OBUF),
        .O(tc));
  LUT5 #(
    .INIT(32'h00000010)) 
    tc_OBUF_inst_i_1
       (.I0(count_reg[8]),
        .I1(count_reg[6]),
        .I2(tc_OBUF_inst_i_2_n_0),
        .I3(count_reg[7]),
        .I4(count_reg[9]),
        .O(tc_OBUF));
  LUT6 #(
    .INIT(64'h0000000000000001)) 
    tc_OBUF_inst_i_2
       (.I0(count_reg[3]),
        .I1(count_reg[4]),
        .I2(count_reg[2]),
        .I3(count_reg[1]),
        .I4(count_reg[0]),
        .I5(count_reg[5]),
        .O(tc_OBUF_inst_i_2_n_0));
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
