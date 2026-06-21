import { ObjectId } from "mongodb";

import type { BookContent } from "@/lib/types/bookshelf";

import { createRepository } from "./base.repository";

const repository = createRepository<BookContent>("bookContent");

export const bookRepository = {
  ...repository,

  findById(id: string) {
    return repository.findOne({ _id: new ObjectId(id) });
  },

  findOrdered() {
    return repository.collection().find({}).sort({ order: 1 }).toArray();
  },

  findPublished() {
    return repository
      .collection()
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();
  },

  async getNextOrder() {
    const last = await repository
      .collection()
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .next();

    return (last?.order ?? 0) + 1;
  },

  updateById(
    id: string,
    data: Partial<Omit<BookContent, "_id" | "createdAt" | "updatedAt">>
  ) {
    return repository.updateOne({ _id: new ObjectId(id) }, data);
  },

  deleteById(id: string) {
    return repository.deleteOne({ _id: new ObjectId(id) });
  },

  async reorder(ids: string[]) {
    await Promise.all(
      ids.map((id, index) =>
        repository.collection().updateOne(
          { _id: new ObjectId(id) },
          { $set: { order: index + 1, updatedAt: new Date() } }
        )
      )
    );
  },
};
