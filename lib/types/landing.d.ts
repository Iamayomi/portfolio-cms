import {
  TLandingHeroSnapshots,
  TLandingSkillGroupSchema,
} from "../schemas/landing.schema";
import { TCtaButton } from "../schemas/shared.schema";
import { CmsDocumentBase } from "./shared";

export type LandingSkillGroup = TLandingSkillGroupSchema;

export interface LandingContent extends CmsDocumentBase {
  key: "landing";
  hero: {
    pageLabel: string;
    greeting: string;
    headline: string;
    intro: string;
    portraitImageUrl: string;
    primaryCta: TCtaButton;
    secondaryCta: TCtaButton;
    snapshots: TLandingHeroSnapshots[];
  };
  selectedWorks: {
    eyebrow: string;
    title?: string;
    linkLabel: string;
    linkHref: string;
    featuredCount: number;
  };
  selectedNotes: {
    eyebrow: string;
    title?: string;
    linkLabel: string;
    linkHref: string;
    featuredCount: number;
  };
  aside: {
    studyTitle: string;
    studyDescription: string;
    studyItems: string[];
    toolboxTitle: string;
    toolboxDescription?: string;
    skillGroups: LandingSkillGroup[];
  };
}
