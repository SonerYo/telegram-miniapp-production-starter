#!/usr/bin/env bash
set -euo pipefail

repository_root=$(git rev-parse --show-toplevel)
cd "$repository_root"

if git ls-files | rg '(^|/)\.env($|\.)' | rg -v '\.env\.example$'; then
  echo "Tracked environment file detected." >&2
  exit 1
fi

patterns='[0-9]{8,12}:[A-Za-z0-9_-]{35}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{36,}'
if git grep -En "$patterns" -- ':!scripts/secret_scan.sh'; then
  echo "Potential secret pattern detected." >&2
  exit 1
fi

if git grep -En '/Users/[^/]+/|/home/[^/]+/|/workspace/scratch/' -- \
  ':!scripts/secret_scan.sh' ':!WORK_COMPLETION_REPORT.md'; then
  echo "Local absolute path detected." >&2
  exit 1
fi

echo "Tracked files passed the local secret and path scan."
