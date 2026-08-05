#!/usr/bin/env bash
set -euo pipefail

repository_root=$(git rev-parse --show-toplevel)
cd "$repository_root"

for target in apps/web/dist apps/web/coverage apps/web/playwright-report apps/web/test-results apps/api/.coverage apps/api/htmlcov; do
  if [[ -e "$target" ]]; then
    find "$target" -depth -delete
  fi
done

echo "Removed generated build and test artifacts."
