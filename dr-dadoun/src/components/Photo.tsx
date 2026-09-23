import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  /** Dégradé utilisé tant que la photo n'est pas fournie (mesh-0 … mesh-5). */
  fallback?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** Photo en plein cadre (le parent doit être `relative`), ou dégradé cyan de remplacement. */
export function Photo({ src, alt, fallback = 1, sizes = "100vw", priority, className = "" }: Props) {
  if (!src) return <div className={`absolute inset-0 mesh-${fallback} ${className}`} aria-hidden="true" />;
  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />
  );
}
