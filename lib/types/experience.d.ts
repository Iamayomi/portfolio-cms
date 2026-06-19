import type { CmsDocumentBase } from "./shared";

export interface ExperiencePageContent extends CmsDocumentBase {
  key: "experience";
  hero: {
    eyebrow: string;
    title: string;
    description?: string;
    operatingNote?: string;
  };
}

export interface ExperienceItemContent extends CmsDocumentBase {
  period: string;
  role: string;
  websiteUrl?: string;
  summary?: string;
  signals: string[];
  order: number;
  published: boolean;
}
