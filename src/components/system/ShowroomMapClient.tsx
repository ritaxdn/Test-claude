"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { geoGraticule, geoOrthographic, geoPath } from "d3-geo";
import { cn } from "@/lib/utils";

export type MapPoint = {
  id: string;
  lon: number;
  lat: number;
  city: string;
  country: string;
  address: string;
  hq: boolean;
  morocco: boolean;
  coords: string;
};

const W = 1000;
const H = 700;
const R = 320; // rayon du globe dans le repère 1000 × 700
const TILT = -24; // inclinaison : le globe regarde vers 24° N
const SPEED = 6; // rotation automatique, en degrés par seconde
const PAUSE_MS = 6000; // pause de la rotation après un clic sur une ville

// Étiquettes des villes hors Maroc (dx négatif = nom à gauche du point).
const LABEL: Record<string, [number, number]> = { paris: [14, -6], dakar: [-14, 5], jeddah: [14, 5] };

const rad = Math.PI / 180;
const unit = (lon: number, lat: number) => [Math.cos(lat * rad) * Math.cos(lon * rad), Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad)];

/** Globe de verre qui tourne sur lui-même : trame des terres, grands cercles depuis le siège, fiche au clic. */
export function ShowroomMapClient({
  land,
  highlight,
  points,
  labels,
  contactHref,
}: {
  land: number[];
  highlight: number[];
  points: MapPoint[];
  labels: { hq: string; onRequest: string; cta: string; list: string };
  contactHref: string;
}) {
  const uid = useId().replace(/:/g, "");
  const hq = points.find((p) => p.hq) ?? points[0];
  const [active, setActive] = useState(hq.id);
  const current = points.find((p) => p.id === active) ?? hq;

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRefs = useRef<Record<string, SVGGElement | null>>({});
  const maLabelRef = useRef<SVGTextElement>(null);
  // Longitude au centre de la vue, cible (après un clic) et fin de pause.
  // `pause` : durée de pause demandée (appliquée à la prochaine image).
  const view = useRef({ lon: -10, target: null as number | null, pausedUntil: 0, pause: null as number | null });
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Sélection d'une ville : le globe tourne pour l'amener face à nous.
  const select = (id: string) => {
    const p = points.find((x) => x.id === id);
    if (!p) return;
    setActive(id);
    view.current.target = -p.lon;
    view.current.pause = PAUSE_MS;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const projection = geoOrthographic().scale(R).translate([W / 2, H / 2 + 10]).clipAngle(90).precision(0.5);
    const path = geoPath(projection, ctx);
    const graticule = geoGraticule().step([15, 15])();
    const landV = [] as number[][];
    for (let i = 0; i < land.length; i += 2) landV.push(unit(land[i] / 10, land[i + 1] / 10));
    const hiV = [] as number[][];
    for (let i = 0; i < highlight.length; i += 2) hiV.push(unit(highlight[i] / 10, highlight[i + 1] / 10));
    const ptsV = points.map((p) => unit(p.lon, p.lat));
    const ma = points.filter((p) => p.morocco);

    let scale = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      scale = (w / W) * dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round((w * H) / W * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const draw = () => {
      const v = view.current;
      projection.rotate([v.lon, TILT]);
      // Vecteur « face à nous » pour savoir quels points sont visibles, et à quel point ils sont de profil.
      const c = unit(-v.lon, -TILT);
      const dot = (u: number[]) => u[0] * c[0] + u[1] * c[1] + u[2] * c[2];

      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, W, H);

      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = "rgba(29,27,38,0.07)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      const drawDots = (vs: number[][], raw: number[], color: (a: number) => string, size: number) => {
        for (let i = 0; i < vs.length; i++) {
          const d = dot(vs[i]);
          if (d <= 0.02) continue;
          const xy = projection([raw[i * 2] / 10, raw[i * 2 + 1] / 10]);
          if (!xy) continue;
          ctx.fillStyle = color(0.25 + 0.75 * d);
          ctx.fillRect(xy[0] - size / 2, xy[1] - size / 2, size, size);
        }
      };
      drawDots(landV, land, (a) => `rgba(29,27,38,${(0.22 * a).toFixed(3)})`, 2.2);
      drawDots(hiV, highlight, (a) => `rgba(123,97,255,${(0.9 * a).toFixed(3)})`, 2.8);

      // Grands cercles depuis le siège.
      for (const p of points) {
        if (p.id === hq.id) continue;
        const on = p.id === activeRef.current;
        ctx.beginPath();
        path({ type: "LineString", coordinates: [[hq.lon, hq.lat], [p.lon, p.lat]] });
        ctx.setLineDash([3, 5]);
        ctx.lineDashOffset = -((performance.now() / 60) % 8);
        ctx.strokeStyle = on ? "rgba(233,30,140,0.95)" : "rgba(123,97,255,0.75)";
        ctx.lineWidth = on ? 2 : 1.4;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Repères des villes (SVG superposé) : position suivie, masqués à l'arrière du globe.
      let mx = Infinity;
      let my = 0;
      let maVisible = false;
      points.forEach((p, i) => {
        const g = markerRefs.current[p.id];
        if (!g) return;
        const d = dot(ptsV[i]);
        const xy = projection([p.lon, p.lat]);
        if (!xy || d <= 0.05) {
          g.style.opacity = "0";
          g.style.pointerEvents = "none";
          return;
        }
        g.setAttribute("transform", `translate(${xy[0].toFixed(1)} ${xy[1].toFixed(1)})`);
        g.style.opacity = String(Math.min(1, d * 2.5));
        g.style.pointerEvents = "auto";
        if (p.morocco) {
          maVisible = true;
          mx = Math.min(mx, xy[0]);
          my += xy[1] / ma.length;
        }
      });
      const t = maLabelRef.current;
      if (t) {
        const show = maVisible && !ma.some((p) => p.id === activeRef.current);
        t.style.opacity = show ? "1" : "0";
        if (show) {
          t.setAttribute("x", String(mx - 14));
          t.setAttribute("y", String(my + 5));
        }
      }
    };

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const v = view.current;
      if (v.pause !== null) {
        v.pausedUntil = now + v.pause;
        v.pause = null;
      }
      if (v.target !== null) {
        // Rotation vers la ville choisie par le plus court chemin.
        let diff = ((v.target - v.lon + 540) % 360) - 180;
        if (reduce || Math.abs(diff) < 0.3) {
          v.lon = v.target;
          v.target = null;
        } else {
          diff *= Math.min(1, dt * 4);
          v.lon += diff;
        }
      } else if (!reduce && now > v.pausedUntil) {
        v.lon = (v.lon + SPEED * dt) % 360;
      }
      draw();
      if (visible) raf = requestAnimationFrame(tick);
    };

    // N'anime que lorsque le globe est à l'écran.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(wrap);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [land, highlight, points, hq.id, hq.lat, hq.lon]);

  return (
    <div className="glass mt-8 grid overflow-hidden rounded-[1.75rem] lg:grid-cols-[1.7fr_1fr]">
      {/* Globe */}
      <div
        ref={wrapRef}
        className="relative"
        onMouseEnter={() => (view.current.pausedUntil = Number.MAX_SAFE_INTEGER)}
        onMouseLeave={() => (view.current.pause = 1500)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id={`s-${uid}`} cx=".35" cy=".25" r=".85">
              <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
              <stop offset=".55" stopColor="#eef0f6" stopOpacity=".55" />
              <stop offset="1" stopColor="#c9cbe0" stopOpacity=".35" />
            </radialGradient>
          </defs>
          <circle cx={W / 2} cy={H / 2 + 10} r={R + 34} fill="#a797ff" opacity=".06" />
          <circle cx={W / 2} cy={H / 2 + 10} r={R} fill={`url(#s-${uid})`} />
        </svg>
        <canvas ref={canvasRef} className="relative block h-auto w-full" style={{ aspectRatio: `${W} / ${H}` }} />
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label={labels.list}>
          <defs>
            <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00bcd4" />
              <stop offset=".35" stopColor="#7b61ff" />
              <stop offset=".65" stopColor="#e91e8c" />
              <stop offset="1" stopColor="#ff5722" />
            </linearGradient>
            <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".5" stopColor="#a797ff" stopOpacity=".5" />
              <stop offset="1" stopColor="#7fe3f0" stopOpacity=".7" />
            </linearGradient>
            <radialGradient id={`p-${uid}`}>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".35" stopColor="#e91e8c" />
              <stop offset=".7" stopColor="#7b61ff" stopOpacity=".5" />
              <stop offset="1" stopColor="#7b61ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={W / 2} cy={H / 2 + 10} r={R} fill="none" stroke={`url(#rim-${uid})`} strokeWidth="1.5" />
          {/* Reflet du verre */}
          <ellipse cx={W / 2 - 110} cy={H / 2 - 150} rx="120" ry="46" fill="#ffffff" opacity=".35" transform={`rotate(-28 ${W / 2 - 110} ${H / 2 - 150})`} />

          <text ref={maLabelRef} textAnchor="end" className="select-none fill-deep-soft font-sans" style={{ fontSize: 17, opacity: 0 }}>
            {points.find((p) => p.morocco)?.country}
          </text>

          {points.map((p) => {
            const on = p.id === active;
            const showLabel = on || !p.morocco;
            const [dx, dy] = on && p.morocco ? [16, 5] : (LABEL[p.id] ?? [14, 5]);
            return (
              <g
                key={p.id}
                ref={(el) => {
                  markerRefs.current[p.id] = el;
                }}
                role="button"
                tabIndex={0}
                aria-label={`${p.city}, ${p.country}`}
                aria-pressed={on}
                onClick={() => select(p.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && select(p.id)}
                className="cursor-pointer outline-none"
                style={{ opacity: 0 }}
              >
                <circle r="16" fill="transparent" />
                {on && <circle r="8" fill="none" stroke={`url(#g-${uid})`} strokeWidth="1.2" className="map-ping" />}
                <circle r={on ? 9 : 6} fill={`url(#p-${uid})`} />
                <circle r={on ? 3.6 : 2.6} fill="#ffffff" stroke="#1d1b26" strokeOpacity=".3" />
                {showLabel && (
                  <text
                    x={dx}
                    y={dy}
                    textAnchor={dx < 0 ? "end" : "start"}
                    className={cn("select-none font-sans", on ? "fill-deep" : "fill-deep-soft")}
                    style={{ fontSize: on ? 22 : 17, fontWeight: on ? 600 : 400 }}
                  >
                    {p.city}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Fiche + liste */}
      <div className="flex flex-col border-t border-white/70 p-6 md:p-7 lg:border-l lg:border-t-0">
        <div className="glass-strong rounded-[1.5rem] p-6">
          <p className="data-label flex items-center gap-2 text-deep-soft">
            <MapPin size={13} /> {current.country}
            {current.hq && <span className="rounded-full border border-deep/15 px-2 py-0.5 text-[10px]">{labels.hq}</span>}
          </p>
          <p className="display mt-3 text-2xl text-deep">{current.city}</p>
          <p className="data-label mt-2 text-deep-soft">{current.coords}</p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-deep-soft">{current.address || labels.onRequest}</p>
          <Link
            href={contactHref}
            className="group mt-6 inline-flex items-center gap-2 font-sans text-sm text-deep hover:underline"
          >
            {labels.cta} <ArrowUpRight size={14} className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>

        <p className="data-label mt-8 text-deep-soft">{labels.list}</p>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {points.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => select(p.id)}
                className={cn(
                  "w-full rounded-full px-4 py-2 text-left font-sans text-sm transition-colors",
                  p.id === active ? "glass-strong text-deep" : "glass-soft text-deep-soft hover:text-deep"
                )}
              >
                {p.city}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
