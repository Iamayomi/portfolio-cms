import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { WorksForm } from "./_components/works-form";

export default async function LandingWorksPage() {
  const { selectedWorks } = await landingRepository.get();

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Landing / Works"
        title="Choose the proof on the homepage."
        description="Control the selected-work section copy. The actual items will come from build records marked as featured."
      />

      <WorksForm {...selectedWorks} />
    </div>
  );
}
