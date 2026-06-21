import * as z from "zod";

import { optionalText } from "./shared.schema";

export const GuestbookEntrySchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(80, { message: "Name must be 80 characters or less" }),
  email: z.string().trim().email({ message: "Email must be valid" }).optional().or(z.literal("")),
  website: optionalText,
  avatarUrl: optionalText,
  message: z
    .string()
    .trim()
    .min(2, { message: "Message must be at least 2 characters" })
    .max(500, { message: "Message must be 500 characters or less" }),
  approved: z.boolean().default(false),
});

export type TGuestbookEntrySchema = z.infer<typeof GuestbookEntrySchema>;
