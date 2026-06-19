import { notFound } from "next/navigation";

import { noteRepository } from "@/lib/db/repositories/notes";

import { DashboardPageHeader } from "../../../../_components/dashboard-page-header";
import { NoteForm, type NoteFormData } from "../../_components/note-form";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await noteRepository.findBySlug(slug);

  if (!note) notFound();

  const initialData: NoteFormData = {
    id: note._id?.toString(),
    title: note.title,
    excerpt: note.excerpt || "",
    content: note.content,
    published: note.published,
    featured: note.featured,
    allowComments: note.allowComments ?? false,
    bannerImage: note.bannerImage || "",
    bannerCaption: note.bannerCaption || "",
    tags: note.tags || [],
  };

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Notes / Edit"
        title="Tune the note."
        description="Update the copy, publish state, featured flag, banner, tags, and rich body content."
      />

      <NoteForm mode="edit" initialData={initialData} />
    </div>
  );
}
