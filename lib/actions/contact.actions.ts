"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/guards";
import { contactPageRepository } from "@/lib/db/repositories/contact.repository";
import {
  ContactPageSchema,
  type TContactPageSchema,
} from "@/lib/schemas/contact.schema";
import { parseValidationError } from "../utils";

export async function updateContactPage(values: TContactPageSchema) {
  await requireAdminSession();

  const validated = ContactPageSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    await contactPageRepository.update({
      key: "contact",
      ...validated.data,
    });
    revalidatePath("/contact");
    revalidatePath("/api/public/contact");
  } catch (error) {
    console.log({ error });
    return { error: "Could not update contact page" };
  }
}

export async function updateContactCv(cvUrl: string) {
  await requireAdminSession();

  try {
    const existing = await contactPageRepository.get();

    await contactPageRepository.update({
      key: "contact",
      hero: existing.hero,
      recipientEmail: existing.recipientEmail,
      helperNote: existing.helperNote,
      socials: existing.socials,
      cvUrl,
    });
    revalidatePath("/contact");
    revalidatePath("/api/public/contact");
  } catch (error) {
    console.log({ error });
    return { error: "Could not update CV" };
  }
}
