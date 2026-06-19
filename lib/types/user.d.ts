import type { ObjectId } from "mongodb";

export type CmsUserRole = "admin";

export interface CmsUser {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: CmsUserRole;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
