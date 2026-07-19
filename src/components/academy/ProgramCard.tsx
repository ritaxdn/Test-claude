import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { AcademyProgram } from "@/content/academy";
import type { Locale } from "@/lib/i18n/config";

export function ProgramCard({
  program,
  locale,
}: {
  program: AcademyProgram;
  locale: Locale;
}) {
  return (
    <div className="flex flex-col justify-between border border-hairline bg-warm-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(26,24,20,0.18)]">
      <div>
        <Badge>{program.level[locale]}</Badge>
        <h3 className="font-heading mt-4 text-2xl font-light text-ink">
          {program.title[locale]}
        </h3>
        <p className="font-body mt-3 text-sm font-light leading-relaxed text-ink-soft">
          {program.description[locale]}
        </p>
        <ul className="mt-5 flex flex-col gap-2">
          {program.topics.map((topic, i) => (
            <li key={i} className="font-body text-sm font-light text-ink-soft">
              — {topic[locale]}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 flex items-center gap-5 border-t border-hairline pt-5 font-label text-muted" style={{ fontSize: "10px", letterSpacing: "0.08em" }}>
        <span className="flex items-center gap-1.5">
          <Clock size={13} />
          {program.duration[locale]}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={13} />
          {program.format[locale]}
        </span>
      </div>
    </div>
  );
}
