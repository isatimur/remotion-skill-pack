"""Minimal smoke test for the Python wrapper."""

import importlib
import remotion_skill_pack_render  # noqa: F401


def test_module_importable():
    mod = importlib.import_module("remotion_skill_pack_render")
    assert callable(mod.cli)
