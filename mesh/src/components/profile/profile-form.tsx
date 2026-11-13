"use client";

import { useFormAction } from "@/hooks/use-form-action";
import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { FormAlert } from "@/components/ui/misc";
import { ChipGroup, TagInput } from "@/components/ui/chip-group";
import { AVAILABILITY, COMMITMENT, INDUSTRIES, ROLES, SKILL_SUGGESTIONS } from "@/lib/constants";
import { saveProfile } from "@/lib/actions/profile";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "About you", description: "How should others on MESH know you?", fields: ["full_name", "headline", "location"] },
  { title: "What you bring", description: "Roles, skills and the sectors you care about.", fields: ["roles", "skills", "interests"] },
  { title: "Your availability", description: "Set expectations before the first conversation.", fields: ["availability", "commitment", "bio"] },
] as const;

export function ProfileForm({ profile, mode }: { profile: Profile; mode: "onboarding" | "edit" }) {
  const [state, onSubmit, pending] = useFormAction(saveProfile);
  const [step, setStep] = React.useState(0);
  const [clientError, setClientError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const wizard = mode === "onboarding";
  const fe = state && !state.ok ? state.fieldErrors : undefined;

  // When a new server response arrives with field errors, jump to the first step that has one.
  const [seenState, setSeenState] = React.useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (wizard && fe) {
      const idx = STEPS.findIndex((s) => s.fields.some((f) => fe[f]?.length));
      if (idx >= 0) setStep(idx);
    }
  }

  React.useEffect(() => {
    if (state?.ok && state.message) toast.success(state.message);
  }, [state]);

  const validateStep = () => {
    const fd = new FormData(formRef.current!);
    if (step === 0 && !String(fd.get("full_name") ?? "").trim()) return "Tell us your name.";
    if (step === 1 && fd.getAll("roles").length === 0) return "Pick at least one role.";
    return null;
  };

  const next = () => {
    const err = validateStep();
    setClientError(err);
    if (!err) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const section = (i: number) => cn("grid gap-6", wizard && step !== i && "hidden");

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="grid gap-8"
      onKeyDown={(e) => {
        // Enter in a text field moves forward rather than submitting early.
        if (wizard && e.key === "Enter" && !e.defaultPrevented && step < STEPS.length - 1 && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
          next();
        }
      }}
    >
      <input type="hidden" name="mode" value={mode} />

      {wizard && (
        <div>
          <div className="flex gap-1.5" aria-hidden>
            {STEPS.map((_, i) => (
              <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-border")} />
            ))}
          </div>
          <p className="mt-5 text-xs font-medium tracking-wide text-primary uppercase">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{STEPS[step].title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{STEPS[step].description}</p>
        </div>
      )}

      <div className={section(0)}>
        {!wizard && <SectionTitle>About you</SectionTitle>}
        <Field label="Full name" htmlFor="full_name" error={fe?.full_name}>
          <Input id="full_name" name="full_name" defaultValue={profile.full_name} autoComplete="name" maxLength={80} required />
        </Field>
        <Field label="Headline" htmlFor="headline" hint="One line, e.g. “Backend engineer into climate tech”." error={fe?.headline}>
          <Input id="headline" name="headline" defaultValue={profile.headline ?? ""} maxLength={120} />
        </Field>
        <Field label="Location" htmlFor="location" hint="City, country — or “Remote”." error={fe?.location}>
          <Input id="location" name="location" defaultValue={profile.location ?? ""} autoComplete="address-level2" maxLength={80} />
        </Field>
      </div>

      <div className={section(1)}>
        {!wizard && <SectionTitle>What you bring</SectionTitle>}
        <Field label="I'm a…" hint="Pick all that apply." error={fe?.roles}>
          <ChipGroup name="roles" ariaLabel="Roles" variant="card" options={ROLES} defaultValue={profile.roles} invalid={!!fe?.roles} />
        </Field>
        <Field label="Skills" htmlFor="skills-input" hint="Press Enter to add. Up to 20." error={fe?.skills}>
          <TagInput
            id="skills-input"
            name="skills"
            defaultValue={profile.skills}
            suggestions={SKILL_SUGGESTIONS}
            placeholder="e.g. Full-stack, Fundraising"
          />
        </Field>
        <Field label="Sectors you're interested in" error={fe?.interests}>
          <ChipGroup name="interests" ariaLabel="Interests" options={INDUSTRIES} defaultValue={profile.interests} />
        </Field>
      </div>

      <div className={section(2)}>
        {!wizard && <SectionTitle>Availability</SectionTitle>}
        <Field label="Availability" error={fe?.availability}>
          <ChipGroup
            name="availability"
            ariaLabel="Availability"
            multiple={false}
            options={AVAILABILITY}
            defaultValue={profile.availability ? [profile.availability] : []}
          />
        </Field>
        <Field label="Commitment level" error={fe?.commitment}>
          <ChipGroup
            name="commitment"
            ariaLabel="Commitment level"
            variant="card"
            multiple={false}
            options={COMMITMENT}
            defaultValue={profile.commitment ? [profile.commitment] : []}
          />
        </Field>
        <Field label="Short bio" htmlFor="bio" hint="Optional. What have you built, and what are you looking for?" error={fe?.bio}>
          <Textarea id="bio" name="bio" defaultValue={profile.bio ?? ""} maxLength={1000} rows={4} />
        </Field>
      </div>

      <FormAlert message={clientError ?? (state && !state.ok ? state.error : null)} />

      {wizard ? (
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)} className={cn(step === 0 && "invisible")}>
            <ArrowLeft /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            // Distinct keys: otherwise React morphs this <button> into the submit
            // button mid-click and the browser submits the form early.
            <Button key="continue" type="button" onClick={next}>
              Continue <ArrowRight />
            </Button>
          ) : (
            <Button key="finish" type="submit" loading={pending}>
              Finish &amp; explore
            </Button>
          )}
        </div>
      ) : (
        <div className="flex justify-end">
          <Button type="submit" loading={pending}>
            Save profile
          </Button>
        </div>
      )}
    </form>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="border-b border-border pb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">{children}</h2>;
}
