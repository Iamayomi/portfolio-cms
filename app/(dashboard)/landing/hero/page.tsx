import { landingRepository } from "@/lib/db/repositories/landing";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { HeroForm } from "./_components/hero-form";

export default async function LandingHeroPage() {
  const { hero } = await landingRepository.get();

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Landing / Hero"
        title="Shape the opening note."
        description="This controls the first text people read, the two main actions, the floating cursor portrait, and the small side notes."
      />

      <HeroForm {...hero} />
    </div>
  );
}
