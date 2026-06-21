import { ObjectId } from "mongodb";

import type { GuestbookEntryContent } from "@/lib/types/guestbook";

import { createRepository } from "./base.repository";

const entryRepository = createRepository<GuestbookEntryContent>("guestbookEntries");

export const guestbookRepository = {
  ...entryRepository,

  findById(id: string) {
    return entryRepository.findOne({ _id: new ObjectId(id) });
  },

  findOrdered() {
    return entryRepository.collection().find({}).sort({ order: 1 }).toArray();
  },

  findApproved() {
    return entryRepository
      .collection()
      .find({ approved: true })
      .sort({ order: 1 })
      .toArray();
  },

  findPending() {
    return entryRepository
      .collection()
      .find({ approved: false })
      .sort({ createdAt: -1 })
      .toArray();
  },

  async getNextOrder() {
    const last = await entryRepository
      .collection()
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .next();

    return (last?.order ?? 0) + 1;
  },

  updateById(
    id: string,
    data: Partial<Omit<GuestbookEntryContent, "_id" | "createdAt" | "updatedAt">>
  ) {
    return entryRepository.updateOne({ _id: new ObjectId(id) }, data);
  },

  approveById(id: string) {
    return entryRepository.updateOne(
      { _id: new ObjectId(id) },
      { approved: true }
    );
  },

  rejectById(id: string) {
    return entryRepository.updateOne(
      { _id: new ObjectId(id) },
      { approved: false }
    );
  },

  deleteById(id: string) {
    return entryRepository.deleteOne({ _id: new ObjectId(id) });
  },

  async reorder(ids: string[]) {
    await Promise.all(
      ids.map((id, index) =>
        entryRepository.collection().updateOne(
          { _id: new ObjectId(id) },
          { $set: { order: index + 1, updatedAt: new Date() } }
        )
      )
    );
  },
};
