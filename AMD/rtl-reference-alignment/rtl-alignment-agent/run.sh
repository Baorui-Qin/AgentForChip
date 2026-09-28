#!/bin/sh
set -eu
: "${DSH_HARNESS_ROOT:?Set DSH_HARNESS_ROOT to the source harness checkout}"
exec sh "$DSH_HARNESS_ROOT/rtl-tools/reference/run.sh" "$@"
