"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { FormAlert } from "@/components/ui/misc";
import { ChipGroup } from "@/components/ui/chip-group";
import { INDUSTRIES, NEEDED_ROLES, STAGES, VISIBILITY } from "@/lib/constants";
import { createProject, updateProject } from "@/lib/actions/projects";
import type { Project } from "@/lib/types";

export function ProjectForm({ project }: { project?: Project }) {
  const action = project ? updateProject.bind(null, project.id) : createProject;
  const [state, formAction, pending] = useActionState(action, null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="grid gap-8">
      <Section title="The pitch">
        <Field label="Project name" htmlFor="title" error={fe?.title}>
          <Input id="title" name="title" defaultValue={project?.title} maxLength={80} required aria-invalid={!!fe?.title || undefined} />
        </Field>
        <Field label="Tagline" htmlFor="tagline" hint="One sentence that makes someone want to read more." error={fe?.tagline}>
          <Input id="tagline" name="tagline" defaultValue={project?.tagline ?? ""} maxLength={140} />
        </Field>
        <Field label="Problem" htmlFor="problem" hint="Who has this problem and why does it matter?" error={fe?.problem}>
          <Textarea id="problem" name="problem" defaultValue={project?.problem} maxLength={2000} rows={4} required aria-invalid={!!fe?.problem || undefined} />
        </Field>
        <Field label="Solution" htmlFor="solution" hint="What are you building, in plain language?" error={fe?.solution}>
          <Textarea id="solution" name="solution" defaultValue={project?.solution} maxLength={2000} rows={4} required aria-invalid={!!fe?.solution || undefined} />
        </Field>
      </Section>

      <Section title="Details">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Sector" htmlFor="industry" error={fe?.industry}>
            <NativeSelect id="industry" name="industry" defaultValue={project?.industry ?? ""} required>
              <option value="" disabled>
                Choose a sector
              </option>
              {INDUSTRIES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Stage" htmlFor="stage" error={fe?.stage}>
            <NativeSelect id="stage" name="stage" defaultValue={project?.stage ?? ""} required>
              <option value="" disabled>
                Choose a stage
              </option>
              {STAGES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
        <Field label="Location" htmlFor="location" hint="City, country — or “Remote”." error={fe?.location}>
          <Input id="location" name="location" defaultValue={project?.location ?? ""} maxLength={80} />
        </Field>
        <Field label="Traction" htmlFor="traction" hint="Optional. Users, pilots, revenue, waitlist — whatever is true today." error={fe?.traction}>
          <Textarea id="traction" name="traction" defaultValue={project?.traction ?? ""} maxLength={1000} rows={3} />
        </Field>
      </Section>

      <Section title="Who you're looking for">
        <Field label="Roles needed" hint="Pick everything you'd say yes to." error={fe?.roles_needed}>
          <ChipGroup name="roles_needed" ariaLabel="Roles needed" options={NEEDED_ROLES} defaultValue={project?.roles_needed ?? []} invalid={!!fe?.roles_needed} />
        </Field>
        <Field label="Visibility" error={fe?.visibility}>
          <ChipGroup
            name="visibility"
            ariaLabel="Visibility"
            variant="card"
            multiple={false}
            options={VISIBILITY}
            defaultValue={[project?.visibility ?? "public"]}
          />
        </Field>
      </Section>

      <FormAlert message={state && !state.ok ? state.error : null} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button asChild variant="ghost">
          <Link href={project ? `/projects/${project.id}` : "/projects"}>Cancel</Link>
        </Button>
        <Button type="submit" loading={pending}>
          {project ? "Save changes" : "Publish project"}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-6 rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase" aria-hidden>
        {title}
      </h2>
      {children}
    </fieldset>
  );
}
