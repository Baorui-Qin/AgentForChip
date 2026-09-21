#!/bin/sh
set -eu
cd "$(dirname "$0")/../../.."
exec node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p09 "$@"
