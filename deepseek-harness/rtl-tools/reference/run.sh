#!/bin/sh
set -eu
if [ "$#" -ne 2 ]; then
  printf '%s\n' 'Usage: run.sh <task_dir> <out_dir>' >&2
  exit 2
fi
: "${DSH_HOME:?Install rtl-reference with setup-profile.ps1 and set DSH_HOME}"
: "${LLM_BACKEND:?Set LLM_BACKEND=mock or api explicitly}"
case "$LLM_BACKEND" in
  mock) profile=rtl-reference ;;
  api) profile=rtl-reference-api ;;
  *) printf '%s\n' 'Only explicit mock or api backends are supported' >&2; exit 2 ;;
esac
# Resolve arguments before changing to the source harness for its supported launcher.
task_dir=$(cd "$1" && pwd)
mkdir -p "$2"
out_dir=$(cd "$2" && pwd)
cd "$(dirname "$0")/../.."
exec pnpm dsh --profile "$profile" "$task_dir" "$out_dir"
