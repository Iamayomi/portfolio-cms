import { buildRepository } from "@/lib/db/repositories/build.repository";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { BuildsManager, type BuildListItem } from "./_components/builds-manager";

export default async function BuildsManagePage() {
  const builds = await buildRepository.findOrdered();
  const items: BuildListItem[] = builds.map((build) => ({
    id: build._id?.toString() || "",
    title: build.title,
    category: build.category,
    status: build.status || "active",
    summary: build.summary || "",
    proofNote: build.proofNote || "",
    githubUrl: build.githubUrl || "",
    liveUrl: build.liveUrl || "",
    stack: build.stack || [],
    published: build.published,
    featured: build.featured,
    order: build.order,
  }));
  const managerKey = items
    .map((item) => `${item.id}:${item.order}:${item.published}:${item.featured}`)
    .join("|");

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Builds / Manage"
        title="Curate the proof."
        description="Keep the selected work clear, ordered, and honest. Use featured for landing page picks, and published for the public builds page."
      />

      <BuildsManager key={managerKey} items={items} />
    </div>
  );
}
