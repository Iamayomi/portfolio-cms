import type { CmsDocumentBase } from "./shared";

export interface BookContent extends CmsDocumentBase {
  title: string;
  author: string;
  category: string;
  note: string;
  rating?: number;
  published: boolean;
  order: number;
}
