import * as z from "zod";

import { optionalText } from "./shared.schema";

export const ExperienceHeroSchema = z.object({
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
  operatingNote: z
    .string()
    .trim()
    .max(220, { message: "Operating note must be 220 characters or less" })
    .optional()
    .or(z.literal("")),
});

export const ExperienceItemSchema = z.object({
  period: z.string().trim().min(1, { message: "Period is required" }),
  role: z.string().trim().min(1, { message: "Role is required" }),
  websiteUrl: optionalText,
  summary: optionalText,
  signals: z.array(z.string().trim().min(1)).default([]),
  published: z.boolean().default(true),
});

export type TExperienceHeroSchema = z.infer<typeof ExperienceHeroSchema>;
export type TExperienceItemSchema = z.infer<typeof ExperienceItemSchema>;
