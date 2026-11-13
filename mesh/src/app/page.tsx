import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Hammer, Handshake, Lightbulb, MessageSquare, Rocket, ShieldCheck, TrendingUp } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";

const personas = [
  {
    icon: Lightbulb,
    title: "Founders",
    body: "Post your project, list the roles you need, and review people who raise their hand.",
  },
  {
    icon: Hammer,
    title: "Builders",
    body: "Browse projects by sector, stage and role. Say you're interested in the ones worth your nights.",
  },
  {
    icon: TrendingUp,
    title: "Investors",
    body: "Meet teams early, on their terms. Conversations open only when both sides agree.",
  },
];

const steps = [
  { icon: Rocket, title: "Create your profile", body: "Roles, skills, interests, availability and commitment." },
  { icon: Handshake, title: "Interested or pass", body: "Signal interest with a short note. Owners accept or decline." },
  { icon: MessageSquare, title: "Talk once it's mutual", body: "Messaging unlocks only after both sides say yes." },
];

export default async function LandingPage() {
  if (await getUser()) redirect("/discover");

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <div aria-hidden className="mesh-glow pointer-events-none absolute inset-x-0 top-0 h-[640px]" />
      <div aria-hidden className="mesh-grid pointer-events-none absolute inset-x-0 top-0 h-[640px]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Get started</Link>
          </Button>
        </nav>
      </header>

      <main className="relative">
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-20 text-center sm:px-6 sm:pt-24 sm:pb-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1 text-xs font-medium text-accent-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" /> Startup matchmaking, without the noise
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            Find the people who&nbsp;make your startup{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              real
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            MESH connects founders, builders and investors around concrete projects. Show interest, get accepted, and
            start the conversation.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">
                Create your profile <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
          {personas.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-3xl border border-border/80 bg-card p-6 shadow-[0_12px_40px_-24px_oklch(0.3_0.1_293/0.3)]"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-tight">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">How MESH works</h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative flex gap-4 sm:flex-col">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_oklch(0.52_0.22_293/0.7)]">
                  {i + 1}
                </div>
                <div>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Icon className="size-4 text-primary" /> {title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-16 flex max-w-xl items-start gap-3 rounded-2xl border border-border bg-card/70 p-5 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <p>
              Your inbox stays yours. Nobody can message you until you&apos;ve accepted them, and private projects are
              only visible to you and your matches.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
        MESH · Built for people starting things.
      </footer>
    </div>
  );
}
