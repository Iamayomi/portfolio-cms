import { DashboardPageHeader } from "../../../_components/dashboard-page-header";
import { NoteForm } from "../_components/note-form";

export default function NewNotePage() {
  return (
    <div>
      <DashboardPageHeader
        eyebrow="Notes / New"
        title="Draft a new note."
        description="Start with a clear title, a useful excerpt, and enough structure that the note can become public proof."
      />

      <NoteForm mode="create" />
    </div>
  );
}
