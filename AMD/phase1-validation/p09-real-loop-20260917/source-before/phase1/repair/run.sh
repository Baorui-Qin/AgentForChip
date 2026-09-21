#!/bin/sh
set -eu
cd "$(CDPATH= cd -- "$(dirname -- "$0")/../../.." && pwd)"
exec node --import tsx/esm apps/cli/src/bin.ts --profile rtl-repair "$@"
