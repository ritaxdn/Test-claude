#!/usr/bin/env bash
# Régénère toute la newsletter : textes et images aux polices de la marque, puis le HTML.
# Prérequis : Python 3, Node avec Playwright (Chromium). CHROMIUM_PATH pour un Chromium déjà installé.
set -euo pipefail
cd "$(dirname "$0")"
python3 build.py --collect
node hero/render-text.cjs
python3 hero/jobs.py | node hero/render.cjs
python3 build.py
rm -rf __pycache__ hero/__pycache__
