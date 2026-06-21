"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/guards";
import { guestbookRepository } from "@/lib/db/repositories/guestbook.repository";
import {
  GuestbookEntrySchema,
  type TGuestbookEntrySchema,
} from "@/lib/schemas/guestbook.schema";
import { parseValidationError } from "../utils";

function revalidateGuestbook() {
  revalidatePath("/guestbook");
  revalidatePath("/guestbook/manage");
  revalidatePath("/api/public/guestbook");
}

export async function createGuestbookEntry(values: TGuestbookEntrySchema) {
  const validated = GuestbookEntrySchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    const order = await guestbookRepository.getNextOrder();
    await guestbookRepository.create({ ...validated.data, order });
    revalidateGuestbook();
  } catch (error) {
    console.log({ error });
    return { error: "Could not create guestbook entry" };
  }
}

export async function updateGuestbookEntry(
  id: string,
  values: TGuestbookEntrySchema
) {
  await requireAdminSession();

  const validated = GuestbookEntrySchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    await guestbookRepository.updateById(id, validated.data);
    revalidateGuestbook();
  } catch (error) {
    console.log({ error });
    return { error: "Could not update guestbook entry" };
  }
}

export async function approveGuestbookEntry(id: string) {
  await requireAdminSession();

  try {
    await guestbookRepository.approveById(id);
    revalidateGuestbook();
  } catch (error) {
    console.log({ error });
    return { error: "Could not approve guestbook entry" };
  }
}

export async function rejectGuestbookEntry(id: string) {
  await requireAdminSession();

  try {
    await guestbookRepository.rejectById(id);
    revalidateGuestbook();
  } catch (error) {
    console.log({ error });
    return { error: "Could not reject guestbook entry" };
  }
}

export async function deleteGuestbookEntry(id: string) {
  await requireAdminSession();

  try {
    await guestbookRepository.deleteById(id);
    revalidateGuestbook();
  } catch (error) {
    console.log({ error });
    return { error: "Could not delete guestbook entry" };
  }
}

export async function reorderGuestbookEntries(ids: string[]) {
  await requireAdminSession();

  if (!ids.length) return { error: "Nothing to reorder." };

  try {
    await guestbookRepository.reorder(ids);
    revalidateGuestbook();
  } catch (error) {
    console.log({ error });
    return { error: "Could not reorder guestbook entries" };
  }
}
