"""Images à rendre pour la newsletter (lues dans build.py) : un en-tête par segment, une scène par machine."""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from build import SEGMENTS  # noqa: E402

CUTOUTS = HERE.parent / "cutouts"
# Halo de chaque scène : couleurs iris pastel de la marque (cyan, violet, rose, pêche).
GLOWS = [("rgba(127,227,240,.65)", "rgba(167,151,255,.35)"), ("rgba(167,151,255,.6)", "rgba(242,155,208,.35)"),
         ("rgba(242,155,208,.55)", "rgba(255,197,143,.35)"), ("rgba(255,197,143,.6)", "rgba(127,227,240,.35)")]


def cutout(t):
    return (CUTOUTS / f"{t['slug']}.webp").as_uri()


jobs, seen = [], set()
for s in SEGMENTS:
    t0 = s["techs"][0]
    jobs.append({"page": "hero", "out": f"hero-{s['key']}.jpg", "lab": s["edition"], "a": s["title_a"], "b": s["title_b"],
                 "fs": str(s["hero_size"]), "img": cutout(t0), "chip": t0["name"], **({"wide": "1"} if t0.get("wide") else {})})
    for i, t in enumerate(s["techs"]):
        if t["slug"] in seen:
            continue
        seen.add(t["slug"])
        c, c2 = GLOWS[len(seen) % len(GLOWS)]
        jobs.append({"page": "stage", "out": f"machine-{t['slug']}.jpg", "n": f"0{i + 1}", "c": c, "c2": c2, "r": str(90 * len(seen)), "img": cutout(t),
                     **({"wide": "1"} if t.get("wide") else {})})
print(json.dumps(jobs))
