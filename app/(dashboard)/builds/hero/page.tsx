import { buildsPageRepository } from "@/lib/db/repositories/build.repository";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { BuildsHeroForm } from "./_components/builds-hero-form";

export default async function BuildsHeroPage() {
  const { hero } = await buildsPageRepository.get();

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Builds / Hero"
        title="Shape the public builds intro."
        description="This controls the small intro above the projects and learning tracks on the public builds page."
      />

      <BuildsHeroForm {...hero} />
    </div>
  );
}
