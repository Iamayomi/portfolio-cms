import type { ContactPageContent } from "@/lib/types/contact";

import { createRepository } from "./base.repository";

const repository = createRepository<ContactPageContent>("contactPageContent");

const defaultContactPage: Omit<
  ContactPageContent,
  "_id" | "createdAt" | "updatedAt"
> = {
  key: "contact",
  hero: {
    eyebrow: "Open desk",
    title: "Tell me what you want to build.",
    description:
      "Send a clear note about the work, the timeline, and what kind of help you need. I read useful details faster than vague intros.",
  },
  cvUrl: "/somto-cv.pdf",
  recipientEmail: "talktosomto@gmail.com",
  helperNote:
    "A useful first message has the goal, the current state, the rough deadline, and where I can be most helpful.",
  socials: {
    email: "talktosomto@gmail.com",
    github: "0xsomto",
    x: "0xsomto",
    linkedin: "0xsomto",
    instagram: "",
    youtube: "",
    tiktok: "",
    medium: "",
    facebook: "",
    threads: "",
    whatsapp: "",
    telegram: "",
    website: "",
  },
};

export const contactPageRepository = {
  ...repository,

  async get() {
    const content = await repository.findOne({ key: "contact" });
    if (content) return content;
    return repository.create(defaultContactPage);
  },

  async update(data: Omit<ContactPageContent, "_id" | "createdAt" | "updatedAt">) {
    const existing = await this.get();
    return repository.updateOne({ _id: existing._id }, data);
  },
};
