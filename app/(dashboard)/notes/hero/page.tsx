import { notesPageRepository } from "@/lib/db/repositories/notes";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { NotesHeroForm } from "./_components/notes-hero-form";

export default async function NotesHeroPage() {
  const { hero } = await notesPageRepository.get();

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Notes / Hero"
        title="Shape the public notes intro."
        description="This controls the eyebrow, title, and short description shown at the top of the frontend notes page."
      />

      <NotesHeroForm {...hero} />
    </div>
  );
}
