import {
  Activity,
  AudioLines,
  CircuitBoard,
  Droplets,
  Dumbbell,
  Flame,
  Layers,
  PackageCheck,
  PersonStanding,
  Radar,
  ScanFace,
  Snowflake,
  Sparkles,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  PersonStanding,
  Zap,
  Waves,
  Radar,
  AudioLines,
  Snowflake,
  Dumbbell,
  ScanFace,
  Droplets,
  CircuitBoard,
  Flame,
  Activity,
  Layers,
  PackageCheck,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
