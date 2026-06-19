import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { NotesForm } from "./_components/notes-form";

export default async function LandingNotesPage() {
  const { selectedNotes } = await landingRepository.get();

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Landing / Notes"
        title="Feature the writing that matters."
        description="Control the selected-notes section copy. The actual items will come from note records marked as featured."
      />

      <NotesForm {...selectedNotes} />
    </div>
  );
}
