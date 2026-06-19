import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { AsideForm } from "./_components/aside-form";

export default async function LandingAsidePage() {
  const { aside } = await landingRepository.get();

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Landing / Aside"
        title="Keep the support column useful."
        description="Edit the current study block and the toolbox block that sits beside the landing page proof."
      />

      <AsideForm
        {...aside}
        toolboxDescription={
          aside.toolboxDescription ||
          "The tools I reach for when I need to build, shape, ship, or study a system properly."
        }
        skillGroups={aside.skillGroups.map((group) => ({
          ...group,
          description: group.description || "",
        }))}
      />
    </div>
  );
}
