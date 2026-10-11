# Agent Note: Exact prompt identities across LF and CRLF

Status: implemented

[English](2026-10-11-p10-exact-prompt-line-endings.md) | 中文

## 问题

Prob031_dff 和 Prob062_bugs_mux2 的已批准公开接口解释只绑定 CRLF 提示词摘要。固定 Git 数据集与保留的 P2 catalog 使用内容相同的 LF 文本。当前完整目录读取因此在 EDA 校准前拒绝这两项。CRLF fixture 通过不能证明此部署可用。

## 决定

勘误登记为这两份提示词分别列出 LF 与 CRLF 的精确原始 SHA256。文本摘要必须匹配其登记身份之一，对应提示词资产摘要必须与该文本摘要一致。登记保留原始文本、原解释、语义批准日期与勘误 id；返回的 spec_sha256 绑定实际接受的原字节表示。本修复不增加接口解释，也不改变 Git 或数据集文件。

## 考虑过的替代方案

**在批准判定前任意归一化文本。** 拒绝，因为它隐藏表示漂移，并允许未核查的混合或其他转换。列明 LF/CRLF pin 保留现有拒绝边界。

**将数据集或历史 catalog 改写成 CRLF。** 拒绝，因为历史资产摘要和字节身份属于证据。部署修复应在当前读取器中实现。

**在校准中跳过这两项。** 拒绝，因为生产读取器创建完整目录并拒绝陈旧批准，过滤会隐藏真实部署失败。

## 影响

CRLF 消费者保留既有元数据；LF 消费者获得明确的实际原始文本摘要。Netlist 校准仍要求独立精确来源和 provenance 匹配；本修复不重新绑定或晋级历史 netlist profile。混合行尾、内容变更、资产错配与未批准题目仍不在允许范围内。局部源码变更建立后继 Runtime，旧 G1 属于历史结果，最终版本仍需 fresh 验收。

## 验证

两个 LF 正例在原生产 API 上失败。实现及未变的调用链通过接口、数据集、转换器、netlist catalog 和模型输入定向回归。任务独立证据将 LF 字节绑定固定 Git commit、P2 catalog 和精确 CRLF 对应文本。本地 EDA 收据与模型请求及 Skill 效果分别记录。
