import * as z from "zod";
import { CtaButtonSchema, optionalText } from "./shared.schema";

export const LandingHeroSnapshots = z.object({
  label: z.string(),
  value: z.string().trim().min(1, { message: "Snapshot is required" }),
});

export const HeroSectionSchema = z.object({
  pageLabel: z
    .string()
    .trim()
    .min(1, { message: "PageLabel is required" })
    .max(60, { message: "Label must be 60 characters or less" }),
  greeting: z
    .string()
    .trim()
    .min(1, { message: "Greetings is required" })
    .max(60, { message: "Greetings must be 60 characters or less" }),
  headline: z
    .string()
    .trim()
    .min(1, { message: "Hero headline is required" })
    .max(120, { message: "Hero headline must be 120 characters or less" }),
  intro: z
    .string()
    .trim()
    .max(260, { message: "Hero intro must be 260 characters or less" }),
  portraitImageUrl: optionalText,
  primaryCta: CtaButtonSchema,
  secondaryCta: CtaButtonSchema,
  snapshots: z.array(LandingHeroSnapshots).default([]),
});

export const LandingSelectedWorksSchema = z.object({
  eyebrow: z
    .string()
    .trim()
    .min(1, { message: "Eyebrow is required" })
    .max(60, { message: "Eyebrow must be 60 characters or less" }),
  title: optionalText,
  linkLabel: z
    .string()
    .trim()
    .min(1, { message: "Link label is required" })
    .max(42, { message: "Link label must be 42 characters or less" }),
  linkHref: z
    .string()
    .trim()
    .min(1, { message: "Link href is required" })
    .max(180, { message: "Link href must be 180 characters or less" }),
  featuredCount: z
    .number()
    .max(20, { message: "Featured note count must be 20 or less" })
    .default(2),
});

export const LandingSelectedNotesSchema = LandingSelectedWorksSchema;

export const LandingSkillGroupSchema = z.object({
  title: z.string().trim().min(1, { message: "Group title is required" }),
  description: z.string().trim().default(""),
  skills: z.array(z.string().trim().min(1)).default([]),
});

export const LandingAsideSchema = z.object({
  studyTitle: z
    .string()
    .trim()
    .min(1, { message: "Study title is required" })
    .max(80, { message: "Study title must be 80 characters or less" }),
  studyDescription: z
    .string()
    .trim()
    .max(220, { message: "Study description must be 220 characters or less" }),
  studyItems: z.array(z.string().trim().min(1)).default([]),
  toolboxTitle: z
    .string()
    .trim()
    .min(1, { message: "Toolbox title is required" })
    .max(80, { message: "Toolbox title must be 80 characters or less" }),
  toolboxDescription: z
    .string()
    .trim()
    .max(220, {
      message: "Toolbox description must be 220 characters or less",
    })
    .optional(),
  skillGroups: z.array(LandingSkillGroupSchema).default([]),
});

export type THeroSectionSchema = z.infer<typeof HeroSectionSchema>;
export type TLandingHeroSnapshots = z.infer<typeof LandingHeroSnapshots>;
export type TLandingSelectedWorksSchema = z.infer<
  typeof LandingSelectedWorksSchema
>;
export type TLandingSelectedNotesSchema = z.infer<
  typeof LandingSelectedNotesSchema
>;
export type TLandingAsideSchema = z.infer<typeof LandingAsideSchema>;
export type TLandingSkillGroupSchema = z.infer<typeof LandingSkillGroupSchema>;
