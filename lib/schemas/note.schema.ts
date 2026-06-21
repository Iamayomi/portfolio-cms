import * as z from "zod";
import { optionalText } from "./shared.schema";

export const NotesHeroSchema = z.object({
  eyebrow: z
    .string()
    .trim()
    .min(1, { message: "Eyebrow is required" })
    .max(80, { message: "Eyebrow must be 80 characters or less" }),
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(140, { message: "Title must be 140 characters or less" }),
  description: z
    .string()
    .trim()
    .max(300, { message: "Description must be 300 characters or less" })
    .optional()
    .or(z.literal("")),
});

export const NoteSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  excerpt: z
    .string()
    .trim()
    .max(400, { message: "Excerpt must be 400 characters or less" })
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .trim()
    .min(20, { message: "Write a little more before saving." }),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  allowComments: z.boolean().default(false),
  bannerImage: optionalText,
  bannerCaption: optionalText,
  tags: z.array(z.string().trim().min(1)).default(["Engineering"]),
  series: optionalText,
  seriesOrder: z.number().optional(),
});

export const NoteCommentSchema = z.object({
  parentId: optionalText,
  name: z
    .string()
    .trim()
    .min(2, { message: "Name is required" })
    .max(80, { message: "Name must be 80 characters or less" }),
  email: z.email({ message: "Enter a valid email address" }),
  website: optionalText,
  content: z
    .string()
    .trim()
    .min(3, { message: "Write a little more before sending." })
    .max(1200, { message: "Comment must be 1200 characters or less" }),
});

export type TNotesHeroSchema = z.infer<typeof NotesHeroSchema>;
export type TNoteSchema = z.infer<typeof NoteSchema>;
export type TNoteCommentSchema = z.infer<typeof NoteCommentSchema>;
