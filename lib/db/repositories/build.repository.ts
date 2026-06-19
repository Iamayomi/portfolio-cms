import { ObjectId } from "mongodb";

import type { BuildItemContent, BuildsPageContent } from "@/lib/types/builds";

import { createRepository } from "./base.repository";

const pageRepository = createRepository<BuildsPageContent>("buildsPageContent");
const itemRepository = createRepository<BuildItemContent>("buildContent");

const defaultBuildsPage: Omit<
  BuildsPageContent,
  "_id" | "createdAt" | "updatedAt"
> = {
  key: "builds",
  hero: {
    eyebrow: "Project notes",
    title: "A few things I can point to.",
    description:
      "A small set of work notes. Some are shipped products; some are learning tracks that are clearly marked as in progress.",
  },
};

export const buildsPageRepository = {
  ...pageRepository,

  async get() {
    const content = await pageRepository.findOne({ key: "builds" });
    if (content) return content;
    return pageRepository.create(defaultBuildsPage);
  },

  async updateHero(data: BuildsPageContent["hero"]) {
    const existing = await this.get();
    return pageRepository.updateOne({ _id: existing._id }, { hero: data });
  },
};

export const buildRepository = {
  ...itemRepository,

  findById(id: string) {
    return itemRepository.findOne({ _id: new ObjectId(id) });
  },

  findOrdered() {
    return itemRepository.collection().find({}).sort({ order: 1 }).toArray();
  },

  findPublished() {
    return itemRepository
      .collection()
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();
  },

  findFeatured(limit: number) {
    return itemRepository
      .collection()
      .find({ published: true, featured: true })
      .sort({ order: 1 })
      .limit(limit)
      .toArray();
  },

  async getNextOrder() {
    const last = await itemRepository
      .collection()
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .next();

    return (last?.order ?? 0) + 1;
  },

  updateById(
    id: string,
    data: Partial<Omit<BuildItemContent, "_id" | "createdAt" | "updatedAt">>
  ) {
    return itemRepository.updateOne({ _id: new ObjectId(id) }, data);
  },

  deleteById(id: string) {
    return itemRepository.deleteOne({ _id: new ObjectId(id) });
  },

  async reorder(ids: string[]) {
    await Promise.all(
      ids.map((id, index) =>
        itemRepository.collection().updateOne(
          { _id: new ObjectId(id) },
          { $set: { order: index + 1, updatedAt: new Date() } }
        )
      )
    );
  },
};
