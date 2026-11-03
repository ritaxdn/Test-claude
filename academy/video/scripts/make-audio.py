"""
Génère la bande son de la vidéo (100 % synthétisée, libre de droits) :
  public/audio/sfx.wav    bruitages calés sur l'image (scripts/cues.json)
  public/audio/music.wav  nappe musicale 120 BPM, les changements de plan tombent sur les temps

Usage : python3 scripts/make-audio.py   (numpy requis)
Si vous modifiez le minutage des plans (src/Ad.tsx, src/scenes.tsx), mettez à jour scripts/cues.json.
Pas de bip ni de son cardiaque : la ligne ECG est un signal de marque uniquement.
"""
import json
import pathlib
import wave

import numpy as np

SR = 48000
DUR = 30.0
N = int(SR * DUR)
ROOT = pathlib.Path(__file__).resolve().parent.parent
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(SR * d)) / SR


def lowpass(x, cutoff):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def bandpass_sweep(noise, f0, f1, q=3.0, steps=24):
    """Bruit filtré par une bande qui glisse de f0 à f1 (par blocs, fondus)."""
    out = np.zeros_like(noise)
    n = len(noise)
    blk = n // steps
    win = np.hanning(blk * 2)
    for i in range(steps):
        a = max(0, i * blk - blk // 2)
        seg = noise[a : a + blk * 2]
        if len(seg) < 8:
            continue
        fc = f0 * (f1 / f0) ** (i / (steps - 1))
        X = np.fft.rfft(seg)
        f = np.fft.rfftfreq(len(seg), 1 / SR)
        bw = fc / q
        X *= np.exp(-0.5 * ((f - fc) / bw) ** 2)
        y = np.fft.irfft(X, len(seg)) * win[: len(seg)]
        out[a : a + len(y)] += y
    return out / (np.max(np.abs(out)) + 1e-9)


def env(n, attack, release, curve=3.0):
    e = np.ones(n)
    a = max(1, int(attack * SR))
    e[:a] = np.linspace(0, 1, a) ** 2
    r = np.linspace(1, 0, n - a) ** curve
    e[a:] = r
    return e


# ------------------------------ Bruitages ------------------------------- #

def whoosh(d=0.55, up=True):
    n = int(SR * d)
    nz = rng.standard_normal(n)
    y = bandpass_sweep(nz, 400 if up else 3000, 3000 if up else 400)
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    return y * e * 0.55


def pop(pitch=1.0):
    t = t_(0.16)
    f = (720 * np.exp(-t * 28) + 260) * pitch
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * env(len(t), 0.002, 0.15, 4)
    body = lowpass(rng.standard_normal(len(t)), 1800) * env(len(t), 0.001, 0.04, 6) * 0.15
    return (y * 0.5 + body) * 0.8


def click():
    t = t_(0.05)
    tick = np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 220)
    nz = rng.standard_normal(len(t)) * np.exp(-t * 600)
    low = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 90) * 0.6
    return (tick * 0.35 + nz * 0.25 + low * 0.5) * 0.9


def key():
    t = t_(0.035)
    nz = rng.standard_normal(len(t)) * np.exp(-t * 500)
    tick = np.sin(2 * np.pi * rng.uniform(1700, 2300) * t) * np.exp(-t * 300)
    return (nz * 0.18 + tick * 0.12) * rng.uniform(0.7, 1.0)


def glass(base=1318.5, d=1.4, amp=0.32):
    """Scintillement de verre (partiels inharmoniques), doux — pas un bip."""
    t = t_(d)
    y = np.zeros_like(t)
    for ratio, a, dec in [(1, 1, 3.2), (2.76, 0.45, 5), (5.4, 0.22, 8), (1.5, 0.35, 4)]:
        y += a * np.sin(2 * np.pi * base * ratio * t + rng.uniform(0, 6)) * np.exp(-t * dec)
    return y * env(len(t), 0.004, 1, 1) * amp


def shimmer(d=1.6):
    t = t_(d)
    y = np.zeros_like(t)
    for fq in [1567.98, 1975.53, 2349.32, 2637.0]:
        y += np.sin(2 * np.pi * fq * t + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(5, 9) * t))
    e = np.sin(np.linspace(0, np.pi, len(t))) ** 2
    return y * e * 0.045


def riser(d=1.0):
    t = t_(d)
    f = 180 * (7 ** (t / d))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) * 0.18 + np.sin(ph * 1.5) * 0.08
    nz = bandpass_sweep(rng.standard_normal(len(t)), 500, 6000) * 0.35
    e = (t / d) ** 2.2
    return (tone + nz) * e * 0.7


def impact():
    t = t_(1.6)
    f = 70 * np.exp(-t * 3) + 42
    ph = 2 * np.pi * np.cumsum(f) / SR
    sub = np.sin(ph) * np.exp(-t * 2.2)
    nz = lowpass(rng.standard_normal(len(t)), 900) * np.exp(-t * 14) * 0.3
    return (sub * 0.75 + nz) * 0.85


