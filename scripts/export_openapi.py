from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]

from app.main import openapi_schema


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Export deterministic FastAPI OpenAPI JSON."
    )
    parser.add_argument(
        "--check", action="store_true", help="Fail when the committed schema differs."
    )
    args = parser.parse_args()
    destination = REPOSITORY_ROOT / "docs" / "reference" / "openapi.json"
    rendered = json.dumps(openapi_schema(), indent=2, sort_keys=True) + "\n"
    if args.check:
        if not destination.exists() or destination.read_text() != rendered:
            print(
                "OpenAPI schema is out of date. Run 'make api-schema'.", file=sys.stderr
            )
            return 1
        print("OpenAPI schema is synchronized.")
        return 0
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(rendered)
    print(f"Wrote {destination.relative_to(REPOSITORY_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
