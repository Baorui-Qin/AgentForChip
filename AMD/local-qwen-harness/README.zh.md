# W7900 / Linux 本地千问接入 DeepSeek Harness

## 范围与前提

部署目标来自用户确认：Radeon Cloud 验证卡，W7900 类 gfx1100、48 GB 显存、Linux；不是决赛 R9700。本文未连接云端 GPU，因此不代表 GPU 推理已经实测。

模型已由用户最终确认：[unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF)，文件 `Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf`。不使用此前提到的 QuantTrio AWQ 权重。仓库文件页面已核对存在；云机上的实际文件、revision 与 SHA256 尚未检查。

核对时[发布者文件页](https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF/blob/main/Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf)显示大小 18.6 GB，SHA256 为 `fadc3e5f8d42bf7e894a785b05082e47daee4df26680389817e2093056f088ad`。这是权重文件大小，不是推理总显存；若所固定 revision 对应文件不同，应核对该 revision 的指针而不是盲目套用这个值。

建议先保持现有 Windows Harness / Vivado 不动，只在 Linux 云机运行模型服务，通过 SSH 隧道接回 Windows。这避免把 Windows Vivado 路径、许可证和进程管理同时迁到 Linux。

## 1. 云端检查 ROCm

在 Linux 云机上执行：

```bash
rocminfo
rocm-smi
hipconfig --full
```

确认实际设备是 gfx1100、显存约 48 GB，ROCm 可见设备。优先使用云平台提供的已验证 ROCm 环境；不要为此直接重装驱动。记录 Linux 发行版、内核、驱动和 ROCm 版本。

已有支持该 GPU 的 HIP 版 llama.cpp 可直接使用。需要编译时，在安装好编译依赖和 ROCm 的环境中，固定 llama.cpp revision 后构建：

```bash
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
git rev-parse HEAD
HIPCXX="$(hipconfig -l)/clang" HIP_PATH="$(hipconfig -R)" \
  cmake -S . -B build -DGGML_HIP=ON -DAMDGPU_TARGETS=gfx1100 -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release -j 8 --target llama-server
./build/bin/llama-server --list-devices
```

