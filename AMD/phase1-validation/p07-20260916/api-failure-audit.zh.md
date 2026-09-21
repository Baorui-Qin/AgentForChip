# API 连接失败检查

## 已确认事实

- 本次只读诊断通过同一 dsh profile 加载，没有发送新的 API 请求，也没有运行 EDA。
- 凭据服务报告 `configured=true`、`source=project-env`；实际来源为 `D:/deepseek-harness/.env`，密钥格式校验通过。没有输出或保存密钥正文。
- `.env` 最后修改于 2026-09-14T16:11:18.791Z，早于本次三次请求。`C:/Users/qbr/.dsh/.credentials.yaml` 不存在；提供方允许回退到项目 `.env`，因此这个缺失本身不是故障。
- 端点来自提供方默认配置，origin 为 `https://api.deepseek.com`。本次没有改 key、`.env`、模型或网络配置。
- 同一配置下，functional 调用成功，usage 为 613/172；随后 synthesis-only 请求被归类为 connection，耗时 5029 ms；之后 syntax 补充实验调用成功，usage 为 664/317。实际模型为 `deepseek-flash`，推理配置为 high。

## 能够判断什么

没有证据表明此次是缺失 key 或错误 key。适配器把 HTTP 401/403 映射为 AUTH，而调用层把 AUTH/CREDENTIAL 归类为 authentication；本次终态是 connection。前后成功请求也证明该配置可以完成真实鉴权和生成。

这更符合一次传输层故障，但不是精确根因证明。适配器会把 fetch 或流读取异常封装为 TRANSPORT；项目调用层又将其压缩为 connection。此次记录没有保留原始错误码、cause、HTTP 状态或请求 ID，不能据此确认 DNS、TLS、连接重置、代理问题或云端故障中的哪一种。

当前进程存在 HTTP_PROXY/HTTPS_PROXY 环境项。这只能证明存在代理配置，不能证明 Node fetch 实际采用该代理，更不能据此把故障归因于代理。没有读取或输出代理凭据。

## 处理结果

不修改当前可用的 key 或 `.env`。synthesis-only 的 MODEL_CONNECTION 作为本轮真实结果保留，没有重试或重新采样。后续若增加诊断，应只记录白名单化错误码、HTTP 状态、请求 ID 和发生阶段，不保存可能包含凭据的完整异常或请求头；本次未通过新请求补造历史证据。

元数据见 [config-audit.json](config-audit.json)。失败原记录见 [model.json](repair-adbf4093-ae00-40b2-b883-3154293b6b2a/models/run-F70ZzA/model.json)。
