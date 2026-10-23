"""Détoure les photos studio (fond noir) pour la newsletter : pip install rembg, puis python3 cut.py (sortie : <slug>.png, convertie ensuite en .webp)."""
import sys
from pathlib import Path
from rembg import remove, new_session
from PIL import Image
SRC = Path("/home/user/Test-claude/public/images/technologies")
files = {"hanover-5g": "v2-00.jpg", "sevenwaves": "00.jpg", "pressoligne-5": "00.jpg", "tanita": "00.jpg", "la-queen": "v2-00.jpg", "slimax-lipo-7": "00.jpg"}
sess = new_session(sys.argv[1] if len(sys.argv) > 1 else "isnet-general-use")
for slug, f in files.items():
    im = Image.open(SRC / slug / f).convert("RGB")
    out = remove(im, session=sess, post_process_mask=True)
    bbox = out.getbbox(); out = out.crop(bbox)
    out.save(f"{slug}.png"); print(slug, out.size)
