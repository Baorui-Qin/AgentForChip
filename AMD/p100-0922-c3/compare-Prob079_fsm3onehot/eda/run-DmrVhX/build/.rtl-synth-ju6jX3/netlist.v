// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Tue Sep 22 22:05:54 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p100-0922-c3/compare-Prob079_fsm3onehot/eda/run-DmrVhX/build/.rtl-synth-ju6jX3/netlist.v
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
    out);
  input in;
  input [3:0]state;
  output [3:0]next_state;
  output out;

  wire in;
  wire in_IBUF;
  wire [3:0]next_state;
  wire [3:0]next_state_OBUF;
  wire out;
  wire out_OBUF;
  wire [3:0]state;
  wire [2:0]state_IBUF;

  IBUF in_IBUF_inst
       (.I(in),
        .O(in_IBUF));
  OBUF \next_state_OBUF[0]_inst 
       (.I(next_state_OBUF[0]),
        .O(next_state[0]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT3 #(
    .INIT(8'h0E)) 
    \next_state_OBUF[0]_inst_i_1 
       (.I0(state_IBUF[0]),
        .I1(state_IBUF[2]),
        .I2(in_IBUF),
        .O(next_state_OBUF[0]));
  OBUF \next_state_OBUF[1]_inst 
       (.I(next_state_OBUF[1]),
        .O(next_state[1]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'hAAA8)) 
    \next_state_OBUF[1]_inst_i_1 
       (.I0(in_IBUF),
        .I1(state_IBUF[0]),
        .I2(state_IBUF[1]),
        .I3(out_OBUF),
        .O(next_state_OBUF[1]));
  OBUF \next_state_OBUF[2]_inst 
       (.I(next_state_OBUF[2]),
        .O(next_state[2]));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'h0E)) 
    \next_state_OBUF[2]_inst_i_1 
       (.I0(out_OBUF),
        .I1(state_IBUF[1]),
        .I2(in_IBUF),
        .O(next_state_OBUF[2]));
  OBUF \next_state_OBUF[3]_inst 
       (.I(next_state_OBUF[3]),
        .O(next_state[3]));
  (* SOFT_HLUTNM = "soft_lutpair1" *) 
  LUT2 #(
    .INIT(4'h8)) 
    \next_state_OBUF[3]_inst_i_1 
       (.I0(in_IBUF),
        .I1(state_IBUF[2]),
        .O(next_state_OBUF[3]));
  OBUF out_OBUF_inst
       (.I(out_OBUF),
        .O(out));
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
        .O(out_OBUF));
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
