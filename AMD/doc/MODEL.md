# 模型声明入口

当前声明维护在方案包的 [model/MODEL.md](../rtl-reference-alignment/rtl-alignment-agent/model/MODEL.md)。

2026-09-28 已按用户授权完成 DeepSeek API 替代小样本，未部署本地千问。保留的本地候选是 `Qwen3-Coder-30B-A3B-Instruct` GGUF Q4_K_M / llama.cpp HIP，不再沿用旧模板中的 Qwen2.5-Coder-7B FP16 建议。

权重、tokenizer、模板哈希、GPU/ROCm 和峰值显存尚未实测；API 成功不能替代本地模型或 32 GB 显存验收。详细用量、原版基线哈希和缺口见上述声明及[阶段 2、3 执行记录](RTL_Alignment_Stage23_Execution.zh.md)。
