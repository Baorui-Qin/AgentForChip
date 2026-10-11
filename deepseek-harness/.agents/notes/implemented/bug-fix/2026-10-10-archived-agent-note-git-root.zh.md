# Agent Note: 从目标 Git 工作树读取归档基线

Status: implemented

[English](2026-10-10-archived-agent-note-git-root.md) | 中文

## 问题

归档校验器可能从较大 Git 工作树中的 Harness 子目录运行。Git 的树列表可以使用相对该目录的路径，而 `ref:path` 对象表达式使用相对 Git 根目录的路径。混用这两种解释会阻止校验器读取已提交的 manifest。改读工作区字节则会削弱不可变归档比较。

## 决策

[基线读取器](../../../../scripts/archived-agent-notes-git.ts)定位明确 Harness 目标所属的 Git 工作树，并将 manifest 路径转换为相对该 Git 根目录、使用斜杠分隔的路径。它先将可信基线 ref 解析为一个 commit 对象，再读取 manifest blob。Git 接收参数数组；对象路径不由调用者工作目录或 shell 插值决定。

读取器拒绝 Harness 目标之外的 manifest、symlink 或 junction 父目录、非普通文件的 manifest，以及位于另一嵌套 Git 工作树中的 manifest。ref 或 manifest blob 缺失时明确失败。对象读取失败后，它不会用工作区内容或空 manifest 替代。普通的工作区 manifest 可以与所选 commit 不同，而不改变基线字节。

[归档校验器](../../../../scripts/verify-archived-agent-notes.ts)先使用读取器，再执行原有的仅追加 manifest 比较。封闭类别、完整三件套、归档日期、双语哈希和冻结内容哈希保留原[归档策略](../process/2026-07-26-frozen-agent-note-archive.zh.md)。本修复改变 Git 路径解析与失败报告；不重写归档文件，也不增加文档豁免。

## 考虑过的替代方案

**依据调用目录构造对象表达式。** 拒绝，因为 Git 对象路径与文件系统路径、树列表参数使用不同基准。明确的根目录相对路径在命令从子目录运行时仍然有效。

**基线对象缺失时读取当前 manifest。** 拒绝，因为当前字节无法证明校验器必须保留的先前封存记录。基线缺失必须报告错误，而不是进行较弱比较。

**在文档脚本之间共享通用 Git 平台层。** 拒绝，因为缺陷属于一个校验器。小型读取器将目标路径检查和测试保留在该校验器附近。

## 影响

根目录与子目录调用读取同一份已提交 manifest，包括路径含空格或中文的工作树。HEAD 或工作区字节不同时，变更前的 ref 仍然是依据。基线对象缺失或路径被重定向时仍明确失败。已有归档内容和文档规则保持不变。

## 验证

[隔离 Git 回归](../../../../scripts/archived-agent-notes-git.spec.ts)使用测试自有仓库与配置，在子进程中调用实际读取器。它们覆盖根目录与子目录、中文和空格路径、已提交与工作区字节、非 HEAD ref、缺失对象、越界路径、嵌套仓库及重定向父目录。[归档格式回归](../../../../scripts/archived-agent-notes.spec.ts)保留原三件套与封存检查。完整文档验收需要实际校验器及文档集合的运行结果；读取器定向测试本身不能证明完整验收。
