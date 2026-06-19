import type { TExperienceItemSchema } from "@/lib/schemas/experience.schema";

export type ExperienceListItem = TExperienceItemSchema & {
  id: string;
  order: number;
};

export const emptyExperienceForm: TExperienceItemSchema = {
  period: "",
  role: "",
  websiteUrl: "",
  summary: "",
  signals: [],
  published: false,
};
