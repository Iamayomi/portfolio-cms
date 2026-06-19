import { createRepository } from "../base.repository";
import type { NoteContent, PublicNoteField } from "@/lib/types/notes";
import { ObjectId, type Filter } from "mongodb";

const repository = createRepository<NoteContent>("noteContent");

function buildProjection(fields?: string[]) {
  if (!fields?.length) return undefined;

  const allowedList = [
    "title",
    "slug",
    "excerpt",
    "tags",
    "readTime",
    "views",
    "bannerImage",
    "publishedAt",
    "updatedAt",
  ] as const;

  const validFields = fields.filter((field) =>
    allowedList.includes(field as (typeof allowedList)[number])
  );

  if (!validFields.length) return undefined;

  return validFields.reduce<Record<string, 1>>((projection, field) => {
    projection[field] = 1;
    return projection;
  }, {});
}

export const noteRepository = {
  ...repository,

  findById(id: string) {
    return repository.findOne({ _id: new ObjectId(id) });
  },

  findBySlug(slug: string) {
    return repository.findOne({ slug });
  },

  findPublished() {
    return repository.findMany({ published: true });
  },

  async findPublishedPaginated({
    page = 1,
    limit,
    query,
    fields = [],
  }: {
    page?: number;
    limit: number;
    query?: string;
    fields?: PublicNoteField[];
  }) {
    const filter: Filter<NoteContent> = { published: true };

    if (query) {
      const search = new RegExp(
        query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [{ title: search }, { tags: search }];
    }

    const skip = Math.max(page - 1, 0) * limit;
    const projection = buildProjection(fields);

    const [items, total] = await Promise.all([
      repository
        .collection()
        .find(filter, projection ? { projection } : {})
        .sort({ publishedAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      repository.collection().countDocuments(filter),
    ]);

    return { items, total };
  },

  findRelated(note: NoteContent, limit: number) {
    if (!note.tags?.length) return Promise.resolve([]);

    return repository
      .collection()
      .find({
        published: true,
        slug: { $ne: note.slug },
        tags: { $in: note.tags },
      })
      .sort({ publishedAt: -1, updatedAt: -1 })
      .limit(limit)
      .toArray();
  },

  findFeatured(limit: number) {
    return repository
      .collection()
      .find({ published: true, featured: true })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray();
  },

  async recordRead(slug: string, visitorId: string) {
    const note = await repository.findOne({ slug, published: true });
    if (!note) return null;

    const hasRead = (note.readBy || []).includes(visitorId);
    if (hasRead) {
      return { note, counted: false };
    }

    await repository.collection().updateOne(
      { _id: note._id },
      {
        $addToSet: { readBy: visitorId },
        $inc: { views: 1 },
      }
    );

    const updated = await repository.findOne({ _id: note._id });
    return updated ? { note: updated, counted: true } : null;
  },

  findFiltered(filter: Filter<NoteContent> = {}) {
    return repository.findMany(filter);
  },

  updateById(
    id: string,
    data: Partial<Omit<NoteContent, "_id" | "createdAt">>
  ) {
    return repository.updateOne({ _id: new ObjectId(id) }, data);
  },

  deleteById(id: string) {
    return repository.deleteOne({ _id: new ObjectId(id) });
  },

  deleteBySlug(slug: string) {
    return repository.deleteOne({ slug });
  },

  deleteManyBySlugs(slugs: string[]) {
    return repository.collection().deleteMany({ slug: { $in: slugs } });
  },
};
