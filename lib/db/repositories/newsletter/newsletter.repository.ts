import type { NewsletterSubscriber } from "@/lib/types/notes";
import { createRepository } from "../base.repository";

const repository = createRepository<NewsletterSubscriber>(
  "newsletterSubscribers"
);

export const newsletterRepository = {
  ...repository,

  async subscribe(data: {
    email: string;
    visitorId?: string;
    source?: string;
    page?: string;
    success?: boolean;
  }) {
    const email = data.email.trim().toLowerCase();
    const existing = await repository.findOne({ email });

    if (existing) {
      await repository.collection().updateOne(
        { email },
        {
          $set: {
            visitorId: data.visitorId || existing.visitorId,
            source: data.source || existing.source,
            page: data.page || existing.page,
            updatedAt: new Date(),
            confirmedSubscription: true,
          },
        }
      );

      return repository.findOne({ email });
    }

    return repository.create({
      email,
      visitorId: data.visitorId,
      source: data.source,
      page: data.page,
      confirmedSubscription: true,
    });
  },

  async unSubscribe(email: string) {
    const result = await repository.collection().deleteOne({ email });

    return result;
  },
};
