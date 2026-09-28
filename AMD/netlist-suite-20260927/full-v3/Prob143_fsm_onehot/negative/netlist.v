// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 05:40:38 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob143_fsm_onehot/eda/run-hHmDJL/build/.rtl-synth-AdIO6u/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (in,
    state,
    next_state,
    out1,
    out2);
  input in;
  input [9:0]state;
  output [9:0]next_state;
  output out1;
  output out2;

  wire in;
  wire in_IBUF;
  wire [9:0]next_state;
  wire [9:0]next_state_OBUF;
  wire \next_state_OBUF[0]_inst_i_2_n_0 ;
  wire out1;
  wire out1_OBUF;
  wire out2;
  wire out2_OBUF;
  wire [9:0]state;
  wire [9:0]state_IBUF;

  IBUF in_IBUF_inst
       (.I(in),
        .O(in_IBUF));
  OBUF \next_state_OBUF[0]_inst 
       (.I(next_state_OBUF[0]),
        .O(next_state[0]));
  LUT6 #(
    .INIT(64'h00000000FFFFFFFE)) 
    \next_state_OBUF[0]_inst_i_1 
       (.I0(\next_state_OBUF[0]_inst_i_2_n_0 ),
        .I1(state_IBUF[9]),
        .I2(state_IBUF[8]),
        .I3(state_IBUF[7]),
        .I4(state_IBUF[4]),
        .I5(in_IBUF),
        .O(next_state_OBUF[0]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT4 #(
    .INIT(16'hFFFE)) 
    \next_state_OBUF[0]_inst_i_2 
       (.I0(state_IBUF[1]),
        .I1(state_IBUF[2]),
        .I2(state_IBUF[0]),
        .I3(state_IBUF[3]),
        .O(\next_state_OBUF[0]_inst_i_2_n_0 ));
  OBUF \next_state_OBUF[1]_inst 
       (.I(next_state_OBUF[1]),
        .O(next_state[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'hAAA8)) 
    \next_state_OBUF[1]_inst_i_1 
       (.I0(in_IBUF),
        .I1(state_IBUF[0]),
        .I2(state_IBUF[8]),
        .I3(state_IBUF[9]),
        .O(next_state_OBUF[1]));
  OBUF \next_state_OBUF[2]_inst 
       (.I(next_state_OBUF[2]),
        .O(next_state[2]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \next_state_OBUF[2]_inst_i_1 
       (.I0(in_IBUF),
        .I1(state_IBUF[1]),
        .O(next_state_OBUF[2]));
  OBUF \next_state_OBUF[3]_inst 
       (.I(next_state_OBUF[3]),
        .O(next_state[3]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \next_state_OBUF[3]_inst_i_1 
       (.I0(in_IBUF),
        .I1(state_IBUF[2]),
        .O(next_state_OBUF[3]));
  OBUF \next_state_OBUF[4]_inst 
       (.I(next_state_OBUF[4]),
        .O(next_state[4]));
  (* SOFT_HLUTNM = "soft_lutpair3" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \next_state_OBUF[4]_inst_i_1 
       (.I0(in_IBUF),
        .I1(state_IBUF[3]),
        .O(next_state_OBUF[4]));
  OBUF \next_state_OBUF[5]_inst 
       (.I(next_state_OBUF[5]),
        .O(next_state[5]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \next_state_OBUF[5]_inst_i_1 
       (.I0(in_IBUF),
        .I1(state_IBUF[4]),
        .O(next_state_OBUF[5]));
  OBUF \next_state_OBUF[6]_inst 
       (.I(next_state_OBUF[6]),
        .O(next_state[6]));
  (* SOFT_HLUTNM = "soft_lutpair4" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \next_state_OBUF[6]_inst_i_1 
       (.I0(in_IBUF),
        .I1(state_IBUF[5]),
        .O(next_state_OBUF[6]));
  OBUF \next_state_OBUF[7]_inst 
       (.I(next_state_OBUF[7]),
        .O(next_state[7]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT3 #(
    .INIT(8'hA8)) 
    \next_state_OBUF[7]_inst_i_1 
       (.I0(in_IBUF),
        .I1(state_IBUF[6]),
        .I2(state_IBUF[7]),
        .O(next_state_OBUF[7]));
  OBUF \next_state_OBUF[8]_inst 
       (.I(next_state_OBUF[8]),
        .O(next_state[8]));
  LUT2 #(
    .INIT(4'h2)) 
    \next_state_OBUF[8]_inst_i_1 
       (.I0(state_IBUF[5]),
        .I1(in_IBUF),
        .O(next_state_OBUF[8]));
  OBUF \next_state_OBUF[9]_inst 
       (.I(next_state_OBUF[9]),
        .O(next_state[9]));
  (* SOFT_HLUTNM = "soft_lutpair2" *) 
  LUT2 #(
    .INIT(4'h2)) 
    \next_state_OBUF[9]_inst_i_1 
       (.I0(state_IBUF[6]),
        .I1(in_IBUF),
        .O(next_state_OBUF[9]));
  OBUF out1_OBUF_inst
       (.I(out1_OBUF),
        .O(out1));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'hE)) 
    out1_OBUF_inst_i_1
       (.I0(state_IBUF[8]),
        .I1(state_IBUF[9]),
        .O(out1_OBUF));
  OBUF out2_OBUF_inst
       (.I(out2_OBUF),
        .O(out2));
  LUT2 #(
    .INIT(4'hE)) 
    out2_OBUF_inst_i_1
       (.I0(state_IBUF[9]),
        .I1(state_IBUF[7]),
        .O(out2_OBUF));
  IBUF \state_IBUF[0]_inst 
       (.I(state[0]),
        .O(state_IBUF[0]));
  IBUF \state_IBUF[1]_inst 
       (.I(state[1]),
        .O(state_IBUF[1]));
  IBUF \state_IBUF[2]_inst 
       (.I(state[2]),
        .O(state_IBUF[2]));
  IBUF \state_IBUF[3]_inst 
       (.I(state[3]),
        .O(state_IBUF[3]));
  IBUF \state_IBUF[4]_inst 
       (.I(state[4]),
        .O(state_IBUF[4]));
  IBUF \state_IBUF[5]_inst 
       (.I(state[5]),
        .O(state_IBUF[5]));
  IBUF \state_IBUF[6]_inst 
       (.I(state[6]),
        .O(state_IBUF[6]));
  IBUF \state_IBUF[7]_inst 
       (.I(state[7]),
        .O(state_IBUF[7]));
  IBUF \state_IBUF[8]_inst 
       (.I(state[8]),
        .O(state_IBUF[8]));
  IBUF \state_IBUF[9]_inst 
       (.I(state[9]),
        .O(state_IBUF[9]));
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
