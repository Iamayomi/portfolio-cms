import type { CmsDocumentBase } from "./shared";

export interface BuildsPageContent extends CmsDocumentBase {
  key: "builds";
  hero: {
    eyebrow: string;
    title: string;
    description?: string;
  };
}

export interface BuildItemContent extends CmsDocumentBase {
  title: string;
  category: string;
  status: "active" | "in-progress";
  summary?: string;
  proofNote?: string;
  githubUrl?: string;
  liveUrl?: string;
  stack: string[];
  order: number;
  published: boolean;
  featured: boolean;
}
