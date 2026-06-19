import type { NotesPageContent } from "@/lib/types/notes";

import { createRepository } from "../base.repository";

const repository = createRepository<NotesPageContent>("notesPageContent");

const defaultNotesPageContent: Omit<
  NotesPageContent,
  "_id" | "createdAt" | "updatedAt"
> = {
  key: "notes",
  hero: {
    eyebrow: "Research notes",
    title: "A quiet archive for technical writing.",
    description:
      "Short, practical notes on fullstack engineering, smart contract development, and the path toward security review.",
  },
};

export const notesPageRepository = {
  ...repository,

  async get() {
    const content = await repository.findOne({ key: "notes" });
    if (content) return content;
    return repository.create(defaultNotesPageContent);
  },

  async updateHero(data: NotesPageContent["hero"]) {
    const existing = await this.get();
    return repository.updateOne({ _id: existing._id }, { hero: data });
  },
};
