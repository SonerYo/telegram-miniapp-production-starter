#!/usr/bin/env bash
set -euo pipefail

missing=0
for command_name in node pnpm uv git; do
  if ! command -v "$command_name" >/dev/null; then
    echo "Missing required command: $command_name" >&2
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

node --version
pnpm --version
uv --version
git --version
