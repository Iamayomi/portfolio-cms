import * as z from "zod";

import { optionalText } from "./shared.schema";

export const ContactHeroSchema = z.object({
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

export const ContactPageSchema = z.object({
  hero: ContactHeroSchema,
  cvUrl: optionalText,
  recipientEmail: z
    .string()
    .trim()
    .email({ message: "Recipient email must be valid" })
    .optional()
    .or(z.literal("")),
  helperNote: z
    .string()
    .trim()
    .max(260, { message: "Helper note must be 260 characters or less" })
    .optional()
    .or(z.literal("")),
  socials: z.object({
    email: optionalText,
    github: optionalText,
    x: optionalText,
    linkedin: optionalText,
    instagram: optionalText,
    youtube: optionalText,
    tiktok: optionalText,
    medium: optionalText,
    facebook: optionalText,
    threads: optionalText,
    whatsapp: optionalText,
    telegram: optionalText,
    website: optionalText,
  }),
});

export const ContactMessageSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().trim().email({ message: "Email must be valid" }),
  workType: optionalText,
  timeline: optionalText,
  budget: optionalText,
  details: z
    .string()
    .trim()
    .min(10, { message: "Tell me a little more about the work." }),
});

export type TContactPageSchema = z.infer<typeof ContactPageSchema>;
export type TContactMessageSchema = z.infer<typeof ContactMessageSchema>;