SFX = {
    "whoosh": lambda: whoosh(),
    "whoosh_down": lambda: whoosh(0.5, up=False),
    "pop": lambda: pop(),
    "pop_low": lambda: pop(0.75),
    "pop_high": lambda: pop(1.3),
    "click": click,
    "key": key,
    "glass": lambda: glass(),
    "glass_big": lambda: glass(1046.5, 2.2, 0.42) + np.pad(glass(1568, 1.8, 0.25), (int(0.08 * SR), int(0.32 * SR)))[: int(2.2 * SR)],
    "shimmer": shimmer,
    "riser": riser,
    "impact": impact,
}


def place(track, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= track.shape[0]:
        return
    sig = sig[: track.shape[0] - i] * gain
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    track[i : i + len(sig), 0] += sig * l * 1.41
    track[i : i + len(sig), 1] += sig * r * 1.41


def build_sfx():
    cues = json.loads((ROOT / "scripts" / "cues.json").read_text())
    tr = np.zeros((N, 2))
    for c in cues["cues"]:
        sig = SFX[c["sfx"]]()
        place(tr, sig, c["t"], c.get("gain", 1.0), c.get("pan", 0.0))
    # Frappe du mot de passe : une touche par point affiché.
    k = cues["typing"]
    for j in range(k["count"]):
        place(tr, key(), k["from"] + j * (k["to"] - k["from"]) / k["count"], 1.0, rng.uniform(-0.2, 0.2))
    return tr


# ------------------------------- Musique -------------------------------- #

BPM = 120
BEAT = 60 / BPM


def note(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def pad_chord(midis, d):
    t = t_(d)
    y = np.zeros_like(t)
    for m in midis:
        for det in (-0.06, 0.0, 0.06):
            fq = note(m + det)
            y += np.sin(2 * np.pi * fq * t + rng.uniform(0, 6)) + 0.25 * np.sin(4 * np.pi * fq * t)
    y /= len(midis) * 3
    a = int(0.35 * SR)
    e = np.ones_like(t)
    e[:a] = np.linspace(0, 1, a)
    e[-a:] = np.linspace(1, 0, a)
    return lowpass(y, 2200) * e


def kick():
    t = t_(0.45)
    f = 120 * np.exp(-t * 30) + 48
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) * 0.9


def hat():
    t = t_(0.08)
    nz = rng.standard_normal(len(t))
    X = np.fft.rfft(nz)
    fr = np.fft.rfftfreq(len(nz), 1 / SR)
    X[fr < 7000] = 0
    return lowpass(np.fft.irfft(X, len(nz)), 12000) * np.exp(-t * 70) * 0.12


def pluck(midi, d=0.4):
    t = t_(d)
    fq = note(midi)
    y = np.sin(2 * np.pi * fq * t) * 0.6 + np.sin(4 * np.pi * fq * t) * 0.2 + np.sin(6 * np.pi * fq * t) * 0.08
    return y * np.exp(-t * 9) * 0.35


def build_music():
    tr = np.zeros((N, 2))
    # Progression lumineuse (Ré majeur, couleur lydienne) — 2 mesures par accord.
    chords = [[50, 57, 64, 66, 69], [47, 54, 62, 66, 69], [43, 50, 59, 62, 66], [45, 52, 61, 64, 68]]
    bar = 4 * BEAT
    i = 0
    tpos = 0.0
    while tpos < DUR:
        sig = pad_chord(chords[i % 4], 2 * bar + 0.4)
        place(tr, sig * 0.22, tpos, pan=0)
        tpos += 2 * bar
        i += 1
    beats = int(DUR / BEAT)
    arp = [62, 66, 69, 74, 73, 69, 66, 69]
    for b in range(beats):
        tb = b * BEAT
        # Rythmique à partir de l'invitation (5 s), coupure pour l'arrivée de la signature.
        if 5.0 <= tb < 25.5:
            place(tr, kick(), tb, 0.55)
            place(tr, hat(), tb + BEAT / 2, 0.5, 0.3)
            if b % 2 == 1:
                place(tr, hat(), tb + BEAT * 0.75, 0.25, -0.3)
        if 2.5 <= tb < 26.0:
            for h in range(2):
                place(tr, pluck(arp[(b * 2 + h) % len(arp)] + 12), tb + h * BEAT / 2, 0.55, -0.35 if h else 0.35)
    # Final : un dernier accord tenu sur la signature.
    place(tr, pad_chord([50, 57, 62, 66, 69, 76], 3.6) * 0.3, 26.5)
    place(tr, kick(), 26.5, 0.8)
    # Fondu de sortie.
    fade = int(1.2 * SR)
    tr[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return tr


def write(path, x, peak=0.89):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(path.relative_to(ROOT))


if __name__ == "__main__":
    write(ROOT / "public" / "audio" / "sfx.wav", build_sfx(), 0.95)
    write(ROOT / "public" / "audio" / "music.wav", build_music(), 0.9)
