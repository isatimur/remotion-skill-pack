"""Python CLI wrapper for @remotion-skill-pack/render."""
from __future__ import annotations
import subprocess
import sys


def cli() -> None:
    result = subprocess.run(
        ["npx", "@remotion-skill-pack/render", *sys.argv[1:]],
        check=False,
    )
    sys.exit(result.returncode)
