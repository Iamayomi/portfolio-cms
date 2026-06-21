import * as z from "zod";

import { optionalText } from "./shared.schema";

export const BookSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  author: z.string().trim().min(1, { message: "Author is required" }),
  category: z.string().trim().min(1, { message: "Category is required" }),
  note: z
    .string()
    .trim()
    .min(5, { message: "Write a short note about this book" })
    .max(500, { message: "Note must be 500 characters or less" }),
  rating: z.number().min(1).max(5).optional(),
  published: z.boolean().default(true),
});

export type TBookSchema = z.infer<typeof BookSchema>;
