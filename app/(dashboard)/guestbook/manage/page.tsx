import { guestbookRepository } from "@/lib/db/repositories/guestbook.repository";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { GuestbookManager, type GuestbookEntryItem } from "./_components/guestbook-manager";

export default async function GuestbookManagePage() {
  const entries = await guestbookRepository.findOrdered();
  const items: GuestbookEntryItem[] = entries.map((entry) => ({
    id: entry._id?.toString() || "",
    name: entry.name,
    email: entry.email || "",
    website: entry.website || "",
    avatarUrl: entry.avatarUrl || "",
    message: entry.message,
    approved: entry.approved,
    order: entry.order,
    createdAt: entry.createdAt.toISOString(),
  }));
  const managerKey = items
    .map((item) => `${item.id}:${item.order}:${item.approved}`)
    .join("|");

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Guestbook / Manage"
        title="Curate the guestbook."
        description="Review, approve, and manage guestbook entries. Public entries are visible on the guestbook page."
      />

      <GuestbookManager key={managerKey} items={items} />
    </div>
  );
}
