import { noteRepository } from "@/lib/db/repositories/notes";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { NotesManager, type NoteListItem } from "./_components/notes-manager";

const NOTE_LIMIT = 8;

type NotesManageSearchParams = {
  page?: string;
  q?: string;
  published?: string;
  featured?: string;
};

export default async function NotesManagePage({
  searchParams,
}: {
  searchParams: Promise<NotesManageSearchParams>;
}) {
  const params = await searchParams;
  const notes = await noteRepository.findMany();
  const q = params.q?.trim().toLowerCase() || "";
  const published = params.published || "all";
  const featured = params.featured || "all";
  const currentPage = Math.max(Number(params.page || 1), 1);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = q
      ? [note.title, note.slug, note.excerpt, ...(note.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      : true;
    const matchesPublished =
      published === "all" ? true : note.published === (published === "true");
    const matchesFeatured =
      featured === "all" ? true : note.featured === (featured === "true");

    return matchesSearch && matchesPublished && matchesFeatured;
  });

  const totalItems = filteredNotes.length;
  const totalPages = Math.max(Math.ceil(totalItems / NOTE_LIMIT), 1);
  const safePage = Math.min(currentPage, totalPages);
  const offset = (safePage - 1) * NOTE_LIMIT;
  const paginatedNotes = filteredNotes.slice(offset, offset + NOTE_LIMIT);

  const items: NoteListItem[] = paginatedNotes.map((note) => ({
    id: note._id?.toString() || "",
    title: note.title,
    slug: note.slug,
    excerpt: note.excerpt || "No excerpt yet.",
    published: note.published,
    featured: note.featured,
    readTime: note.readTime || "1 min read",
    updatedAt: (note.updatedAt ?? note.createdAt).toLocaleDateString(),
    tags: note.tags || [],
  }));

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Notes / Manage"
        title="Write and maintain the archive."
        description="Manage draft and published notes, mark the stronger ones as featured, and keep the writing useful."
      />

      <NotesManager
        notes={items}
        filters={{ q: params.q, published, featured }}
        pagination={{
          currentPage: safePage,
          totalPages,
          showingStart: totalItems ? offset + 1 : 0,
          showingEnd: Math.min(offset + NOTE_LIMIT, totalItems),
          totalItems,
          limit: NOTE_LIMIT,
        }}
      />
    </div>
  );
}
