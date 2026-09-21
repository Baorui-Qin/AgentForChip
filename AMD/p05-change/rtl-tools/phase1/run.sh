#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
: "${DSH_HOME:=D:/AMD/p05-home}"
export DSH_HOME
exec pnpm dsh --profile rtl-agent "$@"
