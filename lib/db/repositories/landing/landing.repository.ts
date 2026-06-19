import { defaultLandingContent } from "./defaults";
import type { LandingContent } from "@/lib/types/landing";

import { createRepository } from "../base.repository";

const repository = createRepository<LandingContent>("landingContent");

export const landingRepository = {
  ...repository,

  async get() {
    const content = await repository.findOne({ key: "landing" });
    if (content) return content;
    return repository.create(defaultLandingContent);
  },

  async update(
    data: Partial<Omit<LandingContent, "_id" | "createdAt" | "updatedAt">>
  ) {
    const existing = await this.get();
    return repository.updateOne({ _id: existing._id }, data);
  },
};
