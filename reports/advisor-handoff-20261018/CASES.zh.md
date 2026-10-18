# 典型案例与原始日志导航

本文件是打包时生成的导航，不是新的模型实验。先读独立复核，再看原始输出。

## Probe201_six_phase

Host 在模型之前阻断；ON/OFF 都是零次模型调用，不得归因为模型不会算枚举容量。

- ON：POLICY_BLOCKED；0 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe201_six_phase/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe201_six_phase/eda/run-1k5flL/result.json)。
- OFF：POLICY_BLOCKED；0 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe201_six_phase/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe201_six_phase/eda/run-2QsRD4/result.json)。

## Probe203_typed_toggle

ON 方向合理但连续多行片段被格式拒绝；OFF 恢复为单行显式转换后通过。

- ON：PLANNER_PLAN_INVALID；2 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe203_typed_toggle/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe203_typed_toggle/eda/run-uirhNw/result.json)。
- ON 恢复规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe203_typed_toggle/42ec76ad3ca6092c5473f8692c946cb2d937e2370e281c302571e95f330a922a/run-015MDv/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe203_typed_toggle/42ec76ad3ca6092c5473f8692c946cb2d937e2370e281c302571e95f330a922a/run-015MDv/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe203_typed_toggle/42ec76ad3ca6092c5473f8692c946cb2d937e2370e281c302571e95f330a922a/run-015MDv/plan-validation.json)。
- ON 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe203_typed_toggle/42ec76ad3ca6092c5473f8692c946cb2d937e2370e281c302571e95f330a922a/run-fUFuqk/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe203_typed_toggle/42ec76ad3ca6092c5473f8692c946cb2d937e2370e281c302571e95f330a922a/run-fUFuqk/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe203_typed_toggle/42ec76ad3ca6092c5473f8692c946cb2d937e2370e281c302571e95f330a922a/run-fUFuqk/plan-validation.json)。
- OFF：NETLIST_NOT_CALIBRATED；4 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe203_typed_toggle/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe203_typed_toggle/eda/run-LeS8tl/result.json)。
- OFF 恢复规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe203_typed_toggle/d50b17bd873aaa89ba7f3a1b3191e25224a3db0a4ce5e17e8e2e15520dac7de0/run-lyuvCP/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe203_typed_toggle/d50b17bd873aaa89ba7f3a1b3191e25224a3db0a4ce5e17e8e2e15520dac7de0/run-lyuvCP/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe203_typed_toggle/d50b17bd873aaa89ba7f3a1b3191e25224a3db0a4ce5e17e8e2e15520dac7de0/run-lyuvCP/plan-validation.json)。
- OFF 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe203_typed_toggle/d50b17bd873aaa89ba7f3a1b3191e25224a3db0a4ce5e17e8e2e15520dac7de0/run-MRyLEy/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe203_typed_toggle/d50b17bd873aaa89ba7f3a1b3191e25224a3db0a4ce5e17e8e2e15520dac7de0/run-MRyLEy/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe203_typed_toggle/d50b17bd873aaa89ba7f3a1b3191e25224a3db0a4ce5e17e8e2e15520dac7de0/run-MRyLEy/plan-validation.json)。

## Probe204_feedback_serial

成功修复固定标量索引；没有扩宽公共输入。四阶段通过不等于完整网表验收。

