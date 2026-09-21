# RTL / Verilog 参考资料离线归档

归档日期：2026-09-10

本目录收录两类一跳来源：

1. `doc/参考资料索引.md` 中列出的外部参考资料。
2. 本次请求补充的 MAGE、VeriPower、Agentic Frontier、Awesome-LLM-Circuit-Agent、VerilogEval、rank_bm25 与 bm25s。

“一跳来源”表示只下载上述 Markdown 和本次请求直接列出的链接；不会递归下载论文参考文献表或 Awesome 列表中收录的全部论文，否则范围会从几十项无界扩展到数百项。

## 目录

- `papers/`：8 篇 arXiv 论文 PDF，包含 MAGE、Agentic Frontier、VerilogEval v1/v2、VerilogCoder、HumanEval/pass@k、EvolVE 和 VeriCoder。
- `repos/`：13 个 GitHub 仓库的 README、Markdown、文本、PDF，以及 `doc`、`docs`、`documentation` 目录内容。
- `model_cards/`：4 个 Qwen 模型卡。
- `web/`：AMD、vLLM、ROCm、Stanford IR、HDLBits、bm25s 和 FPGA 创新设计竞赛网页快照及下载清单。
- `fpgachina/`：FPGA 创新设计竞赛下载页当前列出的 25 个附件，以及带 SHA-256 的 `manifest.json`。

每个 `repos/<owner>__<repo>/_SOURCE.json` 都记录了默认分支和实际归档 commit，避免以后主分支变化导致来源不清。根目录 `manifest.json` 是总清单，`failures.json` 是下载失败清单。

## 已知边界

- AMD Technical Information Portal 是 JavaScript 应用；保存的 HTML 是官方入口快照，不是完整自包含的离线手册。入口 URL 和 2025.2 版本信息已保留，联网阅读时会加载正文。
- `www.fpgachina.cn` 与 `oss.fpgachina.cn` 的 HTTPS 证书名称校验失败。本次没有关闭 TLS 校验，而是使用同域名公开的 HTTP 入口下载；新 OSS 域名上可正常校验的 HTTPS 附件仍使用 HTTPS。
- 第三方论文、模型卡、代码文档和赛事附件仍受各自许可证与版权条款约束。

## 重新下载

在 `D:\AMD` 下运行：

```powershell
& .\doc\ref\download_refs.ps1
```

脚本会跳过已有的非空文件、刷新清单、校验仓库来源，并把单项失败写入 `failures.json`。
