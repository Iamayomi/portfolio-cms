import { z } from "zod";

export const magicLinkSchema = z.object({
  email: z.email("Enter a valid email."),
});

export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
