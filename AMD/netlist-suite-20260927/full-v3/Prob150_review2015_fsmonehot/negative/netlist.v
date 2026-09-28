// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 05:50:03 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob150_review2015_fsmonehot/eda/run-LYm7Lx/build/.rtl-synth-i4p3zL/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (d,
    done_counting,
    ack,
    state,
    B3_next,
    S_next,
    S1_next,
    Count_next,
    Wait_next,
    done,
    counting,
    shift_ena);
  input d;
  input done_counting;
  input ack;
  input [9:0]state;
  output B3_next;
  output S_next;
  output S1_next;
  output Count_next;
  output Wait_next;
  output done;
  output counting;
  output shift_ena;

  wire B3_next;
  wire B3_next_OBUF;
  wire Count_next;
  wire Count_next_OBUF;
  wire S1_next;
  wire S1_next_OBUF;
  wire S_next;
  wire S_next_OBUF;
  wire Wait_next;
  wire Wait_next_OBUF;
  wire ack;
  wire ack_IBUF;
  wire counting;
  wire counting_OBUF;
  wire d;
  wire d_IBUF;
  wire done;
  wire done_OBUF;
  wire done_counting;
  wire done_counting_IBUF;
  wire shift_ena;
  wire shift_ena_OBUF;
  wire [9:0]state;
  wire [7:0]state_IBUF;

  OBUF B3_next_OBUF_inst
       (.I(B3_next_OBUF),
        .O(B3_next));
  OBUF Count_next_OBUF_inst
       (.I(Count_next_OBUF),
        .O(Count_next));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT3 #(
    .INIT(8'hBA)) 
    Count_next_OBUF_inst_i_1
       (.I0(state_IBUF[7]),
        .I1(done_counting_IBUF),
        .I2(counting_OBUF),
        .O(Count_next_OBUF));
  OBUF S1_next_OBUF_inst
       (.I(S1_next_OBUF),
        .O(S1_next));
  LUT2 #(
    .INIT(4'h8)) 
    S1_next_OBUF_inst_i_1
       (.I0(state_IBUF[0]),
        .I1(d_IBUF),
        .O(S1_next_OBUF));
  OBUF S_next_OBUF_inst
       (.I(S_next_OBUF),
        .O(S_next));
  LUT6 #(
    .INIT(64'h8888FFFF8888FFF8)) 
    S_next_OBUF_inst_i_1
       (.I0(done_OBUF),
        .I1(ack_IBUF),
        .I2(state_IBUF[0]),
        .I3(state_IBUF[1]),
        .I4(d_IBUF),
        .I5(state_IBUF[3]),
        .O(S_next_OBUF));
  OBUF Wait_next_OBUF_inst
       (.I(Wait_next_OBUF),
        .O(Wait_next));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h8F88)) 
    Wait_next_OBUF_inst_i_1
       (.I0(done_counting_IBUF),
        .I1(counting_OBUF),
        .I2(ack_IBUF),
        .I3(done_OBUF),
        .O(Wait_next_OBUF));
  IBUF ack_IBUF_inst
       (.I(ack),
        .O(ack_IBUF));
  OBUF counting_OBUF_inst
       (.I(counting_OBUF),
        .O(counting));
  IBUF d_IBUF_inst
       (.I(d),
        .O(d_IBUF));
  OBUF done_OBUF_inst
       (.I(done_OBUF),
        .O(done));
  IBUF done_counting_IBUF_inst
       (.I(done_counting),
        .O(done_counting_IBUF));
  OBUF shift_ena_OBUF_inst
       (.I(shift_ena_OBUF),
        .O(shift_ena));
  LUT4 #(
    .INIT(16'hFFFE)) 
    shift_ena_OBUF_inst_i_1
       (.I0(state_IBUF[7]),
        .I1(state_IBUF[4]),
        .I2(state_IBUF[5]),
        .I3(B3_next_OBUF),
        .O(shift_ena_OBUF));
  IBUF \state_IBUF[0]_inst 
       (.I(state[0]),
        .O(state_IBUF[0]));
  IBUF \state_IBUF[1]_inst 
       (.I(state[1]),
        .O(state_IBUF[1]));
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
        .O(B3_next_OBUF));
  IBUF \state_IBUF[7]_inst 
       (.I(state[7]),
        .O(state_IBUF[7]));
  IBUF \state_IBUF[8]_inst 
       (.I(state[8]),
        .O(counting_OBUF));
  IBUF \state_IBUF[9]_inst 
       (.I(state[9]),
        .O(done_OBUF));
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
