import { useId } from "react";

const nodes = [
  { x: 60, y: 120 }, { x: 180, y: 60 }, { x: 300, y: 140 }, { x: 420, y: 70 },
  { x: 540, y: 160 }, { x: 660, y: 90 }, { x: 740, y: 200 }, { x: 100, y: 280 },
  { x: 260, y: 320 }, { x: 400, y: 260 }, { x: 560, y: 340 }, { x: 690, y: 300 },
  { x: 180, y: 440 }, { x: 340, y: 480 }, { x: 500, y: 440 }, { x: 640, y: 460 },
];

const edges: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [0, 7], [1, 8], [2, 9], [4, 10], [5, 11],
  [7, 8], [8, 9], [9, 10], [10, 11],
  [7, 12], [8, 13], [9, 14], [10, 15],
  [12, 13], [13, 14], [14, 15],
];

const highlightEdges = new Set(["2-9", "8-13", "9-14"]);

/** Generative node-network line art — stands in for scientific/molecular photography. */
export function CircuitLines({ className }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 800 600"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--rainbow-1)" />
          <stop offset="50%" stopColor="var(--rainbow-3)" />
          <stop offset="100%" stopColor="var(--rainbow-5)" />
        </linearGradient>
      </defs>

      {edges.map(([a, b]) => {
        const key = `${a}-${b}`;
        const isHighlight = highlightEdges.has(key);
        return (
          <line
            key={key}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={isHighlight ? `url(#${gradientId})` : "currentColor"}
            strokeOpacity={isHighlight ? 0.8 : 0.18}
            strokeWidth={isHighlight ? 1.5 : 1}
          />
        );
      })}

      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i % 4 === 0 ? 4 : 2.5}
          fill="currentColor"
          opacity={i % 4 === 0 ? 0.9 : 0.4}
        />
      ))}
    </svg>
  );
}
