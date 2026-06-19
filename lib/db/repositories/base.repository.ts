import type {
  Collection,
  Filter,
  OptionalUnlessRequiredId,
  WithId,
} from "mongodb";

import { db } from "@/lib/db/config";

type WithTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export function createRepository<T extends WithTimestamps>(
  collectionName: string
) {
  const collection = (): Collection<T> => db.collection<T>(collectionName);

  return {
    collection,

    findMany(filter: Filter<T> = {}) {
      return collection().find(filter).sort({ updatedAt: -1 }).toArray();
    },

    findOne(filter: Filter<T>) {
      return collection().findOne(filter);
    },

    async create(data: Omit<T, "createdAt" | "updatedAt">) {
      const now = new Date();
      const payload = {
        ...data,
        createdAt: now,
        updatedAt: now,
      } as OptionalUnlessRequiredId<T>;

      const result = await collection().insertOne(payload);
      return { ...payload, _id: result.insertedId } as WithId<T>;
    },

    async updateOne(
      filter: Filter<T>,
      data: Partial<Omit<T, "createdAt" | "updatedAt">>
    ) {
      await collection().updateOne(filter, {
        $set: { ...data, updatedAt: new Date() } as Partial<T>,
      });

      return collection().findOne(filter);
    },

    deleteOne(filter: Filter<T>) {
      return collection().deleteOne(filter);
    },
  };
}
