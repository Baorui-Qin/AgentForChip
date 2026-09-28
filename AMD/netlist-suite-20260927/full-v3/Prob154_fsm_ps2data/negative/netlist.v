// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 06:03:23 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob154_fsm_ps2data/eda/run-jC7Dtr/build/.rtl-synth-vYs5J6/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (clk,
    reset,
    in,
    out_bytes,
    done);
  input clk;
  input reset;
  input [7:0]in;
  output [23:0]out_bytes;
  output done;

  wire \FSM_onehot_count[0]_i_1_n_0 ;
  wire \FSM_onehot_count[2]_i_1_n_0 ;
  wire \FSM_onehot_count_reg_n_0_[0] ;
  wire \FSM_onehot_count_reg_n_0_[1] ;
  wire [0:0]byte1;
  wire [0:0]byte2;
  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire [0:0]count;
  wire done;
  wire done_OBUF;
  wire done_i_1_n_0;
  wire [7:0]in;
  wire [7:0]in_IBUF;
  wire [23:0]out_bytes;
  wire \out_bytes[23]_i_1_n_0 ;
  wire [23:0]out_bytes_OBUF;
  wire [23:8]p_1_in;
  wire reset;
  wire reset_IBUF;

  LUT2 #(
    .INIT(4'h1)) 
    \FSM_onehot_count[0]_i_1 
       (.I0(\FSM_onehot_count_reg_n_0_[0] ),
        .I1(\FSM_onehot_count_reg_n_0_[1] ),
        .O(\FSM_onehot_count[0]_i_1_n_0 ));
  LUT4 #(
    .INIT(16'hFEAE)) 
    \FSM_onehot_count[2]_i_1 
       (.I0(\FSM_onehot_count_reg_n_0_[1] ),
        .I1(count),
        .I2(\FSM_onehot_count_reg_n_0_[0] ),
        .I3(in_IBUF[3]),
        .O(\FSM_onehot_count[2]_i_1_n_0 ));
  (* FSM_ENCODED_STATES = "iSTATE:100,iSTATE0:001,iSTATE1:010," *) 
  FDSE #(
    .INIT(1'b1)) 
    \FSM_onehot_count_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_count[2]_i_1_n_0 ),
        .D(\FSM_onehot_count[0]_i_1_n_0 ),
        .Q(\FSM_onehot_count_reg_n_0_[0] ),
        .S(reset_IBUF));
  (* FSM_ENCODED_STATES = "iSTATE:100,iSTATE0:001,iSTATE1:010," *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_count_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_count[2]_i_1_n_0 ),
        .D(\FSM_onehot_count_reg_n_0_[0] ),
        .Q(\FSM_onehot_count_reg_n_0_[1] ),
        .R(reset_IBUF));
  (* FSM_ENCODED_STATES = "iSTATE:100,iSTATE0:001,iSTATE1:010," *) 
  FDRE #(
    .INIT(1'b0)) 
    \FSM_onehot_count_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\FSM_onehot_count[2]_i_1_n_0 ),
        .D(\FSM_onehot_count_reg_n_0_[1] ),
        .Q(count),
        .R(reset_IBUF));
  LUT2 #(
    .INIT(4'h8)) 
    \byte1[7]_i_1 
       (.I0(\FSM_onehot_count_reg_n_0_[0] ),
        .I1(in_IBUF[3]),
        .O(byte1));
  FDRE \byte1_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(byte1),
        .D(in_IBUF[0]),
        .Q(p_1_in[16]),
        .R(reset_IBUF));
  FDRE \byte1_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(byte1),
        .D(in_IBUF[1]),
        .Q(p_1_in[17]),
        .R(reset_IBUF));
  FDRE \byte1_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(byte1),
        .D(in_IBUF[2]),
        .Q(p_1_in[18]),
        .R(reset_IBUF));
  FDRE \byte1_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(byte1),
        .D(in_IBUF[3]),
        .Q(p_1_in[19]),
        .R(reset_IBUF));
  FDRE \byte1_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(byte1),
        .D(in_IBUF[4]),
        .Q(p_1_in[20]),
        .R(reset_IBUF));
  FDRE \byte1_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(byte1),
        .D(in_IBUF[5]),
        .Q(p_1_in[21]),
        .R(reset_IBUF));
  FDRE \byte1_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(byte1),
        .D(in_IBUF[6]),
        .Q(p_1_in[22]),
        .R(reset_IBUF));
  FDRE \byte1_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(byte1),
        .D(in_IBUF[7]),
        .Q(p_1_in[23]),
        .R(reset_IBUF));
  LUT2 #(
    .INIT(4'h2)) 
    \byte2[7]_i_1 
       (.I0(\FSM_onehot_count_reg_n_0_[1] ),
        .I1(\FSM_onehot_count_reg_n_0_[0] ),
        .O(byte2));
  FDRE \byte2_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(byte2),
        .D(in_IBUF[0]),
        .Q(p_1_in[8]),
        .R(reset_IBUF));
  FDRE \byte2_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(byte2),
        .D(in_IBUF[1]),
        .Q(p_1_in[9]),
        .R(reset_IBUF));
  FDRE \byte2_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(byte2),
        .D(in_IBUF[2]),
        .Q(p_1_in[10]),
        .R(reset_IBUF));
  FDRE \byte2_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(byte2),
        .D(in_IBUF[3]),
        .Q(p_1_in[11]),
        .R(reset_IBUF));
  FDRE \byte2_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(byte2),
        .D(in_IBUF[4]),
        .Q(p_1_in[12]),
        .R(reset_IBUF));
  FDRE \byte2_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(byte2),
        .D(in_IBUF[5]),
        .Q(p_1_in[13]),
        .R(reset_IBUF));
  FDRE \byte2_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(byte2),
        .D(in_IBUF[6]),
        .Q(p_1_in[14]),
        .R(reset_IBUF));
  FDRE \byte2_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(byte2),
        .D(in_IBUF[7]),
        .Q(p_1_in[15]),
        .R(reset_IBUF));
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
  OBUF done_OBUF_inst
       (.I(done_OBUF),
        .O(done));
  LUT3 #(
    .INIT(8'hFE)) 
    done_i_1
       (.I0(reset_IBUF),
        .I1(\FSM_onehot_count_reg_n_0_[0] ),
        .I2(\FSM_onehot_count_reg_n_0_[1] ),
        .O(done_i_1_n_0));
  FDRE done_reg
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(count),
        .Q(done_OBUF),
        .R(done_i_1_n_0));
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
  LUT3 #(
    .INIT(8'h02)) 
    \out_bytes[23]_i_1 
       (.I0(count),
        .I1(\FSM_onehot_count_reg_n_0_[0] ),
        .I2(\FSM_onehot_count_reg_n_0_[1] ),
        .O(\out_bytes[23]_i_1_n_0 ));
  OBUF \out_bytes_OBUF[0]_inst 
       (.I(out_bytes_OBUF[0]),
        .O(out_bytes[0]));
  OBUF \out_bytes_OBUF[10]_inst 
       (.I(out_bytes_OBUF[10]),
        .O(out_bytes[10]));
  OBUF \out_bytes_OBUF[11]_inst 
       (.I(out_bytes_OBUF[11]),
        .O(out_bytes[11]));
  OBUF \out_bytes_OBUF[12]_inst 
       (.I(out_bytes_OBUF[12]),
        .O(out_bytes[12]));
  OBUF \out_bytes_OBUF[13]_inst 
       (.I(out_bytes_OBUF[13]),
        .O(out_bytes[13]));
  OBUF \out_bytes_OBUF[14]_inst 
       (.I(out_bytes_OBUF[14]),
        .O(out_bytes[14]));
  OBUF \out_bytes_OBUF[15]_inst 
       (.I(out_bytes_OBUF[15]),
        .O(out_bytes[15]));
  OBUF \out_bytes_OBUF[16]_inst 
       (.I(out_bytes_OBUF[16]),
        .O(out_bytes[16]));
  OBUF \out_bytes_OBUF[17]_inst 
       (.I(out_bytes_OBUF[17]),
        .O(out_bytes[17]));
  OBUF \out_bytes_OBUF[18]_inst 
       (.I(out_bytes_OBUF[18]),
        .O(out_bytes[18]));
  OBUF \out_bytes_OBUF[19]_inst 
       (.I(out_bytes_OBUF[19]),
        .O(out_bytes[19]));
  OBUF \out_bytes_OBUF[1]_inst 
       (.I(out_bytes_OBUF[1]),
        .O(out_bytes[1]));
  OBUF \out_bytes_OBUF[20]_inst 
       (.I(out_bytes_OBUF[20]),
        .O(out_bytes[20]));
  OBUF \out_bytes_OBUF[21]_inst 
       (.I(out_bytes_OBUF[21]),
        .O(out_bytes[21]));
  OBUF \out_bytes_OBUF[22]_inst 
       (.I(out_bytes_OBUF[22]),
        .O(out_bytes[22]));
  OBUF \out_bytes_OBUF[23]_inst 
       (.I(out_bytes_OBUF[23]),
        .O(out_bytes[23]));
  OBUF \out_bytes_OBUF[2]_inst 
       (.I(out_bytes_OBUF[2]),
        .O(out_bytes[2]));
  OBUF \out_bytes_OBUF[3]_inst 
       (.I(out_bytes_OBUF[3]),
        .O(out_bytes[3]));
  OBUF \out_bytes_OBUF[4]_inst 
       (.I(out_bytes_OBUF[4]),
        .O(out_bytes[4]));
  OBUF \out_bytes_OBUF[5]_inst 
       (.I(out_bytes_OBUF[5]),
        .O(out_bytes[5]));
  OBUF \out_bytes_OBUF[6]_inst 
       (.I(out_bytes_OBUF[6]),
        .O(out_bytes[6]));
  OBUF \out_bytes_OBUF[7]_inst 
       (.I(out_bytes_OBUF[7]),
        .O(out_bytes[7]));
  OBUF \out_bytes_OBUF[8]_inst 
       (.I(out_bytes_OBUF[8]),
        .O(out_bytes[8]));
  OBUF \out_bytes_OBUF[9]_inst 
       (.I(out_bytes_OBUF[9]),
        .O(out_bytes[9]));
  FDRE \out_bytes_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(in_IBUF[0]),
        .Q(out_bytes_OBUF[0]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[10] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[10]),
        .Q(out_bytes_OBUF[10]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[11] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[11]),
        .Q(out_bytes_OBUF[11]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[12] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[12]),
        .Q(out_bytes_OBUF[12]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[13] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[13]),
        .Q(out_bytes_OBUF[13]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[14] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[14]),
        .Q(out_bytes_OBUF[14]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[15] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[15]),
        .Q(out_bytes_OBUF[15]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[16] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[16]),
        .Q(out_bytes_OBUF[16]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[17] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[17]),
        .Q(out_bytes_OBUF[17]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[18] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[18]),
        .Q(out_bytes_OBUF[18]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[19] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[19]),
        .Q(out_bytes_OBUF[19]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(in_IBUF[1]),
        .Q(out_bytes_OBUF[1]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[20] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[20]),
        .Q(out_bytes_OBUF[20]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[21] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[21]),
        .Q(out_bytes_OBUF[21]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[22] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[22]),
        .Q(out_bytes_OBUF[22]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[23] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[23]),
        .Q(out_bytes_OBUF[23]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(in_IBUF[2]),
        .Q(out_bytes_OBUF[2]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(in_IBUF[3]),
        .Q(out_bytes_OBUF[3]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(in_IBUF[4]),
        .Q(out_bytes_OBUF[4]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(in_IBUF[5]),
        .Q(out_bytes_OBUF[5]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(in_IBUF[6]),
        .Q(out_bytes_OBUF[6]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(in_IBUF[7]),
        .Q(out_bytes_OBUF[7]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[8] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[8]),
        .Q(out_bytes_OBUF[8]),
        .R(reset_IBUF));
  FDRE \out_bytes_reg[9] 
       (.C(clk_IBUF_BUFG),
        .CE(\out_bytes[23]_i_1_n_0 ),
        .D(p_1_in[9]),
        .Q(out_bytes_OBUF[9]),
        .R(reset_IBUF));
  IBUF reset_IBUF_inst
       (.I(reset),
        .O(reset_IBUF));
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
