import type { CmsDocumentBase } from "./shared";

export interface NotesPageContent extends CmsDocumentBase {
  key: "notes";
  hero: {
    eyebrow: string;
    title: string;
    description?: string;
  };
}

export interface NoteContent extends CmsDocumentBase {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  published: boolean;
  featured: boolean;
  allowComments: boolean;
  bannerImage?: string;
  bannerCaption?: string;
  tags: string[];
  readTime: string;
  views?: number;
  readBy?: string[];
  publishedAt?: Date | null;
  author?: {
    name: string;
    image?: string | null;
  };
}

export interface NoteCommentContent extends CmsDocumentBase {
  noteSlug: string;
  noteId?: string;
  parentId?: string | null;
  name: string;
  email: string;
  website?: string;
  content: string;
  likes: number;
  likedBy: string[];
}

export interface NewsletterSubscriber extends CmsDocumentBase {
  email: string;
  visitorId?: string;
  source?: string;
  page?: string;
  confirmedSubscription: boolean;
}

export type PublicNoteField =
  | "title"
  | "slug"
  | "excerpt"
  | "tags"
  | "readTime"
  | "views"
  | "bannerImage"
  | "publishedAt"
  | "updatedAt";
