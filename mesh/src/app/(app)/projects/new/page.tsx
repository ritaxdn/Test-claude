import { ProjectForm } from "@/components/projects/project-form";
import { PageHeader } from "@/components/ui/misc";
import { requireOnboarded } from "@/lib/auth";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireOnboarded();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New project" description="Share what you're building and who you need." />
      <ProjectForm />
    </div>
  );
}
