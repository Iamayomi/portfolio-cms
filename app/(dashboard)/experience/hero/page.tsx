import { experiencePageRepository } from "@/lib/db/repositories/experience.repository";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { ExperienceHeroForm } from "./_components/experience-hero-form";

export default async function ExperienceHeroPage() {
  const { hero } = await experiencePageRepository.get();

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Experience / Hero"
        title="Shape the public timeline intro."
        description="This controls the eyebrow, title, description, and small operating note shown around the public experience page."
      />

      <ExperienceHeroForm {...hero} />
    </div>
  );
}
