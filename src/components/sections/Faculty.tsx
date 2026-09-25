import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {members.map((m) => (
            <RevealItem key={m.name} className="border border-hairline bg-warm-white p-8 md:p-10">
              <h3 className="font-heading text-2xl font-light text-ink">{m.name}</h3>
              <p className="font-body mt-1 text-sm text-ink-soft">{m.role}</p>
              <p className="font-body mt-5 text-sm font-light leading-relaxed text-ink-soft">{m.bio}</p>
              <ul className="font-body mt-5 space-y-2 text-sm font-light text-ink-soft">
                {m.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <a
                href={m.url}
                target="_blank"
                rel="noopener"
                className="font-body mt-6 inline-flex items-center gap-1.5 text-sm text-ink underline-offset-4 hover:underline"
              >
                {m.linkLabel} <ArrowUpRight size={14} />
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
