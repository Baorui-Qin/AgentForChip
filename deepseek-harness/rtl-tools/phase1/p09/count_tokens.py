"""Managed, offline, text-only helper; stdin and networking are not used."""
import hashlib
import importlib.metadata
import json
from pathlib import Path
import sys


def main():
    request = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    root = Path(request["runtime"]).resolve(strict=True)
    manifest_bytes = (root / "manifest.json").read_bytes()
    if hashlib.sha256(manifest_bytes).hexdigest() != request["manifest_sha256"]:
        raise ValueError("runtime manifest changed")
    manifest = json.loads(manifest_bytes)
    sys.path.insert(0, str(root / "packages"))
    from deepseek_recipe import ChatCompletionRequest, ConversionOptions, DeepseekV41Encoding, Tokenizer
    version = importlib.metadata.version("deepseek-recipe")
    if version != manifest["package_version"]:
        raise ValueError("package version mismatch")
    tokenizer_path = (root / manifest["tokenizer"]).resolve(strict=True)
    if not tokenizer_path.is_relative_to(root):
        raise ValueError("tokenizer outside runtime")
    tokenizer_bytes = tokenizer_path.read_bytes()
    if hashlib.sha256(tokenizer_bytes).hexdigest() != manifest["tokenizer_sha256"]:
        raise ValueError("tokenizer changed")
    wire = request["wire"]
    if wire.get("tools") or any(not isinstance(m.get("content"), str) for m in wire["messages"]):
        raise ValueError("only text without tools is supported")
    converted = ChatCompletionRequest(wire).convert(ConversionOptions())
    encoding = DeepseekV41Encoding().with_tokenizer(Tokenizer.from_file(str(tokenizer_path)))
    tokens = len(encoding.encode(converted.conversation))
    print(json.dumps({"tokens": tokens, "package_version": version}))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        print("TOKENIZER_UNAVAILABLE", file=sys.stderr)
        sys.exit(1)
