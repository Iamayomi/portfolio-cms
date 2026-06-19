import type { CmsDocumentBase } from "./shared";

export type ContactSocials = {
  email?: string;
  github?: string;
  x?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  medium?: string;
  facebook?: string;
  threads?: string;
  whatsapp?: string;
  telegram?: string;
  website?: string;
};

export interface ContactPageContent extends CmsDocumentBase {
  key: "contact";
  hero: {
    eyebrow: string;
    title: string;
    description?: string;
  };
  cvUrl?: string;
  recipientEmail?: string;
  helperNote?: string;
  socials: ContactSocials;
}
