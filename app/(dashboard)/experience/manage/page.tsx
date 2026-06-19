import { experienceRepository } from "@/lib/db/repositories/experience.repository";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import {
  ExperienceManager,
  type ExperienceListItem,
} from "./_components/experience-manager";

export default async function ExperienceManagePage() {
  const entries = await experienceRepository.findOrdered();
  const items: ExperienceListItem[] = entries.map((entry) => ({
    id: entry._id?.toString() || "",
    period: entry.period,
    role: entry.role,
    websiteUrl: entry.websiteUrl || "",
    summary: entry.summary || "",
    signals: entry.signals || [],
    published: entry.published,
    order: entry.order,
  }));
  const managerKey = items.map((item) => `${item.id}:${item.order}`).join("|");

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Experience / Manage"
        title="Maintain the timeline."
        description="Add the work periods, transition points, and proof signals that explain the path without turning the page into a resume dump."
      />

      <ExperienceManager key={managerKey} items={items} />
    </div>
  );
}
