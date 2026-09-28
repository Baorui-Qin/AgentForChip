// Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
// Copyright 2022-2025 Advanced Micro Devices, Inc. All Rights Reserved.
// --------------------------------------------------------------------------------
// Tool Version: Vivado v.2025.2 (win64) Build 6299465 Fri Nov 14 19:35:11 GMT 2025
// Date        : Wed Sep 23 04:27:52 2026
// Host        : LAPTOP-80TO9JDN running 64-bit major release  (build 9200)
// Command     : write_verilog -force -mode funcsim
//               D:/AMD/p156-0923-v1/compare-Prob072_thermostat/eda/run-wyHMHJ/build/.rtl-synth-Gi45cf/netlist.v
// Design      : TopModule
// Purpose     : This verilog netlist is a functional simulation representation of the design and should not be modified
//               or synthesized. This netlist cannot be used for SDF annotated simulation.
// Device      : xczu3eg-sbva484-1-e
// --------------------------------------------------------------------------------
`timescale 1 ps / 1 ps

(* NotValidForBitStream *)
module TopModule
   (mode,
    too_cold,
    too_hot,
    fan_on,
    heater,
    aircon,
    fan);
  input mode;
  input too_cold;
  input too_hot;
  input fan_on;
  output heater;
  output aircon;
  output fan;

  wire aircon;
  wire aircon_OBUF;
  wire fan;
  wire fan_OBUF;
  wire fan_on;
  wire fan_on_IBUF;
  wire heater;
  wire heater_OBUF;
  wire mode;
  wire mode_IBUF;
  wire too_cold;
  wire too_cold_IBUF;
  wire too_hot;
  wire too_hot_IBUF;

  OBUF aircon_OBUF_inst
       (.I(aircon_OBUF),
        .O(aircon));
  LUT2 #(
    .INIT(4'h2)) 
    aircon_OBUF_inst_i_1
       (.I0(too_hot_IBUF),
        .I1(mode_IBUF),
        .O(aircon_OBUF));
  OBUF fan_OBUF_inst
       (.I(fan_OBUF),
        .O(fan));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT4 #(
    .INIT(16'hFFAC)) 
    fan_OBUF_inst_i_1
       (.I0(too_cold_IBUF),
        .I1(too_hot_IBUF),
        .I2(mode_IBUF),
        .I3(fan_on_IBUF),
        .O(fan_OBUF));
  IBUF fan_on_IBUF_inst
       (.I(fan_on),
        .O(fan_on_IBUF));
  OBUF heater_OBUF_inst
       (.I(heater_OBUF),
        .O(heater));
  (* SOFT_HLUTNM = "soft_lutpair0" *) 
  LUT2 #(
    .INIT(4'h8)) 
    heater_OBUF_inst_i_1
       (.I0(mode_IBUF),
        .I1(too_cold_IBUF),
        .O(heater_OBUF));
  IBUF mode_IBUF_inst
       (.I(mode),
        .O(mode_IBUF));
  IBUF too_cold_IBUF_inst
       (.I(too_cold),
        .O(too_cold_IBUF));
  IBUF too_hot_IBUF_inst
       (.I(too_hot),
        .O(too_hot_IBUF));
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