- ON：NETLIST_NOT_CALIBRATED；3 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe204_feedback_serial/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe204_feedback_serial/eda/run-kFjFWh/result.json)。
- ON 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe204_feedback_serial/e2d4a81ca90a30bdb78078c616fc4b490efca917d9708a9a3b5eb86769431414/run-9UmNZb/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe204_feedback_serial/e2d4a81ca90a30bdb78078c616fc4b490efca917d9708a9a3b5eb86769431414/run-9UmNZb/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe204_feedback_serial/e2d4a81ca90a30bdb78078c616fc4b490efca917d9708a9a3b5eb86769431414/run-9UmNZb/plan-validation.json)。
- OFF：NETLIST_NOT_CALIBRATED；3 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe204_feedback_serial/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe204_feedback_serial/eda/run-WyCR2M/result.json)。
- OFF 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe204_feedback_serial/42a12603706dd4a880d7a8a36529cef7a231b887013d9349686418cd68df4ad6/run-d6zLE8/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe204_feedback_serial/42a12603706dd4a880d7a8a36529cef7a231b887013d9349686418cd68df4ad6/run-d6zLE8/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe204_feedback_serial/42a12603706dd4a880d7a8a36529cef7a231b887013d9349686418cd68df4ad6/run-d6zLE8/plan-validation.json)。

## Probe205_packet_parity

ON 找到过程赋值声明问题，但 cause 首次 297、恢复 223 字符，均超出 160 上限；未交编码器。

- ON：PLANNER_PLAN_INVALID；2 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe205_packet_parity/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe205_packet_parity/eda/run-Xa7TaZ/result.json)。
- ON 恢复规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe205_packet_parity/872ac47314bcdaa1834226313745f96d7271740300b758626ac7089b049190f4/run-TySJR8/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe205_packet_parity/872ac47314bcdaa1834226313745f96d7271740300b758626ac7089b049190f4/run-TySJR8/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe205_packet_parity/872ac47314bcdaa1834226313745f96d7271740300b758626ac7089b049190f4/run-TySJR8/plan-validation.json)。
- ON 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe205_packet_parity/872ac47314bcdaa1834226313745f96d7271740300b758626ac7089b049190f4/run-wjx1Yo/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe205_packet_parity/872ac47314bcdaa1834226313745f96d7271740300b758626ac7089b049190f4/run-wjx1Yo/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe205_packet_parity/872ac47314bcdaa1834226313745f96d7271740300b758626ac7089b049190f4/run-wjx1Yo/plan-validation.json)。
- OFF：NETLIST_NOT_CALIBRATED；3 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe205_packet_parity/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe205_packet_parity/eda/run-ZNvINy/result.json)。
- OFF 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe205_packet_parity/8162bc8c002902b72056bcd3901b8c95bbd7b2de481a26b83857a366c358f6ed/run-in5RTs/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe205_packet_parity/8162bc8c002902b72056bcd3901b8c95bbd7b2de481a26b83857a366c358f6ed/run-in5RTs/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe205_packet_parity/8162bc8c002902b72056bcd3901b8c95bbd7b2de481a26b83857a366c358f6ed/run-in5RTs/plan-validation.json)。

## Probe206_owned_pulse

两组都定位多驱动；多行替换片段被当前规划协议拒绝，未实际执行修复。

- ON：PLANNER_PLAN_INVALID；2 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe206_owned_pulse/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe206_owned_pulse/eda/run-hhC1Og/result.json)。
- ON 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe206_owned_pulse/d752447f7957515236c7e65df6abde72101f9720cae7b1867a78785b45ca6923/run-82b7NL/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe206_owned_pulse/d752447f7957515236c7e65df6abde72101f9720cae7b1867a78785b45ca6923/run-82b7NL/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe206_owned_pulse/d752447f7957515236c7e65df6abde72101f9720cae7b1867a78785b45ca6923/run-82b7NL/plan-validation.json)。
- ON 恢复规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe206_owned_pulse/d752447f7957515236c7e65df6abde72101f9720cae7b1867a78785b45ca6923/run-KmBm7U/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe206_owned_pulse/d752447f7957515236c7e65df6abde72101f9720cae7b1867a78785b45ca6923/run-KmBm7U/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe206_owned_pulse/d752447f7957515236c7e65df6abde72101f9720cae7b1867a78785b45ca6923/run-KmBm7U/plan-validation.json)。
- OFF：PLANNER_PLAN_INVALID；2 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe206_owned_pulse/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe206_owned_pulse/eda/run-dLVkqN/result.json)。
- OFF 恢复规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe206_owned_pulse/21ab4d356df7e0a5cf0b2c661b1737ae8e8b5af7ddcc95442722cc74d2f8596f/run-qT0299/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe206_owned_pulse/21ab4d356df7e0a5cf0b2c661b1737ae8e8b5af7ddcc95442722cc74d2f8596f/run-qT0299/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe206_owned_pulse/21ab4d356df7e0a5cf0b2c661b1737ae8e8b5af7ddcc95442722cc74d2f8596f/run-qT0299/plan-validation.json)。
- OFF 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe206_owned_pulse/21ab4d356df7e0a5cf0b2c661b1737ae8e8b5af7ddcc95442722cc74d2f8596f/run-Xpltgl/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe206_owned_pulse/21ab4d356df7e0a5cf0b2c661b1737ae8e8b5af7ddcc95442722cc74d2f8596f/run-Xpltgl/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe206_owned_pulse/21ab4d356df7e0a5cf0b2c661b1737ae8e8b5af7ddcc95442722cc74d2f8596f/run-Xpltgl/plan-validation.json)。

