"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/guards";
import { bookRepository } from "@/lib/db/repositories/book.repository";
import {
  BookSchema,
  type TBookSchema,
} from "@/lib/schemas/book.schema";
import { parseValidationError } from "../utils";

function revalidateBookshelf() {
  revalidatePath("/bookshelf");
  revalidatePath("/bookshelf/manage");
  revalidatePath("/api/public/bookshelf");
}

export async function createBook(values: TBookSchema) {
  await requireAdminSession();

  const validated = BookSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    const order = await bookRepository.getNextOrder();
    await bookRepository.create({ ...validated.data, order });
    revalidateBookshelf();
  } catch (error) {
    console.log({ error });
    return { error: "Could not create book" };
  }
}

export async function updateBook(id: string, values: TBookSchema) {
  await requireAdminSession();

  const validated = BookSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    await bookRepository.updateById(id, validated.data);
    revalidateBookshelf();
  } catch (error) {
    console.log({ error });
    return { error: "Could not update book" };
  }
}

export async function deleteBook(id: string) {
  await requireAdminSession();

  try {
    await bookRepository.deleteById(id);
    revalidateBookshelf();
  } catch (error) {
    console.log({ error });
    return { error: "Could not delete book" };
  }
}

export async function reorderBooks(ids: string[]) {
  await requireAdminSession();

  if (!ids.length) return { error: "Nothing to reorder." };

  try {
    await bookRepository.reorder(ids);
    revalidateBookshelf();
  } catch (error) {
    console.log({ error });
    return { error: "Could not reorder books" };
  }
}
