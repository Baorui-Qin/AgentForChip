// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Thu Sep 17 21:45:37 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/phase1-validation/p09-output-budget-20260917-v2/experiments/repair-45f27379-9272-46b5-80ad-2315025abcdd/eda/run-ArPjDy/build/.rtl-synth-7JrisC/netlist.v
// Design      : ready_valid_slot
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module ready_valid_slot
   (clk,
    rst,
    in_valid,
    in_data,
    in_ready,
    out_valid,
    out_data,
    out_ready);
  input clk;
  input rst;
  input in_valid;
  input [7:0]in_data;
  output in_ready;
  output out_valid;
  output [7:0]out_data;
  input out_ready;

  wire clk;
  wire clk_IBUF;
  wire clk_IBUF_BUFG;
  wire full00_out;
  wire full_i_1_n_0;
  wire [7:0]in_data;
  wire [7:0]in_data_IBUF;
  wire in_ready;
  wire in_ready_OBUF;
  wire in_valid;
  wire in_valid_IBUF;
  wire [7:0]out_data;
  wire [7:0]out_data_OBUF;
  wire out_ready;
  wire out_ready_IBUF;
  wire out_valid;
  wire out_valid_OBUF;
  wire rst;
  wire rst_IBUF;

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
  LUT3 #(
    .INIT(8'hA2)) 
    \data[7]_i_1 
       (.I0(in_valid_IBUF),
        .I1(out_valid_OBUF),
        .I2(out_ready_IBUF),
        .O(full00_out));
  FDRE \data_reg[0] 
       (.C(clk_IBUF_BUFG),
        .CE(full00_out),
        .D(in_data_IBUF[0]),
        .Q(out_data_OBUF[0]),
        .R(rst_IBUF));
  FDRE \data_reg[1] 
       (.C(clk_IBUF_BUFG),
        .CE(full00_out),
        .D(in_data_IBUF[1]),
        .Q(out_data_OBUF[1]),
        .R(rst_IBUF));
  FDRE \data_reg[2] 
       (.C(clk_IBUF_BUFG),
        .CE(full00_out),
        .D(in_data_IBUF[2]),
        .Q(out_data_OBUF[2]),
        .R(rst_IBUF));
  FDRE \data_reg[3] 
       (.C(clk_IBUF_BUFG),
        .CE(full00_out),
        .D(in_data_IBUF[3]),
        .Q(out_data_OBUF[3]),
        .R(rst_IBUF));
  FDRE \data_reg[4] 
       (.C(clk_IBUF_BUFG),
        .CE(full00_out),
        .D(in_data_IBUF[4]),
        .Q(out_data_OBUF[4]),
        .R(rst_IBUF));
  FDRE \data_reg[5] 
       (.C(clk_IBUF_BUFG),
        .CE(full00_out),
        .D(in_data_IBUF[5]),
        .Q(out_data_OBUF[5]),
        .R(rst_IBUF));
  FDRE \data_reg[6] 
       (.C(clk_IBUF_BUFG),
        .CE(full00_out),
        .D(in_data_IBUF[6]),
        .Q(out_data_OBUF[6]),
        .R(rst_IBUF));
  FDRE \data_reg[7] 
       (.C(clk_IBUF_BUFG),
        .CE(full00_out),
        .D(in_data_IBUF[7]),
        .Q(out_data_OBUF[7]),
        .R(rst_IBUF));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'h00AE)) 
    full_i_1
       (.I0(in_valid_IBUF),
        .I1(out_valid_OBUF),
        .I2(out_ready_IBUF),
        .I3(rst_IBUF),
        .O(full_i_1_n_0));
  FDRE full_reg
       (.C(clk_IBUF_BUFG),
        .CE(1'b1),
        .D(full_i_1_n_0),
        .Q(out_valid_OBUF),
        .R(1'b0));
  IBUF \in_data_IBUF[0]_inst 
       (.I(in_data[0]),
        .O(in_data_IBUF[0]));
  IBUF \in_data_IBUF[1]_inst 
       (.I(in_data[1]),
        .O(in_data_IBUF[1]));
  IBUF \in_data_IBUF[2]_inst 
       (.I(in_data[2]),
        .O(in_data_IBUF[2]));
  IBUF \in_data_IBUF[3]_inst 
       (.I(in_data[3]),
        .O(in_data_IBUF[3]));
  IBUF \in_data_IBUF[4]_inst 
       (.I(in_data[4]),
        .O(in_data_IBUF[4]));
  IBUF \in_data_IBUF[5]_inst 
       (.I(in_data[5]),
        .O(in_data_IBUF[5]));
  IBUF \in_data_IBUF[6]_inst 
       (.I(in_data[6]),
        .O(in_data_IBUF[6]));
  IBUF \in_data_IBUF[7]_inst 
       (.I(in_data[7]),
        .O(in_data_IBUF[7]));
  OBUF in_ready_OBUF_inst
       (.I(in_ready_OBUF),
        .O(in_ready));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'hB)) 
    in_ready_OBUF_inst_i_1
       (.I0(out_ready_IBUF),
        .I1(out_valid_OBUF),
        .O(in_ready_OBUF));
  IBUF in_valid_IBUF_inst
       (.I(in_valid),
        .O(in_valid_IBUF));
  OBUF \out_data_OBUF[0]_inst 
       (.I(out_data_OBUF[0]),
        .O(out_data[0]));
  OBUF \out_data_OBUF[1]_inst 
       (.I(out_data_OBUF[1]),
        .O(out_data[1]));
  OBUF \out_data_OBUF[2]_inst 
       (.I(out_data_OBUF[2]),
        .O(out_data[2]));
  OBUF \out_data_OBUF[3]_inst 
       (.I(out_data_OBUF[3]),
        .O(out_data[3]));
  OBUF \out_data_OBUF[4]_inst 
       (.I(out_data_OBUF[4]),
        .O(out_data[4]));
  OBUF \out_data_OBUF[5]_inst 
       (.I(out_data_OBUF[5]),
        .O(out_data[5]));
  OBUF \out_data_OBUF[6]_inst 
       (.I(out_data_OBUF[6]),
        .O(out_data[6]));
  OBUF \out_data_OBUF[7]_inst 
       (.I(out_data_OBUF[7]),
        .O(out_data[7]));
  IBUF out_ready_IBUF_inst
       (.I(out_ready),
        .O(out_ready_IBUF));
  OBUF out_valid_OBUF_inst
       (.I(out_valid_OBUF),
        .O(out_valid));
  IBUF rst_IBUF_inst
       (.I(rst),
        .O(rst_IBUF));
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
