import type { CmsDocumentBase } from "./shared";

export interface GuestbookEntryContent extends CmsDocumentBase {
  name: string;
  email?: string;
  website?: string;
  avatarUrl?: string;
  message: string;
  approved: boolean;
  order: number;
}
