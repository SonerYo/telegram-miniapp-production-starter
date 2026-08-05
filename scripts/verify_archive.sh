#!/usr/bin/env bash
set -euo pipefail

archive_path=${1:-telegram-miniapp-production-starter-v0.1.0.zip}
expected_root=telegram-miniapp-production-starter/

if [[ ! -f "$archive_path" ]]; then
  echo "Archive not found: $archive_path" >&2
  exit 1
fi

unexpected=$(unzip -Z1 "$archive_path" | awk -v root="$expected_root" 'index($0, root) != 1 { print; exit }')
if [[ -n "$unexpected" ]]; then
  echo "Archive entry is outside the expected root: $unexpected" >&2
  exit 1
fi

for required in README.md LICENSE apps/web/package.json apps/api/pyproject.toml docker-compose.yml; do
  unzip -Z1 "$archive_path" | grep -Fx "$expected_root$required" >/dev/null || {
    echo "Archive is missing $required" >&2
    exit 1
  }
done

echo "Archive structure is valid."
