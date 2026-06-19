import * as z from "zod";
import { optionalText } from "./shared.schema";

export const NewsletterSubscriberSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  source: optionalText,
  page: optionalText,
});

export type TNewsletterSubscriberSchema = z.infer<
  typeof NewsletterSubscriberSchema
>;
