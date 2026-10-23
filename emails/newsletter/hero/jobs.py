"""Paramètres des images d'ouverture, lus dans build.py (une image par segment)."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from build import SEGMENTS, SITE  # noqa: E402

print(json.dumps([{"key": s["key"], "lab": s["edition"], "a": s["title_a"], "b": s["title_b"], "fs": str(s["hero_size"]), "img": SITE + s["techs"][0]["img"], "chip": s["techs"][0]["name"]} for s in SEGMENTS]))
