import { Clock, MapPin } from "lucide-react";
import type { AcademyProgram } from "@/content/academy";
import type { Locale } from "@/lib/i18n/config";

export function ProgramCard({
  program,
  locale,
  index,
}: {
  program: AcademyProgram;
  locale: Locale;
  index: number;
}) {
  return (
    <div className="group grid grid-cols-1 gap-6 border-b border-hairline py-10 transition-colors duration-500 md:grid-cols-12 md:gap-8">
      <div className="flex items-start gap-5 md:col-span-4">
        <span
          className="font-label mt-1 shrink-0 text-muted"
          style={{ fontSize: "12px", letterSpacing: "0.1em" }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <div>
          <span
            className="font-label text-rainbow-2"
            style={{ fontSize: "10px", letterSpacing: "0.12em" }}
          >
            {program.level[locale].toUpperCase()}
          </span>
          <h3 className="font-heading mt-2 text-2xl font-light text-ink md:text-3xl">
            {program.title[locale]}
          </h3>
        </div>
      </div>

      <div className="md:col-span-5">
        <p className="font-body text-sm font-light leading-relaxed text-ink-soft">
          {program.description[locale]}
        </p>
        <ul className="mt-4 flex flex-col gap-1.5">
          {program.topics.map((topic, i) => (
            <li key={i} className="font-body text-sm font-light text-ink-soft">
              — {topic[locale]}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="flex gap-5 font-label text-muted md:col-span-3 md:flex-col md:items-end md:text-right"
        style={{ fontSize: "10px", letterSpacing: "0.08em" }}
      >
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
