import { ArrowUpRight } from "lucide-react";
import { Heading } from "@/components/system/Heading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

type Member = {
  name: string;
  role: string;
  bio: string;
  credentials: readonly string[];
  url: string;
  linkLabel: string;
  sameAs: readonly string[];
};

export function Faculty({ eyebrow, title, members }: { eyebrow: string; title: string; members: readonly Member[] }) {
  const jsonLd = members.map((m) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: m.role.split(" · ")[0],
    url: m.url,
    sameAs: m.sameAs,
  }));
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={eyebrow} title={title} />
        <RevealGroup className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {members.map((m) => (
            <RevealItem key={m.name} className="glass rounded-[1.75rem] p-7 md:p-9">
              <h3 className="display text-2xl text-deep">{m.name}</h3>
              <p className="mt-1 font-sans text-sm text-deep-soft">{m.role}</p>
              <p className="mt-5 font-sans text-sm leading-relaxed text-deep-soft">{m.bio}</p>
              <ul className="mt-5 space-y-2 border-t border-deep/10 pt-5 font-sans text-sm text-deep">
                {m.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <a
                href={m.url}
                target="_blank"
                rel="noopener"
                className="glass-soft mt-6 inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-sm text-deep transition-colors hover:bg-white"
              >
                {m.linkLabel} <ArrowUpRight size={14} />
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
