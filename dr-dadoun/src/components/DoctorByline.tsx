import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/Photo";
import { about, doctor, practice } from "@/content/site";
import { image } from "@/lib/images";

/** Qui vous reçoit : relie chaque page de soin à la page du médecin. */
export function DoctorByline() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-center md:p-8">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
        <Photo src={image("docteur.jpg")} alt={`Portrait du ${doctor.fullName}`} fallback={2} sizes="64px" className="object-[50%_15%]" />
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">Votre médecin</p>
        <p className="mt-1 font-display text-xl font-medium">{doctor.fullName}</p>
        <p className="text-sm text-ink-soft">
          {doctor.role} · {practice.city}
          {about.affiliations[0] && <> · Formateur de médecins</>}
        </p>
      </div>
      <Link href={doctor.path} className="inline-flex items-center gap-2 text-sm font-medium text-accent-deep hover:text-ink">
        Parcours & reconnaissances <ArrowRight size={14} />
      </Link>
    </div>
  );
}
