import {
  ArrowRight,
  Image,
  NotebookText,
  PanelRight,
  Rows3,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";

import { DashboardPageHeader } from "../_components/dashboard-page-header";
import { ModuleCard } from "../../../components/common/module-card";

const sections = [
  {
    title: "Hero",
    href: "/landing/hero",
    icon: Image,
    description:
      "Opening copy, CTA labels, side notes, and floating portrait image.",
    color: "bg-blush/45",
  },
  {
    title: "Selected works",
    href: "/landing/works",
    icon: Rows3,
    description: "The featured build list that appears below the hero.",
    color: "bg-honey/50",
  },
  {
    title: "Selected notes",
    href: "/landing/notes",
    icon: NotebookText,
    description: "Featured writing pulled into the landing page.",
    color: "bg-mint/45",
  },
  {
    title: "Aside",
    href: "/landing/aside",
    icon: PanelRight,
    description:
      "Current study, toolbox groups, and right-column support copy.",
    color: "bg-sky/45",
  },
];

export default async function LandingEditorPage() {
  const content = await landingRepository.get();

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Landing"
        title="Edit the public first page."
        description="Each block here maps to a visible section on the portfolio landing page. Keep the writing clear, simple and proof-led."
      />

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <ModuleCard className="bg-paper/70">
          <p className="font-script text-3xl text-tomato">Live shape</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            {content.hero.headline}
          </h2>
          <p className="mt-4 text-sm leading-7 text-ink/65">
            {content.hero.intro}
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {content.hero.snapshots.map((item) => (
              <div key={item.label} className="border-t border-ink/15 pt-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/45">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </ModuleCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <ModuleCard key={section.href} className={section.color}>
                <Icon className="size-6" />
                <h2 className="mt-8 text-2xl font-black">{section.title}</h2>
                <p className="mt-2 min-h-16 text-sm leading-6 text-ink/65">
                  {section.description}
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <Link href={section.href}>
                    Edit block
                    <ArrowRight />
                  </Link>
                </Button>
              </ModuleCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
