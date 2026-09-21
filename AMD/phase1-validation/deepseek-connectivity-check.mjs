import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

const env = parseEnv(readFileSync('D:/deepseek-harness/.env', 'utf8'));
const key = process.env.DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY;
const base = process.env.DEEPSEEK_BASE_URL || env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const url = `${base.replace(/\/+$/, '')}/chat/completions`;
const started = Date.now();
const result = { url, model: 'deepseek-flash', node: process.version, envProxy: process.env.NODE_USE_ENV_PROXY ?? null };
const redact = value => String(value).replaceAll(key, '[REDACTED]');
try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: result.model, messages: [{ role: 'user', content: 'Reply with exactly HARNESS_API_OK. Do not use tools.' }], max_tokens: 32, thinking: { type: 'disabled' }, stream: false }),
    signal: AbortSignal.timeout(45000),
    redirect: 'error',
  });
  result.status = response.status;
  const body = await response.text();
  try {
    const data = JSON.parse(body);
    result.reply = data.choices?.[0]?.message?.content;
    result.error = data.error;
    result.usage = data.usage;
    result.responseModel = data.model;
  } catch {
    result.body = body.slice(0, 1000);
  }
} catch (error) {
  result.error = { name: error.name, message: error.message, cause: error.cause ? { code: error.cause.code, message: error.cause.message } : undefined };
}
result.elapsedMs = Date.now() - started;
console.log(redact(JSON.stringify(result, null, 2)));
