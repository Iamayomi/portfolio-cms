"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession, requireEnvAdminSession } from "@/lib/auth/guards";
import {
  noteCommentRepository,
  noteRepository,
} from "@/lib/db/repositories/notes";
import { notesPageRepository } from "@/lib/db/repositories/notes/notes-page.repository";
import {
  NoteSchema,
  NotesHeroSchema,
  type TNoteSchema,
  type TNotesHeroSchema,
} from "@/lib/schemas/note.schema";
import {
  extractErrorMessage,
  generateSlug,
  getReadTime,
  parseValidationError,
} from "@/lib/utils";

function revalidateNotes() {
  revalidatePath("/notes");
  revalidatePath("/notes/hero");
  revalidatePath("/notes/manage");
  revalidatePath("/api/public/landing");
  revalidatePath("/api/public/notes");
}

export async function updateNotesHero(values: TNotesHeroSchema) {
  await requireAdminSession();

  const validated = NotesHeroSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    await notesPageRepository.updateHero(validated.data);
    revalidateNotes();
  } catch (error) {
    const message =
      extractErrorMessage(error) || "Something went wrong, try again.";
    return { error: "Could not update notes hero" };
  }
}

export async function createNote(values: TNoteSchema) {
  const session = await requireAdminSession();

  const validated = NoteSchema.safeParse(values);

  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  const data = validated.data;
  const slug = generateSlug(data.title);
  const existing = await noteRepository.findBySlug(slug);

  if (existing)
    return { error: "Choose a different and unique title for your note." };

  try {
    const note = await noteRepository.create({
      ...data,
      slug,
      readTime: getReadTime(data.content.replace(/<[^>]*>/g, " ")),
      views: 0,
      readBy: [],
      publishedAt: data.published ? new Date() : null,
      author: {
        name: session.user.name || session.user.email || "Somto",
        image: session.user.image || null,
      },
    });

    revalidateNotes();
    return { data: { id: note._id?.toString(), slug: note.slug } };
  } catch (error) {
    const message =
      extractErrorMessage(error) || "Something went wrong, try again.";
    return { error: message };
  }
}

export async function updateNote(id: string, values: TNoteSchema) {
  await requireAdminSession();

  const validated = NoteSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  const data = validated.data;
  const slug = generateSlug(data.title);
  const existing = await noteRepository.findBySlug(slug);

  if (existing && existing._id?.toString() !== id) {
    return { error: "Choose a different and unique title for your note." };
  }

  try {
    const current = await noteRepository.findById(id);

    await noteRepository.updateById(id, {
      ...data,
      slug,
      readTime: getReadTime(data.content.replace(/<[^>]*>/g, " ")),
      publishedAt: data.published
        ? current?.publishedAt ?? new Date()
        : current?.publishedAt ?? null,
      author: current?.author,
      updatedAt: new Date(Date.now()),
    });

    revalidateNotes();
    revalidatePath(`/notes/manage/${slug}`);
    revalidatePath(`/notes/manage/${slug}/edit`);
    return { data: { id, slug } };
  } catch (error) {
    const message =
      extractErrorMessage(error) || "Something went wrong, try again.";
    return { error: message };
  }
}

export async function deleteNote(slug: string) {
  await requireAdminSession();

  try {
    await noteRepository.deleteBySlug(slug);
    await noteCommentRepository.deleteByNoteSlug(slug);
    revalidateNotes();
  } catch (error) {
    const message =
      extractErrorMessage(error) || "Something went wrong, try again.";
    return { error: message };
  }
}

export async function deleteNotes(slugs: string[]) {
  await requireAdminSession();

  if (!slugs.length) return { error: "Select at least one note." };

  try {
    await noteRepository.deleteManyBySlugs(slugs);
    await Promise.all(
      slugs.map((slug) => noteCommentRepository.deleteByNoteSlug(slug))
    );
    revalidateNotes();
  } catch (error) {
    const message =
      extractErrorMessage(error) || "Something went wrong, try again.";
    return { error: message };
  }
}

export async function deleteNoteComment(id: string, noteSlug: string) {
  await requireEnvAdminSession();

  try {
    await noteCommentRepository.deleteThread(id);
    revalidatePath(`/notes/manage/${noteSlug}`);
    revalidatePath(`/api/public/notes/${noteSlug}`);
  } catch (error) {
    const message =
      extractErrorMessage(error) || "Something went wrong, try again.";
    return { error: message };
  }
}
