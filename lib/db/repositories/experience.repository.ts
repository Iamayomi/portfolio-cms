import { ObjectId } from "mongodb";

import type {
  ExperienceItemContent,
  ExperiencePageContent,
} from "@/lib/types/experience";

import { createRepository } from "./base.repository";

const pageRepository = createRepository<ExperiencePageContent>(
  "experiencePageContent"
);
const itemRepository = createRepository<ExperienceItemContent>(
  "experienceItemContent"
);

const defaultExperiencePage: Omit<
  ExperiencePageContent,
  "_id" | "createdAt" | "updatedAt"
> = {
  key: "experience",
  hero: {
    eyebrow: "Professional timeline",
    title: "Experience that explains the transition.",
    description:
      "The fullstack track is not background noise. It is the operating base for learning protocol security with practical engineering judgment.",
    operatingNote:
      "I am treating smart contract security as practice first, proof later.",
  },
};

export const experiencePageRepository = {
  ...pageRepository,

  async get() {
    const content = await pageRepository.findOne({ key: "experience" });
    if (content) return content;
    return pageRepository.create(defaultExperiencePage);
  },

  async updateHero(data: ExperiencePageContent["hero"]) {
    const existing = await this.get();
    return pageRepository.updateOne({ _id: existing._id }, { hero: data });
  },
};

export const experienceRepository = {
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
    data: Partial<Omit<ExperienceItemContent, "_id" | "createdAt" | "updatedAt">>
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
