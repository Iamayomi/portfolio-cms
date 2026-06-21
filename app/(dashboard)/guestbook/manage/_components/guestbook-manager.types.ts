import type { TGuestbookEntrySchema } from "@/lib/schemas/guestbook.schema";

export type GuestbookEntryItem = TGuestbookEntrySchema & {
  id: string;
  order: number;
  createdAt: string;
};

export const emptyGuestbookForm: TGuestbookEntrySchema = {
  name: "",
  email: "",
  website: "",
  avatarUrl: "",
  message: "",
  approved: false,
};
