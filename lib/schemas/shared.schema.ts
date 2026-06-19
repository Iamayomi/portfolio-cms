import * as z from "zod";

export const optionalText = z.preprocess(
  (value) => (value === null ? "" : value),
  z.string().trim().optional().or(z.literal(""))
);

export const SectionIntroSchema = z.object({
  eyebrow: z.string().trim().default(""),
  headline: z
    .string()
    .trim()
    .min(1, { message: "Headline is required" })
    .max(120, { message: "Headline must be 120 characters or less" }),
  description: z
    .string()
    .trim()
    .max(280, { message: "Description must be 280 characters or less" })
    .default(""),
});

export const CtaButtonSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, { message: "CTA label is required" })
    .max(42, { message: "CTA label must be 42 characters or less" }),
  href: z
    .string()
    .trim()
    .min(1, { message: "CTA link is required" })
    .max(180, { message: "CTA link must be 180 characters or less" }),
  variant: z.enum(["primary", "secondary"]).default("primary"),
  published: z.boolean().default(true),
});

export type TCtaButton = z.infer<typeof CtaButtonSchema>;
