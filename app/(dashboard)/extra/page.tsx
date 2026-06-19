import { Music, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DashboardPageHeader } from "../_components/dashboard-page-header";
import { ModuleCard } from "../../../components/common/module-card";

const extras = [
  [
    "Chess",
    "Quiet strategy, pattern spotting, and the occasional painful blunder.",
  ],
  ["8 ball", "A casual competitive pocket of fun away from code."],
  ["Music", "Songs, ideas, and the more human side of the portfolio."],
];

export default function ExtraPage() {
  return (
    <div>
      <DashboardPageHeader
        eyebrow="Extra"
        title="Everything that is not work."
        description="This page should make the public portfolio feel alive. Keep hobbies, music, games, and personal links here."
        action={
          <Button>
            <Plus />
            Add moment
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {extras.map(([title, copy], index) => (
          <ModuleCard
            key={title}
            className={
              index === 0
                ? "bg-mint/40"
                : index === 1
                ? "bg-honey/40"
                : "bg-blush/40"
            }
          >
            <Music className="size-6" />
            <h2 className="mt-10 text-3xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">{copy}</p>
          </ModuleCard>
        ))}
      </div>
    </div>
  );
}
