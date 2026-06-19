import * as z from "zod";

import { optionalText } from "./shared.schema";

export const BuildsHeroSchema = z.object({
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
    .max(320, { message: "Description must be 320 characters or less" })
    .optional()
    .or(z.literal("")),
});

export const BuildItemSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  category: z.string().trim().min(1, { message: "Category is required" }),
  status: z.enum(["active", "in-progress"]).default("active"),
  summary: optionalText,
  proofNote: optionalText,
  githubUrl: optionalText,
  liveUrl: optionalText,
  stack: z.array(z.string().trim().min(1)).default([]),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export type TBuildsHeroSchema = z.infer<typeof BuildsHeroSchema>;
export type TBuildItemSchema = z.infer<typeof BuildItemSchema>;