HIP 构建参数依据 [AMD 安装文档](https://rocm.docs.amd.com/projects/llama-cpp/en/latest/install/llama-cpp-install.html)。该页的预制镜像验证平台主要是 Instinct，不能据此宣称某一镜像已通过 W7900 验证；仍应以实际 gfx1100 构建和设备检查为准。

## 2. 启动 GGUF 模型服务

在云机已有 `hf` CLI 时，可以下载指定文件；先将 MODEL_REVISION 设置为仓库的固定 commit SHA，不要在正式实验中使用浮动 main。下载约数十 GB，需要先检查磁盘空间。若文件已经存在，直接核对 SHA256，无需重下：

```bash
hf download unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF \
  Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf \
  --revision "$MODEL_REVISION" --local-dir "$HOME/models/qwen3-coder-30b"
sha256sum "$HOME/models/qwen3-coder-30b/Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf"
```

以下路径是建议下载目录，不代表云机当前已有该文件。先用 32K 上下文、单并发验证；这不是显存占用保证，仍要看实际权重、KV cache 和运行日志。

```bash
./build/bin/llama-server \
  -m "$HOME/models/qwen3-coder-30b/Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf" \
  --alias qwen3-coder-30b \
  --host 127.0.0.1 --port 8000 \
  -ngl 999 -c 32768 -np 1 --jinja
```

检查日志确实使用 HIP/ROCm 且 GPU offload 生效，不要把 CPU 或 Vulkan 运行记录为 ROCm。遇到 OOM 先减小上下文，检查其他显存占用；不要仅凭“激活 3B”把 30B 总权重当成 3B 存储需求。

`--alias` 决定 API 模型 ID，`--jinja` 启用模板驱动的工具调用。保留对应 Qwen3-Coder 的模板，不要盲目强制 chatml。[服务参数](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)；[工具调用文档](https://github.com/ggml-org/llama.cpp/blob/master/docs/function-calling.md)。[Qwen 官方模型卡](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct)说明此 Coder Instruct 是非思考模式；不要照搬普通 Qwen3 的 thinking 参数。

在云机另一个终端验证 HTTP：

```bash
curl --fail http://127.0.0.1:8000/health
curl --fail http://127.0.0.1:8000/v1/models
curl --fail http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"qwen3-coder-30b","messages":[{"role":"user","content":"Return only OK"}],"max_tokens":64,"temperature":0}'
```

不要把未认证的模型端口直接暴露到公网。以上绑定 loopback；跨机器通过 SSH 隧道使用。

## 3. Windows 建立 SSH 隧道

在 Windows PowerShell 中运行，替换实际用户名、主机和 SSH 端口；保持该终端运行：

```powershell
ssh -N -o ExitOnForwardFailure=yes -L 8000:127.0.0.1:8000 <用户名>@<云主机> -p <SSH端口>
```

Windows 验证：

```powershell
Invoke-RestMethod http://127.0.0.1:8000/v1/models
```

若本地 8000 被占用，可把隧道左侧端口改成 18000，并将本目录 `dsh-home/settings.yaml` 的 baseURL 改为 `http://127.0.0.1:18000/v1`。不要结束未知进程来抢占端口。

## 4. 打开当前 Harness

本项目源码位于 `D:\deepseek-harness`。源码方式首次使用 Web UI 需要构建产物：

```powershell
Set-Location D:\deepseek-harness
pnpm run build
```

依赖缺失时先执行 `pnpm install`。实际 Web 启动检查确认当前缺少 45 个 client bundle，因此现在必须先构建，不能直接声称 UI 已能打开。为避免影响正在运行的冻结 P10 campaign，本轮未执行整仓构建。以后启动不必每次构建。

本目录已有隔离配置，避免覆盖原 DeepSeek / P10 配置：

```powershell
& D:\AMD\local-qwen-harness\start-harness.ps1
```

浏览器打开 <http://127.0.0.1:3080>。端口占用时可加 `-Port 3081`，浏览器也改用 3081。脚本通过受支持的 `dsh web` profile 启动，工作目录是 `D:\AMD`，DSH_HOME 是本目录下的 `dsh-home`。模型服务和 Harness 是两个独立进程，两个都要运行。退出分别在相应终端按 Ctrl+C；先完成正在执行的验证。

不使用本目录配置，也可在项目根运行 `pnpm dsh web`，再通过“设置 -> 模型 -> 添加自定义提供方”配置：

| 字段 | 值 |
|---|---|
| Provider ID | qwen-rocm |
| API 地址 | http://127.0.0.1:8000/v1 |
| API 协议 | openai-completions |
| API 密钥 | 无认证的 loopback 服务填 local-only；启用鉴权时填真实密钥 |
| 模型 ID | qwen3-coder-30b，与服务端 alias 完全一致 |
| 上下文窗口 | 32768，与服务启动的单槽上下文一致 |
| 最大输出 token | 8192 |

可以点击“获取可用模型”，也可以手动添加。保存后在聊天模型选择器中选这个模型，开启新会话。高级兼容性字段已写在本目录 settings.yaml：system 而非 developer role、max_tokens、无 reasoning_effort、无 store。无认证服务使用的 local-only 只是 SDK 占位值，不是安全保护。

## 5. 给题目与验证结果

先做一轮工具调用冒烟：

> 请调用文件工具读取 D:/AMD/local-qwen-harness/README.zh.md 的标题，并报告标题。不要修改文件。

应在 Harness 日志中看到实际工具调用和返回值；自然语言声称“我读了”不算通过。成功后，给它明确模块接口、复位极性/同步性、时序要求和输出文件路径，例如：

> 在 D:/AMD/qwen-work 中实现一个 8 位同步计数器。接口为 module TopModule(input clk, input reset, input en, output reg [7:0] q); reset 为高有效同步复位，优先于 en；en=1 时每个上升沿加 1，按 8 位回绕。只修改候选 RTL，不要修改任何可信测试平台或参考实现。生成后运行已配置的验证工具，并分别报告编译、展开、仿真、综合结果及证据路径。若未配置验证工具，请明确说尚未验证，不要宣称 PASS。

命令行一次性提问也使用同一配置：

```powershell
& D:\AMD\local-qwen-harness\start-harness.ps1 -Mode headless -Task '实现一个高有效同步复位的 8 位计数器，先说明接口和复位优先级。'
```

普通 Web/headless 聊天并不会自动成为 P10 评测。现有 `rtl-tools/cordis.synthesis.patch.yml` 是固定 counter 示例，仿真后端是 Icarus，不是本轮 P10 的 Vivado 兼容评测器。自定义题目必须先由 Host 配置独立可信 TB、接口、源文件、时钟和综合约束，再交给模型；不要让模型自己修改判分器。

## 6. 千问正式跑 P10 之前

当前 `rtl-tools/src/phase1/model.ts` 和 `p09-action-call.ts` 绑定 `deepseek-official`；P09 上下文计数使用 DeepSeek 专用 tokenizer/wire。Web 选择千问不会改变这两个批测入口。不能把 DeepSeek baseURL 指向 llama.cpp 就称为接入完成。

下一轮需单独完成提供方路由配置化、Qwen 模板/token 计数校准、真实流式工具调用验收、输出截断和预算检查，并为本地模型建立新 campaign。固定模型仓库 revision、GGUF SHA、量化、llama.cpp commit、ROCm/GPU、上下文、采样和预算；保留同一题目清单和可信 evaluator。先一题端到端，再扩展 10/40 题，不修改本轮已冻结结果。

## 本地验证记录

已通过当前 Harness 的 llm-pi-ai 配置 schema 和 resolveProfiles 校验，模型目录无错误；`dsh web --help` 实际运行成功。尚未连接远程模型，未验证 ROCm offload、真实 Qwen 工具调用或本地 Qwen 的 P10 得分。配置中的 32K/8K 是起步限制，不等于模型原生最大能力，也不是 Qwen 官方推荐采样配置。
