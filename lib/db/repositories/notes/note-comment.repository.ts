import { ObjectId } from "mongodb";

import type { NoteCommentContent } from "@/lib/types/notes";
import { createRepository } from "../base.repository";

const repository = createRepository<NoteCommentContent>("noteComments");

export const noteCommentRepository = {
  ...repository,

  findByNoteSlug(noteSlug: string) {
    return repository
      .collection()
      .find({ noteSlug })
      .sort({ createdAt: -1 })
      .toArray();
  },

  async toggleLike(id: string, visitorId: string) {
    const comment = await repository.findOne({ _id: new ObjectId(id) });
    if (!comment) return null;

    const hasLiked = (comment.likedBy || []).includes(visitorId);
    await repository.collection().updateOne(
      { _id: new ObjectId(id) },
      hasLiked
        ? {
            $pull: { likedBy: visitorId },
            $set: { likes: Math.max((comment.likes || 0) - 1, 0), updatedAt: new Date() },
          }
        : {
            $addToSet: { likedBy: visitorId },
            $inc: { likes: 1 },
            $set: { updatedAt: new Date() },
          }
    );

    const updated = await repository.findOne({ _id: new ObjectId(id) });
    return updated ? { comment: updated, liked: !hasLiked } : null;
  },

  deleteByNoteSlug(noteSlug: string) {
    return repository.collection().deleteMany({ noteSlug });
  },

  async deleteThread(id: string) {
    const comments = await repository.collection().find({}).toArray();
    const ids = new Set([id]);
    let changed = true;

    while (changed) {
      changed = false;
      comments.forEach((comment) => {
        const commentId = comment._id?.toString();
        if (comment.parentId && ids.has(comment.parentId) && !ids.has(commentId)) {
          ids.add(commentId);
          changed = true;
        }
      });
    }

    return repository.collection().deleteMany({
      _id: { $in: Array.from(ids).map((item) => new ObjectId(item)) },
    });
  },
};