## Probe208_valid_capacity

ON 成功结果伴随错误容量解释和 A-to-A 项；实际只改 marker。不能从 PASS 反推所有诊断正确。

- ON：NETLIST_NOT_CALIBRATED；4 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe208_valid_capacity/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/compare-Probe208_valid_capacity/eda/run-6LD9AW/result.json)。
- ON 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe208_valid_capacity/b4bc5cdf0f9dbb00f1bcf7a06f0f95e821ed5682ca7b2e000f6b96bde0709d33/run-95inlH/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe208_valid_capacity/b4bc5cdf0f9dbb00f1bcf7a06f0f95e821ed5682ca7b2e000f6b96bde0709d33/run-95inlH/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/on/plans/Probe208_valid_capacity/b4bc5cdf0f9dbb00f1bcf7a06f0f95e821ed5682ca7b2e000f6b96bde0709d33/run-95inlH/plan-validation.json)。
- OFF：NETLIST_NOT_CALIBRATED；3 次模型调用；[任务结果](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe208_valid_capacity/result.json)；[最终 EDA](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/compare-Probe208_valid_capacity/eda/run-e1dHgQ/result.json)。
- OFF 首次规划：[规划原文](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe208_valid_capacity/e3f8f5664e34bb3ea56296d583e1d53c2090811b2c20bc0655e2f228b91bf799/run-pHtUdA/output.txt)；[真实规划输入](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe208_valid_capacity/e3f8f5664e34bb3ea56296d583e1d53c2090811b2c20bc0655e2f228b91bf799/run-pHtUdA/prompt-final.json)；[Host 规划检查](AMD/output/rtl-rule-transfer-probes-20261018/campaign/arms/off/plans/Probe208_valid_capacity/e3f8f5664e34bb3ea56296d583e1d53c2090811b2c20bc0655e2f228b91bf799/run-pHtUdA/plan-validation.json)。

## 进一步追踪

- 规划和实际修改脱节、重复拒绝后仍重复：`AMD/output/rtl-plan-effectiveness-audit-20261018/REPORT.zh.md`，对应原始运行在 `rtl-grounded-minimal-fixed-20261018/`。
- FIFO 冻结测试通过仍有容量反证：`AMD/output/rtl-api-distillation-20261017/agent-knowledge-04/RUN_REPORT.md` 与其中独立诊断目录。开发者补验不算模型自主闭环。
- 知识送达后仍未进入修改：`AMD/output/rtl-api-distillation-20261017/agent-knowledge-07-smallstep/RUN_REPORT.md`。Q123 两次请求；Q114 未启动，不能算失败。
- 全批逐调用入口：`AMD/output/cloud-agent-questions50-20261017/call-index.json` 和 `AMD/output/rtl-rule-transfer-probes-20261018/call-index.json`。JSON 中的绝对路径按 README 的映射规则定位。
