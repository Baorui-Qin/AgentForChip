/** Generated calibrated VerilogEval oracles. NVIDIA MIT notice: ../../phase1/p10/VERILOGEVAL-LICENSE. @module rtl-tools/phase1/p10-netlist-calibrated */
import type { NetlistProfile } from './p10-netlist-profiles.ts'

/** Only positive and negative real-tool controls can publish an enabled oracle. */
export const calibratedNetlistProfiles: Record<string, NetlistProfile> = {
  "Prob001_zero": {
    "id": "verilogeval-netlist-settled-v2:Prob001_zero",
    "spec_sha256": "384884c02ec4c6f9e150d0414ab83978eea0d55e5e4ebfec315f3b41ddab2b71",
    "checks": 39,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\twavedrom_start(\"Output should 0\");\r\n\t\trepeat(20) @(posedge clk, negedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  output zero\r\n);\r\n\r\n  assign zero = 1'b0;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\n\nwire gold_zero, dut_zero, raw_dut_zero; reg seen_zero='0;\nstimulus_gen stim1(.clk(clk),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.zero(gold_zero));\nTopModule dut(.zero(raw_dut_zero));\nassign dut_zero=raw_dut_zero;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_zero === 1'b0 || gold_zero === 1'b1) begin\nknown=1; seen_zero=1'b1;\nif(dut_zero !== gold_zero) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_zero) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:zero\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob001_zero_prompt.txt": "384884c02ec4c6f9e150d0414ab83978eea0d55e5e4ebfec315f3b41ddab2b71",
        "dataset_spec-to-rtl/Prob001_zero_ref.sv": "9e4ed373de888786609cc3dfd4ff1a6a6708392562a5aabf5b8a8eca07a0c424",
        "dataset_spec-to-rtl/Prob001_zero_test.sv": "ef34c89cb59c0429db243a844263fcf809f87d869b0ccf7de5fc8358268c4e82"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob002_m2014_q4i": {
    "id": "verilogeval-netlist-settled-v2:Prob002_m2014_q4i",
    "spec_sha256": "144731a1b7788e9db5ae3638edd6b4f174221ade9663902dafe4825941e45978",
    "checks": 199,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\nmodule stimulus_gen (\r\n\tinput clk\r\n);\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  output out\r\n);\r\n\r\n  assign out = 1'b0;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\n\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk));\noracle_RefModule gold(.out(gold_out));\nTopModule dut(.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob002_m2014_q4i_prompt.txt": "144731a1b7788e9db5ae3638edd6b4f174221ade9663902dafe4825941e45978",
        "dataset_spec-to-rtl/Prob002_m2014_q4i_ref.sv": "14a9b19bc079481f055ed82d49130d87c175ae4aa8816f66d20ba2de15e792aa",
        "dataset_spec-to-rtl/Prob002_m2014_q4i_test.sv": "c462dfdaaf52846a043cf8638aa388f07cd738944ed5aecd8f2fc79c5ef87638"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob003_step_one": {
    "id": "verilogeval-netlist-settled-v2:Prob003_step_one",
    "spec_sha256": "cf2eb95d8cd5a796e89e9a9f61ef2a9ff83ed5e27d61eb9f88155627612b2750",
    "checks": 39,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\twavedrom_start(\"Output should be 1\");\r\n\t\trepeat(20) @(posedge clk, negedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  output one\r\n);\r\n\r\n  assign one = 1'b1;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\n\nwire gold_one, dut_one, raw_dut_one; reg seen_one='0;\nstimulus_gen stim1(.clk(clk),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.one(gold_one));\nTopModule dut(.one(raw_dut_one));\nassign dut_one=raw_dut_one;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_one === 1'b0 || gold_one === 1'b1) begin\nknown=1; seen_one=1'b1;\nif(dut_one !== gold_one) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_one) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:one\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob003_step_one_prompt.txt": "cf2eb95d8cd5a796e89e9a9f61ef2a9ff83ed5e27d61eb9f88155627612b2750",
        "dataset_spec-to-rtl/Prob003_step_one_ref.sv": "292f115739f3091071712b990750d10fc233e5255f99d105aff14fbc01b1c344",
        "dataset_spec-to-rtl/Prob003_step_one_test.sv": "1d918c81d6195090f5d63e397bcb0690ff54e03977b1d220e31dcc12d6d4e159"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob004_vector2": {
    "id": "verilogeval-netlist-settled-v2:Prob004_vector2",
    "spec_sha256": "32274a2b9482ed7492f62dfd915b8c8ab75735561dfddc9644c1ef1cbea59f75",
    "checks": 218,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [31:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\twavedrom_start(\"Random inputs\");\r\n\t\trepeat(10) @(posedge clk, negedge clk) \r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\twavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [31:0] in,\r\n  output [31:0] out\r\n);\r\n\r\n  assign out = {in[7:0], in[15:8], in[23:16], in[31:24]};\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [31:0] raw_in; wire [31:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [31:0] gold_out, dut_out, raw_dut_out; reg [31:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.out(gold_out));\nTopModule dut(.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<32;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob004_vector2_prompt.txt": "32274a2b9482ed7492f62dfd915b8c8ab75735561dfddc9644c1ef1cbea59f75",
        "dataset_spec-to-rtl/Prob004_vector2_ref.sv": "af6ed8584b00c82d5461258dc7f9ef2199d844726bc8cd0e7fca4855b02a8b42",
        "dataset_spec-to-rtl/Prob004_vector2_test.sv": "4d7d5a276121d9b81a89310eac8740ce2395bce31e025ef5f9494c6e10554a20"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob006_vectorr": {
    "id": "verilogeval-netlist-settled-v2:Prob006_vectorr",
    "spec_sha256": "ba3e43380f2dc358f2416aeb32420bc879ff64fdf2711eaef263fe27e087e0d5",
    "checks": 434,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [7:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\t\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\tin <= 0;\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) in <= 8'h1;\r\n\t\t\t@(posedge clk) in <= 8'h2;\r\n\t\t\t@(posedge clk) in <= 8'h4;\r\n\t\t\t@(posedge clk) in <= 8'h8;\r\n\t\t\t@(posedge clk) in <= 8'h80;\r\n\t\t\t@(posedge clk) in <= 8'hc0;\r\n\t\t\t@(posedge clk) in <= 8'he0;\r\n\t\t\t@(posedge clk) in <= 8'hf0;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [7:0] in,\r\n  output [7:0] out\r\n);\r\n\r\n  assign {out[0],out[1],out[2],out[3],out[4],out[5],out[6],out[7]} = in;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [7:0] gold_out, dut_out, raw_dut_out; reg [7:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.out(gold_out));\nTopModule dut(.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob006_vectorr_prompt.txt": "ba3e43380f2dc358f2416aeb32420bc879ff64fdf2711eaef263fe27e087e0d5",
        "dataset_spec-to-rtl/Prob006_vectorr_ref.sv": "770fe7ce1630af55f33bf584c83b6e6f0d36d4f7e42d0a4fc82a47b1690783d8",
        "dataset_spec-to-rtl/Prob006_vectorr_test.sv": "37171d161664459d69d9915c81cdb0fb47407bc7fa4b058ac59f4d65b0b3fc6e"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob008_m2014_q4h": {
    "id": "verilogeval-netlist-settled-v2:Prob008_m2014_q4h",
    "spec_sha256": "b66000e0610396f53d348102109d6bef9ffb12847d3dde70edb3e1787a4a2b79",
    "checks": 199,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg in = 0\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input in,\r\n  output out\r\n);\r\n\r\n  assign out = in;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in));\noracle_RefModule gold(.in(drive_in),.out(gold_out));\nTopModule dut(.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob008_m2014_q4h_prompt.txt": "b66000e0610396f53d348102109d6bef9ffb12847d3dde70edb3e1787a4a2b79",
        "dataset_spec-to-rtl/Prob008_m2014_q4h_ref.sv": "4c0021fdac9b00873f18b1d1b7c1477e9ae60cddbbb552e5b89b78073210cde8",
        "dataset_spec-to-rtl/Prob008_m2014_q4h_test.sv": "132805263abeb9aa5f4704a529b76939441a1704fb106c0d8f2e95c19bdef7fd"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob009_popcount3": {
    "id": "verilogeval-netlist-settled-v2:Prob009_popcount3",
    "spec_sha256": "16c4bdb4a264288e484273e1cd596a0232d929f3ee15bfc8a6467459fae30285",
    "checks": 438,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [2:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\t\r\n\tinitial begin #101;\r\n\t\tin <= 7;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start();\r\n\t\t\trepeat(9) @(posedge clk) in <= in + 1'b1;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [2:0] in,\r\n  output [1:0] out\r\n);\r\n\r\n  assign out = in[0]+in[1]+in[2];\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [2:0] raw_in; wire [2:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [1:0] gold_out, dut_out, raw_dut_out; reg [1:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.out(gold_out));\nTopModule dut(.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<2;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob009_popcount3_prompt.txt": "16c4bdb4a264288e484273e1cd596a0232d929f3ee15bfc8a6467459fae30285",
        "dataset_spec-to-rtl/Prob009_popcount3_ref.sv": "6c6e1fb4ec66c3dd689dab33e09da3fc15213cdd4af76759ce80857ae6d734b9",
        "dataset_spec-to-rtl/Prob009_popcount3_test.sv": "a27598f15590c225e4bbfcaecaf2f3978dc421d15a23dc1c2decc849efcba727"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob010_mt2015_q4a": {
    "id": "verilogeval-netlist-settled-v2:Prob010_mt2015_q4a",
    "spec_sha256": "bc0c7c9b565e1a71eeec0dadc79c718e4bffd200a0d359396c9752da1985d65c",
    "checks": 403,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic x,\r\n\toutput logic y\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\talways @(posedge clk, negedge clk)\r\n\t\t{x, y} <= $random(netlist_random_seed) % 4;\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(101) @(negedge clk);\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input x,\r\n  input y,\r\n  output z\r\n);\r\n\r\n  assign z = (x^y) & x;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire raw_y; wire drive_y; assign #0.1 drive_y=raw_y;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x),.y(raw_y));\noracle_RefModule gold(.x(drive_x),.y(drive_y),.z(gold_z));\nTopModule dut(.x(drive_x),.y(drive_y),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob010_mt2015_q4a_prompt.txt": "bc0c7c9b565e1a71eeec0dadc79c718e4bffd200a0d359396c9752da1985d65c",
        "dataset_spec-to-rtl/Prob010_mt2015_q4a_ref.sv": "9b00b393357bd0f2412fb4b1a1181ebb4c09fbaa34f8c3a892a8ca3404c96f68",
        "dataset_spec-to-rtl/Prob010_mt2015_q4a_test.sv": "63629e6981ff03361762bcbc4d4a9e5a3845e9bb95b3d8f51491955b38ce8a47"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob011_norgate": {
    "id": "verilogeval-netlist-settled-v2:Prob011_norgate",
    "spec_sha256": "98cafd0786f724728cdcb0000157c5835f14eca4f2bf6ff61147570f351d57ee",
    "checks": 437,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a, b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{a,b} <= 1'b0;\r\n\t\twavedrom_start(\"NOR gate\");\r\n\t\trepeat(10) @(posedge clk)\r\n\t\t\t{a,b} <= count++;\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{b,a} <= $random(netlist_random_seed);\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  output out\r\n);\r\n\r\n  assign out = ~(a | b);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob011_norgate_prompt.txt": "98cafd0786f724728cdcb0000157c5835f14eca4f2bf6ff61147570f351d57ee",
        "dataset_spec-to-rtl/Prob011_norgate_ref.sv": "d87df58da492ccdf177c2860ce126d5309186b64d81f913e2bd4ea33a7802b95",
        "dataset_spec-to-rtl/Prob011_norgate_test.sv": "538045689a7749d9aa169286a7533d2635c03201024a70f7d3d86d2e5b0cd79b"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob012_xnorgate": {
    "id": "verilogeval-netlist-settled-v2:Prob012_xnorgate",
    "spec_sha256": "a366721899bd6d33d08a3787a13c5970326fcd0ffe73cc36419f2306e3bd8b76",
    "checks": 437,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a, b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{a,b} <= 1'b0;\r\n\t\twavedrom_start(\"XNOR gate\");\r\n\t\trepeat(10) @(posedge clk)\r\n\t\t\t{a,b} <= count++;\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{b,a} <= $random(netlist_random_seed);\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  output out\r\n);\r\n\r\n  assign out = ~(a^b);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob012_xnorgate_prompt.txt": "a366721899bd6d33d08a3787a13c5970326fcd0ffe73cc36419f2306e3bd8b76",
        "dataset_spec-to-rtl/Prob012_xnorgate_ref.sv": "fc3ea4e5997b3dca2aeea21f93344436f16201fe6cd6b4b01b577693fa3093e8",
        "dataset_spec-to-rtl/Prob012_xnorgate_test.sv": "eebc759645c05aaf20b1ec25ddeb13336de8c508328fc64e23ffed6102cd99c4"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob013_m2014_q4e": {
    "id": "verilogeval-netlist-settled-v2:Prob013_m2014_q4e",
    "spec_sha256": "f9d808ee3b95949f1c0cc83adadbb33b29d80562c48ff659b85afb45921a41d5",
    "checks": 199,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in1, in2\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{in1, in2} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input in1,\r\n  input in2,\r\n  output logic out\r\n);\r\n\r\n  assign out = ~(in1 | in2);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_in1; wire drive_in1; assign #0.1 drive_in1=raw_in1;\nwire raw_in2; wire drive_in2; assign #0.1 drive_in2=raw_in2;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in1(raw_in1),.in2(raw_in2));\noracle_RefModule gold(.in1(drive_in1),.in2(drive_in2),.out(gold_out));\nTopModule dut(.in1(drive_in1),.in2(drive_in2),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob013_m2014_q4e_prompt.txt": "f9d808ee3b95949f1c0cc83adadbb33b29d80562c48ff659b85afb45921a41d5",
        "dataset_spec-to-rtl/Prob013_m2014_q4e_ref.sv": "d3d1a58b1428e0e0ae12d31edee3f58d769112427833977ce80a188f237f9d11",
        "dataset_spec-to-rtl/Prob013_m2014_q4e_test.sv": "cb3cada96373cfa88e9af97d0e3c0775d6bac98b5d384c9e9a88e09ba72e6612"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob014_andgate": {
    "id": "verilogeval-netlist-settled-v2:Prob014_andgate",
    "spec_sha256": "d39d72d82373a55b19274b7e2895fea4df995819c0dacc6ddc810413d24e3929",
    "checks": 437,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a, b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{a,b} <= 1'b0;\r\n\t\twavedrom_start(\"AND gate\");\r\n\t\trepeat(10) @(posedge clk)\r\n\t\t\t{a,b} <= count++;\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{b,a} <= $random(netlist_random_seed);\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  output out\r\n);\r\n\r\n  assign out = a & b;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob014_andgate_prompt.txt": "d39d72d82373a55b19274b7e2895fea4df995819c0dacc6ddc810413d24e3929",
        "dataset_spec-to-rtl/Prob014_andgate_ref.sv": "34c653758fd6fe270fe4220308a8d2a906eaa1ede9ddd4f95ff3b95edfd02c26",
        "dataset_spec-to-rtl/Prob014_andgate_test.sv": "179e01882572a0604b80f2daf746127aee2ca61af5460533e9cdcca3c767cbdd"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob015_vector1": {
    "id": "verilogeval-netlist-settled-v2:Prob015_vector1",
    "spec_sha256": "12e854fc8f9e670878ab17d535416852920e206585be94bbcafb1f7e2159b81e",
    "checks": 434,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [15:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\talways @(posedge clk, negedge clk)\r\n\t\tin <= $random(netlist_random_seed);\r\n\t\r\n\tinitial begin #101;\r\n\t\twavedrom_start(\"Random inputs\");\r\n\t\trepeat(10) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(100) @(negedge clk);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [15:0] in,\r\n  output [7:0] out_hi,\r\n  output [7:0] out_lo\r\n);\r\n\r\n  assign {out_hi, out_lo} = in;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [15:0] raw_in; wire [15:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [7:0] gold_out_hi, dut_out_hi, raw_dut_out_hi; reg [7:0] seen_out_hi='0;\nwire [7:0] gold_out_lo, dut_out_lo, raw_dut_out_lo; reg [7:0] seen_out_lo='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.out_hi(gold_out_hi),.out_lo(gold_out_lo));\nTopModule dut(.in(drive_in),.out_hi(raw_dut_out_hi),.out_lo(raw_dut_out_lo));\nassign dut_out_hi=raw_dut_out_hi;\nassign dut_out_lo=raw_dut_out_lo;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_out_hi[b] === 1'b0 || gold_out_hi[b] === 1'b1) begin\nknown=1; seen_out_hi[b]=1'b1;\nif(dut_out_hi[b] !== gold_out_hi[b]) bad=1;\nend end\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_out_lo[b] === 1'b0 || gold_out_lo[b] === 1'b1) begin\nknown=1; seen_out_lo[b]=1'b1;\nif(dut_out_lo[b] !== gold_out_lo[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_hi) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_hi\");\nif((&seen_out_lo) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_lo\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob015_vector1_prompt.txt": "12e854fc8f9e670878ab17d535416852920e206585be94bbcafb1f7e2159b81e",
        "dataset_spec-to-rtl/Prob015_vector1_ref.sv": "bf103d5abd4cbc7eb19048dc2b57db6c248d5e3fa1eb1cced4d8b2f2a774de2c",
        "dataset_spec-to-rtl/Prob015_vector1_test.sv": "182abe01965597b4f3eddf19d4453376c2d5140c6408d627c3259e3df0c6dec4"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob016_m2014_q4j": {
    "id": "verilogeval-netlist-settled-v2:Prob016_m2014_q4j",
    "spec_sha256": "fc20f5fd6ce715af99a09cf388ae171728aefc4fae4025be020d1f48a280e52d",
    "checks": 199,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [3:0] x,y\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{x,y} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [3:0] x,\r\n  input [3:0] y,\r\n  output [4:0] sum\r\n);\r\n\r\n  assign sum = x+y;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [3:0] raw_x; wire [3:0] drive_x; assign #0.1 drive_x=raw_x;\nwire [3:0] raw_y; wire [3:0] drive_y; assign #0.1 drive_y=raw_y;\nwire [4:0] gold_sum, dut_sum, raw_dut_sum; reg [4:0] seen_sum='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x),.y(raw_y));\noracle_RefModule gold(.x(drive_x),.y(drive_y),.sum(gold_sum));\nTopModule dut(.x(drive_x),.y(drive_y),.sum(raw_dut_sum));\nassign dut_sum=raw_dut_sum;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<5;b=b+1) begin\nif(gold_sum[b] === 1'b0 || gold_sum[b] === 1'b1) begin\nknown=1; seen_sum[b]=1'b1;\nif(dut_sum[b] !== gold_sum[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_sum) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:sum\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob016_m2014_q4j_prompt.txt": "fc20f5fd6ce715af99a09cf388ae171728aefc4fae4025be020d1f48a280e52d",
        "dataset_spec-to-rtl/Prob016_m2014_q4j_ref.sv": "13a995715bc9fac16366d36ab0953b1a3279d9fc49d1ad8bc0c71034c8822543",
        "dataset_spec-to-rtl/Prob016_m2014_q4j_test.sv": "ac748eed51c12af0155d06d4671f48c144199c87dca749349780daee7b95de5c"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob017_mux2to1v": {
    "id": "verilogeval-netlist-settled-v2:Prob017_mux2to1v",
    "spec_sha256": "73ca3e3e5584e265bede4fb86210983e8530278eabffc423b9d6b4337ccb206c",
    "checks": 226,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [99:0] a,b,\r\n\toutput logic sel,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\ta <= 'hdeadbeef;\r\n\t\tb <= 'h5eaf00d;\r\n\t\tsel <= 0;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start(\"Beef or seafood?\");\r\n\t\t\trepeat(6) @(posedge clk) sel <= ~sel;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,sel} <= {$random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed)};\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [99:0] a,\r\n  input [99:0] b,\r\n  input sel,\r\n  output [99:0] out\r\n);\r\n\r\n  assign out = sel ? b : a;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [99:0] raw_a; wire [99:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [99:0] raw_b; wire [99:0] drive_b; assign #0.1 drive_b=raw_b;\nwire raw_sel; wire drive_sel; assign #0.1 drive_sel=raw_sel;\nwire [99:0] gold_out, dut_out, raw_dut_out; reg [99:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.sel(raw_sel),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.sel(drive_sel),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.sel(drive_sel),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<100;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob017_mux2to1v_prompt.txt": "73ca3e3e5584e265bede4fb86210983e8530278eabffc423b9d6b4337ccb206c",
        "dataset_spec-to-rtl/Prob017_mux2to1v_ref.sv": "4c053cf50ba159665aec6d951a1abed7201c46301257ef03fcf6baa6741db95a",
        "dataset_spec-to-rtl/Prob017_mux2to1v_test.sv": "1ad12f29742bae46c6d2a469c985809e4cc4d51b157435f0684de7ff26a9dc4c"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob018_mux256to1": {
    "id": "verilogeval-netlist-settled-v2:Prob018_mux256to1",
    "spec_sha256": "65be3e21ac8af499c118a784333ea5b47f59ccc2d1e967739f6e1535325a37b5",
    "checks": 3998,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [255:0] in,\r\n\toutput logic [7:0] sel\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\talways @(posedge clk, negedge clk) begin\r\n\t\tfor (int i=0;i<8; i++)\r\n\t\t\tin[i*32+:32] <= $random(netlist_random_seed);\r\n\t\tsel <= $random(netlist_random_seed);\r\n\tend\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(1000) @(negedge clk);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [255:0] in,\r\n  input [7:0] sel,\r\n  output  out\r\n);\r\n\r\n  assign out = in[sel];\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [255:0] raw_in; wire [255:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [7:0] raw_sel; wire [7:0] drive_sel; assign #0.1 drive_sel=raw_sel;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.sel(raw_sel));\noracle_RefModule gold(.in(drive_in),.sel(drive_sel),.out(gold_out));\nTopModule dut(.in(drive_in),.sel(drive_sel),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob018_mux256to1_prompt.txt": "65be3e21ac8af499c118a784333ea5b47f59ccc2d1e967739f6e1535325a37b5",
        "dataset_spec-to-rtl/Prob018_mux256to1_ref.sv": "37d01a6fa065caf1a85812663ece9ef99dbf4b403b173da9992fae65f9414f4d",
        "dataset_spec-to-rtl/Prob018_mux256to1_test.sv": "e35b074e13f26a58cba329c72d149206ddca7ac1e655d34631cd0cd5686e14ea"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob019_m2014_q4f": {
    "id": "verilogeval-netlist-settled-v2:Prob019_m2014_q4f",
    "spec_sha256": "b0c52ef88d204a9d80c3b26b4913b2913eb19895f59fa583da2a7cfeae6459f6",
    "checks": 199,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in1, in2\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{in1, in2} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input in1,\r\n  input in2,\r\n  output logic out\r\n);\r\n\r\n  assign out = in1 & ~in2;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_in1; wire drive_in1; assign #0.1 drive_in1=raw_in1;\nwire raw_in2; wire drive_in2; assign #0.1 drive_in2=raw_in2;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in1(raw_in1),.in2(raw_in2));\noracle_RefModule gold(.in1(drive_in1),.in2(drive_in2),.out(gold_out));\nTopModule dut(.in1(drive_in1),.in2(drive_in2),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob019_m2014_q4f_prompt.txt": "b0c52ef88d204a9d80c3b26b4913b2913eb19895f59fa583da2a7cfeae6459f6",
        "dataset_spec-to-rtl/Prob019_m2014_q4f_ref.sv": "9c238eb29003524ea6b3c47c402aa475e37c0d3ba1278c093b7ce725fa8fc750",
        "dataset_spec-to-rtl/Prob019_m2014_q4f_test.sv": "cb3cada96373cfa88e9af97d0e3c0775d6bac98b5d384c9e9a88e09ba72e6612"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob020_mt2015_eq2": {
    "id": "verilogeval-netlist-settled-v2:Prob020_mt2015_eq2",
    "spec_sha256": "9aac034d5bef8d92c4484f8df33008c15298a9254f249338c12b92ccecb09f9a",
    "checks": 3999,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n/*\r\n\tMidterm 2015 Question 1k. 2-bit equality comparator.\r\n*/\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [1:0] A,\r\n\toutput logic [1:0] B\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\talways @(posedge clk, negedge clk)\r\n\t\t{A, B} <= $random(netlist_random_seed) % 16;\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(1000) @(negedge clk);\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [1:0] A,\r\n  input [1:0] B,\r\n  output z\r\n);\r\n\r\n  assign z = A[1:0]==B[1:0];\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [1:0] raw_A; wire [1:0] drive_A; assign #0.1 drive_A=raw_A;\nwire [1:0] raw_B; wire [1:0] drive_B; assign #0.1 drive_B=raw_B;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.A(raw_A),.B(raw_B));\noracle_RefModule gold(.A(drive_A),.B(drive_B),.z(gold_z));\nTopModule dut(.A(drive_A),.B(drive_B),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob020_mt2015_eq2_prompt.txt": "9aac034d5bef8d92c4484f8df33008c15298a9254f249338c12b92ccecb09f9a",
        "dataset_spec-to-rtl/Prob020_mt2015_eq2_ref.sv": "2612a35dc0b75ccb5ce316d093c12f391744850c1048a31617a2d81a0f3fc10e",
        "dataset_spec-to-rtl/Prob020_mt2015_eq2_test.sv": "597db0f4704f36a63a17b64aa58a8d0fafbc7858e3b5442a2bdf127cff9cf627"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob021_mux256to1v": {
    "id": "verilogeval-netlist-settled-v2:Prob021_mux256to1v",
    "spec_sha256": "96db113e87be9888fa2fbdaeaca7ce8f8fbe63153a5b113372118c981a0bd137",
    "checks": 3998,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [1023:0] in,\r\n\toutput logic [7:0] sel\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\talways @(posedge clk, negedge clk) begin\r\n\t\tfor (int i=0;i<32; i++)\r\n\t\t\tin[i*32+:32] <= $random(netlist_random_seed);\r\n\t\tsel <= $random(netlist_random_seed);\r\n\tend\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(1000) @(negedge clk);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [1023:0] in,\r\n  input [7:0] sel,\r\n  output [3:0] out\r\n);\r\n\r\n  assign out = {in[sel*4+3], in[sel*4+2], in[sel*4+1], in[sel*4+0]};\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [1023:0] raw_in; wire [1023:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [7:0] raw_sel; wire [7:0] drive_sel; assign #0.1 drive_sel=raw_sel;\nwire [3:0] gold_out, dut_out, raw_dut_out; reg [3:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.sel(raw_sel));\noracle_RefModule gold(.in(drive_in),.sel(drive_sel),.out(gold_out));\nTopModule dut(.in(drive_in),.sel(drive_sel),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob021_mux256to1v_prompt.txt": "96db113e87be9888fa2fbdaeaca7ce8f8fbe63153a5b113372118c981a0bd137",
        "dataset_spec-to-rtl/Prob021_mux256to1v_ref.sv": "fd810eaedd715737d7e9d6fdde98143558043154b2710626e2d0dff8a6678b4c",
        "dataset_spec-to-rtl/Prob021_mux256to1v_test.sv": "e1f601dd91c137610731ab500239a3459e18afd5872935b7b0e4169015f223f8"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob022_mux2to1": {
    "id": "verilogeval-netlist-settled-v2:Prob022_mux2to1",
    "spec_sha256": "c7d20a840aa113e47743cf6486c92f2319a2d2ef70c390ffefd18a9b59d5f27c",
    "checks": 242,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,b,sel,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\t{a, b, sel} <= 3'b000;\r\n\t\t@(negedge clk) wavedrom_start(\"<b>Sel</b> chooses between <b>a</b> and <b>b</b>\");\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b000;\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b100;\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b110;\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b111;\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b011;\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b001;\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b100;\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b101;\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b110;\r\n\t\t\t@(posedge clk) {a, b, sel} <= 3'b111;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,sel} <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input sel,\r\n  output out\r\n);\r\n\r\n  assign out = sel ? b : a;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_sel; wire drive_sel; assign #0.1 drive_sel=raw_sel;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.sel(raw_sel),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.sel(drive_sel),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.sel(drive_sel),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob022_mux2to1_prompt.txt": "c7d20a840aa113e47743cf6486c92f2319a2d2ef70c390ffefd18a9b59d5f27c",
        "dataset_spec-to-rtl/Prob022_mux2to1_ref.sv": "d486643f9fdfb55ec70bdbcd55e1b19c32b1919827bbf85ce205065d4e26c15f",
        "dataset_spec-to-rtl/Prob022_mux2to1_test.sv": "042e1c1e7216298150b9402f350907fb84c572ec43cb981d735f71778b280790"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob023_vector100r": {
    "id": "verilogeval-netlist-settled-v2:Prob023_vector100r",
    "spec_sha256": "5cd7f182ef50ad068825f2211373e25f55203968d0860bda51af5530c9476455",
    "checks": 398,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [99:0] in\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\talways @(posedge clk, negedge clk)\r\n\t\tin <= {$random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed)};\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(negedge clk);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [99:0] in,\r\n  output reg [99:0] out\r\n);\r\n\r\n  always_comb\r\n    for (int i=0;i<$bits(out);i++)\r\n      out[i] = in[$bits(out)-i-1];\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [99:0] raw_in; wire [99:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [99:0] gold_out, dut_out, raw_dut_out; reg [99:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in));\noracle_RefModule gold(.in(drive_in),.out(gold_out));\nTopModule dut(.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<100;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob023_vector100r_prompt.txt": "5cd7f182ef50ad068825f2211373e25f55203968d0860bda51af5530c9476455",
        "dataset_spec-to-rtl/Prob023_vector100r_ref.sv": "f4a180fd031afc8cfc6186740595c859773798db04ce79409b206910c42c35ae",
        "dataset_spec-to-rtl/Prob023_vector100r_test.sv": "ed1e4db67ac6ae7ea980cdf12d3e4d40783bc53e5115276ae372232e8a9b4da2"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob024_hadd": {
    "id": "verilogeval-netlist-settled-v2:Prob024_hadd",
    "spec_sha256": "01eb3e73592e499252e4c9b707f064f30ed0cf102a9fb7760dfa48b3f7000d54",
    "checks": 398,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,b\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\talways @(posedge clk, negedge clk)\r\n\t\t{a,b} <= $random(netlist_random_seed);\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(negedge clk);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  output sum,\r\n  output cout\r\n);\r\n\r\n  assign {cout, sum} = a+b;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire gold_sum, dut_sum, raw_dut_sum; reg seen_sum='0;\nwire gold_cout, dut_cout, raw_dut_cout; reg seen_cout='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b));\noracle_RefModule gold(.a(drive_a),.b(drive_b),.sum(gold_sum),.cout(gold_cout));\nTopModule dut(.a(drive_a),.b(drive_b),.sum(raw_dut_sum),.cout(raw_dut_cout));\nassign dut_sum=raw_dut_sum;\nassign dut_cout=raw_dut_cout;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_sum === 1'b0 || gold_sum === 1'b1) begin\nknown=1; seen_sum=1'b1;\nif(dut_sum !== gold_sum) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_cout === 1'b0 || gold_cout === 1'b1) begin\nknown=1; seen_cout=1'b1;\nif(dut_cout !== gold_cout) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_sum) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:sum\");\nif((&seen_cout) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:cout\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob024_hadd_prompt.txt": "01eb3e73592e499252e4c9b707f064f30ed0cf102a9fb7760dfa48b3f7000d54",
        "dataset_spec-to-rtl/Prob024_hadd_ref.sv": "e9207d9628ae4c5224e6d4f27f17ce0a1082e1be74df8b755e0bb8e942e25cc0",
        "dataset_spec-to-rtl/Prob024_hadd_test.sv": "57c913a3c1d6c6da91d3de5634846ca4155352f2c3078ed02aff08ee2780b704"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob025_reduction": {
    "id": "verilogeval-netlist-settled-v2:Prob025_reduction",
    "spec_sha256": "d41323474201378d2ebf64a5f0f88527fc69c37fd82fdf054db62bedf43a7928",
    "checks": 198,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [7:0] in\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [7:0] in,\r\n  output parity\r\n);\r\n\r\n  assign parity = ^in;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;\nwire gold_parity, dut_parity, raw_dut_parity; reg seen_parity='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in));\noracle_RefModule gold(.in(drive_in),.parity(gold_parity));\nTopModule dut(.in(drive_in),.parity(raw_dut_parity));\nassign dut_parity=raw_dut_parity;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_parity === 1'b0 || gold_parity === 1'b1) begin\nknown=1; seen_parity=1'b1;\nif(dut_parity !== gold_parity) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_parity) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:parity\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob025_reduction_prompt.txt": "d41323474201378d2ebf64a5f0f88527fc69c37fd82fdf054db62bedf43a7928",
        "dataset_spec-to-rtl/Prob025_reduction_ref.sv": "6378b2b432207b7e861e8e9424d624654021fe7ad2f16342b97af84cba32c301",
        "dataset_spec-to-rtl/Prob025_reduction_test.sv": "0e9373a9a46102f7693930d94c30444b720042f30236f5208afe2b69d41c4d00"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob026_alwaysblock1": {
    "id": "verilogeval-netlist-settled-v2:Prob026_alwaysblock1",
    "spec_sha256": "4b5b4392196062fc0305b1f06dfe4095c960322a4c3b473d9d9c6a9f2c719a76",
    "checks": 437,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a, b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{a,b} <= 1'b0;\r\n\t\twavedrom_start(\"AND gate\");\r\n\t\trepeat(10) @(posedge clk)\r\n\t\t\t{a,b} <= count++;\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{b,a} <= $random(netlist_random_seed);\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  output out_assign,\r\n  output reg out_alwaysblock\r\n);\r\n\r\n  assign out_assign = a & b;\r\n  always @(*) out_alwaysblock = a & b;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire gold_out_assign, dut_out_assign, raw_dut_out_assign; reg seen_out_assign='0;\nwire gold_out_alwaysblock, dut_out_alwaysblock, raw_dut_out_alwaysblock; reg seen_out_alwaysblock='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.out_assign(gold_out_assign),.out_alwaysblock(gold_out_alwaysblock));\nTopModule dut(.a(drive_a),.b(drive_b),.out_assign(raw_dut_out_assign),.out_alwaysblock(raw_dut_out_alwaysblock));\nassign dut_out_assign=raw_dut_out_assign;\nassign dut_out_alwaysblock=raw_dut_out_alwaysblock;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_assign === 1'b0 || gold_out_assign === 1'b1) begin\nknown=1; seen_out_assign=1'b1;\nif(dut_out_assign !== gold_out_assign) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_alwaysblock === 1'b0 || gold_out_alwaysblock === 1'b1) begin\nknown=1; seen_out_alwaysblock=1'b1;\nif(dut_out_alwaysblock !== gold_out_alwaysblock) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_assign) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_assign\");\nif((&seen_out_alwaysblock) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_alwaysblock\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob026_alwaysblock1_prompt.txt": "4b5b4392196062fc0305b1f06dfe4095c960322a4c3b473d9d9c6a9f2c719a76",
        "dataset_spec-to-rtl/Prob026_alwaysblock1_ref.sv": "56947fc7299b8ee0351857dc359024e2e8e5f6724a956605489f9f16faaf41ee",
        "dataset_spec-to-rtl/Prob026_alwaysblock1_test.sv": "eb9d1544c840c15bbf505ebeddbfe826b350287b76835c55bd5d135cec717323"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob027_fadd": {
    "id": "verilogeval-netlist-settled-v2:Prob027_fadd",
    "spec_sha256": "04768690a8bfdccbe86d457d5303e1a3eeb9117544f3f9f980c324f9966d392e",
    "checks": 426,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,b,cin,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\twavedrom_start();\r\n\t\t\t@(posedge clk) {a,b,cin} <= 3'b000;\r\n\t\t\t@(posedge clk) {a,b,cin} <= 3'b010;\r\n\t\t\t@(posedge clk) {a,b,cin} <= 3'b100;\r\n\t\t\t@(posedge clk) {a,b,cin} <= 3'b110;\r\n\t\t\t@(posedge clk) {a,b,cin} <= 3'b000;\r\n\t\t\t@(posedge clk) {a,b,cin} <= 3'b001;\r\n\t\t\t@(posedge clk) {a,b,cin} <= 3'b011;\t\t\t\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,cin} <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input cin,\r\n  output cout,\r\n  output sum\r\n);\r\n\r\n  assign {cout, sum} = a+b+cin;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_cin; wire drive_cin; assign #0.1 drive_cin=raw_cin;\nwire gold_cout, dut_cout, raw_dut_cout; reg seen_cout='0;\nwire gold_sum, dut_sum, raw_dut_sum; reg seen_sum='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.cin(raw_cin),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.cin(drive_cin),.cout(gold_cout),.sum(gold_sum));\nTopModule dut(.a(drive_a),.b(drive_b),.cin(drive_cin),.cout(raw_dut_cout),.sum(raw_dut_sum));\nassign dut_cout=raw_dut_cout;\nassign dut_sum=raw_dut_sum;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_cout === 1'b0 || gold_cout === 1'b1) begin\nknown=1; seen_cout=1'b1;\nif(dut_cout !== gold_cout) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_sum === 1'b0 || gold_sum === 1'b1) begin\nknown=1; seen_sum=1'b1;\nif(dut_sum !== gold_sum) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_cout) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:cout\");\nif((&seen_sum) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:sum\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob027_fadd_prompt.txt": "04768690a8bfdccbe86d457d5303e1a3eeb9117544f3f9f980c324f9966d392e",
        "dataset_spec-to-rtl/Prob027_fadd_ref.sv": "d49b4629fe43a989c8c314d72c16f36bde6b7910e5e09e0ddf9e6dffeea36bc9",
        "dataset_spec-to-rtl/Prob027_fadd_test.sv": "08a102573b22de3e1b23b2ee33d0ace515c334043bc793385eea4ca000e01f70"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob028_m2014_q4a": {
    "id": "verilogeval-netlist-settled-v2:Prob028_m2014_q4a",
    "spec_sha256": "ecc853f0c46accfaa16a7d24aa084e652a05971c00e9d37fa217c1e955349974",
    "checks": 189,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic d, ena\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{d,ena} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input d,\r\n  input ena,\r\n  output logic q\r\n);\r\n\r\n  always@(*) begin\r\n    if (ena)\r\n      q = d;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire raw_ena; wire drive_ena; assign drive_ena=raw_ena;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.ena(raw_ena));\noracle_RefModule gold(.d(drive_d),.ena(drive_ena),.q(gold_q));\nTopModule dut(.d(drive_d),.ena(drive_ena),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob028_m2014_q4a_prompt.txt": "ecc853f0c46accfaa16a7d24aa084e652a05971c00e9d37fa217c1e955349974",
        "dataset_spec-to-rtl/Prob028_m2014_q4a_ref.sv": "866e92f7842af291cfee7230570eb1589dd7381b5feac5b3ab4c6206b59972c7",
        "dataset_spec-to-rtl/Prob028_m2014_q4a_test.sv": "22ccfce7a6a3c64663c97207f2db1d2e3fd599e85103a159fed9168e490cd934"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "ena"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob029_m2014_q4g": {
    "id": "verilogeval-netlist-settled-v2:Prob029_m2014_q4g",
    "spec_sha256": "3657e7e25d3891b171ea46b14fdab950a58a805f034699f4b5a47b2dc08c2b7e",
    "checks": 199,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in1, in2, in3\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{in1, in2, in3} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input in1,\r\n  input in2,\r\n  input in3,\r\n  output logic out\r\n);\r\n\r\n  assign out = (~(in1 ^ in2)) ^ in3;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_in1; wire drive_in1; assign #0.1 drive_in1=raw_in1;\nwire raw_in2; wire drive_in2; assign #0.1 drive_in2=raw_in2;\nwire raw_in3; wire drive_in3; assign #0.1 drive_in3=raw_in3;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in1(raw_in1),.in2(raw_in2),.in3(raw_in3));\noracle_RefModule gold(.in1(drive_in1),.in2(drive_in2),.in3(drive_in3),.out(gold_out));\nTopModule dut(.in1(drive_in1),.in2(drive_in2),.in3(drive_in3),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob029_m2014_q4g_prompt.txt": "3657e7e25d3891b171ea46b14fdab950a58a805f034699f4b5a47b2dc08c2b7e",
        "dataset_spec-to-rtl/Prob029_m2014_q4g_ref.sv": "0cf89cc3a0328af5e72b5c955515524436574a278fc1fd62443b4bd3800de1f0",
        "dataset_spec-to-rtl/Prob029_m2014_q4g_test.sv": "5c6467d0fdfabf2cc792c38df61daf7031b9a5f195c36cece6b369ae2b22f8ad"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob030_popcount255": {
    "id": "verilogeval-netlist-settled-v2:Prob030_popcount255",
    "spec_sha256": "5e741f3f7e69e3d850d6aad2a705f9896e3b5b19bf75e7386fa435b0f4ebbb39",
    "checks": 429,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [254:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\tin <= 255'h0;\r\n\t\twavedrom_start(\"\");\r\n\t\t@(posedge clk, negedge clk) in <= 255'h0;\r\n\t\t@(posedge clk, negedge clk) in <= 255'h0;\r\n\t\t@(posedge clk, negedge clk) in <= 255'h1;\r\n\t\t@(posedge clk, negedge clk) in <= 255'h1;\r\n\t\t@(posedge clk, negedge clk) in <= 255'h3;\r\n\t\t@(posedge clk, negedge clk) in <= 255'h3;\r\n\t\t@(posedge clk, negedge clk) in <= 255'h7;\r\n\t\t@(posedge clk, negedge clk) in <= 255'haaaa;\r\n\t\t@(posedge clk, negedge clk) in <= 255'hf00000;\r\n\t\t@(posedge clk, negedge clk) in <= 255'h0;\r\n\t\twavedrom_stop();\r\n\t\trepeat (200) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= {$random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed)};\r\n\t\tend\r\n\t\t@(posedge clk);\r\n\t\tin <= '0;\r\n\t\t@(posedge clk)\r\n\t\tin <= '1;\r\n\t\t@(posedge clk)\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [254:0] in,\r\n  output reg [7:0] out\r\n);\r\n\r\n  always_comb  begin\r\n    out = 0;\r\n    for (int i=0;i<255;i++)\r\n      out = out + in[i];\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [254:0] raw_in; wire [254:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [7:0] gold_out, dut_out, raw_dut_out; reg [7:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.out(gold_out));\nTopModule dut(.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob030_popcount255_prompt.txt": "5e741f3f7e69e3d850d6aad2a705f9896e3b5b19bf75e7386fa435b0f4ebbb39",
        "dataset_spec-to-rtl/Prob030_popcount255_ref.sv": "22b15d60c088cb92db08008302f287e4ba9ec76a6cd50f9ed91f16dcf9bf1eac",
        "dataset_spec-to-rtl/Prob030_popcount255_test.sv": "ddcbf4f9702214d74f9157eb20b7f511c4a9b278f273fbf43dc2c78e09e28dda"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob031_dff": {
    "id": "verilogeval-netlist-settled-v2:Prob031_dff",
    "spec_sha256": "6e6d5252b2dd621ee0ec83d679278bca5dc125a98a028546c90dd28fe46b662c",
    "checks": 240,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\talways @(posedge clk, negedge clk)\r\n\t\td <= $urandom;\r\n\t\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(posedge clk);\r\n\t\twavedrom_start(\"Positive-edge triggered DFF\");\r\n\t\trepeat(10) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(100) @(posedge clk, negedge clk);\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input d,\r\n  output reg q\r\n);\r\n\r\n  initial\r\n    q = 1'hx;\r\n\r\n  always @(posedge clk)\r\n    q <= d;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.d(drive_d),.q(gold_q));\nTopModule dut(.clk(clk),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob031_dff_prompt.txt": "6e6d5252b2dd621ee0ec83d679278bca5dc125a98a028546c90dd28fe46b662c",
        "dataset_spec-to-rtl/Prob031_dff_ref.sv": "4ffaae5e6939857ac0900f914f531e6984959bc6f29b184102fa87bc0b93da50",
        "dataset_spec-to-rtl/Prob031_dff_test.sv": "c6c3ff4043beec16c4b3a3db5051974343a98b75bc1bcca32b3eef9b3eb4b76f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion",
      "public_interface_erratum": {
        "id": "p10-public-interface-031-v1",
        "approved_on": "2026-09-27",
        "spec_sha256": "6e6d5252b2dd621ee0ec83d679278bca5dc125a98a028546c90dd28fe46b662c",
        "explanation": "The public prompt lists q as input, but requires a positive-edge D flip-flop. Interpret q as a one-bit output; clk and d remain one-bit inputs. This approved interface correction overrides only that port-direction typo; the original prompt is preserved."
      }
    }
  },
  "Prob032_vector0": {
    "id": "verilogeval-netlist-settled-v2:Prob032_vector0",
    "spec_sha256": "206235f40fd7955b058d091cd7eaf47af77428957d87a58b1d5604263c861ad9",
    "checks": 41,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg [2:0] vec,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101; begin\r\n\t\tint count; count = 0;\r\n\t\tvec <= 3'b0;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start();\r\n\t\trepeat(10) @(posedge clk)\r\n\t\t\tvec <= count++;\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [2:0] vec,\r\n  output [2:0] outv,\r\n  output o2,\r\n  output o1,\r\n  output o0\r\n);\r\n\r\n  assign outv = vec;\r\n  assign {o2, o1, o0} = vec;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [2:0] raw_vec; wire [2:0] drive_vec; assign #0.1 drive_vec=raw_vec;\nwire [2:0] gold_outv, dut_outv, raw_dut_outv; reg [2:0] seen_outv='0;\nwire gold_o2, dut_o2, raw_dut_o2; reg seen_o2='0;\nwire gold_o1, dut_o1, raw_dut_o1; reg seen_o1='0;\nwire gold_o0, dut_o0, raw_dut_o0; reg seen_o0='0;\nstimulus_gen stim1(.clk(clk),.vec(raw_vec),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.vec(drive_vec),.outv(gold_outv),.o2(gold_o2),.o1(gold_o1),.o0(gold_o0));\nTopModule dut(.vec(drive_vec),.outv(raw_dut_outv),.o2(raw_dut_o2),.o1(raw_dut_o1),.o0(raw_dut_o0));\nassign dut_outv=raw_dut_outv;\nassign dut_o2=raw_dut_o2;\nassign dut_o1=raw_dut_o1;\nassign dut_o0=raw_dut_o0;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<3;b=b+1) begin\nif(gold_outv[b] === 1'b0 || gold_outv[b] === 1'b1) begin\nknown=1; seen_outv[b]=1'b1;\nif(dut_outv[b] !== gold_outv[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_o2 === 1'b0 || gold_o2 === 1'b1) begin\nknown=1; seen_o2=1'b1;\nif(dut_o2 !== gold_o2) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_o1 === 1'b0 || gold_o1 === 1'b1) begin\nknown=1; seen_o1=1'b1;\nif(dut_o1 !== gold_o1) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_o0 === 1'b0 || gold_o0 === 1'b1) begin\nknown=1; seen_o0=1'b1;\nif(dut_o0 !== gold_o0) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_outv) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:outv\");\nif((&seen_o2) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:o2\");\nif((&seen_o1) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:o1\");\nif((&seen_o0) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:o0\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob032_vector0_prompt.txt": "206235f40fd7955b058d091cd7eaf47af77428957d87a58b1d5604263c861ad9",
        "dataset_spec-to-rtl/Prob032_vector0_ref.sv": "934fffe59ce4d3bdc299e69a96a6bd4195b65250678148a4ce71fc139ba8af61",
        "dataset_spec-to-rtl/Prob032_vector0_test.sv": "3ef7ee22318a3fa28a7ee2e9f7c4978289b4f3fc808faa4b45ada753efbd6ce8"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob033_ece241_2014_q1c": {
    "id": "verilogeval-netlist-settled-v2:Prob033_ece241_2014_q1c",
    "spec_sha256": "5cf618278d80a5b428077dff2af38fd88a5bb464a844bd9c29e4b936b035f74e",
    "checks": 230,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [7:0] a, b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\t{a, b} <= 0;\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) {a, b} <= 16'h0;\r\n\t\t\t@(posedge clk) {a, b} <= 16'h0070;\r\n\t\t\t@(posedge clk) {a, b} <= 16'h7070;\r\n\t\t\t@(posedge clk) {a, b} <= 16'h7090;\r\n\t\t\t@(posedge clk) {a, b} <= 16'h9070;\r\n\t\t\t@(posedge clk) {a, b} <= 16'h9090;\r\n\t\t\t@(posedge clk) {a, b} <= 16'h90ff;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b} <= $random(netlist_random_seed);\r\n\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [7:0] a,\r\n  input [7:0] b,\r\n  output [7:0] s,\r\n  output overflow\r\n);\r\n\r\n  wire [8:0] sum = a+b;\r\n  assign s = sum[7:0];\r\n  assign overflow = !(a[7]^b[7]) && (a[7] != s[7]);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_a; wire [7:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [7:0] raw_b; wire [7:0] drive_b; assign #0.1 drive_b=raw_b;\nwire [7:0] gold_s, dut_s, raw_dut_s; reg [7:0] seen_s='0;\nwire gold_overflow, dut_overflow, raw_dut_overflow; reg seen_overflow='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.s(gold_s),.overflow(gold_overflow));\nTopModule dut(.a(drive_a),.b(drive_b),.s(raw_dut_s),.overflow(raw_dut_overflow));\nassign dut_s=raw_dut_s;\nassign dut_overflow=raw_dut_overflow;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_s[b] === 1'b0 || gold_s[b] === 1'b1) begin\nknown=1; seen_s[b]=1'b1;\nif(dut_s[b] !== gold_s[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_overflow === 1'b0 || gold_overflow === 1'b1) begin\nknown=1; seen_overflow=1'b1;\nif(dut_overflow !== gold_overflow) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_s) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:s\");\nif((&seen_overflow) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:overflow\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob033_ece241_2014_q1c_prompt.txt": "5cf618278d80a5b428077dff2af38fd88a5bb464a844bd9c29e4b936b035f74e",
        "dataset_spec-to-rtl/Prob033_ece241_2014_q1c_ref.sv": "9d6f9134e0f252e901b75bf9b6785e8dcc50110ed31b65def4984db01a771638",
        "dataset_spec-to-rtl/Prob033_ece241_2014_q1c_test.sv": "a8122a224d545d16e811515749695b7f0d63b5b1be292ad358da429135b4fbf4"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob034_dff8": {
    "id": "verilogeval-netlist-settled-v2:Prob034_dff8",
    "spec_sha256": "aa1aba088b3909ddf20d0433ef50ad8b25d32b82cc5475faf1f6ac5ff67b5630",
    "checks": 81,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg [7:0] d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\talways @(posedge clk, negedge clk)\r\n\t\td <= $random(netlist_random_seed) % 256;\r\n\t\r\n\tinitial begin #101;\r\n\t\t@(posedge clk);\r\n\t\twavedrom_start(\"Positive-edge triggered DFF\");\r\n\t\trepeat(10) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t#100;\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input [7:0] d,\r\n  output reg [7:0] q\r\n);\r\n\r\n  initial\r\n    q = 8'h0;\r\n\r\n  always @(posedge clk)\r\n    q <= d;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_d; wire [7:0] drive_d; assign #0.1 drive_d=raw_d;\nwire [7:0] gold_q, dut_q, raw_dut_q; reg [7:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.d(drive_d),.q(gold_q));\nTopModule dut(.clk(clk),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob034_dff8_prompt.txt": "aa1aba088b3909ddf20d0433ef50ad8b25d32b82cc5475faf1f6ac5ff67b5630",
        "dataset_spec-to-rtl/Prob034_dff8_ref.sv": "7feb4108685af030bc5a93cdd6d03908cf7ef7ae78378a94abc1bce74ac3be56",
        "dataset_spec-to-rtl/Prob034_dff8_test.sv": "6dc86fc4bd7e36811a1ab2f44a83aa3c063e46aecc3148741e022eae73b71bc1"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob035_count1to10": {
    "id": "verilogeval-netlist-settled-v2:Prob035_count1to10",
    "spec_sha256": "192072bdf89b7517ef3a3f7a36e8448f1753780a169fb6fa5a4242d1cf226956",
    "checks": 877,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\twavedrom_start(\"Synchronous reset and counting.\");\r\n\t\treset_test();\r\n\t\trepeat(12) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  output reg [3:0] q\r\n);\r\n\r\n  always @(posedge clk)\r\n    if (reset || q == 10)\r\n      q <= 1;\r\n    else\r\n      q <= q+1;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.q(gold_q));\nTopModule dut(.clk(clk),.reset(drive_reset),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob035_count1to10_prompt.txt": "192072bdf89b7517ef3a3f7a36e8448f1753780a169fb6fa5a4242d1cf226956",
        "dataset_spec-to-rtl/Prob035_count1to10_ref.sv": "3fa97d6036c6b6d9f5151f10c8a4d2c5c8f26462f5a5c1eda2933d933d892b01",
        "dataset_spec-to-rtl/Prob035_count1to10_test.sv": "be2d2f038961bd715d78127e2f8a135dbd86f2fb0415b74f69ab371fbc1c6864"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob036_ringer": {
    "id": "verilogeval-netlist-settled-v2:Prob036_ringer",
    "spec_sha256": "bcc7d4580735d36d22553533e06cffb932f6a6752a6a1eaef57da020937c479c",
    "checks": 37,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg ring, vibrate_mode,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{vibrate_mode,ring} <= 1'b0;\r\n\t\twavedrom_start();\r\n\t\trepeat(10) @(posedge clk)\r\n\t\t\t{vibrate_mode,ring} <= count++;\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input ring,\r\n  input vibrate_mode,\r\n  output ringer,\r\n  output motor\r\n);\r\n\r\n  assign ringer = ring & ~vibrate_mode;\r\n  assign motor = ring & vibrate_mode;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_ring; wire drive_ring; assign #0.1 drive_ring=raw_ring;\nwire raw_vibrate_mode; wire drive_vibrate_mode; assign #0.1 drive_vibrate_mode=raw_vibrate_mode;\nwire gold_ringer, dut_ringer, raw_dut_ringer; reg seen_ringer='0;\nwire gold_motor, dut_motor, raw_dut_motor; reg seen_motor='0;\nstimulus_gen stim1(.clk(clk),.ring(raw_ring),.vibrate_mode(raw_vibrate_mode),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.ring(drive_ring),.vibrate_mode(drive_vibrate_mode),.ringer(gold_ringer),.motor(gold_motor));\nTopModule dut(.ring(drive_ring),.vibrate_mode(drive_vibrate_mode),.ringer(raw_dut_ringer),.motor(raw_dut_motor));\nassign dut_ringer=raw_dut_ringer;\nassign dut_motor=raw_dut_motor;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_ringer === 1'b0 || gold_ringer === 1'b1) begin\nknown=1; seen_ringer=1'b1;\nif(dut_ringer !== gold_ringer) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_motor === 1'b0 || gold_motor === 1'b1) begin\nknown=1; seen_motor=1'b1;\nif(dut_motor !== gold_motor) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_ringer) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:ringer\");\nif((&seen_motor) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:motor\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob036_ringer_prompt.txt": "bcc7d4580735d36d22553533e06cffb932f6a6752a6a1eaef57da020937c479c",
        "dataset_spec-to-rtl/Prob036_ringer_ref.sv": "e5fec123d7d87f3ff9c5ae1c6d5ddac0ea9d5d6ae81034affd607cf1f8e57f81",
        "dataset_spec-to-rtl/Prob036_ringer_test.sv": "b31f0218a32da24d97afcabf340619f5df128ad79700dea9e5c3e795cc453356"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob037_review2015_count1k": {
    "id": "verilogeval-netlist-settled-v2:Prob037_review2015_count1k",
    "spec_sha256": "e902d050e96becfb072461c36c78fa6fc3eec208e8e70395def446ecee6b08c4",
    "checks": 16053,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\twavedrom_start(\"Synchronous reset\");\r\n\t\treset_test();\r\n\t\trepeat(5) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\treset <= 0;\r\n\t\t\r\n\t\trepeat(989) @(negedge clk);\r\n\t\twavedrom_start(\"Wrap around behaviour\");\r\n\t\trepeat(14)@(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\r\n\t\t\r\n\t\trepeat(2000) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 127);\r\n\t\tend\r\n\t\treset <= 0;\r\n\t\trepeat(2000) @(posedge clk);\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  output reg [9:0] q\r\n);\r\n\r\n  always @(posedge clk)\r\n    if (reset || q == 999)\r\n      q <= 0;\r\n    else\r\n      q <= q+1;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [9:0] gold_q, dut_q, raw_dut_q; reg [9:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.q(gold_q));\nTopModule dut(.clk(clk),.reset(drive_reset),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<10;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob037_review2015_count1k_prompt.txt": "e902d050e96becfb072461c36c78fa6fc3eec208e8e70395def446ecee6b08c4",
        "dataset_spec-to-rtl/Prob037_review2015_count1k_ref.sv": "5573c4264ca5dc20092d16f8dd91245deee7093d145c0e43b637f7d4dc7dedb1",
        "dataset_spec-to-rtl/Prob037_review2015_count1k_test.sv": "ad9ceaeeb4f93b1f974dc94a2dd16f2a5f3b638f9b22fb3c189a661f0377db26"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob038_count15": {
    "id": "verilogeval-netlist-settled-v2:Prob038_count15",
    "spec_sha256": "5dd2ec21b518167327b0bc576d69868e89ede59e336c309a643e062edf69dd05",
    "checks": 841,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset,\r\n\tinput tb_match,\r\n\toutput reg wavedrom_enable,\r\n\toutput reg[511:0] wavedrom_title\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\r\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\r\n\tendtask\r\n\r\n\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\t@(negedge clk);\r\n\r\n\t\twavedrom_start(\"Reset and counting\");\r\n\t\treset_test();\r\n\r\n\t\trepeat(3) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  output reg [3:0] q\r\n);\r\n\r\n  always @(posedge clk)\r\n    if (reset)\r\n      q <= 0;\r\n    else\r\n      q <= q+1;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.tb_match(1'b1),.wavedrom_enable(),.wavedrom_title());\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.q(gold_q));\nTopModule dut(.clk(clk),.reset(drive_reset),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob038_count15_prompt.txt": "5dd2ec21b518167327b0bc576d69868e89ede59e336c309a643e062edf69dd05",
        "dataset_spec-to-rtl/Prob038_count15_ref.sv": "78f018149954ca4fa2864f1bb962d1f85c8acc01fe067fcb52d9e7526c013d66",
        "dataset_spec-to-rtl/Prob038_count15_test.sv": "ec621347c00ecf662327c33fcc2686514cae4f52f84704ad805d484c1775c9df"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob039_always_if": {
    "id": "verilogeval-netlist-settled-v2:Prob039_always_if",
    "spec_sha256": "c4bb42d9d091e7ec7cfb84b7f01200f6b9f107d55f0595696e94f19895629ef4",
    "checks": 226,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,b,sel_b1, sel_b2,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t{a, b, sel_b1, sel_b2} <= 4'b000;\r\n\t\t@(negedge clk) wavedrom_start(\"\");\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0100;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1000;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1101;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0001;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0110;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1010;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1111;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0011;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0111;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1011;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1111;\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0011;\r\n\t\twavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,sel_b1,sel_b2} <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input sel_b1,\r\n  input sel_b2,\r\n  output out_assign,\r\n  output reg out_always\r\n);\r\n\r\n  assign out_assign = (sel_b1 & sel_b2) ? b : a;\r\n  always @(*) out_always = (sel_b1 & sel_b2) ? b : a;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_sel_b1; wire drive_sel_b1; assign #0.1 drive_sel_b1=raw_sel_b1;\nwire raw_sel_b2; wire drive_sel_b2; assign #0.1 drive_sel_b2=raw_sel_b2;\nwire gold_out_assign, dut_out_assign, raw_dut_out_assign; reg seen_out_assign='0;\nwire gold_out_always, dut_out_always, raw_dut_out_always; reg seen_out_always='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.sel_b1(raw_sel_b1),.sel_b2(raw_sel_b2),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.sel_b1(drive_sel_b1),.sel_b2(drive_sel_b2),.out_assign(gold_out_assign),.out_always(gold_out_always));\nTopModule dut(.a(drive_a),.b(drive_b),.sel_b1(drive_sel_b1),.sel_b2(drive_sel_b2),.out_assign(raw_dut_out_assign),.out_always(raw_dut_out_always));\nassign dut_out_assign=raw_dut_out_assign;\nassign dut_out_always=raw_dut_out_always;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_assign === 1'b0 || gold_out_assign === 1'b1) begin\nknown=1; seen_out_assign=1'b1;\nif(dut_out_assign !== gold_out_assign) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_always === 1'b0 || gold_out_always === 1'b1) begin\nknown=1; seen_out_always=1'b1;\nif(dut_out_always !== gold_out_always) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_assign) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_assign\");\nif((&seen_out_always) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_always\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob039_always_if_prompt.txt": "c4bb42d9d091e7ec7cfb84b7f01200f6b9f107d55f0595696e94f19895629ef4",
        "dataset_spec-to-rtl/Prob039_always_if_ref.sv": "a0294a751bccfdf816b7d876a4be621ef50f3992f729595570453cbdc9610264",
        "dataset_spec-to-rtl/Prob039_always_if_test.sv": "437d6b4457e9906327bad88f1642bf418b894871d553d4ab79440dd990bb8e9a"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob040_count10": {
    "id": "verilogeval-netlist-settled-v2:Prob040_count10",
    "spec_sha256": "e35cbdcf9ccefc9728dda97ac8aa8e1c3090f9565e006eda4c9edeb9d6acfe32",
    "checks": 877,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\twavedrom_start(\"Synchronous reset and counting\");\r\n\t\treset_test();\r\n\t\trepeat(12) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  output reg [3:0] q\r\n);\r\n\r\n  always @(posedge clk)\r\n    if (reset || q == 9)\r\n      q <= 0;\r\n    else\r\n      q <= q+1;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.q(gold_q));\nTopModule dut(.clk(clk),.reset(drive_reset),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob040_count10_prompt.txt": "e35cbdcf9ccefc9728dda97ac8aa8e1c3090f9565e006eda4c9edeb9d6acfe32",
        "dataset_spec-to-rtl/Prob040_count10_ref.sv": "6a28cdd1ae1cbc4faab5b7cbfe1f4e01834585633a1ec2e051de897fea411743",
        "dataset_spec-to-rtl/Prob040_count10_test.sv": "01022deff71a14634d19c6ebf75673ae678dcfbb6a23c13b27722042e991a3e4"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob042_vector4": {
    "id": "verilogeval-netlist-settled-v2:Prob042_vector4",
    "spec_sha256": "960005005f42da6b689047f157f08a76bf5f71609f5267f0616771e743e963fd",
    "checks": 198,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [7:0] in\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [7:0] in,\r\n  output [31:0] out\r\n);\r\n\r\n  assign out = { {24{in[7]}}, in };\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [31:0] gold_out, dut_out, raw_dut_out; reg [31:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in));\noracle_RefModule gold(.in(drive_in),.out(gold_out));\nTopModule dut(.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<32;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob042_vector4_prompt.txt": "960005005f42da6b689047f157f08a76bf5f71609f5267f0616771e743e963fd",
        "dataset_spec-to-rtl/Prob042_vector4_ref.sv": "477b65eeb96e4b20d59345490f043fe95f6498a4fb1adcfdd0e7aafae8924cd7",
        "dataset_spec-to-rtl/Prob042_vector4_test.sv": "bc9126b11d71f7b7cdb66b24be7de0a4ad050258e286d94cc78741a87fbfca3f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob043_vector5": {
    "id": "verilogeval-netlist-settled-v2:Prob043_vector5",
    "spec_sha256": "ed9d020b7d98d9d2b8d6bccdf2cc23cf4a863c8f31e4ada2c2c8eb650e4e007c",
    "checks": 198,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a, b, c, d, e\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,c,d,e} <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  input d,\r\n  input e,\r\n  output [24:0] out\r\n);\r\n\r\n  assign out = ~{ {5{a}}, {5{b}}, {5{c}}, {5{d}}, {5{e}} } ^ {5{a,b,c,d,e}};\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire raw_e; wire drive_e; assign #0.1 drive_e=raw_e;\nwire [24:0] gold_out, dut_out, raw_dut_out; reg [24:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.e(raw_e));\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<25;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob043_vector5_prompt.txt": "ed9d020b7d98d9d2b8d6bccdf2cc23cf4a863c8f31e4ada2c2c8eb650e4e007c",
        "dataset_spec-to-rtl/Prob043_vector5_ref.sv": "c87441bb7c8161e84f79972e59c395c2c3f67c604de4572d212f835b3765af98",
        "dataset_spec-to-rtl/Prob043_vector5_test.sv": "309f624bef8495d4b20be901d77f6cd38d75d3ec20246a7035e730f09ec6922c"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob044_vectorgates": {
    "id": "verilogeval-netlist-settled-v2:Prob044_vectorgates",
    "spec_sha256": "9bef13f60f115c43b5dae5f3e42ec2bff1aa378de853b669c8c534882d592dc0",
    "checks": 521,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg [2:0] a, b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101; begin\r\n\t\tint count; count = 6'h38;\r\n\t\t{b, a} <= 6'b0;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start();\r\n\t\trepeat(30) @(posedge clk)\r\n\t\t\t{b, a} <= count++;\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{b,a} <= $random(netlist_random_seed);\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [2:0] a,\r\n  input [2:0] b,\r\n  output [2:0] out_or_bitwise,\r\n  output out_or_logical,\r\n  output [5:0] out_not\r\n);\r\n\r\n  assign out_or_bitwise = a | b;\r\n  assign out_or_logical = a || b;\r\n  assign out_not = {~b,~a};\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [2:0] raw_a; wire [2:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [2:0] raw_b; wire [2:0] drive_b; assign #0.1 drive_b=raw_b;\nwire [2:0] gold_out_or_bitwise, dut_out_or_bitwise, raw_dut_out_or_bitwise; reg [2:0] seen_out_or_bitwise='0;\nwire gold_out_or_logical, dut_out_or_logical, raw_dut_out_or_logical; reg seen_out_or_logical='0;\nwire [5:0] gold_out_not, dut_out_not, raw_dut_out_not; reg [5:0] seen_out_not='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.out_or_bitwise(gold_out_or_bitwise),.out_or_logical(gold_out_or_logical),.out_not(gold_out_not));\nTopModule dut(.a(drive_a),.b(drive_b),.out_or_bitwise(raw_dut_out_or_bitwise),.out_or_logical(raw_dut_out_or_logical),.out_not(raw_dut_out_not));\nassign dut_out_or_bitwise=raw_dut_out_or_bitwise;\nassign dut_out_or_logical=raw_dut_out_or_logical;\nassign dut_out_not=raw_dut_out_not;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<3;b=b+1) begin\nif(gold_out_or_bitwise[b] === 1'b0 || gold_out_or_bitwise[b] === 1'b1) begin\nknown=1; seen_out_or_bitwise[b]=1'b1;\nif(dut_out_or_bitwise[b] !== gold_out_or_bitwise[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_or_logical === 1'b0 || gold_out_or_logical === 1'b1) begin\nknown=1; seen_out_or_logical=1'b1;\nif(dut_out_or_logical !== gold_out_or_logical) bad=1;\nend end\nfor(integer b=0;b<6;b=b+1) begin\nif(gold_out_not[b] === 1'b0 || gold_out_not[b] === 1'b1) begin\nknown=1; seen_out_not[b]=1'b1;\nif(dut_out_not[b] !== gold_out_not[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_or_bitwise) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_or_bitwise\");\nif((&seen_out_or_logical) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_or_logical\");\nif((&seen_out_not) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_not\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob044_vectorgates_prompt.txt": "9bef13f60f115c43b5dae5f3e42ec2bff1aa378de853b669c8c534882d592dc0",
        "dataset_spec-to-rtl/Prob044_vectorgates_ref.sv": "49641d41f2a1b98faca9d92c0d0ad81f4cc2fa403f8e43b43f122d9bc452000a",
        "dataset_spec-to-rtl/Prob044_vectorgates_test.sv": "70c78ae0d4164652707095bc847e353146c3dd55c119de31993c3828ce4d8abc"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob045_edgedetect2": {
    "id": "verilogeval-netlist-settled-v2:Prob045_edgedetect2",
    "spec_sha256": "a7463190c63aa3cdbc775c882a57516c70acb39ac2c02ca72db34274cf266a82",
    "checks": 450,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\tinput tb_match,\r\n\toutput reg [7:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\tin <= 0;\r\n\t\t@(posedge clk);\r\n\t\t@(negedge clk) wavedrom_start(\"\");\r\n\t\trepeat(2) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(4) @(negedge clk);\r\n\t\tin <= 6;\r\n\t\trepeat(2) @(negedge clk);\r\n\t\tin <= 0;\t\t\r\n\t\trepeat(2) @(posedge clk);\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\t\r\n\t\trepeat(200)\r\n\t\t\t@(posedge clk, negedge clk) in <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input [7:0] in,\r\n  output reg [7:0] anyedge\r\n);\r\n\r\n  reg [7:0] d_last;\r\n\r\n  always @(posedge clk) begin\r\n    d_last <= in;\r\n    anyedge <= in ^ d_last;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [7:0] gold_anyedge, dut_anyedge, raw_dut_anyedge; reg [7:0] seen_anyedge='0;\nstimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.in(drive_in),.anyedge(gold_anyedge));\nTopModule dut(.clk(clk),.in(drive_in),.anyedge(raw_dut_anyedge));\nassign dut_anyedge=raw_dut_anyedge;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_anyedge[b] === 1'b0 || gold_anyedge[b] === 1'b1) begin\nknown=1; seen_anyedge[b]=1'b1;\nif(dut_anyedge[b] !== gold_anyedge[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_anyedge) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:anyedge\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob045_edgedetect2_prompt.txt": "a7463190c63aa3cdbc775c882a57516c70acb39ac2c02ca72db34274cf266a82",
        "dataset_spec-to-rtl/Prob045_edgedetect2_ref.sv": "24763864d23b422768e7d6445cc992b492b8dd61c6b56a4479eebe6f407900b1",
        "dataset_spec-to-rtl/Prob045_edgedetect2_test.sv": "0a6b46401b15754c7f868715a4b91a055bfe3aca1ed91b922cc2e4427b44b320"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob046_dff8p": {
    "id": "verilogeval-netlist-settled-v2:Prob046_dff8p",
    "spec_sha256": "156459281cd86f0380b75c2bc092a24d61ce16f628b687104d9a0a2df8c2d726",
    "checks": 869,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg [7:0] d, output reg reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\t\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\t\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\td <= $random(netlist_random_seed);\r\n\t\t@(negedge clk);\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start(\"Synchronous active-high reset\");\r\n\t\treset_test();\r\n\t\trepeat(10) @(negedge clk)\r\n\t\t\td <= $random(netlist_random_seed);\r\n\t\twavedrom_stop();\r\n\r\n\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 15);\r\n\t\t\td <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input [7:0] d,\r\n  input reset,\r\n  output reg [7:0] q\r\n);\r\n\r\n  always @(negedge clk)\r\n    if (reset)\r\n      q <= 8'h34;\r\n    else\r\n      q <= d;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [7:0] raw_d; wire [7:0] drive_d; assign #0.1 drive_d=raw_d;\nwire [7:0] gold_q, dut_q, raw_dut_q; reg [7:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.d(drive_d),.q(gold_q));\nTopModule dut(.clk(clk),.reset(drive_reset),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob046_dff8p_prompt.txt": "156459281cd86f0380b75c2bc092a24d61ce16f628b687104d9a0a2df8c2d726",
        "dataset_spec-to-rtl/Prob046_dff8p_ref.sv": "2d1428d7f42320a03c6b1af6ad1100d416f4784ba913cdb7d7d86b03c005d538",
        "dataset_spec-to-rtl/Prob046_dff8p_test.sv": "96abe0040b51a16e9a2c6879f540e316d75c1890fbb1b3685085a4fa32f07f4f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob047_dff8ar": {
    "id": "verilogeval-netlist-settled-v2:Prob047_dff8ar",
    "spec_sha256": "bac3f40fd910c55f9e6ac97c33d094d546b2c151b4112283f429144381dc5335",
    "checks": 871,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg [7:0] d, output areset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\t\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\t\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\td <= $random(netlist_random_seed);\r\n\t\t@(negedge clk);\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start(\"Asynchronous active-high reset\");\r\n\t\treset_test(1);\r\n\t\trepeat(7) @(negedge clk) d <= $random(netlist_random_seed);\r\n\t\t@(posedge clk) reset <= 1;\r\n\t\t@(negedge clk) reset <= 0; d <= $random(netlist_random_seed);\r\n\t\trepeat(2) @(negedge clk) d <= $random(netlist_random_seed);\r\n\t\twavedrom_stop();\r\n\r\n\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 15);\r\n\t\t\td <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input [7:0] d,\r\n  input areset,\r\n  output reg [7:0] q\r\n);\r\n\r\n  always @(posedge clk, posedge areset)\r\n    if (areset)\r\n      q <= 0;\r\n    else\r\n      q <= d;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire [7:0] raw_d; wire [7:0] drive_d; assign #0.1 drive_d=raw_d;\nwire [7:0] gold_q, dut_q, raw_dut_q; reg [7:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.areset(raw_areset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.d(drive_d),.q(gold_q));\nTopModule dut(.clk(clk),.areset(drive_areset),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob047_dff8ar_prompt.txt": "bac3f40fd910c55f9e6ac97c33d094d546b2c151b4112283f429144381dc5335",
        "dataset_spec-to-rtl/Prob047_dff8ar_ref.sv": "b1d29ed5d508b016bf86d927264058c19b9750822071e2bd307879d33fad7ad4",
        "dataset_spec-to-rtl/Prob047_dff8ar_test.sv": "4b2dbea011909673a76b235992ffd9cb2b0f01ae6aefd65417147607c03dfe56"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob048_m2014_q4c": {
    "id": "verilogeval-netlist-settled-v2:Prob048_m2014_q4c",
    "spec_sha256": "5632284cd9679ba9134c13fad35739a3c0e3796a2201e9cc2aa956b8bc2ca6e6",
    "checks": 195,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic d, r\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{d,r} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input d,\r\n  input r,\r\n  output logic q\r\n);\r\n\r\n  always@(posedge clk) begin\r\n    if (r)\r\n      q <= 0;\r\n    else\r\n      q <= d;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire raw_r; wire drive_r; assign #0.1 drive_r=raw_r;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.r(raw_r));\noracle_RefModule gold(.clk(clk),.d(drive_d),.r(drive_r),.q(gold_q));\nTopModule dut(.clk(clk),.d(drive_d),.r(drive_r),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob048_m2014_q4c_prompt.txt": "5632284cd9679ba9134c13fad35739a3c0e3796a2201e9cc2aa956b8bc2ca6e6",
        "dataset_spec-to-rtl/Prob048_m2014_q4c_ref.sv": "22e4912b063a1691dec0ae7028be0ee0226426e3dc5ae327804601cafef05a51",
        "dataset_spec-to-rtl/Prob048_m2014_q4c_test.sv": "18331eb99345915acfd9960a7f2d5993acda9ef478b9515638c0d075b9d0a411"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob049_m2014_q4b": {
    "id": "verilogeval-netlist-settled-v2:Prob049_m2014_q4b",
    "spec_sha256": "bbb7593d8ee124c67fda335d54ac08f74d47671cea24d82d1bdd7422d19280ee",
    "checks": 195,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic d, ar\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{d,ar} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input d,\r\n  input ar,\r\n  output logic q\r\n);\r\n\r\n  always@(posedge clk or posedge ar) begin\r\n    if (ar)\r\n      q <= 0;\r\n    else\r\n      q <= d;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_ar; wire drive_ar; assign #0.1 drive_ar=raw_ar;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.ar(raw_ar));\noracle_RefModule gold(.clk(clk),.ar(drive_ar),.d(drive_d),.q(gold_q));\nTopModule dut(.clk(clk),.ar(drive_ar),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob049_m2014_q4b_prompt.txt": "bbb7593d8ee124c67fda335d54ac08f74d47671cea24d82d1bdd7422d19280ee",
        "dataset_spec-to-rtl/Prob049_m2014_q4b_ref.sv": "1cefabae454a5d76a75dccc0b59380a6362002948dc4ef04ceae4f334ebf7d92",
        "dataset_spec-to-rtl/Prob049_m2014_q4b_test.sv": "22d88b777157ed9289dca5ca50d9686a90ed8a7626da996d32b6bce1b50818af"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob050_kmap1": {
    "id": "verilogeval-netlist-settled-v2:Prob050_kmap1",
    "spec_sha256": "601db8cfec90de52bf90b4a355e229fddcf167727855e7183c59cc5de37a9299",
    "checks": 437,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a, b, c,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{a,b,c} <= 1'b0;\r\n\t\twavedrom_start();\r\n\t\trepeat(10) @(posedge clk)\r\n\t\t\t{a,b,c} <= count++;\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{c,b,a} <= $urandom;\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  output out\r\n);\r\n\r\n  assign out = (a | b | c);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob050_kmap1_prompt.txt": "601db8cfec90de52bf90b4a355e229fddcf167727855e7183c59cc5de37a9299",
        "dataset_spec-to-rtl/Prob050_kmap1_ref.sv": "fa5f92af27c536f8cafec0e2113a150faf01ce08932a448c1fb8ffac0b5c7d25",
        "dataset_spec-to-rtl/Prob050_kmap1_test.sv": "b7fa6e82e9c056077720bb5488bdc781336e436484c81b8d8808f702ca7b9f91"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob051_gates4": {
    "id": "verilogeval-netlist-settled-v2:Prob051_gates4",
    "spec_sha256": "1a02437f6a187afd0fdd6c6bf0e421db1cfa3a7ce7e8b6cca93b931bdd9d182a",
    "checks": 466,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [3:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\tin <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"All combinations\");\r\n\t\t\t@(posedge clk);\r\n\t\t\trepeat(15) @(posedge clk) in <= in + 1;\r\n\t\t@(negedge clk) wavedrom_stop();\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [3:0] in,\r\n  output out_and,\r\n  output out_or,\r\n  output out_xor\r\n);\r\n\r\n  assign out_and = &in;\r\n  assign out_or = |in;\r\n  assign out_xor = ^in;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [3:0] raw_in; wire [3:0] drive_in; assign #0.1 drive_in=raw_in;\nwire gold_out_and, dut_out_and, raw_dut_out_and; reg seen_out_and='0;\nwire gold_out_or, dut_out_or, raw_dut_out_or; reg seen_out_or='0;\nwire gold_out_xor, dut_out_xor, raw_dut_out_xor; reg seen_out_xor='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.out_and(gold_out_and),.out_or(gold_out_or),.out_xor(gold_out_xor));\nTopModule dut(.in(drive_in),.out_and(raw_dut_out_and),.out_or(raw_dut_out_or),.out_xor(raw_dut_out_xor));\nassign dut_out_and=raw_dut_out_and;\nassign dut_out_or=raw_dut_out_or;\nassign dut_out_xor=raw_dut_out_xor;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_and === 1'b0 || gold_out_and === 1'b1) begin\nknown=1; seen_out_and=1'b1;\nif(dut_out_and !== gold_out_and) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_or === 1'b0 || gold_out_or === 1'b1) begin\nknown=1; seen_out_or=1'b1;\nif(dut_out_or !== gold_out_or) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_xor === 1'b0 || gold_out_xor === 1'b1) begin\nknown=1; seen_out_xor=1'b1;\nif(dut_out_xor !== gold_out_xor) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_and) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_and\");\nif((&seen_out_or) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_or\");\nif((&seen_out_xor) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_xor\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob051_gates4_prompt.txt": "1a02437f6a187afd0fdd6c6bf0e421db1cfa3a7ce7e8b6cca93b931bdd9d182a",
        "dataset_spec-to-rtl/Prob051_gates4_ref.sv": "e130cf44669828fe85e5af37d8a12b2bce92bac9d943d165fc0760c589790d77",
        "dataset_spec-to-rtl/Prob051_gates4_test.sv": "3adf5e7721951be66e17291c7acd88d239d8b501b318e9cf9960bc2ede746146"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob052_gates100": {
    "id": "verilogeval-netlist-settled-v2:Prob052_gates100",
    "spec_sha256": "b086bb31deb2a932f63099803fb6a1953f971b93d47ca011c8314707cb637b60",
    "checks": 865,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\tinput tb_match,\r\n\toutput logic [99:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101; begin\r\n\t\treg [3:0] count; count = 0;\r\n\t\tin <= 100'h0;\r\n\t\t// AND gate uses huge numbers and creates a sparse waveform.\r\n\t\t@(negedge clk) wavedrom_start(\"Test AND gate\");\r\n\t\t\t@(posedge clk,negedge clk) in <= 100'h0;\t\t// Test OR gate\r\n\t\t\t@(posedge clk,negedge clk); in <= ~100'h0;\t\t// Test AND gate\r\n\t\t\t@(posedge clk,negedge clk); in <= 100'h3ffff;\t\r\n\t\t\t@(posedge clk,negedge clk); in <= ~100'h3ffff;\t\r\n\t\t\t@(posedge clk,negedge clk); in <= 100'h80;\t\t\r\n\t\t\t@(posedge clk,negedge clk); in <= ~100'h80;\t\t\r\n\t\twavedrom_stop();\r\n\r\n\t\t@(negedge clk) wavedrom_start(\"Test OR and XOR gates\");\r\n\t\t\t@(posedge clk) in <= 100'h0;\t\t// Test OR gate\r\n\t\t\t@(posedge clk); in <= 100'h7;\t\t// Test AND gate\r\n\t\t\trepeat(10) @(posedge clk, negedge clk) begin\r\n\t\t\t\tin <= count;\t\t\r\n\t\t\t\tcount <= count + 1;\r\n\t\t\tend\r\n\t\t\t@(posedge clk) in <= 100'h0;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\r\n\t\tin <= $random(netlist_random_seed);\r\n\t\trepeat(100) begin\r\n\t\t\t@(negedge clk) in <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk) in <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\tfor (int i=0;i<100;i++) begin\r\n\t\t\t@(negedge clk) in <= 100'h1<<i;\r\n\t\t\t@(posedge clk) in <= ~(100'h1<<i);\r\n\t\tend\r\n\t\t@(posedge clk) in <= 100'h0;\t\t// Test OR gate\r\n\t\t@(posedge clk); in <= ~100'h0;\t\t// Test AND gate\r\n\t\t@(posedge clk);\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [99:0] in,\r\n  output out_and,\r\n  output out_or,\r\n  output out_xor\r\n);\r\n\r\n  assign out_and = &in;\r\n  assign out_or = |in;\r\n  assign out_xor = ^in;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [99:0] raw_in; wire [99:0] drive_in; assign #0.1 drive_in=raw_in;\nwire gold_out_and, dut_out_and, raw_dut_out_and; reg seen_out_and='0;\nwire gold_out_or, dut_out_or, raw_dut_out_or; reg seen_out_or='0;\nwire gold_out_xor, dut_out_xor, raw_dut_out_xor; reg seen_out_xor='0;\nstimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.out_and(gold_out_and),.out_or(gold_out_or),.out_xor(gold_out_xor));\nTopModule dut(.in(drive_in),.out_and(raw_dut_out_and),.out_or(raw_dut_out_or),.out_xor(raw_dut_out_xor));\nassign dut_out_and=raw_dut_out_and;\nassign dut_out_or=raw_dut_out_or;\nassign dut_out_xor=raw_dut_out_xor;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_and === 1'b0 || gold_out_and === 1'b1) begin\nknown=1; seen_out_and=1'b1;\nif(dut_out_and !== gold_out_and) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_or === 1'b0 || gold_out_or === 1'b1) begin\nknown=1; seen_out_or=1'b1;\nif(dut_out_or !== gold_out_or) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_xor === 1'b0 || gold_out_xor === 1'b1) begin\nknown=1; seen_out_xor=1'b1;\nif(dut_out_xor !== gold_out_xor) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_and) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_and\");\nif((&seen_out_or) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_or\");\nif((&seen_out_xor) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_xor\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob052_gates100_prompt.txt": "b086bb31deb2a932f63099803fb6a1953f971b93d47ca011c8314707cb637b60",
        "dataset_spec-to-rtl/Prob052_gates100_ref.sv": "cba8f63385fd891c87da0f2c837b0131223d33c8188b5bc0a86eddb1ce10f85d",
        "dataset_spec-to-rtl/Prob052_gates100_test.sv": "657c5474732c707c5a8cd5399f6545bc3ff15f74d1e3a946dd472c43d9fb814f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob053_m2014_q4d": {
    "id": "xor-feedback-transition-v1:Prob053_m2014_q4d",
    "spec_sha256": "fccf8f0a46b486ed246763d41440e063018a0c02cc1909ecd18a1f6b3d792476",
    "checks": 192,
    "testbench": "`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0, in=0, expected; wire raw_dut_out, dut_out;\ninteger checks=0, mismatches=0, i;\nTopModule dut(.clk(clk), .in(in), .out(raw_dut_out));\nassign dut_out=raw_dut_out;\ntask sample; begin checks=checks+1; if(dut_out !== expected) mismatches=mismatches+1; end endtask\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\");\nif(dut_out !== 1'b0 && dut_out !== 1'b1) $fatal(1,\"NETLIST_INITIAL_STATE_UNKNOWN\");\nexpected=dut_out;\nfor(i=0;i<64;i=i+1) begin\nin=(i ^ (i>>1)) & 1; #1; sample();\nclk=1; expected=expected ^ in; #1; sample();\nclk=0; #1; sample();\nend\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches); $finish;\nend\nendmodule\n",
    "provenance": {
      "kind": "public_spec_xor_feedback_transition",
      "assets": {
        "dataset_spec-to-rtl/Prob053_m2014_q4d_prompt.txt": "fccf8f0a46b486ed246763d41440e063018a0c02cc1909ecd18a1f6b3d792476",
        "dataset_spec-to-rtl/Prob053_m2014_q4d_ref.sv": "d5e05361cc3264c67af368755c8324dfc0457e828a2c58a5d7c195962e6b6ab0",
        "dataset_spec-to-rtl/Prob053_m2014_q4d_test.sv": "5fe5886d5f0686fd52796e19e40feb86ba58e03f923aef10055f4642a5d57c14"
      },
      "unknown_reference_bits": "no reference mask; initial DUT state may be 0 or 1, never X/Z",
      "startup_ns": 101,
      "data_delay_ns": 1,
      "sample_offsets_ns": [
        1
      ],
      "stimulus_feedback": "initial_state_only_then_independent_recurrence",
      "seed": 1,
      "negative_control": "stuck_zero"
    }
  },
  "Prob054_edgedetect": {
    "id": "verilogeval-netlist-settled-v2:Prob054_edgedetect",
    "spec_sha256": "1e0f65e8213b8234cb4f96709731f15a79c2a94ac2721b312b7921f0656ae349",
    "checks": 452,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\tinput tb_match,\r\n\toutput reg [7:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\tin <= 0;\r\n\t\t@(posedge clk);\r\n\t\twavedrom_start(\"\");\r\n\t\trepeat(2) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(4) @(negedge clk);\r\n\t\tin <= 6;\r\n\t\trepeat(2) @(negedge clk);\r\n\t\tin <= 0;\t\t\r\n\t\trepeat(2) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(200)\r\n\t\t\t@(posedge clk, negedge clk) in <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input [7:0] in,\r\n  output reg [7:0] pedge\r\n);\r\n\r\n  reg [7:0] d_last;\r\n\r\n  always @(posedge clk) begin\r\n    d_last <= in;\r\n    pedge <= in & ~d_last;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [7:0] gold_pedge, dut_pedge, raw_dut_pedge; reg [7:0] seen_pedge='0;\nstimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.in(drive_in),.pedge(gold_pedge));\nTopModule dut(.clk(clk),.in(drive_in),.pedge(raw_dut_pedge));\nassign dut_pedge=raw_dut_pedge;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_pedge[b] === 1'b0 || gold_pedge[b] === 1'b1) begin\nknown=1; seen_pedge[b]=1'b1;\nif(dut_pedge[b] !== gold_pedge[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_pedge) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:pedge\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob054_edgedetect_prompt.txt": "1e0f65e8213b8234cb4f96709731f15a79c2a94ac2721b312b7921f0656ae349",
        "dataset_spec-to-rtl/Prob054_edgedetect_ref.sv": "f4096d6ba640b3227937104bd0ac0c63ad87c5c1c685514e2edcefaebce009ad",
        "dataset_spec-to-rtl/Prob054_edgedetect_test.sv": "73b5c244d565b43507db677af9218beed2cebfe49c60d871d564eb95f67f0925"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob055_conditional": {
    "id": "verilogeval-netlist-settled-v2:Prob055_conditional",
    "spec_sha256": "f9505205abbb6aa4f4659e43fee33d2ebbd26b20cc848f9040fb4bceda0c69d3",
    "checks": 222,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [7:0] a, b, c, d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n \tinitial begin #101;\r\n \t\t{a,b,c,d} <= {8'h1, 8'h2, 8'h3, 8'h4};\r\n \t\t@(negedge clk);\r\n \t\twavedrom_start();\r\n\t \t\t@(posedge clk) {a,b,c,d} <= {8'h1, 8'h2, 8'h3, 8'h4};\r\n\t \t\t@(posedge clk) {a,b,c,d} <= {8'h11, 8'h2, 8'h3, 8'h4};\r\n\t \t\t@(posedge clk) {a,b,c,d} <= {8'h11, 8'h12, 8'h3, 8'h4};\r\n\t \t\t@(posedge clk) {a,b,c,d} <= {8'h11, 8'h12, 8'h13, 8'h4};\r\n\t \t\t@(posedge clk) {a,b,c,d} <= {8'h11, 8'h12, 8'h13, 8'h14};\r\n \t\t@(negedge clk);\r\n \t\twavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,c,d} <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [7:0] a,\r\n  input [7:0] b,\r\n  input [7:0] c,\r\n  input [7:0] d,\r\n  output reg [7:0] min\r\n);\r\n\r\n  always_comb begin\r\n    min = a;\r\n    if (min > b) min = b;\r\n    if (min > c) min = c;\r\n    if (min > d) min = d;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_a; wire [7:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [7:0] raw_b; wire [7:0] drive_b; assign #0.1 drive_b=raw_b;\nwire [7:0] raw_c; wire [7:0] drive_c; assign #0.1 drive_c=raw_c;\nwire [7:0] raw_d; wire [7:0] drive_d; assign #0.1 drive_d=raw_d;\nwire [7:0] gold_min, dut_min, raw_dut_min; reg [7:0] seen_min='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.min(gold_min));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.min(raw_dut_min));\nassign dut_min=raw_dut_min;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_min[b] === 1'b0 || gold_min[b] === 1'b1) begin\nknown=1; seen_min[b]=1'b1;\nif(dut_min[b] !== gold_min[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_min) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:min\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob055_conditional_prompt.txt": "f9505205abbb6aa4f4659e43fee33d2ebbd26b20cc848f9040fb4bceda0c69d3",
        "dataset_spec-to-rtl/Prob055_conditional_ref.sv": "5fcad522775af472dc39e81d214689a092bbcc08b1ab089cbfe39c9086e0c622",
        "dataset_spec-to-rtl/Prob055_conditional_test.sv": "3d7e419ced6450c3bc3e38b94d85fefaee779d1f3dfc02db57ab3d2fa9009cd5"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob056_ece241_2013_q7": {
    "id": "verilogeval-netlist-settled-v2:Prob056_ece241_2013_q7",
    "spec_sha256": "a61bc9c128225150be5aa376eac5f847f251d3397078ce9de1cf8c6033b51803",
    "checks": 842,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic j, k,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\t{j,k} <= 1;\r\n\t\t\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) {j,k} <= 2'h1;\r\n\t\t\t@(posedge clk) {j,k} <= 2'h2;\r\n\t\t\t@(posedge clk) {j,k} <= 2'h3;\r\n\t\t\t@(posedge clk) {j,k} <= 2'h3;\r\n\t\t\t@(posedge clk) {j,k} <= 2'h3;\r\n\t\t\t@(posedge clk) {j,k} <= 2'h0;\r\n\t\t\t@(posedge clk) {j,k} <= 2'h0;\r\n\t\t\t@(posedge clk) {j,k} <= 2'h0;\r\n\t\t\t@(posedge clk) {j,k} <= 2'h2;\r\n\t\t\t@(posedge clk) {j,k} <= 2'h2;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(400) @(posedge clk, negedge clk)\r\n\t\t\t{j,k} <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input j,\r\n  input k,\r\n  output reg Q\r\n);\r\n\r\n  always @(posedge clk)\r\n    Q <= j&~Q | ~k&Q;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_j; wire drive_j; assign #0.1 drive_j=raw_j;\nwire raw_k; wire drive_k; assign #0.1 drive_k=raw_k;\nwire gold_Q, dut_Q, raw_dut_Q; reg seen_Q='0;\nstimulus_gen stim1(.clk(clk),.j(raw_j),.k(raw_k),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.j(drive_j),.k(drive_k),.Q(gold_Q));\nTopModule dut(.clk(clk),.j(drive_j),.k(drive_k),.Q(raw_dut_Q));\nassign dut_Q=raw_dut_Q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Q === 1'b0 || gold_Q === 1'b1) begin\nknown=1; seen_Q=1'b1;\nif(dut_Q !== gold_Q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_Q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob056_ece241_2013_q7_prompt.txt": "a61bc9c128225150be5aa376eac5f847f251d3397078ce9de1cf8c6033b51803",
        "dataset_spec-to-rtl/Prob056_ece241_2013_q7_ref.sv": "e7f7386f76727b34972b0f9dc576ab5d22db9c754041943fbfcc7c56bc6bdd85",
        "dataset_spec-to-rtl/Prob056_ece241_2013_q7_test.sv": "97669eea0b0f6fac8f8b9f19e1a1d0a473a3da1166b7177c9008b04bce25f69c"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob057_kmap2": {
    "id": "verilogeval-netlist-settled-v2:Prob057_kmap2",
    "spec_sha256": "74c12b4b8e4207af7a7b2a34df45b5ae111cb8f547f059d2bd2f9533e5e8418d",
    "checks": 463,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a, b, c, d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{a,b,c,d} <= 4'b0;\r\n\t\twavedrom_start();\r\n\t\trepeat(16) @(posedge clk)\r\n\t\t\t{a,b,c,d} <= count++;\t\t\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{d,c,b,a} <= $urandom;\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  input d,\r\n  output out\r\n);\r\n\r\n  assign out = (~c & ~b) | (~d&~a) | (a&c&d) | (b&c&d);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob057_kmap2_prompt.txt": "74c12b4b8e4207af7a7b2a34df45b5ae111cb8f547f059d2bd2f9533e5e8418d",
        "dataset_spec-to-rtl/Prob057_kmap2_ref.sv": "100dffe02ac4a3cf21ffd61650cf91b9bc3662f3af519ae4f2fbea74290be47d",
        "dataset_spec-to-rtl/Prob057_kmap2_test.sv": "98a6251e87ae3809e5312d689e9671f890af70b66e41bd7a2d2f1fc4f3cb42fc"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob058_alwaysblock2": {
    "id": "verilogeval-netlist-settled-v2:Prob058_alwaysblock2",
    "spec_sha256": "fd3d7f8a86c0ebb037ab4ef3d473e9730e8f4a4df3787858643c42b55a00d5b5",
    "checks": 437,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a, b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{a,b} <= 1'b0;\r\n\t\twavedrom_start(\"XOR gate\");\r\n\t\trepeat(10) @(posedge clk)\r\n\t\t\t{a,b} <= count++;\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{b,a} <= $urandom;\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input a,\r\n  input b,\r\n  output out_assign,\r\n  output reg out_always_comb,\r\n  output reg out_always_ff\r\n);\r\n\r\n  assign out_assign = a ^ b;\r\n  always @(*) out_always_comb = a ^ b;\r\n  always @(posedge clk) out_always_ff <= a ^ b;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire gold_out_assign, dut_out_assign, raw_dut_out_assign; reg seen_out_assign='0;\nwire gold_out_always_comb, dut_out_always_comb, raw_dut_out_always_comb; reg seen_out_always_comb='0;\nwire gold_out_always_ff, dut_out_always_ff, raw_dut_out_always_ff; reg seen_out_always_ff='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.a(drive_a),.b(drive_b),.out_assign(gold_out_assign),.out_always_comb(gold_out_always_comb),.out_always_ff(gold_out_always_ff));\nTopModule dut(.clk(clk),.a(drive_a),.b(drive_b),.out_assign(raw_dut_out_assign),.out_always_comb(raw_dut_out_always_comb),.out_always_ff(raw_dut_out_always_ff));\nassign dut_out_assign=raw_dut_out_assign;\nassign dut_out_always_comb=raw_dut_out_always_comb;\nassign dut_out_always_ff=raw_dut_out_always_ff;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_assign === 1'b0 || gold_out_assign === 1'b1) begin\nknown=1; seen_out_assign=1'b1;\nif(dut_out_assign !== gold_out_assign) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_always_comb === 1'b0 || gold_out_always_comb === 1'b1) begin\nknown=1; seen_out_always_comb=1'b1;\nif(dut_out_always_comb !== gold_out_always_comb) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_always_ff === 1'b0 || gold_out_always_ff === 1'b1) begin\nknown=1; seen_out_always_ff=1'b1;\nif(dut_out_always_ff !== gold_out_always_ff) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_assign) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_assign\");\nif((&seen_out_always_comb) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_always_comb\");\nif((&seen_out_always_ff) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_always_ff\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob058_alwaysblock2_prompt.txt": "fd3d7f8a86c0ebb037ab4ef3d473e9730e8f4a4df3787858643c42b55a00d5b5",
        "dataset_spec-to-rtl/Prob058_alwaysblock2_ref.sv": "8e8ff9b1fdacb3dc0a362b916b0ba32ef7d8472f76c2e5e77ce327bf0d4d2ca9",
        "dataset_spec-to-rtl/Prob058_alwaysblock2_test.sv": "eee3400d421604a2a82e26bcbc63a0b384986df95fa2e8ce3d436b43c2dac58d"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob059_wire4": {
    "id": "verilogeval-netlist-settled-v2:Prob059_wire4",
    "spec_sha256": "95d50a1183686577eb378ba1cbaa6098adf027c69206a332fa6742af2bd4dbb1",
    "checks": 434,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a, b, c,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\talways @(posedge clk, negedge clk)\r\n\t\t{a,b,c} <= $random(netlist_random_seed);\r\n\t\r\n\tinitial begin #101;\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\trepeat(8) @(posedge clk);\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(100) @(negedge clk);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  output w,\r\n  output x,\r\n  output y,\r\n  output z\r\n);\r\n\r\n  assign {w,x,y,z} = {a,b,b,c};\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire gold_w, dut_w, raw_dut_w; reg seen_w='0;\nwire gold_x, dut_x, raw_dut_x; reg seen_x='0;\nwire gold_y, dut_y, raw_dut_y; reg seen_y='0;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.w(gold_w),.x(gold_x),.y(gold_y),.z(gold_z));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.w(raw_dut_w),.x(raw_dut_x),.y(raw_dut_y),.z(raw_dut_z));\nassign dut_w=raw_dut_w;\nassign dut_x=raw_dut_x;\nassign dut_y=raw_dut_y;\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_w === 1'b0 || gold_w === 1'b1) begin\nknown=1; seen_w=1'b1;\nif(dut_w !== gold_w) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_x === 1'b0 || gold_x === 1'b1) begin\nknown=1; seen_x=1'b1;\nif(dut_x !== gold_x) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_y === 1'b0 || gold_y === 1'b1) begin\nknown=1; seen_y=1'b1;\nif(dut_y !== gold_y) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_w) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:w\");\nif((&seen_x) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:x\");\nif((&seen_y) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:y\");\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob059_wire4_prompt.txt": "95d50a1183686577eb378ba1cbaa6098adf027c69206a332fa6742af2bd4dbb1",
        "dataset_spec-to-rtl/Prob059_wire4_ref.sv": "757cd9d4c4a894a6a41708ed31cf6e6947c5ade48e86fdfb512ce749ece1bdb5",
        "dataset_spec-to-rtl/Prob059_wire4_test.sv": "9d7361e2f9543e21aada7b3f1c243ad98e80d8e9befc3d4743bca77f0a48ee78"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob060_m2014_q4k": {
    "id": "verilogeval-netlist-settled-v2:Prob060_m2014_q4k",
    "spec_sha256": "2611b0c88a6e2fb088100aa9ee4c120e2de6d6ce5803632c17aa1b265a1d6d6f",
    "checks": 593,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in, resetn\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\tresetn <= ($random(netlist_random_seed) & 7) != 0;\r\n\t\tend\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\tresetn <= ($random(netlist_random_seed) & 7) != 0;\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input resetn,\r\n  input in,\r\n  output out\r\n);\r\n\r\n  reg [3:0] sr;\r\n  always @(posedge clk) begin\r\n    if (~resetn)\r\n      sr <= '0;\r\n    else\r\n      sr <= {sr[2:0], in};\r\n  end\r\n\r\n  assign out = sr[3];\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_resetn; wire drive_resetn; assign #0.1 drive_resetn=raw_resetn;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.resetn(raw_resetn));\noracle_RefModule gold(.clk(clk),.resetn(drive_resetn),.in(drive_in),.out(gold_out));\nTopModule dut(.clk(clk),.resetn(drive_resetn),.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob060_m2014_q4k_prompt.txt": "2611b0c88a6e2fb088100aa9ee4c120e2de6d6ce5803632c17aa1b265a1d6d6f",
        "dataset_spec-to-rtl/Prob060_m2014_q4k_ref.sv": "6e4cb807821d589d9171970c71a73c26776f9ceb9029b688023002bfdb729342",
        "dataset_spec-to-rtl/Prob060_m2014_q4k_test.sv": "797efe177c7f1c26904a7d4d329579bbfd1018d0780d9083120ce441eb7595a7"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob061_2014_q4a": {
    "id": "verilogeval-netlist-settled-v2:Prob061_2014_q4a",
    "spec_sha256": "53f2dfacf6b2204c1e705909dec17bc6521368e849a5426a39aadbd7df6c3fc2",
    "checks": 387,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic w, R, E, L\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\t{w,R,E,L} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input w,\r\n  input R,\r\n  input E,\r\n  input L,\r\n  output reg Q\r\n);\r\n\r\n  always @(posedge clk)\r\n    if (L)\r\n      Q <= R;\r\n    else if (E)\r\n      Q <= w;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;\nwire raw_R; wire drive_R; assign #0.1 drive_R=raw_R;\nwire raw_E; wire drive_E; assign #0.1 drive_E=raw_E;\nwire raw_L; wire drive_L; assign #0.1 drive_L=raw_L;\nwire gold_Q, dut_Q, raw_dut_Q; reg seen_Q='0;\nstimulus_gen stim1(.clk(clk),.w(raw_w),.R(raw_R),.E(raw_E),.L(raw_L));\noracle_RefModule gold(.clk(clk),.w(drive_w),.R(drive_R),.E(drive_E),.L(drive_L),.Q(gold_Q));\nTopModule dut(.clk(clk),.w(drive_w),.R(drive_R),.E(drive_E),.L(drive_L),.Q(raw_dut_Q));\nassign dut_Q=raw_dut_Q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Q === 1'b0 || gold_Q === 1'b1) begin\nknown=1; seen_Q=1'b1;\nif(dut_Q !== gold_Q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_Q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob061_2014_q4a_prompt.txt": "53f2dfacf6b2204c1e705909dec17bc6521368e849a5426a39aadbd7df6c3fc2",
        "dataset_spec-to-rtl/Prob061_2014_q4a_ref.sv": "fd65ed21b3ee0ffe0351508df382c881360f68dcc35d48e1950ca1999f344da1",
        "dataset_spec-to-rtl/Prob061_2014_q4a_test.sv": "880aefee692d39245be7f132150989ec6f7d73f1ecd7446372491455e9a1e292"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob062_bugs_mux2": {
    "id": "verilogeval-netlist-settled-v2:Prob062_bugs_mux2",
    "spec_sha256": "5ad5285b165fa83ab78328347e819f6a0d99f3b3e10ef0a562f24520bc3390ee",
    "checks": 226,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic sel,\r\n\toutput logic [7:0] a, b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t{a, b, sel} <= '0;\r\n\t\t@(negedge clk) wavedrom_start(\"\");\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel} <= {8'haa, 8'hbb, 1'b0};\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel} <= {8'haa, 8'hbb, 1'b0};\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel} <= {8'haa, 8'hbb, 1'b1};\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel} <= {8'haa, 8'hbb, 1'b0};\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel} <= {8'haa, 8'hbb, 1'b1};\r\n\t\t\t@(posedge clk, negedge clk) {a,b,sel} <= {8'haa, 8'hbb, 1'b1};\r\n\t\t\t\r\n\t\t\t@(posedge clk, negedge clk) {a, b} <= {8'hff, 8'h00}; sel <= 1'b0;\r\n\t\t\t@(posedge clk, negedge clk) sel <= 1'b0;\r\n\t\t\t@(posedge clk, negedge clk) sel <= 1'b1;\r\n\t\t\t@(posedge clk, negedge clk) sel <= 1'b0;\r\n\t\t\t@(posedge clk, negedge clk) sel <= 1'b1;\r\n\t\t\t@(posedge clk, negedge clk) sel <= 1'b1;\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,sel} <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input sel,\r\n  input [7:0] a,\r\n  input [7:0] b,\r\n  output reg [7:0] out\r\n);\r\n\r\n  // assign out = (~sel & a) | (sel & b);\r\n  assign out = sel ? a : b;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_sel; wire drive_sel; assign #0.1 drive_sel=raw_sel;\nwire [7:0] raw_a; wire [7:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [7:0] raw_b; wire [7:0] drive_b; assign #0.1 drive_b=raw_b;\nwire [7:0] gold_out, dut_out, raw_dut_out; reg [7:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.sel(raw_sel),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.sel(drive_sel),.a(drive_a),.b(drive_b),.out(gold_out));\nTopModule dut(.sel(drive_sel),.a(drive_a),.b(drive_b),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob062_bugs_mux2_prompt.txt": "5ad5285b165fa83ab78328347e819f6a0d99f3b3e10ef0a562f24520bc3390ee",
        "dataset_spec-to-rtl/Prob062_bugs_mux2_ref.sv": "0b7d75ad23841f5f87f4faa86aa9bccd92491ca0ab70d2efb8e0b91870b0f8f4",
        "dataset_spec-to-rtl/Prob062_bugs_mux2_test.sv": "dcf290dbb549e7a3eb1205f2264f8d5a2503ca3fb3b55a558e23a50d03196975"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion",
      "public_interface_erratum": {
        "id": "p10-public-interface-062-v1",
        "approved_on": "2026-09-27",
        "spec_sha256": "5ad5285b165fa83ab78328347e819f6a0d99f3b3e10ef0a562f24520bc3390ee",
        "explanation": "The public prompt requires an 8-bit 2-to-1 mux, but its buggy example declares out as one bit. Interpret out as an eight-bit output; sel remains a one-bit input and a and b remain eight-bit inputs. This approved interface correction overrides only that output-width typo; the original prompt is preserved."
      }
    }
  },
  "Prob063_review2015_shiftcount": {
    "id": "verilogeval-netlist-settled-v2:Prob063_review2015_shiftcount",
    "spec_sha256": "86c123d4f254a2e111267bd5b2ae77b7bd1cd3a9098b09d32578e34bfea2fe8d",
    "checks": 4141,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg shift_ena, count_ena, data,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\tdata <= 0;\r\n\t\tshift_ena <= 1;\r\n\t\tcount_ena <= 0;\r\n\t\trepeat(5) @(posedge clk);\r\n\t\r\n\t\tdata <= 1;\r\n\t\tshift_ena <= 0;\r\n\t\tcount_ena <= 0;\r\n\t\t@(posedge clk);\r\n\t\twavedrom_start(\"Shift mode\");\r\n\t\t@(posedge clk) shift_ena <= 1;\r\n\t\trepeat(2) @(posedge clk) shift_ena <= 0;\r\n\t\t@(posedge clk) shift_ena <= 1;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\t@(posedge clk) data <= 0;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\r\n\t\tdata <= 1;\r\n\t\tshift_ena <= 1;\t\t\r\n\t\trepeat(4) @(posedge clk);\r\n\t\tshift_ena <= 0;\r\n\t\twavedrom_start(\"Count mode\");\r\n\t\t@(posedge clk) count_ena <= 1;\r\n\t\trepeat(2) @(posedge clk) count_ena <= 0;\r\n\t\t@(posedge clk) count_ena <= 1;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\t@(posedge clk) data <= 0;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\r\n\t\trepeat(2000) @(posedge clk, negedge clk) begin\r\n\t\t\t{shift_ena, count_ena} <= $unsigned($random(netlist_random_seed)) % 3;\r\n\t\t\tdata <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input shift_ena,\r\n  input count_ena,\r\n  input data,\r\n  output reg [3:0] q\r\n);\r\n\r\n  always @(posedge clk) begin\r\n    if (shift_ena)\r\n      q <= { q[2:0], data };\r\n    else if (count_ena)\r\n      q <= q - 1'b1;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_shift_ena; wire drive_shift_ena; assign #0.1 drive_shift_ena=raw_shift_ena;\nwire raw_count_ena; wire drive_count_ena; assign #0.1 drive_count_ena=raw_count_ena;\nwire raw_data; wire drive_data; assign #0.1 drive_data=raw_data;\nwire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.shift_ena(raw_shift_ena),.count_ena(raw_count_ena),.data(raw_data),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.shift_ena(drive_shift_ena),.count_ena(drive_count_ena),.data(drive_data),.q(gold_q));\nTopModule dut(.clk(clk),.shift_ena(drive_shift_ena),.count_ena(drive_count_ena),.data(drive_data),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob063_review2015_shiftcount_prompt.txt": "86c123d4f254a2e111267bd5b2ae77b7bd1cd3a9098b09d32578e34bfea2fe8d",
        "dataset_spec-to-rtl/Prob063_review2015_shiftcount_ref.sv": "c40044b872a4e92e4415c93beb5d9254b6c7da17b7760823ecf934bc5485935a",
        "dataset_spec-to-rtl/Prob063_review2015_shiftcount_test.sv": "7725be9180bbdcbc159b34bfacef527de62bdbb3b9406f5d17ffbf296e04686b"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob064_vector3": {
    "id": "verilogeval-netlist-settled-v2:Prob064_vector3",
    "spec_sha256": "a7737a95e033b220423ef899de14277b832c55a83a21dd730978adabe3056526",
    "checks": 250,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [4:0] a,b,c,d,e,f,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\tinitial begin #101;\r\n\t\twavedrom_start(\"\");\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= '0;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 1;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 2;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 4;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 8;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 'h10;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 'h20;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 'h40;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 'h80;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 'h100;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 'h200;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= 'h400;\r\n\t\t@(posedge clk) {a,b,c,d,e,f} <= {5'h1f, 5'h0, 5'h1f, 5'h0, 5'h1f, 5'h0};\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,c,d,e,f} <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [4:0] a,\r\n  input [4:0] b,\r\n  input [4:0] c,\r\n  input [4:0] d,\r\n  input [4:0] e,\r\n  input [4:0] f,\r\n  output [7:0] w,\r\n  output [7:0] x,\r\n  output [7:0] y,\r\n  output [7:0] z\r\n);\r\n\r\n  assign { w,x,y,z} = {a,b,c,d,e,f,2'b11};\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [4:0] raw_a; wire [4:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [4:0] raw_b; wire [4:0] drive_b; assign #0.1 drive_b=raw_b;\nwire [4:0] raw_c; wire [4:0] drive_c; assign #0.1 drive_c=raw_c;\nwire [4:0] raw_d; wire [4:0] drive_d; assign #0.1 drive_d=raw_d;\nwire [4:0] raw_e; wire [4:0] drive_e; assign #0.1 drive_e=raw_e;\nwire [4:0] raw_f; wire [4:0] drive_f; assign #0.1 drive_f=raw_f;\nwire [7:0] gold_w, dut_w, raw_dut_w; reg [7:0] seen_w='0;\nwire [7:0] gold_x, dut_x, raw_dut_x; reg [7:0] seen_x='0;\nwire [7:0] gold_y, dut_y, raw_dut_y; reg [7:0] seen_y='0;\nwire [7:0] gold_z, dut_z, raw_dut_z; reg [7:0] seen_z='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.e(raw_e),.f(raw_f),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.f(drive_f),.w(gold_w),.x(gold_x),.y(gold_y),.z(gold_z));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.f(drive_f),.w(raw_dut_w),.x(raw_dut_x),.y(raw_dut_y),.z(raw_dut_z));\nassign dut_w=raw_dut_w;\nassign dut_x=raw_dut_x;\nassign dut_y=raw_dut_y;\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_w[b] === 1'b0 || gold_w[b] === 1'b1) begin\nknown=1; seen_w[b]=1'b1;\nif(dut_w[b] !== gold_w[b]) bad=1;\nend end\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_x[b] === 1'b0 || gold_x[b] === 1'b1) begin\nknown=1; seen_x[b]=1'b1;\nif(dut_x[b] !== gold_x[b]) bad=1;\nend end\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_y[b] === 1'b0 || gold_y[b] === 1'b1) begin\nknown=1; seen_y[b]=1'b1;\nif(dut_y[b] !== gold_y[b]) bad=1;\nend end\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_z[b] === 1'b0 || gold_z[b] === 1'b1) begin\nknown=1; seen_z[b]=1'b1;\nif(dut_z[b] !== gold_z[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_w) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:w\");\nif((&seen_x) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:x\");\nif((&seen_y) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:y\");\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob064_vector3_prompt.txt": "a7737a95e033b220423ef899de14277b832c55a83a21dd730978adabe3056526",
        "dataset_spec-to-rtl/Prob064_vector3_ref.sv": "c12997cc872de9b1adfb7dd9b04890bb0fa2a478b24098ac5466dfbcb55e2c90",
        "dataset_spec-to-rtl/Prob064_vector3_test.sv": "be5b1614e978044bde91f29ebc53ac2b3ec5bc122b07164a234eb70959ba2f3a"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob065_7420": {
    "id": "verilogeval-netlist-settled-v2:Prob065_7420",
    "spec_sha256": "7f757650de1730d23f1fe06054fdbcd9defc10e01c0287cdb6b9deacfce43471",
    "checks": 477,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg p1a, p1b, p1c, p1d,\r\n\toutput reg p2a, p2b, p2c, p2d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{p1a,p1b,p1c,p1d} <= 4'h0;\t\t\r\n\t\t{p2a,p2b,p2c,p2d} <= 4'h0;\t\t\r\n\t\twavedrom_start(\"Two NAND gates\");\r\n\t\trepeat(20) @(posedge clk) begin\r\n\t\t\t{p1a,p1b,p1c,p1d} <= count;\t\t\r\n\t\t\t{p2a,p2b,p2c,p2d} <= count+1;\t\t\r\n\t\t\tcount = count + 1;\r\n\t\tend\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(200) @(posedge clk,negedge clk) begin\r\n\t\t\t{p1a,p1b,p1c,p1d,p2a,p2b,p2c,p2d} <= $random(netlist_random_seed);\t\t\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input p1a,\r\n  input p1b,\r\n  input p1c,\r\n  input p1d,\r\n  output p1y,\r\n  input p2a,\r\n  input p2b,\r\n  input p2c,\r\n  input p2d,\r\n  output p2y\r\n);\r\n\r\n  assign p1y = ~&( {p1a, p1b, p1c, p1d} );\r\n  assign p2y = ~&( {p2a, p2b, p2c, p2d} );\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_p1a; wire drive_p1a; assign #0.1 drive_p1a=raw_p1a;\nwire raw_p1b; wire drive_p1b; assign #0.1 drive_p1b=raw_p1b;\nwire raw_p1c; wire drive_p1c; assign #0.1 drive_p1c=raw_p1c;\nwire raw_p1d; wire drive_p1d; assign #0.1 drive_p1d=raw_p1d;\nwire raw_p2a; wire drive_p2a; assign #0.1 drive_p2a=raw_p2a;\nwire raw_p2b; wire drive_p2b; assign #0.1 drive_p2b=raw_p2b;\nwire raw_p2c; wire drive_p2c; assign #0.1 drive_p2c=raw_p2c;\nwire raw_p2d; wire drive_p2d; assign #0.1 drive_p2d=raw_p2d;\nwire gold_p1y, dut_p1y, raw_dut_p1y; reg seen_p1y='0;\nwire gold_p2y, dut_p2y, raw_dut_p2y; reg seen_p2y='0;\nstimulus_gen stim1(.clk(clk),.p1a(raw_p1a),.p1b(raw_p1b),.p1c(raw_p1c),.p1d(raw_p1d),.p2a(raw_p2a),.p2b(raw_p2b),.p2c(raw_p2c),.p2d(raw_p2d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.p1a(drive_p1a),.p1b(drive_p1b),.p1c(drive_p1c),.p1d(drive_p1d),.p2a(drive_p2a),.p2b(drive_p2b),.p2c(drive_p2c),.p2d(drive_p2d),.p1y(gold_p1y),.p2y(gold_p2y));\nTopModule dut(.p1a(drive_p1a),.p1b(drive_p1b),.p1c(drive_p1c),.p1d(drive_p1d),.p2a(drive_p2a),.p2b(drive_p2b),.p2c(drive_p2c),.p2d(drive_p2d),.p1y(raw_dut_p1y),.p2y(raw_dut_p2y));\nassign dut_p1y=raw_dut_p1y;\nassign dut_p2y=raw_dut_p2y;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_p1y === 1'b0 || gold_p1y === 1'b1) begin\nknown=1; seen_p1y=1'b1;\nif(dut_p1y !== gold_p1y) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_p2y === 1'b0 || gold_p2y === 1'b1) begin\nknown=1; seen_p2y=1'b1;\nif(dut_p2y !== gold_p2y) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_p1y) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:p1y\");\nif((&seen_p2y) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:p2y\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob065_7420_prompt.txt": "7f757650de1730d23f1fe06054fdbcd9defc10e01c0287cdb6b9deacfce43471",
        "dataset_spec-to-rtl/Prob065_7420_ref.sv": "6db58d33f8ab2597bb9e1102ae873ba42e3949d0216f7fd36e57f9971ce64400",
        "dataset_spec-to-rtl/Prob065_7420_test.sv": "534c9cb45ed87c5cc9fb39b19408da298aec0b7fae870b1e8610374b48de748c"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob066_edgecapture": {
    "id": "verilogeval-netlist-settled-v2:Prob066_edgecapture",
    "spec_sha256": "01a805fa7ce22c519fe819e2ac12906cb7a40f62b16e319c67c7b57bbd089a9a",
    "checks": 530,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\tinput tb_match,\r\n\toutput reg [31:0] in,\r\n\toutput reg reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\tin <= 0;\r\n\t\treset <= 1;\r\n\t\t@(posedge clk);\r\n\t\treset <= 1;\r\n\t\tin = 0;\r\n\t\t@(negedge clk) wavedrom_start(\"Example\");\r\n\t\trepeat(1) @(posedge clk);\r\n\t\treset = 0;\r\n\t\t@(posedge clk) in = 32'h2;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\tin = 32'he;\r\n\t\trepeat(2) @(posedge clk);\r\n\t\tin = 0;\r\n\t\t@(posedge clk) in = 32'h2;\r\n\t\trepeat(2) @(posedge clk);\r\n\t\treset = 1;\r\n\t\t@(posedge clk);\r\n\t\treset = 0; in = 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\r\n\r\n\t\t@(negedge clk) wavedrom_start(\"\");\r\n\t\trepeat(2) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\trepeat(2) @(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(2) @(negedge clk);\r\n\t\tin <= 6;\r\n\t\trepeat(1) @(negedge clk);\r\n\t\tin <= 0;\t\t\r\n\t\trepeat(2) @(posedge clk);\r\n\t\tin <= 32'h10;\t\t\r\n\t\trepeat(2) @(posedge clk);\r\n\t\treset <= 1;\r\n\t\trepeat(1) @(posedge clk);\r\n\t\tin <= 32'h0;\r\n\t\trepeat(1) @(posedge clk);\r\n\t\treset <= 0;\r\n\t\trepeat(1) @(posedge clk);\r\n\t\treset <= 1;\r\n\t\tin <= 32'h20;\r\n\t\trepeat(1) @(posedge clk);\r\n\t\treset <= 0;\r\n\t\tin <= 32'h00;\r\n\t\r\n\t\trepeat(2) @(posedge clk);\r\n\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\r\n\t\trepeat(200)\r\n\t\t\t@(posedge clk, negedge clk) begin\r\n\t\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\t\treset <= !($random(netlist_random_seed) & 15);\r\n\t\t\tend\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input [31:0] in,\r\n  output reg [31:0] out\r\n);\r\n\r\n  reg [31:0] d_last;\r\n\r\n  always @(posedge clk) begin\r\n    d_last <= in;\r\n    if (reset)\r\n      out <= '0;\r\n    else\r\n      out <= out | (~in & d_last);\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [31:0] raw_in; wire [31:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [31:0] gold_out, dut_out, raw_dut_out; reg [31:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.out(gold_out));\nTopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<32;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob066_edgecapture_prompt.txt": "01a805fa7ce22c519fe819e2ac12906cb7a40f62b16e319c67c7b57bbd089a9a",
        "dataset_spec-to-rtl/Prob066_edgecapture_ref.sv": "46262e70abd1f0b782cd27a872a8be83954dae25562dd18b18fe5baa2bcee665",
        "dataset_spec-to-rtl/Prob066_edgecapture_test.sv": "f49f2b7483ed57e92b2d51753059ab5af7e35e6f8c480f46fad8f66d5da54235"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob067_countslow": {
    "id": "verilogeval-netlist-settled-v2:Prob067_countslow",
    "spec_sha256": "0e52e944ab3376ae4023337629301ee23f937572586c56a9ae1e1712b6847c97",
    "checks": 997,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg slowena,\r\n\toutput reg reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\t\r\n\treg hint1;\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tslowena <= 1;\r\n\t\twavedrom_start(\"Synchronous reset and counting.\");\r\n\t\treset_test();\r\n\t\trepeat(12) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t@(posedge clk);\r\n\r\n\t\t//wavedrom_start(\"Testing.\");\r\n\t\treset <= 1;\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\trepeat(9) @(posedge clk);\r\n\t\tslowena <= 0;\r\n\t\t@(negedge clk) hint1 = tb_match;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\tif (hint1 && !tb_match) begin\r\n\t\t\t$display (\"Hint: What is supposed to happen when the counter is 9 and not enabled?\");\r\n\t\tend\r\n\t\t//wavedrom_stop();\r\n\t\tslowena <= 1;\r\n\t\treset <= 1;\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\r\n\r\n\t\twavedrom_start(\"Enable/disable\");\r\n\t\trepeat(15) @(posedge clk) slowena <= !($random(netlist_random_seed) & 1);\r\n\t\twavedrom_stop();\r\n\t\t@(posedge clk);\r\n\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\tslowena <= !($random(netlist_random_seed)&3);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input slowena,\r\n  input reset,\r\n  output reg [3:0] q\r\n);\r\n\r\n  always @(posedge clk)\r\n    if (reset)\r\n      q <= 0;\r\n    else if (slowena) begin\r\n      if (q == 9)\r\n        q <= 0;\r\n      else\r\n        q <= q+1;\r\n    end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_slowena; wire drive_slowena; assign #0.1 drive_slowena=raw_slowena;\nwire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.slowena(raw_slowena),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.slowena(drive_slowena),.q(gold_q));\nTopModule dut(.clk(clk),.reset(drive_reset),.slowena(drive_slowena),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob067_countslow_prompt.txt": "0e52e944ab3376ae4023337629301ee23f937572586c56a9ae1e1712b6847c97",
        "dataset_spec-to-rtl/Prob067_countslow_ref.sv": "a979e4f830c00637b61d59a72f7322d7fc285f126bcab069f8e131ab05889fd2",
        "dataset_spec-to-rtl/Prob067_countslow_test.sv": "93723f39d007e5e8fc60afe8397159cc3f5b67c4a9ce5bd69a80e4f7dbbce683"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob068_countbcd": {
    "id": "verilogeval-netlist-settled-v2:Prob068_countbcd",
    "spec_sha256": "75e070ed5913e5c051294d124aa7f3b7112c61066dff96c28c712a0dcf91e85e",
    "checks": 79609,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\treset_test();\r\n\t\trepeat(2) @(posedge clk);\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start(\"Counting\");\r\n\t\t\trepeat(12) @(posedge clk);\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(71) @(posedge clk);\r\n\t\t@(negedge clk) wavedrom_start(\"100 rollover\");\r\n\t\t\trepeat(16) @(posedge clk);\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(400) @(posedge clk, negedge clk)\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\trepeat(19590) @(posedge clk);\r\n\t\treset <= 1'b1;\r\n\t\trepeat(5) @(posedge clk);\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  output [3:1] ena,\r\n  output reg [15:0] q\r\n);\r\n\r\n  wire [3:0] enable = { q[11:0]==12'h999, q[7:0]==8'h99, q[3:0] == 4'h9, 1'b1};\r\n  assign ena = enable[3:1];\r\n  always @(posedge clk)\r\n    for (int i=0;i<4;i++) begin\r\n      if (reset || (q[i*4 +:4] == 9 && enable[i]))\r\n        q[i*4 +:4] <= 0;\r\n      else if (enable[i])\r\n        q[i*4 +:4] <= q[i*4 +:4]+1;\r\n    end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [2:0] gold_ena, dut_ena, raw_dut_ena; reg [2:0] seen_ena='0;\nwire [15:0] gold_q, dut_q, raw_dut_q; reg [15:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.ena(gold_ena),.q(gold_q));\nTopModule dut(.clk(clk),.reset(drive_reset),.ena(raw_dut_ena),.q(raw_dut_q));\nassign dut_ena=raw_dut_ena;\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<3;b=b+1) begin\nif(gold_ena[b] === 1'b0 || gold_ena[b] === 1'b1) begin\nknown=1; seen_ena[b]=1'b1;\nif(dut_ena[b] !== gold_ena[b]) bad=1;\nend end\nfor(integer b=0;b<16;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_ena) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:ena\");\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob068_countbcd_prompt.txt": "75e070ed5913e5c051294d124aa7f3b7112c61066dff96c28c712a0dcf91e85e",
        "dataset_spec-to-rtl/Prob068_countbcd_ref.sv": "643bf6af917813dabe7fea9683590ac6373c526db15d590dc04d5d7ceca39590",
        "dataset_spec-to-rtl/Prob068_countbcd_test.sv": "bc8c4c620660972e35a5306a81dbddba521ac0a99bc2fd87992146552c05870a"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob069_truthtable1": {
    "id": "verilogeval-netlist-settled-v2:Prob069_truthtable1",
    "spec_sha256": "aca10021e2aec52a9102d4a0576ec2679e3f24afbab4d3f8c84ea0f8ad8aa3ec",
    "checks": 114,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg x3, x2, x1,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\t{x3, x2, x1} <= 3'h7;\r\n\t\t@(negedge clk) wavedrom_start(\"All 8 input combinations\");\r\n\t\trepeat(8) @(posedge clk) {x3, x2, x1} <= {x3, x2, x1} + 1'b1;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(40) @(posedge clk, negedge clk);\r\n\t\t{x3, x2, x1} <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input x3,\r\n  input x2,\r\n  input x1,\r\n  output f\r\n);\r\n\r\n  assign f = ( ~x3 & x2 & ~x1 ) |\r\n        ( ~x3 & x2 & x1 ) |\r\n        ( x3 & ~x2 & x1 ) |\r\n        ( x3 & x2 & x1 ) ;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_x3; wire drive_x3; assign #0.1 drive_x3=raw_x3;\nwire raw_x2; wire drive_x2; assign #0.1 drive_x2=raw_x2;\nwire raw_x1; wire drive_x1; assign #0.1 drive_x1=raw_x1;\nwire gold_f, dut_f, raw_dut_f; reg seen_f='0;\nstimulus_gen stim1(.clk(clk),.x3(raw_x3),.x2(raw_x2),.x1(raw_x1),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.x3(drive_x3),.x2(drive_x2),.x1(drive_x1),.f(gold_f));\nTopModule dut(.x3(drive_x3),.x2(drive_x2),.x1(drive_x1),.f(raw_dut_f));\nassign dut_f=raw_dut_f;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_f === 1'b0 || gold_f === 1'b1) begin\nknown=1; seen_f=1'b1;\nif(dut_f !== gold_f) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_f) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:f\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob069_truthtable1_prompt.txt": "aca10021e2aec52a9102d4a0576ec2679e3f24afbab4d3f8c84ea0f8ad8aa3ec",
        "dataset_spec-to-rtl/Prob069_truthtable1_ref.sv": "d15b534604e9f26d3067d00b8e28fc8fc84379d328458ebb30cd361999ae003c",
        "dataset_spec-to-rtl/Prob069_truthtable1_test.sv": "577a4b314ff79a26ab9032410040b15cdb92c5d3f496b2850c84d9d05174a954"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob070_ece241_2013_q2": {
    "id": "verilogeval-netlist-settled-v2:Prob070_ece241_2013_q2",
    "spec_sha256": "5776e299fb686dbe8ec42745406986ca3d5c501196f3283fbdce4a8eb469229a",
    "checks": 212,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a, b, c, d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tbit fail = 0;\r\n\tbit fail1 = 0;\r\n\talways @(posedge clk, negedge clk)\r\n\t\tif (!tb_match)\r\n\t\t\tfail = 1;\r\n\r\n\tinitial begin #101;\r\n\t\t@(posedge clk) {a,b,c,d} <= 0;\r\n\t\t@(posedge clk) {a,b,c,d} <= 1;\r\n\t\t@(posedge clk) {a,b,c,d} <= 2;\r\n\t\t@(posedge clk) {a,b,c,d} <= 4;\r\n\t\t@(posedge clk) {a,b,c,d} <= 5;\r\n\t\t@(posedge clk) {a,b,c,d} <= 6;\r\n\t\t@(posedge clk) {a,b,c,d} <= 7;\r\n\t\t@(posedge clk) {a,b,c,d} <= 9;\r\n\t\t@(posedge clk) {a,b,c,d} <= 10;\r\n\t\t@(posedge clk) {a,b,c,d} <= 13;\r\n\t\t@(posedge clk) {a,b,c,d} <= 14;\r\n\t\t@(posedge clk) {a,b,c,d} <= 15;\r\n\t\t@(posedge clk) fail1 = fail;\r\n\t\t\r\n\t\t\r\n\t\t\t\t\r\n\t\t\r\n\t\t//@(negedge clk) wavedrom_start();\r\n\t\t\tfor (int i=0;i<16;i++)\r\n\t\t\t\t@(posedge clk)\r\n\t\t\t\t\t{a,b,c,d} <= i;\r\n\t\t//@(negedge clk) wavedrom_stop();\r\n\t\t\r\n\t\trepeat(50) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,c,d} <= $random(netlist_random_seed);\r\n\t\t\t\r\n\t\tif (fail && ~fail1)\r\n\t\t\t$display(\"Hint: Your circuit passes on the 12 required input combinations, but doesn't match the don't-care cases. Are you using minimal SOP and POS?\");\r\n\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  input d,\r\n  output out_sop,\r\n  output out_pos\r\n);\r\n\r\n  wire pos0, pos1;\r\n  assign out_sop = c&d | ~a&~b&c;\r\n  assign pos0 = c & (~b|d)&(~a|b);\r\n  assign pos1 = c & (~b|d)&(~a|d);\r\n\r\n  assign out_pos = (pos0 == pos1) ? pos0 : 1'bx;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_out_sop, dut_out_sop, raw_dut_out_sop; reg seen_out_sop='0;\nwire gold_out_pos, dut_out_pos, raw_dut_out_pos; reg seen_out_pos='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out_sop(gold_out_sop),.out_pos(gold_out_pos));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out_sop(raw_dut_out_sop),.out_pos(raw_dut_out_pos));\nassign dut_out_sop=raw_dut_out_sop;\nassign dut_out_pos=raw_dut_out_pos;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_sop === 1'b0 || gold_out_sop === 1'b1) begin\nknown=1; seen_out_sop=1'b1;\nif(dut_out_sop !== gold_out_sop) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_pos === 1'b0 || gold_out_pos === 1'b1) begin\nknown=1; seen_out_pos=1'b1;\nif(dut_out_pos !== gold_out_pos) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_sop) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_sop\");\nif((&seen_out_pos) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_pos\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob070_ece241_2013_q2_prompt.txt": "5776e299fb686dbe8ec42745406986ca3d5c501196f3283fbdce4a8eb469229a",
        "dataset_spec-to-rtl/Prob070_ece241_2013_q2_ref.sv": "fc6164740f1b120c47c9f65f18885283c7a3ebe97746d51a8a32380c49a4a7b1",
        "dataset_spec-to-rtl/Prob070_ece241_2013_q2_test.sv": "b951122311f079616b09904de5eeb3f5038f7865ec78d3b6fdb91209599c44f6"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob071_always_casez": {
    "id": "verilogeval-netlist-settled-v2:Prob071_always_casez",
    "spec_sha256": "8df74c45cf0018ba09199444a95eda740e970d9b0be681c4a6c977b235967052",
    "checks": 686,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [7:0] in, \r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(negedge clk) wavedrom_start(\"Priority encoder\");\r\n\t\t\t@(posedge clk) in <= 8'h1;\r\n\t\t\trepeat(8) @(posedge clk) in <= in << 1;\r\n\t\t\tin <= 8'h10;\r\n\t\t\trepeat(8) @(posedge clk) in <= in + 1;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\r\n\t\trepeat(50) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $urandom;\r\n\t\tend\r\n\t\trepeat(260) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= in + 1;\r\n\t\tend\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [7:0] in,\r\n  output reg [2:0] pos\r\n);\r\n\r\n  always @(*) begin\r\n    casez (in)\r\n      default : pos = 2'h0;\r\n      8'bzzzzzzz1: pos = 3'h0;\r\n      8'bzzzzzz1z: pos = 3'h1;\r\n      8'bzzzzz1zz: pos = 3'h2;\r\n      8'bzzzz1zzz: pos = 3'h3;\r\n      8'bzzz1zzzz: pos = 3'h4;\r\n      8'bzz1zzzzz: pos = 3'h5;\r\n      8'bz1zzzzzz: pos = 3'h6;\r\n      8'b1zzzzzzz: pos = 3'h7;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [2:0] gold_pos, dut_pos, raw_dut_pos; reg [2:0] seen_pos='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.pos(gold_pos));\nTopModule dut(.in(drive_in),.pos(raw_dut_pos));\nassign dut_pos=raw_dut_pos;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<3;b=b+1) begin\nif(gold_pos[b] === 1'b0 || gold_pos[b] === 1'b1) begin\nknown=1; seen_pos[b]=1'b1;\nif(dut_pos[b] !== gold_pos[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_pos) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:pos\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob071_always_casez_prompt.txt": "8df74c45cf0018ba09199444a95eda740e970d9b0be681c4a6c977b235967052",
        "dataset_spec-to-rtl/Prob071_always_casez_ref.sv": "d17c271ff52815727b5b3ea4d1304c78c78f40ec25a0b27eba934bf8931bbb85",
        "dataset_spec-to-rtl/Prob071_always_casez_test.sv": "66ed435c81c826e7dab14fb4cf9133c7b06bc481580e6e246b365753d7aae4a6"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob072_thermostat": {
    "id": "verilogeval-netlist-settled-v2:Prob072_thermostat",
    "spec_sha256": "412b3ebadfa9c185d597bc87ba6317986859163a2f7ade9c606c4f91a7e7f012",
    "checks": 495,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg too_cold, too_hot, mode, fan_on,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\t{too_cold, too_hot, mode, fan_on} <= 4'b0010;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start(\"Winter\");\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0010;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0010;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1010;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1011;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0010;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0011;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0010;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0110;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1110;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0111;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1111;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\r\n\t\t{too_cold, too_hot, mode, fan_on} <= 4'b0000;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start(\"Summer\");\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0000;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0000;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0100;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0101;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0000;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0001;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b0000;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1000;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1100;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1001;\r\n\t\t\t@(posedge clk) {too_cold, too_hot, mode, fan_on} <= 4'b1101;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\r\n\t\trepeat(200)\r\n\t\t\t@(posedge clk, negedge clk) {too_cold, too_hot, mode, fan_on} <= $random(netlist_random_seed);\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input mode,\r\n  input too_cold,\r\n  input too_hot,\r\n  input fan_on,\r\n  output heater,\r\n  output aircon,\r\n  output fan\r\n);\r\n\r\n  assign fan = (mode ? too_cold : too_hot) | fan_on;\r\n  assign heater = (mode & too_cold);\r\n  assign aircon = (~mode & too_hot);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_mode; wire drive_mode; assign #0.1 drive_mode=raw_mode;\nwire raw_too_cold; wire drive_too_cold; assign #0.1 drive_too_cold=raw_too_cold;\nwire raw_too_hot; wire drive_too_hot; assign #0.1 drive_too_hot=raw_too_hot;\nwire raw_fan_on; wire drive_fan_on; assign #0.1 drive_fan_on=raw_fan_on;\nwire gold_heater, dut_heater, raw_dut_heater; reg seen_heater='0;\nwire gold_aircon, dut_aircon, raw_dut_aircon; reg seen_aircon='0;\nwire gold_fan, dut_fan, raw_dut_fan; reg seen_fan='0;\nstimulus_gen stim1(.clk(clk),.too_cold(raw_too_cold),.too_hot(raw_too_hot),.mode(raw_mode),.fan_on(raw_fan_on),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.mode(drive_mode),.too_cold(drive_too_cold),.too_hot(drive_too_hot),.fan_on(drive_fan_on),.heater(gold_heater),.aircon(gold_aircon),.fan(gold_fan));\nTopModule dut(.mode(drive_mode),.too_cold(drive_too_cold),.too_hot(drive_too_hot),.fan_on(drive_fan_on),.heater(raw_dut_heater),.aircon(raw_dut_aircon),.fan(raw_dut_fan));\nassign dut_heater=raw_dut_heater;\nassign dut_aircon=raw_dut_aircon;\nassign dut_fan=raw_dut_fan;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_heater === 1'b0 || gold_heater === 1'b1) begin\nknown=1; seen_heater=1'b1;\nif(dut_heater !== gold_heater) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_aircon === 1'b0 || gold_aircon === 1'b1) begin\nknown=1; seen_aircon=1'b1;\nif(dut_aircon !== gold_aircon) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_fan === 1'b0 || gold_fan === 1'b1) begin\nknown=1; seen_fan=1'b1;\nif(dut_fan !== gold_fan) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_heater) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:heater\");\nif((&seen_aircon) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:aircon\");\nif((&seen_fan) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:fan\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob072_thermostat_prompt.txt": "412b3ebadfa9c185d597bc87ba6317986859163a2f7ade9c606c4f91a7e7f012",
        "dataset_spec-to-rtl/Prob072_thermostat_ref.sv": "3021fc38db6834cedcd138daf1e3fb7322bd1e696087e904e8ba06a8d98859b9",
        "dataset_spec-to-rtl/Prob072_thermostat_test.sv": "ee15f84e23efafecf03c05d6c46aa032386a54c34eba30fb55024ff4c068da53"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob073_dff16e": {
    "id": "verilogeval-netlist-settled-v2:Prob073_dff16e",
    "spec_sha256": "dd36b0b9070f2bf6659c64146f580852d86851ea9d7d39f50d50ee246e28924d",
    "checks": 885,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg [15:0] d, output reg [1:0] byteena,\r\n\toutput reg resetn,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign resetn = ~reset;\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tbyteena <= 2'b11;\r\n\t\td <= 16'habcd;\r\n\t\t@(posedge clk);\r\n\t\twavedrom_start(\"Synchronous active-low reset\");\r\n\t\treset_test(0);\r\n\t\trepeat(2) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\t\r\n\t\tbyteena <= 2'b11;\r\n\t\td <= $random(netlist_random_seed);\r\n\t\t@(posedge clk);\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start(\"DFF with byte enables\");\r\n\t\trepeat(10) @(posedge clk) begin\r\n\t\t\td <= $random(netlist_random_seed);\r\n\t\t\tbyteena <= byteena + 1;\r\n\t\tend\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\tbyteena[0] <= ($random(netlist_random_seed) & 3) != 0;\r\n\t\t\tbyteena[1] <= ($random(netlist_random_seed) & 3) != 0;\r\n\t\t\td <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input resetn,\r\n  input [1:0] byteena,\r\n  input [15:0] d,\r\n  output reg [15:0] q\r\n);\r\n\r\n  always @(posedge clk) begin\r\n    if (!resetn)\r\n      q <= 0;\r\n    else begin\r\n      if (byteena[0])\r\n        q[7:0] <= d[7:0];\r\n      if (byteena[1])\r\n        q[15:8] <= d[15:8];\r\n    end\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_resetn; wire drive_resetn; assign #0.1 drive_resetn=raw_resetn;\nwire [1:0] raw_byteena; wire [1:0] drive_byteena; assign #0.1 drive_byteena=raw_byteena;\nwire [15:0] raw_d; wire [15:0] drive_d; assign #0.1 drive_d=raw_d;\nwire [15:0] gold_q, dut_q, raw_dut_q; reg [15:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.byteena(raw_byteena),.resetn(raw_resetn),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.resetn(drive_resetn),.byteena(drive_byteena),.d(drive_d),.q(gold_q));\nTopModule dut(.clk(clk),.resetn(drive_resetn),.byteena(drive_byteena),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<16;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob073_dff16e_prompt.txt": "dd36b0b9070f2bf6659c64146f580852d86851ea9d7d39f50d50ee246e28924d",
        "dataset_spec-to-rtl/Prob073_dff16e_ref.sv": "544d36e09a2d73515beb82c7e099bfaadb9c62e43cf57abed100ec846d01f5d9",
        "dataset_spec-to-rtl/Prob073_dff16e_test.sv": "a5dc13044f85f5dce5fb2f8fb338e1b7f478d42c2386bdf3de2e7141e487488d"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob074_ece241_2014_q4": {
    "id": "verilogeval-netlist-settled-v2:Prob074_ece241_2014_q4",
    "spec_sha256": "91e31f9cd289f6a5baaf88b351b37c3b21bf580544348454cff3b0cde37efa23",
    "checks": 234,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic x,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\tx <= 0;\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) x <= 2'h0;\r\n\t\t\t@(posedge clk) x <= 2'h0;\r\n\t\t\t@(posedge clk) x <= 2'h0;\r\n\t\t\t@(posedge clk) x <= 2'h0;\r\n\t\t\t@(posedge clk) x <= 2'h1;\r\n\t\t\t@(posedge clk) x <= 2'h1;\r\n\t\t\t@(posedge clk) x <= 2'h1;\r\n\t\t\t@(posedge clk) x <= 2'h1;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\tx <= $random(netlist_random_seed);\r\n\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input x,\r\n  output z\r\n);\r\n\r\n  reg [2:0] s = 0;\r\n\r\n  always @(posedge clk) begin\r\n    s <= { s[2] ^ x, ~s[1] & x, ~s[0] | x };\r\n  end\r\n\r\n  assign z = ~|s;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.x(drive_x),.z(gold_z));\nTopModule dut(.clk(clk),.x(drive_x),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob074_ece241_2014_q4_prompt.txt": "91e31f9cd289f6a5baaf88b351b37c3b21bf580544348454cff3b0cde37efa23",
        "dataset_spec-to-rtl/Prob074_ece241_2014_q4_ref.sv": "815eed33d652f7ab59cc29a6f6947ec816e863d73302c9770b5e6dbe3c59b366",
        "dataset_spec-to-rtl/Prob074_ece241_2014_q4_test.sv": "8610378f92fc7465960d5e87570f76fdd91c1c7d7e51f5c8374f9145cb60fc7b"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob075_counter_2bc": {
    "id": "verilogeval-netlist-settled-v2:Prob075_counter_2bc",
    "spec_sha256": "8a99dba59553b898644f92b3d46469417280cf3892bac211b0777a6eacef4521",
    "checks": 2097,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen(\r\n\tinput clk,\r\n\toutput logic areset,\r\n\toutput logic train_valid,\r\n\toutput train_taken,\r\n\r\n\tinput tb_match,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\toutput int wavedrom_hide_after_time\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\treg reset;\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\t\r\n\tassign areset = reset;\r\n\tlogic train_taken_r;\r\n\tassign train_taken = train_valid ? train_taken_r : 1'bx;\r\n\t\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 1;\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\ttrain_taken_r <= 1;\r\n\t\ttrain_valid <= 1;\r\n\t\r\n\t\twavedrom_start(\"Asynchronous reset\");\r\n\t\t\treset_test(1); // Test for asynchronous reset\r\n\t\twavedrom_stop();\r\n\t\t@(posedge clk) reset <= 1;\r\n\t\ttrain_taken_r <= 1;\r\n\t\ttrain_valid <= 0;\r\n\t\t@(posedge clk) reset <= 0;\r\n\r\n\t\twavedrom_start(\"Count up, then down\");\r\n\t\ttrain_taken_r <= 1;\r\n\t\t\t@(posedge clk) train_valid <= 1;\r\n\t\t\t@(posedge clk) train_valid <= 0;\r\n\t\t\t@(posedge clk) train_valid <= 1;\r\n\t\t\t@(posedge clk) train_valid <= 1;\r\n\t\t\t@(posedge clk) train_valid <= 1;\r\n\t\t\t@(posedge clk) train_valid <= 0;\r\n\t\t\t@(posedge clk) train_valid <= 1;\r\n\t\ttrain_taken_r <= 0;\r\n\t\t\t@(posedge clk) train_valid <= 1;\r\n\t\t\t@(posedge clk) train_valid <= 0;\r\n\t\t\t@(posedge clk) train_valid <= 1;\r\n\t\t\t@(posedge clk) train_valid <= 1;\r\n\t\t\t@(posedge clk) train_valid <= 1;\r\n\t\t\t@(posedge clk) train_valid <= 0;\r\n\t\t\t@(posedge clk) train_valid <= 1;\t\t\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(1000) @(posedge clk,negedge clk) \r\n\t\t\t{train_valid, train_taken_r} <= {$urandom} ;\r\n\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\n\t\r\nendmodule\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n  input train_valid,\r\n  input train_taken,\r\n  output logic [1:0] state\r\n);\r\n\r\n  always @(posedge clk, posedge areset) begin\r\n    if (areset)\r\n      state <= 1;\r\n    else if (train_valid) begin\r\n      if(state < 3 && train_taken)\r\n        state <= state + 1;\r\n      else if(state > 0 && !train_taken)\r\n        state <= state - 1;\r\n    end\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_train_valid; wire drive_train_valid; assign #0.1 drive_train_valid=raw_train_valid;\nwire raw_train_taken; wire drive_train_taken; assign #0.1 drive_train_taken=raw_train_taken;\nwire [1:0] gold_state, dut_state, raw_dut_state; reg [1:0] seen_state='0;\nstimulus_gen stim1(.clk(clk),.areset(raw_areset),.train_valid(raw_train_valid),.train_taken(raw_train_taken),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable(),.wavedrom_hide_after_time());\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.train_valid(drive_train_valid),.train_taken(drive_train_taken),.state(gold_state));\nTopModule dut(.clk(clk),.areset(drive_areset),.train_valid(drive_train_valid),.train_taken(drive_train_taken),.state(raw_dut_state));\nassign dut_state=raw_dut_state;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<2;b=b+1) begin\nif(gold_state[b] === 1'b0 || gold_state[b] === 1'b1) begin\nknown=1; seen_state[b]=1'b1;\nif(dut_state[b] !== gold_state[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_state) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:state\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob075_counter_2bc_prompt.txt": "8a99dba59553b898644f92b3d46469417280cf3892bac211b0777a6eacef4521",
        "dataset_spec-to-rtl/Prob075_counter_2bc_ref.sv": "3daeebaa8970e509a718cb5bf0d4335a2bba5259ec70d1ca1644a577afdd2c94",
        "dataset_spec-to-rtl/Prob075_counter_2bc_test.sv": "439425d01c5ab1bfb70c5d01e001c993591851e65a10ee3a5ed6daae2235090a"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob076_always_case": {
    "id": "verilogeval-netlist-settled-v2:Prob076_always_case",
    "spec_sha256": "c5f438c25f164e4a0bbe97632531f3df1b26aa804220ccaaba5c4795570a6c86",
    "checks": 234,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [2:0] sel, \r\n\toutput logic [3:0] data0,\r\n\toutput logic [3:0] data1,\r\n\toutput logic [3:0] data2,\r\n\toutput logic [3:0] data3,\r\n\toutput logic [3:0] data4,\r\n\toutput logic [3:0] data5,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\tdata0 <= 4'ha;\r\n\t\tdata1 <= 4'hb;\r\n\t\tdata2 <= 4'hc;\r\n\t\tdata3 <= 4'hd;\r\n\t\tdata4 <= 4'he;\r\n\t\tdata5 <= 4'hf;\r\n\t\t{sel} <= 3'b111;\r\n\t\t@(negedge clk) wavedrom_start(\"<b>Sel</b> chooses one of the data inputs\");\r\n\t\t\trepeat(8) @(posedge clk) sel <= sel + 1;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{data0, data1, data2, data3} <= $urandom;\r\n\t\t\t{data4, data5, sel} <= $urandom;\r\n\t\tend\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [2:0] sel,\r\n  input [3:0] data0,\r\n  input [3:0] data1,\r\n  input [3:0] data2,\r\n  input [3:0] data3,\r\n  input [3:0] data4,\r\n  input [3:0] data5,\r\n  output reg [3:0] out\r\n);\r\n\r\n  always @(*) begin\r\n    case (sel)\r\n      3'h0: out = data0;\r\n      3'h1: out = data1;\r\n      3'h2: out = data2;\r\n      3'h3: out = data3;\r\n      3'h4: out = data4;\r\n      3'h5: out = data5;\r\n      default: out = 4'b0;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [2:0] raw_sel; wire [2:0] drive_sel; assign #0.1 drive_sel=raw_sel;\nwire [3:0] raw_data0; wire [3:0] drive_data0; assign #0.1 drive_data0=raw_data0;\nwire [3:0] raw_data1; wire [3:0] drive_data1; assign #0.1 drive_data1=raw_data1;\nwire [3:0] raw_data2; wire [3:0] drive_data2; assign #0.1 drive_data2=raw_data2;\nwire [3:0] raw_data3; wire [3:0] drive_data3; assign #0.1 drive_data3=raw_data3;\nwire [3:0] raw_data4; wire [3:0] drive_data4; assign #0.1 drive_data4=raw_data4;\nwire [3:0] raw_data5; wire [3:0] drive_data5; assign #0.1 drive_data5=raw_data5;\nwire [3:0] gold_out, dut_out, raw_dut_out; reg [3:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.sel(raw_sel),.data0(raw_data0),.data1(raw_data1),.data2(raw_data2),.data3(raw_data3),.data4(raw_data4),.data5(raw_data5),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.sel(drive_sel),.data0(drive_data0),.data1(drive_data1),.data2(drive_data2),.data3(drive_data3),.data4(drive_data4),.data5(drive_data5),.out(gold_out));\nTopModule dut(.sel(drive_sel),.data0(drive_data0),.data1(drive_data1),.data2(drive_data2),.data3(drive_data3),.data4(drive_data4),.data5(drive_data5),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob076_always_case_prompt.txt": "c5f438c25f164e4a0bbe97632531f3df1b26aa804220ccaaba5c4795570a6c86",
        "dataset_spec-to-rtl/Prob076_always_case_ref.sv": "1131ba6e211d8e3f2919ad6e04e957931a5a428023a24dcae229c9ac55a06f7e",
        "dataset_spec-to-rtl/Prob076_always_case_test.sv": "445a42d440cc980d5f3fd7af46c13608de4ec3183bdd3a7498b7bff871c7331f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob077_wire_decl": {
    "id": "verilogeval-netlist-settled-v2:Prob077_wire_decl",
    "spec_sha256": "55ee7a6ac0bbc4461066b329de7074dab15cd2dcac46392e71124fb32c4805c7",
    "checks": 243,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n// hdlbits_prop {len: 5}\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a,b,c,d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\t{a,b,c,d} = 4'h0;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start(\"Exhaustive test\");\r\n\t\trepeat(20) @(posedge clk, negedge clk)\r\n\t\t\t{d,c,b,a} <= {d,c,b,a} + 1'b1;\r\n\t\twavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{a,b,c,d} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  input d,\r\n  output out,\r\n  output out_n\r\n);\r\n\r\n  wire w1, w2;\r\n  assign w1 = a&b;\r\n  assign w2 = c&d;\r\n  assign out = w1|w2;\r\n  assign out_n = ~out;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nwire gold_out_n, dut_out_n, raw_dut_out_n; reg seen_out_n='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(gold_out),.out_n(gold_out_n));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(raw_dut_out),.out_n(raw_dut_out_n));\nassign dut_out=raw_dut_out;\nassign dut_out_n=raw_dut_out_n;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_n === 1'b0 || gold_out_n === 1'b1) begin\nknown=1; seen_out_n=1'b1;\nif(dut_out_n !== gold_out_n) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\nif((&seen_out_n) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_n\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob077_wire_decl_prompt.txt": "55ee7a6ac0bbc4461066b329de7074dab15cd2dcac46392e71124fb32c4805c7",
        "dataset_spec-to-rtl/Prob077_wire_decl_ref.sv": "11bd9f418493aa5b7b07d06455651413ff5c73ff066c64eff5d7bcd6fafcebed",
        "dataset_spec-to-rtl/Prob077_wire_decl_test.sv": "2e8a0d23f1c853dd39f7d1bf8de08daf4ae6ec43b031c45e686009c959a7c2cd"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob078_dualedge": {
    "id": "verilogeval-netlist-settled-v2:Prob078_dualedge",
    "spec_sha256": "b3912373fbc806a457e61e6e4af0f66f4117e2a2557e526ac5ddf6ad24cd6b26",
    "checks": 447,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\t\r\n\t\r\n\tinitial begin #101;\r\n\t\td <= 1'b0;\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\trepeat(20) @(posedge clk, negedge clk)\r\n\t\t\t\td <= $random(netlist_random_seed)>>2;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\td <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input d,\r\n  output reg q\r\n);\r\n\r\n  /*always @(posedge clk, negedge clk) begin\r\n    q <= d;\r\n  end*/\r\n\r\n  reg qp, qn;\r\n  always @(posedge clk)\r\n    qp <= d;\r\n  always @(negedge clk)\r\n    qn <= d;\r\n\r\n  // This causes q to change too early when clk changes. Need delay by\r\n  // delta cycle\r\n  // assign q = clk ? qp : qn;\r\n  always @(*)\r\n    q <= clk ? qp : qn;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.d(drive_d),.q(gold_q));\nTopModule dut(.clk(clk),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob078_dualedge_prompt.txt": "b3912373fbc806a457e61e6e4af0f66f4117e2a2557e526ac5ddf6ad24cd6b26",
        "dataset_spec-to-rtl/Prob078_dualedge_ref.sv": "bfd9e6accf65291b01f2fd1c183cdbc918e8356acf51ecc6509ba046aef120a6",
        "dataset_spec-to-rtl/Prob078_dualedge_test.sv": "ffb802ec226d28c0c13e0e4a491514832dba090a2f187f3d30dd217819a28c44"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob079_fsm3onehot": {
    "id": "verilogeval-netlist-settled-v2:Prob079_fsm3onehot",
    "spec_sha256": "59dfca7f245f8f2d3172b0d38c2752d57527bd5b883d19b898e53001961db391",
    "checks": 399,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in,\r\n\toutput logic [3:0] state,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\t// Test the one-hot cases first.\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\tstate <= 1<< ($unsigned($random(netlist_random_seed)) % 4);\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input in,\r\n  input [3:0] state,\r\n  output reg [3:0] next_state,\r\n  output out\r\n);\r\n\r\n  parameter A=0, B=1, C=2, D=3;\r\n\r\n  assign next_state[A] = (state[A] | state[C]) & ~in;\r\n  assign next_state[B] = (state[A] | state[B] | state[D]) & in;\r\n  assign next_state[C] = (state[B] | state[D]) & ~in;\r\n  assign next_state[D] = state[C] & in;\r\n\r\n  assign out = (state[D]);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire [3:0] raw_state; wire [3:0] drive_state; assign #0.1 drive_state=raw_state;\nwire [3:0] gold_next_state, dut_next_state, raw_dut_next_state; reg [3:0] seen_next_state='0;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.state(raw_state),.tb_match(1'b1));\noracle_RefModule gold(.in(drive_in),.state(drive_state),.next_state(gold_next_state),.out(gold_out));\nTopModule dut(.in(drive_in),.state(drive_state),.next_state(raw_dut_next_state),.out(raw_dut_out));\nassign dut_next_state=raw_dut_next_state;\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_next_state[b] === 1'b0 || gold_next_state[b] === 1'b1) begin\nknown=1; seen_next_state[b]=1'b1;\nif(dut_next_state[b] !== gold_next_state[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_next_state) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:next_state\");\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob079_fsm3onehot_prompt.txt": "59dfca7f245f8f2d3172b0d38c2752d57527bd5b883d19b898e53001961db391",
        "dataset_spec-to-rtl/Prob079_fsm3onehot_ref.sv": "713b1fc9a403648baae78f592736f828709a5f37194d28840eb7453e77544e9e",
        "dataset_spec-to-rtl/Prob079_fsm3onehot_test.sv": "cc6ff2eadfefeccaa2804f609bac2e84f712dc8c59bfb550e0cfc85af50f8641"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob080_timer": {
    "id": "verilogeval-netlist-settled-v2:Prob080_timer",
    "spec_sha256": "0637b0c5917dee0564720c5237a9d26b26e1b975265e26e747aa6a830f31833f",
    "checks": 14249,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\nmodule stimulus_gen(\r\n\tinput clk, \r\n\toutput logic load, \r\n\toutput logic [9:0] data, \r\n\tinput tb_match,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\toutput int wavedrom_hide_after_time\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\tload <= 1'b0;\r\n\t\twavedrom_start(\"Count 3, then 10 cycles\");\r\n\t\t\t@(posedge clk) {data, load} <= {10'd3, 1'b1};\r\n\t\t\t@(posedge clk) {data, load} <= {10'hx, 1'b0};\r\n\t\t\t@(posedge clk) load <= 0;\r\n\t\t\t@(posedge clk) load <= 0;\r\n\t\t\t@(posedge clk) load <= 0;\r\n\t\t\t@(posedge clk) {data, load} <= {10'd10, 1'b1};\r\n\t\t\t@(posedge clk) {data, load} <= {10'hx, 1'b0};\r\n\t\t\trepeat(12) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\t@(posedge clk) {load, data} <= {1'b1, 10'h10};\r\n\t\t@(posedge clk) {load, data} <= {1'b0, 10'h10};\r\n\t\t@(posedge clk) {load, data} <= {1'b1, 10'h0};   // Load 0\r\n\t\t@(posedge clk) {load, data} <= {1'b1, 10'h3ff}; // Load 1023\r\n\t\t@(posedge clk) {load, data} <= {1'b0, 10'h0};\r\n\t\trepeat(1040) @(posedge clk);\r\n\r\n\t\trepeat(2500) @(posedge clk) begin\r\n\t\t\tload <= !($urandom & 10'hf);\r\n\t\t\tdata <= $urandom_range(0,32);\r\n\t\tend\r\n\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\r\nendmodule\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input load,\r\n  input [9:0] data,\r\n  output tc\r\n);\r\n\r\n  logic [9:0] count_value;\r\n\r\n  always @(posedge clk)\r\n    if(load) count_value <= data;\r\n    else if(count_value != 0) count_value <= count_value - 1;\r\n\r\n  assign tc = count_value == 0;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;\nwire [9:0] raw_data; wire [9:0] drive_data; assign #0.1 drive_data=raw_data;\nwire gold_tc, dut_tc, raw_dut_tc; reg seen_tc='0;\nstimulus_gen stim1(.clk(clk),.load(raw_load),.data(raw_data),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable(),.wavedrom_hide_after_time());\noracle_RefModule gold(.clk(clk),.load(drive_load),.data(drive_data),.tc(gold_tc));\nTopModule dut(.clk(clk),.load(drive_load),.data(drive_data),.tc(raw_dut_tc));\nassign dut_tc=raw_dut_tc;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_tc === 1'b0 || gold_tc === 1'b1) begin\nknown=1; seen_tc=1'b1;\nif(dut_tc !== gold_tc) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_tc) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:tc\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob080_timer_prompt.txt": "0637b0c5917dee0564720c5237a9d26b26e1b975265e26e747aa6a830f31833f",
        "dataset_spec-to-rtl/Prob080_timer_ref.sv": "d7a3d264d54ae3c9e129977efabd1c974aa5ae56e56c82fd0c093dbad43d9922",
        "dataset_spec-to-rtl/Prob080_timer_test.sv": "9f5e7b7fb4f038dc84813577c82a3392c2d68e45d910933ec89fc9d653ec5bd6"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob081_7458": {
    "id": "verilogeval-netlist-settled-v2:Prob081_7458",
    "spec_sha256": "a6c51f5fec5d6edb5ca108e8a21d43eb481a1e2d84512299540e01678be82de8",
    "checks": 877,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg p1a, p1b, p1c, p1d, p1e, p1f,\r\n\toutput reg p2a, p2b, p2c, p2d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{p1a,p1b,p1c,p1d,p1e,p1f} <= 4'h0;\t\t\r\n\t\t{p2a,p2b,p2c,p2d} <= 4'h0;\t\t\r\n\t\twavedrom_start();\r\n\t\trepeat(20) @(posedge clk) begin\r\n\t\t\t{p1a,p1b,p1c,p1d,p1e,p1f} <= {count[2:0], count[3:1]};\t\t\r\n\t\t\t{p2a,p2b,p2c,p2d} <= count;\t\t\r\n\t\t\tcount = count + 1;\r\n\t\tend\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(400) @(posedge clk,negedge clk) begin\r\n\t\t\t{p1a,p1b,p1c,p1d,p2a,p2b,p2c,p2d} <= $random(netlist_random_seed);\t\t\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input p1a,\r\n  input p1b,\r\n  input p1c,\r\n  input p1d,\r\n  input p1e,\r\n  input p1f,\r\n  output p1y,\r\n  input p2a,\r\n  input p2b,\r\n  input p2c,\r\n  input p2d,\r\n  output p2y\r\n);\r\n\r\n  assign p1y = &{p1a, p1b, p1c} | &{p1d, p1e, p1f};\r\n  assign p2y = &{p2a, p2b} | &{p2c, p2d};\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_p1a; wire drive_p1a; assign #0.1 drive_p1a=raw_p1a;\nwire raw_p1b; wire drive_p1b; assign #0.1 drive_p1b=raw_p1b;\nwire raw_p1c; wire drive_p1c; assign #0.1 drive_p1c=raw_p1c;\nwire raw_p1d; wire drive_p1d; assign #0.1 drive_p1d=raw_p1d;\nwire raw_p1e; wire drive_p1e; assign #0.1 drive_p1e=raw_p1e;\nwire raw_p1f; wire drive_p1f; assign #0.1 drive_p1f=raw_p1f;\nwire raw_p2a; wire drive_p2a; assign #0.1 drive_p2a=raw_p2a;\nwire raw_p2b; wire drive_p2b; assign #0.1 drive_p2b=raw_p2b;\nwire raw_p2c; wire drive_p2c; assign #0.1 drive_p2c=raw_p2c;\nwire raw_p2d; wire drive_p2d; assign #0.1 drive_p2d=raw_p2d;\nwire gold_p1y, dut_p1y, raw_dut_p1y; reg seen_p1y='0;\nwire gold_p2y, dut_p2y, raw_dut_p2y; reg seen_p2y='0;\nstimulus_gen stim1(.clk(clk),.p1a(raw_p1a),.p1b(raw_p1b),.p1c(raw_p1c),.p1d(raw_p1d),.p1e(raw_p1e),.p1f(raw_p1f),.p2a(raw_p2a),.p2b(raw_p2b),.p2c(raw_p2c),.p2d(raw_p2d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.p1a(drive_p1a),.p1b(drive_p1b),.p1c(drive_p1c),.p1d(drive_p1d),.p1e(drive_p1e),.p1f(drive_p1f),.p2a(drive_p2a),.p2b(drive_p2b),.p2c(drive_p2c),.p2d(drive_p2d),.p1y(gold_p1y),.p2y(gold_p2y));\nTopModule dut(.p1a(drive_p1a),.p1b(drive_p1b),.p1c(drive_p1c),.p1d(drive_p1d),.p1e(drive_p1e),.p1f(drive_p1f),.p2a(drive_p2a),.p2b(drive_p2b),.p2c(drive_p2c),.p2d(drive_p2d),.p1y(raw_dut_p1y),.p2y(raw_dut_p2y));\nassign dut_p1y=raw_dut_p1y;\nassign dut_p2y=raw_dut_p2y;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_p1y === 1'b0 || gold_p1y === 1'b1) begin\nknown=1; seen_p1y=1'b1;\nif(dut_p1y !== gold_p1y) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_p2y === 1'b0 || gold_p2y === 1'b1) begin\nknown=1; seen_p2y=1'b1;\nif(dut_p2y !== gold_p2y) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_p1y) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:p1y\");\nif((&seen_p2y) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:p2y\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob081_7458_prompt.txt": "a6c51f5fec5d6edb5ca108e8a21d43eb481a1e2d84512299540e01678be82de8",
        "dataset_spec-to-rtl/Prob081_7458_ref.sv": "af9fc5b05a190ca581b2ca6e555764b355414119b1fd795fb7aa59e2bbe19b04",
        "dataset_spec-to-rtl/Prob081_7458_test.sv": "cf46819c2a708f61b4a8915380baa14f9116a368daae847363cc283d5a68078e"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob082_lfsr32": {
    "id": "verilogeval-netlist-settled-v2:Prob082_lfsr32",
    "spec_sha256": "dfcbe04aaf3878ca9a02e7078dd46b91384a75df3caa19d1e52e41b42c6c7c43",
    "checks": 800701,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\t\t@(posedge clk) reset <= 1'b0;\r\n\t\trepeat(200000) @(posedge clk);\r\n\t\treset <= 1'b1;\r\n\t\trepeat(5) @(posedge clk);\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  output reg [31:0] q\r\n);\r\n\r\n  logic [31:0] q_next;\r\n  always@(q) begin\r\n    q_next = q[31:1];\r\n    q_next[31] = q[0];\r\n    q_next[21] ^= q[0];\r\n    q_next[1] ^= q[0];\r\n    q_next[0] ^= q[0];\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (reset)\r\n      q <= 32'h1;\r\n    else\r\n      q <= q_next;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [31:0] gold_q, dut_q, raw_dut_q; reg [31:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.q(gold_q));\nTopModule dut(.clk(clk),.reset(drive_reset),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<32;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob082_lfsr32_prompt.txt": "dfcbe04aaf3878ca9a02e7078dd46b91384a75df3caa19d1e52e41b42c6c7c43",
        "dataset_spec-to-rtl/Prob082_lfsr32_ref.sv": "035dd49fd7552d81fffe9d5223df88c447a48cb272151d659b772d61bfadb789",
        "dataset_spec-to-rtl/Prob082_lfsr32_test.sv": "057581b23b0ac46dd49b4a9e922945fb0da2a28f90adc2eb5d85e52a7859bedb"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob083_mt2015_q4b": {
    "id": "verilogeval-netlist-settled-v2:Prob083_mt2015_q4b",
    "spec_sha256": "8c6a582ddd6a7df0f38e94ed117a962b3d7faae33d65fb0785793f2eef576856",
    "checks": 219,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic x,\r\n\toutput logic y,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\t{x,y} <= 0;\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) {y,x} <= 0;\r\n\t\t\t@(posedge clk) {y,x} <= 1;\r\n\t\t\t@(posedge clk) {y,x} <= 2;\r\n\t\t\t@(posedge clk) {y,x} <= 3;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{x, y} <= $random(netlist_random_seed) % 4;\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input x,\r\n  input y,\r\n  output z\r\n);\r\n\r\n  assign z = ~(x^y);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire raw_y; wire drive_y; assign #0.1 drive_y=raw_y;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x),.y(raw_y),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.x(drive_x),.y(drive_y),.z(gold_z));\nTopModule dut(.x(drive_x),.y(drive_y),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob083_mt2015_q4b_prompt.txt": "8c6a582ddd6a7df0f38e94ed117a962b3d7faae33d65fb0785793f2eef576856",
        "dataset_spec-to-rtl/Prob083_mt2015_q4b_ref.sv": "261fa91a89de5216fd76f1b0606663be25f8908697607c80cedd98eeda275653",
        "dataset_spec-to-rtl/Prob083_mt2015_q4b_test.sv": "f6cc2006dbdb9e68d8087d3dd9afaa97f3dade36a666feacc28d95db38488978"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob084_ece241_2013_q12": {
    "id": "verilogeval-netlist-settled-v2:Prob084_ece241_2013_q12",
    "spec_sha256": "344d68550354efa7152eac6762d4bbbb4d19c7bf4082addbb30595bcac89e4b6",
    "checks": 1046,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic S, enable,\r\n\toutput logic A, B, C,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\tenable <= 0;\r\n\t\t{A,B,C} <= 0;\r\n\t\tS <= 1'bx;\r\n\t\t@(negedge clk) wavedrom_start(\"A 3-input AND gate\");\r\n\t\t\t@(posedge clk);\r\n\t\t\t@(posedge clk) enable <= 1; S <= 1;\r\n\t\t\t@(posedge clk) S <= 0;\r\n\t\t\t@(posedge clk) S <= 0;\r\n\t\t\t@(posedge clk) S <= 0;\r\n\t\t\t@(posedge clk) S <= 0;\r\n\t\t\t@(posedge clk) S <= 0;\r\n\t\t\t@(posedge clk) S <= 0;\r\n\t\t\t@(posedge clk) S <= 0;\r\n\t\t\t@(posedge clk) enable <= 0; S <= 1'bx;\r\n\t\t\t{A,B,C} <= 5;\r\n\t\t\t@(posedge clk) {A,B,C} <= 6;\r\n\t\t\t@(posedge clk) {A,B,C} <= 7;\r\n\t\t\t@(posedge clk) {A,B,C} <= 0;\r\n\t\t\t@(posedge clk) {A,B,C} <= 1;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\r\n\t\trepeat(500) @(posedge clk, negedge clk) begin\r\n\t\t\t{A,B,C,S} <= $random(netlist_random_seed);\r\n\t\t\tenable <= ($random(netlist_random_seed)&3) == 0;\r\n\t\tend\r\n\t\t\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input enable,\r\n  input S,\r\n  input A,\r\n  input B,\r\n  input C,\r\n  output reg Z\r\n);\r\n\r\n  reg [7:0] q;\r\n  always @(posedge clk) begin\r\n    if (enable)\r\n      q <= {q[6:0], S};\r\n  end\r\n\r\n  assign Z = q[ {A, B, C} ];\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_enable; wire drive_enable; assign #0.1 drive_enable=raw_enable;\nwire raw_S; wire drive_S; assign #0.1 drive_S=raw_S;\nwire raw_A; wire drive_A; assign #0.1 drive_A=raw_A;\nwire raw_B; wire drive_B; assign #0.1 drive_B=raw_B;\nwire raw_C; wire drive_C; assign #0.1 drive_C=raw_C;\nwire gold_Z, dut_Z, raw_dut_Z; reg seen_Z='0;\nstimulus_gen stim1(.clk(clk),.S(raw_S),.enable(raw_enable),.A(raw_A),.B(raw_B),.C(raw_C),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.enable(drive_enable),.S(drive_S),.A(drive_A),.B(drive_B),.C(drive_C),.Z(gold_Z));\nTopModule dut(.clk(clk),.enable(drive_enable),.S(drive_S),.A(drive_A),.B(drive_B),.C(drive_C),.Z(raw_dut_Z));\nassign dut_Z=raw_dut_Z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Z === 1'b0 || gold_Z === 1'b1) begin\nknown=1; seen_Z=1'b1;\nif(dut_Z !== gold_Z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_Z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob084_ece241_2013_q12_prompt.txt": "344d68550354efa7152eac6762d4bbbb4d19c7bf4082addbb30595bcac89e4b6",
        "dataset_spec-to-rtl/Prob084_ece241_2013_q12_ref.sv": "421297148a74774656bb9bbe9f2a0c171abb1196892c54068b8855c25e32b3ee",
        "dataset_spec-to-rtl/Prob084_ece241_2013_q12_test.sv": "1c5552a4bd117838f16e9ea1c26ce16f4cf3c3218eba1abd2f28c6182e74423b"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob085_shift4": {
    "id": "verilogeval-netlist-settled-v2:Prob085_shift4",
    "spec_sha256": "4b01932b3afe18ba059f2768373b2bd245afde9445121cff23864fe0bb09d158",
    "checks": 853,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput areset,\r\n\toutput reg load,\r\n\toutput reg ena,\r\n\toutput reg[3:0] data,\r\n\t\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\r\n\tinitial begin #101;\r\n\t\t{load, ena, reset, data} <= 7'h40;\r\n\t\t@(posedge clk) {load, ena, reset, data} <= 7'h4f;\r\n\t\twavedrom_start(\"Load and reset\");\r\n\t\t@(posedge clk) {load, ena, reset, data} <= 7'h0x;\r\n\t\t@(posedge clk) {load, ena, reset, data} <= 7'h2x;\r\n\t\t@(posedge clk) {load, ena, reset, data} <= 7'h2x;\r\n\t\t@(posedge clk) {load, ena, reset, data} <= 7'h0x;\r\n\t\treset_test(1);\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\t\tload <= !($random(netlist_random_seed) & 15);\r\n\t\t\tena <= |($random(netlist_random_seed) & 31);\r\n\t\t\tdata <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n  input load,\r\n  input ena,\r\n  input [3:0] data,\r\n  output reg [3:0] q\r\n);\r\n\r\n  always @(posedge clk, posedge areset) begin\r\n    if (areset)\r\n      q <= 0;\r\n    else if (load)\r\n      q <= data;\r\n    else if (ena)\r\n      q <= q[3:1];\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;\nwire raw_ena; wire drive_ena; assign #0.1 drive_ena=raw_ena;\nwire [3:0] raw_data; wire [3:0] drive_data; assign #0.1 drive_data=raw_data;\nwire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.areset(raw_areset),.load(raw_load),.ena(raw_ena),.data(raw_data),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.load(drive_load),.ena(drive_ena),.data(drive_data),.q(gold_q));\nTopModule dut(.clk(clk),.areset(drive_areset),.load(drive_load),.ena(drive_ena),.data(drive_data),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob085_shift4_prompt.txt": "4b01932b3afe18ba059f2768373b2bd245afde9445121cff23864fe0bb09d158",
        "dataset_spec-to-rtl/Prob085_shift4_ref.sv": "02ba237d33580af9951ac4c894d6a75f0bb33bcfc3d08f83dae19b8878ccc250",
        "dataset_spec-to-rtl/Prob085_shift4_test.sv": "ebe6a7300e93545c045885d602983276297f9b30697eba70a1151a7ae4ba0478"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob086_lfsr5": {
    "id": "verilogeval-netlist-settled-v2:Prob086_lfsr5",
    "spec_sha256": "c5c1c54151967ade69648d4373321686d74781fde6c8ad8afc2247d7f28eaf8d",
    "checks": 8885,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start();\r\n\t\t\treset_test();\r\n\t\t\trepeat(8) @(posedge clk);\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\t\t@(posedge clk) reset <= 1'b0;\r\n\t\trepeat(2000) @(posedge clk);\r\n\t\treset <= 1'b1;\r\n\t\trepeat(5) @(posedge clk);\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  output reg [4:0] q\r\n);\r\n\r\n  logic [4:0] q_next;\r\n  always @(q) begin\r\n    q_next = q[4:1];\r\n    q_next[4] = q[0];\r\n    q_next[2] ^= q[0];\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (reset)\r\n      q <= 5'h1;\r\n    else\r\n      q <= q_next;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [4:0] gold_q, dut_q, raw_dut_q; reg [4:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.q(gold_q));\nTopModule dut(.clk(clk),.reset(drive_reset),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<5;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob086_lfsr5_prompt.txt": "c5c1c54151967ade69648d4373321686d74781fde6c8ad8afc2247d7f28eaf8d",
        "dataset_spec-to-rtl/Prob086_lfsr5_ref.sv": "40d3da1cba9cc9466c09ac56a068124f97f6004b24d34c59b4ca9b68ab6c9150",
        "dataset_spec-to-rtl/Prob086_lfsr5_test.sv": "4d0646395697377a7c7195ffc25834e38053cd8d02c44be67a4a79616b8298a8"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob087_gates": {
    "id": "verilogeval-netlist-settled-v2:Prob087_gates",
    "spec_sha256": "b6e255aa98c3eadc68afbc751eacbea194ce1666e89c8d545cab0840810d0200",
    "checks": 416,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\t@(negedge clk) {a,b} <= 0;\r\n\t\twavedrom_start();\r\n\t\t\t@(posedge clk) {a,b} <= 0;\r\n\t\t\t@(posedge clk) {a,b} <= 1;\r\n\t\t\t@(posedge clk) {a,b} <= 2;\r\n\t\t\t@(posedge clk) {a,b} <= 3;\r\n\t\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t{a,b} <= $random(netlist_random_seed);\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  output out_and,\r\n  output out_or,\r\n  output out_xor,\r\n  output out_nand,\r\n  output out_nor,\r\n  output out_xnor,\r\n  output out_anotb\r\n);\r\n\r\n  assign out_and = a&b;\r\n  assign out_or = a|b;\r\n  assign out_xor = a^b;\r\n  assign out_nand = ~(a&b);\r\n  assign out_nor = ~(a|b);\r\n  assign out_xnor = a^~b;\r\n  assign out_anotb = a & ~b;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire gold_out_and, dut_out_and, raw_dut_out_and; reg seen_out_and='0;\nwire gold_out_or, dut_out_or, raw_dut_out_or; reg seen_out_or='0;\nwire gold_out_xor, dut_out_xor, raw_dut_out_xor; reg seen_out_xor='0;\nwire gold_out_nand, dut_out_nand, raw_dut_out_nand; reg seen_out_nand='0;\nwire gold_out_nor, dut_out_nor, raw_dut_out_nor; reg seen_out_nor='0;\nwire gold_out_xnor, dut_out_xnor, raw_dut_out_xnor; reg seen_out_xnor='0;\nwire gold_out_anotb, dut_out_anotb, raw_dut_out_anotb; reg seen_out_anotb='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.out_and(gold_out_and),.out_or(gold_out_or),.out_xor(gold_out_xor),.out_nand(gold_out_nand),.out_nor(gold_out_nor),.out_xnor(gold_out_xnor),.out_anotb(gold_out_anotb));\nTopModule dut(.a(drive_a),.b(drive_b),.out_and(raw_dut_out_and),.out_or(raw_dut_out_or),.out_xor(raw_dut_out_xor),.out_nand(raw_dut_out_nand),.out_nor(raw_dut_out_nor),.out_xnor(raw_dut_out_xnor),.out_anotb(raw_dut_out_anotb));\nassign dut_out_and=raw_dut_out_and;\nassign dut_out_or=raw_dut_out_or;\nassign dut_out_xor=raw_dut_out_xor;\nassign dut_out_nand=raw_dut_out_nand;\nassign dut_out_nor=raw_dut_out_nor;\nassign dut_out_xnor=raw_dut_out_xnor;\nassign dut_out_anotb=raw_dut_out_anotb;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_and === 1'b0 || gold_out_and === 1'b1) begin\nknown=1; seen_out_and=1'b1;\nif(dut_out_and !== gold_out_and) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_or === 1'b0 || gold_out_or === 1'b1) begin\nknown=1; seen_out_or=1'b1;\nif(dut_out_or !== gold_out_or) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_xor === 1'b0 || gold_out_xor === 1'b1) begin\nknown=1; seen_out_xor=1'b1;\nif(dut_out_xor !== gold_out_xor) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_nand === 1'b0 || gold_out_nand === 1'b1) begin\nknown=1; seen_out_nand=1'b1;\nif(dut_out_nand !== gold_out_nand) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_nor === 1'b0 || gold_out_nor === 1'b1) begin\nknown=1; seen_out_nor=1'b1;\nif(dut_out_nor !== gold_out_nor) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_xnor === 1'b0 || gold_out_xnor === 1'b1) begin\nknown=1; seen_out_xnor=1'b1;\nif(dut_out_xnor !== gold_out_xnor) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out_anotb === 1'b0 || gold_out_anotb === 1'b1) begin\nknown=1; seen_out_anotb=1'b1;\nif(dut_out_anotb !== gold_out_anotb) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_and) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_and\");\nif((&seen_out_or) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_or\");\nif((&seen_out_xor) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_xor\");\nif((&seen_out_nand) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_nand\");\nif((&seen_out_nor) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_nor\");\nif((&seen_out_xnor) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_xnor\");\nif((&seen_out_anotb) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_anotb\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob087_gates_prompt.txt": "b6e255aa98c3eadc68afbc751eacbea194ce1666e89c8d545cab0840810d0200",
        "dataset_spec-to-rtl/Prob087_gates_ref.sv": "bd4abe314bb4d3566c91718b19854551cb760ef1afdf631b9318b41b61657049",
        "dataset_spec-to-rtl/Prob087_gates_test.sv": "9c0ff7f4caafd84da0985054a74eec35159e54840d7fd7d51b0ee7bc1e7fb53b"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob088_ece241_2014_q5b": {
    "id": "verilogeval-netlist-settled-v2:Prob088_ece241_2014_q5b",
    "spec_sha256": "f05c7a534f516cc53bb2f976f4eca7971ec917b44d8f89ee7a7be6bdea3ca6d5",
    "checks": 870,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic x,\r\n\toutput logic areset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n\tinitial begin #101;\r\n\t\tx <= 0;\r\n\t\treset <= 1;\r\n\t\t@(posedge clk) reset <= 0; x <= 1;\r\n\t\t@(posedge clk) x <= 0;\r\n\t\treset_test(1);\r\n\t\t\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h2;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h1;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h1;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h1;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(400) @(posedge clk, negedge clk)\r\n\t\t\t{reset,x} <= {($random(netlist_random_seed)&31) == 0, ($random(netlist_random_seed)&1)==0 };\r\n\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n  input x,\r\n  output z\r\n);\r\n\r\n  parameter A=0,B=1;\r\n  reg state;\r\n  always @(posedge clk, posedge areset) begin\r\n    if (areset)\r\n      state <= A;\r\n    else begin\r\n      case (state)\r\n        A: state <= x ? B : A;\r\n        B: state <= B;\r\n      endcase\r\n    end\r\n  end\r\n\r\n  assign z = (state == A && x==1) | (state == B && x==0);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x),.areset(raw_areset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.x(drive_x),.z(gold_z));\nTopModule dut(.clk(clk),.areset(drive_areset),.x(drive_x),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob088_ece241_2014_q5b_prompt.txt": "f05c7a534f516cc53bb2f976f4eca7971ec917b44d8f89ee7a7be6bdea3ca6d5",
        "dataset_spec-to-rtl/Prob088_ece241_2014_q5b_ref.sv": "47ea79481558c196f0ed6d865807059aecaeee9490dfb8640e0151293b22e319",
        "dataset_spec-to-rtl/Prob088_ece241_2014_q5b_test.sv": "81f0f97e481bee86661f1fc3c42bbeed3cf782bf39acf5be94d4f1003daeef35"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob089_ece241_2014_q5a": {
    "id": "verilogeval-netlist-settled-v2:Prob089_ece241_2014_q5a",
    "spec_sha256": "071eb365c357e74de2518f4d27245ba5666411016e27a0998161b860185c3e45",
    "checks": 870,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic x,\r\n\toutput logic areset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n\tinitial begin #101;\r\n\t\tx <= 0;\r\n\t\treset <= 1;\r\n\t\t@(posedge clk) reset <= 0; x <= 1;\r\n\t\t@(posedge clk) x <= 0;\r\n\t\treset_test(1);\r\n\t\t\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h2;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h1;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h1;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h1;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t\t@(posedge clk) {reset,x} <= 2'h0;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(400) @(posedge clk, negedge clk)\r\n\t\t\t{reset,x} <= {($random(netlist_random_seed)&31) == 0, ($random(netlist_random_seed)&1)==0 };\r\n\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n  input x,\r\n  output z\r\n);\r\n\r\n  parameter A=0,B=1,C=2;\r\n  reg [1:0] state;\r\n  always @(posedge clk, posedge areset) begin\r\n    if (areset)\r\n      state <= A;\r\n    else begin\r\n      case (state)\r\n        A: state <= x ? C : A;\r\n        B: state <= x ? B : C;\r\n        C: state <= x ? B : C;\r\n      endcase\r\n    end\r\n  end\r\n\r\n  assign z = (state == C);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x),.areset(raw_areset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.x(drive_x),.z(gold_z));\nTopModule dut(.clk(clk),.areset(drive_areset),.x(drive_x),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob089_ece241_2014_q5a_prompt.txt": "071eb365c357e74de2518f4d27245ba5666411016e27a0998161b860185c3e45",
        "dataset_spec-to-rtl/Prob089_ece241_2014_q5a_ref.sv": "be3d384c1b4d22575650cc50e78469be73c594a9dff30531b1e73fcb3437ba3e",
        "dataset_spec-to-rtl/Prob089_ece241_2014_q5a_test.sv": "81f0f97e481bee86661f1fc3c42bbeed3cf782bf39acf5be94d4f1003daeef35"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob090_circuit1": {
    "id": "verilogeval-netlist-settled-v2:Prob090_circuit1",
    "spec_sha256": "80efe1b6c8b801b3076e1e68754dc1be2377394fcec95bb1d159ac38e36da43d",
    "checks": 238,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t{a,b} <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\t@(posedge clk) {a,b} <= 0;\r\n\t\t\trepeat(8) @(posedge clk) {a,b} <= {a,b} + 1;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b} <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  output q\r\n);\r\n\r\n  assign q = a&b;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.q(gold_q));\nTopModule dut(.a(drive_a),.b(drive_b),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob090_circuit1_prompt.txt": "80efe1b6c8b801b3076e1e68754dc1be2377394fcec95bb1d159ac38e36da43d",
        "dataset_spec-to-rtl/Prob090_circuit1_ref.sv": "2b4f11a39fb2e81361800e5f0769087dbb16bb4ae3f94cd68ad223c222dacc2f",
        "dataset_spec-to-rtl/Prob090_circuit1_test.sv": "c7fadd17d79078edca9da866ede03a8d548da9efabdfc75034fe7d716a8dfc8e"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob091_2012_q2b": {
    "id": "verilogeval-netlist-settled-v2:Prob091_2012_q2b",
    "spec_sha256": "e0e9b93a36d3066e84c8f78e415ffd8a1c0b7935666664039519cac1674c7651",
    "checks": 1199,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic[5:0] y,\r\n\toutput logic w,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tint errored1 = 0;\r\n\tint onehot_error = 0;\r\n\tint temp;\r\n\t\r\n\tinitial begin #101;\r\n\t\t// Test the one-hot cases first.\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\ty <= 1<< ($unsigned($random(netlist_random_seed)) % 6);\r\n\t\t\tw <= $random(netlist_random_seed);\r\n\t\t\tif (!tb_match) onehot_error++;\r\n\t\tend\r\n\t\t\t\r\n\t\t\t\r\n\t\t// Random.\r\n\t\terrored1 = 0;\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\tdo \r\n\t\t\t\ttemp = $random(netlist_random_seed);\r\n\t\t\twhile ( !{temp[5:4],temp[2:1]} == !{temp[3],temp[0]} );\t\r\n\t\t\t// Make y[3,0] and y[5,4,2,1] mutually exclusive, so we can accept Y3=(~y[3] & ~y[0]) &~w as a valid answer too.\r\n\r\n\t\t\ty <= temp;\r\n\t\t\tw <= $random(netlist_random_seed);\r\n\t\t\tif (!tb_match)\r\n\t\t\t\terrored1++;\r\n\t\tend\r\n\t\tif (!onehot_error && errored1) \r\n\t\t\t$display (\"Hint: Your circuit passed when given only one-hot inputs, but not with semi-random inputs.\");\r\n\r\n\t\tif (!onehot_error && errored1)\r\n\t\t\t$display(\"Hint: Are you doing something more complicated than deriving state transition equations by inspection?\\n\");\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [5:0] y,\r\n  input w,\r\n  output Y1,\r\n  output Y3\r\n);\r\n\r\n  assign Y1 = y[0]&w;\r\n  assign Y3 = (y[1]|y[2]|y[4]|y[5]) & ~w;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [5:0] raw_y; wire [5:0] drive_y; assign #0.1 drive_y=raw_y;\nwire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;\nwire gold_Y1, dut_Y1, raw_dut_Y1; reg seen_Y1='0;\nwire gold_Y3, dut_Y3, raw_dut_Y3; reg seen_Y3='0;\nstimulus_gen stim1(.clk(clk),.y(raw_y),.w(raw_w),.tb_match(1'b1));\noracle_RefModule gold(.y(drive_y),.w(drive_w),.Y1(gold_Y1),.Y3(gold_Y3));\nTopModule dut(.y(drive_y),.w(drive_w),.Y1(raw_dut_Y1),.Y3(raw_dut_Y3));\nassign dut_Y1=raw_dut_Y1;\nassign dut_Y3=raw_dut_Y3;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Y1 === 1'b0 || gold_Y1 === 1'b1) begin\nknown=1; seen_Y1=1'b1;\nif(dut_Y1 !== gold_Y1) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Y3 === 1'b0 || gold_Y3 === 1'b1) begin\nknown=1; seen_Y3=1'b1;\nif(dut_Y3 !== gold_Y3) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_Y1) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Y1\");\nif((&seen_Y3) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Y3\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob091_2012_q2b_prompt.txt": "e0e9b93a36d3066e84c8f78e415ffd8a1c0b7935666664039519cac1674c7651",
        "dataset_spec-to-rtl/Prob091_2012_q2b_ref.sv": "9faf3c00ae963c27c24396bd2f8da03467dab513f49b09772975ba7cb3c82e57",
        "dataset_spec-to-rtl/Prob091_2012_q2b_test.sv": "36f5f4b28bec2b682a78574a28adb5cf844744fb49d7dc2dd41eaeaddaf39532"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob092_gatesv100": {
    "id": "verilogeval-netlist-settled-v2:Prob092_gatesv100",
    "spec_sha256": "32ed65de70d3a1c50feccc96b19908e7741799e4ca2627a345f190b0d9858b52",
    "checks": 401,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\tinput tb_match,\r\n\toutput logic [99:0] in\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\tin <= $random(netlist_random_seed);\r\n\t\trepeat(100) begin\r\n\t\t\t@(negedge clk) in <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk) in <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input  [99:0] in,\r\n  output [99:0] out_both,\r\n  output [99:0] out_any,\r\n  output [99:0] out_different\r\n);\r\n\r\n  assign out_both = { 1'b0, (in[98:0] & in[99:1]) };\r\n\r\n  assign out_any = { (in[98:0] | in[99:1]), 1'b0 };\r\n\r\n  assign out_different = in ^ { in[0], in[99:1] };\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [99:0] raw_in; wire [99:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [99:0] gold_out_both, dut_out_both, raw_dut_out_both; reg [99:0] seen_out_both='0;\nwire [99:0] gold_out_any, dut_out_any, raw_dut_out_any; reg [99:0] seen_out_any='0;\nwire [99:0] gold_out_different, dut_out_different, raw_dut_out_different; reg [99:0] seen_out_different='0;\nstimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in));\noracle_RefModule gold(.in(drive_in),.out_both(gold_out_both),.out_any(gold_out_any),.out_different(gold_out_different));\nTopModule dut(.in(drive_in),.out_both(raw_dut_out_both),.out_any(raw_dut_out_any),.out_different(raw_dut_out_different));\nassign dut_out_both=raw_dut_out_both;\nassign dut_out_any=raw_dut_out_any;\nassign dut_out_different=raw_dut_out_different;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<100;b=b+1) begin\nif(gold_out_both[b] === 1'b0 || gold_out_both[b] === 1'b1) begin\nknown=1; seen_out_both[b]=1'b1;\nif(dut_out_both[b] !== gold_out_both[b]) bad=1;\nend end\nfor(integer b=0;b<100;b=b+1) begin\nif(gold_out_any[b] === 1'b0 || gold_out_any[b] === 1'b1) begin\nknown=1; seen_out_any[b]=1'b1;\nif(dut_out_any[b] !== gold_out_any[b]) bad=1;\nend end\nfor(integer b=0;b<100;b=b+1) begin\nif(gold_out_different[b] === 1'b0 || gold_out_different[b] === 1'b1) begin\nknown=1; seen_out_different[b]=1'b1;\nif(dut_out_different[b] !== gold_out_different[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_both) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_both\");\nif((&seen_out_any) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_any\");\nif((&seen_out_different) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_different\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob092_gatesv100_prompt.txt": "32ed65de70d3a1c50feccc96b19908e7741799e4ca2627a345f190b0d9858b52",
        "dataset_spec-to-rtl/Prob092_gatesv100_ref.sv": "fa4b85a038467eaff328e22b3c2f3086d068ce9d9266de51d913a4f6a7a0d620",
        "dataset_spec-to-rtl/Prob092_gatesv100_test.sv": "c25e9febe8315ff2ad78581b49fe2e5ff79a2018666d2eb1bd6a900b73a8e389"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob093_ece241_2014_q3": {
    "id": "verilogeval-netlist-settled-v2:Prob093_ece241_2014_q3",
    "spec_sha256": "a90004b482c50d94d4d97d291e599909062a4a5ebac93dc90478efa26615a451",
    "checks": 118,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic c, d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\t{c, d} <= 0;\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) {c, d} <= 2'h0;\r\n\t\t\t@(posedge clk) {c, d} <= 2'h1;\r\n\t\t\t@(posedge clk) {c, d} <= 2'h2;\r\n\t\t\t@(posedge clk) {c, d} <= 2'h3;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\trepeat(50) @(posedge clk, negedge clk)\r\n\t\t\t{c,d} <= $random(netlist_random_seed);\r\n\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input c,\r\n  input d,\r\n  output [3:0] mux_in\r\n);\r\n\r\n  assign mux_in[0] = c | d;\r\n  assign mux_in[1] = 0;\r\n  assign mux_in[2] = ~d;\r\n  assign mux_in[3] = c&d;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire [3:0] gold_mux_in, dut_mux_in, raw_dut_mux_in; reg [3:0] seen_mux_in='0;\nstimulus_gen stim1(.clk(clk),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.c(drive_c),.d(drive_d),.mux_in(gold_mux_in));\nTopModule dut(.c(drive_c),.d(drive_d),.mux_in(raw_dut_mux_in));\nassign dut_mux_in=raw_dut_mux_in;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_mux_in[b] === 1'b0 || gold_mux_in[b] === 1'b1) begin\nknown=1; seen_mux_in[b]=1'b1;\nif(dut_mux_in[b] !== gold_mux_in[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_mux_in) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:mux_in\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob093_ece241_2014_q3_prompt.txt": "a90004b482c50d94d4d97d291e599909062a4a5ebac93dc90478efa26615a451",
        "dataset_spec-to-rtl/Prob093_ece241_2014_q3_ref.sv": "90ffd1c8686eb8980bf206a363024dc0035b5dbb4632bda7b95ba61d7fcef024",
        "dataset_spec-to-rtl/Prob093_ece241_2014_q3_test.sv": "6d6568d180418ab5b35638e8a72dd86ed1bcc6986eeb9634c7dae5c2bbc57fb6"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob094_gatesv": {
    "id": "verilogeval-netlist-settled-v2:Prob094_gatesv",
    "spec_sha256": "b4cf0401abd2739e3a19f60e1fc96879b30c5ff06f1afbbe7b7943d5c1057b91",
    "checks": 425,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\tinput tb_match,\r\n\toutput logic [3:0] in,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\tin <= 4'h3;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start();\r\n\t\t\t@(posedge clk) in <= 3;\r\n\t\t\t@(posedge clk) in <= 6;\r\n\t\t\t@(posedge clk) in <= 12;\r\n\t\t\t@(posedge clk) in <= 9;\r\n\t\t\t@(posedge clk) in <= 5;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\tin <= $random(netlist_random_seed);\r\n\t\trepeat(100) begin\r\n\t\t\t@(negedge clk) in <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk) in <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input  [3:0] in,\r\n  output [3:0] out_both,\r\n  output [3:0] out_any,\r\n  output [3:0] out_different\r\n);\r\n\r\n  assign out_both[2:0] = in[2:0] & in[3:1];\r\n  assign out_any[3:1]  = in[2:0] | in[3:1];\r\n  assign out_different = in^{in[0], in[3:1]};\r\n\r\n  // we don't care about out_both[3] or out_any[0]\r\n  assign out_both[3] = 1'bx;\r\n  assign out_any[0]  = 1'bx;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [3:0] raw_in; wire [3:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [3:0] gold_out_both, dut_out_both, raw_dut_out_both; reg [3:0] seen_out_both=4'b1000;\nwire [3:0] gold_out_any, dut_out_any, raw_dut_out_any; reg [3:0] seen_out_any=4'b0001;\nwire [3:0] gold_out_different, dut_out_different, raw_dut_out_different; reg [3:0] seen_out_different='0;\nstimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.out_both(gold_out_both),.out_any(gold_out_any),.out_different(gold_out_different));\nTopModule dut(.in(drive_in),.out_both(raw_dut_out_both),.out_any(raw_dut_out_any),.out_different(raw_dut_out_different));\nassign dut_out_both=raw_dut_out_both;\nassign dut_out_any=raw_dut_out_any;\nassign dut_out_different=raw_dut_out_different;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_out_both[b] === 1'b0 || gold_out_both[b] === 1'b1) begin\nknown=1; seen_out_both[b]=1'b1;\nif(dut_out_both[b] !== gold_out_both[b]) bad=1;\nend end\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_out_any[b] === 1'b0 || gold_out_any[b] === 1'b1) begin\nknown=1; seen_out_any[b]=1'b1;\nif(dut_out_any[b] !== gold_out_any[b]) bad=1;\nend end\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_out_different[b] === 1'b0 || gold_out_different[b] === 1'b1) begin\nknown=1; seen_out_different[b]=1'b1;\nif(dut_out_different[b] !== gold_out_different[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_both) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_both\");\nif((&seen_out_any) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_any\");\nif((&seen_out_different) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_different\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob094_gatesv_prompt.txt": "b4cf0401abd2739e3a19f60e1fc96879b30c5ff06f1afbbe7b7943d5c1057b91",
        "dataset_spec-to-rtl/Prob094_gatesv_ref.sv": "aebc64b46785688c3752b3c875dde5bc414be06e4b6ca1b037e83897d2e49f7d",
        "dataset_spec-to-rtl/Prob094_gatesv_test.sv": "1ea4bd8690f35e43525c3ccdb6ca4d7b953c5cdaefd197ba18a9b9517cdf5799"
      },
      "unknown_reference_bits": "masked; each required output bit must be known at least once; public dont-care bits exempt from observation",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion",
      "public_dont_care_bits": {
        "out_both": [
          3
        ],
        "out_any": [
          0
        ]
      }
    }
  },
  "Prob095_review2015_fsmshift": {
    "id": "verilogeval-netlist-settled-v2:Prob095_review2015_fsmshift",
    "spec_sha256": "b5604ca4f52c2650c55c7ce93aef42a87fbe2cfccb7a26bad30fde0e0773ea04",
    "checks": 395,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  output shift_ena\r\n);\r\n\r\n  parameter B0=0, B1=1, B2=2, B3=3, Done=4;\r\n\r\n  reg [2:0] state, next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      B0: next = B1;\r\n      B1: next = B2;\r\n      B2: next = B3;\r\n      B3: next = Done;\r\n      Done: next = Done;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk)\r\n    if (reset) state <= B0;\r\n    else state <= next;\r\n\r\n  assign shift_ena = (state == B0 || state == B1 || state == B2 || state == B3);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire gold_shift_ena, dut_shift_ena, raw_dut_shift_ena; reg seen_shift_ena='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.shift_ena(gold_shift_ena));\nTopModule dut(.clk(clk),.reset(drive_reset),.shift_ena(raw_dut_shift_ena));\nassign dut_shift_ena=raw_dut_shift_ena;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_shift_ena === 1'b0 || gold_shift_ena === 1'b1) begin\nknown=1; seen_shift_ena=1'b1;\nif(dut_shift_ena !== gold_shift_ena) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_shift_ena) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:shift_ena\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob095_review2015_fsmshift_prompt.txt": "b5604ca4f52c2650c55c7ce93aef42a87fbe2cfccb7a26bad30fde0e0773ea04",
        "dataset_spec-to-rtl/Prob095_review2015_fsmshift_ref.sv": "04f2d1a96d77d1d4a9c3ba3c1da034db938f2a4883bbccb8898d0886cffd1ba7",
        "dataset_spec-to-rtl/Prob095_review2015_fsmshift_test.sv": "dfbbe8d24919b6591e27b6cea13e2047f564c92f253d2ee8ea30cb592ca524a5"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob096_review2015_fsmseq": {
    "id": "verilogeval-netlist-settled-v2:Prob096_review2015_fsmseq",
    "spec_sha256": "d846cc56e2e68bcad2c723d8fdd7be31d4a33f364714c50d445e8ad954096388",
    "checks": 1285,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset, data,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\twire [0:9] d = 10'b1110110011;\r\n\t\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\tdata <= 1;\r\n\t\trepeat(2) @(posedge clk) ;\r\n\t\tdata <= 0;\r\n\t\t@(posedge clk);\r\n\t\tdata <= 1;\r\n\t\t@(posedge clk);\r\n\t\tdata <= 0;\r\n\t\r\n\t\twavedrom_start(\"Reset and sequence detect\");\r\n\t\treset_test();\r\n\t\tfor (int i=0;i<10;i++) begin\r\n\t\t\t@(posedge clk) data <= d[i];\r\n\t\tend\r\n\t\twavedrom_stop();\r\n\t\trepeat(600) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\t\tdata <= $random(netlist_random_seed);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input data,\r\n  output start_shifting\r\n);\r\n\r\n  parameter S=0, S1=1, S11=2, S110=3, Done=4;\r\n\r\n  reg [2:0] state, next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      S: next = data ? S1: S;\r\n      S1: next = data ? S11: S;\r\n      S11: next = data ? S11 : S110;\r\n      S110: next = data ? Done : S;\r\n      Done: next = Done;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk)\r\n    if (reset) state <= S;\r\n    else state <= next;\r\n\r\n  assign start_shifting = state == Done;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_data; wire drive_data; assign #0.1 drive_data=raw_data;\nwire gold_start_shifting, dut_start_shifting, raw_dut_start_shifting; reg seen_start_shifting='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.data(raw_data),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.data(drive_data),.start_shifting(gold_start_shifting));\nTopModule dut(.clk(clk),.reset(drive_reset),.data(drive_data),.start_shifting(raw_dut_start_shifting));\nassign dut_start_shifting=raw_dut_start_shifting;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_start_shifting === 1'b0 || gold_start_shifting === 1'b1) begin\nknown=1; seen_start_shifting=1'b1;\nif(dut_start_shifting !== gold_start_shifting) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_start_shifting) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:start_shifting\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob096_review2015_fsmseq_prompt.txt": "d846cc56e2e68bcad2c723d8fdd7be31d4a33f364714c50d445e8ad954096388",
        "dataset_spec-to-rtl/Prob096_review2015_fsmseq_ref.sv": "da50dc6dec77da8fb10d48cdc8ad16803949a92a1871e2c6c99736146c06062a",
        "dataset_spec-to-rtl/Prob096_review2015_fsmseq_test.sv": "406bc87973a1f0a18af898d4c1152f5c4f63eb679ae3e0525ec87f86f9fe35e3"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob097_mux9to1v": {
    "id": "verilogeval-netlist-settled-v2:Prob097_mux9to1v",
    "spec_sha256": "af45812305996d9c6bbe0396b2e385b17595a7cb00e658738b3007e7a214fe0c",
    "checks": 438,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [15:0] a,b,c,d,e,f,g,h,i,\r\n\toutput logic [3:0] sel,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\t\r\n\t\r\n\tinitial begin #101;\r\n\t\t{a,b,c,d,e,f,g,h,i,sel} <= { 16'ha, 16'hb, 16'hc, 16'hd, 16'he, 16'hf, 16'h11, 16'h12, 16'h13, 4'h0 };\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) sel <= 4'h1;\r\n\t\t\t@(posedge clk) sel <= 4'h2;\r\n\t\t\t@(posedge clk) sel <= 4'h3;\r\n\t\t\t@(posedge clk) sel <= 4'h4;\r\n\t\t\t@(posedge clk) sel <= 4'h7;\r\n\t\t\t@(posedge clk) sel <= 4'h8;\r\n\t\t\t@(posedge clk) sel <= 4'h9;\r\n\t\t\t@(posedge clk) sel <= 4'ha;\r\n\t\t\t@(posedge clk) sel <= 4'hb;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\t\r\n\t\trepeat(200) @(negedge clk, posedge clk) begin\r\n\t\t\t{a,b,c,d,e,f,g,h,i,sel} <= {$random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed), $random(netlist_random_seed)};\r\n\t\tend\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [15:0] a,\r\n  input [15:0] b,\r\n  input [15:0] c,\r\n  input [15:0] d,\r\n  input [15:0] e,\r\n  input [15:0] f,\r\n  input [15:0] g,\r\n  input [15:0] h,\r\n  input [15:0] i,\r\n  input [3:0] sel,\r\n  output logic [15:0] out\r\n);\r\n\r\n  always @(*) begin\r\n    out = '1;\r\n    case (sel)\r\n      4'h0: out = a;\r\n      4'h1: out = b;\r\n      4'h2: out = c;\r\n      4'h3: out = d;\r\n      4'h4: out = e;\r\n      4'h5: out = f;\r\n      4'h6: out = g;\r\n      4'h7: out = h;\r\n      4'h8: out = i;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [15:0] raw_a; wire [15:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [15:0] raw_b; wire [15:0] drive_b; assign #0.1 drive_b=raw_b;\nwire [15:0] raw_c; wire [15:0] drive_c; assign #0.1 drive_c=raw_c;\nwire [15:0] raw_d; wire [15:0] drive_d; assign #0.1 drive_d=raw_d;\nwire [15:0] raw_e; wire [15:0] drive_e; assign #0.1 drive_e=raw_e;\nwire [15:0] raw_f; wire [15:0] drive_f; assign #0.1 drive_f=raw_f;\nwire [15:0] raw_g; wire [15:0] drive_g; assign #0.1 drive_g=raw_g;\nwire [15:0] raw_h; wire [15:0] drive_h; assign #0.1 drive_h=raw_h;\nwire [15:0] raw_i; wire [15:0] drive_i; assign #0.1 drive_i=raw_i;\nwire [3:0] raw_sel; wire [3:0] drive_sel; assign #0.1 drive_sel=raw_sel;\nwire [15:0] gold_out, dut_out, raw_dut_out; reg [15:0] seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.e(raw_e),.f(raw_f),.g(raw_g),.h(raw_h),.i(raw_i),.sel(raw_sel),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.f(drive_f),.g(drive_g),.h(drive_h),.i(drive_i),.sel(drive_sel),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.f(drive_f),.g(drive_g),.h(drive_h),.i(drive_i),.sel(drive_sel),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<16;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob097_mux9to1v_prompt.txt": "af45812305996d9c6bbe0396b2e385b17595a7cb00e658738b3007e7a214fe0c",
        "dataset_spec-to-rtl/Prob097_mux9to1v_ref.sv": "1d3abee192ac3e21e9279edd49b2c6fb932bfcf819aef79c6fb05718373aa963",
        "dataset_spec-to-rtl/Prob097_mux9to1v_test.sv": "87f633653e84a7571d1bc821a1df7e7f183aabe191aac8e951a110a2bf9ae20c"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob098_circuit7": {
    "id": "verilogeval-netlist-settled-v2:Prob098_circuit7",
    "spec_sha256": "8b38565fe92b1cf31d5ee3b79414b3ad5c8ad44d5495e081573f99bd89f6071b",
    "checks": 240,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(posedge clk) {a} <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\t@(posedge clk) {a} <= 0;\r\n\t\t\trepeat(10) @(posedge clk) a <= $urandom;\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\ta <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input a,\r\n  output reg q\r\n);\r\n\r\n  always @(posedge clk)\r\n    q <= ~a;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.a(drive_a),.q(gold_q));\nTopModule dut(.clk(clk),.a(drive_a),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob098_circuit7_prompt.txt": "8b38565fe92b1cf31d5ee3b79414b3ad5c8ad44d5495e081573f99bd89f6071b",
        "dataset_spec-to-rtl/Prob098_circuit7_ref.sv": "c0ecb097eb7b24a6c305bd8cfbd662eec025cd1ae803c6e72bfc6c8b5f70f12b",
        "dataset_spec-to-rtl/Prob098_circuit7_test.sv": "1ce1f53a36d0da5f3485f13fd0134fb90657913bd894c0b649160eabef9be5b6"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob099_m2014_q6c": {
    "id": "verilogeval-netlist-settled-v2:Prob099_m2014_q6c",
    "spec_sha256": "cc2ea4e02994b3626eb8e5e759354cc9bfbd844bb931e8b2912d315f955064e6",
    "checks": 399,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic[6:1] y,\r\n\toutput logic w,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\t// Test the one-hot cases first.\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\ty <= 1<< ($unsigned($random(netlist_random_seed)) % 6);\r\n\t\t\tw <= $random(netlist_random_seed);\r\n\t\tend\t\r\n\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input  [5:0] y,\r\n  input        w,\r\n  output       Y1,\r\n  output       Y3\r\n);\r\n\r\n  assign Y1 = y[0]&~w;\r\n  assign Y3 = (y[1]|y[2]|y[4]|y[5]) & w;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [5:0] raw_y; wire [5:0] drive_y; assign #0.1 drive_y=raw_y;\nwire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;\nwire gold_Y1, dut_Y1, raw_dut_Y1; reg seen_Y1='0;\nwire gold_Y3, dut_Y3, raw_dut_Y3; reg seen_Y3='0;\nstimulus_gen stim1(.clk(clk),.y(raw_y),.w(raw_w),.tb_match(1'b1));\noracle_RefModule gold(.y(drive_y),.w(drive_w),.Y1(gold_Y1),.Y3(gold_Y3));\nTopModule dut(.y(drive_y),.w(drive_w),.Y1(raw_dut_Y1),.Y3(raw_dut_Y3));\nassign dut_Y1=raw_dut_Y1;\nassign dut_Y3=raw_dut_Y3;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Y1 === 1'b0 || gold_Y1 === 1'b1) begin\nknown=1; seen_Y1=1'b1;\nif(dut_Y1 !== gold_Y1) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Y3 === 1'b0 || gold_Y3 === 1'b1) begin\nknown=1; seen_Y3=1'b1;\nif(dut_Y3 !== gold_Y3) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_Y1) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Y1\");\nif((&seen_Y3) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Y3\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob099_m2014_q6c_prompt.txt": "cc2ea4e02994b3626eb8e5e759354cc9bfbd844bb931e8b2912d315f955064e6",
        "dataset_spec-to-rtl/Prob099_m2014_q6c_ref.sv": "df78843a9f32266ada24afac8b88d33c2e069b1dacc2ce3cc89f5393eb5ae505",
        "dataset_spec-to-rtl/Prob099_m2014_q6c_test.sv": "99d797ba771d0232d984d2e735f197b249b2a3ae87b24a9d5b8c823ad5710e75"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob100_fsm3comb": {
    "id": "verilogeval-netlist-settled-v2:Prob100_fsm3comb",
    "spec_sha256": "e7db4b26e1b3d5254211c4177dce8396b0ff76cbbdcfb877191f078fbfc1b624",
    "checks": 199,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in,\r\n\toutput logic [1:0] state\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\tstate <= $random(netlist_random_seed);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input in,\r\n  input [1:0] state,\r\n  output reg [1:0] next_state,\r\n  output out\r\n);\r\n\r\n  parameter A=0, B=1, C=2, D=3;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      A: next_state = in ? B : A;\r\n      B: next_state = in ? B : C;\r\n      C: next_state = in ? D : A;\r\n      D: next_state = in ? B : C;\r\n    endcase\r\n  end\r\n\r\n  assign out = (state==D);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire [1:0] raw_state; wire [1:0] drive_state; assign #0.1 drive_state=raw_state;\nwire [1:0] gold_next_state, dut_next_state, raw_dut_next_state; reg [1:0] seen_next_state='0;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.state(raw_state));\noracle_RefModule gold(.in(drive_in),.state(drive_state),.next_state(gold_next_state),.out(gold_out));\nTopModule dut(.in(drive_in),.state(drive_state),.next_state(raw_dut_next_state),.out(raw_dut_out));\nassign dut_next_state=raw_dut_next_state;\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<2;b=b+1) begin\nif(gold_next_state[b] === 1'b0 || gold_next_state[b] === 1'b1) begin\nknown=1; seen_next_state[b]=1'b1;\nif(dut_next_state[b] !== gold_next_state[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_next_state) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:next_state\");\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob100_fsm3comb_prompt.txt": "e7db4b26e1b3d5254211c4177dce8396b0ff76cbbdcfb877191f078fbfc1b624",
        "dataset_spec-to-rtl/Prob100_fsm3comb_ref.sv": "fad9bea454c95084614e334cb25263a8c6dbd5d243007551a385c66d3a1e22f5",
        "dataset_spec-to-rtl/Prob100_fsm3comb_test.sv": "579c798329aeaac10ca0d8c57ba0befd352afa8bcaf823a5efb9ad1f7769e379"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob101_circuit4": {
    "id": "verilogeval-netlist-settled-v2:Prob101_circuit4",
    "spec_sha256": "49e24e2afbb1cd04b4a54eb774b61dc4ecd3244a32a4b1cf9615e6a4106a7042",
    "checks": 240,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,b,c,d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t{a,b,c,d} <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\t@(posedge clk) {a,b,c,d} <= 0;\r\n\t\t\trepeat(18) @(posedge clk, negedge clk) {a,b,c,d} <= {a,b,c,d} + 1;\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,c,d} <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  input d,\r\n  output q\r\n);\r\n\r\n  assign q = c | b;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.q(gold_q));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob101_circuit4_prompt.txt": "49e24e2afbb1cd04b4a54eb774b61dc4ecd3244a32a4b1cf9615e6a4106a7042",
        "dataset_spec-to-rtl/Prob101_circuit4_ref.sv": "aa30e5bd9409a0d00ff25165f5957640759a0c5a1a3e4a41119b2d7bf734674e",
        "dataset_spec-to-rtl/Prob101_circuit4_test.sv": "d4988d3d1708e5f68826056e39a64339850e589e1568bfea944f6c04be76085f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob102_circuit3": {
    "id": "verilogeval-netlist-settled-v2:Prob102_circuit3",
    "spec_sha256": "2d5d051303ea19038f879536e23f2934692b5ee0452fc497120fa3f80765ed5d",
    "checks": 240,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,b,c,d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t{a,b,c,d} <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\t@(posedge clk) {a,b,c,d} <= 0;\r\n\t\t\trepeat(18) @(posedge clk, negedge clk) {a,b,c,d} <= {a,b,c,d} + 1;\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,c,d} <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  input d,\r\n  output q\r\n);\r\n\r\n  assign q = (a|b) & (c|d);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.q(gold_q));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob102_circuit3_prompt.txt": "2d5d051303ea19038f879536e23f2934692b5ee0452fc497120fa3f80765ed5d",
        "dataset_spec-to-rtl/Prob102_circuit3_ref.sv": "126af1bb585af1d46c8a85c9aa98d2a263356a7dfc1f59ed2b7f2d8c1f21563d",
        "dataset_spec-to-rtl/Prob102_circuit3_test.sv": "d4988d3d1708e5f68826056e39a64339850e589e1568bfea944f6c04be76085f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob103_circuit2": {
    "id": "verilogeval-netlist-settled-v2:Prob103_circuit2",
    "spec_sha256": "a599dbd033451f3fa829a61e8e888b76fb0a9147416833dfb1438846717916ac",
    "checks": 240,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,b,c,d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t{a,b,c,d} <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\t@(posedge clk) {a,b,c,d} <= 0;\r\n\t\t\trepeat(18) @(posedge clk, negedge clk) {a,b,c,d} <= {a,b,c,d} + 1;\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,c,d} <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  input d,\r\n  output q\r\n);\r\n\r\n  assign q = ~a^b^c^d;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.q(gold_q));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob103_circuit2_prompt.txt": "a599dbd033451f3fa829a61e8e888b76fb0a9147416833dfb1438846717916ac",
        "dataset_spec-to-rtl/Prob103_circuit2_ref.sv": "0431ac595d6859b7a6e7b3ce42ebae0f0dddc0e13afd5f1389b5737b40006674",
        "dataset_spec-to-rtl/Prob103_circuit2_test.sv": "d4988d3d1708e5f68826056e39a64339850e589e1568bfea944f6c04be76085f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob104_mt2015_muxdff": {
    "id": "verilogeval-netlist-settled-v2:Prob104_mt2015_muxdff",
    "spec_sha256": "7c6bdd166ff91fade3e2f1065e82c2825dd9289a8be08d56bfe202d2a31189f0",
    "checks": 397,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n/*\r\n\tMidterm 2015 Question 5a. Build a flip-flop with a 2-to-1 mux before it.\r\n*/\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic L,\r\n\toutput logic r_in,\r\n\toutput logic q_in\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\talways @(posedge clk, negedge clk)\r\n\t\t{L, r_in, q_in} <= $random(netlist_random_seed) % 8;\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk);\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input L,\r\n  input q_in,\r\n  input r_in,\r\n  output reg Q\r\n);\r\n\r\n  initial Q=0;\r\n  always @(posedge clk)\r\n    Q <= L ? r_in : q_in;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_L; wire drive_L; assign #0.1 drive_L=raw_L;\nwire raw_q_in; wire drive_q_in; assign #0.1 drive_q_in=raw_q_in;\nwire raw_r_in; wire drive_r_in; assign #0.1 drive_r_in=raw_r_in;\nwire gold_Q, dut_Q, raw_dut_Q; reg seen_Q='0;\nstimulus_gen stim1(.clk(clk),.L(raw_L),.r_in(raw_r_in),.q_in(raw_q_in));\noracle_RefModule gold(.clk(clk),.L(drive_L),.q_in(drive_q_in),.r_in(drive_r_in),.Q(gold_Q));\nTopModule dut(.clk(clk),.L(drive_L),.q_in(drive_q_in),.r_in(drive_r_in),.Q(raw_dut_Q));\nassign dut_Q=raw_dut_Q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Q === 1'b0 || gold_Q === 1'b1) begin\nknown=1; seen_Q=1'b1;\nif(dut_Q !== gold_Q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_Q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob104_mt2015_muxdff_prompt.txt": "7c6bdd166ff91fade3e2f1065e82c2825dd9289a8be08d56bfe202d2a31189f0",
        "dataset_spec-to-rtl/Prob104_mt2015_muxdff_ref.sv": "93923f756c732dfb6ff4fc802967ee1e69611f9236aa80b42f6e3e46059f3f97",
        "dataset_spec-to-rtl/Prob104_mt2015_muxdff_test.sv": "399061a64ab0ae9ae14c9784c7b4ea63d7661a655633dc800a434fe5d8f95781"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob105_rotate100": {
    "id": "verilogeval-netlist-settled-v2:Prob105_rotate100",
    "spec_sha256": "e224cc89d91c9985106be012fe57c5f7001988fa084901810cc4a81219e8383a",
    "checks": 8005,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg load,\r\n\toutput reg[1:0] ena,\r\n\toutput reg[99:0] data\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\talways @(posedge clk)\r\n\t\tdata <= {$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)};\r\n\t\r\n\tinitial begin #101;\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\trepeat(4000) @(posedge clk, negedge clk) begin\r\n\t\t\tload <= !($random(netlist_random_seed) & 31);\r\n\t\t\tena <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input load,\r\n  input [1:0] ena,\r\n  input [99:0] data,\r\n  output reg [99:0] q\r\n);\r\n\r\n  always @(posedge clk) begin\r\n    if (load)\r\n      q <= data;\r\n    else if (ena == 2'h1)\r\n      q <= {q[0], q[99:1]};\r\n    else if (ena == 2'h2)\r\n      q <= {q[98:0], q[99]};\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;\nwire [1:0] raw_ena; wire [1:0] drive_ena; assign #0.1 drive_ena=raw_ena;\nwire [99:0] raw_data; wire [99:0] drive_data; assign #0.1 drive_data=raw_data;\nwire [99:0] gold_q, dut_q, raw_dut_q; reg [99:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.load(raw_load),.ena(raw_ena),.data(raw_data));\noracle_RefModule gold(.clk(clk),.load(drive_load),.ena(drive_ena),.data(drive_data),.q(gold_q));\nTopModule dut(.clk(clk),.load(drive_load),.ena(drive_ena),.data(drive_data),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<100;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob105_rotate100_prompt.txt": "e224cc89d91c9985106be012fe57c5f7001988fa084901810cc4a81219e8383a",
        "dataset_spec-to-rtl/Prob105_rotate100_ref.sv": "d987e7b9143311e743be174c27b1b4ab2b1fa5c6cbf4a980485885ab349bfb1f",
        "dataset_spec-to-rtl/Prob105_rotate100_test.sv": "ab0b6f491d7830cbd7809ea6956d08599934c0e06fe29400de9bce853d358fc1"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob106_always_nolatches": {
    "id": "verilogeval-netlist-settled-v2:Prob106_always_nolatches",
    "spec_sha256": "873849aecca9962f1b20f959bdb05bebb4ead2424c89415de3d6c0057a74af20",
    "checks": 60034,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [15:0] scancode, \r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(negedge clk) wavedrom_start(\"Recognize arrow keys\");\r\n\t\t\t@(posedge clk) scancode <= 16'h0;\r\n\t\t\t@(posedge clk) scancode <= 16'h1;\r\n\t\t\t@(posedge clk) scancode <= 16'he075;\r\n\t\t\t@(posedge clk) scancode <= 16'he06b;\r\n\t\t\t@(posedge clk) scancode <= 16'he06c;\r\n\t\t\t@(posedge clk) scancode <= 16'he072;\r\n\t\t\t@(posedge clk) scancode <= 16'he074;\r\n\t\t\t@(posedge clk) scancode <= 16'he076;\r\n\t\t\t@(posedge clk) scancode <= 16'hffff;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\r\n\t\trepeat(30000) @(posedge clk, negedge clk) begin\r\n\t\t\tscancode <= $urandom;\r\n\t\tend\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [15:0] scancode,\r\n  output reg left,\r\n  output reg down,\r\n  output reg right,\r\n  output reg up\r\n);\r\n\r\n  always @(*) begin\r\n    {up, left, down, right} = 0;\r\n    case (scancode)\r\n      16'he06b: left = 1;\r\n      16'he072: down = 1;\r\n      16'he074: right = 1;\r\n      16'he075: up = 1;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [15:0] raw_scancode; wire [15:0] drive_scancode; assign #0.1 drive_scancode=raw_scancode;\nwire gold_left, dut_left, raw_dut_left; reg seen_left='0;\nwire gold_down, dut_down, raw_dut_down; reg seen_down='0;\nwire gold_right, dut_right, raw_dut_right; reg seen_right='0;\nwire gold_up, dut_up, raw_dut_up; reg seen_up='0;\nstimulus_gen stim1(.clk(clk),.scancode(raw_scancode),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.scancode(drive_scancode),.left(gold_left),.down(gold_down),.right(gold_right),.up(gold_up));\nTopModule dut(.scancode(drive_scancode),.left(raw_dut_left),.down(raw_dut_down),.right(raw_dut_right),.up(raw_dut_up));\nassign dut_left=raw_dut_left;\nassign dut_down=raw_dut_down;\nassign dut_right=raw_dut_right;\nassign dut_up=raw_dut_up;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_left === 1'b0 || gold_left === 1'b1) begin\nknown=1; seen_left=1'b1;\nif(dut_left !== gold_left) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_down === 1'b0 || gold_down === 1'b1) begin\nknown=1; seen_down=1'b1;\nif(dut_down !== gold_down) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_right === 1'b0 || gold_right === 1'b1) begin\nknown=1; seen_right=1'b1;\nif(dut_right !== gold_right) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_up === 1'b0 || gold_up === 1'b1) begin\nknown=1; seen_up=1'b1;\nif(dut_up !== gold_up) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_left) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:left\");\nif((&seen_down) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:down\");\nif((&seen_right) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:right\");\nif((&seen_up) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:up\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob106_always_nolatches_prompt.txt": "873849aecca9962f1b20f959bdb05bebb4ead2424c89415de3d6c0057a74af20",
        "dataset_spec-to-rtl/Prob106_always_nolatches_ref.sv": "7bbe31f81075009ab735d4d5fb94524426d62caff6ce8da290ae5bcb3c84f83d",
        "dataset_spec-to-rtl/Prob106_always_nolatches_test.sv": "c2cdcc07e88de3283c88638818245ff5cc9bb1d3f5d072e6ace12faab71b51c4"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob107_fsm1s": {
    "id": "verilogeval-netlist-settled-v2:Prob107_fsm1s",
    "spec_sha256": "38ff26f295c6f5944234ea1327a4c6eb2f9b5998f692704b25fcf41bc68d5f2b",
    "checks": 459,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in,\r\n\toutput logic reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tin <= 0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0; in <= 0;\r\n\t\t@(posedge clk) in <= 1;\r\n\t\twavedrom_start();\r\n\t\t\treset_test(0);\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 7);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input in,\r\n  input reset,\r\n  output out\r\n);\r\n\r\n  parameter A=0, B=1;\r\n  reg state;\r\n  reg next;\r\n\r\n    always_comb begin\r\n    case (state)\r\n      A: next = in ? A : B;\r\n      B: next = in ? B : A;\r\n    endcase\r\n    end\r\n\r\n    always @(posedge clk) begin\r\n    if (reset) state <= B;\r\n        else state <= next;\r\n  end\r\n\r\n  assign out = (state==B);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.out(gold_out));\nTopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob107_fsm1s_prompt.txt": "38ff26f295c6f5944234ea1327a4c6eb2f9b5998f692704b25fcf41bc68d5f2b",
        "dataset_spec-to-rtl/Prob107_fsm1s_ref.sv": "d3e13054d9137862213ecf6ae1ebaca0cd3cc71990a2e6d020641babc5b1fae3",
        "dataset_spec-to-rtl/Prob107_fsm1s_test.sv": "7da78bb878213e7aa185e46f0991b643084aab547d6dd4aed4a027ba2c893390"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob108_rule90": {
    "id": "verilogeval-netlist-settled-v2:Prob108_rule90",
    "spec_sha256": "0ecd29103b02aa7df74d4ee88d314a6b67877f517e53b3ba488c941be91b68f7",
    "checks": 14241,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg load,\r\n\toutput reg[511:0] data,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\tdata <= 0;\r\n\t\tdata[0] <= 1'b1;\r\n\t\tload <= 1;\r\n\t\t@(posedge clk); wavedrom_start(\"Sierpi&#324;ski triangle: See Hint.\");\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(10) @(posedge clk);\t\t\r\n\t\twavedrom_stop();\r\n\r\n\r\n\t\tdata <= 0;\r\n\t\tdata[256] <= 1'b1;\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(1000) @(posedge clk) begin\r\n\t\tend\r\n\t\tdata <= 512'h1000000000000001;\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(1000) @(posedge clk) begin\r\n\t\tend\r\n\r\n\t\tdata <= $random(netlist_random_seed);\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(1000) @(posedge clk) begin\r\n\t\tend\r\n\r\n\t\tdata <= 0;\r\n\t\tload <= 1;\r\n\t\trepeat(20) @(posedge clk);\r\n\t\trepeat(2) @(posedge clk) data <= data + 2;\r\n\t\t@(posedge clk) begin \r\n\t\t\tload <= 0;\r\n\t\t\tdata <= data + 1;\r\n\t\tend\r\n\t\trepeat(20) @(posedge clk) data <= data + 1;\r\n\t\trepeat(500) @(posedge clk) begin\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input load,\r\n  input [511:0] data,\r\n  output reg [511:0] q\r\n);\r\n\r\n  always @(posedge clk) begin\r\n    if (load)\r\n      q <= data;\r\n    else begin\r\n      q <= q[$bits(q)-1:1] ^ {q[$bits(q)-2:0], 1'b0} ;\r\n    end\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;\nwire [511:0] raw_data; wire [511:0] drive_data; assign #0.1 drive_data=raw_data;\nwire [511:0] gold_q, dut_q, raw_dut_q; reg [511:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.load(raw_load),.data(raw_data),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.load(drive_load),.data(drive_data),.q(gold_q));\nTopModule dut(.clk(clk),.load(drive_load),.data(drive_data),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<512;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob108_rule90_prompt.txt": "0ecd29103b02aa7df74d4ee88d314a6b67877f517e53b3ba488c941be91b68f7",
        "dataset_spec-to-rtl/Prob108_rule90_ref.sv": "68731f5d6ef5b5a7d8007c600ab2750b477aa0a270f16b59dc3507ae4d29817b",
        "dataset_spec-to-rtl/Prob108_rule90_test.sv": "80a1a81c8d40b922df86012766245c823fcd31540e75ff5cbe6cbf1c1bd97405"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob109_fsm1": {
    "id": "verilogeval-netlist-settled-v2:Prob109_fsm1",
    "spec_sha256": "8a0416fb809a0f8e2923cbf9a1b8962a09bff493f612dfe5404e85278522c64a",
    "checks": 455,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in,\r\n\toutput logic areset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tin <= 0;\r\n\t\t@(posedge clk) reset <= 0; in <= 0;\r\n\t\t@(posedge clk) in <= 1;\r\n\t\twavedrom_start();\r\n\t\t\treset_test(1);\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 7);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input in,\r\n  input areset,\r\n  output out\r\n);\r\n\r\n  parameter A=0, B=1;\r\n  reg state;\r\n  reg next;\r\n\r\n    always_comb begin\r\n    case (state)\r\n      A: next = in ? A : B;\r\n      B: next = in ? B : A;\r\n    endcase\r\n    end\r\n\r\n    always @(posedge clk, posedge areset) begin\r\n    if (areset) state <= B;\r\n        else state <= next;\r\n  end\r\n\r\n  assign out = (state==B);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.areset(raw_areset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.in(drive_in),.out(gold_out));\nTopModule dut(.clk(clk),.areset(drive_areset),.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob109_fsm1_prompt.txt": "8a0416fb809a0f8e2923cbf9a1b8962a09bff493f612dfe5404e85278522c64a",
        "dataset_spec-to-rtl/Prob109_fsm1_ref.sv": "f4f56eae089c955ca7e4f59ef66f8eec4e7a4ff7eaaf599f3b3c53a895d0065f",
        "dataset_spec-to-rtl/Prob109_fsm1_test.sv": "efffc62c9af026722c5bab5b12ccefd91a9a6035c135500a4b989cf548603177"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob110_fsm2": {
    "id": "verilogeval-netlist-settled-v2:Prob110_fsm2",
    "spec_sha256": "e685516f8403f41265eff8daee590aad5df5e4a4b171c653e6212c4309c18a33",
    "checks": 481,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic j, k,\r\n\toutput logic areset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\treg [0:11][1:0] d = 24'b000101010010101111111111;\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tj <= 0;\r\n\t\tk <= 0;\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\tj <= 1;\r\n\t\t@(posedge clk);\r\n\t\tj <= 0;\r\n\t\twavedrom_start(\"Reset and transitions\");\r\n\t\treset_test(1);\r\n\t\tfor (int i=0;i<12;i++)\r\n\t\t\t@(posedge clk) {k, j} <= d[i];\r\n\t\twavedrom_stop();\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\t{j,k} <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 7);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input j,\r\n  input k,\r\n  input areset,\r\n  output out\r\n);\r\n\r\n  parameter A=0, B=1;\r\n  reg state;\r\n  reg next;\r\n\r\n    always_comb begin\r\n    case (state)\r\n      A: next = j ? B : A;\r\n      B: next = k ? A : B;\r\n    endcase\r\n    end\r\n\r\n    always @(posedge clk, posedge areset) begin\r\n    if (areset) state <= A;\r\n        else state <= next;\r\n  end\r\n\r\n  assign out = (state==B);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_j; wire drive_j; assign #0.1 drive_j=raw_j;\nwire raw_k; wire drive_k; assign #0.1 drive_k=raw_k;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.j(raw_j),.k(raw_k),.areset(raw_areset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.j(drive_j),.k(drive_k),.out(gold_out));\nTopModule dut(.clk(clk),.areset(drive_areset),.j(drive_j),.k(drive_k),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob110_fsm2_prompt.txt": "e685516f8403f41265eff8daee590aad5df5e4a4b171c653e6212c4309c18a33",
        "dataset_spec-to-rtl/Prob110_fsm2_ref.sv": "8be19bea25bc9453ddad79bccc4b2fa9558e58f5d402ef116313f81e0a97d4fc",
        "dataset_spec-to-rtl/Prob110_fsm2_test.sv": "aa146c4ecac3b8be37b838bb71df0fa9cc67847d014ee59af4b8ec702e024e87"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob111_fsm2s": {
    "id": "verilogeval-netlist-settled-v2:Prob111_fsm2s",
    "spec_sha256": "2b1a8fb827bc6b2e2516f3b8813caa5a17eedcb2f4460490c0a453f9e84c2442",
    "checks": 481,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic j, k,\r\n\toutput logic reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\treg [0:11][1:0] d = 24'b000101010010101111111111;\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tj <= 0;\r\n\t\tk <= 0;\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\tj <= 1;\r\n\t\t@(posedge clk);\r\n\t\tj <= 0;\r\n\t\twavedrom_start(\"Reset and transitions\");\r\n\t\treset_test();\r\n\t\tfor (int i=0;i<12;i++)\r\n\t\t\t@(posedge clk) {k, j} <= d[i];\r\n\t\twavedrom_stop();\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\t{j,k} <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 7);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input j,\r\n  input k,\r\n  input reset,\r\n  output out\r\n);\r\n\r\n  parameter A=0, B=1;\r\n  reg state;\r\n  reg next;\r\n\r\n    always_comb begin\r\n    case (state)\r\n      A: next = j ? B : A;\r\n      B: next = k ? A : B;\r\n    endcase\r\n    end\r\n\r\n    always @(posedge clk) begin\r\n    if (reset) state <= A;\r\n        else state <= next;\r\n  end\r\n\r\n  assign out = (state==B);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_j; wire drive_j; assign #0.1 drive_j=raw_j;\nwire raw_k; wire drive_k; assign #0.1 drive_k=raw_k;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.j(raw_j),.k(raw_k),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.j(drive_j),.k(drive_k),.out(gold_out));\nTopModule dut(.clk(clk),.reset(drive_reset),.j(drive_j),.k(drive_k),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob111_fsm2s_prompt.txt": "2b1a8fb827bc6b2e2516f3b8813caa5a17eedcb2f4460490c0a453f9e84c2442",
        "dataset_spec-to-rtl/Prob111_fsm2s_ref.sv": "c95b6b92e82cb92e2f6f14682483ff12d2c3eead18925ccabefc25e99b667604",
        "dataset_spec-to-rtl/Prob111_fsm2s_test.sv": "ea132bad01c4fc2906f553d92a83517fe672fd6e86f174b04d73ee33503e3cd0"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob112_always_case2": {
    "id": "verilogeval-netlist-settled-v2:Prob112_always_case2",
    "spec_sha256": "a6da5858d2b6e0ef4b785cbb39c0670c004560e71e660d955e4f48e654caae37",
    "checks": 182,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [3:0] in, \r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(negedge clk) wavedrom_start(\"Priority encoder\");\r\n\t\t\t@(posedge clk) in <= 4'h1;\r\n\t\t\trepeat(4) @(posedge clk) in <= in << 1;\r\n\t\t\tin <= 0;\r\n\t\t\trepeat(16) @(posedge clk) in <= in + 1;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\r\n\t\trepeat(50) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $urandom;\r\n\t\tend\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [3:0] in,\r\n  output reg [1:0] pos\r\n);\r\n\r\n  always @(*) begin\r\n    case (in)\r\n      4'h0: pos = 2'h0;\r\n      4'h1: pos = 2'h0;\r\n      4'h2: pos = 2'h1;\r\n      4'h3: pos = 2'h0;\r\n      4'h4: pos = 2'h2;\r\n      4'h5: pos = 2'h0;\r\n      4'h6: pos = 2'h1;\r\n      4'h7: pos = 2'h0;\r\n      4'h8: pos = 2'h3;\r\n      4'h9: pos = 2'h0;\r\n      4'ha: pos = 2'h1;\r\n      4'hb: pos = 2'h0;\r\n      4'hc: pos = 2'h2;\r\n      4'hd: pos = 2'h0;\r\n      4'he: pos = 2'h1;\r\n      4'hf: pos = 2'h0;\r\n      default: pos = 2'b0;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [3:0] raw_in; wire [3:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [1:0] gold_pos, dut_pos, raw_dut_pos; reg [1:0] seen_pos='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.pos(gold_pos));\nTopModule dut(.in(drive_in),.pos(raw_dut_pos));\nassign dut_pos=raw_dut_pos;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<2;b=b+1) begin\nif(gold_pos[b] === 1'b0 || gold_pos[b] === 1'b1) begin\nknown=1; seen_pos[b]=1'b1;\nif(dut_pos[b] !== gold_pos[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_pos) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:pos\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob112_always_case2_prompt.txt": "a6da5858d2b6e0ef4b785cbb39c0670c004560e71e660d955e4f48e654caae37",
        "dataset_spec-to-rtl/Prob112_always_case2_ref.sv": "520e9a98532535747e3841178ad3e1c864f0d404976682f46a35a58f684f166b",
        "dataset_spec-to-rtl/Prob112_always_case2_test.sv": "792c6e851f75e3ce1b739e75cd40550473e7fa5b5266501c9e2ad1746089a0e6"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob113_2012_q1g": {
    "id": "verilogeval-netlist-settled-v2:Prob113_2012_q1g",
    "spec_sha256": "19b28233b2d115447f025cd34041f206268e26fe56858da42f06cbc36d9ee5a5",
    "checks": 199,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [3:0] x\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\tx <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [3:0] x,\r\n  output logic f\r\n);\r\n\r\n  always_comb begin\r\n    case (x)\r\n      4'h0: f = 1;\r\n      4'h1: f = 1;\r\n      4'h2: f = 0;\r\n      4'h3: f = 0;\r\n      4'h4: f = 1;\r\n      4'h5: f = 1;\r\n      4'h6: f = 1;\r\n      4'h7: f = 0;\r\n      4'h8: f = 0;\r\n      4'h9: f = 0;\r\n      4'ha: f = 0;\r\n      4'hb: f = 0;\r\n      4'hc: f = 1;\r\n      4'hd: f = 0;\r\n      4'he: f = 1;\r\n      4'hf: f = 1;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [3:0] raw_x; wire [3:0] drive_x; assign #0.1 drive_x=raw_x;\nwire gold_f, dut_f, raw_dut_f; reg seen_f='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x));\noracle_RefModule gold(.x(drive_x),.f(gold_f));\nTopModule dut(.x(drive_x),.f(raw_dut_f));\nassign dut_f=raw_dut_f;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_f === 1'b0 || gold_f === 1'b1) begin\nknown=1; seen_f=1'b1;\nif(dut_f !== gold_f) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_f) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:f\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob113_2012_q1g_prompt.txt": "19b28233b2d115447f025cd34041f206268e26fe56858da42f06cbc36d9ee5a5",
        "dataset_spec-to-rtl/Prob113_2012_q1g_ref.sv": "63d4625bd635ad0d6fa1456fba6b7857cfe998724f64e366358c2f9410dc9228",
        "dataset_spec-to-rtl/Prob113_2012_q1g_test.sv": "f0937f1cfa6c3a40d720b17fafe45f7c7ed5723524ef51c59135e33668c6926f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob114_bugs_case": {
    "id": "verilogeval-netlist-settled-v2:Prob114_bugs_case",
    "spec_sha256": "96638586a3617ae76a7acd11a29ca9796c892fc56b4667ff08ff430e3458cc6e",
    "checks": 2080,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [7:0] code,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\tcode <= 8'h45;\r\n\t\t@(negedge clk) wavedrom_start(\"Decode scancodes\");\r\n\t\t\t@(posedge clk) code <= 8'h45;\r\n\t\t\t@(posedge clk) code <= 8'h03;\r\n\t\t\t@(posedge clk) code <= 8'h46;\r\n\t\t\t@(posedge clk) code <= 8'h16;\r\n\t\t\t@(posedge clk) code <= 8'd26;\r\n\t\t\t@(posedge clk) code <= 8'h1e;\r\n\t\t\t@(posedge clk) code <= 8'h25;\r\n\t\t\t@(posedge clk) code <= 8'h26;\r\n\t\t\t@(posedge clk) code <= 8'h2e;\r\n\t\t\t@(posedge clk) code <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk) code <= 8'h36;\r\n\t\t\t@(posedge clk) code <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk) code <= 8'h3d;\r\n\t\t\t@(posedge clk) code <= 8'h3e;\r\n\t\t\t@(posedge clk) code <= 8'h45;\r\n\t\t\t@(posedge clk) code <= 8'h46;\r\n\t\t\t@(posedge clk) code <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk) code <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk) code <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk) code <= $random(netlist_random_seed);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(1000) @(posedge clk, negedge clk) begin\r\n\t\t\tcode <= $urandom;\r\n\t\tend\r\n\t\t\t\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [7:0] code,\r\n  output reg [3:0] out,\r\n  output reg valid\r\n);\r\n\r\n  // uhh.. make a case statement: maps scancode to 0-9, but accidentally\r\n  // infer a latch? and have one of the entries be wrong? (duplicate\r\n  // case, using different base!)\r\n\r\n  always @(*) begin\r\n    out = 0;\r\n    valid = 1;\r\n    case (code)\r\n      8'h45: out = 0;\r\n      8'h16: out = 1;\r\n      8'h1e: out = 2;\r\n      8'h26: out = 3;\r\n      8'h25: out = 4;\r\n      8'h2e: out = 5;\r\n      8'h36: out = 6;\r\n      8'h3d: out = 7;\r\n      8'h3e: out = 8;\r\n      8'h46: out = 9;\r\n      default: valid = 0;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [7:0] raw_code; wire [7:0] drive_code; assign #0.1 drive_code=raw_code;\nwire [3:0] gold_out, dut_out, raw_dut_out; reg [3:0] seen_out='0;\nwire gold_valid, dut_valid, raw_dut_valid; reg seen_valid='0;\nstimulus_gen stim1(.clk(clk),.code(raw_code),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.code(drive_code),.out(gold_out),.valid(gold_valid));\nTopModule dut(.code(drive_code),.out(raw_dut_out),.valid(raw_dut_valid));\nassign dut_out=raw_dut_out;\nassign dut_valid=raw_dut_valid;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_valid === 1'b0 || gold_valid === 1'b1) begin\nknown=1; seen_valid=1'b1;\nif(dut_valid !== gold_valid) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\nif((&seen_valid) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:valid\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob114_bugs_case_prompt.txt": "96638586a3617ae76a7acd11a29ca9796c892fc56b4667ff08ff430e3458cc6e",
        "dataset_spec-to-rtl/Prob114_bugs_case_ref.sv": "990d682a882aec97066729dc5933b591bc39b869df779bc40b607a6e120b0768",
        "dataset_spec-to-rtl/Prob114_bugs_case_test.sv": "7b517cb39fe17b9f71df1800da2d0ac7b4831c13cf4bc56af32aefd0db6183ed"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob115_shift18": {
    "id": "verilogeval-netlist-settled-v2:Prob115_shift18",
    "spec_sha256": "bdcbb8d0563ae52499ae461eed584c9cc691b9148ddd69f9bd9aa6feec5bb793",
    "checks": 8073,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg load,\r\n\toutput reg ena,\r\n\toutput reg[1:0] amount,\r\n\toutput reg[63:0] data,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\tload <= 1;\r\n\t\tena <= 0;\r\n\t\tdata <= 'x;\r\n\t\tamount <= 0;\r\n\t\t@(posedge clk) data <= 64'h000100;\r\n\t\twavedrom_start(\"Shifting\");\r\n\t\t\t@(posedge clk) load <= 0; ena <= 1;\r\n\t\t\t\t\t\t\tamount <= 2;\r\n\t\t\t@(posedge clk) amount <= 2;\r\n\t\t\t@(posedge clk) amount <= 2;\r\n\t\t\t@(posedge clk) amount <= 1;\r\n\t\t\t@(posedge clk) amount <= 1;\r\n\t\t\t@(posedge clk) amount <= 0;\r\n\t\t\t@(posedge clk) amount <= 0;\r\n\t\t\t@(posedge clk) amount <= 3;\r\n\t\t\t@(posedge clk) amount <= 3;\r\n\t\t\t@(posedge clk) amount <= 2;\r\n\t\t\t@(posedge clk) amount <= 2;\r\n\t\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\t@(posedge clk); load <= 1; data <= 64'hx;\r\n\t\t@(posedge clk); load <= 1; data <= 64'h80000000_00000000;\r\n\t\twavedrom_start(\"Arithmetic right shift\");\r\n\t\t\t@(posedge clk) load <= 0; ena <= 1;\r\n\t\t\t\t\t\t\tamount <= 2;\r\n\t\t\t@(posedge clk) amount <= 2;\r\n\t\t\t@(posedge clk) amount <= 2;\r\n\t\t\t@(posedge clk) amount <= 2;\r\n\t\t\t@(posedge clk) amount <= 2;\r\n\t\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\t\r\n\t\t\r\n\t\trepeat(4000) @(posedge clk, negedge clk) begin\r\n\t\t\tload <= !($random(netlist_random_seed) & 31);\r\n\t\t\tena <= |($random(netlist_random_seed) & 15);\r\n\t\t\tamount <= $random(netlist_random_seed);\r\n\t\t\tdata <= {$random(netlist_random_seed),$random(netlist_random_seed)};\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input load,\r\n  input ena,\r\n  input [1:0] amount,\r\n  input [63:0] data,\r\n  output reg [63:0] q\r\n);\r\n\r\n  always @(posedge clk) begin\r\n    if (load)\r\n      q <= data;\r\n    else if (ena) case (amount)\r\n      2'b00: q <= {q[62:0], 1'b0};\r\n      2'b01: q <= {q[55:0], 8'b0};\r\n      2'b10: q <= {q[63], q[63:1]};\r\n      2'b11: q <= {{8{q[63]}}, q[63:8]};\r\n      default: q <= 64'hx;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;\nwire raw_ena; wire drive_ena; assign #0.1 drive_ena=raw_ena;\nwire [1:0] raw_amount; wire [1:0] drive_amount; assign #0.1 drive_amount=raw_amount;\nwire [63:0] raw_data; wire [63:0] drive_data; assign #0.1 drive_data=raw_data;\nwire [63:0] gold_q, dut_q, raw_dut_q; reg [63:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.load(raw_load),.ena(raw_ena),.amount(raw_amount),.data(raw_data),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.load(drive_load),.ena(drive_ena),.amount(drive_amount),.data(drive_data),.q(gold_q));\nTopModule dut(.clk(clk),.load(drive_load),.ena(drive_ena),.amount(drive_amount),.data(drive_data),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<64;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob115_shift18_prompt.txt": "bdcbb8d0563ae52499ae461eed584c9cc691b9148ddd69f9bd9aa6feec5bb793",
        "dataset_spec-to-rtl/Prob115_shift18_ref.sv": "a81fa17a7005bf6c9b73277fa116021804ec6fd5e49f04ea096f9b1e35f6cd73",
        "dataset_spec-to-rtl/Prob115_shift18_test.sv": "99e604e2d22d6d613ccbbb0c7778339d3421dcbf74e34d931fb167df8293e541"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob116_m2014_q3": {
    "id": "verilogeval-netlist-settled-v2:Prob116_m2014_q3",
    "spec_sha256": "56aedff533870361ed6fd33e3820eab5eece4bc252d0aed26a965492219b7229",
    "checks": 123,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [3:0] x\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\tx <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [3:0] x,\r\n  output logic f\r\n);\r\n\r\n  always_comb begin\r\n    case (x)\r\n      4'h0: f = 1'bx;\r\n      4'h1: f = 1'bx;\r\n      4'h2: f = 0;\r\n      4'h3: f = 1'bx;\r\n      4'h4: f = 1;\r\n      4'h5: f = 1'bx;\r\n      4'h6: f = 1;\r\n      4'h7: f = 0;\r\n      4'h8: f = 0;\r\n      4'h9: f = 0;\r\n      4'ha: f = 1'bx;\r\n      4'hb: f = 1;\r\n      4'hc: f = 1;\r\n      4'hd: f = 1'bx;\r\n      4'he: f = 1;\r\n      4'hf: f = 1'bx;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [3:0] raw_x; wire [3:0] drive_x; assign #0.1 drive_x=raw_x;\nwire gold_f, dut_f, raw_dut_f; reg seen_f='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x));\noracle_RefModule gold(.x(drive_x),.f(gold_f));\nTopModule dut(.x(drive_x),.f(raw_dut_f));\nassign dut_f=raw_dut_f;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_f === 1'b0 || gold_f === 1'b1) begin\nknown=1; seen_f=1'b1;\nif(dut_f !== gold_f) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_f) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:f\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob116_m2014_q3_prompt.txt": "56aedff533870361ed6fd33e3820eab5eece4bc252d0aed26a965492219b7229",
        "dataset_spec-to-rtl/Prob116_m2014_q3_ref.sv": "417add6817728f19bbbdce23ebfe034a1a6feb152d15535687184225439f2448",
        "dataset_spec-to-rtl/Prob116_m2014_q3_test.sv": "f0937f1cfa6c3a40d720b17fafe45f7c7ed5723524ef51c59135e33668c6926f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob117_circuit9": {
    "id": "verilogeval-netlist-settled-v2:Prob117_circuit9",
    "spec_sha256": "0fd558f34b6172692f80d55d881d033027d216e2f88b4159ea7d6949ce924dec",
    "checks": 488,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\ta <= 1;\r\n\t\t@(negedge clk) {a} <= 1;\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\trepeat(2) @(posedge clk);\r\n\t\t\t@(posedge clk) {a} <= 0;\r\n\t\t\trepeat(11) @(posedge clk);\r\n\t\t\t@(negedge clk) a <= 1;\r\n\t\t\trepeat(5) @(posedge clk, negedge clk);\r\n\t\t\ta <= 0;\r\n\t\t\trepeat(4) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\ta <= &((5)'($urandom));\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input a,\r\n  output reg [2:0] q\r\n);\r\n\r\n  always @(posedge clk)\r\n    if (a)\r\n      q <= 4;\r\n    else if (q == 6)\r\n      q <= 0;\r\n    else\r\n      q <= q + 1'b1;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire [2:0] gold_q, dut_q, raw_dut_q; reg [2:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.a(drive_a),.q(gold_q));\nTopModule dut(.clk(clk),.a(drive_a),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<3;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob117_circuit9_prompt.txt": "0fd558f34b6172692f80d55d881d033027d216e2f88b4159ea7d6949ce924dec",
        "dataset_spec-to-rtl/Prob117_circuit9_ref.sv": "8b501ddf5c8e42750bd44fe616e9503468b84539b3230ecc94580b039eac73d8",
        "dataset_spec-to-rtl/Prob117_circuit9_test.sv": "20e209b3c65867307a267cee6cc5d4a4e563977956acf103f045f7a326d31550"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob118_history_shift": {
    "id": "verilogeval-netlist-settled-v2:Prob118_history_shift",
    "spec_sha256": "5b541d83f2f80b13368e5ff815538b690f622ef576ef60a3eb759769c37556ae",
    "checks": 4109,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\nmodule stimulus_gen\r\n(\r\n\tinput clk,\r\n\toutput logic areset,\r\n\t\r\n\toutput logic predict_valid,\r\n\toutput predict_taken,\r\n\t\r\n\toutput logic train_mispredicted,\r\n\toutput train_taken,\r\n\toutput [31:0] train_history,\r\n\r\n\tinput tb_match,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\toutput int wavedrom_hide_after_time\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\treg reset;\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\t\r\n\tassign areset = reset;\r\n\tlogic predict_taken_r;\r\n\tassign predict_taken = predict_valid ? predict_taken_r : 1'bx;\r\n\t\r\n\tlogic train_taken_r;\r\n\tlogic [31:0] train_history_r;\r\n\tassign train_taken = train_mispredicted ? train_taken_r : 1'bx;\r\n\tassign train_history = train_mispredicted ? train_history_r : 32'hx;\r\n\t\r\n\t\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(posedge clk) reset <= 1;\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\tpredict_taken_r <= 1;\r\n\t\tpredict_valid <= 1;\r\n\t\ttrain_mispredicted <= 0;\r\n\t\ttrain_history_r <= 32'h5;\r\n\t\ttrain_taken_r <= 1;\r\n\t\r\n\t\twavedrom_start(\"Asynchronous reset\");\r\n\t\t\treset_test(1); // Test for asynchronous reset\r\n\t\twavedrom_stop();\r\n\t\t@(posedge clk) reset <= 1;\r\n\t\tpredict_valid <= 0;\r\n\r\n\t\twavedrom_start(\"Predictions: Shift in\");\r\n\t\trepeat(2) @(posedge clk) {predict_valid, predict_taken_r} <= {$urandom};\r\n\t\treset <= 0;\r\n\t\tpredict_valid <= 1;\r\n\t\trepeat(6) @(posedge clk) {predict_taken_r} <= {$urandom};\r\n\t\tpredict_valid <= 0;\r\n\t\trepeat(3) @(posedge clk) {predict_taken_r} <= {$urandom};\r\n\t\tpredict_valid <= 1;\r\n\t\ttrain_mispredicted <= 1;\r\n\t\t@(posedge clk) train_mispredicted <= 0;\r\n\t\trepeat(6) @(posedge clk) {predict_taken_r} <= {$urandom};\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(2000) @(posedge clk,negedge clk) begin\r\n\t\t\t{predict_valid, predict_taken_r, train_taken_r} <= {$urandom};\r\n\t\t\ttrain_history_r <= $urandom;\r\n\t\t\ttrain_mispredicted <= !($urandom_range(0,31));\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\n\t\r\nendmodule\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n  input predict_valid,\r\n  input predict_taken,\r\n  output logic [31:0] predict_history,\r\n\r\n  input train_mispredicted,\r\n  input train_taken,\r\n  input [31:0] train_history\r\n);\r\n\r\n  always@(posedge clk, posedge areset)\r\n    if (areset) begin\r\n      predict_history = 0;\r\n        end  else begin\r\n      if (train_mispredicted)\r\n        predict_history <= {train_history, train_taken};\r\n      else if (predict_valid)\r\n        predict_history <= {predict_history, predict_taken};\r\n    end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_predict_valid; wire drive_predict_valid; assign #0.1 drive_predict_valid=raw_predict_valid;\nwire raw_predict_taken; wire drive_predict_taken; assign #0.1 drive_predict_taken=raw_predict_taken;\nwire raw_train_mispredicted; wire drive_train_mispredicted; assign #0.1 drive_train_mispredicted=raw_train_mispredicted;\nwire raw_train_taken; wire drive_train_taken; assign #0.1 drive_train_taken=raw_train_taken;\nwire [31:0] raw_train_history; wire [31:0] drive_train_history; assign #0.1 drive_train_history=raw_train_history;\nwire [31:0] gold_predict_history, dut_predict_history, raw_dut_predict_history; reg [31:0] seen_predict_history='0;\nstimulus_gen stim1(.clk(clk),.areset(raw_areset),.predict_valid(raw_predict_valid),.predict_taken(raw_predict_taken),.train_mispredicted(raw_train_mispredicted),.train_taken(raw_train_taken),.train_history(raw_train_history),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable(),.wavedrom_hide_after_time());\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.predict_valid(drive_predict_valid),.predict_taken(drive_predict_taken),.train_mispredicted(drive_train_mispredicted),.train_taken(drive_train_taken),.train_history(drive_train_history),.predict_history(gold_predict_history));\nTopModule dut(.clk(clk),.areset(drive_areset),.predict_valid(drive_predict_valid),.predict_taken(drive_predict_taken),.train_mispredicted(drive_train_mispredicted),.train_taken(drive_train_taken),.train_history(drive_train_history),.predict_history(raw_dut_predict_history));\nassign dut_predict_history=raw_dut_predict_history;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<32;b=b+1) begin\nif(gold_predict_history[b] === 1'b0 || gold_predict_history[b] === 1'b1) begin\nknown=1; seen_predict_history[b]=1'b1;\nif(dut_predict_history[b] !== gold_predict_history[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_predict_history) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:predict_history\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob118_history_shift_prompt.txt": "5b541d83f2f80b13368e5ff815538b690f622ef576ef60a3eb759769c37556ae",
        "dataset_spec-to-rtl/Prob118_history_shift_ref.sv": "4425a8873ebcda72bd7110166a4a42c07201c402805dd9bfde686372eabfbbf1",
        "dataset_spec-to-rtl/Prob118_history_shift_test.sv": "d99a26f264403f2a95e994400cc9946798f2b57bfbbd5be249af205b2b3177ab"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob119_fsm3": {
    "id": "verilogeval-netlist-settled-v2:Prob119_fsm3",
    "spec_sha256": "c4bd7a8a42e599d4cb22412c5c0e1a8ed082a7cb12ac441d90de91cd577ae9a4",
    "checks": 459,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in,\r\n\toutput logic areset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tin <= 0;\r\n\t\t@(posedge clk) reset <= 0; in <= 1;\r\n\t\t@(posedge clk) in <= 0;\r\n\t\t@(posedge clk) in <= 1;\r\n\t\twavedrom_start();\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk);\r\n\t\t\t@(negedge clk) reset <= 1;\r\n\t\t\t@(posedge clk) reset <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input in,\r\n  input areset,\r\n  output out\r\n);\r\n\r\n  parameter A=0, B=1, C=2, D=3;\r\n  reg [1:0] state;\r\n  reg [1:0] next;\r\n\r\n  always_comb begin\r\n  case (state)\r\n    A: next = in ? B : A;\r\n    B: next = in ? B : C;\r\n    C: next = in ? D : A;\r\n    D: next = in ? B : C;\r\n  endcase\r\n  end\r\n\r\n  always @(posedge clk, posedge areset) begin\r\n    if (areset) state <= A;\r\n      else state <= next;\r\n  end\r\n\r\n  assign out = (state==D);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.areset(raw_areset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.in(drive_in),.out(gold_out));\nTopModule dut(.clk(clk),.areset(drive_areset),.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob119_fsm3_prompt.txt": "c4bd7a8a42e599d4cb22412c5c0e1a8ed082a7cb12ac441d90de91cd577ae9a4",
        "dataset_spec-to-rtl/Prob119_fsm3_ref.sv": "893c89407124afc3d51d6089262eff8a80abc0eeee15950006c6d063978f0c9b",
        "dataset_spec-to-rtl/Prob119_fsm3_test.sv": "671afe85dfc599fa6f07f2052df26d03f9c7a91d1d953182948bdd21e9b3f1cc"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob120_fsm3s": {
    "id": "verilogeval-netlist-settled-v2:Prob120_fsm3s",
    "spec_sha256": "a73146cada3e601e08f77824931562473b182a836be73aca063bbe47d390a86a",
    "checks": 459,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in,\r\n\toutput logic reset,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tin <= 0;\r\n\t\t@(posedge clk) reset <= 0; in <= 1;\r\n\t\t@(posedge clk) in <= 0;\r\n\t\t@(posedge clk) in <= 1;\r\n\t\twavedrom_start();\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk);\r\n\t\t\t@(negedge clk) reset <= 1;\r\n\t\t\t@(posedge clk) reset <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 0;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t\t@(posedge clk) in <= 1;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input in,\r\n  input reset,\r\n  output out\r\n);\r\n\r\n  parameter A=0, B=1, C=2, D=3;\r\n  reg [1:0] state;\r\n  reg [1:0] next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      A: next = in ? B : A;\r\n      B: next = in ? B : C;\r\n      C: next = in ? D : A;\r\n      D: next = in ? B : C;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= A;\r\n      else state <= next;\r\n  end\r\n\r\n  assign out = (state==D);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.out(gold_out));\nTopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob120_fsm3s_prompt.txt": "a73146cada3e601e08f77824931562473b182a836be73aca063bbe47d390a86a",
        "dataset_spec-to-rtl/Prob120_fsm3s_ref.sv": "1ebd8f87300abe0bfe179737c88d3c25f6254c5ddbc9d104ae31e7f57dc82f3c",
        "dataset_spec-to-rtl/Prob120_fsm3s_test.sv": "f6881c30a359255a22849862898f99a2b1222b4368ba83f8c21f9bb3d32da591"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob121_2014_q3bfsm": {
    "id": "verilogeval-netlist-settled-v2:Prob121_2014_q3bfsm",
    "spec_sha256": "0504daadd1fc3b1714dfd71504b9aca21c1e630b6c1124a6ab9e8d804ed84abe",
    "checks": 2011,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic reset,\r\n\toutput logic x\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\treset = 1;\r\n\t\tx = 0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\treset = 0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\trepeat(500) @(negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 63);\r\n\t\t\tx <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input x,\r\n  output reg z\r\n);\r\n\r\n  parameter A=0, B=1, C=2, D=3, E=4;\r\n  reg [2:0] state, next;\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= A;\r\n    else state <= next;\r\n  end\r\n\r\n  always_comb begin\r\n    case (state)\r\n      A: next = x ? B : A;\r\n      B: next = x ? E : B;\r\n      C: next = x ? B : C;\r\n      D: next = x ? C : B;\r\n      E: next = x ? E : D;\r\n      default: next = 'x;\r\n    endcase\r\n  end\r\n\r\n  assign z = (state == D) || (state == E);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.x(raw_x));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.x(drive_x),.z(gold_z));\nTopModule dut(.clk(clk),.reset(drive_reset),.x(drive_x),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob121_2014_q3bfsm_prompt.txt": "0504daadd1fc3b1714dfd71504b9aca21c1e630b6c1124a6ab9e8d804ed84abe",
        "dataset_spec-to-rtl/Prob121_2014_q3bfsm_ref.sv": "ad77ee49ec9e93842f221dd387d5160c5fe8da9e610a463ed94e6b3e7ebf7e46",
        "dataset_spec-to-rtl/Prob121_2014_q3bfsm_test.sv": "8268105d11c7fcf0a46a939a62e862acf6503fa8523d7936bd1242ba928768cd"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob122_kmap4": {
    "id": "verilogeval-netlist-settled-v2:Prob122_kmap4",
    "spec_sha256": "aec81f5483516be754dadf5728d4b2e00a978a8035f4267fcb1825f5b4fd7382",
    "checks": 463,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a, b, c, d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{a,b,c,d} <= 4'b0;\r\n\t\twavedrom_start();\r\n\t\trepeat(16) @(posedge clk)\r\n\t\t\t{a,b,c,d} <= count++;\t\t\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{d,c,b,a} <= $urandom;\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  input d,\r\n  output reg out\r\n);\r\n\r\n  always @(*) begin\r\n    case({a,b,c,d})\r\n      4'h0: out = 0;\r\n      4'h1: out = 1;\r\n      4'h3: out = 0;\r\n      4'h2: out = 1;\r\n      4'h4: out = 1;\r\n      4'h5: out = 0;\r\n      4'h7: out = 1;\r\n      4'h6: out = 0;\r\n      4'hc: out = 0;\r\n      4'hd: out = 1;\r\n      4'hf: out = 0;\r\n      4'he: out = 1;\r\n      4'h8: out = 1;\r\n      4'h9: out = 0;\r\n      4'hb: out = 1;\r\n      4'ha: out = 0;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob122_kmap4_prompt.txt": "aec81f5483516be754dadf5728d4b2e00a978a8035f4267fcb1825f5b4fd7382",
        "dataset_spec-to-rtl/Prob122_kmap4_ref.sv": "f911afc05fa32ae182ccd6d1c044a6e5c834c259386796e012921f10add12cd3",
        "dataset_spec-to-rtl/Prob122_kmap4_test.sv": "98a6251e87ae3809e5312d689e9671f890af70b66e41bd7a2d2f1fc4f3cb42fc"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob123_bugs_addsubz": {
    "id": "verilogeval-netlist-settled-v2:Prob123_bugs_addsubz",
    "spec_sha256": "3a8f9a585971b0860d638de476315cb5e4b328db6ba03e45408cd0181a25fcd4",
    "checks": 234,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic do_sub,\r\n\toutput logic [7:0] a, b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t{a, b} <= 16'haabb;\r\n\t\tdo_sub <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"\");\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 1;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 1;\r\n\t\t\t\r\n\t\t\t@(posedge clk, negedge clk) {a, b} <= 16'h0303; do_sub <= 1'b0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 1;\r\n\t\t\t@(posedge clk, negedge clk) {a, b} <= 16'h0304; do_sub <= 1'b0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 1;\r\n\t\t\t@(posedge clk, negedge clk) {a, b} <= 16'hfd03; do_sub <= 1'b0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 1;\r\n\t\t\t@(posedge clk, negedge clk) {a, b} <= 16'hfd04; do_sub <= 1'b0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 0;\r\n\t\t\t@(posedge clk, negedge clk) do_sub <= 1;\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{a,b, do_sub} <= $urandom;\r\n\t\tend\r\n\t\t\t\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input do_sub,\r\n  input [7:0] a,\r\n  input [7:0] b,\r\n  output reg [7:0] out,\r\n  output reg result_is_zero\r\n);\r\n\r\n  always @(*) begin\r\n    case (do_sub)\r\n      0: out = a + b;\r\n      1: out = a - b;\r\n    endcase\r\n    result_is_zero = (out == 0);\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_do_sub; wire drive_do_sub; assign #0.1 drive_do_sub=raw_do_sub;\nwire [7:0] raw_a; wire [7:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [7:0] raw_b; wire [7:0] drive_b; assign #0.1 drive_b=raw_b;\nwire [7:0] gold_out, dut_out, raw_dut_out; reg [7:0] seen_out='0;\nwire gold_result_is_zero, dut_result_is_zero, raw_dut_result_is_zero; reg seen_result_is_zero='0;\nstimulus_gen stim1(.clk(clk),.do_sub(raw_do_sub),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.do_sub(drive_do_sub),.a(drive_a),.b(drive_b),.out(gold_out),.result_is_zero(gold_result_is_zero));\nTopModule dut(.do_sub(drive_do_sub),.a(drive_a),.b(drive_b),.out(raw_dut_out),.result_is_zero(raw_dut_result_is_zero));\nassign dut_out=raw_dut_out;\nassign dut_result_is_zero=raw_dut_result_is_zero;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin\nknown=1; seen_out[b]=1'b1;\nif(dut_out[b] !== gold_out[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_result_is_zero === 1'b0 || gold_result_is_zero === 1'b1) begin\nknown=1; seen_result_is_zero=1'b1;\nif(dut_result_is_zero !== gold_result_is_zero) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\nif((&seen_result_is_zero) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:result_is_zero\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob123_bugs_addsubz_prompt.txt": "3a8f9a585971b0860d638de476315cb5e4b328db6ba03e45408cd0181a25fcd4",
        "dataset_spec-to-rtl/Prob123_bugs_addsubz_ref.sv": "8790d9ac5eddb0a9f59275aaee7b67911fb595fd9b519f8ef07de116b0875a20",
        "dataset_spec-to-rtl/Prob123_bugs_addsubz_test.sv": "f3eaacb4d5bcf7eecea48772ca9c917e5e51e4adbc374a8039cb5754c832276f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob124_rule110": {
    "id": "verilogeval-netlist-settled-v2:Prob124_rule110",
    "spec_sha256": "023486e47b491275629e7b075dfee4f3c47487052e7e25c749e535dcc60e02dd",
    "checks": 12565,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg load,\r\n\toutput reg[511:0] data,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\tdata <= 0;\r\n\t\tdata[0] <= 1'b1;\r\n\t\tload <= 1;\r\n\t\t@(posedge clk); wavedrom_start(\"Load q[511:0] = 1: See Hint.\");\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(10) @(posedge clk);\t\t\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\tdata <= 0;\r\n\t\tdata[256] <= 1'b1;\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(1000) @(posedge clk) begin\r\n\t\tend\r\n\t\tdata <= 512'h4df;\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(1000) @(posedge clk) begin\r\n\t\tend\r\n\t\tdata <= $random(netlist_random_seed);\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(1000) @(posedge clk) begin\r\n\t\tend\r\n\r\n\t\tdata <= 0;\r\n\t\tload <= 1;\r\n\t\trepeat (20) @(posedge clk);\r\n\t\t@(posedge clk) data <= 2;\r\n\t\t@(posedge clk) data <= 4;\r\n\t\t@(posedge clk) begin\r\n\t\t\tdata <= 9;\r\n\t\t\tload <= 0;\r\n\t\tend\r\n\t\t@(posedge clk) data <= 12;\r\n\t\trepeat(100) @(posedge clk);\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input load,\r\n  input [511:0] data,\r\n  output reg [511:0] q\r\n);\r\n\r\n  always @(posedge clk) begin\r\n    if (load)\r\n      q <= data;\r\n    else begin\r\n      q <=\r\n      ~((q[$bits(q)-1:1] & q[$bits(q)-1:0] & {q[$bits(q)-2:0], 1'b0}) |\r\n      (~q[$bits(q)-1:1] & ~q[$bits(q)-1:0] & ~{q[$bits(q)-2:0], 1'b0}) |\r\n      (q[$bits(q)-1:1] & ~q[$bits(q)-1:0] & ~{q[$bits(q)-2:0], 1'b0}) )\r\n      ;\r\n    end\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;\nwire [511:0] raw_data; wire [511:0] drive_data; assign #0.1 drive_data=raw_data;\nwire [511:0] gold_q, dut_q, raw_dut_q; reg [511:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.load(raw_load),.data(raw_data),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.load(drive_load),.data(drive_data),.q(gold_q));\nTopModule dut(.clk(clk),.load(drive_load),.data(drive_data),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<512;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob124_rule110_prompt.txt": "023486e47b491275629e7b075dfee4f3c47487052e7e25c749e535dcc60e02dd",
        "dataset_spec-to-rtl/Prob124_rule110_ref.sv": "32741a27984b7f19d39c9f8afb932a87403e6a63578876bf15f5a8186dea2b61",
        "dataset_spec-to-rtl/Prob124_rule110_test.sv": "8a72d798c83a51e642b21e12a0dd40f81625774a8a24efcbbb2e0a04c6ac5ec1"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob125_kmap3": {
    "id": "verilogeval-netlist-settled-v2:Prob125_kmap3",
    "spec_sha256": "c677e12dffd92929b2c37eca9a823618dd70c69566884b74f7efb9fd49c05f02",
    "checks": 381,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg a, b, c, d,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\tint count; count = 0;\r\n\t\t{a,b,c,d} <= 4'b0;\r\n\t\twavedrom_start();\r\n\t\trepeat(16) @(posedge clk)\r\n\t\t\t{a,b,c,d} <= count++;\t\t\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\t{d,c,b,a} <= $urandom;\r\n\t\t\t\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input a,\r\n  input b,\r\n  input c,\r\n  input d,\r\n  output reg out\r\n);\r\n\r\n  always @(*) begin\r\n    case({a,b,c,d})\r\n      4'h0: out = 0;\r\n      4'h1: out = 0;\r\n      4'h3: out = 1;\r\n      4'h2: out = 1;\r\n      4'h4: out = 1'bx;\r\n      4'h5: out = 0;\r\n      4'h7: out = 0;\r\n      4'h6: out = 0;\r\n      4'hc: out = 1;\r\n      4'hd: out = 1'bx;\r\n      4'hf: out = 1;\r\n      4'he: out = 1;\r\n      4'h8: out = 1;\r\n      4'h9: out = 1'bx;\r\n      4'hb: out = 1;\r\n      4'ha: out = 1;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire gold_out, dut_out, raw_dut_out; reg seen_out='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(gold_out));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out(raw_dut_out));\nassign dut_out=raw_dut_out;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out === 1'b0 || gold_out === 1'b1) begin\nknown=1; seen_out=1'b1;\nif(dut_out !== gold_out) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob125_kmap3_prompt.txt": "c677e12dffd92929b2c37eca9a823618dd70c69566884b74f7efb9fd49c05f02",
        "dataset_spec-to-rtl/Prob125_kmap3_ref.sv": "96de95b4611a8c578a97c396a8680112af66dfde3dfc4a6f1365b0f0574f4660",
        "dataset_spec-to-rtl/Prob125_kmap3_test.sv": "98a6251e87ae3809e5312d689e9671f890af70b66e41bd7a2d2f1fc4f3cb42fc"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob126_circuit6": {
    "id": "verilogeval-netlist-settled-v2:Prob126_circuit6",
    "spec_sha256": "c17ea04cdcde6bad8dc56968777150b81afa61bc7d4a18f5198204f1e6225dff",
    "checks": 220,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [2:0] a,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\t@(posedge clk) {a} <= 0;\r\n\t\t\trepeat(10) @(posedge clk,negedge clk) a <= a + 1;\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\ta <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [2:0] a,\r\n  output reg [15:0] q\r\n);\r\n\r\n  always @(*)\r\n    case (a)\r\n      0: q = 4658;\r\n      1: q = 44768;\r\n      2: q = 10196;\r\n      3: q = 23054;\r\n      4: q = 8294;\r\n      5: q = 25806;\r\n      6: q = 50470;\r\n      7: q = 12057;\r\n    endcase\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [2:0] raw_a; wire [2:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [15:0] gold_q, dut_q, raw_dut_q; reg [15:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.q(gold_q));\nTopModule dut(.a(drive_a),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<16;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob126_circuit6_prompt.txt": "c17ea04cdcde6bad8dc56968777150b81afa61bc7d4a18f5198204f1e6225dff",
        "dataset_spec-to-rtl/Prob126_circuit6_ref.sv": "52c4772f96d353eeb811e708ce52a03cfd3f6844a70901d24fb2f9f6d6b22920",
        "dataset_spec-to-rtl/Prob126_circuit6_test.sv": "f45b03133af464be4e63917e87e69d633f236347aee85a500f012627a53def21"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob127_lemmings1": {
    "id": "verilogeval-netlist-settled-v2:Prob127_lemmings1",
    "spec_sha256": "a111213f8a8dcffa2799447095c15435248fad85fe21c7c8ddb62a5967cfdca9",
    "checks": 457,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic areset,\r\n\toutput logic bump_left,\r\n\toutput logic bump_right,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1'b1;\r\n\t\t{bump_right, bump_left} <= 3'h3;\r\n\t\twavedrom_start(\"Asynchronous reset\");\r\n\t\treset_test(1);\r\n\t\trepeat(3) @(posedge clk);\r\n\t\t{bump_right, bump_left} <= 2;\r\n\t\trepeat(2) @(posedge clk);\r\n\t\t{bump_right, bump_left} <= 1;\r\n\t\trepeat(2) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\t@(posedge clk);\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\t{bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n  input bump_left,\r\n  input bump_right,\r\n  output walk_left,\r\n  output walk_right\r\n);\r\n\r\n  parameter WL=0, WR=1;\r\n  reg state;\r\n  reg next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      WL: next = bump_left ? WR : WL;\r\n      WR: next = bump_right ? WL: WR;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk, posedge areset) begin\r\n    if (areset) state <= WL;\r\n      else state <= next;\r\n  end\r\n\r\n  assign walk_left = (state==WL);\r\n  assign walk_right = (state==WR);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_bump_left; wire drive_bump_left; assign #0.1 drive_bump_left=raw_bump_left;\nwire raw_bump_right; wire drive_bump_right; assign #0.1 drive_bump_right=raw_bump_right;\nwire gold_walk_left, dut_walk_left, raw_dut_walk_left; reg seen_walk_left='0;\nwire gold_walk_right, dut_walk_right, raw_dut_walk_right; reg seen_walk_right='0;\nstimulus_gen stim1(.clk(clk),.areset(raw_areset),.bump_left(raw_bump_left),.bump_right(raw_bump_right),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.walk_left(gold_walk_left),.walk_right(gold_walk_right));\nTopModule dut(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.walk_left(raw_dut_walk_left),.walk_right(raw_dut_walk_right));\nassign dut_walk_left=raw_dut_walk_left;\nassign dut_walk_right=raw_dut_walk_right;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_walk_left === 1'b0 || gold_walk_left === 1'b1) begin\nknown=1; seen_walk_left=1'b1;\nif(dut_walk_left !== gold_walk_left) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_walk_right === 1'b0 || gold_walk_right === 1'b1) begin\nknown=1; seen_walk_right=1'b1;\nif(dut_walk_right !== gold_walk_right) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_walk_left) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:walk_left\");\nif((&seen_walk_right) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:walk_right\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob127_lemmings1_prompt.txt": "a111213f8a8dcffa2799447095c15435248fad85fe21c7c8ddb62a5967cfdca9",
        "dataset_spec-to-rtl/Prob127_lemmings1_ref.sv": "89866e42c496721e45f587419429fd463a62ec9fd408122fb6fefa0f91baab64",
        "dataset_spec-to-rtl/Prob127_lemmings1_test.sv": "c4a510bdcf5f4b31159e00ecbd4f21fee54d5b3bb7852c81d1a864a777e1f491"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob128_fsm_ps2": {
    "id": "verilogeval-netlist-settled-v2:Prob128_fsm_ps2",
    "spec_sha256": "7a3b593bd840aab73197840cfce66da62ec965b68f0a133354fc7fbd6bc34d2e",
    "checks": 679,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [7:0] in,\r\n\toutput logic reset\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(200) @(negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input [7:0] in,\r\n  input reset,\r\n  output done\r\n);\r\n\r\n  parameter BYTE1=0, BYTE2=1, BYTE3=2, DONE=3;\r\n  reg [1:0] state;\r\n  reg [1:0] next;\r\n\r\n  wire in3 = in[3];\r\n\r\n  always_comb begin\r\n    case (state)\r\n      BYTE1: next = in3 ? BYTE2 : BYTE1;\r\n      BYTE2: next = BYTE3;\r\n      BYTE3: next = DONE;\r\n      DONE: next = in3 ? BYTE2 : BYTE1;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= BYTE1;\r\n      else state <= next;\r\n  end\r\n\r\n  assign done = (state==DONE);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;\nwire gold_done, dut_done, raw_dut_done; reg seen_done='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.reset(raw_reset));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.done(gold_done));\nTopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.done(raw_dut_done));\nassign dut_done=raw_dut_done;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_done === 1'b0 || gold_done === 1'b1) begin\nknown=1; seen_done=1'b1;\nif(dut_done !== gold_done) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_done) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:done\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob128_fsm_ps2_prompt.txt": "7a3b593bd840aab73197840cfce66da62ec965b68f0a133354fc7fbd6bc34d2e",
        "dataset_spec-to-rtl/Prob128_fsm_ps2_ref.sv": "3d15a00b4bd2fc3078f8832be9e50ff21563d22aefdfd096eca36e5be84f1ad5",
        "dataset_spec-to-rtl/Prob128_fsm_ps2_test.sv": "dfb6f908117d9c49c0a03ca63e72489f4b1745687c27aadbd2768506da76117f"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob129_ece241_2013_q8": {
    "id": "verilogeval-netlist-settled-v2:Prob129_ece241_2013_q8",
    "spec_sha256": "42c6f07bcf3ad5126bc2ebea57e3c66a01b5f21c5da8f2c84b69ea485d3427c1",
    "checks": 878,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic aresetn,\r\n\toutput logic x,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign aresetn = ~reset;\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n\tinitial begin #101;\r\n\t\tx <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\t@(posedge clk) x <= 1;\r\n\t\t@(posedge clk) x <= 0;\r\n\t\t@(posedge clk) x <= 1;\r\n\tend\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\treset_test(1);\r\n\t\t\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\t\t@(posedge clk) x <= 0;\r\n\t\t\t@(posedge clk) x <= 0;\r\n\t\t\t@(posedge clk) x <= 0;\r\n\t\t\t@(posedge clk) x <= 1;\r\n\t\t\t@(posedge clk) x <= 0;\r\n\t\t\t@(posedge clk) x <= 1;\r\n\t\t\t@(posedge clk) x <= 0;\r\n\t\t\t@(posedge clk) x <= 1;\r\n\t\t\t@(posedge clk) x <= 1;\r\n\t\t\t@(posedge clk) x <= 0;\r\n\t\t\t@(posedge clk) x <= 1;\r\n\t\t\t@(posedge clk) x <= 0;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\tx <= $random(netlist_random_seed);\r\n\t\t\treset <= ($random(netlist_random_seed)&31) == 0;\r\n\t\tend\r\n\t\t\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input aresetn,\r\n  input x,\r\n  output reg z\r\n);\r\n\r\n  parameter S=0, S1=1, S10=2;\r\n  reg[1:0] state, next;\r\n\r\n  always@(posedge clk, negedge aresetn)\r\n    if (!aresetn)\r\n      state <= S;\r\n    else\r\n      state <= next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      S: next = x ? S1 : S;\r\n      S1: next = x ? S1 : S10;\r\n      S10: next = x ? S1 : S;\r\n      default: next = 'x;\r\n    endcase\r\n  end\r\n\r\n  always_comb begin\r\n    case (state)\r\n      S: z = 0;\r\n      S1: z = 0;\r\n      S10: z = x;\r\n      default: z = 'x;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_aresetn; wire drive_aresetn; assign #0.1 drive_aresetn=raw_aresetn;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.aresetn(raw_aresetn),.x(raw_x),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.aresetn(drive_aresetn),.x(drive_x),.z(gold_z));\nTopModule dut(.clk(clk),.aresetn(drive_aresetn),.x(drive_x),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob129_ece241_2013_q8_prompt.txt": "42c6f07bcf3ad5126bc2ebea57e3c66a01b5f21c5da8f2c84b69ea485d3427c1",
        "dataset_spec-to-rtl/Prob129_ece241_2013_q8_ref.sv": "8e6feec0263e0b46725181359906225a8f977ccceece5f584cbc2b8e04511f37",
        "dataset_spec-to-rtl/Prob129_ece241_2013_q8_test.sv": "ab01249ad27ec481736c05e8d671314f26aab3e14b23568d16486b65710aa9eb"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob130_circuit5": {
    "id": "verilogeval-netlist-settled-v2:Prob130_circuit5",
    "spec_sha256": "28bd202578c6fe156adef6f87b9c36f2e15e090fba2d1079c143154991fead39",
    "checks": 276,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [3:0] a,b,c,d,e,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\t@(posedge clk) {a,b,c,d,e} <= {20'hab0de};\r\n\t\t\trepeat(18) @(posedge clk, negedge clk) c <= c + 1;\r\n\t\twavedrom_stop();\r\n\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\t@(posedge clk) {a,b,c,d,e} <= {20'h12034};\r\n\t\t\trepeat(8) @(posedge clk, negedge clk) c <= c + 1;\r\n\t\t\t@(posedge clk) {a,b,c,d,e} <= {20'h56078};\r\n\t\t\trepeat(8) @(posedge clk, negedge clk) c <= c + 1;\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\t{a,b,c,d,e} <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [3:0] a,\r\n  input [3:0] b,\r\n  input [3:0] c,\r\n  input [3:0] d,\r\n  input [3:0] e,\r\n  output reg [3:0] q\r\n);\r\n\r\n  always @(*)\r\n    case (c)\r\n      0: q = b;\r\n      1: q = e;\r\n      2: q = a;\r\n      3: q = d;\r\n      default: q = 4'hf;\r\n    endcase\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [3:0] raw_a; wire [3:0] drive_a; assign #0.1 drive_a=raw_a;\nwire [3:0] raw_b; wire [3:0] drive_b; assign #0.1 drive_b=raw_b;\nwire [3:0] raw_c; wire [3:0] drive_c; assign #0.1 drive_c=raw_c;\nwire [3:0] raw_d; wire [3:0] drive_d; assign #0.1 drive_d=raw_d;\nwire [3:0] raw_e; wire [3:0] drive_e; assign #0.1 drive_e=raw_e;\nwire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.e(raw_e),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.q(gold_q));\nTopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob130_circuit5_prompt.txt": "28bd202578c6fe156adef6f87b9c36f2e15e090fba2d1079c143154991fead39",
        "dataset_spec-to-rtl/Prob130_circuit5_ref.sv": "705199286e5d77bff148fed5b04d2e7a936c534c018dee528a0cefe67229d0b1",
        "dataset_spec-to-rtl/Prob130_circuit5_test.sv": "3738dc3e958b3c78c891ba9c4ac1f97e43f6b8da5f888be18dae759fc19de399"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob131_mt2015_q4": {
    "id": "verilogeval-netlist-settled-v2:Prob131_mt2015_q4",
    "spec_sha256": "9ec4ffa3779b1505d818dc6a39539a5ca607ea827d28dec9250a1f3d35df8b74",
    "checks": 399,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic x,\r\n\toutput logic y\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\talways @(posedge clk, negedge clk)\r\n\t\t{x, y} <= $random(netlist_random_seed) % 4;\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(negedge clk);\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input x,\r\n  input y,\r\n  output z\r\n);\r\n\r\n  assign z = x|~y;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire raw_y; wire drive_y; assign #0.1 drive_y=raw_y;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x),.y(raw_y));\noracle_RefModule gold(.x(drive_x),.y(drive_y),.z(gold_z));\nTopModule dut(.x(drive_x),.y(drive_y),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob131_mt2015_q4_prompt.txt": "9ec4ffa3779b1505d818dc6a39539a5ca607ea827d28dec9250a1f3d35df8b74",
        "dataset_spec-to-rtl/Prob131_mt2015_q4_ref.sv": "bfd2b7e03b057ee57124f3293ae618f72353956736de81d233e55972db9984ba",
        "dataset_spec-to-rtl/Prob131_mt2015_q4_test.sv": "e0df3258de85304efc57961a4209be8b0d685a77e2ffa6de945ab560a76751b2"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob132_always_if2": {
    "id": "verilogeval-netlist-settled-v2:Prob132_always_if2",
    "spec_sha256": "91efec6e95abf77285f29e579ee5cf1a61ceb62312f86ac27450433de05eb88c",
    "checks": 240,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic cpu_overheated, arrived, gas_tank_empty,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tlogic [2:0] s = 3'b010;\r\n\tassign {cpu_overheated, arrived, gas_tank_empty} = s;\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(negedge clk) wavedrom_start(\"\");\r\n\t\t@(posedge clk) s <= 3'b010;\r\n\t\t@(posedge clk) s <= 3'b100;\r\n\t\t@(posedge clk) s <= 3'b100;\r\n\t\t@(posedge clk) s <= 3'b001;\r\n\t\t@(posedge clk) s <= 3'b000;\r\n\t\t@(posedge clk) s <= 3'b100;\r\n\t\t@(posedge clk) s <= 3'b110;\r\n\t\t@(posedge clk) s <= 3'b111;\r\n\t\t@(posedge clk) s <= 3'b111;\r\n\t\t@(posedge clk) s <= 3'b111;\r\n\t\twavedrom_stop();\r\n\t\trepeat(100) @(posedge clk, negedge clk)\r\n\t\t\ts <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input cpu_overheated,\r\n  output reg shut_off_computer,\r\n  input arrived,\r\n  input gas_tank_empty,\r\n  output reg keep_driving\r\n);\r\n\r\n  always @(*) begin\r\n    if (cpu_overheated)\r\n      shut_off_computer = 1;\r\n    else\r\n      shut_off_computer = 0;\r\n  end\r\n\r\n  always @(*) begin\r\n    if (~arrived)\r\n      keep_driving = !gas_tank_empty;\r\n    else\r\n      keep_driving = 1'b0;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_cpu_overheated; wire drive_cpu_overheated; assign #0.1 drive_cpu_overheated=raw_cpu_overheated;\nwire raw_arrived; wire drive_arrived; assign #0.1 drive_arrived=raw_arrived;\nwire raw_gas_tank_empty; wire drive_gas_tank_empty; assign #0.1 drive_gas_tank_empty=raw_gas_tank_empty;\nwire gold_shut_off_computer, dut_shut_off_computer, raw_dut_shut_off_computer; reg seen_shut_off_computer='0;\nwire gold_keep_driving, dut_keep_driving, raw_dut_keep_driving; reg seen_keep_driving='0;\nstimulus_gen stim1(.clk(clk),.cpu_overheated(raw_cpu_overheated),.arrived(raw_arrived),.gas_tank_empty(raw_gas_tank_empty),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.cpu_overheated(drive_cpu_overheated),.shut_off_computer(gold_shut_off_computer),.arrived(drive_arrived),.gas_tank_empty(drive_gas_tank_empty),.keep_driving(gold_keep_driving));\nTopModule dut(.cpu_overheated(drive_cpu_overheated),.shut_off_computer(raw_dut_shut_off_computer),.arrived(drive_arrived),.gas_tank_empty(drive_gas_tank_empty),.keep_driving(raw_dut_keep_driving));\nassign dut_shut_off_computer=raw_dut_shut_off_computer;\nassign dut_keep_driving=raw_dut_keep_driving;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_shut_off_computer === 1'b0 || gold_shut_off_computer === 1'b1) begin\nknown=1; seen_shut_off_computer=1'b1;\nif(dut_shut_off_computer !== gold_shut_off_computer) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_keep_driving === 1'b0 || gold_keep_driving === 1'b1) begin\nknown=1; seen_keep_driving=1'b1;\nif(dut_keep_driving !== gold_keep_driving) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_shut_off_computer) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:shut_off_computer\");\nif((&seen_keep_driving) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:keep_driving\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob132_always_if2_prompt.txt": "91efec6e95abf77285f29e579ee5cf1a61ceb62312f86ac27450433de05eb88c",
        "dataset_spec-to-rtl/Prob132_always_if2_ref.sv": "9dbbec13957ef5d2703e054dff4a134b39de349fc2e65ed1e71c37722d764278",
        "dataset_spec-to-rtl/Prob132_always_if2_test.sv": "d0c31ac141e19927d78cb0bc313f97b664d226b5179dda0b6a5ba7f5aa195717"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob133_2014_q3fsm": {
    "id": "verilogeval-netlist-settled-v2:Prob133_2014_q3fsm",
    "spec_sha256": "94e3487d723fa525f260c6ce728ebae178d33ad961f31cf5207630a6693f8365",
    "checks": 2827,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic reset,\r\n\toutput logic s, w,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tbit spulse_fail = 0;\r\n\tbit failed = 0;\r\n\t\r\n\talways @(posedge clk, negedge clk)\r\n\t\tif (!tb_match) failed = 1;\r\n\t\t\r\n\t\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\ts <= 0;\r\n\t\tw <= 0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\ts <= 1;\r\n\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\tw <= $random(netlist_random_seed);\r\n\t\tend\r\n\r\n\t\treset <= 1;\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\tw <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t@(posedge clk)\t\t\r\n\t\t\tspulse_fail <= failed;\r\n\t\t\r\n\t\trepeat(500) @(negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 63);\r\n\t\t\ts <= !($random(netlist_random_seed) & 7);\r\n\t\t\tw <= $random(netlist_random_seed);\r\n\t\tend\r\n\r\n\t\tif (failed && !spulse_fail) begin\r\n\t\t\t$display (\"Hint: Your state machine should ignore input 's' after the state A to B transition.\");\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input s,\r\n  input w,\r\n  output reg z\r\n);\r\n\r\n  parameter A=0, B=1, C=2, S10=3, S11=4, S20=5, S21=6, S22=7;\r\n  reg [2:0] state, next;\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= A;\r\n    else state <= next;\r\n  end\r\n\r\n  always_comb begin\r\n    case (state)\r\n      A: next = s ? B : A;\r\n      B: next = w ? S11 : S10;\r\n      C: next = w ? S11 : S10;\r\n      S10: next = w ? S21 : S20;\r\n      S11: next = w ? S22 : S21;\r\n      S20: next = B;\r\n      S21: next = w ? C : B;\r\n      S22: next = w ? B : C;\r\n      default: next = 'x;\r\n    endcase\r\n  end\r\n\r\n  assign z = (state == C);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_s; wire drive_s; assign #0.1 drive_s=raw_s;\nwire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.s(raw_s),.w(raw_w),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.s(drive_s),.w(drive_w),.z(gold_z));\nTopModule dut(.clk(clk),.reset(drive_reset),.s(drive_s),.w(drive_w),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob133_2014_q3fsm_prompt.txt": "94e3487d723fa525f260c6ce728ebae178d33ad961f31cf5207630a6693f8365",
        "dataset_spec-to-rtl/Prob133_2014_q3fsm_ref.sv": "72d5756e280089140225671e06d5f4956157c91b8b94c9d6166a79057c01c119",
        "dataset_spec-to-rtl/Prob133_2014_q3fsm_test.sv": "305f0ba8a6332682bf8637a7480f0e65334f4809e3e90b5af0071c04be3aa9b4"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob134_2014_q3c": {
    "id": "verilogeval-netlist-settled-v2:Prob134_2014_q3c",
    "spec_sha256": "719c19c699f5dff21978c125e4853e36ce4bd6f7ef7b08df9f534bb9dd857ff9",
    "checks": 243,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic x,\r\n\toutput logic [2:0] y\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\ty <= $random(netlist_random_seed);\r\n\t\t\tx <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input x,\r\n  input [2:0] y,\r\n  output reg Y0,\r\n  output reg z\r\n);\r\n\r\n  always_comb begin\r\n    case ({y[2:0], x})\r\n      4'h0: Y0 = 0;\r\n      4'h1: Y0 = 1;\r\n      4'h2: Y0 = 1;\r\n      4'h3: Y0 = 0;\r\n      4'h4: Y0 = 0;\r\n      4'h5: Y0 = 1;\r\n      4'h6: Y0 = 1;\r\n      4'h7: Y0 = 0;\r\n      4'h8: Y0 = 1;\r\n      4'h9: Y0 = 0;\r\n      default: Y0 = 1'bx;\r\n    endcase\r\n\r\n    case (y[2:0])\r\n      3'h0: z = 0;\r\n      3'h1: z = 0;\r\n      3'h2: z = 0;\r\n      3'h3: z = 1;\r\n      3'h4: z = 1;\r\n      default: z = 1'bx;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire [2:0] raw_y; wire [2:0] drive_y; assign #0.1 drive_y=raw_y;\nwire gold_Y0, dut_Y0, raw_dut_Y0; reg seen_Y0='0;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.x(raw_x),.y(raw_y));\noracle_RefModule gold(.clk(clk),.x(drive_x),.y(drive_y),.Y0(gold_Y0),.z(gold_z));\nTopModule dut(.clk(clk),.x(drive_x),.y(drive_y),.Y0(raw_dut_Y0),.z(raw_dut_z));\nassign dut_Y0=raw_dut_Y0;\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Y0 === 1'b0 || gold_Y0 === 1'b1) begin\nknown=1; seen_Y0=1'b1;\nif(dut_Y0 !== gold_Y0) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_Y0) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Y0\");\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob134_2014_q3c_prompt.txt": "719c19c699f5dff21978c125e4853e36ce4bd6f7ef7b08df9f534bb9dd857ff9",
        "dataset_spec-to-rtl/Prob134_2014_q3c_ref.sv": "d31b258604dcc0d24d285e2e764e58ce6fdfe37d61c8917997d45106a16ae4cf",
        "dataset_spec-to-rtl/Prob134_2014_q3c_test.sv": "8756b75d8819b6bd5cc75e90a1e4a5417532cb80bc459d460c7f62a4f039e98d"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob135_m2014_q6b": {
    "id": "verilogeval-netlist-settled-v2:Prob135_m2014_q6b",
    "spec_sha256": "4b385fd8a856bd821f539756be6f3c8c9d47eaad522d46861dd24cb4d209e0a2",
    "checks": 144,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg [2:0] y,\r\n\toutput reg w\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(100) @(posedge clk, negedge clk) begin\r\n\t\t\t{y,w} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input [2:0] y,\r\n  input w,\r\n  output reg Y1\r\n);\r\n\r\n  always_comb begin\r\n    case ({y, w})\r\n      4'h0: Y1 = 1'b0;\r\n      4'h1: Y1 = 1'b0;\r\n      4'h2: Y1 = 1'b1;\r\n      4'h3: Y1 = 1'b1;\r\n      4'h4: Y1 = 1'b0;\r\n      4'h5: Y1 = 1'b1;\r\n      4'h6: Y1 = 1'b0;\r\n      4'h7: Y1 = 1'b0;\r\n      4'h8: Y1 = 1'b0;\r\n      4'h9: Y1 = 1'b1;\r\n      4'ha: Y1 = 1'b1;\r\n      4'hb: Y1 = 1'b1;\r\n      default: Y1 = 1'bx;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire [2:0] raw_y; wire [2:0] drive_y; assign #0.1 drive_y=raw_y;\nwire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;\nwire gold_Y1, dut_Y1, raw_dut_Y1; reg seen_Y1='0;\nstimulus_gen stim1(.clk(clk),.y(raw_y),.w(raw_w));\noracle_RefModule gold(.y(drive_y),.w(drive_w),.Y1(gold_Y1));\nTopModule dut(.y(drive_y),.w(drive_w),.Y1(raw_dut_Y1));\nassign dut_Y1=raw_dut_Y1;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Y1 === 1'b0 || gold_Y1 === 1'b1) begin\nknown=1; seen_Y1=1'b1;\nif(dut_Y1 !== gold_Y1) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_Y1) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Y1\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob135_m2014_q6b_prompt.txt": "4b385fd8a856bd821f539756be6f3c8c9d47eaad522d46861dd24cb4d209e0a2",
        "dataset_spec-to-rtl/Prob135_m2014_q6b_ref.sv": "57d6f9001f561898ed5fa2d240f3c0a8c78ea37172de736b9efef5ec66d64ce3",
        "dataset_spec-to-rtl/Prob135_m2014_q6b_test.sv": "4b67d5fc638de468c0c083575537de0002483080be8a522dbda67d67e7607fff"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob136_m2014_q6": {
    "id": "verilogeval-netlist-settled-v2:Prob136_m2014_q6",
    "spec_sha256": "44782e75f7c0d4fe6927bf2a99fad42d540a4fe1d966e6040bc383109ff0dca1",
    "checks": 339,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic reset,\r\n\toutput logic w\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\tw <= $random(netlist_random_seed);\r\n\t\t\treset <= ($random(netlist_random_seed) & 15) == 0;\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input w,\r\n  output z\r\n);\r\n\r\n  parameter A=0, B=1, C=2, D=3, E=4, F=5;\r\n  reg [2:0] state, next;\r\n\r\n  always @(posedge clk)\r\n    if (reset)\r\n      state <= A;\r\n    else\r\n      state <= next;\r\n\r\n  always_comb begin\r\n    case(state)\r\n      A: next = w ? A : B;\r\n      B: next = w ? D : C;\r\n      C: next = w ? D : E;\r\n      D: next = w ? A : F;\r\n      E: next = w ? D : E;\r\n      F: next = w ? D : C;\r\n      default: next = 'x;\r\n    endcase\r\n  end\r\n\r\n  assign z = (state == E || state == F);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.w(raw_w));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.w(drive_w),.z(gold_z));\nTopModule dut(.clk(clk),.reset(drive_reset),.w(drive_w),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob136_m2014_q6_prompt.txt": "44782e75f7c0d4fe6927bf2a99fad42d540a4fe1d966e6040bc383109ff0dca1",
        "dataset_spec-to-rtl/Prob136_m2014_q6_ref.sv": "18432e1a10c03ddc2cbefcb4688a52fde3a29d066cb805cd33504edaba636fa8",
        "dataset_spec-to-rtl/Prob136_m2014_q6_test.sv": "cf2f694607f5d68ccb0fac66bba252f0b4f8aba48b5af4725149fcd278e7acda"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob137_fsm_serial": {
    "id": "verilogeval-netlist-settled-v2:Prob137_fsm_serial",
    "spec_sha256": "9c0655fddcfdb19886298eb98a9c64048cf97bebed1be96a5305c5eabde108f2",
    "checks": 1809,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in,\r\n\toutput logic reset\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\tin <= 0;\r\n\t\trepeat(9) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(9) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(10) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(10) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(9) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\t\r\n\t\t\r\n\t\trepeat(800) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input in,\r\n  input reset,\r\n  output done\r\n);\r\n\r\n  parameter B0=0, B1=1, B2=2, B3=3, B4=4, B5=5, B6=6, B7=7, START=8, STOP=9, DONE=10, ERR=11;\r\n  reg [3:0] state;\r\n  reg [3:0] next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      START: next = in ? START : B0;  // start bit is 0\r\n      B0: next = B1;\r\n      B1: next = B2;\r\n      B2: next = B3;\r\n      B3: next = B4;\r\n      B4: next = B5;\r\n      B5: next = B6;\r\n      B6: next = B7;\r\n      B7: next = STOP;\r\n      STOP: next = in ? DONE : ERR;  // stop bit is 1. Idle state is 1.\r\n      DONE: next = in ? START : B0;\r\n      ERR: next = in ? START : ERR;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= START;\r\n      else state <= next;\r\n  end\r\n\r\n  assign done = (state==DONE);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire gold_done, dut_done, raw_dut_done; reg seen_done='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.reset(raw_reset));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.done(gold_done));\nTopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.done(raw_dut_done));\nassign dut_done=raw_dut_done;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_done === 1'b0 || gold_done === 1'b1) begin\nknown=1; seen_done=1'b1;\nif(dut_done !== gold_done) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_done) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:done\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob137_fsm_serial_prompt.txt": "9c0655fddcfdb19886298eb98a9c64048cf97bebed1be96a5305c5eabde108f2",
        "dataset_spec-to-rtl/Prob137_fsm_serial_ref.sv": "fc02865818acce2e929e6a103d239301f5d0ea6a7966389b827351b05cb2bbd7",
        "dataset_spec-to-rtl/Prob137_fsm_serial_test.sv": "215b46d54b3bd0ba3aad35093ce09a0a1ed5c8e00973781b8fbdcaf2e8f02625"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob138_2012_q2fsm": {
    "id": "verilogeval-netlist-settled-v2:Prob138_2012_q2fsm",
    "spec_sha256": "0db617b7d6a7544c9af35a08dd0111795ff58a525bfca5dfcef089efb5be952d",
    "checks": 795,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic reset,\r\n\toutput logic w\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(200) @(negedge clk) begin\r\n\t\t\treset <= ($random(netlist_random_seed) & 'h1f) == 0;\r\n\t\t\tw <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input w,\r\n  output z\r\n);\r\n\r\n  parameter A=0,B=1,C=2,D=3,E=4,F=5;\r\n  reg[2:0] state, next;\r\n\r\n  always @(posedge clk)\r\n    if (reset) state <= A;\r\n    else state <= next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      A: next = w ? B : A;\r\n      B: next = w ? C : D;\r\n      C: next = w ? E : D;\r\n      D: next = w ? F : A;\r\n      E: next = w ? E : D;\r\n      F: next = w ? C : D;\r\n      default: next = 'x;\r\n    endcase\r\n  end\r\n\r\n  assign z = (state == E) || (state == F);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;\nwire gold_z, dut_z, raw_dut_z; reg seen_z='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.w(raw_w));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.w(drive_w),.z(gold_z));\nTopModule dut(.clk(clk),.reset(drive_reset),.w(drive_w),.z(raw_dut_z));\nassign dut_z=raw_dut_z;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_z === 1'b0 || gold_z === 1'b1) begin\nknown=1; seen_z=1'b1;\nif(dut_z !== gold_z) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_z) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:z\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob138_2012_q2fsm_prompt.txt": "0db617b7d6a7544c9af35a08dd0111795ff58a525bfca5dfcef089efb5be952d",
        "dataset_spec-to-rtl/Prob138_2012_q2fsm_ref.sv": "9d50f46058e9f17eee7fde6d85683f72566a7a3840a2f8e700f790aaae3f82df",
        "dataset_spec-to-rtl/Prob138_2012_q2fsm_test.sv": "b25c9bd227d8dea66a6410f899460c05be2718fe69da9a65409e0c3b58e6c5ae"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob139_2013_q2bfsm": {
    "id": "verilogeval-netlist-settled-v2:Prob139_2013_q2bfsm",
    "spec_sha256": "d391605dddd2f83f8ce2bc68203e3aacfdcb1894966051ecb7ec80bc02aa4948",
    "checks": 2003,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic resetn,\r\n\toutput logic x, y\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\tresetn = 0;\r\n\t\tx = 0;\r\n\t\ty = 0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\tresetn = 1;\r\n\t\trepeat(500) @(negedge clk) begin\r\n\t\t\tresetn <= ($random(netlist_random_seed) & 31) != 0;\r\n\t\t\t{x,y} <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input resetn,\r\n  input x,\r\n  input y,\r\n  output f,\r\n  output g\r\n);\r\n\r\n  parameter A=0, B=1, S0=2, S1=3, S10=4, G1=5, G2=6, P0=7, P1=8;\r\n  reg [3:0] state, next;\r\n\r\n  always @(posedge clk) begin\r\n    if (~resetn) state <= A;\r\n    else state <= next;\r\n  end\r\n\r\n  always_comb begin\r\n    case (state)\r\n      A: next = B;\r\n      B: next = S0;\r\n      S0: next = x ? S1 : S0;\r\n      S1: next = x ? S1 : S10;\r\n      S10: next = x? G1 : S0;\r\n      G1: next = y ? P1 : G2;\r\n      G2: next = y ? P1 : P0;\r\n      P0: next = P0;\r\n      P1: next = P1;\r\n      default: next = 'x;\r\n    endcase\r\n  end\r\n\r\n  assign f = (state == B);\r\n  assign g = (state == G1) || (state == G2) || (state == P1);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_resetn; wire drive_resetn; assign #0.1 drive_resetn=raw_resetn;\nwire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;\nwire raw_y; wire drive_y; assign #0.1 drive_y=raw_y;\nwire gold_f, dut_f, raw_dut_f; reg seen_f='0;\nwire gold_g, dut_g, raw_dut_g; reg seen_g='0;\nstimulus_gen stim1(.clk(clk),.resetn(raw_resetn),.x(raw_x),.y(raw_y));\noracle_RefModule gold(.clk(clk),.resetn(drive_resetn),.x(drive_x),.y(drive_y),.f(gold_f),.g(gold_g));\nTopModule dut(.clk(clk),.resetn(drive_resetn),.x(drive_x),.y(drive_y),.f(raw_dut_f),.g(raw_dut_g));\nassign dut_f=raw_dut_f;\nassign dut_g=raw_dut_g;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_f === 1'b0 || gold_f === 1'b1) begin\nknown=1; seen_f=1'b1;\nif(dut_f !== gold_f) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_g === 1'b0 || gold_g === 1'b1) begin\nknown=1; seen_g=1'b1;\nif(dut_g !== gold_g) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_f) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:f\");\nif((&seen_g) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:g\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob139_2013_q2bfsm_prompt.txt": "d391605dddd2f83f8ce2bc68203e3aacfdcb1894966051ecb7ec80bc02aa4948",
        "dataset_spec-to-rtl/Prob139_2013_q2bfsm_ref.sv": "da544445d0419de9c8a75dd7aaa55c9fe1dcb5bcd4fd96f5451a4ae1826565b1",
        "dataset_spec-to-rtl/Prob139_2013_q2bfsm_test.sv": "0bc96aae1d9bbcc2b0585b47befdea2d7032ed39f3fb63778b149b39749f99d6"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob140_fsm_hdlc": {
    "id": "verilogeval-netlist-settled-v2:Prob140_fsm_hdlc",
    "spec_sha256": "1c094198f35cfbdbd7e95f4e937dbdcaa1170fb770912f13092b6408063e1c76",
    "checks": 1601,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic reset, in\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tin <= 0;\r\n\t\t@(posedge clk);\r\n\t\trepeat(800) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\t\tin <= |($random(netlist_random_seed)&7);\r\n\t\tend\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input in,\r\n  output disc,\r\n  output flag,\r\n  output err\r\n);\r\n\r\n  parameter [3:0] S0=0, S1=1, S2=2, S3=3, S4=4, S5=5, S6=6, SERR=7, SDISC=8, SFLAG=9;\r\n  reg [3:0] state, next;\r\n\r\n  assign disc = state == SDISC;\r\n  assign flag = state == SFLAG;\r\n  assign err = state == SERR;\r\n\r\n  always @(posedge clk) begin\r\n    case (state)\r\n      S0: state <= in ? S1 : S0;\r\n      S1: state <= in ? S2 : S0;\r\n      S2: state <= in ? S3 : S0;\r\n      S3: state <= in ? S4 : S0;\r\n      S4: state <= in ? S5 : S0;\r\n      S5: state <= in ? S6 : SDISC;\r\n      S6: state <= in ? SERR : SFLAG;\r\n      SERR: state <= in ? SERR : S0;\r\n      SFLAG: state <= in ? S1 : S0;\r\n      SDISC: state <= in ? S1 : S0;\r\n      default: state <= 'x;\r\n    endcase\r\n\r\n    if (reset) state <= S0;\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire gold_disc, dut_disc, raw_dut_disc; reg seen_disc='0;\nwire gold_flag, dut_flag, raw_dut_flag; reg seen_flag='0;\nwire gold_err, dut_err, raw_dut_err; reg seen_err='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.in(raw_in));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.disc(gold_disc),.flag(gold_flag),.err(gold_err));\nTopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.disc(raw_dut_disc),.flag(raw_dut_flag),.err(raw_dut_err));\nassign dut_disc=raw_dut_disc;\nassign dut_flag=raw_dut_flag;\nassign dut_err=raw_dut_err;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_disc === 1'b0 || gold_disc === 1'b1) begin\nknown=1; seen_disc=1'b1;\nif(dut_disc !== gold_disc) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_flag === 1'b0 || gold_flag === 1'b1) begin\nknown=1; seen_flag=1'b1;\nif(dut_flag !== gold_flag) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_err === 1'b0 || gold_err === 1'b1) begin\nknown=1; seen_err=1'b1;\nif(dut_err !== gold_err) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_disc) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:disc\");\nif((&seen_flag) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:flag\");\nif((&seen_err) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:err\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob140_fsm_hdlc_prompt.txt": "1c094198f35cfbdbd7e95f4e937dbdcaa1170fb770912f13092b6408063e1c76",
        "dataset_spec-to-rtl/Prob140_fsm_hdlc_ref.sv": "a16aea1fd478b1e314bd036cc7653581e68a687ec2f4e7a994a9056897f3a0bf",
        "dataset_spec-to-rtl/Prob140_fsm_hdlc_test.sv": "a3fdb87afb8d4f494b197da62cf77b277cbdc95d887814756d007a8692064a74"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob141_count_clock": {
    "id": "verilogeval-netlist-settled-v2:Prob141_count_clock",
    "spec_sha256": "a2a0d9fa47dcbaeed5acb74360b6fc1d89ce06f4531fe4310bf45c0cf6baeca7",
    "checks": 704825,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset,\r\n\toutput reg ena,\r\n\tinput [7:0] hh_dut, mm_dut, ss_dut,\r\n\tinput pm_dut,\r\n\tinput tb_match,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\r\n);\ninteger netlist_random_seed=1;\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\r\n\tlogic bcd_fail = 0;\r\n\tlogic reset_fail = 0;\r\n\t\r\n\talways @(posedge clk) begin\r\n\t\tif ((hh_dut[3:0] >= 4'ha) ||\r\n\t\t\t(hh_dut[7:4] >= 4'ha) ||\r\n\t\t\t(mm_dut[3:0] >= 4'ha) ||\r\n\t\t\t(mm_dut[7:4] >= 4'ha) ||\r\n\t\t\t(ss_dut[3:0] >= 4'ha) ||\r\n\t\t\t(ss_dut[7:4] >= 4'ha))\r\n\t\t\tbcd_fail <= 1'b1;\t\t\r\n\tend\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tena <= 1;\r\n\t\twavedrom_start(\"Reset and count to 10\");\r\n\t\treset_test();\r\n\t\trepeat(12) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\tena <= 1'b1;\r\n\t\treset <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk)\r\n\t\t\tif (!tb_match) begin\r\n\t\t\t\t$display(\"Hint: Clock seems to reset to %02x:%02x:%02x %s (Should be 12:00:00 AM).\", hh_dut, mm_dut, ss_dut, pm_dut ? \"PM\": \"AM\");\r\n\t\t\t\treset_fail <= 1'b1;\r\n\t\t\tend\r\n\t\t\r\n\t\treset <= 1'b0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\tena <= 1'b0;\r\n\t\treset <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk)\r\n\t\t\tif (!tb_match && !reset_fail)\r\n\t\t\t\t$display(\"Hint: Reset has higher priority than enable and should occur even if not enabled.\");\r\n\t\t\r\n\t\t\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\t\tena <= !($random(netlist_random_seed) & 3);\r\n\t\tend\r\n\t\treset <= 1;\r\n\t\t@(posedge clk) begin\r\n\t\t\t{reset, ena} <= 2'b1;\r\n\t\tend\r\n\t\t\r\n\t\trepeat(55) @(posedge clk);\r\n\t\twavedrom_start(\"Minute roll-over\");\r\n\t\trepeat(10) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(3530) @(posedge clk);\r\n\t\twavedrom_start(\"Hour roll-over\");\r\n\t\trepeat(10) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\r\n\t\trepeat(39590) @(posedge clk);\r\n\t\twavedrom_start(\"PM roll-over\");\r\n\t\trepeat(10) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(132745) @(posedge clk);\r\n\t\trepeat(50) @(posedge clk, negedge clk) begin\r\n\t\t\tena <= !($random(netlist_random_seed) & 7);\r\n\t\tend\r\n\t\treset <= 1'b1;\r\n\t\trepeat(5) @(posedge clk);\r\n\t\t\r\n\t\t\r\n\t\tif (bcd_fail)\r\n\t\t\t$display(\"Hint: Non-BCD values detected. Are you sure you're using two-digit BCD representation for hh, mm, and ss?\");\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input ena,\r\n  output reg pm,\r\n  output reg [7:0] hh,\r\n  output reg [7:0] mm,\r\n  output reg [7:0] ss\r\n);\r\n\r\n  wire [6:0] enable = {\r\n    {hh[7:0],mm[7:0],ss[7:0]}==24'h115959,\r\n    {hh[3:0],mm[7:0],ss[7:0]}==20'h95959,\r\n    {mm[7:0],ss[7:0]}==16'h5959,\r\n    {mm[3:0],ss[7:0]}==12'h959,\r\n    ss[7:0]==8'h59,\r\n    ss[3:0] == 4'h9,\r\n    1'b1};\r\n\r\n  always @(posedge clk)\r\n    if (reset)\r\n      {pm,hh,mm,ss} <= 25'h0120000;\r\n    else if (ena) begin\r\n      if (enable[0] && ss[3:0] == 9) ss[3:0] <= 0;\r\n      else if (enable[0]) ss[3:0] <= ss[3:0] + 1;\r\n\r\n      if (enable[1] && ss[7:4] == 4'h5) ss[7:4] <= 0;\r\n      else if (enable[1]) ss[7:4] <= ss[7:4] + 1;\r\n\r\n      if (enable[2] && mm[3:0] == 9) mm[3:0] <= 0;\r\n      else if (enable[2]) mm[3:0] <= mm[3:0] + 1;\r\n\r\n      if (enable[3] && mm[7:4] == 4'h5) mm[7:4] <= 0;\r\n      else if (enable[3]) mm[7:4] <= mm[7:4] + 1;\r\n\r\n      if (enable[4] && hh[3:0] == 4'h9) hh[3:0] <= 0;\r\n      else if (enable[4]) hh[3:0] <= hh[3:0] + 1;\r\n\r\n      if (enable[4] && hh[7:0] == 8'h12) hh[7:0] <= 8'h1;\r\n      else if (enable[5]) hh[7:4] <= hh[7:4] + 1;\r\n\r\n      if (enable[6]) pm <= ~pm;\r\n    end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_ena; wire drive_ena; assign #0.1 drive_ena=raw_ena;\nwire gold_pm, dut_pm, raw_dut_pm; reg seen_pm='0;\nwire [7:0] gold_hh, dut_hh, raw_dut_hh; reg [7:0] seen_hh='0;\nwire [7:0] gold_mm, dut_mm, raw_dut_mm; reg [7:0] seen_mm='0;\nwire [7:0] gold_ss, dut_ss, raw_dut_ss; reg [7:0] seen_ss='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.ena(raw_ena),.hh_dut(gold_hh),.mm_dut(gold_mm),.ss_dut(gold_ss),.pm_dut(gold_pm),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.ena(drive_ena),.pm(gold_pm),.hh(gold_hh),.mm(gold_mm),.ss(gold_ss));\nTopModule dut(.clk(clk),.reset(drive_reset),.ena(drive_ena),.pm(raw_dut_pm),.hh(raw_dut_hh),.mm(raw_dut_mm),.ss(raw_dut_ss));\nassign dut_pm=raw_dut_pm;\nassign dut_hh=raw_dut_hh;\nassign dut_mm=raw_dut_mm;\nassign dut_ss=raw_dut_ss;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_pm === 1'b0 || gold_pm === 1'b1) begin\nknown=1; seen_pm=1'b1;\nif(dut_pm !== gold_pm) bad=1;\nend end\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_hh[b] === 1'b0 || gold_hh[b] === 1'b1) begin\nknown=1; seen_hh[b]=1'b1;\nif(dut_hh[b] !== gold_hh[b]) bad=1;\nend end\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_mm[b] === 1'b0 || gold_mm[b] === 1'b1) begin\nknown=1; seen_mm[b]=1'b1;\nif(dut_mm[b] !== gold_mm[b]) bad=1;\nend end\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_ss[b] === 1'b0 || gold_ss[b] === 1'b1) begin\nknown=1; seen_ss[b]=1'b1;\nif(dut_ss[b] !== gold_ss[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_pm) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:pm\");\nif((&seen_hh) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:hh\");\nif((&seen_mm) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:mm\");\nif((&seen_ss) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:ss\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob141_count_clock_prompt.txt": "a2a0d9fa47dcbaeed5acb74360b6fc1d89ce06f4531fe4310bf45c0cf6baeca7",
        "dataset_spec-to-rtl/Prob141_count_clock_ref.sv": "003eda7bec9a2243a107df1a453813b9cbbfcd226fe19b6a9a56e3f3e17b0481",
        "dataset_spec-to-rtl/Prob141_count_clock_test.sv": "cabcb56992e76ff31cfe1bb5c5fea4ea91ce1bd53dd3e740a30a12b9d9d40fdd"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob142_lemmings2": {
    "id": "verilogeval-netlist-settled-v2:Prob142_lemmings2",
    "spec_sha256": "22a330071ccdcc73c790b690fced2efbd3ec8b09b278d39d3c5365c178f12cae",
    "checks": 881,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic areset,\r\n\toutput logic bump_left,\r\n\toutput logic bump_right,\r\n\toutput logic ground,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1'b1;\r\n\t\t{bump_left, bump_right, ground} <= 3'h1;\r\n\t\treset_test(1);\r\n\t\t{bump_right, bump_left} <= 3'h0;\r\n\t\twavedrom_start(\"Falling\");\r\n\t\trepeat(3) @(posedge clk);\r\n\t\t{bump_right, bump_left, ground} <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\t{bump_right, bump_left, ground} <= 3;\r\n\t\trepeat(2) @(posedge clk);\r\n\t\t{bump_right, bump_left, ground} <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\t{bump_right, bump_left, ground} <= 1;\r\n\t\trepeat(2) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\t\r\n\t\treset <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\t{bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);\r\n\t\t\tground <= |($random(netlist_random_seed) & 7);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n  input bump_left,\r\n  input bump_right,\r\n  input ground,\r\n  output walk_left,\r\n  output walk_right,\r\n  output aaah\r\n);\r\n\r\n  parameter WL=0, WR=1, FALLL=2, FALLR=3;\r\n  reg [1:0] state;\r\n  reg [1:0] next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      WL: next = ground ? (bump_left ? WR : WL) : FALLL;\r\n      WR: next = ground ? (bump_right ? WL: WR) : FALLR;\r\n      FALLL: next = ground ? WL : FALLL;\r\n      FALLR: next = ground ? WR : FALLR;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk, posedge areset) begin\r\n    if (areset) state <= WL;\r\n      else state <= next;\r\n  end\r\n\r\n  assign walk_left = (state==WL);\r\n  assign walk_right = (state==WR);\r\n  assign aaah = (state == FALLL) || (state == FALLR);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_bump_left; wire drive_bump_left; assign #0.1 drive_bump_left=raw_bump_left;\nwire raw_bump_right; wire drive_bump_right; assign #0.1 drive_bump_right=raw_bump_right;\nwire raw_ground; wire drive_ground; assign #0.1 drive_ground=raw_ground;\nwire gold_walk_left, dut_walk_left, raw_dut_walk_left; reg seen_walk_left='0;\nwire gold_walk_right, dut_walk_right, raw_dut_walk_right; reg seen_walk_right='0;\nwire gold_aaah, dut_aaah, raw_dut_aaah; reg seen_aaah='0;\nstimulus_gen stim1(.clk(clk),.areset(raw_areset),.bump_left(raw_bump_left),.bump_right(raw_bump_right),.ground(raw_ground),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.walk_left(gold_walk_left),.walk_right(gold_walk_right),.aaah(gold_aaah));\nTopModule dut(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.walk_left(raw_dut_walk_left),.walk_right(raw_dut_walk_right),.aaah(raw_dut_aaah));\nassign dut_walk_left=raw_dut_walk_left;\nassign dut_walk_right=raw_dut_walk_right;\nassign dut_aaah=raw_dut_aaah;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_walk_left === 1'b0 || gold_walk_left === 1'b1) begin\nknown=1; seen_walk_left=1'b1;\nif(dut_walk_left !== gold_walk_left) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_walk_right === 1'b0 || gold_walk_right === 1'b1) begin\nknown=1; seen_walk_right=1'b1;\nif(dut_walk_right !== gold_walk_right) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_aaah === 1'b0 || gold_aaah === 1'b1) begin\nknown=1; seen_aaah=1'b1;\nif(dut_aaah !== gold_aaah) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_walk_left) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:walk_left\");\nif((&seen_walk_right) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:walk_right\");\nif((&seen_aaah) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:aaah\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob142_lemmings2_prompt.txt": "22a330071ccdcc73c790b690fced2efbd3ec8b09b278d39d3c5365c178f12cae",
        "dataset_spec-to-rtl/Prob142_lemmings2_ref.sv": "c545cc82c2c598f3214485af647398574b0eb8980439e352bd6b1854232a8960",
        "dataset_spec-to-rtl/Prob142_lemmings2_test.sv": "503dbb129085f0b1246f8cbc843d00fee46df577e341f09a0dbfb1d242a8d44d"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob143_fsm_onehot": {
    "id": "verilogeval-netlist-settled-v2:Prob143_fsm_onehot",
    "spec_sha256": "1ee22a51d07e1bbd54b3eee68f851ab5e98e969838b5c979aaf2d0072eab4354",
    "checks": 447,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in,\r\n\toutput logic [9:0] state,\r\n\tinput tb_match,\r\n\tinput [9:0] next_state_ref,\r\n\tinput [9:0] next_state_dut,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\treg [9:0] state_error = 10'h0;\r\n\t\r\n\tinitial begin #101;\r\n\t\trepeat(2) @(posedge clk);\r\n\t\tforever @(posedge clk, negedge clk)\r\n\t\t\tstate_error <= state_error | (next_state_ref^next_state_dut);\r\n\tend\r\n\t\t\r\n\tinitial begin #101;\r\n\t\tstate <= 0;\r\n\t\t\r\n\t\t@(negedge clk) wavedrom_start();\r\n\t\tfor (int i=0;i<10;i++) begin\r\n\t\t\t@(negedge clk, posedge clk);\r\n\t\t\tstate <= 1<< i;\r\n\t\t\tin <= 0;\r\n\t\tend\r\n\t\tfor (int i=0;i<10;i++) begin\r\n\t\t\t@(negedge clk, posedge clk);\r\n\t\t\tstate <= 1<< i;\r\n\t\t\tin <= 1;\r\n\t\tend\t\t\t\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\r\n\t\t// Test the one-hot cases first.\r\n\t\trepeat(200) @(posedge clk, negedge clk) begin\r\n\t\t\tstate <= 1<< ($unsigned($random(netlist_random_seed)) % 10);\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\tfor (int i=0;i<$bits(state_error);i++)\r\n\t\t\t$display(\"Hint: next_state[%0d] is %s.\", i, (state_error[i] === 1'b0) ? \"correct\": \"incorrect\");\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input in,\r\n  input [9:0] state,\r\n  output [9:0] next_state,\r\n  output out1,\r\n  output out2\r\n);\r\n\r\n  assign out1 = state[8] | state[9];\r\n  assign out2 = state[7] | state[9];\r\n\r\n  assign next_state[0] = !in && (|state[4:0] | state[7] | state[8] | state[9]);\r\n  assign next_state[1] = in && (state[0] | state[8] | state[9]);\r\n  assign next_state[2] = in && state[1];\r\n  assign next_state[3] = in && state[2];\r\n  assign next_state[4] = in && state[3];\r\n  assign next_state[5] = in && state[4];\r\n  assign next_state[6] = in && state[5];\r\n  assign next_state[7] = in && (state[6] | state[7]);\r\n  assign next_state[8] = !in && state[5];\r\n  assign next_state[9] = !in && state[6];\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire [9:0] raw_state; wire [9:0] drive_state; assign #0.1 drive_state=raw_state;\nwire [9:0] gold_next_state, dut_next_state, raw_dut_next_state; reg [9:0] seen_next_state='0;\nwire gold_out1, dut_out1, raw_dut_out1; reg seen_out1='0;\nwire gold_out2, dut_out2, raw_dut_out2; reg seen_out2='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.state(raw_state),.tb_match(1'b1),.next_state_ref(gold_next_state),.next_state_dut(gold_next_state),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.in(drive_in),.state(drive_state),.next_state(gold_next_state),.out1(gold_out1),.out2(gold_out2));\nTopModule dut(.in(drive_in),.state(drive_state),.next_state(raw_dut_next_state),.out1(raw_dut_out1),.out2(raw_dut_out2));\nassign dut_next_state=raw_dut_next_state;\nassign dut_out1=raw_dut_out1;\nassign dut_out2=raw_dut_out2;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<10;b=b+1) begin\nif(gold_next_state[b] === 1'b0 || gold_next_state[b] === 1'b1) begin\nknown=1; seen_next_state[b]=1'b1;\nif(dut_next_state[b] !== gold_next_state[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out1 === 1'b0 || gold_out1 === 1'b1) begin\nknown=1; seen_out1=1'b1;\nif(dut_out1 !== gold_out1) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_out2 === 1'b0 || gold_out2 === 1'b1) begin\nknown=1; seen_out2=1'b1;\nif(dut_out2 !== gold_out2) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_next_state) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:next_state\");\nif((&seen_out1) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out1\");\nif((&seen_out2) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out2\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob143_fsm_onehot_prompt.txt": "1ee22a51d07e1bbd54b3eee68f851ab5e98e969838b5c979aaf2d0072eab4354",
        "dataset_spec-to-rtl/Prob143_fsm_onehot_ref.sv": "5a948f020ad8e67b495bb335bfbd4bf1b5062ed7bcc6a7bc0863ef169c4527ad",
        "dataset_spec-to-rtl/Prob143_fsm_onehot_test.sv": "d2dd83bd8bff0a8f6c7df143256c83e70ecd1c54d316346af450be4e74e2c4a6"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob144_conwaylife": {
    "id": "verilogeval-netlist-settled-v2:Prob144_conwaylife",
    "spec_sha256": "91ec55318b7f23c9b690e3048c66ac6c3355422f6c45a99fb22ad6504d5f37db",
    "checks": 10045,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\tinput tb_match,\r\n\tinput [255:0] q_ref,\r\n\tinput [255:0] q_dut,\r\n\toutput reg load,\r\n\toutput reg[255:0] data\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tlogic errored = 0;\r\n\tint blinker_cycle = 0;\r\n\r\n\tinitial begin #101;\r\n\t\tdata <= 3'h7;\t\t\t// Simple blinker, period 2\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\tdata <= 4'hx;\r\n\t\terrored = 0;\r\n\t\tblinker_cycle = 0;\r\n\t\trepeat(5) @(posedge clk) begin\r\n\t\t\tblinker_cycle++;\r\n\t\t\tif (!tb_match) begin\r\n\t\t\t\tif (!errored) begin\r\n\t\t\t\t\terrored = 1;\r\n\t\t\t\t\t$display(\"Hint: The first test case is a blinker (initial state = 256'h7). First mismatch occurred at cycle %0d.\\nHint:\", blinker_cycle);\r\n\t\t\t\tend\r\n\t\t\tend\r\n\t\t\t\r\n\t\t\tif (errored) begin\r\n\t\t\t\t$display (\"Hint: Cycle %0d:         Your game state       Reference game state\", blinker_cycle);\r\n\t\t\t\tfor (int i=15;i>=0;i--) begin\r\n\t\t\t\t\t$display(\"Hint:   q[%3d:%3d]     %016b      %016b\", i*16+15, i*16, q_dut [ i*16 +: 16 ], q_ref[ i*16 +: 16 ]);\r\n\t\t\t\tend\r\n\t\t\t\t$display(\"Hint:\\nHint:\\n\");\r\n\t\t\tend\r\n\t\tend\r\n\r\n\r\n\t\tdata <= 48'h000200010007;\t// Glider, Traveling diagonal down-right.\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\tdata <= 4'hx;\r\n\t\terrored = 0;\r\n\t\tblinker_cycle = 0;\r\n\t\trepeat(100) @(posedge clk) begin\r\n\t\t\tblinker_cycle++;\r\n\t\t\tif (!tb_match) begin\r\n\t\t\t\tif (!errored) begin\r\n\t\t\t\t\terrored = 1;\r\n\t\t\t\t\t$display(\"Hint: The second test case is a glider (initial state = 256'h000200010007). First mismatch occurred at cycle %0d.\\nHint:\", blinker_cycle);\r\n\t\t\t\tend\r\n\t\t\tend\r\n\t\t\t\r\n\t\t\tif (errored && blinker_cycle < 20) begin\r\n\t\t\t\t$display (\"Hint: Cycle %0d:         Your game state       Reference game state\", blinker_cycle);\r\n\t\t\t\tfor (int i=15;i>=0;i--) begin\r\n\t\t\t\t\t$display(\"Hint:   q[%3d:%3d]     %016b      %016b\", i*16+15, i*16, q_dut [ i*16 +: 16 ], q_ref[ i*16 +: 16 ]);\r\n\t\t\t\tend\r\n\t\t\t\t$display(\"Hint:\\nHint:\\n\");\r\n\t\t\tend\r\n\t\tend\r\n\r\n\r\n\t\tdata <= 48'h0040001000ce;\t\t\t// Acorn\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(2000) @(posedge clk);\r\n\r\n\t\t\r\n\t\tdata <= {$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)};\t\t// Some random test cases.\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(200) @(posedge clk);\r\n\r\n\t\tdata <= {$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)}&\t\t// Random with more zeros.\r\n\t\t\t\t{$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)}&\r\n\t\t\t\t{$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)}&\r\n\t\t\t\t{$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed),$random(netlist_random_seed)};\r\n\t\tload <= 1;\r\n\t\t@(posedge clk);\r\n\t\tload <= 0;\r\n\t\trepeat(200) @(posedge clk);\r\n\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input load,\r\n  input [255:0] data,\r\n  output reg [255:0] q\r\n);\r\n\r\n  logic [323:0] q_pad;\r\n  always@(*) begin\r\n    for (int i=0;i<16;i++)\r\n      q_pad[18*(i+1)+1 +: 16] = q[16*i +: 16];\r\n    q_pad[1 +: 16] = q[16*15 +: 16];\r\n    q_pad[18*17+1 +: 16] = q[0 +: 16];\r\n\r\n    for (int i=0; i<18; i++) begin\r\n      q_pad[i*18] = q_pad[i*18+16];\r\n      q_pad[i*18+17] = q_pad[i*18+1];\r\n    end\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    for (int i=0;i<16;i++)\r\n    for (int j=0;j<16;j++) begin\r\n      q[i*16+j] <=\r\n        ((q_pad[(i+1)*18+j+1 -1+18] + q_pad[(i+1)*18+j+1 +18] + q_pad[(i+1)*18+j+1 +1+18] +\r\n        q_pad[(i+1)*18+j+1 -1]                                + q_pad[(i+1)*18+j+1+1] +\r\n        q_pad[(i+1)*18+j+1 -1-18]   + q_pad[(i+1)*18+j+1 -18] + q_pad[(i+1)*18+j+1 +1-18]) & 3'h7 | q[i*16+j]) == 3'h3;\r\n    end\r\n\r\n    if (load)\r\n      q <= data;\r\n\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;\nwire [255:0] raw_data; wire [255:0] drive_data; assign #0.1 drive_data=raw_data;\nwire [255:0] gold_q, dut_q, raw_dut_q; reg [255:0] seen_q='0;\nstimulus_gen stim1(.clk(clk),.tb_match(1'b1),.q_ref(gold_q),.q_dut(gold_q),.load(raw_load),.data(raw_data));\noracle_RefModule gold(.clk(clk),.load(drive_load),.data(drive_data),.q(gold_q));\nTopModule dut(.clk(clk),.load(drive_load),.data(drive_data),.q(raw_dut_q));\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<256;b=b+1) begin\nif(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin\nknown=1; seen_q[b]=1'b1;\nif(dut_q[b] !== gold_q[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob144_conwaylife_prompt.txt": "91ec55318b7f23c9b690e3048c66ac6c3355422f6c45a99fb22ad6504d5f37db",
        "dataset_spec-to-rtl/Prob144_conwaylife_ref.sv": "d3fd519e2c2e1904ac453e41c59f1c381aeb158596ae8a3f8d85effe441d2b2b",
        "dataset_spec-to-rtl/Prob144_conwaylife_test.sv": "aae7c1a04cef7fdb19aebd4a7a4cf4218fafb59cdba8df7a0b332971e7b44b95"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob145_circuit8": {
    "id": "verilogeval-netlist-settled-v2:Prob145_circuit8",
    "spec_sha256": "d9615923332ae43546c202e05d3bf0f59c1513d0fc45786fed919f9dffd1c117",
    "checks": 470,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic clock=0,\r\n\toutput logic a,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\talways begin\r\n\t\trepeat(3) @(posedge clk);\r\n\t\tclock = ~clock;\r\n\tend\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\ta <= 0;\r\n\t\t@(negedge clock) {a} <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\t@(posedge clk) {a} <= 0;\r\n\t\t\trepeat(14) @(posedge clk,negedge clk) a <= ~a;\r\n\t\t\trepeat(5) @(posedge clk, negedge clk);\r\n\t\t\trepeat(8) @(posedge clk,negedge clk) a <= ~a;\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\ta <= $urandom;\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clock,\r\n  input a,\r\n  output reg p,\r\n  output reg q\r\n);\r\n\r\n  always @(negedge clock)\r\n    q <= a;\r\n\r\n  always @(*)\r\n    if (clock)\r\n      p = a;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_clock; wire drive_clock; assign drive_clock=raw_clock;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire gold_p, dut_p, raw_dut_p; reg seen_p='0;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nstimulus_gen stim1(.clk(clk),.clock(raw_clock),.a(raw_a),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clock(drive_clock),.a(drive_a),.p(gold_p),.q(gold_q));\nTopModule dut(.clock(drive_clock),.a(drive_a),.p(raw_dut_p),.q(raw_dut_q));\nassign dut_p=raw_dut_p;\nassign dut_q=raw_dut_q;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_p === 1'b0 || gold_p === 1'b1) begin\nknown=1; seen_p=1'b1;\nif(dut_p !== gold_p) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_p) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:p\");\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob145_circuit8_prompt.txt": "d9615923332ae43546c202e05d3bf0f59c1513d0fc45786fed919f9dffd1c117",
        "dataset_spec-to-rtl/Prob145_circuit8_ref.sv": "bdad6732ce6e7958c6104a6946c374359306d717da4142a92724ad2c37934f9a",
        "dataset_spec-to-rtl/Prob145_circuit8_test.sv": "70aa3bad9b94fc82583b060301f7f32ecde1eac0f6594257aff1422688c64bb3"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clock"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob146_fsm_serialdata": {
    "id": "verilogeval-netlist-settled-v2:Prob146_fsm_serialdata",
    "spec_sha256": "de8ab1526c1f0a9868e3f38eff6139bbae5f7e715892e5c70821255c2632f8dd",
    "checks": 1809,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic in,\r\n\toutput logic reset\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\tin <= 0;\r\n\t\trepeat(9) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(9) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(10) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(10) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\tin <= 0;\r\n\t\trepeat(9) @(posedge clk);\r\n\t\tin <= 1;\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\t\r\n\t\t\r\n\t\trepeat(800) @(posedge clk, negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input in,\r\n  input reset,\r\n  output [7:0] out_byte,\r\n  output done\r\n);\r\n\r\n  parameter B0=0, B1=1, B2=2, B3=3, B4=4, B5=5, B6=6, B7=7, START=8, STOP=9, DONE=10, ERR=11;\r\n  reg [3:0] state;\r\n  reg [3:0] next;\r\n\r\n  reg [9:0] byte_r;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      START: next = in ? START : B0;  // start bit is 0\r\n      B0: next = B1;\r\n      B1: next = B2;\r\n      B2: next = B3;\r\n      B3: next = B4;\r\n      B4: next = B5;\r\n      B5: next = B6;\r\n      B6: next = B7;\r\n      B7: next = STOP;\r\n      STOP: next = in ? DONE : ERR;  // stop bit is 1. Idle state is 1.\r\n      DONE: next = in ? START : B0;\r\n      ERR: next = in ? START : ERR;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= START;\r\n      else state <= next;\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    byte_r <= {in, byte_r[9:1]};\r\n  end\r\n\r\n  assign done = (state==DONE);\r\n  assign out_byte = done ? byte_r[8:1] : 8'hx;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [7:0] gold_out_byte, dut_out_byte, raw_dut_out_byte; reg [7:0] seen_out_byte='0;\nwire gold_done, dut_done, raw_dut_done; reg seen_done='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.reset(raw_reset));\noracle_RefModule gold(.clk(clk),.in(drive_in),.reset(drive_reset),.out_byte(gold_out_byte),.done(gold_done));\nTopModule dut(.clk(clk),.in(drive_in),.reset(drive_reset),.out_byte(raw_dut_out_byte),.done(raw_dut_done));\nassign dut_out_byte=raw_dut_out_byte;\nassign dut_done=raw_dut_done;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<8;b=b+1) begin\nif(gold_out_byte[b] === 1'b0 || gold_out_byte[b] === 1'b1) begin\nknown=1; seen_out_byte[b]=1'b1;\nif(dut_out_byte[b] !== gold_out_byte[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_done === 1'b0 || gold_done === 1'b1) begin\nknown=1; seen_done=1'b1;\nif(dut_done !== gold_done) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_byte) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_byte\");\nif((&seen_done) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:done\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob146_fsm_serialdata_prompt.txt": "de8ab1526c1f0a9868e3f38eff6139bbae5f7e715892e5c70821255c2632f8dd",
        "dataset_spec-to-rtl/Prob146_fsm_serialdata_ref.sv": "09ad9a54473ff661e1921d35a488b328635c2ed12a886abc8f896fe1a77bbb99",
        "dataset_spec-to-rtl/Prob146_fsm_serialdata_test.sv": "4f54be4f3cf0e1f3b9140027a51e2ddd027e5121f74e141eb363289f69843f02"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob147_circuit10": {
    "id": "verilogeval-netlist-settled-v2:Prob147_circuit10",
    "spec_sha256": "39db96a54f018be1f978d5d04aed36fde840d901d0e79f2a6af1fe3738b859d4",
    "checks": 458,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic a,\r\n\toutput logic b,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\ta <= 1;\r\n\t\t@(negedge clk) {a,b} <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"Unknown circuit\");\r\n\t\t\trepeat(3) @(posedge clk);\r\n\t\t\t{a,b} <= 1;\r\n\t\t\t@(posedge clk) {a,b} <= 2;\r\n\t\t\t@(posedge clk) {a,b} <= 3;\r\n\t\t\t@(posedge clk) {a,b} <= 0;\r\n\t\t\t@(posedge clk) {a,b} <= 3;\r\n\t\t\t@(posedge clk) {a,b} <= 3;\r\n\t\t\t@(posedge clk) {a,b} <= 3;\r\n\t\t\t@(posedge clk) {a,b} <= 2;\r\n\t\t\t@(posedge clk) {a,b} <= 1;\r\n\t\t\t@(posedge clk) {a,b} <= 0;\r\n\t\t\t@(posedge clk) {a,b} <= 0;\r\n\t\t\t@(posedge clk) {a,b} <= 0;\r\n\t\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(200) @(posedge clk, negedge clk)\r\n\t\t\ta <= &((5)'($urandom));\r\n\t\t$finish;\r\n\tend end\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input a,\r\n  input b,\r\n  output q,\r\n  output state\r\n);\r\n\r\n  reg c;\r\n  always @(posedge clk)\r\n    c <= a&b | a&c | b&c;\r\n\r\n  assign q = a^b^c;\r\n  assign state = c;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;\nwire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;\nwire gold_q, dut_q, raw_dut_q; reg seen_q='0;\nwire gold_state, dut_state, raw_dut_state; reg seen_state='0;\nstimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());\noracle_RefModule gold(.clk(clk),.a(drive_a),.b(drive_b),.q(gold_q),.state(gold_state));\nTopModule dut(.clk(clk),.a(drive_a),.b(drive_b),.q(raw_dut_q),.state(raw_dut_state));\nassign dut_q=raw_dut_q;\nassign dut_state=raw_dut_state;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_q === 1'b0 || gold_q === 1'b1) begin\nknown=1; seen_q=1'b1;\nif(dut_q !== gold_q) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_state === 1'b0 || gold_state === 1'b1) begin\nknown=1; seen_state=1'b1;\nif(dut_state !== gold_state) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_q) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:q\");\nif((&seen_state) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:state\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob147_circuit10_prompt.txt": "39db96a54f018be1f978d5d04aed36fde840d901d0e79f2a6af1fe3738b859d4",
        "dataset_spec-to-rtl/Prob147_circuit10_ref.sv": "574c88c0a6304b6228fa84f384520593a0f06daab1df26de81f2057fe205ac03",
        "dataset_spec-to-rtl/Prob147_circuit10_test.sv": "d207c491ea9d6e94ab3c57369123dcf8df4a5ee334b11d47719ceb3a18cdc757"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob148_2013_q2afsm": {
    "id": "verilogeval-netlist-settled-v2:Prob148_2013_q2afsm",
    "spec_sha256": "bd14bbc4be301daa3cd0ce45f4d366a557723368ff3edd9907b2650f25d07da6",
    "checks": 2107,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic resetn,\r\n\toutput logic [2:0] r,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign resetn = ~reset;\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\tr <= 0;\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\tr <= 1;\r\n\t\treset_test();\r\n\t\t\r\n\t\tr <= 0;\r\n\t\twavedrom_start(\"\");\r\n\t\t@(posedge clk) r <= 0;\r\n\t\t@(posedge clk) r <= 7;\r\n\t\t@(posedge clk) r <= 7;\r\n\t\t@(posedge clk) r <= 7;\r\n\t\t@(posedge clk) r <= 6;\r\n\t\t@(posedge clk) r <= 6;\r\n\t\t@(posedge clk) r <= 6;\r\n\t\t@(posedge clk) r <= 4;\r\n\t\t@(posedge clk) r <= 4;\r\n\t\t@(posedge clk) r <= 4;\r\n\t\t@(posedge clk) r <= 0;\r\n\t\t@(posedge clk) r <= 0;\r\n\t\t@(posedge clk) r <= 4;\r\n\t\t@(posedge clk) r <= 6;\r\n\t\t@(posedge clk) r <= 7;\r\n\t\t@(posedge clk) r <= 7;\r\n\t\t@(posedge clk) r <= 7;\r\n\t\t@(negedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t\r\n\t\trepeat(500) @(negedge clk) begin\r\n\t\t\treset <= ($random(netlist_random_seed) & 63) == 0;\r\n\t\t\tr <= $random(netlist_random_seed);\r\n\t\tend\r\n\t\t\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input resetn,\r\n  input  [2:0] r,\r\n  output [2:0] g\r\n);\r\n\r\n  parameter A=0, B=1, C=2, D=3;\r\n  reg [1:0] state, next;\r\n\r\n  always @(posedge clk) begin\r\n    if (~resetn) state <= A;\r\n    else state <= next;\r\n  end\r\n\r\n  always@(state,r) begin\r\n    case (state)\r\n      A: if (r[0]) next = B;\r\n         else if (r[1]) next = C;\r\n         else if (r[2]) next = D;\r\n         else next = A;\r\n      B: next = r[0] ? B : A;\r\n      C: next = r[1] ? C : A;\r\n      D: next = r[2] ? D : A;\r\n      default: next = 'x;\r\n    endcase\r\n  end\r\n\r\n  assign g[0] = (state == B);\r\n  assign g[1] = (state == C);\r\n  assign g[2] = (state == D);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_resetn; wire drive_resetn; assign #0.1 drive_resetn=raw_resetn;\nwire [2:0] raw_r; wire [2:0] drive_r; assign #0.1 drive_r=raw_r;\nwire [2:0] gold_g, dut_g, raw_dut_g; reg [2:0] seen_g='0;\nstimulus_gen stim1(.clk(clk),.resetn(raw_resetn),.r(raw_r),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.resetn(drive_resetn),.r(drive_r),.g(gold_g));\nTopModule dut(.clk(clk),.resetn(drive_resetn),.r(drive_r),.g(raw_dut_g));\nassign dut_g=raw_dut_g;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<3;b=b+1) begin\nif(gold_g[b] === 1'b0 || gold_g[b] === 1'b1) begin\nknown=1; seen_g[b]=1'b1;\nif(dut_g[b] !== gold_g[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_g) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:g\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob148_2013_q2afsm_prompt.txt": "bd14bbc4be301daa3cd0ce45f4d366a557723368ff3edd9907b2650f25d07da6",
        "dataset_spec-to-rtl/Prob148_2013_q2afsm_ref.sv": "95ecbcaf354072c1dd8297977a775826523a38ebc8b7ab41a4c4161f36c95f48",
        "dataset_spec-to-rtl/Prob148_2013_q2afsm_test.sv": "dba36ec7643bd9f62708224b6eba058653f3a423d442fd8979743acdceea8aff"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob149_ece241_2013_q4": {
    "id": "verilogeval-netlist-settled-v2:Prob149_ece241_2013_q4",
    "spec_sha256": "1624c25d1c398ed8fbd028a4ce1bd3164bd7e21023ff9971d911dd0f6d78ae63",
    "checks": 4078,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic reset,\r\n\toutput logic [2:0] s,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n\twire [3:0][2:0] val = { 3'h7, 3'h3, 3'h1, 3'h0 };\r\n\tinteger sval;\r\n\tinitial begin #101;\r\n\t\treset <= 1;\r\n\t\ts <= 1;\r\n\t\treset_test();\r\n\t\t\r\n\t\t\r\n\t\t@(posedge clk) s <= 0;\r\n\t\t@(posedge clk) s <= 0;\r\n\t\t@(negedge clk) wavedrom_start(\"Water rises to highest level, then down to lowest level.\");\r\n\t\t\t@(posedge clk) s <= 0;\r\n\t\t\t@(posedge clk) s <= 1;\r\n\t\t\t@(posedge clk) s <= 3;\r\n\t\t\t@(posedge clk) s <= 7;\r\n\t\t\t@(posedge clk) s <= 7;\r\n\t\t\t@(posedge clk) s <= 3;\r\n\t\t\t@(posedge clk) s <= 3;\r\n\t\t\t@(posedge clk) s <= 1;\r\n\t\t\t@(posedge clk) s <= 1;\r\n\t\t\t@(posedge clk) s <= 0;\r\n\t\t\t@(posedge clk) s <= 0;\r\n\t\t@(negedge clk) wavedrom_stop();\r\n\t\t\r\n\t\tsval = 0;\r\n\t\trepeat(1000) begin\r\n\t\t\t@(posedge clk);\r\n\t\t\t\tsval = sval + (sval == 3 ? 0 : $random(netlist_random_seed)&1);\r\n\t\t\t\ts <= val[sval];\r\n\t\t\t@(negedge clk);\r\n\t\t\t\tsval = sval - (sval == 0 ? 0 : $random(netlist_random_seed)&1);\r\n\t\t\t\ts <= val[sval];\r\n\t\tend\r\n\r\n\t\t$finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input [2:0] s,\r\n  output reg fr2,\r\n  output reg fr1,\r\n  output reg fr0,\r\n  output reg dfr\r\n);\r\n\r\n  parameter A2=0, B1=1, B2=2, C1=3, C2=4, D1=5;\r\n  reg [2:0] state, next;\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= A2;\r\n    else state <= next;\r\n  end\r\n\r\n  always@(*) begin\r\n    case (state)\r\n      A2: next = s[0] ? B1 : A2;\r\n      B1: next = s[1] ? C1 : (s[0] ? B1 : A2);\r\n      B2: next = s[1] ? C1 : (s[0] ? B2 : A2);\r\n      C1: next = s[2] ? D1 : (s[1] ? C1 : B2);\r\n      C2: next = s[2] ? D1 : (s[1] ? C2 : B2);\r\n      D1: next = s[2] ? D1 : C2;\r\n      default: next = 'x;\r\n    endcase\r\n  end\r\n  reg [3:0] fr;\r\n  assign {fr2, fr1, fr0, dfr} = fr;\r\n  always_comb begin\r\n    case (state)\r\n      A2: fr = 4'b1111;\r\n      B1: fr = 4'b0110;\r\n      B2: fr = 4'b0111;\r\n      C1: fr = 4'b0010;\r\n      C2: fr = 4'b0011;\r\n      D1: fr = 4'b0000;\r\n      default: fr = 'x;\r\n    endcase\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [2:0] raw_s; wire [2:0] drive_s; assign #0.1 drive_s=raw_s;\nwire gold_fr2, dut_fr2, raw_dut_fr2; reg seen_fr2='0;\nwire gold_fr1, dut_fr1, raw_dut_fr1; reg seen_fr1='0;\nwire gold_fr0, dut_fr0, raw_dut_fr0; reg seen_fr0='0;\nwire gold_dfr, dut_dfr, raw_dut_dfr; reg seen_dfr='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.s(raw_s),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.s(drive_s),.fr2(gold_fr2),.fr1(gold_fr1),.fr0(gold_fr0),.dfr(gold_dfr));\nTopModule dut(.clk(clk),.reset(drive_reset),.s(drive_s),.fr2(raw_dut_fr2),.fr1(raw_dut_fr1),.fr0(raw_dut_fr0),.dfr(raw_dut_dfr));\nassign dut_fr2=raw_dut_fr2;\nassign dut_fr1=raw_dut_fr1;\nassign dut_fr0=raw_dut_fr0;\nassign dut_dfr=raw_dut_dfr;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_fr2 === 1'b0 || gold_fr2 === 1'b1) begin\nknown=1; seen_fr2=1'b1;\nif(dut_fr2 !== gold_fr2) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_fr1 === 1'b0 || gold_fr1 === 1'b1) begin\nknown=1; seen_fr1=1'b1;\nif(dut_fr1 !== gold_fr1) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_fr0 === 1'b0 || gold_fr0 === 1'b1) begin\nknown=1; seen_fr0=1'b1;\nif(dut_fr0 !== gold_fr0) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_dfr === 1'b0 || gold_dfr === 1'b1) begin\nknown=1; seen_dfr=1'b1;\nif(dut_dfr !== gold_dfr) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_fr2) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:fr2\");\nif((&seen_fr1) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:fr1\");\nif((&seen_fr0) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:fr0\");\nif((&seen_dfr) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:dfr\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob149_ece241_2013_q4_prompt.txt": "1624c25d1c398ed8fbd028a4ce1bd3164bd7e21023ff9971d911dd0f6d78ae63",
        "dataset_spec-to-rtl/Prob149_ece241_2013_q4_ref.sv": "6568d07b20f8d6e1a9cce72b4291eda94cf47a7b451faf5eb9d4c308c549b051",
        "dataset_spec-to-rtl/Prob149_ece241_2013_q4_test.sv": "1609f005ad2effeccafb2d07e38864b078344f591d6db65169cd52424d75eeff"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob150_review2015_fsmonehot": {
    "id": "verilogeval-netlist-settled-v2:Prob150_review2015_fsmonehot",
    "spec_sha256": "17a708b280035aaaadcf2e56bbd867368a5101ef6dc68ecafbf72b9861a8ee18",
    "checks": 599,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg d, done_counting, ack,\r\n\toutput reg [9:0] state,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\t{d, done_counting, ack} <= 3'h0;\r\n\t\tstate <= 10'h0;\r\n\t\t\r\n\t\trepeat(300) @(posedge clk, negedge clk) begin\r\n\t\t\t{d, done_counting, ack} = $random(netlist_random_seed);\r\n\t\t\tstate <= 1<< ($unsigned($random(netlist_random_seed)) % 10);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input d,\r\n  input done_counting,\r\n  input ack,\r\n  input [9:0] state, // 10-bit one-hot current state\r\n  output B3_next,\r\n  output S_next,\r\n  output S1_next,\r\n  output Count_next,\r\n  output Wait_next,\r\n  output done,\r\n  output counting,\r\n  output shift_ena\r\n);\r\n\r\n  parameter S=0, S1=1, S11=2, S110=3, B0=4, B1=5, B2=6, B3=7, Count=8, Wait=9;\r\n\r\n  assign B3_next = state[B2];\r\n  assign S_next = state[S]&~d | state[S1]&~d | state[S110]&~d | state[Wait]&ack;\r\n  assign S1_next = state[S]&d;\r\n  assign Count_next = state[B3] | state[Count]&~done_counting;\r\n  assign Wait_next = state[Count]&done_counting | state[Wait]&~ack;\r\n\r\n  assign done = state[Wait];\r\n  assign counting = state[Count];\r\n  assign shift_ena = |state[B3:B0];\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;\nwire raw_done_counting; wire drive_done_counting; assign #0.1 drive_done_counting=raw_done_counting;\nwire raw_ack; wire drive_ack; assign #0.1 drive_ack=raw_ack;\nwire [9:0] raw_state; wire [9:0] drive_state; assign #0.1 drive_state=raw_state;\nwire gold_B3_next, dut_B3_next, raw_dut_B3_next; reg seen_B3_next='0;\nwire gold_S_next, dut_S_next, raw_dut_S_next; reg seen_S_next='0;\nwire gold_S1_next, dut_S1_next, raw_dut_S1_next; reg seen_S1_next='0;\nwire gold_Count_next, dut_Count_next, raw_dut_Count_next; reg seen_Count_next='0;\nwire gold_Wait_next, dut_Wait_next, raw_dut_Wait_next; reg seen_Wait_next='0;\nwire gold_done, dut_done, raw_dut_done; reg seen_done='0;\nwire gold_counting, dut_counting, raw_dut_counting; reg seen_counting='0;\nwire gold_shift_ena, dut_shift_ena, raw_dut_shift_ena; reg seen_shift_ena='0;\nstimulus_gen stim1(.clk(clk),.d(raw_d),.done_counting(raw_done_counting),.ack(raw_ack),.state(raw_state),.tb_match(1'b1));\noracle_RefModule gold(.d(drive_d),.done_counting(drive_done_counting),.ack(drive_ack),.state(drive_state),.B3_next(gold_B3_next),.S_next(gold_S_next),.S1_next(gold_S1_next),.Count_next(gold_Count_next),.Wait_next(gold_Wait_next),.done(gold_done),.counting(gold_counting),.shift_ena(gold_shift_ena));\nTopModule dut(.d(drive_d),.done_counting(drive_done_counting),.ack(drive_ack),.state(drive_state),.B3_next(raw_dut_B3_next),.S_next(raw_dut_S_next),.S1_next(raw_dut_S1_next),.Count_next(raw_dut_Count_next),.Wait_next(raw_dut_Wait_next),.done(raw_dut_done),.counting(raw_dut_counting),.shift_ena(raw_dut_shift_ena));\nassign dut_B3_next=raw_dut_B3_next;\nassign dut_S_next=raw_dut_S_next;\nassign dut_S1_next=raw_dut_S1_next;\nassign dut_Count_next=raw_dut_Count_next;\nassign dut_Wait_next=raw_dut_Wait_next;\nassign dut_done=raw_dut_done;\nassign dut_counting=raw_dut_counting;\nassign dut_shift_ena=raw_dut_shift_ena;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_B3_next === 1'b0 || gold_B3_next === 1'b1) begin\nknown=1; seen_B3_next=1'b1;\nif(dut_B3_next !== gold_B3_next) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_S_next === 1'b0 || gold_S_next === 1'b1) begin\nknown=1; seen_S_next=1'b1;\nif(dut_S_next !== gold_S_next) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_S1_next === 1'b0 || gold_S1_next === 1'b1) begin\nknown=1; seen_S1_next=1'b1;\nif(dut_S1_next !== gold_S1_next) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Count_next === 1'b0 || gold_Count_next === 1'b1) begin\nknown=1; seen_Count_next=1'b1;\nif(dut_Count_next !== gold_Count_next) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_Wait_next === 1'b0 || gold_Wait_next === 1'b1) begin\nknown=1; seen_Wait_next=1'b1;\nif(dut_Wait_next !== gold_Wait_next) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_done === 1'b0 || gold_done === 1'b1) begin\nknown=1; seen_done=1'b1;\nif(dut_done !== gold_done) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_counting === 1'b0 || gold_counting === 1'b1) begin\nknown=1; seen_counting=1'b1;\nif(dut_counting !== gold_counting) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_shift_ena === 1'b0 || gold_shift_ena === 1'b1) begin\nknown=1; seen_shift_ena=1'b1;\nif(dut_shift_ena !== gold_shift_ena) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_B3_next) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:B3_next\");\nif((&seen_S_next) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:S_next\");\nif((&seen_S1_next) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:S1_next\");\nif((&seen_Count_next) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Count_next\");\nif((&seen_Wait_next) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:Wait_next\");\nif((&seen_done) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:done\");\nif((&seen_counting) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:counting\");\nif((&seen_shift_ena) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:shift_ena\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob150_review2015_fsmonehot_prompt.txt": "17a708b280035aaaadcf2e56bbd867368a5101ef6dc68ecafbf72b9861a8ee18",
        "dataset_spec-to-rtl/Prob150_review2015_fsmonehot_ref.sv": "890740cbf438c3426af1583143e617981a91d9fbbcc41dcd095abaa779a84e74",
        "dataset_spec-to-rtl/Prob150_review2015_fsmonehot_test.sv": "613d43467b7ed7a426303e55fc7a21defcaa94758cbf6837b87f81f84097bd33"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [],
      "negative_control": "inversion"
    }
  },
  "Prob151_review2015_fsm": {
    "id": "verilogeval-netlist-settled-v2:Prob151_review2015_fsm",
    "spec_sha256": "dd70ea13f3636d771a914f3ac6701b740ab517dc463389cc58bb80c64984097d",
    "checks": 10133,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput reg reset,\r\n\toutput reg data, done_counting, ack,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\tbit failed = 0;\r\n\t\r\n\talways @(posedge clk, negedge clk)\r\n\t\tif (!tb_match) \r\n\t\t\tfailed <= 1;\r\n\t\r\n\tinitial begin #101;\r\n\r\n\t\t@(posedge clk);\r\n\t\tfailed <= 0;\r\n\t\treset <= 1;\r\n\t\tdata <= 0;\r\n\t\tdone_counting <= 1'bx;\r\n\t\tack <= 1'bx;\r\n\t\t@(posedge clk) \r\n\t\t\tdata <= 1;\r\n\t\t\treset <= 0;\r\n\t\t@(posedge clk) data <= 0;\r\n\t\t@(posedge clk) data <= 0;\r\n\t\t@(posedge clk) data <= 1;\r\n\t\t@(posedge clk) data <= 1;\r\n\t\t@(posedge clk) data <= 0;\r\n\t\t@(posedge clk) data <= 1;\r\n\t\t@(posedge clk);\r\n\t\t\tdata <= 1'bx;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\t\tdone_counting <= 1'b0;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\t\tdone_counting <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\t\tdone_counting <= 1'bx;\r\n\t\t\tack <= 1'b0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\t\tack <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\t\tack <= 1'b0;\r\n\t\t\tdata <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\t\tack <= 1'bx;\r\n\t\t\tdata <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\t\tdata <= 1'b0;\r\n\t\t@(posedge clk);\r\n\t\t\tdata <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\t\tdata <= 1'bx;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\t\tdone_counting <= 1'b0;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\t\tdone_counting <= 1'b1;\r\n\t\t@(posedge clk);\r\n\r\n\t\tif (failed)\r\n\t\t\t$display(\"Hint: Your FSM didn't pass the sample timing diagram posted with the problem statement. Perhaps try debugging that?\");\r\n\t\t\r\n\t\t\r\n\t\r\n\t\trepeat(5000) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 255);\r\n\t\t\tdata <= $random(netlist_random_seed);\r\n\t\t\tdone_counting <= !($random(netlist_random_seed) & 31);\r\n\t\t\tack <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input reset,\r\n  input data,\r\n  output reg shift_ena,\r\n  output reg counting,\r\n  input done_counting,\r\n  output reg done,\r\n  input ack\r\n);\r\n\r\n  typedef enum logic[3:0] {\r\n    S, S1, S11, S110, B0, B1, B2, B3, Count, Wait\r\n  } States;\r\n\r\n  States state, next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      S: next = States'(data ? S1: S);\r\n      S1: next = States'(data ? S11: S);\r\n      S11: next = States'(data ? S11 : S110);\r\n      S110: next = States'(data ? B0 : S);\r\n      B0: next = B1;\r\n      B1: next = B2;\r\n      B2: next = B3;\r\n      B3: next = Count;\r\n      Count: next = States'(done_counting ? Wait : Count);\r\n      Wait: next = States'(ack ? S : Wait);\r\n      default: next = States'(4'bx);\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= S;\r\n    else state <= next;\r\n  end\r\n\r\n  always_comb begin\r\n    shift_ena = 0; counting = 0; done = 0;\r\n    if (state == B0 || state == B1 || state == B2 || state == B3)\r\n      shift_ena = 1;\r\n    if (state == Count)\r\n      counting = 1;\r\n    if (state == Wait)\r\n      done = 1;\r\n\r\n    if (|state === 1'bx) begin\r\n      {shift_ena, counting, done} = 'x;\r\n    end\r\n\r\n  end\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_data; wire drive_data; assign #0.1 drive_data=raw_data;\nwire raw_done_counting; wire drive_done_counting; assign #0.1 drive_done_counting=raw_done_counting;\nwire raw_ack; wire drive_ack; assign #0.1 drive_ack=raw_ack;\nwire gold_shift_ena, dut_shift_ena, raw_dut_shift_ena; reg seen_shift_ena='0;\nwire gold_counting, dut_counting, raw_dut_counting; reg seen_counting='0;\nwire gold_done, dut_done, raw_dut_done; reg seen_done='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.data(raw_data),.done_counting(raw_done_counting),.ack(raw_ack),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.data(drive_data),.done_counting(drive_done_counting),.ack(drive_ack),.shift_ena(gold_shift_ena),.counting(gold_counting),.done(gold_done));\nTopModule dut(.clk(clk),.reset(drive_reset),.data(drive_data),.done_counting(drive_done_counting),.ack(drive_ack),.shift_ena(raw_dut_shift_ena),.counting(raw_dut_counting),.done(raw_dut_done));\nassign dut_shift_ena=raw_dut_shift_ena;\nassign dut_counting=raw_dut_counting;\nassign dut_done=raw_dut_done;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_shift_ena === 1'b0 || gold_shift_ena === 1'b1) begin\nknown=1; seen_shift_ena=1'b1;\nif(dut_shift_ena !== gold_shift_ena) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_counting === 1'b0 || gold_counting === 1'b1) begin\nknown=1; seen_counting=1'b1;\nif(dut_counting !== gold_counting) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_done === 1'b0 || gold_done === 1'b1) begin\nknown=1; seen_done=1'b1;\nif(dut_done !== gold_done) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_shift_ena) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:shift_ena\");\nif((&seen_counting) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:counting\");\nif((&seen_done) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:done\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob151_review2015_fsm_prompt.txt": "dd70ea13f3636d771a914f3ac6701b740ab517dc463389cc58bb80c64984097d",
        "dataset_spec-to-rtl/Prob151_review2015_fsm_ref.sv": "525906360923a6788abdaded331c6e7b26d33563ff6e0ef0bca24ea1d6c993f5",
        "dataset_spec-to-rtl/Prob151_review2015_fsm_test.sv": "a3be052c31b478485d5763ae6d17736c0f125c8f11154ef0e296d74bbd1a53c7"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob152_lemmings3": {
    "id": "verilogeval-netlist-settled-v2:Prob152_lemmings3",
    "spec_sha256": "9d586fc092ddee2ea1ea857509177489c357e0a3411549dfda9b4be38a1e00ff",
    "checks": 885,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic areset,\r\n\toutput logic bump_left,\r\n\toutput logic bump_right,\r\n\toutput logic dig,\r\n\toutput logic ground,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\t\r\n\twire [0:13][3:0] d = {\r\n\t\t4'h2,\r\n\t\t4'h2,\r\n\t\t4'h3,\r\n\t\t4'h2,\r\n\t\t4'ha,\r\n\t\t4'h2,\r\n\t\t4'h0,\r\n\t\t4'h0,\r\n\t\t4'h0,\r\n\t\t4'h3,\r\n\t\t4'h2,\r\n\t\t4'h2,\r\n\t\t4'h2,\r\n\t\t4'h2\r\n\t};\r\n\t\r\n\tinitial begin #101;\r\n\t\treset <= 1'b1;\r\n\t\t{bump_left, bump_right, ground, dig} <= 4'h2;\r\n\t\treset_test(1);\r\n\r\n\t\treset <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\t\r\n\t\t@(negedge clk);\r\n\t\twavedrom_start(\"Digging\");\r\n\t\tfor (int i=0;i<14;i++)\r\n\t\t\t@(posedge clk) {bump_left, bump_right, ground, dig} <= d[i];\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\t{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);\r\n\t\t\tground <= |($random(netlist_random_seed) & 7);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n  input bump_left,\r\n  input bump_right,\r\n  input ground,\r\n  input dig,\r\n  output walk_left,\r\n  output walk_right,\r\n  output aaah,\r\n  output digging\r\n);\r\n\r\n  parameter WL=0, WR=1, FALLL=2, FALLR=3, DIGL=4, DIGR=5;\r\n  reg [2:0] state;\r\n  reg [2:0] next;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      WL: if (!ground) next = FALLL;\r\n        else if (dig) next = DIGL;\r\n        else if (bump_left) next = WR;\r\n        else next = WL;\r\n      WR:\r\n        if (!ground) next = FALLR;\r\n        else if (dig) next = DIGR;\r\n        else if (bump_right) next = WL;\r\n        else next = WR;\r\n      FALLL: next = ground ? WL : FALLL;\r\n      FALLR: next = ground ? WR : FALLR;\r\n      DIGL: next = ground ? DIGL : FALLL;\r\n      DIGR: next = ground ? DIGR : FALLR;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk, posedge areset) begin\r\n    if (areset) state <= WL;\r\n      else state <= next;\r\n  end\r\n\r\n  assign walk_left = (state==WL);\r\n  assign walk_right = (state==WR);\r\n  assign aaah = (state == FALLL) || (state == FALLR);\r\n  assign digging = (state == DIGL) || (state == DIGR);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_bump_left; wire drive_bump_left; assign #0.1 drive_bump_left=raw_bump_left;\nwire raw_bump_right; wire drive_bump_right; assign #0.1 drive_bump_right=raw_bump_right;\nwire raw_ground; wire drive_ground; assign #0.1 drive_ground=raw_ground;\nwire raw_dig; wire drive_dig; assign #0.1 drive_dig=raw_dig;\nwire gold_walk_left, dut_walk_left, raw_dut_walk_left; reg seen_walk_left='0;\nwire gold_walk_right, dut_walk_right, raw_dut_walk_right; reg seen_walk_right='0;\nwire gold_aaah, dut_aaah, raw_dut_aaah; reg seen_aaah='0;\nwire gold_digging, dut_digging, raw_dut_digging; reg seen_digging='0;\nstimulus_gen stim1(.clk(clk),.areset(raw_areset),.bump_left(raw_bump_left),.bump_right(raw_bump_right),.dig(raw_dig),.ground(raw_ground),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.dig(drive_dig),.walk_left(gold_walk_left),.walk_right(gold_walk_right),.aaah(gold_aaah),.digging(gold_digging));\nTopModule dut(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.dig(drive_dig),.walk_left(raw_dut_walk_left),.walk_right(raw_dut_walk_right),.aaah(raw_dut_aaah),.digging(raw_dut_digging));\nassign dut_walk_left=raw_dut_walk_left;\nassign dut_walk_right=raw_dut_walk_right;\nassign dut_aaah=raw_dut_aaah;\nassign dut_digging=raw_dut_digging;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_walk_left === 1'b0 || gold_walk_left === 1'b1) begin\nknown=1; seen_walk_left=1'b1;\nif(dut_walk_left !== gold_walk_left) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_walk_right === 1'b0 || gold_walk_right === 1'b1) begin\nknown=1; seen_walk_right=1'b1;\nif(dut_walk_right !== gold_walk_right) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_aaah === 1'b0 || gold_aaah === 1'b1) begin\nknown=1; seen_aaah=1'b1;\nif(dut_aaah !== gold_aaah) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_digging === 1'b0 || gold_digging === 1'b1) begin\nknown=1; seen_digging=1'b1;\nif(dut_digging !== gold_digging) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_walk_left) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:walk_left\");\nif((&seen_walk_right) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:walk_right\");\nif((&seen_aaah) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:aaah\");\nif((&seen_digging) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:digging\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob152_lemmings3_prompt.txt": "9d586fc092ddee2ea1ea857509177489c357e0a3411549dfda9b4be38a1e00ff",
        "dataset_spec-to-rtl/Prob152_lemmings3_ref.sv": "6073eb67732b672d783dacee5df8fc4556c5a4952f119791db2e6d877bb9be87",
        "dataset_spec-to-rtl/Prob152_lemmings3_test.sv": "36aad3729ddb2913b0bd4f83ff0cdfcc40b3baa2fcdc732b09180fade18b4600"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob153_gshare": {
    "id": "verilogeval-netlist-settled-v2:Prob153_gshare",
    "spec_sha256": "60c36ac16d574878e1bdd51557310dff32b67bac44af4ba69417e4b83c50c8c7",
    "checks": 1192,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen\r\n#(parameter N=7)\r\n(\r\n\tinput clk,\r\n\toutput logic areset,\r\n\t\r\n\toutput logic predict_valid,\r\n\toutput [N-1:0] predict_pc,\r\n\t\r\n\toutput logic train_valid,\r\n\toutput train_taken,\r\n\toutput train_mispredicted,\r\n\toutput [N-1:0] train_history,\r\n\toutput [N-1:0] train_pc,\r\n\r\n\tinput tb_match,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\toutput int wavedrom_hide_after_time\t\r\n);\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\treg reset;\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\t\r\n\tassign areset = reset;\r\n\t\r\n\tlogic [N-1:0] predict_pc_r;\r\n\tlogic train_taken_r;\r\n\tlogic train_mispredicted_r;\r\n\tlogic [N-1:0] train_history_r;\r\n\tlogic [N-1:0] train_pc_r;\r\n\t\r\n\tassign predict_pc = predict_valid ? predict_pc_r : {N{1'bx}};\r\n\tassign train_taken = train_valid ? train_taken_r : 1'bx;\r\n\tassign train_mispredicted = train_valid ? train_mispredicted_r : 1'bx;\r\n\tassign train_history = train_valid ? train_history_r : {N{1'bx}};\r\n\tassign train_pc = train_valid ? train_pc_r : {N{1'bx}};\r\n\t\r\n\t\r\n\tinitial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin\r\n\t\t@(posedge clk) reset <= 1;\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\tpredict_valid <= 1;\r\n\t\ttrain_mispredicted_r <= 1;\r\n\t\ttrain_history_r <= 7'h7f;\r\n\t\ttrain_pc_r <= 7'h4;\r\n\t\ttrain_taken_r <= 1;\r\n\t\ttrain_valid <= 1;\r\n\t\tpredict_valid <= 1;\r\n\t\tpredict_pc_r <= 4;\r\n\t\r\n\t\twavedrom_start(\"Asynchronous reset\");\r\n\t\t\treset_test(1); // Test for asynchronous reset\r\n\t\twavedrom_stop();\r\n\t\t@(posedge clk) reset <= 1;\r\n\t\tpredict_valid <= 0;\r\n\r\n\t\twavedrom_start(\"Training entries (pc = 0xa, history = 0 and 2)\");\r\n\t\tpredict_pc_r <= 7'ha;\r\n\t\tpredict_valid <= 1;\r\n\r\n\t\ttrain_history_r <= 7'h0;\r\n\t\ttrain_pc_r <= 7'ha;\r\n\t\ttrain_taken_r <= 1;\r\n\t\ttrain_valid <= 0;\r\n\t\ttrain_mispredicted_r <= 0;\r\n\t\t\r\n\t\t@(negedge clk) reset <= 0;\r\n\t\t@(posedge clk) train_valid <= 1;\r\n\t\t@(posedge clk) train_history_r <= 7'h2;\r\n\t\t@(posedge clk) train_valid <= 0;\r\n\r\n\t\trepeat(4) @(posedge clk);\r\n\t\ttrain_history_r <= 7'h0;\r\n\t\ttrain_taken_r <= 0;\r\n\t\ttrain_valid <= 1;\r\n\t\t@(posedge clk) train_valid <= 0;\r\n\t\t\r\n\t\trepeat(8) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\t@(posedge clk);\r\n\r\n\t\twavedrom_start(\"History register recovery on misprediction\");\r\n\t\treset <= 1;\r\n\t\tpredict_pc_r <= 7'ha;\r\n\t\tpredict_valid <= 1;\r\n\r\n\t\ttrain_history_r <= 7'h0;\r\n\t\ttrain_pc_r <= 7'ha;\r\n\t\ttrain_taken_r <= 1;\r\n\t\ttrain_valid <= 0;\r\n\t\ttrain_mispredicted_r <= 1;\r\n\t\t\r\n\t\t@(negedge clk) reset <= 0;\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) train_valid <= 1;\r\n\t\t@(posedge clk) train_valid <= 0;\r\n\t\t@(posedge clk) train_valid <= 1;\r\n\t\ttrain_history_r <= 7'h10;\r\n\t\ttrain_taken_r <= 0;\r\n\t\t@(posedge clk) train_valid <= 0;\r\n\r\n\t\trepeat(4) @(posedge clk);\r\n\t\ttrain_history_r <= 7'h0;\r\n\t\ttrain_taken_r <= 0;\r\n\t\ttrain_valid <= 1;\r\n\t\t@(posedge clk) train_valid <= 0;\r\n\t\t@(posedge clk) train_valid <= 1;\r\n\t\ttrain_history_r <= 7'h20;\r\n\t\t@(posedge clk) train_valid <= 0;\r\n\t\t\r\n\t\trepeat(3) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\r\n\t\trepeat(1000) @(posedge clk,negedge clk) begin\r\n\t\t\t{predict_valid, predict_pc_r, train_pc_r, train_taken_r, train_valid} <= {$urandom};\r\n\t\t\ttrain_history_r <= $urandom;\r\n\t\t\ttrain_mispredicted_r <= !($urandom_range(0,31));\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend end\r\n\t\r\n\t\r\nendmodule\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n\r\n  input predict_valid,\r\n  input [6:0] predict_pc,\r\n  output predict_taken,\r\n  output [6:0] predict_history,\r\n\r\n  input train_valid,\r\n  input train_taken,\r\n  input train_mispredicted,\r\n  input [6:0] train_history,\r\n  input [6:0] train_pc\r\n);\r\n\r\n  parameter n = 7;\r\n  logic [1:0] pht [2**n-1:0];\r\n\r\n  parameter [1:0] SNT = 0, LNT = 1, LT = 2, ST = 3;\r\n\r\n  logic [n-1:0] predict_history_r;\r\n  wire [n-1:0] predict_index = predict_history_r ^ predict_pc;\r\n  wire [n-1:0] train_index = train_history ^ train_pc;\r\n\r\n  always@(posedge clk, posedge areset)\r\n    if (areset) begin\r\n      for (integer i=0; i<2**n; i=i+1)\r\n        pht[i] = LNT;\r\n      predict_history_r = 0;\r\n        end  else begin\r\n      if (predict_valid)\r\n        predict_history_r <= {predict_history_r, predict_taken};\r\n      if(train_valid) begin\r\n        if(pht[train_index] < 3 && train_taken)\r\n          pht[train_index] <= pht[train_index] + 1;\r\n        else if(pht[train_index] > 0 && !train_taken)\r\n          pht[train_index] <= pht[train_index] - 1;\r\n        if (train_mispredicted)\r\n          predict_history_r <= {train_history, train_taken};\r\n      end\r\n    end\r\n\r\n  assign predict_taken = predict_valid ? pht[predict_index][1] : 1'bx;\r\n  assign predict_history = predict_valid ? predict_history_r : {n{1'bx}};\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_predict_valid; wire drive_predict_valid; assign #0.1 drive_predict_valid=raw_predict_valid;\nwire [6:0] raw_predict_pc; wire [6:0] drive_predict_pc; assign #0.1 drive_predict_pc=raw_predict_pc;\nwire raw_train_valid; wire drive_train_valid; assign #0.1 drive_train_valid=raw_train_valid;\nwire raw_train_taken; wire drive_train_taken; assign #0.1 drive_train_taken=raw_train_taken;\nwire raw_train_mispredicted; wire drive_train_mispredicted; assign #0.1 drive_train_mispredicted=raw_train_mispredicted;\nwire [6:0] raw_train_history; wire [6:0] drive_train_history; assign #0.1 drive_train_history=raw_train_history;\nwire [6:0] raw_train_pc; wire [6:0] drive_train_pc; assign #0.1 drive_train_pc=raw_train_pc;\nwire gold_predict_taken, dut_predict_taken, raw_dut_predict_taken; reg seen_predict_taken='0;\nwire [6:0] gold_predict_history, dut_predict_history, raw_dut_predict_history; reg [6:0] seen_predict_history='0;\nstimulus_gen stim1(.clk(clk),.areset(raw_areset),.predict_valid(raw_predict_valid),.predict_pc(raw_predict_pc),.train_valid(raw_train_valid),.train_taken(raw_train_taken),.train_mispredicted(raw_train_mispredicted),.train_history(raw_train_history),.train_pc(raw_train_pc),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable(),.wavedrom_hide_after_time());\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.predict_valid(drive_predict_valid),.predict_pc(drive_predict_pc),.predict_taken(gold_predict_taken),.predict_history(gold_predict_history),.train_valid(drive_train_valid),.train_taken(drive_train_taken),.train_mispredicted(drive_train_mispredicted),.train_history(drive_train_history),.train_pc(drive_train_pc));\nTopModule dut(.clk(clk),.areset(drive_areset),.predict_valid(drive_predict_valid),.predict_pc(drive_predict_pc),.predict_taken(raw_dut_predict_taken),.predict_history(raw_dut_predict_history),.train_valid(drive_train_valid),.train_taken(drive_train_taken),.train_mispredicted(drive_train_mispredicted),.train_history(drive_train_history),.train_pc(drive_train_pc));\nassign dut_predict_taken=raw_dut_predict_taken;\nassign dut_predict_history=raw_dut_predict_history;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_predict_taken === 1'b0 || gold_predict_taken === 1'b1) begin\nknown=1; seen_predict_taken=1'b1;\nif(dut_predict_taken !== gold_predict_taken) bad=1;\nend end\nfor(integer b=0;b<7;b=b+1) begin\nif(gold_predict_history[b] === 1'b0 || gold_predict_history[b] === 1'b1) begin\nknown=1; seen_predict_history[b]=1'b1;\nif(dut_predict_history[b] !== gold_predict_history[b]) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_predict_taken) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:predict_taken\");\nif((&seen_predict_history) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:predict_history\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob153_gshare_prompt.txt": "60c36ac16d574878e1bdd51557310dff32b67bac44af4ba69417e4b83c50c8c7",
        "dataset_spec-to-rtl/Prob153_gshare_ref.sv": "b0aac9a82412e50ff2e33bc356f2dc2eacda7e5c212af7bb24684be20951eedf",
        "dataset_spec-to-rtl/Prob153_gshare_test.sv": "4713cbc4048fe9bebadac20d90f85690d6ff931638b918081115073f54c491e5"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob154_fsm_ps2data": {
    "id": "verilogeval-netlist-settled-v2:Prob154_fsm_ps2data",
    "spec_sha256": "0cf87532047e8dac31a5dcc1fecc9921cfdf78c48bab91ea2cb5dd76aabc35b3",
    "checks": 3117,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic [7:0] in,\r\n\toutput logic reset\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\tinitial begin #101;\r\n\t\trepeat(200) @(negedge clk) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\t\treset <= 1'b0;\r\n\t\tin <= '0;\r\n\t\trepeat(10) @(posedge clk);\r\n\t\t\r\n\t\trepeat(200) begin\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\tin[3] <= 1'b1;\r\n\t\t\t@(posedge clk);\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk);\r\n\t\t\tin <= $random(netlist_random_seed);\r\n\t\t\t@(posedge clk);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input [7:0] in,\r\n  input reset,\r\n  output [23:0] out_bytes,\r\n  output done\r\n);\r\n\r\n  parameter BYTE1=0, BYTE2=1, BYTE3=2, DONE=3;\r\n  reg [1:0] state;\r\n  reg [1:0] next;\r\n\r\n  wire in3 = in[3];\r\n\r\n  always_comb begin\r\n    case (state)\r\n      BYTE1: next = in3 ? BYTE2 : BYTE1;\r\n      BYTE2: next = BYTE3;\r\n      BYTE3: next = DONE;\r\n      DONE: next = in3 ? BYTE2 : BYTE1;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= BYTE1;\r\n      else state <= next;\r\n  end\r\n\r\n  assign done = (state==DONE);\r\n\r\n  reg [23:0] out_bytes_r;\r\n  always @(posedge clk)\r\n    out_bytes_r <= {out_bytes_r[15:0], in};\r\n\r\n  // Implementations may vary: Allow user to do anything while the output\r\n  // doesn't have to be valid.\r\n\r\n  assign out_bytes = done ? out_bytes_r : 'x;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;\nwire [23:0] gold_out_bytes, dut_out_bytes, raw_dut_out_bytes; reg [23:0] seen_out_bytes='0;\nwire gold_done, dut_done, raw_dut_done; reg seen_done='0;\nstimulus_gen stim1(.clk(clk),.in(raw_in),.reset(raw_reset));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.out_bytes(gold_out_bytes),.done(gold_done));\nTopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.out_bytes(raw_dut_out_bytes),.done(raw_dut_done));\nassign dut_out_bytes=raw_dut_out_bytes;\nassign dut_done=raw_dut_done;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<24;b=b+1) begin\nif(gold_out_bytes[b] === 1'b0 || gold_out_bytes[b] === 1'b1) begin\nknown=1; seen_out_bytes[b]=1'b1;\nif(dut_out_bytes[b] !== gold_out_bytes[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_done === 1'b0 || gold_done === 1'b1) begin\nknown=1; seen_done=1'b1;\nif(dut_done !== gold_done) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_out_bytes) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:out_bytes\");\nif((&seen_done) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:done\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob154_fsm_ps2data_prompt.txt": "0cf87532047e8dac31a5dcc1fecc9921cfdf78c48bab91ea2cb5dd76aabc35b3",
        "dataset_spec-to-rtl/Prob154_fsm_ps2data_ref.sv": "4d1c19d4c94c715078430fdac72f96c99a134f41fc92eb300c038ac9c1a89a11",
        "dataset_spec-to-rtl/Prob154_fsm_ps2data_test.sv": "721edf44c00d01e09fec26126668146696663ee5bd67a3400e25210a682ece98"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob155_lemmings4": {
    "id": "verilogeval-netlist-settled-v2:Prob155_lemmings4",
    "spec_sha256": "8822a51c756865104b84789200325aec1d488785125df5a7890deb7c82446589",
    "checks": 2005,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput clk,\r\n\toutput logic areset,\r\n\toutput logic bump_left,\r\n\toutput logic bump_right,\r\n\toutput logic dig,\r\n\toutput logic ground,\r\n\toutput reg[511:0] wavedrom_title,\r\n\toutput reg wavedrom_enable,\r\n\tinput tb_match\r\n);\ninteger netlist_random_seed=1;\n\r\n\r\n\treg reset;\r\n\tassign areset = reset;\r\n\r\n\ttask reset_test(input async=0);\r\n\t\tbit arfail, srfail, datafail;\r\n\t\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk) reset <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\r\n\t\t@(negedge clk) begin datafail = !tb_match ; reset <= 1; end\r\n\t\t@(posedge clk) arfail = !tb_match;\r\n\t\t@(posedge clk) begin\r\n\t\t\tsrfail = !tb_match;\r\n\t\t\treset <= 0;\r\n\t\tend\r\n\t\tif (srfail)\r\n\t\t\t$display(\"Hint: Your reset doesn't seem to be working.\");\r\n\t\telse if (arfail && (async || !datafail))\r\n\t\t\t$display(\"Hint: Your reset should be %0s, but doesn't appear to be.\", async ? \"asynchronous\" : \"synchronous\");\r\n\t\t// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely\r\n\t\t// a functionality error than the reset being implemented asynchronously.\r\n\t\r\n\tendtask\r\n\r\n\r\n// Add two ports to module stimulus_gen:\r\n//    output [511:0] wavedrom_title\r\n//    output reg wavedrom_enable\r\n\r\n\ttask wavedrom_start(input[511:0] title = \"\");\r\n\tendtask\r\n\t\r\n\ttask wavedrom_stop;\r\n\t\t#1;\r\n\tendtask\t\r\n\r\n\r\n\r\n\tinitial begin #101;\r\n\t\treset <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\r\n\t\trepeat(2) @(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 3;\r\n\t\t@(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\r\n\t\t@(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 10;\r\n\t\t@(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\r\n\t\t@(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 3;\r\n\t\t@(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\r\n\t\trepeat(4) @(posedge clk);\r\n\t\t\r\n\t\t{bump_left, bump_right, ground, dig} <= 0;\t\t// Fall\r\n\t\trepeat(20) @(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Survive\r\n\t\trepeat(1) @(posedge clk);\r\n\r\n\t\t{bump_left, bump_right, ground, dig} <= 0;\t\t// Fall\r\n\t\trepeat(21) @(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Splat after falling left\r\n\t\trepeat(20) @(posedge clk) begin\r\n\t\t\t{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);\t// See if it's handled correctly.\r\n\t\t\tground <= |($random(netlist_random_seed) & 7);\r\n\t\tend\r\n\t\t\t\r\n\r\n\t\treset <= 1;\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Normal\r\n\t\t@(posedge clk)\r\n\t\treset <= 0;\t\t// Resurrect.\r\n\t\tbump_left <= 1;\r\n\t\trepeat(5) @(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 0;\t\t// Fall\r\n\t\trepeat(21) @(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Splat after falling right\r\n\t\trepeat(20) @(posedge clk) begin\r\n\t\t\t{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);\t// See if it's handled correctly.\r\n\t\t\tground <= |($random(netlist_random_seed) & 7);\r\n\t\tend\r\n\r\n\t\treset <= 1;\r\n\t\t@(posedge clk)\r\n\t\treset <= 0;\t\t// Resurrect.\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Normal\r\n\t\twavedrom_start(\"Splat?\");\r\n\t\t@(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 0;\t\t// Fall\r\n\t\trepeat(24) @(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Splat? (24-cycles)\r\n\t\trepeat(2) @(posedge clk);\r\n\t\twavedrom_stop();\r\n\t\t\r\n\t\treset <= 1;\r\n\t\t@(posedge clk)\r\n\t\treset <= 0;\t\t// Resurrect.\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Normal\r\n\t\t@(posedge clk);\r\n\t\t@(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 0;\t\t// Fall\r\n\t\trepeat(35) @(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Splat? (Test for 5-bit non-saturating counter)\r\n\t\trepeat(2) @(posedge clk);\r\n\t\trepeat(20) @(posedge clk) begin\r\n\t\t\t{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);\t// See if it's handled correctly.\r\n\t\t\tground <= |($random(netlist_random_seed) & 7);\r\n\t\tend\t\t\r\n\r\n\t\treset <= 1;\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Normal\r\n\t\t@(posedge clk);\r\n\t\treset <= 0;\t\t// Resurrect.\r\n\t\t@(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 0;\t\t// Fall\r\n\t\trepeat(67) @(posedge clk);\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Splat? (Test for 6-bit non-saturating counter)\r\n\t\trepeat(20) @(posedge clk) begin\r\n\t\t\t{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);\t// See if it's handled correctly.\r\n\t\t\tground <= |($random(netlist_random_seed) & 7);\r\n\t\tend\r\n\t\t\r\n\t\treset <= 1;\r\n\t\t{bump_left, bump_right, ground, dig} <= 2;\t\t// Normal\r\n\t\t@(posedge clk)\r\n\t\treset <= 0;\t\t// Resurrect.\r\n\t\t\r\n\t\t\r\n\t\trepeat(400) @(posedge clk, negedge clk) begin\r\n\t\t\t{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);\r\n\t\t\tground <= |($random(netlist_random_seed) & 7);\r\n\t\t\treset <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input clk,\r\n  input areset,\r\n  input bump_left,\r\n  input bump_right,\r\n  input ground,\r\n  input dig,\r\n  output walk_left,\r\n  output walk_right,\r\n  output aaah,\r\n  output digging\r\n);\r\n\r\n  parameter WL=0, WR=1, FALLL=2, FALLR=3, DIGL=4, DIGR=5, DEAD=6;\r\n  reg [2:0] state;\r\n  reg [2:0] next;\r\n\r\n  reg [4:0] fall_counter;\r\n\r\n  always_comb begin\r\n    case (state)\r\n      WL: if (!ground) next = FALLL;\r\n        else if (dig) next = DIGL;\r\n        else if (bump_left) next = WR;\r\n        else next = WL;\r\n      WR:\r\n        if (!ground) next = FALLR;\r\n        else if (dig) next = DIGR;\r\n        else if (bump_right) next = WL;\r\n        else next = WR;\r\n      FALLL: next = ground ? (fall_counter >= 20 ? DEAD : WL) : FALLL;\r\n      FALLR: next = ground ? (fall_counter >= 20 ? DEAD : WR) : FALLR;\r\n      DIGL: next = ground ? DIGL : FALLL;\r\n      DIGR: next = ground ? DIGR : FALLR;\r\n      DEAD: next = DEAD;\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk, posedge areset) begin\r\n    if (areset) state <= WL;\r\n      else state <= next;\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (state == FALLL || state == FALLR) begin\r\n      if (fall_counter < 20)\r\n        fall_counter <= fall_counter + 1'b1;\r\n    end\r\n    else\r\n      fall_counter <= 0;\r\n  end\r\n\r\n  assign walk_left = (state==WL);\r\n  assign walk_right = (state==WR);\r\n  assign aaah = (state == FALLL) || (state == FALLR);\r\n  assign digging = (state == DIGL) || (state == DIGR);\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;\nwire raw_bump_left; wire drive_bump_left; assign #0.1 drive_bump_left=raw_bump_left;\nwire raw_bump_right; wire drive_bump_right; assign #0.1 drive_bump_right=raw_bump_right;\nwire raw_ground; wire drive_ground; assign #0.1 drive_ground=raw_ground;\nwire raw_dig; wire drive_dig; assign #0.1 drive_dig=raw_dig;\nwire gold_walk_left, dut_walk_left, raw_dut_walk_left; reg seen_walk_left='0;\nwire gold_walk_right, dut_walk_right, raw_dut_walk_right; reg seen_walk_right='0;\nwire gold_aaah, dut_aaah, raw_dut_aaah; reg seen_aaah='0;\nwire gold_digging, dut_digging, raw_dut_digging; reg seen_digging='0;\nstimulus_gen stim1(.clk(clk),.areset(raw_areset),.bump_left(raw_bump_left),.bump_right(raw_bump_right),.dig(raw_dig),.ground(raw_ground),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));\noracle_RefModule gold(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.dig(drive_dig),.walk_left(gold_walk_left),.walk_right(gold_walk_right),.aaah(gold_aaah),.digging(gold_digging));\nTopModule dut(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.dig(drive_dig),.walk_left(raw_dut_walk_left),.walk_right(raw_dut_walk_right),.aaah(raw_dut_aaah),.digging(raw_dut_digging));\nassign dut_walk_left=raw_dut_walk_left;\nassign dut_walk_right=raw_dut_walk_right;\nassign dut_aaah=raw_dut_aaah;\nassign dut_digging=raw_dut_digging;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_walk_left === 1'b0 || gold_walk_left === 1'b1) begin\nknown=1; seen_walk_left=1'b1;\nif(dut_walk_left !== gold_walk_left) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_walk_right === 1'b0 || gold_walk_right === 1'b1) begin\nknown=1; seen_walk_right=1'b1;\nif(dut_walk_right !== gold_walk_right) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_aaah === 1'b0 || gold_aaah === 1'b1) begin\nknown=1; seen_aaah=1'b1;\nif(dut_aaah !== gold_aaah) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_digging === 1'b0 || gold_digging === 1'b1) begin\nknown=1; seen_digging=1'b1;\nif(dut_digging !== gold_digging) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_walk_left) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:walk_left\");\nif((&seen_walk_right) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:walk_right\");\nif((&seen_aaah) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:aaah\");\nif((&seen_digging) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:digging\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob155_lemmings4_prompt.txt": "8822a51c756865104b84789200325aec1d488785125df5a7890deb7c82446589",
        "dataset_spec-to-rtl/Prob155_lemmings4_ref.sv": "c792dc1b56136f5265d1740efbbe3f08c91400c72823c52e396eecc6fbf509fb",
        "dataset_spec-to-rtl/Prob155_lemmings4_test.sv": "c2fbcb8e8c24070850a2c9fac117bc5fd45e38a8ee04b5ffb8db42d74aa229ac"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  },
  "Prob156_review2015_fancytimer": {
    "id": "verilogeval-netlist-settled-v2:Prob156_review2015_fancytimer",
    "spec_sha256": "3870d3336c89d1c5dacb2f57b36e892bcc551e6c62e6825e99b97f961a20122f",
    "checks": 470889,
    "testbench": "`timescale 1ns/1ps\r\n`define OK 12\r\n`define INCORRECT 13\r\n`default_nettype none\r\n\r\n\r\nmodule stimulus_gen (\r\n\tinput wire clk,\r\n\toutput reg reset,\r\n\toutput reg data, \r\n\toutput reg ack,\r\n\tinput wire tb_match,\r\n\tinput wire counting_dut\r\n);\ninteger netlist_random_seed=1;\n\r\n\tbit failed = 0;\r\n\tint counting_cycles = 0;\r\n\t\r\n\talways @(posedge clk, negedge clk)\r\n\t\tif (!tb_match) \r\n\t\t\tfailed <= 1;\r\n\t\t\t\r\n\talways @(posedge clk)\r\n\t\tif (counting_dut)\r\n\t\t\tcounting_cycles++;\r\n\t\r\n\tinitial begin #101;\r\n\r\n\t\t@(posedge clk);\r\n\t\tfailed <= 0;\r\n\t\treset <= 1;\r\n\t\tdata <= 0;\r\n\t\tack <= 1'bx;\r\n\t\t@(posedge clk) \r\n\t\t\tdata <= 1;\r\n\t\t\treset <= 0;\r\n\t\t@(posedge clk) data <= 0;\r\n\t\t@(posedge clk) data <= 0;\r\n\t\t@(posedge clk) data <= 1;\r\n\t\t@(posedge clk) data <= 1;\r\n\t\t@(posedge clk) data <= 0;\r\n\t\t@(posedge clk) data <= 1;\r\n\t\t@(posedge clk) data <= 0;\r\n\t\t@(posedge clk) data <= 0;\r\n\t\t@(posedge clk) data <= 0;\r\n\t\t@(posedge clk) data <= 1;\r\n\t\t@(posedge clk);\r\n\t\t\tdata <= 1'bx;\r\n\t\trepeat(2000) @(posedge clk);\r\n\t\t\tack <= 1'b0;\r\n\t\trepeat(3) @(posedge clk);\r\n\t\t\tack <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\t\tack <= 1'b0;\r\n\t\t\tdata <= 1'b1;\r\n\t\tif (counting_cycles != 2000)\r\n\t\t\t$display(\"Hint: The first test case should count for 2000 cycles. Your circuit counted %0d\", counting_cycles);\r\n\t\tcounting_cycles <= 0;\r\n\t\t@(posedge clk);\r\n\t\t\tack <= 1'bx;\r\n\t\t\tdata <= 1'b1;\r\n\t\t@(posedge clk);\r\n\t\t\tdata <= 1'b0;\r\n\t\t@(posedge clk);\r\n\t\t\tdata <= 1'b1;\r\n\t\t@(posedge clk);\tdata <= 1'b1;\r\n\t\t@(posedge clk);\tdata <= 1'b1;\r\n\t\t@(posedge clk);\tdata <= 1'b1;\r\n\t\t@(posedge clk);\tdata <= 1'b0;\r\n\t\trepeat(14800) @(posedge clk);\r\n\t\tack <= 1'b0;\r\n\t\trepeat(400) @(posedge clk);\r\n\r\n\t\tif (counting_cycles != 15000)\r\n\t\t\t$display(\"Hint: The second test case should count for 15000 cycles. Your circuit counted %0d\", counting_cycles);\r\n\t\tcounting_cycles <= 0;\r\n\r\n\t\tif (failed)\r\n\t\t\t$display(\"Hint: Your FSM didn't pass the sample timing diagram posted with the problem statement. Perhaps try debugging that?\");\r\n\t\t\r\n\t\t\r\n\t\r\n\t\trepeat(1000) @(posedge clk, negedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 8191);\r\n\t\t\tdata <= $random(netlist_random_seed);\r\n\t\t\tack <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\t\trepeat(100000) @(posedge clk) begin\r\n\t\t\treset <= !($random(netlist_random_seed) & 8191);\r\n\t\t\tdata <= $random(netlist_random_seed);\r\n\t\t\tack <= !($random(netlist_random_seed) & 31);\r\n\t\tend\r\n\r\n\t\t#1 $finish;\r\n\tend\r\n\t\r\nendmodule\r\n\n`default_nettype wire\n`timescale 1ns/1ps\n\r\nmodule oracle_RefModule (\r\n  input wire clk,\r\n  input wire reset,\r\n  input wire data,\r\n  output wire [3:0] count,\r\n  output reg counting,\r\n  output reg done,\r\n  input wire ack\r\n);\r\n\r\n  typedef enum logic[3:0] {\r\n    S, S1, S11, S110, B0, B1, B2, B3, Count, Wait\r\n  } States;\r\n\r\n  States state, next;\r\n\r\n  reg shift_ena;\r\n  reg [9:0] fcount;\r\n  reg [3:0] scount;\r\n  wire done_counting = (scount == 0) && (fcount == 999);\r\n\r\n  always_comb begin\r\n    case (state)\r\n      S: next = States'(data ? S1: S);\r\n      S1: next = States'(data ? S11: S);\r\n      S11: next = States'(data ? S11 : S110);\r\n      S110: next = States'(data ? B0 : S);\r\n      B0: next = B1;\r\n      B1: next = B2;\r\n      B2: next = B3;\r\n      B3: next = Count;\r\n      Count: next = States'(done_counting ? Wait : Count);\r\n      Wait: next = States'(ack ? S : Wait);\r\n      default: next = States'(4'bx);\r\n    endcase\r\n  end\r\n\r\n  always @(posedge clk) begin\r\n    if (reset) state <= S;\r\n    else state <= next;\r\n  end\r\n\r\n  always_comb begin\r\n    shift_ena = 0; counting = 0; done = 0;\r\n    if (state == B0 || state == B1 || state == B2 || state == B3)\r\n      shift_ena = 1;\r\n    if (state == Count)\r\n      counting = 1;\r\n    if (state == Wait)\r\n      done = 1;\r\n\r\n    if (|state === 1'bx) begin\r\n      {shift_ena, counting, done} = 'x;\r\n    end\r\n  end\r\n\r\n  // Shift register\r\n  always @(posedge clk) begin\r\n    if (shift_ena)\r\n      scount <= {scount[2:0], data};\r\n    else if (counting && fcount == 999)\r\n      scount <= scount - 1'b1;\r\n  end\r\n\r\n  // Fast counter\r\n  always @(posedge clk)\r\n    if (!counting)\r\n      fcount <= 10'h0;\r\n    else if (fcount == 999)\r\n      fcount <= 10'h0;\r\n    else\r\n      fcount <= fcount + 1'b1;\r\n\r\n  assign count = counting ? scount : 'x;\r\n\r\nendmodule\r\n\r\n\n`timescale 1ns/1ps\nmodule netlist_tb;\nreg clk=0; integer checks=0, mismatches=0; bit started=0;\nwire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;\nwire raw_data; wire drive_data; assign #0.1 drive_data=raw_data;\nwire raw_ack; wire drive_ack; assign #0.1 drive_ack=raw_ack;\nwire [3:0] gold_count, dut_count, raw_dut_count; reg [3:0] seen_count='0;\nwire gold_counting, dut_counting, raw_dut_counting; reg seen_counting='0;\nwire gold_done, dut_done, raw_dut_done; reg seen_done='0;\nstimulus_gen stim1(.clk(clk),.reset(raw_reset),.data(raw_data),.ack(raw_ack),.tb_match(1'b1),.counting_dut(gold_counting));\noracle_RefModule gold(.clk(clk),.reset(drive_reset),.data(drive_data),.count(gold_count),.counting(gold_counting),.done(gold_done),.ack(drive_ack));\nTopModule dut(.clk(clk),.reset(drive_reset),.data(drive_data),.count(raw_dut_count),.counting(raw_dut_counting),.done(raw_dut_done),.ack(drive_ack));\nassign dut_count=raw_dut_count;\nassign dut_counting=raw_dut_counting;\nassign dut_done=raw_dut_done;\ninitial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,\"GSR_STARTUP_INVALID\"); started=1; forever #5 clk=~clk; end\ntask sample;\nbit known, bad;\nbegin known=0; bad=0;\nfor(integer b=0;b<4;b=b+1) begin\nif(gold_count[b] === 1'b0 || gold_count[b] === 1'b1) begin\nknown=1; seen_count[b]=1'b1;\nif(dut_count[b] !== gold_count[b]) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_counting === 1'b0 || gold_counting === 1'b1) begin\nknown=1; seen_counting=1'b1;\nif(dut_counting !== gold_counting) bad=1;\nend end\nfor(integer b=0;b<1;b=b+1) begin\nif(gold_done === 1'b0 || gold_done === 1'b1) begin\nknown=1; seen_done=1'b1;\nif(dut_done !== gold_done) bad=1;\nend end\nif(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end\nend endtask\nalways @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end\ninitial begin #10000101; $fatal(1,\"NETLIST_STIMULUS_TIMEOUT\"); end\nfinal begin\nif((&seen_count) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:count\");\nif((&seen_counting) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:counting\");\nif((&seen_done) !== 1'b1) $error(\"NETLIST_OUTPUT_UNOBSERVED:done\");\n$display(\"PHASE1_COMPLETE checks=%0d mismatches=%0d\",checks,mismatches);\nend\nendmodule\n",
    "provenance": {
      "kind": "verilogeval-netlist-settled-v2",
      "assets": {
        "dataset_spec-to-rtl/Prob156_review2015_fancytimer_prompt.txt": "3870d3336c89d1c5dacb2f57b36e892bcc551e6c62e6825e99b97f961a20122f",
        "dataset_spec-to-rtl/Prob156_review2015_fancytimer_ref.sv": "69bd8392f3fb7f0e3334dd70c260fb8df551362b3ce0cc581b9e1a1fd227ac6b",
        "dataset_spec-to-rtl/Prob156_review2015_fancytimer_test.sv": "5b0cf5cbff2daabb929cd3cc0f5c241627c40a1bd581f2eb61290ff96f8243ba"
      },
      "unknown_reference_bits": "masked; each output bit must be known at least once",
      "startup_ns": 101,
      "data_delay_ns": 0.1,
      "sample_offsets_ns": [
        0.5,
        4.8
      ],
      "stimulus_feedback": "reference_only",
      "seed": 1,
      "undelayed_control_ports": [
        "clk"
      ],
      "negative_control": "inversion"
    }
  }
}

/** External read-only calibration evidence; not model scores. */
export const netlistCalibrationEvidence = {
  "Prob001_zero": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "9a225bcdf71bada0781b228c7368762aedf76263b31079289748c787425973be",
    "positive": {
      "status": "PASS",
      "checks": 39,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob001_zero\\positive\\acceptance.json",
      "sha256": "50f1c053e8485f5887baf2b582cb523c906da9e123851d2ceaeadc3edf386e82"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 39,
      "mismatches": 39,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob001_zero\\negative\\acceptance.json",
      "sha256": "01d8d5bfd5c1934adbf9165fdc17196d78ee5b16136ca9848686fc3592cfca53"
    },
    "superseded": [],
    "control_source_sha256": "5dbed6776700bccc9ee61cc6764205abbc223eca6aaf55e59605e1516770703a",
    "netlist_sha256": "0e7609030b6c6760545f2386bf0573b028c774026442531afe7258ed460314b0"
  },
  "Prob002_m2014_q4i": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "cd385972204eaf31cf8f9764d4fbe3b6563568a22607a74eddd3507930d57488",
    "positive": {
      "status": "PASS",
      "checks": 199,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob002_m2014_q4i\\positive\\acceptance.json",
      "sha256": "3658b9050dc2c8988f52718dcdc71abbabc6c02d01be165544bd51fea3b53ed3"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 199,
      "mismatches": 199,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob002_m2014_q4i\\negative\\acceptance.json",
      "sha256": "ebced6d6456d16668c47945d946d1b8f7180ccd7fdfe59560a75356a1db69d50"
    },
    "superseded": [],
    "control_source_sha256": "ae50946d1e5797b88a684f9a079da0d65eaf3575d9f7ae7d85096ee6d68c810c",
    "netlist_sha256": "005abaa7bf7f1753ef0002728f1b1ab22e3f4b7061f97d65a151e3521a99dcfc"
  },
  "Prob003_step_one": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "bd68e036eae93e535bde2c6358ee1d97381fb3b3a98c6fdae40f118fee09ea8c",
    "positive": {
      "status": "PASS",
      "checks": 39,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob003_step_one\\positive\\acceptance.json",
      "sha256": "4614575f0af7e50d6f9321f5163e203617cc742ea20f3db42c412490706f1f32"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 39,
      "mismatches": 39,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob003_step_one\\negative\\acceptance.json",
      "sha256": "efaa471424cb8ae22eae89a81947a4b81279fbc1a0581c478087e2a0ca4e3237"
    },
    "superseded": [],
    "control_source_sha256": "69b4284a2c3b1bfa015caec141255bf65df0ec78235aece50382711311dbe262",
    "netlist_sha256": "9972c1819ab4f8fb863cda254891e22d403017858e8776de7906fb2bb5a994aa"
  },
  "Prob004_vector2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\probe-v7",
    "profile_sha256": "3b6a86e7a16207dbedaa603977830c3aa28953f8fa42cfe068232178076b4020",
    "positive": {
      "status": "PASS",
      "checks": 218,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob004_vector2\\positive\\acceptance.json",
      "sha256": "f6d6d5209960bd215f295b26f1c511307c62886727d8de08bf4a7ff80413a9c1"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 218,
      "mismatches": 218,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob004_vector2\\negative\\acceptance.json",
      "sha256": "d81636d0a5c10c601452ffe443bf1431ed8aad3453c381409135a16edbae3a1f"
    },
    "superseded": [],
    "control_source_sha256": "cd81fce21c2fc2015289d48f0b88e0952c82dd2a44c9a9ccebf5e7e727f56273",
    "netlist_sha256": "77846ee29457d7f89f95484761be532b13ec5a69704c440b9b2c89370575aaba"
  },
  "Prob006_vectorr": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "a8ddd7f89e7bd67418b4c2ae96f429b74ee568474f70b2cfd13d70668511571d",
    "positive": {
      "status": "PASS",
      "checks": 434,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob006_vectorr\\positive\\acceptance.json",
      "sha256": "5db0bfa5b27423b3ce0a12c4a4fa8b1c2815f7509e291fbb7d9e842733542c41"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 434,
      "mismatches": 434,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob006_vectorr\\negative\\acceptance.json",
      "sha256": "864ef16040122f308f1471f87c127c86766070b3a16730263da674e48a4201aa"
    },
    "superseded": [],
    "control_source_sha256": "ec09253fd81834a7aa8b901aecd3151ce753baf969487786362923d322099c22",
    "netlist_sha256": "9416b5e36f2d2fdd6460f879c25591ea4e2557182589369b74cf8e03d81d1d40"
  },
  "Prob008_m2014_q4h": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "a41f1089891856401e5f6c89a559346694808943df57e21bc69324a96eba1d46",
    "positive": {
      "status": "PASS",
      "checks": 199,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob008_m2014_q4h\\positive\\acceptance.json",
      "sha256": "8e3f785af75ba414be4eb298f64ab7b3ed6c2b7310ab98bbab023a3a9d81b6dc"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 199,
      "mismatches": 199,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob008_m2014_q4h\\negative\\acceptance.json",
      "sha256": "2c48295e05cdefabde377d6b443f97bbadfd8e0b4d6bfb4831d4b9e82259a98f"
    },
    "superseded": [],
    "control_source_sha256": "a6db331d6c6263053240a595e3e0a44c4135eb988ed75387dcc9c860700cb65f",
    "netlist_sha256": "59d3ba230a1b88f04ede1b4cf736002585a69add4478a60606bdca940143f6a5"
  },
  "Prob009_popcount3": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "45f4964cd0401349c9bfb25247ff4b564cb5f84b9ddd80ec60acbf8dbf49febf",
    "positive": {
      "status": "PASS",
      "checks": 438,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob009_popcount3\\positive\\acceptance.json",
      "sha256": "f0cfa314da93bf8d28a5e748bd08239d4096a6c22fb50afd329f0c3651f4878a"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 438,
      "mismatches": 438,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob009_popcount3\\negative\\acceptance.json",
      "sha256": "9715a73a6bd3c8336790ce92ebff6a957058aa13bce2a7f5a19243642cb70b56"
    },
    "superseded": [],
    "control_source_sha256": "84f7d90fd1d7727f47ccca6bc832392abdde7be7eab22800c2525195fc9b21a8",
    "netlist_sha256": "11793e6ffaae0801f703f3f5e3d7177f88b69f1d74bc92cfb04a5e043eef3389"
  },
  "Prob010_mt2015_q4a": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "996f1961af9e1fbc327531f00890763a0cae40d8a58743b917e7ebcce5612fb0",
    "positive": {
      "status": "PASS",
      "checks": 403,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob010_mt2015_q4a\\positive\\acceptance.json",
      "sha256": "bbee558e641c63ba4a7c3261cd54f529791b0a67753e942057372a23ccb35431"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 403,
      "mismatches": 403,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob010_mt2015_q4a\\negative\\acceptance.json",
      "sha256": "0f33503fa33c27ef18162f888c1784f5158f41456239152cc6e208faa7a49a35"
    },
    "superseded": [],
    "control_source_sha256": "0621ded1cd039423475133d4e4a4f9c5bb3def6fff39f70f53c36f51a90bf576",
    "netlist_sha256": "944d5170f715f2c0f5a170a643323ffdadeda4dab43ee0861d39459d834b6112"
  },
  "Prob011_norgate": {
    "root": "D:\\AMD\\netlist-suite-20260927\\probe-v7",
    "profile_sha256": "8108464967eb1e96a435737a9e0018d04aa1f5044d4f8b3eaf9c14939fe48b67",
    "positive": {
      "status": "PASS",
      "checks": 437,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob011_norgate\\positive\\acceptance.json",
      "sha256": "e7fc1e391fbfa4451d058a05c3742ca89d8780c833303319a9b71d9ab2cb8748"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 437,
      "mismatches": 437,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob011_norgate\\negative\\acceptance.json",
      "sha256": "12bd336a3fc367885ce2172f45b58e3528cbfc5abb171a630ef77ad57c9ffe88"
    },
    "superseded": [],
    "control_source_sha256": "d25feedb930158fc2a3e0ef8054642451fde095d217f73eb148d7518b099ed9e",
    "netlist_sha256": "ce6079c910a2c1fb24bce3971dca61263e70d6d5e682f798b3595b9ff3fcf94a"
  },
  "Prob012_xnorgate": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "0420b3da48caaba30e9f437e79b56a0dd3dbca2780b6ef6df3b4cb7d0e23f262",
    "positive": {
      "status": "PASS",
      "checks": 437,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob012_xnorgate\\positive\\acceptance.json",
      "sha256": "64be0037cc2df98ab0a91080888f7cc78774796f3040b9add803e06f2d2b6a91"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 437,
      "mismatches": 437,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob012_xnorgate\\negative\\acceptance.json",
      "sha256": "8792e064c38299b6e7d08a5b28be26a4f0eccb32ebccb00e7534c80e4a667502"
    },
    "superseded": [],
    "control_source_sha256": "5fd41558ff04c00e5b068bc30a3204d0bfead3a7947a9749f3a25b06d03a9e92",
    "netlist_sha256": "0550a21efee69e31e4cb8c77869f827f7d2d264738d3af3a9b320d5660830935"
  },
  "Prob013_m2014_q4e": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "6676decea121173abc72160bcb60ed3d519c3df2d41f67ba25c23f9e1797da90",
    "positive": {
      "status": "PASS",
      "checks": 199,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob013_m2014_q4e\\positive\\acceptance.json",
      "sha256": "7f6ec736bfebd9ff83c91f2c0c3da51ae4ddd2fd33c03d0a1b04f17bd6028efd"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 199,
      "mismatches": 199,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob013_m2014_q4e\\negative\\acceptance.json",
      "sha256": "b0b92b7c702b63388a3cbf5b9d0e53865d470af42599509277698d762ada08ab"
    },
    "superseded": [],
    "control_source_sha256": "8053fafedcf5d05c53203c9ae185a24ad6265f9281784e3363f5dd3caf39b85a",
    "netlist_sha256": "85a0481c84c9a78dace3dfca7c501591389969e84cfa1cb267996cc71e4e0ad9"
  },
  "Prob014_andgate": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "0a3db83ccbe6eed3ef3c7cb49c918d551168afac35494500c1aeb5234eca9e8c",
    "positive": {
      "status": "PASS",
      "checks": 437,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob014_andgate\\positive\\acceptance.json",
      "sha256": "0135070cf77b12a4d7340d69ec32add7a6eeaeeadbf038dff43fd93b3ce61c74"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 437,
      "mismatches": 437,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob014_andgate\\negative\\acceptance.json",
      "sha256": "6359d1fd14135b0de6ae66a5e572190ea24dffd4c516b73740c0628ec99a4a59"
    },
    "superseded": [],
    "control_source_sha256": "bc054766a9e2b66d0ef9f6534212fc13ad94b4e53528aa5c06c5627a5776ef13",
    "netlist_sha256": "9cb2f259f414dddf5356e459bdab147d554374e0a5e4d0c572c1f193f211469d"
  },
  "Prob015_vector1": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "41e2585f7b2b8257de7f2b017a75440e7abee9e0d86e8bbb7f6184f3d2b49ab7",
    "positive": {
      "status": "PASS",
      "checks": 434,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob015_vector1\\positive\\acceptance.json",
      "sha256": "3b4bd0a3dd6ecb66828f68766723073cfe3c57d1f73dc56dd3f073a154befd27"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 434,
      "mismatches": 434,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob015_vector1\\negative\\acceptance.json",
      "sha256": "24897a6dd24abde75bfeee2ed61752cd0612bb58a992a930998645067337440b"
    },
    "superseded": [],
    "control_source_sha256": "7ff628f5b545941375250862d74b92e50523f226c2fc1db41283a4a8fd2229ba",
    "netlist_sha256": "a2c20b0b05f8ee20eb0d632d92f637ce27052a2ed36bb72859697f8b11d05f80"
  },
  "Prob016_m2014_q4j": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "c90ba5bcbb6039f005b60799db8e9c9c7a950c6d3cb7fa1c30d81557c2822085",
    "positive": {
      "status": "PASS",
      "checks": 199,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob016_m2014_q4j\\positive\\acceptance.json",
      "sha256": "e870e7d208da66787c5effe216bb6c2524cc8bc1b1bc9a7c6b1fff4978452b02"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 199,
      "mismatches": 199,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob016_m2014_q4j\\negative\\acceptance.json",
      "sha256": "cb5505e4e5d919ee0570ea951e7f1a5c2a75cdb14890fc1d7c27b3f7b454a635"
    },
    "superseded": [],
    "control_source_sha256": "53115dc153a2f9bffa16c49a470aeb918a8b48a45d3ff381194068059a14b4b6",
    "netlist_sha256": "2538a62ef246611b79c051d52e0961fe268aeaf28843603101acb3a053d4f475"
  },
  "Prob017_mux2to1v": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f76696df4c12b65ca2213a198d45351f865b25add1e5716449e3ba94a19f45e6",
    "positive": {
      "status": "PASS",
      "checks": 226,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob017_mux2to1v\\positive\\acceptance.json",
      "sha256": "407c96848f6bb972d143281f5b79ab4c68788f5a77f783286e808621c2d97f05"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 226,
      "mismatches": 226,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob017_mux2to1v\\negative\\acceptance.json",
      "sha256": "281b619fc2e59a3d52a6b098ae6a5e986733f0ddbe35812a8d3c3b155a28764b"
    },
    "superseded": [],
    "control_source_sha256": "7787671013efad1f18eb52eb9835d67976c1e28d2c4e43e4d0a351a569748d9c",
    "netlist_sha256": "7f9bf08eb8e25556d37811a972d6f850c62a31e679f1ccb85372349a2c38e48d"
  },
  "Prob018_mux256to1": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "d6841fb931ad37cb62a71209664b3ee98b02cb38d4a44e73a7a472f67f5f1029",
    "positive": {
      "status": "PASS",
      "checks": 3998,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob018_mux256to1\\positive\\acceptance.json",
      "sha256": "dde772d95ff5f22958c0752e7a0f934f5ae29e24304e144b26424c4b647b5eed"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 3998,
      "mismatches": 3998,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob018_mux256to1\\negative\\acceptance.json",
      "sha256": "9d8bb7696a1b07d89b8bdc7d9fe7705651ff1788b7fcbf03c609e6a5c3941e85"
    },
    "superseded": [],
    "control_source_sha256": "382f11a61c645bed46c3c708e2fcf5aa41cad9b4204c07125e352f283a14883b",
    "netlist_sha256": "f05d9aa9eee5ed4d76aa67e3885b6c98c252b243d41ef068cf9750fe8660cb1a"
  },
  "Prob019_m2014_q4f": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "a067434e0794d063e329b16254df6e9bdb1aa6e22c1d3789d45941540d7e6d74",
    "positive": {
      "status": "PASS",
      "checks": 199,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob019_m2014_q4f\\positive\\acceptance.json",
      "sha256": "44eac974f9df19e4f692694241a00b9bb95d959ced4d1afc5b4826b7c8c22f1d"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 199,
      "mismatches": 199,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob019_m2014_q4f\\negative\\acceptance.json",
      "sha256": "44b5b2601f0eb51371a46ad772c1c829d55528cc324d50df45fbe1be017c94a6"
    },
    "superseded": [],
    "control_source_sha256": "7ac3b64d9090beca302e2963d89e3850333b498d150fd71204bc91ed602c2a3f",
    "netlist_sha256": "0627416cfe6b5f16622e626d9e0635b41fb08661c680b9685e2f22a98174ffcd"
  },
  "Prob020_mt2015_eq2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "267ec23faa14c78e8752e787f2da251361adb28098eb733df9c75690f8bded85",
    "positive": {
      "status": "PASS",
      "checks": 3999,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob020_mt2015_eq2\\positive\\acceptance.json",
      "sha256": "0a7a211b128be19cb1236a2bd73222778b5784129c350fa729be94a5672cc1d3"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 3999,
      "mismatches": 3999,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob020_mt2015_eq2\\negative\\acceptance.json",
      "sha256": "0c5f57fe509ccfb503fc085681f3a9159d827c5300ef87a50d9420b7a90f6926"
    },
    "superseded": [],
    "control_source_sha256": "4018a99e840d39bcee83678d8956d196cc4eebb4871c8072258784b261fa3c89",
    "netlist_sha256": "d44a14edfda950e4531d0c3c3bd9fd09b7692f5a5ce96bea020f4d5e3baab2af"
  },
  "Prob021_mux256to1v": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "644f16d5f56e10b1391c4139feb9b1dcfcb5ca0a931aa98bea209f159b9fa3c7",
    "positive": {
      "status": "PASS",
      "checks": 3998,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob021_mux256to1v\\positive\\acceptance.json",
      "sha256": "dc669258908c1902778768627f6c34d5a3393a67df45bc2a0431260d4c6def77"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 3998,
      "mismatches": 3998,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob021_mux256to1v\\negative\\acceptance.json",
      "sha256": "411f483754e0326389149bd35a453006a318bec90f09b320cffea8efbf3d79ae"
    },
    "superseded": [],
    "control_source_sha256": "70ec15a4fe23dc5cb1698111f4222085dd7d613bfbdcdcc5b5456bcfea993b18",
    "netlist_sha256": "2867d4e3eea72d98a043c466b0c68f348260da4ff041e449424bb8fcf4b5a907"
  },
  "Prob022_mux2to1": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f6b9cb6920a99d8dbd266a09c49592c41f8da8cb81d59ad7efe62bf2549cb7fa",
    "positive": {
      "status": "PASS",
      "checks": 242,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob022_mux2to1\\positive\\acceptance.json",
      "sha256": "b67c12ed03e3f3965f53d0881c900dabacfbbdec91408cd3b9572132bd8093d9"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 242,
      "mismatches": 242,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob022_mux2to1\\negative\\acceptance.json",
      "sha256": "cd293b2ffaafea44023da856c64495b5d086260e1c96525347f40f9d98115975"
    },
    "superseded": [],
    "control_source_sha256": "6a842d4ad77eee995c97c4ea051069114a2279674e843eaa2c244587846a5009",
    "netlist_sha256": "e63b267cb173e237e8321050f696208cb8883a6bbb5328be2de9de640a6b2c7d"
  },
  "Prob023_vector100r": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "9ccefd7ab62fe3383c5e41dbcf1f423f7829e92381e5d870a087932bf03bd891",
    "positive": {
      "status": "PASS",
      "checks": 398,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob023_vector100r\\positive\\acceptance.json",
      "sha256": "e21e21830bd5642eaa06fe23d9ca1fe513a772e3dd539d9a695592880f8a83c4"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 398,
      "mismatches": 398,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob023_vector100r\\negative\\acceptance.json",
      "sha256": "d9dfd033c193e4c5b4acd569170f9070122e7dfd10243a27cd55f35bac1232ec"
    },
    "superseded": [],
    "control_source_sha256": "32773478d75fed6582d9b0bfc33c7c2ef00422757e39f3b4704278ce77e7b1be",
    "netlist_sha256": "843d3608a82a9cc2a2d822e4c32516f8ef9b381dff991971a887da84f0980d3e"
  },
  "Prob024_hadd": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "c0a65de3577c55cac46f3e708289f32c67b57bde1a95515213ad10b0d7ca8271",
    "positive": {
      "status": "PASS",
      "checks": 398,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob024_hadd\\positive\\acceptance.json",
      "sha256": "50905a92791313bd6ada64e0a3aba87dde77f50e84e8f7ef3925d118fa7cea2c"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 398,
      "mismatches": 398,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob024_hadd\\negative\\acceptance.json",
      "sha256": "83d346d26190030a7ddfb86cb69c812e11126ebb2f70052b70a2b78e2728ee3c"
    },
    "superseded": [],
    "control_source_sha256": "920eb9be6892370fe3eadc2f2c6c6572fb18b1b75111132d3a96930b375a57fc",
    "netlist_sha256": "02c8610b3f83b3f121fd7f2271ed566cdf7bfd77d0b2201ff1dd09018ccc14eb"
  },
  "Prob025_reduction": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "8291ed81d6fccae21d565d5280fdf2ebc8eb2460250ef9bd98711859b59ca942",
    "positive": {
      "status": "PASS",
      "checks": 198,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob025_reduction\\positive\\acceptance.json",
      "sha256": "98995a0073fb7fd341ea8b104581a921575342b78d0f8ed87fd16f33f7ace477"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 198,
      "mismatches": 198,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob025_reduction\\negative\\acceptance.json",
      "sha256": "f19ea6ed4549408292515ad2a599e9b0df46e5b277a50cca1ee658657403f74b"
    },
    "superseded": [],
    "control_source_sha256": "5617a887750be0169b4c90d671d65d1be6bd9220546fb2f6f0fcf58a7d634df3",
    "netlist_sha256": "d743210ad39ef0d6a9198f814d1ffccbce9141dac4a67337f1e65ca4d4d8cab3"
  },
  "Prob026_alwaysblock1": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "7e507ac7141478405cf9ae22b874ecdbe0542267d2888772d7a5df9b95b9c8c8",
    "positive": {
      "status": "PASS",
      "checks": 437,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob026_alwaysblock1\\positive\\acceptance.json",
      "sha256": "8cdd1757a002f7a7aae492f9b2dc2e749f288ba0652b85566e2a9ddba8e20d5c"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 437,
      "mismatches": 437,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob026_alwaysblock1\\negative\\acceptance.json",
      "sha256": "532a12ee696a4c8320e495936b28c2ecf356f317ae4009fca561ff23b253055a"
    },
    "superseded": [],
    "control_source_sha256": "0607017540ad7e08efb4801a45318e7ae4ae1b8250c5a646f1a4fc41a666d8ae",
    "netlist_sha256": "e088788b58ba100e3eed4923d35d10b4661966b7892bbb9fd551261ef1702984"
  },
  "Prob027_fadd": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "e29e4f9f8a0c3c973ab5a44fac92ca07950fe785af1006e175b1cd3cc707acc6",
    "positive": {
      "status": "PASS",
      "checks": 426,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob027_fadd\\positive\\acceptance.json",
      "sha256": "cc4eb91ebd32f5c403a060ea2a56aa257e97dcee5d5f1484af891a8a7a2f2590"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 426,
      "mismatches": 426,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob027_fadd\\negative\\acceptance.json",
      "sha256": "9f83cfb18477ffffb1b7a510c81d98cd95cc7396603a103d930000e9266a1b29"
    },
    "superseded": [],
    "control_source_sha256": "bc62076510350ce2abd87bf6b6206d303adcb44fa17e2460e820c9ba1e843307",
    "netlist_sha256": "db6a2aa339d38fee796f6b91caf55f894c82f60c6f804a2b1ca66eedaa9fd1f7"
  },
  "Prob028_m2014_q4a": {
    "root": "D:\\AMD\\netlist-suite-20260927\\probe-v7",
    "profile_sha256": "63f977452ea12ab9ff1fd6347c35ab482a5c8ab36cff051c3cc25ef521c2c63b",
    "positive": {
      "status": "PASS",
      "checks": 189,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob028_m2014_q4a\\positive\\acceptance.json",
      "sha256": "fe3cc198799cd04656684b2e05dcd62f550a17a740331f061944035a61caabe2"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 189,
      "mismatches": 189,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob028_m2014_q4a\\negative\\acceptance.json",
      "sha256": "2d7bfd3c3f38885e154c40b7655bddc3eddf29c9d308a0ba6397ef8dbca68e0e"
    },
    "superseded": [],
    "control_source_sha256": "23bf75cfc8b836b0e0524d0e7f4f5b422e534c1d936436a4f45cb23d73b28d3b",
    "netlist_sha256": "88c7e3e192a22cb997caa10ac0003a8dacd1593d88e2c94b32394ee368fbdc03"
  },
  "Prob029_m2014_q4g": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "a9d5e8e37e5d27960eb646284aebaa7d10dd0e73398fe4e54e55b294aa9e69b5",
    "positive": {
      "status": "PASS",
      "checks": 199,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob029_m2014_q4g\\positive\\acceptance.json",
      "sha256": "eff0c80f318c023d55354337dec00726d412444eeca6e3d10009d7fc39e7c748"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 199,
      "mismatches": 199,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob029_m2014_q4g\\negative\\acceptance.json",
      "sha256": "499bb40631e7be9749c40a21300a163df9eca7d1359b11c2780db0e1ebf86df0"
    },
    "superseded": [],
    "control_source_sha256": "90dfd4f53fae5e8db66963101737b8b674fb2972adced7ec4e788a16686a2f08",
    "netlist_sha256": "f63ef349301052b173389aa2fbc56b405e15599a57ef92ed4a63586be782720c"
  },
  "Prob030_popcount255": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "b7fd05f49fcedd608dfff3abbe259a856e9bdf5944b72bf77ba5cb34ac21e6ad",
    "positive": {
      "status": "PASS",
      "checks": 429,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob030_popcount255\\positive\\acceptance.json",
      "sha256": "2275ca23146ed02af64793195889f75a45caea61e27240cd2ae7bf5f0a72843e"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 429,
      "mismatches": 429,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob030_popcount255\\negative\\acceptance.json",
      "sha256": "8194952e977ffcc18cdb2de2babdc58924e12cb0ae9da21047dcc6923056d37c"
    },
    "superseded": [],
    "control_source_sha256": "d120c6fd21d5dba38ef9dc359b76bd1e970a1b077213ec037734a21064b25193",
    "netlist_sha256": "6a9fcd1a873cc291829d7e3e69bb43c8d081f204a9299756f82dd0267302e998"
  },
  "Prob031_dff": {
    "root": "D:\\AMD\\netlist-suite-20260927\\approved-interface-errata",
    "profile_sha256": "b163222432c8bca2f2a4faa16991adc0410fc8686cd51dd1b3f0c648320f1480",
    "positive": {
      "status": "PASS",
      "checks": 240,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\approved-interface-errata\\Prob031_dff\\positive\\acceptance.json",
      "sha256": "790573934920c09785fe575cfc9d828015472347b97c7b0c84b75622339d80bd"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 240,
      "mismatches": 240,
      "path": "D:\\AMD\\netlist-suite-20260927\\approved-interface-errata\\Prob031_dff\\negative\\acceptance.json",
      "sha256": "3a7b4a02fc08560baaf5f9b49bb78aa761368dfd40bfe59066ef1d4fd97d4178"
    },
    "superseded": [],
    "control_source_sha256": "d9cf8651067bc8b6ae006c01ec0e3138b65117c769ef5fff6d78a1c63c6d73f7",
    "netlist_sha256": "ecb1b2c4ddd74e599a60cc1e5633113a26b3bd3cb2ffee488760aa009889ff10"
  },
  "Prob032_vector0": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "419df5a7b289ee7de676675e833c0304a738dd3c19b86c40b82ee463ac9ab4af",
    "positive": {
      "status": "PASS",
      "checks": 41,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob032_vector0\\positive\\acceptance.json",
      "sha256": "f2a11e99ac46f31b1169cf390ed5196fa4dbcf06da5c87dbba596fe6a3ead837"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 41,
      "mismatches": 41,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob032_vector0\\negative\\acceptance.json",
      "sha256": "d16fa215881a1768c78166e47895e555b95cec0bf9fa92992ecdbab54b0e7e41"
    },
    "superseded": [],
    "control_source_sha256": "8effbdd6001aa74ba916783c56457ff9c49a4066b13e20d78159df5b8eef5746",
    "netlist_sha256": "7ec2647ed061323a12ac11c0287a597e6b02049d922ca0186b1f70275ed0ef7c"
  },
  "Prob033_ece241_2014_q1c": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "a8d7017bec1fc7fca057578244fd0266c257c5a930921357ed2d50a0ec318711",
    "positive": {
      "status": "PASS",
      "checks": 230,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob033_ece241_2014_q1c\\positive\\acceptance.json",
      "sha256": "6b9543a72681db0cbffdccc2b1cd86283e12d95026e36a627211bd5abf5931da"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 230,
      "mismatches": 230,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob033_ece241_2014_q1c\\negative\\acceptance.json",
      "sha256": "f484ba690efc4299164f7718d5fc76f09f772ef85b27c6493b4b45a5503f986b"
    },
    "superseded": [],
    "control_source_sha256": "2a6298c8349a893d4f68edb706bde0611d71a902d87cb6c50995ebd68e9bc410",
    "netlist_sha256": "8cbcc9960a190a7ce124653f98c9326abcc7c6cd1381da3cf21280b4630f2001"
  },
  "Prob034_dff8": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "aa827715a1058cc8e9a01fb9de6086fe5ad6671d88e7ea3c336029d1eeae7a58",
    "positive": {
      "status": "PASS",
      "checks": 81,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob034_dff8\\positive\\acceptance.json",
      "sha256": "1a1110441067c3bcd6fd2cdb5b523cd06c3b2299787e771da35956f0d87b49df"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 81,
      "mismatches": 81,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob034_dff8\\negative\\acceptance.json",
      "sha256": "e4f3c2c23fbe49ad789ba63d3232a947d5b1d9e67830a17a32230a3bbfd6398e"
    },
    "superseded": [],
    "control_source_sha256": "b720cbc02048125ec00bf6a192d11dd7475e043b7bdc098358812c74d0ff5a1f",
    "netlist_sha256": "ecc1e62e28f44baf3a4934582a3528cff8dfa4376e8a33ec557c2859d787d77b"
  },
  "Prob035_count1to10": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "4ed69e020ab82aed634953c0d412f78463992f5e1bb39fd54c8e6c896152bb68",
    "positive": {
      "status": "PASS",
      "checks": 877,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob035_count1to10\\positive\\acceptance.json",
      "sha256": "9418fb9e408c310a02886f111d5ec1b066ef9423f6714e1cac527e2a495470a5"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 877,
      "mismatches": 877,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob035_count1to10\\negative\\acceptance.json",
      "sha256": "f3b5d00bd445e3a625845dbf0062e106f54dea5debdede790396bc8f34789bbf"
    },
    "superseded": [],
    "control_source_sha256": "f7d05008454afaa09a461a5270ba6b7a52dd2048b2799f87553ade0a8f2350a5",
    "netlist_sha256": "11f3b6e6df2f5bf948dc1f36316123938db06b9a553dde44ba9c3fdd46c97c23"
  },
  "Prob036_ringer": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "6be1aed83e62b977b354499be981f1d9f640ad0ed0ae4300002d88722b808cfb",
    "positive": {
      "status": "PASS",
      "checks": 37,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob036_ringer\\positive\\acceptance.json",
      "sha256": "d98a31d557c945e25ac6c44b2849a5290101e6470217ed2d63ef023138e40c28"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 37,
      "mismatches": 37,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob036_ringer\\negative\\acceptance.json",
      "sha256": "76c0a027132cb902da675844627906792ff855875c799afd36659726a2efdec6"
    },
    "superseded": [],
    "control_source_sha256": "c2d59a7a5308125f34e91cc80060a6dee852ff3c434a8fd6ebede3b80adb5469",
    "netlist_sha256": "b85eeb1e6a635f80aeff2a9c9bd9bae22472473175fc4422e2e5a65724a27aa7"
  },
  "Prob037_review2015_count1k": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "50b9705431f266777c8fffaa1841fff1d355ee02a530ae99d82616154b633ed0",
    "positive": {
      "status": "PASS",
      "checks": 16053,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob037_review2015_count1k\\positive\\acceptance.json",
      "sha256": "3e92728953e72f59e1ba9b7c240749abdf839aa506ba5361ac8bd2049c06d2ca"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 16053,
      "mismatches": 16053,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob037_review2015_count1k\\negative\\acceptance.json",
      "sha256": "5d986fdc2a41fcdf3cadd87f420ed21359440d43313e67f7ba1e85fedf3ee252"
    },
    "superseded": [],
    "control_source_sha256": "d8145d1989cf95ecd6ca09bf162391af3a293139b40eeedfb628670c4d912834",
    "netlist_sha256": "6681fb00e5bdf8b44722a2f246ac566687a228fcc3171bb333848b19ac317212"
  },
  "Prob038_count15": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "6c5ed2ae91490bb2dcab340b13aece7f6bc84908443a0cfbe3539d84b06b336d",
    "positive": {
      "status": "PASS",
      "checks": 841,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob038_count15\\positive\\acceptance.json",
      "sha256": "4b4ef128bb76b84b0520f8777e8a175efcd7ee56575d0e4a506b801904f7fa2d"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 841,
      "mismatches": 841,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob038_count15\\negative\\acceptance.json",
      "sha256": "c027e06b85ffa3360643500b438f32ad0472e9226b2d54382f4a92150b235ae9"
    },
    "superseded": [],
    "control_source_sha256": "1e0213c9be3cc6deab5f12f63136fbe3c3b3a6d15f81760486cb28b4f09b2e2a",
    "netlist_sha256": "56fb16319c662a728a555574ef61c3b1efa7dfe9a75e6180867886361909a101"
  },
  "Prob039_always_if": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "935c929100d4acc683e4f19178429071a3d8d16810eb801c12a5dc0425b7ad89",
    "positive": {
      "status": "PASS",
      "checks": 226,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob039_always_if\\positive\\acceptance.json",
      "sha256": "09a078b1356f04cd4d1ea278923663388ea7f3de0a1ab1a5154c9be9d865919d"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 226,
      "mismatches": 226,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob039_always_if\\negative\\acceptance.json",
      "sha256": "8ec7dab9cbe890a5defd26df0076a0116b63ea42a1d69d6977b6f6b686ccaf92"
    },
    "superseded": [],
    "control_source_sha256": "233db13aba7290a53b5d9c175d825f410273468b781ebfc3ad184e12379c49af",
    "netlist_sha256": "c49ea118c354fd03bde765a6f17345fea31d8334ee5cacb2598e806fbdf697c2"
  },
  "Prob040_count10": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "29d207a917024d52d3de0787c2a727a3936e9bf6c635428e7d1229e9f6a1d4af",
    "positive": {
      "status": "PASS",
      "checks": 877,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob040_count10\\positive\\acceptance.json",
      "sha256": "00a0ac842a9ef545c5e83f451bd65845d77d5ebcf84193d30eddd2f0e7987f06"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 877,
      "mismatches": 877,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob040_count10\\negative\\acceptance.json",
      "sha256": "3ae0cd42d104d57b773f58e1503c94b4195e025d4569831b77eb3b1564ae441f"
    },
    "superseded": [],
    "control_source_sha256": "849fc8141d8f99ad34b5747e3e72a3735240f905fa61c9538e64790ce36e4212",
    "netlist_sha256": "865dffa0c15b213e927ed34cc28bd270157606b960a96c274da5ee7516696c5c"
  },
  "Prob042_vector4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "70b741f08a1c96fa7d980932ce0d3cf87d68c4b80b02f8d11db4dd1ffb32794e",
    "positive": {
      "status": "PASS",
      "checks": 198,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob042_vector4\\positive\\acceptance.json",
      "sha256": "08c491703a109dc47355a8709faae017c672fbd472e9614a6c256a880b13ba7a"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 198,
      "mismatches": 198,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob042_vector4\\negative\\acceptance.json",
      "sha256": "840d3dd7429e8d4a4ab095361aca46c86c832a6846f55e51dbd3e36ac94679a4"
    },
    "superseded": [],
    "control_source_sha256": "1c9e2413a7f5993934e1c2d242adfd5f3b9bd02b748064672bad991e86cb576e",
    "netlist_sha256": "b5d869da2dfd9c5d5c2afae1fdc6445e297e3c6e24055133461373db18c55689"
  },
  "Prob043_vector5": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "a0b3e96032360c80c5195ac5e114bc3866caf058b41ac5dc163e8ee3933e9f8d",
    "positive": {
      "status": "PASS",
      "checks": 198,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob043_vector5\\positive\\acceptance.json",
      "sha256": "2a24e8be37d229d2741cd5012c61cdee36c2aed234a29f8310aba36cf6687dca"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 198,
      "mismatches": 198,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob043_vector5\\negative\\acceptance.json",
      "sha256": "4931c4e683abc47cb1148b60579b4bb6392ef0b6c63084069f2e0d3cfc0b5ffa"
    },
    "superseded": [],
    "control_source_sha256": "2c77bf90add57c8a06e1cfb124b7e23a2a9a3beb8402015786434a1edd4e0e17",
    "netlist_sha256": "6e21f50e51ed5829fca9306e5968ccfe33b87ee6b543ece14b7b2ae9a4b9b26c"
  },
  "Prob044_vectorgates": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "ddaad251d5e224a0ba40b7dd057dba6ac3c6a07e4c616b69a41fc2d4facc78f5",
    "positive": {
      "status": "PASS",
      "checks": 521,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob044_vectorgates\\positive\\acceptance.json",
      "sha256": "3900fa4f0b4f2453920dad6b94559bbd2552bf869587ae712dc36b51747bb103"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 521,
      "mismatches": 521,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob044_vectorgates\\negative\\acceptance.json",
      "sha256": "c8395e2fdbcd1b77773089667a81f98173eede0bfef60c41030143f60f91fe95"
    },
    "superseded": [],
    "control_source_sha256": "9a092becd8719e30df2c0aa8aa7b617af04083af6d0500cca0b214494941d6e4",
    "netlist_sha256": "f268759ecea61e509af7659a8f47568d7afeb9fe1ab1164bb81b97f532e21be9"
  },
  "Prob045_edgedetect2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "0b2f0a0315b8faab4236c367cb27df4ca235e4f136faa153e49496a77d95bccb",
    "positive": {
      "status": "PASS",
      "checks": 450,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob045_edgedetect2\\positive\\acceptance.json",
      "sha256": "f8f17ff9ebdf4c556c62e9af8c90456f1ce578765418afe77ddc66ca11d2c9e3"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 450,
      "mismatches": 450,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob045_edgedetect2\\negative\\acceptance.json",
      "sha256": "173b0e6c6ca1918e944c9413b6f0956a1ed2600a05cf3029d281bff24e15fb15"
    },
    "superseded": [],
    "control_source_sha256": "3cd9cc1376f91a6284ea116b530274434dae17c438dad0beb59efea53fc2ea0a",
    "netlist_sha256": "86442309ae9c17a1654566eb363299c18a16bbb52353cb821b122bd82a479232"
  },
  "Prob046_dff8p": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "5cf625484046e784eb96b0bad5f1d818c312ba9550b5d50332d68f5e8bed9af0",
    "positive": {
      "status": "PASS",
      "checks": 869,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob046_dff8p\\positive\\acceptance.json",
      "sha256": "8171c44cfa4334ae3b3a8be54a60ca41db7410d91f9459c428cc7035e30ab61e"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 869,
      "mismatches": 869,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob046_dff8p\\negative\\acceptance.json",
      "sha256": "7bc3e28fe6e110924888f443a33e83f50c610d20229f1c5c4df403557cc9322a"
    },
    "superseded": [],
    "control_source_sha256": "f8008d26bf7fe188a752b909a5c0b574f5844c66e250a346065da9105744316f",
    "netlist_sha256": "91876f06010103c4201667d8a2a6c1c9e2c59b44192ae063fa225d76ce1d7c47"
  },
  "Prob047_dff8ar": {
    "root": "D:\\AMD\\netlist-suite-20260927\\probe-v7",
    "profile_sha256": "d4d08991ac6785603ac8459e0ff039a81a296878521bacdf28074096be274c46",
    "positive": {
      "status": "PASS",
      "checks": 871,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob047_dff8ar\\positive\\acceptance.json",
      "sha256": "a22edf1b7ad31f4c24e7156239eb723e07332717a24219d65384b66adb61ac5a"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 871,
      "mismatches": 871,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob047_dff8ar\\negative\\acceptance.json",
      "sha256": "0ca830a7baef5a7cdbb947f79dd3a4ad5b0fd5a46ddbf23cff6486b6a75be846"
    },
    "superseded": [],
    "control_source_sha256": "f31e9b35e91984bf8e1b646ca193290e964795e5c4fc4603b61796b0fa69076a",
    "netlist_sha256": "c03fe95b9d29b65b862c7b41ff16a9f065bb412bcc2c009ae3ec46d22207e0a2"
  },
  "Prob048_m2014_q4c": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "4d616910048aa757d05577c6d0d495e0c5decbbe3b5aff3d7c19483e46820843",
    "positive": {
      "status": "PASS",
      "checks": 195,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob048_m2014_q4c\\positive\\acceptance.json",
      "sha256": "029a3b1130a6627d7a8bee1f2f92752d09e7c370b253288fb18856e6270734f7"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 195,
      "mismatches": 195,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob048_m2014_q4c\\negative\\acceptance.json",
      "sha256": "ee5a9ff9b057aaa50e677625a358a236ba63174af395185ecb3f66a17b546d5a"
    },
    "superseded": [],
    "control_source_sha256": "55bffbdea74ec18af7cf99e4f0779bb4d159e4d46add18ceae627dddcb227a81",
    "netlist_sha256": "ff857a326a59ed07101167f398916f3f42da14a8b3950cffa691c397a6e768fe"
  },
  "Prob049_m2014_q4b": {
    "root": "D:\\AMD\\netlist-suite-20260927\\probe-v7",
    "profile_sha256": "861bf6d86e3494db1b669fc0d4b8638ff99899cd5bf39c15d00368b61ca2bb4b",
    "positive": {
      "status": "PASS",
      "checks": 195,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob049_m2014_q4b\\positive\\acceptance.json",
      "sha256": "ee79ec0e30fe76ec1f6a15a3852a3cd2dc5e83354891b28d493bbbdc85aef13e"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 195,
      "mismatches": 195,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob049_m2014_q4b\\negative\\acceptance.json",
      "sha256": "81c912a49623fdefd274f59c352dc25d8a548b0f20c4f2df509a69633a6b5503"
    },
    "superseded": [],
    "control_source_sha256": "f9ba7e2e71d82b4fff8929d10b9ddc43ef9d3bda38bd1a61d592ba4714f343f3",
    "netlist_sha256": "584acd816834cc7acd78b2983166416d899532887b53d6cd8ecc112e599b5792"
  },
  "Prob050_kmap1": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "82cd23a4a8d4bcff1df29c1a43189074ae2736e23ba387fc57ee250f19c30365",
    "positive": {
      "status": "PASS",
      "checks": 437,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob050_kmap1\\positive\\acceptance.json",
      "sha256": "3c04a87faa6d21c43c3879281860d9cc7dd77443fd6d63fde6d631539b2e97c1"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 437,
      "mismatches": 437,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob050_kmap1\\negative\\acceptance.json",
      "sha256": "189d8a42ae391669b27199d5440a2ac10cdc514bc8ffdefe37de0e7e25cf48c3"
    },
    "superseded": [],
    "control_source_sha256": "b3a6f212b45dda64e4eb43af3cde82500bebcdc48533de540adfc5e99d3ceafc",
    "netlist_sha256": "474f1330fd46ade80c05d9c471d5ad969de93e5a412f4c84264320fe44bd507c"
  },
  "Prob051_gates4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "31e693e16cf35dd783b6ca79cfff4a177acd742634018d5723b4e7f1c74737ca",
    "positive": {
      "status": "PASS",
      "checks": 466,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob051_gates4\\positive\\acceptance.json",
      "sha256": "bb00711f424f22dbbd7492879d3b887aa8e228b58a9f2f215c68eee9074067f7"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 466,
      "mismatches": 466,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob051_gates4\\negative\\acceptance.json",
      "sha256": "56893dc0738463a299a697ee06a7e21cf45f9f53ac61e9c28c26dfe2a2b1c06a"
    },
    "superseded": [],
    "control_source_sha256": "d6d2aa03314dae6d1e3130bc1b751e7ddd651c75fc78b0b84b02e66ef5f8676f",
    "netlist_sha256": "d5d5de21456dd0612286901a6777b90d2ab9422491ae503ac4c765cbefb40dc7"
  },
  "Prob052_gates100": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "60b376268dc952811b81a8879a2344fafc35cf7073434baa0f8f1ac6eb2c308f",
    "positive": {
      "status": "PASS",
      "checks": 865,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob052_gates100\\positive\\acceptance.json",
      "sha256": "02429e5111101c4d3e67083c080582a2544037444bfc8fc1ec499e3f915747da"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 865,
      "mismatches": 865,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob052_gates100\\negative\\acceptance.json",
      "sha256": "8cb4acffecc92ff110c8f8646b44cae8944f2157dd615c0c565cada862894054"
    },
    "superseded": [],
    "control_source_sha256": "535318bd0c1eb99fe39e8d712610c5ec2d35cdff8f1351b776185bb9b32e8a52",
    "netlist_sha256": "9c53ac1f253def93b2d74afe70396cb23daaabeaab1a7b9752498b8dd7228a2b"
  },
  "Prob053_m2014_q4d": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "4fce713726507f2ec3abaaffa06a1396a1a2a17d9b4fc144f02c6bf29f5c851a",
    "positive": {
      "status": "PASS",
      "checks": 192,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob053_m2014_q4d\\positive\\acceptance.json",
      "sha256": "412a6d1fc0b2e0f369f2628997672727cc829eef37285fb45c9e65e8bdf4aae5"
    },
    "negative": {
      "kind": "stuck_zero",
      "status": "NETLIST_MISMATCH",
      "checks": 192,
      "mismatches": 48,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob053_m2014_q4d\\negative\\acceptance.json",
      "sha256": "4de41b3fc6613c4795736168a03e060e5d2c4061e7b4b758c398d3aba636dba6"
    },
    "alternate_initial_state": {
      "status": "PASS",
      "checks": 192,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob053_m2014_q4d\\positive-initial-one\\acceptance.json",
      "sha256": "7bbe612f7adb5f1899f8aca9b41a4d358567360cacdbc52081ba44d998709693",
      "run": "D:\\AMD\\netlist-suite-20260927\\full-v3\\eda\\run-KHY6TL"
    },
    "superseded": [],
    "control_source_sha256": "750c1d9f508fab267ca71add09a5810fe0e04b732fd4d1a24173ac07f61938d1",
    "netlist_sha256": "f227950cabed0f5479b9f139e4e7c141dc1cd4fed23148c33a37b44b6d4bddaa"
  },
  "Prob054_edgedetect": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "1f89ac50b279694d90b182f6ca2511e0a7759552c91ee6151ff1c4d285603140",
    "positive": {
      "status": "PASS",
      "checks": 452,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob054_edgedetect\\positive\\acceptance.json",
      "sha256": "8b69952ed8647d9cb59a62398f865c8720e50fa169c43b1fe72ff181d7202c30"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 452,
      "mismatches": 452,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob054_edgedetect\\negative\\acceptance.json",
      "sha256": "72a6c9eb9663fb2edcbba68265191fde878123aed6adb5801c6d6b35d1048c46"
    },
    "superseded": [],
    "control_source_sha256": "935d06f087b7ea66730f6f439f6204f1666980ddfd26208437c5e0dae4974032",
    "netlist_sha256": "5f086e682a8495c348c8e3d56e0a47ccce961eb0e859ae0065e0fce67862f7aa"
  },
  "Prob055_conditional": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "1d767f28d7a6dabc22a2c4bb3451c0961e908f3b0866b04eb2f7e34172b83a0d",
    "positive": {
      "status": "PASS",
      "checks": 222,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob055_conditional\\positive\\acceptance.json",
      "sha256": "4faa0c55aa7f89693320d63ab23464f25ee94b9cadd046a22bb04119d7c7d3b8"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 222,
      "mismatches": 222,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob055_conditional\\negative\\acceptance.json",
      "sha256": "01dc6c172be912e7129c4c896520f7b3db65d60da52568f423a9fab702dd7363"
    },
    "superseded": [],
    "control_source_sha256": "df4de8f3c085a48450ea3704b0f9af30bd7bcf03a645dcb8e27699c44ac5ba2b",
    "netlist_sha256": "dea6daff5a24fa381ff22f264917f0e796150a822434534151079cc24e1a98ba"
  },
  "Prob056_ece241_2013_q7": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "e616489b18a1333488934fe3a457d880e7afdd94c051e9504829cecb1c51c0dc",
    "positive": {
      "status": "PASS",
      "checks": 842,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob056_ece241_2013_q7\\positive\\acceptance.json",
      "sha256": "49d31d63255d2cad3506f2a2b3133983b1ea7a04657c1167c1548b1640a06587"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 842,
      "mismatches": 842,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob056_ece241_2013_q7\\negative\\acceptance.json",
      "sha256": "e996214fc103bae92ea4dcdfabc71a8c5e8f6506586a71d9dfc41b222b1bd851"
    },
    "superseded": [],
    "control_source_sha256": "f83ffdc76eeac11c7e7980ad5daf47c0ec9b26f130750b5c664a6516fe4776cd",
    "netlist_sha256": "1b597d8ade216ed2c91e9d2a535389572db4b0d7a2e374a8abf2b1b5920ee838"
  },
  "Prob057_kmap2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "d9a505daea9c525d9132a291be187bc3ec8f2f534a54caf34df5af3af11f8002",
    "positive": {
      "status": "PASS",
      "checks": 463,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob057_kmap2\\positive\\acceptance.json",
      "sha256": "54bb52c391261959c9229a42daed4669fb5197f03d17dcdee7b7152a3060fba0"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 463,
      "mismatches": 463,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob057_kmap2\\negative\\acceptance.json",
      "sha256": "9fd8ebe1d581e30a75a7c958f6de4a08d3cfc2516919ee39b13420ec15f7c97e"
    },
    "superseded": [],
    "control_source_sha256": "2cae80769b8df3dfdebefcb209a9fcbd2dc194e1234b888fe268e8bfb01fed50",
    "netlist_sha256": "aea3c8723fc8c4b67674abc5bafbfd58c66579fa8ed26288acbabe64a00727f8"
  },
  "Prob058_alwaysblock2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "9f1240d59fece96d21be8e15fa60629de06066bcd2bc2833d4cb7a7f4031f823",
    "positive": {
      "status": "PASS",
      "checks": 437,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob058_alwaysblock2\\positive\\acceptance.json",
      "sha256": "4dc4e5eba1a40a0d500e014a8a122e4eb5b8285ff78675e877df9aa12238ccd6"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 437,
      "mismatches": 437,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob058_alwaysblock2\\negative\\acceptance.json",
      "sha256": "9ddf34dbad13847fa97d667c9466d283ca2b115308464de99397e8663754a5ad"
    },
    "superseded": [],
    "control_source_sha256": "baa1a9c915abcf78856d28016b49776dcb368272de35b6b7bd3c7d4e06048cb3",
    "netlist_sha256": "f6a3671361e6dc28f9dbf5c4824ed3699a933a5d650aff9751190a0b949d118f"
  },
  "Prob059_wire4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "e892183dde38b8ba215be7b9097d02c3f71af0b38d32d56ad217bfa7cee40e60",
    "positive": {
      "status": "PASS",
      "checks": 434,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob059_wire4\\positive\\acceptance.json",
      "sha256": "d3692936e8eb7ce9b81b5026f9b9443e616d45ed6443e499aca114eb44fd6dab"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 434,
      "mismatches": 434,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob059_wire4\\negative\\acceptance.json",
      "sha256": "4f80694887c165f7f148ddf6e68513eb8f27139ee300dd21a0825e832cfe9eef"
    },
    "superseded": [],
    "control_source_sha256": "3890af778573bd91591b741f66d6229261b03f3e7800b8478b671210e1055038",
    "netlist_sha256": "185d5d69fde2ae8137dd4174d61efe30b512b2e71083b979e70d31eb37263879"
  },
  "Prob060_m2014_q4k": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "91c560689a89b1ad8614c3e257071dc3f39793e12263c4d3333d1246667f8bfe",
    "positive": {
      "status": "PASS",
      "checks": 593,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob060_m2014_q4k\\positive\\acceptance.json",
      "sha256": "92125d77db5c76eb7ef55714f4b2956fec4b782dcf320167aca33c6b45624571"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 593,
      "mismatches": 593,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob060_m2014_q4k\\negative\\acceptance.json",
      "sha256": "84f1b1234fd8b50e834ac9abbcbe41160dbc1db20e986462bfacb069e2970b57"
    },
    "superseded": [],
    "control_source_sha256": "884c0249f4cf695998cff79c5a6b8e01f3a2e5e658fe4f7c895c9ba926477d78",
    "netlist_sha256": "3e28747d62ab60a5e26865e2196a30a14b71b9021debdd2d211963d76b978770"
  },
  "Prob061_2014_q4a": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "5cb324c185550f64c993470c5ced28cc7cf38243fb7f6533eee9f3d9f3ae51a8",
    "positive": {
      "status": "PASS",
      "checks": 387,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob061_2014_q4a\\positive\\acceptance.json",
      "sha256": "7cab8029d88407921ce91700bffe723182f360ff67725d6dd12ffb91257e6476"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 387,
      "mismatches": 387,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob061_2014_q4a\\negative\\acceptance.json",
      "sha256": "686049ec3ca45f3ca0069360b1ee590b3aa5db37b07521b71d2db0f8eb13af1a"
    },
    "superseded": [],
    "control_source_sha256": "294814db56ab399154e3ad136795ea43f62881cdf795ba0235ced1d1359bd656",
    "netlist_sha256": "3915a701c3c1bed6d487be55c95011c8a4f0d910741221b05f9e0f5af8e696bd"
  },
  "Prob062_bugs_mux2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\approved-interface-errata",
    "profile_sha256": "5cbe19460a4845189994ff7b82b202e041008aebc3dbfb177fb0f6d4f39b4eec",
    "positive": {
      "status": "PASS",
      "checks": 226,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\approved-interface-errata\\Prob062_bugs_mux2\\positive\\acceptance.json",
      "sha256": "3a3cb6c973b1b47d6a1a1f1a3d4b8f103f8b67c47149189b6d15c9997cb627cf"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 226,
      "mismatches": 226,
      "path": "D:\\AMD\\netlist-suite-20260927\\approved-interface-errata\\Prob062_bugs_mux2\\negative\\acceptance.json",
      "sha256": "a0143aa7441d6d302b4933ff8285b48bfd2adc7f6bd375e1dbf432ef7fd4c0b6"
    },
    "superseded": [],
    "control_source_sha256": "64f1a789eb31dcd46e6dd1e90732989d92f9260098ee3dad444e0045d5c8f9fb",
    "netlist_sha256": "b67f5e3f1e217010aa20a28f06c66625b679def76241ef58657930228d072292"
  },
  "Prob063_review2015_shiftcount": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "c72fa7bb04a24f951f9131b1781b22f7dd7faccd88611c9a31e2e3c59427ee5d",
    "positive": {
      "status": "PASS",
      "checks": 4141,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob063_review2015_shiftcount\\positive\\acceptance.json",
      "sha256": "084c86065ed0f83672d02a1f1f03a62b994be436df420b6e61581717bb50bcdf"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 4141,
      "mismatches": 4141,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob063_review2015_shiftcount\\negative\\acceptance.json",
      "sha256": "edef21401c739de41cd63da12add9a5e53ce43e04071e6a024e6d1b98553bd6e"
    },
    "superseded": [],
    "control_source_sha256": "7addef1a2450904e0ff99fa99b92211dc7080b43a0698cfcce92cc4260d9e83e",
    "netlist_sha256": "ca05905a592a955a4df4cdb6da136bba7201cfd8ba1230e1810ff6b503161180"
  },
  "Prob064_vector3": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "471d498fa228408066aa9de7912244635bf891118685343e922c8cfbc5716bb1",
    "positive": {
      "status": "PASS",
      "checks": 250,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob064_vector3\\positive\\acceptance.json",
      "sha256": "1d9f4db0e37f5ec6379a471706ce0298ebfdab84fc58766cb95f6082768881b1"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 250,
      "mismatches": 250,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob064_vector3\\negative\\acceptance.json",
      "sha256": "0555151851a54a2de20d009256c9b0a007b45ff6ae54891db0d66232f47f7728"
    },
    "superseded": [],
    "control_source_sha256": "5e59c83217b7a764fd560975deb83b53f1823009634a31daed0391f11dc45f95",
    "netlist_sha256": "5ca2d114f2be62e7592b17f9aae9d85543890c43c7b7119d3e2690e2b4b7dabe"
  },
  "Prob065_7420": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "cd1e992c915a3975356119341eca9f8c2cc9b0de2715bed381e89321d0115a87",
    "positive": {
      "status": "PASS",
      "checks": 477,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob065_7420\\positive\\acceptance.json",
      "sha256": "e654fcaecd094b7fe4014652a8ecd48beeddf876bab6e0c421abf4897b1e0f3f"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 477,
      "mismatches": 477,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob065_7420\\negative\\acceptance.json",
      "sha256": "46b57aa6e6704a5fee028a79d91abf4e586907e39359f55f8860904c8d72468c"
    },
    "superseded": [],
    "control_source_sha256": "1270bb423216a9c72dc07b1b9ac46c661766bb3ce769715eb7e1c36d858bcda3",
    "netlist_sha256": "e283972d0a12447a838e88b520b63499383f6079fe052b2674e5d14236ad58c7"
  },
  "Prob066_edgecapture": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "01dd58305afb194edba2352034190aba3699d39cc6cec7fb31f3ea07b20ff819",
    "positive": {
      "status": "PASS",
      "checks": 530,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob066_edgecapture\\positive\\acceptance.json",
      "sha256": "f3773364a687c601cca833c04edaa53ccbca5391ead742aa8b99f451ab4ebfbc"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 530,
      "mismatches": 530,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob066_edgecapture\\negative\\acceptance.json",
      "sha256": "d92a6db72da3027ce7d5a2763af54f5547d81ed40a26010c7b8fee6027d87137"
    },
    "superseded": [],
    "control_source_sha256": "2674fccda553f44249e81fee1342041a9d63763aa14d4459315c886d2d8bbb54",
    "netlist_sha256": "a9b6bcc9e6b1fef41c96567742cd07f2a9465a473dbc9b5a81b4fe0bd74fb457"
  },
  "Prob067_countslow": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "973732ce1d24194e7b01e6bd3eacb870b539266e6d55bb4ec226eb3e9ec48e7d",
    "positive": {
      "status": "PASS",
      "checks": 997,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob067_countslow\\positive\\acceptance.json",
      "sha256": "e6c8e0573ba3eed02f3681d8c44bf96cf3ec47cb49eaa6f1a4895c256cf9b5be"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 997,
      "mismatches": 997,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob067_countslow\\negative\\acceptance.json",
      "sha256": "5507b30f46dd28d801787d7d522c0a19c30f8c5c53d51b58cbb5a03a9908a74c"
    },
    "superseded": [],
    "control_source_sha256": "b0a602523430dbaa280008a479f0055b93342e4c2208ea4d4445211f8abbf0b2",
    "netlist_sha256": "765839503fd853d13afc85f8150a163823c70da27ae74a1e9432ca8a16af2aa0"
  },
  "Prob068_countbcd": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "b00225f2e67428c33a4b41022c2a84348ea575fbbdfb0994e94ba73bdb450b2a",
    "positive": {
      "status": "PASS",
      "checks": 79609,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob068_countbcd\\positive\\acceptance.json",
      "sha256": "cfb730d668c159dfe70d5e58e1a95e9d6561d7565a23677363b4e19d238532c7"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 79609,
      "mismatches": 79609,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob068_countbcd\\negative\\acceptance.json",
      "sha256": "b062b38ab94a40d1fc6b9c615481aef9bc1bd701cf19f2a60dc3827314258686"
    },
    "superseded": [],
    "control_source_sha256": "e8b2bff1f693281e202335b9a2bf38fddf1daed00d73435a17ca5715770eea03",
    "netlist_sha256": "5637f71585e430d0822eb6d73276930dd856eed132408c649cabb6156880130e"
  },
  "Prob069_truthtable1": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "b196912442627567cdf88886dbbee5e5f39b6ff613dee96b0f9b38bf876702ce",
    "positive": {
      "status": "PASS",
      "checks": 114,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob069_truthtable1\\positive\\acceptance.json",
      "sha256": "9332d46d111d40eb7bc34672345f91fb535f0aa6bba0bc9ca6cfa402b106b972"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 114,
      "mismatches": 114,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob069_truthtable1\\negative\\acceptance.json",
      "sha256": "38faf2507c0de88f1417bdb7db49b1dedb5ea224b0c91b3145941d84b49e4783"
    },
    "superseded": [],
    "control_source_sha256": "0410cb1f9e65328d44f16734204693f9395babe167c61e95c02be921fa74e598",
    "netlist_sha256": "1a7363aaeec329f6b6404ce767e2c98bce9a811af11809d2cc5305a66dc954a3"
  },
  "Prob070_ece241_2013_q2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "39b00920a6d964b5a88bdd4785be32f8480fa639373be83df3ff16115cf231ae",
    "positive": {
      "status": "PASS",
      "checks": 212,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob070_ece241_2013_q2\\positive\\acceptance.json",
      "sha256": "42cfa1a2b3ea7148783ad182352335caebd1ed0b1481e3e9bbbf4e53e6f11b18"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 212,
      "mismatches": 212,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob070_ece241_2013_q2\\negative\\acceptance.json",
      "sha256": "6d83772539461eb9e6694f93bc35e271069d1c2f7abd21bd39e819d08f5e4e43"
    },
    "superseded": [],
    "control_source_sha256": "a0ab34d5c46d4948afae67b6adc47d0a1813a1cfe6fd0624bc03b22be2013335",
    "netlist_sha256": "9a6d1fb8d622c2743996e0bf31c5c0013f5e2ce71837bc12e8e775c1429b4427"
  },
  "Prob071_always_casez": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "15ad91cceaac7812c6a779ff124c2ad1b36ed6e33d7843264cbd8e1d475e8665",
    "positive": {
      "status": "PASS",
      "checks": 686,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob071_always_casez\\positive\\acceptance.json",
      "sha256": "760470c510857ea6374299428503ed10503d035134a9792e5d60c8ecdac5d199"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 686,
      "mismatches": 686,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob071_always_casez\\negative\\acceptance.json",
      "sha256": "067c53657482cbd0f9142c775786c2e3fac7049d78731ddf9c4d9380d101473b"
    },
    "superseded": [],
    "control_source_sha256": "47af431ad00c505ff424407bd2dc9510a91597d8ca8bf9c05d9af052ddd9ce6c",
    "netlist_sha256": "f8f866b2c3e600853d43da6f95ed8a9e7e149c16a34d6c862fb04729b3f75c30"
  },
  "Prob072_thermostat": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "649547ffbac90b74acd361dc5d0701b3599e1751f1f8322d18f035e061708c0c",
    "positive": {
      "status": "PASS",
      "checks": 495,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob072_thermostat\\positive\\acceptance.json",
      "sha256": "72e676b651d0da11f7bf6a5e956eae302b1d78b6f6e3963238632956f271f3b5"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 495,
      "mismatches": 495,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob072_thermostat\\negative\\acceptance.json",
      "sha256": "32a5c330744a4dcd4a020bdf15bc3a2e4828efbb9efb02c4a4096e7294441f7d"
    },
    "superseded": [],
    "control_source_sha256": "3b52058a0462894a0f90835d5645805cba8bd81c76934f5e16bf2ac3912c3d87",
    "netlist_sha256": "73cea6e2e92df5c846f1dde949836cd47e403b17ab007eba029cb4e25ea4a786"
  },
  "Prob073_dff16e": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "0ecac0d3f62c7f37da479227ecb61d2545c1a03cc0e66ff6ce179bac2bb5ce98",
    "positive": {
      "status": "PASS",
      "checks": 885,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob073_dff16e\\positive\\acceptance.json",
      "sha256": "6c0b89a0e0a72c6064dfc5ba2c50ab1736453b73bb956cc6f81bd2e520e03090"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 885,
      "mismatches": 885,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob073_dff16e\\negative\\acceptance.json",
      "sha256": "033161e4c1bc79fd6f0327e6aab574a6796d3228f45d3f70385e36d6ef54600a"
    },
    "superseded": [],
    "control_source_sha256": "bac9121c5319dce58d0209c0d84a22199b4f78be3a0ef87802c3d5147efc632d",
    "netlist_sha256": "f7dc33b6478ab609b36f50f11012065e3b7f389cd5b87245ab6acd43e39e02dd"
  },
  "Prob074_ece241_2014_q4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "d26b3734f6c3f4a28d980fb7acb3c43025ab5c49996195245f8539d3c3d979bf",
    "positive": {
      "status": "PASS",
      "checks": 234,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob074_ece241_2014_q4\\positive\\acceptance.json",
      "sha256": "f7d43ad743ab5a953cc47fc1ac2cb97669020be97254ceb1bad701b70e80481e"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 234,
      "mismatches": 234,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob074_ece241_2014_q4\\negative\\acceptance.json",
      "sha256": "bd3f714e86fc2413add171c5dc7b20e8a415fb56dbad31156d37c3f23424bb1f"
    },
    "superseded": [],
    "control_source_sha256": "5595c2dc909c4b17b8886787cbe938c5e4471f2d7fe77962ce2dcab0338579e6",
    "netlist_sha256": "1a5a56248f5f115be11f72c1581cb12d13865d2e5a686216bc67587fee783508"
  },
  "Prob075_counter_2bc": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "8efff3dc36317285e351f42c8a4d1fde5607f0afce4fdfd5e5d4edf1ecdfe97c",
    "positive": {
      "status": "PASS",
      "checks": 2097,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob075_counter_2bc\\positive\\acceptance.json",
      "sha256": "3b02aca2fbd000e376059bbe4b88ccfe7d490084b7a663c13046f2524f8bc164"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 2097,
      "mismatches": 2097,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob075_counter_2bc\\negative\\acceptance.json",
      "sha256": "c7d288c5197805b020dc3fa3ca0df5be653c6cff4676d75b42be821a58bfc4d1"
    },
    "superseded": [],
    "control_source_sha256": "1435efa3c39e24e916523356b7efadd45d1d65ff6b1e3344528d07d59b29c79e",
    "netlist_sha256": "690f6544dbd1e55e364899a3e48aec7f5617f9eea28be2ffe0b22c3e66bf27fa"
  },
  "Prob076_always_case": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "b55257abae0d20abc72b546b1c3807391fdbf1813406532744f35124cd96f55e",
    "positive": {
      "status": "PASS",
      "checks": 234,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob076_always_case\\positive\\acceptance.json",
      "sha256": "c5254e280c6f39bd56b4e209c24ffa17b5cd5569f9d07bd37d5df141314f84bf"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 234,
      "mismatches": 234,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob076_always_case\\negative\\acceptance.json",
      "sha256": "25b21b43378636a0a615e2f30f87354666ef8300883764bcaba7b24891b0fcb6"
    },
    "superseded": [],
    "control_source_sha256": "fc5d4c957d1fa1bbd0ad8a46ad0613fb2c94109dd263954ae53c0bc6a3ab60b2",
    "netlist_sha256": "b412f621e7a426be59894b88accd1951868ec29db45e3a22a20adf075e943a93"
  },
  "Prob077_wire_decl": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "ae11c84914397de775d788f7c1ef2acf62fe9da69ab689ff8fdf12827587c79b",
    "positive": {
      "status": "PASS",
      "checks": 243,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob077_wire_decl\\positive\\acceptance.json",
      "sha256": "0c3ff167c06763c08ad534a1cbef323df32a864a2a4b4e2e9d7e60217e34f5b2"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 243,
      "mismatches": 243,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob077_wire_decl\\negative\\acceptance.json",
      "sha256": "f5c5255100c38eb5e98b34d7bdd47e5cac91b088140ee8d60960c1a6e557eb71"
    },
    "superseded": [],
    "control_source_sha256": "2d081edcf3e10d4a68a8cc65bec48ff279d0c1bc4931345454ae463e02a3a797",
    "netlist_sha256": "2b3a3acfdca88e3f6d40485813a778b82420b9164a6b36f81106dafd8ac3513b"
  },
  "Prob078_dualedge": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "a76beb58ce2c32e3dec7320fec206748efacd4e00d0e7c3c37a4ddca7d42e0d0",
    "positive": {
      "status": "PASS",
      "checks": 447,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob078_dualedge\\positive-reference\\acceptance.json",
      "sha256": "a434b523cc81eb93cfd4a2200c7fef079e17ac4f51655967c9bf6b14529e641c"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 447,
      "mismatches": 447,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob078_dualedge\\negative\\acceptance.json",
      "sha256": "eb11fe954e8524c56b06b7b3dbd0226000e2e46f15d1722bf6f949bf971b7f95"
    },
    "superseded": [],
    "control_source_sha256": "4c05bfd4961447a507eb8a6d2d8205a4287105031efe75e3501edb9da43932bf",
    "netlist_sha256": "c71e9d06b821b98466acaf42d721937c1accb8a71e3e8913bfee9dcfbc40ea1a"
  },
  "Prob079_fsm3onehot": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "49781b9d811d098e138008bc416787e59d31e24d0ea803b42d281f14918f3a5d",
    "positive": {
      "status": "PASS",
      "checks": 399,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob079_fsm3onehot\\positive\\acceptance.json",
      "sha256": "97764be8c9d37c29c8191f190c22fe223ec5028e1580ef282a457e285f10b92a"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 399,
      "mismatches": 399,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob079_fsm3onehot\\negative\\acceptance.json",
      "sha256": "38a05867f905fcc86de0d8d99bc80cfd3287f628f4686effa49b6e86fe8bf3b5"
    },
    "superseded": [],
    "control_source_sha256": "5d7b5cc43a0a1fc5f9929f62c28d808a8756b808bed960ee6abfafbc0c8e1ffb",
    "netlist_sha256": "c6b18b34e849d2c3ed6e3f99786c45ad90967ba7e1f74afab5a62a8c9aa3c609"
  },
  "Prob080_timer": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "ad99fdd0c2f3a40ad8bad40279b5492a7b34f7a991e792fa1c07b749e6e1e395",
    "positive": {
      "status": "PASS",
      "checks": 14249,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob080_timer\\positive\\acceptance.json",
      "sha256": "451c629fb65a0b2e6c2c2806cd8b157acb07bb53db1cffbaeb6448a7267a3903"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 14249,
      "mismatches": 14249,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob080_timer\\negative\\acceptance.json",
      "sha256": "23b6910ab93d0bd1ea2f9ea0c77afee29c06f4517946e0ca5ff078b1c9600b28"
    },
    "superseded": [],
    "control_source_sha256": "97781262a760b9171f13e2f81572acb58bb0d46739653ff536059a8dfdd94920",
    "netlist_sha256": "8fe62e14351d0ccc4741e009d5d022db6aecf7f09a1c63851ba0a73897361fea"
  },
  "Prob081_7458": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "5e20e3b050c0a9d381c532cb1cf6afe017d2a60fb7eec94e43f3f0c1c03e502e",
    "positive": {
      "status": "PASS",
      "checks": 877,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob081_7458\\positive\\acceptance.json",
      "sha256": "6ed6b1d7d85f5d0b93e39527a0ad9e77fb52353f20dff38d2670a7db0d84aa1f"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 877,
      "mismatches": 877,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob081_7458\\negative\\acceptance.json",
      "sha256": "6ed8e7d553f6ede9bec32420c3e970f02461e1b4cbedf00a0a70bab761352418"
    },
    "superseded": [],
    "control_source_sha256": "685fa728c77a5b50ce3179a2b2b7e8d1df5c0e07059b2c46cee22312ee8fef53",
    "netlist_sha256": "7d308007024596b01e78ad94b02206e3fa33b8375d00ea9cc1ae4a4699eaa2c7"
  },
  "Prob082_lfsr32": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f245bfa9fa5d4c377eb46eba1ae4db543043524906f063ab016121a18c57e232",
    "positive": {
      "status": "PASS",
      "checks": 800701,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob082_lfsr32\\positive\\acceptance.json",
      "sha256": "197f1fa45ea92d3cdf1e82344af4912a2d88c3d2f25363914c896620aaecb0a2"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 800701,
      "mismatches": 800701,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob082_lfsr32\\negative\\acceptance.json",
      "sha256": "19c8796874563cf763f1db4bca3b23b6e4ada57fcb926dc248c0364ac67e0618"
    },
    "superseded": [],
    "control_source_sha256": "e7a5407dfa67a91a8e84ea684542b19466dff346e4f317c2798107cc435f7fde",
    "netlist_sha256": "7f19c3c8ce70b4e10653d7db105d4a9eea14011045ae1cbbdd252906c758d2e4"
  },
  "Prob083_mt2015_q4b": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "20b3d55b10e34ffb100e92f5ddc9dc10c001228f2f92edbe03dd969ad7a4721e",
    "positive": {
      "status": "PASS",
      "checks": 219,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob083_mt2015_q4b\\positive\\acceptance.json",
      "sha256": "110b58dee4f58dff8be11acf1c3b9863d0020ab60afcbb23788cb0ecc8ee9587"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 219,
      "mismatches": 219,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob083_mt2015_q4b\\negative\\acceptance.json",
      "sha256": "926fd250c2dea71531b7856342d7debd48fbcc81b36fdaff7d2aafc928dc536d"
    },
    "superseded": [],
    "control_source_sha256": "baa1e671b2cab1e8bde38c2c060105190f5dc21ff2d604a48b824ec7bec798a7",
    "netlist_sha256": "1c063c6580284ed8ed6e67dc90c91edcdd20d17a05b1c01ef78bcbd8ac65056d"
  },
  "Prob084_ece241_2013_q12": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "4785903bef7de7ea6a83ee7c0666c08179f565aa6b12271c08ffd669040ee22d",
    "positive": {
      "status": "PASS",
      "checks": 1046,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob084_ece241_2013_q12\\positive\\acceptance.json",
      "sha256": "27357f5630544863e4a7a9341169e2fe82c8f8d37781d84b0dc5d5e8795461fe"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 1046,
      "mismatches": 1046,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob084_ece241_2013_q12\\negative\\acceptance.json",
      "sha256": "f475d7a694028e1ba4db2d8460f19d9d22a3f798c2ad90af5ba9b34afe97163e"
    },
    "superseded": [],
    "control_source_sha256": "15457ff6e9cdd8d412767a36949857d1c670e7c96602dcfced5582b89b2c8fb7",
    "netlist_sha256": "7eeba4a4429fb98af5c721f64170e767681ab495ff1a69bc0e5ac21415e5ec53"
  },
  "Prob085_shift4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "618bb8cbc66b6a9d4ff61642e145dd47384c84774f85267823837607973e3af3",
    "positive": {
      "status": "PASS",
      "checks": 853,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob085_shift4\\positive\\acceptance.json",
      "sha256": "deedbec9b612d1579ac844d1d00f8940dba4fbbcfc08190ad839c86fdf5146a6"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 853,
      "mismatches": 853,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob085_shift4\\negative\\acceptance.json",
      "sha256": "e274b1ef9a78be83cc75427066394ef20c0dfb88bc6e6728767e007111026219"
    },
    "superseded": [],
    "control_source_sha256": "2bddfaa61f850319d388ef82d9a536fbec2ceab7a1c2e0f60ebec90b6dbfea1e",
    "netlist_sha256": "230468b11eca697d93ade28a5493ea62e431d7559e4ad1400af1c6484e432dd9"
  },
  "Prob086_lfsr5": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "3e61736aa9bf654c034be90f45ba8420bcd8de3401e2a525f5d43ac1be2f0220",
    "positive": {
      "status": "PASS",
      "checks": 8885,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob086_lfsr5\\positive\\acceptance.json",
      "sha256": "2fc0e67e10b61bf818dafd62318e553412af970929df4b65061e05e537392c0f"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 8885,
      "mismatches": 8885,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob086_lfsr5\\negative\\acceptance.json",
      "sha256": "96ef27880473c4667c480adace02d782eaae491b135118f832e5dba777b07e89"
    },
    "superseded": [],
    "control_source_sha256": "90b5da0512db77a16ec5112e583c49d935f72e02850c4ea4bb48b461c223aed5",
    "netlist_sha256": "4115c943f95aa7c75ff1cabc05e3ef5a7f9bae59dbaa0e9526f7c75907134554"
  },
  "Prob087_gates": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "175dbb50a0d15ce694c0d492cd39cda285832d094588ac4bb3432f146940cd02",
    "positive": {
      "status": "PASS",
      "checks": 416,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob087_gates\\positive\\acceptance.json",
      "sha256": "aebe54d71ea41f65ed598f7bcda57a8ed85f8e86183a78f2197c0b0a825a1770"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 416,
      "mismatches": 416,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob087_gates\\negative\\acceptance.json",
      "sha256": "4d960a1938d15b5195f8107e7fea009b4cfaeb99c7ae5b42a23de7d16bdbb442"
    },
    "superseded": [],
    "control_source_sha256": "95c1f45e95c8f5b9a18f3091172f98358ce4aefdc968c43b70015df0073a4b58",
    "netlist_sha256": "29e2b262f36ac13c1d7321bbe8460d7bd8d295f931743c30aaf27befb5e7bfdc"
  },
  "Prob088_ece241_2014_q5b": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f81b10af13908732f81c79af68b4fb314993668903fa293d34d3aad8d3e3ab7b",
    "positive": {
      "status": "PASS",
      "checks": 870,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob088_ece241_2014_q5b\\positive\\acceptance.json",
      "sha256": "17a92b4177646cdb16d855c2f7b1a98a76b3cc96a3a3c1001a931af1aa507c96"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 870,
      "mismatches": 870,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob088_ece241_2014_q5b\\negative\\acceptance.json",
      "sha256": "6816db644c2349b4059a040fb0455a5d782c50f7695f48b0ff50fd6f33d07fdb"
    },
    "superseded": [],
    "control_source_sha256": "14de6f7817ba6959e9a44d6629469333b3cf15cbea6dbd7771b4d6cfba6d39b4",
    "netlist_sha256": "6ca911579914edee2a8c3fd77dc1b5ea765b1f2b37b6a01c9670ec0a840e079e"
  },
  "Prob089_ece241_2014_q5a": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "808c36440cca935c556c915c0d019814cb9469890ed999938dd77f1797874a85",
    "positive": {
      "status": "PASS",
      "checks": 870,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob089_ece241_2014_q5a\\positive\\acceptance.json",
      "sha256": "77ae2f5d32b0476a9f6e39f5db5c18f5d938e7de7b3f47cd1042307f11172666"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 870,
      "mismatches": 870,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob089_ece241_2014_q5a\\negative\\acceptance.json",
      "sha256": "72621c878f76003ccd7c678f1bb3ab45983e535609cab06a4d2b92229714910e"
    },
    "superseded": [],
    "control_source_sha256": "3d6eb482f267aac0562467d8f6781cf6b9b885ad59b51c4d5dd87a8751f0f039",
    "netlist_sha256": "694ece8817824eaf839b129c4c515d26971b198cf4c93c550eeadd9bac243688"
  },
  "Prob090_circuit1": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "4e8f02876af5effaa2fd52b884a3aff959cf0d30272d5ce744f9d8efaa0fd512",
    "positive": {
      "status": "PASS",
      "checks": 238,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob090_circuit1\\positive\\acceptance.json",
      "sha256": "8fd31feed16ae521a835b6b6680eb791049cc4988f2280295b7ecd026555a90a"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 238,
      "mismatches": 238,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob090_circuit1\\negative\\acceptance.json",
      "sha256": "24da709d61964d9863fb06881387b57807e99bf9268b2dfbf6eab6b53306e9fc"
    },
    "superseded": [],
    "control_source_sha256": "830604726283fc8fede0f96183db9cf6dc2e8657b56e58aef1a0a95e1031a5f0",
    "netlist_sha256": "3ffcc25ca6a28b8ec051d1a32a8d85b6cf3f25490a2cfcc33003c7fc3e89d662"
  },
  "Prob091_2012_q2b": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "936d308a944c001faba52b84164ab2a95928d7c9a020155b2bebce05a72822bf",
    "positive": {
      "status": "PASS",
      "checks": 1199,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob091_2012_q2b\\positive\\acceptance.json",
      "sha256": "05940cb6a5f06218d24cee0edccc02b70b73b8437edbe03dee4b8090c7ec329f"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 1199,
      "mismatches": 1199,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob091_2012_q2b\\negative\\acceptance.json",
      "sha256": "41738a90465cd7f247e83bae4c47a803d66b53c83e62d79ff9cdbd15bc570e1a"
    },
    "superseded": [],
    "control_source_sha256": "0952301aade78ef44e7eef434464cf2af6e9f0bc89de31868d4c5a6721f32d71",
    "netlist_sha256": "00e679ba8bd333a7f17a98280c4bfd26249e18688fcf21b2e749e5586c76a3ca"
  },
  "Prob092_gatesv100": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "81961ab2da0fd9aa17c0b6bd0cc8c22b616ebe08c9c06a642bf6d6ede7d31366",
    "positive": {
      "status": "PASS",
      "checks": 401,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob092_gatesv100\\positive\\acceptance.json",
      "sha256": "bd4c4ea011a25a403d0366f3ce60feee58a1d73d3ba808fef3d3be3c5dfc8a7e"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 401,
      "mismatches": 401,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob092_gatesv100\\negative\\acceptance.json",
      "sha256": "8eb1ffee59636364211344c8e8439442f22f2bcbef1d6c4afe83d16d990c0d6f"
    },
    "superseded": [],
    "control_source_sha256": "cca74419540eaffc85c1533eb9cf2a1a1cb386b7e1599df9d66905a8c6b5cb49",
    "netlist_sha256": "0068fd703a4a75fd62d0f87d25483098abe6d453390e89b46135c1b70cd8409f"
  },
  "Prob093_ece241_2014_q3": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "44c9c85f554b245ff90a6c03ab5dbbe2862a034ec53d6e021e8a4951d90ef412",
    "positive": {
      "status": "PASS",
      "checks": 118,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob093_ece241_2014_q3\\positive\\acceptance.json",
      "sha256": "48408f26777186933beac98b5b567890677c603ab9c50f2480f0faecb7429388"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 118,
      "mismatches": 118,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob093_ece241_2014_q3\\negative\\acceptance.json",
      "sha256": "43576f22cc75fcf407f357a4808aa3d163a83ad71181aee554e4ec85bbbede20"
    },
    "superseded": [],
    "control_source_sha256": "6a343afe9f857175d353db3af27365bf6c8be123a51ae4697d45a29f5aedf93e",
    "netlist_sha256": "36b79ab193bc65206ec5cce223928e1b062c6d0c7f9d64a546524e31d5508f6e"
  },
  "Prob094_gatesv": {
    "root": "D:\\AMD\\netlist-suite-20260927\\final-corrections",
    "profile_sha256": "29910564ef50c61e7e2f7a4175010d02c74868ddac34cb94adbf6bd629fd05fb",
    "positive": {
      "status": "PASS",
      "checks": 425,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\final-corrections\\Prob094_gatesv\\positive\\acceptance.json",
      "sha256": "d7ff01e219d3f56d417347f106f30e299b5139885a580086c7a4144e4480dc2d"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 425,
      "mismatches": 425,
      "path": "D:\\AMD\\netlist-suite-20260927\\final-corrections\\Prob094_gatesv\\negative\\acceptance.json",
      "sha256": "c213a79f917b6f67760c36a807ed256d93a0d0b3bd7cdd4a381399128dba6fe3"
    },
    "superseded": [
      {
        "task_id": "Prob094_gatesv",
        "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
        "profile_sha256": "b3d83b9d58a3be883cb8eded073ee670cbadc15c1a7b0fbfd2b6aae9a0732cc4"
      }
    ],
    "control_source_sha256": "358b415d4efb9110387e861d1040961f359022ee4c1a56a24b2668722c31d974",
    "netlist_sha256": "00620c0ed34f2088d7e99058341e150a4a63b3f4febe23f56bf4699c6861a73d"
  },
  "Prob095_review2015_fsmshift": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "2905cb2a17fe2a10151a25ef6fd4c6a8ed2fdd02ebd29500f0ef936d8065659c",
    "positive": {
      "status": "PASS",
      "checks": 395,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob095_review2015_fsmshift\\positive\\acceptance.json",
      "sha256": "e084b43fd6c9512a1c99c0d6499563993ff5db05d000009ab9c51eabcfc0b1ad"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 395,
      "mismatches": 395,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob095_review2015_fsmshift\\negative\\acceptance.json",
      "sha256": "df19c7d621e63059342bc02875716c58caad719cc0752df762d71918dc64ea00"
    },
    "superseded": [],
    "control_source_sha256": "5cdf62406021ee6dc16931bd41a5f01c7ef5fd99e00b3cd9813ba8e4a3476f40",
    "netlist_sha256": "b879b50e0c5d6769a118c01e3875213ac0b9f09ce0ec755b54201fd3d322fde2"
  },
  "Prob096_review2015_fsmseq": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "8e68d1fe402ada92710c0a63c47865a08f6b04915077b43a47524e46f40abd92",
    "positive": {
      "status": "PASS",
      "checks": 1285,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob096_review2015_fsmseq\\positive\\acceptance.json",
      "sha256": "7ab922802fad5e42219fe47dcfe5148b2c87d53d5ea26cfa87ae1771afc9e59b"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 1285,
      "mismatches": 1285,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob096_review2015_fsmseq\\negative\\acceptance.json",
      "sha256": "ee4df954e68e85dc7316562b442b972b3c2a42b8d0f581f2c7351f87b039ac97"
    },
    "superseded": [],
    "control_source_sha256": "d62075aa5e17064a2bd0007c60f81e180799c17e1b32344d3d36960dfd889e5f",
    "netlist_sha256": "cf648fcab38e0549189a9b3301ae1ae31551a3f54cd02ff70100fa3537aec4a8"
  },
  "Prob097_mux9to1v": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "135af00c9e4795179d87d87dec24fc188ca8a1be0f53644e26e064220e2c51da",
    "positive": {
      "status": "PASS",
      "checks": 438,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob097_mux9to1v\\positive\\acceptance.json",
      "sha256": "8bb4121370b3b68c79addb7ece353942b784981f6b0cbc9b094c38dc5f0fd643"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 438,
      "mismatches": 438,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob097_mux9to1v\\negative\\acceptance.json",
      "sha256": "a95ddbc61124ad221acd249d6a2aec599588d068edda386a6cf5d38cc712d40e"
    },
    "superseded": [],
    "control_source_sha256": "9fe4b38f8ad3586ae28df56f4dbaa08a9f3bf87041e5b7465ecd44d1a8f4f799",
    "netlist_sha256": "6fc82c4b0f850b16cd6518d0183d215f3ac14b5aae65299980796ae7407bc114"
  },
  "Prob098_circuit7": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "bb7f8efa84677277a847c4c0bf6a956d6afb68b482077e1b665338a94019bf4c",
    "positive": {
      "status": "PASS",
      "checks": 240,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob098_circuit7\\positive\\acceptance.json",
      "sha256": "3864ef123f676288ba77bfbe66852cc24959d8dd1e7969089a1f35cbe1d09f50"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 240,
      "mismatches": 240,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob098_circuit7\\negative\\acceptance.json",
      "sha256": "2917e1caffce36f7c85536212952b2851a148fcdd137a364e2816bb8df736528"
    },
    "superseded": [],
    "control_source_sha256": "3ca23cf267700ecdf16424da652032286da4b173bead120a37ac0eb5344463f4",
    "netlist_sha256": "ca16e25f41ab49ac58469eeca940c872e29b6ab98896fac73925ed32d65058f0"
  },
  "Prob099_m2014_q6c": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f1197e09b5be0ceadf7231e50d24507f4c4586ed0806c7cbef95e9606be34ed7",
    "positive": {
      "status": "PASS",
      "checks": 399,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob099_m2014_q6c\\positive\\acceptance.json",
      "sha256": "2cbe35e0d887c9ac6b013ee687b6ebdcb67f93d6bbb3235ab64a5574fd63b477"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 399,
      "mismatches": 399,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob099_m2014_q6c\\negative\\acceptance.json",
      "sha256": "c8d6ae4f0a09bd56f6c5aa16db206eaf730d151862c804ec1476d87f9d7802a9"
    },
    "superseded": [],
    "control_source_sha256": "05debe887f3cb3d50f08d1be2eb38c4bf08845f66a3095a2ece4bf73d6f09860",
    "netlist_sha256": "90589285dd41c3c2fdc1ee0ab5a4bd4166f145278cf7e86bef4a6bc17b262b57"
  },
  "Prob100_fsm3comb": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "fa1dbe34f3717ec6d294e81dd441b3a8ecf787794ef5e76741e6a26faed48a5e",
    "positive": {
      "status": "PASS",
      "checks": 199,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob100_fsm3comb\\positive\\acceptance.json",
      "sha256": "acb370f0f8b40013cc17ce972b2699fc3cb24c8441c0f48ce05c77c3d90ae77f"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 199,
      "mismatches": 199,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob100_fsm3comb\\negative\\acceptance.json",
      "sha256": "8d67288178dd75c9f04a4eb52ff9d8e453473fdd42d924137b54c40e61731728"
    },
    "superseded": [],
    "control_source_sha256": "d21e4c6ac0435e44576f82e05ce6cb942ee9750e1d5cb57009748c0c6493c3c6",
    "netlist_sha256": "318307e3bfea17b9732f032a4549702559066462f1f33df6095c07f25548c0e8"
  },
  "Prob101_circuit4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f403143f270b2f7acc10702aeffb74f8ecd1723efdd1a8d2f0a6a08f035f7fd5",
    "positive": {
      "status": "PASS",
      "checks": 240,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob101_circuit4\\positive\\acceptance.json",
      "sha256": "abaa9d1465f2924dc260d6a03e6d3e7b3c7b33f07491e3ee51be91f1265b4d80"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 240,
      "mismatches": 240,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob101_circuit4\\negative\\acceptance.json",
      "sha256": "d1dc5c7aa36988d1930c007430da25c630a86992bd1734479f70244ef99e692f"
    },
    "superseded": [],
    "control_source_sha256": "7b8776cbe8ad25c9cf6620803edefd9350c731a4a3a328123915758babc2f66a",
    "netlist_sha256": "8b08c6bd453771fa1af85df378bf8a6eaec4d3c69b8f4ad783170bfec6fcb1d5"
  },
  "Prob102_circuit3": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "99b127e23b61fab004f166fdee02edd99356b401eaae7f0f478be0a8d6ec10fb",
    "positive": {
      "status": "PASS",
      "checks": 240,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob102_circuit3\\positive\\acceptance.json",
      "sha256": "a2cfbea9d10bd54daf9dc11ee96e98b2d5414febe3887ec445125998bede3ca3"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 240,
      "mismatches": 240,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob102_circuit3\\negative\\acceptance.json",
      "sha256": "8315a14fc18f51eebd526ccbf671c24cd439a47cc4c6c8288978d97251f6b08e"
    },
    "superseded": [],
    "control_source_sha256": "cf0f9d9f541deba37d6f9b63e62eb7272072b4e4285d32e593abababcf57eae4",
    "netlist_sha256": "4de46763ab336ecd6cd4cfdcc071ff7700668603e8c04c83a1107f52531a9506"
  },
  "Prob103_circuit2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "5b1c5646185a2674ba269727169c8d67cf8ec6eae09247b5d9f62c17a8c712b3",
    "positive": {
      "status": "PASS",
      "checks": 240,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob103_circuit2\\positive\\acceptance.json",
      "sha256": "4a0ce3a24d77314969712e76f5057ab34d3fa720f8c5ed163676e4a575218da5"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 240,
      "mismatches": 240,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob103_circuit2\\negative\\acceptance.json",
      "sha256": "c9a236ea0ce8c5f4cdc369b1fec86ac62ee72977074a7c777c621cb9784c8fe9"
    },
    "superseded": [],
    "control_source_sha256": "20df07fd487c9d3cdf1a6183a91c20a1a3d595062b73a2389cb991373f5bf832",
    "netlist_sha256": "6c11498995625cb807afc4957ecb2405ece104ef6b187cd924f84d9b15cc4ba8"
  },
  "Prob104_mt2015_muxdff": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "cc8399ecf4d4bc2731ee8e948024da73814aaf151b023eaa97cab8e05121ba61",
    "positive": {
      "status": "PASS",
      "checks": 397,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob104_mt2015_muxdff\\positive\\acceptance.json",
      "sha256": "89680aee6d7ce38a3d38bf23917877d89d1aea3b4b4e3a4987969235cba09fb0"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 397,
      "mismatches": 397,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob104_mt2015_muxdff\\negative\\acceptance.json",
      "sha256": "410d5364cd145aabbb998982c2392b02effc6523ff43e9e28d640ca1ef256856"
    },
    "superseded": [],
    "control_source_sha256": "d04e46527079d0ccbe8031f965327b96cc28956221ce58d9fc0bcccefcaefd22",
    "netlist_sha256": "900391ef24e6e0eb0ef42423e81e8c5295a66f3710aed971c67d419e40647e59"
  },
  "Prob105_rotate100": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "8b6a82ce64aa44954649dbed6888e6a51e1ef6597d5d5c1dea4ba0e6e01452a6",
    "positive": {
      "status": "PASS",
      "checks": 8005,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob105_rotate100\\positive\\acceptance.json",
      "sha256": "ce8c739c1c52edd39cb322bd9ee2722a519018066bd25a8d8d4199b0e8274c7b"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 8005,
      "mismatches": 8005,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob105_rotate100\\negative\\acceptance.json",
      "sha256": "8dffdd89959395c9d80fb632169dee2081c24db34e6dd2ceafe0e08042995642"
    },
    "superseded": [],
    "control_source_sha256": "8002a44babf85e468eb4f53e8a14b54a7ff477615f80b6c9f84e9bb574e09036",
    "netlist_sha256": "8e0f11ab1de268f12f6473f1dfbd815b37aa9e8a055e764b1e22211c10beb97d"
  },
  "Prob106_always_nolatches": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "c1ffce930d6dd9013728303471e976bdaeac7a6b17c6dcd45a4046f264173f73",
    "positive": {
      "status": "PASS",
      "checks": 60034,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob106_always_nolatches\\positive\\acceptance.json",
      "sha256": "a4b26c8ffab83b0988a87eae88592f34d7f24eddd204be2e5a0eafad45509bb7"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 60034,
      "mismatches": 60034,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob106_always_nolatches\\negative\\acceptance.json",
      "sha256": "0d07bb78a376a76aa28ccdda84c16124839fda522155b53c9d75c455b53877ca"
    },
    "superseded": [],
    "control_source_sha256": "cc9b793ba7f3950cfd9083f31d81573b7673c4f0a7a9c2a0ab0c8faaea2431a8",
    "netlist_sha256": "ac448261f9d57c520ae3ff7cbc0c51966d5bf24371cd51a2b5fc37ad52e17a41"
  },
  "Prob107_fsm1s": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "88c8ccc096bdfa9906320503a844ae6ba1d225626ff2aad28a4c043f8140bfe1",
    "positive": {
      "status": "PASS",
      "checks": 459,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob107_fsm1s\\positive\\acceptance.json",
      "sha256": "814429cb086c15d9b6024acde71b7d07827e3cbdf490c68b33385fa0380cca99"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 459,
      "mismatches": 459,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob107_fsm1s\\negative\\acceptance.json",
      "sha256": "d0e0283d66eed1972b4404fe7a1811c6eead945264d55c872f4d3dcf1f2dd9a9"
    },
    "superseded": [],
    "control_source_sha256": "93d36245596e27683cf1ae24106be1e71743f142a2de2a248fba55dfc4820fec",
    "netlist_sha256": "6e6c7f233b9f70fc810592e682ea66f78b1b1e2caf2f60115abb7225ef6f54d9"
  },
  "Prob108_rule90": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "ec997aff314abbf08aab53a97cb2e3719a5c4212fcb36deebb34fd70f1f04fe4",
    "positive": {
      "status": "PASS",
      "checks": 14241,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob108_rule90\\positive\\acceptance.json",
      "sha256": "44f6b36b6ec1ffee76c6c68dab1ad9f7c91eda17a8f21e9dd01e9aa5dddb0564"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 14241,
      "mismatches": 14241,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob108_rule90\\negative\\acceptance.json",
      "sha256": "6df4e6ea7669f12abc0a3775593cb24f72e051af91342db2f6b2b221d8e1930c"
    },
    "superseded": [],
    "control_source_sha256": "e435cd74ba5a5be1360ccbc4c9217cf7e2c24a08176ee0ff12b6d982e7697d4e",
    "netlist_sha256": "8c57c2a56ffabfc2ee3ce861c7dc9fd968700de01f442cb9acd6ea59bfd0823f"
  },
  "Prob109_fsm1": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "9630d167b059240510362610fe928eec008b1f2418877006965a3f46151dc6f1",
    "positive": {
      "status": "PASS",
      "checks": 455,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob109_fsm1\\positive\\acceptance.json",
      "sha256": "fb0ba664585c3ab08028dbe1360e7d2f9c26a79071e4db447f943f11294c96f1"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 455,
      "mismatches": 455,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob109_fsm1\\negative\\acceptance.json",
      "sha256": "347d9e2e2957875a01a605a75f533c3106e7bd2e07d9a9232de639da60f9ee86"
    },
    "superseded": [],
    "control_source_sha256": "0e5a623739c3896ec26d613652e2b488358ee6d1c5a1518c9ea2e36a5b89ebec",
    "netlist_sha256": "d25ba33637258f78a1e4442e0d19e5950e5598cc4fd4fb074e7acae77504a0ae"
  },
  "Prob110_fsm2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "8b558ad93959cb1c5561b76f8aeb6b8f477459f00524040c709ab22dcbfdda5a",
    "positive": {
      "status": "PASS",
      "checks": 481,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob110_fsm2\\positive\\acceptance.json",
      "sha256": "b1bd5d82d98b63092f978c3c116ef022fda72347aa559945f0ff705ac957a1aa"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 481,
      "mismatches": 481,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob110_fsm2\\negative\\acceptance.json",
      "sha256": "868b2588d3dad8b37d2281977646fbc5e688195a78eb4421bb98c21b67eaf9d7"
    },
    "superseded": [],
    "control_source_sha256": "c714a7263f48d474f2773c602fb08178d6735087c35fed3c30d81b6a8e328ee8",
    "netlist_sha256": "f0ae2986801e32f0a4a4f54da6448bfbed001cb24888d94a3d64c0599783ee6a"
  },
  "Prob111_fsm2s": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "4c682313ebc8c61d62030e7209f803491b0af4118aa59e0ef30598634b03eb20",
    "positive": {
      "status": "PASS",
      "checks": 481,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob111_fsm2s\\positive\\acceptance.json",
      "sha256": "a6eb245b146872e28008c941ef7d9ecd5adf0483ce504f0b81f46d1b630fa647"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 481,
      "mismatches": 481,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob111_fsm2s\\negative\\acceptance.json",
      "sha256": "6a92f40322693eb796a8e7a2ffb72c72b021acd07c354b26444e825bd8ed2459"
    },
    "superseded": [],
    "control_source_sha256": "e04fcc840155528faac9698924c2fc8184fdac78d513e0a96b3bec2de69aa7e2",
    "netlist_sha256": "b5d6753b85de7602716629dd17f089c788e1470f1d2f6bf78e1e1d520029f7b1"
  },
  "Prob112_always_case2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "ab9956b8e427215c8e4928d675664fcceeba6eabb979b072cfd0d7a9d61464b0",
    "positive": {
      "status": "PASS",
      "checks": 182,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob112_always_case2\\positive\\acceptance.json",
      "sha256": "afd685ecf59e12cf4130c3c1df376323af99c959b44b17f2c19b669b8182776c"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 182,
      "mismatches": 182,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob112_always_case2\\negative\\acceptance.json",
      "sha256": "7037563d589021c040a65162ba940fbe52e66ecde7c17fa289fe20b2bcb0ca1b"
    },
    "superseded": [],
    "control_source_sha256": "22181d82ba24bceef78fb4eae4afea68d88fffaf62fa2d101543120f703e1bb5",
    "netlist_sha256": "df07e290c51519fbc25bb44a2a61dcc723a72e3db55197338a4661d38eec948e"
  },
  "Prob113_2012_q1g": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "c50ace22858f33ce75615f35c10b66661ccfd742298873cf6327756d95bbc6a8",
    "positive": {
      "status": "PASS",
      "checks": 199,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob113_2012_q1g\\positive\\acceptance.json",
      "sha256": "b1728c4d09719caca5f9e1016e0ced6746de3355f26fe4b4ae03d48f67bafb7c"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 199,
      "mismatches": 199,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob113_2012_q1g\\negative\\acceptance.json",
      "sha256": "2bafe38b646ab08822e9c11edfa9e0866d994b1fd479e185f664c46e4d2a3909"
    },
    "superseded": [],
    "control_source_sha256": "06c63785b0c037e69daee5f7c8204707e270c5d76cc4c71b4bda099d45540655",
    "netlist_sha256": "d02ce3ea0391e3570e3ae01ae52b1255840c3405ca1426969a4db498f3654bf9"
  },
  "Prob114_bugs_case": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "199fff5bde95ec6c928c939e0e1fa0b214e35a3f3c5b862f8719985fdc1d82ce",
    "positive": {
      "status": "PASS",
      "checks": 2080,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob114_bugs_case\\positive\\acceptance.json",
      "sha256": "4652ee2ef22ddb3c3d4a3e578e6c308171119e9b58314605c7f8ae4e79495d5d"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 2080,
      "mismatches": 2080,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob114_bugs_case\\negative\\acceptance.json",
      "sha256": "6db6d53eeac4c315731b922a99fba60a5e06f72561901d35986fe76a49706177"
    },
    "superseded": [],
    "control_source_sha256": "e9879af82b76a4808914fcbf021b75d3fac3ab3fab57fb76a5bc34e8a6ab7acf",
    "netlist_sha256": "fd63261dec90d9e0e995e8699aa8001e5cd4394a2177bf19f7a63343dd42d044"
  },
  "Prob115_shift18": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "a18e0e0f23eccad6bd640e2c6d933d70f1cdb79943bf6ebd7dcf5c8894713d66",
    "positive": {
      "status": "PASS",
      "checks": 8073,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob115_shift18\\positive\\acceptance.json",
      "sha256": "27dd640f6297a0dece957752fe640619b443cecdccd7f9555dcf4fdcf0955600"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 8073,
      "mismatches": 8073,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob115_shift18\\negative\\acceptance.json",
      "sha256": "2b68528d9b6ac7c556cdb8e42b8470f26a47f34b50b0ddbf95f4990597fac668"
    },
    "superseded": [],
    "control_source_sha256": "ce6f4aac4a0c5848a8830feea46195976e8c962241ed25921f2d5df3db065cab",
    "netlist_sha256": "66f5ed36a14cb09984fc257a9952f3d4855e8468ac6087b2fb50c3e21ac59485"
  },
  "Prob116_m2014_q3": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "533fa7daf26559e0db1c8c8f97ee75cbdf9624d12bc9def1433fc64653b0e5fb",
    "positive": {
      "status": "PASS",
      "checks": 123,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob116_m2014_q3\\positive\\acceptance.json",
      "sha256": "56c3975baf69610a5f9a48d435248109aad7fca3d03668b54509e79edd7202f0"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 123,
      "mismatches": 123,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob116_m2014_q3\\negative\\acceptance.json",
      "sha256": "2ec3295e538bef0b4faf6c229bffcecb6f6c9e1bccacc0f2673c47f9005593d8"
    },
    "superseded": [],
    "control_source_sha256": "85ab2d39b5cb75ca1b3613ea01360e25ebe94263bedd21714f9221b77ba9d8a7",
    "netlist_sha256": "0e2c2fe77928c608bd77b90e0c34765ccf5ae9487c69c2ad17ad52bab2956c28"
  },
  "Prob117_circuit9": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f83fd2779e8b855cdb2dec14454f577117eae16214b16935d1c8d3c182be6ed1",
    "positive": {
      "status": "PASS",
      "checks": 488,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob117_circuit9\\positive\\acceptance.json",
      "sha256": "5d3093d6005cffa2822d6edf2b32b133333c6bbc33e537f234bee2c9c4c00b35"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 488,
      "mismatches": 488,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob117_circuit9\\negative\\acceptance.json",
      "sha256": "8a4dfb633efcefdc639625ea62ed378d650f8303ab9a7f005c5c88862ee776e9"
    },
    "superseded": [],
    "control_source_sha256": "556f1cb240e6637b32a790f439d0ad3ee6bbca11c7aed088377334a38b9e0eb1",
    "netlist_sha256": "b9a83df1a1596f27171107e4ffa862c06570b7c54448988b8879bcf70f602d4d"
  },
  "Prob118_history_shift": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "57534246a391652c061ef1e675edbd14c5b7cc9c4c5cbe89f38fb9235dfe7526",
    "positive": {
      "status": "PASS",
      "checks": 4109,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob118_history_shift\\positive\\acceptance.json",
      "sha256": "ff15f04d8fa985f0772cdd20320ba7dbe9e84b956f5edadc5c66c62b527d5d35"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 4109,
      "mismatches": 4109,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob118_history_shift\\negative\\acceptance.json",
      "sha256": "052fbbda5cd172af945bbfe28bc8580fb5906ec3c7fb94a706f9e61db59601f0"
    },
    "superseded": [],
    "control_source_sha256": "699161f726bd8b58224ca17d52cafe22c7a7c90bf79a3c329a3d9c91cc0fa15d",
    "netlist_sha256": "cbe38f9b5b3a2a963aadd62413bb75a7811e9c09af879f8c16a607dba367d0b7"
  },
  "Prob119_fsm3": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f0016fce518ee79c0216545b1cafab69b2d363a4237ea9a5895a5987a88decda",
    "positive": {
      "status": "PASS",
      "checks": 459,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob119_fsm3\\positive\\acceptance.json",
      "sha256": "8a11332d183cce8aceadc7cd390bc62838e7bd4221671ef5c8e5903fd009e60f"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 459,
      "mismatches": 459,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob119_fsm3\\negative\\acceptance.json",
      "sha256": "655f0a1d33749f4daf1c4a165a09926a30021c74932d8d774a1a6d21e3e49f53"
    },
    "superseded": [],
    "control_source_sha256": "eb626abc0804d964da06598ef8ddc15c4847baa0fadf2c7fdb17654d0acb9306",
    "netlist_sha256": "288339e1ac4ba296eac55b056fcce26e759887460cbdc4de93de5115ce26038b"
  },
  "Prob120_fsm3s": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "5db9dc69f14975dc2ba24a4df47536d697eff3c1c853528b3e8bbc78f626c21d",
    "positive": {
      "status": "PASS",
      "checks": 459,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob120_fsm3s\\positive\\acceptance.json",
      "sha256": "e7d4e245db41d32d5b0965570e4a76f224502d2e0cdc73d9a95cbbe0db722abd"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 459,
      "mismatches": 459,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob120_fsm3s\\negative\\acceptance.json",
      "sha256": "ac417c7a9efb66513402011d77367e155c346a78a88fa8c48a9a977aad73b451"
    },
    "superseded": [],
    "control_source_sha256": "ed284316287364bac258a641b8969592d95c0350419887c885cfc3fbeb722b63",
    "netlist_sha256": "15bef91c849a0809e3b28aaa20e255b0ff5dbc7b9b94623a2ddacfbbbb07ebca"
  },
  "Prob121_2014_q3bfsm": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "04685b5cda7fe5fd7a0b6aeef399b2980abfc1ea83ec4a2a51b3954219da3bd5",
    "positive": {
      "status": "PASS",
      "checks": 2011,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob121_2014_q3bfsm\\positive\\acceptance.json",
      "sha256": "ab6b1c8469baa2b8af4a9afae7b5c9bb7387593fc7814d4e3993cf5e6d92cfd2"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 2011,
      "mismatches": 2011,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob121_2014_q3bfsm\\negative\\acceptance.json",
      "sha256": "d336db7918c9638a9f4444e99270da3eafe4d22734827392fc9850ed6f19d43a"
    },
    "superseded": [],
    "control_source_sha256": "87d6eae070cdcc1c850a174bf6ec43b3bd31b6d60f7464fbb3ed74cc09ec7295",
    "netlist_sha256": "3d9dd7dfc6101a67911aa366e897ef093bd61ffd0eab241b1a3fc767ec740751"
  },
  "Prob122_kmap4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "433d98e2c553a389620c68dcc2d34fcf046d828b461582259f73eb7244af9f99",
    "positive": {
      "status": "PASS",
      "checks": 463,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob122_kmap4\\positive\\acceptance.json",
      "sha256": "6dbad76db3a609a13b2b59483fd389cef6015a2754e12f841632747c8c1800ca"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 463,
      "mismatches": 463,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob122_kmap4\\negative\\acceptance.json",
      "sha256": "4276a53fa35c15facd895b3f8ae5e2d12ef3d3bcd279f3044db6febfd4837d70"
    },
    "superseded": [],
    "control_source_sha256": "f2d8e04c5a63b5cf7041108e58cdb99cab303603f41f43d574fdff858f62c0d7",
    "netlist_sha256": "5661203cd95bf3c2d40cd0231f5d2b9deea3cd4731837c99b92297022641678f"
  },
  "Prob123_bugs_addsubz": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "daef8b868a1dfe164842648d1335d90cf4e1c9a70bada8fb00bd0f06492066b5",
    "positive": {
      "status": "PASS",
      "checks": 234,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob123_bugs_addsubz\\positive\\acceptance.json",
      "sha256": "cc0f4ffe8a23bd63b4e818c94a908b7b6ab237ef57287ef6064911eaf115c699"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 234,
      "mismatches": 234,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob123_bugs_addsubz\\negative\\acceptance.json",
      "sha256": "e527a80b0838fcc3deb698628e29ab99842d6864b311940378d94eded2a5ed39"
    },
    "superseded": [],
    "control_source_sha256": "8b2af5478d989dcc84a9039441df1e556f8e3efc834b9168edcc5badea122e14",
    "netlist_sha256": "c4115b0cb2771f12f90bdd9d728300f09d20cb097a6e69eeaaa698be37a816cd"
  },
  "Prob124_rule110": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "6febcc635b232df0bb48c380f64881ae271cae03c4f199b89a9e6b0e769e04e9",
    "positive": {
      "status": "PASS",
      "checks": 12565,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob124_rule110\\positive\\acceptance.json",
      "sha256": "97a188a7fe39174d58c68726cbcbbfbe8281117ff81ea34a077c5a68577c7bcf"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 12565,
      "mismatches": 12565,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob124_rule110\\negative\\acceptance.json",
      "sha256": "35af7ff8eff4bef7f37ab7e8693a7445b6af36e5d80f7d42c79b5cc9dd4bd3d2"
    },
    "superseded": [],
    "control_source_sha256": "65c3ff5afa1670f861423a1fc378aa7d5e5461e33ec6f91a277bf09a961de2d6",
    "netlist_sha256": "27589bbc13a20e711a52363f9ce69cde6eeb7890d6e6406c4a71dfa23e5f068a"
  },
  "Prob125_kmap3": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "8200e7e43a34af1a8e2d930d15daf0dbcf0bdcb833809ebf77bb924d26e16925",
    "positive": {
      "status": "PASS",
      "checks": 381,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob125_kmap3\\positive\\acceptance.json",
      "sha256": "7d403e2452f082c2b2a71c97433cc103eaf961e12b4f261f8c17994e7a73a15b"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 381,
      "mismatches": 381,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob125_kmap3\\negative\\acceptance.json",
      "sha256": "94bca0bf1fbbc3bf74afb0ac84c8db8935b5a1c5f9e2581020393d001ffaaf09"
    },
    "superseded": [],
    "control_source_sha256": "2530f6e2cac968ac0c1d90cd9bb289594c74cb02e8329c4544391ca5830dc915",
    "netlist_sha256": "a55d7a1f5ed43b1f065deecb5404141bff312b096899dd2079f8c5f9ea71241b"
  },
  "Prob126_circuit6": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "28d10fb8393ea667cacf68550c8730f3b260fe48924862ab444d452ec9f5a640",
    "positive": {
      "status": "PASS",
      "checks": 220,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob126_circuit6\\positive\\acceptance.json",
      "sha256": "d034fa0ba08560aecaf1a81016849e332459a5a71ec314c29f673f00098b0749"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 220,
      "mismatches": 220,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob126_circuit6\\negative\\acceptance.json",
      "sha256": "7ff4a10e81aaf6a80b6b5ce3c93597d254e0297e284cc991cf4daa55df1f2d0b"
    },
    "superseded": [],
    "control_source_sha256": "eff779f756c9c70cb98c80c8410b4c0700e60bd58b101f322892cce07ea711db",
    "netlist_sha256": "e422106f14ab7a5ee8707430eb593cdbfd3fe15e74487ab0706cb604ae261ad1"
  },
  "Prob127_lemmings1": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "4b9c64aac0f4daa8a9fbe6136908090d6c17e1388ee1bbba7604953874e3dd69",
    "positive": {
      "status": "PASS",
      "checks": 457,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob127_lemmings1\\positive\\acceptance.json",
      "sha256": "eae53d538082c8745be6a218ef2b5ceb899e2a217d00414129af7de192290aef"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 457,
      "mismatches": 457,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob127_lemmings1\\negative\\acceptance.json",
      "sha256": "86302c01c309e0e31555250bd4722fe9b6a770be185c6b81138a683cdad9f57e"
    },
    "superseded": [],
    "control_source_sha256": "f7126b3e6359d8ae58df1c2f19b7a66554c6d3fcf15997a65ce98ebd54fb8b0c",
    "netlist_sha256": "314b2264d6a22aeebde90c5c485804872d714d40def203f0baa29e9ff4018e71"
  },
  "Prob128_fsm_ps2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "d5066968796d33be10fbb963bd3e9dea0154e19368eec6b59ea2289f1795cc06",
    "positive": {
      "status": "PASS",
      "checks": 679,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob128_fsm_ps2\\positive\\acceptance.json",
      "sha256": "07e32c5abf4100c3a35764f03f227d9ecea6eaac6476c3e2c1d238f61ebcc8ed"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 679,
      "mismatches": 679,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob128_fsm_ps2\\negative\\acceptance.json",
      "sha256": "4fe1a9c11028f0b590952c033e6278af99cf2ad02d3a80eae4c799a1d71ab3ad"
    },
    "superseded": [],
    "control_source_sha256": "e987affdea842e71edc33686940d47c9f9ba6d06f3de742191f75019bdbb4a5b",
    "netlist_sha256": "553502419e4a9c5ee13cc3d54e7705a2120a9dd9779aed51f626070b04747f34"
  },
  "Prob129_ece241_2013_q8": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "5ef2363ae2cc459afb46068d361c64542443dbc7891fcc2a8de0a8f8694a81c3",
    "positive": {
      "status": "PASS",
      "checks": 878,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob129_ece241_2013_q8\\positive\\acceptance.json",
      "sha256": "ba680683e529f6ab95b3d53b5084b8f2f874dcce0848d8daa84ec6eccf899662"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 878,
      "mismatches": 878,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob129_ece241_2013_q8\\negative\\acceptance.json",
      "sha256": "28b602357ab47960ed2e651e0ae343e961926703102ce4676f2268fc6217957b"
    },
    "superseded": [],
    "control_source_sha256": "8d7654ed47e397c35692039602c06529775d58c430c2f092d4ccf9d8a7d960b5",
    "netlist_sha256": "2e852c2d2ba46536e8c5157d789cfc3720df0ed81913819f0b816e60346e2092"
  },
  "Prob130_circuit5": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "ed15a3830d6a34374222e28d968c2e5ef2c87db24ba3867f91129e20b2353df0",
    "positive": {
      "status": "PASS",
      "checks": 276,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob130_circuit5\\positive\\acceptance.json",
      "sha256": "6cb350699fcd2adb9d4cc06bab99838fef4c5b8d698cc294fde071ca72c2cae5"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 276,
      "mismatches": 276,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob130_circuit5\\negative\\acceptance.json",
      "sha256": "b58ba7bd37a0381a3575a3bc22596df231ea133f6a12ab900f4f5879182cde4c"
    },
    "superseded": [],
    "control_source_sha256": "520cfc76f89fd8acc6838bc5911c8f20d18e6acb70febdf1b7c8dd0b3f241fb7",
    "netlist_sha256": "ad1fd687f737fe509d59035bf4679f6516663a71198a99741e925f99a1a994a5"
  },
  "Prob131_mt2015_q4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "d709539fc794c3347ff3681f2aefae974f44e262f8b14208aa3eac9c02b665aa",
    "positive": {
      "status": "PASS",
      "checks": 399,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob131_mt2015_q4\\positive\\acceptance.json",
      "sha256": "eccf5bf4e8f09716fdae65b6dc9121d1489cca8ceaa0c5b5325db30f52489eb2"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 399,
      "mismatches": 399,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob131_mt2015_q4\\negative\\acceptance.json",
      "sha256": "a3ce747710db31409371106693f4b7b574a0559a0287475079cfb300b9252a6a"
    },
    "superseded": [],
    "control_source_sha256": "b7ba05466a9abda0bbfb7fc656eb327f9501f5026bc6f846203ae7dcd24e64c0",
    "netlist_sha256": "caf542a7bdda05d904733d2e2009135b1e733d448e7e5e950913c36a06e81396"
  },
  "Prob132_always_if2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "afe8ba333d5c280d272d62f32abe119744fef30fadf3f4e1f6761d17854c28b0",
    "positive": {
      "status": "PASS",
      "checks": 240,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob132_always_if2\\positive\\acceptance.json",
      "sha256": "cf3a1d35f50af374f7e6a79b52ae8ddeb126004727c005062ad25719e37b657a"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 240,
      "mismatches": 240,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob132_always_if2\\negative\\acceptance.json",
      "sha256": "870952fe2f78bf66e22cf7c913b1b598b6453aa3a4d14c1bd0fe9ac9296176cc"
    },
    "superseded": [],
    "control_source_sha256": "e3b2acdaa0c54c53cddea1af0d8ae7b023ee31c389ee64c03352c8c269c827d8",
    "netlist_sha256": "113c4a6e497cee55bc890593d2c714958cd2a5d3da5a0f708a9d539034419dbe"
  },
  "Prob133_2014_q3fsm": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "97df9d270d97f51097bcbf0e68e0922f3a5e1a8b4d14c74fc4fa73218aed34ae",
    "positive": {
      "status": "PASS",
      "checks": 2827,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob133_2014_q3fsm\\positive\\acceptance.json",
      "sha256": "0114e3eac4d9278bee44cb4bbd1b585a7df44c6f9e3ac7809c6269d1c327f40e"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 2827,
      "mismatches": 2827,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob133_2014_q3fsm\\negative\\acceptance.json",
      "sha256": "c2f5a6f54a671c067d5e306b17b4478a919a447411af003e75ef09d7c62d3385"
    },
    "superseded": [],
    "control_source_sha256": "a350cb2e2a3a1f8b1acee4f6a93c402f8cc49e3febd4ebae257671c5801aa4e5",
    "netlist_sha256": "af45404d83ac4f06a1dee204313b83ef2509aa0b9fd57b6d28dcac6a2a9944bb"
  },
  "Prob134_2014_q3c": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f9910daf8ad012ab34b90d5c0cecc9e0eabb80acdc7e50f684043c9fc1df37d4",
    "positive": {
      "status": "PASS",
      "checks": 243,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob134_2014_q3c\\positive\\acceptance.json",
      "sha256": "eab4722e3683eb71ab74e3892df122c2a6e9155a2823e22f48ca27d4aad9ba9f"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 243,
      "mismatches": 243,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob134_2014_q3c\\negative\\acceptance.json",
      "sha256": "ed3b50906852f5dae4b890cee1224f25a48c9f6f19338437e2d300618c800efd"
    },
    "superseded": [],
    "control_source_sha256": "ad05472c84ce18ddfbef469c185843102d865eca1a4b7b6a8de6397e330a32f7",
    "netlist_sha256": "84be7753de0ac0c6f2a7309bbe19830076c904e52c9355eaa6bb82772bf268af"
  },
  "Prob135_m2014_q6b": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "ac9803eb2e03e0c7858843bc3ef54f63208c6c4f2435aee8aa9b41127112379b",
    "positive": {
      "status": "PASS",
      "checks": 144,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob135_m2014_q6b\\positive\\acceptance.json",
      "sha256": "aa3d34eb51d807d74016fad9d912f20c0986ba40086956ee1737b585c6ea7859"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 144,
      "mismatches": 144,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob135_m2014_q6b\\negative\\acceptance.json",
      "sha256": "d73c394b2f97b2ec826c09fc5193bb92384934aa06793ad5458f519dd56223be"
    },
    "superseded": [],
    "control_source_sha256": "005b1002c902bfcd05a54c7c3fbc2cb63edcbb2857a89cc4fc9b32033e120312",
    "netlist_sha256": "f4b5f731253f80c3fd9d1800f1e5fddc44fe907d7e34e40ae1dc4c139a17fd0e"
  },
  "Prob136_m2014_q6": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "33f5b5e5dddaefd7726df60d276d4bf7d0b2047e045e26931d8ade43ba8623da",
    "positive": {
      "status": "PASS",
      "checks": 339,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob136_m2014_q6\\positive\\acceptance.json",
      "sha256": "9bffa56dfb7b721b1d8ea2fdaa844cfaed7b4787ac25e9b533d8e004758621d3"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 339,
      "mismatches": 339,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob136_m2014_q6\\negative\\acceptance.json",
      "sha256": "2e9a3fc5b9bb41d73471c7bb0846366dfa242a15f77a61b7e457e225b052dbc5"
    },
    "superseded": [],
    "control_source_sha256": "c52ed99e0513638840853a0b6ea661c3aa655a55552a1295830925c548da6e66",
    "netlist_sha256": "237e6f87eb518c54f564901dba664736681a9ab504ac8fa5e33af5eecc065bde"
  },
  "Prob137_fsm_serial": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "446b622a9c44a93bae3e7f3ffc3aa62d709373f18ecf025d0abd75ec72290f25",
    "positive": {
      "status": "PASS",
      "checks": 1809,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob137_fsm_serial\\positive\\acceptance.json",
      "sha256": "72214b8ccecbfb3b022a1abd6d710c594baaa8dca92ff7fdb876e33d6a2d38ea"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 1809,
      "mismatches": 1809,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob137_fsm_serial\\negative\\acceptance.json",
      "sha256": "5b35153554500997336a8e0fe23a9f847b659a8e48de4e4695468d3711b18061"
    },
    "superseded": [],
    "control_source_sha256": "56154655cd86d555c80a174b68b88f507c6ea327fca62bdd4bb298ca97ecef87",
    "netlist_sha256": "6c02690e45628148c8f25f21d12788048afa62ca912b9fb7785e84c0bd5bdb0e"
  },
  "Prob138_2012_q2fsm": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "1141f21793d146833d08b578ae613479c99ce7b07683011b36e5784f5bff03ab",
    "positive": {
      "status": "PASS",
      "checks": 795,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob138_2012_q2fsm\\positive\\acceptance.json",
      "sha256": "a24c88f236c4bcd03e4e21d23a9ed6e74d0d0c7f5f749c3e65181f15dff81da5"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 795,
      "mismatches": 795,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob138_2012_q2fsm\\negative\\acceptance.json",
      "sha256": "e79c2e108f9cc45c9f4e30c2df5351f89ad06977cd56abbf4cc90f9778286399"
    },
    "superseded": [],
    "control_source_sha256": "6eca8e876da6ff847e9e85dbf03420ea6a32f405e57a007f89f6b36c0fbb68bb",
    "netlist_sha256": "7750c29a4e533a3ee4968b128e371420bb84e3bf8f7fa6cbbc98069e04a2dbf9"
  },
  "Prob139_2013_q2bfsm": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f917f5cdaf360f3840324730c62f61453d508bcfc56ae756b600e6227c79df43",
    "positive": {
      "status": "PASS",
      "checks": 2003,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob139_2013_q2bfsm\\positive\\acceptance.json",
      "sha256": "0ea2b51b4a70a061c421b9f8393a82bb207c960f3dd16cb940cd400c41b884b1"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 2003,
      "mismatches": 2003,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob139_2013_q2bfsm\\negative\\acceptance.json",
      "sha256": "4cb542fc8d9e263275e900a8ee48ff9161fc126b656a0232b031b992fed327eb"
    },
    "superseded": [],
    "control_source_sha256": "e615d0f8d668fab1067ddcfe18c41b9658a537495c6cc29e1cc45ea694d2b35f",
    "netlist_sha256": "cd64cfa913f4ce8441d46d6951b63690cebaf7852c4c3445ea63dcd05ad1ab57"
  },
  "Prob140_fsm_hdlc": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "86a5fcd35481f057cdcf567778da1c7a934a85d48236b9aa5f21aa016c1c2622",
    "positive": {
      "status": "PASS",
      "checks": 1601,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob140_fsm_hdlc\\positive\\acceptance.json",
      "sha256": "dd9a0b4c1b80319497651b52a56d0dec2482d509a93c463578956a20ea46b963"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 1601,
      "mismatches": 1601,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob140_fsm_hdlc\\negative\\acceptance.json",
      "sha256": "85ab5863a7fcee20aa9469b7a954a67ee260cb63d823a82c63429c4300d5838b"
    },
    "superseded": [],
    "control_source_sha256": "19d5689cb346d4e69eebceb270c6f28a128f08234d45d051685d7396cc5f0283",
    "netlist_sha256": "cf5fe6516b89bfcc85b568d21a542d51422cded8d91bee4a0b9e84ca2aa3ecf1"
  },
  "Prob141_count_clock": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "39f415c35fd073bde53729afdc671d9786cfb02263ccfa50eeed716966bca9ed",
    "positive": {
      "status": "PASS",
      "checks": 704825,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob141_count_clock\\positive\\acceptance.json",
      "sha256": "9bffd46a2685d7cc066a87ff752f2a3d68ae0ce103f7bc2512a36d11bc87c357"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 704825,
      "mismatches": 704825,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob141_count_clock\\negative\\acceptance.json",
      "sha256": "d3a5ec8bfc3c4a32803f20d087f4782b627bc30f507dec3b3ec7c97dade237a3"
    },
    "superseded": [],
    "control_source_sha256": "789e74100c087287e11fc86f0c6075888ab8a6820f69e84d005d9ea382e19560",
    "netlist_sha256": "2fd741fa2bc8f9f446de094ba54ed07936dfdc6e2c283a293715d1674639a501"
  },
  "Prob142_lemmings2": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "1370bd6e4d7cb37435b09a98b37b7463e67c03c6112ae640e5b5d3e7b4b13afc",
    "positive": {
      "status": "PASS",
      "checks": 881,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob142_lemmings2\\positive\\acceptance.json",
      "sha256": "1925dbc6ba979aa38cfea6bef574aa2d9491c4d809669b405d47161993bea2bf"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 881,
      "mismatches": 881,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob142_lemmings2\\negative\\acceptance.json",
      "sha256": "969a764403397965a8c4fd544f74f9c0a2f3da480fd96aee76e39c0733b68440"
    },
    "superseded": [],
    "control_source_sha256": "074c4d5844961e71afddbddaf70f287ed75dab2d6f93357b192c9adb965aa0e9",
    "netlist_sha256": "370131289b20368e1574aa359cd3cbbc6894b1735247bd54c2cde50d901e11e3"
  },
  "Prob143_fsm_onehot": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "ba5ec151206b105c56eac16f81fffce062f8282520009380497cbc3d3c02bdb1",
    "positive": {
      "status": "PASS",
      "checks": 447,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob143_fsm_onehot\\positive\\acceptance.json",
      "sha256": "716aacc37952a165550a515ad67eaa9e53123e05bf9f81cba304da8b6395b251"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 447,
      "mismatches": 447,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob143_fsm_onehot\\negative\\acceptance.json",
      "sha256": "272685a78c3d52a9fd114b8a424897bb3b5e899320665680bac7e76143d15b49"
    },
    "superseded": [],
    "control_source_sha256": "29f6b3010a8163230de05c7d9c68c439c8e5b0711ea95b9b7df29ec12f7f7740",
    "netlist_sha256": "29526c86d002f0c1d7b88a1fc87930e76bdff1c6e5e835c34d52c7e1a99a8fa1"
  },
  "Prob144_conwaylife": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "b5ddc96fe96d192759c734c89b2a7983c9e8431f9da6a36902a35144d49db1e0",
    "positive": {
      "status": "PASS",
      "checks": 10045,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob144_conwaylife\\positive\\acceptance.json",
      "sha256": "fb8ffd2af4c0e99f2b8b7d7f6b006fb7f851977bc56b3db5a7e01a9d8fbcd63f"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 10045,
      "mismatches": 10045,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob144_conwaylife\\negative\\acceptance.json",
      "sha256": "b760af248ec60963d7bea12b7109268436e73e277e906a9376f3c12476062db1"
    },
    "superseded": [],
    "control_source_sha256": "6e66785dec9c4f89512a19c5c7f1cc7a336aed7e075ff4f32deabf4076604e92",
    "netlist_sha256": "068622f66569827d13b137cbf8172611f5bea75b007cf4095d76173bd3724468"
  },
  "Prob145_circuit8": {
    "root": "D:\\AMD\\netlist-suite-20260927\\probe-v7",
    "profile_sha256": "a5ed218abfd754f882b907574ba409e09ef0b6aa0093fee79d6619eb1adc0393",
    "positive": {
      "status": "PASS",
      "checks": 470,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob145_circuit8\\positive\\acceptance.json",
      "sha256": "303f05732a2b338746c2dde160e04e3f27979dd1d0c7d90bf3ed6d432a8e2425"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 470,
      "mismatches": 470,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob145_circuit8\\negative\\acceptance.json",
      "sha256": "8a88d5990cae9accae20a0a2557223db0891f88c3d1757d49d908e981883b32c"
    },
    "superseded": [],
    "control_source_sha256": "cb7102ac320c1c13d27480200a090d25335b6c427924d06281bd8bcd15205432",
    "netlist_sha256": "be57f989674c35366f277d55f9ce82b83a46b7772bbb38b0e7ab3b2de038840f"
  },
  "Prob146_fsm_serialdata": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "59457262faefde14a825c36b2d99d55f9fd77d60b0d86c3ca286e8568cc27c87",
    "positive": {
      "status": "PASS",
      "checks": 1809,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob146_fsm_serialdata\\positive\\acceptance.json",
      "sha256": "764056f835ff987d4ee810dfc718a47f084bd5b798c61cb116a47e6bd323e2c9"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 1809,
      "mismatches": 1809,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob146_fsm_serialdata\\negative\\acceptance.json",
      "sha256": "497176e32aaa906b37f1bb50061fb2f56d2ec8d6f8ba572fef8e864e89cb60d0"
    },
    "superseded": [],
    "control_source_sha256": "35268051fdc5dcb36d1015745ca1b41a0bbf47e5fb2eff93dd43287584120fdd",
    "netlist_sha256": "8f496747bb94a987ad6eef6d7d6e87c11c6c53099e09be1e64f95261bad7fdbf"
  },
  "Prob147_circuit10": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "c2067ae6af9dc5e807e8652cbe422b9a595ae8e0d905db75dbb1da7c966737b6",
    "positive": {
      "status": "PASS",
      "checks": 458,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob147_circuit10\\positive\\acceptance.json",
      "sha256": "7f6b6ce402102b18b3d4c79e142206e4d0a0af758f29db41194b9befd1732a94"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 458,
      "mismatches": 458,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob147_circuit10\\negative\\acceptance.json",
      "sha256": "f60951bb949166691714d7130947276c0b929963262f690bba5c7c7e1626f997"
    },
    "superseded": [],
    "control_source_sha256": "704dcf89edb0f387e58188b9701e5f85a8bcdc2eccc80992653aa3b09290931e",
    "netlist_sha256": "fcb419b7b92151ac0d58574ffc50c7fe39a694116f194eae439e89273b06f18c"
  },
  "Prob148_2013_q2afsm": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "ab5bfab6f314849d57f6050292b30803ae105b3dda7f359a60ba4198aca00706",
    "positive": {
      "status": "PASS",
      "checks": 2107,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob148_2013_q2afsm\\positive\\acceptance.json",
      "sha256": "cc91f1e9a972e36c4429d7eeb2a08630de2453bf4570ad99d51b4383124c99b2"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 2107,
      "mismatches": 2107,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob148_2013_q2afsm\\negative\\acceptance.json",
      "sha256": "01a2e2d749aae0eb9c8e64d8dd7f7da252b68e8e985af2c77598dfd9c7112153"
    },
    "superseded": [],
    "control_source_sha256": "312e970df480b0c1b740db151c94eb8bb56b76dbb37d48095dedf9495e69376e",
    "netlist_sha256": "169e9cb31a90214af5575609b705cf2780748b63ae78ce1a5cd4252fd0cfad30"
  },
  "Prob149_ece241_2013_q4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "f36d5703482fa5ca1eba0885741776521844db40452a1a5c5852c2d0e6d7bfd1",
    "positive": {
      "status": "PASS",
      "checks": 4078,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob149_ece241_2013_q4\\positive\\acceptance.json",
      "sha256": "5ecec8ddc7d27bbbf84345034e3ef5b8d39eee24064cac66c3b97ae40e77c054"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 4078,
      "mismatches": 4078,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob149_ece241_2013_q4\\negative\\acceptance.json",
      "sha256": "41ef548fa96637e44d18e72f0fe3b95e825dc08fe6de70bc017648614b22d614"
    },
    "superseded": [],
    "control_source_sha256": "d911aec4e1841fe5eed36bbd4e87f47f3ccf469453cd7fa550d703a45cf0dca1",
    "netlist_sha256": "a8456183714acd764efab64d8ab3b10bc56344fc4d312033ed409170cbc1a5ca"
  },
  "Prob150_review2015_fsmonehot": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "c1afb6e6666c121dd95fafd7f00746c577ad8dad1f2057bb7b9906aa3b160a1a",
    "positive": {
      "status": "PASS",
      "checks": 599,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob150_review2015_fsmonehot\\positive\\acceptance.json",
      "sha256": "40e7c46116a16488efd6134e62aba1b7658f592ec09abe7b5e37f44c86d88be1"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 599,
      "mismatches": 599,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob150_review2015_fsmonehot\\negative\\acceptance.json",
      "sha256": "b9dd4f08ba10eda0c16a3b450dccb14be56d2d4cf2b28b4db540f9526c06af23"
    },
    "superseded": [],
    "control_source_sha256": "1beb51c3a8e1800a350c76abe5b4b2744db52a8e3ac9ffe756ff5f15ce427248",
    "netlist_sha256": "58d7f0e9e42f4bd84439524bcefb260d60a57bbe55e0ed64946a9be8216ab9aa"
  },
  "Prob151_review2015_fsm": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "8595c0f52ae46f937635a8239d630207759d1ca7b759907672c6fd868c8c6f83",
    "positive": {
      "status": "PASS",
      "checks": 10133,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob151_review2015_fsm\\positive\\acceptance.json",
      "sha256": "87a08590dedd066aaed42c6aa94ec8d26a50ee9d2749eb9e80782a81b581988e"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 10133,
      "mismatches": 10133,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob151_review2015_fsm\\negative\\acceptance.json",
      "sha256": "a13442468fc9a6d90d2caabfa8e6708cb5f3ba48c9546a563821f4bbe106adea"
    },
    "superseded": [],
    "control_source_sha256": "8c277f29dfe36bca2c03a208e32e3cc814e861b236ea477ccdbac134d0512366",
    "netlist_sha256": "981f4fb2f66fcf9ad50bfb74f01844eefe9db0fa6fdac56bd1a7869e5ccc5653"
  },
  "Prob152_lemmings3": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "5bb652ce5b7e2d3a80ba410222b0755d7a6c8fbfec5eb62132bfed046bd7ec92",
    "positive": {
      "status": "PASS",
      "checks": 885,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob152_lemmings3\\positive\\acceptance.json",
      "sha256": "47cd45fc6e51e8ae502a44bc821188c156dfe1923513e8dbb36eaff9a93d3808"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 885,
      "mismatches": 885,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob152_lemmings3\\negative\\acceptance.json",
      "sha256": "4931dbdacf9df69a2644c2f2e0b5b15cccdc0ea328bc0874fa40a5a6cd5c314b"
    },
    "superseded": [],
    "control_source_sha256": "8b1b721983fdbfb340a6d5d50711062887f6fa8c12f1ea0c75c3a60db0abf7d7",
    "netlist_sha256": "11a472ac7ebd77975c478633dc05fe700a3e2e9bdbdbe38d70d8363135c9f8eb"
  },
  "Prob153_gshare": {
    "root": "D:\\AMD\\netlist-suite-20260927\\probe-v7",
    "profile_sha256": "98f1f1e141e04483cb7a20c1141a332c06f366b552cbfe762b1d938a08ba36fd",
    "positive": {
      "status": "PASS",
      "checks": 1192,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob153_gshare\\positive\\acceptance.json",
      "sha256": "28f4fc0e5c63bb4d5c581cf94bdfaff37167ac5afd60844480296212fca61f25"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 1192,
      "mismatches": 1192,
      "path": "D:\\AMD\\netlist-suite-20260927\\probe-v7\\Prob153_gshare\\negative\\acceptance.json",
      "sha256": "5ce5a0a70c9f2ec330a0c1c5256605643d4df9a9437bc9abf012b4638edfd693"
    },
    "superseded": [],
    "control_source_sha256": "583781a8ebe8d060c03ad0d91c25fc599b174fa9488f17c795999468d8518d7c",
    "netlist_sha256": "4d8c088ccbef32e83dd1948b32a0edf87d521f0449f44a569f152527cd372a35"
  },
  "Prob154_fsm_ps2data": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "fd8272059c3d1f4c485d4940f0424896e27b66fac39cf54a2586b8f3c18204dc",
    "positive": {
      "status": "PASS",
      "checks": 3117,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob154_fsm_ps2data\\positive\\acceptance.json",
      "sha256": "162105e8c9727e7025c2a261c64996f305cb6b47d97e0b434da773da80bf4d2f"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 3117,
      "mismatches": 3117,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob154_fsm_ps2data\\negative\\acceptance.json",
      "sha256": "7cc402bec6c7841740a8fdb0e9b4f4b73aca400ce3265b63aef64758c130e6bb"
    },
    "superseded": [],
    "control_source_sha256": "025d3a5104cf55488c778221f4897eb0b3b27a924b38d5b0ce1fcf29327d0169",
    "netlist_sha256": "6885f1e2751754ca6fd30a98525a48977b8b5c059e6ebaed34f6500ed7c39f4f"
  },
  "Prob155_lemmings4": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "e4298f023d77dba58c79fdf81e8f2511a5c0dfbc99b97873d6f4156f5f4fc66f",
    "positive": {
      "status": "PASS",
      "checks": 2005,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob155_lemmings4\\positive\\acceptance.json",
      "sha256": "dbfd0f8568122d40be6cabb591530d1eb6d26424480453a39321192e55906b4a"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 2005,
      "mismatches": 2005,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob155_lemmings4\\negative\\acceptance.json",
      "sha256": "90c997e135d6d6c831ad47b3b48f59a631f86c3aa9614438045111ea70ef0d04"
    },
    "superseded": [],
    "control_source_sha256": "8af5a4169892df986dfe98eba227734be32452054a0876f8dec73673359c7194",
    "netlist_sha256": "0c00c05329b48e7c631d4289ae74ab1e31b56135600942a763e44d27699f3bc8"
  },
  "Prob156_review2015_fancytimer": {
    "root": "D:\\AMD\\netlist-suite-20260927\\full-v3",
    "profile_sha256": "c7ef59272e468e2797fb46bb5a7edefef8161a571d2d94b63da5e93ee72b904b",
    "positive": {
      "status": "PASS",
      "checks": 470889,
      "mismatches": 0,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob156_review2015_fancytimer\\positive\\acceptance.json",
      "sha256": "8ae1d1f2b6fb506aee7603476dfbed2a8bc8d277b6ad71c3e228677ec3955e72"
    },
    "negative": {
      "kind": "inversion",
      "status": "NETLIST_MISMATCH",
      "checks": 470889,
      "mismatches": 470889,
      "path": "D:\\AMD\\netlist-suite-20260927\\full-v3\\Prob156_review2015_fancytimer\\negative\\acceptance.json",
      "sha256": "4d92cfdba4ddd35b68201594f316f23648509e2ff5dc75b4ee20fb86da3f4632"
    },
    "superseded": [],
    "control_source_sha256": "305b82bc33954880c15fa75672efa3235f71195c618c4e4d18e202cd91fb0d64",
    "netlist_sha256": "cc72ceb788d35b5938476040bb6d17404fa0a3529c630dddaeb57f510c3f36e7"
  }
}
