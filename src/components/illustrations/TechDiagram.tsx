"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import type { VisualMotif } from "@/lib/types";

type TechDiagramProps = {
  motif: VisualMotif;
  className?: string;
  tone?: "on-paper" | "on-ink";
  active?: boolean;
};

const SIZE = 400;
const CENTER = SIZE / 2;

function polarPoint(cx: number, cy: number, radius: number, angleDeg: number) {
  const angle = (angleDeg * Math.PI) / 180;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)] as const;
}

function arcPath(radius: number, startDeg: number, endDeg: number) {
  const [sx, sy] = polarPoint(CENTER, CENTER, radius, startDeg);
  const [ex, ey] = polarPoint(CENTER, CENTER, radius, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${radius} ${radius} 0 ${large} 1 ${ex} ${ey}`;
}

/**
 * Parametric, motif-driven technical diagram used everywhere a real product
 * photograph would normally sit. Pure SVG (crisp at any size, near-zero
 * weight) so it doubles as the site's visual identity for machines we don't
 * have official photography for yet.
 */
export function TechDiagram({ motif, className, tone = "on-paper", active = true }: TechDiagramProps) {
  const rootRef = useRef<SVGSVGElement>(null);
  const stroke = tone === "on-ink" ? "#f6f3ee" : "#0b0b0c";
  const accent = "#96703f";
  const faint = tone === "on-ink" ? "rgba(246,243,238,0.25)" : "rgba(11,11,12,0.16)";

  useGSAP(
    () => {
      if (!active) return;
      const root = rootRef.current;
      if (!root) return;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const drawables = root.querySelectorAll<SVGPathElement | SVGCircleElement>("[data-draw]");
      drawables.forEach((el) => {
        const length =
          "getTotalLength" in el && typeof (el as SVGPathElement).getTotalLength === "function"
            ? (el as SVGPathElement).getTotalLength()
            : 0;
        if (length) {
          el.style.strokeDasharray = `${length}`;
          el.style.strokeDashoffset = prefersReducedMotion ? "0" : `${length}`;
        }
      });

      if (prefersReducedMotion) {
        gsap.set(root.querySelectorAll("[data-fade]"), { opacity: 1, scale: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(drawables, { strokeDashoffset: 0, duration: 1.4, stagger: 0.12 }, 0);
      tl.from(root.querySelectorAll("[data-fade]"), { opacity: 0, scale: 0.85, stagger: 0.06, duration: 0.8 }, 0.2);

      if (motif === "pulse" || motif === "wave") {
        tl.to(
          root.querySelectorAll("[data-pulse]"),
          {
            scale: 1.06,
            opacity: 0.55,
            transformOrigin: "center",
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.3,
          },
          1.2
        );
      }

      if (motif === "scan") {
        tl.to(
          root.querySelector("[data-scanline]"),
          { y: 260, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" },
          1
        );
      }
    },
    { scope: rootRef, dependencies: [motif, active] }
  );

  return (
    <svg
      ref={rootRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={className}
      aria-hidden
      fill="none"
    >
      <rect x={0.5} y={0.5} width={SIZE - 1} height={SIZE - 1} stroke={faint} strokeWidth={1} />

      {motif === "wave" && (
        <g>
          {[60, 105, 150, 195].map((radius, index) => (
            <path
              key={radius}
              data-draw
              data-pulse={index % 2 === 0 ? true : undefined}
              d={arcPath(radius, -140, 140)}
              stroke={index === 1 ? accent : stroke}
              strokeWidth={index === 1 ? 2 : 1}
              opacity={0.9 - index * 0.15}
            />
          ))}
          <circle data-fade cx={CENTER} cy={CENTER} r={5} fill={accent} />
        </g>
      )}

      {motif === "beam" && (
        <g>
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = -35 + i * 12;
            const [x1, y1] = polarPoint(CENTER, 70, 260, angle);
            return (
              <path
                key={i}
                data-draw
                d={`M ${CENTER} 70 L ${x1} ${y1}`}
                stroke={i === 3 ? accent : stroke}
                strokeWidth={i === 3 ? 2 : 1}
                opacity={i === 3 ? 1 : 0.45}
              />
            );
          })}
          <circle data-fade cx={CENTER} cy={70} r={6} fill={accent} />
        </g>
      )}

      {motif === "thermal" && (
        <g>
          {[170, 130, 90, 50].map((radius, index) => (
            <circle
              key={radius}
              data-draw
              data-fade
              cx={CENTER}
              cy={CENTER}
              r={radius}
              stroke={index === 3 ? accent : stroke}
              strokeWidth={index === 3 ? 2 : 1}
              opacity={0.85 - index * 0.12}
            />
          ))}
        </g>
      )}

      {motif === "scan" && (
        <g>
          <rect data-draw x={90} y={70} width={220} height={260} stroke={stroke} strokeWidth={1} opacity={0.5} />
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((__, col) => (
              <circle
                key={`${row}-${col}`}
                data-fade
                cx={120 + col * 40}
                cy={100 + row * 42}
                r={3}
                fill={stroke}
                opacity={0.35}
              />
            ))
          )}
          <rect data-scanline x={90} y={70} width={220} height={2} fill={accent} />
        </g>
      )}

      {motif === "flow" && (
        <g>
          <path
            data-draw
            d={`M 60 ${CENTER + 40} C 140 ${CENTER - 60}, 260 ${CENTER + 100}, 340 ${CENTER - 20}`}
            stroke={accent}
            strokeWidth={2}
          />
          <path
            data-draw
            d={`M 60 ${CENTER} C 140 ${CENTER - 90}, 260 ${CENTER + 70}, 340 ${CENTER - 50}`}
            stroke={stroke}
            strokeWidth={1}
            opacity={0.5}
          />
          <path
            data-draw
            d={`M 60 ${CENTER + 80} C 140 ${CENTER - 30}, 260 ${CENTER + 130}, 340 ${CENTER + 10}`}
            stroke={stroke}
            strokeWidth={1}
            opacity={0.35}
          />
        </g>
      )}

      {motif === "grid" && (
        <g>
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 8 }).map((__, col) => {
              const isAccent = row === col || row + col === 7;
              return (
                <circle
                  key={`${row}-${col}`}
                  data-fade
                  cx={90 + col * 31}
                  cy={90 + row * 31}
                  r={isAccent ? 4 : 2.5}
                  fill={isAccent ? accent : stroke}
                  opacity={isAccent ? 0.9 : 0.3}
                />
              );
            })
          )}
        </g>
      )}

      {motif === "pulse" && (
        <g>
          {[40, 80, 120, 160].map((radius, index) => (
            <circle
              key={radius}
              data-draw
              data-pulse
              cx={CENTER}
              cy={CENTER}
              r={radius}
              stroke={index === 0 ? accent : stroke}
              strokeWidth={index === 0 ? 2 : 1}
              opacity={0.85 - index * 0.15}
            />
          ))}
        </g>
      )}

      {motif === "mechanical" && (
        <g>
          <rect data-draw x={100} y={110} width={200} height={120} stroke={stroke} strokeWidth={1.5} opacity={0.8} />
          <rect data-draw x={130} y={90} width={140} height={20} stroke={accent} strokeWidth={2} />
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              data-draw
              d={`M ${115 + i * 55} 230 L ${115 + i * 55} 260`}
              stroke={stroke}
              strokeWidth={1.5}
              opacity={0.6}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
