import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/projects/project-form";
import { PageHeader } from "@/components/ui/misc";
import { requireOnboarded } from "@/lib/auth";
import { getProject } from "@/lib/data";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireOnboarded();
  const { id } = await params;
  const project = await getProject(id);
  // Server-side ownership check: non-owners get a 404, not a form.
  if (!project || project.owner_id !== user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit project" description={project.title} />
      <ProjectForm project={project} />
    </div>
  );
}
