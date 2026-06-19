import type { Collection } from "mongodb";

import { db } from "@/lib/db/config";
import type { CmsUser } from "@/lib/types/user";

const collection = (): Collection<CmsUser> => db.collection<CmsUser>("user");

export async function getUserById(id: string) {
  return collection().findOne({ id });
}

export async function getUserByEmail(email: string) {
  return collection().findOne({ email: email.toLowerCase() });
}

export async function listUsers() {
  return collection().find({}).sort({ createdAt: -1 }).toArray();
}
