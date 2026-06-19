import type { ObjectId } from "mongodb";

export interface CmsDocumentBase {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
