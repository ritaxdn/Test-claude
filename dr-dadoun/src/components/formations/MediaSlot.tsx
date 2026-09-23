import { Camera } from "lucide-react";
import { Photo } from "@/components/Photo";
import { image, video } from "@/lib/images";

type Props = {
  image?: string; // nom du fichier dans public/images/
  video?: string; // nom du fichier dans public/videos/ (prioritaire s'il existe)
  label: string;
  className?: string; // doit fixer la taille / le ratio
  tone?: "light" | "dark";
  sizes?: string;
};

/** Zone photo/vidéo. Tant qu'aucun fichier n'est fourni, affiche un emplacement sobre et explicite. */
export function MediaSlot({ image: img, video: vid, label, className = "", tone = "light", sizes }: Props) {
  const videoSrc = vid ? video(vid) : null;
  const imageSrc = img ? image(img) : null;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {videoSrc ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          poster={imageSrc ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          aria-label={label}
        />
      ) : imageSrc ? (
        <Photo src={imageSrc} alt={label} sizes={sizes} />
      ) : (
        <div
          className={`absolute inset-0 flex items-end p-5 ${
            tone === "dark" ? "bg-white/[0.04] text-white/55" : "bg-sand text-muted"
          }`}
          role="img"
          aria-label={`${label} (photo à venir)`}
        >
          <div
            className={`absolute inset-0 ${tone === "dark" ? "opacity-[0.07]" : "opacity-60"}`}
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              color: tone === "dark" ? "#ffffff" : "#dde7ea",
            }}
            aria-hidden="true"
          />
          <span
            className={`relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${
              tone === "dark" ? "border border-white/15" : "border border-line bg-white"
            }`}
          >
            <Camera size={13} strokeWidth={1.75} /> Photo à venir · {label}
          </span>
        </div>
      )}
    </div>
  );
}
